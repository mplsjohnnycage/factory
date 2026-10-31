# What Factory builds

Factory's product is **assembled software**: a user project composed from catalogued,
machine-validated stack modules — not greenfield scaffolding invented per request.
This file covers the Product lane. Building Factory *itself* is the Meta lane (SKILL.md §0.2).

## Assemble-first product model (master spec §0.0, §4.2.2)

1. **Choose** a stack — a template plus modules — via the Port catalog, the Developer OS Port
   widget, or the Factory MCP surface.
2. **Port validates** the selection against compatibility rules stored *as catalog data*
   (relations, scorecard rules, compatibility entities). Validation is machine-checked before
   any build, not prose guidelines or post-build CI luck.
3. **On success only:** GitHub Actions (and Port provision workflows) provision/connect the
   pieces — Vercel, Convex, GitHub, shadcn, Tailwind tokens/themes, auth/ORM/RPC choices.
4. **On conflict:** reject with machine-readable reasons and surface compatible alternatives.
   No scaffold, no provision, no Coding admit for an invalid combo.
5. **Catalog miss** → flagged **needs implementation** → becomes a Beads/PBI delta. A miss is a
   work item, never a silent workaround.

What Port validates (non-exhaustive; §4.2.2): T3 / Better-T-Stack-class options, Convex
components, shadcn components/registries, Tailwind tokens/themes, Better Auth, Drizzle |
Prisma, tRPC — modeled as catalog entities `stackTemplate`, `provider`, `convexComponent`,
`shadcnComponent`, `shadcnRegistry` (port-factory-data-model §2.1 — observed already in the
live catalog, alongside `service` relations to skills, MCP servers, components, providers, and
stack templates, and a `provision_composable_stack` workflow).

The assembled modules themselves are reusable composables: UI kits, Convex components,
auth/backend providers, MCP servers, and skills wired into a service (port-factory-data-model
§2.1). A Product is the composition: product/service/environment entities with those relations
resolved, delivery projected into the Product-side Port catalog (§0.2 Product owns Product Port
delivery projections, Product Linear boards, product repos, and per-product Product Beads when
shipped).

## The default stack (operator standard)

Johnny's default build stack, which templates should encode unless a unit overrides it:
**Next.js App Router, React, TypeScript, Convex, Tailwind, shadcn/ui, Zod, Vercel.** Auth
defaults to **Clerk** for agent-driven/factory builds; WorkOS AuthKit/RBAC is an explicit
per-product override only, never the default (operator standing rule; note this is the
*product* default — inside Factory's own governance, auth is Port, ADR-001/005).

## M1 cut — what ships first (master spec §13.5)

**"Factory M1" is done when the vertical slice is green, not when every Spec is implemented.**
Definition of Done (§13.5): one Port-authorized run → Sandbox Agent → commit → GitHub CI green
on the exact SHA.

**Implement / verify first:**

- Specs: `factory-kernel`, `port-governance` (§4.2.1 fencing), `rivet-execution`,
  `sandbox-harness`, `visibility-accept`
- PBIs **004–007** and **011** (Rivet Compose + Serve health; thin gateway with the §4.2.1
  writer; AgentSession + Sandbox Agent + Claude Code harness; ProjectSupervisor fencing + Meta
  Beads ready gate; GitHub checks → accept on exact SHA)
- ADRs 001–006, 008, 011

**Author stubs OK, implement later:** `developer-os` (shell + Atlas L0 parallelizable as
PBI-008/009), `auth-port-oauth` (docs-only Contract; the OAuth app itself is already live,
ADR-005), `logicsrc-interop` (OpenStack/OpenProfile/AGENTS only for M1),
`security-blast-radius` (gateway HMAC + RBAC only), `asdlc-lifecycle` (gates + EGM).

**Design-locked, M1 implementation deferred (not M1 exit criteria):** §11 AG-UI adapter
detail, §16 Linear MCP App, §19 full agent-chrome matrix, §20 Spec Canvas + Beads loop screen,
§4.2.2 assembly wizard (§18.3's assemble-software Cockpit capability is post-M1 implement).

**Post-M1 also includes** (§13.0 Non-Goals, §13.6): CapacityManager multi-cluster, OpenFleet
full ceiling matrix in production (PBI-012 stays authored but implementation-gated behind M1
accept green), the `factory-edge` private tailnet relay, LogicSRC ontology/OpenAccess hub,
Polygraph multi-repo coordination (activates when ≥2 repos share a delivery run, §13.2).

**M1 success metrics** (§13.7, the ones with numbers): admit uniqueness (duplicate
`work.start` → one `WorkAttempt`); catalog fence chaos test (concurrent writers → one apply,
one stale reject); Dev OS stream reconnects from last Actor `sequence`; Atlas L0 ≤2s skeleton
with expand-in-place; ≤2M LLM tokens per `WorkAttempt` soft cap; ≤4 vCPU / 8 GiB per Sandbox
Agent container; ≤2,000 nodes / ≤50 MiB JSONL per indexed Atlas repo.

## LogicSRC emissions (master spec §5, §13.6)

Specs emit interoperability artifacts; LogicSRC is emission, not the primary IR (ADR-004).
**M1 emits only these §13.6 rows:**

| Cut | Artifact | Owning Spec / PBI |
|---|---|---|
| Required | `AGENTS.md` (index only) | logicsrc-interop / PBI-003 |
| Required | `OpenStack.md` + `/.well-known/openstack.md` | logicsrc-interop / PBI-003 |
| Required | `/.well-known/openprofile.md` | logicsrc-interop / PBI-003 |
| Required | `/.well-known/openmcp.json` — advertises the one MCP gateway; documentation of the surface, not a second runtime (§18.5) | port-governance / PBI-010 |
| Required | `/.well-known/openaccess.json` — descriptor only; Port issues the tokens | auth-port-oauth / PBI-010 |
| Optional stub | OpenAgent `agents/coder.factory.json` | sandbox-harness |
| Post-M1 | OpenFleet ceilings/ledger in production; OpenOntology/OpenContext packages; full OpenPRD 0001–0005 batch; OpenWorkflow production index | security / port-governance / asdlc-lifecycle / factory-kernel |

Full §5 matrix (owning Spec → path) also maps: OpenPRD 0.3 → `prd/NNNN-slug.md`; OpenAgent
JSON → `agents/*.json`; OpenFleet records → `~/.openfleet/...`; OpenWorkflow → `workflows/*.json`
+ `/.well-known/openworkflow.json`; OpenInstall → `bin/install.sh`; task/run/event JSON emitted
at runtime by factory-kernel. Whatever is emitted is validated with `@logicsrc/validators` /
`logicsrc prd validate --strict` in the local gate (PBI-013). Never invent partial conformance
for out-of-v1 inventory rows (§13.6).

## Where a product's work is tracked

A Product unit of work is the same 19-field typed contract as a Meta unit (SKILL.md §0.1),
faceted onto the **Product** lane's planes: Product Linear board, product repo + CI, Product
Beads (per product), Product Port delivery projections (§0.2/§0.3). The Meta repo and Meta
Beads never host Product units.
