# Factory stack master audit (evidence-only)

**Status:** Master audit  
**Date:** 2026-10-28  
**Method:** Official docs, official API/reference pages, official `llms.txt` indexes, live Port MCP reads (read-only), and cited community projects. **No inference.** Anything not established by those sources is marked **UNVERIFIABLE**.  
**Prior Project notes** (claims index only — not proof): [`rivet-engineering-spec.md`](./rivet-engineering-spec.md), [`port-capabilities.md`](./port-capabilities.md), [`rivet-claim-fencing.md`](./rivet-claim-fencing.md), [`logic-src-overview.md`](./logic-src-overview.md), [`logicsrc-monorepo.md`](./logicsrc-monorepo.md), [`iso-12207-overview.md`](./iso-12207-overview.md), [`rivet-sandbox-agent.md`](./rivet-sandbox-agent.md).  
**Missing prior note:** `factory-claims-verification.md` — **not present** in this store’s `docs/` at audit time.

---

## 0. How to read this document

| Label | Meaning |
|-------|---------|
| **Official docs say** | Statement found on vendor/SDO/primary project documentation |
| **API / integration surface** | Documented endpoints, CLIs, MCP tools, schemas, or protocols |
| **Stack connection (evidenced)** | Connection stated by an official source *or* observed live in Port MCP — never assumed from Factory design notes |
| **Comparable projects** | Public community projects with citations (not Factory endorsements) |
| **UNVERIFIABLE** | Claimed in prior Project notes or evaluation export, but not confirmed from primary sources in this audit |

---

## 1. Claims index (prior Project notes → re-verify)

| Claim (from prior notes / evaluation export) | Re-verify target |
|----------------------------------------------|------------------|
| Port owns auth (External Interfaces OAuth), catalog, RBAC, workflows, MCP gateway; Clerk not required | Port docs + live MCP |
| Port upserts have no CAS; `factory_claim_next_job` can race | Live Port workflow description + Port upsert docs |
| Rivet is durable execution (actors, queues, workflows); no product “claim lease / CAS” API | Rivet `llms.txt` + queues/actions docs |
| Sandbox Agent = in-sandbox HTTP harness control; Rivet Actors recommended for multiplayer/persistence | Rivet Sandbox Agent docs |
| Beads = readiness / dependency authority (`bd ready`, `bd update --claim`) | Beads docs + GitHub README |
| Polygraph = multi-repo coding coordination (not a second runtime); evaluation export also said “execution provenance” | Polygraph official site/docs |
| Trail-code / Graft = code map for agents | Trail-Code GitHub README |
| LogicSRC = open schemas (ASDLC, OpenPRD, CLI/SDK/MCP) | logicsrc.com + monorepo note |
| ISO/IEC/IEEE 12207:2026 = software life cycle processes (paid) | ISO/IEEE/IEC catalogs |
| Docker Sandboxes ≠ ordinary containers (microVM) | Docker docs |
| Tailscale Serve = private HTTPS to localhost services | Tailscale docs |
| GitHub CI / webhooks = independent verification | GitHub docs |
| MCP Apps = iframe UI extension for MCP | MCP Apps spec / overview |
| Next.js = App Router / RSC / Route Handlers for Developer OS | Next.js official docs |
| Vercel = deploy + preview URLs + MCP deploy/OAuth helpers | Vercel official docs |
| AG-UI = Agent↔User Interaction protocol (≠ MCP Apps) | docs.ag-ui.com |
| CopilotKit = AG-UI client + generative UI (incl. MCP Apps embed) | CopilotKit docs |
| ChatGPT plugins = skills + MCP (+ optional UI) | OpenAI Developers plugins docs |
| OmniRouter / OmniRoute = LLM gateway | OmniRoute site / GitHub |
| Langfuse = traces / evals / OTel | Langfuse docs |
| Code Atlas = Factory code-structure intelligence | **UNVERIFIABLE** as a single official product matching Factory usage |

---

## 2. Port

### 2.1 Official docs say

