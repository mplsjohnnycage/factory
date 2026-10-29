# visibility-accept

> **Status:** Stub authored — PBI-001 / STL-162 (Meta). Stub authorship only — not M1 implement DoD (§13.5).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Visibility and accept path (ADR-008): Port audit + Rivet OTel/Inspector + Polygraph evals + scorecards. GitHub webhooks signal Rivet. Accept only on green checks for the exact commit SHA.

### Architecture

- Trace: attempt → session → commit.
- Evidence tools record; they do not replace CI.
- Rewrite of the branch invalidates prior accept for the old SHA.
- LogicSRC map: `logicsrc.event`; OpenWorkflow `verify-and-accept`.

### Constraints

- Agent “done” never accepts.
- Canvas / self-report never accepts.
- Accept binds to exact SHA only.

## Contract

### Definition of Done

- Trace links attempt → session → commit.
- Rewrite invalidates accept.
- Evidence tools record but do not replace CI.
- Every PR SHA (including Specs/ADRs/docs-only) has at least the always-on `meta-ci-presence` check; vertical-slice accept additionally requires green Meta package matrix on that exact SHA (`meta-accept-matrix` / package workflows). Branch protection on `main` requires `meta-ci-presence` (see `docs/ci/branch-protection.md`). Port accept wiring remains PBI-011.

### Regression Guardrails

- Green checks on a rewritten tip do not revive accept for a prior SHA.
- Port accept requires independent CI green on the exact SHA under review.
- Specs/ADRs/docs-only SHAs must not merge with an empty Actions rollup — `meta-ci` must run.

### Scenarios

```gherkin
Scenario: Rewrite invalidates accept
  Given Port accept was recorded for commit SHA S
  When the PR branch is force-pushed to SHA S'
  Then accept for S is invalid
  And accept for S' requires fresh green checks on S'

Scenario: Evidence does not replace CI
  Given factory_submit_evidence recorded agent artifacts for SHA S
  When CI checks on S are red
  Then Port must not accept S

Scenario: Docs-only SHA still has CI
  Given a PR that changes only specs/ or docs/adrs/
  When Actions run for that exact SHA
  Then meta-ci-presence is green
  And the statusCheckRollup is not empty
```
