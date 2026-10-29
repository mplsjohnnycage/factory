# auth-port-oauth

> **Status:** Stub authored — PBI-001 / STL-162 (Meta). Stub authorship only — not M1 implement DoD (§13.5).
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Dedicated Factory Port External Interface OAuth (PKCE) for humans and agents on the same Port action surface (ADR-005 **live**). Machine credentials for unattended paths. OpenAccess JSON documents redirects and scopes.

### Architecture

- Live Factory app parameters (ops record): name `Factory`; OpenAccess must emit live client id + redirects.
- Redirects (dev): `http://localhost:3000/api/auth/callback`, `http://127.0.0.1:3000/api/auth/callback`.
- HTTPS callbacks required before non-localhost deploys.
- LogicSRC map: `/.well-known/openaccess.json`; OpenCreds for deploy secrets; Credential Sharing plans. OpenAccess descriptor is M1 Required.

### Constraints

- Text-only until ops raises org app limit (limit handled — Factory live; Observatory revoked).
- Never configure against Harness Observatory client.
- No secrets in Specs/git.

## Contract

### Definition of Done

- Spec + OpenAccess descriptor + ADR-005 live record align.
- Wire client id + redirects for Developer OS callback Route Handler.
- Add HTTPS callbacks before non-localhost deploys.

### Regression Guardrails

- Observatory client id must not appear as Factory auth.
- Secrets never committed; OpenCreds/vault only.

### Scenarios

```gherkin
Scenario: OpenAccess documents live Factory client
  Given ADR-005 Factory External Interface app is live
  When OpenAccess descriptor is emitted
  Then it lists the Factory client id and approved redirect URIs
  And it does not list the revoked Observatory client

Scenario: Observatory client rejected for Developer OS
  Given an operator attempts to configure Observatory as Factory OAuth
  When Contract review runs
  Then the configuration fails review
```
