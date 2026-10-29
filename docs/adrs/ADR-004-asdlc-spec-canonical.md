# ADR-004: ASDLC Spec is the canonical build-against artifact

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Johnny Cage / Factory Meta

## Context

Agents need a stable artifact to assemble against: Blueprint (Context, Architecture, Constraints) plus Contract (Definition of Done, Guardrails, Scenarios). LogicSRC emits interoperability files — OpenStack, OpenAccess, well-known descriptors, validators — and is not a substitute for living domain Specs. Prompt-only or OpenPRD-only drives produce unreviewable drift.

## Decision

We will treat **ASDLC Spec** files at `/specs/{domain}/spec.md` as the **canonical agent build-against artifact**. **LogicSRC is interoperability emission, not primary IR.** PBIs are typed-contract deltas that point at Specs. They are not the Spec. Living Specs update in the same PR as Contract changes (default refinement).

## Consequences

**Positive:** One anatomy for humans and agents across domains. Gherkin scenarios become verifiable Contract checks. LogicSRC stays scoped to the Required M1 emit cut.

**Negative:** Spec authorship is required before Feature Assembly. Incomplete stubs must not be treated as implement Definition of Done (PBI-001 stub rule). Agents can still ignore Specs until the local gate and CI (PBI-013) refuse dirty or invalid trees.

**Neutral:** `AGENTS.md` stays an index into Specs and ADRs. It does not dump design. OpenPRD and other LogicSRC kinds appear as Contract deliverables when Specs require them.

**Reconsider when:** A successor ADR names a different primary IR. Treating LogicSRC, a PBI body, or a prompt as the build-against Spec is not that successor.

## Alternatives Considered

- **LogicSRC as primary IR.** Rejected. LogicSRC is emission and interop. The coding loop standardizes on Spec Blueprint plus Contract (master §1 / §5).
- **OpenPRD-only or prompt-only contracts.** Rejected. They lack Architecture and Constraints discipline and fail Context Gates and EGM `feature_spec` expectations.
- **PBIs as the Spec.** Rejected. PBIs are deltas with a typed body. Specs own living domain truth.
