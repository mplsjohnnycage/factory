---
cursor:
  subagentId: "bc-5d5f7980-a89d-5a25-8fba-149e37deec23"
---

# Linked pack integrity + IR presence check

**Date:** 2026-10-28  
**Mode:** Read-only (this file only).  
**Inventory:** [`factory-master-spec-linked-docs.md`](./factory-master-spec-linked-docs.md) (generated 2026-10-28T20:43:28Z)  
**Verbatim root:** `internal/master-spec-linked-verbatim/`

---

## 1. Verification verdict + gaps

### Master sha256

| Check | Result |
|-------|--------|
| Live `docs/factory-master-spec.md` | `0cdcefdd4a04562762c62f485aa808ed24890c6dc02f7437876ee656d008fbfd` |
| Expected | `0cdcefdd4a04562762c62f485aa808ed24890c6dc02f7437876ee656d008fbfd` |
| **Verdict** | **MATCH** |

### Spot-check: live vs inventory sha vs verbatim copy

| Source | Inventory sha | Live == inv | Copy == inv | Notes |
|--------|---------------|:-----------:|:-----------:|-------|
| `internal/master-spec-verbatim-parts/01-through-s9.md` | `58bb208a…` | yes | yes | |
| `docs/factory-skill-leverage.md` | `60731b18…` | yes | yes | |
| `docs/egm-skill-leverage-loop.md` | `6e54b046…` | yes | yes | |
| `docs/factory-open-standards.md` | `dbf4aa3f…` | yes | yes | |
| `docs/egm-nits-n1-n9-fixes.md` | `0550da23…` | yes | yes | N1–N9 log present; master already contains those guards |
| `docs/egm-master-spec-run.md` | `becad7b7…` | yes | yes | |
| `internal/code-atlas-mockup-lock.md` | `a9450ec6…` | yes | yes | design lock, not implement DoD |

**Bulk:** 56/57 VERBATIM inventory rows still `live == copy == inventory sha`. **1 stale:** `notes.md` (see gaps). Master outbound markdown links: **0 broken** (rechecked).

### Gaps / not “ready to build against” without care

1. **SUMMARY-ONLY (no full verbatim in pack)**  
   - `docs/factory-master-spec.md` → only `SUMMARY-factory-master-spec.md` (build against live master, not the summary).  
   - `media/code-atlas-mockup.png` → summary stub only.  
   - `artifacts/elephant-goldfish-model/` → directory summary only.

2. **Stale verbatim vs live**  
   - **`notes.md`:** copy/inventory `d5a426b3…` (6149 B); live `63d21db7…` (6304 B) after FE-43→FE-44 board update. Coordination churn, not master content.  
   - **EGM directory path-list sha:** inventory `75b247ce…`; live recomputed path-list `e319c4ec…` (still 222 files). SUMMARY row is stale relative to current tree listing.

3. **EGM PASS vs FE-21 FAIL baseline (confusion risk)**  
   - [`egm-master-spec-run.md`](./egm-master-spec-run.md): **FAIL** quality gate; historical dirty FE-21 baseline.  
   - [`egm-skill-leverage-loop.md`](./egm-skill-leverage-loop.md): iter3 **PASS**, **Buildable YES**; explicitly supersedes FE-21 for buildable verdict.  
   - Do not treat FE-21 FAIL as current gate if FE-40 loop is authoritative.

4. **Design locks vs implement**  
   - Master §13.5 + skill-leverage M1 table: §§11 / 16 / 19 / 20 (+ §4.2.2 wizard) = **design-lock authorship OK, M1 implement deferred**.  
   - Code Atlas mockup lock (§12.1.1 / `code-atlas-mockup-lock.md`) = visual target, not Feature Assembly DoD.  
   - Agents build against filled `/specs/*/spec.md`, not the production plan alone (§10).

5. **IR framing tension inside pack**  
   - Normative: ASDLC Spec = primary build-against IR (ADR-004); LogicSRC ≠ primary.  
   - [`logicsrc-artifact-inventory.md`](./logicsrc-artifact-inventory.md) §4 heading still says “core Factory IR” and calls task JSON “portable IR” — interop sense, easy to misread as primacy.  
   - [`factory-open-standards.md`](./factory-open-standards.md) §3 lists **candidate** IRs (Agent Spec, SCIP, Wasm, ONNX) — research/catalog, **not ADR-locked**.

6. **No inventory broken store links** (inventory claim 0; master link recheck 0).

**Pack readiness:** Key normative companions (skill-leverage, open-standards, EGM loop, N1–N9, master parts) are hash-faithful. Use **live** `factory-master-spec.md` + FE-40 **PASS** loop for buildability; treat FE-21 run, SUMMARY stubs, stale `notes.md` copy, and post-M1 design locks as non-DoD / historical / deferred.

---

## 2. IR / intermediate representation — **YES**

`intermediate-rep`: **no hits** anywhere in master or linked verbatim pack.

### In inventory / linked set (exact citations)

