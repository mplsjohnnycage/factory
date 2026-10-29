# ADR-011: Developer OS Next.js + Rivet-native realtime

**Status:** Accepted

**Date:** 2026-10-28

**Deciders:** Johnny Cage / Factory Meta

## Context

ADR-007 assumed CopilotKit + AG-UI in the Developer OS kernel and a first-party Rivet↔AG-UI product path. Evidence (frontend-stack feed, stack audit §§19–22) shows no verifiable first-party Rivet↔AG-UI integration; AG-UI is complementary to MCP, not a substitute for Rivet Actor realtime. M1 needs a shippable shell and session stream without betting the kernel on an unverifiable bridge.

## Decision

We will build the Developer OS **shell** as **Next.js App Router** on **Vercel**. Kernel **streaming** = **Rivet Actor native realtime** into `AgentSession` event sequences (reconnect from last `sequence`). **CopilotKit / AG-UI are deferred** (optional later display path per master §11). Any future Rivet↔AG-UI adapter is **Factory design**, not a claimed vendor product. Privileged mutations stay Port actions; browser never calls Sandbox Agent.

## Consequences

**Positive:**
- Kernel stream matches Rivet ownership (ADR-002/006)
- Next/Vercel path remains deployable for PBI-008/009
- Defers generative UI complexity past M1 shell

**Negative:**
- Less turnkey generative UI until optional AG-UI path lands
- Team must wire Rivet-native client + Tailscale Serve topology (§13.4)
- Historical ADR-007 readers must follow supersession link

**Neutral:**
- MCP Apps integrations dock still follows ADR-010
- OAuth client for Dev OS is dedicated Factory app (ADR-005 live)

## Alternatives Considered

### Keep ADR-007 (CopilotKit/AG-UI in kernel)

Rejected — unverifiable Rivet↔AG-UI dependency; conflates protocols; slows M1.

### Raw Sandbox Agent SSE to the browser

Rejected — browser must not own harness control (ADR-006).

### Non-Next shell (SPA-only, or different host)

Rejected for M1 — App Router + Route Handlers fit Port OAuth callback/BFF and Vercel previews already locked in Specs.
