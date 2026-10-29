# Branch protection for `main` (ADR-008 / PBI-011)

Meta lane only — `mplsjohnnycage/factory`. Accept binds to **green checks on the exact commit SHA** ([ADR-008](../adrs/ADR-008-visibility-accept-ci-sha.md)). This doc is the Johnny admin click-list when the agent token cannot write protection (403 / no `admin`).

## Required check contexts (after this CI PR merges)

Require these **status checks** to pass before merging to `main` (strict: tip of PR must be up to date optional but recommended once matrix is stable):

| Required context (job `name:`) | Workflow | When it runs |
|--------------------------------|----------|--------------|
| `meta-ci-presence` | `meta-ci` | **Every** PR + push to `main` (docs/Specs/ADRs included) |
| `compose-config-lint` | `compose-lint` | compose / healthcheck paths |
| `gateway-typecheck-test` | `factory-gateway` | `apps/factory-gateway/**` |
| `sandbox-typecheck-test` | `sandbox-harness` | sandbox / coder agent paths |
| `supervisor-typecheck-test` | `project-supervisor` | supervisor / beads / factory-kernel spec |
| `developer-os-typecheck-test-build` | `developer-os` | DevOS app + `specs/developer-os/**` (after PBI-008) |

**Always require** at least `meta-ci-presence`. Path-filtered checks only appear when those paths change — GitHub “require status checks” with path-filtered jobs needs either:

1. **Require only `meta-ci-presence`** until PBI-011 lands Port accept wiring, **or**
2. Require the full set and accept that GitHub skips missing checks only if “Require branches to be up to date” + required checks that always run — **prefer option 1 for day-to-day**, and run `meta-accept-matrix` (workflow_dispatch) on the candidate SHA before Port accept.

Do **not** require Vercel preview as a Meta accept gate (visibility noise; not ADR-008 oracle).

## Admin click path (GitHub UI)

Repo is **private**; classic branch protection works; **Rulesets** need GitHub Pro or public repo (API returned upgrade message).

1. Open https://github.com/mplsjohnnycage/factory/settings/branches
2. **Add classic branch protection rule** → Branch name pattern: `main`
3. Enable:
   - **Require a pull request before merging**
   - **Require approvals**: `1` (author ≠ reviewer — agents/Codex/Linear)
   - **Dismiss stale pull request approvals when new commits are pushed**
   - **Require status checks to pass before merging**
   - Search/add: `meta-ci-presence` (required). Optionally add package job names once they have appeared on `main` at least once.
   - **Require conversation resolution before merging** (recommended)
   - **Do not allow bypassing the above settings** (include admins) once comfortable
4. Save changes
5. Confirm with: `gh api repos/mplsjohnnycage/factory/branches/main/protection` (needs admin token)

## Admin via `gh` (when token has `admin:repo` / repo admin)

```bash
# Classic protection — adjust contexts after jobs have run once on main
gh api -X PUT repos/mplsjohnnycage/factory/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks='{"strict":true,"contexts":["meta-ci-presence"]}' \
  -F enforce_admins=true \
  -f required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  -F restrictions='' \
  -F allow_force_pushes=false \
  -F allow_deletions=false
```

If PUT returns **403 Resource not accessible by integration**, use the UI path above (Johnny).

Rulesets (`POST /repos/.../rulesets`) on this private repo currently require **GitHub Pro** or making the repo public — prefer classic protection until then.

## Accept-on-SHA operator path (foundation → PBI-011)

1. Candidate delivery commit = exact SHA `S` on the PR tip (not branch name).
2. Ensure `meta-ci-presence` is green on `S`.
3. For vertical-slice accept: `gh workflow run meta-accept-matrix.yml -f ref=S` (or push a no-op after CI files so matrix runs) and confirm all `accept-matrix (*)` jobs green on `S`.
4. Port accept (Cockpit/human) only after (2)+(3); rewrite of the tip invalidates accept for the old SHA (visibility-accept Spec).
5. **PBI-011:** run `scripts/accept-on-sha.ts` / `meta-accept-gate` / gateway `POST /accept/evaluate` on `S` before Cockpit Port-accept. See `docs/ci/port-accept-on-sha.md`. Agents never self-accept.

## Meta vs Product

Workflows target Meta packages only (`factory-gateway`, `sandbox-harness`, `project-supervisor`, `developer-os`, compose). No Product Beads / product board CI.
