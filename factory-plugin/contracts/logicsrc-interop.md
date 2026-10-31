<!-- PROVENANCE: Contract section copied verbatim from repo specs/logicsrc-interop/spec.md @ origin/main 247842e (PR #111 merge, 2026-10-30). Blueprint half lives in the repo Spec; master spec cross-ref: factory-master-spec.md §4. Snapshot copied 2026-10-30 ~22:30 CDT. Refresh route: re-pull specs/logicsrc-interop/spec.md from the repo (git) — the repo Spec, derived from the master spec, is the living source. -->

# Contract — logicsrc-interop

Source: `specs/logicsrc-interop/spec.md` (repo, main @ 247842e)

### Definition of Done

- **PBI-003:** inventory §7 items 1–2 present (OpenStack root + well-known; OpenProfile operator well-known); AGENTS.md indexes Specs/ADRs/emits without dumping design.
- **PBI-010:** inventory §7 items 9–10 present (`/.well-known/openmcp.json`, `/.well-known/openaccess.json`); validated by `scripts/validate-well-known.mjs`; zero Port mutations.
- **M1:** emit + validate only §13.6 Required rows.
- **Post-M1:** inventory §7 Factory-mandatory checklist green.
- **PBI-014:** `prd/0001`…`0005` Accepted OpenPRD 0.3 present and gate-validated (not an M1 exit criterion).

### Regression Guardrails

- No invented catalogs outside inventory + Spec ownership.
- Validators refuse invalid OpenPRD / schema artifacts in local gate (`scripts/local-gate.mjs` + `@logicsrc/validators` + `@logicsrc/openprd`).
- Placeholder OpenStack/OpenProfile bodies are not Accepted emissions.
- OpenPRD batch is Meta product-intent only — never Product Beads.

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

Scenario: PBI-010 OpenMCP and OpenAccess inventory rows present
  Given /.well-known/openmcp.json and /.well-known/openaccess.json
  When scripts/validate-well-known.mjs runs
  Then inventory §7 items 9 and 10 pass shape checks
  And neither file is a scaffold placeholder
  And neither file creates, deletes, or revokes Port External Interface apps

Scenario: PBI-014 OpenPRD 0001-0005 collection present
  Given prd/0000-template.md and Accepted prd/0001 through prd/0005
  When npm run local-gate runs @logicsrc/openprd collection validation
  Then OpenPRD 0.3 front-matter and ten sections pass
  And numbering has no gaps
  And this is post-M1 author work (not an M1 Required emit row)
```
