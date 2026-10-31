# Workspace skills & plugins inventory

**Status:** Authoritative local-install inventory (filesystem scan)  
**Date:** 2026-10-28  
**Scope:** Skills, Cursor plugins, plugin-shipped MCP declarations, and related local artifacts on this Cloud Agent VM.  
**Not in scope as “installed skills”:** Live runtime MCP *namespaces* available to agents (auth state, tool lists). Those are **coordinator-side**; this doc inventories **local files only** and lists plugin-declared MCP endpoints without claiming they are connected.

## Method

Searched:

| Root | Result |
|------|--------|
| `/home/ubuntu/.cursor/skills-cursor` | 17 builtin `SKILL.md` packages |
| `/home/ubuntu/.cursor/plugins/cache/cursor-public` | 67 marketplace plugin cache dirs |
| `/home/ubuntu/.cursor/plugins/local` | **Absent** (no local plugins dir on this VM) |
| `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/skills` | ASDLC knowledge-base skill |
| `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/artifacts/elephant-goldfish-model` | EGM plugin copy (7 skills) |
| `/agent` | Empty of skills/plugins (only `agent-tools/`) |
| Other `.cursor` skill dirs under `/home/ubuntu` | Only `skills-cursor` + plugin cache |
| VS Code / Cursor `extensions/` | **Not present** on this VM |

Frontmatter/`plugin.json` parsed for name + description; Factory coverage refined with full-text keyword search across ~8.7k markdown/json files under those roots.

## Counts (local)

| Class | Count |
|-------|------:|
| Marketplace plugins (cache) | **67** |
| Skills under marketplace plugins | **468** |
| Builtin Cursor skills (`skills-cursor`) | **17** |
| Project-store skill packages (`skills/`) | **1** (ASDLC; 68 markdown articles) |
| EGM skills (store `artifacts/` copy) | **7** |
| Plugins with MCP `mcp.json` / `.mcp.json` declarations | **~45 unique server names** (see § MCP) |
| Cursor/VS Code extensions | **0** found |
| Local plugins (`~/.cursor/plugins/local`) | **0** (EGM install report claimed `local/egm/` — **not on this VM**) |

**Approximate unique skill packages agents can load from disk:** 17 + 468 + 1 ASDLC + 7 EGM ≈ **493** (some plugin “skills” are samples/fixtures inside compound-engineering).

---

## Factory coverage matrix

Legend: **Covered** = dedicated skill/plugin; **Partial** = adjacent/incidental; **Gap** = nothing installed covers it.

| Factory topic | Status | What covers it (local) |
|---------------|--------|-------------------------|
| Port | **Covered** | `port` plugin (12 skills) + `port-eu`/`port-us` MCP decls |
| Rivet | **Gap** | No skill/plugin/MCP declaration mentions Rivet |
| LogicSRC | **Gap** | No LogicSRC product skill; ASDLC KB is conceptual only |
| Polygraph | **Gap** | No hits |
| Beads | **Gap** | No hits |
| Trailcode | **Gap** | No hits |
| Docker | **Covered** | `docker-skills` (11); incidental elsewhere |
| Tailscale | **Partial** | Incidental mentions in `pstack`, CE, superpowers, `env-setup` — no Tailscale skill |
| GitHub | **Covered** | compound-engineering PR skills, Agent SDK github, Port integrations, etc. |
| MCP Apps | **Covered** | `manufact` / mcp-use skills + docs MCP |
| AG-UI | **Gap** | No hits |
| CopilotKit | **Gap** | No hits |
| Next.js | **Covered** | Vercel + Cloudflare Next skills; Clerk Next patterns |
| Vercel | **Covered** | `vercel` plugin (49 skills) + Vercel MCP |
| ChatGPT plugins | **Gap** | No dedicated ChatGPT-plugin skill (noise hits only) |
| LLM gateways | **Partial** | Vercel `ai-gateway`; Treg “OpenRouter for tools”; not a general multi-provider LLM gateway skill |
| ISO 12207 | **Gap** | No skill (Project has `docs/iso-12207-overview.md` only) |
| agentic SDLC | **Covered** | Port + store `skills/asdlc` |
| specs | **Covered** | ASDLC, EGM, CE, Superpowers, Notion `spec-to-implementation` |
| IR (intermediate representation) | **Gap** | No hits for compiler/IR tooling |
| diamond / compound engineering | **Covered** | `compound-engineering` plugin; ASDLC `agentic-double-diamond` + `compound-engineering` / `compound-loop` |
| OAuth | **Partial** | Many OAuth MCP connect skills; **Clerk** plugin (Factory notes drop Clerk in favor of Port OAuth) — no Factory-specific Port OAuth app skill |
| sandboxing | **Covered** | Docker sandboxes, Vercel sandbox, Cloudflare sandbox skills |
| evals | **Covered** | Agent SDK evals/hillclimb; Vercel benchmarks; HF; CE retune |
| scorecards | **Covered** | Port terraform/context-lake skills |
| visibility | **Covered** | Langfuse, OpenSearch observability, OTEL Agent SDK, Vercel/Cloudflare observability skills |

