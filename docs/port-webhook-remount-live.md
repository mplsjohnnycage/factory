# Port WEBHOOK remount — LIVE (Funnel verified)

**Remounted:** 2026-10-29  
**Lane:** Meta only  
**Port MCP:** `Port-eu`  
**Base URL:** `https://desktop-3apdbkg.taildf3a4b.ts.net` (no trailing slash)  
**Health (off-tailnet):** `GET /health` → **200** `{"ok":true,"service":"factory-gateway"}`  
**Runbook:** [`remount-armed-runbook.md`](./remount-armed-runbook.md)

## Verdict

**Additive remount complete: 7 / 7 `factory_*` workflows now have a `gateway_admit` WEBHOOK** targeting  
`{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/webhooks/port/<id>`.  
All prior `api.port.io` fencing GETs/search nodes are **unchanged**. No OAuth prune. No PBI-015.

**HMAC will reject (expected 401) until Johnny sets matching gateway process env** (`PORT_CLIENT_SECRET` + `FACTORY_GATEWAY_HANDLER_TOKEN`) and Port org secrets (below). Admit nodes use `onFailure: continue` so catalog writes still succeed while secrets are unmatched.

## Johnny action (one line)

Port UI → Credentials → Secrets: set `FACTORY_GATEWAY_BASE_URL=https://desktop-3apdbkg.taildf3a4b.ts.net`, set/create `FACTORY_GATEWAY_HANDLER_TOKEN` to a random bearer, and on DESKTOP-3APDBKG gateway process export the **same** `FACTORY_GATEWAY_HANDLER_TOKEN` plus `PORT_CLIENT_SECRET` = Port Client Secret (HMAC) — then restart gateway.

## Secrets status

| Secret / env | Where | This agent |
|--------------|-------|------------|
| `FACTORY_GATEWAY_BASE_URL` | Port org secret | **Not upsertable via Port MCP** (no secrets tool). Johnny must set in UI (value above). |
| `FACTORY_GATEWAY_HANDLER_TOKEN` | Port org secret ↔ gateway env | **Not known / not creatable from MCP.** Generate once; mirror both sides. |
| Port Client Secret ↔ `PORT_CLIENT_SECRET` | Port credentials ↔ gateway env | **Desktop gateway process still lacks these** (assignment). Unsigned/mismatch POSTs → `401 invalid_port_signature`. |

Port MCP has **no** secret upsert; UI/API only.

## Exact workflow changes (additive only)

| Workflow | Attach after | New node URL | Fencing hosts (unchanged) |
|----------|--------------|--------------|---------------------------|
| `factory_claim_next_job` | `advance_run` | `…/webhooks/port/factory_claim_next_job` | `fetch_runner`, `find_job`, `fetch_attempt` → `api.port.io` |
| `factory_heartbeat` | `runner_beat` | `…/webhooks/port/factory_heartbeat` | `fetch_attempt` → `api.port.io` |
| `factory_submit_evidence` | `record` → then `route` | `…/webhooks/port/factory_submit_evidence` | `fetch_attempt`, `fetch_run` → `api.port.io` |
| `factory_create_execution_contract` | `upsert_contract` | `…/webhooks/port/factory_create_execution_contract` | `fetch_existing`, `fetch_product` → `api.port.io` |
| `factory_start_delivery_run` | `create_run` | `…/webhooks/port/factory_start_delivery_run` | `fetch_contract`, `fetch_existing` → `api.port.io` |
| `factory_record_review_verdict` | `record_verdict` | `…/webhooks/port/factory_record_review_verdict` | `fetch_attempt`, `fetch_run` → `api.port.io` |
| `factory_request_release` | `mark_pending` → then `approval` | `…/webhooks/port/factory_request_release` | `fetch_run`, `recheck_run` → `api.port.io` |

### Shared `gateway_admit` node shape

- `identifier`: `gateway_admit`
- `title`: `factory-gateway admit`
- `config.type`: `WEBHOOK`
- `config.method`: `POST`
- `config.synchronized`: `true`
- `config.agent`: `false`
- `config.onFailure`: `continue` (best-effort until HMAC/env match)
- `config.onTimeout`: `fail`
- `config.headers`: `Content-Type: application/json`
- Body includes `"action": "<factory_*>"` plus run/trigger fields
- Port classic HMAC signing is automatic on outbound WEBHOOKs (Client Secret)

## Smoke (no valid HMAC)

| Probe | Result |
|-------|--------|
| `GET …/health` | **200** `{"ok":true,"service":"factory-gateway"}` |
| `POST …/webhooks/port/factory_claim_next_job` (unsigned JSON) | **401** `{"ok":false,"error":"invalid_port_signature"}` |
| `POST …/webhooks/port/not_a_factory_tool` | **404** `{"ok":false,"error":"not_found"}` |
| `POST …/handlers/self-service` (Bearer `bad`) | **401** |
| Port `get_workflow` × 7 | Each has exactly one Funnel-templated `gateway_admit`; fencing still `api.port.io` |

No live `trigger_run` of `factory_*` this pass (would mutate catalog / need fixtures). Meta SS already templated to same base secret.

## Explicit non-goals (held)

- No prune of OAuth 5th redirect URI (`n5tdoht4l`)
- No PBI-015
- No Observatory
- No replace of `api.port.io` fencing WEBHOOKs
- No External Interface create/delete/revoke

## Related

- [`funnel-remount-status.md`](./funnel-remount-status.md)  
- [`port-factory-workflows-live.md`](./port-factory-workflows-live.md)  
- [`morning-parallel-sprint.md`](./morning-parallel-sprint.md)  
