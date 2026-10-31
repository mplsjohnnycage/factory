# Port atlas.* schema apply run

**Executed:** 2026-10-29T15:41–15:43Z  
**Approval:** Johnny APPROVED (2026-10-29 ~10:38 America/Chicago)  
**MCP:** Port-eu (`org_rNq4tjSc8DXL1ceL`)  
**Prep:** [#54](https://github.com/mplsjohnnycage/factory/pull/54) `docs/port/atlas-mcp-port-schema-prep.md`  
**Backup:** [`atlas-schema-backup.md`](./atlas-schema-backup.md)  
**Lane:** Meta · No Observatory · No PR merges

## Dry-run → backup

1. Confirmed prep on main from #54.
2. `list_workflows query=atlas` → empty (pre).
3. No atlas blueprints; no atlas skill; no Dev OS atlas `_mcp_server`.
4. Wrote pre-apply inventory to `docs/atlas-schema-backup.md`.
5. Probed live BFF: `GET/POST https://factory-developer-os.vercel.app/api/atlas/tools` → **404** (routes land with [#51](https://github.com/mplsjohnnycage/factory/pull/51) merge/deploy). Bind still points at stable URL per prep.

## Exact upserts

### Workflows (`upsert_workflow`) — all **created**

| Port identifier | Logical tool | WEBHOOK | versionIdentifier |
|-----------------|--------------|---------|-------------------|
| `atlas_find_node` | `atlas.find_node` | `POST https://factory-developer-os.vercel.app/api/atlas/tools` body `{tool, role, args.query}` | `wfv_eEVGnqM6qoSd3yl5` |
| `atlas_expand_dependencies` | `atlas.expand_dependencies` | same BFF; args `nodeId`, `depth` | `wfv_4GjtwMOmZ33SQP2c` |
| `atlas_get_task_impact` | `atlas.get_task_impact` | same BFF; args `taskId` | `wfv_fztPszF3SkkNhdAA` |
| `atlas_get_related_sessions` | `atlas.get_related_sessions` | same BFF; args `nodeId` | `wfv_qU3oaXHvmDwxFcSR` |
| `atlas_get_agent_traces` | `atlas.get_agent_traces` | same BFF; args `sessionId`, `asLiveOwner` | `wfv_37wyINsup680AdjY` |

**Shape (each):** `SELF_SERVE_TRIGGER` (published, Member) → single `WEBHOOK` invoke. **No** `UPSERT_ENTITY`. **No** approval INPUT. Category `Code Atlas`.

**ID note:** Port workflow identifiers disallow `.`. OpenMCP/`atlas.*` names stay logical; Port MCP / self-service tools use underscore IDs.

### Entities (`upsert_entity`)

| Blueprint | Identifier | Key fields |
|-----------|------------|------------|
| `_mcp_server` | `factory-devos-atlas-bff` | `url=https://factory-developer-os.vercel.app/api/atlas/tools`, `exposed=false`, `allowed_tools=["atlas\\..*","atlas_.*"]` |
| `skill` | `factory-code-atlas-read-projection` | `status=active`, `category=code-atlas`, `provider=factory-developer-os`, link → BFF |

### Explicit non-touches

- No new blueprints
- No factory_* workflow changes
- No Ocean / OAuth / Observatory
- No PR merges (#51/#52/#53/#54 left to siblings)
- `_mcp_server.exposed` left **false** (REST BFF ≠ Streamable MCP connector)

## Verify (post-apply)

```text
list_workflows query=atlas     → 5 identifiers (all atlas_*)
list_self_service_triggers     → includes all 5 atlas_* triggers
list_entities _mcp_server      → factory-devos-atlas-bff (exposed=false)
list_entities skill            → factory-code-atlas-read-projection (active)
get_workflow atlas_find_node   → trigger → invoke WEBHOOK to Dev OS BFF
```

**BFF smoke (blocked until #51 deploys):** live `/api/atlas/tools` still 404. After #51 production deploy, smoke:

1. `GET /api/atlas/tools` lists five tools  
2. `POST` `atlas.find_node` with `{"query":"bead"}`  
3. `POST` `atlas.get_agent_traces` with `{"asLiveOwner":true}` → refused (`langfuse_not_live_owner`)

## Rollback

1. Port MCP EU `delete_workflow` for each:
   - `atlas_find_node`
   - `atlas_expand_dependencies`
   - `atlas_get_task_impact`
   - `atlas_get_related_sessions`
   - `atlas_get_agent_traces`
2. `delete_entity` `_mcp_server` / `factory-devos-atlas-bff`
3. `delete_entity` `skill` / `factory-code-atlas-read-projection`
4. Confirm `list_workflows query=atlas` → empty; entities gone.
5. Repo OpenMCP advertise (`atlas.*` in `.well-known/openmcp.json`) is #51-only — revert there separately if needed. Disabling Port bind does not break Dev OS shell.

Pre-state inventory: [`atlas-schema-backup.md`](./atlas-schema-backup.md).

---

## Johnny 3-line report

- **Applied/verified:** 5 read-only `atlas_*` Port EU workflows + `_mcp_server`/`skill` catalog pointers; self-service triggers present; no catalog writes; backup + rollback recorded.
- **Next:** Merge/deploy [#51](https://github.com/mplsjohnnycage/factory/pull/51) so stable Dev OS `/api/atlas/tools` stops 404; then smoke find_node + get_agent_traces(asLiveOwner refused).
- **Blockers:** Live BFF routes absent until #51; Port tool IDs are underscore (`atlas_find_node`) not dotted `atlas.find_node` (Port ID charset).
