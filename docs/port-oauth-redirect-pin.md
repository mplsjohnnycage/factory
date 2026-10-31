# Permanent Port OAuth redirect base pin

**When:** 2026-10-29  
**Repo:** [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC** — do not flip private)  
**PR:** [#42](https://github.com/mplsjohnnycage/factory/pull/42) — https://github.com/mplsjohnnycage/factory/pull/42  
**Head:** `cursor/port-oauth-redirect-pin-57dd` @ `ea6c288` → `main` (ready for review, not draft)  
**Discarded:** `cursor/port-oauth-redirect-pin-81e8` — never opened a PR; unique never-`VERCEL_URL`-on-preview behavior consolidated onto `57dd`.  
**Review:** Independent review required (author ≠ reviewer). Do **not** self-approve / self-merge. Prior PASS on abandoned `81e8` does not clear merge for `#42`.

**Vercel:** team `johnnyc` · project `factory-developer-os` (`prj_0aMlHCBmlLnCVkMLgqsxG3OxzdkM`)  
**Factory EI `client_id`:** `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` (same app; “Port Production EU” on the error page is Auth0 branding, not a second client)

## What path actually fires

| Step | Code | Path |
|------|------|------|
| Start login | `GET /api/auth/port/login` → `resolvePortOAuthConfig` → `buildAuthorizeRedirect` | `apps/developer-os/src/app/api/auth/port/login/route.ts` + `src/lib/port-oauth.ts` |
| Callback | `GET /api/auth/callback` → `exchangePortToken` with **same** `config.redirectUri` | `apps/developer-os/src/app/api/auth/callback/route.ts` |

Canonical callback path is **`/api/auth/callback`** (aligned with Port + OpenAccess). The old stub `/api/auth/port/callback` was removed; FE-120 docs that still say `/api/auth/port/callback` are stale.

`redirect_uri` origin resolution (`resolveDevOsOrigin`):

1. `NEXT_PUBLIC_DEVOS_URL` (explicit pin)
2. Any Vercel deploy **or** `NODE_ENV=production` → `https://factory-developer-os.vercel.app` — **never** `VERCEL_URL` (prod or preview)
3. Local → `http://localhost:3000`

## Why FE-120 missed

FE-120 correctly set `NEXT_PUBLIC_DEVOS_URL=https://factory-developer-os.vercel.app` on all Vercel targets and preference-ordered it over `VERCEL_URL`. That was necessary but not sufficient as a **fleet** guarantee:

1. **Soft fallback remained.** If the env was absent from a given build/runtime, authorize fell through to `https://${VERCEL_URL}/…`, minting a new allowlist host per deployment.
2. **Stale deployment hosts stay live.** The failure URI host `factory-developer-4vf3fb75w-johnnyc.vercel.app` is production deploy `dpl_7VVqGxUWqcV4TxreczCArcnW4dLc` (pre-env). Hitting that URL (bookmark, Port error retry, old link) still emits itself as `redirect_uri` today:
   - Stable alias **now** (post FE-120 redeploy): `https://factory-developer-os.vercel.app/api/auth/callback` ✅  
   - Old dpl `4vf3fb75w`: `https://factory-developer-4vf3fb75w-johnnyc.vercel.app/api/auth/callback` ❌  
3. **Docs path drift.** FE-120 documented `/api/auth/port/callback`; the live path (and Port allowlist) is `/api/auth/callback`. Same client; wrong path in docs caused confusion about “which app.”
4. **Callback Host rebuild.** Callback previously rebuilt `redirect_uri` from request origin “to match authorize when env/VERCEL_URL differ,” which couples token exchange to whichever host served the request instead of the configured pin.

## What this change does

| Change | Detail |
|--------|--------|
| Production hard pin | `CANONICAL_DEVOS_ORIGIN` + `resolveDevOsOrigin` — production never uses `VERCEL_URL` |
| Env still preferred | `NEXT_PUBLIC_DEVOS_URL` wins when set (already on prod/preview/development) |
| Callback | Exchanges with `resolvePortOAuthConfig().redirectUri`; post-login redirect uses that origin |
| Specs | `specs/developer-os/spec.md`, `specs/auth-port-oauth/spec.md` — production pin scenarios/guardrails |
| Tests | 10 pass including “pins production — never VERCEL_URL” |

**Vercel env:** confirmed present — `NEXT_PUBLIC_DEVOS_URL` id `ySZHzGmEbWZPoL5J`, value `https://factory-developer-os.vercel.app`, targets production + preview + development. No env upsert needed. Redeploy after **PR merge** so the hard-pin code ships on the production alias; current alias already soft-pins via env.

## How to prune the 5th rotating URI (after verify)

1. Merge this PR after **independent** review (no author self-merge; no Linear→Cursor coding delegate).
2. Smoke: `curl -sI https://factory-developer-os.vercel.app/api/auth/port/login` → Location `redirect_uri` must be  
   `https://factory-developer-os.vercel.app/api/auth/callback`.
3. Complete one human Sign in with Port on the **stable** alias; confirm session cookie / `?port=signed-in`.
4. On Port Factory External Interface (same `client_id`; do **not** touch Observatory), replace redirect set with the stable allowlist only, e.g.:
   - `https://factory-developer-os.vercel.app/api/auth/callback`
   - `http://localhost:3000/api/auth/callback`
   - `http://127.0.0.1:3000/api/auth/callback`  
   Remove the temporary 5th entry for the rotating deployment host (and any other ephemeral `*.vercel.app` URIs).
5. Do not re-add deployment hosts as a strategy — max 5 exact URIs; the code pin is the permanent control.

## Constraints honored

- Repo stays public  
- Factory EI only — no Observatory OAuth client  
- No Port OAuth create/delete/revoke from this work beyond operator prune guidance  
- Author ≠ reviewer for merge  

## Related

- [`devos-stable-oauth-url.md`](./devos-stable-oauth-url.md) — FE-120 env pin (incomplete without hard code pin)
- Repo: `docs/devos-port-oauth-vercel-env.md`, `apps/developer-os/src/lib/port-oauth.ts`
