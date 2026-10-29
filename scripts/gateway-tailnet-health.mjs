#!/usr/bin/env node
/**
 * Tailnet / Funnel factory-gateway health + unsigned HMAC smoke.
 *
 * Probes (no secrets required, no secrets printed):
 *   1. GET  {BASE}/health                         → 200 factory-gateway
 *   2. POST {BASE}/webhooks/port/factory_claim_next_job (unsigned) → 401
 *   3. POST {BASE}/webhooks/port/not_a_factory_tool → 404
 *   4. POST {BASE}/handlers/self-service (bad bearer) → 401
 *
 * Optional signed smoke (secret from env only — never logged):
 *   GATEWAY_HMAC_SMOKE=1 PORT_CLIENT_SECRET=…  → expect 202 on claim path
 *   FE-142 closed (signed 202 + handler-token good) — do not re-ask secrets.
 *
 * Flags:
 *   --unsigned-only  skip signed probe section entirely (regression kit)
 *
 * Does not call Port mutate APIs. Does not apply Port schema.
 * Never prints secret values.
 *
 * Usage:
 *   FACTORY_GATEWAY_BASE_URL=https://… node scripts/gateway-tailnet-health.mjs
 *   node scripts/gateway-tailnet-health.mjs --base-url https://…
 *   node scripts/gateway-tailnet-health.mjs --base-url https://… --unsigned-only
 *
 * @see docs/gateway-hmac-smoke.md
 * @see docs/beads-admit-gateway-path.md
 * @see docs/ops/beads-gateway-unsigned-admit.md
 */
import { createHmac } from "node:crypto";

const DEFAULT_CLAIM = "factory_claim_next_job";
const FETCH_TIMEOUT_MS = 15_000;

function usage() {
  console.error(`Usage:
  FACTORY_GATEWAY_BASE_URL=<url> node scripts/gateway-tailnet-health.mjs
  node scripts/gateway-tailnet-health.mjs --base-url <url> [--unsigned-only]

Unsigned HMAC / allowlist / SS probes always run.
--unsigned-only skips the signed-smoke section (FE-142 closed; no secret ask).
Optional: GATEWAY_HMAC_SMOKE=1 + PORT_CLIENT_SECRET → signed claim expect 202.
Never prints secret values. Never calls Port mutate APIs.`);
}

function normalizeBaseUrl(raw) {
  const trimmed = String(raw ?? "").trim().replace(/\/+$/, "");
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
  let unsignedOnly = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }
    if (arg === "--unsigned-only") {
      unsignedOnly = true;
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
    usage();
    process.exit(2);
  }
  return { baseUrl, unsignedOnly };
}

function sign(secret, timestamp, rawBody) {
  const digest = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("base64");
  return `v1,${digest}`;
}

async function fetchJson(url, init = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }
    return { status: res.status, text, json };
  } finally {
    clearTimeout(timer);
  }
}

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  return false;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
  return true;
}

async function probeHealth(baseUrl) {
  console.log("\n== 1. Health ==");
  const url = `${baseUrl}/health`;
  console.log(`GET ${url}`);
  let res;
  try {
    res = await fetchJson(url);
  } catch (err) {
    return fail(`health unreachable (${err?.cause?.code || err?.name || "error"})`);
  }
  console.log(`HTTP ${res.status}`);
  if (res.status !== 200) return fail(`expected HTTP 200, got ${res.status}`);
  if (res.json?.ok !== true || res.json?.service !== "factory-gateway") {
    return fail('expected {"ok":true,"service":"factory-gateway"}');
  }
  if (res.json) console.log(JSON.stringify(res.json));
  return ok("gateway health");
}

async function probeUnsignedClaim(baseUrl) {
  console.log("\n== 2. Unsigned claim (expect 401) ==");
  const url = `${baseUrl}/webhooks/port/${DEFAULT_CLAIM}`;
  console.log(`POST ${url} (no signature headers)`);
  const body = JSON.stringify({ action: DEFAULT_CLAIM, runId: "tailnet-health-unsigned" });
  let res;
  try {
    res = await fetchJson(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
  } catch (err) {
    return fail(`unsigned claim unreachable (${err?.name || "error"})`);
  }
  console.log(`HTTP ${res.status} error=${res.json?.error ?? "(none)"}`);
  if (res.status !== 401) return fail(`expected 401, got ${res.status}`);
  if (res.json?.error !== "invalid_port_signature") {
    return fail(`expected error invalid_port_signature, got ${res.json?.error}`);
  }
  return ok("HMAC gate rejects unsigned (no enqueue)");
}

async function probeUnknownPath(baseUrl) {
  console.log("\n== 3. Unknown path (expect 404) ==");
  const url = `${baseUrl}/webhooks/port/not_a_factory_tool`;
  console.log(`POST ${url}`);
  let res;
  try {
    res = await fetchJson(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
  } catch (err) {
    return fail(`unknown-path unreachable (${err?.name || "error"})`);
  }
  console.log(`HTTP ${res.status} error=${res.json?.error ?? "(none)"}`);
  if (res.status !== 404) return fail(`expected 404, got ${res.status}`);
  if (res.json?.error !== "not_found") {
    return fail(`expected error not_found, got ${res.json?.error}`);
  }
  return ok("allowlist rejects non-factory_* path");
}

async function probeBadBearer(baseUrl) {
  console.log("\n== 4. Self-service bad bearer (expect 401) ==");
  const url = `${baseUrl}/handlers/self-service`;
  console.log(`POST ${url} Authorization: Bearer bad`);
  let res;
  try {
    res = await fetchJson(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer bad",
      },
      body: "{}",
    });
  } catch (err) {
    return fail(`self-service unreachable (${err?.name || "error"})`);
  }
  console.log(`HTTP ${res.status} error=${res.json?.error ?? "(none)"}`);
  if (res.status !== 401) return fail(`expected 401, got ${res.status}`);
  return ok("SS bearer gate rejects bad token");
}

