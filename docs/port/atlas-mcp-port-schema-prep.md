# Port schema prep — Code Atlas MCP tools

**Status:** PREPARED · **APPLIED live** (Johnny-approved 2026-10-29; see store `docs/atlas-schema-apply-run.md`)  
**Lane:** Meta · STL-154 / Developer OS M4  
**Date:** 2026-10-29 · **Docs sync:** follow-up PR (no re-apply)

## Intent

Bind Dev OS read-projection tools into Port MCP / workflows as **read-only** tools.
Live upsert required Johnny approval (done). Further Port mutations stay gated.

## Proposed tools (already in repo OpenMCP advertise)

| Tool | Purpose |
|------|---------|
| `atlas.find_node` | Search overlay nodes by id/label/sourceId |
| `atlas.expand_dependencies` | Viewport neighborhood expand |
| `atlas.get_task_impact` | Beads task → proven Graft/Polygraph impact |
| `atlas.get_related_sessions` | Proven Polygraph sessions for a node |
| `atlas.get_agent_traces` | Historical Langfuse traces (never live owner) |

Implementation (Dev OS BFF, already shipping in PR):

- `GET /api/atlas/subgraph`
- `GET|POST /api/atlas/tools`
- Spec: `specs/developer-os/spec.md` (STL-154 scenarios)
- Advertise: `/.well-known/openmcp.json`

## Naming (OpenMCP vs Port)

| OpenMCP / BFF (canonical) | Port workflow identifier |
|---------------------------|--------------------------|
| `atlas.find_node` | `atlas_find_node` |
| `atlas.expand_dependencies` | `atlas_expand_dependencies` |
| `atlas.get_task_impact` | `atlas_get_task_impact` |
| `atlas.get_related_sessions` | `atlas_get_related_sessions` |
| `atlas.get_agent_traces` | `atlas_get_agent_traces` |

Port IDs disallow `.` (`^[A-Za-z0-9@_:-]+$`). `/.well-known/openmcp.json` advertises dotted names only; `factory.atlas_tools.map` records the underscore mapping. Dev OS `POST /api/atlas/tools` accepts either form.

## Diff vs live Port

| Live (post apply) | Notes |
|-------------------|--------|
| Five `atlas_*` SELF_SERVE workflows → Dev OS BFF WEBHOOK | Underscore IDs; dotted names in invoke body / OpenMCP |
| `_mcp_server` `factory-devos-atlas-bff` (`exposed=false`) | REST BFF ≠ Streamable MCP connector |
| `skill` `factory-code-atlas-read-projection` | Read projection pointer |
| No catalog write | §4.2.1 unchanged |

## Apply checklist (Johnny) — completed

1. PR #51 merged with independent APPROVE + green `meta-ci-presence`.
2. Five read-only `atlas_*` workflows created (Port EU).
3. Connector / `_mcp_server` URL → stable Dev OS atlas routes — **not** Sandbox Agent.
4. Smoke: `atlas.find_node` + `get_agent_traces` with `asLiveOwner` refused — operator guide [`docs/ops/atlas-bff-smoke.md`](../ops/atlas-bff-smoke.md) (`npm run smoke:atlas-bff`; prod default).
5. No write tools on Langfuse via this bind.

**Re-apply:** do not upsert again from this doc unless Johnny re-approves. Treat this file as naming + rollback reference.

**Post-#58:** BFF accepts Port underscore aliases; OpenMCP keeps dotted-only `tools[]` plus `factory.atlas_tools.map`. Re-run prod smoke after each Atlas BFF deploy — do not re-upsert schema.

## Rollback

- Disable/remove Port workflow tool bindings.
- OpenMCP advertise can remain (docs-only) or revert file.
- Dev OS atlas routes are display/read — disabling Port bind does not break shell.

## Hard bans honored

- No Observatory
- No live Port schema apply in this prep
- No OAuth create/delete beyond approved redirect prune (separate ops)
