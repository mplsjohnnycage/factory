#!/usr/bin/env node
/**
 * Operator dry-run kit for Port → factory-gateway remount.
 *
 * Checks BASE_URL/health and prints expected WEBHOOK paths for factory_* admits.
 * Refuses Port mutate APIs and any remount/upsert — print-only + health.
 *
 * Usage:
 *   FACTORY_GATEWAY_BASE_URL=https://… node scripts/gateway-remount-dry-run.mjs
 *   node scripts/gateway-remount-dry-run.mjs --base-url https://…
 *
 * Exit 0 = health OK + paths printed. Non-zero = health failed or bad args.
 *
 * @see docs/gateway-remount-dry-run.md
 * @see docs/port-workflow-webhooks.md
 */
import { spawnSync } from "node:child_process";

/** Canonical Software Factory workflow IDs — do not invent parallel names. */
const FACTORY_WORKFLOW_IDS = [
  "factory_create_execution_contract",
  "factory_start_delivery_run",
  "factory_claim_next_job",
  "factory_heartbeat",
  "factory_submit_evidence",
  "factory_record_review_verdict",
  "factory_request_release",
];

const PORT_MUTATE_HINTS = [
  "api.port.io",
  "upsert_workflow",
  "upsert_entity",
  "trigger_run",
  "PORT_API",
  "PORT_CLIENT_ID",
  "PORT_CLIENT_SECRET",
];

function usage() {
  console.error(`Usage:
  FACTORY_GATEWAY_BASE_URL=<url> node scripts/gateway-remount-dry-run.mjs
  node scripts/gateway-remount-dry-run.mjs --base-url <url>

Dry-run only: GET {BASE}/health + print expected WEBHOOK paths.
Does not call Port mutate APIs. Does not remount live tools.`);
}

function normalizeBaseUrl(raw) {
  const trimmed = String(raw).trim().replace(/\/+$/, "");
  if (!trimmed) return null;
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return trimmed;
}

function parseArgs(argv) {
  let baseUrl = process.env.FACTORY_GATEWAY_BASE_URL || "";
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
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
    usage();
    process.exit(2);
  }
  return baseUrl;
}

function refusePortMutate() {
  console.log("\n== Port mutate refuse ==");
  console.log(
    "OK: this script never calls Port mutate APIs (upsert_workflow, upsert_entity, trigger_run, External Interface create/delete/revoke).",
  );
  console.log(
    "OK: remount remains a human/operator step after public /health is green — see docs/port-workflow-webhooks.md.",
  );
  // Soft guard: env that looks like an attempt to drive Port from this kit.
  const suspicious = PORT_MUTATE_HINTS.filter((key) => {
    if (key === "api.port.io") return false;
    return Boolean(process.env[key]);
  });
  if (suspicious.length > 0) {
    console.log(
      `NOTE: Port-related env present (${suspicious.join(", ")}) — ignored; dry-run does not use them.`,
    );
  }
}

function printExpectedPaths(baseUrl) {
  console.log("\n== Expected WEBHOOK paths (factory_*) ==");
  console.log(`BASE_URL=${baseUrl}`);
  console.log(`GET  ${baseUrl}/health`);
  console.log(`POST ${baseUrl}/webhooks/port`);
  for (const id of FACTORY_WORKFLOW_IDS) {
    console.log(`POST ${baseUrl}/webhooks/port/${id}`);
  }
  console.log(`POST ${baseUrl}/handlers/self-service  (Meta SS; bearer + optional HMAC)`);
  console.log(
    "\nRemount hint (manual, not executed): add/retarget a notify/admit WEBHOOK →",
  );
  console.log(
    `  {FACTORY_GATEWAY_BASE_URL}/webhooks/port/<factory_*>  with Port HMAC on.`,
  );
  console.log(
    "Do not replace Port self-API GET fencing nodes (api.port.io) with gateway URLs.",
  );
}

function curlHealth(baseUrl) {
  const healthUrl = `${baseUrl}/health`;
  console.log("\n== Health ==");
  console.log(`GET ${healthUrl}`);

  const result = spawnSync(
    "curl",
    [
      "-fsS",
      "--max-time",
      "15",
      "-w",
      "\nHTTP_STATUS:%{http_code}\n",
      healthUrl,
    ],
    { encoding: "utf8" },
  );

  if (result.error) {
    console.error(`FAIL: curl could not run: ${result.error.message}`);
    return false;
  }

  const stdout = result.stdout || "";
  const stderr = result.stderr || "";
  const statusMatch = stdout.match(/HTTP_STATUS:(\d+)\s*$/);
  const body = statusMatch
    ? stdout.slice(0, statusMatch.index).trim()
    : stdout.trim();
  const httpStatus = statusMatch ? Number(statusMatch[1]) : null;

  if (result.status !== 0) {
    if (stderr.trim()) console.error(stderr.trim());
    console.error(
      `FAIL: health check failed (curl exit ${result.status}${httpStatus != null ? `, HTTP ${httpStatus}` : ""}).`,
    );
    console.error(
      "Do not remount live Port WEBHOOK URLs onto this BASE_URL until /health returns 200.",
    );
    return false;
  }

  if (httpStatus !== 200) {
    console.error(`FAIL: expected HTTP 200 from /health, got ${httpStatus}`);
    if (body) console.error(body);
    return false;
  }

  console.log(`HTTP ${httpStatus}`);
  if (body) console.log(body);

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    console.error("FAIL: /health body is not JSON");
    return false;
  }

  if (parsed?.ok !== true || parsed?.service !== "factory-gateway") {
    console.error(
      'FAIL: expected JSON {"ok":true,"service":"factory-gateway"}',
    );
    return false;
  }

  console.log("OK: gateway health");
  return true;
}

function main() {
  const rawBase = parseArgs(process.argv.slice(2));
  const baseUrl = normalizeBaseUrl(rawBase);
  if (!baseUrl) {
    console.error(
      "FAIL: set FACTORY_GATEWAY_BASE_URL or pass --base-url <url> (no trailing slash).",
    );
    usage();
    process.exit(2);
  }

  console.log("gateway-remount-dry-run — Port→gateway remount kit (no live remount)");
  refusePortMutate();
  printExpectedPaths(baseUrl);

  const healthy = curlHealth(baseUrl);
  if (!healthy) {
    process.exit(1);
  }

  console.log("\n== Summary ==");
  console.log("OK: dry-run complete. Health green; paths printed; Port left untouched.");
  console.log(
    "Next (human): set Port secret FACTORY_GATEWAY_BASE_URL, then remount admit WEBHOOK nodes only.",
  );
  process.exit(0);
}

main();
