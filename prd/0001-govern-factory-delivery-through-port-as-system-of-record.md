---
openprd: "0.3"
id: "0001"
title: Govern Factory delivery through Port as system of record
status: Accepted
authors:
  - factory-meta
created: 2026-10-29
updated: 2026-10-29
repo: mplsjohnnycage/factory
tags:
  - meta
  - port-governance
  - factory-kernel
---

## Problem

Factory Meta needs a single catalog SoT for blueprints, RBAC, workflows-as-tools, and audited admit. Without Port as SoT, Rivet and sandboxes invent parallel state and dual-writes break accept.

## Goals

- Port owns catalog identity and privileged mutations for Meta delivery.
- Thin gateway is the only Port catalog writer (§4.2.1) with `catalogVersion` fencing.
- Operators and agents discover live workflow tool names from Port, not hard-coded invent.

## Non-Goals

- Product-lane Port catalogs or Product Beads.
- Creating, deleting, or revoking Port External Interface OAuth apps from this repo (ADR-005 live; ask before mutations).
- Replacing Port with Linear or Beads as catalog SoT.

## Users

- Factory Meta operators and coding agents admitting kernel work.
- `factory-gateway` and `ProjectSupervisor` services that consume Port webhooks and catalog.

## Requirements

- R1 [P0] Port remains the system of record for Meta catalog entities used by admit and accept.
- R2 [P0] All Port catalog writes for Factory Meta go through the §4.2.1 single-writer path and refuse stale `catalogVersion`.
- R3 [P0] Rivet never polls Port; admit starts only from verified Port webhook / authorized contract.
- R4 [P1] Live Port workflow tool names are bound by name; agents do not invent tool identifiers.
- R5 [P2] Context Lake sync integrations remain Port-owned; Developer OS does not dual-write catalog.

## UX Notes

Operator intent and approvals surface through Port actions / Developer OS Port widgets; privileged mutations never originate from the browser calling Sandbox Agent APIs.

## Tech Stack

Port (catalog + workflows-as-MCP-tools), thin TypeScript `apps/factory-gateway`, Specs under `specs/port-governance/` and `specs/factory-kernel/`. Must not depend on Clerk or Harness Observatory as Factory OAuth client.

## Monetization

_None._ Internal Factory Meta kernel capability — not a billed SKU.

## Success Metrics

- Zero dual-write Port catalog writers outside the gateway fence in Meta CI/local gate.
- Stale catalog write attempts are rejected (chaos / unit evidence on gateway).
- ADR-001 / `specs/port-governance` Contract scenarios remain green.

## Risks & Open Questions

- Live Port blueprint/tool names drift from Spec bindings — mitigate by binding only live names and refusing invent.
- Accidental Port OAuth create/delete from Meta automation — hard rule: ask before External Interface mutations.
