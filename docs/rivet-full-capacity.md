# Rivet full capacity map (official docs only)

**Status:** Evidence-only capacity document  
**Date:** 2026-10-28  
**Rule:** Primary claims from official Rivet docs (Context7 libraries + pages linked from https://rivet.dev/llms.txt). No product inference. Factory mappings that go beyond documented Rivet product names are labeled **ASSUMPTION**.  
**Related Project store notes (labels only):** [`rivet-engineering-spec.md`](./rivet-engineering-spec.md), [`rivet-sandbox-agent.md`](./rivet-sandbox-agent.md), [`rivet-claim-fencing.md`](./rivet-claim-fencing.md) — not sources for Rivet product claims.

**Context7 libraries used:**
- `/rivet-dev/actors` — Rivet Actors
- `/rivet-dev/agents` — Rivet Agents
- `/websites/rivet_dev_sandbox-agent` — Sandbox Agent
- `/rivet-dev/agentos` — agentOS (referenced where official pages point)

**Index:** https://rivet.dev/llms.txt

---

## 0. Source index (required)

| Source | Role |
|--------|------|
| https://rivet.dev/llms.txt | Master URL index for official docs trees |
| Context7 `/rivet-dev/actors` | Actors, queues, state, schedule, limits, design patterns, engine single-writer notes |
| Context7 `/websites/rivet_dev_sandbox-agent` | Sandbox Agent architecture, SDK, API |
| Context7 `/rivet-dev/agents` | Agents product docs / design patterns |
| https://rivet.dev/pricing/ | Cloud plans, Actor Nodes, deployment model comparison |
| https://rivet.dev/docs/deploy/cloud/ | Rivet Cloud overview |
| https://rivet.dev/docs/deploy/cloud/compute/ | Hosted Actor Nodes (Docker) |
| https://rivet.dev/docs/deploy/self-host/control-plane/ | Self-host what you run |
| https://rivet.dev/docs/deploy/byoc/ + architecture | BYOC Rivet-managed in your VPC |
| https://rivet.dev/enterprise/ | Enterprise Edition features |
| https://rivet.dev/actors/docs/queues/ | Queues semantics (incl. fail-before-complete: **not redelivered**) |
| https://rivet.dev/actors/docs/production-checklist/ | Queues idempotency (fail-before-complete: **retried**) |
| https://rivet.dev/sandbox-agent/docs/api-reference/ | Full HTTP API surface table |

---

## 1. Rivet Cloud — provides, managed services, pricing

### What official docs say it does

Rivet Cloud is **managed Rivet**: a cluster that runs the control plane, and optionally your app too. ([Cloud overview](https://rivet.dev/docs/deploy/cloud/))

You deploy the same application code one of two ways:

1. **Bring your own nodes** — run nodes on your infrastructure and point them at the cluster endpoint (all platforms in the [node guides](https://rivet.dev/docs/deploy/self-host/nodes/)).
2. **Hosted actor nodes** — give the cluster a Docker image; Rivet Cloud runs it. ([Actor Nodes](https://rivet.dev/docs/deploy/cloud/compute/))

Pricing page framing: “Pay for coordination, state, and active execution on Rivet Cloud.” Same three pieces everywhere: **your backend**, **control plane**, **storage**. ([Pricing](https://rivet.dev/pricing/))

Managed pieces on Rivet Cloud (pricing comparison):

- Rivet Cloud runs the **control plane** and **storage**.
- You may run backend on Rivet Cloud **or** bring your own compute (Vercel, Railway, Cloudflare, AWS, Kubernetes). ([Pricing — Compare Deployment Models](https://rivet.dev/pricing/))

Endpoints (Cloud docs):

- Cluster API: `https://<cluster>-api.onrivet.dev` (`RIVET_ENDPOINT` + token).
- Apps as actor nodes: `https://<cluster>.onrivet.dev`.
- MCP: `https://mcp.rivet.dev/mcp`. ([Cloud](https://rivet.dev/docs/deploy/cloud/))

Architecture (shared): object storage keeps Actor data; control plane schedules/routes; actor nodes run your code. ([Architecture](https://rivet.dev/docs/architecture/))

### API / ops surface (documented)

- Dashboard: https://dashboard.rivet.dev
- CLI deploy for hosted nodes: `npx @rivetkit/cli login|link|deploy` ([Actor Nodes](https://rivet.dev/docs/deploy/cloud/compute/))
- MCP: `rivet.cloud.v2.clusters.list()` ([Cloud](https://rivet.dev/docs/deploy/cloud/))
- Hosted node image limit called out in Dockerfile guidance: keep image under **5 GiB** ([Actor Nodes](https://rivet.dev/docs/deploy/cloud/compute/))
- Deploy duration stated as **5 to 10 minutes** ([Actor Nodes](https://rivet.dev/docs/deploy/cloud/compute/))

### Pricing (documented)

Control plane plans ([Pricing](https://rivet.dev/pricing/)):

| Plan | Control plane | Actor Nodes cap | Support |
|------|---------------|-----------------|---------|
| Free | $0/mo — 1 node, 1 AZ | up to 1 (included free; R-5 or R-10) | Community |
| Hobby | $10/mo — 1 node, 1 AZ | up to 3 | Email |
| Team | $120/mo — 3 nodes, 3 AZs | up to 10 | Slack & email |
| Enterprise | $900/mo — 5 nodes, 3 AZs | up to 50 | Dedicated |

Actor Node sizes (per node / month, on top of control plane):

| Size | vCPU | RAM | Available on | $/mo |
|------|------|-----|--------------|------|
| R-5 | 1/4 | 1 GB | Free+ | $4.20 |
| R-10 | 1/2 | 2 GB | Free+ | $8.40 |
| R-20 | 1 | 4 GB | Hobby+ | $16.80 |
| R-40 | 4 | 8 GB | Team+ | $27.30 |
| R-160 | 8 | 16 GB | Team+ | $94.50 |

Other pricing facts:

- Clusters on **Google Cloud** in selectable regions (us-east4, us-central1, europe-west1, europe-west3, asia-southeast1, asia-east1).
- “Bring your own nodes and there is nothing more to pay beyond the control plane.”
- Startup deal: 50% off Team for 12 months for YC / a16z Speedrun. ([Pricing FAQ](https://rivet.dev/pricing/))

### Limits

Cloud plan caps Actor Node count/size as in the table above. Soft/hard **Actor** limits (queues, messages, storage) are product-wide in [Actors Limits](https://rivet.dev/actors/docs/limits/) (see §5–§6).

### Factory fit

Documented Cloud capabilities cover a managed control plane + optional hosted Docker actor nodes + BYO nodes — matching Factory’s need for a durable Actor runtime without self-operating the engine.  
**ASSUMPTION (Factory):** Pilot may prefer desktop Docker self-host first ([`rivet-engineering-spec.md`](./rivet-engineering-spec.md)); that choice is Factory preference, not a Rivet Cloud requirement.

---

## 2. Self-host — what you run, requirements, what you get

### What official docs say

Self-hosting means running **four** things on your infrastructure ([Control Plane](https://rivet.dev/docs/deploy/self-host/control-plane/)):

| Part | What | How many |
|------|------|----------|
| Control plane instance | `rivetdev/engine` image; every instance identical, runs every service | 1 to try; **3+ in production** |
| Disk | Persistent local disk per instance (recent writes + identity) | One per instance, **never shared** |
| Bucket | S3 / S3-compatible / GCS / Azure Blob — durable Actor data | One per cluster |
| Nodes | Your app with Rivet SDK; connect out; host Actors | As many as needed |

Also stated:

- No database to run and no message bus; instances find each other through the bucket.
- Nodes reach control plane on port **6420** (usually via LB); instances talk on **6421** (private).
- Actor data replicated across instance disks then moved to bucket in background; losing one instance loses no data.
- Control plane runs in **one region**; multi-region self-hosting is **coming**. ([Control Plane](https://rivet.dev/docs/deploy/self-host/control-plane/))

Pricing FAQ: Rivet is open source (Apache 2.0), free to self-host with **no usage limits**, ships as a single Rust binary or Docker image. ([Pricing](https://rivet.dev/pricing/))

Enterprise page: self-host path for air-gapped / sovereign cloud; same Enterprise Edition control plane option; no required connection to Rivet Cloud. ([Enterprise](https://rivet.dev/enterprise/))

Platform guides linked: Docker Compose, Kubernetes, VM/bare metal, Hetzner, Railway, Render, AWS ECS, Custom. ([Control Plane](https://rivet.dev/docs/deploy/self-host/control-plane/))

### What you get

- Full Actor orchestration stack you operate (control plane + storage + your nodes).
- Local development described as identical to production artifact on Enterprise page (“One stateless binary”, K8s/systemd/Docker). ([Enterprise](https://rivet.dev/enterprise/))
- Architecture model identical to Cloud: storage / control plane / nodes. ([Architecture](https://rivet.dev/docs/architecture/))

### Limits / gaps called out

- Multi-region self-host: **coming** (not available yet per control-plane docs).
- Soft Actor limits still apply in application config ([Limits](https://rivet.dev/actors/docs/limits/)); pricing FAQ says no **usage** limits for OSS self-host.

### Factory fit

Documented self-host shape (engine image + bucket + disks + SDK nodes) supports a local/desktop pilot and air-gapped later.  
**ASSUMPTION (Factory):** Tailscale + desktop Docker pilot topology is Factory networking preference, not stated in Rivet self-host docs.

---

## 3. Bring your own cloud — Rivet-managed vs user-managed

### Documented models

Pricing “Compare Deployment Models” ([Pricing](https://rivet.dev/pricing/)):

| Model | Who runs stack | Notes |
|-------|----------------|-------|
| **Rivet Cloud** | Rivet runs control plane + storage; backend on Rivet Cloud or your compute | “Best for most teams shipping to production” |
| **Bring your own cloud** | Whole stack inside **your VPC**; Rivet manages over **outbound** connection | “Data residency without anything to operate” |
| **Fully self-hosted** | You run entire stack; air-gapped OK | “Strict compliance and air-gapped” |
| **Enterprise Edition** | Add-ons for BYOC or self-host | Multi-tenancy, ACL, backups, hardening guidance |

Enterprise page: two ways inside your perimeter — **BYOC** (Rivet deploys/maintains) vs **Self-host** (your team; no required Rivet Cloud connection). ([Enterprise](https://rivet.dev/enterprise/))

### BYOC specifics (official)

[BYOC overview](https://rivet.dev/docs/deploy/byoc/):

- Deploys **Rivet Enterprise Edition** inside your VPC, fully managed by Rivet.
- Managed updates/maintenance; **no inbound** management connection (operator connects out).
- Public or private access; dashboard included; workers on Kubernetes, ECS, Cloud Run, etc.

[BYOC architecture](https://rivet.dev/docs/deploy/byoc/architecture/):

1. Request deploy/update via Enterprise Support  
2. Operator receives instructions from Rivet Cloud  
3. Operator applies update in your cluster  
4. Operator reports status  

Terraform provisions networking, K8s, registry, object storage, secrets, operator; Rivet deploys control plane. AWS and Google Cloud. ([BYOC architecture](https://rivet.dev/docs/deploy/byoc/architecture/); [BYOC changelog](https://rivet.dev/changelog/2026-09-15-introducing-rivet-byoc/))

Outbound still needed for: command polling/status, release downloads/logs, cloud APIs/registries. Fully air-gapped → contact Rivet. Multi-region: each region own VPC/cluster/operator/control plane; private connectivity; shared registry. ([BYOC architecture](https://rivet.dev/docs/deploy/byoc/architecture/))

Changelog: 14-day free trial; available with Enterprise Edition. ([Introducing Rivet BYOC](https://rivet.dev/changelog/2026-09-15-introducing-rivet-byoc/))

### Rivet-managed vs user-managed (summary from docs)

| Concern | BYOC (Rivet-managed in your cloud) | Fully self-hosted (user-managed) |
|---------|------------------------------------|----------------------------------|
| Control plane location | Your VPC | Your infrastructure |
| Who updates/maintains CP | Rivet (via outbound operator) | Your team |
| Inbound from Rivet Cloud | Not required | N/A / none |
| Air-gapped | Contact for special path | Documented path |
| Edition | Enterprise Edition | OSS and/or Enterprise Edition |

### Factory fit

Docs support Cloud → BYOC → self-host progression with the same Actor programming model.  
**ASSUMPTION (Factory):** Production data residency may prefer BYOC or self-host; Rivet docs do not prescribe Factory’s stage order.

---

## 4. Sandbox Agent — API surface, runtimes, isolation, lifecycle

### What it is

> Sandbox Agent runs inside your sandbox and gives your app one API for Claude Code, Codex, OpenCode, Cursor, Amp, and Pi. Stream events, handle permissions, and manage sessions from the TypeScript SDK or HTTP.

Sources: [Sandbox Agent docs](https://rivet.dev/sandbox-agent/docs/), Context7 `/websites/rivet_dev_sandbox-agent`.

Listed under **Libraries** (with Secure Exec), separate from Actors/Agents/Workflows/agentOS. ([llms.txt](https://rivet.dev/llms.txt); site chrome)

### Isolation model (as docs state)

Architecture components ([Architecture](https://rivet.dev/sandbox-agent/docs/architecture/), Context7):

- **Your app** — `sandbox-agent` TypeScript SDK over HTTP  
- **Sandbox** — isolated runtime (local process, Docker, E2B, Daytona, Vercel, Cloudflare, …)  
- **Sandbox Agent server** — single binary **inside** the sandbox  
- **Agent process** — coding agent spawned by server; **each session maps to one agent process**

Docs attribute isolation to the **sandbox provider/runtime**; Sandbox Agent is the in-sandbox control server (does not claim to be the VM/cgroup boundary). ([Architecture](https://rivet.dev/sandbox-agent/docs/architecture/); prior Project note aligns)

Security: run SDK on backend, not browser; sandbox credentials stay server-side. ([Security](https://rivet.dev/sandbox-agent/docs/security/))

Orchestration: Browser → your backend (SDK) → Sandbox Agent server. Recommends Rivet Actors for long-lived connections, session routing, persistence. ([Orchestration Architecture](https://rivet.dev/sandbox-agent/docs/orchestration-architecture/))

### Supported agent runtimes (docs)

Named agents: **Claude Code, Codex, OpenCode, Cursor, Amp, Pi**. ([docs overview](https://rivet.dev/sandbox-agent/docs/); agent pages under `/sandbox-agent/docs/agents/`)

Built-in sandbox providers (SDK overview / Project note from same docs): local, docker, e2b, daytona, agentcomputer, vercel, cloudflare; deploy docs also list modal, boxlite, computesdk. ([SDK Overview](https://rivet.dev/sandbox-agent/docs/sdk-overview/); [llms.txt](https://rivet.dev/llms.txt) deploy tree)

### Lifecycle (documented)

`SandboxAgent.start()` flow ([Architecture](https://rivet.dev/sandbox-agent/docs/architecture/)):

1. Provision sandbox  
2. Install Sandbox Agent binary  
3. Boot HTTP server  
4. Health check `/v1/health`  
5. Ready — SDK returns client  

Server recovery: after 3 consecutive health-check failures, SDK calls provider `ensureServer()`. Local provider: provisioning no-op; server as local subprocess.

Sessions: create / resume / destroy; prompts; event streaming; persistence drivers (incl. Rivet Actor examples). ([SDK Overview](https://rivet.dev/sandbox-agent/docs/sdk-overview/); [Multiplayer](https://rivet.dev/sandbox-agent/docs/multiplayer/))

Desktop: managed virtual desktop (Xvfb + openbox); start/stop/stream/recording APIs. ([Computer Use](https://rivet.dev/sandbox-agent/docs/computer-use/), Context7)

### API surface (official HTTP table)

Default listen port **2468**. OpenAPI: https://rivet.dev/sandbox-agent/openapi.json. ([API reference](https://rivet.dev/sandbox-agent/docs/api-reference/))

**Groups (complete endpoint list on that page):**

| Area | Methods / paths (summary) |
|------|---------------------------|
| Health | `GET /v1/health` |
| Agents | `GET /v1/agents`, `GET /v1/agents/{agent}`, `POST /v1/agents/{agent}/install` |
| ACP | `GET/POST/DELETE /v1/acp…` |
| MCP config | `GET/PUT/DELETE /v1/config/mcp` |
| Skills config | `GET/PUT/DELETE /v1/config/skills` |
| Filesystem | `GET /v1/fs/entries`, `GET/PUT /v1/fs/file`, `DELETE /v1/fs/entry`, `POST /v1/fs/mkdir|move|upload-batch`, `GET /v1/fs/stat` |
| Processes | `GET/POST /v1/processes`, config, `POST /v1/processes/run`, per-id get/delete/input/kill/stop/logs, terminal resize + `GET …/terminal/ws` |
| Desktop | start/stop/status, clipboard, display, keyboard, mouse, launch/open, screenshot/region, windows focus/move/resize, recording CRUD/download, WebRTC stream start/stop/status/signaling |

SDK helpers also document: `getHealth`, `listAgents`, `installAgent`, FS helpers, `createSession` / `resumeOrCreateSession`, `setMcpConfig` / `setSkillsConfig`, desktop start/stop. (Context7 `/websites/rivet_dev_sandbox-agent`)

### Limits

Product soft/hard Actor limits do not apply to Sandbox Agent HTTP itself unless Actors host the session. Sandbox Agent docs do not publish a single numeric quota table on the overview; provider/runtime limits are those of the chosen sandbox. (Absence noted — no invented limits.)

### Factory fit

Documented as the unified coding-harness control plane inside isolated compute; Rivet Actors recommended as orchestration/persistence host. Aligns with Factory “Sandbox Agent as harness” **when** Factory chooses Rivet Actors to own sessions ([`rivet-sandbox-agent.md`](./rivet-sandbox-agent.md) labels).  
**ASSUMPTION (Factory):** Mapping each WorkAttempt → one sandbox session is Factory design, not a Rivet product primitive name.

---

## 5. Actors — what they are, state, single-writer, relation to supervisors/queues

### What official docs say

> One Actor per agent, per session, per user. An Actor is a long-lived process with durable state, a queue, realtime connections, and scheduling, addressed by key and scheduled by the control plane.

([Actors overview](https://rivet.dev/actors/docs/))

Built-in: state, lifecycle (sleep/wake), keys, events, queues, scheduling, actor-to-actor calls, edge placement. Workflows and agentOS VMs are built **on** Actors. ([Actors overview](https://rivet.dev/actors/docs/))

### State

Three storage modes ([State](https://rivet.dev/actors/docs/state/)):

1. **Durable `c.state`** — serializable, auto-persisted; throttle save (`stateSaveInterval`, default 1s); `c.saveState({ immediate: true })` for forced flush.  
2. **Ephemeral `c.vars`** — not persisted; `createVars` on every wake.  
3. **SQLite `c.db`** — per-actor embedded DB on actor volume.

**State isolation:** each actor’s state is fully isolated; others access only via actions. ([State](https://rivet.dev/actors/docs/state/))

Design patterns: isolated state → “no shared state means no conflicts and no locks.” ([Design Patterns](https://rivet.dev/actors/docs/design-patterns/))

### Lifecycle (docs / Context7)

Public lifecycle page + Context7 ASCII: Loading → Ready → Started; idle → SleepGrace → SleepFinalize; Destroy → Terminated. `onSleep` not called on crashes (production checklist). ([Lifecycle](https://rivet.dev/actors/docs/lifecycle/); Context7 `/rivet-dev/actors`; [Production Checklist](https://rivet.dev/actors/docs/production-checklist/))

### Single-writer ownership

**Product docs (public):**

- Chat-room learn content (Context7 from actors docs): “A single serialized writer: all `sendMessage` calls for one room run through one actor… without locks.” (Context7 `/rivet-dev/actors` ← `docs/content/learn/chat-room.mdx`)
- Queues: process work **in order**; “helps avoid race conditions.” ([Queues](https://rivet.dev/actors/docs/queues/))
- Changelog: messages “processed one at a time.” ([Queues changelog](https://rivet.dev/changelog/2026-02-25-queues-for-rivet-actors/))

**Engine / internal docs surfaced via Context7 `/rivet-dev/actors` (not duplicated as a user-facing “CAS claim” API):**

- Pegboard: **single writer per database**; “Never two writers on the same database at the same instant.” (`engine/packages/depot/CLAUDE.md`, `docs-internal/engine/sqlite/constraints-and-design-decisions.md`)
- Generation-token fencing on SQLite ops: `(generation, expected_head_txid)` CAS; fence mismatch fatal; takeover bumps generation. (`docs-internal/rivetkit-typescript/sqlite-ltx/key-decisions.md`)

No official product page documents a user-facing “claim lease + CAS” API for dispatch. Closest documented application mechanism: **one actor key + durable queue/run loop**.

### Relation to supervisors / queues

Official **Coordinator & Data Actors** pattern ([Design Patterns](https://rivet.dev/actors/docs/design-patterns/)):

- **Data actors** — main entity logic  
- **Coordinator actors** — index/track other actors (e.g. chat room list)

Also: sharding, fan-in/fan-out. Anti-patterns: god actor; actor-per-request.

Queues are **local per actor** (scoped by actor key/id). Recommendations: actions for reads; queue entries for mutations; route most state changes through one queue loop. ([Queues](https://rivet.dev/actors/docs/queues/))

### API surface (Actors)

- Define: `actor({ state, actions, queues, run, … })` + `setup` / `registry.start()`  
- Client: `createClient`, `getOrCreate` / `create` / `getForId`, `.connect()`, `.send()`, actions, `.fetch()` for `onRequest`  
- Low-level: `onRequest`, `onWebSocket`, gateway `…/gateway/{actorId}/request/…` ([Request Handler](https://rivet.dev/actors/docs/request-handler/))  
- HTTP/OpenAPI/AsyncAPI under https://rivet.dev/docs/api/ ([llms.txt](https://rivet.dev/llms.txt))

### Limits (selected soft defaults)

From [Limits](https://rivet.dev/actors/docs/limits/):

| Limit | Soft default | Hard |
|-------|--------------|------|
| Max queue size | 1,000 msgs | — |
| Max queue message size | 64 KiB | — |
| Max scheduled events | 1,000 | — |
| Action timeout | 60s | — |
| Incoming WS message | 64 KiB | 16 MiB |
| Outgoing WS message | 1 MiB | 16 MiB |
| Actor start wait (HTTP) | — | 45s |
| Node lost threshold | — | 40s |

### Factory fit

Documented Actor = durable keyed process with state/queue/events/schedule — suitable as Factory execution units.  
**ASSUMPTION (Factory):** Names like `ProjectSupervisor`, `WorkAttempt`, `AgentSession` are Factory actor **types** ([`rivet-engineering-spec.md`](./rivet-engineering-spec.md)), not Rivet product primitives. Closest official pattern: **Coordinator + Data actors** + per-entity keys.

---

## 6. Queues — durable ordered queues, per-actor semantics, redelivery, docs conflict

### What official docs say

[Queues & Run Loops](https://rivet.dev/actors/docs/queues/):

- **Realtime** delivery to live actor  
- **Durable** — persist across sleep/restart  
- **Request/response** optional  
- **Scalable** — absorb bursts  
- **Local per actor** — own queue storage by key/id  

Good for state-changing work; ordered handling helps avoid races.

API surface:

- Define `queues: { name: queue<TMessage, TComplete?>() }`  
- Consume: `c.queue.iter()`, `next`, `nextBatch`, `tryNext`, `tryNextBatch`  
- Publish: `handle.send(...)`, `c.queue.send(...)`  
- Completable: `iter({ completable: true })` + `message.complete(...)`  
- Multi-queue via `names`  
- Abort via `signal` / `c.aborted`

Changelog: “Durable and ordered… processed one at a time.” ([Queues changelog](https://rivet.dev/changelog/2026-02-25-queues-for-rivet-actors/))

Removal timing (queues page): messages removed from queue storage **when received**, not when completed: “`message.complete()` … does not change durability: messages are removed from queue storage when they are received, not when they are completed.”

### Docs conflict — fail before `complete()`

**Side A — Queues feature page** ([https://rivet.dev/actors/docs/queues/#completable-messages](https://rivet.dev/actors/docs/queues/#completable-messages)):

> If processing fails before `message.complete()`, the message is **not redelivered**, and any waiting sender times out instead of receiving a completion.

**Side B — Production checklist** ([https://rivet.dev/actors/docs/production-checklist/#queues](https://rivet.dev/actors/docs/production-checklist/#queues)):

> Ensure queue handlers are idempotent. If processing fails before `message.complete()`, the message will be **retried**. See Queues.

These two official pages **disagree**. Context7 mirrors both wordings depending on source file. Treat completable failure/redelivery as **ambiguous** until Rivet reconciles the docs.

### Limits

`maxQueueSize` default 1,000; `maxQueueMessageSize` 64 KiB ([Limits](https://rivet.dev/actors/docs/limits/); checklist).

### Pitfalls (docs)

Avoid `wait: true` between actors (deadlock risk; self-wait guaranteed deadlock). ([Queues pitfalls](https://rivet.dev/actors/docs/queues/#pitfalls))

### Factory fit

Documented per-actor ordered durable queues support serializing admission/mutations on one actor. Given the conflict, handlers must be **idempotent** either way; prefer app-level receipts (`idempotencyKey` in actor state) over depending on Rivet redelivery — **ASSUMPTION (Factory ops practice)** grounded in the documented ambiguity ([`rivet-claim-fencing.md`](./rivet-claim-fencing.md)).

---

## 7. Supervisors — ProjectSupervisor pattern, admission control, fencing

### What official Rivet docs provide

**There is no Rivet product primitive named `ProjectSupervisor`.** Official closest patterns:

1. **Coordinator & Data Actors** — coordinator indexes/creates data actors; data actors hold entity logic. ([Design Patterns](https://rivet.dev/actors/docs/design-patterns/))  
2. **Per-entity actors** + **queues** for ordered mutation. ([Design Patterns](https://rivet.dev/actors/docs/design-patterns/); [Queues](https://rivet.dev/actors/docs/queues/))  
3. **Fan-out / fan-in** coordinators distributing work. ([Design Patterns](https://rivet.dev/actors/docs/design-patterns/))  
4. Engine **single-writer / Pegboard exclusivity** + optional generation fencing (Context7 `/rivet-dev/actors` internal docs — §5).

Agents docs index lists design patterns including keys, subagents, workflows, schedules (Context7 `/rivet-dev/agents` ← agents docs index) — still no `ProjectSupervisor` name.

### Admission control (documented mechanisms only)

Official docs do **not** name “admission control” as a product feature. Documented building blocks that can implement capacity gating:

- Coordinator actor holding indexes/state  
- Queue serialization on that actor  
- Soft limits (`maxQueueSize`, schedule caps, node/pool sizing on Cloud)

Anything called “admission control” for Factory work starts is **application logic**.

### Fencing (documented)

- **Application-level:** single actor + ordered queue (public docs).  
- **Engine-level:** Pegboard single-writer; SQLite generation fencing (Context7 internal actors docs).  
- **Not documented:** CAS claim-lease API for cross-system job claims.

### Factory fit — labeled assumptions

**ASSUMPTION (Factory):** `ProjectSupervisor` = one Rivet Actor per project, typed after the Coordinator pattern, owning a command queue that admits `factory.work.start` under capacity. ([`rivet-engineering-spec.md`](./rivet-engineering-spec.md))  
**ASSUMPTION (Factory):** Fencing Port/Beads claim races by funneling all admit paths through that actor’s queue — uses documented queue ordering + single-writer ownership; not a Rivet “claim fence” product. ([`rivet-claim-fencing.md`](./rivet-claim-fencing.md))

---

## 8. Other primitives

### 8.1 Workflows

> Durable TypeScript workflows built on Rivet Actors: recorded steps, retries, human approvals, and runs that resume after restarts and deploys. … Every workflow is a Rivet Actor.

([Workflows](https://rivet.dev/workflows/docs/))

- `ctx.step` records results; replay returns instantly for completed steps.  
- Inherits Actor identity, state, queue, scheduling.  
- Queue waits, timers/concurrency, failure/recovery, versioning documented in linked sections.  
- Package: `@rivet-dev/workflows`.  
- Checklist: avoid infinite steps; use `ctx.loop`. ([Production Checklist](https://rivet.dev/actors/docs/production-checklist/))

**Factory fit:** Documented for multi-step durable runs / HITL; **ASSUMPTION (Factory):** `AssemblyWorkflow` is a Factory workflow type name.

### 8.2 Schedules

[Schedule & Cron](https://rivet.dev/actors/docs/schedule/):

| API | Use |
|-----|-----|
| `c.schedule.after(delayMs, action, …args)` | One-shot relative delay |
| `c.schedule.at(timestamp, action, …args)` | One-shot absolute time |
| `c.cron.set({ name, expression, action, … })` | Named cron (5-field; IANA timezone) |
| `c.cron.every({ name, interval, action, … })` | Fixed interval; **min 5s** |

Survive sleep/restart. Failed runs not retried immediately; recurring continues next cadence; overlapping recurring runs **skipped**; actions should be idempotent. Max pending schedules soft limit 1,000; cron history defaults 100 (max 1,000 per job; 10,000 across jobs). ([Schedule](https://rivet.dev/actors/docs/schedule/); [Limits](https://rivet.dev/actors/docs/limits/))

Agents product also documents schedules in its tree ([llms.txt](https://rivet.dev/llms.txt) `/agents/docs/schedules/`).

**Factory fit:** Documented for delayed retries, sweeps, cron maintenance on Actors.

### 8.3 Webhooks

Not a separate Rivet broker product — **guides** show patterns:

- **Handle Incoming Webhooks:** HTTP route verifies signature → `workflow.send` to per-customer workflow queue → ordered apply + dedupe by event id. ([Handle webhooks](https://rivet.dev/guides/handle-webhooks/))  
- **Reliable Webhook Delivery:** outbound delivery with retries (linked from that guide). ([Webhook delivery](https://rivet.dev/guides/webhook-delivery/))

**Factory fit:** Documented pattern for Port/GitHub webhooks into Actor/workflow queues. **ASSUMPTION (Factory):** thin gateway verifies Port identity then enqueues to supervisor.

### 8.4 HTTP endpoints

- High-level **actions** (RPC).  
- Low-level **`onRequest`**: WinterTC `Request`/`Response`; Hono integration; path via `.fetch()`, `getGatewayUrl()`, or `https://…/gateway/{actorId}/request/{path}`. ([Request Handler](https://rivet.dev/actors/docs/request-handler/))  
- `OPTIONS` handled by Rivet, not passed to `onRequest`.  
- SSE/streaming responses documented on same page.

**Factory fit:** Documented for webhook ingress and custom HTTP on Actors.

### 8.5 Streaming / realtime

- **Events:** `c.broadcast` / `conn.send`; clients `.connect()` + `.on`. ([Events](https://rivet.dev/actors/docs/events/))  
- **SSE** via `onRequest` ReadableStream (`text/event-stream`). ([Request Handler](https://rivet.dev/actors/docs/request-handler/))  
- **WebSocket** low-level handler ([WebSocket Handler](https://rivet.dev/actors/docs/websocket-handler/) — indexed in llms.txt).  
- Sandbox Agent: session event streams + desktop WebRTC signaling. ([API reference](https://rivet.dev/sandbox-agent/docs/api-reference/))  
- Limits: WS message sizes; streaming HTTP idle timeout “None” at Rivet (proxies may differ); recommend SSE heartbeats. ([Limits](https://rivet.dev/actors/docs/limits/))

**Factory fit:** Documented for live progress UIs and agent event fan-out via Actors (and Sandbox Agent event schema).

---

## 9. Cross-cutting Factory mapping table

| Factory concept (from Project store) | Official Rivet capability | Label |
|--------------------------------------|---------------------------|-------|
| Execution kernel | Actors + queues + workflows + schedules | Docs |
| Coding harness | Sandbox Agent library | Docs |
| `ProjectSupervisor` | Coordinator actor + queue (pattern) | **ASSUMPTION** name |
| Claim fencing | Per-actor ordered queue + single-writer | Docs mechanism; **ASSUMPTION** Factory use for Port/Beads |
| WorkAttempt / AgentSession | Actor-per-entity + Sandbox Agent session | **ASSUMPTION** types |
| Live progress | Actor events / SSE | Docs |
| Deploy | Cloud / BYOC / self-host | Docs |

---

## 10. Explicit non-claims (docs silence)

Official sources reviewed for this document **do not** establish:

- A Rivet product API named claim lease / CAS dispatch fence  
- A Rivet product type named `ProjectSupervisor`  
- That Sandbox Agent *is* Rivet’s Actor runtime (it is a library that often runs *with* Actors)  
- Resolution of the queues fail-before-complete conflict (both sides cited above)

---

## Sources checklist

- https://rivet.dev/llms.txt  
- Context7: `/rivet-dev/actors`, `/rivet-dev/agents`, `/websites/rivet_dev_sandbox-agent`  
- https://rivet.dev/pricing/  
- https://rivet.dev/docs/deploy/cloud/ · …/compute/ · …/self-host/control-plane/ · …/byoc/ · …/byoc/architecture/  
- https://rivet.dev/docs/architecture/  
- https://rivet.dev/enterprise/  
- https://rivet.dev/changelog/2026-09-15-introducing-rivet-byoc/  
- https://rivet.dev/changelog/2026-02-25-queues-for-rivet-actors/  
- https://rivet.dev/actors/docs/ · state · queues · design-patterns · schedule · events · request-handler · limits · production-checklist · lifecycle  
- https://rivet.dev/workflows/docs/  
- https://rivet.dev/guides/handle-webhooks/ · webhook-delivery/  
- https://rivet.dev/sandbox-agent/docs/ · architecture · sdk-overview · api-reference · security · orchestration-architecture · multiplayer · computer-use  
