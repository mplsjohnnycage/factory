# Port `factory_*` WEBHOOK → factory-gateway

**Lane:** Meta  
**Spec:** `specs/port-governance/spec.md`, `specs/rivet-execution/spec.md`, ADR-003  
**Gateway:** `apps/factory-gateway` — `POST /webhooks/port` (+ allowlisted `/webhooks/port/<factory_*>`)

## Verdict (2026-10-29 — remount live, HMAC pending)

| Layer | Status |
|-------|--------|
| Live Port `factory_*` workflows (7) | **Published** — Software Factory tools |
| Fencing WEBHOOK **nodes** (GET/search) | Still **`https://api.port.io/v1/...`** — never retargeted |
| Additive `gateway_admit` WEBHOOK (7/7) | **Live** → `{{ .secrets["FACTORY_GATEWAY_BASE_URL"] }}/webhooks/port/<id>` |
| Public Funnel `/health` | **Green** — `https://desktop-3apdbkg.taildf3a4b.ts.net` |
| Catalog mutations in those workflows | **`UPSERT_ENTITY`** in Port (bypasses §4.2.1 gateway writer) |
| Gateway HMAC → ProjectSupervisor enqueue | **Proven in-repo** + unsigned Funnel **401** smoke |
| HMAC secret match (desktop ↔ Port) | **Pending Johnny** — expect 401 until `PORT_CLIENT_SECRET` mirrored |

**Do not remount onto a dead Funnel URL.** Re-upsert `gateway_admit` only if the Funnel hostname rotates. HMAC smoke + Beads path: [`gateway-hmac-smoke.md`](./gateway-hmac-smoke.md) · [`beads-admit-gateway-path.md`](./beads-admit-gateway-path.md).

## Canonical workflow IDs (do not invent)

```
factory_create_execution_contract
factory_start_delivery_run
factory_claim_next_job
factory_heartbeat
factory_submit_evidence
factory_record_review_verdict
factory_request_release
```

## Live WEBHOOK inventory (read-only Port MCP)

**Fencing** WEBHOOK nodes still target Port’s own API (entity GET/search). **Additive** `gateway_admit` notifies the Funnel gateway after the last successful write.

| Workflow | Fencing WEBHOOK role | Fencing host | Admit node |
|----------|----------------------|--------------|------------|
| `factory_claim_next_job` | `fetch_runner`, `find_job`, `fetch_attempt` | `api.port.io` | `gateway_admit` → Funnel `/webhooks/port/factory_claim_next_job` |
| `factory_heartbeat` | `fetch_attempt` | `api.port.io` | `gateway_admit` |
| `factory_submit_evidence` | `fetch_attempt`, `fetch_run` | `api.port.io` | `gateway_admit` |
| `factory_start_delivery_run` | `fetch_contract`, `fetch_existing` | `api.port.io` | `gateway_admit` |
| `factory_create_execution_contract` | `fetch_existing`, `fetch_product` | `api.port.io` | `gateway_admit` |
| `factory_record_review_verdict` | `fetch_attempt`, `fetch_run` | `api.port.io` | `gateway_admit` |
| `factory_request_release` | `fetch_run`, `recheck_run` | `api.port.io` | `gateway_admit` |

Writes remain `UPSERT_ENTITY` / `INPUT` (release Johnny-only). Admit nodes use `onFailure: continue` until HMAC/env match.

## Gateway contract (proven)

1. Port signs `${timestamp}.${rawBody}` HMAC-SHA-256 → `x-port-signature: v1,<base64>` + `x-port-timestamp`.
2. Gateway verifies with `PORT_CLIENT_SECRET`; invalid → **401**, no enqueue.
3. Valid → **202** `{ ok, admitId, actionIdentifier }` and push-only ProjectSupervisor enqueue (Rivet never polls Port).
4. Optional path form for Port WEBHOOK templates:  
   `POST {GATEWAY}/webhooks/port/factory_claim_next_job`  
   (only allowlisted `factory_*` IDs; others **404**).

### Prove locally

```bash
cd apps/factory-gateway
npm ci
npm run typecheck
npm test
# HTTP proof suite: test/webhooks-port.test.ts
```

## Operator remount (done) + next smoke

Additive remount is complete. Remaining:

1. Set Port secret `FACTORY_GATEWAY_BASE_URL` to the Funnel origin (UI — MCP has no secrets tool).
2. Mirror `PORT_CLIENT_SECRET` + `FACTORY_GATEWAY_HANDLER_TOKEN` onto the desktop gateway process; restart.
3. Optional: `RIVET_SUPERVISOR_URL` → supervisor `POST /admit` (not Rivet engine `:6420`).
4. Run `node scripts/gateway-tailnet-health.mjs --base-url …` then optional `GATEWAY_HMAC_SMOKE=1` signed probe ([`gateway-hmac-smoke.md`](./gateway-hmac-smoke.md)).
5. Johnny-approved `trigger_run` of one `factory_*` only after signed **202**.

Do **not** replace Port self-API GET fencing nodes with gateway URLs. Do **not** apply new Port blueprint schema for this hop.

## Catalog writer backend — workflow store (code landed, cutover pending)

Decision 2026-10-30 (owner-queue item 9): gateway catalog persistence follows the spec — option (b). `apps/factory-gateway` now ships `WorkflowCatalogStore` behind `FACTORY_CATALOG_STORE=workflow`: the §4.2.1 writer stays the single-writer fence, and the Port upsert is performed by the workflow path's `UPSERT_ENTITY` node via the round-trip envelopes (`catalog_read` / `catalog_upsert` → `PORT_CATALOG_WORKFLOW_URL`). The gateway holds no Port REST credential. **Live state above is unchanged until cutover:** the workflows' own `UPSERT_ENTITY` nodes still write directly; cutover = repoint the fencing path through the gateway round-trip + set the env pair on the gateway host + restart + one approved smoke run.

## Explicit non-goals (this unit)

- No Port External Interface OAuth create/delete/revoke.
- No `.beads/` / Dolt mutations.
- No Vercel CI / `.github/workflows` changes.
- No Port `upsert_blueprint` / schema apply for gateway admit.
