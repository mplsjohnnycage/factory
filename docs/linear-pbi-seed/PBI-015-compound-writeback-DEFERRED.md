# PBI-015: CE compound writeback after first coding PBI

## Status

**In progress / first writeback landed** — HITL hold lifted for planning/building (FE-145). First durable learning under `docs/solutions/` via reversible `/ce-compound` (docs-only). AGENTS.md discoverability tip **not** applied (needs Johnny consent). Depends PBI-007 (**Done** / STL-168).

**Linear:** [STL-176](https://linear.app/johnny-cage/issue/STL-176/pbi-015-ce-compound-writeback-after-first-coding-pbi-deferred)  
**First learning:** `docs/solutions/workflow-issues/ignore-linear-gitbranchname-fresh-branch-from-main.md`  
**Vocabulary seed:** `CONCEPTS.md` (Meta Beads / Project worker / Linear gitBranchName)

Filename keeps `DEFERRED` suffix for stable seed links; status body above is authoritative.

## Lane

**Meta** only.

## ASDLC pointers

- **Directive:** After verified Meta coding PBIs, run interactive Compound Engineering `/ce-compound` to capture one durable learning under `docs/solutions/` (default CE root).
- **Spec pointer:** cross-cutting Meta practice (not a domain Spec implement); keep Specs authoritative for contracts.
- **Verification pointer:** Qualifying learning written (or durable-bar skip reported); frontmatter/claims validated; HITL discoverability consent honored.
- **Refinement rule:** Learning docs only — do not dual-write Port catalog or mutate External Interface apps.
- **Dependencies:** PBI-007 (cleared). Verified coding PBIs exist on Meta (001–014+).

## Contract core (C1–C3)

| Field | Content |
|-------|---------|
| **C1 Inputs + types** | One solved+verified Meta coding episode; durable-learning bar; interactive Full `/ce-compound` |
| **C2 Outputs + types** | One `docs/solutions/<category>/<slug>.md` (or skip report); optional `CONCEPTS.md` / AGENTS tip with consent |
| **C3 Write targets** | git (`docs/solutions/…`); Linear STL-176; **not** Port catalog dual-write |

## Operational body (1–13)

| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | One qualifying durable learning landed (or explicit skip); HITL consent for instruction-file tip; Meta lane only |
| 2 | Exact task | Interactive `/ce-compound` writeback after Johnny picks the learning target — **prep ≠ start**; Auto build may land first reversible learning when hold lifted |
| 3 | Directories | `docs/solutions/` (created on first write); optional `.compound-engineering/`; `AGENTS.md` tip only with consent |
| 4 | What not to touch | Product Beads; Port OAuth create/delete; non-interactive compound for this PBI; batching multiple learnings; pre-seeded Linear branch names |
| 5 | Skills | Compound Engineering `/ce-compound` (HITL Full); ASDLC living-docs awareness |
| 6 | MCPs | Linear (status); GitHub (PR) |
| 7 | Agent type | Coding agent **with Johnny HITL** for AGENTS tip / multi-learning choice — first reversible learning may land under Auto when hold lifted |
| 8 | CI requirements | Docs/markdown PR; no Port accept required for learning-only writeback |
| 9 | Dependencies | PBI-007; at least one verified Meta coding PBI (satisfied) |
| 10 | Branch / worktree | Fresh branch from current `main` at start time — **do not** pin Linear `gitBranchName` |
| 11 | Failure / rollback | If durable bar fails: write nothing, comment Linear; revert learning PR if bad; keep Deferred until Johnny clears |
| 12 | Reviewer | Independent agent (author ≠ reviewer) + Johnny for merge; adversarial CE review when learning PR is non-trivial |
| 13 | Environment prerequisites | CE plugin available; Meta repo checkout on current `main`; Johnny available for interactive prompts when tip consent needed |

## Branch / implement path

- **Do not** pin or require any pre-existing working branch name (ignore Linear's suggested `gitBranchName`; do not checkout a hard-coded `cursor/pbi-015-…` or `mplsjohnnycage/stl-176-…` name that must already exist).
- When this PBI is started: a **Project worker** creates a **fresh branch from current** `main` (same pattern as PBI-001…011). Branch name is chosen at implement time, not pre-seeded on origin.
- **Do not** Linear→Cursor issue-delegate for implementation.
- **Do not** pre-create empty/placeholder remotes to satisfy a name.

## Also

- **Time estimate:** HITL session (one learning); more if serial follow-ups
- **Secrets handling:** No secrets in solutions docs
- **Observability hook:** Linear status + PR; solutions discoverability via AGENTS after consent

## Sources

- Linear STL-176
- `AGENTS.md` Skills roster (PBI-015)
- Compound Engineering `ce-compound` skill (interactive Full / durable bar)
- FE-89 branch-policy scrub (verified Meta coding episode for first learning)
