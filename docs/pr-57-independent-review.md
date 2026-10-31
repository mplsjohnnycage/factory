---
cursor:
  subagentId: "bc-d5caa5cf-189b-58e2-a439-3338a98988aa"
---

# Beads / Funnel gateway tick — Independent review + merge (PR #57)

**Verdict: APPROVE → squash-merged**

| Field | Value |
| --- | --- |
| Repo | [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC**) |
| PR | https://github.com/mplsjohnnycage/factory/pull/57 (**MERGED**) |
| Branch | `cursor/beads-tailnet-gateway-tick-b408` |
| Content head reviewed | `1effcf3c54a0d810f3be01b4b96d9ef14ef9eaea` |
| **Merge SHA** | `2db2c40755db72e76fd3204935ddd70abcfa3a7d` |
| Author session | `bc-c26498ef-3ec6-5528-bd0b-5ac5142fb408` |
| Independent review session | `bc-d5caa5cf-189b-58e2-a439-3338a98988aa` (**≠ author**; Auto) |

## Formal GitHub review / write gate

| Channel | Result | Link |
| --- | --- | --- |
| Cursor App `gh` APPROVE | Not used (App lacks write collab identity) | — |
| Composio formal `APPROVE` as `skysthelimitpainting1779-collab` on `1effcf3` | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/57#pullrequestreview-5701207787 |
| Squash-merge via Composio (`mplsjohnnycage`) on tip `1effcf3` | **MERGED** | merge SHA `2db2c40755db72e76fd3204935ddd70abcfa3a7d` |
| `required_approving_review_count` | **Unchanged** (not lowered) | — |
| Author ≠ reviewer | **PASS** — author `bc-c26498ef…` ≠ reviewer `bc-d5caa5cf…`; formal login `skysthelimitpainting1779-collab` ≠ `mplsjohnnycage` | — |

## Acceptance checklist

| # | Check | Result |
| --- | --- | --- |
| 1 | Scope = docs + health script only (+475/−29; 6 files) | **PASS** |
| 2 | No secrets leaked in diff (placeholders `…` / `Bearer bad` only; never print HMAC digest or env secret) | **PASS** |
| 3 | Script probes Funnel only; no Port `upsert_*` / `trigger_run` / EI mutate | **PASS** |
| 4 | Docs refuse Port schema apply / OAuth mutate; remount inventory notes fencing stays `api.port.io` | **PASS** |
| 5 | Beads admit→gateway path map is Meta-only (`factory-` prefix; no Product Beads invent) | **PASS** |
| 6 | CI green incl. required `meta-ci-presence` on reviewed tip | **PASS** |
| 7 | Formal write APPROVE before merge; protection count not dipped | **PASS** |
| 8 | Author ≠ formal reviewer | **PASS** |
| 9 | Branch current vs `main` at merge (0 behind / 1 ahead) | **PASS** |

## Diff scope

6 files · +475 / −29 vs `main` · tip reviewed `1effcf3`.

| Path | Role |
| --- | --- |
| `scripts/gateway-tailnet-health.mjs` | **ADDED** — Funnel `/health` + unsigned 401/404/401 gates; optional env-only signed 202 |
| `docs/gateway-hmac-smoke.md` | **ADDED** — HMAC smoke recipe; secrets never printed |
| `docs/beads-admit-gateway-path.md` | **ADDED** — Port `gateway_admit` → Funnel → BdMetaBeads map |
| `docs/port-workflow-webhooks.md` | **MODIFIED** — remount live / HMAC pending inventory |
| `docs/gateway-remount-dry-run.md` | **MODIFIED** — cross-links to smoke + admit path |
| `apps/factory-gateway/README.md` | **MODIFIED** — pointer to health script + docs |

## CI at reviewed tip `1effcf3`

| Check | Conclusion |
| --- | --- |
| `meta-ci-presence` | **SUCCESS** (required) |
| `gateway-typecheck-test` | **SUCCESS** |
| `local-gate-refuse` | **SUCCESS** |
| Vercel – factory-developer-os | **SUCCESS** |
| Vercel Preview Comments | **SUCCESS** |

## Consistency skim

- Author context `/cursor/stores/self/docs/beads-tailnet-gateway-tick.md` matches PR claims: Funnel unsigned probes PASS; Port dry-read only; signed 202 still Johnny-blocked on secret mirror — **not** a merge blocker for this docs/script PR.
- Remount inventory correctly separates fencing (`api.port.io`) from additive `gateway_admit` Funnel URLs.
- Optional signed smoke gated behind `GATEWAY_HMAC_SMOKE=1` + env secret; default path never requires secrets.

## Findings

### Blocking

None.

### Non-blocking

1. Live signed **202** still pending Johnny mirroring `PORT_CLIENT_SECRET` / handler token on DESKTOP-3APDBKG — correctly documented as follow-up, out of this PR’s ship gate.
2. Catalog writes in Port workflows remain `UPSERT_ENTITY` (noted pre-existing §4.2.1 bypass) — inventory honesty, not introduced by this PR.

## Explicit non-actions (this review session)

- No Port blueprint/workflow upsert / schema apply  
- No Port secret upsert / `trigger_run`  
- No OAuth External Interface create/delete/revoke  
- No Observatory  
- No Product Beads / `bd dolt push`  
- No protection dip / admin override  

## Outcome

| Item | Value |
| --- | --- |
| Decision | **APPROVE → squash-merged** |
| PR | https://github.com/mplsjohnnycage/factory/pull/57 |
| Merge SHA | `2db2c40755db72e76fd3204935ddd70abcfa3a7d` |
| Formal review | https://github.com/mplsjohnnycage/factory/pull/57#pullrequestreview-5701207787 |
| Protection | Write APPROVE kept; count not dipped |
