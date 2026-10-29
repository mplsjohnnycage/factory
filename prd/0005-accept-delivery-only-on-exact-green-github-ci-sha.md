---
openprd: "0.3"
id: "0005"
title: Accept delivery only on exact green GitHub CI SHA
status: Accepted
authors:
  - factory-meta
created: 2026-10-29
updated: 2026-10-29
repo: mplsjohnnycage/factory
tags:
  - meta
  - visibility-accept
  - asdlc-lifecycle
---

## Problem

Agent “done” is not Port accept. Without exact-SHA GitHub CI accept plus local refuse tooling, rewritten tips and dirty Specs can be treated as delivered.

## Goals

- Port accept requires green GitHub checks on the exact delivery SHA (PBI-011).
- One local gate command refuses dirty/invalid Specs, emits, and OpenPRD bodies (PBI-013).
- Living Specs update in the same PR as Contract changes.

## Non-Goals

- Treating Linear Done or Beads close as Port accept.
- Dipping branch protection or self-approving merges.
- Inventing partial OpenPRD conformance for out-of-inventory catalogs.

## Users

- Factory Meta coding agents and independent reviewers.
- Port governance workflows that consume CI accept evidence.

## Requirements

- R1 [P0] Accept is bound to green GitHub CI on the exact commit SHA; rewrite invalidates prior accept.
- R2 [P0] `npm run local-gate` / `bin/local-gate` refuses dirty Specs, scaffold placeholders, and invalid LogicSRC/OpenPRD artifacts.
- R3 [P0] CI runs the same local-gate refuse path (`local-gate-refuse` job).
- R4 [P1] OpenPRD collection under `prd/` validates OpenPRD 0.3 (ten sections + front-matter) when present.
- R5 [P2] Compound writeback (PBI-015) remains HITL and does not substitute for accept.

## UX Notes

Reviewers see CI checks on the PR head SHA; operators see accept status in Port — not a green badge on a moved branch tip. Author ≠ reviewer; Johnny out of review rotation for Meta PRs.

## Tech Stack

GitHub Actions, `@logicsrc/validators@0.6.0`, `@logicsrc/openprd@0.2.0`, `scripts/local-gate.mjs`. Specs: `visibility-accept`, `asdlc-lifecycle`, `logicsrc-interop`.

## Monetization

_None._ Internal Factory Meta accept / quality gate — not a billed SKU.

## Success Metrics

- Rewrite of tip clears prior accept (Contract evidence).
- Local gate + CI refuse dirty Spec / invalid OpenPRD (unit + CI green on exact SHA).
- OpenPRD 0001–0005 Accepted with valid 0.3 bodies (this PBI).

## Risks & Open Questions

- Formal GitHub APPROVE needs write-access collaborator under protection — content APPROVE alone may not merge.
- OpenPRD body validation must use `@logicsrc/openprd` (front-matter-only AJV is insufficient for ten-section conformance).
