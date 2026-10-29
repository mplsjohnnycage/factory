# PBI-009 / STL-170 — Rivet native realtime in Developer OS

Mirror of Linear [STL-170](https://linear.app/johnny-cage/issue/STL-170).

## Delivered in this PR

| Artifact | Path |
|----------|------|
| RivetSessionClient | `apps/developer-os/src/lib/rivet/session-client.ts` |
| Memory transport (CI) | `src/lib/rivet/memory-transport.ts` |
| HTTP/SSE transport | `src/lib/rivet/http-transport.ts` |
| BFF events + stream | `src/app/api/rivet/sessions/[sessionId]/` |
| Session view UI | `src/app/session/[sessionId]/` + `SessionStream` |
| Reconnect tests | `test/rivet-reconnect.test.ts` |
| Specs | `specs/developer-os/spec.md`, `specs/rivet-execution/spec.md` |

## Verification

- `cd apps/developer-os && npm ci && npm run typecheck && npm test && npm run build`
- AC: reconnect from last sequence without duplicates; no CopilotKit; no browser→SA
