---
name: factory
description: Work inside Factory — Johnny's autonomous software-delivery control plane (Port catalog/governance → gateway → Rivet execution → Sandbox Agent coding → GitHub CI accept). Use whenever a task touches Factory, its Port tenant, the factory repo, Beads, Rivet, Sandbox Agent, Developer OS, or Code Atlas: to understand what Factory is, where a component lives, how work is admitted/built/accepted, what the current M1 scope is, and which actions are banned. Doctrine: factory-master-spec.md is the single canonical source of truth — everything else derives from it or gets flagged.
---

# Factory

Factory is an **autonomous software-delivery control plane** run by a single operator (Johnny).
One governed path carries intent to accepted code:

```txt
Port (system of record: catalog, RBAC, workflows, audit)
  → Port workflow webhook (HMAC-signed)
    → thin factory-gateway (§4.2.1 catalog writer lives inside it)
      → Rivet ProjectSupervisor (durable single admission queue)
        → WorkAttempt → AgentSession → SandboxLease
          → Sandbox Agent (HTTP server inside a Docker sandbox; coding agent process)
            → git commit → GitHub CI green on the exact SHA → Port accept
```

Developer OS (Next.js on Vercel) is the human display/intent surface over the same path — it is a
client of the control plane, never a second one. (Mission statement: repo `AGENTS.md`;
architecture anchor: master spec "Proposed Architecture (M1 index)".)

**Pattern lock (ADR-010):** a Factory plugin = skills + MCP + optional UI, ChatGPT Plugins as the
reference pattern. This package is the skills/knowledge half. The MCP half already exists — the
Port MCP gateway — and this plugin only *points* at it (see Install in the package README). Never
re-implement the gateway, and never route a privileged Factory mutation around it.

## The one doctrine that governs everything else

**`factory-master-spec.md` is the single canonical source of truth** for Factory architecture,
PBIs, ADRs, gates, Meta XOR Product, the unit-of-work fields, sync, and coding-loop order
(master spec §0, "hard rule — Johnny"). Every other surface — workflow docs, Linear, Notion,
repo docs, this skill — **derives from it and must match it**. Edits go **master first, then
propagate**. If a source cannot be reconciled to the master spec, **flag it** — do not invent a
parallel source of truth. Notion is a mirror only, never a Spec/accept/claim source of truth
(OQ-2, §0.6).

