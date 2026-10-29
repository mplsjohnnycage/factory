# logicsrc-interop

> **Status:** Stub authored — PBI-001 / STL-162 (Meta). Stub authorship only — not M1 implement DoD (§13.5).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Emit inventory-mandatory LogicSRC interoperability files from Specs. LogicSRC is emission/interop — not primary IR (ADR-004). Markdown-first; JSON derived where schemas require.

### Architecture

- Catalog includes OpenStack, OpenProfile, OpenPRD `prd/`, OpenAgent, OpenFleet, OpenWorkflow, OpenMCP, OpenInstall, schemas via `@logicsrc/schemas@0.6.0`.
- Owning Specs map artifacts per master §5 emission matrix.
- **M1 emit cut (§13.6 Required):** AGENTS.md, OpenStack, OpenProfile, OpenMCP, OpenAccess descriptor.
- Full inventory §7 Factory-mandatory checklist = post-M1.
- Validate with `@logicsrc/validators` / `logicsrc prd validate --strict` in ASDLC local gate (PBI-013).

### Constraints

- Out-of-scope catalogs are not invented at any phase.
- AGENTS.md is index only — does not dump design.
- Do not treat LogicSRC as the build-against Spec.

## Contract

### Definition of Done

- **M1:** emit + validate only §13.6 Required rows.
- **Post-M1:** inventory §7 Factory-mandatory checklist green.

### Regression Guardrails

- No invented catalogs outside inventory + Spec ownership.
- Validators refuse invalid OpenPRD / schema artifacts in local gate when that gate is live.

### Scenarios

```gherkin
Scenario: M1 Required emissions present
  Given Specs that own OpenStack, OpenProfile, OpenMCP, OpenAccess, and AGENTS.md
  When M1 emit runs
  Then those Required rows exist and validate
  And non-Required inventory rows may remain absent

Scenario: AGENTS.md stays an index
  Given AGENTS.md is regenerated from Specs
  When an agent opens AGENTS.md
  Then it indexes Specs/ADRs/skills
  And it does not dump Blueprint or Contract design prose
```
