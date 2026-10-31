# Factory Engineering Spec — Rivet Execution Kernel

**Status:** Implementable engineering specification  
**Source:** `internal/rivet-platform-evaluation-source.md` (ChatGPT evaluation export, Oct 26–28 2026)  
**Audience:** Engineers building Factory’s durable execution and agent runtime  
**Decision baseline:** Port governs + authenticates · Rivet runs · Beads selects ready work · Polygraph coordinates multi-repo coding · GitHub verifies  
**Auth decision (Johnny, 2026-10-28):** Clerk is **not needed** — Port covers auth. Port is the **main backend for the external client**. Capability inventory: [`port-capabilities.md`](./port-capabilities.md).

---

## 1. Goals & non-goals

### 1.1 Goals

1. Make **Rivet the primary execution kernel** for Factory: durable actors, workflows, queues, scheduling, session state, recovery, and realtime progress.
2. Use **Sandbox Agent** as the single coding-harness control plane (Claude Code / Codex / OpenCode / Pi / others) inside isolated compute.
3. Keep **Port** as the sole **auth, governance, catalog, and approval** gateway for humans and agents (internal and external MCP), and as the **main backend** the external client talks to for authorized actions and catalog data.
4. Keep **Beads** as the sole authority for task readiness/dependencies; **Polygraph** as multi-repo coding coordination (not a second runtime).
5. Require **independent acceptance** via GitHub CI on an exact commit SHA — agent “done” ≠ accepted work.
6. Ship a **desktop pilot** first: Rivet in Docker on Johnny’s machine, Tailscale private access, on-demand Docker sandboxes for coding.
7. Prefer **reuse of Rivet-documented patterns** (durable agents, coding-agents guide, multiplayer, HITL, webhooks, workflows) over custom orchestration.
8. Authenticate the Developer OS / external client via a **dedicated Factory Port External Interface OAuth app** (person-scoped PKCE tokens). Do **not** reuse Harness Observatory or introduce a parallel identity provider.

### 1.2 Non-goals

- Replacing Port with a custom control plane or second catalog.
- Making Rivet own task truth, BOM/catalog truth, authorization truth, or user identity.
- Using **Clerk** (or any second app IdP) for Factory auth — out of scope; Port owns identity for the external client.
- Using agentOS as the sole production isolation boundary for untrusted code (pilot only).
- Declaring Rivet 3.0 Preview the production foundation.
- Building a custom streaming bus, session engine, or per-harness adapter when Rivet + Sandbox Agent already cover it.
- Expanding this spec into a full IDE, or treating Code Atlas as a prerequisite for the execution kernel.
- Requiring a Turso/libSQL approval ledger in v1 when Port workflow runs + audit cover approval receipts (optional local ledger only if Port run history proves insufficient).

---

## 2. System context

Factory is a **software-production OS**: idea/spec → reusable assembly → dependency-aware tasks → isolated agent execution → independent verification → deploy/learn.

```text
┌─────────────────────────────────────────────────────────────┐
│ Developer OS (Next.js) · CopilotKit / Rivet native client   │
│ Sign in with Port · Intent · Approvals UI · Live progress   │
└────────────────────────────┬────────────────────────────────┘
                             │ Port OAuth token + API / MCP
┌────────────────────────────▼────────────────────────────────┐
│ PORT — Auth + governance + external-client backend          │
│ Identity (OAuth/SSO) · Catalog · Permissions · Approvals    │
│ MCP gateway (internal + external agents, same contract)     │
└───────┬───────────────────────────────┬─────────────────────┘
        │ authorize / initiate          │ catalog projections
┌───────▼──────────────┐     ┌──────────▼─────────────────────┐
│ Beads + Dolt         │     │ Trail-code / Graft · Polygraph │
│ Ready work · Claims  │     │ Code context · Multi-repo coord│
└───────┬──────────────┘     └──────────┬─────────────────────┘
        │ eligible tasks                │ handoffs / PR links
┌───────▼───────────────────────────────▼─────────────────────┐
│ RIVET — Execution kernel                                    │
│ ProjectSupervisor · AssemblyWorkflow · WorkAttempt          │
│ AgentSession · CapacityManager · SandboxLease               │
│ Queues · Schedules · Workflows · Realtime · Actor SQLite    │
└───────┬───────────────────────────────┬─────────────────────┘
        │ harness control               │ OTel / events
┌───────▼──────────────┐     ┌──────────▼─────────────────────┐
│ Sandbox Agent        │     │ Langfuse (+ OTel collector)    │
│ Claude/Codex/OpenCode│     │ Traces · Cost · Evaluations    │
└───────┬──────────────┘     └────────────────────────────────┘
        │ runs inside
┌───────▼─────────────────────────────────────────────────────┐
│ Compute tiers                                               │
│ T1 agentOS (pilot, bounded) · T2 Docker local/cloud Linux   │
└───────┬─────────────────────────────────────────────────────┘
        │ commits / checks
┌───────▼─────────────────────────────────────────────────────┐
│ GitHub + Actions · Vercel deploys · R2/S3 artifacts         │
└─────────────────────────────────────────────────────────────┘
```

