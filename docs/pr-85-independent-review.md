---
cursor:
  subagentId: "bc-4c7217a5-68a6-59cc-a2b7-42e7f175b7b0"
---

# OpenAccess + OpenMCP linkage smoke kit — Independent review + merge (PR #85)

**Verdict: APPROVE → squash-merged**

| Field | Value |
| --- | --- |
| Repo | [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC**) |
| PR | https://github.com/mplsjohnnycage/factory/pull/85 (**MERGED**) |
| Branch | `cursor/openaccess-linkage-smoke-kit-984f` |
| Content head reviewed | `73068e9238fd56e973250eebf506830a9270672c` |
| Base at review | `main` @ `90a4d7d5dc03daccb4e8851082bf9d946e85f089` (#84) |
| **Merge SHA** | `4a260463894f65e594fd0ee2e23579e87beace17` |
| Merged at | `2026-10-29T17:57:37Z` (squash via `mplsjohnnycage`) |
| Author session | `bc-5594964f-d62c-504f-9a0f-b20dc2f3984f` |
| Independent review session | `bc-4c7217a5-68a6-59cc-a2b7-42e7f175b7b0` (**≠ author**) |
| Ticket | FE-178 OpenAccess linkage smoke kit |

## Formal GitHub review / write gate

| Channel | Result | Link |
| --- | --- | --- |
| Cursor App `gh` APPROVE | Not used (App lacks write collab identity) | — |
| Composio formal `APPROVE` as `skysthelimitpainting1779-collab` on `73068e9` (`github_busky-styful`) | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/85#pullrequestreview-5702536581 |
| Squash-merge via Composio (`mplsjohnnycage` / `github_retier-fice`) on tip `73068e9` | **MERGED** | merge SHA `4a260463894f65e594fd0ee2e23579e87beace17` |
| `required_approving_review_count` | **Unchanged** (not lowered) | — |
| Author ≠ reviewer | **PASS** — author `bc-5594964f…` ≠ reviewer `bc-4c7217a5…`; formal login `skysthelimitpainting1779-collab` ≠ `mplsjohnnycage` | — |

## Acceptance checklist (content head `73068e9`)

| # | Check | Result |
| --- | --- | --- |
| 1 | Scope = OpenAccess/OpenMCP ↔ Dev OS OAuth **linkage** smoke kit (+582/−1; 6 files) | **PASS** |
| 2 | Intent = `npm run dry-run:openaccess-linkage` (markers + `validate-well-known`; optional `--memory` / `--live`) | **PASS** |
| 3 | Diff is docs/scripts/package + cross-links only — no Port schema / gateway Dockerfile runtime edits | **PASS** |
| 4 | No secret leaks; forbidden-secret regex in kit; no committed secret assignments | **PASS** |
| 5 | Port upsert / EI mutate / WEBHOOK remount **REFUSED** in script + ops doc | **PASS** |
| 6 | Non-overlap vs #82 gateway Dockerfile + `/health` (explicit OUT OF SCOPE; no Dockerfile files touched) | **PASS** |
| 7 | Non-overlap vs Atlas BFF live invoke / Funnel admit / FE-172 Sign-in | **PASS** |
| 8 | FE-142 CLOSED · FE-172 CLOSED — no Johnny asks | **PASS** |
| 9 | Parallel #84 Beads Dolt: reviewer rebased #85 only; kept all three dry-run scripts | **PASS** |
| 10 | `npm run dry-run:openaccess-linkage` exit 0; `--live` raw GitHub 200 | **PASS** |
| 11 | CI: `meta-ci-presence` SUCCESS (required); `local-gate-refuse` + `developer-os-typecheck-test-build` SUCCESS | **PASS** |
| 12 | Vercel free-tier rate-limit FAILURE **ignored** (not a merge gate) | **PASS** |
| 13 | Formal write APPROVE + squash-mergeable; author ≠ formal reviewer | **PASS** |

## Diff scope

6 files · +582 / −1 vs `origin/main` @ post-#84 · tip `73068e9`.

| Path | Role |
| --- | --- |
| `docs/ops/openaccess-linkage-smoke.md` | **ADDED** — PM checklist; FE-142/FE-172 closed; non-overlap vs #82 / Atlas / Funnel |
| `scripts/openaccess-linkage-dry-run.mjs` | **ADDED** — kit markers + validate-well-known + redirect/client-id linkage; secret-assignment refuse |
| `package.json` | **MODIFIED** — `dry-run:openaccess-linkage` (kept #82 + #84 scripts after rebase) |
| `apps/developer-os/README.md` | **MODIFIED** — ops kit pointers |
| `docs/devos-port-oauth-vercel-env.md` | **MODIFIED** — linkage smoke cross-link |
| `scripts/validate-well-known.mjs` | **MODIFIED** — header pointer to linkage kit |

## Rebase note (DIRTY → clean)

1. Initial tip `0f88d54` branched from pre-#82 `05a190c` → **DIRTY** vs `main` after #82 (sole conflict: root `package.json` scripts).
2. Reviewer rebased onto post-#82 `f32b67f`, keeping `dry-run:gateway-dockerfile-health` + `dry-run:openaccess-linkage` → tip `f7d69a6`.
3. #84 Beads Dolt squash-merged in parallel (`90a4d7d`) → second rebase on #85 only; kept **all three** scripts (`gateway-dockerfile-health`, `beads-dolt-health`, `openaccess-linkage`) → tip `73068e9`.
4. Did **not** edit #84 branch or PR.

## Consistency skim

- Documents existing OpenAccess / OpenMCP well-knowns + Dev OS `CALLBACK_PATH` / public Factory client id contract; does not mutate Port OAuth apps.
- Explicit non-overlap with #82 Dockerfile health, Atlas BFF smoke, Funnel admit, human Sign-in.
- Public PKCE client id treated as non-secret (matches prior Dev OS docs).
- Zero spend; no Adapter `mcp_auth`; no Product Beads.

## Live verify (reviewer session)

```text
npm run dry-run:openaccess-linkage
→ exit 0
→ Port mutate: REFUSED
→ Secrets print: REFUSED
→ FE-142 / FE-172: CLOSED
→ Gateway Dockerfile health (#82): OUT OF SCOPE
→ OK markers + validate-well-known + redirect/client-id linkage

npm run dry-run:openaccess-linkage -- --live
→ exit 0
→ raw GitHub main openaccess.json / openmcp.json → 200 (GET only)
(No env values / secrets printed)
```

## CI at tip `73068e9`

| Check | Conclusion |
| --- | --- |
| `meta-ci-presence` | **SUCCESS** (required) |
| `local-gate-refuse` | **SUCCESS** |
| `developer-os-typecheck-test-build` | **SUCCESS** |
| Vercel – factory-developer-os | **FAILURE** — free-tier build rate limit; **not a code defect; not a merge gate** |

## Findings

### Blocking

None.

### Non-blocking

1. Dual Composio collab connection IDs exist for `skysthelimitpainting1779-collab`; review used `github_busky-styful`.
2. Vercel Preview blocked by free-tier rate limit — ignore until quota resets.
3. Optional `--memory` Dev OS unit probe not re-run in reviewer session (default + `--live` sufficient for merge gate).

## Explicit non-actions (honored)

- No Port schema / blueprint / workflow live apply
- No EI create/delete/revoke
- No secrets printed or re-asked (FE-142 CLOSED)
- No Johnny Sign-in ask (FE-172 CLOSED)
- No spend
- No Observatory touch
- No Product Beads
- No protection dip / admin override
- Did not touch PR #84 (Beads Dolt) beyond reading merge state
- Author ≠ reviewer (session + GitHub login)
- Vercel rate-limit not treated as merge blocker

## Outcome

| Item | Value |
| --- | --- |
| Verdict | **APPROVE** |
| Formal review | https://github.com/mplsjohnnycage/factory/pull/85#pullrequestreview-5702536581 |
| Merge | **squash-merged** → `4a260463894f65e594fd0ee2e23579e87beace17` |
| Rebase comment | https://github.com/mplsjohnnycage/factory/pull/85#issuecomment-6504353800 |

## PM 3-line summary

- **Board:** [#85](https://github.com/mplsjohnnycage/factory/pull/85) OpenAccess linkage smoke kit (FE-178) — independent write **APPROVE** (`skysthelimitpainting1779-collab`) + squash-**MERGED** (`4a26046`); FE-142/FE-172 stay CLOSED.
- **Shipped:** Offline kit `dry-run:openaccess-linkage` (+ `--live`) PASS; Port REFUSED; zero spend; rebased clean past #82/#84 `package.json` races; Vercel rate-limit ignored.
- **Next:** Prefer next Meta cloud kit that is not blocked on Johnny/HMAC/Sign-in (FE-142/FE-172 CLOSED).
