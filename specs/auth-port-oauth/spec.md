# auth-port-oauth

> **Status:** Stub authored — PBI-001 / STL-162 (Meta). Stub authorship only — not M1 implement DoD (§13.5).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Humans and agents share one Port action surface. The intended person path is a dedicated Factory Port External Interface OAuth client (PKCE). Unattended paths use distinct machine credentials. OpenAccess JSON documents intended redirects and scopes. **ADR-005 stays deferred:** this Spec records the target contract and does not create, delete, or revoke External Interface apps.

### Architecture

- Intended app name: `Factory`. OpenAccess publishes a client id only after an authorized ADR-005 change creates the app.
- Dev redirects, when that client is wired: `http://localhost:3000/api/auth/callback`, `http://127.0.0.1:3000/api/auth/callback`.
- HTTPS callbacks are required before any non-localhost deploy.
- LogicSRC map: `/.well-known/openaccess.json`; OpenCreds for deploy secrets; Credential Sharing plans. OpenAccess descriptor is an M1 Required emit (PBI-010) and performs no Port OAuth create/delete.

### Constraints

- Port OAuth create, delete, and revoke stay deferred (ADR-005). Ask before any External Interface app mutation.
- Never configure the Harness Observatory client as Factory OAuth.
- No secrets in Specs or git.

## Contract

### Definition of Done

- Spec, OpenAccess descriptor, and ADR-005 status agree: deferred until an authorized app exists; the descriptor does not invent a client id.
- Developer OS callback Route Handler targets the dedicated Factory redirects above, not Observatory and not Clerk.
- HTTPS callbacks are specified before any non-localhost deploy.

### Regression Guardrails

- Observatory client id must not appear as Factory auth.
- Secrets never committed; OpenCreds or a vault only.
- This unit does not create or delete Port External Interface apps.

### Scenarios

```gherkin
Scenario: OpenAccess does not invent a client while ADR-005 is deferred
  Given ADR-005 Factory External Interface OAuth is still deferred
  When the OpenAccess descriptor is emitted
  Then it documents the intended Factory redirect URIs
  And it does not publish a client id created by this unit
  And it does not name the Harness Observatory client as Factory auth

Scenario: Observatory client rejected for Developer OS
  Given an operator attempts to configure Observatory as Factory OAuth
  When Contract review runs
  Then the configuration fails review
```
