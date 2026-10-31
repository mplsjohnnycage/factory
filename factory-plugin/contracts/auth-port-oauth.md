<!-- PROVENANCE: Contract section copied verbatim from repo specs/auth-port-oauth/spec.md @ origin/main 247842e (PR #111 merge, 2026-10-30). Blueprint half lives in the repo Spec; master spec cross-ref: factory-master-spec.md §4. Snapshot copied 2026-10-30 ~22:30 CDT. Refresh route: re-pull specs/auth-port-oauth/spec.md from the repo (git) — the repo Spec, derived from the master spec, is the living source. -->

# Contract — auth-port-oauth

Source: `specs/auth-port-oauth/spec.md` (repo, main @ 247842e)

### Definition of Done

- Spec, OpenAccess descriptor, and ADR-005 status agree: Accepted — live. The descriptor publishes the recorded client id and redirects. It does not invent a client id.
- Developer OS callback Route Handler is `/api/auth/callback` and matches the dedicated Factory redirects above, not Observatory and not Clerk.
- Developer OS performs Authorization Code + PKCE token exchange for the Factory client id (public client; no secret in git).
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

Scenario: Developer OS callback path matches live redirects
  Given Port and OpenAccess register /api/auth/callback
  When Developer OS builds the authorize redirect_uri and hosts the callback Route Handler
  Then the path is /api/auth/callback
  And the handler exchanges the authorization code with PKCE (no client_secret)

Scenario: Production redirect_uri uses stable Dev OS origin
  Given Developer OS runs on Vercel production without a baked NEXT_PUBLIC_DEVOS_URL
  When GET /api/auth/port/login builds the Auth0 authorize redirect
  Then redirect_uri origin is https://factory-developer-os.vercel.app
  And redirect_uri does not use the ephemeral VERCEL_URL deployment host

Scenario: PBI-010 OpenAccess inventory item 10
  Given /.well-known/openaccess.json exists
  When scripts/validate-well-known.mjs runs
  Then openaccess is "0.1"
  And name, url, operator, redirect_uris, scopes, hubs are present
  And factory.no_port_oauth_create_delete is true
```
