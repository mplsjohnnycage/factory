# PBI-001: Author ten domain Spec stubs

## Lane
**Meta** — Factory kernel. Unit ≡ Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.

## ASDLC pointers
- **Directive:** Author all ten `/specs/*/spec.md` Blueprint+Contract stubs from master spec §4 (stub authorship only — not M1 implement DoD; see §13.5).
- **Spec pointer:** `asdlc-lifecycle` (pointer); create stubs for factory-kernel, port-governance, rivet-execution, sandbox-harness, developer-os, auth-port-oauth, logicsrc-interop, visibility-accept, security-blast-radius, asdlc-lifecycle
- **Verification pointer:** Each stub has Blueprint Context/Architecture/Constraints + Contract DoD/Guardrails/≥1 Gherkin scenario
- **Refinement rule:** Update Spec in same PR
- **Dependencies:** —

## Contract core (C1–C3)
| Field | Content |
|-------|---------|
| **C1 Inputs + types** | master §4 domain outlines (markdown paths); Spec skeleton from master §2; Project store `docs/factory-master-spec.md` §4.1–§4.10 |
| **C2 Outputs + types** | ten `/specs/{domain}/spec.md` stubs with filled Blueprint+Contract; PR URL + head SHA; Linear status updates |
| **C3 Write targets** | **Meta Beads** (optional scaffold only — not admit SoT until PBI-007); **Linear** (STL-162); **git/GitHub** (`mplsjohnnycage/factory`); filesystem under `specs/**` (+ optional `tasks/PBI-001-*.md`); no Port catalog writes; no Rivet admit |

## Operational body (1–16)
| # | Field | Content |
|---|--------|---------|
| **1** | Acceptance criteria | Each of ten domains has Blueprint Context/Architecture/Constraints + Contract DoD/Guardrails/≥1 real Gherkin scenario (not scaffold TBD); PR open to `main` |
| **2** | Exact task description | Author all ten `/specs/*/spec.md` Blueprint+Contract stubs from master spec §4 (stub authorship only — not M1 implement DoD; see §13.5). |
| **3** | Almost-exact directories | `specs/factory-kernel/` … `specs/asdlc-lifecycle/` (+ optional `tasks/PBI-001-spec-stubs.md`) |
| **4** | What not to touch | Product Beads; product Linear boards; Port OAuth create/delete; Port catalog mutations; Rivet Compose; `apps/**` Feature Assembly; PBI-002+ ADR bodies; FE-24 beyond this unit; `.beads` Dolt as admit SoT |
| **5** | Skills to use | ASDLC `the-spec`, `living-specs`, `domain-driven-specification`, `pbi-authoring`; factory-coding-loop; factory-typed-contract |
| **6** | MCPs needed | Linear (claim/status); GitHub/`gh` when credentials available for push/PR; no Port MCP writes |
| **7** | Agent type required | **Claude Code** · **coding-agent** (authorship via coding loop; Rivet Sandbox Agent not required) |
| **8** | CI requirements | PR opens against `main`; docs-only — optional lint; no Port accept gate yet |
| **9** | Dependencies | — (none) |
| **10** | Branch / worktree naming | `cursor/pbi-001-spec-stubs-a364` (worktree from `main`; one write set) |
| **11** | Failure / rollback | Close/revert PR; leave Linear In Progress or return Todo; do not Port-accept; no catalog dual-write; do not start PBI-002+ |
| **12** | Reviewer for the PR | Johnny Cage (human) |
| **13** | Environment prerequisites | Factory meta-repo checkout (`artifacts/factory` → `mplsjohnnycage/factory`); master §4 readable; Linear MCP for claim |
| **14** | Time estimate | 2–4h authorship |
| **15** | Secrets handling | No secrets in Specs/git. No plaintext tokens in Linear body. GitHub push uses host credentials / `gh` only. |
| **16** | Observability hook | Linear STL-162 status + comments; GitHub PR checks when present; PR description cites unit ids · Spec path · scenarios |

## Implementation status (FE-60)
- **Linear:** [STL-162](https://linear.app/johnny-cage/issue/STL-162) In Progress
- **Local commit:** `63d370e` on `cursor/pbi-001-spec-stubs-a364` (worktree `/tmp/factory-pbi-001-wt`)
- **PR:** https://github.com/mplsjohnnycage/factory/pull/1

## Sources
- `docs/factory-master-spec.md` §0.1 · §4 · §6
- `docs/factory-coding-loop.md`
- `docs/factory-meta-vs-product.md` (Meta lane)