### Top gaps (Factory needs; nothing covers)

1. **Rivet** — durable execution / actors / queues / Sandbox Agent harness  
2. **Beads** — readiness / dependency / claim authority  
3. **Polygraph** — multi-repo coding coordination / provenance  
4. **Trailcode** — code map for agents  
5. **LogicSRC** — product schemas/CLI/SDK/MCP (beyond generic ASDLC concepts)  
6. **AG-UI** + **CopilotKit** — agent–UI protocol / CopilotKit integration  
7. **ISO 12207** — lifecycle process skill (only a Project doc exists)  
8. **IR** — intermediate representation / compilation pipeline for the factory  
9. **ChatGPT plugins** surface — no install  
10. **Tailscale** — no first-class skill (Serve/private networking)

---

## Overlaps (same job, multiple installs)

| Job | Overlapping local installs |
|-----|----------------------------|
| Web search / scrape | bright-data, exa, firecrawl, context-dev, parallel, apify, browserless, playwright, browse, monid, orthogonal, treg, ddg-search |
| Design / UI references | mobbin, refero, 21st, shadcn, impeccable, remotion (video) |
| Spec-driven / plan-build loops | compound-engineering, superpowers, asdlc, egm (artifacts), pstack, notion spec-to-implementation |
| Auth / identity | clerk (skills+MCP) vs Factory preference for **Port OAuth**; many plugins’ OAuth connect flows |
| Observability / evals | langfuse, opensearch, vercel metrics, cloudflare, agent-sdk-otel/evals, HF evals |
| Sandboxes | docker-skills sandboxes, vercel-sandbox, cloudflare sandbox-* |
| B2B enrichment | apollo, crustdata, fullenrich, monid, orthogonal, treg |
| MCP governance | runlayer vs inventing shadow MCPs (rules present) |

---

## 1. Builtin Cursor skills (`/home/ubuntu/.cursor/skills-cursor`)

### `agent-sdk-cli`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-cli/SKILL.md`
- **Does:** Guardrails for running the BDK CLI from an agent: --json output, exit codes, --fields and --limit, --dry-run before every change, --yes only after the person approves, secrets off argv, and command output as untrusted data. Use before any npx --yes "@grok/agent-sdk@0.4.0" command.

### `agent-sdk-create-agent`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-create-agent/SKILL.md`
- **Does:** Scaffold a new Agent SDK agent: short AskQuestion interview, then verify a turn and hand off to hillclimb. Use when creating a new agent. Ask only what the invoking message left open.

### `agent-sdk-debug`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-debug/SKILL.md`
- **Does:** Diagnose a misbehaving local Agent SDK agent: blank playground, missing sessions, failed reads, webhook 401s, 403/409. Use when a project runs but behaves wrong locally.

### `agent-sdk-deploy`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-deploy/SKILL.md`
- **Does:** Deploy or redeploy an Agent SDK project to Cursor-managed hosting with an attached service account. Use when asked to deploy, redeploy, publish, or update a hosted Agent SDK agent.

### `agent-sdk-evals`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-evals/SKILL.md`
- **Does:** Author and run defineEval cases. Use when writing, fixing, seeding, or hillclimbing evals. Ask whether to generate samples or take uploaded data. Materialize API-backed fixtures first.
- **Factory:** evals

### `agent-sdk-framework-map`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-framework-map/SKILL.md`
- **Does:** Orient on Agent SDK layout, local runtime, sessions, and invariants (Node not Bun, root evals/, typecheck after tsx, memory in host.kv). Use when creating, editing, or running a project with bot/agent.ts.

### `agent-sdk-github`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-github/SKILL.md`
- **Does:** Build and test GitHub-driven Agent SDK agents: githubChannel hooks (auth turn vs host task), cursorAccount / --cursor-events, and local test tiers (fixtures, replay, forward). Use when wiring GitHub events or debugging delivery.
- **Factory:** GitHub

