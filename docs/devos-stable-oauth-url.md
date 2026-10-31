# Stable Dev OS OAuth URL (`NEXT_PUBLIC_DEVOS_URL`)

**When:** 2026-10-29  
**Task:** FE-120  
**Repo:** [mplsjohnnycage/factory](https://github.com/mplsjohnnycage/factory) (**PUBLIC** — do not flip private)  
**Vercel:** team `johnnyc` · project `factory-developer-os` (`prj_0aMlHCBmlLnCVkMLgqsxG3OxzdkM`)  
**PR:** **None** — Dev OS login already resolves `NEXT_PUBLIC_DEVOS_URL` in `apps/developer-os/src/lib/port-oauth.ts`

## Why

Port External Interface allowlists exact `redirect_uri` hosts. Preview deployments use ephemeral `*.vercel.app` hosts (`VERCEL_URL`), which diverge from the Factory app allowlist and break login with a callback mismatch.

Pin the public origin to the **stable** project domain so every prod / preview / local-dev build that has the env set emits:

`https://factory-developer-os.vercel.app/api/auth/callback`  
(login = `/api/auth/port/login`; callback is **not** under `/port/` — corrected in [`port-oauth-redirect-pin.md`](./port-oauth-redirect-pin.md))

## Env (set live)

| Key | Value | Targets | Type |
|-----|-------|---------|------|
| `NEXT_PUBLIC_DEVOS_URL` | `https://factory-developer-os.vercel.app` | `production`, `preview`, `development` | plain |

- Env id: `ySZHzGmEbWZPoL5J`
- Comment on Vercel: stable public Dev OS origin for Port OAuth `redirect_uri` allowlist; prefer over `VERCEL_URL`; never Observatory.
- Coexists with `PORT_FACTORY_CLIENT_ID` (Factory External Interface only). **Do not** set `PORT_OBSERVATORY_CLIENT_ID`.

## Code path (already on tree)

`resolvePortOAuthConfig` preference order (after redirect-pin PR):

1. `NEXT_PUBLIC_DEVOS_URL` (explicit stable origin)
2. Stable hard-fallback `https://factory-developer-os.vercel.app` on Vercel/production — **never `VERCEL_URL`**
3. `http://localhost:3000` (local)

Login route: `apps/developer-os/src/app/api/auth/port/login/route.ts` → authorize redirect with `redirect_uri` from that config.

## Public + Observatory constraints

| Check | Status |
|-------|--------|
| Project public (no password / SSO protection) | Confirmed — `passwordProtection` / `ssoProtection` disabled |
| Repo stays public | Do not flip private for this fix |
| Observatory | Untouched — Factory client id only; Contract forbids Observatory as Dev OS OAuth client |

## Operator follow-ups

1. **Redeploy** after this env change so running builds bake in `NEXT_PUBLIC_*` (build-time for Next public env). Until redeploy, old deployments may still emit `VERCEL_URL`-based callbacks. Production deploy `dpl_EzdHTjfhR6WEoX5gx3fYY6nvE3pb` (`main` @ `fd4a774`) started ~24s after this env upsert and is **READY**, aliased to `factory-developer-os.vercel.app`.
2. Keep Port Factory External Interface `redirect_uris` including  
   `https://factory-developer-os.vercel.app/api/auth/callback`  
   (plus localhost for local). Do not add ephemeral preview hosts as the primary allowlist strategy.
3. Local `.env`: optional `NEXT_PUBLIC_DEVOS_URL=https://factory-developer-os.vercel.app` only when testing against the live allowlisted callback from a non-localhost agent; default localhost remains fine for pure local Port redirect allowlist entries.

## Related

- [`port-oauth-https-done.md`](./port-oauth-https-done.md) — HTTPS callbacks + live login
- [`port-factory-oauth-live.md`](./port-factory-oauth-live.md) — Factory External Interface live record
- Spec: `specs/auth-port-oauth/spec.md` · ADR-005 / ADR-011
