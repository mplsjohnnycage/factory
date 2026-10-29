# security-blast-radius

> **Status:** Implemented for OpenFleet ceilings + gateway rate limit — PBI-012 / STL-173 (Meta). HMAC + RBAC remain M1 baseline (PBI-005). Full CapacityManager multi-host orchestration remains post-PBI-012 ops work.
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Blast-radius controls: Port RBAC + rate controls; gateway rate limits; distinct machine vs interactive MCP auth paths. **M1 baseline:** HMAC + RBAC (PBI-005). **PBI-012:** OpenFleet ceilings (`approvals`, `budget`, `depth`, `fan_out`, `hosts`, `until`) + gateway sliding-window rate limit. Over-ceiling spawn refuses with ledger `ceiling.refuse`.

### Architecture

- Gateway verifies Port webhook HMAC before enqueue.
- Gateway applies sliding-window rate limits on mutating routes (`GATEWAY_RATE_LIMIT_RPM`).
- `POST /fleet/spawn` evaluates effective OpenFleet ceiling; refuse → append-only ledger `ceiling.refuse`.
- Sandbox credentials are scoped.
- OpenFleet ledger records ceiling decisions (`MemoryOpenFleetLedger` in CI; `OPENFLEET_HOME` JSONL on host).
- LogicSRC map: OpenFleet records/ledger; OpenCreds (no secrets in Specs/git).

### Constraints

- Cross-project access denied.
- Machine MCP auth paths ≠ interactive person OAuth paths.
- Ceiling narrows only — spawners never widen fleet ceilings.
- Agents are never sysop; only sysop opens/caps fleets.
- Meta lane only — no Product Beads.

## Contract

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