async function probeSignedClaim(baseUrl) {
  console.log("\n== 5. Signed claim (optional GATEWAY_HMAC_SMOKE) ==");
  const secret = process.env.PORT_CLIENT_SECRET || "";
  if (!secret) {
    console.log("SKIP: PORT_CLIENT_SECRET unset — signed smoke not run (secret never printed).");
    return true;
  }
  console.log("PORT_CLIENT_SECRET: present (value not printed)");
  const timestamp = String(Math.floor(Date.now() / 1000));
  const rawBody = JSON.stringify({
    action: DEFAULT_CLAIM,
    runId: `tailnet-hmac-smoke-${timestamp}`,
  });
  const signature = sign(secret, timestamp, rawBody);
  const url = `${baseUrl}/webhooks/port/${DEFAULT_CLAIM}`;
  console.log(`POST ${url} (HMAC headers set; digest not printed)`);
  let res;
  try {
    res = await fetchJson(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-port-timestamp": timestamp,
        "x-port-signature": signature,
      },
      body: rawBody,
    });
  } catch (err) {
    return fail(`signed claim unreachable (${err?.name || "error"})`);
  }
  console.log(
    `HTTP ${res.status} ok=${res.json?.ok ?? "?"} action=${res.json?.actionIdentifier ?? "(none)"}`,
  );
  if (res.status === 401) {
    return fail(
      "signed request still 401 — desktop gateway PORT_CLIENT_SECRET likely mismatched vs Port Client Secret",
    );
  }
  if (res.status !== 202 || res.json?.ok !== true) {
    return fail(`expected 202 {ok:true}, got HTTP ${res.status}`);
  }
  return ok("signed claim → 202 enqueue (HMAC match)");
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  const baseUrl = normalizeBaseUrl(parsed.baseUrl);
  const unsignedOnly = parsed.unsignedOnly;
  if (!baseUrl) {
    console.error(
      "FAIL: set FACTORY_GATEWAY_BASE_URL or pass --base-url <url> (no trailing slash).",
    );
    usage();
    process.exit(2);
  }

  console.log("gateway-tailnet-health — Funnel/tailnet probes (no Port mutate, no schema apply)");
  console.log(`BASE_URL=${baseUrl}`);
  console.log(
    "Refuse: upsert_workflow / upsert_entity / upsert_blueprint / trigger_run / EI create-delete-revoke",
  );
  if (unsignedOnly) {
    console.log("Mode: --unsigned-only (FE-142 closed; signed section skipped)");
  }

  const results = [
    await probeHealth(baseUrl),
    await probeUnsignedClaim(baseUrl),
    await probeUnknownPath(baseUrl),
    await probeBadBearer(baseUrl),
  ];

  const wantSigned =
    !unsignedOnly &&
    (process.env.GATEWAY_HMAC_SMOKE === "1" ||
      process.env.GATEWAY_HMAC_SMOKE === "true");
  if (unsignedOnly) {
    console.log(
      "\n== 5. Signed claim ==\nSKIP: --unsigned-only (FE-142 closed; do not re-ask secrets).",
    );
  } else if (wantSigned) {
    results.push(await probeSignedClaim(baseUrl));
  } else {
    console.log(
      "\n== 5. Signed claim ==\nSKIP: set GATEWAY_HMAC_SMOKE=1 and PORT_CLIENT_SECRET to run (value never printed). FE-142 already closed for PM.",
    );
  }

  const allOk = results.every(Boolean);
  console.log("\n== Summary ==");
  if (allOk) {
    console.log("OK: tailnet health + unsigned HMAC smoke green; Port left untouched.");
    process.exit(0);
  }
  console.error("FAIL: one or more probes failed — see above.");
  process.exit(1);
}

main().catch((err) => {
  console.error(`FAIL: unexpected ${err?.message || err}`);
  process.exit(1);
});
