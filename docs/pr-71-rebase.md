# PR #71 author-side rebase

**PR:** https://github.com/mplsjohnnycage/factory/pull/71  
**Branch:** `cursor/signed-admit-smoke-ops-28e9`  
**FE-142:** CLOSED (env-only HMAC smoke; no secret print)

## What happened

1. Fetched latest `main` (`159c75d`, includes #73 Windows logon checklist after prior #68/#69).
2. Rebased the signed-admit smoke commit onto `main` (race: prior tip `9af4df0` was DIRTY vs #73).
3. Sole conflict: root `package.json` scripts — resolved by **keeping all three**:
   - `dry-run:gateway-signed` → `scripts/gateway-signed-admit-dry-run.mjs` (this PR)
   - `dry-run:supervisor-admit` → `scripts/supervisor-admit-dry-run.mjs` (from #68 / main)
   - `dry-run:windows-logon` → `scripts/gateway-windows-logon-dry-run.mjs` (from #73 / main)
4. Force-pushed rebased tip `c9f837d` to the PR branch so CI can run.
5. Left a PR comment that rebase is done. **Did not approve or merge** (author ≠ reviewer). Independent reviewer `bc-8f60d0b4-5c7b-5670-b15c-43ed13229ed9` approved and squash-merged.
6. **MERGED** 2026-10-29T17:23:00Z — tip `c9f837d` → merge commit `6ba151b`.

## PM summary (3 lines)

1. PR #71 rebased again onto main after #73 race; all three dry-run npm scripts retained.  
2. Tip `c9f837d` force-pushed — CI green (`meta-ci-presence` + `local-gate-refuse`).  
3. Independent reviewer approved + squash-merged (`6ba151b`); author did not review/merge.

## Evidence

| Item | Value |
|------|--------|
| Pre-rebase tip | `9af4df0` |
| Post-rebase tip | `c9f837d7f426d6bba37a79ab4f99e838d7314410` |
| Merge commit | `6ba151b735a77cec72c23a3eebd574d229175220` |
| Base | `origin/main` @ `159c75d` |
| Conflict file | `package.json` only |
| Scripts kept | `dry-run:gateway-signed`, `dry-run:supervisor-admit`, `dry-run:windows-logon` |
| Outcome | MERGED by independent reviewer (not author) |
