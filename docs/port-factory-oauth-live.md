# Port Factory External Interface OAuth — live

**Status:** Live (Johnny-authorized Meta ops, 2026-10-29)  
**Lane:** Meta  
**ADR:** ADR-005 (Accepted → **live**)  
**Source of truth for client wiring:** this file + Port MCP `list_external_interface_apps`

Public/PKCE Auth0 client (no client secret). Humans and agents share the Port person-token surface.

## Live app

| Field | Value |
|-------|--------|
| **Name** | `Factory` |
| **App id** | `iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug` |
| **Client id** | `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` |
| **Org id** | `org_rNq4tjSc8DXL1ceL` |
| **Created** | `2026-10-29T00:14:07.481Z` |
| **Last login** | none yet |

## Redirect URIs (exact set)

1. `http://localhost:3000/api/auth/callback`
2. `http://127.0.0.1:3000/api/auth/callback`

Full replace-set on update via Port MCP `upsert_external_interface_app` with `appId` — do not merge casually.

## Ops performed (Johnny authorized)

1. **Revoked** Harness Observatory External Interface app `stflVc7sZJXf6FelDkUFFhcKnoaxP6QP` (was occupying FREEMIUM limit of 1).
2. **Created** dedicated `Factory` app (omit `appId` on `upsert_external_interface_app`).
3. **Verified** `list_external_interface_apps` → only `Factory`.
4. **Re-verified FE-85 (2026-10-29):** list still only `Factory`; re-revoke of Observatory id `stflVc7sZJXf6FelDkUFFhcKnoaxP6QP` → not found. Evidence: [`port-oauth-delete-status.md`](./port-oauth-delete-status.md).

## Rules

- Wire Developer OS / OpenAccess to **this** client id only.
- Never configure Harness Observatory (revoked) or any other product’s OAuth app for Factory.
- Preview/production HTTPS callbacks must be added explicitly (1–5 total) before non-localhost deploys.
- Machine/unattended path remains separate org/machine credentials — not this PKCE client.

## Docs

- Master spec ADR-005: [`factory-master-spec.md`](./factory-master-spec.md) §3  
- Prior capability note (pre-live): [`port-capabilities.md`](./port-capabilities.md) §3.1  
- Port docs: [External interfaces](https://docs.port.io/interface-builder/external-interfaces), [Manage OAuth apps](https://docs.port.io/platform-administration/sso-authentication/manage-your-oauth-apps)