**Networking (pilot):** Rivet + Factory control UI on desktop Docker; Tailscale Serve for private access. Browsers authenticate via **Port**; talk to Port (catalog/actions) and Rivet (realtime/session) through a thin Factory gateway that verifies Port identity. Browsers **never** talk directly to sandbox terminal APIs on the public/tailnet edge.

---

## 3. Architecture

### 3.1 Ownership principle (one truth each)

| Concern | Authority | Must not own |
|--------|-----------|--------------|
| Identity, catalog, permissions, approvals, governed MCP | **Port** (dedicated Factory External Interface OAuth for humans; machine/org credentials for unattended — not Harness Observatory) | Sandbox processes, runtime recovery, task readiness |
| Task readiness / blockers | **Beads** | Coding process lifecycle |
| Multi-repo agent handoffs / PR relationships | **Polygraph** | Compute, duplicate dispatch of same attempt |
| Durable execution / recovery / live agent state | **Rivet** | Task backlog, enterprise catalog, user identity |
| Coding-harness protocol | **Sandbox Agent** | Authorization, acceptance |
| Isolation / OS | **Docker (or stronger sandbox)** / agentOS pilot | Planning decisions |
| Code structure intelligence | **Trail-code / Graft / Code Atlas indexer** | Execution leases |
| Source + independent CI evidence | **GitHub** | Agent orchestration |
| Historical LLM analytics | **Langfuse** | Live “is process running” authority |
| Product UI shell | **Developer OS** | Authz truth, execution authority |

### 3.2 Rivet version strategy

| Track | Use |
|-------|-----|
| **Rivet 2.x** | Baseline for first durable-agent / execution-kernel implementation (ACLs / current production features as needed). |
| **Rivet 3.0 Preview** | Separate evaluation track (WarpDrive, S3-compatible storage). Do **not** gate v1 on 3.0. Missing: multi-region, serverless, ACLs; migration tooling incomplete. |

**Assumption:** First Rivet worker is a **dedicated service** (desktop Docker Compose or long-lived VM), not “Vercel-only serverless worker as sole path” (3.0 lacks serverless; even on 2.x, durable coding work should not depend solely on ephemeral serverless).

### 3.3 Compute tiers

| Tier | Runtime | When |
|------|---------|------|
| **T0** | Rivet Actor only (no sandbox) | Planning, analysis, Port tools, model+tool loops without shell |
| **T1** | **agentOS** (beta — pilot) | Bounded TS/Python scripts, transforms, light automation, compatible previews |
| **T2** | **Docker / full Linux** + Sandbox Agent | Coding harnesses, arbitrary binaries, builds, browsers, Docker-in-sandbox needs |

**Rule:** Prefer T0 → T1 → T2 by capability need. agentOS is **not** unrestricted Linux (no arbitrary apt, container runtime, full kernel). Ordinary Docker containers are OK for **trusted desktop pilot**; not the sole production isolation boundary for untrusted workloads. Docker Cloud Sandboxes are a valid T2 target via **custom adapter** (not assumed built-in Sandbox Agent provider until proven).

### 3.4 Storage preference

