# visibility-accept

> **Status:** PBI-011 GitHub checks → accept on exact SHA (Meta). Stub authorship (PBI-001) + CI foundation (PR #17) remain the Blueprint base.
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Visibility and accept path (ADR-008): Port audit + Rivet OTel/Inspector + Polygraph evals + scorecards. GitHub webhooks signal Rivet. Accept only on green checks for the exact commit SHA.

### Architecture

- Trace: attempt → session → commit.
- Evidence tools record; they do not replace CI.
- Rewrite of the branch invalidates prior accept for the old SHA.
- **PBI-011 wiring:** `apps/factory-gateway` `evaluateAcceptOnSha` + `AcceptLedger`; HTTP `POST /accept/evaluate`, `POST /accept/record` (Cockpit/human actor header only), `GET /accept/status`; operator CLI `scripts/accept-on-sha.ts`; workflow `meta-accept-gate`.
- Always-on presence: `meta-ci-presence`. Vertical-slice matrix: `meta-accept-matrix`.
- LogicSRC map: `logicsrc.event`; OpenWorkflow `verify-and-accept`.

### Constraints

- Agent “done” never accepts.
- Canvas / self-report never accepts.
- Accept binds to exact SHA only.
- Port catalog accept remains Cockpit/human governance — gateway records evidence only; no agent self-accept.

## Contract

### Definition of Done

- Trace links attempt → session → commit.
- Rewrite invalidates accept (`prior_accept_stale_after_rewrite` when tip SHA ≠ prior accept SHA).
- Evidence tools record but do not replace CI.
- Every PR SHA (including Specs/ADRs/docs-only) has at least the always-on `meta-ci-presence` check; vertical-slice accept additionally requires green Meta package matrix on that exact SHA (`meta-accept-matrix` / package workflows). Branch protection on `main` requires `meta-ci-presence` (see `docs/ci/branch-protection.md`).
- Gateway + CLI can evaluate accept eligibility for an exact SHA; agent/self actors are refused on `/accept/record`.

### Regression Guardrails

- Green checks on a rewritten tip do not revive accept for a prior SHA.
- Port accept requires independent CI green on the exact SHA under review.
- Specs/ADRs/docs-only SHAs must not merge with an empty Actions rollup — `meta-ci` must run.
- Coding agents must not Port-accept.

### Scenarios

```gherkin
Scenario: Rewrite invalidates accept
  Given Port accept was recorded for commit SHA S
  When the PR branch is force-pushed to SHA S'
  Then accept for S is invalid
  And accept for S' requires fresh green checks on S'
  And evaluateAcceptOnSha with priorAccept=S returns prior_accept_stale_after_rewrite

Scenario: Evidence does not replace CI
  Given factory_submit_evidence recorded agent artifacts for SHA S
  When CI checks on S are red
  Then Port must not accept S
  And evaluateAcceptOnSha returns failed_required_checks

Scenario: Docs-only SHA still has CI
  Given a PR that changes only specs/ or docs/adrs/
  When Actions run for that exact SHA
  Then meta-ci-presence is green
  And the statusCheckRollup is not empty

Scenario: PBI-011 agent self-accept forbidden
  Given green checks on SHA S
  When POST /accept/record is called with X-Factory-Accept-Actor: agent
  Then the gateway responds 403 agent_self_accept_forbidden
  And no accept record is stored
```
