---
cursor:
  subagentId: "bc-b3e2ea80-d0dc-53e1-8f9b-3b09e792c1f7"
---

# FE-106 — Port `factory_*` WEBHOOK→gateway — Independent review (PR #28)

**PR:** https://github.com/mplsjohnnycage/factory/pull/28  
**Head reviewed:** `0fac7ac1d26ee2353fcaeb016ea187f3048cd27a` · branch `cursor/port-workflow-webhooks-f45e` · base `main` @ `8568858` (merge-base == main tip)  
**Author session:** `bc-7d12cd06` (PR footer)  
**Reviewer session:** `bc-b3e2ea80` — **not** the author  
**Lane:** Meta (Factory kernel / `factory-gateway`)  
**Content + formal GitHub verdict:** **APPROVE**

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Composio (`skysthelimitpainting1779-collab`) | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/28#pullrequestreview-5693885363 |
| Cursor App `gh` APPROVE | Not used (App token cannot count for protection) | Formal path is write collab |
| Author report | Prior art | [`port-workflow-webhooks.md`](./port-workflow-webhooks.md) |

No implementation commits from this reviewer. Protection `required_approving_review_count` unchanged. Author ≠ reviewer.

## Acceptance checklist

Must all pass → APPROVE. Any fail on Meta lane, HMAC/allowlist, collision, or required CI → REQUEST_CHANGES.

| Check | Path(s) / evidence | Pass/fail | Notes |
| --- | --- | --- | --- |
| Meta-only | Diff: `apps/factory-gateway/**` + `docs/port-workflow-webhooks.md` | **PASS** | No Product Beads / Painter OS |
| HMAC reject (401, no enqueue) | `src/hmac.ts` + `test/webhooks-port.test.ts` | **PASS** | Bad `x-port-signature` → `invalid_port_signature`; queue length unchanged |
| Path allowlist `factory_*` | `src/factory-workflows.ts` + `matchPortWebhookPath` in `server.ts` | **PASS** | Seven canonical IDs; path wins only when allowlisted |
| Non-factory path 404 | `webhooks-port.test.ts` (`ss_linear_create_issue`) | **PASS** | Signed body still does not enqueue |
| All seven workflows → 202 | HTTP suite loops `FACTORY_WORKFLOW_IDS` | **PASS** | `actionIdentifier` echoed; supervisor list contains each |
| Spec IDs match live/Spec | `specs/port-governance/spec.md` vs `FACTORY_WORKFLOW_IDS` | **PASS** | Exact seven IDs; no invented names |
| No live Port remount / OAuth | PR body + doc + diff | **PASS** | Explicit non-goal; no External Interface mutations |
| No `.beads/` collision | `git diff --name-only` | **PASS** | Zero `.beads` paths |
| No Vercel CI / workflow collision | Diff name-only | **PASS** | No `vercel.json`, no `.github/workflows`, no `apps/developer-os` |
| No Spec Contract change without Spec | Diff | **PASS** | Proof/tests of existing ADR-003 / PBI-005 contract; Spec already states WEBHOOK→gateway |
| Local reproduce | `npm ci && npm run typecheck && npm test` on head | **PASS** | **35 pass / 0 fail** incl. webhook suite |
| **CI green on exact SHA `0fac7ac`** | Actions + Vercel | **PASS** | `gateway-typecheck-test`, `local-gate-refuse`, `meta-ci-presence`, Vercel — all SUCCESS |
| Fresh from `main` | merge-base == `8568858` | **PASS** | Single commit atop current main |
| Author ≠ this reviewer | session ids | **PASS** | `bc-7d12cd06` ≠ `bc-b3e2ea80` |
| Formal APPROVE counts for protection | write COLLABORATOR | **PASS** | Submitted as `skysthelimitpainting1779-collab` |

## Consistency skim

- Scope matches author claim: prove HMAC enqueue + allowlisted path form; document live Port still points at `api.port.io`; do not remount until gateway URL exists.
- Aligns with `specs/port-governance` (workflow IDs + WEBHOOK→gateway), `specs/rivet-execution` (invalid HMAC never enqueues), ADR-003 push-only supervisor.
- Classic `POST /webhooks/port` remains HMAC-gated without body action allowlist (pre-existing PBI-005); new path form is the allowlist surface. Acceptable for this unit.
- Inventory doc correctly flags live `UPSERT_ENTITY` bypass of §4.2.1 writer as out-of-band follow-on (FE-111 fencing / remount).

## Findings

### Blocking

None.

### Non-blocking

1. Classic body path still enqueues any HMAC-valid `action` string (not restricted to `factory_*`). Path form is allowlisted; tightening body admits is a follow-on hardening, not a blocker for this proof PR.
2. Live Port→deployed gateway hop remains unmounted — correctly deferred; do not treat merge as live E2E wiring.
3. Repo `docs/port-workflow-webhooks.md` duplicates store author report content; merge will land the repo copy (fine).

## Recommendation / outcome

Content **APPROVE**. Formal write-access **APPROVE** landed. CI green on exact head SHA. Ready for squash-merge by a non-author (not this reviewer’s merge unless coordinator assigns).

| Item | Value |
| --- | --- |
| Decision | **APPROVE** |
| PR | https://github.com/mplsjohnnycage/factory/pull/28 |
| Head SHA | `0fac7ac1d26ee2353fcaeb016ea187f3048cd27a` |
| Formal review | https://github.com/mplsjohnnycage/factory/pull/28#pullrequestreview-5693885363 |
| Model | omitted (auto) |
