# ADR-004: ASDLC Spec is the canonical build-against artifact

**Status:** Accepted

**Date:** 2026-10-28

**Deciders:** Johnny Cage / Factory Meta

## Context

Agents need a stable artifact to assemble against: Blueprint (Context / Architecture / Constraints) plus Contract (DoD / Guardrails / Scenarios). LogicSRC provides interoperability emissions (OpenStack, OpenAccess, well-knowns, validators) but is not a substitute for living domain Specs. Prompt-only or OpenPRD-only drives produce unreviewable drift.

## Decision

We will treat **ASDLC Spec** files at `/specs/{domain}/spec.md` as the **canonical agent build-against artifact**. **LogicSRC is interoperability emission, not primary IR.** PBIs are typed-contract deltas that point at Specs; they are not the Spec. Living Specs update in the same PR as Contract changes (default refinement).

## Consequences

**Positive:**
- One anatomy for humans and agents across domains
- Gherkin scenarios become verifiable Contract checks
- LogicSRC stays scoped to Required M1 emit cuts

**Negative:**
- Spec authorship cost before Feature Assembly
- Incomplete stubs must not be treated as implement DoD (PBI-001 stub rule)
- Agents can still ignore Specs if harness gates are missing — local gate / CI (PBI-013) must enforce

**Neutral:**
- `AGENTS.md` remains an index into Specs/ADRs, not a design dump
- OpenPRD / other LogicSRC kinds may appear as Contract deliverables when Specs require them

## Alternatives Considered

### LogicSRC as primary IR

Rejected — LogicSRC is emission/interop; Factory coding loop standardizes on Spec Blueprint+Contract (master §1 / §5).

### OpenPRD-only or prompt-only contracts

Rejected — insufficient Architecture/Constraints discipline; fails Context Gates / EGM feature_spec expectations.

### PBIs as the Spec

Rejected — PBIs are deltas with a 19-field typed body; Specs own living domain truth.
