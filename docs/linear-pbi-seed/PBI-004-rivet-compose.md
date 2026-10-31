# PBI-004: Compose Rivet 2.x + Tailscale Serve health

## Lane
**Meta** — Factory kernel. Unit ≡ Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.

## ASDLC pointers
- **Directive:** Compose Rivet 2.x + Tailscale Serve health on desktop pilot host.
- **Spec pointer:** `rivet-execution`
- **Verification pointer:** Contract: health after Compose restart
- **Refinement rule:** Update Spec in same PR
- **Dependencies:** PBI-002

## Contract core (C1–C3)
| Field | Content |
|-------|---------|
| **C1 Inputs + types** | rivet-execution Spec; rivet-engineering-spec.md |
| **C2 Outputs + types** | Compose stack healthy; Serve URL; evidence in PR; PR SHA |
| **C3 Write targets** | git; Linear; host filesystem — **Meta** lane only |

## Operational body (1–13)
| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | Contract: health after Compose restart |
| 2 | Exact task | Compose Rivet 2.x + Tailscale Serve health on desktop pilot host. |
| 3 | Directories | compose/ or rivet compose files; docs for Tailscale Serve; bin/install.sh stubs OK |
| 4 | What not to touch | Product Beads; product Linear boards; Port OAuth create/delete; FE-24 Feature Assembly coding beyond this unit; factory-edge; CapacityManager; Product Beads |
| 5 | Skills | ASDLC living-specs; Rivet Compose docs |
| 6 | MCPs | Linear; optional Docker/shell on host |
| 7 | Agent type | Coding agent; host ops may need human for Tailscale |
| 8 | CI requirements | Compose config lint; healthcheck script in CI when possible |
| 9 | Dependencies | PBI-002 |
| 10 | Branch / worktree | `cursor/pbi-004-rivet-compose-ade8  OR  pbi-004/rivet-compose worktree` |
| 11 | Failure / rollback | Revert PR; do not Port-accept; reopen Linear; if Meta Beads claimed, `bd reclaim` / cancel attempt — no partial catalog dual-write |
| 12 | Reviewer | Johnny Cage (human) + adversarial CE `/ce-code-review` when coding |
| 13 | Environment prerequisites | Docker Desktop/Compose; Tailscale Serve; Rivet 2.x |

## Also
- **Time estimate:** 4–8h + host setup
- **Secrets handling:** No secrets in Specs/git. Use env/OpenCreds vault later. Scoped tokens only for sandbox/GitHub.
- **Observability hook:** Port audit (when live) + Rivet Inspector/traces (when live) + GitHub check runs; until then Linear status + PR comments

## Sources
- `docs/factory-master-spec.md` §6
- `docs/factory-workflow.md` typed-contract body
- `docs/factory-meta-vs-product.md` (Meta lane)
