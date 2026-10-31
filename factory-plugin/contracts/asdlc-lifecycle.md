<!-- PROVENANCE: Contract section copied verbatim from repo specs/asdlc-lifecycle/spec.md @ origin/main 247842e (PR #111 merge, 2026-10-30). Blueprint half lives in the repo Spec; master spec cross-ref: factory-master-spec.md §4. Snapshot copied 2026-10-30 ~22:30 CDT. Refresh route: re-pull specs/asdlc-lifecycle/spec.md from the repo (git) — the repo Spec, derived from the master spec, is the living source. -->

# Contract — asdlc-lifecycle

Source: `specs/asdlc-lifecycle/spec.md` (repo, main @ 247842e)

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
