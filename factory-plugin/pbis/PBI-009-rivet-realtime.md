# PBI-009: Rivet native realtime in Developer OS

## Lane
**Meta** — Factory kernel. Unit ≡ Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.

## ASDLC pointers
- **Directive:** Wire Rivet Actor native realtime client into Developer OS session view (no CopilotKit).
- **Spec pointer:** `developer-os, rivet-execution`
- **Verification pointer:** Contract: reconnect from last sequence
- **Refinement rule:** Update Spec in same PR
- **Dependencies:** PBI-006, PBI-008

## Contract core (C1–C3)
| Field | Content |
|-------|---------|
| **C1 Inputs + types** | PBI-006 session events; ADR-011 |
| **C2 Outputs + types** | session stream UI; reconnect evidence; PR SHA |
| **C3 Write targets** | git; Linear |

## Operational body (1–13)
| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | Contract: reconnect from last sequence |
| 2 | Exact task | Wire Rivet Actor native realtime client into Developer OS session view (no CopilotKit). |
| 3 | Directories | apps/developer-os/ session view + Rivet client |
| 4 | What not to touch | Product Beads; product Linear boards; Port OAuth create/delete; FE-24 Feature Assembly coding beyond this unit; CopilotKit; browser→SA |
| 5 | Skills | ASDLC; Rivet realtime docs |
| 6 | MCPs | Linear; Rivet; git |
| 7 | Agent type | Coding agent |
| 8 | CI requirements | reconnect test / fixture; typecheck |
| 9 | Dependencies | PBI-006, PBI-008 |
| 10 | Branch / worktree | `cursor/pbi-009-rivet-realtime-ade8  OR  pbi-009/rivet-realtime worktree` |
| 11 | Failure / rollback | Revert PR; do not Port-accept; reopen Linear; if Meta Beads claimed, `bd reclaim` / cancel attempt — no partial catalog dual-write |
| 12 | Reviewer | Johnny Cage (human) + adversarial CE `/ce-code-review` when coding |
| 13 | Environment prerequisites | Dev OS preview; Rivet Actors reachable via Serve |

## Also
- **Time estimate:** 1–2d
- **Secrets handling:** No secrets in Specs/git. Use env/OpenCreds vault later. Scoped tokens only for sandbox/GitHub.
- **Observability hook:** Port audit (when live) + Rivet Inspector/traces (when live) + GitHub check runs; until then Linear status + PR comments

## Sources
- `docs/factory-master-spec.md` §6
- `docs/factory-workflow.md` typed-contract body
- `docs/factory-meta-vs-product.md` (Meta lane)
