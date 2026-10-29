# developer-os

> **Status:** PBI-008 Next.js shell + atlas hero + Port OAuth Route Handler stub (Meta). Stub authorship (PBI-001) remains the Blueprint base.
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

External Developer OS for humans — intent, approvals UI, live progress, and code atlas. Display channel only for privileged work; Port owns mutations (ADR-011).

### Architecture

- **Shell:** Next.js App Router under `apps/developer-os/` (RSC default + Client Components + Route Handlers for Port OAuth callback / BFF).
- **Host:** Vercel preview/production (`*.vercel.app`); monorepo root directory `apps/developer-os`.
- **First viewport (PBI-008):** full-bleed Code Atlas hero composition — brand **Factory**, headline Developer OS, one CTA (Port sign-in).
- **Streaming (kernel):** Rivet Actor native realtime into `AgentSession` event sequence — not CopilotKit (PBI-009).
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
- Rivet native stream reconnects from last `sequence` (PBI-009).
- Port sign-in Route Handler targets the intended Factory client redirects and does not reuse Observatory or Clerk.

### Regression Guardrails

- Browser does not call Sandbox Agent control APIs.
- Clerk is absent.
- Observatory client id configured as Factory auth fails Contract review.
- No CopilotKit / AG-UI on the kernel streaming path.

### Scenarios

```gherkin
Scenario: Preview deploy serves shell
  Given Developer OS is built for a Vercel preview
  When an operator opens the shell
  Then the Code Atlas hero is the first viewport composition
  And privileged mutations are not available without Port auth

Scenario: PBI-008 OAuth Route Handler stub compiles
  Given PORT_FACTORY_CLIENT_ID names the Factory External Interface app
  When GET /api/auth/port/login and GET /api/auth/port/callback are typechecked and built
  Then the handlers compile
  And configuring PORT_OBSERVATORY_CLIENT_ID is refused

Scenario: Session events survive browser disconnect
  Given an AgentSession streaming via Rivet native realtime
  When the browser disconnects and reconnects
  Then the client resubscribes from the last sequence
  And no CopilotKit runtime is required for kernel stream
```
