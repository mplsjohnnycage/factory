---
openprd: "0.3"
id: "0002"
title: Execute coding admits on Rivet with ProjectSupervisor fencing
status: Accepted
authors:
  - factory-meta
created: 2026-10-29
updated: 2026-10-29
repo: mplsjohnnycage/factory
tags:
  - meta
  - rivet-execution
  - factory-kernel
---

## Problem

Admits must run once with recovery fencing. Without Rivet Actors + `ProjectSupervisor`, duplicate Port `work.start` events spawn parallel coding attempts and break Meta Beads claim semantics.

## Goals

- Rivet 2.x is the execution kernel for Meta coding admits.
- `ProjectSupervisor` enforces one attempt per admit and Port-authorized recover.
- Meta Beads ready/claim gates coding start before Sandbox Agent spawn (PBI-007).

## Non-Goals

- Shipping Product Beads from this Meta unit.
- Browser-direct Sandbox Agent control.
- Multi-cluster CapacityManager / factory-edge topology in M1.

## Users

- Factory Meta operators starting coding admits.
- `ProjectSupervisor` and Rivet Compose host operators.

## Requirements

- R1 [P0] Duplicate admit for the same work yields exactly one `WorkAttempt`.
- R2 [P0] Coding start requires Meta Beads ready (`ReadyTaskEvent.beadId`) or an audited Port `executionContract` human bypass.
- R3 [P0] Claim (`bd update --claim`) happens before the Rivet queue message that starts Sandbox Agent.
- R4 [P1] Compose + Tailscale Serve health recovers after restart per `specs/rivet-execution`.
- R5 [P2] OpenWorkflow production index beyond admit/verify stubs remains post-M1.

## UX Notes

Live progress streams from Rivet Actor native realtime into Developer OS; reconnect resumes from last `sequence`. No CopilotKit/AG-UI in the kernel path (ADR-011).

## Tech Stack

Rivet 2.x Compose, Tailscale Serve, TypeScript `apps/project-supervisor`, Meta Beads (`.beads/`, prefix `factory-`). Specs: `rivet-execution`, `factory-kernel`. Must not depend on Product Beads instance.

## Monetization

_None._ Internal Factory Meta execution kernel — not a billed SKU.

## Success Metrics

- Duplicate `work.start` → one attempt (Contract evidence).
- Meta Beads ready/claim path documented and enforced in supervisor.
- Rivet healthcheck green after Compose restart.

## Risks & Open Questions

- Beads/Linear hybrid admit drift until operators trust Meta Beads — Linear remains human visibility only for Meta coding admit after PBI-007.
- Rivet host ops (Tailscale Serve) are environment-dependent — document in `docs/rivet-tailscale-serve.md`.
