# Port prep inventory — Factory Meta

**Checked:** 2026-10-29 (read-only)  
**Repo:** https://github.com/mplsjohnnycage/factory (`main` @ `107a7be`)  
**Lane:** Meta  
**Live Port:** org `mplsjohnnycage` / `org_rNq4tjSc8DXL1ceL` via Port MCP (no mutations)

**Sources:** repo (`specs/port-governance`, `apps/factory-gateway`, `.well-known/openaccess.json` + `openmcp.json`, ADRs); store docs (`port-full-capacity.md`, `port-factory-data-model.md`, `port-factory-oauth-live.md`, `port-auth-linkage-status.md`, `openaccess-linkage-smoke.md`, `factory-master-spec.md`, `port-capabilities.md`); live Port MCP (`list_blueprints`, `list_integrations`, `list_workflows`, `list_self_service_triggers`, `list_entities` counts, `list_external_interface_apps`, `list_scorecards`, `get_context_lake_kind_examples`).

**Status labels:** `prepared` = live + usable for that surface; `partial` = schema/docs/code exist but wiring, population, or end-to-end path incomplete; `not started` = no meaningful prep.

---

## Compact table

| Area | Status | Evidence |
|------|--------|----------|
| Context Lake | **partial** | Live blueprints + Ocean entities + scorecards; Factory Meta `product`/`executionContract` **0** entities; `catalogVersion` fencing not on live BPs |
| MCP gateway | **partial** | Port MCP live + OpenMCP linked; Factory gateway ≠ MCP proxy; connectors / person OAuth for Dev OS incomplete |
| Ocean integrations | **prepared** | 5 installs; all `resyncState.status=completed` today |
| Sync | **partial** | Ocean resyncs healthy; §4.2.1 gateway fencing not applied to Ocean/MCP writes yet |
| Blueprints | **partial** | Factory BPs live in Port; no repo YAML/as-code; Meta product/contract entities empty |
| Self-service actions | **prepared** | `factory_*` + provision + many `ss_*`; Meta Convex NEEDS HANDLER → gateway (FE-107); Prospect/Painter remain Product stubs |
| Skills | **prepared** | `skill` blueprint + **649** entities; Port `load_skill` catalog available |
| Agent registry | **prepared** | `_ai_agent` **11**, `bot` **29**, `agentPlugin` **144**, `agent_readiness` scorecard |
| Workflows | **partial** | 7 `factory_*` live as tools; WEBHOOK→gateway coded in repo, not proven live-wired |

---

## OAuth / Developer OS (cross-cutting blockers)

| Item | Status | Blocks? |
|------|--------|---------|
| Port External Interface app `Factory` | **prepared** | Live only app; Observatory revoked. [`port-factory-oauth-live.md`](./port-factory-oauth-live.md); MCP `list_external_interface_apps` |
| OpenAccess / OpenMCP well-knowns on `main` | **prepared** | Client id + redirects match live app; OpenMCP → `https://mcp.port.io/v1`. [`openaccess-linkage-smoke.md`](./openaccess-linkage-smoke.md) |
| Developer OS OAuth end-to-end | **partial** | Code + Vercel env wired: callback `/api/auth/callback`, PKCE token exchange, `PORT_FACTORY_CLIENT_ID` set. Still need HTTPS Port redirects for non-localhost; `lastLoginAt` null until first person login. [`port-auth-linkage-status.md`](./port-auth-linkage-status.md) |

**Does block (non-localhost):** person sign-in from Vercel preview/prod until HTTPS callbacks are registered on the Port Factory app.  
**Does not block:** localhost Sign in with Port (once Dev OS runs with env); Ocean sync; Port MCP machine/admin; `factory_*` tools.

---

## 1. Context Lake — **partial**

| Prepared | Missing |
|----------|---------|
| Org Context Lake populated: GitHub/Linear/Vercel/Convex mirror blueprints; DORA/readiness scorecards; prospect + harness domains | Factory Meta catalog instances: `product` count **0**, `executionContract` **0** |
| Docs map native primitives → Factory ([`port-factory-data-model.md`](./port-factory-data-model.md), [`port-full-capacity.md`](./port-full-capacity.md) §7) | `catalogVersion` not observed on live blueprint property lists (fencing is gateway code + Spec only) |
| Lakehouse / EI flags observed historically | Dual GitHub Ocean installs need deliberate org/repo mapping to avoid duplicate ids |

