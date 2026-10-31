---
cursor:
  subagentId: "bc-007c130f-7537-5f2c-a4a8-3aa411b41738"
---

# Code Atlas follow-ups (STL-154) — Independent review + merge (PR #58)

**Verdict: APPROVE → squash-merged**

| Field | Value |
| --- | --- |
| Repo | [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC**) |
| PR | https://github.com/mplsjohnnycage/factory/pull/58 (**MERGED**) |
| Branch | `cursor/code-atlas-followups-ddc3` |
| Content head reviewed | `da02ebe02bda5acf7b3f54dd79d0c4e637f0eea0` |
| Merge tip (post update-from-main) | `8e36360ed361d74ed7fe72a78a3abdd739deb86c` |
| **Merge SHA** | `c816d2fdb934cc855f79403ddcca35b48ce9eae4` |
| Merged at | `2026-10-29T16:25:±Z` (squash via `mplsjohnnycage`) |
| Author session | `bc-e4c1f61b-7c24-57b5-a68f-37dd4536ddc3` |
| Independent review session | `bc-007c130f-7537-5f2c-a4a8-3aa411b41738` (**≠ author**; Auto) |
| Author report | [`docs/code-atlas-followups-tick.md`](./code-atlas-followups-tick.md) |

## Formal GitHub review / write gate

| Channel | Result | Link |
| --- | --- | --- |
| Cursor App `gh` APPROVE | Not used (App lacks write collab identity) | — |
| Composio formal `APPROVE` as `skysthelimitpainting1779-collab` on `da02ebe` (retained through branch update → tip `8e36360`) | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/58#pullrequestreview-5701226074 |
| Squash-merge via Composio (`mplsjohnnycage`) on tip `8e36360` | **MERGED** | merge SHA `c816d2fdb934cc855f79403ddcca35b48ce9eae4` |
| `required_approving_review_count` | **Unchanged** (not lowered) | — |
| Author ≠ reviewer | **PASS** — author `bc-e4c1f61b…` ≠ reviewer `bc-007c130f…`; formal login `skysthelimitpainting1779-collab` ≠ `mplsjohnnycage` | — |

## Acceptance checklist (content head `da02ebe` / merge tip `8e36360`)

| # | Check | Result |
| --- | --- | --- |
| 1 | BFF `/api/atlas/tools`: JSON content-type required (415), 64 KiB body cap (413), `Cache-Control: no-store` + `X-Content-Type-Options: nosniff` | **PASS** |
| 2 | Port underscore → OpenMCP dotted normalize (`atlas_find_node` → `atlas.find_node`); responses echo dotted | **PASS** |
| 3 | Subgraph depth clamp (`MAX_DEPTH=8`) + no-store headers | **PASS** |
| 4 | OpenMCP `factory.atlas_tools.map` dotted→underscore; `tools[]` dotted-only | **PASS** |
| 5 | `scripts/validate-well-known.mjs` asserts atlas map + no `atlas_*` in tools[] | **PASS** (local run OK) |
| 6 | `scripts/atlas-bff-smoke.mjs` + `npm run smoke:atlas-bff` (dry-run / prod / local) | **PASS** (dry-run OK; live alias needs this SHA on prod) |
| 7 | Spec scenario + README + prep status → APPLIED (no re-apply) | **PASS** |
| 8 | CI `meta-ci-presence` green before merge | **PASS** |
| 9 | `developer-os-typecheck-test-build` + `local-gate-refuse` green | **PASS** (CI on tip) |
| 10 | No secrets in diff | **PASS** |
| 11 | No Port schema upsert/delete / no Observatory / no OAuth mutate | **PASS** |
| 12 | Repo public; author ≠ formal reviewer | **PASS** |

## Diff scope

12 files · +552 / −44 vs `main` · tip `da02ebe` (+ merge commit from main `#57` before squash).

