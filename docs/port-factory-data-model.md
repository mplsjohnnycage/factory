# Factory data model in Port (native-first)

**Status:** Docs-only evaluation of housing the full Factory catalog in Port  
**Date:** 2026-10-28  
**Sources:** Context7 `/websites/port_io`; [docs.port.io/llms.txt](https://docs.port.io/llms.txt) + linked pages; live Port MCP read-only inventory (labeled **Observed**)  
**Companion capacity map:** [port-full-capacity.md](./port-full-capacity.md)  
**Canonical fencing (this doc §4.1 + master Spec):** [factory-master-spec.md](./factory-master-spec.md) §4.2 / §4.2.1  
**Parallel language (Rivet execution fence — different ownership):** [rivet-claim-fencing.md](./rivet-claim-fencing.md), [rivet-full-capacity.md](./rivet-full-capacity.md) §7  
**Out of scope:** Linear task-manager MCP product eval (separate worker). This doc covers **Port housing** of Linear-synced entities and native Linear Ocean sync only. No live Port mutations from this doc.

Label legend: **Official docs** | **Observed** | **ASSUMPTION** (Factory intent beyond docs).

---

## 1. Principle: Port houses everything (catalog)

**Official docs:** Port’s Context Lake is the persistent semantic layer: blueprints define types; entities hold instances; relations link them; scorecards/workflows/AI consume that graph. Ingestion (integrations, API, webhooks, custom Ocean) always lands as entities. ([Ingestion overview](https://docs.port.io/context-lake/ingestion/overview); [pillars](https://docs.port.io/getting-started/agentic-sdlc-pillars); [Integrations vs MCP](https://docs.port.io/context-lake/ingestion/integrations-vs-mcp))

**Factory requirement (stated for this evaluation):** Port holds the **full Factory catalog** — assembled modules, specs, build contracts, agent personas, build outputs, and related metadata — as first-class catalog data, preferring **native Port primitives** over side databases.

**Native primitive kit (docs):**

| Primitive | Use |
|-----------|-----|
| Blueprint | Type / schema |
| Entity | Instance |
| Properties (typed + formats) | Fields |
| Relations | Graph edges |
| Mirror / calculation / aggregation properties | Derived fields |
| Ownership / `$team` | Owning teams |
| Scorecards + rules | Quality gates on entities |
| Workflows + UPSERT_ENTITY / WEBHOOK / INTEGRATION_ACTION | Governed create/update + side effects |
| Automations | Event-driven updates |
| Integrations / webhooks / API | Sync into entities |
| `_ai_agent`, `_mcp_server`, `skill`, plugins (catalog patterns) | Agent/skill/MCP registries |
| Audit logs | Platform trail |
| RBAC on blueprints | Who can read/register/update/unregister / property scopes |

**Custom/extension** means: a new **org-defined blueprint or property/relation** still *inside* Port (still native catalog), vs a true **non-Port store**. Docs treat org-defined blueprints as the normal modeling path ([Set up blueprints](https://docs.port.io/context-lake/data-model/setup-blueprint/overview)). “Custom Ocean integration” is the documented path when no plug-and-play exists ([Custom integration](https://docs.port.io/context-lake/ingestion/ingest-data-into-port/custom-integration/overview)).

---

## 2. Proposed Factory catalog pieces → Port natives

For each piece: **what it is**, **native coverage**, **custom-in-Port only if needed**, **Observed** live blueprint if any.

### 2.1 Assembled modules (stack modules / composable building blocks)

| Aspect | Content |
|--------|---------|
| **Meaning** | Reusable modules that products assemble (UI kits, Convex components, auth/backend providers, MCP servers, skills wired into a service). |
| **Native** | Blueprints + entities + relations. **Observed** already: `stackTemplate`, `convexComponent`, `shadcnComponent`/`shadcnRegistry`, `provider`, `skill`, `_mcp_server`, `agentPlugin`; `service` relations to skills, MCP, components, providers, stack template. Provision workflows attach these on create (**Observed** `provision_composable_stack`). |
| **Custom-in-Port** | Only if a module type is missing a blueprint — still a Port blueprint, not an external registry. |
| **Sync** | GitHub Ocean `skill` / `MCP` / `Plugin` kinds ([GitHub Ocean](https://docs.port.io/context-lake/ingestion/ingest-data-into-port/native-integrations/available-integrations/git/github-ocean)); Convex/Vercel via **Observed** custom Ocean. |

### 2.2 Specs (product/spec intent, requirements text)

| Aspect | Content |
|--------|---------|
| **Meaning** | Human/agent-authored specifications (goals, constraints, evidence requirements) before/alongside contracts. |
| **Native** | `string`/`markdown`/`yaml` properties; entities; relations to `product` / issues. Linear **Document** / **Issue** sync ([Linear](https://docs.port.io/context-lake/ingestion/ingest-data-into-port/native-integrations/available-integrations/project-management/linear)); GitHub **Issue** sync. Workflows can upsert Port entities that *are* the governed spec. |
| **Observed** | `executionContract` holds goal/success/stop/nonGoals/evidence as properties; `ss_linear_create_issue` seeds Linear with factory-contract template. `product` holds stack/risk metadata. |
| **Custom-in-Port** | Optional dedicated `spec` / `specRevision` blueprint if immutability/versioning of prose must be entity-level rather than Linear/GitHub-only — **ASSUMPTION** that Factory wants Port-canonical specs; docs support modeling any asset as a blueprint. |
| **Not native as a separate “Spec product”** | Docs have no first-party “Spec” SaaS object beyond catalog modeling + synced PM/git entities. |

### 2.3 Build contracts (execution contracts / delivery governance)

| Aspect | Content |
|--------|---------|
| **Meaning** | Frozen, versioned agreement: paths, risk, implementer/reviewer, required evidence, hash. |
| **Native** | Blueprint entities + properties + relations + workflows with validations + approvals (INPUT). UPSERT_ENTITY for writes. Scorecards optional. |
| **Observed** | `executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner`; factory_* workflows; relations to `product`, bots, GitHub issue/PR. |
| **Custom-in-Port** | Domain fields already org blueprints — still Port-native. |
| **Gap (Port product)** | Upsert is create-or-update by identifier only — **no** compare-and-swap / version precondition ([Upsert entity](https://docs.port.io/workflows/build-workflows/nodes/action-nodes/upsert-entity); **Observed** `factory_claim_next_job` text). |
| **Factory fix** | Canonical Port catalog write fencing (§4.1): single-writer queue/actor per catalog record + `catalogVersion` reject-stale. Not a Port product CAS API. |

### 2.4 Agent personas

| Aspect | Content |
|--------|---------|
| **Meaning** | Who may act: Port-native AI agents, external bots, implementer/reviewer identities, plugins/skills they use. |
| **Native** | `_ai_agent` (+ MCP server relations, allowed tools, scorecards); MCP registry guides; skills registry; agent plugins. ([Extend context lake](https://docs.port.io/context-lake/extend-the-context-lake); [skills registry](https://docs.port.io/guides/all/setup-skills-registry); [MCP registry](https://docs.port.io/guides/all/manage-mcp-registry); [plugins](https://docs.port.io/guides/all/bundle-skills-into-plugins-in-your-org-registry)) |
| **Observed** | `_ai_agent`, `bot`, `bot_hire_proposal`, `bot_decision`, `agentPlugin`, `skill`, `_mcp_server`, `agent_readiness` scorecard; hire/approve via workflows/RBAC. |
| **Custom-in-Port** | `bot` vs `_ai_agent` split is org modeling on top of native agent blueprints — still catalog. |

### 2.5 Build outputs (artifacts, evidence, deployments, artifacts)

| Aspect | Content |
|--------|---------|
| **Meaning** | SHA-bound evidence, attempt receipts, PR/workflow-run/deploy records, harness traces. |
| **Native** | Entities for runs/attempts/deployments; GitHub Ocean workflow runs / deployments / PRs; mirror/aggregation for metrics; webhook/API ingest for external runners. |
| **Observed** | `executionAttempt.evidence`, `deliveryRun` review/release fields; `githubPullRequest`, `githubWorkflowRun`, `deployment`, `vercelProject`, `convexDeployment`; `harness_session` / `harness_snapshot`. |
| **Custom-in-Port** | Large binary artifacts: store **pointers** (URL properties) in Port; blob bytes live in object storage. Docs emphasize catalog entities/properties, not blob object storage as a Port primitive — **ASSUMPTION** for R2/S3 pointers. Prospect generate-site workflow text notes revision storage outside Port (**Observed** NEEDS HANDLER copy). |

### 2.6 Products / services / environments (required glue)

| Aspect | Content |
|--------|---------|
| **Meaning** | Top-level Factory products and deployable services — required to relate modules, contracts, and outputs. |
| **Native** | Default/org `service`, environment patterns; ownership; Engineering Intelligence mappings. ([Default blueprints](https://docs.port.io/context-lake/data-model/setup-blueprint/default-blueprints); service EI examples via Context7) |
| **Observed** | `product`, `service`, `environment`, `organization`, relations across git/Linear/Vercel/Convex. |

### 2.7 Identity / teams / workflows-as-catalog

| Aspect | Content |
|--------|---------|
| **Native** | `_user`, `_team`, `_workflow` system blueprints; External Interface OAuth for persons; org credentials for machines. |
| **Observed** | Present; team `Agentic SDLC`. |

### 2.8 Scorecards / standards metadata

| Aspect | Content |
|--------|---------|
| **Native** | Scorecards as first-class governance on blueprints. |
| **Observed** | Delivery/reliability/DORA/production_readiness on `service`/`_team`/`organization`; `agent_readiness`; prospect `icp_fit`. |

### 2.9 Adjacent Observed domains (housed in same lake)

Prospect pipeline (`prospect`, `prospectCampaign`, `prospectEvidence`), Paperclip* blueprints — same native pattern; not required for core Factory coding path but prove “everything as entities.”

---

## 3. Security assessment (docs)

### 3.1 RBAC / access control

- Catalog: entity `read`/`register`/`update`/`unregister` + `readProperties` / `updateProperties` / `updateRelations`; users/teams/roles/`ownedByTeam`/policies. ([Govern data access](https://docs.port.io/context-lake/consuming-the-lake/govern-data-access/overview); [permissions API](https://docs.port.io/api-reference/update-a-blueprints-permissions))
- Self-service / workflow execution RBAC + dynamic permissions / approvals. ([Set actions RBAC](https://docs.port.io/workflows/actions-and-automations/create-self-service-experiences/set-self-service-actions-rbac))
- External Interface tokens = **person** permissions. ([External interfaces](https://docs.port.io/interface-builder/external-interfaces))
- MCP tools filtered by Port permissions; workflow tool allowlists; machine-user policies. ([Expose as tool](https://docs.port.io/workflows/expose-as-tool); [MCP connectors](https://docs.port.io/agent-management/mcp-connectors))
- Page permissions separate from catalog entity RBAC (docs).

**ASSUMPTION:** Factory isolates projects via team ownership + blueprint policies on `product`/`executionContract`/`deliveryRun`/`executionAttempt`.

### 3.2 Sensitive fields

- **Secret inputs** on actions: encrypted; not logged/stored plaintext; Port-managed AES-256-GCM or client-side RSA. ([Secret](https://docs.port.io/workflows/actions-and-automations/create-self-service-experiences/setup-ui-for-action/user-inputs/secret))
- Org **Port secrets** for integration credentials (Linear docs reference). ([Linear](https://docs.port.io/context-lake/ingestion/ingest-data-into-port/native-integrations/available-integrations/project-management/linear))
- Property-level `readProperties` can hide fields from roles. ([Govern data access](https://docs.port.io/context-lake/consuming-the-lake/govern-data-access/overview))
- **Do not** put secrets in ordinary string properties or non-secret workflow inputs — run payloads may expose them (**Observed** `ss_vercel_set_env` guardrails align with Secret docs intent).

### 3.3 Audit exposure

- Entity + general audit APIs capture CREATE/UPDATE/DELETE-style ops, diffs, triggers, runs, webhooks, integrations, scorecards (see capacity doc §5). ([Search entity audit logs](https://docs.port.io/api-reference/search-entity-audit-logs))
- MCP connector traffic under Port audit controls. ([MCP connectors](https://docs.port.io/agent-management/mcp-connectors))
- Domain-immutable decisions can additionally be **entities** (**Observed** `bot_decision`) for queryable business audit.

---

## 4. Gaps Port cannot cover natively (cite docs)

| Gap | Why | Cite |
|-----|-----|------|
| Compare-and-swap / transactional lease on upsert | Upsert is create-or-update by identifier only — Port product has no version precondition | [Upsert entity](https://docs.port.io/workflows/build-workflows/nodes/action-nodes/upsert-entity) |
| Long-running sync webhook response in-band | Sync webhook waits ≤ **10 seconds** | [Webhook node](https://docs.port.io/workflows/build-workflows/nodes/action-nodes/webhook) |
| Embedded durable workflow engine (Rivet-class) | Backends are WEBHOOK / Ocean / git CI / upsert — not an in-Port actor runtime | [Backend types](https://docs.port.io/workflows/actions-and-automations/setup-backend); [pillars](https://docs.port.io/getting-started/agentic-sdlc-pillars) |
| Blob object storage for large build artifacts | Catalog stores properties/relations; binaries need external URLs | Ingestion/entity structure docs — entities hold typed properties, not object-store semantics ([Ingestion overview](https://docs.port.io/context-lake/ingestion/overview)) |
| Freemium External Interface multi-app | App count “depends on plan”; numeric freemium cap not published | [Manage OAuth apps](https://docs.port.io/platform-administration/sso-authentication/manage-your-oauth-apps); **Observed** limit 1 |
| Per-user OAuth MCP connectors inside automated workflow AI nodes | Workflows need org-level connector auth | [Use in workflows](https://docs.port.io/agent-management/mcp-connectors/use-in-workflows) |
| Linear team-membership live events | Docs: team member kind resync only | [Linear](https://docs.port.io/context-lake/ingestion/ingest-data-into-port/native-integrations/available-integrations/project-management/linear) |

**Port product gap ≠ Factory unsolved.** The no-upsert-CAS row is closed for Factory by the canonical fencing pattern in §4.1 (single-writer + `catalogVersion`). Sandbox FS and Beads graph remain outside Port; their receipts still land as Port entities through that same write path.

### 4.1 Canonical Port catalog write fencing (no-upsert-CAS fix)

Port `UPSERT_ENTITY` / entity API writes are **create-or-update by identifier** with **no** compare-and-swap, `If-Match`, or version precondition ([Upsert entity](https://docs.port.io/workflows/build-workflows/nodes/action-nodes/upsert-entity); **Observed** `factory_claim_next_job`: serialize claims). Factory therefore does **not** rely on Port for exclusive write atomicity. The Factory fix mirrors Rivet’s per-actor single-writer model ([rivet-claim-fencing.md](./rivet-claim-fencing.md) A1–A3; [rivet-full-capacity.md](./rivet-full-capacity.md) §7) applied to **catalog records**, not to execution admission.

#### Ownership boundary (do not conflate)

| Concern | Owner | Fence |
|---------|-------|-------|
| Catalog create/update/delete (entity properties, relations Factory governs) | **Port** SoT + Factory **catalog writer** | §4.1 single-writer per record + `catalogVersion` |
| Work admit / claim / attempt lifecycle | **Rivet** `ProjectSupervisor` / `WorkAttempt` | Per-actor ordered queue ([rivet-claim-fencing.md](./rivet-claim-fencing.md)) |
| Task readiness / Beads claim | **Beads** | Beads claim primitive — not Port upsert, not Rivet CAS |

Rivet never becomes the Port catalog store. Port projections of runs/attempts are catalog writes and **must** enter through §4.1. Rivet never polls Port ([factory-master-spec.md](./factory-master-spec.md) ADR-002).

#### Single-writer rule (mandatory)

**All** Port catalog writes route through a single-writer queue or actor that owns the target record — **one writer at a time per record**. Covered sources (no bypass):

1. Direct Port API / Port MCP entity upserts and patches from Factory services  
2. Ocean sync apply paths (GitHub / Linear / Vercel / Convex / custom Ocean) that create or update Factory-governed entities  
3. Webhook-triggered Port workflows whose nodes write entities (`UPSERT_ENTITY`, automation entity updates, claim/heartbeat/evidence workflows)

Writer identity key: `{blueprint}:{entityIdentifier}` (stable Port blueprint + entity id). Concurrent producers enqueue to that key; the owner processes messages **in order**, one at a time — same invariant Rivet documents for per-actor queues ([queues](https://rivet.dev/actors/docs/queues/)).

#### `catalogVersion` field (mandatory on Factory-mutated catalog blueprints)

Every Factory-governed catalog blueprint carries an integer property **`catalogVersion`**:

| Rule | Detail |
|------|--------|
| Type | Integer, start at `0` on create |
| Increment | Writer advances by exactly `1` on every successful apply |
| Stale reject | Writer reads current entity; if inbound `expectedCatalogVersion ≠` stored `catalogVersion`, **reject** — no partial apply |
| Retry | Caller re-reads entity, rebuilds payload with fresh `expectedCatalogVersion`, re-enqueues |
| Claims / leases | Modeled properties (`leaseEpoch`, status, owner) change **only** inside the same writer apply that bumps `catalogVersion` |

This is application-level optimistic concurrency on top of Port upsert, not a Port product CAS API. Rejected stale writes leave the entity unchanged.

#### Write protocol (concrete)

```text
Producer (API | Ocean mapper | workflow node prep)
  → read entity (or treat missing as create, catalogVersion=0)
  → enqueue CatalogWrite{ blueprint, entityId, expectedCatalogVersion, patch }
       to writer key blueprint:entityId
        → CatalogWriter (single-flight per key)
          → load current entity
          → if exists and expectedCatalogVersion != catalogVersion → reject (stale)
          → apply patch via Port upsert/API
          → set catalogVersion = expectedCatalogVersion + 1 (create: 0 → 1)
          → ack producer
```

`factory_claim_next_job`, `factory_heartbeat`, `factory_submit_evidence`, and any other concurrent entity mutators use this path. Two claimers cannot both win: the second apply sees a bumped `catalogVersion` (or loses single-writer ordering) and is rejected.

#### What this does not change

- Port RBAC, audit, and workflow approvals remain the governance surface.  
- Blob bytes stay in object storage; Port keeps URL properties only.  
- Rivet execution fencing stays in Rivet ([rivet-claim-fencing.md](./rivet-claim-fencing.md)); this section does not relocate admit into Port.

---

## 5. Native sync integrations plan (GitHub, Linear, stack)

Scope: **plan only** (docs + observed). No Port mutations.

### 5.1 Priority matrix

| Source | Docs native path | Observed now | Port should hold | How |
|--------|------------------|--------------|------------------|-----|
| GitHub | GitHub Ocean + optional GitHub MCP connector | `github-ocean`, `factory-pilot-github` | Repos, PRs, issues, workflows/runs, deployments, codeowners/readme mirrors; skills/MCP/plugin files | Keep Ocean as SoT sync; map → `github*` + relate `service`/`product`; MCP connector for diffs (**ASSUMPTION** when AI needs raw content) ([GitHub Ocean](https://docs.port.io/context-lake/ingestion/ingest-data-into-port/native-integrations/available-integrations/git/github-ocean); [Integrations vs MCP](https://docs.port.io/context-lake/ingestion/integrations-vs-mcp)) |
| Linear | Linear Ocean | `linear` | Teams, projects, issues, cycles, docs, labels, users | Continue Ocean; relate to `product`/`service`; workflows that write Linear (`ss_linear_create_issue`) stay Port-governed. Linear **MCP product** eval = other worker |
| Vercel | No first-party Vercel Ocean in llms index retrieved; custom integration path | `vercel-ocean` custom | Projects, deployments | Maintain custom Ocean mappings → `vercelProject`/`deployment` ([Custom integration](https://docs.port.io/context-lake/ingestion/ingest-data-into-port/custom-integration/overview)) |
| Convex | Same — custom | `convex-ocean` custom | Projects, deployments, components catalog | Maintain custom Ocean → `convex*` blueprints |
| Turso / Supabase | Catalog blueprints **Observed**; sync path not listed as plug-and-play in retrieved docs | Blueprints present | Project metadata | Prefer API/webhook/custom Ocean if continuous sync required |
| Sprite / harness / Rivet runners | Webhook/API ingest | Workflows + `harness_*`, `executionRunner` | Runner health, session summaries, attempt evidence | WEBHOOK/API push into entities ([Webhook ingest](https://docs.port.io/context-lake/ingestion/ingest-data-into-port/webhook/ingest-via-webhooks-overview); [Webhook actions](https://docs.port.io/workflows/actions-and-automations/setup-backend/webhook)) |

### 5.2 Mapping rules (docs)

1. Prefer **integration sync** for anything workflows, scorecards, and agents must **relate** repeatedly. ([Integrations vs MCP](https://docs.port.io/context-lake/ingestion/integrations-vs-mcp))
2. Prefer **MCP connector** for live/unmodeled depth without bloating the lake.
3. Prefer **UPSERT via workflows** for Factory-authored governance objects (`executionContract`, etc.) — not raw dual-write from agents bypassing workflows.
4. Every entity write (workflow upsert, Ocean apply, direct API) enters the **§4.1 catalog writer** for `{blueprint}:{entityIdentifier}` with `expectedCatalogVersion`; never bypass for “just this sync.”
5. Clean stale entities when mappings change ([Entity cleanup](https://docs.port.io/context-lake/ingestion/configure-mapping/entity-cleanup)) — cleanup deletes also go through the owning writer key.
6. Dual GitHub Ocean installs (**Observed**): document which orgs/repos each covers to avoid duplicate identifiers — ops detail, no mutation here.

### 5.3 Explicit non-goals for this plan

- Evaluating Linear as the task-manager MCP product (separate worker).
- Creating/revoking External Interface apps or changing production OAuth.
- Claiming Rivet/Beads are Port-native sync sources (docs do not list them).

---

## 6. Native-vs-custom summary table

| Factory piece | Prefer | Custom Ocean / webhook | External system of record still exists? |
|---------------|--------|------------------------|-----------------------------------------|
| Modules / templates / components | Blueprints + relations | GitHub Ocean file kinds; Convex custom | Git/npm registries for bytes |
| Specs | Markdown properties +/or Linear/GitHub entities; optional `spec` blueprint | — | May mirror Linear/GitHub |
| Build contracts / runs / attempts | Org blueprints + workflows | — | Receipts in Port; code in Git |
| Agent personas / skills / MCP | `_ai_agent`, `bot`, `skill`, `_mcp_server`, plugins | Ocean skill/MCP ingest | Skill files in git |
| Build outputs / evidence | Attempt/deploy/PR entities + URL properties | GitHub/Vercel/Convex sync; harness webhooks | CI logs, artifact stores |
| AuthZ metadata | Catalog RBAC + teams | — | IdP via Port SSO if configured |

---

## 7. Section outline

1. Principle — Port houses everything  
2. Catalog pieces → native primitives (modules, specs, contracts, personas, outputs, glue)  
3. Security (RBAC, secrets, audit)  
4. Documented gaps  
   - **4.1 Canonical Port catalog write fencing (no-upsert-CAS fix)** — single-writer per record + `catalogVersion`  
5. Sync plan (GitHub, Linear, Vercel, Convex, other)  
6. Native-vs-custom summary  

**Related:** [port-full-capacity.md](./port-full-capacity.md) · [factory-master-spec.md](./factory-master-spec.md) §4.2.1 · [rivet-claim-fencing.md](./rivet-claim-fencing.md) · prior narrower note [port-capabilities.md](./port-capabilities.md)
