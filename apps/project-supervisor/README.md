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

## Live Meta Beads (operator)

```bash
# bd CLI on PATH; instance already scaffolded under .beads/
bd where
bd ready
bd update <bead-id> --claim
# Feed ReadyTaskEvent { beadId, projectId, claimedBy, claimedAt, executionContractId? }
# into ProjectSupervisorActor.admit — never Product Beads.
```

Wire live gateway CatalogWriter + Rivet Actor host in follow-on deploy work. Memory path covers CI AC.

## Spec

`specs/factory-kernel/spec.md` — updated in the same PR.
