# PBI-007: ProjectSupervisor + Meta Beads ready gate

## Lane
**Meta** — Factory kernel. Unit ≡ Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.

## ASDLC pointers
- **Directive:** ProjectSupervisor fencing + Beads ready gate; map Port executionContract/deliveryRun/executionAttempt projections. Wire **Meta Beads** only.
- **Spec pointer:** `factory-kernel`
- **Verification pointer:** Contract: duplicate admit → one attempt; Port-authorized recover
- **Refinement rule:** Update Spec in same PR
- **Dependencies:** PBI-005, PBI-006

## Contract core (C1–C3)
| Field | Content |
|-------|---------|
| **C1 Inputs + types** | factory-kernel Spec; Beads ready/claim API |
| **C2 Outputs + types** | admit path; Meta Beads claim→admit evidence; PR SHA |
| **C3 Write targets** | git; Linear; **Meta Beads**; Port projections via §4.2.1 writer |

## Operational body (1–13)
| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | Contract: duplicate admit → one attempt; Port-authorized recover |
| 2 | Exact task | ProjectSupervisor fencing + Beads ready gate; map Port executionContract/deliveryRun/executionAttempt projections. Wire **Meta Beads** only. |
| 3 | Directories | Rivet ProjectSupervisor; Meta Beads instance; Port projection mapping |
| 4 | What not to touch | Product Beads; product Linear boards; Port OAuth create/delete; FE-24 Feature Assembly coding beyond this unit; Product Beads; treating Beads as day-one human board before this lands |
| 5 | Skills | ASDLC; Beads coordination docs |
| 6 | MCPs | Linear; Port; Rivet; Beads CLI when instance live |
| 7 | Agent type | Coding + Cockpit for admit ops; Coding for supervisor code |
| 8 | CI requirements | invariant tests duplicate admit; claim id required |
| 9 | Dependencies | PBI-005, PBI-006 |
| 10 | Branch / worktree | `cursor/pbi-007-supervisor-beads-ade8  OR  pbi-007/supervisor-beads worktree` |
| 11 | Failure / rollback | Revert PR; do not Port-accept; reopen Linear; if Meta Beads claimed, `bd reclaim` / cancel attempt — no partial catalog dual-write |
| 12 | Reviewer | Johnny Cage (human) + adversarial CE `/ce-code-review` when coding |
| 13 | Environment prerequisites | Gateway+SA+Compose green; Meta Beads initialized (OQ-1 may scaffold earlier) |

## Also
- **Time estimate:** 2–3d
- **Secrets handling:** No secrets in Specs/git. Use env/OpenCreds vault later. Scoped tokens only for sandbox/GitHub.
- **Observability hook:** Port audit (when live) + Rivet Inspector/traces (when live) + GitHub check runs; until then Linear status + PR comments

## Sources
- `docs/factory-master-spec.md` §6
- `docs/factory-workflow.md` typed-contract body
- `docs/factory-meta-vs-product.md` (Meta lane)
