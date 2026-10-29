#!/usr/bin/env node
/**
 * Kit dry-run for CI + main branch-protection verify (offline docs/workflow).
 *
 * Default: verify branch-protection docs + meta-ci-presence workflow +
 * LICENSE + ADR-008 / visibility-accept / accept-on-sha markers
 * (no network mutate, no secrets, no Port upserts, no GitHub protection PUT).
 *
 * Optional: --live → read-only gh probe of main.protected (never PUT).
 *
 * Does NOT cover Funnel remount (#90), assemble-first (#92), queue mirror (#88),
 * local-gate refuse tests, Atlas BFF, Rivet/sandbox/Beads, or admit HMAC kits.
 *
 * Usage:
 *   node scripts/ci-protection-verify-dry-run.mjs
 *   npm run dry-run:ci-protection-verify
 *   npm run dry-run:ci-protection-verify -- --live
 *
 * Exit 0 = kit OK (+ live protected soft-PASS or expected 403 when --live).
 * Exit 1 = missing/broken kit or --live hard failure (gh missing / unprotected).
 * Exit 2 = bad args.
 *
 * @see docs/ops/ci-protection-verify.md
 * @see docs/ci/branch-protection.md
 * @see docs/adrs/ADR-008-visibility-accept-ci-sha.md
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = "mplsjohnnycage/factory";

const REQUIRED = [
  {
    path: "docs/ops/ci-protection-verify.md",
    markers: [
      "dry-run:ci-protection-verify",
      "meta-ci-presence",
      "branch-protection",
      "Do **not** require Vercel",
      "FE-142",
      "FE-172",
      "Do not ask",
      "Port schema",
      "REFUSED",
      "upsert_blueprint",
      "Never** run `gh api -X PUT",
      "required_approving_review_count",
      "LICENSE",
      "ADR-008",
      "self-APPROVE",
    ],
  },
  {
    path: "docs/ci/branch-protection.md",
    markers: [
      "meta-ci-presence",
      "required_approving_review_count",
      "Do **not** require Vercel",
      "ADR-008",
      "enforce_admins",
      "classic branch protection",
    ],
  },
  {
    path: ".github/workflows/meta-ci.yml",
    markers: ["name: meta-ci", "name: meta-ci-presence", "meta-ci-presence:"],
  },
  {
    path: "LICENSE",
    markers: ["All rights reserved", "PROPRIETARY"],
  },
  {
    path: "docs/adrs/ADR-008-visibility-accept-ci-sha.md",
    markers: [
      "ADR-008",
      "exact commit SHA",
      "Accept",
      "GitHub CI green",
      "Port governance",
    ],
  },
  {
    path: "specs/visibility-accept/spec.md",
    markers: [
      "meta-ci-presence",
      "exact SHA",
      "Branch protection",
      "docs/ci/branch-protection.md",
    ],
  },
  {
    path: "docs/ci/port-accept-on-sha.md",
    markers: [
      "meta-ci-presence",
      "accept-on-sha.ts",
      "never accept",
      "branch-protection.md",
    ],
  },
  {
    path: "scripts/accept-on-sha.ts",
    markers: [
      "evaluateAcceptOnSha",
      "Does NOT Port-accept",
      "META_ALWAYS_REQUIRED_CHECKS",
    ],
  },
  {
    path: "scripts/ci-protection-verify-dry-run.mjs",
    markers: [
      "Kit dry-run for CI + main branch-protection verify",
      "Exit 0 = kit OK",
      "Port mutate: REFUSED",
      "GitHub protection mutate: REFUSED",
    ],
  },
];

/** Reject accidental committed secret assignments in the ops kit surface. */
const FORBIDDEN_SECRET_ASSIGNMENTS = [
  /(?:^|\n)\s*PORT_CLIENT_SECRET\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*FACTORY_GATEWAY_HANDLER_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*ANTHROPIC_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*LINEAR_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*GITHUB_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
];

/** Port mutate verbs this kit must never invoke — documented refuse surface. */
const REFUSED_PORT_MUTATE = [
  "upsert_blueprint",
  "upsert_workflow",
  "upsert_entity",
  "trigger_run",
  "create External Interface",
];

