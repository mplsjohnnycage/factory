# PBI-011: GitHub checks → accept on exact SHA

## Lane
**Meta** — Factory kernel. Unit ≡ Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.

## ASDLC pointers
- **Directive:** GitHub checks → accept on exact SHA (visibility-accept path).
- **Spec pointer:** `visibility-accept`
- **Verification pointer:** Contract: rewrite invalidates accept
- **Refinement rule:** Update Spec in same PR
- **Dependencies:** PBI-007

## Contract core (C1–C3)
| Field | Content |
|-------|---------|
| **C1 Inputs + types** | PBI-007 vertical slice; ADR-008 |
| **C2 Outputs + types** | CI workflow; accept evidence on SHA; PR SHA |
| **C3 Write targets** | git; Linear; Port accept (governance); **Meta Beads** close after accept |

## Operational body (1–13)
| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | Contract: rewrite invalidates accept |
| 2 | Exact task | GitHub checks → accept on exact SHA (visibility-accept path). |
| 3 | Directories | .github/workflows/; visibility Spec; Port accept wiring (read/approve) |
| 4 | What not to touch | Product Beads; product Linear boards; Port OAuth create/delete; FE-24 Feature Assembly coding beyond this unit; agent self-accept; accepting without CI green |
| 5 | Skills | ASDLC; ADR-008 |
| 6 | MCPs | GitHub; Port (accept); Linear |
| 7 | Agent type | Coding for CI; Cockpit/human for Port accept |
| 8 | CI requirements | required checks on exact SHA; rewrite denies |
| 9 | Dependencies | PBI-007 |
| 10 | Branch / worktree | `cursor/pbi-011-ci-accept-sha-ade8  OR  pbi-011/ci-accept-sha worktree` |
| 11 | Failure / rollback | Revert PR; do not Port-accept; reopen Linear; if Meta Beads claimed, `bd reclaim` / cancel attempt — no partial catalog dual-write |
| 12 | Reviewer | Johnny Cage (human) + adversarial CE `/ce-code-review` when coding |
| 13 | Environment prerequisites | GitHub repo live; Port accept path |

## Also
- **Time estimate:** 1d
- **Secrets handling:** No secrets in Specs/git. Use env/OpenCreds vault later. Scoped tokens only for sandbox/GitHub.
- **Observability hook:** Port audit (when live) + Rivet Inspector/traces (when live) + GitHub check runs; until then Linear status + PR comments

## Sources
- `docs/factory-master-spec.md` §6
- `docs/factory-workflow.md` typed-contract body
- `docs/factory-meta-vs-product.md` (Meta lane)
