# Contracts — how Factory knows a build is right

Factory has three contract layers. All three are in this plugin:

1. **Spec Contracts** — the Contract half of each domain Spec (Definition of Done, Regression
   Guardrails, Gherkin Scenarios). These are the acceptance terms every unit is judged against.
   Index below; the full Contract text per domain is in `../../../contracts/<domain>.md`.
2. **Typed contracts** — the unit-of-work body itself (master spec §0.1: C1–C3 + fields 1–16 =
   19 fields, + Spec / Verification / Refinement pointers). Blank fillable template:
   `../../../contracts/typed-contract-template.md`. The worked examples are the seed PBIs
   (`../../../pbis/`, indexed in `pbis.md`). Native-template facets of the same body: the
   GitHub issue form `.github/ISSUE_TEMPLATE/pbi.yml` in `mplsjohnnycage/factory` (merged,
   PR #112 — its C3 dropdown is Meta-lane restricted per that repo's §0.2 lane rule) and the
   Linear template body `../../../contracts/linear-pbi-template.md` (template name
   “PBI — Typed Contract (§0.1)”, ASDLC team; pasted in via Linear team settings because the
   Linear MCP connector can apply templates but cannot create them).
3. **Live execution contracts** — Port's `executionContract` blueprint is the catalog facet of
   contracts: the governed path mints/projections one per admitted unit. Snapshot below.

Sources: repo `specs/*/spec.md` @ `origin/main` 247842e (PR #111 merge, 2026-10-30) for the
Spec Contracts; `factory-master-spec.md` §0.1 / §4 for doctrine and cross-references. Where the
Spec file and master §4 both state a Contract, the Spec file (PBI-authored, living with the
code) is what was copied; §4 is the authorship map it derives from.

## Spec Contract index (ten domains)


### factory-kernel — master spec §4.1 · full text: `contracts/factory-kernel.md`

**Definition of Done (summary, verbatim items):**
- Port-authorized start recovers after worker kill and sandbox loss.
- Duplicate `work.start` → exactly one attempt.
- Claim id required for admit (or audited Port bypass).
- Port projections mapped for `executionContract` / `deliveryRun` / `executionAttempt` via §4.2.1 writer.

**Scenarios:** Duplicate admit yields one attempt · Sandbox death recovers session identity · Port-authorized WorkAttempt recover · Claim id required for admit · Meta Beads ready gate · Offline HTTP/in-process admit entry · Admit then Memory session spawn · CI green on exact SHA accepts; rewrite denies

### port-governance — master spec §4.2 · full text: `contracts/port-governance.md`

**Definition of Done (summary, verbatim items):**
- Human UI and MCP agent invoke the same workflow tools.
- Cross-project access denied.
- Audit entries exist for catalog mutations.
- Concurrent catalog writers cannot both apply — stale `catalogVersion` rejected by `apps/factory-gateway` writer.
- Claim races impossible under §4.2.1 single-writer + version bump (`POST /catalog/claim-next`).
- Ocean/MCP sync cannot bypass Meta fences (`meta_fence_bypass_forbidden` when `bypassFence` is set on Meta-fenced blueprints).
- Unit tests cover HMAC reject + stale `catalogVersion` reject (PBI-005) + Ocean/MCP Meta fence reject.

**Scenarios:** Stale catalog write is rejected · Same tools for human and agent · PBI-005 factory-gateway hosts §4.2.1 writer · Ocean sync cannot bypass Meta fences · MCP sync of Meta-fenced entity uses CatalogWriter · Ocean mirror blueprints stay on Port Ocean path · PBI-010 OpenMCP inventory item 9 · Meta Convex self-service uses gateway handler

### rivet-execution — master spec §4.3 · full text: `contracts/rivet-execution.md`

**Definition of Done (summary, verbatim items):**
- Ordered admit through `ProjectSupervisor`.
- Webhook signature verified at gateway before enqueue.
- Rivet never polls Port.
- Health recovers after Compose restart.
- Compose + Tailscale Serve operator artifacts present (PBI-004); live Serve URL evidence when host available.

**Scenarios:** Health after Compose restart · Webhook path never polls Port · PBI-004 Compose and Tailscale Serve artifacts present · PBI-005 invalid HMAC never enqueues · PBI-007 duplicate workKey yields one WorkAttempt · Gateway forward reaches offline admit listener · FE-198 Ask Factory routes through the Developer OS BFF · PBI-009 Dev OS reconnects from last sequence

### sandbox-harness — master spec §4.4 · full text: `contracts/sandbox-harness.md`

**Definition of Done (summary, verbatim items):**
- Create session → prompt → stream events → checkpoint commit.
- Kill sandbox → session history preserved; unsaved filesystem lost.
- Image pin documented and enforced in `apps/sandbox-harness/src/image-pin.ts`.
- Session lifecycle unit tests green in CI (Memory lease).

**Scenarios:** Create prompt stream checkpoint · Kill preserves session identity · PBI-006 image pin is deliberate

### developer-os — master spec §4.5 · full text: `contracts/developer-os.md`

**Definition of Done (summary, verbatim items):**
- Next.js app builds; atlas hero is first viewport.
- Port OAuth login + callback Route Handlers compile; Factory client id via `PORT_FACTORY_CLIENT_ID` only.
- Callback path is `/api/auth/callback` (exact match to Port + OpenAccess redirect_uris).
- Callback performs Authorization Code + PKCE token exchange (no stub; no `client_secret`).
- Production `redirect_uri` origin is pinned to the stable Dev OS host (`NEXT_PUBLIC_DEVOS_URL` or canonical `factory-developer-os.vercel.app`) — never ephemeral `VERCEL_URL` deployment hosts.
- Rivet native stream reconnects from last `sequence` (gap replay + live; no duplicates).
- Port sign-in Route Handler targets the intended Factory client redirects and does not reuse Observatory or Clerk.
- Atlas subgraph + tool dispatcher typecheck/test: proven joins carry full provenance; unknown joins non-authority; access/redaction tests pass; Langfuse refused as live owner.

**Scenarios:** Preview deploy serves shell · Port OAuth PKCE login and callback · Session events survive browser disconnect · PBI-009 reconnect fixture · Code Atlas four-overlay read projection · Code Atlas MCP tools · Code Atlas OpenMCP naming and BFF hardening

### auth-port-oauth — master spec §4.6 · full text: `contracts/auth-port-oauth.md`

**Definition of Done (summary, verbatim items):**
- Spec, OpenAccess descriptor, and ADR-005 status agree: Accepted — live. The descriptor publishes the recorded client id and redirects. It does not invent a client id.
- Developer OS callback Route Handler is `/api/auth/callback` and matches the dedicated Factory redirects above, not Observatory and not Clerk.
- Developer OS performs Authorization Code + PKCE token exchange for the Factory client id (public client; no secret in git).
- HTTPS callbacks are specified before any non-localhost deploy.
- Inventory §7 item 10 present: `/.well-known/openaccess.json` with `openaccess: "0.1"` and required keys.

**Scenarios:** OpenAccess follows the live Factory client and does not invent one · Observatory client rejected for Developer OS · Developer OS callback path matches live redirects · Production redirect_uri uses stable Dev OS origin · PBI-010 OpenAccess inventory item 10

### logicsrc-interop — master spec §4.7 · full text: `contracts/logicsrc-interop.md`

**Definition of Done (summary, verbatim items):**
- **PBI-003:** inventory §7 items 1–2 present (OpenStack root + well-known; OpenProfile operator well-known); AGENTS.md indexes Specs/ADRs/emits without dumping design.
- **PBI-010:** inventory §7 items 9–10 present (`/.well-known/openmcp.json`, `/.well-known/openaccess.json`); validated by `scripts/validate-well-known.mjs`; zero Port mutations.
- **M1:** emit + validate only §13.6 Required rows.
- **Post-M1:** inventory §7 Factory-mandatory checklist green.
- **PBI-014:** `prd/0001`…`0005` Accepted OpenPRD 0.3 present and gate-validated (not an M1 exit criterion).

**Scenarios:** M1 Required emissions present · AGENTS.md stays an index · PBI-003 OpenStack and OpenProfile inventory rows present · PBI-010 OpenMCP and OpenAccess inventory rows present · PBI-014 OpenPRD 0001-0005 collection present

### visibility-accept — master spec §4.8 · full text: `contracts/visibility-accept.md`

**Definition of Done (summary, verbatim items):**
- Trace links attempt → session → commit.
- Rewrite invalidates accept (`prior_accept_stale_after_rewrite` when tip SHA ≠ prior accept SHA).
- Evidence tools record but do not replace CI.
- Every PR SHA (including Specs/ADRs/docs-only) has at least the always-on `meta-ci-presence` check; vertical-slice accept additionally requires green Meta package matrix on that exact SHA (`meta-accept-matrix` / package workflows). Branch protection on `main` requires `meta-ci-presence` (see `docs/ci/branch-protection.md`).
- Gateway + CLI can evaluate accept eligibility for an exact SHA; agent/self actors are refused on `/accept/record`.

**Scenarios:** Rewrite invalidates accept · Evidence does not replace CI · Docs-only SHA still has CI · PBI-011 agent self-accept forbidden

### security-blast-radius — master spec §4.9 · full text: `contracts/security-blast-radius.md`

**Definition of Done (summary, verbatim items):**
- **M1 baseline:** HMAC verification + RBAC enforced on gateway/control plane edges.
- **PBI-012:** over-ceiling spawn refused with ledger `ceiling.refuse`.
- **PBI-012:** gateway rate limiter returns HTTP 429 when over RPM.
- Cross-project denied; sandbox credentials scoped.

**Scenarios:** Cross-project access denied · Over-ceiling refuse (PBI-012) · Gateway rate limit (PBI-012)

### asdlc-lifecycle — master spec §4.10 · full text: `contracts/asdlc-lifecycle.md`

**Definition of Done (summary, verbatim items):**
- One local gate command refuses dirty/invalid (PBI-013).
- CI refuses dirty/invalid (`local-gate-refuse` job).
- Living Specs updated in the same PR as Contract changes.
- **PBI-014:** OpenPRD `prd/0001`…`0005` exist with status Accepted; each validates OpenPRD 0.3 (front-matter + ten sections in order); collection has no numbering gaps; local gate refuses Draft/invalid OpenPRD for those ids.

**Scenarios:** Stub authorship satisfies PBI-001 verification pointer · Living Spec updates travel with Contract changes · Accepted ADR bodies carry six anatomy sections · Local gate refuses dirty Specs and invalid LogicSRC · OpenPRD 0001-0005 Accepted align Meta product intent

## Live execution contracts (Port catalog facet)

**SNAPSHOT 2026-10-30** — evidence: atlas-map-swarm fragments A2 (executionContract blueprint
map) and A5 (entity census), both repo-record-based; **no live Port API query was run in the
mapping pass** (no live Port credential existed that night — A5), so a live entity count is
**UNKNOWN-from-fragments** and is not invented here.

What is established:

- The `executionContract` blueprint exists; an additive patch adds `catalogVersion`
  (number; "Integer starts at 0 on create; Factory catalog writer bumps by 1 on each
  successful apply") — `port/blueprints/executionContract.catalogVersion.yaml` (A2).
- **One** `executionContract` entity is recorded as live-applied, in the repo's Port mirror
  records: identifier `factory-meta-bootstrap-contract`, title "Factory Meta bootstrap
  contract", `catalogVersion: 0` — `port/entities/factory-meta-bootstrap-contract.executionContract.yaml`,
  corroborated by `port/README.md:14` (A2/A5). Apply date is not recorded. This is a floor
  from named records, **not** a census — other live entities may exist and are UNKNOWN (A5).
- Identifiers in code/tests (`ec-1`, `ec-ocean-1`, `ec-custom`, runtime `ec-${workKey}`) are
  examples/test data, **not** live entities (A2).
- The runtime projection path: ProjectSupervisor upserts `executionContract` (plus
  `deliveryRun` / `executionAttempt`) through the §4.2.1 gateway writer only (specs/factory-kernel;
  master spec §4.2.1).

**Refresh route:** query the Port MCP gateway (the one control plane — see package README,
Install): list `executionContract` entities via the Port catalog read surface. Do not trust
this snapshot as current.

## ADR decisions index (locked)

ADRs are immutable decision snapshots (`docs/adrs/ADR-NNN-*.md` in the repo; supersede, never
edit the body — master spec §1/§3). This is an index only; bodies live in the repo. Doctrine
detail: SKILL.md "Locked decisions" and `rails.md`.

| ADR | Decision (one line) | Status |
|---|---|---|
| ADR-001 | Port is the system of record (catalog, RBAC, workflows, MCP gateway, audit, registry, Context Lake); Clerk out | Accepted |
| ADR-002 | Rivet is the execution kernel: ProjectSupervisor single admission queue, single-writer, idempotent; Rivet never polls Port | Accepted |
| ADR-003 | Port→Rivet path only: MCP/self-service → workflow → webhook → thin gateway → supervisor → sandbox → GitHub; catalog = projections | Accepted |
| ADR-004 | ASDLC Spec (`/specs/{domain}/spec.md`) is the canonical build-against artifact; LogicSRC is interop emission, not primary IR | Accepted |
| ADR-005 | Auth = dedicated **Factory** Port External Interface OAuth app; never reuse Harness Observatory | Accepted — **live** 2026-10-29 (Observatory revoked) |
| ADR-006 | Coding harness = Rivet-orchestrated Sandbox Agent (in-sandbox HTTP server + SDK); isolation = Docker provider | Accepted |
| ADR-007 | Developer OS stack (original) | **Superseded by ADR-011** |
| ADR-008 | Visibility = Port audit + Rivet traces + Polygraph evals + scorecards; accept = GitHub CI green on exact SHA | Accepted |
| ADR-009 | ISO/IEC/IEEE 12207:2026 process groups map into Specs + ASDLC phases; Lifecycle Spec owns the mapping | Accepted |
| ADR-010 | ChatGPT Plugins (skills + MCP + optional UI) = reference pattern for Factory MCP Apps | Accepted |
| ADR-011 | Developer OS = Next.js App Router on Vercel; kernel streaming = Rivet Actor native realtime; CopilotKit/AG-UI deferred | Accepted |

Source: master spec §3 table (incl. ADR-005 live parameters) and repo `docs/adrs/` file list
@ 247842e; ADR-005 filename in repo still reads `ADR-005-factory-oauth-deferred.md` while its
status is live — filename drift, flagged not fixed here.
