# Factory claims verification — official-docs gap expansion

**Status:** Evidence-only (official documentation only)  
**Date:** 2026-10-28  
**Method:** No inference; no third-party blogs. Each gap is **VERIFIED**, **UNVERIFIED**, or **CONTRADICTED** against a primary official source with a specific quote or detail.  
**Sibling reuse:** Independently re-checked Rivet Sandbox Agent against Context7 `/websites/rivet_dev_sandbox-agent` + https://rivet.dev/llms.txt; also reused sibling note [`rivet-sandbox-agent.md`](./rivet-sandbox-agent.md) (agreement recorded below).  
**Related:** [`rivet-claim-fencing.md`](./rivet-claim-fencing.md), [`port-capabilities.md`](./port-capabilities.md)

---

## Summary table (this expansion)

| # | Gap | Verdict |
|---|-----|---------|
| G1 | Rivet Sandbox Agent harness | **VERIFIED** |
| G2 | Trail-code (what it is) | **VERIFIED** |
| G3 | Polygraph evaluation model | **UNVERIFIED** (as formal LLM-eval model); adversarial review **VERIFIED** separately |
| G4 | Beads readiness tracking | **VERIFIED** |
| G5 | GitHub CI independence — what Port lacks | **VERIFIED** (Port does not replace CI/CD) |
| G6 | Headless Port MCP security (rate / scope / blast) | **Rate limits VERIFIED**; **scoping VERIFIED**; **“blast radius” as named MCP control UNVERIFIED** |

---

## G1. Rivet Sandbox Agent harness

**Verdict: VERIFIED**

**Official sources:** Context7 library `/websites/rivet_dev_sandbox-agent`; index https://rivet.dev/llms.txt (Sandbox Agent tree under `/sandbox-agent/docs/`); pages https://rivet.dev/sandbox-agent/docs/ and https://rivet.dev/sandbox-agent/docs/architecture/. Sibling synthesis: [`rivet-sandbox-agent.md`](./rivet-sandbox-agent.md).

### What it is

> Run coding agents in sandboxes. Control them over HTTP.
>
> Sandbox Agent runs inside your sandbox and gives your app one API for Claude Code, Codex, OpenCode, Cursor, Amp, and Pi.

Source: https://rivet.dev/sandbox-agent/docs/

> Sandbox Agent is a lightweight HTTP server that runs **inside** a sandbox.

Source: https://rivet.dev/sandbox-agent/docs/architecture/

Context7 resolve description: “Sandbox Agent is an HTTP server that runs inside sandboxes to provide a unified API and SDK for managing coding agents, streaming events, and controlling processes and filesystems.” Library ID: `/websites/rivet_dev_sandbox-agent`.

`llms.txt` indexes the product under `/sandbox-agent/docs/` (separate from Actors / Agents / agentOS / Secure Exec).

### How it works

Architecture components (official):

- **Your app** — `sandbox-agent` TypeScript SDK over HTTP  
- **Sandbox** — isolated runtime (local process, Docker, E2B, Daytona, Vercel, Cloudflare)  
- **Sandbox Agent server** — binary inside the sandbox: agent lifecycles, prompt routing, event streaming, filesystem/process/terminal APIs  
- **Agent process** — coding agent spawned by the server; one process per session  

`SandboxAgent.start()` steps (official): Provision → Install binary → Boot HTTP → Health `/v1/health` → Ready client.  
Source: https://rivet.dev/sandbox-agent/docs/architecture/

### What it provides

Named explicitly in official docs:

- Unified HTTP API / SDK across listed coding agents  
- Agent install/spawn/stop; sessions; SSE/event streaming  
- Sandbox APIs: filesystem, process, terminal  
- Providers: `local`, `docker`, `e2b`, `daytona`, `agentcomputer`, `vercel`, `cloudflare` (SDK overview)  
- Computer use / managed desktop (Computer Use docs)  

**Docs do not claim** Sandbox Agent *is* Rivet Actors or *is* the isolation boundary; isolation is the sandbox provider. Rivet Actors are documented as a **recommended backend** for orchestration/persistence (orchestration-architecture / multiplayer / manage-sessions pages).

