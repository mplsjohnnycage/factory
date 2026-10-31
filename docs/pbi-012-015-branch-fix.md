# PBI-012–015 / STL-173–176 — branch bottleneck fix

**Date:** 2026-10-29  
**Repo:** https://github.com/mplsjohnnycage/factory (`main`)  
**Correct fix:** scrub hard-coded working branch requirements; **do not** pre-create empty remotes.

## Verdict

Correct path applied. Linear STL-173…176 + Project seed docs now instruct: **Project worker creates a fresh branch from current `main` at implement time** (same as PBI-001…011). No Linear→Cursor delegate. No empty workaround branches left on origin.

## What was wrong

Cursor Linear issue-delegate / hard-coded branch pinning expected working branch names that did not exist on origin (Linear auto `gitBranchName` and/or pinned `cursor/pbi-…` names). That path failed and blocked deferred Meta PBIs.

**Wrong workaround (reverted):** pre-creating empty tip=`main` remotes just to satisfy those names.

## Linear text changed

Each of STL-173, STL-174, STL-175, STL-176 gained a **Branch / implement path** section:

| Issue | URL | Change |
|-------|-----|--------|
| STL-173 (PBI-012) | https://linear.app/johnny-cage/issue/STL-173 | Added branch policy: ignore Linear `gitBranchName`; worker creates fresh branch from `main`; no Linear→Cursor delegate; no empty remotes |
| STL-174 (PBI-013) | https://linear.app/johnny-cage/issue/STL-174 | Same policy |
| STL-175 (PBI-014) | https://linear.app/johnny-cage/issue/STL-175 | Same policy |
| STL-176 (PBI-015) | https://linear.app/johnny-cage/issue/STL-176 | Same policy |

Prior issue bodies had **no** operational “Branch / worktree” hard-pin (unlike STL-172’s `cursor/pbi-011-ci-accept-sha-ade8`). Bottleneck was relying on Linear’s suggested `gitBranchName` / delegate path. Bodies now explicitly forbid pinning those names.

**Note:** Linear still *displays* an auto `gitBranchName` (e.g. `mplsjohnnycage/stl-173-…`). That is Linear UI metadata — issue body says implementers must **ignore** it and create a fresh worker branch from `main`. Cannot delete Linear’s auto field via API.

**Not done:** no status change, no assignee change, no Cursor delegate, no PBI implement.

## Seed docs updated (Project store)

| File | Change |
|------|--------|
| `docs/linear-pbi-seed/PBI-012-openfleet-ceilings-DEFERRED.md` | Added Branch / implement path |
| `docs/linear-pbi-seed/PBI-013-local-gate-DEFERRED.md` | Same |
| `docs/linear-pbi-seed/PBI-014-openprd-batch-DEFERRED.md` | Same |
| `docs/linear-pbi-seed/PBI-015-compound-writeback-DEFERRED.md` | Same |
| `docs/linear-pbi-seed/DEFERRED-012-015.md` | Added Branch policy section + link here |
| `docs/linear-pbi-seed/README.md` | Added Branch policy note for 012–015 |

## Empty remotes — created then deleted

Brief mistaken push of tip=`main` placeholders (SHA `107a7be6f37709c2894384e60b72462c17aa8910`), then **deleted**:

| Branch | Action |
|--------|--------|
| `mplsjohnnycage/stl-173-pbi-012-openfleet-ceilings-gateway-rate-limit-deferred` | deleted |
| `mplsjohnnycage/stl-174-pbi-013-local-gate-ci-refuse-validators-deferred-for-seed` | deleted |
| `mplsjohnnycage/stl-175-pbi-014-openprd-00010005-deferred-not-m1-exit` | deleted |
| `mplsjohnnycage/stl-176-pbi-015-ce-compound-writeback-after-first-coding-pbi` | deleted |
| `cursor/pbi-012-openfleet-ceilings-9086` | deleted |
| `cursor/pbi-013-local-gate-9086` | deleted |
| `cursor/pbi-014-openprd-batch-9086` | deleted |
| `cursor/pbi-015-compound-writeback-9086` | deleted |

**Confirm:** `git ls-remote --heads origin` for `mplsjohnnycage/stl-17{3,4,5,6}*` and `cursor/pbi-01{2,3,4,5}*` → **empty** (no remotes left).

## Johnny click needed

**None.** Linear + seed docs scrubbed; empty remotes gone. When PBI-012–015 start: spawn Project workers (not Linear→Cursor); worker branches from `main`.
