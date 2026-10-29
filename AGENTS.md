# Factory (Meta) — AGENTS.md

Index for coding agents working the **Factory Meta** repo (building the Factory kernel). Not a design dump.

## Mission

Factory is an autonomous software-delivery control plane: Port (SoT) → thin `factory-gateway` → Rivet `ProjectSupervisor` → Sandbox Agent (Docker) → GitHub CI accept on exact SHA. This repository is the **meta-repo** for that kernel — Specs, ADRs, gateway, Developer OS shell.

## Lane hard rules

- **Meta only** — never Product Beads / product Linear boards from this repo.
- **Unit of work:** Linear ticket ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.
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

See `docs/adrs/`. Bodies immutable after PBI-002; supersede, do not edit.

## Toolchain (minimal)

| Tool | Notes |
|------|-------|
| Linear project **Factory Meta** | Human tracker facet for seed PBIs |
| Port | Catalog SoT; workflows as tools — bind live names only |
| Rivet 2.x Compose + Tailscale Serve | Execution kernel (PBI-004+) |
| Beads (**Meta Beads**) | **Scaffolded now** (OQ-1 hybrid locked). Prefix `factory-`. **Linear remains admit/claim SoT until PBI-007.** Not a day-one human board. Product Beads never in this repo. |
| GitHub Actions | Accept path on exact SHA (PBI-011) |

## Meta Beads (scaffold — hybrid OQ-1)

Instance lives in `.beads/` (embedded Dolt). Issue ids: `factory-<hash>`. CLI: `bd ready` → `bd update --claim` → `bd close`.

**Until PBI-007:** use Meta Beads for deps / `bd ready` practice only. **Do not** treat Beads claim as Rivet admit authority or replace Linear assignee as the human/admit SoT. After PBI-007, `ProjectSupervisor` admits only when Meta Beads reports ready (or audited Port bypass). Sync: `bd dolt push` / `bd dolt pull` against `refs/dolt/data` — do not `bd init` per worktree.

Full Project write-up: Project store `docs/meta-beads-scaffold.md`.

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

See `README.md` and master production plan. Apps: `apps/factory-gateway/`, `apps/developer-os/`.
