---
cursor:
  subagentId: "bc-dfd407fe-be79-5966-a179-a6858c0b285f"
---

# PBI-011 / STL-172 — Independent review (PR #20)

**PR:** https://github.com/mplsjohnnycage/factory/pull/20 (open)  
**Head:** `a95adae` · branch `cursor/pbi-011-ci-accept-sha-938b` · base `main` @ `e57d70b` (mergeStatus: behind)  
**Linear:** [STL-172](https://linear.app/johnny-cage/issue/STL-172/pbi-011-github-checks-accept-on-exact-sha) · [diff review](https://linear.app/johnny-cage/review/pbi-011-github-checks-accept-on-exact-sha-stl-172-988a0962da8f)  
**Reviewer role:** Independent first-pass (fresh session `bc-dfd407fe`). **Not** implementer `bc-c3afcbd5`.  
**Lane:** **Meta** (Factory kernel) — not Product Beads / Painter OS.  
**Content decision:** **REQUEST_CHANGES** — accept-on-SHA wiring is directionally correct, but candidate SHA `a95adae` fails Meta gateway typecheck / accept-matrix (factory-gateway). Cannot advance accept path while required CI on exact SHA is red.

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `REQUEST_CHANGES` / `COMMENT` via Cursor `gh` | **Blocked** — App token 403 `addPullRequestReview` | — |
| GitHub via Composio (`mplsjohnnycage`) | **Skipped** — Johnny must not review / own-PR attribution | — |
| GitHub PR review (`COMMENT`, REQUEST_CHANGES checklist) | **Via Linear GitHub sync** (expected attribution constraint as PBI-003…010) | See Linear submit below |
| Linear `submit_diff_review` `commented` (content REQUEST_CHANGES) | **Submitted** | [Linear review](https://linear.app/johnny-cage/review/pbi-011-github-checks-accept-on-exact-sha-stl-172-988a0962da8f) |
| Linear issue comment on STL-172 | **Posted** | https://linear.app/johnny-cage/issue/STL-172 |

No implementation. No merge. Johnny out of review (GitHub assignees=[], reviewRequests=[]; Linear reviewers Codex only). No Linear→Cursor delegate.

## Acceptance checklist (STL-172 / seed / Spec / CI docs)

Must all pass → APPROVE. Any fail on exact-SHA CI / rewrite / agent-self-accept → REQUEST_CHANGES.

| Check | Path(s) / evidence | Pass/fail | Notes |
| --- | --- | --- | --- |
| Exact-SHA evaluate | `apps/factory-gateway/src/accept-sha.ts` `evaluateAcceptOnSha` | **PASS** | Binds required checks to `headSha === candidate`; denies mismatch / missing / incomplete / failed |
| Rewrite invalidates accept | ledger `isValidForTip` + `prior_accept_stale_after_rewrite` + unit test | **PASS** | Test covers S→S′; Spec Gherkin refined same-PR |
| Agent self-accept forbidden | `AcceptLedger.record` + `/accept/record` actor header | **PASS** | Forbidden set includes agent/canvas/self/cursor/coding; non-cockpit/human → 403 |
| Gateway routes (no Port mutation) | `server.ts` `/accept/evaluate|record|status` | **PASS** | Evaluate-only note; record is evidence; no Port OAuth / catalog accept write |
| CLI + workflow | `scripts/accept-on-sha.ts`, `meta-accept-gate.yml` | **PASS** | Dispatch evaluate on exact SHA; PR unit job `accept-sha-rewrite-tests` green |
| Spec same-PR | `specs/visibility-accept/spec.md` | **PASS** | DoD + scenarios for rewrite + agent forbid + failed checks |
| Ops / branch-protection docs | `docs/ci/port-accept-on-sha.md`, `branch-protection.md` | **PASS** | Points to evaluate before Cockpit Port-accept; Johnny admin protection remains outside code |
| Seed / task mirror | `docs/linear-pbi-seed/PBI-011-…`, `tasks/PBI-011-…` | **PASS** | Match STL-172 Contract; Meta lane |
| Unit tests | local `npm test` on head | **PASS** | 15/15 (5 new accept-sha) |
| **CI green on exact SHA `a95adae`** | Actions check-runs | **FAIL** | `gateway-typecheck-test` **failure**; `accept-matrix (factory-gateway)` **failure**; `accept-evaluate-exact-sha` skipped (dispatch-only) |
| Typecheck | `tsc` / CI log | **FAIL** | `src/server.ts(176,32): error TS2783: 'ok' is specified more than once` — `{ ok: false, error: "accept_denied", ...evalResult }` duplicates `ok` |
| Lane hard rules | Diff scope (12 files) | **PASS** | Meta only; no Product Beads; no Port OAuth create/delete; no agent Port-accept |
| Johnny not reviewer/assignee | GitHub PR metadata | **PASS** | assignees=[], reviewRequests=[] |
| Author ≠ this reviewer | session ids | **PASS** | `bc-c3afcbd5` ≠ `bc-dfd407fe` |
| Dependencies | PBI-007 / CI foundation #17 / PBI-010 #19 | **PASS** | #17/#19 on main; STL-172 blockedBy STL-168 |

## Consistency skim

- Contract AC (“rewrite invalidates accept”) is implemented in code + Spec + tests; agent self-accept correctly refused.
- Port catalog accept correctly remains Cockpit/human; gateway records eligibility/evidence only — matches agent-type row and CI foundation remainder.
- PR verification claim (“15/15 tests”) is true but incomplete: `npm run typecheck` was not green, and Meta package CI fails on the same SHA the accept path would gate.
- Seed field #12 still names Johnny as human reviewer — process prefs override; PR reviewers correctly exclude Johnny (Codex + Linear).
- Meta≠Product: review scoped to Factory Meta PR #20 / STL-172 only.
- PR is **behind** `main` (`mergeStatus: behind`) — rebase after fix; not the primary reject.

## Findings

### Blocking

1. **`TS2783` in `apps/factory-gateway/src/server.ts:176`** — spread of `evalResult` after literal `ok: false` fails `tsc`. Fixes `gateway-typecheck-test` and `accept-matrix (factory-gateway)`. Suggested shape: `sendJson(res, 409, { ...evalResult, error: "accept_denied" })` (or omit the literal `ok`).
2. **Candidate SHA CI red** — for PBI-011 / ADR-008, accept eligibility requires green required checks on exact SHA. Head cannot be accepted / merge-advanced until typecheck+matrix gateway jobs are green.

### Non-blocking

1. `/accept/record` re-evaluates without `priorAccept`; rewrite safety relies on `isValidForTip` / evaluate-with-deliveryKey. Acceptable if ops always call evaluate first; consider passing prior for consistency.
2. `AcceptLedger` is in-memory only (process-local) — fine for Meta evidence scaffolding; durable Port SoT remains Cockpit.
3. Formal GitHub `REQUEST_CHANGES` event unavailable from Cursor App token; content verdict via COMMENT channels (same constraint family as prior Meta independent reviews).

## Recommendation

Content is **REQUEST_CHANGES**. Fix the duplicate-`ok` typecheck error, re-run gateway typecheck + accept-matrix on the new tip SHA, then re-request independent review. Do not merge from this review session; coordinator owns merge. Branch protection on `main` remains Johnny admin (documented; not a code reject).
