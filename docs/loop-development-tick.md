# Loop development tick

**When:** 2026-10-29 ~03:40 America/Chicago  
**Repo:** https://github.com/mplsjohnnycage/factory (**PUBLIC**)  
**Stop:** Johnny break — this tick write only; no Funnel/remount; no Port 5th-URI prune.

## PR table

| PR | Purpose | Status |
|----|---------|--------|
| [#39](https://github.com/mplsjohnnycage/factory/pull/39) | OpenAccess stable Dev OS redirects | **MERGED** · collab APPROVE · `meta-ci-presence` green |
| [#40](https://github.com/mplsjohnnycage/factory/pull/40) | Gateway remount dry-run kit | **MERGED** (earlier) · FE-133 |
| [#41](https://github.com/mplsjohnnycage/factory/pull/41) | Gateway Dockerfile + compose profile | **MERGED** · collab APPROVE · FE-134 |
| [#42](https://github.com/mplsjohnnycage/factory/pull/42) | Port OAuth hard-pin (`57dd`) | **MERGED** · collab APPROVE (FE-131 content + write) · head advanced through main sync |

Reviewers (author≠reviewer): FE-132 `#39` `bc-e92c5655` · FE-133 `#40` `bc-165a946a` · FE-134 `#41` `bc-129df4a7` · FE-131 `#42` `bc-819a7b97`. Formal write APPROVE via `skysthelimitpainting1779-collab`.

## OAuth (FE-128)

Stable alias `GET /api/auth/port/login` → **302** Auth0 with  
`redirect_uri=https://factory-developer-os.vercel.app/api/auth/callback` — **PASS**.  
Human Sign in with Port on production alias still pending before pruning temp `n5tdoht4l` URI. Hard-pin code now on `main` via #42 — prod redeploy + human login still required before prune.

## Blockers (Johnny desktop only)

1. **Tailscale Funnel** on Muse → public `FACTORY_GATEWAY_BASE_URL` + off-tailnet `/health` 200 (cloud cannot Funnel).  
2. **Port `factory_*` WEBHOOK remount** only after (1).  
3. After #42 prod redeploy: **human Sign in with Port** on stable alias, then prune temp redirect URI.

No new PRs. PBI-015 held. No Observatory. Single-MCP Port EU. Repo stays public.
