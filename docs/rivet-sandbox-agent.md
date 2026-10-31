# Rivet Sandbox Agent (official docs)

**Status:** Evidence-only research note  
**Date:** 2026-10-28  
**Scope:** Rivet official docs only (Context7 library `/websites/rivet_dev_sandbox-agent` + pages linked from https://rivet.dev/llms.txt). Quotes and paraphrases limited to what those pages state. No architecture inference beyond the docs.

**Do not conflate:** Rivet also documents **Agents → Sandboxes** / `@rivet-dev/sandbox-adapter` (shell/files for Pi Durable Actors). That is a separate docs tree from **Sandbox Agent** (`sandbox-agent` HTTP server/SDK). This note covers Sandbox Agent only, except where Sandbox Agent docs themselves name Rivet Actors.

---

## 1. What is Sandbox Agent?

Official overview:

> Run coding agents in sandboxes. Control them over HTTP.
>
> Sandbox Agent runs inside your sandbox and gives your app one API for Claude Code, Codex, OpenCode, Cursor, Amp, and Pi. Stream events, handle permissions, and manage sessions from the TypeScript SDK or HTTP.

Source: [Sandbox Agent docs overview](https://rivet.dev/sandbox-agent/docs/)

Product page:

> The Sandbox Agent SDK is a server that runs inside your sandbox. Your app connects remotely to control Claude Code, Codex, OpenCode, Amp, or Pi — streaming events, handling permissions, managing sessions.

Source: [Sandbox Agent landing](https://rivet.dev/sandbox-agent/)

Architecture page:

> Sandbox Agent is a lightweight HTTP server that runs **inside** a sandbox.

Source: [Architecture](https://rivet.dev/sandbox-agent/docs/architecture/)

Footer/nav on Rivet site lists Sandbox Agent under **Libraries** (alongside Secure Exec), separate from Actors / Agents / Workflows / agentOS.

Source: site chrome on the pages above; also indexed under `/sandbox-agent/docs/` in [llms.txt](https://rivet.dev/llms.txt).

---

## 2. How does it work?

### Components (docs)

From [Architecture](https://rivet.dev/sandbox-agent/docs/architecture/):

- **Your app**: Uses the `sandbox-agent` TypeScript SDK to talk to the server over HTTP.
- **Sandbox**: An isolated runtime (local process, Docker, E2B, Daytona, Vercel, Cloudflare).
- **Sandbox Agent server**: A single binary inside the sandbox that manages agent lifecycles, routes prompts, streams events, and exposes filesystem/process/terminal APIs.
- **Agent process**: A coding agent (Claude Code, Codex, etc.) spawned by the server. Each session maps to one agent process.

The same page lists three responsibilities of the in-sandbox server:

- **Agent management**: Installs, spawns, and stops coding agent processes
- **Sessions**: Routes prompts to agents and streams events back in real time
- **Sandbox APIs**: Filesystem, process, and terminal access for the sandbox environment

### `SandboxAgent.start()` flow (docs)

Quoted steps from [Architecture](https://rivet.dev/sandbox-agent/docs/architecture/):

1. **Provision**: The provider creates a sandbox (starts a container, creates a VM, etc.)
2. **Install**: The Sandbox Agent binary is installed inside the sandbox
3. **Boot**: The server starts listening on an HTTP port
4. **Health check**: The SDK waits for `/v1/health` to respond
5. **Ready**: The SDK returns a connected client

> For the `local` provider, provisioning is a no-op and the server runs as a local subprocess.

Server recovery (same page): if the server process stops, the SDK automatically calls the provider’s `ensureServer()` after 3 consecutive health-check failures.

### SDK / providers (docs)

[SDK Overview](https://rivet.dev/sandbox-agent/docs/sdk-overview/) states `SandboxAgent.start(...)` requires a `sandbox` provider. Built-in providers listed there:

| Import | Provider |
|--------|----------|
| `sandbox-agent/local` | Local subprocess |
| `sandbox-agent/docker` | Docker container |
| `sandbox-agent/e2b` | E2B sandbox |
| `sandbox-agent/daytona` | Daytona workspace |
| `sandbox-agent/agentcomputer` | Agent Computer managed worker |
| `sandbox-agent/vercel` | Vercel Sandbox |
| `sandbox-agent/cloudflare` | Cloudflare Sandbox |

(`connect` / HTTP against an already-running server is also documented on the same page.)

### Production topology (docs)

[Orchestration Architecture](https://rivet.dev/sandbox-agent/docs/orchestration-architecture/):

> Run the SDK on your backend, then call it from your frontend.
>
> This extra hop is recommended because it keeps auth/token logic on the backend and makes persistence simpler.

Suggested path: Browser → Your backend (Sandbox Agent SDK) → Sandbox Agent server (inside sandbox).

Landing page “How it works” also states: “A server runs inside your sandbox. Your app connects over HTTP to control any coding agent.”  
Source: [Sandbox Agent landing](https://rivet.dev/sandbox-agent/)

---

## 3. What does it provide?

Evidence from official Sandbox Agent docs (capabilities named explicitly):

### Unified coding-agent control surface

- One API for multiple coding agents (Claude Code, Codex, OpenCode, Cursor, Amp, Pi).  
  Sources: [docs overview](https://rivet.dev/sandbox-agent/docs/), [landing](https://rivet.dev/sandbox-agent/)
- Landing: “One HTTP API. Write your code once, swap coding agents with a config change.”  
  Source: [landing](https://rivet.dev/sandbox-agent/)

### Runs inside a sandbox / isolated runtime

- Server runs **inside** the sandbox; sandbox described as “An isolated runtime (local process, Docker, E2B, Daytona, Vercel, Cloudflare).”  
  Source: [Architecture](https://rivet.dev/sandbox-agent/docs/architecture/)
- Landing problem/solution: “You can't let AI execute arbitrary code on your production servers. Coding agents need isolated environments… / A server that runs inside the sandbox and exposes HTTP/SSE.”  
  Source: [landing](https://rivet.dev/sandbox-agent/)
- “Runs Inside Any Sandbox — Lightweight static binary. One curl command to install inside E2B, Daytona, Vercel Sandboxes, or Docker.”  
  Source: [landing](https://rivet.dev/sandbox-agent/)

**Docs do not claim** that Sandbox Agent itself implements the isolation boundary (VM/container/cgroup). Isolation is attributed to the sandbox provider/runtime; Sandbox Agent is the in-sandbox control server.

### Agent execution environment (in-sandbox)

Named by architecture/SDK/system docs:

- Install/spawn/stop agent processes; one agent process per session.  
  Source: [Architecture](https://rivet.dev/sandbox-agent/docs/architecture/)
- Sessions: create/resume/destroy, prompts, permissions, modes/models.  
  Source: [SDK Overview](https://rivet.dev/sandbox-agent/docs/sdk-overview/)
- Streaming events (SSE / `onEvent`); universal/standardized event schema for persistence/replay/audit.  
  Sources: [Architecture](https://rivet.dev/sandbox-agent/docs/architecture/), [landing](https://rivet.dev/sandbox-agent/), [SDK Overview](https://rivet.dev/sandbox-agent/docs/sdk-overview/)
- Sandbox APIs: filesystem, process, and terminal access.  
  Source: [Architecture](https://rivet.dev/sandbox-agent/docs/architecture/)
- Computer use: “Sandbox Agent provides a managed virtual desktop (Xvfb + openbox) that you can control programmatically.”  
  Source: [Computer Use](https://rivet.dev/sandbox-agent/docs/computer-use/) (via Context7); Desktop API also in [SDK Overview](https://rivet.dev/sandbox-agent/docs/sdk-overview/)
- Session persistence drivers; inspector; HTTP API surface under `/sandbox-agent/docs/api-reference/`.  
  Sources: [SDK Overview](https://rivet.dev/sandbox-agent/docs/sdk-overview/), [llms.txt](https://rivet.dev/llms.txt) index

---

## 4. Relation to Rivet (what Sandbox Agent docs claim)

Factory context note: treat Rivet as the execution layer only as **Factory’s** framing. Below is **only** what Rivet’s Sandbox Agent docs claim about Rivet / Actors.

### Recommended backend for orchestration

[Orchestration Architecture](https://rivet.dev/sandbox-agent/docs/orchestration-architecture/) — backend requirements listed:

- Long-running connections (prompts can take minutes)
- Session affinity
- State between requests (session metadata and event history)
- Graceful recovery after backend restarts

Then:

> We recommend [Rivet](https://rivet.dev/) over serverless because actors natively support the long-lived connections, session routing, and state persistence that agent workloads require.

### Multiplayer: Rivet Actors own session lifecycle

[Multiplayer](https://rivet.dev/sandbox-agent/docs/multiplayer/):

> For multiplayer orchestration, use [Rivet Actors](https://rivet.dev/actors/docs/).
>
> Recommended model:
>
> - One actor per collaborative workspace/thread.
> - The actor owns Sandbox Agent session lifecycle and persistence.
> - Clients connect to the actor and receive realtime broadcasts.

Notes on same page:

> Keep sandbox calls actor-only. Browser clients should not call Sandbox Agent directly.
>
> Copy the Rivet persist driver from the example above into your project so session history persists in actor state.

### Security: Rivet actor as server-side gate

[Security](https://rivet.dev/sandbox-agent/docs/security/):

> As covered in Orchestration Architecture, run the Sandbox Agent client on your backend, not in the browser.
>
> This keeps sandbox credentials private and gives you one place for authz, rate limiting, and audit logging.

Includes a Rivet (`rivetkit`) actor example that connects to Sandbox Agent server-side (“Sandbox credentials never reach the client”) and a Hono reverse-proxy example.

### Manage sessions: Rivet Actors as persistence option

[Manage Sessions](https://rivet.dev/sandbox-agent/docs/manage-sessions/) (via Context7): recommends Rivet Actors for most use cases for persisting events; states Rivet Actors provide persistent state, real-time streaming, horizontal scaling, observability; includes actor examples that create a sandbox, start `sandbox-agent server`, and stream events via Rivet.

Landing persistence copy: “Universal event schema streams to your storage. Persist to Postgres or Rivet, replay later, audit everything.”  
Source: [landing](https://rivet.dev/sandbox-agent/)

### What the docs do **not** claim (evidence gap, not inference)

Sandbox Agent official pages reviewed for this note **do not** state that Sandbox Agent *is* Rivet’s execution layer, nor that Rivet Actors *are* the sandbox. They position:

- **Sandbox Agent** = in-sandbox HTTP server + SDK for coding agents  
- **Rivet / Rivet Actors** = recommended (or example) **backend orchestration / session ownership / persistence** layer that calls Sandbox Agent

---

## Sources

- [https://rivet.dev/llms.txt](https://rivet.dev/llms.txt) — index; Sandbox Agent tree under `/sandbox-agent/docs/`
- [https://rivet.dev/sandbox-agent/](https://rivet.dev/sandbox-agent/)
- [https://rivet.dev/sandbox-agent/docs/](https://rivet.dev/sandbox-agent/docs/)
- [https://rivet.dev/sandbox-agent/docs/architecture/](https://rivet.dev/sandbox-agent/docs/architecture/)
- [https://rivet.dev/sandbox-agent/docs/orchestration-architecture/](https://rivet.dev/sandbox-agent/docs/orchestration-architecture/)
- [https://rivet.dev/sandbox-agent/docs/sdk-overview/](https://rivet.dev/sandbox-agent/docs/sdk-overview/)
- [https://rivet.dev/sandbox-agent/docs/security/](https://rivet.dev/sandbox-agent/docs/security/)
- [https://rivet.dev/sandbox-agent/docs/multiplayer/](https://rivet.dev/sandbox-agent/docs/multiplayer/)
- [https://rivet.dev/sandbox-agent/docs/manage-sessions/](https://rivet.dev/sandbox-agent/docs/manage-sessions/) (Context7)
- [https://rivet.dev/sandbox-agent/docs/computer-use/](https://rivet.dev/sandbox-agent/docs/computer-use/) (Context7)
- Context7 library: `/websites/rivet_dev_sandbox-agent`
