<!-- PROVENANCE: Contract section copied verbatim from repo specs/factory-kernel/spec.md @ origin/main 247842e (PR #111 merge, 2026-10-30). Blueprint half lives in the repo Spec; master spec cross-ref: factory-master-spec.md §4. Snapshot copied 2026-10-30 ~22:30 CDT. Refresh route: re-pull specs/factory-kernel/spec.md from the repo (git) — the repo Spec, derived from the master spec, is the living source. -->

# Contract — factory-kernel

Source: `specs/factory-kernel/spec.md` (repo, main @ 247842e)

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

Scenario: Offline HTTP/in-process admit entry
  Given a ProjectSupervisor backed by Memory or BdMetaBeads
  When POST /admit (or admitFromPayload) receives beadId or portBypassId fields
  Then ProjectSupervisor.admit runs without Rivet Actor host or public gateway
  When the body is only {action, runId} without bead or bypass
  Then the entry refuses with claim_or_bypass_required and no WorkAttempt is created

Scenario: Admit then Memory session spawn
  Given a successful non-duplicate admit
  When admitAndSpawn uses a Memory SessionSpawner
  Then an AgentSession identity is created for the WorkAttempt
  And a duplicate admit for the same workKey does not spawn a second session

Scenario: CI green on exact SHA accepts; rewrite denies
  Given evidence recorded for commit SHA S
  When GitHub checks are green on S
  Then Port accept may proceed for S
  When the branch is rewritten to SHA S'
  Then prior accept for S is invalid
```
