---
cursor:
  subagentId: "bc-566790ac-1fd7-5839-823f-064539e95b2a"
---

# Supervisor admit offline (G6/G10) — Independent review + merge (PR #48)

**Verdict: APPROVE → squash-merged**

| Field | Value |
| --- | --- |
| Repo | [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC**) |
| PR | https://github.com/mplsjohnnycage/factory/pull/48 (**MERGED**) |
| Branch | `cursor/supervisor-admit-offline-fa95` |
| Content head reviewed | `77f45338ea00eec6fc0f807d385e0b0965184cd4` |
| **Merge SHA** | `97f4d078cdbe1a1aa4aed3d7cfe2ed81bf311754` |
| Merged at | `2026-10-29T14:06:42Z` (squash via `mplsjohnnycage`) |
| Author session | `bc-fe41ecc7-2524-5059-9741-ce4813c8fa95` |
| Independent review session | `bc-566790ac-1fd7-5839-823f-064539e95b2a` (**≠ author**; Auto) |
| Sibling author report | [`supervisor-admit-offline-advance.md`](./supervisor-admit-offline-advance.md) — already present in self store |

## Formal GitHub review / write gate

| Channel | Result | Link |
| --- | --- | --- |
| Cursor App `gh` APPROVE | Not used (App lacks write collab identity) | — |
| Composio formal `APPROVE` as `skysthelimitpainting1779-collab` on `77f4533` | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/48#pullrequestreview-5699040960 |
| Squash-merge via Composio (`mplsjohnnycage`) | **MERGED** | merge SHA `97f4d078cdbe1a1aa4aed3d7cfe2ed81bf311754` |
| `required_approving_review_count` | **Unchanged** (not lowered) | — |
| Author ≠ reviewer | **PASS** — author `bc-fe41ecc7…` ≠ reviewer `bc-566790ac…`; formal login `skysthelimitpainting1779-collab` ≠ `mplsjohnnycage` | — |

## Acceptance checklist (head `77f4533`)

| # | Check | Result |
| --- | --- | --- |
| 1 | G6: `mapToAdmitRequest` / `unwrapAdmitBody` / `admitFromPayload` map bead\|bypass → `AdmitRequest` | **PASS** |
| 2 | Opaque gateway `{action,runId}` alone → `claim_or_bypass_required` (no WorkAttempt) | **PASS** |
| 3 | Thin `POST /admit` + `GET /health` (`node:http`, default bind `127.0.0.1`) | **PASS** |
| 4 | HTTP status mapping covers map refuse + admit refuse (exhaustive `never`) | **PASS** |
| 5 | G10 stub: `admitAndSpawn` + injectable `SessionSpawner` / `SessionSpawnRegistry` | **PASS** |
| 6 | Duplicate `workKey` → no re-spawn; returns prior session if registry knows it | **PASS** |
| 7 | Memory `AgentSessionActor` + `MemorySandboxLease` wired in tests only (no Docker/Rivet host) | **PASS** |
| 8 | Specs updated same PR (`factory-kernel`, `rivet-execution`) + README + `docs/meta-beads.md` | **PASS** |
| 9 | Local `npm ci && typecheck && test` → **24/24** | **PASS** |
| 10 | Formal write APPROVE + green `meta-ci-presence` before merge | **PASS** |
| 11 | No Observatory / remount / prune / PBI-015 / Port OAuth mutate | **PASS** |
| 12 | Repo public; branch protection not lowered | **PASS** |
| 13 | Author ≠ formal reviewer / merge-gate session | **PASS** |

## Diff scope

9 files · +907 / −3 vs `main` @ `f684dc7` · tip `77f4533` · ahead 1 / behind 0 (at review).

| Path | Role |
| --- | --- |
| `apps/project-supervisor/src/admit-entry.ts` | **ADDED** — unwrap/map/admitFromPayload |
| `apps/project-supervisor/src/admit-http.ts` | **ADDED** — thin HTTP admit listener |
| `apps/project-supervisor/src/session-spawn.ts` | **ADDED** — admitAndSpawn + SessionSpawnRegistry |
| `apps/project-supervisor/test/admit-entry.test.ts` | **ADDED** — Memory/Bd/HTTP/G10 Memory spawn |
| `apps/project-supervisor/src/index.ts` | Exports for admit entry / HTTP / spawn |
| `apps/project-supervisor/README.md` | Offline admit + spawn operator notes |
| `docs/meta-beads.md` | Offline admit entry note |
| `specs/factory-kernel/spec.md` | G6/G10 Contract scenarios |
| `specs/rivet-execution/spec.md` | Offline admit consumer scenario |

## CI at merge tip `77f4533`

| Check | Conclusion |
| --- | --- |
| `meta-ci-presence` | **SUCCESS** |
| `supervisor-typecheck-test` | **SUCCESS** |
| `local-gate-refuse` | **SUCCESS** |
| Vercel – factory-developer-os | **SUCCESS** |
| Vercel Preview Comments | **SUCCESS** |

`mergeable_state: clean` · squash-merge succeeded.  
GraphQL `reviewDecision` may stay empty while reviews API shows COLLABORATOR `APPROVED` — same as prior public Meta merges; behavioral protection satisfied.

## Consistency skim

- Closes library half of morning gap **G6** and thin **G10** Memory stub without claiming live Port→gateway→Rivet→Docker fire.
- Builds correctly on merged [#46](https://github.com/mplsjohnnycage/factory/pull/46) (`BdMetaBeads` / `createBdSupervisor`).
- Opaque `{action,runId}` refuse is intentional offline glue — does not invent live Port field contracts.
- Sibling author note [`supervisor-admit-offline-advance.md`](./supervisor-admit-offline-advance.md) already in self; content aligned (ops Funnel/Rivet/Docker still blocked).

## Findings

### Blocking

None.

### Non-blocking

1. HTTP admit listener has no auth — correct for local dry-run (default `127.0.0.1`); must not be exposed publicly without gateway HMAC in front.
2. `portAuthorized` defaults **true** for offline mapping — documented; live path still expects gateway HMAC gate.
3. G10 remains Memory/unit-test stub — Docker SA + Rivet Actor host still ops/desktop (G1/G5/G9).

## Explicit non-actions (honored)

- No Port WEBHOOK upsert / remount  
- No OAuth create/delete/revoke / redirect prune  
- No PBI-015 / CE compound  
- No Observatory  
- No protection dip / admin override  
- No Funnel / Rivet Compose host / Docker SA from this review session  

## Outcome

| Item | Value |
| --- | --- |
| Decision | **APPROVE → squash-merged** |
| PR | https://github.com/mplsjohnnycage/factory/pull/48 |
| Merge SHA | `97f4d078cdbe1a1aa4aed3d7cfe2ed81bf311754` |
| Formal review | https://github.com/mplsjohnnycage/factory/pull/48#pullrequestreview-5699040960 |
| Protection | Write APPROVE kept; count not dipped |
| Observatory | None |
| Sibling report | `/cursor/stores/self/docs/supervisor-admit-offline-advance.md` (present; no copy needed) |
