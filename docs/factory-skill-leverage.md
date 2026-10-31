# Factory skill leverage — what each skill contributes to the master spec

**Status:** FE-22 deliverable — **non-normative index**  
**Date:** 2026-10-28  
**Normative SoT:** [`factory-master-spec.md`](./factory-master-spec.md) only  
**Inventory baseline:** [`workspace-skills-inventory.md`](./workspace-skills-inventory.md)  
**EGM process notes:** [`egm-skill-leverage-loop.md`](./egm-skill-leverage-loop.md) (not repeated here)

This report maps **ASDLC**, **Compound Engineering**, **EGM**, **AG-UI/CopilotKit**, **LogicSRC**, and **Port MCP** onto concrete master-spec sections, file paths, and edits. It is **not** a second feature specification.

---

## Normative scope (EGM / feature-spec)

| | |
|--|--|
| **Problem** | Parallel builders need a clear map of which installed skills already shaped the master plan — without treating this file as a competing Spec. |
| **Goals** | (1) Bind six surfaces → master-spec loci with paths. (2) Log FE-22 master-spec edits. (3) Declare M1 normative subset vs post-M1 design locks. |
| **Non-Goals** | Replacing master-spec Problem/Goals/Alternatives/Risks; inventing Port/Rivet runtime; Port mutations; implementing deferred UI (§11/§16/§19/§20). |
| **Architecture** | Skills → citations in master §§1–21; CE/EGM are operator gates; Port MCP is SoT front door; LogicSRC is interop emission; AG-UI deferred. See master **Proposed Architecture (M1 index)**. |
| **Implement vs authorship** | Master is the **production plan**; M1 **code** builds against filled `/specs/*/spec.md` + depth docs — not this index or the plan alone (master §10). Gateway package path: `apps/factory-gateway/` (master §2). |
| **Alternatives** | Rejected: skill-leverage as second Spec; LogicSRC-as-primary IR; CE as Rivet runtime; AG-UI as kernel stream — reasons in master §14 + ADR-004/011. |
| **Risks** | Stale skill map after master edits → mitigate via FE-40 loop + §21; missing Rivet/Beads skills → contracts in master §13 (inventory Gaps unchanged). |

**On conflict:** `factory-master-spec.md` wins. This file is updated to match.

### M1 normative subset vs post-M1 design locks

| M1-normative (build/exit) | Post-M1 / deferred implement (design OK) |
|---------------------------|------------------------------------------|
| §§1–9, §4.2.1, §13.0–13.7, §14–15, Proposed Architecture | §11 AG-UI adapter detail |
| PBIs 004–007, 011 (+ 008/009 shell+stream+atlas L0) | §16 Linear MCP App implement |
| LogicSRC §13.6 Required rows | §19 full chrome / Finder mode implement |
| ADR-001…006, 008, 011 | §20 Spec Canvas loop implement |
| §18 agent classes + Single-MCP | §4.2.2 assembly wizard implement |
| §21 + this index | `factory-edge` relay |

---

## 0. How to read this

| Column | Meaning |
|--------|---------|
| **Skill / surface** | Installed or Project-local package agents load |
| **Contributes** | Normative idea locked into the Factory plan |
| **Master-spec locus** | Section / ADR / PBI / ASSUMPTION that absorbs it |
| **Evidence path** | Skill file or prior Project doc |

Prior mid-run skill-leverage mutations (during FE-21 dirty baseline) already touched §4.2, §4.5, §6–§7, §9 ASSUMPTIONs 11–13. FE-22 finishes the map, adds §21 + M1 LogicSRC/metrics cuts; FE-40 remediations continue on the master spec (logged in the loop file).

---

## 1. ASDLC (`skills/asdlc/`)

**Install:** Project store [`skills/asdlc/SKILL.md`](../skills/asdlc/SKILL.md) (from `internal/asdlc-skill.zip`, FE-16).

