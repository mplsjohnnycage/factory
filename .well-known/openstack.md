# Factory

- **Kind**: monorepo
- **Web**: https://github.com/mplsjohnnycage/factory
- **Repo**: https://github.com/mplsjohnnycage/factory
- **Operator**: /.well-known/openprofile.md
- **License**: Proprietary (Meta lane — Factory kernel)
- **Updated**: 2026-10-29

Autonomous software-delivery control plane (Meta): Port SoT → thin `factory-gateway` → Rivet `ProjectSupervisor` → Sandbox Agent (Docker) → GitHub CI accept on exact SHA. Not OpenStack IaaS.

## Languages

- TypeScript (target): Developer OS, factory-gateway, schemas
- Markdown: Specs (`/specs/*/spec.md`), ADRs (`docs/adrs/`), LogicSRC emits
- YAML: Compose / GitHub Actions (when authored)

## Runtimes

- Node (LTS): gateway and Next.js server
- Browser: Developer OS shell
- Docker: Rivet Sandbox Agent isolation (ADR-006)

## Interfaces

### Web

- Next.js App Router (target): Developer OS on Vercel (ADR-011)
- Port person OAuth callback Route Handler (ADR-005 live client; no Observatory)

### Gateway

- `apps/factory-gateway`: Port webhook HMAC verify → enqueue `ProjectSupervisor`; §4.2.1 catalog writer (PBI-005)

### MCP

- Port MCP gateway (SoT tools/workflows) — Factory binds live names only
- `/.well-known/openmcp.json` descriptor (PBI-010 — Port remote MCP entry)
- `/.well-known/openaccess.json` descriptor (PBI-010 — Factory client scopes/redirects; Port issues tokens)

### Execution

- Rivet 2.x actors / queues / workflows (ADR-002)
- Sandbox Agent in-sandbox HTTP harness (ADR-006)

## Data

- Port catalog: system of record (ADR-001)
- Git: source of truth for Specs, ADRs, apps
- Linear: PBI / human tracker facet (Factory Meta)
- Meta Beads: readiness/claim graph (PBI-007 — `apps/project-supervisor/` + `.beads/`)

## Services

- Port: catalog, RBAC, workflows-as-tools, audit, Context Lake
- Rivet 2.x + Tailscale Serve: execution kernel health (PBI-004+)
- GitHub: PR + CI accept on exact SHA (ADR-008 / PBI-011)
- Linear: ASDLC / Factory Meta issues

## Modules

- `specs/*`: ASDLC Specs (Blueprint + Contract) — build-against IR (ADR-004)
- `docs/adrs/`: Nygard ADR-001…011 (immutable after merge)
- `AGENTS.md`: agent index only — not a design dump
- LogicSRC emits: this file, OpenProfile, OpenAccess/OpenMCP well-knowns

## Tooling

- Cursor Cloud Agents / coding agents against Specs
- GitHub Actions: accept path on exact SHA
- `@logicsrc/validators@0.6.0` via `npm run local-gate` / `bin/local-gate` (PBI-013); CI job `local-gate-refuse`
- Compound Engineering `/ce-compound` HITL after verified coding PBIs (PBI-015)

## Hosting

- Vercel: Developer OS preview/production (ADR-011)
- Desktop Compose + Tailscale Serve: Rivet pilot host (PBI-004)
- GitHub: this meta-repo

## Auth

- Dedicated Factory Port External Interface OAuth (ADR-005 Accepted — live)
- Never Harness Observatory; Clerk out of scope (ADR-001)
- No Port External Interface create/delete/revoke from this repo

## Conventions

- Unit of work: Linear ≡ PBI ≡ typed contract ≡ bead ≡ GitHub issue
- Agents build against `/specs/{domain}/spec.md`, not store scratch alone
- Living Spec updates travel in the same PR as Contract changes
- ADR bodies are supersede-only after merge
- Meta lane only — never Product Beads / product Linear boards from this repo
- Markdown-first LogicSRC; JSON derived where schemas require

## Not

- Not Clerk as IdP / SoT
- Not Harness Observatory as Factory OAuth client
- Not CopilotKit / AG-UI in the kernel (deferred; ADR-007 superseded by ADR-011)
- Not Rivet as catalog SoT; Rivet never polls Port
- Not browser → Sandbox Agent control APIs
- Not Product Beads dual-write from Meta
- Not inventing Port OAuth client ids in git
