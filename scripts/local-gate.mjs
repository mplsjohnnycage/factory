#!/usr/bin/env node
/**
 * PBI-013 / PBI-014 — ASDLC local gate: ONE command refuses dirty/invalid.
 *
 * Steps (deterministic):
 *   1. Spec + ADR inventory (Blueprint/Contract anatomy)
 *   2. LogicSRC M1 emits presence + no scaffold placeholders
 *   3. Well-known OpenMCP/OpenAccess shape (scripts/validate-well-known.mjs)
 *   4. @logicsrc/validators on fixtures + agents that match logicsrc.agent
 *   5. OpenPRD collection under prd/ via @logicsrc/openprd (PBI-014: 0001–0005 Accepted)
 *   6. Typecheck + test for kernel apps (and developer-os when present)
 *   7. Lint / placeholder refuse
 *
 * Exit 0 = clean. Non-zero = refuse.
 * Meta lane only — never Product Beads.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const DOMAINS = [
  "factory-kernel",
  "port-governance",
  "rivet-execution",
  "sandbox-harness",
  "developer-os",
  "auth-port-oauth",
  "logicsrc-interop",
  "visibility-accept",
  "security-blast-radius",
  "asdlc-lifecycle",
];

const ADRS = [
  "ADR-001-port-system-of-record.md",
  "ADR-002-rivet-execution-kernel.md",
  "ADR-003-port-to-rivet-path.md",
  "ADR-004-asdlc-spec-canonical.md",
  "ADR-005-factory-oauth-deferred.md",
  "ADR-006-sandbox-agent-harness.md",
  "ADR-007-developer-os-superseded-by-011.md",
  "ADR-008-visibility-accept-ci-sha.md",
  "ADR-009-iso-12207-lifecycle-map.md",
  "ADR-010-chatgpt-plugins-mcp-apps.md",
  "ADR-011-developer-os-next-rivet-native.md",
];

const APPS = [
  "factory-gateway",
  "project-supervisor",
  "sandbox-harness",
  "developer-os",
];

const PLACEHOLDER_MARKERS = ["0.0.0-scaffold", "TODO-SCAFFOLD-PLACEHOLDER"];

let failures = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failures += 1;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

function section(title) {
  console.log(`\n== ${title} ==`);
}

function read(rel) {
  return readFileSync(join(ROOT, rel), "utf8");
}

function mustExist(rel) {
  if (!existsSync(join(ROOT, rel))) {
    fail(`missing ${rel}`);
    return false;
  }
  ok(`present ${rel}`);
  return true;
}

function refusePlaceholders(rel, text) {
  for (const marker of PLACEHOLDER_MARKERS) {
    if (text.includes(marker)) {
      fail(`${rel} contains dirty placeholder marker: ${marker}`);
      return false;
    }
  }
  return true;
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd: opts.cwd ?? ROOT,
    encoding: "utf8",
    env: { ...process.env, ...opts.env },
    stdio: opts.stdio ?? "pipe",
  });
  return result;
}

function ensureNpmCi(dir) {
  const lock = join(dir, "package-lock.json");
  const nm = join(dir, "node_modules");
  if (!existsSync(lock)) {
    fail(`missing package-lock.json under ${dir}`);
    return false;
  }
  if (!existsSync(nm)) {
    const r = run("npm", ["ci"], { cwd: dir, stdio: "inherit" });
    if (r.status !== 0) {
      fail(`npm ci failed in ${dir}`);
      return false;
    }
  }
  return true;
}

/** @returns {Promise<typeof import("@logicsrc/validators")>} */
async function loadValidators() {
  try {
    return await import("@logicsrc/validators");
  } catch {
    if (!ensureNpmCi(ROOT)) throw new Error("root npm ci required for @logicsrc/validators");
    return await import("@logicsrc/validators");
  }
}

