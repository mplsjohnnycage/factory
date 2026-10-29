# PBI-010: OpenAccess + OpenMCP well-knowns (no Port OAuth create)

## Lane
**Meta** — Factory kernel. Unit ≡ Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.

## ASDLC pointers
- **Directive:** OpenAccess + OpenMCP well-known files (no Port OAuth create).
- **Spec pointer:** `auth-port-oauth, port-governance`
- **Verification pointer:** Inventory §7 items 9–10; no Port mutation
- **Refinement rule:** Update Spec in same PR
- **Dependencies:** PBI-003

## Contract core (C1–C3)
| Field | Content |
|-------|---------|
| **C1 Inputs + types** | auth Spec; Port MCP catalog names (read) |
| **C2 Outputs + types** | well-known descriptors; PR SHA; zero Port mutations |
| **C3 Write targets** | git; Linear only |

## Operational body (1–13)
| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | Inventory §7 items 9–10; no Port mutation |
| 2 | Exact task | OpenAccess + OpenMCP well-known files (no Port OAuth create). |
| 3 | Directories | /.well-known/openmcp.json; /.well-known/openaccess.json |
| 4 | What not to touch | Product Beads; product Linear boards; Port OAuth create/delete; FE-24 Feature Assembly coding beyond this unit; Port External Interface create/delete; Observatory reuse |
| 5 | Skills | ASDLC; ADR-005 create-params docs only |
| 6 | MCPs | Linear; git — **no** Port write MCP for OAuth |
| 7 | Agent type | Coding agent (docs/interop) |
| 8 | CI requirements | JSON schema validate if validators present |
| 9 | Dependencies | PBI-003 |
| 10 | Branch / worktree | `cursor/pbi-010-openaccess-openmcp-ade8  OR  pbi-010/openaccess-openmcp worktree` |
| 11 | Failure / rollback | Revert PR; do not Port-accept; reopen Linear; if Meta Beads claimed, `bd reclaim` / cancel attempt — no partial catalog dual-write |
| 12 | Reviewer | Johnny Cage (human) + adversarial CE `/ce-code-review` when coding |
| 13 | Environment prerequisites | meta-repo only |

## Also
- **Time estimate:** 1–2h
- **Secrets handling:** No secrets in Specs/git. Use env/OpenCreds vault later. Scoped tokens only for sandbox/GitHub.
- **Observability hook:** Port audit (when live) + Rivet Inspector/traces (when live) + GitHub check runs; until then Linear status + PR comments

## Sources
- `docs/factory-master-spec.md` §6
- `docs/factory-workflow.md` typed-contract body
- `docs/factory-meta-vs-product.md` (Meta lane)
