#!/usr/bin/env node
/**
 * Kit dry-run for Beads → factory-gateway unsigned admit path.
 *
 * Default: verify docs/scripts markers (no network, no secrets).
 * Optional: --live → run unsigned Funnel probes via gateway-tailnet-health
 *           (--unsigned-only). Never prints secret values. Never Port mutate.
 *
 * Usage:
 *   node scripts/gateway-unsigned-admit-dry-run.mjs
 *   npm run dry-run:gateway-unsigned
 *   npm run dry-run:gateway-unsigned -- --live
 *
 * Exit 0 = kit OK (+ live unsigned green when --live).
 * Exit 1 = missing/broken kit or live probe fail.
 * Exit 2 = bad args.
 *
 * @see docs/ops/beads-gateway-unsigned-admit.md
 * @see docs/beads-admit-gateway-path.md
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_BASE = "https://desktop-3apdbkg.taildf3a4b.ts.net";

const REQUIRED = [
  {
    path: "docs/ops/beads-gateway-unsigned-admit.md",
    markers: [
      "FE-142",
      "unsigned",
      "invalid_port_signature",
      "unauthorized_handler",
      "dry-run:gateway-unsigned",
      "Do not ask",
      "Port mutate",
      "desktop-3apdbkg.taildf3a4b.ts.net",
    ],
  },
  {
    path: "docs/beads-admit-gateway-path.md",
    markers: [
      "gateway_admit",
      "invalid_port_signature",
      "factory_claim_next_job",
      "gateway-tailnet-health.mjs",
      "FE-142",
    ],
  },
  {
    path: "docs/gateway-hmac-smoke.md",
    markers: [
      "gateway-tailnet-health.mjs",
      "invalid_port_signature",
      "FACTORY_GATEWAY_BASE_URL",
      "Never print",
      "FE-142",
    ],
  },
  {
    path: "scripts/gateway-tailnet-health.mjs",
    markers: [
      "unsigned",
      "--unsigned-only",
      "invalid_port_signature",
      "not_found",
      "Never prints secret",
    ],
  },
  {
    path: "scripts/gateway-unsigned-admit-dry-run.mjs",
    markers: ["Kit dry-run for Beads", "Exit 0 = kit OK"],
  },
];

/** Reject accidental committed secret assignments in the ops kit docs. */
const FORBIDDEN_SECRET_ASSIGNMENTS = [
  /(?:^|\n)\s*PORT_CLIENT_SECRET\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*FACTORY_GATEWAY_HANDLER_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*CONVEX_TEAM_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
];

function parseArgs(argv) {
  let live = false;
  let baseUrl = process.env.FACTORY_GATEWAY_BASE_URL || DEFAULT_BASE;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/gateway-unsigned-admit-dry-run.mjs [--live] [--base-url <url>]
  npm run dry-run:gateway-unsigned -- [--live]

Default: kit markers only (no network).
--live: also run unsigned Funnel probes (no secrets).`);
      process.exit(0);
    }
    if (arg === "--live") {
      live = true;
      continue;
    }
    if (arg === "--base-url" || arg === "--base") {
      baseUrl = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg.startsWith("--base-url=")) {
      baseUrl = arg.slice("--base-url=".length);
      continue;
    }
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
  return { live, baseUrl: String(baseUrl).trim().replace(/\/+$/, "") };
}

let failed = false;
const { live, baseUrl } = parseArgs(process.argv.slice(2));

console.log("=== Beads → gateway unsigned admit kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
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
  console.error("\nFAIL: unsigned admit kit incomplete.");
  process.exit(1);
}

console.log("\nOK: kit markers green (offline).");

if (!live) {
  console.log("SKIP live Funnel: pass --live to run unsigned probes.");
  process.exit(0);
}

if (!baseUrl) {
  console.error("FAIL: --live needs FACTORY_GATEWAY_BASE_URL or --base-url");
  process.exit(2);
}

console.log(`\n== Live unsigned probes @ ${baseUrl} ==`);
const healthScript = join(root, "scripts/gateway-tailnet-health.mjs");
const result = spawnSync(
  process.execPath,
  [healthScript, "--base-url", baseUrl, "--unsigned-only"],
  { stdio: "inherit", env: process.env },
);

if (result.status !== 0) {
  console.error("\nFAIL: live unsigned probes failed.");
  process.exit(result.status === null ? 1 : result.status);
}

console.log("\nOK: kit + live unsigned gates green; Port left untouched.");
process.exit(0);