| Data | Store |
|------|-------|
| Actor/workflow state | Rivet Actor SQLite (+ platform persistence) |
| Durable object blobs / artifacts | **S3-compatible** — prefer **Cloudflare R2** after Rivet backend compatibility check; **S3** as safe default |
| App assets | Vercel Blob OK for app assets; **not** agent-state backend |
| Catalog / relationships | Port |
| Approvals / run receipts | **Port** workflow runs + audit (preferred); optional Turso only if proven necessary |
| Source | GitHub |
| Session event history | Sandbox Agent persistence driver backed by **Rivet Actor** (default in-memory is insufficient) |

---

## 4. Components

### 4.1 Factory-owned Rivet actors / workflows

These are **Factory definitions** on Rivet primitives — not prebuilt Rivet product types.

| Name | Kind | Responsibility |
|------|------|----------------|
| `ProjectSupervisor` | Actor | Per-project execution controller: watches Beads readiness signals, admits work under capacity, tracks running/blocked/completed attempts |
| `AssemblyWorkflow` | Workflow | Deterministic BOM/scaffold/CI assembly steps; waits for verified outcomes; idempotent side effects |
| `WorkAttempt` | Actor | Exactly one attempt: lease, idempotency key, retries, deadlines, completion evidence |
| `AgentSession` | Actor | Logical session identity; binds Pi Durable and/or Sandbox Agent session; persists events; broadcasts to UI |
| `CapacityManager` | Actor | Per-project concurrency, budget reservation, admission control |
| `SandboxLease` | Actor | Provision / reconnect / health / checkpoint / cleanup of compute environment |
| `PreviewSession` | Actor | **Deferred** until real preview lifecycle is implemented (Dynamic Apps pilot optional) |

**Dispatch rule:** Exactly **one** dispatch owner per work attempt. If Polygraph launches a child coding agent, Rivet **supervises** that invocation; Rivet must not start a second attempt for the same `attemptId`.

### 4.2 Adjacent components (integrate, don’t reimplement)

| Component | Integration duty |
|-----------|------------------|
| Port | **Auth (dedicated Factory External Interface OAuth app)**, catalog, permissions, approvals; expose Factory commands as governed actions/MCP tools; machine identity for unattended runs; primary API backend for the external client — see [`port-capabilities.md`](./port-capabilities.md). Do not reuse Harness Observatory. |
| Beads | `listReady` / claim / complete / block APIs or repo events consumed by `ProjectSupervisor` |
| Polygraph | Session/PR coordination metadata; never bypasses Port auth or WorkAttempt lease |
| Sandbox Agent | HTTP API for harnesses; image `rivetdev/sandbox-agent:0.5.2-full` (pin; bump deliberately) |
| Pi Durable | Built-in assistant loop (beta); approvals wired to Port — Pi has no built-in approval flow |
| Clerk | **Out of scope** — not used for Factory; Port owns identity |
| Turso ledger | Optional; default to Port run/audit receipts |
| Langfuse | Historical traces/evals/cost via OTel |
| Tailscale | Private access to control plane |
| Code Atlas | Optional subscriber to agent activity overlay; offline graph works without Rivet |

### 4.3 Frontend streaming choice

- **Streaming engine:** Rivet Actor realtime (WebSocket) + Sandbox Agent SSE into the Actor — **do not** invent another bus.
- **UI option A (preferred for kernel vertical slice):** Rivet native React client / thin Factory wrappers.
- **UI option B:** CopilotKit + AG-UI — requires an **explicit Rivet→AG-UI adapter**. Do not claim AG-UI is required for streaming itself.

---

## 5. Data / state model

### 5.1 Correlation IDs (mandatory on every record)

```text
projectId → taskId → workAttemptId → actorId → sandboxId → agentSessionId → traceId → commitSHA
```

### 5.2 Core objects

#### `AgentSession`

```ts
type AgentSession = {
  schemaVersion: "agent-session/v0";
  sessionId: string;           // stable logical ID
  projectId: string;
  revision: number;            // monotonic; required for optimistic concurrency
  harness: "pi" | "claude-code" | "codex" | "opencode" | "other";
  computeTier: "T0" | "T1" | "T2";
  state:
    | "created"
    | "ready"
    | "running"
    | "awaiting_approval"
    | "paused_checkpoint"      // cooperative only if harness supports
    | "recovering"
    | "failed"
    | "completed"
    | "cancelled";
  environment?: {
    sandboxId?: string;
    provider: "none" | "agentos" | "docker-local" | "docker-cloud" | "other";
    leaseActorId?: string;
  };
  currentRunId?: string;
  createdAt: string;           // ISO-8601
  updatedAt: string;
};
```

