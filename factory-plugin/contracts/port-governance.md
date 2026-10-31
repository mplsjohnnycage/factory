<!-- PROVENANCE: Contract section copied verbatim from repo specs/port-governance/spec.md @ origin/main 247842e (PR #111 merge, 2026-10-30). Blueprint half lives in the repo Spec; master spec cross-ref: factory-master-spec.md §4. Snapshot copied 2026-10-30 ~22:30 CDT. Refresh route: re-pull specs/port-governance/spec.md from the repo (git) — the repo Spec, derived from the master spec, is the living source. -->

# Contract — port-governance

Source: `specs/port-governance/spec.md` (repo, main @ 247842e)

### Definition of Done

- Human UI and MCP agent invoke the same workflow tools.
- Cross-project access denied.
- Audit entries exist for catalog mutations.
- Concurrent catalog writers cannot both apply — stale `catalogVersion` rejected by `apps/factory-gateway` writer.
- Claim races impossible under §4.2.1 single-writer + version bump (`POST /catalog/claim-next`).
- Ocean/MCP sync cannot bypass Meta fences (`meta_fence_bypass_forbidden` when `bypassFence` is set on Meta-fenced blueprints).
- Unit tests cover HMAC reject + stale `catalogVersion` reject (PBI-005) + Ocean/MCP Meta fence reject.

### Regression Guardrails

- No bypass path for “sync-only” or “claim-only” callers around the gateway writer.
- Ocean / MCP cannot dual-write Meta-fenced blueprints outside `CatalogWriter`.
- Machine-validated stack conflicts reject before scaffold / provision / Coding admit.

### Scenarios

```gherkin
Scenario: Stale catalog write is rejected
  Given entity E has catalogVersion N
  When a writer applies a patch with expectedCatalogVersion N-1
  Then the write is rejected with no partial apply
  And the caller must re-read and rebuild

Scenario: Same tools for human and agent
  Given workflow factory_claim_next_job is exposed as an MCP tool
  When a human invokes it from Port UI and an agent via MCP
  Then both hit the same Port workflow surface
  And both writes go through the §4.2.1 gateway writer

Scenario: PBI-005 factory-gateway hosts §4.2.1 writer
  Given apps/factory-gateway CatalogWriter is the single-writer path
  When two concurrent claim-next applies share expectedCatalogVersion N
  Then exactly one apply succeeds and bumps catalogVersion to N+1
  And the other is rejected as stale_catalog_version with no partial apply

Scenario: Ocean sync cannot bypass Meta fences
  Given blueprint executionContract is Meta-fenced
  When an Ocean sync proposal sets bypassFence true on POST /catalog/sync-write
  Then the gateway rejects with meta_fence_bypass_forbidden
  And no entity bytes are applied

Scenario: MCP sync of Meta-fenced entity uses CatalogWriter
  Given blueprint product is Meta-fenced with catalogVersion N
  When MCP posts /catalog/sync-write with expectedCatalogVersion N
  Then CatalogWriter applies and bumps catalogVersion to N+1
  When a second MCP post reuses expectedCatalogVersion N
  Then the write is rejected as stale_catalog_version with no partial apply

Scenario: Ocean mirror blueprints stay on Port Ocean path
  Given blueprint githubRepository is an Ocean mirror
  When Ocean posts /catalog/sync-write for that blueprint
  Then the gateway returns ocean_mirror_not_via_gateway
  And Port Ocean native sync remains the mirror apply path

Scenario: PBI-010 OpenMCP inventory item 9
  Given /.well-known/openmcp.json exists
  When scripts/validate-well-known.mjs runs
  Then the required mcp key names the Factory MCP entry (Port remote MCP)
  And factory.no_port_oauth_mutation is true
  And this unit does not create or delete Port External Interface apps

Scenario: Meta Convex self-service uses gateway handler
  Given workflow ss_convex_create_preview is published
  When Johnny approves a run with convexProjectId and kind=preview
  Then Port WEBHOOK POSTs to factory-gateway /handlers/self-service
  And the gateway calls Convex Management create_deployment when CONVEX_TEAM_TOKEN is set
  And Prospect/Painter ss_* stubs remain product_lane_stub (HTTP 501) if invoked on the gateway
```
