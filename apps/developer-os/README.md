# developer-os (PBI-008 / STL-169 + Port OAuth e2e)

Factory **Developer OS** shell: Next.js App Router on Vercel, Code Atlas hero first viewport, Port OAuth Authorization Code + PKCE (Factory External Interface client — never Observatory / Clerk / CopilotKit).

Lane: **Meta only** · browser never calls Sandbox Agent · no Port OAuth create/delete · no Product Beads.

## Layout

| Path | Role |
|------|------|
| `src/app/page.tsx` | Atlas hero shell (first viewport) |
| `src/components/AtlasHero.tsx` | Full-bleed Code Atlas composition + overlay toggles |
| `src/lib/atlas/` | STL-154 four-overlay read projection + MCP tools |
| `src/app/api/atlas/subgraph` | Viewport-capped subgraph JSON |
| `src/app/api/atlas/tools` | Bounded `atlas.*` tool list + invoke |
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
| `NEXT_PUBLIC_DEVOS_URL` | local: `http://localhost:3000`; Vercel: `https://factory-developer-os.vercel.app` | Origin for Port `redirect_uri`. Production hard-pins the stable host when unset — never ephemeral `VERCEL_URL`. |
| `PORT_AUTH0_DOMAIN` | `auth.getport.io` | EU Auth0 |
| `PORT_API_BASE` | `https://api.getport.io` | JWT `audience` |
| `PORT_OAUTH_SCOPES` | `openid profile email offline_access` | |

### Vercel project `factory-developer-os`

Set on **Production**, **Preview**, and **Development**:

1. `PORT_FACTORY_CLIENT_ID` = `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` (plain)
2. `NEXT_PUBLIC_DEVOS_URL` = `https://factory-developer-os.vercel.app` (plain) — pin so authorize never mints deployment hosts

**Port redirect URIs:** register the stable HTTPS callback (plus localhost for local) on the Factory External Interface app. Do not rely on rotating deployment hosts (max 5 exact URIs).

- `https://factory-developer-os.vercel.app/api/auth/callback`
- `http://localhost:3000/api/auth/callback`
- `http://127.0.0.1:3000/api/auth/callback`

Session cookies after successful exchange: `factory_port_access_token` (+ optional refresh / id token). HttpOnly; no `client_secret`.

## Spec

`specs/developer-os/spec.md` and `specs/auth-port-oauth/spec.md` — updated in the same PR when Contract changes.

## Session stream (PBI-009)

Open `/session/demo` (or any session id). Client uses Rivet-native `RivetSessionClient`:
gap replay then live SSE; on blip, reconnects from last `sequence`. Memory fixture when
`RIVET_SERVE_URL` unset. **No CopilotKit. No browser→Sandbox Agent.**

## Code Atlas (STL-154)

Four overlays (Beads / Polygraph / Graft / Langfuse) as separate graphs. Only
source-proven joins are authority. Langfuse is historical — Rivet owns live
sessions. OpenMCP advertises **dotted** `atlas.*` names in `/.well-known/openmcp.json`;
Port workflow IDs use underscores (`atlas_find_node`) because Port disallows `.`.
The BFF accepts both; responses always echo the canonical dotted name.

```bash
curl -s 'http://localhost:3000/api/atlas/subgraph?overlays=beads,polygraph,graft&role=anonymous' | jq .
curl -s -X POST http://localhost:3000/api/atlas/tools \
  -H 'content-type: application/json' \
  -d '{"tool":"atlas.find_node","args":{"query":"STL-154"},"role":"operator"}' | jq .

# Repo-root smoke (prod default; zero Port mutations)
npm run smoke:atlas-bff
ATLAS_BFF_BASE=http://localhost:3000 npm run smoke:atlas-bff
npm run smoke:atlas-bff -- --dry-run
```

Operator guide (PASS criteria, naming, post-deploy verify):
[`docs/ops/atlas-bff-smoke.md`](../../docs/ops/atlas-bff-smoke.md).

BFF hardening: JSON content-type required, 64 KiB body cap, `Cache-Control: no-store`,
subgraph depth clamped, Port underscore aliases normalized.

## OpenAccess linkage smoke (PBI-010 ops kit)

Repo-root kit verifies OpenAccess / OpenMCP well-knowns stay aligned with this app’s
`CALLBACK_PATH` (`/api/auth/callback`), Factory client id env, and Observatory refuse.
Does **not** mutate Port; does **not** replace Atlas BFF smoke or human Sign-in verify.

```bash
# from repo root
npm run dry-run:openaccess-linkage
npm run dry-run:openaccess-linkage -- --memory
npm run dry-run:openaccess-linkage -- --live
```

Operator guide: [`docs/ops/openaccess-linkage-smoke.md`](../../docs/ops/openaccess-linkage-smoke.md).

## Follow-ons

- Register production/preview HTTPS callbacks on the Port Factory app when deploy URLs are stable
- Live Rivet Serve wiring when desktop Tailscale URL is stable
- Live Beads/Polygraph/Graft/Langfuse joins beyond the M4 fixture graph

