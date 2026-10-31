# PBI-006: Sandbox Agent + Claude Code harness

## Lane
**Meta** — Factory kernel. Unit ≡ Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.

## ASDLC pointers
- **Directive:** AgentSession + Sandbox Agent Docker + Claude Code first harness.
- **Spec pointer:** `sandbox-harness`
- **Verification pointer:** Contract: create→prompt→stream→checkpoint; kill preserves session identity
- **Refinement rule:** Update Spec in same PR
- **Dependencies:** PBI-004

## Contract core (C1–C3)
| Field | Content |
|-------|---------|
| **C1 Inputs + types** | sandbox-harness Spec; ADR-006 |
| **C2 Outputs + types** | working SA path; session identity evidence; PR SHA |
| **C3 Write targets** | git; Linear; Rivet actors (Meta) |

## Operational body (1–13)
| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | Contract: create→prompt→stream→checkpoint; kill preserves session identity |
| 2 | Exact task | AgentSession + Sandbox Agent Docker + Claude Code first harness. |
| 3 | Directories | sandbox image/config; Rivet AgentSession wiring; agents/coder.factory.json optional stub |
| 4 | What not to touch | Product Beads; product Linear boards; Port OAuth create/delete; FE-24 Feature Assembly coding beyond this unit; browser→Sandbox Agent calls; CopilotKit kernel |
| 5 | Skills | ASDLC; rivet-sandbox-agent.md |
| 6 | MCPs | Linear; git; Rivet when live |
| 7 | Agent type | Coding agent process = Claude Code (M1) inside SA |
| 8 | CI requirements | session lifecycle tests; image pin documented |
| 9 | Dependencies | PBI-004 |
| 10 | Branch / worktree | `cursor/pbi-006-sandbox-claude-ade8  OR  pbi-006/sandbox-claude worktree` |
| 11 | Failure / rollback | Revert PR; do not Port-accept; reopen Linear; if Meta Beads claimed, `bd reclaim` / cancel attempt — no partial catalog dual-write |
| 12 | Reviewer | Johnny Cage (human) + adversarial CE `/ce-code-review` when coding |
| 13 | Environment prerequisites | Docker provider; Rivet Actors; Claude Code credentials via env |

## Also
- **Time estimate:** 1–2d
- **Secrets handling:** No secrets in Specs/git. Use env/OpenCreds vault later. Scoped tokens only for sandbox/GitHub.
- **Observability hook:** Port audit (when live) + Rivet Inspector/traces (when live) + GitHub check runs; until then Linear status + PR comments

## Sources
- `docs/factory-master-spec.md` §6
- `docs/factory-workflow.md` typed-contract body
- `docs/factory-meta-vs-product.md` (Meta lane)
