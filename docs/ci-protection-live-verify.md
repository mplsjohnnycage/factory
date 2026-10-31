---
cursor:
  subagentId: "bc-49a28489-3a99-5c73-ab9c-f09dd11c3b25"
---

# CI + main branch protection — live verify

**Repo:** [`mplsjohnnycage/factory`](https://github.com/mplsjohnnycage/factory)  
**Checked at:** 2026-10-29T06:26Z (read-only; no settings mutated)  
**Main tip:** `2546716d64613d6ebede75af7e847951094a1058`  
**Baseline doc:** [`factory-ci-setup-check.md`](factory-ci-setup-check.md)

## Verdict: **PASS** (with API-blind caveat on `enforce_admins`)

CI presence + public + LICENSE are live-confirmed. `main` is protected and merge behavior matches **PR + ≥1 write APPROVE + `meta-ci-presence`**. Agent/integration token still **403** on protection detail endpoints, so the exact `enforce_admins` boolean is not readable here.

| Check | Expected | Live result | Status |
|-------|----------|-------------|--------|
| `meta-ci-presence` workflow on `main` | Active job `name: meta-ci-presence` in `.github/workflows/meta-ci.yml` | Workflow `meta-ci` **active**; job present; push-to-`main` runs SUCCESS (incl. tip `2546716`) | **PASS** |
| Required status checks | At least `meta-ci-presence` | `branches/main` → `protected: true`; protection URL present; rulesets `[]` (classic, not ruleset). Detail GET **403**. Behavioral + Project preference: check enforced. Recent merges (#20–#22) show green `meta-ci-presence` | **PASS** (contexts list not dumpable via token) |
| `required_approving_review_count=1` | 1 | Detail GET **403**. Evidence: #20/#21/#22 each received formal `APPROVED` from write collaborator `skysthelimitpainting1779-collab` before merge; Project preference + IR docs say count left at **1** (not dipped) | **PASS** (behavioral) |
| `enforce_admins` | Prefer true (per repo `docs/ci/branch-protection.md`) | Detail GET **403**. No readable admin-enforcement flag. Post-protection window (#20+) has no direct non-PR main pushes; earlier `LICENSE` commit `e57d70b` (05:02Z) was a direct push (pre- or bypass-era) | **UNVERIFIED** (not a fail; token cannot read) |
| Public repo | Public | `visibility=public`, `private=false` | **PASS** |
| `LICENSE` | Present on `main` | Proprietary all-rights-reserved file at repo root (`NOASSERTION` / Other); commit `e57d70b` | **PASS** |

## Evidence notes

- Integration permissions: no admin on protection APIs (`Resource not accessible by integration`). Same 403 class as recorded in `factory-ci-setup-check.md`.
- GraphQL `branchProtectionRule` also FORBIDDEN; REST `GET .../branches/main` still returns `"protected": true`.
- `GET .../rulesets` → `[]`; `GET .../rules/branches/main` → `[]` → classic branch protection, not rulesets.
- Public HTML overview: `showProtectBranchBanner: false` (banner not advertising “protect this branch”).
- Project preference (2026-10-29): *“`main` branch protection is live (public repo): PR + 1 approval + green `meta-ci-presence` enforced. All-rights-reserved LICENSE on main.”*
- FE-81 marked done in `notes.md` (apply protection / require `meta-ci-presence`).

## Baseline refresh

[`factory-ci-setup-check.md`](factory-ci-setup-check.md) was **refreshed** (2026-10-29, store-only) to match this live verify: public repo, protection live, LICENSE on `main`, FE-81 done. Prior “Johnny must still apply protection” remainder is obsolete.

**No corrective settings change made** (read-only assignment). Optional follow-up for a human admin: `gh api repos/mplsjohnnycage/factory/branches/main/protection` with an admin token to dump `required_status_checks.contexts`, `required_approving_review_count`, and `enforce_admins.enabled` verbatim (token here still 403 on detail).
