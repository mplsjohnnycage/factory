# ADR-001: Port is the system of record

**Status:** Accepted

**Date:** 2026-10-28

**Deciders:** Johnny Cage / Factory Meta

## Context

Factory needs one governance surface for catalog entities, RBAC, workflows-as-tools, audit, agent/skill registry, MCP gateway, and Context Lake. Humans and agents must share the same authorization path. Inventing a parallel SoT (Clerk, custom IdP, Rivet-as-catalog, or product-board dual-write) would split audit and break §4.2.1 write fencing. Port already owns catalog + External Interface OAuth + MCP; Factory Meta binds to that product rather than re-implementing governance.

## Decision

We will use **Port** as the sole system of record for Factory catalog, RBAC, workflows, MCP gateway, audit, agent/skill registry, and Context Lake. **Clerk is out of scope.** Privileged catalog mutations enter only through the §4.2.1 single-writer path (factory-gateway). Agent “done” never equals Port accept.

## Consequences

**Positive:**
- One authz + audit plane for humans and agents
- Catalog composables and workflows stay machine-queryable
- Clear ownership split: Port = SoT; Rivet = execution; git = source; Linear = PBI tracking

**Negative:**
- Factory depends on Port product limits (e.g. FREEMIUM External Interface app count)
- No native CAS — §4.2.1 fencing and `catalogVersion` discipline are Factory-owned
- Port outages block governance mutations even if Rivet runs continue

**Neutral:**
- Developer OS and Cockpit are display/intent clients of Port MCP — not second control planes
- Live OAuth client wiring is recorded separately (ADR-005 / `port-factory-oauth-live.md`)

## Alternatives Considered

### Clerk as primary IdP / SoT

Rejected — would fork identity from Port RBAC and catalog; agents and humans would not share one Port surface. Master locks Clerk out of scope.

### Rivet (or Beads) as catalog SoT

Rejected — Rivet is the execution kernel (ADR-002); Beads is readiness/claim. Neither owns RBAC, workflows-as-tools, or Context Lake. Dual-writing catalog outside §4.2.1 is banned.

### Custom governance service

Rejected — duplicates Port capabilities, increases ops blast radius, and delays M1 vertical slice.
