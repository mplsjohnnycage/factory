# Gateway remount dry-run kit

**Lane:** Meta  
**Purpose:** Operator preflight before Port → `factory-gateway` WEBHOOK remount  
**Script:** `scripts/gateway-remount-dry-run.mjs`  
**Related:** [`docs/port-workflow-webhooks.md`](./port-workflow-webhooks.md)

## Verdict

This kit **only** checks that a candidate `FACTORY_GATEWAY_BASE_URL` answers `GET /health` and prints the expected `factory_*` WEBHOOK paths. It **does not** call Port mutate APIs, upsert workflows, or flip live remount.

Hard constraint (FE-106): **do not remount** live WEBHOOK URLs onto a dead base URL.

## Prerequisites

1. Gateway process reachable (local `:8787`, Tailscale Funnel, or other public HTTPS).
2. From the same network path Port will use (prefer a non-tailnet client for Funnel).
3. Base URL **without** trailing slash.

## Usage

```bash
# Env form
FACTORY_GATEWAY_BASE_URL=https://desktop.example.ts.net \
  node scripts/gateway-remount-dry-run.mjs

# Flag form
node scripts/gateway-remount-dry-run.mjs \
  --base-url https://desktop.example.ts.net

# Local process (before Funnel)
FACTORY_GATEWAY_BASE_URL=http://127.0.0.1:8787 \
  node scripts/gateway-remount-dry-run.mjs
```

### Exit codes

| Code | Meaning |
|------|---------|
| `0` | `/health` returned 200 with `{"ok":true,"service":"factory-gateway"}`; paths printed |
| `1` | Health failed (unreachable, non-200, or wrong body) — **do not remount** |
| `2` | Bad / missing args |

## What it prints

1. Explicit refuse of Port mutate APIs (`upsert_workflow`, `upsert_entity`, `trigger_run`, EI create/delete/revoke).
2. Expected paths for all seven canonical `factory_*` IDs:

```
GET  {BASE}/health
POST {BASE}/webhooks/port
POST {BASE}/webhooks/port/factory_create_execution_contract
POST {BASE}/webhooks/port/factory_start_delivery_run
POST {BASE}/webhooks/port/factory_claim_next_job
POST {BASE}/webhooks/port/factory_heartbeat
POST {BASE}/webhooks/port/factory_submit_evidence
POST {BASE}/webhooks/port/factory_record_review_verdict
POST {BASE}/webhooks/port/factory_request_release
POST {BASE}/handlers/self-service
```

3. Curl result for `{BASE}/health`.

## After a green dry-run (human / operator — not this script)

1. Set Port secrets: `FACTORY_GATEWAY_BASE_URL`, `FACTORY_GATEWAY_HANDLER_TOKEN` (match gateway env).
2. Remount **only** admit/notify WEBHOOK nodes → `{BASE}/webhooks/port/<factory_*>` with Port HMAC on.
3. Prefer a **new** node after lease write — do **not** replace Port self-API GET fencing nodes (`api.port.io`).
4. Smoke with Port `trigger_run` / self-service only after health stays green from Port’s network path.

Auth still required: Funnel ≠ auth. Keep `PORT_CLIENT_SECRET` HMAC and SS bearer.

## Explicit non-goals

- No live Port workflow upsert / remount from this kit  
- No Port External Interface OAuth create/delete/revoke  
- No Sandbox Agent / browser calls  
- No treating `factory-developer-os` or `factory-meta-ci` as the gateway base URL  
