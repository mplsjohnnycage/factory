# auth-port-oauth

> **Status:** PBI-010 OpenAccess well-known descriptor (Meta). Stub authorship (PBI-001) remains the Blueprint base. **ADR-005 Accepted — live.**
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Humans and agents share one Port action surface. The person path is a dedicated Factory Port External Interface OAuth client (PKCE). Unattended paths use distinct machine credentials. OpenAccess JSON documents redirects and scopes. **ADR-005 is Accepted — live:** the Factory app already exists. This Spec records that contract and does not create, delete, or revoke External Interface apps.

### Architecture

- App name: `Factory` (ADR-005 live). OpenAccess publishes the client id from the canonical live record. It does not invent a client id in git.
- Dev redirects (exact live set): `http://localhost:3000/api/auth/callback`, `http://127.0.0.1:3000/api/auth/callback`.
- HTTPS callbacks are required before any non-localhost deploy.
- LogicSRC map: `/.well-known/openaccess.json` (PBI-010); OpenCreds for deploy secrets; Credential Sharing plans. OpenAccess descriptor is an M1 Required emit and performs no Port OAuth create/delete.
- Token issuer remains **Port** — Factory v1 does not run a LogicSRC OpenAccess hub (`hubs: []`).

### Constraints

- Do not create, delete, or revoke Port External Interface apps from this Spec (ADR-005 live). Ask before any further External Interface app mutation.
- Never configure the Harness Observatory client as Factory OAuth.
- No secrets in Specs or git (client id is a public PKCE identifier published in OpenAccess; no client secret).

## Contract

### Definition of Done

- Spec, OpenAccess descriptor, and ADR-005 status agree: Accepted — live. The descriptor publishes the recorded client id and redirects. It does not invent a client id.
- Developer OS callback Route Handler targets the dedicated Factory redirects above, not Observatory and not Clerk.
- HTTPS callbacks are specified before any non-localhost deploy.
- Inventory §7 item 10 present: `/.well-known/openaccess.json` with `openaccess: "0.1"` and required keys.

### Regression Guardrails

- Observatory client id must not appear as Factory auth.
- Secrets never committed; OpenCreds or a vault only.
- This unit does not create or delete Port External Interface apps.

### Scenarios

```gherkin
Scenario: OpenAccess follows the live Factory client and does not invent one
  Given ADR-005 Factory External Interface OAuth is Accepted and live
  When the OpenAccess descriptor is emitted
  Then it documents the Factory redirect URIs from the live record
  And it publishes that recorded client id
  And it does not invent a different client id
  And it does not name the Harness Observatory client as Factory auth
  And this unit does not create, delete, or revoke the External Interface app

Scenario: Observatory client rejected for Developer OS
  Given an operator attempts to configure Observatory as Factory OAuth
  When Contract review runs
  Then the configuration fails review

Scenario: PBI-010 OpenAccess inventory item 10
  Given /.well-known/openaccess.json exists
  When scripts/validate-well-known.mjs runs
  Then openaccess is "0.1"
  And name, url, operator, redirect_uris, scopes, hubs are present
  And factory.no_port_oauth_create_delete is true
```