function checkSpecInventory() {
  section("Spec inventory (Blueprint + Contract)");
  for (const domain of DOMAINS) {
    const rel = `specs/${domain}/spec.md`;
    if (!mustExist(rel)) continue;
    const body = read(rel);
    refusePlaceholders(rel, body);
    for (const heading of [
      "## Blueprint",
      "### Context",
      "### Architecture",
      "### Constraints",
      "## Contract",
      "### Definition of Done",
      "### Regression Guardrails",
      "### Scenarios",
    ]) {
      if (!body.includes(heading)) {
        fail(`${rel} missing required heading: ${heading}`);
      }
    }
    if (!body.includes("```gherkin") && !body.includes("Scenario:")) {
      fail(`${rel} missing Gherkin scenario`);
    } else {
      ok(`${rel} Contract anatomy`);
    }
  }
}

function checkAdrInventory() {
  section("ADR inventory");
  for (const name of ADRS) {
    const rel = `docs/adrs/${name}`;
    if (!mustExist(rel)) continue;
    const body = read(rel);
    refusePlaceholders(rel, body);
    if (!/^#\s+/m.test(body)) fail(`${rel} missing Title heading`);
    if (!/\*\*Status:\*\*/.test(body)) fail(`${rel} missing Status field`);
    for (const part of ["## Context", "## Decision", "## Consequences", "## Alternatives"]) {
      if (!body.includes(part)) fail(`${rel} missing ${part}`);
    }
    ok(`${rel} anatomy skim`);
  }
}

function checkEmits() {
  section("LogicSRC M1 emits + AGENTS index");
  for (const rel of [
    "AGENTS.md",
    "OpenStack.md",
    ".well-known/openstack.md",
    "OpenProfile.md",
    ".well-known/openprofile.md",
    ".well-known/openmcp.json",
    ".well-known/openaccess.json",
  ]) {
    if (!mustExist(rel)) continue;
    refusePlaceholders(rel, read(rel));
  }
}

function checkWellKnown() {
  section("Well-known validators (OpenMCP + OpenAccess)");
  const r = run(process.execPath, [join(ROOT, "scripts/validate-well-known.mjs")], {
    stdio: "inherit",
  });
  if (r.status !== 0) fail("scripts/validate-well-known.mjs refused");
  else ok("well-known shape OK");
}

/**
 * @param {typeof import("@logicsrc/validators")} validators
 */
function checkLogicsrcValidators(validators) {
  section("@logicsrc/validators");
  const { validate, parseDocument } = validators;

  const validDir = join(ROOT, "fixtures/logicsrc/valid");
  const files = existsSync(validDir)
    ? readdirSync(validDir).filter((f) => /\.(ya?ml|json)$/i.test(f))
    : [];
  if (files.length < 1) {
    fail("fixtures/logicsrc/valid must contain ≥1 LogicSRC document");
  }
  for (const file of files) {
    const abs = join(validDir, file);
    const kind = inferKind(file, readFileSync(abs, "utf8"));
    const data = parseDocument(readFileSync(abs, "utf8"), abs);
    const result = validate(kind, data);
    if (!result.ok) {
      fail(`valid fixture refused unexpectedly: ${file} (${kind})`);
      for (const err of result.errors ?? []) {
        console.error(`  - ${err.instancePath || "/"} ${err.message}`);
      }
    } else {
      ok(`validated fixtures/logicsrc/valid/${file} as ${kind}`);
    }
  }

  // agents/*.json that declare logicsrc.agent type
  const agentsDir = join(ROOT, "agents");
  if (existsSync(agentsDir)) {
    for (const file of readdirSync(agentsDir).filter((f) => f.endsWith(".json"))) {
      const abs = join(agentsDir, file);
      const raw = readFileSync(abs, "utf8");
      let json;
      try {
        json = JSON.parse(raw);
      } catch (err) {
        fail(`agents/${file} invalid JSON: ${err.message}`);
        continue;
      }
      if (json?.type === "logicsrc.agent") {
        const result = validate("agent", json);
        if (!result.ok) {
          fail(`agents/${file} failed logicsrc.agent validation`);
        } else {
          ok(`agents/${file} logicsrc.agent OK`);
        }
      } else {
        ok(`agents/${file} OpenAgent/stub (not logicsrc.agent) — presence only`);
      }
    }
  }
}

function inferKind(fileName, raw) {
  if (/openprd/i.test(fileName) || /openprd\s*:/i.test(raw)) return "openprd-prd";
  if (/agent/i.test(fileName) || /type:\s*logicsrc\.agent/.test(raw)) return "agent";
  if (/openworkflow/i.test(fileName)) return "openworkflow";
  if (/task/i.test(fileName)) return "task";
  return "agent";
}

const REQUIRED_OPENPRD_IDS = ["0001", "0002", "0003", "0004", "0005"];

/**
 * PBI-014 — OpenPRD 0001–0005 Accepted; full 0.3 conformance via @logicsrc/openprd.
 * Front-matter-only AJV is insufficient (ten sections + collection numbering).
 */
async function checkOpenPrd() {
  section("OpenPRD collection (PBI-014)");
  const prdRoot = join(ROOT, "prd");
  if (!existsSync(prdRoot)) {
    fail("prd/ missing — PBI-014 requires OpenPRD 0001–0005 Accepted");
    return;
  }

  let openprd;
  try {
    openprd = await import("@logicsrc/openprd");
  } catch (err) {
    fail(`@logicsrc/openprd unavailable: ${err.message}`);
    return;
  }

  const { loadPrdCollection, validatePrdCollection, renderIndex } = openprd;
  let collection;
  try {
    collection = loadPrdCollection(prdRoot);
  } catch (err) {
    fail(`OpenPRD load failed: ${err.message}`);
    return;
  }

  for (const bad of collection.unparsed ?? []) {
    fail(`OpenPRD unparsed ${bad.file}: ${bad.reason}`);
  }

  if (!collection.template) {
    fail("prd/0000-template.md missing");
  } else {
    ok("prd/0000-template.md present");
  }

  const byId = new Map(
    collection.documents.map((doc) => [doc.frontMatter.id, doc]),
  );
  for (const id of REQUIRED_OPENPRD_IDS) {
    const doc = byId.get(id);
    if (!doc) {
      fail(`OpenPRD ${id} missing under prd/`);
      continue;
    }
    if (doc.frontMatter.status !== "Accepted") {
      fail(
        `OpenPRD ${id} status is ${doc.frontMatter.status} (expected Accepted)`,
      );
    } else {
      ok(`OpenPRD ${id} Accepted (${doc.file})`);
    }
  }

  const expectedIndex = renderIndex(collection, {
    title: "Factory Meta OpenPRDs",
  }).replace(
    "Numbered [OpenPRD](../docs/openprd.md) product requirements documents for this repo.",
    "Numbered [OpenPRD](https://logicsrc.com/docs/openprd) product requirements documents for Factory Meta (PBI-014). Meta lane only — not Product Beads.",
  );
  const report = validatePrdCollection(collection, {
    strict: true,
    expectedVersion: "0.3",
    expectedIndex,
  });
  if (!report.ok) {
    fail("OpenPRD collection validation refused");
    for (const finding of report.findings ?? []) {
      if (finding.severity === "error" || finding.severity === "warning") {
        console.error(
          `  - ${finding.code} ${finding.file ?? ""}:${finding.line ?? "?"} ${finding.message}`,
        );
      }
    }
  } else {
    ok(
      `OpenPRD collection OK (${report.checked.documents} docs, ${report.checked.sections} sections)`,
    );
  }
}

function walkFiles(dir, pred) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) out.push(...walkFiles(abs, pred));
    else if (pred(abs)) out.push(abs);
  }
  return out;
}

