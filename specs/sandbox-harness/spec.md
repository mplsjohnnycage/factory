# sandbox-harness

> **Status:** Stub authored — PBI-001 / STL-162 (Meta). Stub authorship only — not M1 implement DoD (§13.5).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Coding harness = Rivet-orchestrated Sandbox Agent (ADR-006): HTTP server inside the sandbox + SDK. Rivet Actor owns session lifecycle/persistence. Docker provider covers local and cloud targets. M1 first harness = Claude Code.

### Architecture

- Sandbox Agent = in-sandbox HTTP API; browser never calls it directly.
- Rivet Actor owns create → prompt → stream → checkpoint lifecycle.
- Docker image pinned deliberately; scoped repo tokens only.
- LogicSRC map: OpenAgent `coder.factory`; OpenTask skipped for M1 coding path (ASSUMPTION). OpenAgent optional stub OK for M1 emit.

### Constraints

- Browser never calls Sandbox Agent control APIs.
- Pin sandbox image deliberately (no floating `latest` for M1).
- Scoped repository tokens only — no broad org credentials in sandbox.

## Contract

### Definition of Done

- Create session → prompt → stream events → checkpoint commit.
- Kill sandbox → session history preserved; unsaved filesystem lost.

### Regression Guardrails

- Session identity survives sandbox death.
- Unsaved FS is never treated as durable SoT.

### Scenarios

```gherkin
Scenario: Create prompt stream checkpoint
  Given a SandboxLease and AgentSession
  When the harness creates a session, accepts a prompt, streams events, and checkpoints
  Then a commit SHA is produced on the feature branch
  And Rivet retains the event sequence

Scenario: Kill preserves session identity
  Given an active AgentSession in sandbox S
  When S is killed before FS flush
  Then session identity remains recoverable
  And unsaved filesystem contents are not guaranteed
```