### `agent-sdk-hillclimb`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-hillclimb/SKILL.md`
- **Does:** Improve one existing Agent SDK agent: pin fixtures, measure, change one lever, remeasure, lock the win with an eval. Use when an agent already runs and needs better results.
- **Factory:** evals

### `agent-sdk-mcp-auth`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-mcp-auth/SKILL.md`
- **Does:** Authorize host MCP OAuth for defineConnection({ url, oauth: true }): npx --yes "@grok/agent-sdk@0.4.0" mcp oauth, local tokens, advertiseTools, egress, and the hosted cursorAccount path. Use when wiring or debugging MCP auth.
- **Factory:** MCP/OAuth

### `agent-sdk-migrate-v2`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-migrate-v2/SKILL.md`
- **Does:** Migrate an Agent SDK project from hosted architecture v1 to v2: upgrade the package, remove v1-only code, and redeploy. Applies only to projects built during the early alpha, which depend on `@cursor/july`, run the legacy CLI, or set architecture "v1".
- **Factory:** Cloud Agent env

### `agent-sdk-otel`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-otel/SKILL.md`
- **Does:** Wire OpenTelemetry export with OTEL_* environment variables. Use when adding a collector, headers, or metrics temporality.
- **Factory:** visibility

### `agent-sdk-setup-slack`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/agent-sdk-setup-slack/SKILL.md`
- **Does:** Wire Slack to an Agent SDK agent. Mint a dedicated Socket Mode app with slack create, then doctor and smoke. Use slack init --manual only when the user owns the Slack app. Use when adding Slack.

### `canvas`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/canvas/SKILL.md`
- **Does:** A Cursor Canvas is a live React app that the user can open beside the chat. You MUST use a canvas when the agent produces a durable standalone artifact outside the transcript that the user may revisit, refine, or share — reports, dashboards, documents, data-heavy investigations, or repeatable tools. Especially prefer a canvas when presenting results from MCP tools (Datadog, Databricks, Linear, Sentry, Slack, etc.) where a durable artifact is the deliverable — render it in a rich canvas rather than dumping it into a large markdown table or code block. Do not use a canvas for an immutable visual output that belongs inside the transcript. You MUST also read this skill whenever you create, edit, or debug any .canvas.tsx file.

### `env-setup`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/env-setup/SKILL.md`
- **Does:** Explain, inspect, configure, and troubleshoot Cloud Agent development environments. Use when the user asks about environment setup, changing/improving the environment, or triggering/testing a build.
- **Factory:** Cloud Agent env

### `migrate-to-builds`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/migrate-to-builds/SKILL.md`
- **Does:** Verify that a Cloud Agent environment works with prebuilt environment builds and recommend any required changes. Use when the user wants to test build compatibility or follow the Builds page Verify with Agent flow.
- **Factory:** Cloud Agent env

### `subscribe`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/subscribe/SKILL.md`
- **Does:** Wait for external events (GitHub or Origin CI/PR, Slack messages, Linear issues) by subscribing with the cursor-subscriptions MCP tools instead of polling.

### `walkthrough-artifacts`
- **Path:** `/home/ubuntu/.cursor/skills-cursor/walkthrough-artifacts/SKILL.md`
- **Does:** Create walkthrough artifacts (screenshots and screen recordings) that prove code changes work. Use when finishing tested changes and uploading demo evidence for the user.

---

## 2. Project-store skills

### `asdlc` (ASDLC knowledge base)

- **Path:** `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/skills/asdlc/`
- **Does:** Authoritative concepts/patterns/practices for Agentic SDLC (64 articles per skill header; 68 `.md` files on disk).
- **Factory:** agentic SDLC, specs, diamond (`patterns/agentic-double-diamond.md`), compound engineering concepts — **not** LogicSRC product tooling, **not** ISO 12207 process mapping skill.
- **Key paths:** `concepts/`, `patterns/`, `practices/`, `SKILL.md`

### EGM (Elephant-Goldfish Model) — store artifact, not local plugin

- **Path:** `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/artifacts/elephant-goldfish-model/`
- **plugin.json name:** `egm`
- **Does:** Spec draft + fresh-context Goldfish review + drift report.
- **Skills:** `egm-bootstrap`, `egm-brainstorm`, `egm-draft`, `egm-drift-report`, `egm-resolve`, `egm-review`, `egm-review-loop`
- **Factory:** specs / review loops
- **Caveat:** Prior install note put primary copy at `~/.cursor/plugins/local/egm/` — **that path does not exist on this VM**. Only the Project-store artifact (+ report) is present. `/agent/elephant-goldfish-model/` also absent.

---

## 3. Marketplace plugins (all 67)

