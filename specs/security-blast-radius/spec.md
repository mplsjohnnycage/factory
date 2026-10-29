# security-blast-radius

> **Status:** Stub authored — PBI-001 / STL-162 (Meta). Stub authorship only — not M1 implement DoD (§13.5). Implement of OpenFleet ceilings is implement-gated (PBI-012 after M1 accept).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Blast-radius controls: Port RBAC + rate controls; gateway rate limits; distinct machine vs interactive MCP auth paths. **M1:** HMAC + RBAC only (§13.5). **Post-M1:** OpenFleet ceilings (`approvals`, `budget`, `depth`, `fan_out`, `hosts`, `until`) via implement-gated PBI-012.

### Architecture

- Gateway verifies Port webhook HMAC before enqueue.
- Sandbox credentials are scoped.
- OpenFleet ledger records ceiling decisions post-M1.
- LogicSRC map: OpenFleet records/ledger; OpenCreds (no secrets in Specs/git).

### Constraints

- Cross-project access denied.
- Machine MCP auth paths ≠ interactive person OAuth paths.
- Ceiling enforcement is post-M1 (author stub OK; implement only after M1 accept green).

## Contract

### Definition of Done

- **M1:** HMAC verification + RBAC enforced on gateway/control plane edges.
- **Post-M1:** over-ceiling spawn refused with ledger `ceiling.refuse`.
- Cross-project denied; sandbox credentials scoped.

### Regression Guardrails

- Secrets never appear in Specs/git.
- Over-ceiling behavior must ledger `ceiling.refuse` when ceilings are implemented.

### Scenarios

```gherkin
Scenario: Cross-project access denied
  Given principal P is authorized for project A only
  When P attempts a privileged action on project B
  Then Port RBAC denies the action
  And an audit entry records the denial

Scenario: Over-ceiling refuse (post-M1)
  Given OpenFleet ceilings are enforced
  When a spawn would exceed fan_out ceiling
  Then the spawn is refused
  And the ledger records ceiling.refuse
```
