# Beads admit → factory-gateway path (public Funnel)

**Lane:** Meta only (`factory-` Beads) · **Audience:** Projects Manager  
**Purpose:** Single map of Port `gateway_admit` → Funnel gateway → ProjectSupervisor / Meta Beads claim after public `/health` is green.  
**Live base:** `https://desktop-3apdbkg.taildf3a4b.ts.net`  
**Related:** [`gateway-hmac-smoke.md`](./gateway-hmac-smoke.md) · [`ops/signed-admit-smoke.md`](./ops/signed-admit-smoke.md) · [`ops/beads-gateway-unsigned-admit.md`](./ops/beads-gateway-unsigned-admit.md) · [`meta-beads.md`](./meta-beads.md) · [`port-workflow-webhooks.md`](./port-workflow-webhooks.md)

## FE-142 (closed — no secret re-ask)

| Check | Status |
|-------|--------|
| Signed Funnel claim | **202** |
| Handler-token good bearer | **400 `action_required`** (auth OK) |
| Port org secrets | **PATCHed** |
| Cloud unsigned regression | Keep running — gates must stay 401/404 for bad auth |

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
| HMAC + handler-token (FE-142) | **Closed** — signed claim **202**; good bearer → **400 `action_required`** |
| Unsigned / bad-auth gates | **Must stay closed** — 401 `invalid_port_signature` / 404 / 401 (see ops kit) |
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
# Kit markers (offline)
npm run dry-run:gateway-unsigned
npm run dry-run:gateway-signed

# Unsigned gates + health (safe anytime Funnel is up)
npm run dry-run:gateway-unsigned -- --live
# equivalent:
node scripts/gateway-tailnet-health.mjs \
  --base-url https://desktop-3apdbkg.taildf3a4b.ts.net \
  --unsigned-only

# Signed / handler (env secrets already present — never print values)
# GATEWAY_HMAC_SMOKE=1 npm run dry-run:gateway-signed -- --live

# Remount path print-only (also refuses Port mutate)
node scripts/gateway-remount-dry-run.mjs \
  --base-url https://desktop-3apdbkg.taildf3a4b.ts.net
```

Signed claim already verified under FE-142 — ops recipe [`ops/signed-admit-smoke.md`](./ops/signed-admit-smoke.md). Do **not** re-ask for secret fill.

## Local Beads dry-run (no Funnel)

BdMetaBeads adapter readiness (markers + optional injectable-`BdRunner` tests):

```bash
npm run dry-run:bdmetabeads
npm run dry-run:bdmetabeads -- --memory
# docs: docs/ops/bdmetabeads-readiness.md
```

Supervisor admit ops kit (markers + optional Memory admit-entry tests):

```bash
npm run dry-run:supervisor-admit
npm run dry-run:supervisor-admit -- --memory
# docs: docs/ops/supervisor-admit-dry-run.md
```

Package tests (BdMetaBeads + admitFromPayload):

```bash
cd apps/project-supervisor && npm test
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

**Read / dry-run only.** Factory blueprints (`executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner`, `product`, …) already exist. Do **not** `upsert_blueprint` to advance this path — remount + HMAC/env are closed for FE-142; unsigned regression is the remaining cloud check.

## Explicit non-goals

- No Port WEBHOOK re-upsert unless Funnel host rotates  
- No Port schema apply  
- No OAuth External Interface mutate / URI prune  
- No PBI-015 / Observatory / Product Beads  
- No Sandbox Agent from browser  
- No secret re-ask (FE-142 closed)  
