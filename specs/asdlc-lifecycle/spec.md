# asdlc-lifecycle

> **Status:** Living Spec — PBI-001 stubs + PBI-013 local gate + PBI-014 OpenPRD 0001–0005 (Meta). Stub/Feature-Assembly gates still apply until Spec review + EGM Goldfish are green.
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**
> **Role:** Pointer Spec for PBI-001 verification (Blueprint+Contract authorship norms), owner of lifecycle/gates mapping, local refuse tooling, and Factory Meta OpenPRD product-intent batch.

## Blueprint

### Context

LogicSRC ASDLC nine phases + Context Gates / Workflow-as-Code / Domain-Driven Specification. ISO/IEC/IEEE 12207:2026 process groups map into Spec ownership (ADR-009). Target ASDLC Level 2; ratchet habit from first escape.

### Architecture

- Spec anatomy (all domains): Blueprint Context / Architecture / Constraints + Contract DoD / Guardrails / Scenarios.
- Context gates before Feature Assembly: Spec review + EGM Goldfish (feature_spec) green.
- Living Specs: Contract changes update Spec in the same PR (default refinement rule).
- Accepted ADR bodies under `docs/adrs/` are immutable Nygard records (Title, Status, Context, Decision, Consequences, Alternatives Considered). ADR-007 is Superseded by ADR-011. Supersede; do not edit a merged body.
- Local gate + CI refuse dirty/invalid (PBI-013): `npm run local-gate` / `bin/local-gate` → `scripts/local-gate.mjs` with `@logicsrc/validators@0.6.0`.
- LogicSRC map: OpenPRD for product capability decisions; OpenWorkflow release/promote; OpenInstall activate health.
- **PBI-014 OpenPRD batch (post-M1 emit; author OK / not M1 exit):** `prd/0000-template.md` + `prd/0001`…`0005-*.md` Accepted OpenPRD 0.3 (ten sections + front-matter), indexed by `prd/README.md`, validated by `@logicsrc/openprd@0.2.0` inside the local gate. Meta product-intent only — not Product Beads / user-project PRDs.

### Constraints

- Constraints in Blueprint are positive rules (pink-elephant); failure modes live in Gherkin Contract scenarios.
- PBIs are typed-contract deltas that point at Specs — they are not the Spec.
- AGENTS.md indexes; it does not dump design.
- OpenPRD numbering is four-digit, monotonic, no gaps; `0000` is template-only.
- OpenPRD status for 0001–0005 in this Meta batch is Accepted; Formal GitHub APPROVE / merge remains a separate protection concern.

## Contract

### Definition of Done

- One local gate command refuses dirty/invalid (PBI-013).
- CI refuses dirty/invalid (`local-gate-refuse` job).
- Living Specs updated in the same PR as Contract changes.
- **PBI-014:** OpenPRD `prd/0001`…`0005` exist with status Accepted; each validates OpenPRD 0.3 (front-matter + ten sections in order); collection has no numbering gaps; local gate refuses Draft/invalid OpenPRD for those ids.

### Regression Guardrails

- Feature Assembly does not start against scaffold-placeholder Contracts.
- Spec review + EGM Goldfish gate Feature Assembly per domain Spec.
- Local gate does not treat front-matter-only AJV as sufficient OpenPRD conformance when `prd/` is present — `@logicsrc/openprd` strict collection validation is required.
- Meta OpenPRDs do not author Product Beads or product Linear boards.

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

Scenario: Local gate refuses dirty Specs and invalid LogicSRC
  Given npm run local-gate (or bin/local-gate) is the one refuse command
  When a Spec contains a scaffold placeholder or a LogicSRC fixture is invalid
  Then the gate exits non-zero
  And CI job local-gate-refuse runs the same command path

Scenario: OpenPRD 0001-0005 Accepted align Meta product intent
  Given prd/0000-template.md and prd/0001 through prd/0005 Markdown OpenPRDs
  When @logicsrc/openprd validates the collection with --strict / expectedVersion 0.3
  Then each of 0001-0005 has status Accepted
  And each document has OpenPRD 0.3 ten sections in order with valid front-matter
  And numbering has no gaps
  And Specs named in tags remain the build-against IR (OpenPRD is product-intent emission, not the Spec)
  And Meta lane rules hold (no Product Beads)
```