Port documents itself as a platform for an “AI software factory”: governed layer where humans and AI agents build, govern, and operate an agentic SDLC. API bases: `https://api.port.io` (EU), `https://api.us.port.io` (US). ([docs.port.io/llms.txt](https://docs.port.io/llms.txt))

Pillars named in docs index: context lake, workflows, Port AI, agent management, interface builder, governance. ([llms.txt](https://docs.port.io/llms.txt) → getting-started / agentic-sdlc-pillars)

**External Interfaces / OAuth:** Custom apps hosted outside Port sign users in with Port (OAuth 2.0 authorization code). Token is person-scoped; “same roles, the same permissions, the same data scoping” as Port UI. Org OAuth apps cannot cross organizations. ([External interfaces](https://docs.port.io/interface-builder/external-interfaces))

**Catalog / blueprints:** Typed software catalog (blueprints + entities + relations + scorecards). ([llms.txt](https://docs.port.io/llms.txt) context-lake sections)

**RBAC:** Blueprint entity permissions include `read`, `register`, `update`, `unregister`, plus property/relation scopes; API `PUT /v2/blueprints/{blueprint_identifier}/permissions` (also v1 PATCH documented). ([API: update blueprint permissions](https://docs.port.io/api-reference/update-a-blueprints-permissions); Context7 `/websites/port_io`)

**Workflows as MCP tools:** “Every self-service workflow in Port is automatically available as an invokable tool through the Port MCP server.” Discovery: `list_self_service_triggers`; execution: `trigger_run`. ([Expose workflows as tools](https://docs.port.io/workflows/expose-as-tool.md))

**MCP connectors:** Route to external MCP servers with Port RBAC/audit; workflow AI nodes use organization automation tokens — “Per-user OAuth MCP connectors are not supported” in automated workflows; prefer org-level OAuth / client credentials. (Context7 `/websites/port_io` → AI node / MCP connectors docs)

**WEBHOOK backends:** Workflows can POST to external HTTP APIs (sync ≤10s or async with Port API callback) — documented webhook node / setup-backend webhook pages listed in Port `llms.txt` (see prior note cross-check in [`rivet-claim-fencing.md`](./rivet-claim-fencing.md); re-verified via Port docs index).

**UPSERT entities:** Documented as create-or-update; **no CAS / version precondition** found in Port upsert-entity docs (absence agreed in prior fencing note + Port `llms.txt` entry). ([upsert-entity](https://docs.port.io/workflows/build-workflows/nodes/action-nodes/upsert-entity.md))

### 2.2 API / integration surface

| Surface | Evidence |
|---------|----------|
| REST API | [Port API reference](https://docs.port.io/api-reference/port-api/) (catalog, workflows, permissions, MCP connect, etc.) |
| MCP server tools | Live tool catalog includes blueprints, entities, workflows, runs, integrations, external interface apps, audit search, plugins, scorecards (Port MCP namespace) |
| External Interface apps | MCP `list_external_interface_apps` / `upsert_external_interface_app` |
| Ocean integrations | GitHub Ocean, Linear, custom Ocean installers |
| Self-service triggers | `list_self_service_triggers` + `trigger_run` |

### 2.3 Live Port MCP snapshot (2026-10-28, org `mplsjohnnycage`)

Read-only live reads (not documentation claims about Port product features — **workspace facts**):

- **Org / plan:** `mplsjohnnycage`, account `makeithappenentllc.com`, plan **FREEMIUM**; user Johnny Cage — Admin + Member; team `Agentic SDLC`. Feature flags include `AI_ELIGIBLE`, `WORKFLOWS_BLUEPRINTS`, `LAKEHOUSE_ELIGIBLE`. (`describe_user_details`)
- **External interface app:** **Harness Observatory** — OAuth client present; redirect `https://harness-observatory.vercel.app/api/auth/callback`; last login 2026-10-27. (`list_external_interface_apps`)
- **Integrations:** `github-ocean`, `factory-pilot-github` (GitHub Ocean OAuth2), `linear`, `vercel-ocean` (custom), `convex-ocean` (custom). (`list_integrations`)
- **Factory workflows (subset of `list_workflows` query `factory`):**  
  `factory_create_execution_contract`, `factory_start_delivery_run`, `factory_claim_next_job`, `factory_heartbeat`, `factory_submit_evidence`, `factory_record_review_verdict`, `factory_request_release`, plus related self-service (`ss_linear_create_issue`, `ss_github_apply_ruleset`).  
  **`factory_claim_next_job` description (live):** “SERIALIZE CALLS (concurrency 1): Port upserts have no compare-and-swap, so two concurrent claims can both pass the check. Use one dispatcher until a transactional lease exists.” Also documents `leaseEpoch` as fencing token on attempts.

### 2.4 Stack connection (evidenced)

| Connection | Evidence |
|------------|----------|
| External client ↔ Port OAuth | Port External Interfaces docs + live Harness Observatory OAuth app |
| Agents ↔ same workflow tools as humans | [Expose workflows as tools](https://docs.port.io/workflows/expose-as-tool.md) |
| Port → external execution | Documented WEBHOOK / Ocean action backends — **not** an embedded Rivet runtime inside Port |
| Port ↔ GitHub / Linear / Vercel / Convex | Live Ocean integrations |

**UNVERIFIABLE:** Any statement that Port “hosts Rivet,” “implements WorkAttempt leases,” or “is Factory’s only backend for Rivet realtime.” Port docs do not name Rivet as a first-party backend.

### 2.5 Comparable community projects

1. **Backstage** — open developer portal / software catalog ([backstage.io](https://backstage.io/)).  
2. **Cortex** — engineering portal / scorecards (commercial; [cortex.io](https://www.cortex.io/)).

---

## 3. Rivet (Actors, queues, workflows, agentOS, Sandbox Agent)

### 3.1 Official docs say

**Index:** [https://rivet.dev/llms.txt](https://rivet.dev/llms.txt) lists Actors, agentOS, Sandbox Agent, Workflows, Dynamic Apps, deploy, API, etc.

**Actors / queues / durability (Actors docs):**

- Queues are durable, local per actor, ordered; help avoid race conditions by handling work in order. ([Actors queues](https://rivet.dev/actors/docs/queues/))
- Actions are not durable; queues are durable for serialized mutations. (Context7 `/rivet-dev/actors` crash-course / sqlite-drizzle patterns)
- Actions run in parallel by default; use queues for concurrency control. ([Actors actions](https://rivet.dev/actors/docs/actions/))
- Schedules: one-shot, cron, interval on actors. (Context7 schedule docs)
- Workflows: durable steps, waits, signals (`runWorkflow`, `ctx.step`, `ctx.queue.next`). (Context7 `/rivet-dev/actors` workflow-engine)

**Claim fencing / CAS:** No Rivet product page in `llms.txt` documents a user-facing “claim lease” or CAS claim API. Closest documented mechanisms: per-actor ordered queues + single-writer actor storage. (**Absence** verified against queues/actions/architecture pages and prior fencing note’s Context7 agreement.)

**Completable queue failure semantics:** Prior research flagged **internal docs conflict** (queues page vs production checklist on retry vs no-redelivery). **Still UNVERIFIABLE which is authoritative** without a Rivet clarifying statement. ([rivet-claim-fencing.md](./rivet-claim-fencing.md) claims index)

**agentOS:** Lightweight OS for agents (files, processes, networking, JS/Python, cron); has documented **limitations** page (not a full unrestricted Linux for all toolchains). ([agentOS docs](https://rivet.dev/agentos/docs/); [limitations](https://rivet.dev/agentos/docs/limitations/))

**Sandbox Agent:** HTTP server that runs **inside** a sandbox; one API for Claude Code, Codex, OpenCode, Cursor, Amp, Pi; SSE events; filesystem/process/terminal APIs. Image example in docs: `rivetdev/sandbox-agent:0.5.2-full`. Built-in providers include local, docker, e2b, daytona, vercel, cloudflare. Multiplayer docs: “For multiplayer orchestration, use Rivet Actors”; one actor owns session lifecycle; browsers should not call Sandbox Agent directly. ([Sandbox Agent docs](https://rivet.dev/sandbox-agent/docs/); sibling note [`rivet-sandbox-agent.md`](./rivet-sandbox-agent.md) as claims index)

### 3.2 API / integration surface

| Surface | Evidence |
|---------|----------|
| Actor actions / events / clients (JS, React, Rust, Swift) | [llms.txt](https://rivet.dev/llms.txt) Actors tree |
| Durable queues API (`queue`, `c.queue.iter`, completable messages) | [queues](https://rivet.dev/actors/docs/queues/) |
| Workflow engine (`@rivetkit/workflow-engine`) | Rivet workflow docs / Context7 |
| Sandbox Agent HTTP + TypeScript SDK (`SandboxAgent.start` / `connect`, `/v1/health`) | Sandbox Agent architecture / SDK overview |
| agentOS hosted HTTP API | [hosted-api](https://rivet.dev/agentos/docs/hosted-api/) |
| Docker Compose self-host | Rivet deploy docs (listed under deploy in product docs) |

### 3.3 Stack connection (evidenced)

| Connection | Evidence |
|------------|----------|
| Rivet Actors ↔ Sandbox Agent | Official Sandbox Agent multiplayer / orchestration / security pages recommend Rivet Actors as backend session owners calling Sandbox Agent |
| Sandbox Agent ↔ Docker | Official Docker provider + `rivetdev/sandbox-agent:*` images |
| Port ↔ Rivet | **UNVERIFIABLE** as a first-party Port or Rivet product integration. Documented Port path to *any* external backend is WEBHOOK/Ocean — Factory wiring is design, not vendor docs |

### 3.4 Comparable community projects

1. **Cloudflare Durable Objects** — single-threaded durable object concurrency ([developers.cloudflare.com/durable-objects](https://developers.cloudflare.com/durable-objects/)).  
2. **Temporal** — durable workflows / activities ([temporal.io/docs](https://docs.temporal.io/)).

---

## 4. LogicSRC

### 4.1 Official docs say

From [logicsrc.com/about](https://logicsrc.com/about) and [logicsrc.com](https://logicsrc.com/): open-specification project (Profullstack) — JSON Schema contracts and conventions for coordination between humans, AI agents, plugins, payment systems, and hosted products. Specs are CC BY 4.0; products implement LogicSRC without owning the standard.

**Four spec families** ([/specs](https://logicsrc.com/specs)): people/agents; access/credentials; catalogs a site serves; agents and process.

**ASDLC** ([/asdlc](https://logicsrc.com/asdlc)): Agentic Software Development Lifecycle — parallel agents; CI/CD as gate; phases Frame → Fan out → Gate locally → Merge → Release → Verify live → Correct → Ratchet → Promote.

**OpenPRD** ([/openprd](https://logicsrc.com/openprd)): PRDs agents can execute; `prd/` collection; fixed front-matter + required sections; lifecycle Draft → Review → Accepted → Final; status cited **0.3** on page.

**Not:** a code IR; not an ISO/IEEE SDO document. (Site classification; prior overview)

### 4.2 API / integration surface

| Surface | Evidence |
|---------|----------|
| Site / specs / docs | https://logicsrc.com/ , `/specs`, `/docs` |
| Monorepo | https://github.com/profullstack/logicsrc (MIT) |
| CLI | `@logicsrc/cli` / `logicsrc` — install via `curl -fsSL https://logicsrc.com/install.sh \| sh` |
| SDK / schemas | `@logicsrc/sdk`, `@logicsrc/schemas`, `@logicsrc/validators` (monorepo overview) |
| MCP | `@profullstack/logicsrc-mcp` / `logicsrc mcp` |
| Reference product | CommandBoard.run |

Monorepo stack facts (from Project note summarizing OpenStack.md / site — treat as **secondary** until re-fetched raw OpenStack.md): TypeScript 5.9, Node 24, Next.js 16, Postgres/Supabase, libSQL/Turso for credentials app. ([`logicsrc-monorepo.md`](./logicsrc-monorepo.md))

### 4.3 Stack connection (evidenced)

**None as a vendor-linked Factory dependency.** LogicSRC does not document Port, Rivet, Beads, or Polygraph as required runtimes. Factory may *borrow* contracts; that reuse is not evidenced as a product coupling.

### 4.4 Comparable community projects

1. **OpenSpec.dev** — contrasted on [logicsrc.com/openspec](https://logicsrc.com/openspec) (repo-local planning vs broader coordination).  
2. **Agent Skills / AGENTS.md conventions** — adjacent agent instruction packaging (community; not LogicSRC).

---

## 5. Polygraph

### 5.1 Official docs say

**Product:** Polygraph by the Nx team — “meta-harness” for cross-repo visibility and persistent session memory for AI agents. Explicit site copy: “Polygraph isn’t an agent.” ([trypolygraph.com](https://trypolygraph.com/); [docs.trypolygraph.com](https://docs.trypolygraph.com/))

Documented capabilities (docs nav / product pages): cross-repo agent sessions; cross-repo PR and CI coordination; institutional memory; session resume/handoff; multi-agent; CLI (`auth`, `graph`, `session`, `agent`, …); MCP tools (`list_repos`, `list_sessions`, `spawn_agent`, `start_session`, `search_sessions`, …). Use case page: “Set up a software factory” — “A software factory is a workflow, not a product.” ([docs use case](https://docs.trypolygraph.com/use-cases/set-up-a-software-factory/))

### 5.2 API / integration surface

| Surface | Evidence |
|---------|----------|
| CLI | [docs.trypolygraph.com/cli/…](https://docs.trypolygraph.com/) |
| MCP tools | [docs.trypolygraph.com/mcp-tools/…](https://docs.trypolygraph.com/) |
| Install | e.g. `brew install nrwl/tap/polygraph` (product site) |
| Agents | Codex, Claude Code, OpenCode, GitHub (product integrations list) |

### 5.3 “Eval model” claim

**UNVERIFIABLE against official Polygraph docs.** Official materials describe cross-repo sessions, memory, PR/CI coordination — **not** an evaluation scoring model or eval APIs.  

Prior evaluation export text (“Polygraph for execution provenance”) is **not** the same as Nx Polygraph’s published product surface — treat provenance/eval framing as **UNVERIFIABLE** unless a different “Polygraph” product is named with a primary URL.

### 5.4 Stack connection (evidenced)

Official Polygraph docs do **not** name Port or Rivet. They do document GitHub / agent harness integrations and a “software factory” *workflow composition* use case. Factory’s “Polygraph → Rivet DelegateCoding” contract in the engineering spec is **Factory design — UNVERIFIABLE as vendor API**.

### 5.5 Comparable community projects

1. **Nx** monorepo tooling (same vendor lineage).  
2. **Repo-of-repos / multi-repo agent workspace patterns** (community writeups; not a single standard).

---

## 6. Beads

### 6.1 Official docs say

Beads (`bd`) — “Distributed graph issue tracker for AI agents, powered by Dolt.” Persistent dependency-aware task graph; replaces markdown TODO lists for agent task tracking. ([GitHub README](https://github.com/gastownhall/beads); [docs](https://beads.gascity.com/); [llms.txt](https://beads.gascity.com/llms.txt))

Core flow (README): `bd create` → dependency graph → `bd ready` → `bd update --claim` → `bd close`; sync via `bd dolt push/pull`.

Features documented: hash-based IDs; JSON output; gates (PR/CI/timers); molecules/formulas; MCP server / npm `@beads/bd` / PyPI `beads-mcp`; IDE setups including Claude Code, Cursor, Codex, Factory.ai Droid.

### 6.2 API / integration surface

| Surface | Evidence |
|---------|----------|
| CLI | `bd ready`, `bd create`, `bd update --claim`, `bd close`, `bd show`, … |
| MCP | Installation docs mention MCP server (`beads-mcp` / plugin paths in llms.txt) |
| Storage | Dolt (embedded or server); remotes for multi-machine sync |
| Docs index | https://beads.gascity.com/llms.txt |

### 6.3 Stack connection (evidenced)

Beads docs integrate with coding agents/IDEs. **No official Beads documentation found** that names Rivet or Port as required backends. Factory `ReadyTaskEvent` / Rivet supervisor contracts are **UNVERIFIABLE** as Beads product APIs.

### 6.4 Comparable community projects

1. **GitHub Issues + Projects** — general work tracking ([docs.github.com/issues](https://docs.github.com/en/issues)).  
2. **Task Master / other agent issue CLIs** — community agent task graphs (various repos; not audited here).

---

## 7. Trail-code (Graft)

### 7.1 Official docs / repo say

[trailhq/Trail-Code](https://github.com/trailhq/Trail-Code): “self-learning context layer for coding agents.” Code map (previously **graft**) indexes functions/callers; **learnings** capture team/agent decisions. Install: `npm install -g @trailhq/trail-code && trail init`. Website: [trailhq.com/graft](https://trailhq.com/graft). MIT. README notes `graft` commands still work.

### 7.2 API / integration surface

CLI (`trail` / `graft`), npm packages `@trailhq/trail-code` (and historical `@nanonets/graft` download badge on README). **No separate public REST “Trailcode API” documented in the README excerpt audited.**

### 7.3 Stack connection (evidenced)

Works with Claude Code, Cursor, Codex (README). **No official link** to Port/Rivet/Beads found.

### 7.4 “Code Atlas”

Prior Factory notes mention “Trail-code / Graft / Code Atlas indexer.” Multiple unrelated “Atlas” / “Code Atlas” GitHub projects exist; **no single official “Code Atlas” product** was verified as the Factory-named component. **UNVERIFIABLE.**

### 7.5 Comparable community projects

1. **Aider / RepoMap** — repo summarization for agents.  
2. **Sourcegraph Cody** context — commercial code intelligence for agents.

---

## 8. Docker & Docker Sandboxes

### 8.1 Official docs say

**Docker Sandboxes** ([docs.docker.com/ai/sandboxes](https://docs.docker.com/ai/sandboxes/)): run AI coding agents in isolated environments; local and **cloud** sandboxes; agent integrations (Claude Code, Codex, Copilot, Cursor, Devin, OpenCode, etc.); workflows for git, auth, CI/headless.

**Isolation** ([isolation layers](https://docs.docker.com/ai/sandboxes/security/isolation/)): each agent in its own **microVM** with its own Linux kernel — “Unlike containers, which share the host kernel.” Five layers: hypervisor, network, Docker Engine (in-VM), workspace, credential proxy. Credentials injected by host-side proxy (not stored as env in VM by default).

**Ordinary Docker containers** remain a separate, general Docker Engine surface (container runtime docs) — distinct from Sandboxes microVMs per Docker’s isolation wording.

### 8.2 Integration surface

| Surface | Evidence |
|---------|----------|
| CLI | `sbx` commands (install/get-started/usage trees) |
| Cloud sandboxes | `/ai/sandboxes/cloud/` docs |
| Rivet Sandbox Agent Docker provider | Rivet Sandbox Agent docker docs + image `rivetdev/sandbox-agent:0.5.2-full` |

### 8.3 Stack connection (evidenced)

| Connection | Evidence |
|------------|----------|
| Rivet Sandbox Agent ↔ Docker containers | Rivet official Docker provider docs |
| Docker Sandboxes microVM ↔ Rivet Sandbox Agent built-in provider | **UNVERIFIABLE** as a first-party Rivet provider named “Docker Cloud Sandboxes” — Rivet lists `sandbox-agent/docker` (container) and other providers; Docker Cloud Sandboxes adapter remains unproven in official Rivet provider table |

### 8.4 Comparable community projects

1. **E2B** sandboxes ([e2b.dev](https://e2b.dev/)).  
2. **Daytona** workspaces ([daytona.io](https://www.daytona.io/)) — also listed as Rivet Sandbox Agent providers.

---

## 9. Tailscale

### 9.1 Official docs say

**Tailscale Serve** ([docs](https://tailscale.com/docs/features/tailscale-serve), [CLI reference](https://tailscale.com/docs/reference/tailscale-cli/serve)): reverse-proxy / HTTP(S) server sharing a local service with devices on the **tailnet** (private). Provisions TLS for `*.ts.net` names; proxies to localhost backends; can serve files/dirs/text; optional identity headers for tailnet traffic. Distinct from **Funnel** (public internet exposure). Sources cited by Context `web-answers` against those official URLs.

### 9.2 Integration surface

Tailscale CLI (`tailscale serve` / related), Tailscale daemon, ACL/identity headers.

### 9.3 Stack connection (evidenced)

**No Tailscale doc** names Factory, Port, or Rivet. Using Serve to front a desktop Rivet/control UI is a **deployment choice** described in Factory notes — **connection pattern UNVERIFIABLE as vendor-documented stack wiring** (pattern is consistent with Serve’s general purpose).

---

## 10. GitHub (CI, webhooks, API)

### 10.1 Official docs say

**Webhooks:** Subscribe to GitHub events; push deliveries to an HTTP server; alternative to polling. Validation, redelivery, private delivery, best practices documented. ([About webhooks](https://docs.github.com/en/webhooks/about-webhooks))

**Actions:** Workflow automation for CI/CD — workflows, jobs, runners, secrets, OIDC, etc. ([Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions))

**REST / GraphQL APIs:** Full GitHub platform APIs for repos, PRs, checks, commits, Actions runs (API reference trees under docs.github.com).

### 10.2 Stack connection (evidenced)

| Connection | Evidence |
|------------|----------|
| Port ↔ GitHub | Live Port Ocean integrations `github-ocean`, `factory-pilot-github` |
| Polygraph ↔ GitHub | Polygraph product/docs list GitHub integration |
| Factory “accept only on green checks for exact SHA” | **GitHub Checks/Actions can supply that evidence**, but the *acceptance policy* is Factory/Port workflow design (live `factory_submit_evidence` / `factory_record_review_verdict` bind verdicts to SHA) — not a GitHub product feature named “Factory accept” |

### 10.3 Comparable community projects

1. **GitLab CI** webhooks/pipelines.  
2. **Buildkite** / other CI with commit-SHA gates.

---

## 11. External client: MCP Apps (iframe widgets)

### 11.1 Official docs say

**MCP Apps** (SEP-1865) extends MCP so servers deliver interactive UIs to hosts. Hosts render UIs in **sandboxed iframes**; iframe ↔ host via `postMessage`; host ↔ server via MCP. Progressive enhancement: tools still work as text if host lacks UI capability. ([Overview](https://apps.extensions.modelcontextprotocol.io/api/documents/overview.html); [spec](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx); [MCP blog](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/))

Architecture entities: Server (tools + UI resources), Host (AppBridge), View (iframe App).

### 11.2 Relation to Port plugins / iframes

Port separately documents **plugins** and **iframe/embedded URL widgets** in its interface builder (Port docs / prior capability note). MCP Apps is an **MCP ecosystem standard**; Port plugin/iframe docs are **Port product UI embedding**. Equivalence of Port iframe widgets ≡ MCP Apps hosts is **UNVERIFIABLE** without a Port doc stating MCP Apps compliance.

### 11.3 Comparable community projects

1. **MCP-UI** (pre-standard approaches called out in MCP Apps overview).  
2. OpenAI Apps / ChatGPT UI extensions (see §12 — interoperates with MCP Apps standard per OpenAI plugins docs).

---

## 12. ChatGPT plugins / extensions model

### 12.1 Official docs say

OpenAI **Plugins** for ChatGPT and Codex: installable packages combining:

- **Skills** (`SKILL.md` workflows)  
- optional **MCP server** (tools, auth, structured results)  
- optional **UI resources**  
- optional **lifecycle hooks** (Codex runtime)

ChatGPT supports the open **MCP Apps UI standard**; ChatGPT-specific extensions are optional add-ons. ([Plugin architecture](https://developers.openai.com/plugins/concepts/plugins); [Plugins home](https://developers.openai.com/plugins))

Historical “ChatGPT plugins” (2023) is a **different** product generation ([openai.com/index/chatgpt-plugins](https://openai.com/index/chatgpt-plugins)); current developer surface is the Plugins + Apps SDK docs above.

### 12.2 Stack connection (evidenced)

OpenAI docs do not name Factory/Port/Rivet. A Factory external agent *could* be packaged as a ChatGPT plugin wrapping Port MCP — **that packaging is UNVERIFIABLE as an existing published plugin**.

---

## 13. LLM gateways (OmniRoute / “OmniRouter”)

### 13.1 Official docs say

**OmniRoute** (open-source, MIT; site [omniroute.online](https://omniroute.online/); GitHub [diegosouzapw/OmniRoute](https://github.com/diegosouzapw/OmniRoute)): self-hosted AI router — OpenAI-compatible endpoint (site cites `http://localhost:20128/v1`), many providers, automatic fallback; joined Cheaper Inference per site banner.

**Naming:** Prior Factory text said “OmniRouter.” Public primary branding found is **OmniRoute**. Whether “OmniRouter” is a typo, fork, or different product is **UNVERIFIABLE**.

### 13.2 Comparable community projects

1. **LiteLLM** proxy ([docs.litellm.ai](https://docs.litellm.ai/)).  
2. **OpenRouter** ([openrouter.ai](https://openrouter.ai/)).

### 13.3 Stack connection (evidenced)

**None found** linking OmniRoute to Port/Rivet/Factory in official docs.

---

## 14. ISO/IEC/IEEE 12207:2026

### 14.1 Official catalogs say

- **ISO/IEC/IEEE 12207:2026** — *Systems and software engineering — Software life cycle processes*; Edition 2; published 2026-04; active (ISO stage 60.60). ([ISO catalog](https://www.iso.org/standard/90219.html); [IEEE SA](https://standards.ieee.org/ieee/12207/11416/))  
- Supersedes **12207:2017** (withdrawn/superseded).  
- Process groups (from IEC preview TOC): Agreement; Organizational project-enabling; Technical management; Technical processes (Acquisition through Disposal).  
- Full normative purpose/outcome/task text is **paid**; free material = abstracts + limited OBP/IEC preview.  
- Companion mapping: ISO/IEC/IEEE 12207-2:2020. Aligned with ISO/IEC/IEEE 15288:2023 for process purposes/outcomes (stated in 2026 materials / prior overview).

Detail: [`iso-12207-overview.md`](./iso-12207-overview.md) (claims index + catalog citations).

### 14.2 Stack connection (evidenced)

**None.** 12207 is a process framework standard, not software that integrates with Port/Rivet. Factory/ASDLC *alignment* claims beyond shared lifecycle vocabulary are **UNVERIFIABLE** without a documented mapping artifact.

---

## 15. Other integrations named in Project store docs

| Named component | Evidence status |
|-----------------|-----------------|
| **Langfuse** | Official: open-source observability / prompts / evaluation; OTel; SDKs. ([langfuse.com/docs](https://langfuse.com/docs)). Factory OTel→Langfuse wiring = design **UNVERIFIABLE** as prebuilt Rivet export. |
| **Pi Durable** | Rivet changelog/docs (durable model/tool checkpoints) — see Rivet product docs / evaluation export citations. |
| **CopilotKit / AG-UI** | Re-verified in §§19–22. Official AG-UI docs list CopilotKit as a 1st-party client; **Rivet is not listed** among AG-UI supported agent frameworks on [docs.ag-ui.com/introduction](https://docs.ag-ui.com/introduction) (Supported Integrations tables). Rivet-native AG-UI support remains **UNVERIFIABLE**. |
| **Turso / libSQL** | LogicSRC credentials app uses Turso (monorepo note); Factory “approval ledger” = optional design. Port run/audit as receipt store = Port capability (audit MCP), not Turso. |
| **Vercel / Convex** | Live Port Ocean integrations present. Full Vercel product surface: §20. |
| **Linear** | Live Port integration present. |
| **Cloudflare R2 / S3** | General object storage; Rivet 3.0/S3 persistence discussed in Rivet blogs — Factory R2 choice **UNVERIFIABLE** as tested. |
| **agentOS external sandboxes registry** | Rivet agentOS docs list external sandbox adapters (beta) — see agentOS sandboxes/registry docs. |
| **Clerk** | Explicitly **out of scope** by Johnny decision in prior notes; Port External Interfaces cover person OAuth. No live Clerk dependency observed in Port MCP reads. |

---

## 16. Cross-stack wiring matrix (evidence only)

| Edge | Evidenced? | Basis |
|------|------------|-------|
| Human UI → Port OAuth → Port API/MCP | **Yes** | Port External Interfaces + live OAuth app |
| Agent → Port MCP → workflows | **Yes** | Expose-as-tool docs + live factory_* workflows |
| Port workflow → WEBHOOK → customer HTTP | **Yes** (generic) | Port webhook docs |
| Port → Rivet (first-party) | **No** | UNVERIFIABLE |
| Rivet Actor → Sandbox Agent HTTP | **Yes** | Rivet Sandbox Agent multiplayer/orchestration docs |
| Sandbox Agent → Docker container | **Yes** | Rivet Docker provider docs |
| Sandbox Agent → Docker Sandboxes microVM | **No** | UNVERIFIABLE as built-in provider |
| Beads ready/claim → Rivet supervisor | **No** | UNVERIFIABLE product coupling |
| Polygraph session → Rivet WorkAttempt | **No** | UNVERIFIABLE product coupling |
| GitHub checks → Port evidence workflows | **Partial** | Port live tools bind SHA evidence; GitHub supplies CI events/APIs |
| Tailscale Serve → Rivet UI | **Pattern only** | Serve docs general; no vendor Factory guide |
| LogicSRC / ISO 12207 → runtime | **No** | Specs/standards only |
| OmniRoute → Factory LLM path | **No** | UNVERIFIABLE |
| MCP Apps host in Developer OS | **No** | Spec exists; Factory host implementation UNVERIFIABLE |
| Next.js App Router / RSC / Route Handlers as web shell | **Yes** (product fit) | Next.js official App Router docs (§19) — Factory “Developer OS = Next.js” is Project design using that documented surface |
| Vercel deploy / preview URL for external client | **Yes** (hosting) | Vercel deploy + preview docs (§20); live Port Ocean `vercel-ocean`; live Observatory redirect on `*.vercel.app` |
| Vercel MCP (platform) ↔ Factory control plane | **Partial** | Official Vercel MCP at `https://mcp.vercel.com` (§20.3); Port MCP connectors exist separately; Factory wiring UNVERIFIABLE |
| AG-UI ↔ Rivet Actors (first-party) | **No** | Rivet absent from AG-UI supported-frameworks tables (§21) |
| CopilotKit as Factory kernel streaming path | **Deferred by Project** | Master spec mandates Rivet native; CopilotKit/AG-UI deferred — not a vendor prohibition |

---

## 17. Top UNVERIFIABLE gaps (priority)

1. **Port↔Rivet first-party integration** — only generic Port WEBHOOK/Ocean backends are documented; no Rivet connector page found.  
2. **Rivet “claim lease / CAS” product API** — does not exist in docs; Factory `WorkAttempt` leases are application design.  
3. **Completable queue retry semantics** — Rivet docs conflict unresolved.  
4. **Polygraph “eval model / APIs”** — official Polygraph is cross-repo meta-harness; eval/provenance APIs not found.  
5. **Beads↔Rivet / Polygraph↔Rivet contracts** in engineering spec — not Beads/Polygraph product APIs.  
6. **Code Atlas** — no verified official product matching the name in Factory notes.  
7. **Docker Cloud Sandboxes as Rivet Sandbox Agent provider** — not listed among documented built-in providers audited.  
8. **`factory-claims-verification.md`** — missing from store.  
9. **OmniRouter vs OmniRoute** naming / Factory adoption — unverified.  
10. **ISO 12207 full normative text** — paid; this audit uses catalog + IEC preview TOC only.  
11. **ChatGPT plugin / MCP Apps host for Factory Developer OS** — standards exist; no published Factory implementation verified.  
12. **End-to-end Factory pilot** (desktop Docker + Tailscale + Port OAuth + Rivet + Beads) — described in engineering spec; **not integration-proven** in this store.  
13. **Rivet ↔ AG-UI first-party adapter** — AG-UI Supported Integrations tables do not list Rivet ([introduction](https://docs.ag-ui.com/introduction)); engineering-spec “explicit Rivet→AG-UI adapter” remains design.  
14. **Port External Interfaces OAuth as Authorization Server for a Vercel-hosted MCP server** — Vercel MCP deploy docs require *an* AS issuer URL + token verify; Port-as-AS wiring is **UNVERIFIABLE** in Port/Vercel docs audited here.

---

## 18. Source index (primary)

| System | Primary sources used |
|--------|----------------------|
| Port | https://docs.port.io/llms.txt ; External interfaces; Expose workflows as tools; API permissions; live Port MCP reads 2026-10-28 |
| Rivet | https://rivet.dev/llms.txt ; Actors queues/actions; Sandbox Agent docs; agentOS limitations; Context7 `/rivet-dev/actors`, `/websites/rivet_dev_sandbox-agent` |
| LogicSRC | https://logicsrc.com/ (about, specs, asdlc, openprd); https://github.com/profullstack/logicsrc |
| Polygraph | https://trypolygraph.com/ ; https://docs.trypolygraph.com/ |
| Beads | https://beads.gascity.com/llms.txt ; https://github.com/gastownhall/beads |
| Trail-code | https://github.com/trailhq/Trail-Code |
| Docker Sandboxes | https://docs.docker.com/ai/sandboxes/ ; isolation layers page |
| Tailscale | https://tailscale.com/docs/features/tailscale-serve ; CLI serve reference |
| GitHub | https://docs.github.com/en/webhooks/about-webhooks ; Actions docs |
| MCP Apps | https://apps.extensions.modelcontextprotocol.io/ ; SEP-1865 apps.mdx |
| OpenAI Plugins | https://developers.openai.com/plugins ; concepts/plugins |
| OmniRoute | https://omniroute.online/ ; https://github.com/diegosouzapw/OmniRoute |
| ISO 12207 | https://www.iso.org/standard/90219.html ; IEEE SA 12207/11416 ; IEC preview TOC |
| Langfuse | https://langfuse.com/docs |
| Next.js | https://nextjs.org/docs ; App Router; Server/Client Components; Route Handlers; Context7 `/websites/nextjs` |
| Vercel | https://vercel.com/docs/projects/deploy-from-cli ; deployments / preview promote; MCP deploy + OAuth; Vercel MCP (`mcp.vercel.com`); Context7 `/websites/vercel` |
| AG-UI | https://docs.ag-ui.com/introduction ; https://docs.ag-ui.com/agentic-protocols ; https://docs.ag-ui.com/llms.txt ; Context7 `/websites/ag-ui` |
| CopilotKit | https://docs.copilotkit.ai/concepts/generative-ui-overview ; MCP Apps generative UI; AG-UI usage docs; Context7 `/copilotkit/copilotkit`, `/llmstxt/copilotkit_ai_llms_txt` |

**Prior Project notes** were used only as a **claims checklist**, not as evidence of vendor behavior.

---

## 19. Next.js (App Router, RSC, Route Handlers — external client fit)

### 19.1 Official docs say

**Product:** “Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations.” ([nextjs.org/docs](https://nextjs.org/docs); Context7 `/websites/nextjs`)

**App Router:** File-system based router using React Server Components, Suspense, and Server Functions. ([docs/app](https://nextjs.org/docs/app))

**React Server Components (RSC):** Default for layouts and pages in the App Router. Server Components render on the server, can fetch data directly, do not add to the client JS bundle, and cannot use state or browser APIs. Rendered into an **RSC Payload** (serialized Server Component tree + Client Component placeholders/props). Client Components (`"use client"`) add interactivity / browser APIs. ([Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components); glossary)

**Route Handlers (API routes in App Router):** Defined in `route.js` / `route.ts` under the `app` directory; use standard Web `Request`/`Response` APIs (e.g. `export async function GET(request: Request)`). Documented as Backend-for-Frontend public HTTP endpoints (e.g. `/app/api/...`). ([Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers); [file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route); [BFF guide](https://nextjs.org/docs/app/guides/backend-for-frontend))

### 19.2 API / integration surface

| Surface | Evidence |
|---------|----------|
| App Router file conventions (`app/`, layouts, pages) | [docs/app](https://nextjs.org/docs/app) |
| Server / Client Components | [server-and-client-components](https://nextjs.org/docs/app/getting-started/server-and-client-components) |
| Route Handlers | [route handlers](https://nextjs.org/docs/app/getting-started/route-handlers) |
| Data fetching / cache / revalidate in Server Components | [app-router-migration](https://nextjs.org/docs/app/guides/migrating/app-router-migration) |

### 19.3 Stack connection (evidenced)

| Connection | Evidence |
|------------|----------|
| External client shell = Next.js | **Project decision** (master / engineering specs) — Next.js docs establish the *capability* for a full-stack React host with RSC + HTTP Route Handlers; they do **not** name Factory/Port/Rivet |
| Port OAuth callback as Next.js Route Handler | **Pattern fit only** — Port External Interfaces require a redirect URI; Next.js Route Handlers are documented HTTP endpoints. Live org example: Harness Observatory callback `https://harness-observatory.vercel.app/api/auth/callback` (Port MCP) — proves a Vercel/Next-style `/api/auth/callback` path *in use for Observatory*, not a Factory app |
| CopilotKit runtime on Next.js | CopilotKit docs show Next.js `app/api/copilotkit` Route Handlers (`createCopilotRuntimeHandler`) — vendor-documented, optional path (§22) |

### 19.4 Impact on locked decisions

| Locked decision (Project) | Impact from official Next.js docs |
|---------------------------|-----------------------------------|
| Developer OS = Next.js | **Compatible** with documented App Router + RSC + Route Handlers surface |
| Port owns auth (External Interface OAuth); no Clerk | Next.js docs do **not** prescribe an IdP — Route Handlers can host OAuth callbacks; Port remains the auth product per Port docs |
| Mutations via Port actions; UI is display channel | Next.js BFF/Route Handlers *can* proxy; whether Factory uses them for privileged control is Project design, not a Next.js requirement |
| Streaming = Rivet native (not CopilotKit) for kernel | Next.js does not mandate CopilotKit; RSC/streaming SSR is orthogonal to Rivet Actor realtime |

### 19.5 Comparable community projects

1. **Remix** — full-stack React router ([remix.run](https://remix.run/)).  
2. **TanStack Start** — full-stack React framework ([tanstack.com/start](https://tanstack.com/start)).

---

## 20. Vercel (deploy, preview URLs, OAuth, MCP)

### 20.1 Official docs say

**Deploy:** CLI workflow documents `vercel link` → `vercel deploy` (preview) → `vercel deploy --prod` (production); preview verification via `vercel curl --deployment <preview-url>` and `vercel logs`. ([Deploy from CLI](https://vercel.com/docs/projects/deploy-from-cli); Context7 `/websites/vercel`)

**Preview vs production:** Omitting `target` on create-deployment yields a **preview** deployment; `target: "production"` for production (Vercel MCP `create_deployment` docs). Promote preview → production documented (`vercel promote`, list by `--environment preview`). ([promote-preview-to-production](https://vercel.com/docs/deployments/promote-preview-to-production); MCP create_deployment)

**Preview URLs:** Unique deployment URLs (e.g. `*.vercel.app`); request header `x-vercel-deployment-url` is the unique deployment, “not the preview URL or production domain.” Deployment Protection + automation bypass documented for agent/CI access to protected previews. ([request headers](https://vercel.com/docs/headers/request-headers); [automated agent access](https://vercel.com/docs/deployment-protection/automated-agent-access))

**OAuth (MCP servers on Vercel):** Deploy MCP servers with `mcp-handler` in a Next.js App Router app; secure with `withMcpAuth` + bearer verify; expose `/.well-known/oauth-protected-resource` via `protectedResourceHandler` pointing at an **Authorization Server issuer URL** supplied by the deployer. Package “does not issue tokens or run an authorization server.” ([Deploy MCP servers to Vercel](https://vercel.com/docs/mcp/deploy-mcp-servers-to-vercel))

**Vercel MCP (platform):** Official MCP endpoint `https://mcp.vercel.com` — search docs, manage teams/projects/deployments, Web Analytics; Cursor config example in Vercel docs. Distinct from *user-deployed* MCP servers on Vercel Functions. ([Vercel MCP](https://vercel.com/docs/agent-resources/vercel-mcp); getting-started)

### 20.2 API / integration surface

| Surface | Evidence |
|---------|----------|
| CLI deploy / promote / logs / curl | Deploy-from-CLI + deployments docs |
| REST deployments API | e.g. `GET /v7/deployments` (docs sitemap / API) |
| Platform MCP | `https://mcp.vercel.com` + tool catalog (deployments, projects, domains, …) |
| User MCP on Functions | `mcp-handler` + `/api/mcp` Route Handler |
| OAuth metadata for MCP | `protectedResourceHandler` / `withMcpAuth` |

### 20.3 Stack connection (evidenced)

| Connection | Evidence |
|------------|----------|
| Port ↔ Vercel | Live Port Ocean integration `vercel-ocean` (§2.3) |
| External UI hosted on Vercel | Live Harness Observatory redirect on `harness-observatory.vercel.app` |
| Rivet Sandbox Agent ↔ Vercel Sandbox | Rivet Sandbox Agent docs list `sandbox-agent/vercel` provider ([rivet-sandbox-agent.md](./rivet-sandbox-agent.md)) — **sandbox runtime**, not the Developer OS host |
| Factory Developer OS on Vercel | **UNVERIFIABLE** as a published Factory project; pattern matches Vercel+Next.js docs generally |

### 20.4 Impact on locked decisions

| Locked decision (Project) | Impact from official Vercel docs |
|---------------------------|----------------------------------|
| External client hosted; Port OAuth redirect | Vercel preview/production URLs are valid HTTPS hosts for OAuth redirect URIs; AS remains Port External Interfaces — Vercel MCP OAuth helpers are for **MCP resource** auth, not a replacement for Port person OAuth |
| MCP Apps or Port iframes for integrations | Vercel can *host* an MCP server (mcp-handler); MCP Apps UI standard is separate (§11 / CopilotKit MCP Apps). No doc equates Vercel hosting with MCP Apps iframes |
| Do not reuse Harness Observatory OAuth | Observatory’s Vercel URL is evidence of a *different* product’s redirect — not a Factory authorization |
| FREEMIUM External Interface limit = 1 | Vercel docs do not change Port plan limits |

### 20.5 Comparable community projects

1. **Netlify** — preview deploys / Git-connected hosting.  
2. **Cloudflare Pages** — frontend hosting + Workers.

---

## 21. AG-UI (definition; relation to MCP Apps / iframes)

### 21.1 Official docs say

**Definition:** AG-UI (Agent–User Interaction Protocol) is “an open, lightweight, event-based protocol that standardizes how AI agents connect to user-facing applications.” Bi-directional: agent state, UI intents, user interactions. Builds on HTTP/WebSockets as an abstraction for long-running, streaming, multimodal agent UIs. ([docs.ag-ui.com/introduction](https://docs.ag-ui.com/introduction); [docs.ag-ui.com](https://docs.ag-ui.com/); Context7 `/websites/ag-ui`)

**Protocol stack (official complementary trio):**

| Layer | Protocol | Purpose (vendor wording) |
|-------|----------|--------------------------|
| Agent ↔ User | **AG-UI** | Connect agents to user-facing applications |
| Agent ↔ Tools & Data | **MCP** | Connect agents to tools, workflows, data |
| Agent ↔ Agent | **A2A** | Inter-agent coordination |

([introduction](https://docs.ag-ui.com/introduction); [agentic-protocols](https://docs.ag-ui.com/agentic-protocols))

**≠ A2UI:** A2UI is a generative UI *specification* for delivering UI widgets; AG-UI is the Agent↔User *interaction protocol*. They work together. (Same introduction note.)

**Relation to MCP / MCP Apps / iframes:**

- AG-UI and MCP are **complementary** layers; a single agent “can and often does use all 3” (AG-UI, MCP, A2A). ([agentic-protocols](https://docs.ag-ui.com/agentic-protocols))
- AG-UI documents **handshakes** that let AG-UI front for MCP- and A2A-supporting agents. ([agentic-protocols](https://docs.ag-ui.com/agentic-protocols))
- Generative UI specs named as working with AG-UI: **MCP-UI, Open JSON UI, A2UI**; AG-UI Supported Integrations table lists **MCP Apps** under Generative UI (Supported). ([agentic-protocols](https://docs.ag-ui.com/agentic-protocols); [introduction](https://docs.ag-ui.com/introduction) Supported Integrations)
- **MCP Apps** (MCP ecosystem, §11) = servers ship tools + UI resources; hosts render UI in **sandboxed iframes**. That is MCP Apps’ own architecture — AG-UI docs treat MCP Apps as a generative-UI spec *compatible with* AG-UI, not as a synonym for AG-UI.

**Transport:** Standard HTTP client `HttpAgent` — POST `RunAgentInput`, stream `BaseEvent` (HTTP SSE and binary protocol documented). ([architecture](https://docs.ag-ui.com/concepts/architecture))

**Rivet:** Not listed in AG-UI “Supported Integrations” agent-framework tables on the introduction page audited 2026-10-28.

### 21.2 API / integration surface

| Surface | Evidence |
|---------|----------|
| Event protocol / `BaseEvent` stream | docs.ag-ui.com events / llms-full |
| `HttpAgent` / `@ag-ui/core` | architecture + SDK pages |
| Clients (e.g. CopilotKit) | introduction Clients table |
| Generative UI: A2UI, MCP Apps | introduction Generative UI table |

### 21.3 Stack connection (evidenced)

| Connection | Evidence |
|------------|----------|
| AG-UI ↔ MCP (tools) | Complementary protocol docs |
| AG-UI ↔ MCP Apps (UI widgets / iframes) | AG-UI lists MCP Apps as supported generative UI; MCP Apps spec defines iframe host |
| AG-UI ↔ CopilotKit | CopilotKit listed as 1st-party AG-UI client |
| AG-UI ↔ Rivet | **UNVERIFIABLE** first-party — Rivet absent from AG-UI supported frameworks list |
| AG-UI ↔ Port | **None found** in AG-UI or Port docs |

### 21.4 Impact on locked decisions

| Locked decision (Project) | Impact from official AG-UI docs |
|---------------------------|---------------------------------|
| Kernel streaming = Rivet native; CopilotKit/AG-UI **deferred** | AG-UI is an optional interaction protocol; deferral does not conflict with AG-UI’s documented role. No official Rivet adapter found |
| Integrations = MCP Apps **or** Port iframes | MCP Apps remain the MCP-standard iframe UI path (§11); AG-UI may *carry* MCP Apps generative UI when using an AG-UI client — not required to use MCP Apps |
| UI / AG-UI are display channels; privileged control via Port | AG-UI docs describe frontend↔agent interaction — they do **not** claim to replace Port OAuth/RBAC/governance |

### 21.5 Comparable community projects

1. **MCP Apps / MCP-UI** — tool-adjacent UI in hosts (iframe).  
2. **OpenAI Apps / Plugins UI resources** — ChatGPT UI extension model (§12).

---

## 22. CopilotKit (generative UI; agent-to-UI bridge vs MCP Apps)

### 22.1 Official docs say

**Role:** Open-source framework / agentic application platform for building AI copilots into applications; uses **AG-UI** to abstract the connection between apps and agents (streaming, frontend tools, shared state, React/Angular components). ([CopilotKit AG-UI docs](https://docs.copilotkit.ai/); Context7 `/copilotkit/copilotkit`)

**Generative UI:** “the set of primitives that let an agent decide what appears on the screen.” Six primitives documented: Components as Tools; Tool Call Rendering; State Rendering; Reasoning; A2UI; **MCP Apps**. ([generative-ui-overview](https://docs.copilotkit.ai/concepts/generative-ui-overview))

**Spectrum (vendor wording):** Same frontend/runtime/**AG-UI protocol**; choose per feature:

- **Controlled** — app-authored components (Components as Tools, tool/state/reasoning rendering)  
- **Declarative** — A2UI schemas  
- **Open-Ended** — **MCP Apps**: “Embed UI that an MCP server ships alongside its tools, rendered in a sandboxed iframe. No frontend renderer required.”

([generative-ui-overview](https://docs.copilotkit.ai/concepts/generative-ui-overview); generative-ui README via Context7)

**MCP Apps vs AG-UI bridge (evidence distinction):**

| Concern | Official framing |
|---------|------------------|
| **AG-UI** | Bidirectional runtime interaction protocol (agent ↔ application events) — CopilotKit’s transport/abstraction |
| **MCP Apps** | MCP servers expose tools + UI resources; CopilotKit fetches/renders UI in **sandboxed iframes** (built-in `MCPAppsActivityRenderer`); middleware `@ag-ui/mcp-apps-middleware` | ([mcp-apps](https://docs.copilotkit.ai/learn/generative-ui/specs/mcp-apps); generative-ui-overview) |

CopilotKit can use AG-UI **without** MCP Apps (controlled/declarative primitives) and can embed MCP Apps **as one generative-UI mode** on top of the same runtime.

**Next.js integration:** Documented `CopilotRuntime` + `createCopilotRuntimeHandler` on App Router API routes (`/api/copilotkit`). (Context7 CopilotKit quickstarts)

### 22.2 API / integration surface

| Surface | Evidence |
|---------|----------|
| `@copilotkit/react-core` / `CopilotKitProvider` | CopilotKit reference docs |
| `@copilotkit/runtime` Route Handlers | Next.js quickstart patterns |
| AG-UI agents (`HttpAgent`, framework bridges) | CopilotKit + `@ag-ui/*` packages |
| MCP Apps middleware | `@ag-ui/mcp-apps-middleware`; `mcpApps.servers` / `.use(MCPAppsMiddleware)` |

### 22.3 Stack connection (evidenced)

| Connection | Evidence |
|------------|----------|
| CopilotKit ↔ AG-UI | Official “How CopilotKit uses AG-UI” + 1st-party client listing |
| CopilotKit ↔ MCP Apps | Official generative UI primitive + mcp-apps docs |
| CopilotKit ↔ Next.js | Official Route Handler examples |
| CopilotKit ↔ Rivet | **UNVERIFIABLE** — no Rivet connector page found in CopilotKit/AG-UI sources audited |
| CopilotKit ↔ Port | **None found** |

### 22.4 Impact on locked decisions

| Locked decision (Project) | Impact from official CopilotKit docs |
|---------------------------|--------------------------------------|
| CopilotKit/AG-UI **deferred**; Rivet native streaming **mandate** for kernel | Vendor docs do not require CopilotKit for a Next.js+Port client. Deferral is consistent with treating CopilotKit as optional UI infrastructure |
| MCP Apps **or** Port iframes for Vercel/Convex/Port/Docker integrations | CopilotKit’s MCP Apps primitive is one *host* implementation of MCP Apps iframes — not the only possible host, and not required if Port iframes/plugins are used instead (§11.2) |
| Display channels ≠ privileged control | CopilotKit frontend tools / generative UI are app-layer UI; Port remains governance/auth per Port docs |

### 22.5 Comparable community projects

1. **Vercel AI SDK UI** — chat/streaming React helpers ([sdk.vercel.ai](https://sdk.vercel.ai/)).  
2. **assistant-ui** — open-source AI chat UI primitives (community).
