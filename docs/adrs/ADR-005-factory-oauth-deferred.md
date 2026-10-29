# ADR-005: Dedicated Factory Port External Interface OAuth

**Status:** Accepted — **live** (2026-10-29)

**Date:** 2026-10-28 (decision); live ops 2026-10-29

**Deciders:** Johnny Cage / Factory Meta

## Context

Developer OS and agents need Port person-token auth on the same External Interface surface. Reusing **Harness Observatory** as Factory’s OAuth client conflates products, breaks FREEMIUM one-app limits, and pollutes audit. Org limit required Observatory revoke before a dedicated Factory app could exist. Live ids and redirects are recorded in `docs/port-factory-oauth-live.md` (Project store / meta docs) — not invented in OpenAccess.

Filename retains historical `factory-oauth-deferred` slug from scaffold; **status is live**, not deferred.

## Decision

We will authenticate Factory humans and agents with a **dedicated Factory** Port External Interface OAuth app. We will **never** reuse Harness Observatory (or any other product’s OAuth app) for Factory. Clerk remains out of scope (ADR-001). Live app (Johnny-authorized Meta ops 2026-10-29): name `Factory`; wire Developer OS / OpenAccess to that client id only; add HTTPS callbacks explicitly before non-localhost deploys.

## Consequences

**Positive:**
- Humans and agents share Port RBAC / MCP auth surface
- Clear ban on Observatory reuse
- Live client exists — OpenAccess can emit real client id + localhost redirects

**Negative:**
- FREEMIUM app-count pressure; creating/deleting apps remains human-gated Meta ops
- Preview/prod HTTPS redirects must be managed carefully (full replace-set on upsert)
- Historical Spec stubs may still say “deferred” until a follow-up Spec PR aligns wording

**Neutral:**
- Machine/unattended credentials stay separate from this PKCE person client
- Vercel MCP OAuth helpers do not replace Port External Interface person OAuth

## Alternatives Considered

### Reuse Harness Observatory OAuth client

Rejected — wrong product boundary; occupied the FREEMIUM slot; explicitly banned. Observatory was revoked when Factory was created.

### Clerk (or custom IdP) for Developer OS

Rejected — splits identity from Port SoT (ADR-001).

### Invent client ids in OpenAccess before Port create

Rejected — OpenAccess must not invent client ids; live record is SoT for wiring.
