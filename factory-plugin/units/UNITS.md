# UNITS — the cross-facet map (one unit, five names)

> **Master spec §0.1:** PBI ≡ typed contract ≡ Linear ticket ≡ bead ≡ GitHub issue — the
> same unit of work across five tools. This folder holds a **live snapshot of every facet**
> plus the established identifier chains between them.

## SNAPSHOT 2026-10-30 ~22:25 CDT — read-only exports, not current truth

| Facet | File | Source (live pull) | Count |
|-------|------|--------------------|-------|
| Linear (ASDLC team, all projects) | `linear-issues.json` | Linear MCP `list_issues`, team=ASDLC, limit 250, single page (`hasNextPage=false`) | **224** — Done 157 · Backlog 62 · Todo 2 · In Progress 2 · Duplicate 1 |
| GitHub issues (`mplsjohnnycage/factory`) | `github-issues.json` | `gh issue list --state all --limit 200` (as mplsjohnnycage) | **48** — OPEN 40 · CLOSED 8 |
| Beads (Meta Beads, embedded store) | `beads.json` | `bd list --all --json` (bd 1.3.0; Dolt HEAD `3fejadbd`, byte-identical replica on grok-bot:3307) | **8** — open 3 · in_progress 1 · closed 4 |
| Seed PBI bodies | `../pbis/` | repo `docs/linear-pbi-seed/` @ main 247842e (PR #111) | 15 units + seed data |
| Port accept facet | — (no export) | Port MCP gateway | see `../skills/factory/references/contracts.md` (live execution contracts) |

**Refresh routes — never trust this snapshot as current:** re-pull Linear via the Linear MCP
(`list_issues`) or the Port gateway's governed surface; GitHub via `gh issue list --repo
mplsjohnnycage/factory --state all`; Beads via `bd list --all` against the factory checkout
(or the Dolt replica on grok-bot:3307); Port via the Port MCP gateway (the one control
plane). Snapshots exist so an installing agent can work offline and learn the shape of the
system — live state always wins (SKILL.md, Evidence discipline).

## Facet source-of-truth rules (master spec §0.3 + §0.6/OQ-1)

| Plane / facet | SoT for | Rule |
|---|---|---|
| **Linear** | Human tracker / visibility; **admit/claim SoT until PBI-007** | OQ-1 locked hybrid (Johnny 2026-10-29): Meta Beads is scaffolding-only until PBI-007 wires it into kernel admit. Linear remains admit/claim SoT until then. |
| **Beads** (Meta Beads xor Product Beads) | Ready / claim / parallel | Readiness + dependency graph; after PBI-007, atomic `bd` claim before admit (§0.5). Never a day-one human board. |
| **git / GitHub** | Source, PR, CI on exact SHA | The GitHub-issue facet of the unit; accept is decided here (CI green on exact SHA, ADR-008). |
| **Port** | Accept, catalog, projections | All catalog writes via the §4.2.1 single-writer gateway fence; Port is the system of record (ADR-001). |
| **PBI / typed contract** | The unit body itself | 19 fields (C1–C3 + 1–16) + Spec/Verification/Refinement pointers (§0.1). Template: `../contracts/typed-contract-template.md`. |

Meta planes never host Product units (Meta XOR Product, §0.2).

## Established cross-facet chains (evidence-cited)

A chain is listed only where the linkage is **established by evidence in the exports**
(shared FE/PBI identifiers in titles, or an explicit statement inside a facet record).
Everything not listed here is **not established** — see the gaps below.

### Seed PBIs ↔ Linear (all 15 — established by `PBI-0NN:` title prefix in the Linear export)

PBI-001 ↔ STL-162 · PBI-002 ↔ STL-163 · PBI-003 ↔ STL-164 · PBI-004 ↔ STL-165 ·
PBI-005 ↔ STL-166 · PBI-006 ↔ STL-167 · PBI-007 ↔ STL-168 · PBI-008 ↔ STL-169 ·
PBI-009 ↔ STL-170 · PBI-010 ↔ STL-171 · PBI-011 ↔ STL-172 · PBI-012 ↔ STL-173 ·
PBI-013 ↔ STL-174 · PBI-014 ↔ STL-175 · PBI-015 ↔ STL-176 — **all Done** in Linear.
Per-PBI detail: `../skills/factory/references/pbis.md`.

### FE-201 — Product M1: one independent repo built end-to-end

| Facet | Id | State |
|---|---|---|
| Linear | STL-225 | **Backlog** |
| Bead | `factory-9we` | **in_progress** |
| GitHub | #109 | **OPEN** |

Established by: the shared `[FE-201]` title tag on all three records, and the bead's own
description, which states the equivalence outright ("Unit: Linear FE-201 = bead = GitHub
issue"). **Facet disagreement, flagged:** Linear says Backlog while the bead says
in_progress — the facets are out of sync on this unit tonight (§0.3 says facets of the same
unit stay in sync; this one doesn't).

### FE-198 — Live Ask Factory → Rivet wiring (Dev OS BFF)

| Facet | Id | State |
|---|---|---|
| Linear | STL-223 | Done |
| GitHub issue | #106 | CLOSED |
| Bead | `factory-s9q` | closed |
| GitHub PR | #107 | MERGED 2026-10-29 (merge commit `f2ac152`) |

Established by: shared `[FE-198]` title tag across Linear/GitHub/bead records; PR #107 is the
merged implementation (verified in the mapping pass — the uncommitted JohnnyBox draft of this
work was an earlier iteration of what PR #107 already landed).

### FE-57 — Retarget ASDLC Issues Sync off painter-os

Linear **STL-182** (Done) ↔ GitHub **#7** (CLOSED) — established by the identical title text
("Retarget ASDLC Issues Sync off painter-os (FE-57)") on both records.

### PBI-007 follow-on chain

PBI-007 ↔ STL-168 (Done) shipped the Memory-stand-in gate (PR factory#15, per fragment D10);
its production follow-on is bead **`factory-cvl`** (open — "Wire live BdMetaBeads adapter in
ProjectSupervisor (replace Memory for prod)"), and the related adapter work STL-195 (Done,
PR factory#46 per D10) covers the live Meta Beads adapter for the gate.

### Remaining beads (no cross-facet chain established)

| Bead | State | Title |
|---|---|---|
| `factory-r9f` | open | Map remaining Meta PBIs to factory-* beads (equivalence ids) |
| `factory-dtm` | open | Implement Dev OS UI against locked Cockpit v3 / Atlas v5 comps |
| `factory-yem` | closed | Meta Beads Dolt live — ready/claim SoT for Factory Meta lane |
| `factory-cbv` | closed | Ship locked UI design direction docs + mockups to factory repo |
| `factory-w3n` | closed | Install bd CLI on agent/dev PATH |

(`factory-dtm`'s own description names FE-142/FE-172 as closed predecessors — a title-level
pointer, not a verified chain to specific Linear/GitHub records in these exports.)

## Linkage gaps — stated, not guessed

- **Per-PBI GitHub facets:** not established for any seed PBI. GitHub issues here are
  FE-numbered; nothing in the exports ties GH #NNN to PBI-0NN.
- **Per-PBI bead facets:** not established except PBI-007's follow-on (`factory-cvl`). The
  mapping bead `factory-r9f` that would create them is still open — the equivalence ids
  literally do not exist yet for the rest.
- **The other ~200 Linear issues and ~44 GitHub issues** in the exports are units in their
  own right (FE-numbered features, fixes, ops) whose cross-facet chains were not enumerated
  here; the raw exports carry their identifiers for an agent to chain on demand — by
  evidence, at runtime, not by pattern-guessing.
- **Port facet per unit:** `executionContract` entities are minted at admit time by the
  governed path; the live census (Port AI, read-only, 2026-10-30 ~22:54 CDT —
  LIVE-VERIFIED 2026-10-30 via Port AI) is: `executionContract` **exactly 1**
  (`factory-meta-bootstrap-contract`, created 2026-10-29, `catalogVersion` 0, `product`
  relation `factory-meta`, `githubIssue` relation EMPTY), `deliveryRun` **0**,
  `executionAttempt` **0** — and **no live `executionContract` references any PBI or
  Linear STL issue**. Detail in `../skills/factory/references/contracts.md`.
