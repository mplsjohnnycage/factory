# ADR-002: Rivet is the execution kernel

**Status:** Accepted

**Date:** 2026-10-28

**Deciders:** Johnny Cage / Factory Meta

## Context

Factory must admit coding work durably: single admission owner, ordered attempts, recovery after worker/sandbox death, and idempotent side effects. Port workflows authorize and project state but are not a durable actor runtime. Polling Port from the executor would couple runtime to catalog latency and invite dual-write races. Research and stack audits converge on Rivet Actors + queues with a `ProjectSupervisor` pattern.

## Decision

We will use **Rivet** as the Factory execution kernel: a `ProjectSupervisor` owns a single admission queue; per-actor ordered queues and single-writer semantics govern attempts; side effects are idempotent. **Rivet never polls Port.** Port receives projections of runs/attempts only through the gated gateway writer (§4.2.1).

## Consequences

**Positive:**
- Durable admit and session recovery independent of Port polling
- Clear fencing: execution state in Rivet; catalog projections fenced
- Fits Sandbox Agent orchestration (ADR-006) and native realtime (ADR-011)

**Negative:**
- Ops surface includes Rivet Compose + Tailscale Serve for M1 topology
- Team must learn Actor/queue semantics; mis-modeled actors cause hard bugs
- CapacityManager / multi-cluster remain post-M1 — single-operator desktop bound for M1

**Neutral:**
- Meta Beads owns readiness/claim from PBI-007; until then Linear is admit SoT (OQ-1 hybrid)
- Exact actor set for M1 is Spec-owned (`ProjectSupervisor`, `WorkAttempt`, `AgentSession`, `SandboxLease`)

## Alternatives Considered

### Port workflows as the executor

Rejected — Port is governance SoT, not a durable single-writer runtime for sandbox sessions and attempt recovery.

### Temporal (or similar) as kernel

Rejected for M1 — extra platform without Rivet’s Sandbox Agent orchestration docs and Actor-native path already chosen for Factory.

### Cloudflare Durable Objects alone

Rejected as sole kernel — does not replace Rivet’s documented Sandbox Agent + supervisor model for this stack; may appear later only behind a new ADR.