Paths are under `/home/ubuntu/.cursor/plugins/cache/cursor-public/<id>/<version>/`.

| Plugin | Cache ID | Skills | What it does | Factory relevance |
|--------|----------|-------:|--------------|-------------------|
| `21st` | `74436408` | 1 | Find UI components and themes, retrieve their code, and use hosted 21st AI when enabled. | UI components MCP |
| `adapter-mind` | `70141458` | 1 | Adapter Mind brings your world, and the tribal knowledge contained within it, to Grok Bot and Grok Build in high resolution, before you even ask. Mind does the  | Adapter long-term memory |
| `adaption` | `74429772` | 3 | Adaption plugin for Cursor — datasets and fine-tuning workflows powered by the Adaption MCP server | fine-tuning datasets |
| `agent-compatibility` | `3644` | 1 | CLI-backed repo compatibility scans plus agents that audit startup, validation, and docs against reality. | repo startup/validation agents |
| `agentmail` | `48668144` | 9 | Email inboxes for agents. Create inboxes, send and receive emails, automate email workflows, and create accounts with AgentID. | agent email |
| `ahrefs` | `56809965` | 0 | Research keywords, backlinks, rankings, and site health. | SEO MCP |
| `apify` | `32913266` | 5 | Official Apify agent skills for web scraping, data extraction, and automation | Actors scrape (overlap) |
| `apollo` | `32704904` | 4 | Prospect, enrich leads, load outreach sequences, and query sales analytics with Apollo.io — one-click MCP server integration. | sales enrichment |
| `bright-data` | `4793` | 6 | Web search, content extraction, structured data, and browser automation powered by Bright Data's web intelligence platform. | web scrape (overlap) |
| `browse` | `675` | 1 | Browser automation for AI agents: navigate, extract, screenshot, and interact with real web pages via a single CLI. | browser automation |
| `browserless` | `66639982` | 0 | Browser automation tool for AI agents: web scraping, crawling, and web search, with built-in stealth features by running headless browsers in the Browserless cl | browser automation MCP |
| `clerk` | `710` | 20 | Clerk authentication toolkit for Cursor - setup guides, MCP server, and specialized skills for frameworks, mobile apps, organizations, billing, webhooks, testin | OAuth/auth — conflicts with Factory “drop Clerk” decision |
| `cloudflare` | `407` | 16 | Build, test, and deploy applications on Cloudflare with platform guidance Skills and the Cloudflare MCP server. | Next.js/sandbox/observability on CF |
| `composio` | `32661537` | 2 | Connect and operate 1000+ external apps from Cursor via the Composio MCP server. Managed OAuth, intelligent tool routing, and a remote sandbox for bulk data pro | 1000+ app connectors |
| `compound-engineering` | `680` | 43 | Brainstorm, plan, debug, review, and compound learnings with AI agents | **compound engineering**, specs, GitHub, evals |
| `context-dev` | `53497710` | 11 | Search, scrape, crawl, extract, parse, monitor, and process the live web with Context.dev. | web scrape/monitor (overlap) |
| `context7` | `73501007` | 1 | Upstash Context7 MCP server for up-to-date documentation lookup. Pull version-specific documentation and code examples directly from source repositories into yo | library docs lookup |
| `convex` | `233` | 0 | Official Convex plugin for Cursor - reactive backend development with TypeScript, including rules, skills, MCP integration, and automation hooks | backend (MCP/rules) |
| `create-plugin` | `648` | 2 | Scaffold and validate new agent plugins. Handles directory setup, manifest generation, and pre-submission quality checks for the marketplace. | plugin authoring |
| `crustdata` | `60860738` | 9 | B2B data on people and companies: people search, company search and enrichment across 1B+ profiles and 60M+ companies. Work history, headcount, funding and othe | people/company data |
| `customerio` | `56366542` | 5 | Connect Cursor to Customer.io with the official MCP connector and skills for Journeys, Pipelines, Design Studio, and SDK setup. | messaging |
| `dbt` | `3795` | 9 | Agent skills for dbt: data modeling, analytics engineering, semantic layer metrics, unit testing, job troubleshooting, and dbt MCP server setup. Covers dbt Core | analytics |
| `docker-skills` | `71289756` | 11 | Docker-authored knowledge skills for AI coding agents across Dockerfiles, Compose, Docker Agent, Docker Sandboxes, and safe Docker workflows. | **Docker**, sandboxing |
| `docs-canvas` | `6306` | 1 | Render documentation as a navigable canvas. | docs canvas |
| `encore` | `3780` | 21 | Build backends in TypeScript and Go with automatic infrastructure. Includes MCP integration for inspecting services, querying databases, analyzing traces, and c | backend + MCP |
| `exa` | `5636` | 3 | Web search and content extraction powered by Exa AI | web search (overlap) |
| `firecrawl` | `789` | 10 | Web scraping, crawling, and search for AI agents. Gives Cursor full access to web content through the Firecrawl CLI. | web scrape (overlap) |
| `floot` | `71286482` | 0 | Build and host full-stack apps with your own AI | full-stack host MCP |
| `fullenrich` | `74895179` | 9 | B2B contact enrichment workflows via FullEnrich MCP. | B2B enrichment |
| `gmail` | `45893410` | 0 | Search, read, draft, and manage email. | email MCP |
| `google-calendar` | `45893411` | 0 | Search events and schedule meetings. | calendar MCP |
| `google-docs` | `45893412` | 1 | Read, create, and edit documents. | docs MCP |
| `google-drive` | `45893413` | 1 | Search, read, create, and share files. | drive MCP |
| `grok-voice` | `62459237` | 4 | Add Grok voice to an app: realtime speech-to-speech, speech-to-text dictation, text-to-speech read-aloud, and a log-driven fix loop for voice sessions. | voice (peripheral) |
| `gsap-skills` | `7194` | 8 | Official GSAP skills for Cursor, Claude and other AI agents — core animations, timelines, ScrollTrigger, plugins, utilities, React integration, and performance  | animation |
| `here.now` | `50420288` | 3 | Publish websites, apps, and files to live URLs at {slug}.here.now or custom domains. Publish HTML apps, documents, images, PDFs, videos, and static files, with  | publish URLs |
| `huggingface-skills` | `735` | 19 | Agent Skills for AI/ML tasks including dataset creation, model training, evaluation, and research paper publishing on Hugging Face Hub | ML/evals |
| `impeccable` | `73000484` | 1 | Design and refine interfaces with Impeccable skills, specialist agents, and design checks. | design finish |
| `langfuse` | `738` | 3 | Skills for working with Langfuse — the open-source LLM engineering platform for tracing, prompt management, and evaluation. | **visibility** / LLM observability |
| `linear` | `512` | 0 | The product development system for teams and agents. Manage issues, projects, documents, and everything else across your Linear workspace. | issue tracking MCP |
| `manufact` | `52964995` | 1 | Build, test, and deploy MCP servers and apps with mcp-use and Manufact. Includes the Manufact MCP server, the mcp-use docs MCP server, and the mcp-apps-builder  | **MCP Apps** / mcp-use |
| `mobbin` | `52632771` | 0 | Search real-world UI & UX design references for mobile apps, web apps, and websites with Mobbin. | UI refs |
| `monid` | `63373743` | 1 | Discover and run hundreds of data endpoints via Monid MCP. | data endpoints MCP |
| `n8n` | `73065872` | 0 | Build, test, and run workflows on your n8n instance from Cursor. | workflows MCP |
| `notion-workspace` | `404` | 14 | Notion Skills + Notion MCP server packaged as a Cursor plugin. | specs → implementation skill |
| `opensearch-agent-skills` | `6846` | 9 | OpenSearch skills to help set up and deploy OpenSearch for a variety of use cases: build search applications with semantic, hybrid, neural sparse, and agentic s | search + observability |
| `orthogonal` | `66674618` | 4 | Connect agents to 800+ tool and data endpoints from 50+ verified providers through Orthogonal's hosted MCP server. | multi-provider tools |
| `parallel` | `698` | 6 | Web search, content extraction, deep research, data enrichment, entity discovery (FindAll), and web monitoring — powered by parallel-cli. | web research (overlap) |
| `playwright` | `48677659` | 0 | Navigate, click, screenshot, and test in a real browser. | browser automation |
| `port` | `26177969` | 12 | Connect to Port's agentic SDLC platform in natural language: query the Context Lake, orchestrate workflows, manage agents, and enforce governance. | **Port**, scorecards, agentic SDLC, visibility |
| `postiz` | `58737848` | 2 | Social media automation CLI and MCP server for scheduling posts, managing integrations, uploading media, and tracking analytics across 28+ platforms including X | social scheduling |
| `postman` | `2050` | 20 | Work with Postman from your agent: bootstrap a repo's Postman setup, mock an API before it's implemented, run collection and governance checks in CI, monitor a  | API/specs/testing |
| `pr-review-canvas` | `6307` | 1 | Render PR diffs as review canvases grouped by importance. | PR canvas |
| `pstack` | `9717366` | 61 | if you want to go fast, go deep first. pstack helps you write less, but higher quality code. rigorous agent workflows you can parallelize with confidence. | deep planning; incidental Tailscale |
| `refero` | `68854789` | 1 | Research real product interfaces and design with evidence from Refero. | UI refs |
| `remotion` | `49339676` | 12 | Remotion video creation skills for programmatic videos with React. | video (peripheral) |
| `runlayer` | `739` | 3 | Simpler, safer way to run MCPs, Skills, and Agents. Discover what's running, enforce security policies in real time, protect secrets, and get full audit trails  | MCP governance (anti-shadow-MCP) |
| `semrush` | `56809983` | 0 | Research keywords, backlinks, traffic, and competitors. | SEO MCP |
| `shadcn` | `6948` | 1 | UI component and design system framework. Search registries, install components as source code, and audit your project. | UI components |
| `simmie` | `72033444` | 0 | Build sales roleplay simulations with scoring rubrics and shareable practice links | sales roleplay MCP |
| `slack` | `674` | 8 | Slack AI tools for users and developers: interact with your workspace via the Slack MCP server and use skills to develop Slack apps. | collab MCP/skills |
| `superpowers` | `684` | 14 | Core skills library: TDD, debugging, collaboration patterns, and proven techniques | TDD/debug/plan patterns; weak diamond prose only |
| `svelte` | `2246` | 2 | A plugin for all things related to Svelte development, MCP, skills, and more. | Svelte (peripheral) |
| `treg` | `55647425` | 1 | OpenRouter for tools - 4,000+ agent-callable endpoints across 113 providers: SEO and SERP data, backlinks, social and trends, people and company enrichment, ads | tool gateway (LLM-tools adjacency) |
| `turso` | `60858255` | 1 | Manage Turso Cloud (organizations, databases, groups) and run SQL from Cursor via the hosted Turso MCP server — OAuth login, no API token to copy. | DB MCP |
| `vercel` | `649` | 49 | Build and deploy web apps and agents | **Vercel**, Next.js, AI gateway, sandbox, evals |
| `x` | `49086599` | 1 | Search posts, read timelines, pull trends, explore Spaces and communities, manage lists and bookmarks, access X Chat, schedule X calls, and manage livestreams. | X/Twitter MCP |

