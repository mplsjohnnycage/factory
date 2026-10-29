# ADR-010: ChatGPT Plugins as the MCP Apps reference pattern

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Johnny Cage / Factory Meta

## Context

Developer OS needs an integrations dock for Vercel, Convex, Docker, Port, Turso, GitHub, and later widgets such as Linear. MCP Apps (sandboxed UI resources) and Port iframes or plugins are a different standard from AG-UI. ChatGPT’s Plugins packaging — skills, plus MCP, plus optional UI — is the reference for how Factory shapes MCP Apps. It is not a claim that every vendor ships an App. Linear’s official MCP, for example, is tools-only (master §16).

## Decision

We will use **ChatGPT Plugins** (skills plus MCP plus optional UI) as the **reference pattern** for Factory **MCP Apps**. MCP Apps package Agent-to-Tools UI. They are complementary to AG-UI (Agent-to-User). They are not the same protocol. Factory may ship a custom MCP App widget where a vendor is tools-only.

## Consequences

**Positive:** The integrations dock has one packaging model. MCP Apps stay distinct from CopilotKit and AG-UI kernel streaming (ADR-011). Factory-owned Apps are allowed when vendors do not ship Apps.

**Negative:** Host content-security policy, CORS, and Apps capability vary. Tools-only fallbacks are required. The pattern is not a turnkey SDK for every integration.

**Neutral:** Port iframe and plugin surfaces remain an alternate integrations UI when that host fits. ADR-011 keeps CopilotKit and AG-UI off the kernel stream.

**Reconsider when:** A successor ADR names a different packaging reference for MCP Apps. Equating MCP Apps with AG-UI is not that successor.

## Alternatives Considered

- **Treat AG-UI as identical to MCP Apps.** Rejected. Different roles: Agent-to-User versus Agent-to-Tools (master §4.5 and ADR-011).
- **Wait until every vendor ships an official MCP App.** Rejected. That blocks the dock. A Factory-owned App, such as the Linear board widget in master §16, is allowed design.
- **Port-only widgets with no MCP Apps pattern.** Rejected. That drops the sandboxed multi-host packaging reference locked in master §3.
