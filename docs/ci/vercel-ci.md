# Vercel CI (Hive) — Meta

**PR:** [#25](https://github.com/mplsjohnnycage/factory/pull/25)  
**Lane:** Meta · repo **stays public** (Johnny — do not flip visibility)  
**Product docs:** [vercel.com/docs/ci](https://vercel.com/docs/ci)

## Scaffolding (complete)

| Requirement | Status |
|-------------|--------|
| Project(s) on **one** team (`johnnyc`) only | Done — `factory-developer-os` + `factory-meta-ci` |
| Turborepo ≥ 2.11.7 + `"tags": ["ci"]` | Done — `turbo@2.11.10`; tags on `typecheck` + `test` |
| `vercel ci enable` from clone after connect | Done — `ciEnabled: true` for `github/mplsjohnnycage/factory` |

## Live Hive / GitHub check (blocked)

| Probe | Result |
|-------|--------|
| `vercel ci list` (branch / commit / **all branches**) | `runs: []` |
| PR #25 status checks | GHA + classic **Vercel preview** only — **no** Vercel CI check |
| `vercel ci inspect` on head | `ci_run_not_found` |

### Smoking-gun product error (public repo)

After enable + root `turbo.json` tags, starting a Vercel CI task analysis against this GitHub repo:

```bash
printf '%s\n' '{"owner":"mplsjohnnycage","repo":"factory"}' |
  vercel api "/v1/vercel-ci/task-analyses" --scope johnnyc --method POST --input - --raw
```

**HTTP 409:**

```text
Vercel CI is not available for public repositories.
```

So the **enable flag can be set** and scaffolding can land, but the product **refuses public repos** for CI analysis / Hive runs. Published Limitations on docs/ci do not currently list this; the live API does.

Operator decision: keep `factory` **public**. Therefore Meta package checks remain on **GitHub Actions** until Vercel CI supports public repos (or Johnny changes that operator decision).

Secondary note: team plan is **Hobby**; [CI pricing](https://vercel.com/docs/ci/pricing) lists Pro/Enterprise CPU-minute rates only. Primary blocker evidenced here is the **409 public-repo** response, not Hobby alone.

## Lookup

```bash
vercel api "/v1/vercel-ci/repository-settings?provider=github&organizationId=mplsjohnnycage&repository=factory" --scope johnnyc --raw
vercel ci enable --scope johnnyc
vercel ci list --all-branches --scope johnnyc --json
printf '%s\n' '{"owner":"mplsjohnnycage","repo":"factory"}' |
  vercel api "/v1/vercel-ci/task-analyses" --scope johnnyc --method POST --input - --raw
gh pr view 25 --json headRefOid,statusCheckRollup
gh repo view mplsjohnnycage/factory --json isPrivate,visibility
```
