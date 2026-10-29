#!/usr/bin/env node
/**
 * Kit dry-run for Rivet Compose + Tailscale Serve smoke (PBI-004).
 *
 * Default: verify docs/scripts/compose markers (no network, no secrets, no Port).
 * Optional: --lint → run bin/rivet-healthcheck.sh --lint-only
 *
 * Usage:
 *   node scripts/rivet-compose-serve-dry-run.mjs
 *   npm run dry-run:rivet-compose-serve
 *   npm run dry-run:rivet-compose-serve -- --lint
 *
 * Exit 0 = kit OK (+ lint green when --lint).
 * Exit 1 = missing/broken kit or lint fail.
 * Exit 2 = bad args.
 *
 * @see docs/ops/rivet-compose-serve-smoke.md
 * @see docs/rivet-tailscale-serve.md
 * @see compose/README.md
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, accessSync, constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED = [
  {
    path: "docs/ops/rivet-compose-serve-smoke.md",
    markers: [
      "Audience:** Projects Manager",
      "dry-run:rivet-compose-serve",
      "rivet-healthcheck.sh",
      "FACTORY_RIVET_SERVE_URL",
      "FE-142",
      "FE-172",
      "Port schema",
      "Do not ask Johnny",
      "tailscale serve",
      "rivetdev/engine",
    ],
  },
  {
    path: "docs/rivet-tailscale-serve.md",
    markers: [
      "tailscale serve",
      "FACTORY_RIVET_SERVE_URL",
      "rivet-healthcheck.sh",
      "6420",
      "factory-edge",
    ],
  },
  {
    path: "compose/README.md",
    markers: [
      "Rivet",
      "docker compose",
      "rivet-healthcheck.sh",
      "RIVET_ADMIN_TOKEN",
      "docs/rivet-tailscale-serve.md",
    ],
  },
  {
    path: "compose/docker-compose.yml",
    markers: [
      "rivet-engine",
      "rivetdev/engine",
      "rivet-data",
      "6420",
      "RIVET_ADMIN_TOKEN",
    ],
  },
  {
    path: "compose/.env.example",
    markers: ["RIVET_ADMIN_TOKEN", "FACTORY_RIVET_SERVE_URL"],
  },
  {
    path: "bin/rivet-healthcheck.sh",
    markers: [
      "--lint-only",
      "--restart-proof",
      "rivet-engine",
      "refuse rivetdev/engine:next",
    ],
  },
  {
    path: "scripts/rivet-compose-serve-dry-run.mjs",
    markers: ["Kit dry-run for Rivet Compose", "Exit 0 = kit OK"],
  },
];

/** Reject accidental committed secret assignments in the ops kit docs/scripts. */
const FORBIDDEN_SECRET_ASSIGNMENTS = [
  /(?:^|\n)\s*RIVET_ADMIN_TOKEN\s*=\s*['"]?(?!replace-with-)[^\s'"#]{16,}/i,
  /(?:^|\n)\s*PORT_CLIENT_SECRET\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*FACTORY_GATEWAY_HANDLER_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*ANTHROPIC_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
];

function parseArgs(argv) {
  let lint = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/rivet-compose-serve-dry-run.mjs [--lint]
  npm run dry-run:rivet-compose-serve -- [--lint]

Default: kit markers only (no Docker required).
--lint: also run bin/rivet-healthcheck.sh --lint-only.`);
      process.exit(0);
    }
    if (arg === "--lint") {
      lint = true;
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
  return { lint };
}

let failed = false;
const { lint } = parseArgs(process.argv.slice(2));

console.log("=== Rivet Compose + Tailscale Serve kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
console.log("FE-172 human Sign-in: PM ops (do not block)");
console.log("Live Compose/Serve: DESKTOP PILOT ONLY");
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

const healthcheck = join(root, "bin/rivet-healthcheck.sh");
try {
  accessSync(healthcheck, constants.X_OK);
  console.log("OK: bin/rivet-healthcheck.sh executable");
} catch {
  console.error("FAIL: bin/rivet-healthcheck.sh not executable");
  failed = true;
}

for (const item of REQUIRED) {
  const abs = join(root, item.path);
  if (!existsSync(abs)) continue;
  if (item.path.endsWith(".env.example")) continue;
  const text = readFileSync(abs, "utf8");
  for (const re of FORBIDDEN_SECRET_ASSIGNMENTS) {
    if (re.test(text)) {
      console.error(`FAIL: ${item.path} appears to assign a secret value (refuse commit)`);
      failed = true;
    }
  }
}

const composeYml = readFileSync(join(root, "compose/docker-compose.yml"), "utf8");
const imagePinLines = composeYml
  .split("\n")
  .filter((line) => /^\s*image:\s*/.test(line) || /RIVET_ENGINE_IMAGE:-rivetdev\/engine/.test(line));
const floatsNext = imagePinLines.some((line) => /rivetdev\/engine:next|:next\b/.test(line));
if (floatsNext) {
  console.error("FAIL: compose pins refuse rivetdev/engine:next");
  failed = true;
} else {
  console.log("OK: compose image pin is not :next");
}

if (failed) {
  console.error("\nFAIL: Rivet Compose/Serve kit incomplete.");
  process.exit(1);
}

console.log("\nOK: kit markers green (offline).");

if (!lint) {
  console.log("SKIP compose lint: pass --lint to run rivet-healthcheck --lint-only.");
  process.exit(0);
}

console.log("\n== bin/rivet-healthcheck.sh --lint-only ==");
const result = spawnSync("bash", [healthcheck, "--lint-only"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

if (result.status !== 0) {
  console.error("\nFAIL: rivet-healthcheck --lint-only failed.");
  process.exit(result.status === null ? 1 : result.status);
}

console.log("\nOK: kit + compose lint green; Port left untouched.");
process.exit(0);
