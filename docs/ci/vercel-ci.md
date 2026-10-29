# Vercel CI (Hive) — Meta status

**PR:** [#25](https://github.com/mplsjohnnycage/factory/pull/25)  
**Lane:** Meta only · repo **stays public** (Johnny 2026-10-29)  
**Product docs:** [vercel.com/docs/ci](https://vercel.com/docs/ci) · skill: `npx skills use vercel/ci@setup`

## Honest enablement state

| Layer | State | Evidence |
|-------|--------|----------|
| Scaffolding | **Done** | Root workspaces + `turbo@2.11.10` + `turbo.json` `"tags": ["ci"]` on `typecheck` / `test` |
| `vercel ci enable` flag | **Done** | `ciEnabled: true` for `github/mplsjohnnycage/factory` (re-enabled after disable cycle) |
| Live Hive invocation | **Not observed** | `vercel ci list --all-branches --scope johnnyc` → `runs: []` (team-wide empty) |
| Vercel CI GitHub check on PR | **Absent** | PR checks = GHA + classic **Vercel preview** only — preview ≠ Vercel CI |

**Do not treat `ciEnabled: true` alone as “Vercel CI is working.”** Flag + scaffolding ≠ product run.

## Selected tasks (scaffolding)

| Task | Packages | Notes |
|------|----------|--------|
| `typecheck` | 4 Meta apps | Matches GHA package typecheck |
| `test` | 4 Meta apps | Matches GHA package unit tests |

Build/lint intentionally **not** tagged. Root `npm test` remains local-gate (PBI-013); package tests via `turbo run test` / `npm run test:packages`.

## Why no Hive run (public repo)

### Operator decision

Repository **`mplsjohnnycage/factory` stays public** on purpose. Do **not** flip visibility as a workaround.

### Evidence pack

1. **Visibility (live):** `gh repo view` → `isPrivate: false`, `visibility: PUBLIC`.
2. **Official setup skill precondition (private-only):**  
   - [vercel-ci-setup skill](https://www.skills.sh/vercel/ci/vercel-ci-setup): “Onboard a **private** GitHub repository…”  
   - Precondition 6: “Require a **private** GitHub repository linked to at least one project…”  
   - Bundled `local-onboarding.md`: “Stop if the repository is **public**…”
3. **Product docs limitations** ([docs/ci](https://vercel.com/docs/ci)): list Linux, GitHub-only, `git push` trigger, ≥1 linked project, single-team projects — they **do not** explicitly say “public unsupported.” Skill is stricter than the public Limitations page.
4. **Enable + push still produced zero invocations:**
   - Enabled before first PR push (`ciEnabledAt` initially `1793255850804`)
   - Force-push after rebase to `286691c…`
   - Disable → re-enable (`ciEnabledAt` refreshed) → follow-up push on this docs fix
   - CLI/MCP `list` for branch, commit, and **entire team** → empty
5. **PR check rollup:** `meta-ci-presence`, `local-gate-refuse`, classic `Vercel` preview SUCCESS — **no** Vercel CI / Hive check name.
6. **Secondary context (not the operator ask):** team `johnnyc` is **Hobby**; [CI pricing](https://vercel.com/docs/ci/pricing) lists **Pro** / **Enterprise** CPU-minute rates only (Hobby not listed). Blog claims beta on all plans; pricing table does not. Treat as secondary hypothesis — primary documented blocker for this Meta lane is **public + skill private precondition + zero observed Hive runs**.

### Operator ask (no visibility flip)

To get a live Hive check on this repo **without** making it private, Johnny (or Vercel) must confirm one of:

1. **Vercel CI beta supports public GitHub repos** on Hobby (or after Pro), and what config is missing here; **or**
2. Accept that Meta stays on **GitHub Actions** for package checks until Vercel CI GA / public support is explicit.

Until a real `vercel ci list` run ID and a Vercel CI status check appear on the PR head SHA, enablement remains **incomplete**.

## Lookup commands

```bash
vercel api "/v1/vercel-ci/repository-settings?provider=github&organizationId=mplsjohnnycage&repository=factory" --scope johnnyc --raw
vercel ci list --branch cursor/vercel-ci-setup-57b0 --scope johnnyc --json
vercel ci list --all-branches --scope johnnyc --json
gh pr view 25 --json statusCheckRollup,headRefOid
gh repo view mplsjohnnycage/factory --json isPrivate,visibility
```

Dashboard CI tab: `https://vercel.com/johnnyc/~/ci` (empty while no invocations exist).
