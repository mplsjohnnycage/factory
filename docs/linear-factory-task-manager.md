# Linear as Factory task manager (docs evaluation)

**Status:** Docs-only evaluation (FE-29)  
**Date:** 2026-10-28  
**Scope:** Linear SDK, Linear MCP, MCP Apps (official docs), Port Linear catalog sync  
**Non-goals:** No Port mutations; no `factory-master-spec.md` edits; no live Linear writes

---

## Verdict (MCP-as-task-UI)

**Linear MCP is a strong agent task-management interface, not a human task UI.**

- **Agents / Factory runners:** Yes — use Linear’s hosted MCP (`https://mcp.linear.app/mcp`) as the primary tool surface to list/create/update issues, projects, comments, and related objects inside MCP-capable clients (Cursor, Claude, etc.).
- **Humans:** Use the native Linear product (web/desktop). MCP is not documented as a replacement UI for people.
- **MCP Apps (interactive widgets):** **Not documented** for Linear. Official Linear MCP docs describe authenticated remote tools only. The MCP Apps extension exists as a separate protocol (interactive iframes); Linear’s MCP page and changelog do not claim Apps support. Treat Linear MCP as **tools-only**, not an in-chat task board UI.
- **Factory pattern:** Linear = system of record for work; Linear MCP (+ optional `@linear/sdk`) = agent I/O; Port Ocean Linear integration = catalog mirror + optional Port workflow write-back actions. Humans stay in Linear (and Port for governed catalog/actions).

---

## 1. Linear SDK capabilities (task management)

