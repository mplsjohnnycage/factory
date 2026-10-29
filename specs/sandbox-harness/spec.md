# sandbox-harness

> **Status:** PBI-006 AgentSession + Sandbox Agent Docker + Claude Code harness authored (Meta). Stub authorship (PBI-001) remains the Blueprint base.
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Coding harness = Rivet-orchestrated Sandbox Agent (ADR-006): HTTP server inside the sandbox + SDK. Rivet Actor owns session lifecycle/persistence. Docker provider covers local and cloud targets. M1 first harness = Claude Code.

### Architecture

- Sandbox Agent = in-sandbox HTTP API; browser never calls it directly.
- Rivet-shaped `AgentSessionActor` (`apps/sandbox-harness`) owns create → prompt → stream → checkpoint lifecycle and durable session identity.
- Isolation = Docker provider (`DockerSandboxLease`); CI uses `MemorySandboxLease`.
- Docker image pinned deliberately: `rivetdev/sandbox-agent:0.5.4-full` (SDK `sandbox-agent@0.5.4`); no floating `latest` / `full` for M1.
- Scoped repo tokens only (`GITHUB_TOKEN` env); Claude credentials via `ANTHROPIC_API_KEY` env.
- LogicSRC map: OpenAgent `coder.factory` stub at `agents/coder.factory.json`; OpenTask skipped for M1 coding path (ASSUMPTION).

### Constraints

- Browser never calls Sandbox Agent control APIs.
- Pin sandbox image deliberately (no floating `latest` for M1).
- Scoped repository tokens only — no broad org credentials in sandbox.
- Kill sandbox → session identity + event history preserved on Actor; unsaved FS discarded.

## Contract

### Definition of Done

- Create session → prompt → stream events → checkpoint commit.
- Kill sandbox → session history preserved; unsaved filesystem lost.
- Image pin documented and enforced in `apps/sandbox-harness/src/image-pin.ts`.
- Session lifecycle unit tests green in CI (Memory lease).

### Regression Guardrails

- Session identity survives sandbox death.
- Unsaved FS is never treated as durable SoT.
- Browser→Sandbox Agent control path remains banned.
- Floating Docker tags (`:latest`, bare `:full`) are not the M1 pin.

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

Scenario: PBI-006 image pin is deliberate
  Given the Meta repo is checked out
  When an operator reads apps/sandbox-harness/src/image-pin.ts
  Then the Docker image is rivetdev/sandbox-agent:0.5.4-full
  And the M1 coding agent id is claude
  And CI session lifecycle tests pass without live Claude credentials
```