| File | Section / locus | Quote / role |
|------|-----------------|--------------|
| `docs/factory-master-spec.md` | Header (LogicSRC map) | “**not** the primary IR” |
| same | §3 ADR table — **ADR-004** | “…LogicSRC is interoperability emission, not primary IR.” |
| same | §14 Alternatives — row **Build-against IR** | “ASDLC Spec Blueprint+Contract (ADR-004)” vs “LogicSRC-as-primary…” |
| same | §20.4 step 4 | “Canvas is the Spec, not a parallel IR.” |
| same | Closing **Hard bans** | “treating LogicSRC as primary IR” |
| `docs/factory-skill-leverage.md` | Normative scope **Alternatives** | “LogicSRC-as-primary IR” rejected |
| same | ASDLC map table | “Blueprint + Contract as build-against IR” |
| same | LogicSRC map | “Interop emission **not** primary IR” |
| `docs/factory-open-standards.md` | **§3 Intermediate representations (IR) for AI-built software** | Dedicated IR catalog (Agent Spec, SCIP, Wasm CM, ONNX, Protobuf) |
| same | §2 SDD row | “vs LogicSRC-as-IR” |
| same | Layer diagram | `IR ←—— Agent Spec · SCIP · JSON Schema/Protobuf` |
| `docs/logicsrc-artifact-inventory.md` | Header primacy | “**not** the primary IR” |
| same | **§4 Agents and process family (core Factory IR)** | Heading uses IR; body “LogicSRC task JSON is the portable IR”; “LogicSRC JSON IR”; “entity/role IR” |
| `docs/factory-stack-audit.md` | LogicSRC classification | “**Not:** a code IR…” |
| `docs/egm-skill-leverage-loop.md` | — | **No** `\bIR\b` / “intermediate representation” hits |
| Verbatim mirrors of above | Same loci | Match live for those files |

### Adjacent docs with IR language (not in linked inventory)

- `docs/workspace-skills-inventory.md` — skills gap row “IR (intermediate representation)”.  
- `docs/logic-src-overview.md` — “not a compiler IR” / “IR format” classification.

---

## 3. Complete inventory filename list

Basenames under `internal/master-spec-linked-verbatim/` as listed in the inventory (60 rows → 60 copy files):

1. `01-through-s9.md`  
2. `SKILL.md`  
3. `SUMMARY-code-atlas-mockup.png.md`  
4. `SUMMARY-elephant-goldfish-model.md`  
5. `SUMMARY-factory-master-spec.md`  
6. `adr-authoring.md`  
7. `adversarial-code-review.md`  
8. `agents-md-spec.md`  
9. `code-atlas-mockup-lock.md`  
10. `compound-loop.md`  
11. `comprehension_report.md`  
12. `consolidated_review_report.md`  
13. `context-gates.md`  
14. `critic_design_raw.md`  
15. `critic_report.md`  
16. `critic_structural_raw.md`  
17. `critic_style_raw.md`  
18. `domain-driven-specification.md`  
19. `egm-master-spec-run.md`  
20. `egm-nits-n1-n9-fixes.md`  
21. `egm-skill-leverage-loop.md`  
22. `factory-claims-verification.md`  
23. `factory-open-standards.md`  
24. `factory-oss-analogs.md`  
25. `factory-skill-leverage.md`  
26. `factory-stack-audit.md`  
27. `factory-stack-gap-solutions.md`  
28. `frontend-stack-feed.md`  
29. `infinity-stack-fit.md`  
30. `intermediate_zoom_out_report.md`  
31. `iso-12207-overview.md`  
32. `iter1_comprehension.md`  
33. `iter1_design.md`  
34. `iter1_structural.md`  
35. `iter1_zoom_out.md`  
36. `iter2_comprehension.md`  
37. `iter2_design.md`  
38. `iter2_structural.md`  
39. `iter2_zoom_out.md`  
40. `iter3_consolidated.md`  
41. `linear-factory-task-manager.md`  
42. `linear-mcp-apps-verify.md`  
43. `living-specs.md`  
44. `logicsrc-artifact-inventory.md`  
45. `notes.md`  
46. `pbi-authoring.md`  
47. `port-capabilities.md`  
48. `port-factory-data-model.md`  
49. `port-full-capacity.md`  
50. `rivet-claim-fencing.md`  
51. `rivet-engineering-spec.md`  
52. `rivet-full-capacity.md`  
53. `rivet-sandbox-agent.md`  
54. `the-adr.md`  
55. `the-pbi.md`  
56. `the-spec.md`  
57. `widget-ui-prompts.2026-10-28T15-18-27-192Z.0lt01i.conflict.md`  
58. `widget-ui-prompts.md`  
59. `workflow-as-code.md`  
60. `zoom_out_report.md`  

Inventory also records subject hub `docs/factory-master-spec.md` (SUMMARY-ONLY) and outbound directory `artifacts/elephant-goldfish-model/` (SUMMARY-ONLY). External URL citations: 33 (not store files).
