# ADR-005: Dedicated Factory Port External Interface OAuth

- **Status:** Accepted — live
- **Date:** 2026-10-29
- **Deciders:** Johnny Cage / Factory Meta

## Context

Developer OS and agents need Port person-token auth on the same External Interface surface as humans. Reusing **Harness Observatory** as Factory’s OAuth client conflates products and occupied the plan’s single External Interface slot. Johnny-authorized Meta ops on 2026-10-29 revoked Observatory and created a dedicated **Factory** app. The canonical live record (name, app id, client id, localhost redirect URIs) is Project-store `docs/port-factory-oauth-live.md`. Those identifiers are not copied into this repository. The filename keeps the scaffold slug `factory-oauth-deferred`. The status is live.

## Decision

We will authenticate Factory humans and agents with a **dedicated Factory** Port External Interface OAuth app on the same Port surface. We will **never** reuse Harness Observatory, or any other product’s OAuth app, for Factory. Clerk remains out of scope (ADR-001). The Factory app is **live** as of 2026-10-29. OpenAccess and Developer OS wire that recorded client. They do not invent a client id. HTTPS callbacks are added explicitly before any non-localhost deploy. This record does not create, delete, or revoke External Interface apps.

## Consequences

**Positive:** Humans and agents share Port RBAC and the MCP auth surface. Observatory reuse is a hard ban. OpenAccess can name the live client and the localhost redirects from the canonical record.

**Negative:** External Interface app count stays tight on the current plan. Creating, deleting, or revoking apps remains human-gated Meta ops, not an agent side effect of this ADR. Preview and production HTTPS redirects must be an explicit replace-set on upsert. Earlier Spec stubs that say “deferred” are aligned in the same PR as this body.

**Neutral:** Machine and unattended credentials stay distinct from this PKCE person client. Vercel MCP OAuth helpers do not replace Port External Interface person OAuth.

**Reconsider when:** A successor ADR replaces the dedicated Factory External Interface app. Reusing Observatory, or inventing a client id in git, is not that successor.

## Alternatives Considered

- **Reuse the Harness Observatory OAuth client.** Rejected. Wrong product boundary, and it occupied the single External Interface slot. Observatory was revoked when Factory was created. Specs must not configure it as Factory auth.
- **Clerk, or a custom identity provider, for Developer OS.** Rejected. That splits identity from the Port source of truth (ADR-001).
- **Invent client ids in OpenAccess before the Port app exists.** Rejected. The app now exists. OpenAccess publishes the recorded client id and redirects. It does not mint a different id in this repository.