Sources: Context7 `/websites/linear_app_developers` → [SDK](https://linear.app/developers/sdk), [Fetching & modifying data](https://linear.app/developers/sdk-fetching-and-modifying-data), [OAuth](https://linear.app/developers/oauth-2-0-authentication), [Agents](https://linear.app/developers/agents), [Agent interaction](https://linear.app/developers/agent-interaction).

| Area | What docs support | Factory relevance |
|------|-------------------|-------------------|
| **Client** | `@linear/sdk` `LinearClient` with `apiKey` or OAuth `accessToken` | Service / agent backends outside MCP hosts |
| **Issues** | `createIssue`, update via client or model methods; team-scoped create | Core task CRUD |
| **Comments** | `createComment` with success + entity payload | Progress / blocker updates |
| **Projects / archive** | List/create/archive patterns (`projects`, `archiveProject`) | Epics / workstreams |
| **Pagination** | Relay connections; `fetchNext` / `fetchPrevious`; `orderBy` | Bulk sync / agent sweeps |
| **Filtering** | GraphQL filters (state, project, estimate, etc.) | Queues, “started”, unestimated work |
| **OAuth scopes** | `read`, `write`, `issues:create`, `comments:create`, `timeSchedule:write`, `admin`; agent extras `app:assignable`, `app:mentionable` | Least-privilege agent installs |
| **Actor** | `actor=user` (default) vs `actor=app` (workspace app / agent) | App-as-agent vs user-impersonation |
| **Agent sessions** | `AgentSessionEvent` webhooks (`created`, `prompted`); `promptContext`; delegate ≠ assignee | Push-driven agent loops from Linear UI mentions/delegation |

SDK is the right layer when Factory needs webhooks, custom GraphQL, or non-MCP runtimes. MCP covers interactive agent clients without shipping a custom Linear client.

---

## 2. Linear MCP server — tools, auth, scope

Sources: [Linear MCP docs](https://linear.app/docs/mcp); live Linear MCP tool catalog in this session (~78 tools including `mcp_auth`).

### Hosting & transport

- Centrally hosted authenticated remote MCP (Streamable HTTP primary): `https://mcp.linear.app/mcp`
- Read-only: `https://mcp.linear.app/mcp/readonly`, or request only OAuth `read` on `/mcp`
- Legacy SSE: `https://mcp.linear.app/sse` (deprecated)
- Clients: Claude, Cursor, VS Code, Windsurf, Zed, Codex, Jules, v0; others via `npx mcp-remote https://mcp.linear.app/mcp`

### Auth

- Interactive: OAuth 2.1 with dynamic client registration
- Non-interactive: `Authorization: Bearer <token>` with OAuth access token or Linear API key (including app-user / restricted read-only keys)
- Multi-workspace: separate auth contexts (e.g. distinct `MCP_REMOTE_CONFIG_DIR`); reconnect alone does not switch workspace
- Enterprise: Okta-backed MCP enterprise-managed authentication (after SAML / OIN setup)

### Scope (what tools cover)

Documented intent: find / create / update Linear objects (issues, projects, comments), with more on the way.

Observed tool surface (session catalog), grouped for task management:

| Group | Tools (representative) |
|-------|------------------------|
| **Issues** | `list_issues`, `get_issue`, `save_issue`, `get_issue_status`, `list_issue_statuses`, `share_issue` / `unshare_issue` |
| **Projects / initiatives / milestones** | `list_projects`, `get_project`, `save_project`, `list_initiatives`, `save_initiative`, `list_milestones`, `save_milestone`, labels |
| **Comments / docs** | `list_comments`, `save_comment`, `delete_comment`, `list_documents`, `get_document`, `save_document` |
| **Org structure** | `list_teams`, `get_team`, `list_users`, `get_user`, `get_workspace`, `list_cycles` |
| **Attachments** | `prepare_attachment_upload`, `create_attachment_from_upload`, `get_attachment`, `delete_attachment`, … |
| **Releases / status / notifications** | `list_releases`, `save_release`, `get_status_updates`, `save_status_update`, `get_notifications`, … |
| **Diffs / review** | `list_diffs`, `get_diff`, `submit_diff_review`, … |
| **Agent skills / docs** | `list_agent_skills`, `get_agent_skill`, `search_documentation` |
| **Auth** | `mcp_auth` |

Documented example workflows: roadmap planning → project + issues; standup → comments; bug investigation → comment; cycle summary; topic timeline; implementation plan → parent + sub-issues + delegate.

**Gaps vs full SDK/agents API (docs-implied):** MCP is the hosted tool gateway; deep agent-session webhook loops and custom GraphQL still belong to the SDK / Agents API. MCP docs do not claim parity with every GraphQL mutation.

---

## 3. MCP Apps support for Linear

| Claim | Evidence |
|-------|----------|
| What is MCP Apps? | Separate MCP extension for interactive UIs (iframes, UI resources) rendered by hosts that advertise UI capabilities ([MCP Apps overview](https://apps.extensions.modelcontextprotocol.io/api/documents/overview.html)). Progressive enhancement: hosts without Apps still get text tools. |
| Do Linear official docs mention MCP Apps? | **No.** [linear.app/docs/mcp](https://linear.app/docs/mcp) describes tools for finding/creating/updating issues, projects, comments — no Apps/UI resource registration, no iframe widgets. Live web check of Linear MCP + changelog pages: no Apps claim. |
| Implication | Do not plan an in-chat Linear board/widget via Linear’s MCP. Human-facing task UI remains Linear’s product; agent-facing I/O remains MCP tools (and/or SDK). |

---

## 4. Could Linear MCP serve as task-management interface for Factory agents and humans?

| Actor | Fit | How |
|-------|-----|-----|
| **Factory agents (Cursor / MCP hosts)** | **Yes — primary** | Connect Linear MCP; use `list_issues` / `save_issue` / `save_comment` / projects as the work queue. Matches Linear’s own example prompts (plan → issues → delegate). |
| **Factory agents (non-MCP / Rivet workers)** | **Partial via MCP Bearer; better via SDK** | Docs allow Bearer API key/OAuth on MCP; Agents API + `actor=app` + session webhooks are the documented push model for mention/delegate. |
| **Humans** | **Native Linear UI, not MCP** | MCP is for AI clients. Humans create/triage/review in Linear; agents report via comments/status through MCP or app actor. |
| **Shared “task UI” myth** | **Reject** | MCP ≠ shared kanban UI. Shared system of record = Linear; dual interfaces = Linear app (humans) + MCP/SDK (agents). |

Factory-oriented split:

1. **Truth:** Linear issues/projects/cycles  
2. **Agent I/O:** Linear MCP in agent hosts; SDK/webhooks for autonomous runners  
3. **Governed catalog / portal:** Port (see §5) — mirror + optional Port-side actions, not a second task DB unless Factory explicitly chooses that

---

## 5. Linear ↔ Port catalog sync (Port docs only)

Sources: [Port Linear integration](https://docs.port.io/context-lake/ingestion/ingest-data-into-port/native-integrations/available-integrations/project-management/linear/); [Linear workflow actions](https://docs.port.io/workflows/build-workflows/nodes/action-nodes/integration-actions/project-management/linear/).

### Native ingest (catalog mirror)

Port’s Linear Ocean integration models and ingests:

| Linear kind | Port blueprint (default mapping) | Notes from Port docs |
|-------------|----------------------------------|----------------------|
| Team | `linearTeam` | Identifier often team **key** |
| Issue | `linearIssue` | Status, assignee email, priority, team/labels/parent relations |
| Label | `linearLabel` | Groups + children |
| Document | `linearDocument` | |
| User | `linearUser` | |
| Project | `linearProject` | |
| Initiative | `linearInitiative` | |
| Team member | `linearTeamMember` | **Resync only** — live events not supported for this kind |
| Workflow state | `linearWorkflowState` | |
| Cycle | `linearCycle` | |

**Auth to Linear (Port side):** Linear API key (`integration.secrets.linearApiKey` / `LINEAR_API_KEY` env variants) querying Linear GraphQL.

**Install modes (Port docs):** Hosted by Port (recommended — real-time + resync interval); self-hosted (Helm, `liveEvents.baseUrl`); CI one-shot (GitHub Actions / Jenkins / Azure DevOps / GitLab).

**Live events:** Supported for **Issue**, **IssueLabel**, **Document** (Port “Set up live events”). Other kinds rely on scheduled/manual resync. Without `liveEvents.baseUrl` (self-hosted), use `scheduledResyncInterval` or manual resync. Hosted-by-Port builds the live-events URL from integration `liveEventsUuid` + ingest hostname.

**Mapping:** Default YAML maps kinds → blueprints with JQ; `createMissingRelatedEntities` / `deleteDependentEntities` true by default; `initializePortResources` can create default blueprints + app config.

**Not invented here:** Port docs describe **ingest into Port** and **Port workflow actions that call Linear** (create/update/archive/delete issue, sub-issue, comment, reaction, document, delegate to agent). They do **not** document a bidirectional “Port entity is source of truth for Linear issues” sync. Catalog direction is Linear → Port; write-back is explicit Port → Linear actions, not automatic entity mirroring back.

### Port write-back (actions, not sync)

Documented `integrationInvocationType` values include: `create_issue`, `create_sub_issue`, `update_issue`, `delegate_issue_to_agent`, `archive_issue`, `delete_issue`, `add_issue_comment`, `add_reaction_to_issue`, `add_document`. Entity pickers should use synced blueprints (`linearTeam`, `linearIssue`, `linearWorkflowState`, …).

### Factory implication

- Install/configure Port’s Linear connector to keep `linearIssue` (etc.) in the software catalog for scorecards, ownership, and Port workflows.  
- Prefer **Linear MCP/SDK** for day-to-day agent task I/O; use **Port Linear actions** when the change must go through Port governance/MCP gateway.  
- Do not assume Port live events cover every kind (team membership is resync-only).

---

## Sources

| Source | Role |
|--------|------|
| Context7 `/websites/linear_app_developers` | SDK, OAuth, agents, pagination/filtering |
| https://linear.app/docs/mcp | Official MCP server docs |
| Live Linear MCP tool descriptors (this environment) | Concrete tool inventory |
| Context7 `/websites/apps_extensions_modelcontextprotocol_io_api` | MCP Apps definition (not Linear-specific) |
| Context web answers / scrape of Linear MCP | Confirmed no MCP Apps claim on Linear docs |
| https://docs.port.io/.../project-management/linear/ | Port Linear sync, blueprints, live events, mapping |
| https://docs.port.io/.../integration-actions/.../linear/ | Port → Linear workflow actions |

---

## Bottom line

Use **Linear as the Factory task system of record**, **Linear MCP as the agent task API inside MCP hosts**, and **Port’s native Linear integration as the catalog projection** (plus optional governed write-back). Do **not** treat Linear MCP as the human task UI or as an MCP Apps widget surface unless Linear publishes that later.
