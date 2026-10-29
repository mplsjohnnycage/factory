# ADR-009: ISO/IEC/IEEE 12207 maps into Specs and ASDLC

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Johnny Cage / Factory Meta

## Context

Factory Meta targets an ASDLC Level 2 habit without inventing a second process taxonomy. ISO/IEC/IEEE 12207:2026 process groups need one owner Spec. Otherwise gates, PBIs, and domain Specs each invent a conflicting map. ASDLC’s nine phases stay the day-to-day agent frame. The ISO groups are the external map into that frame.

## Decision

We will map **ISO/IEC/IEEE 12207:2026** process groups into Factory **Specs** and **ASDLC phases**. The **`asdlc-lifecycle` Spec** owns that mapping. Domain Specs and PBIs reference the lifecycle norms. They do not fork the map.

## Consequences

**Positive:** One lifecycle vocabulary across Meta work. Context Gates and workflow-as-code attach to a known process home. The stub, review, and assemble ratchet does not grow a private process per domain.

**Negative:** The mapping is ongoing Spec work, not a one-line claim of compliance. Treating ISO certification theater as an M1 exit criterion would slow the vertical slice.

**Neutral:** ASDLC phases remain how agents move work. ISO is the external map those phases satisfy. Product lanes may later mirror the same Spec home. This Meta record does not seed Product Beads.

**Reconsider when:** A successor ADR moves ownership of the 12207 map off `asdlc-lifecycle`, or drops the ISO anchor entirely.

## Alternatives Considered

- **Ignore ISO and keep an informal ASDLC-only process.** Rejected. Factory Meta locked an external lifecycle anchor (master §3).
- **Let each domain Spec invent its own 12207 map.** Rejected. That fragments the vocabulary. `asdlc-lifecycle` owns the map.
- **Make a full ISO certification program the M1 exit.** Rejected. The M1 commitment is the mapping and the ratchet habit, not a certification program.
