---
cursor:
  subagentId: "bc-91c63a9b-642c-57a3-b1d9-d29914f6850e"
---

# Factory CI setup check — `mplsjohnnycage/factory`

**Verdict: CI foundation MERGED + `main` protection LIVE (public repo).**

Synced to live verify: [`ci-protection-live-verify.md`](ci-protection-live-verify.md) (2026-10-29T06:26Z). No GitHub settings mutated by this doc refresh.

| Item | Value |
|------|--------|
| CI foundation PR | [#17](https://github.com/mplsjohnnycage/factory/pull/17) **MERGED** |
| Foundation merge SHA | **`c9bd7fbae6c6fcb21879453011596e9df7b0ab9a`** (2026-10-29T04:53:12Z) |
| Live verify main tip | `2546716d64613d6ebede75af7e847951094a1058` |
| Main tip at this refresh | `8568858cadaf9510b60e0f738a43c30f9674bd7a` (`protected: true`) |
| Visibility | **`public`** (`private=false`) |
| `main` protection | **Live** — classic branch protection (`protected: true`; rulesets `[]`) |
| Required merge gate (behavioral) | PR + ≥1 write `APPROVED` + green **`meta-ci-presence`** |
| LICENSE | All-rights-reserved proprietary on `main` (`e57d70b`) |
| FE-81 | Done (apply protection / require `meta-ci-presence`) |
| Independent review (#17) | APPROVE — `bc-6473c2d4` ([report](pbi-ci-accept-path-independent-review.md)); implementer did not self-review |
| Linear | Contributes STL-172 / PBI-011 (Port accept wiring still open) |

## What landed on `main` (foundation #17)

- Always-on `meta-ci` / **`meta-ci-presence`**
- `meta-accept-matrix` (PBI-011 foundation; no Port accept)
- Renamed package jobs; push limited to `main`
- `developer-os.yml` named job (post-#16)
- `docs/ci/branch-protection.md`
- `specs/visibility-accept/spec.md` docs-only CI scenario

Post-foundation merges through at least #20–#22 also show green `meta-ci-presence` under the live gate.

## Branch protection — applied (no longer pending)

| Expected | Live |
|----------|------|
| Classic rule on `main` | `branches/main` → `protected: true`; not rulesets |
| Require status checks ≥ `meta-ci-presence` | Enforced (behavioral + Project preference); contexts list **not** dumpable — detail GET **403** |
| Require PR + ≥1 approving review; dismiss stale | Behavioral PASS on #20–#22 (formal write APPROVE from `skysthelimitpainting1779-collab` before merge); count left at **1** |
| Do **not** require Vercel as Meta accept gate | Unchanged policy |
| `enforce_admins` prefer true | **UNVERIFIED** — same token 403 on protection detail / GraphQL `branchProtectionRule` |

Ops click-list remains in-repo: [`docs/ci/branch-protection.md`](https://github.com/mplsjohnnycage/factory/blob/main/docs/ci/branch-protection.md). Agent/integration token still cannot read or write protection settings (403 / no admin).

**Optional human admin dump** (not required for this store refresh):

```bash
gh api repos/mplsjohnnycage/factory/branches/main/protection
```

Confirm `required_status_checks.contexts`, `required_approving_review_count`, and `enforce_admins.enabled` verbatim.

## Not done (STL-172)

Port accept / Cockpit / Meta Beads close-after-accept — still PBI-011 remainder (accept = green CI on exact SHA + Port governance; protection alone ≠ Port accept).
