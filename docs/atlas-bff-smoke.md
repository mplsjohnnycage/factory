# Atlas BFF smoke — post #51 + Port schema

**Executed:** 2026-10-29T15:43–15:44Z  
**Lane:** Meta · No Observatory · No Port schema changes  
**Prod:** `https://factory-developer-os.vercel.app/api/atlas/tools`  
**Prior apply:** [`atlas-schema-apply-run.md`](./atlas-schema-apply-run.md)

## 1. Vercel production includes #51

| Field | Value |
|-------|-------|
| Project | `factory-developer-os` (`prj_0aMlHCBmlLnCVkMLgqsxG3OxzdkM`) |
| Deployment | `dpl_391D1UpXeDgssf4jVbYGgGFZcMSv` |
| `readyState` | **READY** (ready ~15:42:51Z) |
| Target / alias | production → `factory-developer-os.vercel.app` |
| Commit | `5ea96a05c3f7e763b5d31b0b252813fb1d932052` on `main` |
| Message | `feat(developer-os): Code Atlas four-overlay read projection (STL-154) (#51)` |

Confirmed via Vercel MCP `list_deployments` / `get_deployment` (team `johnnyc`).

## 2. Direct BFF smoke (curl)

| Check | Result |
|-------|--------|
| `GET /api/atlas/tools` | **200** — lists five tools: `atlas.find_node`, `atlas.expand_dependencies`, `atlas.get_task_impact`, `atlas.get_related_sessions`, `atlas.get_agent_traces`; `binding=port-mcp-read-projection`; `langfuseLiveOwner=false` |
| `POST` `atlas.find_node` `{query:"bead"}` | **200** `ok:true` — matches `beads:factory-stl154`, `beads:factory-stl151`; redactions present |
| `POST` `atlas.get_agent_traces` `{sessionId, asLiveOwner:true}` | **422** `ok:false` `code=langfuse_not_live_owner` — "Langfuse is historical observability only; Rivet owns live sessions" |

## 3. Port trigger_run (EU MCP)

| Workflow | Run | Outcome |
|----------|-----|---------|
| `atlas_find_node` | `wfr_QrlIgQVeLNMOzv0z` | **SUCCESS** — WEBHOOK invoke 200; same two bead matches as curl |
| `atlas_get_agent_traces` (`asLiveOwner=true`) | `wfr_pHlfOv9KNC4g44zQ` | Workflow **FAILED** (expected) — invoke HTTP 422 body `langfuse_not_live_owner` |

Five `atlas_*` self-service triggers still listed; no schema upserts this tick.

## Verdict

- **find_node:** works (curl + Port).
- **get_agent_traces asLiveOwner:** correctly refused (`langfuse_not_live_owner`).
- **Gap:** none for documented smoke path. Port workflow IDs remain underscore (`atlas_find_node`); logical OpenMCP names stay dotted (`atlas.find_node`).

---

## Johnny 3-line report

- **Verified:** Prod READY deploy of #51 (`5ea96a05…`); `GET/POST` `/api/atlas/tools` live; Port `atlas_find_node` SUCCESS; `atlas_get_agent_traces(asLiveOwner=true)` refused `langfuse_not_live_owner` (curl 422 + Port FAILED).
- **Next:** None required for BFF smoke — Atlas read projection + Port bind path is green; optional operator-role / expand / impact / sessions depth later.
- **Blockers:** None. No Port schema changes; no Observatory.
