# developer-os

> **Status:** Stub authored — PBI-001 / STL-162 (Meta). Stub authorship only — not M1 implement DoD (§13.5).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

External Developer OS for humans — intent, approvals UI, live progress, and code atlas. Display channel only for privileged work; Port owns mutations (ADR-011).

### Architecture

- **Shell:** Next.js App Router (RSC default + Client Components + Route Handlers for Port OAuth callback / BFF).
- **Host:** Vercel preview/production (`*.vercel.app`).
- **Streaming (kernel):** Rivet Actor native realtime into `AgentSession` event sequence — not CopilotKit.
- **Integrations UI:** MCP Apps (sandboxed iframes) or Port iframe/plugins for Vercel, Convex, Docker, Port, Turso, GitHub; frosted dock under Code Atlas hero.
- **Deferred:** AG-UI (Agent↔User) and CopilotKit — optional later; not kernel streaming dependencies.
- Visual: frosted-glass; full-bleed code-atlas hero (Polygraph + Beads + Trailcode).
- LogicSRC map: OpenStack Interfaces/Web + Hosting/Vercel; OpenProfile operator link (M1 Required via PBI-003).

### Constraints

- UI / deferred AG-UI / CopilotKit are display channels; privileged mutations via Port actions only.
- Vercel MCP OAuth helpers do not replace Port External Interface person OAuth.
- OAuth client id is the dedicated Factory External Interface app (ADR-005 live).
- Browser does not call Sandbox Agent control APIs.
- Clerk is absent; Harness Observatory OAuth client is not configured for Developer OS.

## Contract

### Definition of Done

- Next.js app deploys on Vercel; atlas hero is first viewport.
- Rivet native stream reconnects from last `sequence`.
- Port sign-in wiring ready for live Factory client id.

### Regression Guardrails

- Browser does not call Sandbox Agent control APIs.
- Clerk is absent.
- Observatory client id configured as Factory auth fails Contract review.

### Scenarios

```gherkin
Scenario: Preview deploy serves shell
  Given Developer OS is deployed to a Vercel preview URL
  When an operator opens the preview
  Then the Code Atlas hero is the first viewport composition
  And privileged mutations are not available without Port auth

Scenario: Session events survive browser disconnect
  Given an AgentSession streaming via Rivet native realtime
  When the browser disconnects and reconnects
  Then the client resubscribes from the last sequence
  And no CopilotKit runtime is required for kernel stream
```