### Factory-critical plugin skill lists

#### `port` (12)

- `port-skill-creator` — Author a new Agent Skill for this repo (port-labs/port-skills): scaffold the skills/port-<name>/ directory, write valid frontmatter, structure the body as a sho
- `port-blueprints` — Model a Port context lake data model using blueprints, defining identifiers, titles, icons, properties, relations, and calculation, mirror, or aggregation prope
- `port-context-lake` — Design and build a Port context lake: a connected, semantically-rich data model of blueprints, relations, and mirror/aggregation properties that AI agents, scor
- `port-dashboards` — Build and update Port dashboard pages: widgets (table, number chart, pie chart, bar chart, multi-line chart, markdown, iframe, links, action card, action-runs t
- `port-dashboard-plugins` — Scaffold, implement, and audit Port custom plugin widgets: self-contained React/TypeScript iframe apps built on @port-labs/plugins-sdk and uploaded with @port-l
- `port-getting-started` — Set up Port and connect it to your coding agent: sign up for a Port account, install Port's MCP server, and optionally the Port CLI. Use when asked to 'get star
- `port-integrations` — Configure and troubleshoot Port integrations: mapping YAML, resources, selectors, JQ-based entity mappings, relations, and advanced options like createMissingRe
- `port-install-integration` — Guide a user through installing a new Port data-source integration end-to-end and populating the software catalog with the right data model and mapping. Use whe
- `port-integration-test-connection` — Run an integration test-connection probe and poll for results via Port MCP. Use when asked to 'test connection', 'check integration connectivity', 'validate int
- `port-permissions` — Configure Port's role-based access control: context lake (blueprint/entity) permissions (read, register, update, or delete entities, down to a single property o
- `port-terraform` — Author and manage Port blueprints, entities, scorecards, and self-service actions with the official Terraform provider (port-labs/port-labs). Covers provider se
- `port-workflows` — Build Port workflows: node-based automations made of triggers (self-service forms, context lake events), action nodes (webhook, upsert entity, GitHub/GitLab/Azu

#### `docker-skills` (11)

- `docker-agent-config` — Use this skill when creating or editing an agent.yaml (or .yml/.hcl) configuration file for Docker Agent (cagent), including defining agents, models/providers, 
- `docker-agent-deploy` — Use this skill when exposing a Docker Agent as a server (MCP, HTTP API, A2A, ACP, or OpenAI-compatible chat), distributing an agent via an OCI registry with `do
- `docker-agent-run` — Use this skill when running a Docker Agent with `docker agent run`, choosing a safety/approval mode, using the `--sandbox` isolation flag, setting up aliases, o
- `docker-build-strategies` — Use this skill when writing, reviewing, or optimizing Dockerfiles, even if the user just says their image is too large, their build is slow, or they need to har
- `docker-compose-patterns` — Use this skill when creating, modifying, or debugging Docker Compose configurations, even if the user just says they need to wire services together, add a datab
- `docker-destructive-guardrails` — Use this skill before running, or recommending, any Docker command that deletes, wipes, resets, or otherwise irreversibly changes state — even if the user just 
- `docker-project-foundations` — Use this skill when setting up, initializing, or Dockerizing a project, even if the user doesn't explicitly mention Docker but describes a need for containerize
- `docker-sandboxes-env` — Use this skill when authoring, planning, or running a declarative `sbxenv.yaml` file for Docker Sandboxes (`sbx env create/run/plan/exec/rm`), even if the user 
- `docker-sandboxes-kits` — Use this skill when authoring, validating, packaging, signing, or composing a Docker Sandboxes kit `spec.yaml` (`sbx kit add/inspect/pack/pull/push/sign/validat
- `docker-sandboxes-lifecycle` — Use this skill when creating, running, reattaching to, listing, stopping, or removing Docker Sandboxes (the standalone `sbx` CLI that runs AI coding agents in i
- `docker-sandboxes-network-credentials` — Use this skill when configuring what a Docker Sandboxes (`sbx`) sandbox can reach on the network or which credentials it authenticates with, even if the user ju

#### `manufact` / MCP Apps (1 skill package + docs MCP)

- `mcp-apps-builder` — **MANDATORY for ALL MCP server work** - mcp-use framework best practices and patterns.

**READ THIS FIRST** before any MCP server work, including:
- Creating new MCP servers
- Modifying existing MCP s
- Path: `/home/ubuntu/.cursor/plugins/cache/cursor-public/52964995/197efac28f64e8a2cadd9f04c592e335af48e4a5`

#### `compound-engineering` (43 listed; includes sample fixtures)

Primary CE skills include: `ce-brainstorm`, `ce-plan`, `ce-work`, `ce-compound`, `ce-code-review`, `ce-commit-push-pr`, `ce-babysit-pr`, `ce-debug`, `ce-optimize`, `ce-retune`, `lfg`, plus worktree/PR/browser helpers. Full list under plugin `skills/`.

#### `vercel` (49)

Includes `ai-sdk`, `ai-gateway`, `vercel-sandbox`, `deployments-cicd`, `auth`, React/Next best practices, agent benchmarks/evals. Path under cache id `649`.

---

## 4. Plugin-declared MCP servers (local config only)

These are **declarations inside installed plugins**, not proof of live connection. **Live MCP namespace catalog + tool schemas are coordinator-side** — do not treat this table as the runtime tool inventory.

| Declared server | Transport hint | Endpoint / command | Ship-with plugin |
|-----------------|----------------|--------------------|------------------|
| `21st` | http | `https://21st.dev/api/mcp` | `21st` |
| `Bright Data` | stdio | `npx @brightdata/...` | `bright-data` |
| `adapter` | http | `https://api.adapter.com/v1/mcp/mind/http` | `adapter-mind` |
| `adaption` | http | `https://api.prod.adaptionlabs.ai/api/v1/mcp` | `adaption` |
| `ahrefs` | http | `https://api.ahrefs.com/mcp/mcp` | `ahrefs` |
| `apify` | http | `https://mcp.apify.com` | `apify` |
| `browserless` | http | `https://mcp.browserless.io/mcp` | `browserless` |
| `clerk` | http | `https://mcp.clerk.dev/mcp` | `clerk` |
| `cloudflare` | http | `https://mcp.cloudflare.com/mcp` | `cloudflare` |
| `composio` | http | `https://connect.composio.dev/mcp` | `composio` |
| `context` | http | `https://mcp.context.dev/mcp` | `context-dev` |
| `context7` | http | `https://mcp.context7.com/mcp/oauth` | `context7` |
| `convex` | stdio | `npx` | `convex` |
| `customerio` | http | `https://mcp.customer.io/mcp` | `customerio` |
| `encore-mcp` | stdio | `encore` | `encore` |
| `exa` | http | `https://mcp.exa.ai/mcp` | `exa` |
| `floot` | http | `https://mcp.floot.com/mcp` | `floot` |
| `fullenrich` | http | `https://mcp.fullenrich.com/mcp` | `fullenrich` |
| `gmail` | http | `https://gmailmcp.googleapis.com/mcp/v1` | `gmail` |
| `google-calendar` | http | `https://calendarmcp.googleapis.com/mcp/v1` | `google-calendar` |
| `google-docs` | http | `https://api.cursor.com/rest-mcp/google-docs/mcp` | `google-docs` |
| `google-drive` | http | `https://api.cursor.com/rest-mcp/google-drive/mcp` | `google-drive` |
| `linear` | http | `https://mcp.linear.app/mcp` | `linear` |
| `manufact` | http | `https://mcp.manufact.com/mcp` | `manufact` |
| `mcp-use-docs` | http | `https://docs.mcp-use.com/mcp` | `manufact` |
| `mobbin` | http | `https://api.mobbin.com/mcp` | `mobbin` |
| `monid` | http | `https://mcp.monid.ai/v1` | `monid` |
| `n8n` | http | `${N8N_MCP_URL}` | `n8n` |
| `notion` | http | `https://mcp.notion.com/mcp` | `notion-workspace` |
| `opensearch-mcp-server` | stdio | `uvx` | `opensearch-agent-skills` |
| `orthogonal` | http | `https://mcp.orthogonal.com` | `orthogonal` |
| `playwright` | stdio | `npx` | `playwright` |
| `port-eu` | http | `https://mcp.port.io/v1` | `port` |
| `port-us` | http | `https://mcp.us.port.io/v1` | `port` |
| `postiz` | http | `https://mcp.postiz.com/mcp-oauth-dynamic` | `postiz` |
| `postman` | http | `https://mcp.postman.com/mcp` | `postman` |
| `refero` | http | `https://api.refero.design/mcp` | `refero` |
| `semrush` | http | `https://mcp.semrush.com/v2/mcp` | `semrush` |
| `shadcn` | stdio | `npx` | `shadcn` |
| `simmie` | http | `https://mcp.simmie.ai/mcp` | `simmie` |
| `treg` | http | `https://treg.to/mcp/` | `treg` |
| `turso` | http | `https://mcp.turso.ai/mcp` | `turso` |
| `vercel` | http | `https://mcp.vercel.com` | `vercel` |
| `x` | http | `https://api.x.com/mcp` | `x` |

Also present in some plugin trees (stdio helpers): `awslabs.aws-api-mcp-server`, `aws-knowledge-mcp-server`, `ddg-search`, Slack/Postman multi-client MCP variants, `local-tooling` echo stubs.

**Notable:** Port MCP is declared as `port-eu` / `port-us` in the Port plugin’s `.mcp.json`. Rivet / Beads / Polygraph / Trailcode / LogicSRC / AG-UI / CopilotKit have **no** local MCP declarations.

---

## 5. Extensions

No `~/.cursor/extensions`, `~/.vscode/extensions`, or other editor-extension directories found on this VM. Inventory of “extensions” for this workspace is empty.

---

## 6. Kits / non-skill local tooling

| Path | Notes |
|------|-------|
| `/home/ubuntu/.cursor/skills-cursor/.kits/cursor-pages/` | Type definitions for Cursor Pages SDK (canvas-adjacent kit, not a SKILL.md) |

---

## 7. Overlap vs gap summary for Factory engineering

**Strong local coverage:** Port (catalog/workflows/scorecards), compound/ASDLC/EGM spec loops, Vercel/Next, Docker sandboxes, MCP Apps (manufact), observability (Langfuse/OTEL), generic GitHub PR automation, web research (many overlapping scrapers).

**Hard gaps (install or author skills/plugins):** Rivet, Beads, Polygraph, Trailcode, LogicSRC product, AG-UI, CopilotKit, ISO 12207 process skill, IR pipeline, Tailscale-first-class, ChatGPT-plugins surface.

**Process gaps / hygiene:** EGM not actually in `plugins/local` on this VM despite install report; Clerk still installed while Factory docs drop Clerk; scraper/enrichment MCP sprawl without a Factory-preferred shortlist.

---

## 8. Source index (roots scanned)

```
/home/ubuntu/.cursor/skills-cursor/          # 17 skills
/home/ubuntu/.cursor/plugins/cache/cursor-public/<67 ids>/
/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/skills/asdlc/
/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/artifacts/elephant-goldfish-model/
/agent/                                      # no skills
```

Machine-readable extract used while drafting: `/tmp/skills-inventory.json` (ephemeral on agent VM; not part of Project store).
