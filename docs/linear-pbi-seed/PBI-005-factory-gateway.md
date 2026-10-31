# PBI-005: Thin factory-gateway HMAC + catalog writer

## Lane
**Meta** — Factory kernel. Unit ≡ Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.

## ASDLC pointers
- **Directive:** Thin gateway: verify Port webhook HMAC → ProjectSupervisor; Port catalog writes (incl. factory_claim_next_job) via §4.2.1 single-writer + catalogVersion.
- **Spec pointer:** `port-governance, rivet-execution`
- **Verification pointer:** Contract: webhook signature verified; Rivet never polls Port; stale catalog write rejected
- **Refinement rule:** Update Spec in same PR
- **Dependencies:** PBI-004

## Contract core (C1–C3)
| Field | Content |
|-------|---------|
| **C1 Inputs + types** | port Spec; §4.2.1; rivet claim-fencing docs |
| **C2 Outputs + types** | gateway service; tests; PR SHA |
| **C3 Write targets** | git; Linear; Port catalog only via gateway writer path (when live) |

## Operational body (1–13)
| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | Contract: webhook signature verified; Rivet never polls Port; stale catalog write rejected |
| 2 | Exact task | Thin gateway: verify Port webhook HMAC → ProjectSupervisor; Port catalog writes (incl. factory_claim_next_job) via §4.2.1 single-writer + catalogVersion. |
| 3 | Directories | apps/factory-gateway/ |
| 4 | What not to touch | Product Beads; product Linear boards; Port OAuth create/delete; FE-24 Feature Assembly coding beyond this unit; relocating catalog SoT into Rivet; Port OAuth create; dual-write Port bypass |
| 5 | Skills | ASDLC; port-factory-data-model §4.1 |
| 6 | MCPs | Port (read/workflows when authorized); Linear; git |
| 7 | Agent type | Coding agent inside SA when harness live; authorship/coding OK before |
| 8 | CI requirements | unit tests HMAC + catalogVersion reject; typecheck |
| 9 | Dependencies | PBI-004 |
| 10 | Branch / worktree | `cursor/pbi-005-factory-gateway-ade8  OR  pbi-005/factory-gateway worktree` |
| 11 | Failure / rollback | Revert PR; do not Port-accept; reopen Linear; if Meta Beads claimed, `bd reclaim` / cancel attempt — no partial catalog dual-write |
| 12 | Reviewer | Johnny Cage (human) + adversarial CE `/ce-code-review` when coding |
| 13 | Environment prerequisites | Rivet Compose up; Port webhook secret in env (not git) |

## Also
- **Time estimate:** 1–2d coding
- **Secrets handling:** No secrets in Specs/git. Use env/OpenCreds vault later. Scoped tokens only for sandbox/GitHub.
- **Observability hook:** Port audit (when live) + Rivet Inspector/traces (when live) + GitHub check runs; until then Linear status + PR comments

## Sources
- `docs/factory-master-spec.md` §6
- `docs/factory-workflow.md` typed-contract body
- `docs/factory-meta-vs-product.md` (Meta lane)