#### `WorkAttempt`

```ts
type WorkAttempt = {
  schemaVersion: "work-attempt/v0";
  attemptId: string;
  projectId: string;
  taskId: string;              // Beads task ID
  dispatchOwner: "rivet" | "polygraph";
  leaseExpiresAt: string;
  idempotencyKey: string;      // unique per logical start
  status: "leased" | "running" | "awaiting_evidence" | "succeeded" | "failed" | "expired";
  authorization: {
    portActionId: string;
    approvalId?: string;       // required for side-effecting actions
    principalId: string;
    expiresAt: string;
  };
  evidence?: {
    commitSha?: string;
    prUrl?: string;
    checkRunIds?: string[];
    artifactUris?: string[];
  };
  retryCount: number;
  maxRetries: number;
  deadlineAt: string;
};
```

#### `SessionCommand`

```ts
type SessionCommand = {
  schemaVersion: "agent-command/v0";
  commandId: string;
  sessionId: string;
  expectedRevision: number;
  principal: {
    kind: "human" | "agent" | "machine";
    id: string;
    portIdentity: string;
  };
  correlationId: string;
  requestedAt: string;
  command:
    | { type: "session.create"; args: SessionCreateArgs }
    | { type: "session.prompt"; args: { text: string } }
    | { type: "session.cancel"; args: { reason?: string } }
    | { type: "session.request_approval"; args: ApprovalPayload }
    | { type: "sandbox.checkpoint"; args: { includeUncommitted: boolean } }
    | { type: "work.attach_evidence"; args: EvidencePayload };
};
```

#### `SessionEvent`

```ts
type SessionEvent = {
  schemaVersion: "session-event/v0";
  sessionId: string;
  sequence: number;            // strictly increasing per session
  at: string;
  kind:
    | "state_changed"
    | "message"
    | "tool_call"
    | "tool_result"
    | "permission_request"
    | "terminal"
    | "file_change"
    | "error"
    | "evidence"
    | "heartbeat";
  payload: Record<string, unknown>;
  traceId?: string;
  attemptId?: string;
};
```

### 5.3 Lifecycle guards

1. Commands are rejected if `expectedRevision !== session.revision`.
2. Commands are **idempotent** on `commandId` (duplicate → same receipt, no second side effect).
3. Approvals bind to **exact** operation hash (action type + target IDs + args digest). Any change invalidates approval.
4. Sandbox destruction does **not** destroy `AgentSession` / `WorkAttempt`. Uncommitted sandbox FS is **not** recoverable unless checkpointed (git commit / artifact upload).
5. Sandbox Agent in-memory sessions are **not** source of truth; Actor persistence is.

### 5.4 State ownership matrix

| State | Owner | Survives sandbox death? |
|-------|-------|-------------------------|
| Catalog entity | Port | Yes |
| Task readiness | Beads | Yes |
| Attempt lease / retries | Rivet `WorkAttempt` | Yes |
| Conversation / checkpoints | Rivet `AgentSession` (+ Pi Durable where used) | Yes |
| Harness process / PTY | Sandbox Agent in sandbox | No |
| Working tree | Sandbox FS | No (unless committed/checkpointed) |
| Commits / PRs | GitHub | Yes |
| Trace history | Langfuse / OTel backend | Yes (after export) |

---

## 6. APIs / interfaces

### 6.1 Control path (canonical)

```text
UI (Port OAuth) / MCP client (Port token or machine credential)
  → Port (identity + authz + catalog action / workflow)
    → Factory thin gateway / Rivet (verifies Port identity server-side)
      → Rivet Actor action (SessionCommand)
        → Sandbox Agent HTTP (if coding)
          → harness
```

External agents and the built-in assistant **must** use the same Port-exposed command surface. The external client’s **primary backend for catalog and governed commands is Port**; Rivet is reached only for durable execution / realtime after Port authorization.

### 6.2 Port actions (minimum set)

Expose as governed Port actions / MCP tools (names stable; schemas versioned):

