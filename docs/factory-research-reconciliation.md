# Factory research reconciliation (FE-47)

**Status:** Research + doc reconciliation complete for FE-47  
**Date:** 2026-10-28  
**Worker:** `bc-45ca79aa-1f2f-5366-a812-cd743229cd84`  
**Q&A pack:** [`factory-research-300-qa.md`](./factory-research-300-qa.md) (**300** questions)  
**Workflow SoT:** [`factory-workflow.md`](./factory-workflow.md) · Coding loop: [`factory-coding-loop.md`](./factory-coding-loop.md)

---

## Johnny acceptance scorecard (definition of done)

| # | Criterion | Score | Evidence / close path |
|---|-----------|-------|------------------------|
| **1** | **No unanswered questions** — every open Project question researched and resolved (or marked Johnny-decision with options; prefer research resolution) | **MET** | 300 gap Q&As answered with Project + official sources. **OQ-2 resolved (Johnny):** Notion allowed as meta mirror; SoT = Project store + git; Notion ≠ SoT; auth not a blocker. **OQ-1** remains Johnny decision (hybrid research lean). Deferred ops (ADR-005 OAuth create, Observatory, `factory_request_release`) listed as reserved manual — not unanswered research. Residual **UNVERIFIED vendor** items (Polygraph formal eval model; Port MCP named “blast radius”; Rivet queue redelivery doc conflict) documented as evidence limits, not Johnny asks. |
| **2** | **Workflow clear to Johnny AND any fresh agent** — `factory-workflow.md` (+ coding loop) executable without asking | **MET** | Workflow Phase A→B, hard rules, sync model, typed-contract DoR, eligible agents, collision table, manual-step inventory, OQ table with research recommendations. Coding loop five steps + collision hard bans + reserved manuals. Fresh agent can execute authorship loop from docs alone. |
| **3** | **State tracked** — four-way sync Beads/Linear/git/Port documented and consistent | **MET** | Four planes (Beads · Linear · git · Port) + equivalence chain (bead ≡ PBI/typed-contract ≡ Linear ≡ GitHub issue) in workflow Sync model; coding loop ownership reminder aligned. Facet ownership consistent across workflow, coding loop, master §13.1 / ADR-001/008. |
| **4** | **No collisions** — beads claims + worktrees + file-scope discipline documented clearly | **MET** | New workflow section [Collision avoidance](./factory-workflow.md#collision-avoidance--claims-worktrees-file-scope): atomic `bd` claim, shared `.beads` across worktrees, disjoint write sets, merge-slot, hash IDs; coding-loop rules + hard bans mirror it. Sourced to Beads official worktrees/coordination docs + master §6 Atomicity. |
| **5** | **Perfect smooth** — loop task→standardize→PR→build→loop without manual intervention beyond Johnny-reserved; name remaining manuals | **MET** | Five-step loop unchanged and agent-agnostic. [Remaining manual steps](./factory-workflow.md#remaining-manual-steps-smooth-loop-inventory) names every reserved HITL/Johnny step (OQ-1, ADR-005, Spec/EGM, Port accept, Compound, release INPUT, FREEMIUM). **OQ-2 closed** (Notion mirror allowed). Pre-PBI-007 authorship path explicit (Linear/PBI + git; Rivet admit not required for doc/Spec PBIs). |

**Overall:** All five **MET**. No GAP rows requiring a further close path for DoD.

---

## Question count & method

| Item | Value |
|------|-------|
| Questions generated & answered | **300** |
| Deliverable | `docs/factory-research-300-qa.md` |
| Method | Inventory Project docs → gap-only questions → answer from Project files + official Beads/Port/Rivet/Tailscale docs (Context7 / Port knowledge / raw Beads docs). No live Port/Linear/Notion mutations. No Johnny interviews. |

### Theme summary (for coordinator relay)

| Theme | ~N | Focus |
|-------|----|--------|
| architecture | 41 | Master plan, M1 path, Non-Goals, gates |
| port | 38 | Blueprints, mirrors, fencing, HMAC, MCP, Ocean, OAuth |
| beads | 38 | Meta/Product, Dolt sync, claim, worktrees, OQ-1 |
| rivet | 22 | Supervisor, SA, Docker, no browser→SA |
| adr | 18 | ADR-001…011 locks |
| pbi / specs | 26 | Seed PBIs + ten domain Spec ownership |
| coding-loop / sync / collisions / smooth-loop | 32 | Executable loop, four planes, no-collision, manuals |
| linear / topology / gateway / logicsrc / auth-notion / ui / vercel / claims / standards / stack / misc | rest | Tracker, Tailscale, HMAC gateway, Open*, Notion/OAuth, Polygraph/Trail/Atlas, verification residuals |

---

## Major findings by theme

### Architecture / ADRs
- M1 path locked: Port → HMAC gateway → `ProjectSupervisor` → Sandbox Agent (Docker) → GitHub CI exact SHA → Port accept.
- ADR-007 superseded by ADR-011 (Rivet-native stream; CopilotKit/AG-UI deferred). Rivet↔AG-UI remains Factory design, not vendor product.
- LogicSRC is interop emission only (ADR-004), not primary IR.

### Port
- Native-first confirmed; upsert has **no CAS** → Factory §4.2.1 single-writer + `catalogVersion` in **factory-gateway** (not Rivet, not Port SaaS feature).
- **Mirror properties** = derived fields via relation `path` (official Port docs); used for assemble-first context.
- Webhook HMAC = SHA256 over `{timestamp}.{body}` vs `x-port-signature`.
- Live `factory_*` workflows + blueprints are the names to bind (no second catalog).

### Beads
- Official: Dolt-backed ready/claim; hash IDs; worktrees **share** `.beads`; `bd dolt push/pull` for sync; atomic `--claim`; merge-slots; `bd reclaim` for stale leases.
- Factory: Meta Beads ≠ Product Beads; admit SoT from **PBI-007**; Beads does not document Rivet/Port — `ReadyTaskEvent` is Factory adapter.

### Linear / sync
- Linear = human tracker facet of the **same** unit; not ready/claim graph.
- Four planes stay in sync; PBI ≡ typed contract (FE-46 / Johnny-confirmed equivalence in workflow).

### Rivet / topology
- SA VERIFIED; browser must not call SA; Actors own session.
- M1 topology: desktop Docker Compose + Tailscale **Serve** (Funnel elevated optional); no `factory-edge` in M1.
- Rivet product claim-lease CAS **does not exist**; queue redelivery authority still UNVERIFIABLE across Rivet docs — design for idempotent side effects.

### Auth / Notion / Observatory
- ADR-005: dedicated Factory External Interface; never Observatory; create deferred.
- Notion: **OQ-2 resolved** — allowed as meta mirror of plans/workflow; SoT = Project store + git; Notion ≠ Spec/accept/claim; MCP authenticated; live URLs in [`notion-factory-mirror.md`](./notion-factory-mirror.md).

### ERP.AI / naming collisions
- No ERP.AI verification artifact in store → out of scope / unverified; do not invent coupling.
- `OpenStack.md` = LogicSRC catalog (not OpenStack IaaS). Beads `bd setup factory` = Factory.ai Droid — not this Rivet Factory.

### Smooth loop
- Automated intent after wiring: ready→claim→admit→SA→PR→CI.
- Reserved manuals explicitly inventoried (criterion 5).

---

## OQ-1 / OQ-2 (FE-46 fold-in)

| ID | Resolution type | Research recommendation | Still Johnny? |
|----|-----------------|-------------------------|---------------|
| **OQ-1 Meta Beads** | Johnny decision + researched hybrid | Optional Meta Beads scaffolding for deps/`bd ready` practice **OK**; **Linear remains admit/claim SoT until PBI-007**; never day-one human board | Yes — “must scaffold now” vs “wait entirely” |
| **OQ-2 Notion** | **Resolved (Johnny)** | Notion **allowed as mirror** of meta plans/workflow; **SoT = Project store `docs/` + git**; Notion ≠ Spec/accept/claim; Notion MCP **authenticated**; mirrors live — [`notion-factory-mirror.md`](./notion-factory-mirror.md) | No — closed |

---

## Contradictions / gaps resolved

| Item | Before | After |
|------|--------|-------|
| Worktree + Beads collision discipline under-specified in workflow | Atomicity one-liner only | Full collision section + coding-loop hard bans |
| Smooth-loop manuals unnamed | Implied across ADRs/HITL | Explicit remaining-manual inventory |
| OQ-1/OQ-2 binary with no research lean | Deferred only | Research lean recorded; **OQ-2 closed by Johnny** (mirror allowed, not SoT); OQ-1 still Johnny |
| Polygraph “evals” vs product | ADR-008 wording risk | Confirmed: visibility inputs / adversarial review; formal eval model UNVERIFIED (claims G3) — already in master §13.2; Q&A reinforces |
| Port upsert CAS expectation | Historical race notes | Locked: no product CAS; §4.2.1 fencing |
| Four-way sync vs typed-contract language | FE-46 added equivalence | Coding loop aligned to PBI≡typed-contract DoR; four planes unchanged |
| ERP.AI | Mission theme | Marked absent/unverified — no invented stack decision |

**Not resolved (explicit non-Johnny evidence limits):** Rivet queue redelivery which-doc-wins; Port MCP named blast-radius control; live OAuth create (ops).

---

## Docs changed

| Doc | What changed |
|-----|----------------|
| **`docs/factory-research-300-qa.md`** | **Created** — 300 numbered Q&As with theme tags, short answers, source pointers |
| **`docs/factory-research-reconciliation.md`** | **Created** — this file (count, findings, OQs, contradictions, scorecard) |
| **`docs/factory-workflow.md`** | Collision avoidance section; remaining manual steps; OQ-1/OQ-2 research recommendations; Atomicity→collision link; document-control + inventory rows for FE-47 (coexists with FE-46 typed-contract sync work) |
| **`docs/factory-coding-loop.md`** | Collision discipline rule; typed-contract DoR refuse-start; hard bans for shared write sets / per-worktree `bd init`; remaining manuals; doc-control links to workflow + this reconciliation |

**Not rewritten:** `factory-master-spec.md` (no new stack decisions; existing locks sufficient). No Port/Linear/Notion live ops.

---

## Remaining open Johnny decisions (explicit)

1. **OQ-1** — Meta Beads scaffold-now vs wait (hybrid recommended).  
2. ~~**OQ-2**~~ — **Resolved:** Notion mirror allowed for meta plans/workflow; SoT = Project store + git; auth not a blocker.  
3. **ADR-005** — When to authorize dedicated Factory OAuth app create (and FREEMIUM limit path).  
4. **Observatory** — Leave untouched unless Johnny explicitly authorizes revoke.  
5. **`factory_request_release`** — Johnny-only INPUT (already live catalog constraint).

---

## Document control

| Related | Role |
|---------|------|
| [`factory-research-300-qa.md`](./factory-research-300-qa.md) | Full Q&A set |
| [`factory-workflow.md`](./factory-workflow.md) | Executable workflow (updated) |
| [`factory-coding-loop.md`](./factory-coding-loop.md) | Coding sequence (updated) |
| [`factory-master-spec.md`](./factory-master-spec.md) | Production plan (unchanged this pass) |
| [`factory-claims-verification.md`](./factory-claims-verification.md) | Official-docs claim verdicts reused |
