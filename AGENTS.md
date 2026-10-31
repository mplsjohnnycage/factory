# Factory (Meta) — AGENTS.md

Index for coding agents working the **Factory Meta** repo (building the Factory kernel). Not a design dump.

## Canonical source of truth

**[`docs/factory-master-spec.md`](./docs/factory-master-spec.md)** is the **single canonical SoT** (master §0). Future edits: master first, then propagate. This file indexes Specs/ADRs/skills/docs only — it does not invent architecture.

Derived companions (must match master): `docs/factory-workflow.md`, `docs/factory-meta-vs-product.md`, `docs/factory-coding-loop.md`, `docs/factory-architecture-map.md`.

## Mission

Factory is an autonomous software-delivery control plane: Port (SoT) → thin `factory-gateway` → Rivet `ProjectSupervisor` → Sandbox Agent (Docker) → GitHub CI accept on exact SHA. This repository is the **meta-repo** for that kernel — Specs, ADRs, gateway, Developer OS shell.

## Lane hard rules (master §0.2)

- **Meta only** — never Product Beads / product Linear boards from this repo.
- **Unit of work:** Linear ticket ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue (19-field body — master §0.1).
- **Agent types (field 7):** master §0.7 roster — Muse, ChatGPT regular, ChatGPT Work, Codex, Grok, Claude, Claude Code, Claude Design — plus task kind **personal-agent** *xor* **coding-agent**. Extensible via master-first edit.
- **Coding loop:** task → standardize → PR → build → loop (no independent-review step).
- **No Port OAuth create/delete/revoke** from this repo. ADR-005 is Accepted — **live** (dedicated Factory app; master §3 / §0.6). Do not mutate External Interface apps here.
- Agents **build against** `/specs/{domain}/spec.md`, not against Project store scratch alone once Specs are green.
- Agent "done" ≠ Port accept. Accept = green CI on exact SHA + Port governance.

## Spec index

| Domain | Path |
|--------|------|
| factory-kernel | `specs/factory-kernel/spec.md` |
| port-governance | `specs/port-governance/spec.md` |
| rivet-execution | `specs/rivet-execution/spec.md` |
| sandbox-harness | `specs/sandbox-harness/spec.md` |
| developer-os | `specs/developer-os/spec.md` |
| auth-port-oauth | `specs/auth-port-oauth/spec.md` |
| logicsrc-interop | `specs/logicsrc-interop/spec.md` |
| visibility-accept | `specs/visibility-accept/spec.md` |
| security-blast-radius | `specs/security-blast-radius/spec.md` |
| asdlc-lifecycle | `specs/asdlc-lifecycle/spec.md` |

## ADR index

Full Nygard bodies: `docs/adrs/` ADR-001…ADR-011. Immutable — supersede, never edit. Summaries in master §3. ADR-007 is **Superseded by ADR-011**.

## Docs library index (`docs/`)

Imported from the JohnnyBox Project store (master spec §0: Project store `docs/` is the doc home; Notion is mirror only, never SoT).

| Need | Route |
|------|-------|
| Canonical architecture / PBIs / gates | `docs/factory-master-spec.md` (§§0–22) |
| What the master links to | `docs/factory-master-spec-linked-docs.md` |
| Workflow / coding loop / Meta XOR Product / map | `docs/factory-workflow.md` · `docs/factory-coding-loop.md` · `docs/factory-meta-vs-product.md` · `docs/factory-architecture-map.md` |
| Rivet depth | `docs/rivet-engineering-spec.md` · `docs/rivet-sandbox-agent.md` · `docs/rivet-claim-fencing.md` · `docs/rivet-full-capacity.md` |
| Port depth | `docs/port-factory-data-model.md` (§4.1 = §4.2.1 fence source) · `docs/port-capabilities.md` · `docs/port-full-capacity.md` · `docs/port/` |
| Stack / standards evidence | `docs/factory-stack-audit.md` · `docs/factory-open-standards.md` · `docs/logicsrc-artifact-inventory.md` · `docs/iso-12207-overview.md` |
| Research pack (master's sources) | `docs/factory-research-300-qa.md` · `docs/factory-research-reconciliation.md` · `docs/factory-spec-remaster-report.md` |
| Ops runbooks | `docs/ops/` |
| Meta Beads operator guide | `docs/meta-beads.md` · queue mirror: `docs/ops/factory-queue-mirror.md` |
| Seed PBIs | `docs/linear-pbi-seed/` · `tasks/` |

## Toolchain (index)

| Tool | Route |
|------|-------|
| Linear project **Factory Meta** | Human tracker facet for seed PBIs |
| Port | Catalog SoT; workflows as tools — bind live names only (master §4.2) |
| Rivet 2.x Compose + Tailscale Serve | Execution kernel — `compose/` + `docs/rivet-tailscale-serve.md` (PBI-004+) |
| Beads (**Meta Beads**) | Ready/claim SoT for Meta coding admit (PBI-007). Prefix `factory-`. Instance `.beads/`. Never Product Beads. Operator detail: `docs/meta-beads.md` |
| GitHub Actions | Accept path on exact SHA (PBI-011) |

## Judgment boundaries

- **NEVER** call Sandbox Agent from the browser.
- **NEVER** dual-write Port catalog outside §4.2.1 gateway writer.
- **NEVER** configure Harness Observatory as Factory OAuth client.
- **ASK** before Port mutations that create/delete External Interface apps.
- **ALWAYS** update Spec in same PR when Contract changes (default refinement).

## Skills roster

- ASDLC skill (Project store `skills/asdlc/`) — The Spec / The PBI / The ADR / living-specs / agents-md-spec
- Compound Engineering `/ce-compound` (HITL) after verified coding PBIs (PBI-015)

## Layout (mandated §2)

See `README.md` and `docs/factory-master-spec.md` §2. Apps: `apps/factory-gateway/`, `apps/sandbox-harness/`, `apps/project-supervisor/`, `apps/developer-os/` (Next.js → Vercel; PBI-008 shell).

## LogicSRC emits (index)

| Artifact | Path |
|----------|------|
| OpenStack | `OpenStack.md` · `/.well-known/openstack.md` |
| OpenProfile (operator) | `OpenProfile.md` · `/.well-known/openprofile.md` |
| OpenMCP / OpenAccess | `/.well-known/openmcp.json`, `openaccess.json` (PBI-010) |
| OpenPRD 0001–0005 | `prd/` (PBI-014; post-M1; Meta product-intent) |

This file indexes; it does not dump Spec Blueprint/Contract design.

## RivetKit reference

For any RivetKit work (actors, state, events, actions, connections, clients, deploy), read <https://rivet.dev/llms.txt> first. Rivet Cloud namespace for deploys: `johnny-cage-4xuq-production-i6cu` only (never the default `production` namespace). `RIVET_ENDPOINT` is a secret: Vercel secret store or a gitignored `.env` only; never commit, echo, or pass on a command line.
