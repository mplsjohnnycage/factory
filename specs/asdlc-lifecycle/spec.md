# asdlc-lifecycle

> **Status:** Stub authored — PBI-001 / STL-162; ADR index updated — PBI-002 / STL-163 (Meta). Stub authorship only — not M1 implement DoD (§13.5).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**
> **Role:** Pointer Spec for verification (Blueprint+Contract authorship norms), owner of lifecycle/gates mapping, and pointer to immutable `docs/adrs/` Nygard bodies.

## Blueprint

### Context

LogicSRC ASDLC nine phases + Context Gates / Workflow-as-Code / Domain-Driven Specification. ISO/IEC/IEEE 12207:2026 process groups map into Spec ownership (ADR-009). Target ASDLC Level 2; ratchet habit from first escape. Locked architectural decisions live as Nygard ADRs under `docs/adrs/` (PBI-002); bodies are immutable after merge — supersede, do not edit.

### Architecture

- Spec anatomy (all domains): Blueprint Context / Architecture / Constraints + Contract DoD / Guardrails / Scenarios.
- ADR anatomy (all Accepted ADRs): Title, Status, Context, Decision, Consequences, Alternatives Considered.
- ADR index: `docs/adrs/ADR-001`…`ADR-011` (ADR-007 Status = Superseded by ADR-011; ADR-005 Accepted — live).
- Context gates before Feature Assembly: Spec review + EGM Goldfish (feature_spec) green.
- Living Specs: Contract changes update Spec in the same PR (default refinement rule).
- Local gate + CI refuse dirty/invalid (PBI-013).
- LogicSRC map: OpenPRD for product capability decisions; OpenWorkflow release/promote; OpenInstall activate health.

### Constraints

- Constraints in Blueprint are positive rules (pink-elephant); failure modes live in Gherkin Contract scenarios.
- PBIs are typed-contract deltas that point at Specs — they are not the Spec.
- AGENTS.md indexes; it does not dump design.
- After PBI-002 merge, do not rewrite ADR bodies in place — open a superseding ADR instead.

## Contract

### Definition of Done

- One local gate command refuses dirty/invalid (when PBI-013 lands).
- CI refuses dirty/invalid.
- Living Specs updated in the same PR as Contract changes.
- Every Accepted ADR under `docs/adrs/` has all six ADR anatomy sections; ADR-011 present; ADR-007 marked Superseded by ADR-011.

### Regression Guardrails

- Feature Assembly does not start against scaffold-placeholder Contracts.
- Spec review + EGM Goldfish gate Feature Assembly per domain Spec.
- Placeholder or one-line ADR table copies are not Accepted bodies.

### Scenarios

```gherkin
Scenario: Stub authorship satisfies PBI-001 verification pointer
  Given ten domain Spec files under /specs/*/spec.md
  When each is checked for Blueprint Context/Architecture/Constraints
  And Contract DoD/Guardrails/at least one Gherkin scenario
  Then PBI-001 verification pointer is satisfied
  And Feature Assembly remains blocked until Spec review + EGM are green

Scenario: Living Spec updates travel with Contract changes
  Given a PR changes a Contract scenario
  When the PR is opened
  Then the owning /specs/{domain}/spec.md is updated in the same PR

Scenario: Full ADR authorship satisfies PBI-002 verification pointer
  Given docs/adrs/ADR-001 through ADR-011 markdown files
  When each Accepted ADR is checked for Title Status Context Decision Consequences Alternatives
  And ADR-007 Status records Superseded by ADR-011
  And ADR-011 is present and Accepted
  Then PBI-002 verification pointer is satisfied
  And ADR bodies remain immutable except via supersession
```
