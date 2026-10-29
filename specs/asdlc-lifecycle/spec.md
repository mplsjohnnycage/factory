# asdlc-lifecycle

> **Status:** Stub authored — PBI-001 / STL-162 (Meta). Stub authorship only — not M1 implement DoD (§13.5).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**
> **Role:** Pointer Spec for PBI-001 verification (Blueprint+Contract authorship norms) and owner of lifecycle/gates mapping.

## Blueprint

### Context

LogicSRC ASDLC nine phases + Context Gates / Workflow-as-Code / Domain-Driven Specification. ISO/IEC/IEEE 12207:2026 process groups map into Spec ownership (ADR-009). Target ASDLC Level 2; ratchet habit from first escape.

### Architecture

- Spec anatomy (all domains): Blueprint Context / Architecture / Constraints + Contract DoD / Guardrails / Scenarios.
- Context gates before Feature Assembly: Spec review + EGM Goldfish (feature_spec) green.
- Living Specs: Contract changes update Spec in the same PR (default refinement rule).
- Accepted ADR bodies under `docs/adrs/` are immutable Nygard records (Title, Status, Context, Decision, Consequences, Alternatives Considered). ADR-007 is Superseded by ADR-011. Supersede; do not edit a merged body.
- Local gate + CI refuse dirty/invalid (PBI-013).
- LogicSRC map: OpenPRD for product capability decisions; OpenWorkflow release/promote; OpenInstall activate health.

### Constraints

- Constraints in Blueprint are positive rules (pink-elephant); failure modes live in Gherkin Contract scenarios.
- PBIs are typed-contract deltas that point at Specs — they are not the Spec.
- AGENTS.md indexes; it does not dump design.

## Contract

### Definition of Done

- One local gate command refuses dirty/invalid (when PBI-013 lands).
- CI refuses dirty/invalid.
- Living Specs updated in the same PR as Contract changes.

### Regression Guardrails

- Feature Assembly does not start against scaffold-placeholder Contracts.
- Spec review + EGM Goldfish gate Feature Assembly per domain Spec.

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

Scenario: Accepted ADR bodies carry six anatomy sections
  Given ADR files ADR-001 through ADR-011 under docs/adrs
  When each file is checked for Title, Status, Context, Decision, Consequences, and Alternatives Considered
  Then every Accepted ADR has all six anatomy sections
  And ADR-011 is present with Status Accepted
  And ADR-007 Status is Superseded by ADR-011
```
