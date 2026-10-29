# PBI-015 / STL-176 — CE compound writeback

Mirror of Linear [STL-176](https://linear.app/johnny-cage/issue/STL-176/pbi-015-ce-compound-writeback-after-first-coding-pbi-deferred).

## Delivered (this PR)

| Artifact | Path |
|----------|------|
| First durable learning | `docs/solutions/workflow-issues/ignore-linear-gitbranchname-fresh-branch-from-main.md` |
| Vocabulary seed | `CONCEPTS.md` |
| Seed status update | `docs/linear-pbi-seed/PBI-015-compound-writeback-DEFERRED.md` |

## Scope

- Meta only — Compound Engineering `/ce-compound` writeback after verified Meta coding PBIs
- One learning per run (this run: Linear `gitBranchName` / empty-remote anti-pattern from FE-89)
- Docs/markdown PR — no Port accept required for learning-only writeback
- No Port catalog dual-write; no External Interface OAuth mutate; no Observatory

## Hard rules

- Meta only — no Product Beads
- Author ≠ reviewer; no self-merge; Johnny out of review
- No Linear→Cursor issue delegate
- Fresh branch from current `main` (ignore Linear `gitBranchName`)
- `AGENTS.md` discoverability tip only with Johnny consent (not in this PR)
- Living Specs unchanged (cross-cutting practice, not a domain Contract change)

## Verify

```bash
# Frontmatter parser-safety (CE bundled validator)
SKILL_DIR="$HOME/.cursor/plugins/cache/cursor-public/680/*/skills/ce-compound"
python3 $SKILL_DIR/scripts/validate-frontmatter.py \
  docs/solutions/workflow-issues/ignore-linear-gitbranchname-fresh-branch-from-main.md

python3 $SKILL_DIR/scripts/validate-doc-claims.py \
  docs/solutions/workflow-issues/ignore-linear-gitbranchname-fresh-branch-from-main.md
```

Learning-only PR: no app typecheck required for accept path.
