# asdlc-lifecycle

> **Status:** PBI-013 local gate + CI refuse live (Meta). Stub authorship (PBI-001) remains the Blueprint base; gate is deterministic tooling, not Feature Assembly unlock alone.
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**
> **Role:** Pointer Spec for PBI-001 verification (Blueprint+Contract authorship norms) and owner of lifecycle/gates mapping — including the local gate Contract (PBI-013 / STL-174).

## Blueprint

### Context

LogicSRC ASDLC nine phases + Context Gates / Workflow-as-Code / Domain-Driven Specification. ISO/IEC/IEEE 12207:2026 process groups map into Spec ownership (ADR-009). Target ASDLC Level 2; ratchet habit from first escape.

### Architecture

- Spec anatomy (all domains): Blueprint Context / Architecture / Constraints + Contract DoD / Guardrails / Scenarios.
- Context gates before Feature Assembly: Spec review + EGM Goldfish (feature_spec) green.
- Living Specs: Contract changes update Spec in the same PR (default refinement rule).
- Accepted ADR bodies under `docs/adrs/` are immutable Nygard records (Title, Status, Context, Decision, Consequences, Alternatives Considered). ADR-007 is Superseded by ADR-011. Supersede; do not edit a merged body.
- **Local gate (PBI-013):** one command `npm run local-gate` / `bin/local-gate` (`scripts/local-gate.mjs`) runs inventory, placeholder refuse, well-known validate, `@logicsrc/validators@0.6.0`, and app typecheck/test — tooling refuses dirty/invalid.
- **CI refuse (PBI-013):** `.github/workflows/local-gate.yml` runs the same gate (+ refuse-ratchet unit tests) on every PR and `main` push.
- LogicSRC map: OpenPRD for product capability decisions; OpenWorkflow release/promote; OpenInstall activate health.

### Constraints

- Constraints in Blueprint are positive rules (pink-elephant); failure modes live in Gherkin Contract scenarios.
- PBIs are typed-contract deltas that point at Specs — they are not the Spec.
- AGENTS.md indexes; it does not dump design.
- Local gate and CI must refuse scaffold placeholders and invalid LogicSRC documents; agents must not treat a red gate as green.

## Contract

### Definition of Done

- One local gate command refuses dirty/invalid: `npm run local-gate` (or `bin/local-gate`).
- CI refuses dirty/invalid via `local-gate-refuse` (`.github/workflows/local-gate.yml`).
- `@logicsrc/validators` is wired into the gate; invalid fixtures are refused (ratchet tests green).
- Living Specs updated in the same PR as Contract changes.

### Regression Guardrails

- Feature Assembly does not start against scaffold-placeholder Contracts.
- Spec review + EGM Goldfish gate Feature Assembly per domain Spec.
- A tree containing a scaffold placeholder token (or an invalid LogicSRC agent fixture treated as valid) must fail the local gate and CI.

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

Scenario: Local gate refuses dirty or invalid trees
  Given the Factory Meta repo with Specs, ADRs, and LogicSRC emits
  When an operator or agent runs npm run local-gate (or bin/local-gate)
  And the tree contains a scaffold placeholder token or an invalid LogicSRC document
  Then the command exits non-zero
  And the dirty or invalid condition is reported

Scenario: CI refuses dirty or invalid on the same gate
  Given a pull request or push to main
  When the local-gate-refuse GitHub Actions job runs
  Then it executes the same local gate command used locally
  And refuse-ratchet unit tests prove invalid LogicSRC is rejected
  And a dirty or invalid tree fails the check on that SHA
```
