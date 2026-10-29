# port-governance

> **Status:** PBI-005 gateway + PBI-010 OpenMCP well-known (Meta). Stub authorship (PBI-001) remains the Blueprint base; live Port accept is still out of band.
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Port is system of record for Factory catalog, RBAC, workflows-as-MCP-tools, MCP connectors, audit, and Context Lake sync (GitHub / Linear / Vercel / Convex). Humans and agents invoke the same Port action surface (ADR-001).

### Architecture

- Live catalog blueprints to bind (do not invent parallel names): `product`, `service`, `executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner`, `bot`, `_mcp_server`, `agentPlugin`, `skill`, `harness_session`.
- Workflows: `factory_create_execution_contract`, `factory_start_delivery_run`, `factory_claim_next_job`, `factory_heartbeat`, `factory_submit_evidence`, `factory_record_review_verdict`, `factory_request_release` (Johnny-only INPUT).
- **Meta self-service handlers:** `ss_convex_create_preview`, `ss_convex_set_env` WEBHOOK → `factory-gateway` `POST /handlers/self-service` (as-code under `port/workflows/`). Prospect / Painter `ss_*` NEEDS HANDLER stubs stay Product lane.
- **§4.2.1 catalog write fencing:** single-writer per `{blueprint}:{entityIdentifier}` inside the thin Factory gateway (`apps/factory-gateway/`); `catalogVersion` bump; reject stale writes; lease/claim fields mutate only in the same apply.
- **Meta fences vs Ocean mirrors:** Factory-governed blueprints listed above are **Meta-fenced** — Ocean sync and Port MCP entity upserts must enter via `POST /catalog/sync-write` (or `/catalog/write`) and cannot set `bypassFence`. Context Lake mirror blueprints (`github*` / `linear*` / `vercel*` / `convex*`) may continue via Port Ocean native sync; they are not Meta-fenced. Unknown blueprints fail closed as Meta-fenced. See `docs/ocean-mcp-write-fencing.md`.
- **§4.2.2 stack assembly:** Port validates stack compatibility as machine rules before provision / Coding admit.
- LogicSRC map: OpenMCP `/.well-known/openmcp.json` (PBI-010 — advertises Port remote MCP `https://mcp.port.io/v1` as Factory’s one MCP entry); OpenOntology/OpenContext post-M1; OpenAccess scopes documented (Port issues tokens).

### Constraints

- WEBHOOK backend targets Factory gateway (`POST /webhooks/port` with Port HMAC for admit; `POST /handlers/self-service` for Meta SS handlers with HMAC or shared bearer).
- All catalog writes use §4.2.1 fencing — no raw dual-write from Ocean sync, MCP, or Rivet onto Meta-fenced blueprints.
- Ocean mappings must not target Meta-fenced blueprints unless the apply path POSTs the gateway sync ingress.
- Rivet `ProjectSupervisor` fences execution admission only — it does not replace §4.2.1 for catalog bytes.
- Port entity upserts are create-or-update only (no product CAS); Factory supplies version fence.
- Do not implement Product-lane Prospect / Painter OS self-service backends in Meta gateway.

## Contract

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

