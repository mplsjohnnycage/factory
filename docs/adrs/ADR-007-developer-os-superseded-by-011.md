# ADR-007: Developer OS with CopilotKit and AG-UI in the kernel

- **Status:** Superseded by [ADR-011](./ADR-011-developer-os-next-rivet-native.md)
- **Date:** 2026-10-29
- **Deciders:** Johnny Cage / Factory Meta

## Context

An earlier Factory Meta draft treated Developer OS as Next.js on Vercel with **CopilotKit and AG-UI inside the kernel**, plus a first-party Rivet-to-AG-UI adapter. Later stack evidence showed that a first-party Rivet-to-AG-UI integration is **unverifiable** as a vendor product, that MCP Apps are not AG-UI, and that kernel streaming should be Rivet Actor native realtime. This record keeps that prior decision so the history is readable. It is not in effect.

## Decision

~~We will build Developer OS as Next.js on Vercel with CopilotKit and AG-UI in the kernel and a Factory Rivet-to-AG-UI adapter.~~

**This decision is superseded by ADR-011.** The replacement is Next.js App Router on Vercel, Rivet-native realtime for kernel streaming, and CopilotKit / AG-UI deferred to an optional later display path.

## Consequences

**Positive:** The historical intent was a familiar Next.js and Vercel deploy path, and a fast route to generative UI if AG-UI had been a real kernel dependency.

**Negative:** The draft treated an unverifiable Rivet-to-AG-UI bridge as a kernel dependency. It conflated MCP Apps (Agent-to-Tools UI) with AG-UI (Agent-to-User). It put CopilotKit on the hot path before the M1 shell and native stream existed. That is why this body is superseded.

**Neutral:** The Next.js and Vercel shell choice continues in ADR-011. An optional later AG-UI adapter remains Factory design (master §11), not a vendor product.

**Reconsider when:** Do not revive this body. A later AG-UI display path is an addition under ADR-011 and master §11, not an edit of ADR-007.

## Alternatives Considered

- **Keep CopilotKit and AG-UI in the kernel anyway.** Rejected. See ADR-011. Kernel streaming must not depend on an unverifiable bridge.
- **Replace the entire Developer OS stack.** Rejected. The shell (Next.js on Vercel) remains sound. Kernel streaming and the deferred AG-UI path are what changed.
