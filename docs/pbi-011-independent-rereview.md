---
cursor:
  subagentId: "bc-c1dfea01-666a-5da4-99de-5fd8b4afdf2c"
---

# PBI-011 / STL-172 — Independent re-review (PR #20)

**PR:** https://github.com/mplsjohnnycage/factory/pull/20 (open)  
**Head reviewed:** `6ca0072721ca9a60f6db7e2cda90e5d0587273f8` · branch `cursor/pbi-011-ci-accept-sha-938b` · base `main` @ `e57d70b` (mergeStatus: behind)  
**Prior review:** [docs/pbi-011-independent-review.md](./pbi-011-independent-review.md) by `bc-dfd407fe` — **REQUEST_CHANGES** on `a95adae`  
**Linear:** [STL-172](https://linear.app/johnny-cage/issue/STL-172/pbi-011-github-checks-accept-on-exact-sha) · [diff review](https://linear.app/johnny-cage/review/pbi-011-github-checks-accept-on-exact-sha-stl-172-988a0962da8f)  
**Reviewer role:** Independent re-review (fresh session `bc-c1dfea01`). **Not** implementer `bc-c3afcbd5`. **Not** prior reviewer `bc-dfd407fe`.  
**Lane:** **Meta** (Factory kernel) — not Product Beads / Painter OS.  
**Content decision:** **APPROVE**

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Cursor `gh` | **Blocked** — App token 403 `addPullRequestReview` / `addComment` | Same constraint as prior Meta reviews |
| GitHub via Composio (`mplsjohnnycage`) | **Skipped** — Johnny must not review / own-PR attribution | — |
| GitHub PR review (`COMMENT`, content **APPROVE**) | **Posted** via Linear→GitHub sync on commit `6ca0072` | Review id `5693137951`, state `COMMENTED` |
| Linear `submit_diff_review` `commented` (content APPROVE) | **Submitted** | [Linear review](https://linear.app/johnny-cage/review/pbi-011-github-checks-accept-on-exact-sha-stl-172-988a0962da8f) |
| Linear issue comment on STL-172 | **Posted** | https://linear.app/johnny-cage/issue/STL-172 |

No implementation. No merge. Johnny out of review (GitHub assignees=[], reviewRequests=[]). No Linear→Cursor delegate.

## Prior blocking issue — fix verification

Prior fail: `apps/factory-gateway/src/server.ts` accept-deny path

```ts
sendJson(res, 409, { ok: false, error: "accept_denied", ...evalResult });
```

→ `TS2783: 'ok' is specified more than once` (evalResult already has `ok`).

Fix commit `6ca0072` (`fix(gateway): avoid duplicate ok in accept_denied response (TS2783)`):

```ts
sendJson(res, 409, {
  ok: false,
  error: "accept_denied",
  sha: evalResult.sha,
  reason: evalResult.reason,
  detail: evalResult.detail,
});
```

| Evidence | Result |
| --- | --- |
| Diff scope | 1 file, only deny-path shape |
| Local `npm ci && npm run typecheck` on head | **PASS** (no TS2783) |
| Local `npm test` | **15/15 PASS** |
| CI `gateway-typecheck-test` @ `6ca0072` | **SUCCESS** |
| CI `accept-matrix (factory-gateway)` @ `6ca0072` | **SUCCESS** |
| Other matrix / meta-ci / accept-sha-rewrite-tests / Vercel | **SUCCESS** |
| `accept-evaluate-exact-sha` | **SKIPPED** (workflow_dispatch-only — expected) |

## Acceptance checklist (STL-172 / seed / Spec / CI docs)

Must all pass → APPROVE. Any fail on exact-SHA CI / rewrite / agent-self-accept → REQUEST_CHANGES.

| Check | Path(s) / evidence | Pass/fail | Notes |
| --- | --- | --- | --- |
| Exact-SHA evaluate | `apps/factory-gateway/src/accept-sha.ts` `evaluateAcceptOnSha` | **PASS** | Unchanged since prior; binds required checks to candidate SHA |
| Rewrite invalidates accept | ledger `isValidForTip` + `prior_accept_stale_after_rewrite` + unit test | **PASS** | Covered in accept-sha tests |
| Agent self-accept forbidden | `AcceptLedger.record` + `/accept/record` actor header | **PASS** | Forbidden: agent/canvas/self/cursor/coding |
| Gateway routes (no Port mutation) | `server.ts` `/accept/evaluate\|record\|status` | **PASS** | Evaluate/evidence only; no Port OAuth / catalog accept write |
| CLI + workflow | `scripts/accept-on-sha.ts`, `meta-accept-gate.yml` | **PASS** | Unit job green; evaluate job dispatch-only |
| Spec same-PR | `specs/visibility-accept/spec.md` | **PASS** | Same PR (12 files total) |
| Ops / branch-protection docs | `docs/ci/port-accept-on-sha.md`, `branch-protection.md` | **PASS** | Unchanged vs prior PASS |
| Seed / task mirror | `docs/linear-pbi-seed/PBI-011-…`, `tasks/PBI-011-…` | **PASS** | Meta lane |
| Unit tests | local `npm test` on `6ca0072` | **PASS** | 15/15 |
| **CI green on exact SHA `6ca0072`** | Actions check-runs | **PASS** | Prior red jobs now green |
| Typecheck | local + CI | **PASS** | TS2783 resolved |
| Lane hard rules | PR diff 12 files | **PASS** | Meta only; no Product Beads; no Port OAuth create/delete |
| Johnny not reviewer/assignee | GitHub PR metadata | **PASS** | assignees=[], reviewRequests=[] |
| Author ≠ this reviewer | session ids | **PASS** | `bc-c3afcbd5` ≠ `bc-c1dfea01`; also ≠ prior `bc-dfd407fe` |
| Dependencies | PBI-007 / CI #17 / PBI-010 #19 | **PASS** | Unchanged |

## Consistency skim

- Prior REQUEST_CHANGES was correctly scoped to typecheck/CI red on the accept path; fix is minimal and matches the suggested remediation (omit duplicate `ok` / don't spread after literal).
- Accept-on-SHA Contract ACs remain intact; no regression in rewrite or agent-forbid paths (tests still green).
- PR still **behind** `main` — rebase before merge is ops/coordinator; not a content reject for this re-review.
- Meta≠Product: scoped to Factory Meta PR #20 / STL-172 only.

## Findings

### Blocking

None. Prior TS2783 + red CI on exact SHA are resolved.

### Non-blocking

1. PR `mergeStatus: behind` — rebase onto latest `main` before merge.
2. `/accept/record` still re-evaluates without `priorAccept` (unchanged; rewrite via status/`isValidForTip`).
3. In-memory `AcceptLedger` — Meta evidence scaffolding only; Port SoT remains Cockpit/human.
4. Formal GitHub `APPROVE` event unavailable from Cursor App token; content verdict via COMMENT (Linear sync) — same family as PBI-003…010 / prior #20 review.

## Recommendation

Content is **APPROVE**. Exact-SHA accept wiring + prior typecheck fix are verified; required CI is green on `6ca0072`. Do not merge from this review session; coordinator owns merge after any rebase. Branch protection on `main` remains Johnny admin (documented; not a code reject).

> **Currency:** After this review, `main` protection landed on the public repo (PR + 1 approval + `meta-ci-presence`). Living status: [`factory-ci-setup-check.md`](factory-ci-setup-check.md) · [`ci-protection-live-verify.md`](ci-protection-live-verify.md).
