# Factory workflow (standardized)

**Status:** **Derived from** [`factory-master-spec.md`](./factory-master-spec.md) (§0 Document authority). Not an independent SoT — master first, then propagate.  
**Date:** 2026-10-28  
**Audience:** Humans and **any eligible coding/cockpit / personal-agent** standing up Factory meta-building or a Factory product project  
**Canonical SoT:** [`factory-master-spec.md`](./factory-master-spec.md)  
**Coding sequence (derived):** [`factory-coding-loop.md`](./factory-coding-loop.md) — order locked in master [§0.4](./factory-master-spec.md#04-coding-loop-order-locked--five-steps): **task → standardize → PR → build → loop** (no independent-review step)  
**Native-first Port model:** [`port-factory-data-model.md`](./port-factory-data-model.md) · [ADR-001](./factory-master-spec.md#3-adrs--locked-decisions-accepted)  
**Agent classes + roster:** master [§18](./factory-master-spec.md) · [§0.7](./factory-master-spec.md#07-agent-type-roster-johnny-locked)

This document is the **standardized workflow** derived from the master: what must exist **before** Feature Assembly / coding, how meta-building stays separate from product projects, how work stays **synced across tools**, and how the [coding loop](./factory-coding-loop.md) attaches. It does **not** replace the master or invent tools/steps/agents beyond what the master defines.

**This doc write:** describes prerequisites and sequence only. **No Port mutations. No Linear writes. No Notion writes.**

---

## Hard rules

> **Equivalence chain (Johnny confirmed — canonical):** Linear tickets, beads, GitHub issues, PBIs, and typed contracts are **ALL the same unit of work** — five names across five tools. A **PBI IS a typed contract** (inputs, outputs, write targets, plus the [full body fields](#pbi--typed-contract-body-canonical-fields)). Referring to any one refers to all. Future agents must **NOT** treat them as separate concepts. **Meta Beads** vs **Product Beads** are two *instances* of the Beads facet for different lanes — **not** two different unit types.

| Rule | Meaning |
|------|---------|
| **Equivalence chain** | See callout above. One unit type; five tool names. PBI ≡ typed contract ≡ Linear ticket ≡ bead ≡ GitHub issue (mapped facets of the same entity). |
| **Typed contracts everywhere** | **EVERYTHING gets a typed contract.** Every PBI (the unit), every agent action, every tool call, every pipeline step must declare the [canonical body](#pbi--typed-contract-body-canonical-fields) — at minimum inputs+types, outputs+types, write targets, plus Johnny’s operational fields. No untyped or implicit interfaces. **Definition-of-ready:** a PBI/unit is not startable until this contract body exists. Prefer Port-native schemas / Spec Contract scenarios / workflow INPUT schemas where they already cover the surface ([ADR-001](./factory-master-spec.md#3-adrs--locked-decisions-accepted), Spec Contract in [§1](./factory-master-spec.md#1-artifact-hierarchy-asdlc)) — still native-first; do not invent a parallel type system when Port or the Spec already types the edge. |
| **Agent-agnostic loop** | **Cursor is not the only agent.** The loop is defined by this workflow + [`factory-coding-loop.md`](./factory-coding-loop.md), not by which agent executes it. Any [§0.7 roster](./factory-master-spec.md#07-agent-type-roster-johnny-locked) agent whose **task kind** matches the unit may pick up ready work: **coding-agent** → **task → standardize → PR → build → loop**; **personal-agent** → Port/browser/provisioning (Cockpit) path. |
| **Synced state, not agent memory** | Ready work lives in shared systems. Agents read/claim/update synced state — they do not own the queue in private memory. See [Sync model](#sync-model--one-unit-of-work). |
| **Native first (Port)** | Do not reinvent anything Port already has. Prefer Port built-ins — blueprints, entities, relations, mirror relations, MCP servers / registry, actions/workflows (incl. workflows-as-tools), automations, scorecards, RBAC, audit, Context Lake, External Interfaces, Ocean connectors — over custom code or third-party workarounds wherever Port covers it ([ADR-001](./factory-master-spec.md#3-adrs--locked-decisions-accepted), [port-factory-data-model.md](./port-factory-data-model.md)). |
| **No second catalog** | Agents bind live Port blueprint/workflow names; do not invent parallel Port tool IDs ([master §9 ASSUMPTION 11](./factory-master-spec.md#9-explicit-assumptions-not-open-questions)). |
| **Coding loop order** | Always **task → standardize → PR → build → loop** ([factory-coding-loop.md](./factory-coding-loop.md)). |
| **Tool map soft-locked** | Roles locked; today’s products may evolve if the **role** stays the same ([coding loop — Today’s tools](./factory-coding-loop.md#todays-tools-mapped-not-hard-locked)). |
| **Meta ≠ product** | Factory meta-building and Factory product projects never share Linear boards, docs trees, or Beads **instances** (see [Separation](#separation--factory-meta-building-vs-factory-projects) and [Meta vs Product Beads](#meta-beads-vs-product-beads)). The **unit type is one** (equivalence chain); the Meta vs Product *instance* stays separate. Write targets that touch Beads must name **Meta Beads** or **Product Beads** explicitly — never a vague “Beads” that blurs lanes. |
| **Accept path** | Port accept + GitHub CI on **exact SHA** ([ADR-008](./factory-master-spec.md#3-adrs--locked-decisions-accepted)). Agent “done” ≠ accept. |
| **notes.md** | Cursor Project `notes.md` = coordination only — not Spec, not coding SoT, not accept, not the work queue. |

---

## Sync model — one unit of work

> **Equivalence chain (Johnny confirmed):** Linear tickets, beads, GitHub issues, PBIs, and typed contracts are **ALL the same unit of work** — five names across five tools. A **PBI IS a typed contract** (inputs, outputs, write targets, plus the [canonical body fields](#pbi--typed-contract-body-canonical-fields)). Referring to any one refers to all. Future agents must **NOT** treat them as separate concepts.

Creating or updating in one place **maps** to the others. They are not separate concepts or parallel queues. **Meta Beads** and **Product Beads** are two *instances* hosting the Beads facet for different lanes — same unit type, different instance ownership ([Meta vs Product Beads](#meta-beads-vs-product-beads)).

| Facet name | Tool / surface | What this facet owns for that same unit |
|------------|----------------|-------------------------------------------|
| **Bead** | **Meta Beads** or **Product Beads** instance (when that instance is in force) | Readiness, claim, and what can run in parallel ([§13.1](./factory-master-spec.md#131-beads--readiness--claim-graph-spec-home-factory-kernel)) |
| **PBI / typed contract** | ASDLC delta + [canonical body](#pbi--typed-contract-body-canonical-fields) ([§6](./factory-master-spec.md#6-seed-pbis-parallel-launch)) | The unit’s full typed contract — Directive · Spec pointer · Verification · Refinement · inputs/outputs/write targets · operational fields below |
| **Linear ticket** | Linear | Human-facing tracker / visibility for that same unit |
| **GitHub issue** (+ PR / checks) | git / GitHub | Code change surface, PR, CI on SHA for that same unit |

**Four planes stay in sync** (each plane’s SoT role for facets of the same unit):

| Plane | SoT for |
|-------|---------|
| **Beads** (Meta or Product *instance* — when started / shipped) | Readiness, claim, parallel runnable set |
| **Linear** | Human-facing tracker / visibility |
| **git** | PRs, CI, code |
| **Port** | Accept, governance, catalog state (incl. `executionContract` / `deliveryRun` / `executionAttempt` projections of the same unit) |

**Pickup rule:** Any eligible agent may pick up any **ready** unit anytime by reading synced state (Beads ready/claim when in force; otherwise Linear/PBI until Meta Beads wiring lands). State is **not** “in one agent’s memory.” Refuse start if the [canonical contract body](#pbi--typed-contract-body-canonical-fields) is incomplete.

**Until PBI-007 (Meta Beads admit-wired):** Linear + PBI/typed-contract (+ optional `tasks/PBI-*` / GitHub issue mirror) still represent the **same** unit; Meta Beads is **scaffolding-only** (OQ-1 hybrid locked) — Linear remains admit/claim SoT. See [A5](#a5-meta-beads--locked-hybrid-oq-1).

---

## PBI / typed-contract body (canonical fields)

A startable unit **is** this body. Fill every field before claim/start (DoR). Prefer Port-native / Spec Contract / workflow INPUT schemas for typed edges where they already exist.

### Contract core (typed I/O + writes)

| # | Field | Required content |
|---|--------|------------------|
| **C1** | **Inputs + types** | Explicit input names and types (schemas, Spec pointers, entity ids, paths) |
| **C2** | **Outputs + types** | Explicit output names and types (artifacts, evidence, entity updates, PR SHA) |
| **C3** | **Write targets** | Systems this unit may write — **Meta Beads** *xor* **Product Beads** (exactly one instance by lane; never Both), Linear, git/GitHub, Port, Rivet, filesystem, other — no vague “Beads” |

### Operational body (Johnny + additions)

| # | Field | Required content |
|---|--------|------------------|
| **1** | **Acceptance criteria** | Measurable done-when; ties to Spec Contract scenarios / Verification pointer |
| **2** | **Exact task description** | Imperative directive — what to do, unambiguous |
| **3** | **Almost-exact directories to work in** | Paths / packages / Spec domains in scope |
| **4** | **What not to touch** | Explicit out-of-scope paths, systems, boards, Beads instances |
| **5** | **Skills to use** | Named skills / practices (e.g. ASDLC patterns) — no silent invention |
| **6** | **MCPs needed** | Named MCP servers/tools required (prefer Factory Single-MCP / Port-governed surface) |
| **7** | **Agent type required** | **Two tags required** (master [§0.7](./factory-master-spec.md#07-agent-type-roster-johnny-locked)): (a) task kind — **`personal-agent`** *xor* **`coding-agent`**; (b) roster name — Muse · ChatGPT regular · ChatGPT Work · Codex · Grok · Claude · Claude Code · Claude Design (extensible via master-first). Map to §18 Cockpit / Coding. Do not assign Port/browser/provisioning to a coding-agent-only unit. |
| **8** | **CI requirements** | Checks / gates that must green on exact SHA for accept |
| **9** | **Dependencies** | Which PBIs/units must complete first (same equivalence chain ids) |
| **10** | **Branch / worktree naming convention** | Exact pattern for this unit |
| **11** | **Failure / rollback behavior** | What happens on fail; how to unwind writes |
| **12** | **Reviewer for the PR** | Named human/agent reviewer |
| **13** | **Environment prerequisites** | Services that must be running (e.g. Rivet Compose, Tailscale Serve, gateway) |
| **14** | **Time estimate** | Expected effort / duration for the unit (for Linear seed / planning) |
| **15** | **Secrets handling** | Which secrets are required, where they live, what must never be logged/committed; no plaintext in the unit body |
| **16** | **Observability hook** | How progress/evidence is observed (e.g. Port audit / `deliveryRun`·`executionAttempt`, Rivet traces, CI checks, Linear updates) |

Also retain ASDLC §6 pointers on the same unit: **Spec pointer**, **Verification pointer**, **Refinement rule** (default: update Spec in same PR).

---

## Agent classes & Johnny roster (derived from master §0.7 / §18)

**Canonical vocabulary lives in master [§0.7](./factory-master-spec.md#07-agent-type-roster-johnny-locked).** This section must match that table. The loop is **agent-agnostic** — not Cursor-only. Every unit’s field **7** must name **task kind + roster agent type**.

### Task-kind distinction (contract must pick one)

| Task kind | Fits | Does **not** fit | §18 class |
|-----------|------|------------------|-----------|
| **`personal-agent`** | Port / browser / provisioning / passwords/computer-use / human-operator breadth | Pure admitted coding `WorkAttempt` inside Sandbox Agent when the unit is coding-only | **Cockpit** |
| **`coding-agent`** | Write/execute code for one admitted `WorkAttempt` (Rivet **Sandbox Agent**; **task → standardize → PR → build → loop**). Cannot self-accept. | Provisioning / Port UI / browser / password-bearing personal computer use | **Coding** |

**Do not blur:** a coding-agent unit must not require Port UI/browser provisioning; a personal-agent unit (e.g. Muse provisioning) must not be mis-tagged as coding-agent.

### Named agent-type roster (Johnny locked — master §0.7)

| Agent type | Default task kind | Notes |
|------------|-------------------|-------|
| **Muse** | personal-agent | Personal / provisioning (Port, browser) |
| **ChatGPT regular** | personal-agent (default) | May be named coding-agent when the unit says so |
| **ChatGPT Work** | personal-agent (default) | Work-scoped; contract still picks one task kind |
| **Codex** | coding-agent | SA in-sandbox process ([§18.1](./factory-master-spec.md)) |
| **Grok** | personal-agent (default) | May be named coding-agent when the unit says so |
| **Claude** | personal-agent (default) | General — not Claude Code / Claude Design |
| **Claude Code** | coding-agent | M1 first harness ([PBI-006](./factory-master-spec.md#6-seed-pbis-parallel-launch), ADR-006) |
| **Claude Design** | personal-agent | Design / UI provision-style — not SA coding admit by default |

**Extensibility:** append new roster names in **master §0.7 first**, then propagate here. Do not invent tags ad hoc on a PBI. Field 7 = `{task-kind} + {roster-name}`.

### Factory harness bindings already in Project (coding path)

| Named binding | Source | Notes |
|---------------|--------|-------|
| **Rivet Sandbox Agent + Docker** | [ADR-006](./factory-master-spec.md#3-adrs--locked-decisions-accepted), [§4.4](./factory-master-spec.md#44-specssandbox-harnessspecmd), [PBI-006](./factory-master-spec.md#6-seed-pbis-parallel-launch) | Coding harness; browser never calls SA |
| **Claude Code** (M1 first harness) | PBI-006; [§9 ASSUMPTION 3](./factory-master-spec.md#9-explicit-assumptions-not-open-questions) | Roster coding-agent; first in-sandbox coding process for M1 |
| **Other SA-documented in-sandbox processes** in [§18.1](./factory-master-spec.md): Codex / OpenCode / Cursor / Amp / Pi | §18.1 | Eligible as **coding-agent** processes inside SA when chosen — Codex is on roster; others require master §0.7 extension first |
| **OpenAgent** stub `agents/coder.factory.json` | [§13.6](./factory-master-spec.md#136-m1-logicsrc-emission-cut-resolves-egm-m3) | Optional LogicSRC stub for sandbox-harness |

Rivet **Actors** (orchestration) ≠ Sandbox Agent (in-sandbox coding) ≠ personal Muse-class computer use.

### Named but not roster agents

| Name | Why listed |
|------|------------|
| **Polygraph** | Agent-agnostic **meta-harness** (“isn’t an agent”) — post–single-repo M1 ([§13.2](./factory-master-spec.md#132-polygraph--multi-repo-meta-harness-spec-home-factory-kernel--visibility)) |
| **Trail-Code** | In-sandbox code map — not an agent ([§13.3](./factory-master-spec.md#133-trail-code--code-map-spec-home-developer-os--sandbox)) |
| Cursor Project FE-* workers / `notes.md` | **Coordination scratch** — not exclusive coding path, not a Johnny roster tag |

---

## Separation — Factory meta-building vs Factory projects

**Lane SoT:** [`factory-meta-vs-product.md`](./factory-meta-vs-product.md) — Meta **or** Product only (never Both); unit type = Linear = bead = GitHub issue = PBI = typed contract; canonical body fields live there and in [PBI / typed-contract body](#pbi--typed-contract-body-canonical-fields) below. Contract fields = unit shape; lane = which instance.

| Plane | What it is | Linear | Docs / repos | Beads |
|-------|------------|--------|--------------|-------|
| **Factory meta-building** | Building the Factory itself — this Project, [`factory-master-spec.md`](./factory-master-spec.md), seed PBIs for the kernel | **Distinct** Linear project/team for Factory kernel / meta | Project store `docs/` + Factory **meta-repo** (`/specs/`, `docs/adrs/`, `apps/factory-gateway/`, … per [§2](./factory-master-spec.md#2-repository-layout-mandated)) | **Meta Beads** (builder’s tool) |
| **Factory projects** | Products **assembled/built using** Factory | **Distinct** Linear project(s)/team(s) — never the meta board | Distinct product docs folders and/or product repos | **Product Beads** (Factory ships this) when that feature exists |

**Never mix boards, docs trees, or Beads instances.** Same unit shape ([canonical body](#pbi--typed-contract-body-canonical-fields)) and same [unit-of-work sync](#sync-model--one-unit-of-work); different ownership / instance.

**Git:** Factory **meta-repo** for kernel Specs/ADRs/gateway/Dev OS shell; **separate product repos** for assembled products. Polygraph multi-repo coordination is **post–single-repo M1** ([§13.2](./factory-master-spec.md#132-polygraph--multi-repo-meta-harness-spec-home-factory-kernel--visibility)).

---

## Meta Beads vs Product Beads

**Do not conflate.** Two *instances*, two scopes, two names — **not** two unit types. The [equivalence chain](#sync-model--one-unit-of-work) unit type stays one; only which Beads *instance* hosts the bead facet changes.

| | **Meta Beads** | **Product Beads** |
|--|----------------|-------------------|
| **What** | Builder’s tool — Beads **instance** for **Factory meta-building** | Factory **ships** Beads integrated as a component so **Factory projects** get their own ready/claim/parallelism **instance** |
| **Scope** | Kernel / this Project / meta-repo units | Product delivery runs / product repos |
| **When** | Wired for admit at **[PBI-007](./factory-master-spec.md#6-seed-pbis-parallel-launch)** (`ProjectSupervisor` + Beads ready gate). **Scaffolded now** (OQ-1 hybrid locked) — Linear still admit/claim SoT until PBI-007 | When Factory’s product feature to provide Beads to projects exists (Factory ships it — not the same instance as Meta Beads) |
| **Sync role** | Meta ready/claim/parallel SoT for meta units of work | Product ready/claim/parallel SoT for product units of work |
| **Must not** | Share instance or board with product projects; blur into a second unit type | Be confused with Meta Beads, replace Linear human visibility, or imply a different unit type |

CLI shape (both instances, when in force): `bd ready` → `bd update --claim` → `bd close` ([§13.1](./factory-master-spec.md#131-beads--readiness--claim-graph-spec-home-factory-kernel)).

---

## Phase A — Upfront setup (before any build / Feature Assembly)

Complete these **before** coding Feature Assembly against a Spec. Order within A is pragmatic; **Port native setup is a hard prerequisite** alongside Spec placement, git, and Linear/PBI connection. Meta Beads: **OQ-1 hybrid locked** — scaffold now; Linear admit SoT until PBI-007 ([A5](#a5-meta-beads--locked-hybrid-oq-1)).

### A1. Spec placement

| Where | Role |
|-------|------|
| **Project store `docs/`** | Working / review home for the production plan and companion reports (this Project’s current SoT surface) |
| **Git `/specs/{domain}/spec.md`** | **Canonical** agent build-against state once the meta-repo (or product repo) exists ([§1](./factory-master-spec.md#1-artifact-hierarchy-asdlc), [ADR-004](./factory-master-spec.md#3-adrs--locked-decisions-accepted)) |

Each Spec = Blueprint (Context / Architecture / Constraints) + Contract (DoD / Guardrails / Scenarios). Skeleton in [§2](./factory-master-spec.md#2-repository-layout-mandated). Ten domain Spec stubs: [§4](./factory-master-spec.md#4-domain-specs-to-produce-parallel) · seed [PBI-001](./factory-master-spec.md#6-seed-pbis-parallel-launch).

**Maturity:** Spec-anchored — runtime code remains SoT for execution.

### A2. Port upfront (native first — hard prerequisite)

**Everything in Port that Factory needs must be set up before build work** — prefer configuring Port natives over writing custom substitutes.

| Port native | Factory use (already defined) | Sources |
|-------------|------------------------------|---------|
| **Blueprints + entities** | Catalog types/instances: e.g. `product`, `service`, `executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner`, `bot`, `_mcp_server`, `agentPlugin`, `skill`, `harness_session`, stack modules (`stackTemplate`, `provider`, `convexComponent`, `shadcn*`, …) | [§4.2](./factory-master-spec.md#42-specsport-governancespecmd), [port-factory-data-model.md](./port-factory-data-model.md) |
| **Relations + mirror relations** | Graph edges and derived fields; compatibility for assemble-first | [§4.2.2](./factory-master-spec.md#422-machine-validated-stack-assembly), port-factory-data-model |
| **MCP servers / registry** | `_mcp_server` and Port MCP gateway; Single-MCP principle for Cockpit | [§4.2](./factory-master-spec.md#42-specsport-governancespecmd), [§18](./factory-master-spec.md) |
| **Actions / workflows (+ expose as tools)** | Live `factory_*` workflows (create contract, start delivery, claim, heartbeat, evidence, review, release) — humans and agents same surface | [§4.2](./factory-master-spec.md#42-specsport-governancespecmd) |
| **Automations** | Event-driven catalog updates (still Port SoT; writes via fencing) | port-factory-data-model |
| **Scorecards** | Quality / readiness rules on entities (e.g. agent readiness) | ADR-008 visibility; port-factory-data-model |
| **RBAC** | Who can read/register/update; self-service action RBAC; machine ≠ interactive paths | [§4.2](./factory-master-spec.md#42-specsport-governancespecmd), security Spec |
| **Audit** | Mutation trail; independent of agent self-report | ADR-001 / ADR-008 |
| **Context Lake + Ocean connectors** | Sync GitHub / Linear / Vercel / Convex (and custom Ocean where needed) into entities — supports [unit-of-work mapping](#sync-model--one-unit-of-work) | [§4.2](./factory-master-spec.md#42-specsport-governancespecmd) |
| **External Interfaces** | Intended dedicated **Factory** OAuth app for humans+agents ([ADR-005](./factory-master-spec.md#3-adrs--locked-decisions-accepted)) — **create deferred**; see [Observatory note](#a10-observatory--oauth-adr-005) |
| **Catalog write fencing §4.2.1** | Single-writer per `{blueprint}:{entityIdentifier}` + `catalogVersion` reject-stale; writer lives in thin **factory-gateway** (not Rivet, not “raw dual-write”) | [§4.2.1](./factory-master-spec.md#421-canonical-port-catalog-write-fencing-no-upsert-cas-fix), [port-factory-data-model.md](./port-factory-data-model.md) §4.1 |
| **Assemble-first validation** | Machine-validated stack compatibility **in Port** before provision / Coding admit | [§4.2.2](./factory-master-spec.md#422-machine-validated-stack-assembly) |

### A3. Git repo init + mandated layout

Initialize the appropriate git repo (meta-repo vs product repo — see [Separation](#separation--factory-meta-building-vs-factory-projects)). Mandated layout ([§2](./factory-master-spec.md#2-repository-layout-mandated)):

```txt
/
  AGENTS.md
  OpenStack.md
  specs/{domain}/spec.md          # ten domains per §4
  docs/adrs/                      # full ADR bodies (PBI-002)
  docs/…                          # production plan + companions
  tasks/PBI-*.md                  # optional mirror of the same unit
  prd/  agents/  workflows/        # LogicSRC as Contracts demand
  apps/developer-os/              # Next.js → Vercel
  apps/factory-gateway/           # HMAC + §4.2.1 writer + enqueue supervisor
  bin/install.sh
  .well-known/                    # OpenStack / OpenProfile / OpenMCP / OpenAccess
```

### A4. Linear + PBIs (ticket standard — same unit)

| Binding | Detail |
|---------|--------|
| **Human tracker** | **Linear** issues/projects; agent I/O via Linear MCP or SDK ([linear-factory-task-manager.md](./linear-factory-task-manager.md)) |
| **Ticket form** | **PBIs are the standard form** for those tickets — map master [§6](./factory-master-spec.md#6-seed-pbis-parallel-launch): Directive · Spec pointer · Verification pointer · Refinement rule (default: update Spec in same PR) |
| **Same unit** | Linear issue **is** the PBI facet of the [synced unit](#sync-model--one-unit-of-work); maps to bead / GitHub issue when those facets exist |
| **Typed contract (DoR)** | Unit not startable until the [canonical PBI/typed-contract body](#pbi--typed-contract-body-canonical-fields) is complete (C1–C3 + fields 1–16). PBI **IS** that contract ([equivalence chain](#sync-model--one-unit-of-work)). |
| **Accessibility** | Prefer Port/Linear MCP for PBI state; optional `tasks/PBI-*` mirror |
| **Atomicity** | Concurrent units must not share write sets — see [Collision avoidance](#collision-avoidance--claims-worktrees-file-scope) |
| **Boards** | Meta units on meta Linear project; product units on product Linear project(s) — never mixed |

Seed PBIs PBI-001…015 remain the meta launch set in the master Spec.

### A5. Meta Beads — LOCKED hybrid (OQ-1)

Applies to **Meta Beads** only (see [Meta vs Product Beads](#meta-beads-vs-product-beads)). **Johnny locked 2026-10-29:** hybrid.

| Lock | Meaning |
|------|---------|
| **Scaffold now** | Meta Beads initialized in Factory meta-repo (`.beads/`, prefix `factory-`) for deps / `bd ready` practice |
| **Linear = admit/claim SoT until PBI-007** | Human tracker + admit authority stay on Linear/PBI until `ProjectSupervisor` + Meta Beads ready gate lands |
| **Not day-one human board** | Do not treat Beads as the human queue or as Rivet admit authority before PBI-007 |
| **Product Beads** | Unchanged — not this lock; never share Meta Beads instance |

Admit role remains locked from **[PBI-007](./factory-master-spec.md#6-seed-pbis-parallel-launch)** onward. Detail: [`meta-beads-scaffold.md`](./meta-beads-scaffold.md).

### A6. ADR authorship

Write full Nygard ADRs under `docs/adrs/` before coding the affected domain ([§3](./factory-master-spec.md#3-adrs--locked-decisions-accepted), [PBI-002](./factory-master-spec.md#6-seed-pbis-parallel-launch)). Bodies immutable; supersede, don’t edit. Locked set includes ADR-001…006, 008–011 (ADR-007 superseded by ADR-011).

### A7. M1 LogicSRC emit (interop files — not primary IR)

Emit only what M1 Contracts require ([§13.6](./factory-master-spec.md#136-m1-logicsrc-emission-cut-resolves-egm-m3), [PBI-003](./factory-master-spec.md#6-seed-pbis-parallel-launch) / [PBI-010](./factory-master-spec.md#6-seed-pbis-parallel-launch)):

| Required M1 | Artifact |
|-------------|----------|
| Index | `AGENTS.md` (index only — no design dump) |
| Stack catalog | `OpenStack.md` + `/.well-known/openstack.md` |
| Profile | `/.well-known/openprofile.md` |
| MCP well-known | `/.well-known/openmcp.json` |
| Access descriptor | `/.well-known/openaccess.json` (descriptor only; Port issues tokens — no OpenAccess hub in v1) |

Optional stub: OpenAgent `agents/coder.factory.json`. Validate with `@logicsrc/validators` / local gate ([PBI-013](./factory-master-spec.md#6-seed-pbis-parallel-launch)). LogicSRC is **interop emission**, not primary IR ([ADR-004](./factory-master-spec.md#3-adrs--locked-decisions-accepted)).

### A8. Execution plane (when standing up runtime — still “upfront” vs Feature Assembly coding)

These are already Project-defined; stand them up on the meta path before admitting coding work for the vertical slice ([§13.0 Goals](./factory-master-spec.md#130-problem--goals--non-goals), [§13.5](./factory-master-spec.md#135-m1-first-wave-authorship-cut-resolves-b1-without-deleting-4-6)):

| Component | Binding | Sources |
|-----------|---------|---------|
| **Rivet 2.x** | Execution kernel; desktop Docker Compose | [ADR-002](./factory-master-spec.md#3-adrs--locked-decisions-accepted), [§4.3](./factory-master-spec.md#43-specsrivet-executionspecmd), [PBI-004](./factory-master-spec.md#6-seed-pbis-parallel-launch) |
| **ProjectSupervisor** | Single admission queue per project; never polls Port | ADR-002, [rivet-claim-fencing.md](./rivet-claim-fencing.md) |
| **Tailscale Serve** | HTTPS publish for gateway + Actor HTTP/SSE (M1 locked; Funnel optional elevated exposure; no `factory-edge` in M1) | [§13.4](./factory-master-spec.md#134-topology--desktop-rivet--vercel-developer-os-resolves-m8) |
| **Thin factory-gateway** | Port webhook HMAC verify → enqueue supervisor; hosts §4.2.1 catalog writer | [§2](./factory-master-spec.md#2-repository-layout-mandated), [PBI-005](./factory-master-spec.md#6-seed-pbis-parallel-launch) |
| **Sandbox Agent + Docker** | In-sandbox HTTP SDK; Rivet Actor owns session; browser never calls SA | [ADR-006](./factory-master-spec.md#3-adrs--locked-decisions-accepted), [§4.4](./factory-master-spec.md#44-specssandbox-harnessspecmd), [PBI-006](./factory-master-spec.md#6-seed-pbis-parallel-launch), [rivet-sandbox-agent.md](./rivet-sandbox-agent.md) |
| **Developer OS** | Next.js App Router on Vercel; Rivet Actor **native** realtime (no CopilotKit in kernel) | [ADR-011](./factory-master-spec.md#3-adrs--locked-decisions-accepted), [§4.5](./factory-master-spec.md#45-specsdeveloper-osspecmd), [PBI-008](./factory-master-spec.md#6-seed-pbis-parallel-launch)/[009](./factory-master-spec.md#6-seed-pbis-parallel-launch) |
| **CI accept / visibility** | GitHub Actions on exact SHA; Port audit + Rivet traces + scorecards (+ Polygraph inputs post-M1 as defined) | [ADR-008](./factory-master-spec.md#3-adrs--locked-decisions-accepted), [PBI-011](./factory-master-spec.md#6-seed-pbis-parallel-launch), visibility Spec |
| **Local gate** | typecheck, tests, `@logicsrc/validators`, lint — refuse dirty/invalid | [§7](./factory-master-spec.md#7-context-gates--workflow-as-code), [PBI-013](./factory-master-spec.md#6-seed-pbis-parallel-launch) |

**Path (locked):** Port (SoT) → webhook HMAC → thin gateway → Rivet `ProjectSupervisor` → Sandbox Agent (Docker) / Coding agent → GitHub → CI green on SHA → Port accept.

### A9. Context gates before Feature Assembly

Between Spec phases ([§7](./factory-master-spec.md#7-context-gates--workflow-as-code)):

| Gate | When |
|------|------|
| **Spec review** | Blueprint+Contract present before Feature Assembly |
| **EGM Goldfish (feature_spec)** | Fresh-context critic green on Spec (or production plan when targeted); artifact roots = Project `docs/` + `internal/egm-*/` |
| **Local gate / CI** | During PR/build (coding loop steps 3–4) |
| **Adversarial review** | Critic/human vs Contract (optional CE `/ce-code-review` surface) |
| **Compound writeback** | After verified coding unit — HITL `/ce-compound` → `docs/solutions/`; `AGENTS.md` stays index ([PBI-015](./factory-master-spec.md#6-seed-pbis-parallel-launch)) |
| **Port accept** | Governance; independent of agent “done” |

### A10. Observatory / OAuth (ADR-005)

- **Intended:** dedicated Factory Port External Interface OAuth app (humans + agents same Port surface).  
- **Never** reuse Harness Observatory client for Factory / Developer OS.  
- **Execution deferred** — document create params only; **no live Port create/delete** from this workflow or master Spec unless Johnny explicitly authorizes (incl. any Observatory revoke). FREEMIUM / Observatory presence = context only ([ADR-005](./factory-master-spec.md#3-adrs--locked-decisions-accepted), [§4.6](./factory-master-spec.md#46-specsauth-port-oauthspecmd)).

### A11. Notion — resolved (mirror allowed; not SoT)

**OQ-2 resolved (Johnny):** Notion is **allowed** for mirrored copies of Factory **meta-lane** plans/workflow docs (“why not”). **SoT remains Project store `docs/` + git repo** (`/specs/`, etc.). Notion is **not** source of truth, not part of the [equivalence chain](#sync-model--one-unit-of-work) / synced unit, not Spec/accept/claim.

| Note | Detail |
|------|--------|
| **SoT** | Project store `docs/` + git repo only |
| **Notion role** | Allowed **mirror destination** for meta Factory plans/workflow (human wiki) |
| **Lane** | **Meta** only for Factory docs — do not mix product-lane boards/pages into meta Factory Notion mirrors |
| **Auth** | Notion MCP is **authenticated** — auth is **not** a blocker |
| **Live mirrors** | FE-53 created Meta mirrors — URLs in [`notion-factory-mirror.md`](./notion-factory-mirror.md) |
| **This doc** | Does **not** mutate Notion; mirror maintenance is a separate task |

Never put Spec/accept/claim SoT in Notion.

### A12. Other Project-defined pieces that attach later (do not invent; do not skip naming)

Already in store / master Spec — **not** invented here; schedule per M1 cut ([§13.5](./factory-master-spec.md#135-m1-first-wave-authorship-cut-resolves-b1-without-deleting-4-6) Non-Goals):

| Item | Status in Project |
|------|-------------------|
| Code Atlas L0 (+ Trail-Code map) | Design + DoD in [§12](./factory-master-spec.md); M1 skeleton with Dev OS |
| Polygraph | Post–single-repo M1 multi-repo ([§13.2](./factory-master-spec.md#132-polygraph--multi-repo-meta-harness-spec-home-factory-kernel--visibility)) |
| Spec Canvas / Beads loop screen | Design lock [§20](./factory-master-spec.md); implement deferred |
| Linear MCP App widget | Design [§16](./factory-master-spec.md); implement deferred |
| OpenFleet ceilings | Author stub OK; implement gated ([PBI-012](./factory-master-spec.md#6-seed-pbis-parallel-launch)) |
| CopilotKit / AG-UI kernel | Deferred ([ADR-011](./factory-master-spec.md#3-adrs--locked-decisions-accepted)); optional Factory adapter [§11](./factory-master-spec.md) |
| ISO 12207 mapping | [ADR-009](./factory-master-spec.md#3-adrs--locked-decisions-accepted) / Lifecycle Spec |
| ChatGPT Plugins pattern for MCP Apps | [ADR-010](./factory-master-spec.md#3-adrs--locked-decisions-accepted) |
| Coding vs Cockpit agents + Single-MCP | [§18](./factory-master-spec.md) — maps to `coding-agent` / `personal-agent` + [§0.7 roster](./factory-master-spec.md#07-agent-type-roster-johnny-locked) |
| Domain ownership map | [§8](./factory-master-spec.md#8-domain-driven-specification-map) |
| **Product Beads** (Factory ships Beads to projects) | Distinct from Meta Beads; lands when that product feature exists |

---

## Phase B — Coding loop (agent-agnostic; unchanged order)

After Phase A gates for the active Spec are green, **any eligible Coding agent** follows **[`factory-coding-loop.md`](./factory-coding-loop.md)** exactly:

1. **Task starts** — pick the [synced unit](#sync-model--one-unit-of-work) (claim via Meta/Product Beads *instance* when in force; else Linear/PBI facet). **Refuse start** if the [canonical contract body](#pbi--typed-contract-body-canonical-fields) (C1–C3 + 1–16) is incomplete.  
2. **Standardize** — Spec/Contract / assemble-first / §7 gates; align action/tool/pipeline step contracts to the unit’s typed contract body  


3. **Open PR** — branch + PR early; cite the unit’s ids · Spec · scenarios  
4. **Run build** — local gate → CI on SHA → (optional adversarial) → Port accept  
5. **Loop back** — close/refine/compound HITL → next ready unit  

Do not invent a parallel sequence. **Which roster agent runs it is fungible within the tagged class; the five steps are not.** Field 7 must match class capability ([Johnny roster](#agent-classes--johnny-roster-extensible)).

---

## Today’s tool map (soft-locked — roles only)

| Role | Today’s tool |
|------|----------------|
| Human tracker / PBI form of the unit | Linear |
| Ready / claim / parallel (meta) | **Meta Beads** (admit from PBI-007; scaffolded now per OQ-1 hybrid — Linear still admit SoT) |
| Ready / claim / parallel (product) | **Product Beads** (when Factory ships it) |
| PRs + CI + code / GitHub issue facet | Git repo + GitHub Actions |
| Accept / governance / catalog | Port (native-first) |
| Execution admit + Coding harness | Rivet `ProjectSupervisor` + Sandbox Agent (+ Claude Code M1) |
| Coordination scratch | Cursor Project `notes.md` (not coding SoT) |

Detail also in [coding loop tool map](./factory-coding-loop.md#todays-tools-mapped-not-hard-locked).

---

## Collision avoidance — claims, worktrees, file-scope

Prevents two agents (or two PBIs) from corrupting the same work. Executable rules — any fresh agent must follow these without asking.

| Layer | Rule | How |
|-------|------|-----|
| **Claim** | One holder per unit | After PBI-007: `bd ready` → `bd update --claim` (or `bd ready --claim`) before coding admit ([Beads coordination](https://beads.gascity.com/multi-agent/coordination.md)). Before PBI-007: one Linear assignee / explicit PBI owner. Stale claims → `bd reclaim` when Beads is in use. |
| **Worktree** | One claimed unit’s **write set** per worktree | Fan out concurrent PBIs by Spec domain / `git worktree` ([master §6 Atomicity](./factory-master-spec.md#6-seed-pbis-parallel-launch)). Beads: all linked worktrees **share** one `.beads` unless `BEADS_DIR` overrides ([Beads worktrees](https://beads.gascity.com/reference/worktrees.md)) — do **not** `bd init` per worktree. Sync issues with `bd dolt pull` / `bd dolt push`, not by committing Dolt into the feature branch. |
| **File-scope** | Concurrent units → **disjoint write sets** | PBI/bead description cites paths or Spec domain ownership. If two units need the same file: **serialize** (`bd dep` / Linear blocker) or acquire Beads **merge-slot** for conflict-prone merge work — never parallelize shared paths. |
| **Hash IDs** | No ID merge collisions | Beads hash IDs (`bd-a1b2`) are collision-resistant across agents/branches ([hash IDs](https://beads.gascity.com/core-concepts/hash-ids.md)). |
| **Not a claim** | `notes.md` FE-* rows | Coordination only — never collision authority. |

**Hard ban:** two in-progress units that edit the same path without a documented serial dependency or merge-slot.

---

## Remaining manual steps (smooth-loop inventory)

The coding loop aims for **task → standardize → PR → build → loop** without ad-hoc questions. These steps stay **intentionally manual** (Johnny-reserved or HITL) — everything else should be agent-executable from synced state:

| Manual / reserved | Why |
|-------------------|-----|
| **ADR-005** dedicated Factory OAuth app create/revoke | Check live status in master §0.6 / `port-factory-oauth-live.md`; never Observatory reuse |
| **Spec review + EGM Goldfish** before Feature Assembly | Human/critic gate ([§7](./factory-master-spec.md#7-context-gates--workflow-as-code)) |
| **Port accept** | Governance; independent of agent “done” (ADR-008) |
| **Compound writeback** | HITL `/ce-compound` (PBI-015) |
| **`factory_request_release`** | Johnny-only INPUT (live Port catalog) |
| **FREEMIUM External Interface limit** | Ops path to dedicated Factory app when authorized |

Until PBI-007 + gateway/supervisor are live, **authorship** still runs the five-step loop against Linear/PBI + git; Rivet admit is not required for doc/Spec PBIs.

---

## Open questions

| ID | Question | Research status | Constraint |
|----|----------|-----------------|------------|
| **OQ-1 Meta Beads** | ~~Start scaffolding now vs wait until PBI-007?~~ | **Locked (Johnny 2026-10-29): hybrid.** Scaffold Meta Beads now; **Linear = admit/claim SoT until PBI-007.** | [A5](#a5-meta-beads--locked-hybrid-oq-1) · [`meta-beads-scaffold.md`](./meta-beads-scaffold.md). Does not decide Product Beads. |
| **OQ-2 Notion** | ~~Put workflow/plans in Notion?~~ | **Resolved (Johnny):** Notion **allowed as mirror** of meta plans/workflow; **SoT = Project store + git**; Notion ≠ SoT. Auth **not** a blocker. Mirrors live. | See [A11](#a11-notion--resolved-mirror-allowed-not-sot) · [`notion-factory-mirror.md`](./notion-factory-mirror.md). |

Remaining Johnny blockers for M1 **authorship:** check ADR-005 live status; `factory_request_release` Johnny-only. **OQ-1 closed.** See also [Remaining manual steps](#remaining-manual-steps-smooth-loop-inventory).

---

## Document control

| Doc | Role |
|-----|------|
| **This file** | **Derived** workflow: sync model, eligible agents + §0.7 roster, Meta vs Product Beads, collision avoidance, upfront setup, separation, manual-step inventory, open questions, pointer to coding loop |
| [`factory-coding-loop.md`](./factory-coding-loop.md) | **Derived** coding sequence (task→standardize→PR→build→loop) |
| [`factory-master-spec.md`](./factory-master-spec.md) | **Single canonical SoT** (§0): Specs, ADRs, PBIs, gates, topology, §0.7 roster, §18 agents, M1 cuts |
| [`port-factory-data-model.md`](./port-factory-data-model.md) | Native-first Port catalog + fencing detail |
| [`linear-factory-task-manager.md`](./linear-factory-task-manager.md) | Linear as human tracker evaluation |
| [`factory-research-300-qa.md`](./factory-research-300-qa.md) | FE-47 gap Q&A (~300) |
| [`factory-research-reconciliation.md`](./factory-research-reconciliation.md) | FE-47 reconciliation + acceptance scorecard |
| Cursor Project `notes.md` | Agent coordination only |

---

## Inventory — what this workflow doc includes

Everything below is **in this file** (sourced from Project docs; not invented):

1. Hard rules: **equivalence chain** (Linear ticket ≡ bead ≡ GitHub issue ≡ PBI ≡ typed contract), **typed contracts everywhere** + full body DoR, agent-agnostic loop, synced state, native-first Port, no second catalog, coding-loop order, soft-locked tool map, meta≠product (**instances**, not unit types), accept-on-SHA, notes.md coordination-only  
2. **Sync model:** five-name equivalence + Meta/Product Beads as instances; Beads / Linear / git / Port facets stay in sync; [canonical PBI/typed-contract body](#pbi--typed-contract-body-canonical-fields) (C1–C3 + fields 1–16, incl. time estimate, secrets handling, observability hook)  

3. **Agent classes + Johnny roster (extensible; master §0.7):** `personal-agent` vs `coding-agent`; roster Muse / ChatGPT regular / ChatGPT Work / Codex / Grok / Claude / Claude Code / Claude Design; §18 Cockpit≈personal / Coding≈coding; SA + Claude Code M1 bindings; Polygraph/Trail-Code/notes non-roster; no independent-review loop step  

4. Separation: Factory meta-building vs Factory product projects (Linear + docs/repos + Beads instances)  
5. **Meta Beads vs Product Beads** (builder’s tool vs Factory-shipped component)  
6. Spec placement: Project store `docs/` + git `/specs/{domain}/spec.md`  
7. Port upfront: blueprints, relations, mirrors, MCP servers, workflows/actions, automations, scorecards, RBAC, audit, Context Lake/Ocean, External Interfaces, §4.2.1 fencing, §4.2.2 assemble-first  
8. Git repo init + §2 mandated layout (meta-repo vs product repos)  
9. Linear PBIs as ticket standard (§6) — facet of the synced unit  
10. Meta Beads **OQ-1 locked hybrid** (scaffold now; Linear admit SoT until PBI-007) 
11. ADR authorship (full bodies under `docs/adrs/`)  
12. M1 LogicSRC emit: AGENTS.md, OpenStack, OpenProfile, OpenMCP, OpenAccess  
13. Rivet 2.x + ProjectSupervisor + Tailscale Serve (§13.4)  
14. Thin factory-gateway (HMAC + catalog writer + enqueue)  
15. Sandbox Agent + Docker (ADR-006)  
16. Developer OS Next/Vercel + Rivet native realtime (ADR-011)  
17. CI accept on exact SHA / visibility (ADR-008) + local gate (PBI-013)  
18. Context gates: Spec review, EGM Goldfish, adversarial, Compound, Port accept (§7)  
19. Observatory/OAuth ADR-005 deferred; never Observatory reuse; no create/revoke without Johnny  
20. Coding loop order + link to `factory-coding-loop.md` (any eligible agent)  
21. Soft-locked tool map (incl. Meta vs Product Beads roles)  
22. **OQ-2 resolved:** Notion allowed as **meta-lane mirror** of plans/workflow; SoT = Project store + git; auth not a blocker; no Notion page create from this doc  
23. Named deferred/later Project pieces: Code Atlas/Trail-Code, Polygraph, Spec Canvas, Linear MCP App, OpenFleet, CopilotKit/AG-UI, ISO 12207, ADR-010 MCP Apps pattern, §18, §8 DDD map, Product Beads feature  
24. Explicit bans: no Port/Linear mutations from this doc write; no Notion page invent from docs-only write; do not invent agents  
25. Collision avoidance: atomic claims, shared `.beads` across worktrees, disjoint write sets, merge-slot for shared paths  
26. Remaining manual/HITL steps inventory (smooth-loop); OQ-1 locked hybrid; OQ-2 closed as mirror-allowed 

