---
title: "Ignore Linear gitBranchName — create a fresh branch from current main at implement time"
date: 2026-10-29
category: workflow-issues
module: meta-coding-admit
problem_type: workflow_issue
component: development_workflow
severity: high
applies_when:
  - "Starting a Meta coding PBI or Linear-seeded issue"
  - "Linear UI shows an auto-generated gitBranchName or seed text mentions cursor/pbi-… names"
  - "Temptation arises to push an empty tip=main placeholder remote so a suggested branch name exists"
  - "Someone proposes Linear→Cursor issue-delegate to pick up a pre-named branch"
resolution_type: documentation_update
tags:
  - linear
  - gitbranchname
  - branch-workflow
  - factory-meta
  - fe-89
  - project-workers
  - no-placeholder-remotes
  - pbi-seed
---

# Ignore Linear gitBranchName — create a fresh branch from current main at implement time

## Context

On Meta Factory kernel work (Factory Meta lane), Linear often shows a suggested `gitBranchName` (for example `cursor/pbi-015-…` or `mplsjohnnycage/stl-176-…`). Seed docs and agents sometimes treat that string as a branch that must already exist on origin, or pre-create an empty remote whose tip is `main` so the name “resolves.”

That pattern was tried during the FE-89 scrub of STL-173…176 and related seed docs, then reverted: empty/placeholder remotes were deleted. The durable rule is now written into Meta seed hard rules (PBI-014) and the PBI-015 seed’s branch / implement path.

This learning is Meta-lane only. Linear remains human visibility; Meta Beads is ready/claim SoT for coding admit (`AGENTS.md`). Implementation starts when a Project worker creates a fresh branch from current `main` — not when a Linear name matches a remote tip.

## Guidance

1. **Ignore Linear `gitBranchName` as a checkout requirement.** Treat it as a label suggestion, not a git object that must exist.
2. **Do not pin or require pre-seeded `cursor/pbi-…` (or `mplsjohnnycage/stl-…`) remotes.** At start, create a **fresh branch from current `main`**. Name the branch at implement time (same pattern as PBI-001…011).
3. **Do not Linear→Cursor issue-delegate** for implementation. Project workers own branch creation and coding admit under Meta Beads / Port execution contract rules.
4. **Do not pre-create empty/placeholder remotes** whose tip is `main` just to satisfy a branch name. That was tried and reverted; delete such remotes if they reappear.
5. When documenting PBIs, spell the branch rule explicitly (as in `docs/linear-pbi-seed/PBI-015-compound-writeback-DEFERRED.md` § Branch / implement path and `tasks/PBI-014-openprd-batch.md` Hard rules): fresh from `main`, ignore `gitBranchName`, no issue-delegate, no placeholder remotes.

## Why This Matters

- **False dependency:** Agents fail or stall looking for a remote that never received commits, or they “succeed” by checking out a tip that is still `main` with no work.
- **Polluted origin:** Empty placeholder remotes clutter the repo, confuse CI/PR targeting, and were scrubbed (FE-89 / STL-173…176).
- **Wrong control plane:** Linear→Cursor issue-delegate bypasses Meta Beads ready/claim and ProjectSupervisor admit fencing (`AGENTS.md` Meta Beads / lane rules). Linear is visibility; Beads (or audited Port bypass) is admit.
- **Seed integrity:** PBI-014 hard rules and PBI-015 operational body (#4, #10) already forbid pinning Linear branch names — agents must match seed contracts, not invent a “ensure remote exists” shortcut.

## When to Apply

Apply on every Meta coding start for Factory Meta PBIs / Linear STL tickets that list a `gitBranchName` or a seed-mentioned `cursor/pbi-…` name:

- Opening work from a Linear issue, seed doc under `docs/linear-pbi-seed/`, or `tasks/PBI-*.md`
- Project worker / cloud agent branch bootstrap
- Recovering from a missing-branch error when the missing name matches Linear’s suggestion
- Reviewing seed docs that mention branch / worktree (copy the fresh-from-`main` rule; do not add “create remote first”)

Do **not** apply this as Product Beads / product Linear board guidance. Do not invent Port catalog or Observatory steps from this learning.

## Examples

### Before (wrong)

```text
Linear STL-176 gitBranchName = cursor/pbi-015-compound-writeback-…
Agent: git fetch && git checkout cursor/pbi-015-compound-writeback-…
# fails: remote missing
Agent: git push origin main:cursor/pbi-015-compound-writeback-…   # empty tip=main
# or: Linear → Cursor issue-delegate to “attach” the named branch
```

### After (correct)

```text
# On Meta repo, current main
git fetch origin
git checkout main && git pull origin main
git checkout -b cursor/<descriptive-name>-<suffix>   # name chosen at start time
# Implement; push only the branch you created
# Meta Beads: bd ready / bd update <bead-id> --claim when admit path requires it
# Do not Linear→Cursor issue-delegate; do not create placeholder remotes
```

### Seed language to mirror

From PBI-015 seed: fresh branch from current `main` at start; do not pin Linear `gitBranchName`; do not pre-create empty/placeholder remotes; do not Linear→Cursor issue-delegate.

From PBI-014 hard rules: Meta only; no Linear→Cursor issue delegate; fresh branch from current `main` (ignore Linear `gitBranchName`).

## Related

- `docs/linear-pbi-seed/PBI-015-compound-writeback-DEFERRED.md` — branch / implement path; what not to touch (pre-seeded Linear branch names); operational #10
- `tasks/PBI-014-openprd-batch.md` — Hard rules (Meta only; no Linear→Cursor issue delegate; fresh from `main`)
- `AGENTS.md` — Meta lane rules; Meta Beads ready/claim SoT; Linear = human visibility; Compound Engineering `/ce-compound` (PBI-015) on Skills roster
- Verified scrub: FE-89 on STL-173…176 + seed docs; empty remotes deleted (do not recreate)
