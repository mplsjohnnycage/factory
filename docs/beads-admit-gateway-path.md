# Beads admit → factory-gateway path (public Funnel)

**Lane:** Meta only (`factory-` Beads)  
**Purpose:** Single map of Port `gateway_admit` → Funnel gateway → ProjectSupervisor / Meta Beads claim after public `/health` is green.  
**Live base:** `https://desktop-3apdbkg.taildf3a4b.ts.net`  
**Related:** [`gateway-hmac-smoke.md`](./gateway-hmac-smoke.md) · [`meta-beads.md`](./meta-beads.md) · [`port-workflow-webhooks.md`](./port-workflow-webhooks.md)

## End-to-end chain

```text
Port factory_* workflow (lease/write on Port)
  → additive WEBHOOK gateway_admit (HMAC)
  → Funnel https://…ts.net/webhooks/port/<factory_*>
  → factory-gateway verifies PORT_CLIENT_SECRET
  → ProjectSupervisorQueue.enqueue (push-only; Rivet never polls Port)
  → optional POST RIVET_SUPERVISOR_URL  (= supervisor POST /admit)
  → admitFromPayload → createBdSupervisor / BdMetaBeads
  → bd ready / bd update --claim  (prefix factory- only)
```

| Hop | Status (2026-10-29) |
|-----|---------------------|
| Funnel `GET /health` (off-tailnet) | **Live** — `factory-gateway` |
| Additive `gateway_admit` on 7 `factory_*` | **Live** — URL templated on `FACTORY_GATEWAY_BASE_URL` |
| Fencing GETs (`api.port.io`) | **Unchanged** — never retarget to gateway |
| HMAC match desktop ↔ Port | **Pending Johnny** — unsigned → 401 (expected) |
| `RIVET_SUPERVISOR_URL` → `POST /admit` | **Library ready** ([#48](https://github.com/mplsjohnnycage/factory/pull/48)); host/Serve still ops |
| `BdMetaBeads` adapter | **Library ready** ([#46](https://github.com/mplsjohnnycage/factory/pull/46)) |
| Coding-work ready beads | **Ops** — morning ready set is Meta scaffolding |

## What gateway enqueue carries

From `gateway_admit` body (claim example):

- `action` / path → allowlisted `actionIdentifier` (`factory_claim_next_job`, …)
- `runId`, `role`, `runner`, `deliveryRun`, `idempotencyKey`

Gateway wraps as `SupervisorAdmit` `{ id, receivedAt, actionIdentifier, runId, payload }`. Supervisor `admitFromPayload` still requires **`beadId` (ready)** or audited **`portBypassId`** in the payload — Port notify alone does not invent a Meta Bead. Wire bead fields in a later contract refinement **in Spec + same PR**; do not invent Product Beads ids.

## Operator health (no remount)

```bash
# Unsigned gates + health (safe anytime Funnel is up)
node scripts/gateway-tailnet-health.mjs \
  --base-url https://desktop-3apdbkg.taildf3a4b.ts.net

# Remount path print-only (also refuses Port mutate)
node scripts/gateway-remount-dry-run.mjs \
  --base-url https://desktop-3apdbkg.taildf3a4b.ts.net
```

After secrets match: set `GATEWAY_HMAC_SMOKE=1` + `PORT_CLIENT_SECRET` (never print) for **202** signed claim — see [`gateway-hmac-smoke.md`](./gateway-hmac-smoke.md).

## Local Beads dry-run (no Funnel)

```bash
cd apps/project-supervisor && npm test   # BdMetaBeads + admitFromPayload
# or: createBdSupervisor({ cwd }) + admit with factory-* beadId
```

Point a local gateway at a local admit HTTP listener only when testing forward:

```bash
# supervisor listenAdmitServer → http://127.0.0.1:<port>/admit
export RIVET_SUPERVISOR_URL=http://127.0.0.1:<port>/admit
# then signed smoke against that gateway process
```

Compose Rivet engine `:6420` is **not** an admit consumer.

## Port schema

**Read / dry-run only this tick.** Factory blueprints (`executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner`, `product`, …) already exist. Do **not** `upsert_blueprint` to advance this path — remount + HMAC/env are the blockers, not schema.

## Explicit non-goals

- No Port WEBHOOK re-upsert unless Funnel host rotates  
- No Port schema apply  
- No OAuth External Interface mutate / URI prune  
- No PBI-015 / Observatory / Product Beads  
- No Sandbox Agent from browser  
