# ADR-006: Sandbox Agent is the coding harness

**Status:** Accepted

**Date:** 2026-10-28

**Deciders:** Johnny Cage / Factory Meta

## Context

Coding agents need isolated execution with session identity, streaming, and recovery. “Rivet built-in chat” is not the harness. Browser-driven agents bypass Port authz and supervisor fencing. Factory M1 targets Rivet-orchestrated **Sandbox Agent** with Docker isolation and in-sandbox HTTP SDK control from the backend — never from the browser.

## Decision

We will use Rivet-orchestrated **Sandbox Agent** as the coding harness, with **Docker** as the isolation provider and control via the **in-sandbox HTTP SDK** from Rivet/backend actors. This is **not** “Rivet built-in.” The browser never calls Sandbox Agent control APIs.

## Consequences

**Positive:**
- Isolation + session persistence aligned with Rivet Actor model
- Supervisor can recover identity after sandbox death
- Clear ban on browser→SA control path

**Negative:**
- Docker/host ops on the operator machine for M1
- SDK/schema drift risk as Sandbox Agent versions move
- Not a multi-cluster CapacityManager story in M1

**Neutral:**
- LLM tooling inside the sandbox is harness concern; Port remains governance
- Product Beads / product coding lanes are out of Meta PBI write sets

## Alternatives Considered

### Browser-hosted agent control

Rejected — violates authz and orchestration architecture; banned in Specs.

### Bare Docker without Sandbox Agent

Rejected — loses Rivet session actor integration and documented SA orchestration.

### E2B (or similar) without Rivet session actor

Rejected as sole M1 harness — may inform post-M1 options only under a new ADR.
