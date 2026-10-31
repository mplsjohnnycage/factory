# PBIs — the units of work, indexed

> **Johnny confirmed (master spec §0.1):** Linear tickets, beads, GitHub issues, PBIs, and
> typed contracts are **ALL the same unit of work** — five names across five tools. A **PBI IS
> a typed contract**. Referring to any one refers to all. Do **not** treat them as separate
> concepts.

**PBI ≡ typed contract ≡ Linear ticket ≡ bead ≡ GitHub issue.**

The fifteen seed units' actual bodies ship in this plugin at `../../../pbis/` (repo
`docs/linear-pbi-seed/` @ PR #111 merge 247842e — see `pbis/README.md` there for provenance).
Live facet snapshots (Linear / GitHub / Beads exports) ship at `../../../units/` with the
cross-facet map in `units/UNITS.md`. Blank unit template:
`../../../contracts/typed-contract-template.md`.

## The 19-field typed-contract body (master spec §0.1, in full)

**DoR:** a unit is not startable until the **entire** body is filled (C1–C3 + fields 1–16 =
**19 fields**) plus ASDLC pointers (Spec · Verification · Refinement). Prefer Port-native /
Spec Contract / workflow INPUT schemas for typed edges when they already exist — no parallel
type system.

### Contract core (typed I/O + writes)

| # | Field | Required content |
|---|--------|------------------|
| **C1** | **Inputs + types** | Explicit input names and types (schemas, Spec pointers, entity ids, paths) |
| **C2** | **Outputs + types** | Explicit output names and types (artifacts, evidence, entity updates, PR SHA) |
| **C3** | **Write targets** | Systems this unit may write — **Meta Beads** *xor* **Product Beads** (exactly one instance by lane; never Both), Linear, git/GitHub, Port, Rivet, filesystem, other — no vague "Beads" |

### Operational body (1–16)

| # | Field | Required content |
|---|--------|------------------|
| **1** | **Acceptance criteria** | Measurable done-when; ties to Spec Contract scenarios / Verification pointer |
| **2** | **Exact task description** | Imperative directive — what to do, unambiguous |
| **3** | **Almost-exact directories to work in** | Paths / packages / Spec domains in scope |
| **4** | **What not to touch** | Explicit out-of-scope paths, systems, boards, Beads instances |
| **5** | **Skills to use** | Named skills / practices (e.g. ASDLC patterns) — no silent invention |
| **6** | **MCPs needed** | Named MCP servers/tools required (prefer Factory Single-MCP / Port-governed surface) |
| **7** | **Agent type required** | Name from the master spec §0.7 roster **and** task kind (**personal-agent** vs **coding-agent**); also map to Coding vs Cockpit class (§18) |
| **8** | **CI requirements** | Checks / gates that must green on exact SHA for accept |
| **9** | **Dependencies** | Which PBIs/units must complete first (same equivalence-chain ids) |
| **10** | **Branch / worktree naming convention** | Exact pattern for this unit |
| **11** | **Failure / rollback behavior** | What happens on fail; how to unwind writes |
| **12** | **Reviewer for the PR** | Named human/agent reviewer |
| **13** | **Environment prerequisites** | Services that must be running (e.g. Rivet Compose, Tailscale Serve, gateway) |
| **14** | **Time estimate** | Expected effort / duration (Linear seed / planning) |
| **15** | **Secrets handling** | Required secrets, where they live, what must never be logged/committed; no plaintext secrets in the unit body |
| **16** | **Observability hook** | How progress/evidence is observed (Port audit / `deliveryRun`·`executionAttempt`, Rivet traces, CI checks, Linear updates) |

Also on the same unit (ASDLC §6): **Spec pointer**, **Verification pointer**, **Refinement
rule** (default: update Spec in same PR).

## Seed PBI table (master spec §6)

PBIs are deltas pointing at Specs; each seed PBI **is** the 19-field body plus the pointers
below. **Lane: Meta.** Concurrent PBIs must not share write sets (§0.5) — fan out by Spec
domain / worktree.

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
| PBI-015 | After first verified coding PBI: run CE `/ce-compound` (HITL); seed `docs/solutions/` + keep AGENTS.md as index | asdlc-lifecycle | Compound gate: ≥1 approved learning or explicit "nothing qualifies" report | Flag human for writeback | PBI-007 |

## Facet state per seed PBI

**LIVE-VERIFIED 2026-10-30** (exports in `units/`, pulled ~22:25 CDT) unless marked SPEC-ONLY.

| PBI | Linear facet (admit/claim SoT until PBI-007) | Bead facet | GitHub facet |
|-----|----------------------------------------------|------------|--------------|
| PBI-001 | STL-162 — Done | not mapped (see note) | not established |
| PBI-002 | STL-163 — Done | not mapped | not established |
| PBI-003 | STL-164 — Done | not mapped | not established |
| PBI-004 | STL-165 — Done | not mapped | not established |
| PBI-005 | STL-166 — Done | not mapped | not established |
| PBI-006 | STL-167 — Done | not mapped | not established |
| PBI-007 | STL-168 — Done | follow-on bead `factory-cvl` — **open** (wire live BdMetaBeads adapter; its own body: "PBI-007 MemoryMetaBeads is CI stand-in") | not established per-PBI (adapter shipped via PR #46 per atlas fragment D10) |
| PBI-008 | STL-169 — Done | not mapped | not established |
| PBI-009 | STL-170 — Done | not mapped | not established |
| PBI-010 | STL-171 — Done | not mapped | not established |
| PBI-011 | STL-172 — Done | not mapped | not established |
| PBI-012 | STL-173 — Done (tracker) — but SPEC: implement-gated until M1 accept (§13.5); seed file is DEFERRED | not mapped | not established |
| PBI-013 | STL-174 — Done (tracker) — seed file marked DEFERRED for seed wave | not mapped | not established |
| PBI-014 | STL-175 — Done (tracker) — DEFERRED / not M1 exit per its own title | not mapped | not established |
| PBI-015 | STL-176 — Done (tracker) — DEFERRED (CE compound writeback) per its own title | not mapped | not established |

**Notes on the gaps (evidence, not invention):**

- **All fifteen Linear facets are Done** in the live export (`units/linear-issues.json`,
  2026-10-30 ~22:26 CDT). Linear "Done" is the tracker facet's verdict — the mapping swarm
  found it does not always match ground truth elsewhere (e.g. sandbox issues marked Done on
  Memory-lease CI evidence while nothing had run end-to-end — fragment E2). Treat Done as
  *tracker state*, not proof of live capability.
- **Per-PBI bead facets mostly do not exist yet.** The bead whose whole job is creating them —
  `factory-r9f`, "Map remaining Meta PBIs to factory-* beads (equivalence ids)" — is still
  **open** (`units/beads.json`). Until it closes, only PBI-007 has an established bead linkage.
- **Per-PBI GitHub facets are not established.** GitHub issues in this repo are FE-numbered
  (FE-198, FE-201, …), not PBI-numbered; no evidence in the exports ties a specific GitHub
  issue to a specific seed PBI. Established cross-system chains for FE-numbered units are in
  `units/UNITS.md`.
- PBI-012…015 carry **DEFERRED** seed files in the pack (`pbis/PBI-012…015-…-DEFERRED.md` +
  `pbis/DEFERRED-012-015.md`) even though their Linear facets read Done — the deferral is
  about implementation gating (§13.5/§13.6), recorded here as a spec-vs-tracker tension, not
  reconciled by this plugin (master spec §0: flag drift, don't invent a parallel truth).
