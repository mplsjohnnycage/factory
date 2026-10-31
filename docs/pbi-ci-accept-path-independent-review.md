---
cursor:
  subagentId: "bc-6473c2d4-75d7-5720-806d-d55839ed85c6"
---

# PBI-011 foundation / STL-172 — Independent review (PR #17)

> **Currency (post-review):** PR #17 merged; `main` protection is now **live** on the **public** repo (PR + 1 write APPROVE + `meta-ci-presence`). See [`factory-ci-setup-check.md`](factory-ci-setup-check.md) + [`ci-protection-live-verify.md`](ci-protection-live-verify.md). Body below is the historical IR at review time (repo was still private / protection pending).

**PR:** https://github.com/mplsjohnnycage/factory/pull/17 (open)  
**Head:** `76db83d` · branch `cursor/meta-ci-accept-path-054c` · base `main` @ `7a145d5` (#16 DevOS merged)  
**Linear:** [STL-172](https://linear.app/johnny-cage/issue/STL-172/pbi-011-github-checks-accept-on-exact-sha) · [diff review](https://linear.app/johnny-cage/review/fixci-meta-always-on-presence-accept-sha-foundation-adr-008-df280ebec391)  
**Context:** [`docs/factory-ci-setup-check.md`](factory-ci-setup-check.md)  
**Reviewer role:** Independent first-pass (fresh session). **Not** implementer `bc-72e68632`.  
**Content decision:** **APPROVE** — Meta CI accept-path foundation matches acceptance intent; all Meta checks SUCCESS on head; branch protection remains Johnny admin (not a code reject).

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Cursor `gh` | **Blocked** — App token 403 `addPullRequestReview` | — |
| GitHub formal `APPROVE` / COMMENT via Composio collab (`skysthelimitpainting1779-collab`) | **Blocked** — 404 (no access on private repo) | — |
| GitHub via Composio (`mplsjohnnycage`) | **Skipped** — Johnny must not review; own-PR APPROVE would 422 | — |
| GitHub PR review (`COMMENT`, APPROVE checklist) | **Submitted** (Linear GitHub sync attribution `mplsjohnnycage`) | https://github.com/mplsjohnnycage/factory/pull/17#pullrequestreview-5693010175 |
| Linear `submit_diff_review` `commented` | **Submitted** (APPROVE body + checklist) | comment `014a31bf-…` on Linear review / synced to GitHub |
| Linear issue comment on STL-172 | **Posted** | https://linear.app/johnny-cage/issue/STL-172 · comment `7f5bfb5d-…` |

No implementation. No merge. Johnny out of review requests/assignees (empty). Linear MCP attribution uses Johnny’s workspace user — same sync constraint as prior Meta independent reviews.

## Acceptance checklist

Must all pass → APPROVE. Branch protection not applied ≠ fail.

| Check | Path(s) / evidence | Pass/fail | Notes |
| --- | --- | --- | --- |
| Always-on `meta-ci-presence` | `.github/workflows/meta-ci.yml` | **PASS** | `on: pull_request` (no path filter) + push `main` + `workflow_dispatch`; records SHA; Spec/ADR inventory smoke |
| `meta-accept-matrix` PBI-011 foundation | `.github/workflows/meta-accept-matrix.yml` | **PASS** | `workflow_dispatch` (`ref` input) + CI-path PRs; compose + node matrix; does not invent Port accept |
| Renamed package jobs | package workflows | **PASS** | `compose-config-lint`, `gateway-typecheck-test`, `sandbox-typecheck-test`, `supervisor-typecheck-test`, `developer-os-typecheck-test-build` |
| Push limited to `main` | all package + matrix workflows | **PASS** | `push.branches: [main]` — feature branches no longer double-run push+PR |
| `developer-os.yml` ok | `.github/workflows/developer-os.yml` | **PASS** | Named job + main-only push; aligned with landed #16 |
| `docs/ci/branch-protection.md` | `docs/ci/branch-protection.md` | **PASS** | Prefer require `meta-ci-presence`; Vercel not Meta gate; UI + `gh` click-list |
| Spec refine same PR | `specs/visibility-accept/spec.md` | **PASS** | DoD + docs-only Gherkin; Port wiring deferred to PBI-011 |
| Meta checks SUCCESS on `76db83d` | Actions check-runs | **PASS** | `meta-ci-presence`, all `accept-matrix (*)`, all renamed package jobs green |
| Branch protection / required checks live | repo settings | **N/A** | Johnny admin — documented; **not a code reject** |

## Consistency skim

- Scope is Meta foundation only; Port accept / Cockpit / Meta Beads close-after-accept correctly remain STL-172 remainder.
- ADR-008 merge-gate semantics still open until Johnny applies classic protection (agent token 403) — called out in PR + docs, not a diff defect.
- Dedup strategy is sound: path-filtered day-to-day package workflows; always-on presence; matrix for accept-SHA / CI-path changes.
- Vercel Ready on the PR is DevOS preview noise — correctly excluded from Meta accept gates in the admin doc.
- Author ≠ this reviewer (`bc-72e68632` ≠ `bc-6473c2d4`).

## Findings (non-blocking)

1. Prefer day-to-day required check = `meta-ci-presence` only; requiring the full path-filtered package set would stall Specs/docs-only PRs (doc already says this).
2. `meta-accept-matrix` push path filter on `main` is narrower than PR paths (omits package workflow yml edits) — acceptable with `workflow_dispatch` for accept-SHA.
3. Formal GitHub `APPROVE` event unavailable from non-Johnny identities in this environment; content verdict is APPROVE via COMMENT channels (same constraint as PBI-003…008 independent reviews).

## Recommendation

Content is **APPROVE**. CI accept-path foundation is merge-ready as authored. Do not merge from this review session; coordinator owns merge. After merge, Johnny applies classic branch protection per `docs/ci/branch-protection.md` (at least `meta-ci-presence`). STL-172 stays open for Port accept wiring.
