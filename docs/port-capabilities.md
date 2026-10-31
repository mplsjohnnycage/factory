# Port capabilities for Factory

**Status:** Capability verification (docs + live workspace read)  
**Date:** 2026-10-28  
**Sources:** Context7 `/websites/port_io`; live Port MCP (org `mplsjohnnycage`, read-only)  
**Decision applied:** Clerk is out of scope — Port covers auth; Port is the main backend for the external client.

---

## 1. Verdict

Port can own **identity (OAuth / SSO), authorization (RBAC + blueprint permissions), catalog, self-service / workflow approvals, MCP gateway, audit, and the governed action surface** that both humans and agents use. That matches Johnny’s decision: the external Factory client authenticates and authorizes through Port; Clerk is not required for Factory v1.

Port does **not** replace Rivet (durable execution), Beads (task readiness), Sandbox Agent (coding harness), or GitHub (independent CI evidence).

---

## 2. Capability inventory (docs)

| Capability | What Port provides | Factory relevance | Docs (Context7) |
|------------|--------------------|-------------------|-----------------|
| **External Interfaces + OAuth** | Custom hosted frontend; “Sign in with Port” (OAuth 2.0 auth code); SSO if org-configured; access token scoped to the signed-in person; same roles/permissions as Port UI | **Primary auth for Developer OS / external client** — replaces Clerk | [External interfaces](https://docs.port.io/interface-builder/external-interfaces) |
| **Org credentials vs person OAuth** | Client ID/secret → org-scoped access token; OAuth app → person-scoped token | Interactive UI = OAuth app; unattended runners = machine / org credentials | Same |
| **Catalog (blueprints + entities)** | Typed software catalog, relations, scorecards, ownership | Factory products, services, contracts, runs, bots, MCP servers | Context Lake / data model |
| **Permissions (catalog RBAC)** | Per-blueprint `read` / `register` / `unregister` / `update` / property & relation scopes for users and teams | Project isolation; deny cross-project entity access | [Govern data access](https://docs.port.io/context-lake/consuming-the-lake/govern-data-access/overview) |
| **Self-service actions & workflows** | Triggers, inputs, validations, webhook / upsert nodes, expose as MCP tools | Governed Factory commands (`factory.*`, provision, release) | [Expose workflows as tools](https://docs.port.io/workflows/expose-as-tool) |
| **Approvals** | Manual / role / dynamic policy approvers on actions and workflow INPUT nodes | Side-effect gates (PR, sandbox write, release) | [Self-service RBAC / approvals](https://docs.port.io/workflows/actions-and-automations/create-self-service-experiences/set-self-service-actions-rbac/dynamic-permissions/examples) |
| **MCP server (Port → agents)** | Built-in AI and external MCP clients share the same tool surface; workflows auto-exposed as tools | Same contract for UI agent and external MCP agent | [Port MCP server](https://docs.port.io/agent-management/port-mcp-server/available-tools); [Expose as tool](https://docs.port.io/workflows/expose-as-tool) |
| **MCP connectors (gateway)** | Route to external MCP servers with Port RBAC + audit | Governed access to Linear/Vercel/etc. tools | [MCP connectors](https://docs.port.io/agent-management/ai-registry/mcp-connectors) |
| **Machine-user policy** | Workflow permissions can require `user.type = machine` | Unattended Factory / Rivet runners | [Expose as tool — permissions](https://docs.port.io/workflows/expose-as-tool) |
| **Interactive vs automation MCP** | Agent MCP connectors work in interactive chat; workflow / `AI_AGENT` nodes need separate connector auth path | Spec must keep an explicit machine-identity path | Custom agents / MCP connectors docs |
| **Plugins / iframes** | Embed apps; Plugin SDK; SSO for protected embeds | Optional Port-dashboard UX; not required for kernel | Embedded URL / plugins docs |
| **Audit** | Audit log search (MCP: `search_audit_logs`) | Compliance trail for approvals and mutations | Port MCP |
| **Integrations** | Ocean / SaaS sync (GitHub, Linear, custom) | Catalog projections of repos, PRs, deploys | Live integrations below |

---

## 3. Live workspace snapshot (Port MCP, read-only)

**Org:** `mplsjohnnycage` (account `makeithappenentllc.com`, plan **FREEMIUM**)  
**Connected user:** Johnny Cage — Admin + Member; team `Agentic SDLC`  
**Notable feature flags:** `AI_ELIGIBLE`, `WORKFLOWS_BLUEPRINTS`, `LAKEHOUSE_ELIGIBLE`, `PROVISION_ENGINEERING_INTELLIGENCE`, classic actions disabled

### 3.1 External interface apps (auth for custom UIs)

**Live org state (Port MCP `list_external_interface_apps`, 2026-10-29):** only **Factory** is registered. Canonical ids/redirects: [`port-factory-oauth-live.md`](./port-factory-oauth-live.md). Org plan **FREEMIUM**; External Interface OAuth registration limit is **1**.

| App | Live? | Notes |
|-----|-------|-------|
| **Factory** | Yes | Dedicated app (ADR-005 live). App id `iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug`; client id in live doc. |
| **Harness Observatory** | No | **Revoked** 2026-10-29 (Johnny-authorized). Former id `stflVc7sZJXf6FelDkUFFhcKnoaxP6QP`. |

**Ops status:** Johnny authorized Meta ops 2026-10-29: revoke Observatory → create Factory. See [`port-factory-oauth-live.md`](./port-factory-oauth-live.md).

**Earlier create attempt (2026-10-28, pre-authorization):** `upsert_external_interface_app` name `Factory` + localhost redirects failed with *“The OAuth app registrations limit (1) has been reached for this organization.”* Later FE-14 abort left Observatory untouched until this live cutover.

Docs: [External interfaces](https://docs.port.io/interface-builder/external-interfaces), [Manage OAuth apps](https://docs.port.io/platform-administration/sso-authentication/manage-your-oauth-apps).

### 3.2 Integrations

| Identifier | Type | Last resync |
|------------|------|-------------|
| `github-ocean` | GitHub Ocean (OAuth2) | 2026-10-28 |
| `factory-pilot-github` | GitHub Ocean (OAuth2) | 2026-10-28 |
| `linear` | Linear | 2026-10-28 |
| `vercel-ocean` | custom | 2026-10-28 |
| `convex-ocean` | custom | 2026-10-28 |

### 3.3 Factory-relevant blueprints (subset)

Already modeled in this org (not theoretical):

| Blueprint | Role for Factory |
|-----------|------------------|
| `product`, `service`, `stackTemplate`, `provider` | Catalog of what Factory builds |
| `executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner` | Governed delivery / lease / evidence (Port-side) |
| `bot`, `bot_decision`, `bot_hire_proposal`, `_ai_agent`, `_mcp_server`, `agentPlugin`, `skill` | Agent registry + MCP catalog |
| `harness_session`, `harness_snapshot` | Observability of coding harnesses |
| `githubRepository`, `githubPullRequest`, `githubWorkflowRun`, `deployment`, `vercelProject`, `convex*` | Mirrored provider truth |
| `_user`, `_team`, `_workflow` | Identity / team / workflow catalog |

### 3.4 Factory workflows already exposed as self-service / MCP tools

Software Factory (typed tools): `factory_create_execution_contract`, `factory_start_delivery_run`, `factory_claim_next_job`, `factory_heartbeat`, `factory_submit_evidence`, `factory_record_review_verdict`, `factory_request_release` (Johnny-only approval on release).

Also: provision stacks, GitHub/Linear/Vercel/Convex/Sprite self-service actions, prospect pipeline stubs — many LIVE, some NEEDS HANDLER.

**Implication:** Port is already acting as governance + catalog + approval backend for Factory delivery; Rivet should attach as the durable coding/runtime kernel behind these contracts, not invent a parallel auth or action registry.

### 3.5 Known Port limitation (from live workflow copy)

`factory_claim_next_job` documents: Port upserts have **no compare-and-swap** — concurrent claims can race. Serialize dispatch until a transactional lease exists (Rivet `WorkAttempt` / single dispatcher is the right place for that fencing).

---

## 4. Map to Factory needs

| Factory need | Port covers? | How | Still needed elsewhere |
|--------------|--------------|-----|------------------------|
| User sign-in for external client | **Yes** | External Interface OAuth (+ SSO) | Thin Next.js shell only |
| Session / identity store (Clerk) | **No — not needed** | Port token is identity | — |
| Authorization of actions | **Yes** | Action/workflow RBAC + catalog permissions | Enforce on every Rivet command |
| Catalog of products/tools/agents | **Yes** | Blueprints + entities | Provider systems remain SoT for bytes |
| Approvals for side effects | **Yes** | Workflow INPUT / approve policies | Rivet must refuse without valid Port approval |
| MCP for internal + external agents | **Yes** | Port MCP + expose workflows | Machine identity for unattended path |
| MCP gateway to third-party tools | **Yes** | MCP connectors | Connector auth differs interactive vs workflow |
| Audit / receipts of governed runs | **Mostly** | Workflow runs + audit logs | Optional Turso only if Port run history proven insufficient |
| Durable actor/session recovery | **No** | — | **Rivet** |
| Task ready / dependency graph | **No** (catalog can mirror status) | — | **Beads** |
| Multi-repo coding handoffs | **No** | — | **Polygraph** |
| Coding harness process / PTY | **No** | — | **Sandbox Agent** |
| Independent “accepted” evidence | **Partial** (records SHA / verdict) | `factory_submit_evidence`, review verdict | **GitHub CI** remains independent accept authority |
| Live UI streaming | **No** | — | **Rivet realtime** (+ UI client) |

---

## 5. Auth model for Factory (post–Clerk decision)

```text
Human (Developer OS)
  → Port OAuth via dedicated External Interface app "Factory"
    → person-scoped token (PKCE public client)
      → Port API / workflows / MCP tools
        → Factory thin API / Rivet gateway (verifies Port identity server-side)
          → Rivet actors

Machine / unattended / headless agent
  → Port machine user or org credentials (+ policy user.type=machine where required)
    → same Port action / MCP surface
      → Rivet WorkAttempt under Port authorization receipt
```

**Rules:**

1. Do not trust `principal` in request bodies — derive identity from verified Port token / machine credential.
2. Interactive OAuth (dedicated **Factory** External Interface app) ≠ automation MCP connector / machine credential auth; keep both paths explicit.
3. **Do not** reuse **Harness Observatory** (or any other product’s OAuth app) for Factory humans or agents.
4. UI / AG-UI / websockets remain display channels; privileged control stays Port → Rivet.

---

## 6. Gaps & contradictions vs prior “retain Clerk” assumption

| Prior assumption (evaluation / earlier spec) | Updated position |
|----------------------------------------------|------------------|
| Retain Clerk until a tested migration | **Superseded.** Johnny: Clerk not needed; Port covers auth. |
| Clerk = app identity; Port = cross-provider governance | **Collapsed.** Port External Interfaces are app identity + governance. |
| Turso ledger + Clerk receipts for M0–M4 | **Clerk removed.** Turso remains optional until Port run/audit receipts are accepted as sufficient for approval binding — not a blocker for dropping Clerk. |
| Wire kernel into existing Clerk/Turso Next.js foundation | Prefer **Port OAuth via dedicated Factory External Interface app** as auth path; any legacy Clerk code is non-goal for Factory kernel v1. Do not reuse Harness Observatory. |

---

## 7. Gaps Factory still fills outside Port

1. **Rivet** — durable sessions, recovery, queues, capacity, sandbox leases, realtime.
2. **Beads** — ready work / dependency truth (Port may display; must not own readiness).
3. **Sandbox Agent + compute** — harness lifecycle and isolation.
4. **GitHub checks** — independent acceptance on exact SHA.
5. **Transactional lease CAS** — Port claim race; Rivet (or single dispatcher) must fence.
6. **Machine credentials ops** — confirm machine-user setup for unattended Factory actions (still an open Johnny decision).
7. **Factory External Interface OAuth app** — **live** ([`port-factory-oauth-live.md`](./port-factory-oauth-live.md)). Observatory revoked 2026-10-29. Add non-localhost redirects before preview/prod auth.

---

## 8. References

- Context7 library: `/websites/port_io`
- Live MCP tools used: `describe_user_details`, `list_blueprints`, `list_integrations`, `list_workflows`, `list_self_service_triggers`, `list_external_interface_apps`, `list_scorecards`; 2026-10-29: `revoke_external_interface_app` (Observatory) + `upsert_external_interface_app` (Factory) — see [`port-factory-oauth-live.md`](./port-factory-oauth-live.md)
- Engineering spec: [`rivet-engineering-spec.md`](./rivet-engineering-spec.md)
