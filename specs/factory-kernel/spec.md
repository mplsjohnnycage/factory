# factory-kernel

> **Status:** PBI-007 ProjectSupervisor + Meta Beads ready gate (Meta). Stub authorship (PBI-001) remains the Blueprint base.
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

End-to-end Factory vertical slice: authorize → durable run → harness → GitHub evidence → accept. This Spec owns the kernel correlation and dispatch story across Port, Rivet, Beads, and GitHub facets of one unit of work.

### Architecture

- Correlation IDs: `projectId → taskId → workAttemptId → actorId → sandboxId → agentSessionId → traceId → commitSHA`.
- **M1 actors:** `ProjectSupervisor`, `WorkAttempt`, `AgentSession`, `SandboxLease`.
- **Post-M1:** `CapacityManager`, `AssemblyWorkflow` (see master §13.0 Non-Goals / §13.5).
- **ProjectSupervisor (PBI-007):** Rivet-shaped admit owner under `apps/project-supervisor/` — single fence per `workKey`; Meta Beads ready/claim gate; Port projections for `executionContract` / `deliveryRun` / `executionAttempt` via §4.2.1 writer only.
- **`ReadyTaskEvent` (M1):** `{ beadId, projectId, claimedBy, claimedAt, executionContractId? }` after Meta Beads `bd ready` + `bd update --claim` (Memory stand-in in CI).
- LogicSRC map (authorship): `logicsrc.task`, `logicsrc.agent_run`, `logicsrc.event`; OpenFleet member records for sessions; OpenWorkflow `admit-and-run`. M1 emit cut is §13.6.

### Constraints

- One dispatch owner per attempt.
- Port authorization before side effects.
- Beads owns readiness (**Meta Beads** from PBI-007 onward — never Product Beads).
- `ProjectSupervisor` refuses admit without `beadId` unless audited Port `executionContract` bypass.
- Polygraph multi-repo coordination is post–single-repo M1 (§13.2) — not an M1 kernel Constraint.

## Contract

### Definition of Done

- Port-authorized start recovers after worker kill and sandbox loss.
- Duplicate `work.start` → exactly one attempt.
- Claim id required for admit (or audited Port bypass).
- Port projections mapped for `executionContract` / `deliveryRun` / `executionAttempt` via §4.2.1 writer.

### Regression Guardrails

- Acceptance never derives from agent self-report.
- Rivet never polls Port; Port remains SoT for catalog; Rivet owns execution admit only.
- No Product Beads instance or claim path from this Spec.
- No catalog dual-write outside the gateway writer.

### Scenarios

```gherkin
Scenario: Duplicate admit yields one attempt
  Given a Port-authorized work.start for task T with workKey K
  When a second identical work.start arrives before the first attempt completes
  Then exactly one WorkAttempt exists for K
  And the second admit is fenced as a duplicate

Scenario: Sandbox death recovers session identity
  Given an AgentSession bound to SandboxLease S
  When sandbox S is killed mid-run
  Then session identity is preserved for recover
  And unsaved sandbox filesystem state is not required for recover

Scenario: Port-authorized WorkAttempt recover
  Given a Port-authorized WorkAttempt A admitted by ProjectSupervisor
  When the worker hosting A is killed
  And Port-authorized recover is invoked for A
  Then WorkAttempt identity A is preserved
  And Port executionAttempt projection reflects recovered status

Scenario: Claim id required for admit
  Given Port-authorized work.start without ReadyTaskEvent.beadId and without Port bypass
  When ProjectSupervisor.admit is called
  Then admit is refused with claim_id_required
  And no WorkAttempt is created

Scenario: Meta Beads ready gate
  Given a mapped Meta Beads bead that is not ready
  When ProjectSupervisor.admit is called with that beadId
  Then admit is refused with bead_not_ready

Scenario: CI green on exact SHA accepts; rewrite denies
  Given evidence recorded for commit SHA S
  When GitHub checks are green on S
  Then Port accept may proceed for S
  When the branch is rewritten to SHA S'
  Then prior accept for S is invalid
```