| Action | Input (summary) | Effect |
|--------|-----------------|--------|
| `factory.session.create` | projectId, harness, computeTier, taskId? | Creates `AgentSession` + optional `WorkAttempt` |
| `factory.session.prompt` | sessionId, text, expectedRevision | Enqueues prompt on session |
| `factory.session.cancel` | sessionId, expectedRevision | Cooperative cancel + lease release policy |
| `factory.work.start` | taskId, idempotencyKey | `ProjectSupervisor` admits attempt if Beads-ready + capacity |
| `factory.work.attach_evidence` | attemptId, commitSha, checks | Records evidence; does not accept |
| `factory.work.accept` | attemptId, commitSha, approvalId | Port-gated accept; Beads complete |
| `factory.sandbox.checkpoint` | sessionId | Commit/push or artifact snapshot |

Every action returns a **receipt**: `{ commandId, accepted, revision, attemptId?, denialReason? }`.

### 6.3 Rivet Actor action surface (internal)

`AgentSession` actor methods (illustrative):

- `handleCommand(cmd: SessionCommand): CommandReceipt`
- `subscribe(clientId): EventStream` (realtime)
- `reconcileSandbox(): void` (reconnect or reprovision)
- `exportEvents(fromSeq: number): SessionEvent[]`

`WorkAttempt` methods:

- `acquireLease(key, ttl)`
- `markRunning()`
- `awaitEvidence(signal)`
- `complete(evidence)` / `fail(error)` / `expire()`

### 6.4 Sandbox Agent integration

Follow Rivet **Sandbox Agent Multiplayer** pattern:

1. One Rivet Actor owns one Sandbox Agent session.
2. Actor configures **persistence driver** (Rivet Actor / SQLite / Postgres — prefer Rivet Actor for v1).
3. Actor consumes SSE events, normalizes to `SessionEvent`, persists, broadcasts to browsers.
4. Factory backend holds sandbox credentials; UI never gets raw `--no-token` sandbox URLs.
5. Pin image `rivetdev/sandbox-agent:0.5.2-full`; require auth token; do not bind `0.0.0.0` without Tailscale + auth.

### 6.5 Webhooks

Use Rivet webhook guide patterns:

- Verify signatures (GitHub).
- Deduplicate delivery IDs.
- Signal waiting workflows (`check_suite` / `pull_request` → `WorkAttempt.awaitEvidence`).
- Acceptance only when **check suite green on exact `commitSha`**.

### 6.6 Beads / Polygraph contracts

**Beads → Rivet:** `ReadyTaskEvent { taskId, projectId, revision, claimToken? }`  
**Rivet → Beads:** `AttemptStarted | AttemptFailed | AttemptSucceeded { attemptId, taskId, commitSha? }`  
**Polygraph → Rivet:** `DelegateCoding { parentAttemptId, childSpec, dispatchOwner: "polygraph" }` — Rivet creates child `WorkAttempt` with same idempotency namespace rules, does not double-dispatch.

---

## 7. Runtime & durability

### 7.1 Durable execution rules

1. Multi-step assembly and coding pipelines use **Rivet Workflows** (recorded steps, waits, signals, version-aware replay).
2. Actor-local messaging uses **Rivet queues** — no parallel custom job queue for the same work.
3. Scheduling/cron for reconciliation uses Rivet schedules, with **explicit recovery policy** (failed cron actions do **not** auto-retry immediately per Rivet docs).
4. External side effects (GitHub PR create, sandbox create, deploy, billing) require **idempotency keys** + reconciliation; durable history ≠ exactly-once external I/O.
5. Pi Durable checkpoints model/tool steps (beta). Do not rely on it for approval or for “filesystem restored after sandbox death.”

### 7.2 Desktop pilot topology

```text
Johnny desktop
├── docker compose
│   ├── rivet (control plane + workers)
│   ├── factory-api (thin: verify Port tokens, Port webhooks → Rivet, optional local ledger)
│   └── (optional) otel-collector
├── on-demand: sandbox-agent containers (per WorkAttempt or pooled)
└── Tailscale Serve → Port-authenticated Factory/Rivet UI/API only
```

