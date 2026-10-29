# ADR-011: Developer OS on Next.js with Rivet-native realtime

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Johnny Cage / Factory Meta

## Context

ADR-007 put CopilotKit and AG-UI in the Developer OS kernel and assumed a first-party Rivet-to-AG-UI product. The frontend-stack feed and stack audit §§19–22 show no verifiable first-party Rivet-to-AG-UI integration. AG-UI is complementary to MCP. It is not a substitute for Rivet Actor realtime. M1 needs a shippable shell and a session stream that do not depend on that bridge. This ADR supersedes ADR-007.

## Decision

We will build the Developer OS **shell** as **Next.js App Router** on **Vercel**. Kernel **streaming** is **Rivet Actor native realtime** into `AgentSession` event sequences, with reconnect from the last `sequence`. **CopilotKit and AG-UI are deferred** (optional later display path, master §11). Any future Rivet-to-AG-UI adapter is **Factory design**, not a vendor product. Privileged mutations stay Port actions. The browser never calls Sandbox Agent.

## Consequences

**Positive:** The kernel stream matches Rivet ownership (ADR-002 and ADR-006). Next.js on Vercel stays deployable for PBI-008 and PBI-009. Generative UI stays off the M1 critical path.

**Negative:** There is less turnkey generative UI until the optional AG-UI path lands. The team wires a Rivet-native client through the Tailscale Serve topology (master §13.4). Readers of ADR-007 must follow the supersession link.

**Neutral:** The MCP Apps integrations dock still follows ADR-010. Developer OS sign-in uses the dedicated Factory External Interface app (ADR-005, live). Clerk is absent.

**Reconsider when:** A successor ADR replaces the shell or the kernel stream. Putting CopilotKit or AG-UI back on the kernel path, or streaming Sandbox Agent control events to the browser, requires that new ADR. It does not edit ADR-007 or this body.

## Alternatives Considered

- **Keep ADR-007 (CopilotKit and AG-UI in the kernel).** Rejected. The Rivet-to-AG-UI dependency is unverifiable, the protocols are different, and it slows M1 (master alternatives table).
- **Raw Sandbox Agent server-sent events to the browser.** Rejected. The browser must not own harness control (ADR-006).
- **A non-Next shell, or a host other than Vercel, for M1.** Rejected. App Router and Route Handlers fit the Port OAuth callback and BFF, and Vercel previews are already locked in the developer-os Spec.
