---
cursor:
  subagentId: "bc-b51a99a8-277f-5e9c-8463-d815c1f273df"
---

# CI morning check — `mplsjohnnycage/factory`

**Checked:** 2026-10-29T08:20Z (UTC) · read-only `gh api` · no settings mutated  
**Main tip:** `fd4a77464cd5` — `docs(seed): PBI-015 CE compound writeback deferred mirror (STL-176) (#38)`

## Verdict

| Lane | Status |
|------|--------|
| Accept-on-SHA path (PBI-011 / ADR-008) | **GREEN** |
| Always-on Meta gate (`meta-ci-presence`) | **GREEN** on tip |
| Open PRs | **None** |
| Branch protection detail dump | **403** (token); `protected: true` confirmed |

**Accept-on-SHA still green:** last `meta-accept-gate` on `main` (**success**, SHA `a023780`, [run 40833242971](https://github.com/mplsjohnnycage/factory/actions/runs/40833242971)) — `accept-sha-rewrite-tests` **success**; `accept-evaluate-exact-sha` **skipped** (push path; evaluate needs dispatch/`sha` input). Companion `meta-accept-matrix` **success** same SHA. Tip `fd4a774` is docs-only so path filters skipped accept workflows; presence + local-gate still **success**.

## Branch protection (`main`)

| Probe | Result |
|-------|--------|
| `GET .../branches/main` | `protected: true` |
| `GET .../branches/main/protection` | **403** Resource not accessible by integration |
| `GET .../rulesets` | `[]` (classic protection, not rulesets) |

Behavioral gate unchanged vs prior verify: PR + ≥1 write approve + green `meta-ci-presence`. `enforce_admins` / exact required-contexts list still not dumpable without admin token.

## Recent CI (selected)

| When (UTC) | Event | SHA | Workflows | Conclusion |
|------------|-------|-----|-----------|------------|
| 07:52 | push `main` | `fd4a774` | `meta-ci`, `local-gate` | success |
| 07:05 | push `main` (#25) | `a023780` | `meta-ci`, `local-gate`, `meta-accept-gate`, `meta-accept-matrix`, `factory-gateway`, `developer-os` | **all success** |
| 07:03–07:46 | PR | various | PR suites | success (one earlier matrix failure on vercel-ci PR, later green) |

Combined commit status on tip: GitHub `state=failure` solely from **`Vercel – factory-meta-ci`** (not a Meta accept required check). `Vercel – factory-developer-os` = success. Check-runs on tip: `meta-ci-presence`, `local-gate-refuse` = success.

## Open PRs

`gh pr list --state open` → **`[]`**. Latest merges: [#38](https://github.com/mplsjohnnycage/factory/pull/38) (tip), [#33](https://github.com/mplsjohnnycage/factory/pull/33), [#30](https://github.com/mplsjohnnycage/factory/pull/30), [#29](https://github.com/mplsjohnnycage/factory/pull/29), [#28](https://github.com/mplsjohnnycage/factory/pull/28).

## Ops notes

- Do **not** treat Vercel deployment statuses as accept oracle (ADR-008 / `docs/ci/branch-protection.md`).
- Port Cockpit accept wiring remains PBI-011 remainder; CI foundation + gate evidence path is healthy.
- Optional admin: dump protection with a human token — `gh api repos/mplsjohnnycage/factory/branches/main/protection`.
