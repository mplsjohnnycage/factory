---
cursor:
  subagentId: "bc-57a793ee-8fda-5672-9c96-e053e5704c11"
---

# PBI-010 / STL-171 — Independent review (PR #19)

**PR:** https://github.com/mplsjohnnycage/factory/pull/19 (open)  
**Head:** `871e2fa` · branch `cursor/pbi-010-openaccess-openmcp-938b` · base PBI-009 `#18` @ `938fb7d`  
**Linear:** [STL-171](https://linear.app/johnny-cage/issue/STL-171/pbi-010-openaccess-openmcp-well-knowns-no-port-oauth-create) · [diff review](https://linear.app/johnny-cage/review/pbi-010-openaccess-openmcp-well-knowns-stl-171-44d81c555f70)  
**Reviewer role:** Independent (fresh Cursor review-pool session `bc-57a793ee`). **Not** implementer `bc-c3afcbd5`.  
**Lane:** **Meta** (Factory kernel) — not Product Beads / Painter OS.  
**Content decision:** **APPROVE** — OpenMCP + OpenAccess well-knowns satisfy inventory §7 items 9–10; zero Port OAuth mutations; Specs refined same-PR; CI green.

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Cursor `gh` | **Blocked** — App token 403 `addPullRequestReview` | — |
| GitHub formal `APPROVE` via Linear `submit_diff_review` `approved` | **Blocked** — “Could not submit the review to GitHub” | — |
| GitHub formal `APPROVE` / COMMENT via Composio (`skysthelimitpainting1779-collab`) | **Blocked** — 404 / no access on private repo | — |
| GitHub via Composio (`mplsjohnnycage`) | **Skipped** — Johnny must not review; own-PR would 422 | — |
| GitHub PR review (`COMMENT`, APPROVE checklist) | **Submitted** (Linear GitHub sync attribution `mplsjohnnycage`) | https://github.com/mplsjohnnycage/factory/pull/19#pullrequestreview-5693058292 |
| Linear `submit_diff_review` `commented` | **Submitted** (APPROVE body) | comment `98ac44a1-…` on [Linear review](https://linear.app/johnny-cage/review/pbi-010-openaccess-openmcp-well-knowns-stl-171-44d81c555f70) |
| Linear issue comment on STL-171 | Posted | https://linear.app/johnny-cage/issue/STL-171 · comment `4dec597d-…` |

No implementation. No merge. Johnny out of review (GitHub assignees empty; Linear reviewers Codex only).

**Note:** Linear→GitHub sync attributed the COMMENT review to `mplsjohnnycage` (same process artifact as PBI-003…009). Content remains independent reviewer `bc-57a793ee`; Johnny was not added as GitHub reviewer/assignee.

## Acceptance checklist (STL-171 / seed / Spec)

Must all pass → APPROVE.

| Check | Path(s) / evidence | Pass/fail | Notes |
| --- | --- | --- | --- |
| OpenMCP inventory §7 item 9 | `/.well-known/openmcp.json` | **PASS** | `openmcp: "0.1"`; `mcp: https://mcp.port.io/v1`; tools + Port blueprints; not scaffold |
| OpenAccess inventory §7 item 10 | `/.well-known/openaccess.json` | **PASS** | Required keys; `hubs: []`; scopes map |
| Live client id + redirects | openaccess ↔ `docs/port-factory-oauth-live.md` | **PASS** | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0`; exact localhost callback set |
| Port token issuer; no hub | openaccess `factory.token_issuer` / `hubs` | **PASS** | Documents Port as issuer |
| Observatory forbidden | `factory.observatory_forbidden: true` | **PASS** | Explicit |
| No Port OAuth create/delete | Diff + `no_port_oauth_*` flags | **PASS** | Descriptors only; ADR-005 live client via record |
| Validator | `scripts/validate-well-known.mjs` | **PASS** | Local exit 0 on head |
| CI well-known step | `.github/workflows/meta-ci.yml` | **PASS** | Step present; `meta-ci-presence` + accept-matrix SUCCESS on `871e2fa` |
| Same-PR Spec update | `auth-port-oauth`, `port-governance`, `logicsrc-interop` | **PASS** | Gherkin scenarios for items 9–10 |
| Task / seed mirror | `tasks/PBI-010-…`, `docs/linear-pbi-seed/PBI-010-…` | **PASS** | Match STL-171 Contract |
| Dependencies PBI-003 (+ PBI-009 base) | STL-171 blockedBy STL-164; base `938fb7d` | **PASS** | Ancestor of PR head |
| Lane hard rules | Diff scope (11 files) | **PASS** | Meta only; no Product Beads; no External Interface mutation |
| Johnny not reviewer/assignee | GitHub PR metadata | **PASS** | assignees=[], reviewRequests=[] |

## Consistency skim

- Contract AC matches seed + Linear STL-171: emit OpenMCP + OpenAccess; inventory §7 items 9–10; no Port mutation.
- Spec refined in-PR for all three pointed domains; logicsrc-interop DoD now marks PBI-010 rows.
- OpenAccess client id + redirects match the Project-store live Port record (canonical Meta ops).
- Author self-identified as implementer `bc-c3afcbd5` and correctly requested Codex + Linear (Johnny out); this session is independent (`bc-57a793ee` ≠ `bc-c3afcbd5`).
- No client secrets committed (public PKCE client id only).
- Seed field #12 still names Johnny as human reviewer — process prefs override; PR reviewers correctly exclude Johnny.
- Meta≠Product: review scoped to Factory Meta PR #19 / STL-171 only.

## Findings (non-blocking)

1. Developer OS OAuth Route Handler still uses `/api/auth/port/callback` while OpenAccess + live Port publish `/api/auth/callback` — pre-existing path drift outside PBI-010 emit scope; OpenAccess correctly mirrors the live Port set.
2. ADR-005 still says identifiers are not copied into the repository; OpenAccess now publishes the public PKCE client id per refined auth Spec (ADR immutable — supersede later if needed).
3. Formal GitHub `APPROVE` and Linear `approved` events could not be cast from available non-Johnny identities (App scope / GitHub sync). Content verdict remains APPROVE via COMMENT channels — same constraint as PBI-003…009 independent reviews.

## Recommendation

Content is **APPROVE**. **STL-171 may advance on authored artifacts.** Formal GitHub `APPROVE` still needs Codex / Linear reviewer identity if a green check event is required for process hygiene. Do not merge from this review session; coordinator owns merge.
