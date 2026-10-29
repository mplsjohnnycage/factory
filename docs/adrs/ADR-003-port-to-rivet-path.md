# ADR-003: Port to Rivet control path

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Johnny Cage / Factory Meta

## Context

Authorization, human self-service, and agent MCP calls originate on Port. Durable coding must land in Rivet and then GitHub. Rivet must not poll Port, and browsers must not call Sandbox Agent. The path has to stay thin: no second orchestration bus, and no catalog dual-write from the supervisor.

## Decision

We will use this control path: **Port MCP or self-service, then Port workflow, then webhook, then thin `factory-gateway`, then Rivet `ProjectSupervisor`, then Sandbox Agent, then GitHub.** The Port catalog holds **projections** of delivery and execution state, written only through §4.2.1 fencing. Rivet remains the durable admit owner (ADR-002).

## Consequences

**Positive:** Authorization happens before side effects. The gateway is the only catalog writer for Factory run projections. The path matches the ban on calling Sandbox Agent from the browser.

**Negative:** The webhook and gateway hop add failure modes, so handlers must be idempotent. A bad webhook can stall admits while Rivet itself is healthy. Debugging spans Port audit, gateway logs, and Rivet Inspector.

**Neutral:** GitHub is the evidence and CI accept surface (ADR-008), not the admit owner. Linear tracks the PBI facet of the same unit. It is not on the hot admit path.

**Reconsider when:** A successor ADR changes the hop order. Rivet polling Port, or a browser calling Sandbox Agent, is not a valid shortcut.

## Alternatives Considered

- **Rivet polls Port for work.** Rejected. That couples runtime to catalog availability, violates ADR-002, and invites stale admits.
- **Browser or Developer OS calls Sandbox Agent directly.** Rejected. That breaks isolation and authorization. Specs and the harness ban it.
- **A fat gateway that owns orchestration.** Rejected. The gateway stays a thin relay plus the §4.2.1 writer. Supervisor semantics stay in Rivet.
