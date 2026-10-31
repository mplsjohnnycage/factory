<!-- PROVENANCE: Contract section copied verbatim from repo specs/sandbox-harness/spec.md @ origin/main 247842e (PR #111 merge, 2026-10-30). Blueprint half lives in the repo Spec; master spec cross-ref: factory-master-spec.md §4. Snapshot copied 2026-10-30 ~22:30 CDT. Refresh route: re-pull specs/sandbox-harness/spec.md from the repo (git) — the repo Spec, derived from the master spec, is the living source. -->

# Contract — sandbox-harness

Source: `specs/sandbox-harness/spec.md` (repo, main @ 247842e)

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