**Sibling agreement:** Matches [`rivet-sandbox-agent.md`](./rivet-sandbox-agent.md) on definition, architecture flow, providers, and Rivet-as-orchestration (not Sandbox Agent = Rivet execution layer). No CONTRADICTED items vs that note.

---

## G2. Trail-code — what it is

**Verdict: VERIFIED**

**Official source:** https://github.com/trailhq/Trail-Code (README); site link on repo: https://trailhq.com/graft; package `@trailhq/trail-code`.

Official README states:

> The self-learning context layer for coding agents.
>
> Trail-code gives Claude Code, Cursor, Codex and other coding agents a map of your code, and what your team has learned about it.

Two parts named in the official table:

| | Code map (previously graft) | Learnings |
|---|---|---|
| What is it? | An index of your code: every function and who calls it, so your agent sees what a change can break | What you, your agents and your team have learned and decided |

Install path from same README: `npm install -g @trailhq/trail-code && trail init`.

Note: “Graft is now Trail-code. Graft lives on as the graft map…”

---

## G3. Polygraph — evaluation model

**Verdict: UNVERIFIED** for a formal **evaluation model** (benchmarks, scoring rubrics, LLM-eval harness as product).  
**Related capability VERIFIED:** adversarial / session code review (not an eval framework).

**Official sources:** https://docs.trypolygraph.com/ ; https://docs.trypolygraph.com/features/code-reviews/ ; https://trypolygraph.com/

### What official docs *do* say Polygraph is

> Polygraph is an agent-agnostic meta-harness for maximum agentic autonomy. It doesn't replace the agent you already use (Claude Code, Codex, OpenCode), it adds the components agents need to work effectively in real organizations.

Source: https://docs.trypolygraph.com/

Landing: “The meta-harness that gives agents what they’re missing: visibility across every repo boundary, and memory that survives every session.”  
Source: https://trypolygraph.com/

### Evaluation model

- Search of `docs.trypolygraph.com` for evaluation / eval / benchmark / scoring / rubric returned **no official docs hits**.
- Code-reviews feature documents **review mode** and **adversarial review**, not an evaluation model:

> For an independent second opinion, run the review in adversarial mode:  
> `polygraph session review <session-id> --adversarial`  
> Polygraph spawns one independent reviewer agent per repo in the session, then merges their reviews into a single summary. The reviewers verify the session's assumptions against the current code… Everything stays read-only.

Source: https://docs.trypolygraph.com/features/code-reviews/

**Conclusion:** Official docs verify meta-harness + adversarial review. A product “evaluation model” (formal LLM eval / scoring harness) is **UNVERIFIED** from official Polygraph documentation.

---

## G4. Beads — readiness tracking

**Verdict: VERIFIED**

**Official sources:** https://raw.githubusercontent.com/steveyegge/beads/main/README.md (canonical README; repo redirects/mirrors under gastownhall/beads); https://github.com/gastownhall/beads/wiki

README:

> Beads provides a persistent, structured memory for coding agents. It replaces messy markdown plans with a dependency-aware graph…

Flow diagram text in README: `bd create` → dependency graph → `bd ready` (claimable work) → `bd update --claim` → `bd close` → blockers released → ready.

Essential commands (README + wiki):

| Command | Action |
| --- | --- |
| `bd ready` | List tasks with no open blockers |
| `bd update <id> --claim` | Atomically claim a task (sets assignee + in_progress) |

Features list: “Agent-Optimized: JSON output, dependency tracking, and **auto-ready task detection**.”

Storage: Dolt-powered; embedded (single-writer) or server mode.

---

## G5. GitHub CI independence — what Port lacks (per Port docs)

**Verdict: VERIFIED** that Port **does not replace** CI/CD pipelines; Port is the business orchestrator **above** those systems.

**Official source:** https://docs.port.io/workflows/overview/

> Workflows do not replace the systems you already run - CI/CD pipelines, cloud provider APIs, ticketing and incident management tools, monitoring, AI agents, or the scripts your team wrote years ago. They orchestrate the business process around all of them, then hand each technical step to whichever system already does that job.

Layering table on same page:

- **Business workflow (Port)** — context, risk, approvals, invoke agents, notify, update catalog  
- **Execution systems (your existing tools)** — “Build and deploy, provision infrastructure, …”

