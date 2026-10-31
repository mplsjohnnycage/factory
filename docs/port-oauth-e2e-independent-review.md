---
cursor:
  subagentId: "bc-0cc20939-475a-56fe-b977-fbdad24ea78a"
---

# Dev OS Port OAuth PKCE e2e — Independent review (PR #30)

**PR:** https://github.com/mplsjohnnycage/factory/pull/30  
**Head reviewed:** `61e41d0e1df58a74e8a227040ddbf6729cb012e7` · branch `cursor/devos-port-oauth-e2e-5484` · base `main` @ `8568858`  
**Linear:** [STL-186](https://linear.app/johnny-cage/issue/STL-186) · [diff review](https://linear.app/johnny-cage/review/fixdeveloper-os-port-oauth-pkce-e2e-at-apiauthcallback-8894dc3f4c36)  
**Author session:** `bc-6f81b14f-3a4a-5451-9744-d94cdf6f5484`  
**Reviewer session:** `bc-0cc20939-475a-56fe-b977-fbdad24ea78a` (independent — **not** the author)  
**Lane:** Meta only  
**Content + formal GitHub verdict:** **APPROVE**

## Submitted artifacts

| Channel | Result | Link / note |
| --- | --- | --- |
| GitHub formal `APPROVE` via Composio (`skysthelimitpainting1779-collab`) | **APPROVED** · `author_association: COLLABORATOR` | https://github.com/mplsjohnnycage/factory/pull/30#pullrequestreview-5693907943 |
| Cursor App `gh` APPROVE | Not used (App token cannot `addPullRequestReview`) | Formal path is write collab |
| Johnny (`mplsjohnnycage`) as reviewer | **Skipped** — Johnny out of review | — |
| Linear `submit_diff_review` `approved` | **Blocked** — “Could not submit the review to GitHub” | Formal GitHub APPROVE already landed via collab |
| Linear `submit_diff_review` `commented` | **Submitted** (APPROVE body + GitHub review link) | comment `d78def8b-…` on Linear review URL |

No implementation commits from this reviewer. Author ≠ reviewer. No merge from this session.

## Acceptance checklist

Must all pass → APPROVE.

| Check | Path(s) / evidence | Pass/fail | Notes |
| --- | --- | --- | --- |
| Callback at `/api/auth/callback` | `apps/developer-os/src/app/api/auth/callback/route.ts` added; `…/port/callback/route.ts` **deleted** | **PASS** | Exact OpenAccess / Port redirect path; `CALLBACK_PATH` constant |
| No stub — real PKCE token exchange | `exchangePortToken` + callback GET | **PASS** | Auth0 `/oauth/token`; `code` + `code_verifier`; **no** `client_secret`; session cookies set; `x-factory-oauth: token-exchanged` |
| Client id wiring | `PORT_FACTORY_CLIENT_ID` in code, `.env.example`, docs; Vercel MCP | **PASS** | Live id `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` on production/preview/development (plain); matches OpenAccess `port_client_id` |
| Factory-only; Observatory refused | `resolvePortOAuthConfig` + tests | **PASS** | `PORT_OBSERVATORY_CLIENT_ID` throws; callback 500 if set |
| Meta-only scope | PR files (11) | **PASS** | Dev OS + specs + docs + PBI-008 task mirror only |
| No turbo / `.beads` collision | `gh pr diff --name-only` | **PASS** | Zero turbo / beads / package-lock / vercel-ci files |
| Specs same PR | `specs/developer-os`, `specs/auth-port-oauth` | **PASS** | Contract: `/api/auth/callback`, PKCE, no stub |
| CI green on exact SHA | Check-runs on `61e41d0` | **PASS** | `developer-os-typecheck-test-build`, `local-gate-refuse`, `meta-ci-presence`, Vercel preview — all SUCCESS |
| Local re-verify | `npm ci && npm test && npm run typecheck` in `apps/developer-os` | **PASS** | **8/8** tests; typecheck clean |
| No Port OAuth create/delete/revoke | Diff + comments | **PASS** | Uses ADR-005 live Factory app only |

## Diff scope (PR #30 only)

11 files · +538 / −106 vs `main` @ `8568858` · single commit `61e41d0`.

- Added: `api/auth/callback/route.ts`, `docs/devos-port-oauth-vercel-env.md`
- Removed: stub `api/auth/port/callback/route.ts`
- Modified: login Route Handler (PKCE cookies), `port-oauth.ts`, tests, README / `.env.example`, specs, `tasks/PBI-008-devos-shell.md`

## Consistency skim

- Aligns OpenAccess redirects (`/.well-known/openaccess.json`) and Port live redirect set (localhost `/api/auth/callback`).
- Login sets httpOnly `state` + `code_verifier`; authorize hits `auth.getport.io` with S256 + `audience=https://api.getport.io`.
- Callback rebuilds `redirect_uri` from request origin (avoids preview/host drift vs authorize step).
- Author footer `bc-6f81b14f` ≠ this reviewer `bc-0cc20939`.
- Remaining ops (HTTPS Port redirects; prove `lastLoginAt`) are documented out-of-scope — do not block code APPROVE.

## Findings

### Blocking

None.

### Non-blocking

1. `FACTORY_PORT_CLIENT_ID_LIVE` constant is exported but unused in runtime paths (env remains SoT) — harmless documentation aid.
2. Non-localhost sign-in still needs Port HTTPS redirect registration (max 5; full replace-set) — ops, called out in PR body + env doc.
3. Live person login / Port `lastLoginAt` not proven in this PR — expected until operator completes a registered-URI round-trip.

## Recommendation / outcome

**APPROVE.** Callback path, real PKCE exchange, Factory client id wiring (repo + Vercel), Meta-only scope, no turbo/beads collision, and CI on exact SHA all pass. STL-186 may advance on authored artifacts. Do not merge from this review session; coordinator owns merge.

| Item | Value |
| --- | --- |
| Decision | **APPROVE** |
| PR | https://github.com/mplsjohnnycage/factory/pull/30 |
| Head SHA | `61e41d0e1df58a74e8a227040ddbf6729cb012e7` |
| Formal review | https://github.com/mplsjohnnycage/factory/pull/30#pullrequestreview-5693907943 |
| Author | `bc-6f81b14f` |
| Reviewer | `bc-0cc20939` |
