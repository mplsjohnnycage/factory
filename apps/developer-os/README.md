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

## Follow-ons

- PBI-009: Rivet native realtime session stream (reconnect from last `sequence`)
- Live Port token exchange when secrets authorized
