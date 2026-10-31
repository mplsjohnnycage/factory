# How Factory builds — the execution path

The one path from intent to accepted code (ADR-003). Every step below is a hop with an owner;
skipping a hop is a rail violation (see `rails.md`).

```txt
Client (Claude / ChatGPT / Cursor / custom agent / Developer OS)
  --MCP-->  Factory MCP gateway (Port front door + connectors + Factory Apps behind RBAC)
              --trigger_run: factory_create_execution_contract / factory_start_delivery_run-->
                Port workflow webhook (HMAC-signed)
                  --> thin factory-gateway (verify HMAC; §4.2.1 catalog writer lives here)
                    --> ProjectSupervisor.admit (Rivet)
                      --> claim in Meta Beads --> WorkAttempt + AgentSession + SandboxLease
                        --> Sandbox Agent (Docker) running the coding agent
                          --> checkpoint commit --> GitHub CI on exact SHA
                            --> evidence + review verdict --> Port accept
```
(Delegation diagram: master spec §18.4; topology: §13.4.)

## Step by step

### 1. Intent enters through Port (SPEC §18.3, §4.2)

Humans (Port UI / Developer OS) and Cockpit agents (MCP) invoke the **same** workflow tools —
parity rule: anything a human can do through the UI that is exposed as a Port action is
callable by an agent with matching Port roles, under the same audit. The live workflow set to
bind (master spec §4.2, do not invent parallel names):

`factory_create_execution_contract`, `factory_start_delivery_run`, `factory_claim_next_job`,
`factory_heartbeat`, `factory_submit_evidence`, `factory_record_review_verdict`,
`factory_request_release` (Johnny-only INPUT).

Live state (LIVE-VERIFIED 2026-10-30, fragments A7/C8): all 7 `factory_*` workflows exist in
the tenant and their webhook nodes POST to the gateway's public URL,
`https://desktop-3apdbkg.taildf3a4b.ts.net/webhooks/port/<name>` — but every hook is
**continue-on-failure**, so a dead gateway fails silently. The workflows' in-Port UPSERT_ENTITY
nodes also mutate entities directly, bypassing the §4.2.1 writer — the spec's own docs admit
"§4.2.1 not on sync path." Both are known drift, flagged, not hidden.

### 2. The gateway — thin, and it owns the catalog writer (SPEC §4.2.1, PBI-005)

`apps/factory-gateway` (node:http, port 8787 on the desktop host) does exactly three things:
verify the Port webhook **HMAC**, run the **§4.2.1 catalog writer**, and enqueue to
`ProjectSupervisor`. It is not a Port SaaS feature, not a Rivet actor, and **not an MCP
proxy** (fragment mcp-port-single-fanout). HMAC mechanics (fragment A7): Port signs
`${timestamp}.${rawBody}` with HMAC-SHA-256 (headers `x-port-signature: v1,<base64>` +
`x-port-timestamp`, secret `PORT_CLIENT_SECRET`); invalid/missing → `401
invalid_port_signature` with no enqueue; valid → `202` with an admit id, and if
`RIVET_SUPERVISOR_URL` is set the admit POSTs to the supervisor's `/admit` (not the Rivet
engine port). Repo records conflict on whether the HMAC path is fully live ("HMAC pending"
vs "FE-142 closed") — flagged in fragment A7; treat the 202 path as implemented, its org-wide
rollout as unverified.

**The §4.2.1 fence** (Port upsert has no compare-and-swap, so Factory fences it):

1. **Single-writer per record**, keyed `{blueprint}:{entityIdentifier}`, one write at a time —
   every catalog write from any caller (API/MCP, Ocean apply, workflow nodes) enqueues here.
2. **`catalogVersion`** integer on every Factory-governed blueprint: 0 at create; a successful
   apply sets it to `expectedCatalogVersion + 1`.
3. **Stale writes are rejected whole** — no partial apply. The caller re-reads, rebuilds the
   patch, re-enqueues.
4. **Lease/claim fields** (`leaseEpoch`, owner, status) mutate only inside the same apply that
   bumps `catalogVersion` — this is what makes `factory_claim_next_job` and
   `factory_heartbeat` race-free.

Ownership split (locked): Port + the writer own catalog mutations; `ProjectSupervisor` /
`WorkAttempt` own durable execution admit and attempt lifecycle; Beads owns the readiness/claim
graph. Rivet never polls Port.

Live state (LIVE-VERIFIED, fragments B9/C8): the shipped gateway hard-wires an **in-memory**
catalog store — `buildDefaultDeps` has no env gate, no Port credential, no Port client
(`PORT_CLIENT_SECRET` is used only for HMAC verify). So the fenced live writer is **SPEC-only
today (GAP)**: the gateway verifies webhooks and forwards, but it does not yet write Port, and
its POST surfaces (catalog/fleet/accept) sit behind the public Funnel URL with rate limiting
as the only auth, and the webhook HMAC check has no replay protection. The gateway-credential
model is an open Johnny decision. Also: `RIVET_SUPERVISOR_URL` is unset on the desktop gateway,
so Rivet forwards currently land in memory and go nowhere (fragment C8).

### 3. Admit — ProjectSupervisor and the Beads gate (SPEC §13.1, §18.2; ADR-002)

- `ProjectSupervisor` is the **single admission queue** per project: per-actor ordered queues,
  single-writer, idempotent side effects. Duplicate `work.start` → exactly one `WorkAttempt`
  (factory-kernel Contract; §13.7 metric).
