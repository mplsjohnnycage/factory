---
cursor:
  subagentId: "bc-e92c5655-8e9b-554c-9fd0-6331819a73ea"
---

# OpenAccess Dev OS redirects — Independent review (PR #39)

**PR:** https://github.com/mplsjohnnycage/factory/pull/39  
**Result:** **MERGED** (squash) → `main` @ `9a987a5e21663527ca18ff313cc8399f3606a1fe`  
**Author:** OpenAccess Dev OS redirects PR worker / Cursor Agent commit `05b3fe9` (GitHub author `mplsjohnnycage`)  
**Reviewer:** session `bc-e92c5655-8e9b-554c-9fd0-6331819a73ea` via write COLLABORATOR `skysthelimitpainting1779-collab` (**≠ author**)  
**Model:** Auto  
**Lane:** Meta only · repo **public** · **no Observatory**  
**Content + formal verdict:** **APPROVE**

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Composio (`skysthelimitpainting1779-collab`) on `05b3fe9` | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/39#pullrequestreview-5694815387 |
| Branch sync | `GITHUB_UPDATE_A_PULL_REQUEST_BRANCH` (collab) after #40 landed on `main` | Head → `7794a0c` |
| GitHub formal re-`APPROVE` on post-sync `7794a0c` | **APPROVED** · COLLABORATOR | https://github.com/mplsjohnnycage/factory/pull/39#pullrequestreview-5694832398 |
| Cursor App `gh` APPROVE | **Blocked** — App token 403 `addPullRequestReview` | Formal path is write collab |
| Johnny (`mplsjohnnycage`) as reviewer | **Skipped** — Johnny out of review | Linear→GitHub COMMENT only (not APPROVE) |
| Linear `submit_diff_review` `approved` | **Blocked** — “Could not submit the review to GitHub” | Expected |
| Linear `submit_diff_review` `commented` | **Submitted** | comment `b694ea04-…` |
| Protection | **Unchanged** — no `required_approving_review_count` dip; no admin merge | — |
| Merge | Squash via `gh pr merge` after write APPROVE + green CI | `9a987a5` |

## Acceptance checklist

Must all pass → APPROVE → merge.

| Check | Evidence | Pass/fail |
| --- | --- | --- |
| Stable Dev OS callback in OpenAccess | `https://factory-developer-os.vercel.app/api/auth/callback` added; localhost + `127.0.0.1` retained | **PASS** |
| Client id unchanged | `factory.port_client_id` = `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` | **PASS** |
| No Observatory | Diff URIs have zero Observatory/Harness hosts; `observatory_forbidden: true` retained | **PASS** |
| OpenMCP untouched | `/.well-known/openmcp.json` still `mcp` / `auth.url` = `https://mcp.port.io/v1` only | **PASS** |
| Validator | `node scripts/validate-well-known.mjs` exit **0** on head (incl. “forbids Observatory reuse”) | **PASS** |
| CI `meta-ci-presence` | SUCCESS on `05b3fe9` and post-sync `7794a0c` (includes Validate OpenMCP + OpenAccess well-knowns step) | **PASS** |
| Other required checks | `local-gate-refuse` SUCCESS; `Vercel – factory-developer-os` SUCCESS on `7794a0c` | **PASS** |
| Live Port Factory EI alignment | Read-only `list_external_interface_apps`: Factory-only app; allowlist includes stable URI + localhost pair (+ temp `n5tdoht4l` preview URI **not** published in OpenAccess — correct) | **PASS** |
| Diff scope / no Port mutation | Single file `.well-known/openaccess.json` (+2/−1); no `upsert`/`revoke` External Interface from this PR | **PASS** |
| Author ≠ reviewer | Author worker ≠ `bc-e92c5655`; formal APPROVE as write collab | **PASS** |
| Repo public | `private: false` confirmed; no flip | **PASS** |
| Formal APPROVE counts for protection | write COLLABORATOR on exact merge head | **PASS** |

## Diff scope

1 file · +2 / −1 vs pre-sync base `fd4a774` · feature commit `05b3fe9` + merge-main `7794a0c`.

- Modified: `.well-known/openaccess.json` — append stable HTTPS Dev OS callback to `redirect_uris`

## Consistency skim

- Matches FE-120 / FE-128 / redirect-pin work: production callback path is `/api/auth/callback` on `factory-developer-os.vercel.app`.
- OpenAccess publishes the **stable** set (localhost pair + stable host); live Port still carries a temporary preview URI for prune after pin — out of OpenAccess emit scope.
- ADR-005 Factory client id unchanged; Observatory remains forbidden in descriptor flags.
- Meta lane only; no Product Beads; no browser→Sandbox; no dual-write.

## Findings

### Blocking

None.

### Non-blocking

1. Live Port EI still lists temp preview URI `https://factory-developer-n5tdoht4l-johnnyc.vercel.app/api/auth/callback` — prune is a separate ops tick (FE-128), not a reason to block OpenAccess publish of the stable URI.
2. GraphQL `reviewDecision` field stayed empty in `gh pr view` even while reviews API showed `APPROVED` COLLABORATOR and `mergeStateStatus: CLEAN` — behavioral protection satisfied; do not treat empty `reviewDecision` as missing APPROVE.
3. First merge attempt failed with “head branch is not up to date” after #40 landed; sync + re-APPROVE + green re-run resolved without admin / protection changes.

## Local / CI verify

```text
node scripts/validate-well-known.mjs
# Inventory §7 items 9–10 shape OK … Zero Port mutations.  exit 0

meta-ci-presence @ 7794a0c → SUCCESS
  (Spec+ADR smoke + Validate OpenMCP + OpenAccess well-knowns)
local-gate-refuse @ 7794a0c → SUCCESS
Vercel – factory-developer-os @ 7794a0c → SUCCESS
```

## Recommendation / outcome

| Item | Value |
| --- | --- |
| Decision | **APPROVE** |
| Merge | **Done** — squash `9a987a5` on `main` |
| PR | https://github.com/mplsjohnnycage/factory/pull/39 |
| Formal APPROVE | [5694815387](https://github.com/mplsjohnnycage/factory/pull/39#pullrequestreview-5694815387) → re-[5694832398](https://github.com/mplsjohnnycage/factory/pull/39#pullrequestreview-5694832398) |
| Protection | Not lowered |
| Observatory | Untouched |
