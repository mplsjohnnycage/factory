# Factory master spec — ASDLC Spec production plan

**Status:** **Single canonical source of truth** for Factory architecture, PBIs, ADRs, gates, Meta XOR Product, unit-of-work / typed-contract fields, sync, and coding-loop sequence. Remastered 2026-10-28 from [`factory-research-300-qa.md`](./factory-research-300-qa.md) + [`factory-research-reconciliation.md`](./factory-research-reconciliation.md).  
**Assemble-first:** Factory leads with Port machine-validated stack assembly ([§4.2.2](#422-machine-validated-stack-assembly) / [§0.0](#00-assemble-first-lead-principle)) — choose stack → Port validate → provision only on success. Catalog misses → **needs implementation** (Beads/PBI), not silent greenfield.  
**Date:** 2026-10-28  
**Lane:** **Meta** (building Factory itself)  
**Primary build-against artifact:** ASDLC **The Spec** (Blueprint + Contract)  
**Skill:** [`skills/asdlc/`](../skills/asdlc/SKILL.md) — especially [`patterns/the-spec.md`](../skills/asdlc/patterns/the-spec.md), [`patterns/the-pbi.md`](../skills/asdlc/patterns/the-pbi.md), [`patterns/the-adr.md`](../skills/asdlc/patterns/the-adr.md), [`practices/living-specs.md`](../skills/asdlc/practices/living-specs.md), [`practices/pbi-authoring.md`](../skills/asdlc/practices/pbi-authoring.md), [`practices/adr-authoring.md`](../skills/asdlc/practices/adr-authoring.md)  
**LogicSRC map:** [`logicsrc-artifact-inventory.md`](./logicsrc-artifact-inventory.md) (interoperability artifacts Specs emit/reference — **not** the primary IR)  
**Evidence:** [`factory-stack-audit.md`](./factory-stack-audit.md), [`port-capabilities.md`](./port-capabilities.md), [`port-factory-data-model.md`](./port-factory-data-model.md) (§4.1 fencing), [`rivet-engineering-spec.md`](./rivet-engineering-spec.md), [`rivet-claim-fencing.md`](./rivet-claim-fencing.md), [`rivet-full-capacity.md`](./rivet-full-capacity.md) §7, [`rivet-sandbox-agent.md`](./rivet-sandbox-agent.md), [`iso-12207-overview.md`](./iso-12207-overview.md)  
**Remaster report:** [`factory-spec-remaster-report.md`](./factory-spec-remaster-report.md)

Agents **build against Specs**. PBIs are deltas that point at Specs. ADRs freeze irreversible decisions. LogicSRC files are produced **from** Spec Blueprints / Contracts where interoperability requires them.

**Labels:** Citations = verified. **ASSUMPTION** = Project binding used to keep builds unblocked.

**Frontend feed:** [`internal/frontend-stack-feed.md`](../internal/frontend-stack-feed.md) (FE-15) + [`factory-stack-audit.md`](./factory-stack-audit.md) §§19–22. Shell/host/streaming locks below follow that feed.

**OAuth:** ADR-005 **live** (Johnny-authorized 2026-10-29). Dedicated Factory External Interface app created; Observatory revoked. Live ids/redirects: [`port-factory-oauth-live.md`](./port-factory-oauth-live.md). No PBI code execution from this doc.

---

## 0. Document authority (hard rule — Johnny)

> **`factory-master-spec.md` is the single canonical source.** Every other Factory doc (workflow, meta-vs-product, coding-loop, architecture-map, `AGENTS.md`, Linear, repo docs, Notion mirror) must **derive from and match** this file. **Future edits: master first, then propagate.** If a source cannot be reconciled to this file, **flag it** — do not invent a parallel SoT.

| Surface | Role relative to this file |
|---------|----------------------------|
| **This file** | Canonical SoT for architecture, ADRs, Specs/PBIs, gates, Meta XOR Product, unit type + **19** typed-contract fields, four-plane sync, coding-loop order, collisions, OQs |
| [`factory-workflow.md`](./factory-workflow.md) | **Derived** executable Phase A/B + collision/manual inventory — must match this file |
| [`factory-meta-vs-product.md`](./factory-meta-vs-product.md) | **Derived** Meta XOR Product elaboration — must match §0.2 |
| [`factory-coding-loop.md`](./factory-coding-loop.md) | **Derived** five-step sequence detail — order locked in §0.4 |
| [`factory-architecture-map.md`](./factory-architecture-map.md) | **Derived** visual map — must match §0.2 / §0.3 |
| `AGENTS.md` (meta-repo) | **Derived** index only — points here; does not dump design |
| Linear **Factory Meta** | **Derived** human tracker facet of §6 seed PBIs |
| Notion | **Mirror only** of meta plans/workflow (OQ-2 resolved) — **never** Spec/accept/claim SoT |
| Cursor Project `notes.md` | Coordination scratch only — never Spec, accept, or work-queue SoT |

**Do not invent Johnny decisions** beyond what is researched/locked here and in the research pack. Remaining Johnny decisions: `factory_request_release` Johnny-only INPUT. **OQ-1 Meta Beads** is **locked hybrid** (scaffold now; Linear admit SoT until PBI-007) — §0.6. **ADR-005** OAuth create + Observatory revoke: **done** (live — [`port-factory-oauth-live.md`](./port-factory-oauth-live.md)).

### 0.0 Assemble-first (lead principle)

> **Assemble-first:** Before Feature Assembly or provision, prefer Port catalog composables and **machine-validated stack assembly** ([§4.2.2](#422-machine-validated-stack-assembly)). Port rejects incompatible stacks **before** build. Catalog misses are flagged **needs implementation** and become Beads/PBI deltas — do **not** silently scaffold invalid combos or treat unflagged gaps as provisionable modules ([§20](#20-spec-canvas--loop--task-decomposition)).

**Flow (summary):** choose stack (template + modules) → Port validates compatibility rules as catalog data → on success only, provision / connect / Coding admit → on conflict, reject with machine-readable reasons and compatible alternatives.

**Does not:** weaken §4.2.1 write fencing; relocate catalog SoT out of Port; replace Spec+Contract Standardize; or imply M1 ships the full Assemble-software wizard (§18.3 remains post-M1 implement where already locked).

### 0.1 Unit of work — equivalence chain (19 fields)

> **Johnny confirmed:** Linear tickets, beads, GitHub issues, PBIs, and typed contracts are **ALL the same unit of work** — five names across five tools. A **PBI IS a typed contract**. Referring to any one refers to all. Do **not** treat them as separate concepts.

**PBI ≡ typed contract ≡ Linear ticket ≡ bead ≡ GitHub issue.**

**DoR:** unit not startable until the **entire** body below is filled (C1–C3 + fields **1–16** = **19** fields) plus ASDLC pointers (Spec · Verification · Refinement). Prefer Port-native / Spec Contract / workflow INPUT schemas for typed edges when they already exist — no parallel type system.

#### Contract core (typed I/O + writes)

| # | Field | Required content |
|---|--------|------------------|
| **C1** | **Inputs + types** | Explicit input names and types (schemas, Spec pointers, entity ids, paths) |
| **C2** | **Outputs + types** | Explicit output names and types (artifacts, evidence, entity updates, PR SHA) |
| **C3** | **Write targets** | Systems this unit may write — **Meta Beads** *xor* **Product Beads** (exactly one instance by lane; never Both), Linear, git/GitHub, Port, Rivet, filesystem, other — no vague “Beads” |

#### Operational body (1–16)

| # | Field | Required content |
|---|--------|------------------|
| **1** | **Acceptance criteria** | Measurable done-when; ties to Spec Contract scenarios / Verification pointer |
| **2** | **Exact task description** | Imperative directive — what to do, unambiguous |
| **3** | **Almost-exact directories to work in** | Paths / packages / Spec domains in scope |
| **4** | **What not to touch** | Explicit out-of-scope paths, systems, boards, Beads instances |
| **5** | **Skills to use** | Named skills / practices (e.g. ASDLC patterns) — no silent invention |
| **6** | **MCPs needed** | Named MCP servers/tools required (prefer Factory Single-MCP / Port-governed surface) |
| **7** | **Agent type required** | Name from the [§0.7 agent-type roster](#07-agent-type-roster-johnny-locked) **and** task kind (**personal-agent** vs **coding-agent**); also map to Coding vs Cockpit class ([§18](#18-agent-classes--single-mcp-control-surface)) |
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

### 0.2 Meta XOR Product

Every artifact, board, Beads instance, repo, and Port catalog ownership is **Meta** *xor* **Product** — **never Both / shared / either**.

| Lane | Meaning | Owns |
|------|---------|------|
| **Meta** | Building the Factory itself | This Project’s Linear (**Factory Meta**), Project store `docs/`, meta-repo, **Meta Beads**, Meta Port catalog/fencing, seed PBIs PBI-001…015 |
| **Product** | What Factory does when assembling a user project | Product Linear boards, product repos, **Product Beads** (per product, when shipped), Product Port delivery projections |

**PBI-007 = Meta only** — wires **Meta Beads** into Factory-kernel admit. Does **not** ship Product Beads. Product Beads needs a future Product-lane PBI (gap — never fold into PBI-007).

Shapes may rhyme across lanes; ownership must not. Write targets that touch Beads must name **Meta Beads** or **Product Beads** explicitly.

### 0.3 Four-plane sync (per lane)

Facets of the **same** unit stay in sync. Planes are lane-bound (Meta planes never host Product units).

| Plane | SoT for (facet) |
|-------|-----------------|
| **Beads** (**Meta Beads** or **Product Beads** instance) | Ready / claim / parallel |
| **Linear** | Human tracker / visibility |
| **git / GitHub** | Source, PR, CI on exact SHA, GitHub-issue facet |
| **Port** | Accept, catalog, projections (writes via §4.2.1) |

Until Meta Beads is admit-wired (PBI-007): Linear + PBI/typed-contract (+ optional `tasks/PBI-*` / GitHub issue) still represent the same unit; **Meta Beads is scaffolding-only** (deps / `bd ready` practice — OQ-1 hybrid locked). **Linear remains admit/claim SoT until PBI-007.** Do not treat Beads as day-one human board. Product Beads unchanged.

### 0.4 Coding loop order (locked — five steps)

**task → standardize → PR → build → loop.** Standardize includes Spec+Contract alignment and **assemble-first** ([§0.0](#00-assemble-first-lead-principle) / [§4.2.2](#422-machine-validated-stack-assembly)). Tool-agnostic. Cursor is not the only coding agent. Detail: derived [`factory-coding-loop.md`](./factory-coding-loop.md). This order does **not** add an independent-review / “Merge!” step — review attaches to the PR/build gates already named in §7 / ADR-008.

### 0.5 Collision avoidance (summary)

Concurrent units must not share write sets. After PBI-007: atomic `bd` claim before admit; git worktrees **share** one `.beads`; disjoint paths; serialize shared files via deps or Beads merge-slot; hash IDs. Full executable table: derived [`factory-workflow.md`](./factory-workflow.md) collision section (must match this summary).

### 0.6 Open questions & reserved manuals

| ID | Status |
|----|--------|
| **OQ-1 Meta Beads** | **Locked (Johnny 2026-10-29): hybrid.** Scaffold **Meta Beads now** in the Factory meta-repo (`.beads/`, prefix `factory-`). **Linear remains admit/claim SoT until PBI-007.** Not day-one human board. Product Beads not decided here. Detail: [`meta-beads-scaffold.md`](./meta-beads-scaffold.md). |
| **OQ-2 Notion** | **Resolved (Johnny):** Notion allowed as **meta-lane mirror** of plans/workflow; SoT = Project store `docs/` + git; Notion ≠ Spec/accept/claim; auth not a blocker for mirror intent. |
| **ADR-005** | **Live.** Dedicated Factory External Interface OAuth created; Observatory revoked (Johnny 2026-10-29). See [`port-factory-oauth-live.md`](./port-factory-oauth-live.md). Never Observatory reuse. |
| **Observatory** | **Revoked** (Johnny-authorized Meta ops 2026-10-29). Former app id `stflVc7sZJXf6FelDkUFFhcKnoaxP6QP`. |
| **`factory_request_release`** | Johnny-only INPUT (live catalog). |

Other reserved manuals: Spec review + EGM Goldfish before Feature Assembly; Port accept; Compound HITL (PBI-015); FREEMIUM External Interface limit path.

### 0.7 Agent-type roster (Johnny locked)

**Locked roster** for typed-contract field **7** (`Agent type required`). Extensible — new names may be added later by Johnny lock into this section; do not invent ad-hoc types outside the roster without updating this SoT first.

| Agent type | Default task kind | Notes |
|------------|-------------------|-------|
| **Muse** | **Personal-agent** | Personal / provisioning (Port, browser, provision flows) |
| **ChatGPT regular** | **Personal-agent** (default) | May be named for coding-agent tasks when the unit says so |
| **ChatGPT Work** | **Personal-agent** (default) | Work-scoped ChatGPT surface |
| **Codex** | **Coding-agent** | In-sandbox / coding path when admitted |
| **Grok** | **Personal-agent** (default) | May be named for coding-agent tasks when the unit says so |
| **Claude** | **Personal-agent** (default) | General Claude chat — not the same as Claude Code / Claude Design |
| **Claude Code** | **Coding-agent** | M1 first in-sandbox coding harness (PBI-006 / ASSUMPTION 3) |
| **Claude Design** | **Personal-agent** | Design / UI provision-style work — not Feature Assembly coding admit |

**Task-kind distinction (required on every unit):**

| Task kind | What it is | Maps to §18 class |
|-----------|------------|-------------------|
| **Personal-agent tasks** | Port / browser / provisioning / cockpits / settings / assemble-intent / spawn coding work — **not** the admitted Sandbox Agent code change itself | **Cockpit** |
| **Coding-agent tasks** | Write/execute code for one admitted `WorkAttempt` inside Rivet Sandbox Agent (Docker) | **Coding** |

**Rules:**
1. Field **7** must name **(a)** a roster agent type **and** **(b)** `personal-agent` *xor* `coding-agent`.  
2. Personal-agent tasks must not self-admit Sandbox Agent coding or self-accept on SHA.  
3. Coding-agent tasks follow §0.4 (**task → standardize → PR → build → loop**) under Rivet admit when live — **no** independent-review / “Merge!” step added to the loop.  
4. Roster is **extensible** via master-first edit to this table, then propagate.  
5. §18 Coding vs Cockpit remains the **class** model; this roster is the **named agent-type** vocabulary for contracts.

---

## 1. Artifact hierarchy (ASDLC)

| Artifact | Role | Layout | Lifespan | Skill cite |
|----------|------|--------|----------|------------|
| **The Spec** | **State** — how the domain works (Blueprint) + how we know (Contract) | `/specs/{domain}/spec.md` | Durable, living with code | [the-spec](../skills/asdlc/patterns/the-spec.md) |
| **PBI** | **Delta** — imperative change; pointer to Spec + Contract scenarios | MCP tracker and/or `tasks/PBI-NNN.md` | Transient; closed after merge | [the-pbi](../skills/asdlc/patterns/the-pbi.md), [pbi-authoring](../skills/asdlc/practices/pbi-authoring.md) |
| **ADR** | **Immutable decision** snapshot; supersede, never edit body | `docs/adrs/ADR-NNN-short-title.md` | Permanent history | [the-adr](../skills/asdlc/patterns/the-adr.md), [adr-authoring](../skills/asdlc/practices/adr-authoring.md) |
| LogicSRC artifacts | Wire formats / well-known files Specs require for coordination | See inventory | As Spec Contracts demand | [inventory](./logicsrc-artifact-inventory.md) |

**Maturity:** Spec-anchored (not spec-as-source). Runtime code remains SoT for execution ([the-spec](../skills/asdlc/patterns/the-spec.md)).

**AGENTS.md** indexes Specs/ADRs/skills; does not dump design ([agents-md-spec](../skills/asdlc/practices/agents-md-spec.md)).

---

## 2. Repository layout (mandated)

```txt
/
  AGENTS.md
  OpenStack.md                          # LogicSRC catalog — emitted by stack Spec
  specs/
    factory-kernel/spec.md
    port-governance/spec.md
    rivet-execution/spec.md
    sandbox-harness/spec.md
    developer-os/spec.md
    auth-port-oauth/spec.md
    logicsrc-interop/spec.md
    visibility-accept/spec.md
    security-blast-radius/spec.md
    asdlc-lifecycle/spec.md
  docs/
    adrs/
      ADR-001-port-system-of-record.md
      …
    factory-master-spec.md              # this production plan
    logicsrc-artifact-inventory.md
  tasks/                                # optional repo mirror of PBIs
    PBI-001-….md
  prd/                                  # LogicSRC OpenPRD (product decisions)
  agents/                               # LogicSRC OpenAgent JSON
  workflows/                            # LogicSRC OpenWorkflow JSON
  apps/developer-os/                    # Next.js → Vercel
  apps/factory-gateway/                 # thin gateway: Port webhook HMAC + §4.2.1 catalog writer + enqueue ProjectSupervisor (PBI-005)
  bin/install.sh
  .well-known/                          # published site catalogs
```

Every Spec file uses this skeleton ([the-spec Anatomy](../skills/asdlc/patterns/the-spec.md); [living-specs](../skills/asdlc/practices/living-specs.md)):

```markdown
# {Domain}

## Blueprint
### Context
### Architecture
### Constraints

## Contract
### Definition of Done
### Regression Guardrails
### Scenarios
```

Constraints are **positive** rules (pink-elephant rule). Failure modes → Gherkin in Contract, not “do not” lists in Blueprint.

---

## 3. ADRs — locked decisions (Accepted)

Write these under `docs/adrs/` before coding the affected domain. Bodies are immutable; status may become Superseded.

| ADR | Decision | Status |
|-----|----------|--------|
| **ADR-001** | Port is system of record (catalog, RBAC, workflows, MCP gateway, audit, agent/skill registry, Context Lake). Clerk out of scope. | Accepted |
| **ADR-002** | Rivet is execution kernel: `ProjectSupervisor` single admission queue, per-actor ordered queues, single-writer; idempotent side effects. Rivet never polls Port. | Accepted |
| **ADR-003** | Port→Rivet path: MCP/self-service → workflow → webhook → thin gateway → supervisor → sandbox → GitHub; Port catalog = projections. | Accepted |
| **ADR-004** | ASDLC Spec (`/specs/{domain}/spec.md`) is the canonical agent build-against artifact; LogicSRC is interoperability emission, not primary IR. | Accepted |
| **ADR-005** | Auth = **dedicated Factory** Port External Interface OAuth app (humans + agents same Port surface). **Never** reuse Harness Observatory. **Live** — Observatory revoked; Factory app created 2026-10-29 ([`port-factory-oauth-live.md`](./port-factory-oauth-live.md)). | Accepted — **live** |
| **ADR-006** | Coding harness = Rivet-orchestrated **Sandbox Agent** (in-sandbox HTTP SDK); isolation = Docker provider. Not “Rivet built-in.” | Accepted |
| **ADR-007** | ~~Developer OS = Next.js + Vercel; CopilotKit + AG-UI in kernel; Factory Rivet→AG-UI adapter.~~ | **Superseded by ADR-011** |
| **ADR-011** | Developer OS shell = **Next.js App Router** on **Vercel**. Kernel streaming = **Rivet Actor native realtime**. **CopilotKit / AG-UI deferred** (optional later path). AG-UI is complementary to MCP (Agent↔User vs Agent↔Tools), not identical to MCP Apps. First-party **Rivet↔AG-UI** remains **UNVERIFIABLE** — any later adapter is Factory design, not a vendor product ([frontend-stack-feed](../internal/frontend-stack-feed.md); [audit §§19–22](./factory-stack-audit.md)). | Accepted |
| **ADR-008** | Visibility = Port audit + Rivet traces + Polygraph evals + scorecards. Accept = GitHub CI on exact SHA. | Accepted |
| **ADR-009** | ISO/IEC/IEEE 12207:2026 process groups map into Specs + ASDLC phases; Lifecycle Spec owns the mapping. | Accepted |
| **ADR-010** | ChatGPT Plugins (skills + MCP + optional UI) = reference pattern for Factory MCP Apps. | Accepted |

### ADR-005 live parameters (Johnny-authorized Meta ops 2026-10-29)

Port MCP: revoked Observatory `stflVc7sZJXf6FelDkUFFhcKnoaxP6QP`; `upsert_external_interface_app` (omit `appId`) created **Factory**. Canonical live record: [`port-factory-oauth-live.md`](./port-factory-oauth-live.md).

| Field | Live value |
|-------|------------|
| `name` | `Factory` |
| App id | `iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug` |
| Client id | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` |
| `redirectUris` | `http://localhost:3000/api/auth/callback`, `http://127.0.0.1:3000/api/auth/callback` |

**Context (closed):** Org FREEMIUM limit (1) required Observatory revoke before Factory create. FE-11/FE-14 prior attempts documented in [`port-capabilities §3.1`](./port-capabilities.md); superseded by live record above.

---

## 4. Domain Specs to produce (parallel)

Each subsection is a Spec teams must author at `/specs/{domain}/spec.md`. **LogicSRC outputs** are Contract deliverables / Blueprint architecture emissions — mapped from [inventory](./logicsrc-artifact-inventory.md). §4.1–§4.6 Blueprint/LogicSRC catalogs are Spec-authorship maps unless a bullet already cuts scope — **M1 emit §13.6 / M1 implement §13.5** (see also §4.7 Contract / §4.9 M1 cuts).

### 4.1 `specs/factory-kernel/spec.md`

**Blueprint — Context:** End-to-end Factory vertical slice: authorize → durable run → harness → GitHub evidence → accept.  
**Blueprint — Architecture:** Correlation IDs `projectId→taskId→workAttemptId→actorId→sandboxId→agentSessionId→traceId→commitSHA`; **M1 actors** `ProjectSupervisor`, `WorkAttempt`, `AgentSession`, `SandboxLease` ([rivet-engineering-spec](./rivet-engineering-spec.md)). `CapacityManager` and `AssemblyWorkflow` are **post-M1** (see §13.0 Non-Goals / §13.5).  
**Blueprint — Constraints:** One dispatch owner per attempt; Port authorization before side effects; Beads owns readiness. **Polygraph multi-repo coordination is post–single-repo M1** (§13.2) — not an M1 kernel Constraint.

**Contract — DoD:** Port-authorized start recovers after worker kill and sandbox loss; duplicate `work.start` → one attempt.  
**Contract — Guardrails:** Acceptance never from agent self-report.  
**Contract — Scenarios (Gherkin outline):** Duplicate admit; sandbox death recovers session identity; CI green on SHA accepts / rewrite denies.

**LogicSRC map:** `logicsrc.task`, `logicsrc.agent_run`, `logicsrc.event`; OpenFleet member records for sessions; OpenWorkflow `admit-and-run`. **M1 emit §13.6 / M1 implement §13.5** — full catalog is Spec authorship; M1 emits only Required rows that this Spec owns.

### 4.2 `specs/port-governance/spec.md`

**Blueprint:** Port as SoT — blueprints, RBAC, workflows-as-MCP-tools, MCP connectors, audit, Context Lake sync (GitHub/Linear/Vercel/Convex) ([Port external interfaces](https://docs.port.io/interface-builder/external-interfaces); [expose as tool](https://docs.port.io/workflows/expose-as-tool)).  
**Live catalog to bind (Port MCP read, 2026-10-28 — do not invent parallel names):** blueprints `product`, `service`, `executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner`, `bot`, `_mcp_server`, `agentPlugin`, `skill`, `harness_session`; workflows `factory_create_execution_contract`, `factory_start_delivery_run`, `factory_claim_next_job`, `factory_heartbeat`, `factory_submit_evidence`, `factory_record_review_verdict`, `factory_request_release` (Johnny-only INPUT).  
**Constraints:** WEBHOOK backend to Factory gateway; Port entity upserts are create-or-update only (no product CAS — [Upsert entity](https://docs.port.io/workflows/build-workflows/nodes/action-nodes/upsert-entity)); **all catalog writes** use the canonical Port fencing pattern in §4.2.1; Rivet `ProjectSupervisor` fences **execution admission only** ([rivet-claim-fencing.md](./rivet-claim-fencing.md)) — it does not replace §4.2.1 for catalog bytes.

**Contract:** Human UI and MCP agent invoke the same workflow tools; cross-project access denied; audit entries for mutations; concurrent catalog writers cannot both apply — stale `catalogVersion` rejected; claim races impossible under §4.2.1 single-writer + version bump.

**LogicSRC map:** OpenMCP `/.well-known/openmcp.json`; OpenOntology/OpenContext packages aligned to Port blueprints; OpenAccess descriptor documents scopes (Port issues tokens — **ASSUMPTION:** no LogicSRC OpenAccess hub in v1). **M1 emit §13.6 / M1 implement §13.5** — M1 Required: OpenMCP; OpenOntology/OpenContext packages are post-M1.

#### 4.2.1 Canonical Port catalog write fencing (no-upsert-CAS fix)

Port product upsert has **no** compare-and-swap / version precondition. Factory’s canonical fence for Port catalog data (full detail: [port-factory-data-model.md](./port-factory-data-model.md) §4.1):

1. **Single-writer per record.** Every catalog write — direct Port API/MCP, Ocean sync applies (**Port Ocean** = Port’s integration/sync layer that applies external source state into Port catalog entities), webhook-triggered workflow entity nodes — enqueues to a writer keyed by `{blueprint}:{entityIdentifier}`. That owner processes **one write at a time** (mirror Rivet per-actor ordered queue / single-writer; parallel language in [rivet-claim-fencing.md](./rivet-claim-fencing.md) A1–A3 and [rivet-full-capacity.md](./rivet-full-capacity.md) §7). No bypass path for “sync-only” or “claim-only” callers.  
   **Runtime placement (M1 locked):** the catalog writer lives **inside the thin Factory gateway process** co-located with the Port webhook HMAC verifier (PBI-005) — same deploy unit as gateway→`ProjectSupervisor` enqueue. It is **not** a Port SaaS feature and **not** a Rivet Actor (Rivet remains execution-only; Port remains SoT). Ocean sync / MCP clients call the gateway writer API; they do not dual-write Port.
2. **`catalogVersion` property.** Integer on every Factory-governed catalog blueprint; `0` at create; successful apply sets `catalogVersion = expectedCatalogVersion + 1`.
3. **Reject stale writes.** Writer loads current entity; if `expectedCatalogVersion ≠ catalogVersion`, reject with no partial apply. Caller re-reads, rebuilds patch, re-enqueues.
4. **Lease/claim fields.** `leaseEpoch`, owner, status, and related claim properties mutate only inside the same writer apply that bumps `catalogVersion` (covers `factory_claim_next_job`, `factory_heartbeat`, evidence/review upserts).

**Ownership split (locked):** Port SoT + §4.2.1 writer = catalog mutations. Rivet `ProjectSupervisor` / `WorkAttempt` = durable execution admit and attempt lifecycle (ADR-002). Beads = readiness/claim graph. Rivet never polls Port; Port catalog projections of runs still enter §4.2.1.

#### 4.2.2 Machine-validated stack assembly (assemble-first)

**Principle (assemble-first):** Port enforces **stack compatibility as machine-validated rules during assembly** — not as prose guidelines or post-build CI luck. The catalog knows which components are compatible vs conflicting; invalid combos are **rejected before build**.

**What Port validates (non-exhaustive; rules are catalog data):** T3 / Better-T-Stack-class options, Convex components, shadcn components/registries, Tailwind tokens/themes, Better Auth, Drizzle | Prisma, tRPC, and related `stackTemplate` / `provider` / `convexComponent` / `shadcnComponent` / `shadcnRegistry` entities already modeled in Port ([port-factory-data-model.md](./port-factory-data-model.md) §2.1). Mirrors **Better-T-Stack**-style validation: choose a coherent set, fail closed on conflicts.

**Assembly flow:**

1. Operator or Cockpit agent **chooses a stack** (template + modules) via Port catalog / Developer OS Port widget / Factory MCP.
2. **Port validates** the selection against compatibility rules stored as catalog data (relations, scorecard rules, or dedicated compatibility entities — still Port SoT; writes remain under §4.2.1 fencing).
3. On success only: **GitHub Actions** (and Port provision workflows) **provision / connect** Vercel, Convex, GitHub, shadcn, Tailwind tokens/themes, auth/ORM/RPC choices, etc.
4. On conflict: reject with machine-readable reasons; UI and MCP surface compatible alternatives — no scaffold, no provision, no Coding admit for the invalid combo.

**Locks:** Does not weaken §4.2.1 write fencing. Does not change Code Atlas ownership (§12). Assemble-software Cockpit capability (§18.3) must call this validation before emitting an assembly plan or starting delivery runs.

### 4.3 `specs/rivet-execution/spec.md`

**Blueprint:** Rivet 2.x actors/queues/workflows; **execution** fencing = single `ProjectSupervisor` queue ([queues](https://rivet.dev/actors/docs/queues/); [claim-fencing](./rivet-claim-fencing.md)). Desktop Compose + Tailscale Serve. Port catalog write fencing is §4.2.1 — not this Spec’s ownership.  
**Constraints:** Side-effect handlers idempotent; actions parallel by default → use queues for mutations; Port projection upserts from Rivet go through the Port catalog writer (§4.2.1), never raw dual-write.

**Contract:** Ordered admit; webhook signature verified; Rivet never polls Port; health after Compose restart.

**LogicSRC map:** OpenInstall for non-Compose boxes; OpenFleet ledger alongside Rivet Inspector. **M1 emit §13.6 / M1 implement §13.5** — authorship catalog only; M1 Required rows for this Spec are none beyond vertical-slice Contracts (OpenInstall/OpenFleet production = post-M1).

### 4.4 `specs/sandbox-harness/spec.md`

**Blueprint:** Sandbox Agent = HTTP server **inside** sandbox + SDK; Rivet Actor owns session lifecycle/persistence; Docker provider (local + cloud targets) ([Sandbox Agent architecture](https://rivet.dev/sandbox-agent/docs/architecture/); [multiplayer](https://rivet.dev/sandbox-agent/docs/multiplayer/); [rivet-sandbox-agent.md](./rivet-sandbox-agent.md)).  
**Constraints:** Browser never calls Sandbox Agent; pin image deliberately; scoped repo tokens only.

**Contract:** Create session → prompt → stream events → checkpoint commit; kill sandbox → session history preserved, unsaved FS lost.

**LogicSRC map:** OpenAgent `coder.factory`; OpenTask only for desktop/UI automation tracks (**ASSUMPTION:** M1 coding path skips OpenTask). **M1 emit §13.6 / M1 implement §13.5** — OpenAgent optional stub OK; OpenTask skipped for M1 coding path.

### 4.5 `specs/developer-os/spec.md`

**Blueprint — Context:** External Developer OS for humans — intent, approvals UI, live progress, code atlas.  
**Blueprint — Architecture:**
- **Shell:** Next.js App Router (RSC default + Client Components + Route Handlers for Port OAuth callback / BFF) ([Next.js App docs](https://nextjs.org/docs/app); [audit §19](./factory-stack-audit.md)).
- **Host:** Vercel preview/production deploy (`vercel deploy` / `--prod`); unique `*.vercel.app` URLs ([audit §20](./factory-stack-audit.md); [frontend-stack-feed](../internal/frontend-stack-feed.md)).
- **Streaming (kernel):** Rivet Actor native realtime client into `AgentSession` event sequence — **not** CopilotKit.
- **Integrations UI:** MCP Apps (sandboxed iframes) **or** Port iframe/plugins per **Vercel, Convex, Docker, Port, Turso, GitHub** (plus second-row widgets as docked) — distinct standards; do not equate without Port MCP Apps compliance statement ([feed](../internal/frontend-stack-feed.md)). Frosted dock of these MCP app widgets sits under the Code Atlas hero — visual lock: [`media/code-atlas-mockup.png`](../media/code-atlas-mockup.png).
- **AG-UI (deferred):** Agent↔User event protocol; complementary to MCP (tools/data) and A2A ([AG-UI introduction](https://docs.ag-ui.com/introduction)). Compatible with generative UI / MCP Apps conceptually — **not** the same as MCP Apps.
- **CopilotKit (deferred):** Optional AG-UI client + generative UI later; not a kernel streaming dependency ([feed](../internal/frontend-stack-feed.md)).
- Visual: frosted-glass; full-bleed code-atlas hero (Polygraph + Beads + Trailcode) matching [`media/code-atlas-mockup.png`](../media/code-atlas-mockup.png). ChatGPT Plugins = MCP Apps packaging reference ([ADR-010](#3-adrs--locked-decisions-accepted)).

**Blueprint — Constraints:** UI / deferred AG-UI / CopilotKit are **display** channels; privileged mutations via Port actions only. Vercel MCP OAuth helpers do **not** replace Port External Interface person OAuth. OAuth client id for Developer OS is the dedicated Factory External Interface app (ADR-005); Rivet↔AG-UI is Factory design if adopted later (UNVERIFIABLE as vendor product — Rivet absent from AG-UI supported-framework tables).

**Contract — DoD:** Next.js app deploys on Vercel; atlas hero first viewport; Rivet native stream reconnects from last `sequence`; Port sign-in wiring ready for dedicated Factory client id when created.  
**Contract — Guardrails:** Browser does not call Sandbox Agent control APIs; Clerk is absent; Harness Observatory OAuth client is not configured for Developer OS.  
**Contract — Scenarios:** Preview deploy serves shell; session events survive browser disconnect via Rivet resubscribe; Port OAuth callback Route Handler round-trip against live Factory client ([`port-factory-oauth-live.md`](./port-factory-oauth-live.md)); configuring Observatory client id as Factory auth fails Contract review.

**LogicSRC map:** OpenStack Interfaces/Web + Hosting/Vercel; OpenProfile operator link. **M1 emit §13.6 / M1 implement §13.5** — OpenStack/OpenProfile are M1 Required (PBI-003); shell+atlas L0 implement parallelizable (PBI-008/009), full chrome deferred.

### 4.6 `specs/auth-port-oauth/spec.md`

**Blueprint:** Dedicated Factory External Interface OAuth (PKCE); machine credentials for unattended; same Port action surface for humans/agents. OpenAccess JSON documents redirects/scopes.  
**Constraints:** Text-only until ops raises limit; never configure against Harness Observatory client.

**Contract:** Spec + OpenAccess descriptor + ADR-005 **live** ([`port-factory-oauth-live.md`](./port-factory-oauth-live.md)); wire client id + redirects; add HTTPS callbacks before non-localhost deploys.

**LogicSRC map:** `/.well-known/openaccess.json`; OpenCreds for deploy secrets; Credential Sharing plans. **M1 emit §13.6 / M1 implement §13.5** — OpenAccess descriptor is M1 Required; OAuth app **exists** (ADR-005 live); OpenAccess must emit live client id + redirects.

### 4.7 `specs/logicsrc-interop/spec.md`

**Blueprint:** Emit inventory-mandatory LogicSRC files from Specs (OpenStack, OpenProfile, OpenPRD `prd/`, OpenAgent, OpenFleet, OpenWorkflow, OpenMCP, OpenInstall, schemas via `@logicsrc/schemas@0.6.0`). Markdown-first; JSON derived.  
**Constraints:** Validate with `@logicsrc/validators` / `logicsrc prd validate --strict` in ASDLC local gate.

**Contract:** **M1** — emit + validate only the §13.6 Required rows (AGENTS, OpenStack, OpenProfile, OpenMCP, OpenAccess descriptor). **Post-M1** — inventory §7 Factory-mandatory checklist green. Out-of-scope catalogs not invented at any phase.

**LogicSRC map:** Full [inventory](./logicsrc-artifact-inventory.md) catalog for Spec authorship; M1 emit cut is §13.6.

### 4.8 `specs/visibility-accept/spec.md`

**Blueprint:** Port audit + Rivet OTel/Inspector + Polygraph evals + scorecards; GitHub webhooks → Rivet signal; accept only green checks on exact SHA.  
**Contract:** Trace attempt→session→commit; rewrite invalidates accept; evidence tools record but do not replace CI.

**LogicSRC map:** `logicsrc.event`; OpenWorkflow `verify-and-accept`.

### 4.9 `specs/security-blast-radius/spec.md`

**Blueprint:** Port RBAC + rate controls; gateway rate limits; machine ≠ interactive MCP auth paths ([MCP connectors](https://docs.port.io/agent-management/ai-registry/mcp-connectors)). **M1:** HMAC + RBAC only (§13.5). **Post-M1:** OpenFleet ceilings (`approvals`, `budget`, `depth`, `fan_out`, `hosts`, `until`) via implement-gated PBI-012.  
**Contract:** Over-ceiling spawn refused with ledger `ceiling.refuse` (**post-M1**); cross-project denied; sandbox credentials scoped.

**LogicSRC map:** OpenFleet records/ledger; OpenCreds (no secrets in Specs/git).

### 4.10 `specs/asdlc-lifecycle/spec.md`

**Blueprint:** LogicSRC ASDLC nine phases + skill Context Gates / Workflow-as-Code / Domain-Driven Specification ([ASDLC docs](https://logicsrc.com/docs/asdlc); [context-gates](../skills/asdlc/patterns/context-gates.md); [workflow-as-code](../skills/asdlc/practices/workflow-as-code.md)). ISO 12207:2026 groups map to Spec ownership ([iso overview](./iso-12207-overview.md)). Target ASDLC Level 2; ratchet habit from first escape.  
**Contract:** One local gate command refuses dirty/invalid; CI refuses; living Specs updated in same PR as Contract changes ([living-specs](../skills/asdlc/practices/living-specs.md)).

**LogicSRC map:** OpenPRD for product capability decisions; OpenWorkflow release/promote; OpenInstall activate health.

---

## 5. LogicSRC emission matrix (Spec → file)

| LogicSRC artifact | Owning Spec | Path / form |
|-------------------|-------------|-------------|
| OpenStack.md | logicsrc-interop + developer-os | `/OpenStack.md`, `/.well-known/openstack.md` |
| OpenProfile.md | logicsrc-interop | `/.well-known/openprofile.md` |
| OpenPRD 0.3 | asdlc-lifecycle / product domains | `prd/NNNN-slug.md` |
| OpenAgent JSON | sandbox-harness / factory-kernel | `agents/*.json` |
| OpenFleet records | rivet-execution / security | `~/.openfleet/...` |
| OpenWorkflow + index | factory-kernel / visibility | `workflows/*.json`, `/.well-known/openworkflow.json` |
| OpenMCP | port-governance | `/.well-known/openmcp.json` |
| OpenAccess | auth-port-oauth | `/.well-known/openaccess.json` |
| OpenCreds / Credential Sharing | auth-port-oauth / security | vault + sync plans |
| OpenInstall | rivet-execution | `bin/install.sh` |
| task / run / event JSON | factory-kernel | emitted at runtime; fixtures in repo |
| OpenOntology / OpenContext | port-governance | package under schemas/ontology |

---

## 6. Seed PBIs (parallel launch)

PBIs = deltas ([the-pbi](../skills/asdlc/patterns/the-pbi.md)) and are the **typed-contract unit** ([§0.1](#01-unit-of-work--equivalence-chain-19-fields)): each seed PBI **is** the 19-field body (C1–C3 + 1–16) plus ASDLC pointers below. **Lane: Meta.** Linear **Factory Meta** issues are the tracker facet of these same units.

Each has: **Directive**, **Context pointer** → Spec path, **Verification pointer** → Contract scenarios, **Refinement rule** (update Spec in same PR | flag human | deviation log — default: update Spec in same PR), plus full §0.1 fields before start (DoR).

| PBI | Directive (imperative) | Spec pointer | Verification pointer | Refinement rule | Depends |
|-----|------------------------|--------------|-----------------------|-----------------|---------|
| PBI-001 | Author all ten `/specs/*/spec.md` Blueprint+Contract stubs from §4 (**stub authorship only** — not M1 implement DoD; see §13.5) | asdlc-lifecycle | Each stub has Blueprint Context/Architecture/Constraints + Contract DoD/Guardrails/≥1 Gherkin scenario | Update Spec in same PR | — |
| PBI-002 | Write full Nygard ADRs ADR-001…011 under `docs/adrs/` (Context, Decision, Consequences, Alternatives — not one-line table copies); ADR-007 body records Superseded by ADR-011 | asdlc-lifecycle | Every Accepted ADR has all six ADR anatomy sections; ADR-011 present | Update Spec in same PR | PBI-001 |
| PBI-003 | Emit OpenStack.md + OpenProfile.md + AGENTS.md (index only) from stack Specs | logicsrc-interop | Inventory §7 items 1–2 present; AGENTS.md does not dump design | Update Spec in same PR | PBI-001 |
| PBI-004 | Compose Rivet 2.x + Tailscale Serve health | rivet-execution | Contract: health after Compose restart | Update Spec in same PR | PBI-002 |
| PBI-005 | Thin gateway: verify Port webhook HMAC → ProjectSupervisor; Port catalog writes (incl. `factory_claim_next_job`) via §4.2.1 single-writer + `catalogVersion` | port-governance, rivet-execution | Contract: webhook signature verified; Rivet never polls Port; stale catalog write rejected | Update Spec in same PR | PBI-004 |
| PBI-006 | AgentSession + Sandbox Agent Docker + Claude Code first harness | sandbox-harness | Contract: create→prompt→stream→checkpoint; kill preserves session identity | Update Spec in same PR | PBI-004 |
| PBI-007 | ProjectSupervisor fencing + **Meta Beads** ready gate; map Port `executionContract`/`deliveryRun`/`executionAttempt` projections (**Meta only** — does not ship Product Beads) | factory-kernel | Contract: duplicate admit → one attempt; Port-authorized recover | Update Spec in same PR | PBI-005, PBI-006 |
| PBI-008 | Scaffold Next.js Developer OS on Vercel; atlas hero shell; Port OAuth callback Route Handler stub (intended Factory client id; no Observatory reuse) | developer-os | Contract: preview deploy serves shell; OAuth Route Handler stub compiles | Update Spec in same PR | PBI-003 |
| PBI-009 | Wire Rivet Actor native realtime client into Developer OS session view (no CopilotKit) | developer-os, rivet-execution | Contract: reconnect from last `sequence` | Update Spec in same PR | PBI-006, PBI-008 |
| PBI-010 | OpenAccess + OpenMCP well-known files (no Port OAuth create) | auth-port-oauth, port-governance | Inventory §7 items 9–10; no Port mutation | Update Spec in same PR | PBI-003 |
| PBI-011 | GitHub checks → accept on exact SHA | visibility-accept | Contract: rewrite invalidates accept | Update Spec in same PR | PBI-007 |
| PBI-012 | OpenFleet ceilings + gateway rate limit (**implement-gated §13.5** — author stub OK; implement only after M1 accept green) | security-blast-radius | Contract: over-ceiling → ledger `ceiling.refuse` | Update Spec in same PR | PBI-007, PBI-011 + M1 accept |
| PBI-013 | Local gate + CI refuse + schema validators | asdlc-lifecycle | Contract: one local gate refuses dirty/invalid | Update Spec in same PR | PBI-003 |
| PBI-014 | OpenPRD 0001–0005 Accepted aligning product intent to Specs (**author OK; not M1 exit** — §13.6 post-M1) | asdlc-lifecycle | OpenPRD 0.3 ten sections + front-matter valid | Update Spec in same PR | PBI-001 |
| PBI-015 | After first verified coding PBI: run CE `/ce-compound` (HITL); seed `docs/solutions/` + keep AGENTS.md as index | asdlc-lifecycle | Compound gate: ≥1 approved learning or explicit “nothing qualifies” report | Flag human for writeback | PBI-007 |

**Atomicity:** Concurrent PBIs must not share write sets ([the-pbi](../skills/asdlc/patterns/the-pbi.md)). Fan out by Spec domain / worktree. See [§0.5](#05-collision-avoidance-summary).

**Accessibility:** Prefer Port/Linear MCP for PBI state; mirror to `tasks/` if needed ([pbi-authoring](../skills/asdlc/practices/pbi-authoring.md)). Seed pack + live Linear issues must match this §6 table and §0.1 field set ([`linear-pbi-seed/`](./linear-pbi-seed/README.md)).

---

## 7. Context gates & workflow-as-code

Between Spec phases ([context-gates](../skills/asdlc/patterns/context-gates.md)):

**Feature Assembly (defined):** the ASDLC phase after Spec Blueprint+Contract is review-green, when agents may begin implementing code against that Spec (Agentic Double Diamond “Assemble”). Not a separate product. Gates below block Feature Assembly until Spec review + EGM Goldfish pass for that Spec (or this production plan when it is the review target).

| Gate | Type | Enforces |
|------|------|----------|
| Spec review | Output | Blueprint+Contract present before Feature Assembly |
| EGM Goldfish (feature_spec) | Probabilistic | Fresh-context zoom-out / comprehension / design+structural critic on `/specs/*/spec.md` (or this production plan) before Feature Assembly; **canonical artifact roots** = Project `docs/` + `internal/egm-*/` (automation must wire these). Optional local `.dev/docs/` is **upstream-EGM default only** — never the sole automation root. FE-21 owns first master-spec FAIL baseline; FE-40 owns iterate-to-buildable |
| Local gate | Deterministic | typecheck, tests, `@logicsrc/validators`, lint — tooling refuses |
| CI | Deterministic | GitHub Actions on SHA |
| Adversarial review | Probabilistic | Critic agent / human vs Contract ([adversarial practices](../skills/asdlc/practices/adversarial-code-review.md)); map to CE `/ce-code-review` when plugin is the review surface |
| Compound writeback | HITL | After verified PBI: candidate learnings via `/ce-compound` → `docs/solutions/` (or CE `docs_root`); human discriminates; `AGENTS.md` stays index ([compound-loop](../skills/asdlc/patterns/compound-loop.md)) |
| Port accept | Governance | Approval-bound; independent of agent “done” |

Orchestration shell in TypeScript ([workflow-as-code](../skills/asdlc/practices/workflow-as-code.md)): Port webhook handler, Rivet supervisor, Developer OS Route Handlers / Rivet-native session stream — **no** CopilotRuntime / CopilotKit route in kernel (ADR-011). LLM only inside harness/agent steps.

---

## 8. Domain-Driven Specification map

Bounded contexts ([domain-driven-specification](../skills/asdlc/practices/domain-driven-specification.md)):

| Context | Owns | Must not own |
|---------|------|--------------|
| Port governance | Authz, catalog, approvals, MCP gateway; catalog write fencing (§4.2.1) | Durable coding sessions; Rivet admit |
| Rivet execution | Actors, queues, recovery, execution fencing (`ProjectSupervisor`) | Task readiness, identity; Port catalog SoT |
| **Meta Beads** (Product Beads = separate Product instance when shipped) | Ready/claim graph for the lane’s units | Harness process; Port catalog SoT |
| Sandbox harness | In-sandbox agent HTTP API | Authz |
| Developer OS | Next.js + Vercel; Rivet-native stream; MCP Apps/Port iframes | Privileged control; CopilotKit/AG-UI kernel path |
| GitHub | Source + independent CI | Orchestration |

---

## 9. Explicit ASSUMPTIONs (not open questions)

1. Spec-anchored ASDLC; code remains runtime SoT.  
2. No LogicSRC OpenAccess hub in v1 — Port issues tokens.  
3. M1 harness = Claude Code via Sandbox Agent.  
4. Kernel UI streaming = Rivet native; CopilotKit/AG-UI deferred; Rivet↔AG-UI first-party UNVERIFIABLE (any future adapter = design).  
5. S3-compatible artifacts (S3 default).  
6. Single-operator desktop pilot; project-level isolation.  
7. Turso approval ledger not required.  
8. OAuth Factory app **live** (ADR-005); Observatory revoked 2026-10-29 — see [`port-factory-oauth-live.md`](./port-factory-oauth-live.md).  
9. FE-15 feed + audit §§19–22 are the vendor evidence baseline for Developer OS wording.  
10. Integration proof = milestone PBIs, not vendor “Factory” pages.  
11. Live Port `factory_*` workflows + `executionContract`/`deliveryRun`/`executionAttempt` blueprints are the governance surface Rivet attaches behind — Specs name them; agents do not invent parallel Port tool IDs.  
12. Compound Engineering plugin (`cursor-public/680`) is the Plan→Work→Review→Compound execution surface; learnings land in `docs/solutions/` under HITL (ASDLC Compound Loop).  
13. EGM Goldfish review (feature_spec) is a required Spec-review gate. FE-21 owns the first master-spec FAIL baseline ([`egm-master-spec-run.md`](./egm-master-spec-run.md)); FE-40 owns iterate-to-buildable on this file + [`factory-skill-leverage.md`](./factory-skill-leverage.md) ([`egm-skill-leverage-loop.md`](./egm-skill-leverage-loop.md)).  
14. Port no-upsert-CAS is closed by §4.2.1 / [port-factory-data-model.md](./port-factory-data-model.md) §4.1 (single-writer per `{blueprint}:{entityIdentifier}` + `catalogVersion` reject-stale) — not by a Port product CAS API and not by relocating catalog SoT into Rivet.  
15. M1 cost governance is soft caps in §13.7 (tokens/attempt, sandbox CPU/RAM, atlas size) — not OpenFleet production ceilings; hard multi-tenant quotas are post-M1 (`security-blast-radius`).

---

## 10. Document control

**Scanner note:** Two H2s share the title “Document control” — this §10 (early index of companion docs + implement-vs-authorship) and §17 (extended index after §§11–16). Intentional split for readers who stop at §10 vs those who continue past the architecture block; not a merge candidate.

| Doc | Role |
|-----|------|
| **This file** | **Single canonical SoT** (§0): architecture, ADRs, Specs/PBIs, gates, Meta XOR Product, 19-field unit, sync, loop order, collisions, OQs |
| `/specs/{domain}/spec.md` | **Canonical** agent build-against state |
| `docs/adrs/*` | Immutable decisions |
| `tasks/PBI-*` / tracker | Execution deltas |
| [`logicsrc-artifact-inventory.md`](./logicsrc-artifact-inventory.md) | LogicSRC field/path catalog |
| [`skills/asdlc/`](../skills/asdlc/SKILL.md) | Authoritative ASDLC KB |
| [`internal/frontend-stack-feed.md`](../internal/frontend-stack-feed.md) | FE-15 frontend vendor framing |
| [`factory-stack-audit.md`](./factory-stack-audit.md) §§19–22 | Next.js / Vercel / AG-UI / CopilotKit evidence |
| [`factory-stack-gap-solutions.md`](./factory-stack-gap-solutions.md) | Companion: which gap closed in which §11–16 section |
| [`factory-skill-leverage.md`](./factory-skill-leverage.md) | FE-22: ASDLC / CE / EGM / AG-UI / LogicSRC / Port MCP → master-spec bindings |
| [`egm-skill-leverage-loop.md`](./egm-skill-leverage-loop.md) | FE-40: EGM iterate-to-buildable log (master + skill-leverage) |
| §§11–16 (this file) | Rivet↔AG-UI adapter, Code Atlas, Beads/Polygraph/topology, Alternatives, Risks, Linear MCP App |
| §4.2.2 (this file) | Machine-validated Port stack assembly (compatibility rules as catalog data) |
| §12 (this file) | Code Atlas — multi-repo zoomable graph (core cockpit screen) |
| §18 (this file) | Coding vs Cockpit agent classes; Single-MCP principle |
| §19 (this file) | UI state mapping; agent chrome (menu bar + pill primary; Finder-like mode) |
| §20 (this file) | Spec Canvas + Loop/Task Decomposition (core cockpit screen; agent-first Cockpit drive; alongside §12 / §4.2.2 / §19; ties §18) |
| §21 (this file) | Skill leverage bindings (normative index into FE-22 report) |

**Open Johnny decisions for M1 authorship:** `factory_request_release` Johnny-only INPUT (ops). **OQ-1 Meta Beads** is **locked hybrid** (scaffold now; Linear admit/claim SoT until PBI-007) — §0.6 / [`meta-beads-scaffold.md`](./meta-beads-scaffold.md). **ADR-005** OAuth create is **done / live** ([`port-factory-oauth-live.md`](./port-factory-oauth-live.md)). Deferred CopilotKit/AG-UI is ADR-011 — **deferred Accepted ADR**, not an unresolved Spec question. **OQ-2 Notion** is **resolved** (mirror allowed; not SoT). ASSUMPTIONs (§9) are Project bindings, not Johnny blockers. Stack gaps that were previously UNVERIFIABLE-as-vendor-product are closed below as **Factory design contracts** (§§11–16), not as vendor claims. Agent-class + Single-MCP locks are §18. UI state mapping + agent chrome locks are §19. Spec Canvas + loop/task decomposition locks are §20. Skill bindings are §21. Document authority + unit/lane/sync locks are §0.

**Implement vs authorship:** This file is the **production plan**. M1 **code** builds against filled `/specs/*/spec.md` plus depth docs ([`rivet-engineering-spec.md`](./rivet-engineering-spec.md), [`port-factory-data-model.md`](./port-factory-data-model.md), [`logicsrc-artifact-inventory.md`](./logicsrc-artifact-inventory.md)) — not from this plan alone. Gateway package path: `apps/factory-gateway/` (§2).

---

## 11. Rivet↔AG-UI bridge (Factory adapter — no official product)

### 11.1 Official finding (locked)

| Claim | Verdict | Sources |
|-------|---------|---------|
| First-party Rivet ↔ AG-UI integration | **Does not exist** | AG-UI supported-framework tables omit Rivet ([AG-UI introduction](https://docs.ag-ui.com/introduction); [audit §§19–22](./factory-stack-audit.md); [frontend-stack-feed](../internal/frontend-stack-feed.md); [oss-analogs §1](./factory-oss-analogs.md)) |
| Rivet can emit SSE from actors | **Yes** | `onRequest` → `Response` + `ReadableStream` with `Content-Type: text/event-stream`; lifecycle held until stream close/disconnect ([Request Handler](https://rivet.dev/actors/docs/request-handler/); [rivet-full-capacity.md](./rivet-full-capacity.md) § streaming) |
| Sandbox Agent streams session events | **Yes** | `session.onEvent` / SSE; `sessionUpdate` payloads (`agent_message_chunk`, `tool_call`, …) ([Agent Sessions](https://rivet.dev/sandbox-agent/docs/agent-sessions); [rivet-sandbox-agent.md](./rivet-sandbox-agent.md)) |
| AG-UI wire format | Event JSON over SSE (`data: {…}\n\n`) | [EventEncoder](https://docs.ag-ui.com/sdk/python/encoder/overview); [AG-UI events](https://docs.ag-ui.com/sdk/js/core/events) |

**ADR-011 unchanged:** kernel streaming = Rivet Actor native realtime. This §11 is the **optional later** AG-UI path (display only; Port retains mutations).

### 11.2 Adapter placement

```txt
Sandbox Agent (inside Docker)  --SSE sessionUpdate-->  AgentSession Rivet Actor
                                                         |  (persist sequence, state)
                                                         v
                              Factory AG-UI projector  --SSE AG-UI events-->  HttpAgent / CopilotKit
                                                         ^
                                                         |  POST RunAgentInput (prompt)
                              Developer OS BFF Route Handler  (auth: Port OAuth session)
```

- Browser **never** calls Sandbox Agent (ADR-006 / [orchestration architecture](https://rivet.dev/sandbox-agent/docs/orchestration-architecture/)).
- Projector lives as a Rivet Actor `onRequest` route **or** a Next.js Route Handler that reads Actor events and re-encodes — both are Factory code; neither is a Rivet product feature.

### 11.3 SSE → AG-UI mapping (architecture only — post-M1 implement)

**Altitude:** Full `EventType` field tables and adapter TypeScript live in `specs/developer-os/spec.md` Contract **when** AG-UI is adopted — not M1 kernel work (ADR-011; §13.5).

**Data-flow contract (summary):** Projector maps Rivet `AgentSession` / Sandbox `sessionUpdate` streams → AG-UI events (`RUN_*`, `TEXT_MESSAGE_*`, `TOOL_CALL_*`, `STATE_SNAPSHOT`/`DELTA`, `RAW`/`CUSTOM` fallback) using `@ag-ui/core` + SSE `EventEncoder` framing ([AG-UI events](https://docs.ag-ui.com/sdk/js/core/events)). Reconnect = last `sequence` → snapshot + gap replay from Actor storage, then live `onEvent` — same Contract as §4.5 / PBI-009 without CopilotKit. Optional deferred Route Handler `POST /api/agui/[sessionId]` accepts AG-UI `RunAgentInput`, enqueues on `AgentSession` Actor (never browser→Sandbox Agent), returns `text/event-stream`.

**Package (when coded):** `apps/developer-os` or `packages/rivet-agui-adapter`. Detail + golden fixtures vs Sandbox Agent schema = developer-os Spec / R-09 — not this production-plan body.

### 11.4 Reference adapters (pattern only)

Same class of work as LangGraph `@ag-ui/langgraph`, Mastra AG-UI integration, Cloudflare Agents community bridge ([oss-analogs §1](./factory-oss-analogs.md)) — durable runtime → AG-UI projector. Factory owns the Rivet projector; do not wait for vendor listing.

---

## 12. Code Atlas — multi-repo zoomable graph

### 12.1 Product identity

**Code Atlas** is a **Factory Developer OS surface**, not a third-party product name ([audit §7.4](./factory-stack-audit.md) — UNVERIFIABLE as a single vendor). It visualizes three graphs overlaid:

| Layer | System | Graph meaning | Official surface |
|-------|--------|---------------|------------------|
| **Code structure** | Trail-Code (Graft) | Per-repo functions + callers (“what a change can break”) | [trailhq/Trail-Code](https://github.com/trailhq/Trail-Code); [trailhq.com/graft](https://trailhq.com/graft); [claims G2](./factory-claims-verification.md) |
| **Multi-repo session / PR edges** | Polygraph | Cross-repo agent sessions, PR/CI coordination, session memory — **not** an LLM-eval product | [docs.trypolygraph.com](https://docs.trypolygraph.com/); [audit §5](./factory-stack-audit.md); [claims G3](./factory-claims-verification.md) |
| **Task readiness** | Beads | Dependency-aware issue graph: `bd ready` → `bd update --claim` → `bd close` | [beads README](https://github.com/gastownhall/beads); [claims G4](./factory-claims-verification.md) |

#### 12.1.1 Visual design lock (authoritative mockup)

**Canonical visual target:** [`media/code-atlas-mockup.png`](../media/code-atlas-mockup.png) — locked; implement to match, do not redesign.

| Element | Lock |
|---------|------|
| **Composition** | One full-bleed hero: cross-repo **symbol graph** as the dominant plane; **frosted MCP app dock** along the bottom (not a dashboard of competing cards). |
| **Repo clusters** | Distinct clusters for at least `web-app`, `api-service`, `shared-lib` (labels on-cluster). |
| **Nodes** | Symbol/package nodes with a short **accent color bar** on the leading edge of each node (repo/kind cue). |
| **Edges** | **Solid** = intra-repo call/dep edges; **dashed** = cross-repo edges (Polygraph / shared-lib imports). |
| **Atmosphere** | Soft light atmospheric field behind the graph; frosted-glass chrome; no purple/indigo glow theme, no dark-mode default, no floating promo badges on the graph. |
| **Integrations dock** | Frosted translucent strip of MCP App widgets: **Vercel, Convex, Docker, Port, Turso, GitHub** on the primary row, with a quiet second row for additional widgets (e.g. Linear). Matches Integrations UI inventory (§4.5). |
| **Prompts** | Pixel/prompt companion: [`widget-ui-prompts.md`](./widget-ui-prompts.md) — Code Atlas graph + Turso (+ dock peers). |

### 12.2 Reference architecture (patterns, not forks)

| Pattern | Borrow | Factory use |
|---------|--------|-------------|
| **Trail-Code** | Local code-map index + learnings | **M1 authoritative** per-repo symbol/call edges for atlas nodes |
| **Infigraph** ([intuit/infigraph](https://github.com/intuit/infigraph)) | AST + SCIP enrichment; Cypher; multi-repo grouping | **Post-M1** query/layout for cross-repo groups; SCIP optional ([SCIP](https://github.com/scip-code/scip)) |
| **Code-Graph-RAG** ([vitali87/code-graph-rag](https://github.com/vitali87/code-graph-rag)) | Tree-sitter → embedded graph DB | **Post-M1** offline bulk index when Trail-Code gaps exist |
| **Nx project graph** | Monorepo project nodes | Collapse node zoom level “package/project” before symbols (optional) |

### 12.3 Data pipeline (concrete)

1. **Index (async workers, not browser):** **M1:** for each single indexed repo, run `trail init` / Trail-Code map refresh; emit JSONL `{repo, symbolId, kind, path, range, callers[]}` to S3-compatible artifact store (ASSUMPTION 5). Infigraph / Code-Graph-RAG paths are post-M1.
2. **Multi-repo edges:** **Post–single-repo M1** — Polygraph CLI/MCP session graph → edges `{fromRepo, toRepo, kind: session|pr|ci, sessionId}` (§13.2).
3. **Task overlay:** Beads MCP/CLI `bd show` / ready set → nodes `{beadId, status, blockers[]}` linked to repo paths via issue metadata (Factory convention: Beads description cites `repo:path` or Port `executionContract` id).
4. **Serving API:** Next.js Route Handler `GET /api/atlas/subgraph?level=org|repo|package|symbol&focus=&depth=` returns a **viewport-capped** graph (max nodes M1 = 2_000) as `{ nodes, edges, levels }`. No full-monorepo dump to the client.
5. **Auth:** Port External Interface session (ADR-005); atlas is read-only display. Mutations stay Port/Linear/Beads tools.

### 12.4 Rendering approach

- **Library:** WebGL force / hierarchical layout (e.g. sigma.js or regl-based custom) inside the Developer OS **hero full-bleed plane** (§4.5) — one composition, no card grid. Match [`media/code-atlas-mockup.png`](../media/code-atlas-mockup.png).
- **Zoom levels (LOD):**
  - L0 org — **M1:** single-repo / stub org node; **post–single-repo M1:** Polygraph repo nodes + cross-repo session edges (§13.2)  
  - L1 repo — Trail-Code package/dir clusters (`web-app` / `api-service` / `shared-lib` grouping)  
  - L2 package — file nodes  
  - L3 symbol — function/class + caller edges (Trail-Code); solid intra-repo / dashed cross-repo  
  - Overlay toggle — Beads ready/blocked as quiet node accents (not floating hero badges)
- **Interaction (expand-in-place — locked):**
  - **Click a node** → expand **in place** like a file-tree folder: children / symbol contents open **inline within or adjacent to the node**; the surrounding graph **stays visible** and keeps layout context.
  - **Must not** take over the screen, open a full-page route, replace the hero, or navigate the shell away from the atlas composition.
  - **Must not** use a modal takeover, drawer that covers the graph, or “detail page” navigation as the primary expand path.
  - Collapse restores the prior node footprint; sibling expands may coexist when space allows (tree-folder semantics).
  - Optional quiet inspector strip may mirror the expanded node’s metadata **without** hiding the graph.
  - URL state `?atlasFocus=` / expand path for shareable deep links — restores expand-in-place state on load, still without route takeover.
- **Dock:** Frosted MCP widget dock remains visible under the graph while nodes expand (Vercel, Convex, Docker, Port, Turso, GitHub + second row).
- **DoD (measurable, replaces aesthetic-only “atlas hero”):** Preview deploy shows L0 graph for ≥1 indexed repo with ≤2s first paint of skeleton; expand-in-place to L3 loads subgraph via `/api/atlas/subgraph` **without full reload or navigation**; graph canvas remains mounted and visible during expand/collapse; Beads overlay toggle shows ready count from `bd ready` JSON; dock widgets match §4.5 inventory including Turso.

### 12.5 Ownership

| Concern | Owner Spec |
|---------|------------|
| Index + API + UI | `developer-os` (§4.5) |
| Ready overlay semantics | Beads contract (§13.1) |
| Cross-repo edge truth | Polygraph contract (§13.2) |
| Accept still SHA-CI | `visibility-accept` — atlas never accepts |
| Visual lock / prompts | [`media/code-atlas-mockup.png`](../media/code-atlas-mockup.png); [`widget-ui-prompts.md`](./widget-ui-prompts.md) |

---

## Proposed Architecture (M1 index)

**Scanner note:** This unnumbered H2 between §12 and §13 is intentional (FE-22 feature-spec Architecture anchor). Numeric §N resumes at §13; §10 / §21 still index companions.

Feature-spec anchor — component layout for the **M1 vertical slice** (detail in linked §§):

```txt
Human / Cockpit agent
        │  Factory MCP gateway (Port front door + §4.2.1 catalog writer in gateway process)
        ▼
Port (SoT: catalog, RBAC, workflows, audit) --webhook HMAC--> thin gateway --> Rivet ProjectSupervisor
                                                                              │
                                                         Meta Beads ready/claim ─┤
                                                                              ▼
                                                                    WorkAttempt / AgentSession
                                                                              │
                                                                    Sandbox Agent (Docker)
                                                                              │
                                                                    GitHub commit + CI SHA accept
Developer OS (Next.js/Vercel) <-- Rivet Actor realtime (Tailscale Serve) -- Rivet
```

| Plane | Spec / § |
|-------|----------|
| Authz + catalog fence | §4.2 / §4.2.1; ADR-001 |
| Durable admit + actors | §4.3; ADR-002/003; §13.1 **Meta Beads** |
| Coding harness | §4.4; ADR-006 |
| Dev OS + stream | §4.5; ADR-011; §13.4 Serve |
| Accept | §4.8; ADR-008 |
| Agent classes + Single-MCP | §18 |
| Post-M1 display/cockpit design locks | §11, §12, §16, §19, §20 (implement deferred per §13.5) |

---

## 13. EGM majors — component contracts, topology, M1 cut

Resolves residual majors from [`egm-master-spec-run.md`](./egm-master-spec-run.md) / [`internal/egm-master-spec-review/consolidated_review_report.md`](../internal/egm-master-spec-review/consolidated_review_report.md): Beads/Polygraph/Trailcode defs (M5), atlas DoD (M2 — via §12), topology (M8), Problem/Goals (M6), premature ceilings (M1), first-wave collapse (B1).

### 13.0 Problem / Goals / Non-Goals

**Problem:** A single operator needs a governed path from Port-authorized intent → durable Rivet execution → Sandbox Agent coding → GitHub CI accept on exact SHA, without Clerk, without inventing a second catalog, and without treating unverified vendor bridges as products.

**Goals (M1):**
1. Port webhook → gateway → `ProjectSupervisor` → one `WorkAttempt` → Sandbox Agent Docker → commit → CI green accepts.  
2. Developer OS on Vercel shows Rivet-native session stream + Code Atlas L0.  
3. **Meta Beads** gates “ready to claim” (PBI-007); Polygraph optional for multi-repo **after** single-repo M1.  
4. Specs/ADRs/PBIs exist for the M1 path; LogicSRC emit only what M1 Contracts require.

**Non-Goals (M1):** CopilotKit/AG-UI kernel (§11 deferred); CapacityManager multi-cluster; OpenFleet full ceiling matrix in production; LogicSRC ontology/OpenAccess hub; Turso approval ledger; mutating Port catalog from this doc (OAuth app create already **live** — ADR-005 / [`port-factory-oauth-live.md`](./port-factory-oauth-live.md)); **`factory-edge` private tailnet relay** (post-M1 — M1 uses Tailscale Serve/Funnel only, §13.4); **implementing** Linear MCP App (§16), full agent-chrome Finder mode (§19), Spec Canvas loop screen (§20), or §4.2.2 assembly wizard as M1 exit criteria (design locks may be authored; implementation post–PBI-011 green).

### 13.1 Meta Beads — readiness / claim graph (Spec home: factory-kernel)

| Item | Contract |
|------|----------|
| **Role** | Distributed dependency-aware task graph for agents (Dolt). **Not** harness, **not** Port catalog, **not** Rivet runtime ([Beads](https://github.com/gastownhall/beads); [audit §6](./factory-stack-audit.md)). |
| **CLI/MCP** | `bd create` → deps → `bd ready` → `bd update --claim` → `bd close`; JSON output; optional `beads-mcp`. |
| **Factory binding** | `ProjectSupervisor` admits coding work **only** when **Meta Beads** reports the mapped bead ready **or** Port `executionContract` carries an explicit bypass for human-forced runs (audit logged). Claim = `bd update --claim` **before** Rivet queue message that starts Sandbox Agent. **Product Beads does not appear in this binding.** |
| **Projection** | Bead id stored on Port `executionAttempt` / Rivet Actor state as opaque string; Port writes still §4.2.1. |
| **UNVERIFIABLE as vendor API** | Beads does not document Rivet/Port; Factory adapter owns `ReadyTaskEvent` shape. |
| **`ReadyTaskEvent` (M1 Factory shape)** | Minimal JSON produced by gateway/adapter after `bd ready` + `bd update --claim`: `{ beadId, projectId, claimedBy, claimedAt, executionContractId? }`. `ProjectSupervisor` refuses admit without `beadId` (or audited Port bypass id). Full schema lives in `specs/factory-kernel/spec.md` Contract. |

### 13.2 Polygraph — multi-repo meta-harness (Spec home: factory-kernel + visibility)

| Item | Contract |
|------|----------|
| **Role** | Agent-agnostic meta-harness: cross-repo visibility, session memory, PR/CI coordination. Explicit: “Polygraph isn’t an agent.” ([docs](https://docs.trypolygraph.com/); [trypolygraph.com](https://trypolygraph.com/)). |
| **Not** | Formal LLM evaluation / scoring product — that framing is **UNVERIFIED** ([claims G3](./factory-claims-verification.md)). Adversarial `polygraph session review --adversarial` is a **review** feature, usable under visibility Spec, not ADR-008 “evals” as a Polygraph product name. |
| **ADR-008 clarification** | “Polygraph evals” in ADR-008 means **Factory visibility inputs from Polygraph session/review artifacts** (plus Port scorecards / Rivet traces). Separate Inspect-AI-class eval harnesses remain optional ([open-standards](./factory-open-standards.md)). |
| **M1 scope** | **Single-repo path does not require Polygraph.** Multi-repo coordination and Code Atlas L0 cross-repo edges activate when ≥2 repos share a delivery run. |
| **Rivet relation** | Polygraph does not replace `ProjectSupervisor`. Factory may spawn Polygraph sessions as **side coordination**; durable admit remains Rivet. |

### 13.3 Trail-Code — code map (Spec home: developer-os / sandbox)

| Item | Contract |
|------|----------|
| **Role** | Self-learning context layer: code map (ex-Graft) + learnings for coding agents ([Trail-Code](https://github.com/trailhq/Trail-Code)). |
| **Harness use** | Sandbox Agent image may preinstall `@trailhq/trail-code` so in-sandbox agents query the map; atlas indexer (§12) consumes the same map artifacts. |
| **Not** | Task graph (Beads) or multi-repo session bus (Polygraph). |

### 13.4 Topology — desktop Rivet + Vercel Developer OS (resolves M8)

| Plane | Where it runs (M1) | Network |
|-------|--------------------|---------|
| **Rivet control plane + Actor nodes** | Operator desktop Docker Compose (self-host docs: engine + disk + bucket + nodes — [control plane](https://rivet.dev/docs/deploy/self-host/control-plane/)) | Tailscale Serve publishes HTTPS to tailnet for gateway + Actor HTTP/SSE ([Tailscale Serve](https://tailscale.com/docs/features/tailscale-serve); audit §9) |
| **Sandbox Agent** | Docker provider on same host (or cloud provider later) | Reachable only from Rivet Actor / backend SDK |
| **Developer OS** | Next.js on **Vercel** (preview/prod) | Browser → Vercel; BFF Route Handlers call Rivet **via Tailscale Serve HTTPS URL** published from the operator desktop (M1 **locked**). Optional Tailscale Funnel if Serve alone is insufficient for the preview deploy. **No** `factory-edge` relay in M1 (Non-Goal). No browser→Sandbox Agent. |
| **Port** | SaaS | Webhooks to gateway URL (Tailscale Serve HTTPS or public with HMAC) |
| **GitHub CI** | GitHub Actions | Independent accept |

**Optional Funnel risk (when enabled):** Funnel publishes a **public** HTTPS URL to the internet (not tailnet-only). Treat as elevated exposure vs Serve: rotate Funnel URL on compromise or operator change; keep gateway HMAC + Port OAuth / session auth on every BFF→Actor path (never rely on URL obscurity); confirm Funnel ACL/auth checklist before enabling for a preview deploy (see R-15).

**Locked:** Single `ProjectSupervisor` per project (ADR-002). CapacityManager / OpenFleet multi-host ceilings = **post-M1** Spec detail; PBI-012 remains authored but **implementation gated** behind M1 accept green (see §13.5). **Post-M1 optional:** `factory-edge` tiny proxy on tailnet if Serve/Funnel prove insufficient (then add Spec + PBI + R-row before implement).

### 13.5 M1 first-wave authorship cut (resolves B1 without deleting §4–§6)

**Implement / verify first (vertical slice):** Specs `factory-kernel`, `port-governance` (§4.2.1), `rivet-execution`, `sandbox-harness`, `visibility-accept` + PBIs 004–007, 011 + ADR-001…006, 008, 011.

**Author stubs OK, implement later:** `developer-os` (shell+atlas L0 parallelizable as PBI-008/009), `auth-port-oauth` (docs-only Contract), `logicsrc-interop` (OpenStack/OpenProfile/AGENTS only for M1), `security-blast-radius` (gateway HMAC + RBAC only; full OpenFleet ceilings post-M1), `asdlc-lifecycle` (gates + EGM).

**Design-lock authorship OK, M1 implement deferred:** §§11 (AG-UI adapter detail), §16 (Linear MCP App), §19 (full chrome matrix), §20 (Spec Canvas + Beads loop screen), §4.2.2 (assembly wizard) — keep as design contracts; **not** M1 exit criteria. M1 Dev OS = shell + Rivet-native stream + atlas L0 skeleton (PBI-008/009) only.

PBI-001 still creates ten stubs; **Definition of Done for “Factory M1”** = vertical slice green, not all ten Specs fully implemented.

### 13.6 M1 LogicSRC emission cut (resolves EGM M3)

§5 remains the full Spec→file catalog. **M1 implementation emits only:**

| Emit in M1 | Artifact | Owning Spec / PBI |
|------------|----------|-------------------|
| Required | `AGENTS.md` (index only) | logicsrc-interop / PBI-003 |
| Required | `OpenStack.md` + `/.well-known/openstack.md` | logicsrc-interop / PBI-003 |
| Required | `/.well-known/openprofile.md` | logicsrc-interop / PBI-003 |
| Required | `/.well-known/openmcp.json` | port-governance / PBI-010 |
| Required | `/.well-known/openaccess.json` (descriptor only; Port issues tokens) | auth-port-oauth / PBI-010 |
| Optional stub | OpenAgent `agents/coder.factory.json` | sandbox-harness |
| Post-M1 | OpenFleet full ceilings/ledger in production | security-blast-radius / PBI-012 gated |
| Post-M1 | OpenOntology / OpenContext packages | port-governance |
| Post-M1 | Full OpenPRD 0001–0005 batch | asdlc-lifecycle / PBI-014 (author OK; not M1 exit) |
| Post-M1 | OpenWorkflow production index beyond admit/verify stubs | factory-kernel / visibility |

Validate whatever is emitted with `@logicsrc/validators` / `logicsrc prd validate --strict` in the local gate (PBI-013). Do not invent partial conformance for out-of-v1 inventory rows.

### 13.7 M1 success metrics (resolves EGM M10)

| Metric | Target | Evidence |
|--------|--------|----------|
| Vertical-slice accept | ≥1 Port-authorized run → Sandbox Agent → commit → GitHub CI green on exact SHA | PBI-007 + PBI-011 Contracts |
| Admit uniqueness | Duplicate `work.start` → one `WorkAttempt` | factory-kernel Contract |
| Catalog fence | Concurrent writers → one apply, one stale reject | Chaos test R-01 / §4.2.1 |
| Dev OS stream | Reconnect from last Actor `sequence` after BFF blip | PBI-009 |
| Atlas L0 | ≤2s skeleton; expand-in-place without navigation | §12.4 DoD |
| Cost envelope (pilot) | Single-operator desktop Rivet + Vercel preview; no multi-cluster CapacityManager; Port OAuth app live (ADR-005) | §13.0 Non-Goals; [`port-factory-oauth-live.md`](./port-factory-oauth-live.md) |
| LLM tokens / attempt (order-of-magnitude) | ≤2M tokens per `WorkAttempt` soft cap (gateway/harness refuse or human confirm above) | ASSUMPTION 15; sandbox-harness |
| Sandbox resources | ≤4 vCPU / 8 GiB RAM per Sandbox Agent container (Compose defaults) | sandbox-harness / rivet-execution |
| Atlas index size (M1) | ≤2k nodes / ≤50 MiB JSONL per indexed repo | §12.4 DoD; R-08 |

---

## 14. Alternatives considered

| Decision | Chosen | Viable alternatives rejected | Why rejected |
|----------|--------|------------------------------|--------------|
| Auth / SoT | Port External Interface OAuth + catalog (ADR-001/005) | Clerk; Harness Observatory reuse; custom IdP | Clerk out of scope; Observatory is a different app (FREEMIUM 1-app limit); agents/humans must share Port RBAC ([port-capabilities](./port-capabilities.md)) |
| Execution kernel | Rivet Actors + queues (ADR-002) | Temporal; Cloudflare Durable Objects alone; Port workflows as executor | Need single-writer durable admit + Sandbox Agent orchestration docs; Port is governance not runtime ([audit §2–3](./factory-stack-audit.md)) |
| Coding harness | Rivet Sandbox Agent + Docker (ADR-006) | Browser→agent; bare Docker without SA; E2B-only without Rivet session actor | Docs require backend SDK hop; Actors recommended for session persistence ([sandbox-agent](./rivet-sandbox-agent.md)) |
| Build-against IR | ASDLC Spec Blueprint+Contract (ADR-004) | LogicSRC-as-primary; OpenPRD-only; prompt-only | LogicSRC is interop emission; Specs are living agent contracts ([ASDLC](../skills/asdlc/patterns/the-spec.md)) |
| Developer OS stream | Rivet-native realtime (ADR-011) | CopilotKit/AG-UI in kernel; raw Sandbox Agent SSE to browser | No first-party Rivet↔AG-UI; browser must not own harness control; AG-UI deferred as §11 adapter |
| Task readiness | **Meta Beads** (Product Beads separate when shipped) | Markdown TODOs; GitHub Issues alone; Port entities as claim CAS | Beads provides `bd ready` / atomic `--claim`; Port lacks upsert CAS ([claims G4](./factory-claims-verification.md); §4.2.1); Meta XOR Product ([§0.2](#02-meta-xor-product)) |
| Multi-repo coord | Polygraph (post-M1) | Nx alone; manual PR lists; second Rivet mesh | Polygraph is purpose-built meta-harness; not required for single-repo M1 (§13.2) |
| Code intelligence UI | Factory Code Atlas (§12) | Sourcegraph-only; Infigraph fork-as-product; no atlas | Atlas is Factory composition of Trail-Code+Polygraph+Beads; no vendor “Code Atlas” ([audit §7.4](./factory-stack-audit.md)) |
| Human task UI | Linear product + Linear MCP tools | Linear MCP Apps (none exist); Port as only task UI | Official Linear MCP is tools-only ([linear-mcp-apps-verify](./linear-mcp-apps-verify.md)); §16 is Factory custom Apps widget |
| Catalog write fence | §4.2.1 single-writer + `catalogVersion` | Hope Port ships CAS; move SoT to Rivet | Port product has no CAS; Rivet must not become catalog SoT (ADR-001) |

---

## 15. Risks & mitigations

| ID | Risk | Trigger | Mitigation | Exit criteria | Owner Spec |
|----|------|---------|------------|---------------|------------|
| R-01 | Port upsert race on claim/heartbeat | Concurrent `factory_claim_next_job` / writers | §4.2.1 single-writer queue + `catalogVersion` reject-stale | Chaos test: two writers → one apply, one reject | port-governance |
| R-02 | FREEMIUM External Interface app limit blocks Factory OAuth | ~~Create `Factory` fails~~ **Mitigated 2026-10-29:** Observatory revoked; Factory live | Wire live client id ([`port-factory-oauth-live.md`](./port-factory-oauth-live.md)); add HTTPS redirects before preview/prod | Dedicated Factory app exists; Observatory never configured for Dev OS | auth-port-oauth |
| R-03 | Rivet queue fail-before-complete semantics ambiguous | Docs conflict retry vs no-redelivery ([claim-fencing](./rivet-claim-fencing.md)) | All side effects idempotent; supervisor dedupe by `workAttemptId` | Duplicate delivery → one sandbox session | rivet-execution |
| R-04 | Desktop Rivet unreachable from Vercel BFF | Tailscale/relay down | Dev OS shows reconnect banner; no local privileged fallback to Sandbox Agent | Synthetic check: BFF→Actor health via Serve | developer-os / rivet-execution |
| R-05 | ProjectSupervisor SPOF | Process/host death | Rivet Actor durability + single-writer recovery; Compose restart Contract | Kill supervisor → in-flight attempt resumes exactly once | rivet-execution / factory-kernel |
| R-06 | Beads/Port/Rivet desync | Claim without admit or admit without claim | Admit gate requires bead claim id; close bead only after Port evidence or cancel path | Invariant test in PBI-007 | factory-kernel |
| R-07 | Polygraph treated as eval oracle | ADR-008 misread | §13.2 clarification; accept = GitHub SHA only | Accept path never calls Polygraph for pass/fail | visibility-accept |
| R-08 | Atlas index staleness / oversized payload | Full graph to browser | Viewport subgraph API; async reindex; M1 cap 2k nodes | Lighthouse/perf budget on hero; stale banner if index >24h | developer-os |
| R-09 | AG-UI adapter drift from Sandbox Agent schema | New `sessionUpdate` types | `RAW`/`CUSTOM` fallback; adapter golden tests vs SA docs | Fixture suite green on SA version pin | developer-os (§11) |
| R-10 | Linear custom MCP App CSP/CORS breaks in host | Host iframe blocks `api.linear.app` | CSP `connectDomains` allowlist; BFF proxy on Vercel for Linear GraphQL | Widget loads in MCP Apps-capable host + tools-only fallback | developer-os (§16) |
| R-11 | Premature multi-repo / ceiling complexity | Building OpenFleet/CapacityManager before M1 | §13.5 first-wave cut; PBI-012 implement-gated | M1 slice accept green before ceiling work | asdlc-lifecycle |
| R-12 | Sandbox credential leak | Broad tokens in image | Scoped repo tokens; browser never holds them; SA security docs | Secret scan + Contract scenario | sandbox-harness / security |
| R-13 | Beads/Dolt unavailable or graph corrupt | `bd ready` / claim fails mid-admit | Audited Port `executionContract` bypass (§13.1); refuse new admits until `bd` healthy; synthetic `bd ready` in local gate | Local gate + Contract scenario green | factory-kernel |
| R-14 | Tailscale Serve URL unreachable from Vercel BFF | Serve down / ACL miss | Dev OS reconnect banner (R-04); operator restores Serve; **do not** invent `factory-edge` in M1 | Synthetic BFF→Actor health via Serve | developer-os / rivet-execution |
| R-15 | Optional Tailscale Funnel public exposure | Funnel enabled for Vercel→desktop BFF | Public URL + auth checklist (§13.4): HMAC/OAuth still required; rotate Funnel URL on leak/operator change; prefer Serve when tailnet reachability suffices | Checklist signed before Funnel on; synthetic BFF→Actor health via Funnel URL | developer-os / rivet-execution |

---

## 16. Linear MCP Apps widget — Factory custom design

### 16.1 Gap (locked evidence)

Linear’s official MCP is **tools-only** (Streamable HTTP at `https://mcp.linear.app/mcp`). No Linear `ui://` Apps, no iframe widget SDK ([linear-mcp-apps-verify.md](./linear-mcp-apps-verify.md); [linear-factory-task-manager.md](./linear-factory-task-manager.md); [MCP Apps overview](https://apps.extensions.modelcontextprotocol.io/api/documents/overview.html)).

### 16.2 Solution shape

Ship a **Factory-owned** MCP App server (not Linear-vendor) that:

1. Exposes the same task tools agents need **or** proxies/wraps Linear GraphQL via `@linear/sdk`.  
2. Registers MCP Apps UI resources (`ui://…`) so Apps-capable hosts render a sandboxed issue board.  
3. Hosts without Apps still get text tool results (progressive enhancement).

Humans continue to use native Linear UI; agents use tools + optional widget ([task-manager verdict](./linear-factory-task-manager.md)).

### 16.3 Vercel deploy topology

```txt
apps/linear-mcp-app/          # Next.js App Router on Vercel
  app/api/mcp/route.ts        # Streamable HTTP MCP (mcp-handler pattern)
  app/api/linear/graphql/route.ts  # BFF proxy → https://api.linear.app/graphql
  app/api/auth/linear/callback/route.ts  # Linear OAuth PKCE
  public/mcp-apps/
    board.html                # bundled widget (or built to dist/)
    issue.html
```

- **Deploy:** `vercel deploy` / `--prod`; unique `*.vercel.app` ([audit §20](./factory-stack-audit.md)).  
- **Env:** `LINEAR_CLIENT_ID`, `LINEAR_CLIENT_SECRET`, `LINEAR_REDIRECT_URI`, encryption key for token store (Vercel env / OpenCreds — no secrets in git).  
- **MCP URL:** `https://<deployment>/api/mcp` registered in Cursor/Claude as remote MCP.  
- **Do not** replace Port Linear Ocean sync; Port remains catalog mirror ([task-manager §5](./linear-factory-task-manager.md)).

### 16.4 MCP Apps registration (implementation)

**Altitude:** Design-lock authorship / Spec home only — **not** M1 implement (§13.5). Tables below lock the intended MCP Apps contract for a later Spec/PR; they are not an M1 exit checklist.

Per MCP Apps quickstart ([registerAppTool / registerAppResource](https://apps.extensions.modelcontextprotocol.io/api/documents/quickstart.html)):

| Tool | `_meta.ui.resourceUri` | Purpose |
|------|------------------------|---------|
| `factory_linear_board` | `ui://factory-linear/board.html` | Team/project issue list + status filters |
| `factory_linear_issue` | `ui://factory-linear/issue.html` | Single issue detail + comment box |

Resource `_meta.ui.csp.connectDomains`: `https://<deployment>` (BFF only — **not** direct browser→Linear if cookies blocked). Optional `resourceDomains` for static CDN.

Widget HTML uses MCP Apps iframe `postMessage` bridge; on load, host calls tool → `structuredContent` seeds the board; user actions call tools (`save_issue` equivalent) which hit BFF → Linear GraphQL.

### 16.5 Linear API usage (BFF)

**Altitude:** Same as §16.4 — design-lock authorship / Spec home; **not** M1 implement (§13.5). Operation table is the API contract altitude for post-M1 coding, not a build DoD.

| Operation | API | Cite |
|-----------|-----|------|
| Endpoint | `POST https://api.linear.app/graphql` | [Linear GraphQL](https://linear.app/developers/graphql) |
| SDK | `@linear/sdk` `LinearClient` with OAuth `accessToken` | [SDK](https://linear.app/developers/sdk) |
| List issues | `team(id:).issues` / filter by state, project | same |
| Create/update | `issueCreate` / issue update mutations | [Fetching & modifying](https://linear.app/developers/sdk-fetching-and-modifying-data) |
| Comments | `commentCreate` | same |
| OAuth scopes | `read`, `write`, `issues:create`, `comments:create`; agent extras `app:assignable`, `app:mentionable` as needed | [OAuth](https://linear.app/developers/oauth-2-0-authentication) |
| Actor | Prefer `actor=app` for Factory agent identity | [Agents](https://linear.app/developers/agents) |

### 16.6 BFF contract (post-M1 implement — no code in this plan)

**When implementing §16:** Next.js Route Handler under `apps/linear-mcp-app/app/api/linear/graphql` (or Developer OS BFF) maps Port session → Linear OAuth token vault → allowlisted GraphQL via `@linear/sdk`. Allowlist: issue list/create/update, comment create, project list — no `admin` scope. Full handler code belongs in that app Spec/PR, not this production plan (§13.5 design-lock vs implement).

### 16.7 Relationship to official Linear MCP

| Path | When to use |
|------|-------------|
| Official `mcp.linear.app` | Default agent task I/O in Cursor (FE-29) |
| Factory MCP App (§16) | When host supports MCP Apps and operators want an **in-chat board**; still writes to Linear SoR |
| Port Linear actions | When change must pass Port governance/audit |

---

## 17. Document control (extended index)

**Scanner note:** Companion to §10 — same title by design (early vs extended index). See §10 scanner note; do not treat as duplicate conflict.

| Doc | Role |
|-----|------|
| §§11–16 above | Factory design closures for stack gaps (adapter, atlas, component contracts, alternatives, risks, Linear Apps) |
| §4.2.2 | Machine-validated stack assembly (Port compatibility catalog) |
| §12 | Code Atlas core cockpit screen |
| §18 below | Coding vs Cockpit agents; Single-MCP universal control surface |
| §19 below | UI state mapping across surfaces; agent chrome (dual primary + Finder-like mode) |
| §20 below | Spec Canvas + Loop/Task Decomposition (core cockpit; agent-first via §18) |
| §21 below | Skill leverage bindings (ASDLC / CE / EGM / AG-UI / LogicSRC / Port MCP) |
| [`factory-stack-gap-solutions.md`](./factory-stack-gap-solutions.md) | Companion map: gap → section |
| [`factory-skill-leverage.md`](./factory-skill-leverage.md) | FE-22 skill → master-spec contribution map |
| [`egm-master-spec-run.md`](./egm-master-spec-run.md) | EGM FAIL baseline this remediation addresses |
| [`egm-skill-leverage-loop.md`](./egm-skill-leverage-loop.md) | FE-40 EGM iterate-to-buildable (master + skill-leverage) |
| [`linear-mcp-apps-verify.md`](./linear-mcp-apps-verify.md) | Evidence Linear Apps absent |

---

## 18. Agent classes & Single-MCP control surface

**Locks:** Two agent **classes** only — **Coding** and **Cockpit**. Named **agent types** for typed contracts = [§0.7 roster](#07-agent-type-roster-johnny-locked) (Muse, ChatGPT regular, ChatGPT Work, Codex, Grok, Claude, Claude Code, Claude Design; extensible). Distinguish **personal-agent tasks** (Port/browser/provisioning → Cockpit) vs **coding-agent tasks** (admitted Sandbox Agent code → Coding). One Factory MCP gateway is the universal control surface for both classes and for every integration. Developer OS UI is a client of that same gateway, not a second control plane. Privileged mutations remain Port-governed (§4.2.1 fencing unchanged). Coding harness remains Rivet Sandbox Agent (ADR-006). Evidence: [`rivet-sandbox-agent.md`](./rivet-sandbox-agent.md), [`rivet-full-capacity.md`](./rivet-full-capacity.md) §4/§7, [`port-full-capacity.md`](./port-full-capacity.md) §4, ADR-001/003/006.

### 18.1 Distinction

| Dimension | **Coding agent** | **Cockpit agent** |
|-----------|------------------|-------------------|
| Job | Write and execute code for one admitted build task | Operate Factory at human-operator breadth: provision, configure, assemble, answer, govern, and spawn coding work |
| Runtime | Inside a Rivet **Sandbox Agent** harness (HTTP server in Docker sandbox; one agent process per session) | Outside the sandbox: Port-authorized agent identity calling the **Factory MCP gateway** (and Rivet Actors only through gateway-admitted paths) |
| Scope | Single `WorkAttempt` ↔ single `AgentSession` ↔ single sandbox lease | Cross-project / cross-integration; not limited to coding |
| Writes code? | Yes — files, tests, commits inside the leased sandbox | Only by **delegating** to a Coding agent (never raw Sandbox Agent from the browser or from an ungoverned client) |
| Talks to Sandbox Agent HTTP? | Yes — as the in-sandbox process (Claude Code / Codex / OpenCode / Cursor / Amp / Pi per SA docs) | No direct browser/client→SA; cockpit calls Factory MCP tools that enqueue on `ProjectSupervisor` / `AgentSession` Actors (SA orchestration architecture) |
| Auth | Scoped repo token + machine path for that attempt; credentials stay server-side | Port person or machine identity (same External Interface / MCP auth surface as humans — ADR-005) |
| Acceptance | Cannot self-accept; CI / Port accept gates | May request release / record verdict via Port workflows; cannot bypass Johnny-only INPUT where configured |

Do not conflate: Rivet **Actors** (orchestration/persistence) ≠ Sandbox Agent (in-sandbox coding control). Cockpit owns intent and governance; Coding owns the code change under that intent.

### 18.2 Coding agent — harness binding

1. **Admit:** `ProjectSupervisor` admits only when **Meta Beads** reports ready (or Port `executionContract` carries audited human bypass) and capacity allows ([§13.1](#131-meta-beads--readiness--claim-graph-spec-home-factory-kernel); [rivet-engineering-spec](./rivet-engineering-spec.md)).  
2. **Claim:** `bd update --claim` (or Port `factory_claim_next_job`) **before** the Rivet queue message that starts Sandbox Agent.  
3. **Lease:** One `WorkAttempt` actor → one `SandboxLease` → Docker Sandbox Agent (`SandboxAgent.start` → provision → install → boot → `/v1/health`).  
4. **Session:** `AgentSession` owns lifecycle/persistence; SDK runs on Rivet backend only ([SA multiplayer](https://rivet.dev/sandbox-agent/docs/multiplayer/); [SA security](https://rivet.dev/sandbox-agent/docs/security/)).  
5. **Work:** Prompt → stream `sessionUpdate` → checkpoint commit → evidence to Port (`factory_submit_evidence`). Kill sandbox preserves session identity; unsaved FS is lost (sandbox-harness Contract).  
6. **Exit:** Attempt completes/fails; Coding agent does not provision Vercel/Convex/Port entities or adjust org settings — that is Cockpit work.

Correlation IDs stay `projectId→taskId→workAttemptId→actorId→sandboxId→agentSessionId→traceId→commitSHA` (factory-kernel).

### 18.3 Cockpit agent — tool surface

Cockpit agents call **only** the Factory MCP gateway. The gateway aggregates Port MCP (catalog, workflows, audit, connectors) plus Factory-owned MCP Apps/tools registered behind Port RBAC. Concrete tool families:

| Capability | How (MCP / workflow) | Integrations touched |
|------------|----------------------|----------------------|
| **Catalog read/write** | Port blueprints/entities via MCP; every write through §4.2.1 single-writer + `catalogVersion` | Port Context Lake |
| **Provision resources** | Self-service workflows: `list_self_service_triggers` → `trigger_run` (stack/GitHub/Linear/Vercel/Convex/Sprite provision workflows already on the org) | Port → provider backends (`WEBHOOK`, `GITHUB`, `INTEGRATION_ACTION`, …) |
| **Start coding agents** | `factory_create_execution_contract` / `factory_start_delivery_run` / `factory_claim_next_job` → webhook → thin gateway → `ProjectSupervisor` → Sandbox Agent path (§18.4) | Port, Rivet, Docker, GitHub |
| **Run GitHub Actions / CI** | Port GitHub Ocean / workflow backends; monitor check suites; map SHA into `WorkAttempt.awaitEvidence` | GitHub, Port |
| **Adjust settings** | Port entity/workflow updates for product/service/runner config; MCP connectors with allowed-tool lists for live provider APIs | Port, Vercel, Convex, Docker, Linear, Rivet Cloud MCP where connected |
| **Task / issue board** | Official Linear MCP and/or Factory Linear MCP App (§16); Port Linear sync remains mirror | Linear, Port |
| **Answer questions** | Port Context Lake search, audit (`search_audit_logs`), blueprint/entity reads, scorecards — read tools under role | Port |
| **Assemble software** | Compose catalogued modules: resolve Port `product`/`service`/`stackTemplate`/`skill`/`agentPlugin` entities → **§4.2.2 machine-validate compatibility** → emit assembly plan → GitHub Actions / Port workflows provision-connect → open delivery runs / Coding attempts per module Spec. **Post-M1 implement** (§13.5 design-lock; M1 does not require assembly wizard) | Port catalog (+ compatibility rules); Rivet `AssemblyWorkflow` post-M1; Coding agents |
| **Approvals / release** | `submit_input_node_response` on INPUT nodes; `factory_record_review_verdict`; `factory_request_release` (Johnny-only where configured) | Port |
| **Observe runs** | `get_run` / `list_runs`; Rivet session stream via Developer OS BFF (display only) | Port, Rivet |

**Parity rule:** Anything a human can do through Developer OS UI or Port UI that is exposed as a Port action/workflow/MCP tool is callable by a Cockpit agent with matching Port roles. UI is not a privilege escalate — same tools, same audit.

**Hard bans for Cockpit:** browser→Sandbox Agent control API; inventing parallel Port tool IDs; dual-writing catalog outside §4.2.1 writer; reusing Harness Observatory OAuth (ADR-005).

### 18.4 Delegation — Cockpit → Coding

```txt
Client (Claude / ChatGPT / Cursor / custom / Developer OS)
  --MCP-->  Factory MCP gateway (Port + connectors + Factory Apps)
              --trigger_run factory_start_delivery_run / work.start-->
                Port workflow webhook (signed)
                  --> thin Rivet gateway (verify Port identity)
                    --> ProjectSupervisor.admit
                      --> WorkAttempt + AgentSession + SandboxLease
                        --> Sandbox Agent (Docker) / coding process
                          --> commit SHA --> CI --> Port accept
```

Rules:

1. Cockpit never holds sandbox credentials; Rivet Actors own SA SDK calls.  
2. One Coding agent per admitted `WorkAttempt`; fan-out = multiple attempts under OpenFleet / CapacityManager ceilings (security-blast-radius Spec), each still a Coding agent.  
3. Cockpit may cancel/extend via Port/Rivet tools that signal `WorkAttempt` — not by SSHing the container.  
4. Evidence and accept stay independent of agent self-report (visibility-accept Spec).  
5. Polygraph may request child coding via `DelegateCoding` into Rivet; Rivet still creates a child `WorkAttempt` under the same idempotency namespace — Cockpit/Polygraph do not double-dispatch ([rivet-engineering-spec](./rivet-engineering-spec.md)).

### 18.5 Single-MCP principle

**One Factory MCP gateway exposes control over everything** — not “cockpit UI only,” not a per-vendor MCP sprawl for privileged Factory operations.

| Rule | Concrete binding |
|------|------------------|
| **One entry URL** | Clients register a single Factory MCP endpoint (Port MCP as governed front door; Factory-owned Apps such as §16 Linear widget register **behind** that governance / as named connectors — operators do not need N privileged raw provider MCPs for Factory control). |
| **Every capability** | Catalog, provision, coding-agent start/cancel, GitHub Actions/CI steering, settings across Port/Vercel/Convex/Docker/Linear/Rivet, Q&A over Context Lake, assemble-from-catalog — all appear as MCP tools (Port workflows auto-exposed via `list_self_service_triggers` / `trigger_run`; connectors add live provider tools under RBAC). |
| **Every client** | Any MCP-capable host — Claude, ChatGPT (plugins/MCP), Cursor, custom agents, Developer OS — uses the same tool surface with Port person or machine auth. |
| **Every agent class** | Cockpit agents call tools directly. Coding agents do not replace the gateway; they are **started by** gateway tools and run inside SA. Humans in UI invoke the same workflows. |
| **No shadow control planes** | Raw provider dashboards remain available to humans for break-glass; Factory **agents** do not get a second ungated API path for the same mutations. Side-effectful provider calls go through Port workflows/connectors ([port-full-capacity §4](./port-full-capacity.md)). |
| **Audit** | Mutations produce Port audit entries; MCP connector use is audited; coding evidence attaches to `deliveryRun` / `executionAttempt`. |

**OpenMCP emission:** `/.well-known/openmcp.json` (logicsrc-interop) advertises this gateway as the interoperability descriptor — documentation of the one surface, not a second runtime.

**Relationship to other MCPs:** Official Linear MCP, Rivet Cloud MCP (`https://mcp.rivet.dev/mcp`), Vercel helpers, etc. may exist as **connected backends** or optional operator sidecars. Factory’s product rule remains: **privileged Factory control = one gateway**. Coding-harness MCP config inside a sandbox (`/v1/config/mcp` on Sandbox Agent) is session-local tool wiring for that Coding agent — not a second org control plane.

---

## 19. UI state mapping & agent chrome

**Locks:** Developer OS is a **display + intent** client of the Factory MCP gateway and Rivet Actor streams (§4.5, §18) — never a second control plane. Kernel realtime = Rivet Actor SSE/native client (ADR-011). Optional AG-UI projector = §11 (display remap only). Privileged mutations stay Port-governed (§4.2.1 unchanged). Code Atlas visual lock (§12) and agent-class rules (§18) are unchanged. Spec home for shell chrome: `specs/developer-os/spec.md`. **Post-M1 implement** (§13.5 design-lock; M1 Dev OS = shell + Rivet-native stream + atlas L0 only — full chrome / Finder mode not M1 exit). All §19 subsections inherit this guard.

### 19.1 Chosen agent-communication chrome (primary dual pattern)

**Chosen primary:** macOS-style top **menu bar** + always-visible floating **chat pill**. These are one dual pattern with hard ownership split — not alternatives to each other.

| Surface | Role | Owns | Does not own |
|---------|------|------|--------------|
| **Menu bar** (Files-like / macOS menu bar, edge-to-edge top of Developer OS) | Global agent **commands and status** | Menus: Factory / Agents / Repo / Run / View / Window / Help. Global agent roster status (busy/waiting/error/done dots). Repo focus switcher. Admit/cancel/extend via same Port/MCP tools as Cockpit (§18.3). Menu-bar status cluster for focused `WorkAttempt` / Cockpit session. | Conversation transcript; free-form chat composition |
| **Chat pill** (frosted floating cutout, bottom-trailing over atlas/dock) | Always-visible **conversation affordance** | Click → opens agent chat panel (slide-over or docked sheet). Shows unread/waiting badge; pulse when focused agent is `busy`. Routes human messages through Developer OS BFF → Factory MCP / `AgentSession` prompt enqueue (never browser→Sandbox Agent). | Global menus; org-wide command inventory; silent status-only browsing |

**Interaction rules:**

1. Menu bar remains mounted on every Developer OS route (Code Atlas hero, MCP dock focus, session inspector, Finder-like mode).  
2. Pill remains mounted whenever an agent session exists or can be started; empty-state pill still opens chat to “start / pick agent.”  
3. Opening chat from the pill does **not** dismiss the menu bar or replace the atlas hero (§12 expand-in-place rule still holds for graph nodes).  
4. Menu commands that need dialogue (e.g. Agents → Message…) open the **same** chat panel the pill opens — one conversation surface.  
5. Visual: frosted-glass chrome consistent with §4.5 / §12.1.1; pill is a translucent cutout, not a card grid item; no floating promo badges on the atlas.

### 19.2 Finder-like interface (first-class alternative mode)

**Mode, not replacement of the dual pattern.** View → **Browse agents & context** (or shortcut) switches the main content plane from Code Atlas hero to a **Finder-like** file-manager layout. Menu bar + chat pill **stay mounted** with the same ownership as §19.1.

| Pane | Contents | Semantics |
|------|----------|-----------|
| **Sidebar** | Hierarchy: `Orgs → Projects → Repos → Agents → Sessions → Artifacts` | Each row is a browsable item (folder or leaf). Agent rows show state glyph (busy/waiting/error/done). Repo rows show live accent from Port `service` / Polygraph focus. |
| **Column / list view** | Children of selection: Coding agents under a repo; Cockpit sessions under project; Beads ready set; Trail-Code map artifacts; Rivet `WorkAttempt` leaves | Sort by updated / state. Multi-select for batch cancel only via Port/MCP tools (no ungated kills). |
| **Preview / inspector** | Selected item metadata + live stream excerpt | For an `AgentSession`: last `sequence`, plan steps, tool-call titles. For a repo: Vercel deploy status, Convex sync clock, Docker lease, GitHub check rollup. Does **not** become a modal takeover of the shell. |
| **Path bar** | Breadcrumb `Project / repo / agent / session` | Click any segment to navigate columns; deep-link `?browseFocus=` mirrors atlas `?atlasFocus=` pattern. |

**How Finder-like uses agent conversation:** selecting an agent/session and pressing Return (or toolbar “Open chat”) focuses that thread in the **same pill-opened chat panel**. Finder-like is the **browse/context** mode; the pill remains the conversation affordance; the menu bar remains commands/status.

**Frosted-glass cockpit fit:** Finder chrome uses the same translucent materials as the MCP dock and pill — sidebar and columns are frosted panels over the soft atmospheric field (§12.1.1), not opaque OS chrome. Switching atlas ↔ Finder is a content-plane swap under the frosted menu bar; the bottom MCP dock (Vercel, Convex, Docker, Port, Turso, GitHub + Linear second row) remains visible unless the operator explicitly hides the dock (View menu).

**When to use which:**

| Intent | Surface |
|--------|---------|
| Watch graph / cross-repo edges | Code Atlas (§12) + dual chrome |
| Issue a global command / see fleet status | Menu bar |
| Talk to an agent | Chat pill → chat panel |
| Hunt sessions, artifacts, per-repo context like files | Finder-like mode |

### 19.3 Agent state surface (busy / waiting / error / done)

Canonical UI states map from Rivet `AgentSession` / `WorkAttempt` lifecycle (+ Cockpit tool-run status). Kernel wire = Rivet Actor events; deferred AG-UI remap = §11.3.

| UI state | Source signal | Menu bar | Chat pill | Finder-like row | Atlas / dock |
|----------|---------------|----------|-----------|-----------------|--------------|
| **busy** | `sessionUpdate` streaming (`agent_message_chunk`, `tool_call` in_progress); AG-UI `RUN_STARTED` / content / `TOOL_CALL_*` | Animated status glyph on Agents menu + focused-attempt cluster | Pill pulse; open chat shows live tokens | Spinner / activity glyph on agent leaf | Repo cluster soft activity accent; focused attempt edge highlight |
| **waiting** | Attempt admitted but blocked on human INPUT / Beads blocker / approval node; or idle between turns with open prompt | Amber static glyph; Agents → Waiting submenu lists them | Badge count on pill | Pause glyph; “Waiting on …” subtitle from blocker id | Beads overlay accent on blocked nodes (§12.4) |
| **error** | `RUN_ERROR` / attempt fail / harness health fail; typed error on Actor | Red glyph; Error submenu with `workAttemptId` | Pill error tick; chat shows error banner (no accept claim) | Error glyph; preview shows typed message | Repo/PR edge may show fail cue from GitHub check projection |
| **done** | `RUN_FINISHED` / attempt success (evidence submitted; accept is separate Port gate) | Quiet check; moves to Recents | Pill idle; chat thread marked complete | Check glyph; sorts under Done | Atlas may show commit SHA tip from Trail-Code refresh after index |

**Rules:** UI never invents accept from `done` (visibility-accept Spec). Cockpit agent tool runs use the same four glyphs on the menu-bar status cluster. State transitions are driven only by Rivet sequence / Port projections — not by optimistic client timers.

### 19.4 Per-surface state map (repo-scoped + cross-screen)

Each integration owns a **canonical state object** in the Developer OS client store (`repoId` + optional `projectId`). Screens subscribe; they do not poll vendors from the browser except through BFF/MCP.

| Surface | Canonical state fields | Primary screen(s) | Cross-screen consumers | Mutation path (not UI-local) |
|---------|------------------------|-------------------|------------------------|------------------------------|
| **Port catalog** | `entityIdentifier`, `blueprint`, `catalogVersion`, claim/heartbeat fields | Port MCP dock widget; Finder → Catalog folder | Menu bar Factory status; assembly wizard (§4.2.2); claim lists | §4.2.1 single-writer + `catalogVersion` reject-stale only |
| **Linear** | Issue id, status, assignee, project, linked `executionContract` | Linear dock / §16 MCP App widget; Finder → Tasks | Beads overlay (mirror); menu bar Run → Issues | Linear MCP / Factory Linear App / Port Linear actions |
| **Vercel** | Project, deployment id, readyState, url, git SHA | Vercel dock widget | Atlas repo tip (deploy SHA); Finder preview | Port/Vercel connector workflows |
| **Convex** | Deployment name, sync timestamp, component health | Convex dock widget | Finder preview; session inspector if functions back UI | Port/Convex provision + connector |
| **Docker** | `sandboxId`, lease, image pin, `/v1/health` | Docker dock widget; session inspector | Menu bar Agents (lease health); Finder agent leaf | Rivet `SandboxLease` / SA SDK (server-side) |
| **GitHub** | Repo, default branch, PR number, check rollup, SHA | GitHub dock widget; Finder → Repo | Atlas dashed PR edges; Polygraph session edges; done-state SHA | Port GitHub Ocean / Actions workflows |
| **Rivet** | `actorId`, `workAttemptId`, `agentSessionId`, `sequence`, attempt phase | Session stream view; menu bar status; Finder → Sessions | Pill chat; atlas activity; all agent glyphs (§19.3) | `ProjectSupervisor` / Actors via gateway |
| **Polygraph** | Session id, repo set, PR/CI edges, memory refs | Code Atlas L0 edges (§12); Finder → Sessions (multi-repo) | Menu bar Repo focus; Rivet child attempts (§18.4) | Polygraph CLI/MCP → Rivet `DelegateCoding` |
| **Beads** | Bead id, ready/blocked, blockers[], claim holder | Atlas Beads overlay; Finder → Ready | Admit gate (§18.2); waiting state | `bd ready` / `bd update --claim` / Port claim tools |
| **Trail-Code** | Per-repo symbol map generation, path, callers | Atlas L1–L3 (§12); Finder → Artifacts / Maps | Expand-in-place inspector | Async index workers (§12.3) — read-only in UI |
| **Code Atlas** | LOD level, `atlasFocus`, expand path, overlay toggles | Hero full-bleed (§12) | Menu bar View; pill does not steal hero | Read-only display; focus is URL/UI state only |

**Per-repo propagation rule:** a state change is always keyed by `repoId` (and `projectId` when cross-repo). Updating one repo’s GitHub check rollup refreshes that repo’s atlas cluster, GitHub dock tile, Finder preview, and any agent leaf whose `WorkAttempt` cites that SHA — without remounting unrelated repos.

### 19.5 Realtime propagation (Rivet SSE / AG-UI §11)

```txt
Sandbox Agent --SSE sessionUpdate--> AgentSession Actor (persist sequence)
        |                                  |
        |                                  +--> Developer OS Rivet-native client  (kernel path, ADR-011)
        |                                  +--> §11 AG-UI projector --SSE--> deferred HttpAgent/CopilotKit
        v
Port projections (§4.2.1 writer) --> Port widgets / catalog screens
Polygraph / Beads / Trail-Code / Vercel / Convex / GitHub / Docker
        --> BFF or MCP read tools --> client store by repoId
```

| Step | Binding |
|------|---------|
| **Ingress** | Coding: SA `sessionUpdate` into Actor. Cockpit: MCP tool result + Port webhook → thin gateway → Actors / catalog writer. |
| **Kernel fan-out** | Developer OS subscribes to Actor stream with last `sequence`; on event, updates agent state machine (§19.3) and repo-scoped slices (§19.4). Reconnect = snapshot + gap replay (§11.3 / §4.5 Contract). |
| **Deferred AG-UI** | Same Actor events remapped per §11.3 (`RUN_*`, `TEXT_MESSAGE_*`, `TOOL_CALL_*`, `STATE_SNAPSHOT`/`DELTA`). UI state glyphs derive from the same lifecycle; AG-UI does not own a second state store. |
| **Catalog / vendor** | Port entity changes after §4.2.1 apply; widgets refresh via Port MCP/iframe. Vercel/Convex/GitHub/Docker tiles refresh on BFF poll-or-push from connectors — browser never holds provider admin tokens. |
| **Graph layers** | Polygraph session/PR edges and Beads ready set invalidate atlas subgraph queries (`/api/atlas/subgraph`) for affected `repoId`s; Trail-Code refresh lands asynchronously then bumps atlas LOD data. |
| **Chrome sync** | One client store feeds menu bar glyphs, pill badges, Finder rows, atlas accents, and dock tiles — no per-widget private agent state. |

**Hard bans:** raw Sandbox Agent SSE to the browser; dual-writing Port catalog outside §4.2.1; treating AG-UI or UI chrome as authoritative for accept/claim; Finder-like or pill inventing control APIs outside the Factory MCP gateway (§18.5).

---

## 20. Spec Canvas + Loop/Task Decomposition

**Locks:** Core Developer OS cockpit screen **alongside** Code Atlas ([§12](#12-code-atlas--multi-repo-zoomable-graph)) and Port machine-validated stack assembly ([§4.2.2](#422-machine-validated-stack-assembly)). Does not replace atlas hero, assembly validation, or agent chrome ([§19](#19-ui-state-mapping--agent-chrome)). **Agent-first:** Cockpit agent drives the canvas; human supervises ([§18](#18-agent-classes--single-mcp-control-surface)). Display + intent client of the Factory MCP gateway ([§18.5](#185-single-mcp-principle)); privileged mutations stay Port-governed ([§4.2.1](#421-canonical-port-catalog-write-fencing-no-upsert-cas-fix)). Beads readiness semantics stay [§13.1](#131-meta-beads--readiness--claim-graph-spec-home-factory-kernel); Rivet admit stays ADR-002. Spec home: `specs/developer-os/spec.md` (canvas UI) + `specs/factory-kernel/spec.md` (Beads → admit binding). **Post-M1 implement** (§13.5 design-lock; Spec Canvas + Beads loop screen not M1 exit). All §20 subsections inherit this guard.

### 20.1 Product identity — third core cockpit screen

| Screen | Job | Section |
|--------|-----|---------|
| **Code Atlas** | Multi-repo zoomable code/session/task graph | [§12](#12-code-atlas--multi-repo-zoomable-graph) |
| **Port assembly** | Choose stack → machine-validate compatibility → provision | [§4.2.2](#422-machine-validated-stack-assembly) |
| **Spec Canvas + Loop** | Author/view Spec as a canvas; Beads-decompose into ready / blocked / parallelizable work; watch execution status for the full loop in one place | **This §20** |

View → **Spec Canvas** (or post-assembly deep-link) swaps the main content plane to this screen. Menu bar + chat pill + MCP dock remain mounted per [§19.1](#191-chosen-agent-communication-chrome-primary-dual-pattern) / [§19.2](#192-finder-like-interface-first-class-alternative-mode) — content-plane swap only, same chrome ownership.

### 20.2 Agent-first operation (Cockpit drives)

**Operating model:** Spec Canvas is operated **mainly by the Cockpit agent** ([§18.1](#181-distinction) / [§18.3](#183-cockpit-agent--tool-surface)). The agent places Specs, flags catalog gaps, creates Beads, and manages decomposition/loop progress. The human **supervises and intervenes**; the agent **drives**. UI is a shared client of the same tools — not a human-only control path ([§18.5](#185-single-mcp-principle) parity rule).

| Actor | Role on Spec Canvas |
|-------|---------------------|
| **Cockpit agent** | Primary operator: open/bind Spec after §4.2.2-validated stack; place Blueprint/Contract blocks; classify catalog hit vs **needs implementation**; create/update Beads + deps; set ready / blocked / parallelizable; start Coding via `factory_start_delivery_run` / claim path ([§18.4](#184-delegation--cockpit--coding)); keep Execution lane current |
| **Human** | Supervise: approve/reject, edit Spec text, force audit-logged bypass, cancel/extend attempts, Johnny-only INPUT / release where configured; intervene via the same UI that mirrors agent tool results |
| **Coding agent** | Implements flagged gaps inside Sandbox Agent under admitted `WorkAttempt` only — never drives Spec Canvas placement or Beads graph ([§18.2](#182-coding-agent--harness-binding)) |

**Same tool interfaces (locked):**

1. Every canvas mutation a human can trigger in Developer OS (place Spec stub, flag gap, link Port entity, `bd create` / deps, claim, start delivery run) is an MCP/Port workflow tool the Cockpit agent calls with matching Port roles.  
2. Agent tool results project onto the canvas lanes (Spec / Decomposition / Execution) through the §19 client store — humans watch the agent work in real time; they do not need a parallel “agent console.”  
3. Human clicks in UI invoke the **same** Factory MCP / Port tools (parity — [§18.3](#183-cockpit-agent--tool-surface)); UI never gains privileged APIs the gateway lacks.  
4. Cockpit may not write Spec Canvas state through a shadow API, raw Sandbox Agent, or ungated provider path ([§18.5](#185-single-mcp-principle) hard bans).

**DoD (agent-first):** A Cockpit agent session can, without human clicks: place a Spec stub for a validated stack, flag ≥1 catalog miss, create Beads with deps, and surface Ready vs Blocked on the Decomposition lane. Human intervention (edit, cancel, approve) uses the same tools and remains optional for the happy path until a Contract gate requires HITL.

### 20.3 Entry — stack selected, Spec authored

Concrete Cockpit-driven flow (human may mirror any step in UI):

1. Cockpit agent **chooses a stack** (template + modules) via Factory MCP / Port catalog (human may pick the same via Developer OS).
2. **Port validates** compatibility per [§4.2.2](#422-machine-validated-stack-assembly); reject → no Spec Canvas admit for that combo; surface machine-readable reasons + alternatives.
3. On success: Cockpit **opens/binds Spec Canvas** for the target domain Spec path (`/specs/{domain}/spec.md` or new Spec stub from assembly plan). Stack choice + `product`/`service`/`stackTemplate` ids are bound as canvas metadata (read from Port; writes under §4.2.1).
4. Cockpit **places** Blueprint + Contract blocks on the canvas (living Spec anatomy — [§1](#1-artifact-hierarchy-asdlc) / [§2](#2-repository-layout-mandated)); human supervises and may edit. Canvas is the Spec, not a parallel IR.

**ASSUMPTION:** Canvas persists Spec markdown (and derived JSON emissions LogicSRC Contracts require); it does not invent a second SoT beside `/specs/{domain}/spec.md`.

### 20.4 Spec Canvas plane

| Element | Concrete binding |
|---------|------------------|
| **Layout** | One composition: Spec document as the primary plane (Blueprint Context / Architecture / Constraints + Contract DoD / Guardrails / Scenarios as navigable regions), not a card dashboard. Frosted chrome consistent with [§12.1.1](#1211-visual-design-lock-authoritative-mockup) / §4.5. |
| **Nodes / blocks** | Each Blueprint Architecture module, Constraint, Contract scenario, and referenced Port catalog entity (`stackTemplate`, `convexComponent`, `shadcnComponent`, `skill`, `agentPlugin`, …) is a canvas block with stable `blockId`. Cockpit agent places/updates blocks via MCP tools; UI reflects the same. |
| **Edges** | Spec-internal refs (scenario → constraint; architecture module → Port entity) as solid edges; cross-Spec / cross-repo pointers as dashed (same visual language as atlas intra/cross edges — [§12.4](#124-rendering-approach)). |
| **Composable vs gap** | Every architecture/module block is classified against the Port composable catalog (entities already modeled for assembly — [§4.2.2](#422-machine-validated-stack-assembly); [port-factory-data-model.md](./port-factory-data-model.md) §2.1). Classification is a Cockpit tool result, not a human-only checklist. |
| **Catalog hit** | Block shows quiet catalog accent + entity identifier; assemble/provision path available. |
| **Catalog miss (flag)** | Block flagged **needs implementation** — not in composable catalog. Badge is on the block (not a floating promo sticker on the hero). Cockpit agent raises the flag; flagged gaps become Beads decomposition inputs (§20.5); Coding agents implement them; they are not silently treated as provisionable modules. |
| **Read vs write** | Canvas edits that mutate Spec files go through git/PR path (living-specs). Catalog mutations (linking a block to an entity, creating `executionContract`) go through Factory MCP / Port workflows only — same tools as Cockpit ([§18.3](#183-cockpit-agent--tool-surface)). |

**DoD (canvas):** Opening Spec Canvas for a domain Spec shows Blueprint+Contract regions; every Architecture module block is either catalog-linked or **needs implementation**; no unflagged orphan module.

### 20.5 Beads loop — dependency-aware task decomposition

After Spec (or delta PBI) is canvas-stable, the **Cockpit agent** decomposes work into Beads via the same Beads/Port tools the UI exposes ([§13.1](#131-meta-beads--readiness--claim-graph-spec-home-factory-kernel)):

| Decomposition class | Beads meaning | UI label | Admit / claim |
|---------------------|---------------|----------|---------------|
| **Ready now** | `bd ready` — no open blockers | Ready | Eligible for `bd update --claim` → `ProjectSupervisor` admit → Coding agent |
| **Blocked (later)** | Has unmet deps / blockers[] | Blocked | Not claimable; shows blocker bead ids; waiting glyph per [§19.3](#193-agent-state-surface-busy--waiting--error--done) |
| **Parallelizable** | Sibling beads with empty mutual deps (can claim concurrently under capacity) | Parallel | Multiple Coding `WorkAttempt`s allowed; still one agent per attempt ([§18.4](#184-delegation--cockpit--coding)) |

**Rules:**

1. Cockpit maps each canvas **needs implementation** gap and each Contract scenario cluster to ≥1 bead; bead description cites `repo:path` and/or Spec `blockId` / Port `executionContract` id (Factory convention — [§12.3](#123-data-pipeline-concrete)).
2. Dependency edges on the decomposition pane = Beads deps (not inventing a second graph SoT). Atlas Beads overlay ([§12.4](#124-rendering-approach)) remains the code-graph accent; this pane is the **task** view of the same Beads data.
3. `ProjectSupervisor` admits coding **only** when Beads reports ready (or audited Port bypass) — unchanged from §13.1 / §18.2.
4. Human-forced “run blocked bead” is forbidden without Port `executionContract` bypass + audit.
5. Managing decomposition (add deps, close beads, re-ready after unblock) is Cockpit-agent primary; human adjusts through the same tool surface when intervening.

### 20.6 Full loop — one screen

Visualize **spec → decomposition → execution** without leaving Spec Canvas (Cockpit agent advances the loop; human watches / intervenes):

```txt
[ Spec Canvas ]     Blueprint + Contract blocks   ← Cockpit places / flags
        |             catalog hit | needs-implementation flag
        v
[ Decomposition ]   Beads: Ready now | Blocked (later) | Parallelizable  ← Cockpit creates / manages
        |             claim / deps
        v
[ Execution ]       WorkAttempt / AgentSession status (busy|waiting|error|done)
                      → evidence → CI SHA accept (visibility-accept; not self-report)
```

| Lane | Data source | Chrome sync ([§19](#19-ui-state-mapping--agent-chrome)) |
|------|-------------|--------------------------------------------------------|
| **Spec** | `/specs/{domain}/spec.md` + canvas `blockId` graph; Port entity links | Finder → Specs/Artifacts; menu bar View → Spec Canvas |
| **Decomposition** | Beads MCP/CLI JSON (`bd ready`, `bd show`, blockers) | Finder → Ready; atlas Beads overlay; waiting badges on pill |
| **Execution** | Rivet `WorkAttempt` / `AgentSession` sequence; Port `deliveryRun` / `executionAttempt` projections (§4.2.1) | Menu bar Agents status; chat pill; session inspector; dock health |

**Interaction:** Selecting a Ready bead opens the same chat panel the pill opens ([§19.1](#191-chosen-agent-communication-chrome-primary-dual-pattern)) focused on that attempt thread — does not dismiss Spec Canvas or navigate away. Cockpit agent claim/start uses Factory MCP; human selection in UI calls the same tools. Selecting a catalog-linked module may deep-link to assembly/provision tools; selecting a gap bead starts / focuses Coding delegation via Factory MCP only ([§18.4](#184-delegation--cockpit--coding)).

**Measurable DoD (loop screen):** For one Port-validated stack + one Spec with ≥1 catalog miss: canvas shows the flagged block; decomposition shows ≥1 Ready or Blocked bead linked to that block; Cockpit starting a Ready bead updates Execution lane from Rivet stream to `busy` without full page reload; `done` never implies accept.

### 20.7 Ownership & hard bans

| Concern | Owner |
|---------|-------|
| Canvas UI + loop layout | `developer-os` (§4.5) |
| Agent-first drive + tool parity | Cockpit agent + Factory MCP ([§18](#18-agent-classes--single-mcp-control-surface)) |
| Catalog composability / assembly gate | Port §4.2.2 + §4.2.1 writes |
| Beads ready/blocked/parallel semantics | factory-kernel §13.1 |
| Execution status stream | Rivet Actors; UI via §19 state map |
| Accept | `visibility-accept` — canvas never accepts |
| Code structure zoom | Code Atlas §12 — Spec Canvas does not replace atlas |

**Hard bans:** treating Spec Canvas as a second control plane; human-only privileged canvas APIs that Cockpit cannot call (or the reverse); provision of **needs implementation** blocks as if they were catalog modules; claim/admit without Beads ready (unless audited bypass); Coding agent driving Spec Canvas / Beads graph; rewriting §12 atlas or §19 chrome ownership; CopilotKit/AG-UI as kernel path for this screen (ADR-011 unchanged; optional §11 display remap only).

---

## 21. Skill leverage bindings (FE-22)

**Full map:** [`factory-skill-leverage.md`](./factory-skill-leverage.md). Normative summary only — do not fork skill text here.

| Surface | Binding in this plan | Primary loci |
|---------|----------------------|--------------|
| **ASDLC** (`skills/asdlc/`) | Spec/PBI/ADR hierarchy; Context Gates; Workflow-as-Code; DDD contexts; Compound Loop; pink-elephant Constraints | §1–§9; §20 anatomy |
| **Compound Engineering** (`cursor-public/680`) | Plan→Work→Review→Compound operator surface; `/ce-compound` HITL → `docs/solutions/`; `/ce-code-review` as adversarial surface | ASSUMPTION 12; §7; PBI-015 |
| **EGM** (`artifacts/elephant-goldfish-model/`) | Goldfish feature_spec gate before Feature Assembly; FE-21 baseline; FE-40 iterate-to-buildable | §7; ASSUMPTION 13; §§13–15 remediations |
| **AG-UI / CopilotKit** | Deferred display path; kernel = Rivet-native; Factory §11 adapter if adopted | ADR-011; §4.5; §11; §19.5 |
| **LogicSRC** | Interop emission from Specs; M1 cut; validators in local gate | ADR-004; §5; §13.6; inventory |
| **Port MCP** | SoT + MCP gateway + live catalog names + §4.2.1 fencing; **no mutations from this doc** | ADR-001/005; §4.2; §18; ASSUMPTION 11/14 |

**Hard bans:** inventing Port tool IDs outside the live §4.2 catalog; treating LogicSRC as primary IR; treating CE/EGM plugins as Rivet runtime; CopilotKit/AG-UI as kernel stream; any Port create/delete from planning agents.

---

## 22. Remaster content hash

| Item | Value |
|------|-------|
| Remaster date | 2026-10-28 |
| Prior content SHA-256 (pre-remaster) | `0cdcefdd4a04562762c62f485aa808ed24890c6dc02f7437876ee656d008fbfd` |
| Research inputs | [`factory-research-300-qa.md`](./factory-research-300-qa.md) (300 Q&As); [`factory-research-reconciliation.md`](./factory-research-reconciliation.md) |
| Equalization report | [`factory-spec-remaster-report.md`](./factory-spec-remaster-report.md) |
| Coding loop | Unchanged five steps: **task → standardize → PR → build → loop** (no independent-review / Merge! step) |
| Agent-type roster | §0.7 Johnny lock (extensible) |

*Live content SHA-256 after remaster + roster encode is recorded in [`factory-spec-remaster-report.md`](./factory-spec-remaster-report.md).*
