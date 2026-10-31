# Fan-out — Single-MCP through Port

**When:** 2026-10-29  
**Trigger:** Johnny lock after FE-120/FE-121 thread — App Router hosts Factory MCP Apps later; **all privileged Factory control routes through Port**.  
**Locks:** ADR-001 · master §18.5 · `.well-known/openmcp.json` → `https://mcp.port.io/v1` · ADR-010/§16 Apps behind Port RBAC  

## Verdict (pre-fanout)

| Surface | Host | Role |
|---------|------|------|
| Factory control-plane MCP | **Port** `mcp.port.io/v1` | One entry; workflows-as-tools; catalog SoT |
| Dev OS (`apps/developer-os`) | Vercel App Router | Display + Port OAuth BFF + Rivet stream — **not** MCP runtime |
| Factory MCP Apps (e.g. Linear board) | App Router app (design §16) | Behind Port RBAC; post-M1; not live |
| OpenMCP / OpenAccess well-knowns | Repo root `/.well-known/` | Descriptor only — not a second runtime |

## Parallel tracks — **FE-122 closed**

| ID | Track | Status | Evidence |
|----|-------|--------|----------|
| **A** | Dev OS MCP absence | **PASS** | [Audit Dev OS for MCP](bc-feec28f0-2cd4-542f-8fdc-9fdbaf68ce7d) · `internal/devos-mcp-absence-audit.md` |
| **B** | OpenMCP + Spec/ADR | **PASS** (soft gaps) | [Audit OpenMCP Port entry](bc-86bc3440-e602-5761-9a5b-f2ceb760bd17) · `internal/single-mcp-port-front-door-audit.md` |
| **C** | MCP Apps behind Port | **Absent** (design-lock) | [Map MCP Apps behind Port](bc-36639fee-9a7c-5179-85af-7e0babca9a4a) · `internal/mcp-apps-topology-map.md` |
| **D** | Live Port connectors | **Done** | [Live Port MCP connectors](bc-fce93993-4a04-50ee-84b1-310c5ed5d17f) · [`mcp-connector-live-verify.md`](./mcp-connector-live-verify.md) |
| **E** | Durable store note | **Done** | this file · FE-121 · [`morning-parallel-sprint.md`](./morning-parallel-sprint.md) |

### Track A

No `/api/mcp` / mcp-handler / well-known rewrite in Dev OS — OAuth + Rivet BFF only. Soft Spec nuance on MCP Apps wording only.

### Track B

Port `https://mcp.port.io/v1` is sole Factory MCP entry across OpenMCP/Specs/ADRs. Soft: “gateway” name collision; AGENTS.md index-only; Apps vs tools split underspecified, not contrary.

### Track C

No `apps/linear-mcp-app/`. Post-M1: Spec stub → registration note → **new PBI** before scaffold. Do not empty-scaffold or rewrite OpenMCP now.

## Track D result ([Live Port MCP connectors](bc-fce93993-4a04-50ee-84b1-310c5ed5d17f))

**Status:** complete (live Port read) — [`mcp-connector-live-verify.md`](./mcp-connector-live-verify.md)  
**Sources:** live Port MCP (`list_entities` `_mcp_server`, integrations, EI apps, `factory_*` triggers) + OpenMCP; prior docs for context

| Already Port-fronted | Still open (ops / later) |
|----------------------|--------------------------|
| Port remote MCP + OpenMCP linked; 7 `factory_*` tools | `factory-gateway` is §4.2.1 writer / HMAC — **not** an MCP proxy (by design) |
| `_mcp_server` **13** entities; **only** `port-eu-mcp` (`https://mcp.port.io/v1`) has `exposed: true` | WEBHOOK → **public** gateway remount blocked until Funnel/`FACTORY_GATEWAY_BASE_URL` ([`factory-gateway-public-url.md`](./factory-gateway-public-url.md)) |
| 12 vendor/US rows = registry metadata (`exposed: false`) | Do not flip vendor `exposed` without explicit ops + RBAC |
| Ocean = 5 catalog sync installs (≠ MCP connectors) | — |
| Observatory not Factory client (EI apps = Factory only) | — |

**Stale gap corrected:** Dev OS person OAuth / HTTPS / `lastLoginAt` called incomplete in prep inventory — superseded by FE-113 + FE-119 + FE-120 (stable `NEXT_PUBLIC_DEVOS_URL`, live login proven). Connectors “not verified live” from Track D docs-only pass — superseded by FE-123 live verify.

**No new PR from D.** Next operator path remains gateway public URL → remount (FE-114), not App Router MCP hosting.

## Hard bans (every track)

- Do **not** host Port control-plane MCP inside Dev OS App Router.
- Do **not** configure Harness Observatory as Factory OAuth / MCP client.
- Do **not** dual-write Port catalog outside §4.2.1 `factory-gateway`.
- Do **not** treat vendor MCP (Linear/Rivet/Vercel) as ungated Factory mutation path.
- Repo stays **public**.

## Related

- [`devos-stable-oauth-url.md`](./devos-stable-oauth-url.md) — FE-120 stable OAuth host  
- FE-121 — MCP App Router host Q&A (done in notes)  
- Spec: `specs/port-governance/spec.md`, `specs/developer-os/spec.md`
