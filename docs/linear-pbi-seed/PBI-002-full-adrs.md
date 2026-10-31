# PBI-002: Write full Nygard ADRs 001–011

## Lane
**Meta** — Factory kernel. Unit ≡ Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.

## ASDLC pointers
- **Directive:** Write full Nygard ADRs ADR-001…011 under `docs/adrs/` (Context, Decision, Consequences, Alternatives — not one-line table copies); ADR-007 body records Superseded by ADR-011.
- **Spec pointer:** `asdlc-lifecycle; decisions from master §3`
- **Verification pointer:** Every Accepted ADR has all six ADR anatomy sections; ADR-011 present; ADR-007 marked Superseded
- **Refinement rule:** Update Spec in same PR
- **Dependencies:** PBI-001

## Contract core (C1–C3)
| Field | Content |
|-------|---------|
| **C1 Inputs + types** | master §3 Accepted ADR table; prior Project docs |
| **C2 Outputs + types** | docs/adrs/ADR-001…011 markdown files; PR SHA |
| **C3 Write targets** | git; Linear; **not** Meta Beads admit |

## Operational body (1–13)
| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | Every Accepted ADR has all six ADR anatomy sections; ADR-011 present; ADR-007 marked Superseded |
| 2 | Exact task | Write full Nygard ADRs ADR-001…011 under `docs/adrs/` (Context, Decision, Consequences, Alternatives — not one-line table copies); ADR-007 body records Superseded by ADR-011. |
| 3 | Directories | docs/adrs/ADR-*.md |
| 4 | What not to touch | Product Beads; product Linear boards; Port OAuth create/delete; FE-24 Feature Assembly coding beyond this unit; Spec Contracts rewrite beyond ADR pointers; live Port |
| 5 | Skills | skills/asdlc/patterns/the-adr.md; practices/adr-authoring.md |
| 6 | MCPs | Linear; optional GitHub |
| 7 | Agent type | Coding agent (authorship) |
| 8 | CI requirements | PR review; bodies immutable after merge (supersede-only) |
| 9 | Dependencies | PBI-001 |
| 10 | Branch / worktree | `cursor/pbi-002-full-adrs-ade8  OR  pbi-002/full-adrs worktree` |
| 11 | Failure / rollback | Revert PR; do not Port-accept; reopen Linear; if Meta Beads claimed, `bd reclaim` / cancel attempt — no partial catalog dual-write |
| 12 | Reviewer | Johnny Cage (human) + adversarial CE `/ce-code-review` when coding |
| 13 | Environment prerequisites | meta-repo; master §3 table |

## Also
- **Time estimate:** 3–5h
- **Secrets handling:** No secrets in Specs/git. Use env/OpenCreds vault later. Scoped tokens only for sandbox/GitHub.
- **Observability hook:** Port audit (when live) + Rivet Inspector/traces (when live) + GitHub check runs; until then Linear status + PR comments

## Sources
- `docs/factory-master-spec.md` §6
- `docs/factory-workflow.md` typed-contract body
- `docs/factory-meta-vs-product.md` (Meta lane)
