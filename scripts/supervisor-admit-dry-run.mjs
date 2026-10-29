#!/usr/bin/env node
/**
 * Kit dry-run for ProjectSupervisor offline admit entry (G6).
 *
 * Default: verify docs/scripts/source markers (no network, no secrets, no Port).
 * Optional: --memory → run apps/project-supervisor admit-entry tests
 *           (npm ci in that package if needed; Memory Meta Beads only).
 *
 * Usage:
 *   node scripts/supervisor-admit-dry-run.mjs
 *   npm run dry-run:supervisor-admit
 *   npm run dry-run:supervisor-admit -- --memory
 *
 * Exit 0 = kit OK (+ memory tests green when --memory).
 * Exit 1 = missing/broken kit or memory probe fail.
 * Exit 2 = bad args.
 *
 * @see docs/ops/supervisor-admit-dry-run.md
 * @see docs/beads-admit-gateway-path.md
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const supervisorDir = join(root, "apps/project-supervisor");

const REQUIRED = [
  {
    path: "docs/ops/supervisor-admit-dry-run.md",
    markers: [
      "ProjectSupervisor",
      "admitFromPayload",
      "claim_or_bypass_required",
      "dry-run:supervisor-admit",
      "FE-142",
      "Do not ask",
      "Port schema",
      "project-supervisor-admit",
      "RIVET_SUPERVISOR_URL",
    ],
  },
  {
    path: "docs/beads-admit-gateway-path.md",
    markers: [
      "admitFromPayload",
      "RIVET_SUPERVISOR_URL",
      "supervisor-admit-dry-run",
      "factory-",
      "FE-142",
    ],
  },
  {
    path: "apps/project-supervisor/src/admit-entry.ts",
    markers: [
      "admitFromPayload",
      "mapToAdmitRequest",
      "claim_or_bypass_required",
      "SupervisorAdmit",
    ],
  },
  {
    path: "apps/project-supervisor/src/admit-http.ts",
    markers: [
      "createAdmitServer",
      "listenAdmitServer",
      "project-supervisor-admit",
      "POST /admit",
      "RIVET_SUPERVISOR_URL",
    ],
  },
  {
    path: "apps/project-supervisor/README.md",
    markers: [
      "admitFromPayload",
      "listenAdmitServer",
      "createMemorySupervisor",
      "Offline admit entry",
    ],
  },
  {
    path: "scripts/supervisor-admit-dry-run.mjs",
    markers: ["Kit dry-run for ProjectSupervisor", "Exit 0 = kit OK"],
  },
];

/** Reject accidental committed secret assignments in the ops kit docs. */
const FORBIDDEN_SECRET_ASSIGNMENTS = [
  /(?:^|\n)\s*PORT_CLIENT_SECRET\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*FACTORY_GATEWAY_HANDLER_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*ANTHROPIC_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*CONVEX_TEAM_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
];

function parseArgs(argv) {
  let memory = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/supervisor-admit-dry-run.mjs [--memory]
  npm run dry-run:supervisor-admit -- [--memory]

Default: kit markers only (no network, no npm install).
--memory: also run admit-entry Memory tests under apps/project-supervisor.`);
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

console.log("=== ProjectSupervisor admit kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
console.log("Funnel / Rivet Actor / Docker SA: OUT OF SCOPE");
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
      console.error(`FAIL: ${item.path} appears to assign a secret value (refuse commit)`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("\nFAIL: supervisor admit kit incomplete.");
  process.exit(1);
}

console.log("\nOK: kit markers green (offline).");

if (!memory) {
  console.log("SKIP memory probe: pass --memory to run admit-entry tests.");
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

console.log("\n== Memory admit-entry tests ==");
const test = spawnSync(
  process.execPath,
  ["--import", "tsx", "--test", "test/admit-entry.test.ts"],
  {
    cwd: supervisorDir,
    stdio: "inherit",
    env: process.env,
  },
);

if (test.status !== 0) {
  console.error("\nFAIL: admit-entry Memory probe failed.");
  process.exit(test.status === null ? 1 : test.status);
}

console.log("\nOK: kit + Memory admit gates green; Port left untouched.");
process.exit(0);
