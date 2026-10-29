#!/usr/bin/env node
/**
 * Kit dry-run for signed HMAC admit smoke (env vars only).
 *
 * Default: verify docs/scripts markers (no network, no secrets printed).
 * Optional: --live → run Funnel probes via gateway-tailnet-health with
 *           GATEWAY_HMAC_SMOKE=1. Signed / handler probes run only when
 *           PORT_CLIENT_SECRET / FACTORY_GATEWAY_HANDLER_TOKEN are present
 *           in the environment (presence logged; values never printed).
 * Optional: --require-signed → fail --live when PORT_CLIENT_SECRET ABSENT.
 *
 * FE-142 closed (signed 202 + handler-token PASS) — do not re-ask secrets.
 * Never Port mutate. Never print secret values.
 *
 * Usage:
 *   node scripts/gateway-signed-admit-dry-run.mjs
 *   npm run dry-run:gateway-signed
 *   GATEWAY_HMAC_SMOKE=1 npm run dry-run:gateway-signed -- --live
 *   npm run dry-run:gateway-signed -- --live --require-signed
 *
 * Exit 0 = kit OK (+ live green when --live).
 * Exit 1 = missing/broken kit or live probe fail.
 * Exit 2 = bad args.
 *
 * @see docs/ops/signed-admit-smoke.md
 * @see docs/gateway-hmac-smoke.md
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_BASE = "https://desktop-3apdbkg.taildf3a4b.ts.net";

const REQUIRED = [
  {
    path: "docs/ops/signed-admit-smoke.md",
    markers: [
      "FE-142",
      "GATEWAY_HMAC_SMOKE",
      "PORT_CLIENT_SECRET",
      "FACTORY_GATEWAY_HANDLER_TOKEN",
      "action_required",
      "dry-run:gateway-signed",
      "Never echo",
      "Do not ask",
      "Port schema",
      "desktop-3apdbkg.taildf3a4b.ts.net",
    ],
  },
  {
    path: "docs/gateway-hmac-smoke.md",
    markers: [
      "gateway-tailnet-health.mjs",
      "GATEWAY_HMAC_SMOKE",
      "signed",
      "action_required",
      "Never print",
      "FE-142",
      "signed-admit-smoke.md",
    ],
  },
  {
    path: "docs/beads-admit-gateway-path.md",
    markers: ["gateway_admit", "FE-142", "factory_claim_next_job"],
  },
  {
    path: "scripts/gateway-tailnet-health.mjs",
    markers: [
      "GATEWAY_HMAC_SMOKE",
      "PORT_CLIENT_SECRET",
      "FACTORY_GATEWAY_HANDLER_TOKEN",
      "action_required",
      "Never prints secret",
      "--require-signed",
    ],
  },
  {
    path: "scripts/gateway-signed-admit-dry-run.mjs",
    markers: ["Kit dry-run for signed HMAC", "Exit 0 = kit OK"],
  },
  {
    path: "scripts/windows/gateway.env.example",
    markers: ["PORT_CLIENT_SECRET=", "FACTORY_GATEWAY_HANDLER_TOKEN="],
  },
];

/** Reject accidental committed secret assignments in the ops kit docs/scripts. */
const FORBIDDEN_SECRET_ASSIGNMENTS = [
  /(?:^|\n)\s*PORT_CLIENT_SECRET\s*=\s*['"]?[^\s'"#=]+/i,
  /(?:^|\n)\s*FACTORY_GATEWAY_HANDLER_TOKEN\s*=\s*['"]?[^\s'"#=]+/i,
  /(?:^|\n)\s*CONVEX_TEAM_TOKEN\s*=\s*['"]?[^\s'"#=]+/i,
];

function parseArgs(argv) {
  let live = false;
  let requireSigned = false;
  let baseUrl = process.env.FACTORY_GATEWAY_BASE_URL || DEFAULT_BASE;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/gateway-signed-admit-dry-run.mjs [--live] [--require-signed] [--base-url <url>]
  npm run dry-run:gateway-signed -- [--live] [--require-signed]

Default: kit markers only (no network).
--live: Funnel probes with GATEWAY_HMAC_SMOKE=1 (signed/handler when env present).
--require-signed: with --live, fail if PORT_CLIENT_SECRET ABSENT.
Never prints secret values. Never Port mutate.`);
      process.exit(0);
    }
    if (arg === "--live") {
      live = true;
      continue;
    }
    if (arg === "--require-signed") {
      requireSigned = true;
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
  return { live, requireSigned, baseUrl: String(baseUrl).trim().replace(/\/+$/, "") };
}

function secretPresence(name) {
  const v = process.env[name];
  return v && String(v).length > 0 ? "present" : "ABSENT";
}

let failed = false;
const { live, requireSigned, baseUrl } = parseArgs(process.argv.slice(2));

console.log("=== Signed HMAC admit smoke kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
console.log(`PORT_CLIENT_SECRET: ${secretPresence("PORT_CLIENT_SECRET")}`);
console.log(
  `FACTORY_GATEWAY_HANDLER_TOKEN: ${secretPresence("FACTORY_GATEWAY_HANDLER_TOKEN")}`,
);
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

if (failed) {
  console.error("\nFAIL: signed admit smoke kit incomplete.");
  process.exit(1);
}

console.log("\nOK: kit markers green (offline).");

if (!live) {
  console.log("SKIP live Funnel: pass --live to run signed/unsigned probes.");
  process.exit(0);
}

if (!baseUrl) {
  console.error("FAIL: --live needs FACTORY_GATEWAY_BASE_URL or --base-url");
  process.exit(2);
}

if (requireSigned && secretPresence("PORT_CLIENT_SECRET") === "ABSENT") {
  console.error(
    "FAIL: --require-signed but PORT_CLIENT_SECRET ABSENT (presence only; value never printed).",
  );
  process.exit(1);
}

console.log(`\n== Live probes @ ${baseUrl} (GATEWAY_HMAC_SMOKE=1) ==`);
const healthScript = join(root, "scripts/gateway-tailnet-health.mjs");
const args = [healthScript, "--base-url", baseUrl];
if (requireSigned) args.push("--require-signed");

const result = spawnSync(process.execPath, args, {
  stdio: "inherit",
  env: {
    ...process.env,
    GATEWAY_HMAC_SMOKE: "1",
  },
});

if (result.status !== 0) {
  console.error("\nFAIL: live signed/unsigned probes failed.");
  process.exit(result.status === null ? 1 : result.status);
}

console.log("\nOK: kit + live probes green; Port left untouched; secrets not printed.");
process.exit(0);