| Contributes | Master-spec locus | Skill path |
|-------------|-------------------|------------|
| **The Spec** = Blueprint + Contract as build-against IR | Title, §1 hierarchy, ADR-004, §4 skeleton, repo `/specs/{domain}/spec.md` | [`patterns/the-spec.md`](../skills/asdlc/patterns/the-spec.md), [`practices/living-specs.md`](../skills/asdlc/practices/living-specs.md) |
| **PBI** = delta pointing at Spec + Contract | §1, §6 seed PBIs, atomicity / refinement rules | [`patterns/the-pbi.md`](../skills/asdlc/patterns/the-pbi.md), [`practices/pbi-authoring.md`](../skills/asdlc/practices/pbi-authoring.md) |
| **ADR** = immutable decision snapshot | §1, §3 ADR-001…011 table + anatomy mandate in PBI-002 | [`patterns/the-adr.md`](../skills/asdlc/patterns/the-adr.md), [`practices/adr-authoring.md`](../skills/asdlc/practices/adr-authoring.md) |
| **Pink-elephant** (positive Constraints; failure modes in Gherkin) | §2 skeleton note; §4.5 display-channel Constraints | the-spec Anatomy |
| **Context Gates** | §7 gate table (Spec review, Local, CI, Adversarial, Compound, Port accept) | [`patterns/context-gates.md`](../skills/asdlc/patterns/context-gates.md) |
| **Workflow-as-Code** | §7 orchestration shell (TS handlers; LLM only in harness) | [`practices/workflow-as-code.md`](../skills/asdlc/practices/workflow-as-code.md) |
| **Domain-Driven Specification** | §8 bounded contexts | [`practices/domain-driven-specification.md`](../skills/asdlc/practices/domain-driven-specification.md) |
| **Compound Loop** (HITL writeback; AGENTS.md = index) | §7 Compound writeback gate; PBI-015; ASSUMPTION 12 | [`patterns/compound-loop.md`](../skills/asdlc/patterns/compound-loop.md), [`concepts/compound-engineering.md`](../skills/asdlc/concepts/compound-engineering.md) |
| **Agentic Double Diamond** (Spec → Assemble → Run) | Spec-anchored maturity §1; Spec Canvas §20 as Spec plane | [`patterns/agentic-double-diamond.md`](../skills/asdlc/patterns/agentic-double-diamond.md) |
| **Adversarial review** | §7 Adversarial gate → CE `/ce-code-review` | [`practices/adversarial-code-review.md`](../skills/asdlc/practices/adversarial-code-review.md) |
| **AGENTS.md as index** | §1; PBI-003; Compound gate | [`practices/agents-md-spec.md`](../skills/asdlc/practices/agents-md-spec.md) |
| **ISO / lifecycle mapping** | ADR-009; §4.10 `asdlc-lifecycle` | [`docs/iso-12207-overview.md`](./iso-12207-overview.md) + ASDLC phase docs |

**Specific changes already in master spec (prior + this pass):** entire document framed as ASDLC Spec production plan; §1–§9 structure; §20 Spec Canvas cites §1 anatomy.

**This-pass edits:** §21 skill-binding index; ASSUMPTION 13 updated for FE-40 EGM iterate; §10 document-control row for this file.

---

## 2. Compound Engineering (plugin `cursor-public/680`)

**Install:** Marketplace cache `~/.cursor/plugins/cache/cursor-public/680/` — `compound-engineering` v3.29.0 ([`diamond-compound-cross-plugin.md`](./diamond-compound-cross-plugin.md)).

| Contributes | Master-spec locus | Skill / guide |
|-------------|-------------------|---------------|
| Plan → Work → Review → **Compound** execution surface | ASSUMPTION 12; §7 gates map Review→`/ce-code-review`, Compound→`/ce-compound` | `skills/ce-compound/SKILL.md`, `ce-work`, `ce-plan`, `ce-code-review` |
| Learnings → `docs/solutions/` under HITL | PBI-015; §7 Compound writeback; AGENTS.md stays index | `docs/guides/ce-compound.md` |
| Not “Berkeley compound AI” | Implicit via ASDLC concept distinction | ASDLC `concepts/compound-engineering.md` |

**Specific changes:** ASSUMPTION 12; PBI-015; §7 Compound + Adversarial rows naming CE commands. No kernel dependency on the CE plugin binary — it is the **operator/agent execution surface** for Plan/Work/Review/Compound, not a Rivet Actor.

**This-pass edits:** §21.2 restates CE binding; no CE-only structural rewrite (already present).

---

## 3. EGM — Elephant / Goldfish Model

**Install sources:** Project [`artifacts/elephant-goldfish-model/`](../artifacts/elephant-goldfish-model/) (durable). Prior report also targeted `~/.cursor/plugins/local/egm/` (absent on this VM — use artifacts copy). Skills: `egm-review`, `egm-review-loop`, `egm-resolve`, `egm-draft`, `egm-brainstorm`, `egm-bootstrap`, `egm-drift-report`.

