---
cursor:
  subagentId: "bc-8f60d0b4-5c7b-5670-b15c-43ed13229ed9"
---

# Signed HMAC admit smoke ops kit — Independent review + merge (PR #71)

**Verdict: APPROVE → squash-merged**

| Field | Value |
| --- | --- |
| Repo | [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC**) |
| PR | https://github.com/mplsjohnnycage/factory/pull/71 (**MERGED**) |
| Branch | `cursor/signed-admit-smoke-ops-28e9` |
| Content head reviewed (final) | `c9f837d7f426d6bba37a79ab4f99e838d7314410` |
| Prior tips reviewed | `083318f` → `9af4df0` (races #68/#73) → `c9f837d` |
| **Merge SHA** | `6ba151b735a77cec72c23a3eebd574d229175220` |
| Merged at | `2026-10-29T17:22:±Z` (squash via `mplsjohnnycage`) |
| Author session | `bc-ed51acef-7874-502d-acdd-4185e53a28e9` |
| Independent review session | `bc-8f60d0b4-5c7b-5670-b15c-43ed13229ed9` (**≠ author**) |
| Author tick | [`docs/signed-admit-smoke-tick.md`](./signed-admit-smoke-tick.md) |

## Formal GitHub review / write gate

| Channel | Result | Link |
| --- | --- | --- |
| Cursor App `gh` APPROVE | Not used (App lacks write collab identity) | — |
| Composio formal `APPROVE` on `083318f` | **APPROVED** | https://github.com/mplsjohnnycage/factory/pull/71#pullrequestreview-5701988369 |
| Composio formal `APPROVE` on `9af4df0` | **APPROVED** | https://github.com/mplsjohnnycage/factory/pull/71#pullrequestreview-5702029146 |
| Composio formal `APPROVE` as `skysthelimitpainting1779-collab` on `c9f837d` (`github_busky-styful`) | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/71#pullrequestreview-5702071728 |
| Squash-merge via Composio (`mplsjohnnycage` / `github_retier-fice`) on tip `c9f837d` | **MERGED** | merge SHA `6ba151b735a77cec72c23a3eebd574d229175220` |
| `required_approving_review_count` | **Unchanged** (not lowered) | — |
| Author ≠ reviewer | **PASS** — author `bc-ed51acef…` ≠ reviewer `bc-8f60d0b4…`; formal login `skysthelimitpainting1779-collab` ≠ `mplsjohnnycage` | — |

## Acceptance checklist (final tip `c9f837d`)

| # | Check | Result |
| --- | --- | --- |
| 1 | Diff is docs/scripts kit only (7 files) | **PASS** |
| 2 | Ops kit: probe 5 **202**, probe 6 **400 `action_required`** | **PASS** |
| 3 | FE-142 closed; env names only; never echo values | **PASS** |
| 4 | No secrets committed | **PASS** |
| 5 | No Port schema upsert / EI OAuth / workflow mutate | **PASS** |
| 6 | `npm run dry-run:gateway-signed` → EXIT 0 on `c9f837d` | **PASS** |
| 7 | Live unsigned + signed ABSENT SKIP (prior session) | **PASS** |
| 8 | `--require-signed` ABSENT → exit 1 (prior session) | **PASS** |
| 9 | Docs cross-links | **PASS** |
| 10 | CI: `meta-ci-presence` + `local-gate-refuse` green | **PASS** |
| 11 | `package.json` keeps all three dry-run scripts (`gateway-signed`, `supervisor-admit`, `windows-logon`) | **PASS** |
| 12 | Formal write APPROVE + CLEAN mergeable → squash | **PASS** |
| 13 | Repo public; author ≠ formal reviewer | **PASS** |

## Diff scope

7 files · +452 / −25 · tip `c9f837d` → squash `6ba151b`.

| Path | Role |
| --- | --- |
| `docs/ops/signed-admit-smoke.md` | **ADDED** — PM ops kit |
| `scripts/gateway-signed-admit-dry-run.mjs` | **ADDED** — kit + `--live` / `--require-signed` |
| `scripts/gateway-tailnet-health.mjs` | Probe 6 + `--require-signed` |
| `docs/gateway-hmac-smoke.md` | Signed section refresh |
| `docs/beads-admit-gateway-path.md` | Cross-link |
| `docs/ops/beads-gateway-unsigned-admit.md` | Cross-link |
| `package.json` | `dry-run:gateway-signed` (+ retained supervisor + windows-logon) |

## Live verify (reviewer session)

```text
npm run dry-run:gateway-signed              → EXIT 0 (kit markers)
npm run dry-run:gateway-signed -- --live    → 200 / 401 / 404 / 401; probes 5/6 SKIP ABSENT
npm run dry-run:gateway-signed -- --live --require-signed → EXIT 1 ABSENT
npm run dry-run:gateway-unsigned -- --live  → EXIT 0
```

## CI at merge tip `c9f837d`

| Check | Conclusion |
| --- | --- |
| `meta-ci-presence` | **SUCCESS** |
| `local-gate-refuse` | **SUCCESS** |
| Vercel – factory-developer-os | **SUCCESS** |
| Vercel Preview Comments | **SUCCESS** |

## Findings

### Blocking

None (cleared after post-#73 rebase).

### Non-blocking

1. Dual Composio collab connection IDs; review used `github_busky-styful`.
2. Two mid-merge races on root `package.json` (#68 then #73) required author rebases before final squash.

## Explicit non-actions (honored)

- No Port schema / blueprint / workflow live apply
- No secrets printed or committed
- No FE-142 HMAC / handler-token re-ask / Johnny ping
- No spend
- No Observatory / OAuth URI mutation
- No Product Beads
- No protection dip / admin override
- Author ≠ reviewer (session + GitHub login)

## Outcome

| Item | Value |
| --- | --- |
| Decision | **APPROVE → squash-merged** |
| PR | https://github.com/mplsjohnnycage/factory/pull/71 |
| Merge SHA | `6ba151b735a77cec72c23a3eebd574d229175220` |
| Formal review (final) | https://github.com/mplsjohnnycage/factory/pull/71#pullrequestreview-5702071728 |
| Protection | Write APPROVE kept; count not dipped |
| Port schema | Untouched |
| Secrets / spend | None |

## PM 3-line summary

- **Merged:** [#71](https://github.com/mplsjohnnycage/factory/pull/71) → `6ba151b` (squash); formal write APPROVE `skysthelimitpainting1779-collab` ([PRR 5702071728](https://github.com/mplsjohnnycage/factory/pull/71#pullrequestreview-5702071728)).
- **Why green:** signed admit smoke ops kit only; offline + live unsigned PASS; all three dry-run scripts retained; no Port upserts; no secrets; `meta-ci-presence` + `local-gate-refuse` green on `c9f837d`.
- **Next:** FE-142 stays closed — do not re-ask HMAC/handler-token; live signed probes remain operator-env (`GATEWAY_HMAC_SMOKE=1 npm run dry-run:gateway-signed -- --live`).