function checkApps() {
  section("Typecheck + test (kernel apps)");
  const skipApps = new Set(
    (process.env.LOCAL_GATE_SKIP_APPS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  for (const app of APPS) {
    if (skipApps.has(app)) {
      ok(`skip app ${app} (LOCAL_GATE_SKIP_APPS)`);
      continue;
    }
    const dir = join(ROOT, "apps", app);
    if (!existsSync(join(dir, "package.json"))) {
      fail(`apps/${app}/package.json missing`);
      continue;
    }
    if (!ensureNpmCi(dir)) continue;

    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
    if (pkg.scripts?.typecheck) {
      const r = run("npm", ["run", "typecheck"], { cwd: dir, stdio: "inherit" });
      if (r.status !== 0) fail(`apps/${app} typecheck refused`);
      else ok(`apps/${app} typecheck`);
    }
    if (pkg.scripts?.test) {
      const r = run("npm", ["test"], { cwd: dir, stdio: "inherit" });
      if (r.status !== 0) fail(`apps/${app} tests refused`);
      else ok(`apps/${app} tests`);
    }
    if (pkg.scripts?.lint && process.env.LOCAL_GATE_LINT === "1") {
      const r = run("npm", ["run", "lint"], { cwd: dir, stdio: "inherit" });
      if (r.status !== 0) fail(`apps/${app} lint refused`);
      else ok(`apps/${app} lint`);
    }
  }
}

function checkLintPlaceholders() {
  section("Lint / dirty-tree refuse");
  const roots = ["specs", "docs/adrs", ".well-known", "OpenStack.md", "OpenProfile.md", "AGENTS.md"];
  for (const rel of roots) {
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) continue;
    const st = statSync(abs);
    if (st.isFile()) {
      refusePlaceholders(rel, read(rel));
      continue;
    }
    walkFiles(abs, (p) => /\.(md|json|ya?ml)$/i.test(p)).forEach((p) => {
      refusePlaceholders(p.slice(ROOT.length + 1), readFileSync(p, "utf8"));
    });
  }
  ok("no scaffold placeholders in gated trees");
}

/**
 * Prove invalid LogicSRC is refused (ratchet). Invoked as part of the gate.
 * @param {typeof import("@logicsrc/validators")} validators
 */
function checkRefuseInvalid(validators) {
  section("Refuse invalid (ratchet)");
  const invalidPath = join(ROOT, "fixtures/logicsrc/invalid/broken-agent.yaml");
  if (!existsSync(invalidPath)) {
    fail("fixtures/logicsrc/invalid/broken-agent.yaml missing");
    return;
  }
  const { validate, parseDocument } = validators;
  const data = parseDocument(readFileSync(invalidPath, "utf8"), invalidPath);
  const result = validate("agent", data);
  if (result.ok) {
    fail("invalid fixture unexpectedly validated — refuse ratchet broken");
  } else {
    ok("invalid fixture refused by @logicsrc/validators");
  }
}

async function main() {
  console.log("Factory Meta local gate (PBI-013 + PBI-014 OpenPRD)");
  console.log(`root=${ROOT}`);

  checkSpecInventory();
  checkAdrInventory();
  checkEmits();
  checkWellKnown();

  const validators = await loadValidators();
  checkLogicsrcValidators(validators);
  checkRefuseInvalid(validators);
  await checkOpenPrd();
  checkLintPlaceholders();
  checkApps();

  console.log("");
  if (failures > 0) {
    console.error(`local-gate REFUSED (${failures} failure(s))`);
    process.exit(1);
  }
  console.log("local-gate OK — tree is not dirty/invalid");
}

// Allow importing helpers from refuse tests without running main.
const isDirect =
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url;

if (isDirect) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export {
  ROOT,
  DOMAINS,
  PLACEHOLDER_MARKERS,
  inferKind,
  refusePlaceholders,
};
