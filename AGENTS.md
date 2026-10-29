# Factory (Meta) — AGENTS.md

Index for coding agents working the **Factory Meta** repo (building the Factory kernel). Not a design dump.

## Mission

Factory is an autonomous software-delivery control plane: Port (SoT) → thin `factory-gateway` → Rivet `ProjectSupervisor` → Sandbox Agent (Docker) → GitHub CI accept on exact SHA. This repository is the **meta-repo** for that kernel — Specs, ADRs, gateway, Developer OS shell.

## Lane hard rules

- **Meta only** — never Product Beads / product Linear boards from this repo.
- **Unit of work:** Linear ticket ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue.
- **No Port OAuth create/delete/revoke** from this repo. ADR-005 is Accepted — live (dedicated Factory app). Do not mutate External Interface apps here.
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

Full Nygard bodies: `docs/adrs/` ADR-001…ADR-011. Immutable after PBI-002; supersede, do not edit.

ADR-007 is **Superseded by ADR-011**.

## Toolchain (minimal)

| Tool | Notes |
|------|-------|
| Linear project **Factory Meta** | Human tracker facet for seed PBIs |
| Port | Catalog SoT; workflows as tools — bind live names only |
| Rivet 2.x Compose + Tailscale Serve | Execution kernel (PBI-004+) |
| Beads (**Meta Beads**) | Ready/claim from PBI-007; optional earlier scaffolding (OQ-1) |
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

See `README.md` and master production plan. Apps: `apps/factory-gateway/`, `apps/developer-os/`.

## LogicSRC emits (index)

| Artifact | Path |
|----------|------|
| OpenStack | `OpenStack.md` · `/.well-known/openstack.md` |
| OpenProfile (operator) | `OpenProfile.md` · `/.well-known/openprofile.md` |
| OpenMCP / OpenAccess | `/.well-known/openmcp.json`, `openaccess.json` (PBI-010) |

This file indexes; it does not dump Spec Blueprint/Contract design.