Optional: Rivet on desktop, coding sandboxes on **Docker Cloud** via adapter; Tailscale still fronts control plane.

### 7.3 Recovery scenarios (required behaviors)

| Failure | Expected recovery |
|---------|-------------------|
| Rivet worker killed mid-workflow step | Resume workflow; completed steps not re-executed; external ops idempotent |
| Browser disconnect | Work continues; client resubscribes from last `sequence` |
| Sandbox expired | `SandboxLease` reprovisions; restore context from persisted events + git; lose uncommitted FS |
| Duplicate `work.start` | Same `idempotencyKey` → same `attemptId`; no second harness |
| Stale/expired Port approval | Deny side effect; session → `awaiting_approval` or `failed` |
| CI fails on SHA | `WorkAttempt` → failed/repair path; do not accept |
| Capacity exhausted | Queue/block; no spin loop |

---

## 8. Security & tenancy

### 8.1 Hard rules

1. Every agent action passes the **same authorization checks** as the equivalent human action (Port).
2. **Port is the IdP** for Factory humans via a **dedicated Factory External Interface OAuth app** (SSO if org-configured). Do not add Clerk, a parallel app IdP, or reuse Harness Observatory.
3. UI / AG-UI / realtime streams are **display channels**, not privileged control channels. Never trust a client-supplied `principal` field — derive identity from the verified Port token or machine credential.
4. Sandbox APIs are backend-only; Inspector/terminal private on tailnet; rate-limit + audit.
5. Scoped credentials into sandboxes (repo-limited PATs / installation tokens); no long-lived org-admin tokens in sandboxes.
6. Per-project compute/cost limits enforced by `CapacityManager`.
7. Actor identity isolation: no cross-project actor key access.
8. **Machine identity path** for unattended Port actions is distinct from interactive person OAuth; interactive MCP connectors ≠ workflow automation connector auth (see [`port-capabilities.md`](./port-capabilities.md)).
9. Ordinary Docker ≠ production isolation for untrusted code.

### 8.2 Tenancy model (v1 assumption)

**Assumption (confirm with Johnny):** Single-operator / single-tenant desktop pilot (Johnny’s projects), with **project-level** isolation in Rivet actor keys and Port blueprints. Multi-org SaaS tenancy is out of scope for the first kernel milestone.

### 8.3 Approval binding

```ts
type ApprovalPayload = {
  approvalId: string;
  actionType: string;
  targetDigest: string;  // hash(actionType + resourceIds + args)
  expiresAt: string;
  principalId: string;
};
```

Side effects execute only if `targetDigest` matches live command args and approval is unexpired.

---

## 9. Observability

### 9.1 Layers

| Layer | Tool | Purpose |
|-------|------|---------|
| Live runtime | Rivet Inspector + Sandbox Agent Inspector (`/ui/`) | Debug now |
| Auto instrumentation | Rivet OpenTelemetry (actors, SQLite, queues, schedules, workflows) | Distributed spans |
| Coding events | Sandbox Agent event stream (persisted) | Tool/permission/session replay |
| LLM analytics | Langfuse via OTel | Cost, evals, comparisons |
| Infra (later) | Grafana/Tempo | Optional |

### 9.2 Minimum instrumentation

1. Export Rivet OTel to collector → Langfuse (and/or Tempo).
2. Wrap Sandbox Agent prompt/tool SDK calls with OTel spans (per Sandbox Agent observability guide — not fully automatic).
3. Attach correlation ID set (§5.1) as span attributes.
4. Metrics: cost per **accepted** task / merged PR; retries; harness/model success rates; wait vs execute time.
5. Start: Rivet + Inspector + durable events; add Langfuse when cross-session cost/eval needed (Hobby cloud OK initially).

---

## 10. Failure modes & recovery

| Mode | Detection | Mitigation |
|------|-----------|------------|
| At-least-once webhook/command delivery | Duplicate IDs | Idempotency keys + receipt store |
| Cron miss / failed schedule | Missed reconcile | Explicit catch-up job on Actor timer |
| Harness hang | Deadline on `WorkAttempt` | Cancel + sandbox kill + fail attempt |
| Partial PR create | Provider error after timeout | Reconcile by idempotency key / branch name |
| Authz drift (stale catalog) | Denied action | Refresh Port entitlements; do not bypass |
| agentOS incompatibility | Capability probe fail | Automatic escalate T1→T2 |
| Pi Durable upgrade/replay limits | Version mismatch | Pin versions; document break-glass restart |
| Tailscale/desktop offline | Health check | Queue work; surface “control plane offline”; no silent data loss of durable state |
| Event gap on SSE reconnect | Sequence hole | Replay from persistence `fromSeq` |

