# Port schema prep — Code Atlas MCP tools (READY for Johnny)

**Status:** PREPARED · **NOT applied live**  
**Lane:** Meta · STL-154 / Developer OS M4  
**Date:** 2026-10-29

## Intent

Bind Dev OS read-projection tools into Port MCP / workflows as **read-only** tools. Live blueprint/workflow upsert waits for Johnny approval.

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

## Diff vs live Port

| Live today | Proposed (not applied) |
|------------|------------------------|
| OpenMCP lists factory_* workflow tools only (pre-PR) / + atlas.* advertise after #51 merge | Port workflow entities + MCP connector mapping for `atlas.*` |
| No Port blueprint for Code Atlas projection | Optional `_mcp_server` / skill entity pointing at Dev OS atlas BFF |
| No catalog write | **Still none** — read projection only; §4.2.1 unchanged |

## Apply checklist (Johnny)

1. Confirm PR #51 (or successor) merged with independent APPROVE + green `meta-ci-presence`.
2. Create/update Port workflow-as-tool definitions for the five `atlas.*` names (read-only).
3. Point connector base URL at stable Dev OS (`https://factory-developer-os.vercel.app`) atlas routes — **not** Sandbox Agent.
4. Smoke: `atlas.find_node` + `get_agent_traces` with `asLiveOwner` refused.
5. Do **not** grant write tools on Langfuse via this bind.

## Rollback

- Disable/remove Port workflow tool bindings.
- OpenMCP advertise can remain (docs-only) or revert file.
- Dev OS atlas routes are display/read — disabling Port bind does not break shell.

## Hard bans honored

- No Observatory
- No live Port schema apply in this prep
- No OAuth create/delete beyond approved redirect prune (separate ops)
