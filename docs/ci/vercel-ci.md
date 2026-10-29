# Vercel CI (Hive) — Meta

**PR:** [#25](https://github.com/mplsjohnnycage/factory/pull/25)  
**Lane:** Meta · repo **public** (intentional)  
**Docs:** [vercel.com/docs/ci](https://vercel.com/docs/ci)

## Requirements (current product)

- GitHub repo connected to ≥1 Vercel project on **one team only** (`johnnyc`)
- Turborepo ≥ 2.11.7 with `"tags": ["ci"]` on selected tasks
- `vercel ci enable` from a local clone after that connection

Public repos are supported for Vercel CI beta (Johnny + Muse 2026-10-29). Do **not** flip visibility.

## Scaffolding (this PR)

| Item | Value |
|------|--------|
| Turborepo | `2.11.10` (`devDependencies.turbo: ^2.11.7`) |
| Workspaces | 4 Meta apps under `apps/*` |
| CI tags | `typecheck`, `test` in root `turbo.json` |
| Enable | `vercel ci enable --scope johnnyc` → `ciEnabled: true` for `github/mplsjohnnycage/factory` |

Root `npm test` remains local-gate (PBI-013). Package tests: `npm run test:packages` / `turbo run test`.

## Verification

```bash
vercel api "/v1/vercel-ci/repository-settings?provider=github&organizationId=mplsjohnnycage&repository=factory" --scope johnnyc --raw
vercel ci enable --scope johnnyc   # idempotent; expect unchanged once enabled
vercel ci list --branch <branch> --commit <sha> --scope johnnyc --json
gh pr view 25 --json headRefOid,statusCheckRollup
```

Expect a **Vercel CI** check on the PR (not only classic “Vercel” preview). Invocation URL pattern: `https://vercel.com/johnnyc/~/ci/<id>`.

## Linked projects (same team)

| Project | Root directory | Role |
|---------|----------------|------|
| `factory-developer-os` | `apps/developer-os` | Next.js preview/prod |
| `factory-meta-ci` (if present) | repo root | Monorepo CI bootstrap (ignore build) |
