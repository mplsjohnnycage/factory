---
cursor:
  subagentId: "bc-fbda7ad7-f0a5-5e75-8e87-2a9aad4ecfd4"
---

# Sandbox harness readiness dry-run kit — Independent review + merge (PR #78)

**Verdict: APPROVE → squash-merged**

| Field | Value |
| --- | --- |
| Repo | [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC**) |
| PR | https://github.com/mplsjohnnycage/factory/pull/78 (**MERGED**) |
| Branch | `cursor/sandbox-harness-readiness-kit-dfa1` |
| Content head reviewed | `95889b56df3b883dd9d3723b28fc36969b2662b7` |
| Pre-rebase tip (author) | `568367f017fefe6b7bf0e2fb87fa1c34b83ac91e` |
| **Merge SHA** | `242070e9f62117c8c8c65e9acf31c6944e04b68c` |
| Merged at | `2026-10-29T17:40:±Z` (squash via `mplsjohnnycage`) |
| Author session | `bc-100b7cb2-389e-5b40-bfd4-abc9ad24dfa1` |
| Independent review session | `bc-fbda7ad7-f0a5-5e75-8e87-2a9aad4ecfd4` (**≠ author**) |
| Author tick | [`docs/sandbox-harness-kit-tick.md`](./sandbox-harness-kit-tick.md) |

## Formal GitHub review / write gate

| Channel | Result | Link |
| --- | --- | --- |
| Cursor App `gh` APPROVE | Not used (App lacks write collab identity) | — |
| Composio formal `APPROVE` as `skysthelimitpainting1779-collab` on `95889b5` (`github_busky-styful`) | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/78#pullrequestreview-5702297147 |
| Squash-merge via Composio (`mplsjohnnycage` / `github_retier-fice`) on tip `95889b5` | **MERGED** | merge SHA `242070e9f62117c8c8c65e9acf31c6944e04b68c` |
| `required_approving_review_count` | **Unchanged** (not lowered) | — |
| Author ≠ reviewer | **PASS** — author `bc-100b7cb2…` ≠ reviewer `bc-fbda7ad7…`; formal login `skysthelimitpainting1779-collab` ≠ `mplsjohnnycage` | — |

## Acceptance checklist (content head `95889b5`)

| # | Check | Result |
| --- | --- | --- |
| 1 | Scope = sandbox-harness morning/readiness dry-run kit (+349/−2; 5 files post-rebase) | **PASS** |
| 2 | Diff is docs/scripts/package + README/ADR cross-links only — no Port schema / runtime gateway code | **PASS** |
| 3 | Matches tick: FE-175 kit; FE-142 CLOSED; FE-172 CLOSED; zero spend; non-overlap vs #76 | **PASS** |
| 4 | `npm run dry-run:sandbox-harness` exit 0; Port mutate **REFUSED**; no secrets | **PASS** |
| 5 | `--memory` → 5/5 MemorySandboxLease unit tests exit 0 (no Docker/Claude) | **PASS** |
| 6 | Image pin markers: `rivetdev/sandbox-agent:0.5.4-full` · SDK `0.5.4` · M1 `claude` | **PASS** |
| 7 | Browser→SA ban markers present (README / Spec / ADR-006) | **PASS** |
| 8 | Forbidden-secret regex: empty `.env.example` keys only; no committed assignments | **PASS** |
| 9 | Cross-links: ops kit ↔ harness README ↔ ADR-006 | **PASS** |
| 10 | Prior dry-run scripts preserved (`gateway-*`, `supervisor-admit`, `windows-logon`, `rivet-compose-serve`, `omniroute`) | **PASS** |
| 11 | Live Docker+Claude correctly **OUT OF SCOPE** (desktop operator) | **PASS** |
| 12 | CI: `meta-ci-presence` SUCCESS (required); `local-gate-refuse` + `sandbox-typecheck-test` SUCCESS | **PASS** |
| 13 | Vercel free-tier rate-limit FAILURE **ignored** (not code defect; not merge gate) | **PASS** |
| 14 | Formal write APPROVE + mergeable; author ≠ formal reviewer | **PASS** |

## Diff scope

5 files · +349 / −2 vs `origin/main` @ post-#76 · tip `95889b5`.

