---
cursor:
  subagentId: "bc-63f419d6-4cee-5427-a6ad-ea9fa9f7cdf3"
---

# PBI-005 / STL-166 — Independent review (PR #13)

**PR:** https://github.com/mplsjohnnycage/factory/pull/13 (open)  
**Head:** `f28267a` · branch `cursor/pbi-005-factory-gateway-3d3b` · base `main` @ `8432804`  
**Linear:** [STL-166](https://linear.app/johnny-cage/issue/STL-166) · [diff review](https://linear.app/johnny-cage/review/pbi-005-thin-factory-gateway-hmac-catalog-writer-stl-166-39661a7c2e9f)  
**Reviewer role:** Independent (fresh Cursor review-pool session). **Not** implementer `bc-0053160f`.  
**Content decision:** **APPROVE** — authored gateway matches STL-166 contract + Specs; CI green.

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Cursor `gh` | **Blocked** — App token 403 `addPullRequestReview` | — |
| GitHub formal `APPROVE` via Composio (`skysthelimitpainting1779-collab`) | **Blocked** — no access / not usable on private repo | — |
| GitHub formal `APPROVE` via Composio (`mplsjohnnycage`) | **Skipped** — would 422 own-PR | — |
| GitHub PR review (`COMMENT`, APPROVE checklist) | **Submitted** | https://github.com/mplsjohnnycage/factory/pull/13#pullrequestreview-5692801837 |
| GitHub issue comment | **Submitted** | https://github.com/mplsjohnnycage/factory/pull/13#issuecomment-6487797151 |
| Linear `submit_diff_review` `approved` | **Blocked** — “Could not submit the review to GitHub” | — |
| Linear `submit_diff_review` `commented` | **Submitted** (APPROVE body) | comment `00be2f92-…` on Linear review URL |
| Linear issue comment on STL-166 | Posted | https://linear.app/johnny-cage/issue/STL-166 |

No implementation. No merge. Johnny out of review.

## Acceptance checklist (STL-166 / seed / Spec)

Must all pass → APPROVE.

| Check | Path(s) / evidence | Pass/fail | Notes |
| --- | --- | --- | --- |
| Webhook signature verified | `apps/factory-gateway/src/hmac.ts`, `server.ts` `/webhooks/port` | **PASS** | Port docs: HMAC-SHA-256 over `${timestamp}.${rawBody}`, Base64, `v1,<sig>`; `timingSafeEqual`; 401 on fail before enqueue |
| Rivet never polls Port | `apps/factory-gateway/src/supervisor.ts` | **PASS** | Push-only `enqueue`; optional forward to `RIVET_SUPERVISOR_URL`; no Port client / poll method |
| Stale catalog write rejected | `apps/factory-gateway/src/catalog-writer.ts` + tests | **PASS** | `expectedCatalogVersion !== stored` → `stale_catalog_version`, no partial apply |
| Concurrent claim-next single winner | `claimNextJob` + catalog-writer test | **PASS** | Per-key single-flight queue; Spec Gherkin scenario covered |
| CI typecheck + unit tests | `.github/workflows/factory-gateway.yml` | **PASS** | Check run **SUCCESS** on head; local `npm ci && typecheck && test` → **10/10** |
| Same-PR Spec update | `specs/port-governance/spec.md`, `specs/rivet-execution/spec.md` | **PASS** | Status banners; endpoints; DoD; Gherkin PBI-005 scenarios |
| Task mirror | `tasks/PBI-005-factory-gateway.md` | **PASS** | Mirrors STL-166 deliverables + verification |
| Dependency PBI-004 | `main` @ `8432804` | **PASS** | STL-165 / PR #12 merged before this PR |
| Lane hard rules | (diff scope) | **PASS** | No Product Beads; no Port OAuth create/delete; `MemoryCatalogStore` only (no dual-write bypass); secret via env |

## Consistency skim

- Port signature verification matches current Port docs (`x-port-signature` / `x-port-timestamp`, `v1,<base64>` of HMAC-SHA-256(`${timestamp}.${body}`)).
- §4.2.1 / port-factory-data-model §4.1 fencing: single-writer per `{blueprint}:{entityIdentifier}`, bump `catalogVersion`, reject stale, lease fields only inside same apply — implemented.
- C3 “Port catalog only via gateway writer path (**when live**)”: in-memory store is correct for this authorship unit; live Port upsert remains out of band.
- Secrets: `.env.example` only; `PORT_CLIENT_SECRET` not committed; empty secret rejects all HMAC.
- Spec refinement in same PR; rivet-execution keeps PBI-004 Compose scenario while adding HMAC→enqueue path.
- Author self-identified as implementer and correctly requested Codex + Linear (Cursor excluded).

## Findings (non-blocking)

1. No HTTP integration test for Spec scenario `PBI-005 invalid HMAC never enqueues` (401 + queue empty). Unit HMAC reject + server wiring are correct by inspection; optional follow-up test.
2. Port docs recommend timestamp skew / replay tolerance; not implemented and **not** in STL-166 AC.
3. `POST /catalog/write` and `POST /catalog/claim-next` have no auth — acceptable for local MemoryCatalogStore M1 unit; broader gateway RBAC is security-blast-radius / later work.
4. Formal GitHub `APPROVE` and Linear `approved` events could not be cast from available identities (own-PR / App scope / GitHub sync). Content verdict remains APPROVE via COMMENT channels — same constraint as PBI-003/004 independent reviews.

## Recommendation

Content is **APPROVE**. **STL-166 may advance on authored artifacts.** Formal GitHub `APPROVE` still needs Codex / Linear reviewer identity if a green check event is required for process hygiene. Do not merge from this review session; coordinator owns merge.
