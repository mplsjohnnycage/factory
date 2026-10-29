# Code Atlas BFF smoke (prod / local)

**Lane:** Meta · STL-154  
**Script:** `scripts/atlas-bff-smoke.mjs` → `npm run smoke:atlas-bff`  
**Default base:** `https://factory-developer-os.vercel.app`  
**Hard bans:** no Port schema upsert · no secrets · no Observatory · zero spend

## When to run

| Trigger | Command |
|---------|---------|
| After Vercel prod picks up an Atlas BFF SHA | `npm run smoke:atlas-bff` |
| Local Dev OS (`next dev` / preview) | `ATLAS_BFF_BASE=http://localhost:3000 npm run smoke:atlas-bff` |
| CI / offline plan only | `npm run smoke:atlas-bff -- --dry-run` |

Post-merge verify for [#58](https://github.com/mplsjohnnycage/factory/pull/58) (naming map + underscore alias + hardening) lands with the prod alias once deploy `READY` includes that SHA (or later).

## Checks (PASS criteria)

| # | Request | Expect |
|---|---------|--------|
| 1 | `GET /api/atlas/tools` | **200**; `tools[]` = five dotted `atlas.*` only; `naming.openmcp=dotted`; `langfuseLiveOwner=false` |
| 2 | `POST` `atlas.find_node` `{query:"bead"}` | **200** `ok:true`; response `tool` stays dotted |
| 3 | `POST` `atlas_find_node` (Port underscore alias) | **200** `ok:true`; response `tool=atlas.find_node` |
| 4 | `POST` `atlas.get_agent_traces` `asLiveOwner:true` | **422** `code=langfuse_not_live_owner` |

No Port mutations. Optional Port `trigger_run` of `atlas_find_node` / `atlas_get_agent_traces` is operator-side only (schema already applied; do **not** upsert from this doc).

## Naming reminder

| OpenMCP / BFF | Port workflow ID |
|---------------|------------------|
| `atlas.find_node` | `atlas_find_node` |
| `atlas.expand_dependencies` | `atlas_expand_dependencies` |
| `atlas.get_task_impact` | `atlas_get_task_impact` |
| `atlas.get_related_sessions` | `atlas_get_related_sessions` |
| `atlas.get_agent_traces` | `atlas_get_agent_traces` |

See [`docs/port/atlas-mcp-port-schema-prep.md`](../port/atlas-mcp-port-schema-prep.md) (APPLIED — no re-apply).

## Last cloud verify (2026-10-29)

| Field | Value |
|-------|-------|
| Prod alias | `factory-developer-os.vercel.app` |
| Deploy SHA on alias | `6a13680` (includes #58 + #59) |
| `npm run smoke:atlas-bff` | **PASSED** (all four checks) |
| Port schema | untouched |

## Related

- Spec: `specs/developer-os/spec.md` (STL-154)
- OpenMCP: `/.well-known/openmcp.json` (`factory.atlas_tools.map`)
- Dev OS README § Code Atlas
