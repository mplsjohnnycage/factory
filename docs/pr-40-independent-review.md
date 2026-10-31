---
cursor:
  subagentId: "bc-165a946a-634b-5f39-a15d-4e60f1278594"
---

# PR #40 — Gateway remount dry-run kit — Independent review

**PR:** https://github.com/mplsjohnnycage/factory/pull/40 (**merged**)  
**Head reviewed:** `6cc77700ba51dd436cc2a1fe9443a1d9cbc19a00` · branch `cursor/gateway-remount-kit-81e8` · base `main`  
**Merge SHA:** `f38b3d1ae9c2950c7e9f37c928af7c04ed68de5e` (squash)  
**Author:** `mplsjohnnycage` (commit co-authored Cursor Agent)  
**Reviewer:** `bc-165a946a-634b-5f39-a15d-4e60f1278594` (**≠ author**)  
**Lane:** Meta only  
**Content + formal GitHub verdict:** **APPROVE** → **merged**  
**Live remount from this cloud session:** **None** (FE-106 / assignment hard constraint)

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Cursor `gh` (App) | **Not used for verdict** — App lacks write collab identity | Expected |
| GitHub formal `APPROVE` via Composio `skysthelimitpainting1779-collab` | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/40#pullrequestreview-5694813212 |
| Johnny / own-PR review as `mplsjohnnycage` | **Skipped** | Author ≠ reviewer |
| Live Port WEBHOOK remount / Funnel | **Not performed** | Cloud cannot Funnel; kit is print + health only |

## Acceptance checklist

| # | Check | Result | Evidence |
| --- | --- | --- | --- |
| 1 | Author ≠ this reviewer | **PASS** | PR author `mplsjohnnycage`; reviewer session `bc-165a946a-…` |
| 2 | Scope = dry-run kit only (script + docs) | **PASS** | 2 files added: `scripts/gateway-remount-dry-run.mjs`, `docs/gateway-remount-dry-run.md`; +302 / −0 |
| 3 | No live Port remount / mutate from kit | **PASS** | Script uses only `curl` → `{BASE}/health`; prints refuse of `upsert_workflow` / `upsert_entity` / `trigger_run` / EI create-delete-revoke; soft-notes Port env if present and ignores it |
| 4 | Canonical seven `factory_*` IDs (no invented parallels) | **PASS** | Matches `apps/factory-gateway/src/factory-workflows.ts` + `docs/port-workflow-webhooks.md` + Spec list exactly |
| 5 | Paths match gateway contract | **PASS** | Prints `GET /health`, `POST /webhooks/port`, seven `/webhooks/port/<id>`, `POST /handlers/self-service`; warns not to replace `api.port.io` fencing GETs |
| 6 | Health gate before any remount advice | **PASS** | Exit 1 unless HTTP 200 + JSON `{"ok":true,"service":"factory-gateway"}` |
| 7 | Exit codes documented and verified locally | **PASS** | Missing base → 2; `127.0.0.1:1` → 1; mock `/health` → 0 |
| 8 | Docs hard constraints / non-goals | **PASS** | Explicit: no live upsert/remount, no EI OAuth mutate, no Sandbox/browser, do not use Dev OS / meta-ci as gateway base |
| 9 | Meta-only; no Product Beads / OAuth / Vercel / beads collision | **PASS** | Diff touches neither `.github/`, Port EI apps, beads, nor Dev OS |
| 10 | CI green on exact head SHA | **PASS** | `meta-ci-presence` SUCCESS; `local-gate-refuse` SUCCESS; Vercel Preview + factory-developer-os SUCCESS on `6cc7770` |
| 11 | Formal APPROVE from write collaborator | **PASS** | `skysthelimitpainting1779-collab` (`permission: write`) |

## Diff scope

- `scripts/gateway-remount-dry-run.mjs` — operator CLI: normalize base URL, refuse Port mutate (print + ignore env), print expected WEBHOOK paths, `curl -fsS` health with body/service assertion
- `docs/gateway-remount-dry-run.md` — usage, exit codes, post-green human remount steps, explicit non-goals

## Consistency skim

- Aligns with FE-106 / `docs/port-workflow-webhooks.md`: remount only after reachable health; prefer new notify/admit nodes; keep Port self-API fencing reads.
- Aligns with store `funnel-remount-status.md`: cloud agents author files; live Funnel/remount stays operator desktop — this PR correctly ships a **preflight kit**, not a remount runner.
- Gateway `/health` body shape matches `apps/factory-gateway` contract used elsewhere in Meta docs.

## Local verify (this reviewer)

```text
node scripts/gateway-remount-dry-run.mjs                     → exit 2
node … --base-url http://127.0.0.1:1                         → exit 1
node … --base-url http://127.0.0.1:<mock>/health OK body     → exit 0
```

No Port MCP mutate. No Funnel. No live remount.

## Findings

### Blocking

None.

### Non-blocking

1. Soft Port-env guard only **notes** suspicious env; it does not refuse execution — acceptable for a print+health kit; operators still must not paste secrets into cloud logs.
2. Depends on host `curl` binary (`spawnSync("curl", …)`); fine for Meta operator hosts; not a Node-native fetch (consistent with other Meta shell preflights).
3. No CI job executes the dry-run script itself — covered by PR test plan + this reviewer’s local exit-code proof; `meta-ci-presence` / `local-gate-refuse` remain the branch-protection gates.
4. Operator checklist after green dry-run still requires human Port secret + WEBHOOK remount — correctly out of script scope.

## CI (exact SHA `6cc7770`)

| Check | Conclusion |
| --- | --- |
| `meta-ci-presence` | **SUCCESS** |
| `local-gate-refuse` | **SUCCESS** |
| Vercel – factory-developer-os | **SUCCESS** |
| Vercel Preview Comments | **SUCCESS** |

`mergeable: MERGEABLE` · `mergeStateStatus: CLEAN` at review time.

## Recommendation / outcome

| Decision | **APPROVE** → **squash-merged** |
| --- | --- |
| Head SHA | `6cc77700ba51dd436cc2a1fe9443a1d9cbc19a00` |
| Formal review | [5694813212](https://github.com/mplsjohnnycage/factory/pull/40#pullrequestreview-5694813212) (`skysthelimitpainting1779-collab`) |
| Merge SHA | `f38b3d1ae9c2950c7e9f37c928af7c04ed68de5e` |
| Merge gate | Write APPROVE + green `meta-ci-presence` — both met |
| Live remount | **Still blocked** until operator Funnel `/health` is green from a non-tailnet path — kit does not change that |

No live Port remount from cloud.
