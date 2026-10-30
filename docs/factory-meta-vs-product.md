# Meta build vs Factory product — hard separation

**Status:** **Derived from** [`factory-master-spec.md`](./factory-master-spec.md) [§0.2](./factory-master-spec.md#02-meta-xor-product). Not an independent SoT — master first, then propagate.  
**Date:** 2026-10-28  
**Audience:** Humans and agents working Factory engineering  
**Canonical SoT:** [`factory-master-spec.md`](./factory-master-spec.md)  
**Hard rules (Johnny — mirrored from master §0):**
1. **Lane:** Meta and Product must **never** be blurred, merged, or dual-labeled. Every artifact → **exactly one** of **Meta** | **Product**, with a stated reason. Labels **shared / both / either** are forbidden. Cross-contamination is a **defect**.
2. **Unit type:** **Linear ticket = bead = GitHub issue = PBI = typed contract** — **one unit, five names.** A **PBI is the typed contract** (not a ticket that “has” a separate contract document).
3. **No untyped interfaces:** Every unit **is** the [19-field body](#pbi--typed-contract-body-canonical-fields) (C1–C3 + fields 1–16 + Spec/Verification/Refinement pointers) per master [§0.1](./factory-master-spec.md#01-unit-of-work--equivalence-chain-19-fields). Field **7** uses master [§0.7 roster](./factory-master-spec.md#07-agent-type-roster-johnny-locked). **DoR:** not startable until that body is complete. Lane is **Meta** or **Product** only — never Both.

**Related:** [`factory-workflow.md`](./factory-workflow.md) · [`factory-coding-loop.md`](./factory-coding-loop.md) · [`factory-master-spec.md`](./factory-master-spec.md)

**This doc write:** Document-only. No Port / Linear / Notion mutations.

---

## Unambiguous line

| Lane | Definition | Owns |
|------|------------|------|
| **Meta** | **Building the Factory itself** — kernel Specs/ADRs, seed PBIs PBI-001…015, this Project’s Linear/docs/meta-repo, Meta Beads, Port setup for the Factory control plane, agents/workflows that construct Factory | Builder’s boards, Meta Beads instance, Factory meta-repo, Project store `docs/`, seed PBIs (typed-contract units), Meta Port catalog/fencing for the kernel |
| **Product** | **What Factory does when it builds user projects** — product PBIs (same unit type), Product Beads *instance per product*, product Linear boards, product repos/docs, the product coding/assembly loop run *for a customer/assembled project* | Product boards, Product Beads instances, product repos, product Port projections of *that* delivery run |

**One sentence:** Meta = construct Factory; Product = Factory constructs other software.

**Never share:** Linear project/team, docs tree / repo ownership, or Beads instance across lanes ([`factory-workflow.md` Separation](./factory-workflow.md#separation--factory-meta-building-vs-factory-projects)).

**Shapes may rhyme; ownership must not.** The **unit type** is identical in both lanes (five names). Meta vs Product chooses **which instance/lane** hosts that unit — never blurs Meta Beads with Product Beads, and never labels the unit “both.”

---

## Unit type — one unit, five names

<a id="pbi--typed-contract-body-canonical-fields"></a>

Johnny lock: these are **the same entity**, not parallel queues or stacked layers:

| Name | Facet role (same unit) |
|------|------------------------|
| **Typed contract** | The unit’s full body below — **the PBI is the typed contract** |
| **PBI** | Same body (ASDLC delta + canonical fields) |
| **Linear ticket** | Human tracker facet of that same unit |
| **Bead** | Ready/claim/parallel facet — on **Meta Beads** (Meta lane) or **Product Beads** (Product lane), never a vague shared Beads |
| **GitHub issue** (+ PR / checks) | Code/CI facet of that same unit |

**Contract fields = unit shape. Lane = which instance.** The tables below are the **same shape** for every unit. Meta vs Product chooses **where** the unit lives (boards / Beads instance / repo) — **never** a second shape and **never** Both.

| Lane | Instance binding for this shape |
|------|----------------------------------|
| **Meta** | Meta Linear + **Meta Beads** + meta-repo GitHub + Meta PBI body |
| **Product** | Product Linear + **Product Beads** + product-repo GitHub + Product PBI body |

**Not the same as ASDLC Spec “Contract”.** `/specs/{domain}/spec.md` Blueprint + **Contract** (DoD / Guardrails / Scenarios) is what the unit’s Verification / Spec pointers reference. That Spec section is **not** a parallel work queue and **not** a substitute for this body. Treating “PBI” and “typed contract” as two different startable things is a **defect** (D9).

**DoR:** Unit startable iff **this entire body** is filled. Missing fields ⇒ not ready — do **not** attach a sidecar “contract” next to the PBI.

**Canonical field set:** master [§0.1](./factory-master-spec.md#01-unit-of-work--equivalence-chain-19-fields) (C1–C3 + **1–16** = **19** fields). Mirror also in [`factory-workflow.md`](./factory-workflow.md#pbi--typed-contract-body-canonical-fields) — both must match master.

### Contract core (typed I/O + writes)

| # | Field | Required content |
|---|--------|------------------|
| **C1** | **Inputs + types** | Explicit input names and types (schemas, Spec pointers, entity ids, paths) |
| **C2** | **Outputs + types** | Explicit output names and types (artifacts, evidence, entity updates, PR SHA) |
| **C3** | **Write targets** | Systems this unit may write — **Meta Beads** *xor* **Product Beads** (**exactly one** Beads instance by lane), Linear, git/GitHub, Port, Rivet, filesystem, other — no vague “Beads”, no Both |

### Operational body (1–16)

| # | Field | Required content |
|---|--------|------------------|
| **1** | **Acceptance criteria** | Measurable done-when; ties to Spec Contract scenarios / Verification pointer |
| **2** | **Exact task description** | Imperative directive — what to do, unambiguous |
| **3** | **Almost-exact directories to work in** | Paths / packages / Spec domains in scope |
| **4** | **What not to touch** | Explicit out-of-scope paths, systems, boards, Beads instances |
| **5** | **Skills to use** | Named skills / practices (e.g. ASDLC patterns) — no silent invention |
| **6** | **MCPs needed** | Named MCP servers/tools required (prefer Factory Single-MCP / Port-governed surface) |
| **7** | **Agent type required** | Master [§0.7 roster](./factory-master-spec.md#07-agent-type-roster-johnny-locked) name **and** task kind (**personal-agent** *xor* **coding-agent**); map to Coding vs Cockpit ([§18](./factory-master-spec.md)) |
| **8** | **CI requirements** | Checks / gates that must green on exact SHA for accept |
| **9** | **Dependencies** | Which PBIs/units must complete first (same equivalence-chain ids) |
| **10** | **Branch / worktree naming convention** | Exact pattern for this unit |
| **11** | **Failure / rollback behavior** | What happens on fail; how to unwind writes |
| **12** | **Reviewer for the PR** | Named human/agent reviewer |
| **13** | **Environment prerequisites** | Services that must be running (e.g. Rivet Compose, Tailscale Serve, gateway) |
| **14** | **Time estimate** | Expected effort / duration (Linear seed / planning) |
| **15** | **Secrets handling** | Required secrets, where they live, what must never be logged/committed; no plaintext secrets in the unit body |
| **16** | **Observability hook** | How progress/evidence is observed (Port audit / `deliveryRun`·`executionAttempt`, Rivet traces, CI checks, Linear updates) |

Also on the same unit (ASDLC §6): **Spec pointer**, **Verification pointer**, **Refinement rule** (default: update Spec in same PR).

**Agent/tool/pipeline edges:** Same typed rule (inputs + types, outputs + types, write targets with lane-named Beads). Prefer Port-native schemas / Spec scenarios / workflow INPUT schemas when they already type the edge ([ADR-001](./factory-master-spec.md#3-adrs--locked-decisions-accepted)); do not invent a parallel type system.

---

## PBI-007 verdict

**Verdict: Meta — wires Meta Beads into Factory-kernel admit. Does not ship Product Beads.**

| Evidence | What it says | Lane implication |
|----------|--------------|------------------|
| [`factory-master-spec.md` §6](./factory-master-spec.md#6-seed-pbis-parallel-launch) | PBI-007 directive: *ProjectSupervisor fencing + Beads ready gate; map Port `executionContract`/`deliveryRun`/`executionAttempt` projections*; Spec pointer **`factory-kernel`**; depends PBI-005/006 | Seed PBI of the **Factory kernel** launch set → Meta build work |
| [`factory-workflow.md` Meta Beads vs Product Beads](./factory-workflow.md#meta-beads-vs-product-beads) | Meta Beads **When:** *Wired for admit at **PBI-007*** (`ProjectSupervisor` + Beads ready gate). Product Beads **When:** *when Factory’s product feature to provide Beads to projects exists* — **not** the same instance | PBI-007 = Meta Beads wiring; Product Beads is a **different** feature |
| [`factory-workflow.md` A5 / OQ-1](./factory-workflow.md#a5-meta-beads--locked-hybrid-oq-1) | **OQ-1 locked hybrid:** Meta Beads scaffolded now; Linear admit SoT until PBI-007; *Does not decide Product Beads* | Timing lock is Meta-only |
| [`factory-workflow.md` A12](./factory-workflow.md#a12-other-project-defined-pieces-that-attach-later-do-not-invent-do-not-skip-naming) | **Product Beads** listed as deferred/later Project piece: *Distinct from Meta Beads; lands when that product feature exists* | Product Beads has **no** seed PBI in §6; not PBI-007 |
| [`factory-master-spec.md` §13.1](./factory-master-spec.md#131-beads--readiness--claim-graph-spec-home-factory-kernel) | Factory binding: `ProjectSupervisor` admits only when Beads reports mapped bead ready (or audited Port bypass); Spec home **factory-kernel** | Kernel admit gate = Meta runtime of Meta Beads |

**Not dual-phase.** There is no “Meta wiring that *is* Product Beads.” PBI-007 enables Meta admit with **Meta Beads**. Shipping **Product Beads** (Factory installs/runs a Beads instance *for a product project*) is a **separate Product concern** — currently deferred, not covered by PBI-007. Do not say “PBI-007 later becomes Product Beads.”

**OQ-1 remains open** (scaffold Meta Beads now vs wait until PBI-007). That open question does **not** change the lane of PBI-007.

---

## Artifact table

Every row is **Meta** or **Product** only. Reason is mandatory.

### Seed PBIs ([`factory-master-spec.md` §6](./factory-master-spec.md#6-seed-pbis-parallel-launch))

| Artifact | Lane | Reason |
|----------|------|--------|
| PBI-001 Spec stubs | **Meta** | Authors Factory domain Spec stubs in the meta-repo |
| PBI-002 Full ADRs | **Meta** | Writes Factory kernel ADRs under meta `docs/adrs/` |
| PBI-003 OpenStack/OpenProfile/AGENTS | **Meta** | Emits Factory meta-repo LogicSRC M1 required files |
| PBI-004 Rivet Compose + Tailscale | **Meta** | Stands up Factory execution kernel host |
| PBI-005 Thin factory-gateway | **Meta** | Builds Factory Port→Rivet gateway + catalog writer |
| PBI-006 Sandbox Agent + Claude Code | **Meta** | Wires Factory coding harness for kernel admits |
| **PBI-007 ProjectSupervisor + Beads ready gate** | **Meta** | Wires **Meta Beads** into Factory-kernel admit (see verdict) |
| PBI-008 Developer OS shell | **Meta** | Scaffolds Factory Developer OS (Factory control UI) |
| PBI-009 Rivet native realtime in Dev OS | **Meta** | Completes Factory Dev OS session stream |
| PBI-010 OpenAccess/OpenMCP well-knowns | **Meta** | Meta-repo auth/MCP descriptors for Factory |
| PBI-011 GitHub CI → accept on SHA | **Meta** | Factory visibility-accept path for kernel vertical slice |
| PBI-012 OpenFleet ceilings | **Meta** | Factory security blast-radius for kernel gateway |
| PBI-013 Local gate + validators | **Meta** | Factory meta-repo CI/local refuse tooling |
| PBI-014 OpenPRD 0001–0005 | **Meta** | Authors Factory’s own product-intent OpenPRDs as meta Specs (still building Factory, not running a user project) |
| PBI-015 Compound after first coding PBI | **Meta** | Compound writeback for Factory meta learnings |
| *(missing)* Product Beads ship PBI | **Product** | **Defect / gap:** Product Beads feature named in workflow A12 has **no** §6 seed PBI — must be a future **Product**-lane PBI, never folded into PBI-007 |

### ADRs ([`factory-master-spec.md` §3](./factory-master-spec.md#3-adrs--locked-decisions-accepted))

| Artifact | Lane | Reason |
|----------|------|--------|
| ADR-001 Port SoT | **Meta** | Locks Factory kernel catalog ownership |
| ADR-002 Rivet execution kernel | **Meta** | Locks Factory admit/execution architecture |
| ADR-003 Port→Rivet path | **Meta** | Locks Factory control-plane path |
| ADR-004 ASDLC Spec canonical | **Meta** | Locks how Factory authors Specs (meta method for building Factory; Product projects that later reuse ASDLC need their **own** Product Specs — separate artifacts) |
| ADR-005 Factory Port OAuth app | **Meta** | Dedicated Factory External Interface app — Factory identity, not a user-product app |
| ADR-006 Sandbox Agent harness | **Meta** | Factory coding harness decision |
| ADR-007 (superseded) | **Meta** | Historical Factory Dev OS decision |
| ADR-008 Visibility + accept on SHA | **Meta** | Factory accept path for kernel delivery |
| ADR-009 ISO 12207 mapping | **Meta** | Maps lifecycle into Factory Specs |
| ADR-010 MCP Apps pattern | **Meta** | Reference pattern for Factory MCP Apps |
| ADR-011 Dev OS = Next/Vercel + Rivet native | **Meta** | Factory Developer OS shell decision |

### Domain Specs / master-spec sections (home of authorship)

| Artifact | Lane | Reason |
|----------|------|--------|
| `factory-master-spec.md` (whole file) | **Meta** | Production plan for building Factory |
| §4.1 factory-kernel Spec | **Meta** | Kernel vertical-slice Spec |
| §4.2 port-governance Spec | **Meta** | Factory Port fencing/catalog Spec |
| §4.3 rivet-execution Spec | **Meta** | Factory Rivet Spec |
| §4.4 sandbox-harness Spec | **Meta** | Factory harness Spec |
| §4.5 developer-os Spec | **Meta** | Factory Dev OS Spec |
| §4.6 auth-port-oauth Spec | **Meta** | Factory OAuth Spec |
| Remaining §4 domain Specs | **Meta** | Seed Specs for Factory domains |
| §13.1 Beads contract | **Meta** | Spec-home factory-kernel; describes **Meta Beads** admit binding (bare name “Beads” here is a contamination defect — see below) |
| §20 Spec Canvas / Beads loop screen | **Meta** | Factory Dev OS UI design lock for meta loop chrome |
| Meta Beads instance (when live) | **Meta** | Builder’s ready/claim graph for Factory meta units |
| Product Beads instance (when shipped) | **Product** | Per-product ready/claim graph Factory provides to a user project |

### Workflow / loop docs

| Artifact | Lane | Reason |
|----------|------|--------|
| [`factory-workflow.md`](./factory-workflow.md) | **Meta** | Standardized workflow for **Factory meta-building** (this Project). Product steps/instances mentioned inside it are contamination — see defects |
| [`factory-coding-loop.md`](./factory-coding-loop.md) | **Meta** | Canonical loop for **meta** Feature Assembly against Factory Specs / seed PBIs. A Product coding loop for user projects is a **separate Product doc** (not written yet) |
| Phase A upfront setup (workflow) | **Meta** | Prerequisites for building Factory |
| Phase B coding loop pointer (workflow) | **Meta** | Points at meta coding sequence |
| OQ-1 Meta Beads timing | **Meta** | Day-zero vs PBI-007 for Meta Beads only |
| OQ-2 Notion | **Meta** | **Resolved:** Notion allowed as **mirror** of meta plans/workflow; SoT = Project store + git; Notion ≠ SoT |
| Product project Linear board | **Product** | Distinct board for a user project — never the meta board |
| Product repo / product docs tree | **Product** | Owned by the assembled product, not the Factory meta-repo |

### Research / evidence docs in Project `docs/`

These were produced as **Factory meta engineering** research. Lane = **Meta**. If a Product run later needs the same facts, cite or fork into a **Product**-lane note — do not relabel these files Product or dual.

| Artifact | Lane | Reason |
|----------|------|--------|
| [`factory-claims-verification.md`](./factory-claims-verification.md) | **Meta** | Evidence for Factory stack claims (incl. Beads G4 as vendor capability — used to justify Meta Beads wiring) |
| [`linear-factory-task-manager.md`](./linear-factory-task-manager.md) | **Meta** | Evaluates Linear for Factory task management (meta tracker design) |
| [`factory-open-standards.md`](./factory-open-standards.md) | **Meta** | Standards catalog for Factory architecture |
| [`port-factory-data-model.md`](./port-factory-data-model.md) | **Meta** | Native-first Port model for Factory kernel |
| [`port-full-capacity.md`](./port-full-capacity.md) · [`port-capabilities.md`](./port-capabilities.md) | **Meta** | Port capacity/capability research for Factory |
| [`rivet-engineering-spec.md`](./rivet-engineering-spec.md) · [`rivet-full-capacity.md`](./rivet-full-capacity.md) · [`rivet-claim-fencing.md`](./rivet-claim-fencing.md) · [`rivet-sandbox-agent.md`](./rivet-sandbox-agent.md) | **Meta** | Rivet/harness research for Factory kernel |
| [`factory-stack-audit.md`](./factory-stack-audit.md) · [`factory-stack-gap-solutions.md`](./factory-stack-gap-solutions.md) | **Meta** | Factory stack audit/gap work |
| [`factory-oss-analogs.md`](./factory-oss-analogs.md) · [`infinity-stack-fit.md`](./infinity-stack-fit.md) | **Meta** | Analog/stack-fit research for Factory |
| [`iso-12207-overview.md`](./iso-12207-overview.md) | **Meta** | Lifecycle standard input to Factory ADR-009 |
| [`egm-*.md`](./egm-master-spec-run.md) · [`factory-skill-leverage.md`](./factory-skill-leverage.md) | **Meta** | EGM/skill loops run on Factory master Spec |
| [`widget-ui-prompts.md`](./widget-ui-prompts.md) · Code Atlas lock media | **Meta** | Factory cockpit/atlas design prompts |
| [`linked-pack-ir-check.md`](./linked-pack-ir-check.md) · [`factory-master-spec-linked-docs.md`](./factory-master-spec-linked-docs.md) | **Meta** | Meta Spec pack inventory |
| Cursor Project `notes.md` / FE-* tasks | **Meta** | Coordination scratch for this Factory engineering Project only |
| `docs/factory-research-*.md` | — | **None present** in store at write time; no research-reconciliation lane conflict |

### Tools / runtimes (instance ownership)

| Artifact | Lane | Reason |
|----------|------|--------|
| Port catalog for Factory kernel (ADR-001 fencing) | **Meta** | Factory SoT for building/operating Factory |
| Port catalog projections for a **user project** delivery | **Product** | Belongs to that product’s delivery run — separate entities/boards from meta |
| Rivet `ProjectSupervisor` admitting **meta** WorkAttempts | **Meta** | Executes Factory seed/coding PBIs |
| Rivet admitting **product** WorkAttempts (when Factory runs a user project) | **Product** | Same *software* role, different **ownership** of the attempt — Product lane |
| Linear team for Factory kernel | **Meta** | Human tracker for seed PBIs |
| Linear team for a user project | **Product** | Never the meta board |
| GitHub CI on Factory meta-repo SHA | **Meta** | Accept evidence for Factory builds |
| GitHub CI on product-repo SHA | **Product** | Accept evidence for product builds |

---

## Cross-contamination defects (flagged, not smoothed)

Johnny’s rule: treat blur as **defect**, not judgment call.

| ID | Where | Defect | Resolution in this SoT |
|----|-------|--------|------------------------|
| **D1** | [`factory-coding-loop.md`](./factory-coding-loop.md) tool map / Step 1 | Bare **“Beads”** tied to PBI-007 without **Meta Beads** | Interpret as **Meta Beads** only. Product claim graph = Product Beads in a **separate** Product loop doc (not yet authored). |
| **D2** | [`factory-workflow.md`](./factory-workflow.md) sync model table | Cell says **“Meta Beads or Product Beads”** | Dual phrasing forbidden. Sync model for **this** doc’s units = **Meta Beads** facet. Product units sync to **Product Beads** under Product ownership — different table/row, not one “or”. |
| **D3** | [`factory-workflow.md`](./factory-workflow.md) Phase B step 1 | “claim via Meta/Product Beads” | Slash dual-label. Meta loop claims via **Meta Beads**; Product loop claims via **Product Beads**. |
| **D4** | [`factory-workflow.md`](./factory-workflow.md) audience + Separation + A12 Product Beads | Meta workflow file hosts Product-lane definitions | Doc lane = **Meta**. Product Beads / product boards content is **Product** concern embedded in a Meta file — keep names for now, but treat as defect until Product content moves to a Product-lane doc (e.g. future `factory-product-workflow.md`). |
| **D5** | [`factory-master-spec.md` §13.1](./factory-master-spec.md#131-beads--readiness--claim-graph-spec-home-factory-kernel) | Says “Beads” without Meta qualifier while binding `ProjectSupervisor` | Binding is **Meta Beads** (factory-kernel / PBI-007). Product Beads ≠ this section. |
| **D6** | [`factory-open-standards.md`](./factory-open-standards.md) mapping shorthand | Single “Beads / Polygraph / Trail-Code” row | Research shorthand for Factory meta stack. Product Beads is not this row. |
| **D7** | Missing Product Beads PBI | Workflow names Product Beads feature; §6 has no Product PBI | Gap: add a future **Product**-lane PBI when shipping; **never** extend PBI-007 to cover it. |
| **D8** | Similar five-step loop for both lanes | Risk of one loop doc serving both | `factory-coding-loop.md` = **Meta**. Product loop = separate Product artifact when needed. |
| **D9** | [`factory-workflow.md`](./factory-workflow.md) Hard rules / A4 DoR (pre-lock wording) | Spoke as if a PBI waits for a **separate** “typed contract” to exist | **PBI is the typed contract.** DoR = PBI incomplete (missing inputs/outputs/write targets) ⇒ not startable — not a second artifact. |
| **D10** | [`factory-workflow.md`](./factory-workflow.md) sync model (four names) | Listed bead / PBI / Linear / GitHub without **typed contract** as the fifth name of the same unit | Unit type = **five names**; typed contract ≡ PBI. |
| **D11** | [`factory-coding-loop.md`](./factory-coding-loop.md) Step 1 | Lists Bead, Linear ticket, PBI as alternate drivers without stating they are facets of one typed-contract unit | Interpret as **one unit, five names**; claim facet = **Meta Beads** for this Meta loop. |
| **D12** | Blurring unit typed contract with ASDLC Spec Contract | Using Spec Contract scenarios as if they replaced PBI typed I/O/write targets (or vice versa) | Spec Contract = verification scenarios the PBI **points at**. Unit typed contract = the PBI itself. |

**Ambiguous / crossed items resolved:** **12** (D1–D12), plus PBI-007 → **Meta** (not dual-phase). Unit-type lock: PBI ≡ typed contract.

---

## How to classify new work (checklist)

1. Whose board / Beads instance / repo owns the unit? → that lane (**Meta** or **Product** only).  
2. Is the unit’s [canonical body](#pbi--typed-contract-body-canonical-fields) complete (C1–C3 + fields **1–16** + Spec/Verification/Refinement), with Beads write target = **Meta Beads** *xor* **Product Beads**, and field **7** = §0.7 roster + personal-agent/coding-agent? If not → **not startable**.  
3. Is it a §6 seed PBI or Factory meta-repo change? → **Meta**.  
4. Is it Factory assembling/building a **user** project’s code, tickets, or Product Beads? → **Product**.  
5. If unsure, **do not** pick “both” — stop and ask; default to Meta only for this Project’s FE-* coordination work.  
6. If a sentence needs both lane names, **split into two sentences** (one Meta, one Product).  
7. Never invent a “contract” sidecar next to a PBI — fill the PBI.

---

## Document control

| Doc | Role |
|-----|------|
| **This file** | **Derived** Meta XOR Product elaboration + unit-type lock (must match master §0.1 / §0.2 / §0.7) |
| [`factory-workflow.md`](./factory-workflow.md) | **Derived** Meta workflow |
| [`factory-coding-loop.md`](./factory-coding-loop.md) | **Derived** Meta coding sequence (Beads = Meta Beads; unit = five names) |
| [`factory-master-spec.md`](./factory-master-spec.md) | **Single canonical SoT** |
