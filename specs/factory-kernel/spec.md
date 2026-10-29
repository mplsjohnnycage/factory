# factory-kernel

> **Status:** Stub authored — PBI-001 / STL-162 (Meta). Stub authorship only — not M1 implement DoD (§13.5).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

End-to-end Factory vertical slice: authorize → durable run → harness → GitHub evidence → accept. This Spec owns the kernel correlation and dispatch story across Port, Rivet, Beads, and GitHub facets of one unit of work.

### Architecture

- Correlation IDs: `projectId → taskId → workAttemptId → actorId → sandboxId → agentSessionId → traceId → commitSHA`.
- **M1 actors:** `ProjectSupervisor`, `WorkAttempt`, `AgentSession`, `SandboxLease`.
- **Post-M1:** `CapacityManager`, `AssemblyWorkflow` (see master §13.0 Non-Goals / §13.5).
- LogicSRC map (authorship): `logicsrc.task`, `logicsrc.agent_run`, `logicsrc.event`; OpenFleet member records for sessions; OpenWorkflow `admit-and-run`. M1 emit cut is §13.6.

### Constraints

- One dispatch owner per attempt.
- Port authorization before side effects.
- Beads owns readiness (Meta Beads from PBI-007 onward).
- Polygraph multi-repo coordination is post–single-repo M1 (§13.2) — not an M1 kernel Constraint.

## Contract

### Definition of Done

- Port-authorized start recovers after worker kill and sandbox loss.
- Duplicate `work.start` → exactly one attempt.

### Regression Guardrails

- Acceptance never derives from agent self-report.
- Rivet never polls Port; Port remains SoT for catalog; Rivet owns execution admit only.

### Scenarios

```gherkin
Scenario: Duplicate admit yields one attempt
  Given a Port-authorized work.start for task T
  When a second identical work.start arrives before the first attempt completes
  Then exactly one WorkAttempt exists for T
  And the second admit is fenced as a duplicate

Scenario: Sandbox death recovers session identity
  Given an AgentSession bound to SandboxLease S
  When sandbox S is killed mid-run
  Then session identity is preserved for recover
  And unsaved sandbox filesystem state is not required for recover

Scenario: CI green on exact SHA accepts; rewrite denies
  Given evidence recorded for commit SHA S
  When GitHub checks are green on S
  Then Port accept may proceed for S
  When the branch is rewritten to SHA S'
  Then prior accept for S is invalid
```
