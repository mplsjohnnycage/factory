#!/usr/bin/env node
/**
 * Kit dry-run for Funnel remount checklist (offline docs/script contract).
 *
 * Default: verify remount docs + factory_* IDs + fencing markers
 * (no network mutate, no secrets, no Port upserts).
 * Optional: --live → spawn scripts/gateway-remount-dry-run.mjs with
 * FACTORY_GATEWAY_BASE_URL / --base-url (still no Port mutate).
 *
 * Does NOT cover gateway Dockerfile health (#82), queue mirror (#88),
 * Rivet/sandbox/BdMetaBeads/Dolt/OpenAccess kits, or admit HMAC kits.
 *
 * Usage:
 *   node scripts/funnel-remount-checklist-dry-run.mjs
 *   npm run dry-run:funnel-remount-checklist
 *   FACTORY_GATEWAY_BASE_URL=https://… npm run dry-run:funnel-remount-checklist -- --live
 *
 * Exit 0 = kit OK (+ live health OK when --live).
 * Exit 1 = missing/broken kit or live health failed.
 * Exit 2 = bad args.
 *
 * @see docs/ops/funnel-remount-checklist.md
 * @see docs/gateway-remount-dry-run.md
 * @see docs/port-workflow-webhooks.md
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const FACTORY_WORKFLOW_IDS = [
  "factory_create_execution_contract",
  "factory_start_delivery_run",
  "factory_claim_next_job",
  "factory_heartbeat",
  "factory_submit_evidence",
  "factory_record_review_verdict",
  "factory_request_release",
];

const REQUIRED = [
  {
    path: "docs/ops/funnel-remount-checklist.md",
    markers: [
      "dry-run:funnel-remount-checklist",
      "gateway-remount-dry-run",
      "port-workflow-webhooks",
      "api.port.io",
      "Do not remount",
      "FE-142",
      "FE-172",
      "Do not ask",
      "Port schema",
      "upsert_workflow",
      "gateway_admit",
      ...FACTORY_WORKFLOW_IDS,
    ],
  },
  {
    path: "docs/gateway-remount-dry-run.md",
    markers: [
      "gateway-remount-dry-run.mjs",
      "do not remount",
      "FACTORY_GATEWAY_BASE_URL",
      "/health",
      "upsert_workflow",
      ...FACTORY_WORKFLOW_IDS,
    ],
  },
  {
    path: "docs/port-workflow-webhooks.md",
    markers: [
      "api.port.io",
      "gateway_admit",
      "FACTORY_GATEWAY_BASE_URL",
      "Do not remount",
      "fencing",
      ...FACTORY_WORKFLOW_IDS,
    ],
  },
  {
    path: "scripts/gateway-remount-dry-run.mjs",
    markers: [
      "FACTORY_WORKFLOW_IDS",
      "upsert_workflow",
      "Does not call Port mutate",
      "/health",
      ...FACTORY_WORKFLOW_IDS,
    ],
  },
  {
    path: "scripts/funnel-remount-checklist-dry-run.mjs",
    markers: [
      "Kit dry-run for Funnel remount checklist",
      "Exit 0 = kit OK",
    ],
  },
  {
    path: "docs/ops/gateway-dockerfile-health.md",
    markers: [
      "gateway-remount-dry-run",
      "dry-run:gateway-dockerfile-health",
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

function parseArgs(argv) {
  let live = false;
  let baseUrl = process.env.FACTORY_GATEWAY_BASE_URL || "";
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log(`Usage:
  node scripts/funnel-remount-checklist-dry-run.mjs [--live] [--base-url <url>]
  npm run dry-run:funnel-remount-checklist -- [--live] [--base-url <url>]

Default: kit markers only (no network mutate, no npm install).
--live: also run scripts/gateway-remount-dry-run.mjs (requires BASE_URL).
Does not upsert Port workflows / blueprints. Never prints secrets.
FE-142 / FE-172 CLOSED — do not re-ask Johnny.`);
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
  return { live, baseUrl };
}

let failed = false;
const { live, baseUrl } = parseArgs(process.argv.slice(2));

console.log("=== Funnel remount checklist kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Secrets print: REFUSED");
console.log("FE-142 secret re-ask: CLOSED");
console.log("FE-172 Sign-in re-ask: CLOSED");
console.log("Gateway Dockerfile health (#82): OUT OF SCOPE");
console.log("Queue mirror (#88): OUT OF SCOPE");
console.log("Live WEBHOOK upsert: OUT OF SCOPE");
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

// Case-insensitive fencing host must appear in WEBHOOK inventory
const webhooksPath = join(root, "docs/port-workflow-webhooks.md");
if (existsSync(webhooksPath)) {
  const webhooks = readFileSync(webhooksPath, "utf8");
  if (!/api\.port\.io/i.test(webhooks)) {
    console.error("FAIL: docs/port-workflow-webhooks.md must keep fencing on api.port.io");
    failed = true;
  } else {
    console.log("OK: fencing host api.port.io present in WEBHOOK inventory");
  }
  // Require the explicit ban (soft check that remount docs still forbid fencing retarget)
  if (
    !/Do\s+\*\*not\*\*\s+replace Port self-API GET fencing nodes/i.test(
      webhooks,
    ) &&
    !/never retarget/i.test(webhooks) &&
    !/never replaced/i.test(webhooks)
  ) {
    console.error(
      "FAIL: docs/port-workflow-webhooks.md must keep an explicit fencing retarget ban",
    );
    failed = true;
  } else {
    console.log("OK: fencing retarget ban present in WEBHOOK inventory");
  }
}

const pkgPath = join(root, "package.json");
if (!existsSync(pkgPath)) {
  console.error("FAIL: missing package.json");
  failed = true;
} else {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const script = pkg.scripts?.["dry-run:funnel-remount-checklist"];
  if (script !== "node scripts/funnel-remount-checklist-dry-run.mjs") {
    console.error(
      'FAIL: package.json scripts["dry-run:funnel-remount-checklist"] missing or wrong',
    );
    failed = true;
  } else {
    console.log('OK: package.json scripts["dry-run:funnel-remount-checklist"]');
  }
}

if (failed) {
  console.error("\nFAIL: Funnel remount checklist kit incomplete.");
  process.exit(1);
}

console.log("\nOK: kit markers green (offline).");

if (!live) {
  console.log(
    "SKIP live remount health: pass --live (+ FACTORY_GATEWAY_BASE_URL) to probe /health.",
  );
  process.exit(0);
}

const remountScript = join(root, "scripts/gateway-remount-dry-run.mjs");
if (!existsSync(remountScript)) {
  console.error("FAIL: missing scripts/gateway-remount-dry-run.mjs for --live");
  process.exit(1);
}

const normalized = String(baseUrl || "").trim().replace(/\/+$/, "");
if (!normalized) {
  console.error(
    "FAIL: --live requires FACTORY_GATEWAY_BASE_URL or --base-url <url>",
  );
  process.exit(2);
}

console.log("\n== live gateway-remount-dry-run (no Port mutate) ==");
const probe = spawnSync(
  process.execPath,
  [remountScript, "--base-url", normalized],
  {
    cwd: root,
    encoding: "utf8",
    env: process.env,
    stdio: "inherit",
  },
);

if (probe.status !== 0) {
  console.error(
    "\nFAIL: live remount health failed — do not remount onto this base URL.",
  );
  process.exit(probe.status === null ? 1 : probe.status);
}

console.log(
  "\nOK: kit + live /health green; Port untouched; no WEBHOOK upsert; no #82/#88 overlap.",
);
process.exit(0);
