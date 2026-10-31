# Port full capacity map

**Status:** Docs-only capability map + live org read (read-only)  
**Date:** 2026-10-28  
**Sources:** Context7 `/websites/port_io`; [docs.port.io/llms.txt](https://docs.port.io/llms.txt) and linked official pages; live Port MCP against org `mplsjohnnycage` (no mutations)  
**Companion:** [port-factory-data-model.md](./port-factory-data-model.md) (Factory catalog → native Port primitives)  
**Does not edit:** `factory-master-spec.md`

Label legend:

| Label | Meaning |
|-------|---------|
| **Official docs** | Claim from Port docs / Context7 / API reference |
| **Observed** | Fact from live Port MCP on this org only |
| **ASSUMPTION** | Factory fit beyond what docs assert — not a product claim |

No Port mutations in this work. Observatory External Interface OAuth left intact.

---

## 0. Product framing (docs)

Port documents itself as the platform for an **AI software factory**: one governed layer where humans and AI agents build, govern, and operate the agentic SDLC. API bases: EU `https://api.port.io`, US `https://api.us.port.io`. ([llms.txt](https://docs.port.io/llms.txt))

Six pillars: context lake, workflows, Port AI, agent management, interface builder, governance. ([The pillars of an AI software factory](https://docs.port.io/getting-started/agentic-sdlc-pillars))

Ingestion into the Context Lake: native integrations, MCP connectors, APIs, webhooks, custom integrations. ([Ingestion overview](https://docs.port.io/context-lake/ingestion/overview))

---

## 1. External Interfaces OAuth

### Official docs say

- External Interfaces are custom apps hosted outside Port that use **Sign in with Port** (OAuth 2.0 authorization code). The access token is **person-scoped**; calls run with that person’s roles and permissions. An OAuth app belongs to one organization and cannot cross orgs. ([External interfaces](https://docs.port.io/interface-builder/external-interfaces))
- OAuth apps ≠ org Credentials client ID/secret (org-scoped access token). ([External interfaces](https://docs.port.io/interface-builder/external-interfaces))
- Create / list / update / revoke via UI or Port MCP: `list_external_interface_apps`, `upsert_external_interface_app`, `revoke_external_interface_app` (admin). Revoking permanently removes the registration and revokes signed-in access. ([Manage your OAuth apps](https://docs.port.io/platform-administration/sso-authentication/manage-your-oauth-apps))
- **No client secret** on External Interface OAuth apps (public PKCE-style clients). ([Manage your OAuth apps](https://docs.port.io/platform-administration/sso-authentication/manage-your-oauth-apps))
- **Redirect URI rules:** 1–5 URIs per app; max 2048 chars; `https://` required except `http://` for `localhost` / `127.0.0.1`; no wildcards, fragments, or custom schemes; update replaces the whole set; exact match including trailing slash. CORS allowed from registered redirect origins (propagation ~30s). ([Manage your OAuth apps](https://docs.port.io/platform-administration/sso-authentication/manage-your-oauth-apps); [External interfaces](https://docs.port.io/interface-builder/external-interfaces))
- **Plan-dependent app count:** “The number of OAuth apps you can create depends on your organization's plan.” Docs do **not** publish the freemium numeric cap. ([Manage your OAuth apps](https://docs.port.io/platform-administration/sso-authentication/manage-your-oauth-apps))

### API / MCP surface

| Surface | Role |
|---------|------|
| MCP `list_external_interface_apps` | Read apps |
| MCP `upsert_external_interface_app` | Create/update (admin) — **not used this run** |
| MCP `revoke_external_interface_app` | Revoke (admin) — **not used this run** |

### Limits

| Limit | Source |
|-------|--------|
| Redirect URIs: 1–5, exact match, scheme rules above | Official docs |
| App count by plan | Official docs (number unspecified) |
| **Observed freemium cap = 1** | Live: earlier same-day create of a second app returned *“The OAuth app registrations limit (1) has been reached for this organization.”* Org plan **FREEMIUM** via `describe_user_details` |

### Observed (live org, 2026-10-28)

| Field | Value |
|-------|-------|
| Plan | `FREEMIUM` (org + account) |
| Apps | **1:** `Harness Observatory` (`clientId` present; redirect `https://harness-observatory.vercel.app/api/auth/callback`) |
| Factory app | **Not registered** |
| Mutations this run | **None** |

### Factory fit

- **ASSUMPTION:** Factory’s external client needs its own External Interface app (or shared Observatory redirects expanded carefully). On FREEMIUM, a second app requires plan change or revoking Observatory — ops not authorized here.
- Person-scoped OAuth covers interactive UI auth; unattended runners use org credentials / machine MCP auth separately (docs).

---

## 2. Catalog — blueprints, entities, RBAC

### Official docs say

- **Blueprint** = schema for a catalog concept; **entity** = instance. Meta: `identifier`, `title`, `team`, `blueprint`, `properties`, `relations`. ([Ingestion overview](https://docs.port.io/context-lake/ingestion/overview); [Set up blueprints](https://docs.port.io/context-lake/data-model/setup-blueprint/overview))
- Property types: `string`, `number`, `boolean`, `object`, `array`; string formats include `url`, `email`, `markdown`, `yaml`, `user`, `team`, `date-time`, `timer`, `proto`, `labeled-url`, etc. Plus mirror, calculation, aggregation properties; relations (target blueprint, `many`, `required`); ownership. ([Properties](https://docs.port.io/context-lake/data-model/setup-blueprint/properties/overview); Context7 `/websites/port_io` blueprint schema; [Create a blueprint](https://docs.port.io/api-reference/create-a-blueprint))
- **Catalog RBAC:** per-blueprint entity ops `read` / `register` / `update` / `unregister`; property/relation scopes (`updateProperties`, `updateRelations`, `readProperties`); users, teams, roles, `ownedByTeam`, dynamic `policy`. Admins + blueprint moderators manage blueprint structure/permissions. ([Govern data access](https://docs.port.io/context-lake/consuming-the-lake/govern-data-access/overview); [Update blueprint permissions](https://docs.port.io/api-reference/update-a-blueprints-permissions))
- Search/query for pages, dashboards, scorecards, RBAC, actions. ([API access & search](https://docs.port.io/context-lake/consuming-the-lake/search-and-query/overview))

### API / MCP surface

`list_blueprints`, `list_entities`, `get_blueprint_permissions`, entity create/update APIs, Terraform/Pulumi blueprint + permissions resources.

### Limits

- Docs do not publish freemium blueprint/entity caps in the pages retrieved for this map. Port AI has separate [limits and quotas](https://docs.port.io/port-ai/limits-and-quotas) (AI-specific, not catalog caps).
- **Observed:** live workflow copy on `agentInvocation` references a **10k entity** practical cap for successful run rollups (org modeling note — not a published freemium SLAs page). Treat as **Observed org design**, not official plan docs.

### Observed blueprints (subset — Factory-relevant)

Full list via `list_blueprints`. Includes: `product`, `service`, `stackTemplate`, `provider`, `executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner`, `bot`, `bot_decision`, `bot_hire_proposal`, `_ai_agent`, `_mcp_server`, `agentPlugin`, `skill`, GitHub/Linear/Vercel/Convex mirrors, prospect pipeline, Paperclip*, scorecard system blueprints (`_scorecard`, `_rule`, …), `_user`, `_team`, `_workflow`.

### Factory fit

Port’s catalog is the documented place to **persist** Factory semantic objects (see companion data-model doc). RBAC + ownership are the native isolation tools. **ASSUMPTION:** Factory project isolation = blueprint permissions + `ownedByTeam` / policies, not a separate multi-tenant Port product.

---

## 3. Self-service workflows and approvals — execution, webhook targets

### Official docs say

- Self-service workflows: forms, validations, multi-step nodes, exposed as MCP tools. Prefer workflows over legacy actions. ([Expose workflows as tools](https://docs.port.io/workflows/expose-as-tool); [Self-service actions](https://docs.port.io/workflows/actions-and-automations/create-self-service-experiences))
- Discovery/execution for agents: `list_self_service_triggers` → `trigger_run`. ([Expose workflows as tools](https://docs.port.io/workflows/expose-as-tool))
- **Approvals / human gates:** INPUT nodes for approvals and decisions; only configured responders may submit (`submit_input_node_response`). ([Input nodes](https://docs.port.io/workflows/build-workflows/nodes/flow-nodes/input); MCP available-tools)
- Action/workflow RBAC + dynamic permissions (ownership, manager approval, etc.). ([Set actions RBAC](https://docs.port.io/workflows/actions-and-automations/create-self-service-experiences/set-self-service-actions-rbac))
- **Backends / targets:** `WEBHOOK`, `GITHUB`, `INTEGRATION_ACTION` (incl. GitHub Ocean), `GITLAB`, `KAFKA`, `UPSERT_ENTITY`, Slack, Jenkins, Azure, etc. ([Backend types](https://docs.port.io/workflows/actions-and-automations/setup-backend); [Supported backends](https://docs.port.io/workflows/actions-and-automations/define-automations/setup-action))
- **Webhook node:** sync (`synchronized: true`) waits up to **10 seconds** then times out; async path uses Port API callback pattern (docs). ([Webhook action node](https://docs.port.io/workflows/build-workflows/nodes/action-nodes/webhook))
- **Upsert entity:** create-or-update by identifier; **no compare-and-swap / version precondition** documented. ([Upsert entity](https://docs.port.io/workflows/build-workflows/nodes/action-nodes/upsert-entity))
- Secret user inputs: encrypt before backend; Port never logs/stores plaintext; Port-managed `aes256-gcm` or client-side RSA. ([Secret](https://docs.port.io/workflows/actions-and-automations/create-self-service-experiences/setup-ui-for-action/user-inputs/secret))

### API / MCP surface

`list_workflows`, `list_self_service_triggers`, `trigger_run`, `get_run` / `get_workflow_run`, `submit_input_node_response`, `list_runs`, action permission tools.

### Observed (live)

Factory category workflows include: `factory_create_execution_contract`, `factory_start_delivery_run`, `factory_claim_next_job`, `factory_heartbeat`, `factory_submit_evidence`, `factory_record_review_verdict`, `factory_request_release` (Johnny-only INPUT approval). Plus provision stacks, GitHub/Linear/Vercel/Convex/Sprite self-service, prospect stubs (several **NEEDS HANDLER**).

`factory_claim_next_job` description (**Observed**): Port upserts have no CAS — serialize claims.

Org setting **Observed:** `disableClassicActions: true`; feature flags include `WORKFLOWS_BLUEPRINTS`, `AI_ELIGIBLE`, `LAKEHOUSE_ELIGIBLE`.

### Factory fit

Port = governed command surface + catalog writes + approval gates. External durable execution (e.g. Rivet) attaches via **WEBHOOK** / Ocean actions — **ASSUMPTION** for Rivet specifically (docs do not name Rivet).

---

## 4. MCP gateway — agents/humans connect, tool exposure, scoping

### Official docs say

**Port MCP server (into Port):**

- Agents/IDEs connect; tools depend on role (Developer vs Builder). Catalog, workflows, audit, integrations, External Interfaces, etc. ([Available tools](https://docs.port.io/agent-management/port-mcp-server/available-tools); [Installation](https://docs.port.io/agent-management/port-mcp-server/installation))
- Auth: interactive OAuth and **machine** client-credentials. ([Token-based authentication](https://docs.port.io/agent-management/port-mcp-server/token-based-authentication))
- Every self-service workflow auto-exposed as a tool via `list_self_service_triggers` / `trigger_run`. Permissions can restrict by user and `user.type = machine`. ([Expose workflows as tools](https://docs.port.io/workflows/expose-as-tool))

**MCP connectors (Port as gateway out):**

- Route to external MCP servers with governance, RBAC, audit; configure allowed tools. ([MCP connectors](https://docs.port.io/agent-management/mcp-connectors))
- Interactive chat: per-user connector auth. Workflow / `AI` nodes: need **organization-level** OAuth / client credentials — per-user OAuth connectors are not the workflow path. ([Use MCP connectors in workflows](https://docs.port.io/agent-management/mcp-connectors/use-in-workflows); custom agents docs via Context7)
- Tool scoping via regex / explicit tool lists (`tools` on AI invoke / workflow AI nodes). ([Tools and approvals](https://docs.port.io/port-ai/tools-and-approvals))
- API: `GET /v1/mcp/user/servers` (`includeTools`, `agentIdentifier` filters `allowedTools`). ([Get MCP servers for user](https://docs.port.io/api-reference/get-mcp-servers-for-user))

**Integrations vs MCP connectors:** integrations sync persistent entities; MCP connectors give AI live/on-demand access without necessarily persisting. Use both for tools like GitHub. ([Integrations vs. MCP connectors](https://docs.port.io/context-lake/ingestion/integrations-vs-mcp))

### Observed

This Cursor session’s Port MCP namespace exposes the live tool set used for read-only inventory (blueprints, workflows, integrations, external apps, scorecards, audit search, etc.).

### Factory fit

Single governed tool surface for UI agents and external MCP agents. **ASSUMPTION:** Factory “kernel” agents call Port MCP for catalog + workflows; side-effectful provider APIs go through Port workflows/connectors, not raw dual paths.

---

## 5. Audit — what it captures

### Official docs say

- **Entity audit logs:** `POST /v1/audit-logs/entities` with `filterQuery` fields: `status`, `operation`, `type`, `date`, `error`, `runId`, `installationId`, `webhookId`, `integrationId`, `action`, `scorecard`, `entity`, `blueprint`. Optional includes: `diff`, `context`, `trigger`, `status`, `message`. Scope `read:audit-log` for non-admins. Limit ≤ 1000. ([Search entity audit logs](https://docs.port.io/api-reference/search-entity-audit-logs))
- **General audit logs:** `GET /v1/audit-logs` — resources include `blueprint`, `entity`, `run`, `webhook`, `scorecard`, `action`, `integration` (integration experimental); actions `CREATE`/`UPDATE`/`DELETE`; origin (e.g. `UI`); includes `diff`, `context`, `trigger`, etc. ([Get audit logs](https://docs.port.io/api-reference/get-audit-logs/) via unified-services / Context7)
- MCP: `search_audit_logs`. ([Available tools](https://docs.port.io/agent-management/port-mcp-server/available-tools))
- MCP connectors apply Port audit controls on routed tool use. ([MCP connectors](https://docs.port.io/agent-management/mcp-connectors))
- Secret inputs are **not** logged/stored in plaintext. ([Secret](https://docs.port.io/workflows/actions-and-automations/create-self-service-experiences/setup-ui-for-action/user-inputs/secret))

### Factory fit

Compliance trail for catalog mutations, runs, webhooks, integrations. Pair with immutable domain audit blueprints (**Observed:** `bot_decision`) where business semantics need first-class entities.

---

## 6. Agent registry and skill registry

### Official docs say

These exist as **catalog + agent-management** patterns (not a separate non-catalog product):

| Registry | Docs path | Native primitives |
|----------|-----------|-------------------|
| AI agents | Agent management / `_ai_agent` entities; custom agents; MCP server relations + allowed tools | Blueprint entities, relations to `_mcp_server`, scorecards (e.g. readiness guides) |
| MCP servers | `_mcp_server`; [Manage MCP server registry](https://docs.port.io/guides/all/manage-mcp-registry); MCP connectors | Entities + workflows for request/approve/expose |
| Skills | [Setup skills registry](https://docs.port.io/guides/all/setup-skills-registry); GitHub Ocean `skill` kind; [Extend context lake](https://docs.port.io/context-lake/extend-the-context-lake) | `skill` blueprint entities; Ocean ingest from `SKILL.md` |
| Agent plugins | [Bundle skills into plugins](https://docs.port.io/guides/all/bundle-skills-into-plugins-in-your-org-registry) | `agentPlugin` blueprint + relations to `skill` / agents / MCP |

### Observed

Blueprints present: `_ai_agent`, `_mcp_server`, `skill`, `agentPlugin`, `bot` (external bots vs Port-native `_ai_agent`), `bot_hire_proposal`, `bot_decision`, `agentInvocation`, `agentDailySummary`, `_ai_invocations`, `_ai_conversation`, `_ai_plan`. Scorecard `agent_readiness` on `_ai_agent`.

### Factory fit

Personas / bots / skills / MCP catalog = **native blueprints + entities + relations + scorecards + workflows**. Custom only for domain properties/relations not in defaults — still Port-native catalog, not an external registry DB.

---

## 7. Context lake / metadata sync (GitHub, Linear, other)

### Official docs say

**GitHub (Ocean)** — supported resources include: Organization, Repository, Pull Request, Issue, File, Folder, Skill, Plugin, MCP, User, Team, Workflow, Workflow Run, Branch, Environment, Deployment, Deployment Status, Release, Tag, Dependabot/Code/Secret scanning alerts, Collaborator, Package. Live events + resync; incremental sync closed beta. ([GitHub Ocean](https://docs.port.io/context-lake/ingestion/ingest-data-into-port/native-integrations/available-integrations/git/github-ocean))

**Linear** — Team, Issue, Label, Document, User, Project, Initiative, Team member (resync only; no live events for that kind), Workflow state, Cycle. ([Linear](https://docs.port.io/context-lake/ingestion/ingest-data-into-port/native-integrations/available-integrations/project-management/linear))

**Other ingestion:** native plug-and-play catalog, custom Ocean, generic webhooks, CI push APIs, GitOps `port.yml`. ([Ingestion overview](https://docs.port.io/context-lake/ingestion/overview))

**Integrations vs MCP:** sync for persistence/governance; MCP for live depth. ([Integrations vs. MCP connectors](https://docs.port.io/context-lake/ingestion/integrations-vs-mcp))

### Observed integrations (`list_integrations`, 2026-10-28)

| Identifier | Type | Install | Last resync |
|------------|------|---------|-------------|
| `github-ocean` | `github-ocean` | SaasOAuth2 | completed |
| `factory-pilot-github` | `github-ocean` | SaasOAuth2 | completed |
| `linear` | `linear` | Saas | completed |
| `vercel-ocean` | `custom` | Saas | completed |
| `convex-ocean` | `custom` | Saas | completed |

### Sync plan (docs + observed — no mutations)

Priority order for Factory metadata that must **live in Port**:

1. **GitHub Ocean (keep both installs mapped deliberately)** — repos, PRs, issues, workflows/runs, deployments as entities related to `service` / `product`. Docs: native. Observed: two Ocean installs already. Prefer Ocean over ad-hoc API for continuous sync; use [GitHub MCP connector](https://docs.port.io/agent-management/mcp-connectors/github-mcp-connector) for diffs/live depth (**ASSUMPTION:** enable when AI review needs raw PR content).
2. **Linear** — teams, projects, issues, cycles, docs as catalog entities; relate to `product` / `service`. Docs: native. Observed: `linear` install live. Linear task-manager MCP eval is **out of scope** (separate worker); Port **housing** of Linear entities stays here.
3. **Vercel / Convex** — **Observed** as `custom` Ocean; stack audit lists Vercel/Convex as Factory deploy/backend. Docs path for custom Ocean when no first-party native. Keep mappings → `vercelProject`, `deployment`, `convexProject`, `convexDeployment`, `convexComponent`.
4. **Skills / MCP / plugins from git** — GitHub Ocean kinds `skill`, `MCP`, `Plugin` (docs) into `skill` / MCP catalog blueprints.
5. **Webhook / API push** — for Rivet/harness/runtime events not covered by Ocean (**ASSUMPTION** targets; docs support webhook + API ingest generally).
6. **Do not duplicate** Beads/Rivet durable state as Port’s execution engine — Port holds **contracts, evidence receipts, catalog projections**; engines remain external (**ASSUMPTION** split; docs: webhook backends, not embedded Rivet).

Detail and entity mapping: [port-factory-data-model.md](./port-factory-data-model.md) § sync.

---

## 8. Other Port primitives

| Primitive | Docs | Role |
|-----------|------|------|
| Scorecards + rules | Context lake / scorecards; MCP `list_scorecards` | Standards on entities (DORA, readiness) — **Observed** many on `service`, `_team`, `organization`, `_ai_agent`, `prospect` |
| Pages / dashboards / widgets | Interface builder | Human UX over catalog |
| Plugins / embedded URL | Interface builder | Embed external UIs (SSO options for embeds) |
| Automations | Catalog-event triggers | Event-driven actions |
| Port AI | Assistant, invoke API, tools/approvals, limits | Guided building + runtime AI |
| Port secrets | Platform administration | Encrypted org secrets for integrations/actions |
| Port CLI | Export/import/migrate/skills sync | Org as code |
| Lakehouse / EI flags | Product flags | **Observed** `LAKEHOUSE_ELIGIBLE`, `PROVISION_ENGINEERING_INTELLIGENCE` |
| n8n node | Consume lake externally | Automation without direct tool sprawl |

---

## 9. Cross-cutting limits & gaps (docs-backed)

| Gap | Evidence |
|-----|----------|
| Upsert has no CAS | Upsert docs describe create-or-update only; no version/If-Match. Observed claim-job warning. |
| Sync webhook ≤10s | Webhook node docs |
| OAuth app count plan-gated; freemium number not in docs | Manage OAuth apps; **Observed** limit 1 |
| Workflow MCP connectors need org-level auth | Use-in-workflows docs |
| Secret plaintext in non-secret inputs can leak into run payloads | Observed workflow `ss_vercel_set_env` description + Secret input docs (use encrypted secret inputs) |
| Port is not Rivet/Beads/GitHub CI | No docs claim; webhook/Ocean are the extension points |

---

## 10. Live org snapshot (read-only summary)

| Item | Observed |
|------|----------|
| Org | `mplsjohnnycage` / account `makeithappenentllc.com` |
| Plan | FREEMIUM |
| User | Johnny Cage — Admin + Member; team `Agentic SDLC` |
| External Interface apps | Harness Observatory only |
| Integrations | github-ocean, factory-pilot-github, linear, vercel-ocean, convex-ocean |
| Mutations this document run | **None** |

---

## 11. Section outline (this file)

0. Product framing  
1. External Interfaces OAuth  
2. Catalog / RBAC  
3. Workflows & approvals / webhooks  
4. MCP gateway  
5. Audit  
6. Agent & skill registries  
7. Context lake sync (+ plan)  
8. Other primitives  
9. Limits & gaps  
10. Live snapshot  

**Companion outline:** [port-factory-data-model.md](./port-factory-data-model.md) — Port houses everything; native mapping; security; gaps; sync plan detail.
