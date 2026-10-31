<!-- Staged AGENTS.md for Factory Meta repo commit; copy to repo root as AGENTS.md -->

# Factory (Meta) — AGENTS.md

Index for coding agents working the **Factory Meta** repo (building the Factory kernel). Not a design dump.

## Canonical source of truth

**[`docs/factory-master-spec.md`](./docs/factory-master-spec.md)** is the **single canonical SoT**. Future edits: master first, then propagate. This file indexes Specs/ADRs/skills only — it does not invent architecture.

Derived companions (must match master): `docs/factory-workflow.md`, `docs/factory-meta-vs-product.md`, `docs/factory-coding-loop.md`, `docs/factory-architecture-map.md`.

## Mission

Factory is an autonomous software-delivery control plane: Port (SoT) → thin `factory-gateway` → Rivet `ProjectSupervisor` → Sandbox Agent (Docker) → GitHub CI accept on exact SHA. This repository is the **meta-repo** for that kernel — Specs, ADRs, gateway, Developer OS shell.

## Lane hard rules (master §0.2)

- **Meta only** — never Product Beads / product Linear boards from this repo.
- **Unit of work:** Linear ticket ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue (19-field body — master §0.1).
- **Agent types (field 7):** master §0.7 roster — Muse, ChatGPT regular, ChatGPT Work, Codex, Grok, Claude, Claude Code, Claude Design — plus task kind **personal-agent** *xor* **coding-agent**. Extensible via master-first edit.
- **Coding loop:** task → standardize → PR → build → loop (no independent-review step).
- **No Port OAuth create/delete** (ADR-005 deferred).
- Agents **build against** `/specs/{domain}/spec.md`, not against Project store scratch alone once Specs are green.
- Agent “done” ≠ Port accept. Accept = green CI on exact SHA + Port governance.

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

See `docs/adrs/`. Bodies immutable — supersede, never edit. Summaries in master §3.

## Skills

ASDLC practices under Project/skills; do not dump design here.
