<!-- PROVENANCE: Contract section copied verbatim from repo specs/security-blast-radius/spec.md @ origin/main 247842e (PR #111 merge, 2026-10-30). Blueprint half lives in the repo Spec; master spec cross-ref: factory-master-spec.md §4. Snapshot copied 2026-10-30 ~22:30 CDT. Refresh route: re-pull specs/security-blast-radius/spec.md from the repo (git) — the repo Spec, derived from the master spec, is the living source. -->

# Contract — security-blast-radius

Source: `specs/security-blast-radius/spec.md` (repo, main @ 247842e)

### Definition of Done

- **M1 baseline:** HMAC verification + RBAC enforced on gateway/control plane edges.
- **PBI-012:** over-ceiling spawn refused with ledger `ceiling.refuse`.
- **PBI-012:** gateway rate limiter returns HTTP 429 when over RPM.
- Cross-project denied; sandbox credentials scoped.

### Regression Guardrails

- Secrets never appear in Specs/git.
- Over-ceiling behavior must ledger `ceiling.refuse` (verified by unit tests).
- Rate-limit refusals must not enqueue ProjectSupervisor admits.
- Ceiling merge is narrow-only (cannot introduce `bypass` under `native`).

### Scenarios

```gherkin
Scenario: Cross-project access denied
  Given principal P is authorized for project A only
  When P attempts a privileged action on project B
  Then Port RBAC denies the action
  And an audit entry records the denial

Scenario: Over-ceiling refuse (PBI-012)
  Given OpenFleet ceilings are enforced
  When a spawn would exceed fan_out ceiling
  Then the spawn is refused
  And the ledger records ceiling.refuse

Scenario: Gateway rate limit (PBI-012)
  Given the gateway rate limiter is configured
  When a client exceeds GATEWAY_RATE_LIMIT_RPM on a mutating route
  Then the gateway responds 429
  And no ProjectSupervisor admit is enqueued for that request
```