**Acceptance never depends on agent self-report.** Only GitHub checks (and required Port approval) on exact SHA.

---

## 11. Milestones / phased delivery

Each milestone has **exit acceptance tests**. Do not start the next until gates pass.

### M0 — Desktop Rivet kernel bootstrap

**Deliver:** Docker Compose Rivet 2.x + Tailscale Serve + auth gate; health checks; Inspector reachable privately.

**Accept:**

- [ ] Rivet up on desktop; reachable only via tailnet + auth
- [ ] Actor create/sleep/wake with persisted state across container restart

### M1 — Session vertical slice (no full Factory UI)

**Deliver:** `AgentSession` + `SandboxLease` + Sandbox Agent (Docker local) + event persistence + one harness (Codex **or** Claude Code).

**Accept:**

- [ ] Create session → prompt → stream events → checkpoint commit to GitHub branch
- [ ] Kill sandbox mid-run → recover session identity + event history (not unsaved FS)
- [ ] UI/client reconnect from last sequence

### M2 — WorkAttempt + Beads readiness + one-owner dispatch

**Deliver:** `ProjectSupervisor`, `WorkAttempt`, Beads ready/claim integration, idempotent `work.start`.

**Accept:**

- [ ] Duplicate start events → single attempt
- [ ] Non-ready Beads task cannot start
- [ ] Capacity limit blocks excess concurrency

### M3 — Port auth + governance + approvals

**Deliver:** Dedicated **Factory** Port External Interface OAuth app for the external client (not Harness Observatory); Port actions for session/work; machine identity for headless agents; approval-bound side effects; receipts from Port runs/audit (no Clerk).

**Accept:**

- [ ] Human signs in via the **Factory** Port OAuth app; Clerk / Harness Observatory / other IdPs are not in the auth path
- [ ] Denied / expired / stale approval cannot create PR or sandbox write
- [ ] Human UI and MCP agent exercise the **same** Port actions successfully
- [ ] Cross-project access denied

### M4 — Independent verification loop

**Deliver:** GitHub webhook → workflow signal; accept only on green checks for exact SHA; repair path on failure.

**Accept:**

- [ ] Green checks on SHA-A accept; rewriting commit invalidates prior acceptance
- [ ] Failed CI triggers bounded repair attempt under retry budget

### M5 — Observability baseline

**Deliver:** OTel export; durable Sandbox Agent persistence; optional Langfuse; correlation IDs on all spans.

**Accept:**

- [ ] Trace links attempt → session → commit
- [ ] Inspector usable for live debug; historical span query for completed attempt

### M6 — agentOS pilot + Docker Cloud adapter spike

**Deliver:** Capability router T0/T1/T2; agentOS bounded workload pilot; Docker Cloud adapter spike report.

**Accept:**

- [ ] Documented pass/fail matrix for agentOS workloads
- [ ] Same coding task runnable on local Docker and (if spike succeeds) Docker Cloud
- [ ] Explicit go/no-go for each adapter

### M7 — AssemblyWorkflow + Polygraph coordination

**Deliver:** BOM/scaffold workflow; Polygraph child dispatch under single-owner rule.

**Accept:**

- [ ] Assembly recovers after worker kill without duplicate repo/bootstrap side effects
- [ ] Polygraph-delegated child does not double-start under Rivet

### Deferred / optional

- Rivet 3.0 migration evaluation
- Dynamic Apps / `PreviewSession`
- CopilotKit AG-UI adapter (if native Rivet UI insufficient)
- Grafana stack
- Multi-tenant SaaS hard tenancy
- Full Developer OS visual shell (parallel track; not blocking kernel)

---

## 12. Open questions / decisions needed from Johnny

**Resolved (2026-10-28):** Clerk not needed; Port owns auth and is the main backend for the external client. See [`port-capabilities.md`](./port-capabilities.md).

