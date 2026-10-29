# Port `factory_*` WEBHOOK → factory-gateway

**Lane:** Meta  
**Spec:** `specs/port-governance/spec.md`, `specs/rivet-execution/spec.md`, ADR-003  
**Gateway:** `apps/factory-gateway` — `POST /webhooks/port` (+ allowlisted `/webhooks/port/<factory_*>`)

## Verdict (2026-10-29)

| Layer | Status |
|-------|--------|
| Live Port `factory_*` workflows (7) | **Prepared** — published self-service / MCP tools |
| Live WEBHOOK **nodes** inside those workflows | Point at **`https://api.port.io/v1/...`** (Port self-API reads), **not** factory-gateway |
| Catalog mutations in those workflows | **`UPSERT_ENTITY`** in Port (bypasses §4.2.1 gateway writer) |
| Gateway HMAC → ProjectSupervisor enqueue | **Proven in-repo** (unit + HTTP proof tests) |
| Live Port → deployed gateway hop | **Not wired** — no public gateway URL bound in Port |

**Do not remount live WEBHOOK URLs onto gateway until a reachable `FACTORY_GATEWAY_BASE_URL` exists.** Remounting to a dead URL would break the Software Factory tools.

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

Every WEBHOOK node URL observed 2026-10-29 targets Port’s own API (entity GET/search). Examples:

| Workflow | WEBHOOK node role | URL host |
|----------|-------------------|----------|
| `factory_claim_next_job` | `fetch_runner`, `find_job`, `fetch_attempt` | `api.port.io` |
| `factory_heartbeat` | `fetch_attempt` | `api.port.io` |
| `factory_submit_evidence` | `fetch_attempt`, `fetch_run` | `api.port.io` |
| `factory_start_delivery_run` | `fetch_contract`, `fetch_existing` | `api.port.io` |
| `factory_create_execution_contract` | `fetch_existing`, `fetch_product` | `api.port.io` |
| `factory_record_review_verdict` | `fetch_attempt`, `fetch_run` | `api.port.io` |
| `factory_request_release` | `fetch_run`, `recheck_run` | `api.port.io` |

Writes remain `UPSERT_ENTITY` / `INPUT` (release Johnny-only). **Zero** nodes target `POST /webhooks/port`.

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

## Operator remount (blocked on deploy)

When a Meta gateway is reachable (Tailscale Serve / operator host — not Vercel CI / OAuth work):

1. Set `PORT_CLIENT_SECRET` to the Port classic webhook / External Interface client secret used for signatures.
2. Optional: `RIVET_SUPERVISOR_URL` to forward admits.
3. Add (or retarget) a synchronized WEBHOOK node on coding-admit workflows to:  
   `{FACTORY_GATEWAY_BASE_URL}/webhooks/port/<factory_*>`  
   with Port HMAC enabled. Prefer a **new** notify/admit node after lease write — do not blindly replace Port self-API GETs used for fencing reads.
4. Route privileged catalog applies through gateway `POST /catalog/write` / `claim-next` (separate from this WEBHOOK proof).
5. Re-run Port `trigger_run` smoke only after health `GET /health` is green from Port’s network path.

## Explicit non-goals (this unit)

- No Port External Interface OAuth create/delete/revoke.
- No `.beads/` / Dolt mutations.
- No Vercel CI / `.github/workflows` changes.
- No live Port workflow upsert until gateway URL is real.
