# PBI-007 / STL-168 — ProjectSupervisor + Meta Beads ready gate

Mirror of Linear [STL-168](https://linear.app/johnny-cage/issue/STL-168).

## Delivered in this PR

| Artifact | Path |
|----------|------|
| Supervisor package | `apps/project-supervisor/` |
| Duplicate-admit fence | `src/project-supervisor.ts` |
| Meta Beads gate | `src/meta-beads.ts` (`MemoryMetaBeads` for CI) |
| Port projections | `src/port-projections.ts` → `executionContract` / `deliveryRun` / `executionAttempt` |
| Meta Beads instance | `.beads/` (config + metadata; prefix `factory`) |
| Unit tests | `apps/project-supervisor/test/` |
| CI | `.github/workflows/project-supervisor.yml` |
| Spec | `specs/factory-kernel/spec.md` |

## Verification

- `cd apps/project-supervisor && npm ci && npm run typecheck && npm test`
- Invariants: duplicate admit → one attempt; claim id required; Port-authorized recover
- No Product Beads; no Port OAuth create/delete; catalog projections via §4.2.1-shaped writer only
