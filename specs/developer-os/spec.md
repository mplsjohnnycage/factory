# developer-os

> **Status:** PBI-008 shell + PBI-009 Rivet native session stream (Meta). Stub authorship (PBI-001) remains the Blueprint base.
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

External Developer OS for humans — intent, approvals UI, live progress, and code atlas. Display channel only for privileged work; Port owns mutations (ADR-011).

### Architecture

- **Shell:** Next.js App Router under `apps/developer-os/` (RSC default + Client Components + Route Handlers for Port OAuth callback / BFF).
- **Host:** Vercel preview/production (`*.vercel.app`); monorepo root directory `apps/developer-os`.
- **First viewport (PBI-008):** full-bleed Code Atlas hero composition — brand **Factory**, headline Developer OS, one CTA (Port sign-in).
- **Streaming (kernel, PBI-009):** Rivet Actor native realtime client (`RivetSessionClient`) into `AgentSession` event sequence — reconnect from last `sequence` via gap replay + live subscribe. BFF routes `/api/rivet/sessions/[sessionId]/events|stream`. **Not** CopilotKit.
- **Integrations UI:** MCP Apps (sandboxed iframes) or Port iframe/plugins for Vercel, Convex, Docker, Port, Turso, GitHub; frosted dock under Code Atlas hero (post-shell).
- **Deferred:** AG-UI (Agent↔User) and CopilotKit — optional later; not kernel streaming dependencies.
- Visual: frosted-glass atmosphere; full-bleed code-atlas hero plane.
- LogicSRC map: OpenStack Interfaces/Web + Hosting/Vercel; OpenProfile operator link (M1 Required via PBI-003).

### Constraints

- UI / deferred AG-UI / CopilotKit are display channels; privileged mutations via Port actions only.
- Vercel MCP OAuth helpers do not replace Port External Interface person OAuth.
- Sign-in target is the dedicated Factory External Interface app (ADR-005 Accepted — live). Developer OS does not create, delete, or revoke that app.
- Browser does not call Sandbox Agent control APIs.
- Clerk is absent; Harness Observatory OAuth client is not configured for Developer OS (`PORT_OBSERVATORY_CLIENT_ID` refused).

## Contract

### Definition of Done

- Next.js app builds; atlas hero is first viewport.
- Port OAuth login + callback Route Handlers compile; Factory client id via `PORT_FACTORY_CLIENT_ID` only.
- Callback path is `/api/auth/callback` (exact match to Port + OpenAccess redirect_uris).
- Callback performs Authorization Code + PKCE token exchange (no stub; no `client_secret`).
- Rivet native stream reconnects from last `sequence` (gap replay + live; no duplicates).
- Port sign-in Route Handler targets the intended Factory client redirects and does not reuse Observatory or Clerk.

### Regression Guardrails

- Browser does not call Sandbox Agent control APIs.
- Clerk is absent.
- Observatory client id configured as Factory auth fails Contract review.
- No CopilotKit / AG-UI on the kernel streaming path.
- OAuth callback must not remain at `/api/auth/port/callback` (redirect_uri drift).

### Scenarios

```gherkin
Scenario: Preview deploy serves shell
  Given Developer OS is built for a Vercel preview
  When an operator opens the shell
  Then the Code Atlas hero is the first viewport composition
  And privileged mutations are not available without Port auth

Scenario: Port OAuth PKCE login and callback
  Given PORT_FACTORY_CLIENT_ID names the Factory External Interface app
  When GET /api/auth/port/login and GET /api/auth/callback are typechecked and built
  Then the handlers compile
  And authorize uses Auth0 PKCE (S256) with audience set to the Port API base
  And callback exchanges code + code_verifier at Auth0 /oauth/token without client_secret
  And configuring PORT_OBSERVATORY_CLIENT_ID is refused

Scenario: Session events survive browser disconnect
  Given an AgentSession streaming via Rivet native realtime
  When the browser disconnects and reconnects
  Then the client resubscribes from the last sequence
  And gap events are applied without duplicates
  And no CopilotKit runtime is required for kernel stream

Scenario: PBI-009 reconnect fixture
  Given MemoryActorTransport seeded with sequences 0..2
  When RivetSessionClient connects then drops live then receives 3..5 then reconnects
  Then lastSequence is 5
  And seen sequences are exactly 0..5
```
