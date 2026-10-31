# PBI-003: Emit OpenStack + OpenProfile + AGENTS.md

## Lane
**Meta** — Factory kernel. Unit ≡ Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.

## ASDLC pointers
- **Directive:** Emit OpenStack.md + OpenProfile.md + AGENTS.md (index only) from stack Specs.
- **Spec pointer:** `logicsrc-interop`
- **Verification pointer:** Inventory §7 items 1–2 present; AGENTS.md does not dump design
- **Refinement rule:** Update Spec in same PR
- **Dependencies:** PBI-001

## Contract core (C1–C3)
| Field | Content |
|-------|---------|
| **C1 Inputs + types** | Spec stubs; inventory §7 |
| **C2 Outputs + types** | AGENTS.md index; OpenStack.md; OpenProfile well-known; PR SHA |
| **C3 Write targets** | git; Linear |

## Operational body (1–13)
| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | Inventory §7 items 1–2 present; AGENTS.md does not dump design |
| 2 | Exact task | Emit OpenStack.md + OpenProfile.md + AGENTS.md (index only) from stack Specs. |
| 3 | Directories | AGENTS.md; OpenStack.md; /.well-known/openstack.md; /.well-known/openprofile.md |
| 4 | What not to touch | Product Beads; product Linear boards; Port OAuth create/delete; FE-24 Feature Assembly coding beyond this unit; full OpenPRD batch; Port OAuth create |
| 5 | Skills | skills/asdlc/practices/agents-md-spec.md; logicsrc inventory |
| 6 | MCPs | Linear; git |
| 7 | Agent type | Coding agent (authorship) |
| 8 | CI requirements | Optional @logicsrc/validators when available; otherwise file-presence check |
| 9 | Dependencies | PBI-001 |
| 10 | Branch / worktree | `cursor/pbi-003-openstack-agents-ade8  OR  pbi-003/openstack-agents worktree` |
| 11 | Failure / rollback | Revert PR; do not Port-accept; reopen Linear; if Meta Beads claimed, `bd reclaim` / cancel attempt — no partial catalog dual-write |
| 12 | Reviewer | Johnny Cage (human) + adversarial CE `/ce-code-review` when coding |
| 13 | Environment prerequisites | meta-repo; logicsrc-artifact-inventory.md |

## Also
- **Time estimate:** 1–2h
- **Secrets handling:** No secrets in Specs/git. Use env/OpenCreds vault later. Scoped tokens only for sandbox/GitHub.
- **Observability hook:** Port audit (when live) + Rivet Inspector/traces (when live) + GitHub check runs; until then Linear status + PR comments

## Sources
- `docs/factory-master-spec.md` §6
- `docs/factory-workflow.md` typed-contract body
- `docs/factory-meta-vs-product.md` (Meta lane)
