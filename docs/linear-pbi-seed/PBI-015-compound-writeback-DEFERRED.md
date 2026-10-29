# PBI-015: CE compound writeback after first coding PBI

## Status

**Authoring / HITL-ready (2026-10-29)** — Johnny lifted the planning/build hold. Prep + reversible docs land via Project worker PR. Interactive Full `/ce-compound` still **HITL** (Johnny consent for discoverability tips). Depends PBI-007 (**Done** / STL-168).

**Task:** `tasks/PBI-015-compound-writeback.md`  
**Linear:** [STL-176](https://linear.app/johnny-cage/issue/STL-176/pbi-015-ce-compound-writeback-after-first-coding-pbi-deferred)

## Lane

**Meta** only.

## ASDLC pointers

- **Directive:** After verified Meta coding PBIs, run Compound Engineering `/ce-compound` to capture one durable learning under `docs/solutions/` (default CE root).
- **Spec pointer:** cross-cutting Meta practice (not a domain Spec implement); keep Specs authoritative for contracts.
- **Verification pointer:** Qualifying learning written (or durable-bar skip reported); frontmatter/claims validated; HITL discoverability consent honored.
- **Refinement rule:** Learning docs only — do not dual-write Port catalog or mutate External Interface apps.
- **Dependencies:** PBI-007 (cleared). Verified coding PBIs exist on Meta (001–014+).

## Contract core (C1–C3)

| Field | Content |
|-------|---------|
| **C1 Inputs + types** | One solved+verified Meta coding episode; durable-learning bar; interactive Full `/ce-compound` or non-interactive when free/reversible |
| **C2 Outputs + types** | One `docs/solutions/<category>/<slug>.md` (or skip report); optional `CONCEPTS.md` / AGENTS tip with consent |
| **C3 Write targets** | git (`docs/solutions/…`); Linear STL-176; **not** Port catalog dual-write |

## Operational body (1–13)

| # | Field | Content |
|---|--------|---------|
| 1 | Acceptance criteria | One qualifying durable learning landed (or explicit skip); HITL consent for instruction-file tip; Meta lane only |
| 2 | Exact task | Author prep from `main`; interactive Full remains HITL; non-interactive OK when reversible/free |
| 3 | Directories | `docs/solutions/` ; optional `.compound-engineering/`; `AGENTS.md` tip only with consent |
| 4 | What not to touch | Product Beads; Port OAuth create/delete; batching multiple learnings; pre-seeded Linear branch names |
| 5 | Skills | Compound Engineering `/ce-compound`; ASDLC living-docs awareness |
| 6 | MCPs | Linear (status); GitHub (PR) |
| 7 | Agent type | Coding agent — Full HITL when Johnny available; non-interactive for reversible docs |
| 8 | CI requirements | Docs/markdown PR; no Port accept required for learning-only writeback |
| 9 | Dependencies | PBI-007; at least one verified Meta coding PBI (satisfied) |
| 10 | Branch / worktree | Fresh branch from current `main` at start time — **do not** pin Linear `gitBranchName` |
| 11 | Failure / rollback | If durable bar fails: write nothing, comment Linear; revert learning PR if bad |
| 12 | Reviewer | Independent agent (author ≠ reviewer) + Johnny HITL for Full tips |
| 13 | Environment prerequisites | CE plugin available; Meta repo checkout on current `main` |

## Branch / implement path

- **Do not** pin Linear `gitBranchName`.
- Project worker creates a **fresh branch from current** `main`.
- **Do not** Linear→Cursor issue-delegate for implementation.
- **Do not** pre-create empty/placeholder remotes.

## First learning (this activation)

`docs/solutions/ops/port-redirect-uris-replace-set.md` — Port `redirectUris` replace-set + backup allowlist (verified 2026-10-29 prune of temp `n5tdoht4l` host).

## Sources

- Linear STL-176
- `AGENTS.md` Skills roster (PBI-015)
- Compound Engineering `ce-compound` skill
