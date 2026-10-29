# ADR-001: Port is the system of record

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Johnny Cage / Factory Meta

## Context

Factory needs one governance surface for catalog entities, RBAC, workflows-as-tools, the MCP gateway, audit, the agent and skill registry, and Context Lake. Humans and agents must share that authorization path. A parallel source of truth — Clerk, a custom identity provider, Rivet-as-catalog, or a product-board dual-write — would split audit and break the §4.2.1 catalog write fence. Port already owns catalog, External Interface OAuth, and MCP. Factory Meta binds to that product rather than re-implementing governance.

## Decision

We will use **Port** as the sole system of record for Factory catalog, RBAC, workflows, MCP gateway, audit, agent/skill registry, and Context Lake. **Clerk is out of scope.** Privileged catalog mutations enter only through the §4.2.1 single-writer path in `factory-gateway`. Agent “done” never equals Port accept.

## Consequences

**Positive:** One authorization and audit plane for humans and agents. Catalog composables and workflows stay machine-queryable. Ownership stays split: Port is source of truth, Rivet is execution, git is source, Linear is the PBI facet.

**Negative:** Factory inherits Port product limits, including External Interface app count on the current plan. Port has no native compare-and-swap, so §4.2.1 fencing and `catalogVersion` discipline are Factory-owned. A Port outage blocks governance mutations even when Rivet runs continue.

**Neutral:** Developer OS and Cockpit are display and intent clients of the same Port MCP surface. They are not a second control plane. The live OAuth client is recorded in ADR-005.

**Reconsider when:** Port can no longer hold catalog, RBAC, and workflows on one surface, or a successor ADR moves the source of truth without dual-writing around §4.2.1.

## Alternatives Considered

- **Clerk as primary identity provider or source of truth.** Rejected. It would fork identity from Port RBAC and catalog, so agents and humans would not share one Port surface. Master §3 locks Clerk out of scope.
- **Rivet or Beads as catalog source of truth.** Rejected. Rivet is the execution kernel (ADR-002). Beads is the readiness and claim graph. Neither owns RBAC, workflows-as-tools, or Context Lake. Dual-writing catalog outside §4.2.1 is banned.
- **A custom governance service.** Rejected. It would duplicate Port and delay the M1 vertical slice.