**Resolved (decision only, 2026-10-28):** Dedicated External Interface OAuth app named **Factory** for Factory humans — **do not** reuse Harness Observatory. Recorded in the **Factory master build spec**; **not executed** against live Port (no Observatory revoke, no Factory create). Live org still has Harness Observatory only (limit 1 / FREEMIUM). See [`port-capabilities.md`](./port-capabilities.md) §3.1.

Implementation is still blocked or materially branched on these:

1. **Primary coding harness for M1:** Codex vs Claude Code vs OpenCode (pick one to certify first).
2. **Sandbox provider for pilot:** local Docker only vs invest now in Docker Cloud adapter.
3. **Frontend streaming path:** Rivet native client (simpler) vs CopilotKit/AG-UI (needs adapter).
4. **Port machine credentials:** confirm org/app and machine-user model for unattended Factory actions (interactive OAuth ≠ automation path).
5. **R2 vs S3 for artifacts/state backend:** confirm Rivet persistence compatibility test target.
6. **Beads + Polygraph deployment locus:** existing repos/services Johnny already uses, or greenfield planning repo (source recommended dedicated planning repo).
7. **Single-tenant desktop pilot vs early multi-user:** confirm §8.2 assumption.
8. **Pi Durable for built-in assistant:** adopt now (beta) vs thinner custom Rivet agent loop for M1.
9. **Langfuse now vs after M5 live Inspectors only:** confirm spend/ops preference (source leaned Hobby cloud later).
10. **Factory External Interface OAuth app (ops):** decision recorded in master build spec only — **live Port unchanged**. When Johnny authorizes ops: raise registration limit and/or free a slot, then create **Factory** (do not revoke Harness without explicit approval). Live snapshot: [`port-capabilities.md`](./port-capabilities.md) §3.1.
11. **Turso ledger:** drop entirely in favor of Port run/audit receipts, or keep a thin local receipt cache for Rivet idempotency only.
12. **Control-plane repo locus:** wire Rivet into an existing Next.js shell (Port OAuth via Factory app, no Clerk) vs standalone Rivet pilot repo first.

---

## 13. Explicit assumptions (source ambiguous or unverified)

1. Evaluation conclusions are **documentation-grounded**, not integration-proven; first milestones exist to prove them.
2. “Docker Sandboxes” microVM product ≠ Rivet’s documented ordinary Docker adapter — treat cloud microVM path as custom until tested.
3. Port iframe/MCP Apps UX is an interface concern; execution kernel does not depend on Port’s dashboard UI.
4. Software Assembler / BOM / Code Atlas are **sibling** Factory capabilities; this spec only defines how Rivet executes work they enqueue.
5. **Dedicated Factory Port External Interface OAuth replaces Clerk** for Factory humans (not Harness Observatory); Port workflow runs + audit are the default approval receipt store (Turso optional). Capability detail: [`port-capabilities.md`](./port-capabilities.md).
6. Vendor performance claims (actor cold start, sizes) are **not** acceptance criteria.
7. Rivet guides (durable agents, coding agents, multiplayer, HITL, webhooks, auth) are the default implementation references when this spec is silent on SDK details.
8. Live Port org already has Factory blueprints/workflows (`executionContract`, `deliveryRun`, `factory_*` tools); Rivet integration should attach to that contract surface rather than inventing a parallel action registry.

---

## 14. Engineer quick-start (implementation order)

1. Compose Rivet 2.x on desktop + Tailscale auth gate (**M0**).
2. Implement `AgentSession` + Sandbox Agent multiplayer persistence (**M1**).
3. Add `WorkAttempt` leases + Beads ready gate (**M2**).
4. Put all commands behind Port (**M3**).
5. Close the loop with GitHub SHA evidence (**M4**).
6. Only then expand compute adapters, Polygraph, assembly, and UI polish.

**North-star test:** Factory Port OAuth sign-in → Port-authorized create → Rivet durable run → Sandbox Agent coding harness → GitHub branch/PR → independent CI on exact SHA → Port accept — recoverable after worker kill and sandbox loss, with a single dispatch owner. Same Port actions work from human UI and external MCP; no Clerk or Harness Observatory in the Factory auth path.
