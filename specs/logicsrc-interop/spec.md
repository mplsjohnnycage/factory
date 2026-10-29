# logicsrc-interop

> **Status:** Stub authored — PBI-001 / STL-162 (Meta). OpenStack + OpenProfile + AGENTS.md index emitted under **PBI-003 / STL-164**. Stub authorship only — not M1 implement DoD (§13.5).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Emit inventory-mandatory LogicSRC interoperability files from Specs. LogicSRC is emission/interop — not primary IR (ADR-004). Markdown-first; JSON derived where schemas require.

### Architecture

- Catalog includes OpenStack, OpenProfile, OpenPRD `prd/`, OpenAgent, OpenFleet, OpenWorkflow, OpenMCP, OpenInstall, schemas via `@logicsrc/schemas@0.6.0`.
- Owning Specs map artifacts per master §5 emission matrix.
- **M1 emit cut (§13.6 Required):** AGENTS.md, OpenStack, OpenProfile, OpenMCP, OpenAccess descriptor.
- **PBI-003 emit (inventory §7 items 1–2 + AGENTS index):** `OpenStack.md` + `/.well-known/openstack.md`; operator `OpenProfile.md` + `/.well-known/openprofile.md`; `AGENTS.md` remains index-only.
- OpenMCP / OpenAccess well-known JSON remain scaffold until PBI-010 (no Port OAuth create from those files).
- Full inventory §7 Factory-mandatory checklist = post-M1.
- Validate with `@logicsrc/validators` / `logicsrc prd validate --strict` in ASDLC local gate (PBI-013).

### Constraints

- Out-of-scope catalogs are not invented at any phase.
- AGENTS.md is index only — does not dump design.
- Do not treat LogicSRC as the build-against Spec.
- OpenStack / OpenProfile emit does not create, delete, or revoke Port External Interface apps.

## Contract

### Definition of Done

- **PBI-003:** inventory §7 items 1–2 present (OpenStack root + well-known; OpenProfile operator well-known); AGENTS.md indexes Specs/ADRs/emits without dumping design.
- **M1:** emit + validate only §13.6 Required rows.
- **Post-M1:** inventory §7 Factory-mandatory checklist green.

### Regression Guardrails

- No invented catalogs outside inventory + Spec ownership.
- Validators refuse invalid OpenPRD / schema artifacts in local gate when that gate is live.
- Placeholder OpenStack/OpenProfile bodies are not Accepted emissions.

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

Scenario: PBI-003 OpenStack and OpenProfile inventory rows present
  Given repo root OpenStack.md and /.well-known/openstack.md
  And operator OpenProfile at /.well-known/openprofile.md
  And AGENTS.md as an index
  When inventory §7 items 1 and 2 are checked
  Then both artifacts are present with real bodies (not placeholders)
  And AGENTS.md does not dump Spec design
  And this unit does not mutate Port External Interface apps
```
