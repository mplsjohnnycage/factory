# developer-os (PBI-008 / STL-169 + Port OAuth e2e)

Factory **Developer OS** shell: Next.js App Router on Vercel, Code Atlas hero first viewport, Port OAuth Authorization Code + PKCE (Factory External Interface client — never Observatory / Clerk / CopilotKit).

Lane: **Meta only** · browser never calls Sandbox Agent · no Port OAuth create/delete · no Product Beads.

## Layout

| Path | Role |
|------|------|
| `src/app/page.tsx` | Atlas hero shell (first viewport) |
| `src/components/AtlasHero.tsx` | Full-bleed Code Atlas composition |
| `src/app/api/auth/port/login` | Begin Port OAuth (PKCE challenge + state cookies) |
| `src/app/api/auth/callback` | OAuth callback — **token exchange** (matches Port redirects) |
| `src/lib/port-oauth.ts` | Config, PKCE, Auth0 token exchange, Observatory refuse |
| `src/lib/rivet/` | Rivet-native session client + Memory/HTTP transports (PBI-009) |
| `src/app/session/[sessionId]` | Session stream view (reconnect from last `sequence`) |
| `src/app/api/rivet/sessions/...` | BFF gap-replay + SSE (never Sandbox Agent) |

## Verify (CI)

```bash
cd apps/developer-os
npm ci
npm run typecheck
npm test
npm run build
```

## Env

Copy `.env.example`. Required:

| Variable | Value | Notes |
|----------|-------|-------|
| `PORT_FACTORY_CLIENT_ID` | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` | Live Factory External Interface client id (public PKCE). **Do not** set Observatory. |

Optional:

| Variable | Default | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_DEVOS_URL` | `http://localhost:3000` (or `https://$VERCEL_URL`) | Origin used for `redirect_uri` |
| `PORT_AUTH0_DOMAIN` | `auth.getport.io` | EU Auth0 |
| `PORT_API_BASE` | `https://api.getport.io` | JWT `audience` |
| `PORT_OAUTH_SCOPES` | `openid profile email offline_access` | |

### Vercel project `factory-developer-os`

Set on **Production**, **Preview**, and **Development**:

1. `PORT_FACTORY_CLIENT_ID` = `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` (plain)
2. Optionally `NEXT_PUBLIC_DEVOS_URL` = production custom domain / stable URL once registered on the Port app

**Port redirect URIs (live today):** only localhost —

- `http://localhost:3000/api/auth/callback`
- `http://127.0.0.1:3000/api/auth/callback`

Before non-localhost sign-in works, an org admin must add the exact HTTPS callback(s) via Port MCP `upsert_external_interface_app` (full replace-set). Preview wildcards are not supported (max 5 exact URIs).

Session cookies after successful exchange: `factory_port_access_token` (+ optional refresh / id token). HttpOnly; no `client_secret`.

## Spec

`specs/developer-os/spec.md` and `specs/auth-port-oauth/spec.md` — updated in the same PR when Contract changes.

## Session stream (PBI-009)

Open `/session/demo` (or any session id). Client uses Rivet-native `RivetSessionClient`:
gap replay then live SSE; on blip, reconnects from last `sequence`. Memory fixture when
`RIVET_SERVE_URL` unset. **No CopilotKit. No browser→Sandbox Agent.**

## Follow-ons

- Register production/preview HTTPS callbacks on the Port Factory app when deploy URLs are stable
- Live Rivet Serve wiring when desktop Tailscale URL is stable
