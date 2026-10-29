#!/usr/bin/env node
/**
 * Kit dry-run for BdMetaBeads offline / readiness (PBI-007 Meta Beads adapter).
 *
 * Default: verify docs/scripts/source markers (no network, no secrets, no Port).
 * Optional: --memory → run apps/project-supervisor BdMetaBeads unit tests
 *           (npm ci in that package if needed; injectable BdRunner only).
 *
 * Does NOT cover Funnel unsigned/signed admit or supervisor POST /admit kits.
 *
 * Usage:
 *   node scripts/bdmetabeads-dry-run.mjs
 *   npm run dry-run:bdmetabeads
 *   npm run dry-run:bdmetabeads -- --memory
 *
 * Exit 0 = kit OK (+ BdMetaBeads tests green when --memory).
 * Exit 1 = missing/broken kit or memory probe fail.
 * Exit 2 = bad args.
 *
 * @see docs/ops/bdmetabeads-readiness.md
 * @see docs/meta-beads.md
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const supervisorDir = join(root, "apps/project-supervisor");

const REQUIRED = [
  {
    path: "docs/ops/bdmetabeads-readiness.md",
    markers: [
      "BdMetaBeads",
      "dry-run:bdmetabeads",
      "factory-",
      "bd-bootstrap-safe",
      "FE-142",
      "FE-172",
      "Do not ask",
      "Port schema",
      "Product Beads",
      "supervisor-admit",
    ],
  },
  {
    path: "docs/meta-beads.md",
    markers: [
      "factory-",
      "bd-bootstrap-safe.sh",
      "BdMetaBeads",
      "bd ready",
      "bd update",
      "refs/dolt/data",
      "never Product Beads",
    ],
  },
  {
    path: "apps/project-supervisor/src/bd-meta-beads.ts",
    markers: [
      "META_BEADS_ID_PREFIX",
      'factory-',
      "BdMetaBeads",
      "BdRunner",
      "--claim",
      "unclaim",
      "never Product Beads",
      "isReady",
    ],
  },
  {
    path: "apps/project-supervisor/src/index.ts",
    markers: ["createBdSupervisor", "BdMetaBeads"],
  },
  {
    path: "apps/project-supervisor/test/bd-meta-beads.test.ts",
    markers: [
      "BdMetaBeads",
      "refuses Product",
      "factory-",
      "createBdSupervisor",
      "--claim",
    ],
  },
  {
    path: "apps/project-supervisor/README.md",
    markers: [
      "BdMetaBeads",
      "createBdSupervisor",
      "factory-",
      "never Product Beads",
      "bd update",
    ],
  },
  {
    path: ".beads/config.yaml",
    markers: [
      'issue-prefix: "factory"',
      "never Product Beads",
      "git+https://github.com/mplsjohnnycage/factory.git",
    ],
  },
  {
    path: ".beads/README.md",
    markers: ["factory-", "bd-bootstrap-safe.sh", "Product Beads"],
  },
  {
    path: "scripts/bd-bootstrap-safe.sh",
    markers: [
      "dry-run",
      "never bd init --force",
      "never bd dolt push",
      "never Product Beads",
    ],
  },
  {
    path: "scripts/bdmetabeads-dry-run.mjs",
    markers: ["Kit dry-run for BdMetaBeads", "Exit 0 = kit OK"],
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

function parseArgs(argv) {
  let memory = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/bdmetabeads-dry-run.mjs [--memory]
  npm run dry-run:bdmetabeads -- [--memory]

Default: kit markers only (no network, no npm install).
--memory: also run BdMetaBeads unit tests (injectable BdRunner; no live bd).
Does not run gateway unsigned/signed or supervisor-admit kits.`);
      process.exit(0);
    }
    if (arg === "--memory") {
      memory = true;
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
  return { memory };
}

let failed = false;
const { memory } = parseArgs(process.argv.slice(2));

console.log("=== BdMetaBeads offline / readiness kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
console.log("FE-172 Sign-in re-ask: CLOSED");
console.log("Funnel unsigned/signed admit: OUT OF SCOPE (separate kits)");
console.log("Supervisor POST /admit: OUT OF SCOPE (supervisor-admit kit)");
console.log("Live bd dolt push: OUT OF SCOPE");
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

const pkgPath = join(root, "package.json");
if (!existsSync(pkgPath)) {
  console.error("FAIL: missing package.json");
  failed = true;
} else {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const script = pkg.scripts?.["dry-run:bdmetabeads"];
  if (script !== "node scripts/bdmetabeads-dry-run.mjs") {
    console.error(
      'FAIL: package.json scripts["dry-run:bdmetabeads"] missing or wrong',
    );
    failed = true;
  } else {
    console.log('OK: package.json scripts["dry-run:bdmetabeads"]');
  }
}

if (failed) {
  console.error("\nFAIL: BdMetaBeads readiness kit incomplete.");
  process.exit(1);
}

console.log("\nOK: kit markers green (offline).");

if (!memory) {
  console.log(
    "SKIP memory probe: pass --memory to run BdMetaBeads unit tests.",
  );
  process.exit(0);
}

if (!existsSync(join(supervisorDir, "package.json"))) {
  console.error("FAIL: apps/project-supervisor/package.json missing");
  process.exit(1);
}

const needInstall = !existsSync(join(supervisorDir, "node_modules", "tsx"));
if (needInstall) {
  console.log("\n== npm ci @ apps/project-supervisor ==");
  const ci = spawnSync("npm", ["ci"], {
    cwd: supervisorDir,
    stdio: "inherit",
    env: process.env,
  });
  if (ci.status !== 0) {
    console.error("\nFAIL: npm ci in project-supervisor failed.");
    process.exit(ci.status === null ? 1 : ci.status);
  }
}

console.log("\n== BdMetaBeads unit tests (injectable BdRunner) ==");
const test = spawnSync(
  "node",
  ["--import", "tsx", "--test", "test/bd-meta-beads.test.ts"],
  {
    cwd: supervisorDir,
    stdio: "inherit",
    env: process.env,
  },
);

if (test.status !== 0) {
  console.error("\nFAIL: BdMetaBeads memory probe failed.");
  process.exit(test.status === null ? 1 : test.status);
}

console.log(
  "\nOK: kit + BdMetaBeads gates green; Port left untouched; no Funnel/spend; Product Beads refused.",
);
process.exit(0);
