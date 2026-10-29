# ADR-003: Port→Rivet control path

**Status:** Accepted

**Date:** 2026-10-28

**Deciders:** Johnny Cage / Factory Meta

## Context

Authorization, human self-service, and agent MCP calls originate on Port. Durable coding must land in Rivet and then GitHub without making Rivet poll Port or letting browsers call Sandbox Agent. The path must stay thin: no second orchestration bus, no catalog dual-write from the supervisor.

## Decision

We will use this control path: **Port MCP / self-service → Port workflow → webhook → thin `factory-gateway` → Rivet `ProjectSupervisor` → Sandbox Agent → GitHub**. Port catalog holds **projections** of delivery/execution state, written only via §4.2.1 fencing. Rivet remains the durable admit owner (ADR-002).

## Consequences

**Positive:**
- Authz happens before side effects
- Gateway is the only catalog writer for Factory run projections
- Matches “never call Sandbox Agent from the browser”

**Negative:**
- Webhook + gateway hop adds failure modes (retry/idempotency required)
- Misconfigured webhooks can stall admits even when Rivet is healthy
- Debugging spans Port audit + gateway logs + Rivet Inspector

**Neutral:**
- GitHub is evidence + CI accept surface (ADR-008), not the admit owner
- Linear tracks the PBI facet of the same unit; it is not on the hot admit path

## Alternatives Considered

### Rivet polls Port for work

Rejected — couples runtime to catalog availability; violates ADR-002; invites stale admits.

### Browser / Developer OS calls Sandbox Agent directly

Rejected — breaks isolation and authz; banned in Specs and harness docs.

### Fat gateway that owns orchestration

Rejected — would re-implement supervisor semantics; gateway stays thin relay + §4.2.1 writer.
