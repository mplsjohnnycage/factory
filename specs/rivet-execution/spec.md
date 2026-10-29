# rivet-execution

> **Status:** Stub authored — PBI-001 / STL-162 (Meta). Stub authorship only — not M1 implement DoD (§13.5).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Rivet 2.x is the Factory execution kernel (ADR-002): actors, queues, and workflows for durable coding admits. Desktop Compose + Tailscale Serve for local/dev health. Port catalog write fencing is owned by port-governance §4.2.1 — not this Spec.

### Architecture

- Execution fencing = single `ProjectSupervisor` admission queue.
- Per-actor ordered queues; single-writer semantics for attempt lifecycle.
- Port projection upserts from Rivet go through the Port catalog writer (§4.2.1), never raw dual-write.
- LogicSRC map (authorship): OpenInstall for non-Compose boxes; OpenFleet ledger alongside Rivet Inspector. M1 Required rows for this Spec beyond vertical-slice Contracts: none (OpenInstall/OpenFleet production = post-M1).

### Constraints

- Side-effect handlers are idempotent.
- Actions are parallel by default → use queues for mutations.
- Rivet never polls Port.
- Port catalog write fencing is not this Spec’s ownership.

## Contract

### Definition of Done

- Ordered admit through `ProjectSupervisor`.
- Webhook signature verified at gateway before enqueue.
- Rivet never polls Port.
- Health recovers after Compose restart.

### Regression Guardrails

- No raw Port catalog writes from Rivet actors.
- Duplicate admits do not create parallel attempts for the same work unit.

### Scenarios

```gherkin
Scenario: Health after Compose restart
  Given Rivet Compose was healthy
  When Compose is restarted
  Then health endpoints recover
  And ProjectSupervisor resumes ordered admit without polling Port

Scenario: Webhook path never polls Port
  Given a Port webhook arrives at the Factory gateway
  When signature verification succeeds
  Then ProjectSupervisor is enqueued
  And Rivet does not poll Port for work
```
