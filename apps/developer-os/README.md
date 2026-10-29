# developer-os (PBI-008 / STL-169)

Factory **Developer OS** shell: Next.js App Router on Vercel, Code Atlas hero first viewport, Port OAuth Route Handler stub (Factory External Interface client — never Observatory / Clerk / CopilotKit).

Lane: **Meta only** · browser never calls Sandbox Agent · no Port OAuth create/delete · no Product Beads.

## Layout

| Path | Role |
|------|------|
| `src/app/page.tsx` | Atlas hero shell (first viewport) |
| `src/components/AtlasHero.tsx` | Full-bleed Code Atlas composition |
| `src/app/api/auth/port/login` | Begin Port OAuth (Factory client id) |
| `src/app/api/auth/port/callback` | OAuth callback Route Handler stub |
| `src/lib/port-oauth.ts` | Config + Observatory refuse |
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

Copy `.env.example`. Set `PORT_FACTORY_CLIENT_ID` to the dedicated Factory External Interface app. **Do not** set Observatory client ids.

## Spec

`specs/developer-os/spec.md` — updated in the same PR.

## Session stream (PBI-009)

Open `/session/demo` (or any session id). Client uses Rivet-native `RivetSessionClient`:
gap replay then live SSE; on blip, reconnects from last `sequence`. Memory fixture when
`RIVET_SERVE_URL` unset. **No CopilotKit. No browser→Sandbox Agent.**

## Follow-ons

- Live Rivet Serve wiring when desktop Tailscale URL is stable
- Live Port token exchange when secrets authorized
