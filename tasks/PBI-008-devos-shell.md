# PBI-008 / STL-169 — Scaffold Developer OS shell on Vercel

Mirror of Linear [STL-169](https://linear.app/johnny-cage/issue/STL-169).

## Delivered in this PR

| Artifact | Path |
|----------|------|
| Next.js App Router shell | `apps/developer-os/` |
| Code Atlas hero | `src/components/AtlasHero.tsx` |
| Port OAuth login | `src/app/api/auth/port/login/route.ts` |
| Port OAuth callback stub | `src/app/api/auth/port/callback/route.ts` |
| OAuth config (Factory only) | `src/lib/port-oauth.ts` |
| CI | `.github/workflows/developer-os.yml` |
| Spec | `specs/developer-os/spec.md` |

## Verification

- `cd apps/developer-os && npm ci && npm run typecheck && npm test && npm run build`
- No Observatory / Clerk / CopilotKit; no Port OAuth create/delete; no Product Beads
