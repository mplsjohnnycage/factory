---
cursor:
  subagentId: "bc-781bbb2e-e013-51f6-96f9-cb462a3288a8"
---

# Vercel CI setup — `mplsjohnnycage/factory`

**Updated:** 2026-10-29 — **merged scaffold**; Hive still blocked on public  
**PR:** [#25](https://github.com/mplsjohnnycage/factory/pull/25) — **MERGED**  
**Merge SHA (main):** `a0237803ca8c9da0506df3cf72ba82bb4b4ab2dc`  
**Pre-merge head:** `c965ec7403a459fd7329e3c7e50adca7a2a1cec6` (main-updated)  
**Visibility:** **PUBLIC** (stays — no flip)

## Verdict

**Scaffolding merged** to `main` (Turborepo tags, Meta workspaces, `vercel ci enable`, root `factory-meta-ci` + `vercel.json` bootstrap, local-font flake fix). **Hive / Vercel CI GitHub check is not live** — product returns **HTTP 409** `Vercel CI is not available for public repositories.` Meta package checks remain on **GitHub Actions**.

## Merge path (protection respected)

1. PR was **BEHIND** `main` → merged `main` into `cursor/vercel-ci-setup-57b0` → head `c965ec7`
2. Required GHA checks **green** on that SHA (incl. `meta-ci-presence`, accept-matrix)
3. Prior APPROVE on `bffe745` dismissed stale → re-**APPROVE** via write collab `skysthelimitpainting1779-collab` on `c965ec7` ([review](https://github.com/mplsjohnnycage/factory/pull/25#pullrequestreview-5694020204))
4. Squash-merge → `a023780` on `main`

## Confirmed on main (scaffold)

| Step | Evidence |
|------|----------|
| One team | `johnnyc` only for `factory` projects |
| Turborepo + tags | `2.11.10`; `typecheck`/`test` `"tags":["ci"]` |
| Enable from clone | `vercel ci enable --scope johnnyc` → `ciEnabled: true` |
| Root monorepo project | `factory-meta-ci` (`prj_vFoiDkzoSWbSI35XYJSniFYKpDvx`) rootDirectory `.`, ignore build |
| Root `vercel.json` CI bootstrap | `ci.bootstrapping.installCommand: npm install` |
| Font flake | `next/font/local` + OFL Syne/Source Sans woff2 |

## Hive blocked (unchanged)

- `vercel ci list --all-branches` → empty (entire team)
- No Vercel CI GitHub check (classic preview only)
- `POST /v1/vercel-ci/task-analyses` → **409** public-repo block

Repo doc: `docs/ci/vercel-ci.md` on `main`.

## Operator note

Keep public → accept GHA as Meta CI until Vercel enables public-repo Hive **or** Johnny revisits visibility. **Do not treat merge as “Vercel CI live.”**
