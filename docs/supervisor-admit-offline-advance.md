# Supervisor admit — offline advance (G6/G10)

**When:** 2026-10-29  
**Lane:** Meta · public `mplsjohnnycage/factory`  
**Worker:** bc-fe41ecc7-2524-5059-9741-ce4813c8fa95  
**Constraint honored:** no WEBHOOK remount · no OAuth URI prune · no PBI-015 · no Observatory · no desktop/Funnel/Rivet host

---

## Verdict

**Shipped code that closes the G6 library gap** (HTTP/in-process admit entry on `createBdSupervisor` / Memory) **and a thin G10 Memory spawn stub.**  
Live Port→gateway→Rivet→Docker Sandbox fire remains **ops/desktop-blocked** (Funnel + Rivet Serve/Actor + Docker) — not this PR.

| Gap (from morning docs) | After this PR |
|-------------------------|---------------|
| G7 — `BdMetaBeads` | **Already closed** on `main` via [#46](https://github.com/mplsjohnnycage/factory/pull/46) |
| G6 — no admit consumer for `RIVET_SUPERVISOR_URL` | **Closed in library** — `admitFromPayload` + `POST /admit` |
| G10 — supervisor → AgentSessionActor | **Partial (Memory stub)** — `admitAndSpawn` + injectable `SessionSpawner` |
| G1 Funnel / public gateway | **Still blocked** (Johnny desktop) |
| G5 Rivet Compose/Serve host | **Still blocked** (ops) |
| G8 coding-work beads | **Unchanged** (ops) |
| G9 Docker SA live | **Still blocked** (ops) |

**One-liner if asking “blocked only on desktop?”:** Live end-to-end admit fire yes (Funnel + Rivet/Docker); offline admit dry-run **no** — code path is testable without desktop.

---

## What shipped

**Branch:** `cursor/supervisor-admit-offline-fa95`  
**PR:** [#48](https://github.com/mplsjohnnycage/factory/pull/48)  
**SHA:** `77f4533`  
**Verify:** `cd apps/project-supervisor && npm ci && npm run typecheck && npm test` → **24/24 pass**

| Artifact | Role |
|----------|------|
| `src/admit-entry.ts` | Unwrap gateway `SupervisorAdmit` / flat dry-run → `AdmitRequest`; refuse incomplete |
| `src/admit-http.ts` | `createAdmitServer` / `listenAdmitServer` — `GET /health`, `POST /admit` |
| `src/session-spawn.ts` | `admitAndSpawn` + `SessionSpawnRegistry` (no sandbox package dep) |
| `test/admit-entry.test.ts` | Memory admit, Bd mock admit, HTTP listen, Memory `AgentSessionActor` spawn + kill identity |
| `specs/factory-kernel/spec.md` · `specs/rivet-execution/spec.md` · README · `docs/meta-beads.md` | Contract + operator notes |

### Admit entry semantics

- Default `projectId` = `meta`; `portAuthorized` defaults **true** for offline (gateway HMAC already gated live path).
- Require `beadId`/`ready` **or** `portBypassId` — opaque `{action,runId}` → `claim_or_bypass_required` (400 on HTTP).
- `workKey` from `workKey` → `runId` → `actionIdentifier:admitId` → `admitId`.
- Point local gateway `RIVET_SUPERVISOR_URL` at `http://127.0.0.1:<port>/admit` — Compose Rivet engine `:6420` is **not** an admit consumer.

### G10 stub semantics

- Successful **non-duplicate** admit → `SessionSpawner.spawn`.
- Duplicate `workKey` → no re-spawn; returns prior session if registry knows it.
- Tests wire real `AgentSessionActor` + `MemorySandboxLease` from `apps/sandbox-harness` (relative import in test only).
- Docker / Rivet Actor host / `ANTHROPIC_API_KEY` out of scope.

---

## Still needs Johnny / desktop

- **Funnel + `FACTORY_GATEWAY_BASE_URL` + WEBHOOK remount** — do not remount onto a dead URL.
- **Rivet Compose/Serve + Actor host** for production supervisor (this PR is library + thin HTTP only).
- **Docker Sandbox Agent** for live G9/G10.
- **Independent review** — author ≠ reviewer (repo: PR+1 APPROVE). Review request: [`supervisor-admit-offline-review-request.md`](./supervisor-admit-offline-review-request.md).

---

## Explicit non-actions

- No Port WEBHOOK upsert / remount  
- No OAuth create/delete/revoke / redirect prune  
- No PBI-015 / CE compound  
- No Observatory  
- No `bd dolt push` / live claim on origin Dolt  

---

## Related store docs

- [`m1-morning-gap-map.md`](./m1-morning-gap-map.md) (G6/G10)  
- [`supervisor-morning-ready.md`](./supervisor-morning-ready.md)  
- [`beads-admit-offline-advance.md`](./beads-admit-offline-advance.md) (#46)  
- Explore scratch: `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/internal/g6-g10-offline-admit-explore.md`