Where the master spec lives: authored in the JohnnyBox docs library (see
`references/infrastructure.md`); since PR #111 (merged 2026-10-30) the full library —
including `factory-master-spec.md` — is also committed in the repo under `docs/`
(LIVE-VERIFIED 2026-10-30, fragments E3 + PR #111).

## §0 doctrine (the operating system)

### Assemble-first (§0.0, §4.2.2)

Before building anything, prefer Port catalog composables and **machine-validated stack
assembly**: choose stack (template + modules) → Port validates compatibility rules stored as
catalog data → **only on success**, provision/connect and admit coding → on conflict, reject
with machine-readable reasons and compatible alternatives. Catalog misses are flagged **needs
implementation** and become Beads/PBI deltas — never silently scaffold an invalid combo or treat
an unflagged gap as a provisionable module.

### Unit of work — one thing, five names (§0.1)

**PBI ≡ typed contract ≡ Linear ticket ≡ bead ≡ GitHub issue.** They are the *same* unit of
work across five tools; referring to one refers to all. Do not treat them as separate concepts.

A unit is not startable (Definition of Ready) until its full **19-field** body is filled —
contract core **C1–C3** plus operational fields **1–16** — plus ASDLC pointers (Spec pointer,
Verification pointer, Refinement rule; default refinement: update the Spec in the same PR):

- **C1** Inputs + types · **C2** Outputs + types · **C3** Write targets (systems this unit may
  write; Beads must name **Meta Beads** *xor* **Product Beads** — exactly one, never "Beads")
- **1** Acceptance criteria · **2** Exact task description (imperative) · **3** Almost-exact
  directories in scope · **4** What not to touch · **5** Skills to use · **6** MCPs needed ·
  **7** Agent type required (roster name in §0.7 + task kind, below) · **8** CI requirements
  (gates that must green on the exact SHA) · **9** Dependencies · **10** Branch/worktree naming
  · **11** Failure/rollback behavior · **12** Reviewer for the PR · **13** Environment
  prerequisites · **14** Time estimate · **15** Secrets handling (where secrets live; never
  plaintext in the unit body) · **16** Observability hook (Port audit, `deliveryRun` /
  `executionAttempt`, Rivet traces, CI checks, Linear updates)

### Meta XOR Product (§0.2)

Every artifact, board, Beads instance, repo, and Port catalog ownership is **Meta** *xor*
**Product** — never Both, shared, or either.

- **Meta** = building Factory itself: the Factory Meta Linear project, the meta-repo, Meta
  Beads, the Meta Port catalog/fencing, seed PBIs PBI-001…015.
- **Product** = what Factory does when assembling a user project: Product Linear boards,
  product repos, Product Beads (per product, when shipped), Product Port delivery projections.

Shapes may rhyme across lanes; ownership must not. PBI-007 is Meta only (it wires Meta Beads
into kernel admit; it does **not** ship Product Beads).

### Four-plane sync (§0.3)

Facets of the same unit stay in sync, per lane; Meta planes never host Product units:

| Plane | Source of truth for |
|---|---|
| Beads (Meta or Product instance) | Ready / claim / parallel |
| Linear | Human tracker / visibility |
| git / GitHub | Source, PR, CI on exact SHA, GitHub-issue facet |
| Port | Accept, catalog, projections (writes via §4.2.1) |

Until PBI-007 wires Meta Beads into admit, **Linear is the admit/claim source of truth** and
Meta Beads is scaffolding-only (deps / `bd ready` practice) — OQ-1 hybrid, locked by Johnny
2026-10-29 (§0.6). Do not treat Beads as the day-one human board.

### Coding loop — locked order (§0.4)

**task → standardize → PR → build → loop.** Standardize includes Spec+Contract alignment and
assemble-first (§4.2.2). The loop is tool-agnostic — Cursor is not the only coding agent. This
order deliberately has **no** added independent-review / "Merge!" step; review attaches to the
PR/build gates named in §7 / ADR-008.

### Agent roster and task kinds (§0.7, §18)

Two agent **classes** only: **Coding** and **Cockpit** (§18). Every unit's field 7 names
**(a)** a roster agent type and **(b)** a task kind — `personal-agent` *xor* `coding-agent`:

| Agent type | Default kind | Notes |
|---|---|---|
| Muse | personal-agent | Personal / provisioning (Port, browser, provision flows) |
| ChatGPT regular | personal-agent | May be named for coding tasks when the unit says so |
| ChatGPT Work | personal-agent | Work-scoped ChatGPT surface |
| Codex | coding-agent | In-sandbox / coding path when admitted |
| Grok | personal-agent | May be named for coding tasks when the unit says so |
| Claude | personal-agent | General Claude chat — not Claude Code / Claude Design |
| Claude Code | coding-agent | M1 first in-sandbox coding harness (PBI-006) |
| Claude Design | personal-agent | Design/UI provision-style work — not Feature Assembly admit |

- **Personal-agent tasks** (→ Cockpit class): Port / browser / provisioning / cockpits /
  settings / assemble-intent / spawning coding work. They must **not** self-admit Sandbox Agent
  coding or self-accept on a SHA.
- **Coding-agent tasks** (→ Coding class): write/execute code for one admitted `WorkAttempt`
  inside the Rivet Sandbox Agent (Docker), under the §0.4 loop.
- The roster is extensible only by a master-first edit to §0.7, then propagate. Do not invent
  ad-hoc agent types.

### Artifact hierarchy (§1)

Agents **build against Specs**. A **Spec** (`/specs/{domain}/spec.md`, Blueprint + Contract) is
durable state; a **PBI** is a transient delta pointing at a Spec; an **ADR**
(`docs/adrs/ADR-NNN-*.md`) is an immutable decision snapshot — supersede, never edit the body.
LogicSRC artifacts (OpenStack, OpenMCP, OpenAgent, …) are interoperability *emissions from*
Specs, not the primary IR (ADR-004). `AGENTS.md` in a repo is an index that routes to relevant
Specs/ADRs/skills — it is not a design dump.

### Locked decisions you will hit constantly (master spec §3)

- **ADR-001** — Port is the system of record (catalog, RBAC, workflows, MCP gateway, audit,
  agent/skill registry, Context Lake). Clerk is out of scope.
- **ADR-002** — Rivet is the execution kernel: `ProjectSupervisor` single admission queue,
  per-actor ordered queues, single-writer, idempotent side effects. **Rivet never polls Port.**
- **ADR-003** — The only Port→Rivet path: MCP/self-service → workflow → webhook → thin gateway
  → supervisor → sandbox → GitHub. Port catalog holds projections.
- **ADR-005** — Auth = the dedicated **Factory** Port External Interface OAuth app; humans and
  agents share the same Port surface. **Live** since 2026-10-29. **Never** reuse the revoked
  Harness Observatory app.
- **ADR-006** — Coding harness = Rivet-orchestrated **Sandbox Agent** (in-sandbox HTTP server +
  SDK); isolation = Docker provider. Not a "Rivet built-in."
- **ADR-008** — Visibility = Port audit + Rivet traces + Polygraph session/review artifacts +
  scorecards. **Accept = GitHub CI green on the exact SHA.** Agent self-report is never accept.
- **ADR-010** — ChatGPT Plugins (skills + MCP + optional UI) = reference pattern for Factory
  MCP Apps — the pattern this plugin follows.
- **ADR-011** — Developer OS = Next.js App Router on Vercel; kernel streaming = Rivet Actor
  native realtime. CopilotKit / AG-UI deferred (ADR-007 superseded by ADR-011).

## Route to the reference files

This skill stays lean; detail lives in `references/` (read the one your task needs):

| Question | Read |
|---|---|
| Where does X live? Hosts, ports, tenants, services, accounts, what is live vs specced vs missing | `references/infrastructure.md` |
| How does a build actually flow — admit, fencing, sandbox, accept? How is a component spun up? | `references/how-factory-builds.md` |
| What does Factory build for a user? Stack assembly, Product lane, M1 cut vs post-M1, LogicSRC emissions | `references/what-factory-builds.md` |
| Code Atlas — overlays, render contract, live-bind gap | `references/atlas.md` |
| What must I never do? The rails for any agent working in Factory | `references/rails.md` |
| The units of work — the 15 seed PBIs, the 19-field contract body, each PBI's facet state | `references/pbis.md`; the unit bodies themselves in `../../../pbis/` |
| Contracts — a domain's Definition of Done / Guardrails / Scenarios; the typed-contract template; live Port execution contracts; the ADR index | `references/contracts.md`; full Contract text + template in `../../../contracts/` |
| A unit's identifiers across systems (PBI ↔ STL ↔ GitHub # ↔ bead) and the live facet snapshots | `../../../units/UNITS.md`; exports in `../../../units/` (Linear / GitHub / Beads JSON — snapshots, re-pull before trusting) |

## Evidence discipline

Claims in this package are tagged:

- **LIVE-VERIFIED 2026-10-30** — observed in the real tenant/hosts/repo that day (atlas-map
  fragments A–E are the evidence base; the fragment name is cited).
- **SPEC** — stated in the master spec or a depth doc; the section is cited. Spec-stated is not
  the same as live.
- **GAP** — known missing/unbuilt/unverified.

If live state and the spec disagree, the master spec wins on *design* (§0) and you **flag the
drift** — you do not silently follow either one.
