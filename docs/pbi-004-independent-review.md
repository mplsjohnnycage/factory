---
cursor:
  subagentId: "bc-7febea19-b939-563b-8223-495ed0114a32"
---

# PBI-004 / STL-165 — Independent review (PR #12)

**PR:** https://github.com/mplsjohnnycage/factory/pull/12 (open)  
**Head:** `87e565a` · branch `cursor/pbi-004-rivet-compose-86a4` · base `main` @ `fa3d8e9`  
**Linear:** [STL-165](https://linear.app/johnny-cage/issue/STL-165) · [diff review](https://linear.app/johnny-cage/review/pbi-004-compose-rivet-2x-tailscale-serve-health-stl-165-a371336b8944)  
**Reviewer role:** Independent (fresh Cursor review-pool session). **Not** implementer `bc-1925e9a4`.  
**Content decision:** **APPROVE** — docs/code match the typed contract; live Docker/Tailscale evidence deferred (not merge-blocking).

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Cursor `gh` | **Blocked** — App token 403 `addPullRequestReview` | — |
| GitHub formal `APPROVE` via Composio (`skysthelimitpainting1779-collab`) | **Blocked** — 404 (no access to private repo) | — |
| GitHub formal `APPROVE` via Composio (`mplsjohnnycage`) | **Skipped** — would 422 own-PR | — |
| GitHub PR review (`COMMENT`, APPROVE checklist) | **Submitted** | https://github.com/mplsjohnnycage/factory/pull/12#pullrequestreview-5692756600 |
| GitHub issue comment | **Submitted** | https://github.com/mplsjohnnycage/factory/pull/12#issuecomment-6487682087 |
| Linear `submit_diff_review` `approved` | **Blocked** — “Could not submit the review to GitHub” | — |
| Linear `submit_diff_review` `commented` | **Submitted** (APPROVE body) | comment `bee5f876-…` on Linear review URL |
| Linear issue comment on STL-165 | Posted | https://linear.app/johnny-cage/issue/STL-165 |

No implementation. No merge. Johnny out of review.

## Acceptance checklist (STL-165 / seed / Spec)

Must all pass → APPROVE. Live host evidence judged per review brief: call out as CHANGES **only if** the PBI requires it for merge. Spec DoD: live Serve URL evidence “when host available.”

| Check | Path(s) / evidence | Pass/fail | Notes |
| --- | --- | --- | --- |
| Compose Rivet **2.x** + persistent volume | `compose/docker-compose.yml` | **PASS** | Pins `rivetdev/engine:2.3.3` (Hub tag exists; refuse `:next` in healthcheck lint); `rivet-data` named volume; env shape matches Rivet Compose self-host docs |
| Contract: health after Compose restart | `bin/rivet-healthcheck.sh` | **PASS** | `--lint-only` / `--wait` / `--restart-proof`; waits `GET /health` on `:6420` |
| Tailscale Serve operator path | `docs/rivet-tailscale-serve.md` | **PASS** | Serve `:6420`; bans `factory-edge`; operator evidence checklist |
| Desktop bootstrap stub | `bin/install.sh` | **PASS** | Allowed by seed; generates `.env` token; `compose up` + health wait |
| CI compose lint | `.github/workflows/compose-lint.yml` | **PASS** | Check run **SUCCESS** on head |
| Same-PR Spec update | `specs/rivet-execution/spec.md` | **PASS** | Status banner; Architecture/Constraints/DoD; Gherkin `PBI-004 Compose and Tailscale Serve artifacts present` |
| Task mirror | `tasks/PBI-004-rivet-compose.md` | **PASS** | Mirrors STL-165 deliverables + verification |
| Lane hard rules | (diff scope) | **PASS** | No Product Beads; no Port OAuth create/delete; no `factory-edge` / CapacityManager |
| Live Docker restart-proof + Serve URL in PR | PR Verification unchecked | **Deferred (not CHANGES)** | Spec “when host available”; Johnny brief: not merge-blocking |

## Consistency skim

- Official Rivet Compose shape (engine + `/data` + `RIVET__AUTH__ADMIN_TOKEN` + port 6420) mirrored; pin prefers documented `2.3.3` over floating `latest`.
- Health verify path uses `:6420/health` (Compose docs); custom-platform docs’ `:6421` is for separate health port — not required for this single-node Compose unit.
- Secrets: `compose/.env` gitignored; only `.env.example` committed.
- Master §13.4 / ADR-002 desktop Compose + Tailscale Serve topology preserved; M1 Non-Goal `factory-edge` respected.
- CI green for lint-only path; cloud agent correctly skipped live Docker.

## Findings (non-blocking)

1. Image pin `2.3.3` is valid 2.x but older than current Hub `2.3.31`. Acceptable for “pin 2.x / refuse `:next`”; optional later bump.
2. Formal GitHub `APPROVE` and Linear `approved` events could not be cast from available identities (own-PR / App scope / secondary account 404). Content verdict remains APPROVE via COMMENT channels — same constraint as PBI-003 independent review.
3. Desktop `--restart-proof` + `tailscale serve 6420` evidence still owed on the operator host before claiming **runtime** green; does not block merge of authored contract artifacts.

## Recommendation

Content is **APPROVE**. **STL-165 may advance on authored artifacts.** Formal GitHub `APPROVE` still needs Codex / Linear reviewer identity if a green check event is required for process hygiene. Do not merge from this review session; coordinator owns merge.
