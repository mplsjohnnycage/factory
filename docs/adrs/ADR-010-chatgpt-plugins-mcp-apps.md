# ADR-010: ChatGPT Plugins as MCP Apps reference pattern

**Status:** Accepted

**Date:** 2026-10-28

**Deciders:** Johnny Cage / Factory Meta

## Context

Developer OS needs an integrations dock (Vercel, Convex, Docker, Port, Turso, GitHub, …). MCP Apps (sandboxed UI resources) and Port iframes/plugins are distinct from AG-UI. ChatGPT’s Plugins packaging (skills + MCP + optional UI) is the clearest reference for how Factory should shape MCP Apps without equating them to AG-UI or to vendor-specific “apps” that do not exist (e.g. Linear’s official MCP is tools-only).

## Decision

We will use **ChatGPT Plugins** (skills + MCP + optional UI) as the **reference pattern** for Factory **MCP Apps**. MCP Apps are Agent↔Tools/UI packaging; they are complementary to — not identical to — AG-UI (Agent↔User). Factory may ship custom MCP App widgets (e.g. Linear board) when vendors lack Apps.

## Consequences

**Positive:**
- Clear packaging mental model for the integrations dock
- Avoids conflating MCP Apps with CopilotKit/AG-UI kernel streaming
- Allows Factory-owned Apps where vendors are tools-only

**Negative:**
- Host CSP/CORS and Apps capability vary; fallbacks to tools-only required
- Pattern ≠ turnkey SDK for every integration

**Neutral:**
- Port iframe/plugins remain an alternate Integrations UI path when appropriate
- ADR-011 keeps CopilotKit/AG-UI deferred for kernel streaming

## Alternatives Considered

### Treat AG-UI as identical to MCP Apps

Rejected — different protocols/roles (Agent↔User vs Agent↔Tools); master §4.5 / ADR-011.

### Wait for every vendor to ship official MCP Apps

Rejected — blocks dock; Factory custom Apps (e.g. §16 Linear widget) are allowed design.

### Port-only widgets with no MCP Apps pattern

Rejected — loses sandboxed multi-host Apps packaging reference Johnny locked.
