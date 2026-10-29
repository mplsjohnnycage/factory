# PBI-008: Scaffold Developer OS shell on Vercel

## Lane
**Meta** — Factory kernel. Unit ≡ Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.

## ASDLC pointers
- **Directive:** Scaffold Next.js Developer OS on Vercel; atlas hero shell; Port OAuth callback Route Handler stub (intended Factory client id; no Observatory reuse).
- **Spec pointer:** `developer-os`
- **Verification pointer:** Contract: preview deploy serves shell; OAuth Route Handler stub compiles
- **Refinement rule:** Update Spec in same PR
- **Dependencies:** PBI-003

## Contract core (C1–C3)
| Field | Content |
|-------|---------|
| **C1 Inputs + types** | developer-os Spec; code-atlas mockup |
| **C2 Outputs + types** | Next.js shell; preview URL; OAuth stub; PR SHA |
| **C3 Write targets** | git; Linear; Vercel deploy — Meta Dev OS only |

## Operational body (1–13)
| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | Contract: preview deploy serves shell; OAuth Route Handler stub compiles |
| 2 | Exact task | Scaffold Next.js Developer OS on Vercel; atlas hero shell; Port OAuth callback Route Handler stub (intended Factory client id; no Observatory reuse). |
| 3 | Directories | apps/developer-os/ |
| 4 | What not to touch | Product Beads; product Linear boards; Port OAuth create/delete; FE-24 Feature Assembly coding beyond this unit; CopilotKit/AG-UI kernel; Harness Observatory client id; full chrome matrix |
| 5 | Skills | ASDLC; frontend-stack-feed; ADR-011 |
| 6 | MCPs | Linear; Vercel (deploy); git |
| 7 | Agent type | Coding agent |
| 8 | CI requirements | build + typecheck; Vercel preview URL |
| 9 | Dependencies | PBI-003 |
| 10 | Branch / worktree | `cursor/pbi-008-devos-shell-ade8  OR  pbi-008/devos-shell worktree` |
| 11 | Failure / rollback | Revert PR; do not Port-accept; reopen Linear; if Meta Beads claimed, `bd reclaim` / cancel attempt — no partial catalog dual-write |
| 12 | Reviewer | Johnny Cage (human) + adversarial CE `/ce-code-review` when coding |
| 13 | Environment prerequisites | Node; Vercel project (create when authorized) |

## Also
- **Time estimate:** 1–2d
- **Secrets handling:** No secrets in Specs/git. Use env/OpenCreds vault later. Scoped tokens only for sandbox/GitHub.
- **Observability hook:** Port audit (when live) + Rivet Inspector/traces (when live) + GitHub check runs; until then Linear status + PR comments

## Sources
- `docs/factory-master-spec.md` §6
- `docs/factory-workflow.md` typed-contract body
- `docs/factory-meta-vs-product.md` (Meta lane)
