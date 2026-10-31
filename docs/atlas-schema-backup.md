# Port atlas.* schema backup (pre-apply)

**Captured:** 2026-10-29T15:41:00Z  
**Org:** Port EU (`org_rNq4tjSc8DXL1ceL`) via Port MCP **Port-eu**  
**Approval:** Johnny APPROVED atlas.* schema apply (2026-10-29 ~10:38 America/Chicago)  
**Prep source:** [#54](https://github.com/mplsjohnnycage/factory/pull/54) `docs/port/atlas-mcp-port-schema-prep.md` (merged)  
**Lane:** Meta · No Observatory

## Dry-run summary (before apply)

| Check | Result |
|-------|--------|
| Prep doc present on main | Yes — `docs/port/atlas-mcp-port-schema-prep.md` |
| Existing Port workflows matching `atlas` | **None** (`list_workflows query=atlas` → empty) |
| Existing blueprints named atlas* | **None** (`list_blueprints` identifiers atlas*/codeAtlas → empty) |
| Skill entities matching atlas | **None** |
| `_mcp_server` for Dev OS atlas BFF | **Absent** (13 MCP server entities; none point at factory-developer-os) |
| Live Dev OS `/api/atlas/tools` | **404** on `https://factory-developer-os.vercel.app` — routes ship in open [#51](https://github.com/mplsjohnnycage/factory/pull/51); bind points at stable URL anyway |

## Pre-apply: atlas-related state

```text
list_workflows query=atlas        → []
list_blueprints [atlas…]          → []
skill query atlas                 → []
_mcp_server factory-devos-atlas*  → absent
```

## Pre-apply: `_mcp_server` inventory (identifiers only)

```text
port-eu-mcp
mcp-tinyfish
mcp-tldraw
mcp-cloudflare
mcp-remote-desktop-commander
mcp-figma
mcp-firecrawl
mcp-linear
mcp-mem0
mcp-port-us
mcp-vercel
mcp-higgsfield
mcp-stitch
```

Only `port-eu-mcp` is `exposed: true`. Others are metadata (`exposed: false`).

## Pre-apply: blueprint catalog snapshot (identifiers)

```text
_ai_agent, _ai_conversation, _ai_invocations, _ai_plan, _mcp_server, _rule,
_rule_result, _scorecard, _team, _user, _workflow, agentDailySummary,
agentInvocation, agentPlugin, bot, bot_decision, bot_hire_proposal,
convexComponent, convexDeployment, convexProject, deliveryRun, deployment,
environment, executionAttempt, executionContract, executionRunner,
githubIssue, githubOrganization, githubPullRequest, githubRepository,
githubTeam, githubUser, githubWorkflow, githubWorkflowRun, harness_session,
harness_snapshot, linearCycle, linearDocument, linearIssue, linearLabel,
linearProject, linearTeam, linearUser, organization, product, prospect,
prospectCampaign, prospectEvidence, provider, service, shadcnComponent,
shadcnRegistry, skill, stackTemplate, supabaseProject, tursoDatabase,
vercelProject
```

No `atlas*` blueprint existed before apply. Apply does **not** create new blueprints (read-projection workflows + catalog pointers only; §4.2.1 catalog write fencing unchanged).

## Pre-apply: factory_* typed-tool workflows (unchanged by this apply)

```text
factory_create_execution_contract
factory_start_delivery_run
factory_claim_next_job
factory_heartbeat
factory_submit_evidence
factory_record_review_verdict
factory_request_release
```

## Intended apply (documented here for rollback pairing)

Port workflow identifiers **cannot contain `.`** (`^[A-Za-z0-9@_:-]+$`). Logical OpenMCP names `atlas.*` map to underscore workflow IDs:

| Logical tool (OpenMCP / BFF) | Port workflow identifier |
|------------------------------|--------------------------|
| `atlas.find_node` | `atlas_find_node` |
| `atlas.expand_dependencies` | `atlas_expand_dependencies` |
| `atlas.get_task_impact` | `atlas_get_task_impact` |
| `atlas.get_related_sessions` | `atlas_get_related_sessions` |
| `atlas.get_agent_traces` | `atlas_get_agent_traces` |

Plus catalog entities (new):

| Blueprint | Identifier |
|-----------|------------|
| `_mcp_server` | `factory-devos-atlas-bff` |
| `skill` | `factory-code-atlas-read-projection` |

## Rollback from this backup

1. `delete_workflow` for each `atlas_*` identifier above (if created).
2. `delete_entity` for `_mcp_server` / `factory-devos-atlas-bff` and `skill` / `factory-code-atlas-read-projection` (if created).
3. Do **not** recreate deleted factory_* or other blueprints — they were not modified.
4. OpenMCP advertise file is repo-only (#51); revert there separately if needed.

See also: [`atlas-schema-apply-run.md`](./atlas-schema-apply-run.md).
