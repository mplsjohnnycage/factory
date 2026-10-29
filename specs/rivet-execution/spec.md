# rivet-execution

> **Status:** PBI-004…007 + PBI-009 Dev OS Rivet-native session stream (Meta). Stub authorship (PBI-001) remains the Blueprint base.
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Rivet 2.x is the Factory execution kernel (ADR-002): actors, queues, and workflows for durable coding admits. Desktop Compose + Tailscale Serve for local/dev health. Port catalog write fencing is owned by port-governance §4.2.1 — not this Spec.

### Architecture

- Execution fencing = single `ProjectSupervisor` admission queue.
- Per-actor ordered queues; single-writer semantics for attempt lifecycle.
- Port projection upserts from Rivet go through the Port catalog writer (§4.2.1), never raw dual-write.
- Port → HMAC gateway (`apps/factory-gateway` `/webhooks/port`) → ProjectSupervisor enqueue (push-only).
- `ProjectSupervisor` fencing + Meta Beads ready gate live under `apps/project-supervisor/` (PBI-007); duplicate `workKey` → one `WorkAttempt`.
- Offline / local admit consumer: `apps/project-supervisor` `POST /admit` (or in-process `admitFromPayload`) — point `RIVET_SUPERVISOR_URL` at this listener for dry-run; Compose Rivet engine URL alone is not an admit entry.
- Developer OS subscribes to `AgentSession` Actor streams via Rivet-native client (PBI-009) — reconnect from last `sequence`; no CopilotKit; browser never calls Sandbox Agent.
- LogicSRC map (authorship): OpenInstall for non-Compose boxes; OpenFleet ledger alongside Rivet Inspector. M1 Required rows for this Spec beyond vertical-slice Contracts: none (OpenInstall/OpenFleet production = post-M1).

### Constraints

- Side-effect handlers are idempotent.
- Actions are parallel by default → use queues for mutations.
- Rivet never polls Port.
- Port catalog write fencing is not this Spec’s ownership.

## Contract

### Definition of Done

- Ordered admit through `ProjectSupervisor`.
- Webhook signature verified at gateway before enqueue.
- Rivet never polls Port.
- Health recovers after Compose restart.
- Compose + Tailscale Serve operator artifacts present (PBI-004); live Serve URL evidence when host available.

### Regression Guardrails

- No raw Port catalog writes from Rivet actors.
- Duplicate admits do not create parallel attempts for the same work unit.
- Unsigned / invalid Port webhooks never enqueue ProjectSupervisor.

### Scenarios

```gherkin
Scenario: Health after Compose restart
  Given Rivet Compose was healthy
  When Compose is restarted
  Then health endpoints recover
  And ProjectSupervisor resumes ordered admit without polling Port

Scenario: Webhook path never polls Port
  Given a Port webhook arrives at the Factory gateway
  When signature verification succeeds
  Then ProjectSupervisor is enqueued
  And Rivet does not poll Port for work

Scenario: PBI-004 Compose and Tailscale Serve artifacts present
  Given the Meta repo is checked out
  When an operator reviews compose/ and docs/rivet-tailscale-serve.md
  Then Rivet engine is pinned to a 2.x image (not :next)
  And a healthcheck script can lint or wait on /health
  And Tailscale Serve docs target port 6420 without factory-edge
  And live Serve URL evidence is attached when a desktop host is available

Scenario: PBI-005 invalid HMAC never enqueues
  Given PORT_CLIENT_SECRET is configured on factory-gateway
  When a POST /webhooks/port arrives with a bad x-port-signature
  Then the gateway responds 401
  And ProjectSupervisor is not enqueued

Scenario: PBI-007 duplicate workKey yields one WorkAttempt
  Given ProjectSupervisor has admitted workKey K
  When a second Port-authorized admit arrives for K
  Then the existing WorkAttempt is returned as duplicate
  And no second attempt is created

Scenario: Gateway forward reaches offline admit listener
  Given factory-gateway has RIVET_SUPERVISOR_URL set to a ProjectSupervisor POST /admit listener
  And the forwarded body carries beadId or audited portBypassId
  When the gateway enqueues and POSTs the SupervisorAdmit blob
  Then ProjectSupervisor.admit runs push-only without polling Port
  And Rivet engine :6420 is not required for this dry-run path

Scenario: PBI-009 Dev OS reconnects from last sequence
  Given an AgentSession Actor has persisted events through sequence N
  When the Developer OS Rivet-native client disconnects and reconnects
  Then it resumes with afterSequence = N
  And subsequent events are applied without duplicates
  And CopilotKit is not on the kernel path
```