| Path | Role |
| --- | --- |
| `docs/ops/sandbox-harness-readiness.md` | **ADDED** — PM checklist; FE-142/FE-172 closed; non-overlap vs #76 |
| `scripts/sandbox-harness-dry-run.mjs` | **ADDED** — kit markers + optional `--memory` Memory tests; secret-assignment refuse |
| `package.json` | **MODIFIED** — `dry-run:sandbox-harness` (kept `#76` `dry-run:rivet-compose-serve`) |
| `apps/sandbox-harness/README.md` | **MODIFIED** — ops kit dry-run cross-link |
| `docs/adrs/ADR-006-sandbox-agent-harness.md` | **MODIFIED** — ops readiness pointer |

## Rebase note (reviewer mechanical)

Author tip `568367f` was **DIRTY** vs `main` after #76 landed (`dry-run:rivet-compose-serve` vs `dry-run:sandbox-harness` in `package.json`). Independent reviewer rebased onto `3c38952`, kept **all** dry-run scripts, force-pushed `95889b5`. No content change beyond conflict resolution.

## Consistency skim

- Builds on PBI-006 / ADR-006 already on `main`; does not re-ship live Docker/Claude from cloud.
- Explicit non-overlap with Rivet Compose/Serve (#76), supervisor admit, signed/unsigned Funnel kits.
- FE-142 / FE-172 closed notes match tick + preferences (no Johnny Sign-in / secret re-asks).
- Forbidden-secret regex skips empty `.env.example` placeholders while scanning kit surface.

## Live verify (reviewer session)

```text
npm run dry-run:sandbox-harness
→ exit 0
→ Port mutate: REFUSED
→ Secrets print: REFUSED
→ FE-142 secret re-ask: CLOSED
→ FE-172 Sign-in re-ask: CLOSED
→ Live Docker / Claude spend: OUT OF SCOPE
→ Rivet Compose + Tailscale Serve: OUT OF SCOPE (PR #76)
→ OK docs/ops/sandbox-harness-readiness.md (+ markers)
→ OK image pin / MemorySandboxLease / browser ban markers
→ Kit dry-run PASS

npm run dry-run:sandbox-harness -- --memory
→ exit 0
→ npm ci @ apps/sandbox-harness
→ 5 tests pass (image pin ×2 + lifecycle + kill identity ×2)
→ OK: kit + Memory lifecycle gates green; Port left untouched
(No env values / secrets printed)
```

## CI at tip `95889b5`

| Check | Conclusion |
| --- | --- |
| `meta-ci-presence` | **SUCCESS** (required) |
| `local-gate-refuse` | **SUCCESS** |
| `sandbox-typecheck-test` | **SUCCESS** |
| Vercel – factory-developer-os | **FAILURE** — free-tier build rate limit (100/day); **not a code defect; not a merge gate** |

## Findings

### Blocking

None.

### Non-blocking

1. Dual Composio collab connection IDs exist for `skysthelimitpainting1779-collab`; review used `github_busky-styful`.
2. Vercel Preview blocked by free-tier rate limit — ignore until quota resets.
3. Live `DockerSandboxLease` + Claude remains desktop STAGED (correct; not a merge gate).

## Explicit non-actions (honored)

- No Port schema / blueprint / workflow live apply
- No EI create/delete/revoke
- No secrets printed or re-asked (FE-142 CLOSED)
- No Johnny Sign-in ask (FE-172 CLOSED)
- No spend
- No Observatory touch
- No Product Beads
- No protection dip / admin override
- No live Docker / Claude from cloud
- Author ≠ reviewer (session + GitHub login)
- Vercel rate-limit not treated as merge blocker

## Outcome

| Item | Value |
| --- | --- |
| Verdict | **APPROVE** |
| Formal review | https://github.com/mplsjohnnycage/factory/pull/78#pullrequestreview-5702297147 |
| Merge | **squash-merged** → `242070e9f62117c8c8c65e9acf31c6944e04b68c` |
| Next cloud Meta | Beads BdMetaBeads offline glue **or** next morning kit gap |

## PM 3-line summary

- **Board:** [#78](https://github.com/mplsjohnnycage/factory/pull/78) sandbox-harness readiness dry-run kit — independent write **APPROVE** (`skysthelimitpainting1779-collab`) + squash-**MERGED** (`242070e`); FE-142/FE-172 stay CLOSED.
- **Shipped:** Offline kit `dry-run:sandbox-harness` (+ `--memory` 5/5) PASS; Port REFUSED; zero spend; rebased past #76 script conflict; Vercel rate-limit ignored.
- **Next:** Beads BdMetaBeads offline glue or next morning kit gap (cloud-viable).