| Contributes | Master-spec locus | Skill path |
|-------------|-------------------|------------|
| Fresh-context Goldfish review before Feature Assembly | §7 EGM Goldfish gate; ASSUMPTION 13 | [`skills/egm-review/SKILL.md`](../artifacts/elephant-goldfish-model/skills/egm-review/SKILL.md) |
| Feature-spec bar (Problem/Goals, Alternatives, Risks, YAGNI) | §§13–15 remediations from FE-21 FAIL | `resources/document_standards/feature-spec-standard.md`, `zoom-out-standard.md` |
| FE-21 baseline FAIL → remediation §§11–16 / §13 | §13 intro cites [`egm-master-spec-run.md`](./egm-master-spec-run.md) | [`internal/egm-master-spec-review/`](../internal/egm-master-spec-review/) |
| Iterate-to-buildable | ASSUMPTION 13 + FE-40 loop log | [`egm-skill-leverage-loop.md`](./egm-skill-leverage-loop.md) (Step 2) |

**Specific changes already applied from EGM FAIL residuals:** §13.0 Problem/Goals/Non-Goals (M6); §13.1–13.3 Beads/Polygraph/Trail-Code (M5); §13.4 topology (M8); §13.5 M1 cut (B1/M1); §14 Alternatives (B2); §15 Risks (B3); §12 measurable atlas DoD (M2).

**This-pass edits:** §13.6 M1 LogicSRC emission cut (M3); §13.7 M1 success metrics (M10); ASSUMPTION 13 → FE-21 baseline + FE-40 loop; §10/§17/§21 point at skill-leverage + loop logs. Framing under §10: deferred ADRs ≠ open Johnny questions (M7 soft).

---

## 4. AG-UI / CopilotKit

**No dedicated skill install** ([inventory](./workspace-skills-inventory.md) Gap). Evidence from FE-15: [`internal/frontend-stack-feed.md`](../internal/frontend-stack-feed.md), [`factory-stack-audit.md`](./factory-stack-audit.md) §§19–22.