- **Claim before start**: the supervisor admits coding work only when Meta Beads reports the
  mapped bead ready — claim = `bd update --claim` — **or** the Port `executionContract`
  carries an explicit, audit-logged human bypass. The claim happens *before* the Rivet queue
  message that starts the Sandbox Agent. Until PBI-007 wires this gate, Linear remains the
  admit/claim SoT (OQ-1) and this step is practiced, not enforced (SPEC vs live — GAP).
- The gateway/adapter emits a `ReadyTaskEvent` `{beadId, projectId, claimedBy, claimedAt,
  executionContractId?}`; the supervisor refuses admit without a `beadId` or an audited bypass
  id (§13.1).
- Correlation IDs chain through everything: `projectId → taskId → workAttemptId → actorId →
  sandboxId → agentSessionId → traceId → commitSHA` (§4.1).

### 4. The sandbox — SandboxLease → Sandbox Agent (SPEC §4.4, §18.2; ADR-006)

- One `WorkAttempt` actor → one `SandboxLease` → one Docker Sandbox Agent:
  `SandboxAgent.start` → provision → install → boot → `/v1/health`.
- **Sandbox Agent** is upstream `rivet-dev/sandbox-agent`: an HTTP server *inside* the sandbox
  plus an SDK that runs on the Rivet backend only. The factory pins the image deliberately —
  `rivetdev/sandbox-agent:0.5.4-full` (LIVE-VERIFIED, fragment E1). Its API is REST `/v1/*`
  (agents, sessions: create/messages/events-SSE/permissions/terminate, ACP JSON-RPC,
  `/v1/health`), upstream default `127.0.0.1:2468`, optional Bearer-token middleware on all
  `/v1/*` except health. The OpenAPI spec exists only upstream; the factory consumes the API
  through the `sandbox-agent@0.5.4` SDK.
- The factory-side surface is `apps/sandbox-harness`: the `SandboxLease` interface
  (`start / createAgentSession / prompt / checkpoint / kill`) and `DockerSandboxLease`, which
  drives Docker via dockerode; a **checkpoint is an in-container git commit**. Session contract
  (§4.4): create session → prompt → stream events (`sessionUpdate` SSE) → checkpoint commit;
  kill the sandbox and the session history/identity survives — unsaved filesystem is lost.
- The M1 in-sandbox coding agent is **Claude Code** (agent id `claude`, §0.7/PBI-006); its
  identity record is the OpenAgent stub `agents/coder.factory.json` (§13.6 optional stub).
  Three names, one chain: in-sandbox Sandbox Agent (runtime) → coding agent process (Claude
  Code) → factory-side `AgentSession` actor + lease (owner) (fragment E1).
- Exit discipline (§18.2 step 6): a Coding agent does not provision Vercel/Convex/Port
  entities or change org settings — that is Cockpit work. Cockpit never holds sandbox
  credentials (§18.4).

Live state (LIVE-VERIFIED, fragment E1): `DockerSandboxLease` is **never instantiated in
production code**; the supervisor's `SessionSpawner` is an offline stub ("Docker / Rivet Actor
host remain ops"), tests run on the Memory lease only, and the Compose file defines only
rivet-engine (:6420) and the gateway (:8787) — no sandbox service, no published sandbox port.
The live Docker Sandbox Agent "remains ops/desktop" per the readiness kit (fragment E2:
STL-225 states nothing has ever run end-to-end; STL-150, the demonstrate-or-disprove task, is
still Backlog). The sandbox leg is **SPEC + client library today; the wired path is a GAP**.

### 5. Accept — CI on the exact SHA (SPEC §4.8; ADR-008)

Work exits the sandbox as a commit; **GitHub CI green on that exact SHA** is the accept gate
(PBI-011). Evidence flows back via `factory_submit_evidence`, review via
`factory_record_review_verdict`, release via `factory_request_release` (Johnny-only). Traces
chain attempt → session → commit; a history rewrite invalidates accept. Evidence and verdicts
are recorded in Port (`deliveryRun` / `executionAttempt` projections, written through §4.2.1),
and visibility = Port audit + Rivet traces + Polygraph session/review artifacts + scorecards.

Live state (LIVE-VERIFIED, fragments A5/C1): `deliveryRun` and `executionAttempt` have **0
entities** in the tenant and `executionRunner` has **0 entities** — which is exactly why
`factory_claim_next_job` ends in "runner not active": there is no registered runner to claim
against. Registering one is spin-up work, which brings us to:

### 6. Spin-up rule — CLI means GitHub Action (SPEC §4.2.2 + Johnny's rule, 2026-10-30)

- **Johnny's standing factory rule:** anything that needs to be spun up with a CLI gets a
  **GitHub Action** — services, workers, runners are provisioned and started through GitHub
  Actions workflows, never manual/local launch.
- The spec already routes this way: on Port validation success, **GitHub Actions** (and Port
  provision workflows) provision/connect (§4.2.2 step 3).
- Live state (LIVE-VERIFIED, fragment E1): of the repo's 9 workflows, `sandbox-harness.yml` is
  CI-only (Memory lease, no Docker) and `compose-lint.yml` lints config but starts nothing —
  **no workflow spins up a sandbox, a runner, or Rivet**. The sanctioned spin-up Action is a
  GAP to build, and it is load-bearing: it is the missing step that would create the
  `executionRunner` entity the claim flow needs. Note the runner kind enum has no Docker value
  and no in-repo code assigns runner kinds at all (fragment E1) — the Action work includes
  that enum/records fix, under master-first discipline.
- Spec topology (§13.4) puts the Rivet control plane + Sandbox Agent Docker provider on the
  operator desktop via Compose + Tailscale Serve, Port as SaaS, Developer OS on Vercel, GitHub
  CI independent. Live state has drifted from that topology — Rivet actually runs on grok-bot
  (see `infrastructure.md`). Flag it; the spec is the design winner, the drift is the fact.