**Evidence:** live `list_blueprints`; entity counts; `get_context_lake_kind_examples` for `github-ocean`/`repository` (examples present; some kinds lakehouse-gated); store capacity/data-model docs; master Spec §4.2 / §4.2.1.

---

## 2. MCP gateway — **partial**

| Layer | Status | Evidence |
|-------|--------|----------|
| Port remote MCP (into Port) | **prepared** | This session’s Port MCP tools; OpenMCP lists `https://mcp.port.io/v1` + 7 `factory_*` tools (`.well-known/openmcp.json`) |
| Workflows-as-tools | **prepared** | `list_self_service_triggers` returns full Factory set |
| Factory “one MCP gateway” (master Spec / ADR-001 aggregating front door) | **partial** | `apps/factory-gateway` is HMAC webhook + §4.2.1 writer + supervisor enqueue — **not** an MCP server that proxies Port |
| MCP connectors (Port as gateway **out**) | **not verified live** | Documented in [`port-full-capacity.md`](./port-full-capacity.md) §4; no MCP tool listed connectors in this inventory |
| Dev OS ↔ Port person MCP/OAuth | **partial** | OAuth gaps above |

---

## 3. Ocean integrations — **prepared**

| Identifier | Type | Resync (live 2026-10-29) |
|------------|------|--------------------------|
| `github-ocean` | `github-ocean` SaasOAuth2 | completed `06:24–06:26Z` |
| `factory-pilot-github` | `github-ocean` SaasOAuth2 | completed `06:24–06:29Z` |
| `linear` | `linear` Saas | completed `06:24–06:25Z` |
| `vercel-ocean` | `custom` Saas | completed `06:24–06:24Z` |
| `convex-ocean` | `custom` Saas | completed `06:24–06:26Z` |

**Evidence:** live `list_integrations`; [`port-full-capacity.md`](./port-full-capacity.md) §7; [`port-capabilities.md`](./port-capabilities.md) §3.2.

**Caveat (not “not started”):** two GitHub Ocean installs + custom Vercel/Convex — ops mapping discipline still required ([`port-factory-data-model.md`](./port-factory-data-model.md) §5).

---

## 4. Sync — **partial**

| Prepared | Missing |
|----------|---------|
| Continuous Ocean resync completing for all five integrations | Ocean/MCP catalog applies **bypass** §4.2.1 gateway writer (Spec forbids dual-write; runtime not connected) |
| Sync plan documented (GitHub → Linear → Vercel/Convex → skills/MCP → webhook for Rivet/harness) | Live WEBHOOK ingest from Rivet/harness into Port not proven |
| Gateway `POST /catalog/write` + `claim-next` implemented in-repo | In-memory store only; not production Port dual-write path |

**Evidence:** live integrations; `apps/factory-gateway` README + `catalog-writer.ts`; Spec `specs/port-governance/spec.md`; data-model §4.1 / §5.

---

## 5. Blueprints — **partial**

**Live Factory-bound blueprints (all present):** `product`, `service`, `executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner`, `bot`, `_mcp_server`, `agentPlugin`, `skill`, `harness_session` (+ stack/provider/github/linear/vercel/convex mirrors).

| Prepared | Missing |
|----------|---------|
| Blueprints live in Port org (SoT) | **No** `blueprints/` YAML or `port.yml` in factory repo — not managed as-code in Meta git |
| Named in Specs, OpenMCP `factory.port_blueprints`, master Spec | Meta seed entities (`product` for Factory Meta, contracts/runs) **empty** |
| Scorecards on `service` / `_team` / `organization` / `_ai_agent` | `catalogVersion` property rollout on Factory-governed BPs |

**Evidence:** live `list_blueprints` / `list_scorecards`; repo has **no** blueprints directory; OpenMCP + `specs/port-governance/spec.md`.

---

## 6. Self-service actions — **prepared**

| Class | Live examples | Notes |
|-------|---------------|-------|
| Software Factory | `factory_create_execution_contract`, `factory_start_delivery_run`, `factory_claim_next_job`, `factory_heartbeat`, `factory_submit_evidence`, `factory_record_review_verdict`, `factory_request_release` | Typed tools; release Johnny-only INPUT |
| Provisioning | `provision_composable_stack`, `provision_external_backend_stack` | Bind skills / MCP / agents |
| Provider SS | `ss_linear_create_issue`, `ss_github_*`, `ss_vercel_*`, `ss_sprite_provision` | Marked LIVE (often untested E2E) |
| Meta handlers | `ss_convex_create_preview`, `ss_convex_set_env` | **Wired** (FE-107) → `factory-gateway` `/handlers/self-service` (needs Port secrets + deploy for E2E) |
| Product stubs | Prospect / Painter tenant | Explicit **NEEDS HANDLER** / `[product lane]` — out of Meta kernel path |

