# ADR-006: Sandbox Agent is the coding harness

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Johnny Cage / Factory Meta

## Context

Coding agents need isolated execution, session identity, streaming, and recovery after sandbox death. A “Rivet built-in” chat surface is not the harness. Browser-driven agents would bypass Port authorization and supervisor fencing. M1 uses a Rivet-orchestrated Sandbox Agent: an HTTP server and SDK inside the sandbox, with Docker as the isolation provider. The Rivet Actor owns session lifecycle. The browser never calls the control API.

## Decision

We will use Rivet-orchestrated **Sandbox Agent** as the coding harness. Isolation is the **Docker** provider. Control is the **in-sandbox HTTP SDK**, called from Rivet or backend actors. This is **not** “Rivet built-in.” The browser never calls Sandbox Agent control APIs. M1’s first harness inside that sandbox is Claude Code (sandbox-harness Spec).

## Consequences

**Positive:** Isolation and session persistence match the Rivet Actor model. The supervisor can recover session identity after sandbox death. The browser-to-Sandbox-Agent control path stays banned.

**Negative:** M1 needs Docker on the operator machine. Sandbox Agent SDK or schema drift is an operational risk. This is not a multi-cluster `CapacityManager` design.

**Neutral:** Model tooling inside the sandbox is a harness concern. Port remains governance. Product Beads and product coding lanes are outside Meta PBI write sets.

**Reconsider when:** A successor ADR names a different harness or isolation provider. Pointing the browser at the Sandbox Agent control API is not that successor.

**Ops readiness:** Morning dry-run kit — `docs/ops/sandbox-harness-readiness.md` · `npm run dry-run:sandbox-harness` (Memory path only; Compose/Serve is a separate Rivet kit).

## Alternatives Considered

- **Browser-hosted agent control.** Rejected. It violates authorization and the orchestration architecture. Specs ban it.
- **Bare Docker without Sandbox Agent.** Rejected. It drops Rivet session-actor integration and the documented Sandbox Agent orchestration path.
- **E2B, or a similar sandbox, without a Rivet session actor.** Rejected as the sole M1 harness. A later option needs its own ADR.