Port **can** trigger GitHub Actions (`dispatch_workflow` integration action) and ingest GitHub `workflow` / `workflow-run` into the catalog, and its GitHub Action can *report* CI job status into Port — but official wording places **build/deploy execution** with existing CI/CD, not Port.

**Specific lack (docs-stated):** Port workflows are not a replacement for CI/CD pipelines / independent build-and-deploy verification systems.

---

## G6. Security for headless agent access via Port MCP gateway

Split into three sub-claims.

### G6a. Rate limits — **VERIFIED**

**Official source:** https://docs.port.io/agent-management/port-mcp-server/token-based-authentication/

> The `client_credentials` grant is also rate-limited to **50 requests per 15 minutes per client**. Cache tokens until they are close to expiry instead of requesting a new token on every MCP call.

Access tokens: short-lived (typically ~3 hours); no refresh token for `client_credentials`.

Headless path named explicitly: “CI/CD, headless agents, `mcp-remote`” use OAuth `client_credentials` against `https://mcp.port.io/v1/token` (or US region URL).

### G6b. Scoping — **VERIFIED**

Same page:

- **`x-read-only-mode`**: defaults to `0` (all tools allowed by permissions); set `1` to expose only read-only tools and hide write tools.  
- **`x-allowed-actions-to-run`**: optional comma-separated action IDs limiting what `run_action` can trigger.  
- Client-side **`allowed_tools`** filter in the GitHub Actions example.  
- Security best practices: dedicated automation credential with minimum permissions; prefer `x-read-only-mode: 1` for read-only automation; use `x-allowed-actions-to-run` to restrict actions.

**MCP gateway / connectors** (https://docs.port.io/agent-management/mcp-connectors/):

> MCP Connectors turn Port into a unified MCP gateway, routing requests from developers and AI agents to external MCP servers while applying Port's governance, RBAC, and audit controls. Platform engineers configure which MCP servers are available and which tools are exposed.

### G6c. Blast radius — **UNVERIFIED** as a named Port MCP-gateway control

Official machine-auth / MCP connectors pages reviewed **do not** define a product control or metric named “blast radius” for headless MCP access.

(Port has a separate guide titled “Calculate blast radius with AI” under guides — not MCP gateway security documentation for agent access.)

What *is* documented for limiting impact: RBAC, tool exposure config, `x-read-only-mode`, `x-allowed-actions-to-run`, minimum-permission automation credentials, audit controls — without using the term “blast radius.”

---

## Delta vs [`rivet-claim-fencing.md`](./rivet-claim-fencing.md)

| Topic | Fencing note | This expansion |
|-------|--------------|----------------|
| Sandbox Agent | Not the focus of fencing note | **VERIFIED** product: in-sandbox HTTP coding-agent harness (G1) |
| Beads claim | `bd update --claim` = readiness authority, not Rivet | **Confirmed** via Beads README/wiki (G4) |
| Port upsert / CAS | Port upserts lack CAS | Untouched here; fencing note still stands |
| Completable-queue redelivery conflict | Internal Rivet docs disagree | Untouched; still **DISAGREE** per fencing note |

---

## Sources (official only)

1. https://rivet.dev/llms.txt  
2. https://rivet.dev/sandbox-agent/docs/  
3. https://rivet.dev/sandbox-agent/docs/architecture/  
4. Context7 `/websites/rivet_dev_sandbox-agent`  
5. https://github.com/trailhq/Trail-Code (README)  
6. https://docs.trypolygraph.com/  
7. https://docs.trypolygraph.com/features/code-reviews/  
8. https://trypolygraph.com/  
9. https://github.com/steveyegge/beads / https://github.com/gastownhall/beads (README + wiki)  
10. https://docs.port.io/workflows/overview/  
11. https://docs.port.io/agent-management/port-mcp-server/token-based-authentication/  
12. https://docs.port.io/agent-management/mcp-connectors/  

---

## Files touched this expansion

- **Created/updated:** this file — `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/docs/factory-claims-verification.md`  
- **Reused (not overwritten):** `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/docs/rivet-sandbox-agent.md`  
