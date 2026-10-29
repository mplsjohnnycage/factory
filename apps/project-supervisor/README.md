# project-supervisor (PBI-007 / STL-168)

Factory Meta **ProjectSupervisor**: Meta Beads ready/claim gate + duplicate-admit fencing + Port `executionContract` / `deliveryRun` / `executionAttempt` projections via §4.2.1 writer.

Lane hard rules: **Meta Beads only** · never Product Beads · Rivet never polls Port · no Port OAuth create/delete · no dual-write catalog bypass.

## Contract (factory-kernel)

| Invariant | Behavior |
|-----------|----------|
| Duplicate `work.start` | Same `workKey` → exactly one `WorkAttempt` (second admit fenced as duplicate) |
| Claim id required | Refuse admit without `ReadyTaskEvent.beadId` unless audited Port `portBypassId` |
| Port-authorized recover | `recover()` requires `portAuthorized`; preserves attempt identity + re-projects |

## Layout

| Path | Role |
|------|------|
| `src/project-supervisor.ts` | Rivet-shaped `ProjectSupervisorActor` |
| `src/meta-beads.ts` | Meta Beads gate + `MemoryMetaBeads` (CI) |
| `src/bd-meta-beads.ts` | Live `BdMetaBeads` via `bd` CLI (`factory-` only) |
| `src/admit-entry.ts` | Map gateway/dry-run JSON → `AdmitRequest` + in-process admit |
| `src/admit-http.ts` | Thin `POST /admit` + `GET /health` (no Rivet SDK) |
| `src/session-spawn.ts` | Injectable `admitAndSpawn` / `SessionSpawner` (G10 stub) |
| `src/port-projections.ts` | Port blueprint mapping via catalog writer |
| `src/memory-catalog.ts` | In-process §4.2.1 stand-in for tests |
| `../../.beads/` | Meta Beads instance config (prefix `factory`) |

## Verify (CI)

```bash
cd apps/project-supervisor
npm ci
npm run typecheck
npm test
```

## Live Meta Beads (operator / local dry-run)

```bash
# bd CLI on PATH; instance already scaffolded under .beads/
bd where
bd ready
bd update <bead-id> --claim
# Feed ReadyTaskEvent { beadId, projectId, claimedBy, claimedAt, executionContractId? }
# into ProjectSupervisorActor.admit — never Product Beads.
```

Programmatic path (no public gateway / Funnel / Port login required):

```ts
import { createBdSupervisor } from "@factory/project-supervisor";

const { supervisor, beads } = createBdSupervisor({ cwd: process.cwd() });
// beads → BdMetaBeads (spawns `bd`); catalog stays Memory until §4.2.1 writer wired
await supervisor.admit({
  projectId: "meta",
  taskId: "…",
  workKey: "…",
  portAuthorized: true,
  ready: { beadId: "factory-…", projectId: "meta", claimedBy: "ops", claimedAt: new Date().toISOString() },
  claimedBy: "ops",
});
```

CI still uses `createMemorySupervisor()` / `MemoryMetaBeads` (injectable `BdRunner` covers `BdMetaBeads` unit tests). Wire live gateway CatalogWriter + Rivet Actor host in follow-on deploy work.

## Offline admit entry (no Funnel / no Rivet host)

In-process:

```ts
import { admitFromPayload, createMemorySupervisor, listenAdmitServer } from "@factory/project-supervisor";

const { supervisor, beads } = createMemorySupervisor();
beads.seed({ beadId: "factory-…", projectId: "meta", ready: true });
await admitFromPayload(supervisor, {
  projectId: "meta",
  beadId: "factory-…",
  workKey: "demo-1",
  claimedBy: "ops",
  claimedAt: new Date().toISOString(),
});
```

HTTP dry-run (point gateway `RIVET_SUPERVISOR_URL` here — not at Rivet engine `:6420`):

```ts
const { baseUrl } = await listenAdmitServer({ supervisor });
// POST ${baseUrl}/admit  with SupervisorAdmit JSON (payload must include beadId or portBypassId)
```

Session spawn stub (Memory `AgentSessionActor` via injectable `SessionSpawner` — see `test/admit-entry.test.ts`). Docker Sandbox Agent remains operator/desktop.

## Spec

`specs/factory-kernel/spec.md` · `specs/rivet-execution/spec.md` — updated in the same PR.
