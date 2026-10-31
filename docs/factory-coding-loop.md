# Factory coding loop (derived)

**Status:** **Derived from** [`factory-master-spec.md`](./factory-master-spec.md) [§0.4](./factory-master-spec.md#04-coding-loop-order-locked--five-steps). Not an independent SoT — master first, then propagate.  
**Date:** 2026-10-28  
**Audience:** Any agent on the [§0.7 roster](./factory-master-spec.md#07-agent-type-roster-johnny-locked), harness, or human following Factory norms (not Cursor-only)  
**Canonical SoT:** [`factory-master-spec.md`](./factory-master-spec.md)  
**Related:** §0.7 agent roster · §6 Seed PBIs · §7 Context gates · [ADR-001](./factory-master-spec.md#3-adrs--locked-decisions-accepted) (Port SoT) · [ADR-002](./factory-master-spec.md#3-adrs--locked-decisions-accepted) (Rivet execution kernel)

This document details the **five-step coding sequence** locked in the master: **task → standardize → PR → build → loop**. No independent-review / “Merge!” step. Cursor Project `notes.md` is **coordination only** (task board / agent handoff). It is not the coding loop, not the Spec, and not the accept authority.

**See also:** [`factory-workflow.md`](./factory-workflow.md) — upfront setup, sync model (bead / PBI≡typed-contract / Linear / GitHub = one unit; four planes Beads·Linear·git·Port), collision avoidance, Meta vs Product Beads, §0.7 roster (personal-agent vs coding-agent).

---

## Agent types for this loop (master §0.7)

This five-step sequence is for **coding-agent** units. Named roster (Johnny locked, extensible via master-first edit): **Muse**, **ChatGPT regular**, **ChatGPT Work**, **Codex**, **Grok**, **Claude**, **Claude Code**, **Claude Design**. Default coding-agent picks: **Codex**, **Claude Code**. **Personal-agent** tasks (Port/browser/provisioning — e.g. Muse, Claude Design) use Cockpit paths, not this admit/coding loop. Field **7** on the unit must name roster type + task kind. Full table: master [§0.7](./factory-master-spec.md#07-agent-type-roster-johnny-locked).

## Principle

Any agent or tool that follows this loop produces the **same five-step sequence**. Vendor UIs, MCP servers, and CLIs may change; the order does not.

| Step | Name | Must happen |
|------|------|-------------|
| 1 | **Task starts** | Pick the active unit of work |
| 2 | **Standardize** | Align Spec / Contract / assemble-first before code |
| 3 | **Open PR** | Branch + pull request before mergeable work lands |
| 4 | **Run build** | Local gate + CI on the PR SHA |
| 5 | **Loop back** | Close or refine; take next ready task |

Gates that block Feature Assembly and accept live in master-spec [§7](./factory-master-spec.md#7-context-gates--workflow-as-code). This loop does not invent parallel gates.

---

## Today’s tools (mapped, not hard-locked)

Bindings below are the **current** Factory map. Substituting a peer system is allowed only if the **role** stays the same.

| Role | Today’s tool | Hard-lock? |
|------|--------------|------------|
| **Tracking SoT for PBIs** | **Linear** (issues / projects; agent I/O via Linear MCP or SDK) | Role locked; product may evolve. Port Ocean may mirror; Linear remains tracking SoT for PBI state. See [`linear-factory-task-manager.md`](./linear-factory-task-manager.md). |
| **Ready / claim graph** | **Meta Beads** (`bd ready` → `bd update --claim` → `bd close`) | Role locked from **[PBI-007](./factory-master-spec.md#6-seed-pbis-parallel-launch)** onward — Meta Beads is **not** the day-one human board. Until PBI-007 lands, claim/ready may be manual / Linear-only; do not pretend Meta Beads is live board SoT before that. Product Beads ≠ this Meta loop. |
| **PRs + CI** | **Git repo** (GitHub Actions on exact SHA) | Role locked ([ADR-008](./factory-master-spec.md#3-adrs--locked-decisions-accepted) accept path). |
| **Accept / governance** | **Port** (catalog, RBAC, workflows, audit, Context Lake) | Role locked ([ADR-001](./factory-master-spec.md#3-adrs--locked-decisions-accepted)). Agent “done” ≠ accept. |
| **Execution admit + harness** | **Rivet** (`ProjectSupervisor` → Sandbox Agent) | Role locked when coding is **admitted** ([ADR-002](./factory-master-spec.md#3-adrs--locked-decisions-accepted), ADR-006). Rivet never polls Port. |
| **Coordination scratch** | Cursor Project `notes.md` | **Not** coding SoT. FE-* rows track Project agents only. |

**Ownership reminder (master §0.3 / §4.2.1 / §8):** Port = catalog SoT + accept. Rivet = durable execution admit. **Meta Beads** = readiness/claim (post–PBI-007). Linear = PBI tracking facet. Git = source + independent CI. Agent types = master [§0.7](./factory-master-spec.md#07-agent-type-roster-johnny-locked).

---

## Step 1 — Task starts

**Active unit of work** is whichever of these is currently driving the change — do not invent a second queue:

1. **Bead** — when **Meta Beads** ready/claim is in force (PBI-007+): take from `bd ready`, claim before admit.  
2. **Linear ticket** — tracker facet of the same unit (human + agents).  
3. **PBI / typed contract** — ASDLC delta ([§6](./factory-master-spec.md#6-seed-pbis-parallel-launch)) **is** the typed contract: full **19** fields (C1–C3 + 1–16) including field **7** = [§0.7 roster](./factory-master-spec.md#07-agent-type-roster-johnny-locked) type + personal-agent/coding-agent ([master §0.1](./factory-master-spec.md#01-unit-of-work--equivalence-chain-19-fields)).

**Rules:**

- Prefer **one active task**. Concurrent PBIs must not share write sets ([§6 Atomicity](./factory-master-spec.md#6-seed-pbis-parallel-launch)).  
- **Refuse start** if the unit’s typed-contract body is incomplete (DoR) — including field **7** roster + task kind.  
- **Coding-agent** units follow this five-step loop; **personal-agent** units use Cockpit/provision paths (master §0.7 / §18) and must not self-admit SA coding.  
- Before PBI-007: Linear (and/or `tasks/PBI-*` mirror) is enough to start; Meta Beads is optional scaffolding, not the admit gate.  
- After PBI-007: coding admit requires Meta Beads ready/claim **or** audited Port `executionContract` bypass ([§13.1](./factory-master-spec.md#131-meta-beads--readiness--claim-graph-spec-home-factory-kernel)).  
- Project `notes.md` FE-* checkboxes may point at work; they **do not** replace Linear/PBI/Bead identity.  
- **Collision discipline** (full table in [`factory-workflow.md`](./factory-workflow.md#collision-avoidance--claims-worktrees-file-scope)): atomic claim → one write set per worktree → disjoint paths across concurrent units; shared `.beads` across git worktrees; serialize shared files via deps or Beads merge-slot.

---

## Step 2 — Standardize

Before Feature Assembly code against the domain, align to factory-master-spec norms (open-spec / Spec+Contract / assemble-first):

| Norm | What to do | Source |
|------|------------|--------|
| **Spec + Contract** | Build against `/specs/{domain}/spec.md` — Blueprint (Context / Architecture / Constraints) + Contract (DoD / Guardrails / Scenarios). PBIs point at Spec + Contract scenarios; they are not the Spec. | [§1](./factory-master-spec.md#1-artifact-hierarchy-asdlc), [§2 skeleton](./factory-master-spec.md#2-repository-layout-mandated), ADR-004 |
| **Open-spec / LogicSRC** | Emit only the interoperability artifacts the Spec Contract requires (AGENTS index, OpenStack/OpenProfile, well-knowns, etc.). LogicSRC is **not** primary IR. | [§5](./factory-master-spec.md#5-logicsrc-emission-matrix-spec--file), ADR-004 |
| **Assemble-first** | Prefer Port catalog composables and [§4.2.2](./factory-master-spec.md#422-machine-validated-stack-assembly) machine-validated stack assembly before greenfield build. Catalog misses → flag **needs implementation** → Beads/PBI deltas — do not silently scaffold invalid combos. | §4.2.2, §18.3 Assemble software, §20 Spec Canvas |
| **Gates before assembly** | Spec review + EGM Goldfish (feature_spec) green before Feature Assembly for that Spec. | [§7](./factory-master-spec.md#7-context-gates--workflow-as-code) |
| **ADRs** | Irreversible decisions already Accepted (e.g. ADR-001 Port SoT, ADR-002 Rivet kernel) — do not re-litigate in the PR. | [§3](./factory-master-spec.md#3-adrs--locked-decisions-accepted) |

If Spec or Contract must change, update them **in the same PR** as the code (default refinement rule in §6) unless the PBI says otherwise.

---

## Step 3 — Open PR

1. Create a feature branch from the agreed base.  
2. Open a pull request early (draft OK) so CI and review attach to a SHA.  
3. PR description cites: active Linear/PBI/Bead id · Spec path · Contract scenarios under verification.  
4. Living-spec edits travel with the PR ([§7](./factory-master-spec.md#7-context-gates--workflow-as-code) / living-specs practice).

Source of truth for the change set is the **git repo**, not Port, Linear, or `notes.md`.

---

## Step 4 — Run build

| Layer | Enforces | Notes |
|-------|----------|-------|
| **Local gate** | typecheck, tests, `@logicsrc/validators`, lint | Tooling refuses dirty/invalid ([§7](./factory-master-spec.md#7-context-gates--workflow-as-code), PBI-013) |
| **CI** | GitHub Actions on the PR SHA | Deterministic; rewrite invalidates prior green |
| **Adversarial review** | Critic / human vs Contract | Optional map to CE `/ce-code-review` when that surface is in use |
| **Accept** | Port governance + green checks on **exact SHA** | [ADR-008](./factory-master-spec.md#3-adrs--locked-decisions-accepted); canvas / agent self-report never accepts ([§20.7](./factory-master-spec.md#207-ownership--hard-bans)) |

When Rivet coding admit is live: `ProjectSupervisor` → Sandbox Agent produces commits into this PR path; Port projections of `deliveryRun` / `executionAttempt` stay behind [§4.2.1](./factory-master-spec.md#421-canonical-port-catalog-write-fencing-no-upsert-cas-fix) fencing ([ADR-002](./factory-master-spec.md#3-adrs--locked-decisions-accepted) / ADR-003).

---

## Step 5 — Loop back

1. On green + Port accept (when required): close Linear/PBI; `bd close` when Beads owns the claim; merge per repo policy.  
2. Apply the PBI **refinement rule** (default: Spec updated in same PR; else flag human / deviation log).  
3. After a verified coding PBI: Compound writeback HITL when in scope ([§7](./factory-master-spec.md#7-context-gates--workflow-as-code) Compound gate; [PBI-015](./factory-master-spec.md#6-seed-pbis-parallel-launch)) — learnings to specialized substrate; `AGENTS.md` stays index.  
4. Take the **next** ready task (Bead ready set / next Linear PBI) — return to Step 1.  
5. If build or review fails: refine Spec/Contract or code on the **same** PR; do not open a parallel “shadow” task for the same write set.

---

## Sequence diagram (roles)

```txt
[1 Task]     Linear PBI  ±  Bead claim (PBI-007+)  ±  notes.md (coordination only)
                 │
[2 Standardize]  Spec Blueprint+Contract · assemble-first · §7 Spec/EGM gates
                 │
[3 Open PR]      git branch + PR
                 │
[4 Run build]    local gate → CI on SHA → (optional adversarial) → Port accept
                 │              ▲
                 │              └── Rivet admit / Sandbox Agent when coding is admitted
                 │
[5 Loop back]    close / refine / compound HITL → next ready task → [1]
```

---

## Hard bans

- Treating Cursor Project `notes.md` as coding or accept SoT.  
- Skipping Standardize (coding against vibe without Spec+Contract when a Spec exists or is required).  
- Day-one Meta Beads as the human board SoT before PBI-007.  
- Rivet admit without Meta Beads ready/claim after PBI-007 (unless audited Port bypass).  
- Port accept from agent “done” without green CI on exact SHA.  
- Hard-coding this loop to a single IDE, MCP host, or CE slash-command — those are **surfaces**, not the sequence.  
- Inventing agent types outside master [§0.7](./factory-master-spec.md#07-agent-type-roster-johnny-locked) without master-first update.  
- Treating personal-agent / Cockpit work as coding-agent admit (or the reverse) without field **7** saying so.  
- Adding an independent-review / “Merge!” step to this five-step loop.  
- Two in-progress units editing the **same write-set paths** without a serial dependency or Beads merge-slot.  
- `bd init` inside every git worktree (worktrees share one `.beads` unless `BEADS_DIR` is intentional).  

---

## Remaining manual steps (not agent-optional)

These are **reserved** — the loop is otherwise agent-executable from synced state. Full inventory: [`factory-workflow.md`](./factory-workflow.md#remaining-manual-steps-smooth-loop-inventory).

1. Spec review + EGM Goldfish before Feature Assembly  
2. Port accept (governance)  
3. Compound writeback HITL (when in scope)  
4. Johnny: `factory_request_release` (ops). **OQ-1 locked hybrid** (Meta Beads scaffolded; Linear admit SoT until PBI-007). ADR-005 / OQ-2 per master §0.6

---

## Document control

| Doc | Role |
|-----|------|
| **This file** | **Derived** tool-agnostic coding loop (sequence detail for master §0.4) |
| [`factory-workflow.md`](./factory-workflow.md) | **Derived** sync model, collision avoidance, manual-step inventory, OQs, §0.7 roster |
| [`factory-master-spec.md`](./factory-master-spec.md) | **Single canonical SoT:** Specs, PBIs (§6), gates (§7), ADRs, §0.7 roster, assemble-first / Port / Rivet / Meta Beads bindings |
| [`linear-factory-task-manager.md`](./linear-factory-task-manager.md) | Linear as tracking SoT evaluation |
| [`factory-research-reconciliation.md`](./factory-research-reconciliation.md) | FE-47 research reconciliation + Johnny acceptance scorecard |
| Cursor Project `notes.md` | Project agent coordination only |

**See also:** [`factory-workflow.md`](./factory-workflow.md) · master-spec §6 PBIs · §7 gates · §18 agent classes · ADR-001 · ADR-002 · §13.1 Beads · §4.2.2 assemble-first · §20 full loop screen (UI of the same sequence).
