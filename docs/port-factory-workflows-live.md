# Port factory_* workflows — live WEBHOOK target audit

**Checked:** 2026-10-29 (post remount, Port MCP `Port-eu`)  
**Lane:** Meta only  
**Tools used:** `get_workflow` × 7 after additive `upsert_workflow`  
**Remount evidence:** [`port-webhook-remount-live.md`](./port-webhook-remount-live.md)

## Verdict

**7 / 7 `factory_*` workflows have additive `gateway_admit` WEBHOOK** →  
`{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/webhooks/port/<factory_*>`.  

**Fencing GETs/search still target `https://api.port.io/v1/...` only** — never replaced.  
Catalog writes remain in-graph `UPSERT_ENTITY`. Self-service triggers still published.

## Workflow id → WEBHOOK target status

| Workflow id | Fencing WEBHOOK(s) | Admit notify |
|-------------|-------------------|--------------|
| `factory_claim_next_job` | `fetch_runner`, `find_job`, `fetch_attempt` → **self-API** | `gateway_admit` → Funnel secret `/webhooks/port/factory_claim_next_job` |
| `factory_heartbeat` | `fetch_attempt` → **self-API** | `gateway_admit` → `…/factory_heartbeat` |
| `factory_submit_evidence` | `fetch_attempt`, `fetch_run` → **self-API** | `gateway_admit` → `…/factory_submit_evidence` |
| `factory_create_execution_contract` | `fetch_existing`, `fetch_product` → **self-API** | `gateway_admit` → `…/factory_create_execution_contract` |
| `factory_start_delivery_run` | `fetch_contract`, `fetch_existing` → **self-API** | `gateway_admit` → `…/factory_start_delivery_run` |
| `factory_record_review_verdict` | `fetch_attempt`, `fetch_run` → **self-API** | `gateway_admit` → `…/factory_record_review_verdict` |
| `factory_request_release` | `fetch_run`, `recheck_run` → **self-API** | `gateway_admit` → `…/factory_request_release` |

### Counts

| Bucket | Count |
|--------|------:|
| `factory_*` workflows | 7 |
| With fencing on `api.port.io` | **7** |
| With gateway `gateway_admit` notify | **7** |

## Notes

- Admit `onFailure: continue` until Johnny matches Port Client Secret ↔ `PORT_CLIENT_SECRET` and sets `FACTORY_GATEWAY_BASE_URL` + handler token.  
- Unsigned Funnel probe: **401** `invalid_port_signature` (expected).  
- No OAuth prune; no PBI-015; no Observatory.
