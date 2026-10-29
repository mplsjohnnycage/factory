# ADR-002: Rivet is the execution kernel

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Johnny Cage / Factory Meta

## Context

Factory must admit coding work durably: one admission owner, ordered attempts, recovery after worker or sandbox death, and idempotent side effects. Port workflows authorize work and hold projections. They are not a durable actor runtime. If the executor polled Port, runtime would couple to catalog latency and invite dual-write races. The locked stack uses Rivet Actors and queues with a single `ProjectSupervisor` admission queue.

## Decision

We will use **Rivet** as the Factory execution kernel. A `ProjectSupervisor` owns a single admission queue. Per-actor ordered queues and single-writer semantics govern attempts. Side effects are idempotent. **Rivet never polls Port.** Port receives projections of runs and attempts only through the gated gateway writer (§4.2.1).

## Consequences

**Positive:** Durable admit and session recovery do not depend on Port polling. Execution state stays in Rivet. Catalog projections stay fenced. The same kernel fits Sandbox Agent orchestration (ADR-006) and native realtime (ADR-011).

**Negative:** M1 operations include Rivet Compose and Tailscale Serve. Actor and queue modeling errors are hard to unwind. `CapacityManager` and multi-cluster remain post-M1. M1 is a single-operator desktop topology.

**Neutral:** Meta Beads owns readiness and claim from PBI-007. Until then, Linear is the admit source of truth (OQ-1 hybrid). The M1 actor set is Spec-owned: `ProjectSupervisor`, `WorkAttempt`, `AgentSession`, `SandboxLease`.

**Reconsider when:** A successor ADR replaces Rivet as the durable admit runtime. Polling Port is not a valid replacement.

## Alternatives Considered

- **Port workflows as the executor.** Rejected. Port is the governance source of truth, not a durable single-writer runtime for sandbox sessions and attempt recovery.
- **Temporal, or a similar workflow engine, as the kernel.** Rejected for M1. It would add a platform without the Sandbox Agent orchestration path already locked for Factory (master alternatives table; stack audit).
- **Cloudflare Durable Objects alone.** Rejected as the sole kernel. They do not replace Rivet’s Sandbox Agent and supervisor model. A later host would need its own ADR.
