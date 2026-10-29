# ADR-009: ISO/IEC/IEEE 12207 maps into Specs + ASDLC

**Status:** Accepted

**Date:** 2026-10-28

**Deciders:** Johnny Cage / Factory Meta

## Context

Factory Meta aims at disciplined lifecycle coverage (ASDLC Level 2 habit) without inventing a parallel process taxonomy. ISO/IEC/IEEE 12207:2026 process groups need an owner Spec so gates, PBIs, and domain Specs do not each invent conflicting mappings.

## Decision

We will map **ISO/IEC/IEEE 12207:2026** process groups into Factory **Specs** and **ASDLC phases**. The **`asdlc-lifecycle` Spec** owns that mapping. Domain Specs and PBIs reference lifecycle norms; they do not fork the map.

## Consequences

**Positive:**
- Single lifecycle vocabulary across Meta work
- Context Gates / Workflow-as-Code attach to a known process home
- Supports stub→review→assemble ratchet without process sprawl

**Negative:**
- Mapping authorship is ongoing Spec work, not a one-line claim
- Over-literal ISO compliance theater could slow M1 if misused as exit criteria

**Neutral:**
- ASDLC nine phases remain the day-to-day agent frame; ISO is the external map
- Product lanes may later mirror the same Spec home — Meta does not seed Product Beads here

## Alternatives Considered

### Ignore ISO; ASDLC-only informal process

Rejected — loses external lifecycle anchor Johnny locked for Factory Meta.

### Each domain Spec invents its own 12207 map

Rejected — fragmentation; `asdlc-lifecycle` owns the map.

### Full ISO certification program as M1 exit

Rejected — mapping + habit first; certification is out of M1 scope.
