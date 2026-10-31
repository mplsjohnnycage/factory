<!-- PROVENANCE: Contract section copied verbatim from repo specs/rivet-execution/spec.md @ origin/main 247842e (PR #111 merge, 2026-10-30). Blueprint half lives in the repo Spec; master spec cross-ref: factory-master-spec.md §4. Snapshot copied 2026-10-30 ~22:30 CDT. Refresh route: re-pull specs/rivet-execution/spec.md from the repo (git) — the repo Spec, derived from the master spec, is the living source. -->

# Contract — rivet-execution

Source: `specs/rivet-execution/spec.md` (repo, main @ 247842e)

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

Scenario: FE-198 Ask Factory routes through the Developer OS BFF
  Given the Cockpit Ask Factory drawer posts a message
  When the BFF has RIVET_SERVE_URL set (Tailscale Serve)
  Then the client message is appended to the Rivet AgentSession Actor via Serve
  And when Serve is unset the drawer receives a clearly-marked memory-fixture ack
  And when Serve is configured but unreachable the ask/stream/events routes return 502 instead of faking live
  And the browser never calls Sandbox Agent and no Port catalog writes occur

Scenario: PBI-009 Dev OS reconnects from last sequence
  Given an AgentSession Actor has persisted events through sequence N
  When the Developer OS Rivet-native client disconnects and reconnects
  Then it resumes with afterSequence = N
  And subsequent events are applied without duplicates
  And CopilotKit is not on the kernel path
```
