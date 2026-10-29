# port-governance

> **Status:** PBI-005 / STL-166 — thin `factory-gateway` hosts §4.2.1 catalog writer + HMAC relay (Meta). Stub authorship (PBI-001) remains the Blueprint base; live Port accept is still out of band.
> **Do not Feature-Assemble until Spec review + EGM Goldfish are green for this Spec.**

## Blueprint

### Context

Port is system of record for Factory catalog, RBAC, workflows-as-MCP-tools, MCP connectors, audit, and Context Lake sync (GitHub / Linear / Vercel / Convex). Humans and agents invoke the same Port action surface (ADR-001).

### Architecture

- Live catalog blueprints to bind (do not invent parallel names): `product`, `service`, `executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner`, `bot`, `_mcp_server`, `agentPlugin`, `skill`, `harness_session`.
- Workflows: `factory_create_execution_contract`, `factory_start_delivery_run`, `factory_claim_next_job`, `factory_heartbeat`, `factory_submit_evidence`, `factory_record_review_verdict`, `factory_request_release` (Johnny-only INPUT).
- **§4.2.1 catalog write fencing:** single-writer per `{blueprint}:{entityIdentifier}` inside the thin Factory gateway (`apps/factory-gateway/`); `catalogVersion` bump; reject stale writes; lease/claim fields mutate only in the same apply.
- **§4.2.2 stack assembly:** Port validates stack compatibility as machine rules before provision / Coding admit.
- LogicSRC map: OpenMCP `/.well-known/openmcp.json`; OpenOntology/OpenContext post-M1; OpenAccess scopes documented (Port issues tokens).

### Constraints

- WEBHOOK backend targets Factory gateway (`POST /webhooks/port` with Port HMAC).
- All catalog writes use §4.2.1 fencing — no raw dual-write from Ocean sync, MCP, or Rivet.
- Rivet `ProjectSupervisor` fences execution admission only — it does not replace §4.2.1 for catalog bytes.
- Port entity upserts are create-or-update only (no product CAS); Factory supplies version fence.

## Contract

### Definition of Done

- Human UI and MCP agent invoke the same workflow tools.
- Cross-project access denied.
- Audit entries exist for catalog mutations.
- Concurrent catalog writers cannot both apply — stale `catalogVersion` rejected by `apps/factory-gateway` writer.
- Claim races impossible under §4.2.1 single-writer + version bump (`POST /catalog/claim-next`).
- Unit tests cover HMAC reject + stale `catalogVersion` reject (PBI-005).

### Regression Guardrails

- No bypass path for “sync-only” or “claim-only” callers around the gateway writer.
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
```