function parseArgs(argv) {
  let live = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/ci-protection-verify-dry-run.mjs
  npm run dry-run:ci-protection-verify
  npm run dry-run:ci-protection-verify -- --live

Default: kit markers only (no network mutate, no npm install).
--live: read-only gh probe of main.protected (never PUT protection).
Port schema upserts: always REFUSED.
GitHub protection writes: always REFUSED.
FE-142 / FE-172 CLOSED — do not re-ask Johnny.`);
      process.exit(0);
    }
    if (arg === "--live") {
      live = true;
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
  return { live };
}

let failed = false;
const { live } = parseArgs(process.argv.slice(2));

console.log("=== CI protection verify kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
for (const verb of REFUSED_PORT_MUTATE) {
  console.log(`  refuse: ${verb}`);
}
console.log("GitHub protection mutate: REFUSED");
console.log("  refuse: PUT .../branches/main/protection");
console.log("  refuse: POST .../rulesets");
console.log("  refuse: dip required_approving_review_count");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
console.log("FE-172 Sign-in re-ask: CLOSED");
console.log("Assemble-first (#92): OUT OF SCOPE");
console.log("Funnel remount (#90): OUT OF SCOPE");
console.log("local-gate refuse tests: OUT OF SCOPE (npm run test:local-gate)");
console.log("");

for (const item of REQUIRED) {
  const abs = join(root, item.path);
  if (!existsSync(abs)) {
    console.error(`FAIL: missing ${item.path}`);
    failed = true;
    continue;
  }
  const text = readFileSync(abs, "utf8");
  const missing = item.markers.filter((m) => !text.includes(m));
  if (missing.length) {
    console.error(`FAIL: ${item.path} missing markers: ${missing.join(", ")}`);
    failed = true;
    continue;
  }
  console.log(`OK: ${item.path}`);
}

for (const item of REQUIRED) {
  const abs = join(root, item.path);
  if (!existsSync(abs)) continue;
  const text = readFileSync(abs, "utf8");
  for (const re of FORBIDDEN_SECRET_ASSIGNMENTS) {
    if (re.test(text)) {
      console.error(
        `FAIL: ${item.path} appears to assign a secret value (refuse commit)`,
      );
      failed = true;
    }
  }
}

// Soft check: workflow job name must match required context string exactly
const metaCiPath = join(root, ".github/workflows/meta-ci.yml");
if (existsSync(metaCiPath)) {
  const yml = readFileSync(metaCiPath, "utf8");
  if (!/^\s+name:\s*meta-ci-presence\s*$/m.test(yml)) {
    console.error(
      "FAIL: .github/workflows/meta-ci.yml must declare job name: meta-ci-presence",
    );
    failed = true;
  } else {
    console.log("OK: meta-ci-presence job name exact match");
  }
}

const opsPath = join(root, "docs/ops/ci-protection-verify.md");
if (existsSync(opsPath)) {
  const ops = readFileSync(opsPath, "utf8");
  if (!/Do\s+\*\*not\*\*\s+require Vercel/i.test(ops) && !/do not require Vercel/i.test(ops)) {
    console.error(
      "FAIL: docs/ops/ci-protection-verify.md must keep Vercel-not-accept-gate ban",
    );
    failed = true;
  } else {
    console.log("OK: Vercel-not-Meta-accept-gate ban present in ops kit");
  }
}

const pkgPath = join(root, "package.json");
if (!existsSync(pkgPath)) {
  console.error("FAIL: missing package.json");
  failed = true;
} else {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const script = pkg.scripts?.["dry-run:ci-protection-verify"];
  if (script !== "node scripts/ci-protection-verify-dry-run.mjs") {
    console.error(
      'FAIL: package.json scripts["dry-run:ci-protection-verify"] missing or wrong',
    );
    failed = true;
  } else {
    console.log('OK: package.json scripts["dry-run:ci-protection-verify"]');
  }
}

/**
 * Read-only live hop: confirm main.protected without dumping secrets or writing.
 * Detail GET 403 on protection is expected — soft note, not kit FAIL.
 */
function runLiveProbe() {
  console.log("\n--- --live read-only probe ---");
  const gh = spawnSync(
    "gh",
    ["api", `repos/${REPO}/branches/main`, "-q", ".protected"],
    { encoding: "utf8" },
  );
  if (gh.error) {
    console.error(`FAIL: --live requires gh (${gh.error.message})`);
    return false;
  }
  if (gh.status !== 0) {
    const err = (gh.stderr || gh.stdout || "").trim();
    console.error(`FAIL: gh api branches/main failed: ${err || `exit ${gh.status}`}`);
    return false;
  }
  const protectedFlag = (gh.stdout || "").trim();
  if (protectedFlag === "true") {
    console.log("OK: main.protected === true (read-only)");
  } else {
    console.error(`FAIL: main.protected expected true, got ${JSON.stringify(protectedFlag)}`);
    return false;
  }

  // Soft probe of protection detail — 403 is expected for agent tokens
  const detail = spawnSync(
    "gh",
    ["api", `repos/${REPO}/branches/main/protection`],
    { encoding: "utf8" },
  );
  if (detail.status === 0) {
    console.log("OK: protection detail readable (admin token)");
  } else {
    const err = (detail.stderr || detail.stdout || "").trim();
    if (/403|Resource not accessible|Forbidden/i.test(err)) {
      console.log(
        "NOTE: protection detail GET 403 (expected for integration tokens) — not a kit FAIL",
      );
    } else {
      console.log(
        `NOTE: protection detail unavailable (${err || `exit ${detail.status}`}) — soft skip`,
      );
    }
  }
  console.log("GitHub protection mutate: still REFUSED (no PUT issued)");
  return true;
}

if (live) {
  if (!runLiveProbe()) {
    failed = true;
  }
}

if (failed) {
  console.error("\nFAIL: CI protection verify kit incomplete.");
  process.exit(1);
}

console.log(
  "\nOK: kit markers green (offline); Port upserts REFUSED; GitHub protection writes REFUSED; no #88/#90/#92 overlap.",
);
process.exit(0);