**Evidence:** live `list_self_service_triggers` + `list_workflows` query `factory`; [`port-capabilities.md`](./port-capabilities.md) §3.4.

---

## 7. Skills — **prepared**

| Surface | Status | Evidence |
|---------|--------|----------|
| Port `skill` blueprint + entities | **prepared** | count **649** |
| `agentPlugin` relations | **prepared** | count **144** |
| Port MCP product skills (`load_skill`) | **prepared** | large built-in list (workflows, integrations, blueprints, OAuth app helper, etc.) |
| Factory Meta git skills → Port entities | **assumed via Ocean / registry** | Not re-audited file-by-file this run; blueprint + high count imply registry is operational |

---

## 8. Agent registry — **prepared**

| Blueprint | Count (live) | Role |
|-----------|--------------|------|
| `_ai_agent` | **11** | Port-native agents; `agent_readiness` scorecard |
| `bot` | **29** | External bots / CLIs |
| `_mcp_server` | **13** | MCP registry |
| `agentPlugin` | **144** | Plugin bundles |
| `bot_hire_proposal` / `bot_decision` | present (schemas) | Hire/audit path |

**Gap (non-blocking for “registry prepared”):** Factory Coding vs Cockpit roster from master Spec §0.7 may not be fully modeled as distinct Port entities; zero `product` means agents are not yet related to a Factory Meta product.

**Evidence:** live entity counts + blueprints; [`port-full-capacity.md`](./port-full-capacity.md) §6; [`port-factory-data-model.md`](./port-factory-data-model.md) §2.4.

---

## 9. Workflows — **partial**

| Prepared | Missing |
|----------|---------|
| Seven `factory_*` workflows live and exposed as self-service / MCP tools | Proven WEBHOOK backend → deployed `factory-gateway` for claim/heartbeat/evidence path |
| Adjacent planning/provision workflows | End-to-end delivery run with Meta `product` + contract entities (none exist yet) |
| Spec + OpenMCP name exact workflow IDs (do not invent) | Upsert CAS absent — mitigated only when §4.2.1 writer is on the hot path |

**Evidence:** live `list_workflows` / triggers; OpenMCP tools list; gateway HMAC webhook code; master Spec ADR-003.

---

## Repo vs Port SoT (quick)

| Artifact | In repo | In live Port |
|----------|---------|--------------|
| Blueprints YAML | **No** | **Yes** (org catalog) |
| OpenAccess / OpenMCP | **Yes** (`.well-known/`) | N/A (descriptors); OAuth app **yes** |
| factory-gateway §4.2.1 | **Yes** (code + tests) | Not Port SaaS; deploy/wire **partial** |
| Port Spec / ADRs | **Yes** | Aligns with live names |
| Store capacity / data-model / OAuth docs | Project store | Match live reads (OAuth doc supersedes capacity §10 Observatory snapshot) |

---

## Suggested next prep (not done this run)

1. Seed Factory Meta `product` (+ relate github/Linear) then a sample `executionContract` / `deliveryRun` via `factory_*` tools.  
2. ~~Align Dev OS callback + token exchange + Vercel `PORT_FACTORY_CLIENT_ID`~~ (done in repo). Remaining: add HTTPS Port redirects + prove `lastLoginAt`.  

3. Point Port workflow WEBHOOK backends at a deployed gateway; route Ocean/MCP entity writes through `/catalog/write`.  
4. Add `catalogVersion` to Factory-governed blueprints; optionally export blueprints as-code into the Meta repo.

---

## Classification summary

```
Ocean integrations ──────── prepared
Skills registry ─────────── prepared
Agent registry ──────────── prepared
Self-service actions ────── prepared
Context Lake ────────────── partial (lake live; Meta entities empty; fencing not on BPs)
MCP gateway ─────────────── partial (Port MCP + OpenMCP; Factory gateway ≠ MCP; Dev OS OAuth)
Sync ────────────────────── partial (Ocean healthy; §4.2.1 not on sync path)
Blueprints ──────────────── partial (live schemas; no git YAML; empty Meta instances)
Workflows ───────────────── partial (factory_* live; WEBHOOK→gateway unproven)
Dev OS OAuth ────────────── partial (code+env wired; HTTPS redirects + live login pending)
```
