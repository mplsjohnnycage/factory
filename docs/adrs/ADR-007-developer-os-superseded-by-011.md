# ADR-007: Developer OS = Next.js + CopilotKit/AG-UI in kernel (superseded)

**Status:** Superseded by [ADR-011](./ADR-011-developer-os-next-rivet-native.md)

**Date:** 2026-10-28

**Deciders:** Johnny Cage / Factory Meta

## Context

Early Factory Meta drafting assumed Developer OS would ship as Next.js on Vercel with **CopilotKit + AG-UI in the kernel** and a first-party Rivet→AG-UI adapter. Stack audits and frontend evidence later showed: Rivet↔AG-UI is **UNVERIFIABLE** as a vendor product; MCP Apps ≠ AG-UI; kernel streaming should be Rivet Actor native realtime. This ADR preserves the prior decision text for archaeology.

## Decision

~~We will build Developer OS as Next.js + Vercel with CopilotKit + AG-UI in the kernel and a Factory Rivet→AG-UI adapter.~~

**This decision is no longer in effect.** See **ADR-011** for the Accepted replacement: Next.js App Router on Vercel; Rivet-native realtime; CopilotKit/AG-UI deferred.

## Consequences

**Positive (historical intent):**
- Familiar Next/Vercel deploy path
- Generative UI / AG-UI client patterns available quickly

**Negative (why superseded):**
- Treated unverifiable Rivet↔AG-UI as kernel dependency
- Conflated MCP Apps (Agent↔Tools UI) with AG-UI (Agent↔User protocol)
- Forced CopilotKit into the hot path before M1 shell + native stream landed

**Neutral:**
- Next.js + Vercel shell choice survives in ADR-011
- Optional later AG-UI adapter remains Factory design (§11), not vendor product

## Alternatives Considered

### Keep CopilotKit/AG-UI in kernel anyway

Rejected — see ADR-011; kernel streaming must not depend on an unverifiable bridge.

### Replace entire Developer OS stack

Rejected — shell (Next/Vercel) remains sound; only kernel streaming + deferred AG-UI path changed.