| Path | Role |
| --- | --- |
| `apps/developer-os/src/lib/atlas/tool-names.ts` | Normalize + body-size / content-type helpers |
| `apps/developer-os/src/app/api/atlas/tools/route.ts` | BFF hardening + alias accept |
| `apps/developer-os/src/app/api/atlas/subgraph/route.ts` | Depth clamp + no-store |
| `apps/developer-os/test/atlas-projection.test.ts` | Underscore↔dotted unit coverage |
| `.well-known/openmcp.json` | `factory.atlas_tools` naming map |
| `scripts/validate-well-known.mjs` | Enforce dotted tools[] + map |
| `scripts/atlas-bff-smoke.mjs` | Read-only BFF smoke |
| `package.json` | `smoke:atlas-bff` script |
| `docs/port/atlas-mcp-port-schema-prep.md` | APPLIED status; no re-apply |
| `apps/developer-os/README.md` / `specs/developer-os/spec.md` | Operator + Contract sync |

## CI at merge tip `8e36360`

| Check | Conclusion |
| --- | --- |
| `meta-ci-presence` | **SUCCESS** (required) |
| `developer-os-typecheck-test-build` | **SUCCESS** |
| `local-gate-refuse` | **SUCCESS** |
| Vercel – factory-developer-os | **SUCCESS** (preview) |

First merge attempt on content head `da02ebe` returned 405 (`meta-ci-presence` expected) because PR was `BEHIND` main by `#57`. Branch update → tip `8e36360`, CI re-green, collab APPROVE retained → squash-merge succeeded.

Local `npm test` in this reviewer workspace failed only for missing `tsx`/`node_modules` (env not installed). Accept path is CI on exact SHA — green.

## Consistency skim

- Read-projection only — smoke and BFF hit Dev OS routes; no Port MCP/API upsert calls in added code.
- Prep doc flip to APPLIED matches prior Johnny-approved apply lane; PR text forbids silent re-apply.
- OpenMCP stays dotted-only; Port underscore documented in map, not in `tools[]`.
- Langfuse live-owner refuse retained in smoke check #4.

## Findings

### Blocking

None.

### Non-blocking

1. `Content-Length` pre-check is advisory; actual enforcement is post-`request.text()` length — correct; chunked bodies without CL still capped.
2. Prod live smoke (underscore alias) will pass only after Vercel production picks up merge SHA — expected follow-on, not a merge blocker.
3. Dual Composio collab connection IDs exist for `skysthelimitpainting1779-collab`; review used `github_busky-styful`.

## Explicit non-actions (honored)

- No Port schema / blueprint / workflow live apply from this review session
- No Observatory
- No OAuth URI mutation
- No Product Beads
- No protection dip / admin override
- Zero spend; no secrets printed

## Outcome

| Item | Value |
| --- | --- |
| Decision | **APPROVE → squash-merged** |
| PR | https://github.com/mplsjohnnycage/factory/pull/58 |
| Merge SHA | `c816d2fdb934cc855f79403ddcca35b48ce9eae4` |
| Formal review | https://github.com/mplsjohnnycage/factory/pull/58#pullrequestreview-5701226074 |
| Protection | Write APPROVE kept; count not dipped |
| Port schema | Untouched this PR/review |
| Observatory | None |

## Johnny 3-line report

- **Merged:** [#58](https://github.com/mplsjohnnycage/factory/pull/58) → `c816d2f` (squash); formal write APPROVE `skysthelimitpainting1779-collab` ([PRR 5701226074](https://github.com/mplsjohnnycage/factory/pull/58#pullrequestreview-5701226074)).
- **Why green:** BFF hardening + `atlas_*`↔`atlas.*` normalize + OpenMCP map + smoke script verified; no secrets; no Port upserts; `meta-ci-presence` green on tip after `#57` branch update.
- **Next:** Re-run `npm run smoke:atlas-bff` against prod once Vercel ships merge SHA (alias check).