| Contributes | Master-spec locus | Evidence |
|-------------|-------------------|----------|
| Kernel stream ≠ CopilotKit | ADR-011; §4.5 Streaming; PBI-009; §7 no CopilotRuntime | frontend-stack-feed |
| AG-UI = Agent↔User protocol; complementary to MCP | ADR-011; §4.5 AG-UI deferred note | [AG-UI introduction](https://docs.ag-ui.com/introduction) |
| First-party Rivet↔AG-UI UNVERIFIABLE | ADR-011; §11 bridge as Factory adapter | audit §§19–22; oss-analogs §1 |
| Optional later projector + event map | §11.1–11.3; §19.5 remap; R-09 | `@ag-ui/core` EventType table in §11.3 |
| CopilotKit = optional AG-UI client later | §4.5; Non-Goals M1 | feed |

**Specific changes:** ADR-007 superseded by ADR-011; full §11 adapter design; §19 state map dual-lists Rivet + AG-UI events; hard bans against AG-UI/CopilotKit as kernel path (§19.5, §20.7).

**This-pass edits:** §21.4 cites deferred path only — no new kernel dependency.

---

## 5. LogicSRC

**No product skill** (inventory Gap). Artifacts: [`logicsrc-artifact-inventory.md`](./logicsrc-artifact-inventory.md), [`logicsrc-monorepo.md`](./logicsrc-monorepo.md), [`logic-src-overview.md`](./logic-src-overview.md). ASDLC concepts reference LogicSRC ASDLC phases.

| Contributes | Master-spec locus | Path |
|-------------|-------------------|------|
| Interop emission **not** primary IR | ADR-004; header LogicSRC map; §1 row | inventory primacy note |
| Per-domain LogicSRC maps | §4.1–4.10 “LogicSRC map” bullets | inventory §0–§N |
| Emission matrix Spec → file | §5 | inventory |
| M1 cut (only Contract-required files) | §13.0 Goals #4; **§13.6**; §4.7 Contract scoped to §13.6 for M1 | inventory; full §7 = post-M1 |
| Validators in local gate | §4.7 Constraints; §7 Local gate; PBI-013 | `@logicsrc/validators` |
| OpenPRD / OpenStack / OpenAgent / … | §2 layout; PBIs 003/010/014 | inventory |

**Specific changes this pass:** §13.6 table — M1-required vs post-M1 LogicSRC artifacts (closes EGM M3 without deleting §5 catalog).

---

## 6. Port MCP

**Install:** Port marketplace plugin + live Port MCP namespace (read used in FE-2/FE-27/FE-28). Docs: [`port-capabilities.md`](./port-capabilities.md), [`port-full-capacity.md`](./port-full-capacity.md), [`port-factory-data-model.md`](./port-factory-data-model.md).

| Contributes | Master-spec locus | Evidence |
|-------------|-------------------|----------|
| Port = SoT (catalog, RBAC, workflows, MCP gateway, audit, Context Lake) | ADR-001; §4.2; §8 Port context | port-capabilities |
| Clerk out; External Interface OAuth | ADR-005; §3.1 create params **docs-only** | port-capabilities §3.1 |
| Live blueprint/workflow names (no invented IDs) | §4.2 live catalog; ASSUMPTION 11 | Port MCP read 2026-10-28 |
| Catalog write fencing (no product CAS) | §4.2.1; ASSUMPTION 14; R-01 | port-factory-data-model §4.1 |
| Machine-validated stack assembly | §4.2.2 | port-factory-data-model |
| Single-MCP: Factory gateway fronts Port MCP | §18.5; Cockpit tool surface §18.3 | port-full-capacity §4 |
| **No Port mutations from this plan** | ADR-005; Non-Goals; hard bans | OAuth header note |

**Specific changes:** §4.2 live binding; §4.2.1 fencing; §4.2.2 assembly; §18 Single-MCP; Johnny-only INPUT on `factory_request_release` preserved.

**This-pass edits:** §21.6 reaffirms read-only planning posture — **zero Port mutations** in FE-22/FE-40.

---

## 7. Cross-skill composition (locked)

```txt
ASDLC The Spec  ──build-against──►  Coding / Cockpit agents
     │ emits
     ▼
LogicSRC files (M1 cut §13.6)     Port MCP (SoT + gate) ──webhook──► Rivet
     │
CE Plan/Work/Review/Compound      EGM Goldfish gate (§7) before Feature Assembly
     │
AG-UI/CopilotKit ──deferred display (§11)──► never kernel stream (ADR-011)
```

---

## 8. Master-spec edits (FE-22 + FE-40 iter-1 remediations)

| Edit | Location | Why |
|------|----------|-----|
| Add §21 Skill leverage bindings | end of `factory-master-spec.md` | Normative index into this report + six surfaces |
| Document-control rows | §10, §17 | Link this file + EGM loop log |
| ASSUMPTION 13–15 | §9 | FE-21/FE-40; cost soft caps |
| Soften status / open-questions framing | header, §10 | Deferred ADRs ≠ unresolved Specs |
| §13.6 / §13.7 | after §13.5 | LogicSRC M1 cut + metrics |
| Lock M1 topology to Tailscale Serve; demote `factory-edge` | §13.4, Non-Goals | EGM iter-1 Blocker |
| Catalog writer in thin gateway | §4.2.1 | Comprehension Blocker |
| Define Feature Assembly; fix EGM artifact paths | §7 | Comprehension Blocker |
| Align §4.7 Contract to §13.6; gate PBI-012/014; stub PBI-001 | §4.7, §6 | Design Majors |
| Trim CapacityManager/Polygraph from M1 §4.1 | §4.1 | Zoom-out Major |
| Proposed Architecture H2; fix `#### 12.1.1`; Trail-Code-only M1 atlas | after §12 / §12.2–12.3 | Structural / YAGNI |
| R-13 Beads, R-14 Serve; defer §11/16/19/20 implement | §15, §13.5 | Design Majors |
| §13.5 design-lock vs implement cut | §13.5 | Zoom-out Majors on cockpit surface |
| Trim §11.3–11.4 / §16.6 implementation weeds | §11, §16 | Zoom-out iter-2 G1 |
| `apps/factory-gateway/` in §2; implement-vs-authorship note | §2, §10 | Comprehension iter-2 Majors |
| §4.9 / §18.3 / §12.4 M1 guards | §4.9, §18.3, §12.4 | Zoom-out nits |

No Port API/MCP writes. No OAuth app create/delete.

---

## 9. Out of scope / gaps unchanged

| Gap | Disposition |
|-----|-------------|
| Rivet / Beads / Polygraph / Trail-Code skills | Still inventory Gaps; contracts live in master-spec §13 / Rivet docs |
| AG-UI / CopilotKit skills | Still Gaps; vendor evidence + §11 design suffice for M1 deferral |
| EGM local plugin path missing on this VM | Use `artifacts/elephant-goldfish-model/`; FE-40 Goldfish via Task direct-dispatch |

---

## 10. Handoff to FE-40

1. This file exists → EGM may run on **both** `factory-master-spec.md` and `factory-skill-leverage.md`.  
2. Loop log: [`egm-skill-leverage-loop.md`](./egm-skill-leverage-loop.md).  
3. Pointer from/to [`egm-master-spec-run.md`](./egm-master-spec-run.md).  
4. Stop when zero blockers and no unresolved majors, or 5 iterations.
