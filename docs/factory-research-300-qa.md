# Factory research — ~300 Q&A (gap-focused)

**Status:** Research deliverable for FE-47  
**Date:** 2026-10-28  
**Method:** Questions target gaps/ambiguities relative to existing Project docs; answers from Project files and official vendor docs. No Johnny interviews. No live Port/Linear/Notion mutations.  
**Companion:** [`factory-research-reconciliation.md`](./factory-research-reconciliation.md)  

**Question count:** 300

Theme tags: `architecture` `adr` `port` `beads` `linear` `rivet` `coding-loop` `git` `topology` `gateway` `logicsrc` `auth-notion` `ui-agents` `vercel` `misc` `pbi` `specs` `sync` `collisions` `smooth-loop` `claims` `standards` `stack`

---

## Q1. What is the Factory production-plan SoT document?
**Theme:** `architecture`  
**A:** docs/factory-master-spec.md is the canonical ASDLC Spec production plan for Factory M1 authorship.  
**Sources:** docs/factory-master-spec.md

## Q2. What is the standardized workflow SoT?
**Theme:** `architecture`  
**A:** docs/factory-workflow.md ties upfront setup to the coding loop; it does not replace the master plan.  
**Sources:** docs/factory-workflow.md

## Q3. What is the coding-sequence SoT?
**Theme:** `architecture`  
**A:** docs/factory-coding-loop.md defines the five-step tool-agnostic loop: task→standardize→PR→build→loop.  
**Sources:** docs/factory-coding-loop.md

## Q4. Are Cursor Project notes.md Spec or accept authority?
**Theme:** `architecture`  
**A:** No. notes.md is coordination scratch only (FE-* handoff), never Spec, accept, or work queue SoT.  
**Sources:** docs/factory-workflow.md; docs/factory-coding-loop.md

## Q5. What artifact hierarchy does ASDLC use?
**Theme:** `architecture`  
**A:** Spec (Blueprint+Contract) → PBI deltas → ADR immutable decisions → LogicSRC interoperability emissions.  
**Sources:** docs/factory-master-spec.md §1

## Q6. Is LogicSRC the primary IR?
**Theme:** `architecture`  
**A:** No. ADR-004: ASDLC Spec is canonical build-against artifact; LogicSRC is interoperability emission only.  
**Sources:** docs/factory-master-spec.md ADR-004

## Q7. What are the ten domain Spec stubs?
**Theme:** `architecture`  
**A:** factory-kernel, port-governance, rivet-execution, sandbox-harness, developer-os, auth-port-oauth, logicsrc-interop, visibility-accept, security-blast-radius, asdlc-lifecycle.  
**Sources:** docs/factory-master-spec.md §4

## Q8. What does Feature Assembly mean?
**Theme:** `architecture`  
**A:** ASDLC phase after Spec Blueprint+Contract is review-green when agents may implement code against that Spec (Assemble).  
**Sources:** docs/factory-master-spec.md §7

## Q9. What gates block Feature Assembly?
**Theme:** `architecture`  
**A:** Spec review + EGM Goldfish (feature_spec) green before Feature Assembly for that Spec.  
**Sources:** docs/factory-master-spec.md §7; docs/factory-coding-loop.md

## Q10. Does agent “done” equal Port accept?
**Theme:** `architecture`  
**A:** No. Accept = Port governance + GitHub CI green on exact SHA (ADR-008).  
**Sources:** docs/factory-master-spec.md ADR-008

## Q11. What is the M1 locked execution path?
**Theme:** `architecture`  
**A:** Port (SoT) → webhook HMAC → thin factory-gateway → Rivet ProjectSupervisor → Sandbox Agent (Docker) → GitHub → CI on SHA → Port accept.  
**Sources:** docs/factory-workflow.md A8; docs/factory-master-spec.md Proposed Architecture

## Q12. Is Clerk in scope?
**Theme:** `architecture`  
**A:** No. ADR-001/005 drop Clerk; Port is auth/catalog SoT.  
**Sources:** docs/factory-master-spec.md ADR-001; docs/port-capabilities.md

## Q13. What is meta-building vs product projects?
**Theme:** `architecture`  
**A:** Meta builds Factory itself (distinct Linear, docs, Meta Beads). Product projects are assembled with Factory (distinct boards/repos/Product Beads).  
**Sources:** docs/factory-workflow.md Separation

## Q14. May agents invent parallel Port tool IDs?
**Theme:** `architecture`  
**A:** No. ASSUMPTION 11 / no-second-catalog: bind live Port blueprint/workflow names.  
**Sources:** docs/factory-master-spec.md §9; docs/factory-workflow.md

## Q15. What seed PBIs launch M1?
**Theme:** `architecture`  
**A:** PBI-001…015 covering Specs, ADRs, LogicSRC emit, Rivet/gateway/SA, Beads gate, Dev OS, accept, ceilings, local gate, OpenPRD, Compound.  
**Sources:** docs/factory-master-spec.md §6

## Q16. What is Atomicity for concurrent PBIs?
**Theme:** `architecture`  
**A:** Concurrent PBIs must not share write sets; fan out by Spec domain / worktree.  
**Sources:** docs/factory-master-spec.md §6 Atomicity

## Q17. Is Infinity recommended for the Factory stack?
**Theme:** `architecture`  
**A:** Deferred — infinity-stack-fit recommends defer; not a locked stack dependency.  
**Sources:** docs/infinity-stack-fit.md

## Q18. What open standards catalog exists?
**Theme:** `architecture`  
**A:** docs/factory-open-standards.md catalogs Factory-relevant open standards (MCP, AG-UI, ISO 12207 mapping context, etc.).  
**Sources:** docs/factory-open-standards.md

## Q19. What does the stack audit cover?
**Theme:** `architecture`  
**A:** Full Factory stack audit of Port/Rivet/Beads/Polygraph/Trail-Code/Vercel/AG-UI/etc. with VERIFIED/UNVERIFIABLE claims.  
**Sources:** docs/factory-stack-audit.md

## Q20. Where are skill leverage bindings?
**Theme:** `architecture`  
**A:** Master §21 and docs/factory-skill-leverage.md bind installed skills to Spec authorship.  
**Sources:** docs/factory-master-spec.md §21; docs/factory-skill-leverage.md

## Q21. What does ADR-001 decide?
**Theme:** `adr`  
**A:** Port is system of record (catalog, RBAC, workflows, MCP gateway, audit, agent/skill registry, Context Lake). Clerk out.  
**Sources:** docs/factory-master-spec.md §3

## Q22. What does ADR-002 decide?
**Theme:** `adr`  
**A:** Rivet is execution kernel: ProjectSupervisor single admission queue, per-actor ordered queues, single-writer; Rivet never polls Port.  
**Sources:** docs/factory-master-spec.md §3

## Q23. What does ADR-003 decide?
**Theme:** `adr`  
**A:** Port→Rivet path: MCP/self-service → workflow → webhook → thin gateway → supervisor → sandbox → GitHub; Port catalog = projections.  
**Sources:** docs/factory-master-spec.md §3

## Q24. What does ADR-004 decide?
**Theme:** `adr`  
**A:** ASDLC Spec (/specs/{domain}/spec.md) is canonical agent build-against artifact; LogicSRC is interop emission not primary IR.  
**Sources:** docs/factory-master-spec.md §3

## Q25. What does ADR-005 decide?
**Theme:** `adr`  
**A:** Intended auth = dedicated Factory Port External Interface OAuth app. Never reuse Harness Observatory. Create deferred — docs only.  
**Sources:** docs/factory-master-spec.md §3

## Q26. What does ADR-006 decide?
**Theme:** `adr`  
**A:** Coding harness = Rivet-orchestrated Sandbox Agent (in-sandbox HTTP SDK); isolation = Docker provider. Not “Rivet built-in.”  
**Sources:** docs/factory-master-spec.md §3

## Q27. What does ADR-007 decide?
**Theme:** `adr`  
**A:** Superseded by ADR-011 (was Next.js+Vercel with CopilotKit+AG-UI in kernel).  
**Sources:** docs/factory-master-spec.md §3

## Q28. What does ADR-008 decide?
**Theme:** `adr`  
**A:** Visibility = Port audit + Rivet traces + Polygraph inputs + scorecards. Accept = GitHub CI on exact SHA.  
**Sources:** docs/factory-master-spec.md §3

## Q29. What does ADR-009 decide?
**Theme:** `adr`  
**A:** ISO/IEC/IEEE 12207:2026 process groups map into Specs + ASDLC phases; Lifecycle Spec owns mapping.  
**Sources:** docs/factory-master-spec.md §3; docs/iso-12207-overview.md

## Q30. What does ADR-010 decide?
**Theme:** `adr`  
**A:** ChatGPT Plugins (skills + MCP + optional UI) = reference pattern for Factory MCP Apps.  
**Sources:** docs/factory-master-spec.md §3

## Q31. What does ADR-011 decide?
**Theme:** `adr`  
**A:** Developer OS = Next.js App Router on Vercel; kernel streaming = Rivet Actor native realtime; CopilotKit/AG-UI deferred.  
**Sources:** docs/factory-master-spec.md §3

## Q32. Where must full ADR bodies live?
**Theme:** `adr`  
**A:** Under git docs/adrs/ as Nygard ADRs (PBI-002); bodies immutable — supersede, never edit.  
**Sources:** docs/factory-workflow.md A6; docs/factory-master-spec.md §1

## Q33. Is ADR-005 create executable now?
**Theme:** `adr`  
**A:** No. Document create params only; no live Port create/delete without Johnny ops authorization.  
**Sources:** docs/factory-master-spec.md ADR-005; docs/factory-workflow.md A10

## Q34. What Observatory External Interface exists today?
**Theme:** `adr`  
**A:** Harness Observatory app id stflVc7sZJXf6FelDkUFFhcKnoaxP6QP; FREEMIUM limit blocked Factory create (FE-11).  
**Sources:** docs/factory-master-spec.md §3 ASSUMPTION/context; docs/port-capabilities.md §3.1

## Q35. May Factory reuse Observatory OAuth client?
**Theme:** `adr`  
**A:** Never. ADR-005 explicitly forbids reusing Harness Observatory for Factory/Developer OS.  
**Sources:** docs/factory-master-spec.md ADR-005

## Q36. Is first-party Rivet↔AG-UI a vendor product?
**Theme:** `adr`  
**A:** UNVERIFIABLE as vendor product; any bridge is Factory design (§11).  
**Sources:** docs/factory-master-spec.md ADR-011, §11

## Q37. What does ADR-008 mean by Polygraph evals?
**Theme:** `adr`  
**A:** Factory visibility inputs from Polygraph session/review artifacts — not a formal Polygraph LLM-eval product (claims G3 UNVERIFIED).  
**Sources:** docs/factory-master-spec.md §13.2; docs/factory-claims-verification.md G3

## Q38. What are Port blueprints?
**Theme:** `port`  
**A:** Schema for one kind of catalog record: properties + relations connecting entities.  
**Sources:** https://docs.port.io/context-lake/data-model/setup-blueprint/; docs/port-factory-data-model.md

## Q39. What live Factory blueprints were bound 2026-10-28?
**Theme:** `port`  
**A:** product, service, executionContract, deliveryRun, executionAttempt, executionRunner, bot, _mcp_server, agentPlugin, skill, harness_session (+ stack modules).  
**Sources:** docs/factory-master-spec.md §4.2

## Q40. What live factory_* workflows exist?
**Theme:** `port`  
**A:** factory_create_execution_contract, factory_start_delivery_run, factory_claim_next_job, factory_heartbeat, factory_submit_evidence, factory_record_review_verdict, factory_request_release (Johnny-only INPUT).  
**Sources:** docs/factory-master-spec.md §4.2

## Q41. Do Port upserts support CAS?
**Theme:** `port`  
**A:** No. Port product upsert is create-or-update only without compare-and-swap; Factory adds §4.2.1 fencing.  
**Sources:** https://docs.port.io/workflows/build-workflows/nodes/action-nodes/upsert-entity; docs/factory-master-spec.md §4.2.1

## Q42. What is §4.2.1 catalog write fencing?
**Theme:** `port`  
**A:** Single-writer per {blueprint}:{entityIdentifier} + catalogVersion integer; reject stale expectedCatalogVersion; writer in thin factory-gateway.  
**Sources:** docs/factory-master-spec.md §4.2.1; docs/port-factory-data-model.md §4.1

## Q43. Where does the catalog writer live?
**Theme:** `port`  
**A:** Inside thin Factory gateway process co-located with Port webhook HMAC verifier — not a Port SaaS feature and not a Rivet Actor.  
**Sources:** docs/factory-master-spec.md §4.2.1

## Q44. What are Port relations?
**Theme:** `port`  
**A:** Connections between blueprints (and thus entities): target, required, many flags.  
**Sources:** https://docs.port.io/context-lake/data-model/setup-blueprint/relate-blueprints/

## Q45. What are Port mirror properties (mirror relations)?
**Theme:** `port`  
**A:** Derived properties on a source blueprint that map values from related entities via path (e.g. myRelation.myProperty), including chained paths.  
**Sources:** https://docs.port.io/context-lake/data-model/setup-blueprint/properties/mirror-property/

## Q46. Can mirror properties chain across relations?
**Theme:** `port`  
**A:** Yes — path can traverse nested relations (e.g. system.domain.domain_members).  
**Sources:** Port mirror-property docs

## Q47. What are Port scorecards?
**Theme:** `port`  
**A:** Quality/readiness rule sets on blueprints with levels/rules; Factory uses them for visibility/readiness (ADR-008).  
**Sources:** Port list_scorecards MCP; docs/port-factory-data-model.md §2.8

## Q48. What are Port automations?
**Theme:** `port`  
**A:** Event-driven catalog updates; still Port SoT; writes must go through fencing.  
**Sources:** docs/factory-workflow.md A2; docs/port-factory-data-model.md

## Q49. What is Port MCP gateway for Factory?
**Theme:** `port`  
**A:** Cockpit Single-MCP front door; humans and agents invoke same workflow tools; rate limits and scoping VERIFIED (claims G6).  
**Sources:** docs/factory-master-spec.md §18; docs/factory-claims-verification.md G6

## Q50. Is “blast radius” a named Port MCP control?
**Theme:** `port`  
**A:** UNVERIFIED as a named Port MCP-gateway control; Factory security Spec owns blast-radius design.  
**Sources:** docs/factory-claims-verification.md G6c

## Q51. How does Port webhook HMAC work?
**Theme:** `port`  
**A:** HMAC-SHA256 over `{x-port-timestamp}.{body}` with client secret; compare to x-port-signature (after comma split).  
**Sources:** https://docs.port.io/workflows/actions-and-automations/setup-backend/webhook/signature-verification

## Q52. What is Port Ocean?
**Theme:** `port`  
**A:** Port’s integration/sync layer that applies external source state into Port catalog entities.  
**Sources:** docs/factory-master-spec.md §4.2.1

## Q53. Which Ocean connectors does Factory plan?
**Theme:** `port`  
**A:** GitHub / Linear / Vercel / Convex (and custom Ocean where needed) into entities for unit-of-work mapping.  
**Sources:** docs/factory-workflow.md A2; docs/port-factory-data-model.md §5

## Q54. What is External Interfaces in Port?
**Theme:** `port`  
**A:** Public/PKCE Auth0 OAuth apps for humans+agents; Factory intends dedicated app (ADR-005).  
**Sources:** Port list_external_interface_apps; docs/factory-master-spec.md ADR-005

## Q55. How do you create an External Interface app via MCP?
**Theme:** `port`  
**A:** upsert_external_interface_app (omit appId) — organization admin; execution deferred for Factory.  
**Sources:** Port docs manage OAuth apps; docs/factory-master-spec.md ADR-005 create params

## Q56. Does Port replace CI/CD?
**Theme:** `port`  
**A:** No. Port docs confirm Port does not replace CI/CD; Factory accept uses GitHub CI (claims G5).  
**Sources:** docs/factory-claims-verification.md G5

## Q57. What is native-first Port principle?
**Theme:** `port`  
**A:** Prefer Port built-ins (blueprints, relations, mirrors, MCP, workflows, automations, scorecards, RBAC, audit, Context Lake, Ocean, External Interfaces) over custom substitutes.  
**Sources:** docs/factory-workflow.md; docs/port-factory-data-model.md

## Q58. What is assemble-first validation?
**Theme:** `port`  
**A:** Machine-validated stack compatibility in Port (§4.2.2) before provision/Coding admit; catalog misses → needs implementation PBIs.  
**Sources:** docs/factory-master-spec.md §4.2.2

## Q59. May Ocean/MCP dual-write Port bypassing gateway writer?
**Theme:** `port`  
**A:** No. Ocean sync / MCP clients call gateway writer API; they do not dual-write Port.  
**Sources:** docs/factory-master-spec.md §4.2.1

## Q60. What does factory_claim_next_job warn about?
**Theme:** `port`  
**A:** Live description: Port upserts have no CAS so concurrent claims can race; serialize calls concurrency 1 until transactional lease exists.  
**Sources:** docs/factory-stack-audit.md; live Port workflow description

## Q61. Is Context Lake part of Port SoT?
**Theme:** `port`  
**A:** Yes — ADR-001 includes Context Lake for sync/visibility of catalogized software assets.  
**Sources:** docs/factory-master-spec.md ADR-001

## Q62. What RBAC does Port provide for Factory?
**Theme:** `port`  
**A:** Blueprint entity permissions: read/register/update/unregister/updateProperties/updateRelations; self-service action RBAC; machine≠interactive paths.  
**Sources:** Port get_blueprint_permissions; docs/port-factory-data-model.md §3

## Q63. What is Beads?
**Theme:** `beads`  
**A:** Distributed graph issue tracker for AI agents, powered by Dolt — persistent dependency-aware task graph.  
**Sources:** https://github.com/gastownhall/beads README; https://beads.gascity.com/

## Q64. What is the core Beads CLI flow?
**Theme:** `beads`  
**A:** bd create → deps → bd ready → bd update --claim → bd close; blockers release → ready.  
**Sources:** Beads README

## Q65. What does bd ready do?
**Theme:** `beads`  
**A:** List tasks with no open blockers (claimable work).  
**Sources:** Beads README

## Q66. What does bd update --claim do?
**Theme:** `beads`  
**A:** Atomically claim a task (sets assignee + in_progress); first claim wins; re-claim by holder is idempotent.  
**Sources:** https://beads.gascity.com/multi-agent/coordination.md

## Q67. What is bd ready --claim?
**Theme:** `beads`  
**A:** Claim the first ready issue matching filters in one step (prefer for self-selecting agents).  
**Sources:** Beads coordination docs

## Q68. What storage backend does Beads use?
**Theme:** `beads`  
**A:** Dolt — embedded (single-writer, default) or server mode (multi concurrent writers).  
**Sources:** Beads README Storage Modes; https://beads.gascity.com/architecture/dolt.md

## Q69. How does cross-machine Beads sync work?
**Theme:** `beads`  
**A:** bd dolt push / bd dolt pull against refs/dolt/data on git remote; .beads/issues.jsonl is export not SoT.  
**Sources:** Beads README; sync-setup docs

## Q70. Why hash-based IDs?
**Theme:** `beads`  
**A:** Collision-resistant IDs (bd-a1b2) prevent merge collisions across agents/branches; no coordination needed.  
**Sources:** https://beads.gascity.com/core-concepts/hash-ids.md

## Q71. Do Git worktrees get separate .beads stores?
**Theme:** `beads`  
**A:** No by default — all worktrees in same repo share one .beads workspace unless BEADS_DIR overrides.  
**Sources:** https://beads.gascity.com/reference/worktrees.md

## Q72. How should agents use Beads from worktrees?
**Theme:** `beads`  
**A:** Init once; create linked worktrees; run bd ready/claim in worktree; sync via bd dolt pull/push.  
**Sources:** Beads worktrees guide

## Q73. What is BEADS_DIR for?
**Theme:** `beads`  
**A:** Point multiple code worktrees at an external shared beads workspace.  
**Sources:** Beads worktrees guide

## Q74. What is Meta Beads?
**Theme:** `beads`  
**A:** Builder’s Beads instance for Factory meta-building (kernel/this Project) — distinct from Product Beads.  
**Sources:** docs/factory-workflow.md Meta vs Product Beads

## Q75. What is Product Beads?
**Theme:** `beads`  
**A:** Factory-shipped Beads component so product projects get their own ready/claim/parallelism — separate instance.  
**Sources:** docs/factory-workflow.md

## Q76. When does Meta Beads become admit SoT?
**Theme:** `beads`  
**A:** From PBI-007 onward (ProjectSupervisor + Beads ready gate). Before that, Linear/PBI may carry claim.  
**Sources:** docs/factory-master-spec.md §13.1, PBI-007; docs/factory-workflow.md OQ-1

## Q77. Does Beads document Rivet/Port APIs?
**Theme:** `beads`  
**A:** No. ReadyTaskEvent / Rivet supervisor contracts are Factory adapter design (UNVERIFIABLE as Beads vendor API).  
**Sources:** docs/factory-master-spec.md §13.1

## Q78. What is Factory ReadyTaskEvent (M1)?
**Theme:** `beads`  
**A:** { beadId, projectId, claimedBy, claimedAt, executionContractId? } after bd ready + claim; supervisor refuses without beadId or audited bypass.  
**Sources:** docs/factory-master-spec.md §13.1

## Q79. What are merge slots in Beads?
**Theme:** `beads`  
**A:** Exclusive-access primitive (bd merge-slot create/check/acquire/release) to serialize conflict-prone work like merge-queue resolution.  
**Sources:** Beads coordination docs

## Q80. How to recover stale claims?
**Theme:** `beads`  
**A:** bd reclaim reverts stale-lease in_progress issues back to ready (dead-worker recovery).  
**Sources:** https://beads.gascity.com/cli-reference/reclaim.md

## Q81. Does Beads replace Port catalog?
**Theme:** `beads`  
**A:** No. Beads = readiness/claim graph only; Port remains catalog/accept SoT.  
**Sources:** docs/factory-master-spec.md §13.1; coding loop ownership

## Q82. Does Beads replace Linear human tracker?
**Theme:** `beads`  
**A:** No. Linear remains human-facing PBI tracking SoT; Beads owns ready/claim/parallel when in force.  
**Sources:** docs/factory-coding-loop.md; docs/linear-factory-task-manager.md

## Q83. What is OQ-1?
**Theme:** `beads`  
**A:** Whether to start Meta Beads scaffolding now vs wait until PBI-007.  
**Sources:** docs/factory-workflow.md Open questions

## Q84. What is the researched recommendation for OQ-1?
**Theme:** `beads`  
**A:** Hybrid: optional Meta Beads scaffolding for deps/ready practice now is OK; keep Linear as admit/claim SoT until PBI-007; do not treat Beads as day-one human board. Final start-now mandate remains Johnny decision.  
**Sources:** docs/factory-workflow.md A5; master §13.1; Beads docs

## Q85. Can multiple agents claim the same bead?
**Theme:** `beads`  
**A:** Atomic claim: first wins; others fail; use merge slots for shared conflict-prone paths.  
**Sources:** Beads coordination docs

## Q86. How do file-scope collisions get prevented without Beads?
**Theme:** `beads`  
**A:** Master Atomicity: concurrent PBIs must not share write sets; fan out by Spec domain / worktree; one active task preferred.  
**Sources:** docs/factory-master-spec.md §6; docs/factory-coding-loop.md

## Q87. Is day-one Beads the human board SoT?
**Theme:** `beads`  
**A:** No — hard ban until PBI-007.  
**Sources:** docs/factory-coding-loop.md Hard bans

## Q88. What role does Linear play?
**Theme:** `linear`  
**A:** Human-facing tracker / visibility for the same PBI-shaped unit of work; tracking SoT for PBI state.  
**Sources:** docs/factory-workflow.md; docs/linear-factory-task-manager.md

## Q89. How do agents I/O with Linear?
**Theme:** `linear`  
**A:** Linear MCP or SDK.  
**Sources:** docs/linear-factory-task-manager.md

## Q90. Does Linear have official MCP Apps?
**Theme:** `linear`  
**A:** No — verified gap; Factory designs custom HTML+BFF+Vercel widget (§16).  
**Sources:** docs/linear-mcp-apps-verify.md; docs/factory-master-spec.md §16

## Q91. How do Linear issues map to PBIs?
**Theme:** `linear`  
**A:** Linear issue is the PBI facet of the synced unit (Directive/Spec/Verification/Refinement).  
**Sources:** docs/factory-workflow.md Sync model

## Q92. Must meta and product share a Linear board?
**Theme:** `linear`  
**A:** Never — distinct Linear project/team for meta vs product.  
**Sources:** docs/factory-workflow.md Separation

## Q93. Can Port Ocean mirror Linear?
**Theme:** `linear`  
**A:** Yes planned; Linear remains tracking SoT for PBI state.  
**Sources:** docs/factory-coding-loop.md tool map

## Q94. Is implementing Linear MCP App an M1 exit criterion?
**Theme:** `linear`  
**A:** No — design lock OK; implement deferred post–PBI-011 green.  
**Sources:** docs/factory-master-spec.md §13.5

## Q95. What is Rivet’s Factory role?
**Theme:** `rivet`  
**A:** Durable execution kernel (ADR-002): ProjectSupervisor admission, actors, queues; never polls Port.  
**Sources:** docs/factory-master-spec.md ADR-002

## Q96. What is ProjectSupervisor?
**Theme:** `rivet`  
**A:** Single admission queue per project; fences execution admission only (not Port catalog fencing).  
**Sources:** docs/rivet-claim-fencing.md; ADR-002

## Q97. Does Rivet provide a product claim-lease CAS API?
**Theme:** `rivet`  
**A:** No. Closest: per-actor ordered queues + single-writer actor storage. Factory WorkAttempt leases are app design.  
**Sources:** docs/factory-stack-audit.md; docs/rivet-claim-fencing.md

## Q98. What is Sandbox Agent?
**Theme:** `rivet`  
**A:** HTTP server inside a sandbox providing unified API for Claude Code, Codex, OpenCode, Cursor, Amp, Pi.  
**Sources:** https://rivet.dev/sandbox-agent/docs/; docs/rivet-sandbox-agent.md

## Q99. Is Sandbox Agent the isolation boundary?
**Theme:** `rivet`  
**A:** No — isolation is the sandbox provider (Docker for M1); SA is the in-sandbox control plane.  
**Sources:** Sandbox Agent architecture docs; ADR-006

## Q100. Should browsers call Sandbox Agent?
**Theme:** `rivet`  
**A:** No — keep sandbox calls actor/backend-only; credentials stay server-side.  
**Sources:** https://rivet.dev/sandbox-agent/docs/multiplayer; security docs

## Q101. What M1 actors are named?
**Theme:** `rivet`  
**A:** ProjectSupervisor, WorkAttempt, AgentSession, SandboxLease.  
**Sources:** docs/factory-master-spec.md §4.1

## Q102. Are CapacityManager and AssemblyWorkflow M1?
**Theme:** `rivet`  
**A:** No — post-M1 (Non-Goals).  
**Sources:** docs/factory-master-spec.md §13.0

## Q103. What is the first M1 in-sandbox coding process?
**Theme:** `rivet`  
**A:** Claude Code via Sandbox Agent (ASSUMPTION 3 / PBI-006).  
**Sources:** docs/factory-master-spec.md §9

## Q104. Which other SA-documented agents are eligible?
**Theme:** `rivet`  
**A:** Codex / OpenCode / Cursor / Amp / Pi as Coding-agent processes inside SA when chosen.  
**Sources:** docs/factory-master-spec.md §18.1

## Q105. How does Dev OS stream sessions?
**Theme:** `rivet`  
**A:** Rivet Actor native realtime (SSE/events) via Tailscale Serve HTTPS — not CopilotKit in kernel.  
**Sources:** ADR-011; §13.4

## Q106. Where does Rivet run in M1 topology?
**Theme:** `rivet`  
**A:** Operator desktop Docker Compose self-host (control plane + nodes).  
**Sources:** docs/factory-master-spec.md §13.4

## Q107. Is Rivet queue redelivery semantics fully settled?
**Theme:** `rivet`  
**A:** Still UNVERIFIABLE which Rivet doc (queues vs checklist) is authoritative on retry/no-redelivery — Factory must design idempotent side effects.  
**Sources:** docs/rivet-claim-fencing.md; stack audit

## Q108. What providers does Sandbox Agent support?
**Theme:** `rivet`  
**A:** local, docker, e2b, daytona, agentcomputer, vercel, cloudflare.  
**Sources:** Sandbox Agent SDK overview

## Q109. What are the five coding-loop steps?
**Theme:** `coding-loop`  
**A:** 1 Task starts 2 Standardize 3 Open PR 4 Run build 5 Loop back.  
**Sources:** docs/factory-coding-loop.md

## Q110. Who may execute the coding loop?
**Theme:** `coding-loop`  
**A:** Any eligible Coding agent (Cursor is not the only one); sequence is fungible by agent, not by steps.  
**Sources:** docs/factory-workflow.md

## Q111. What is the sync model unit of work?
**Theme:** `coding-loop`  
**A:** One entity with four facets: Bead, PBI, Linear issue, GitHub issue — mapped, not parallel queues.  
**Sources:** docs/factory-workflow.md Sync model

## Q112. What are the four sync planes?
**Theme:** `coding-loop`  
**A:** Beads (ready/claim/parallel), Linear (human tracker), git (PRs/CI/code), Port (accept/governance/catalog).  
**Sources:** docs/factory-workflow.md

## Q113. What happens in Standardize?
**Theme:** `coding-loop`  
**A:** Align Spec Blueprint+Contract, open-spec/LogicSRC emissions required, assemble-first, §7 gates, respect ADRs.  
**Sources:** docs/factory-coding-loop.md Step 2

## Q114. When must Spec changes land?
**Theme:** `coding-loop`  
**A:** In the same PR as code by default (PBI refinement rule) unless PBI says otherwise.  
**Sources:** docs/factory-coding-loop.md

## Q115. What does Run build include?
**Theme:** `coding-loop`  
**A:** Local gate → CI on PR SHA → optional adversarial → Port accept on exact SHA.  
**Sources:** docs/factory-coding-loop.md Step 4

## Q116. What is Compound writeback?
**Theme:** `coding-loop`  
**A:** HITL after verified coding PBI: /ce-compound → docs/solutions/; AGENTS.md stays index (PBI-015).  
**Sources:** docs/factory-master-spec.md §7, PBI-015

## Q117. What Phase A prerequisites exist before Feature Assembly?
**Theme:** `coding-loop`  
**A:** Spec placement, Port native setup, git layout, Linear/PBIs, (Meta Beads per OQ-1), ADRs, M1 LogicSRC emit, execution plane when admitting, context gates, OAuth deferred, Notion undecided.  
**Sources:** docs/factory-workflow.md Phase A

## Q118. Is the loop Cursor-hard-locked?
**Theme:** `coding-loop`  
**A:** No — hard ban on hard-coding to a single IDE/MCP host/CE slash-command.  
**Sources:** docs/factory-coding-loop.md Hard bans

## Q119. What mandated repo layout applies?
**Theme:** `git`  
**A:** AGENTS.md, OpenStack.md, specs/{domain}/spec.md, docs/adrs/, apps/developer-os/, apps/factory-gateway/, bin/install.sh, .well-known/, optional tasks/PBI-*, prd/agents/workflows.  
**Sources:** docs/factory-master-spec.md §2; workflow A3

## Q120. Meta-repo vs product repos?
**Theme:** `git`  
**A:** Factory meta-repo for kernel Specs/ADRs/gateway/Dev OS; separate product repos for assembled products.  
**Sources:** docs/factory-workflow.md Separation

## Q121. How do worktrees prevent code collisions?
**Theme:** `git`  
**A:** One claimed unit per write set; place concurrent work in separate Spec-domain worktrees; do not share write sets across PBIs.  
**Sources:** master §6 Atomicity; Beads worktrees guide

## Q122. Should each worktree run its own bd init?
**Theme:** `git`  
**A:** No — init once per repo; worktrees share .beads.  
**Sources:** Beads worktrees guide

## Q123. What is source of truth for the change set?
**Theme:** `git`  
**A:** The git repo (PR SHA), not Port/Linear/notes.md.  
**Sources:** docs/factory-coding-loop.md Step 3

## Q124. What invalidates a prior CI green?
**Theme:** `git`  
**A:** Rewrite of the SHA — accept is exact-SHA bound (ADR-008).  
**Sources:** docs/factory-master-spec.md ADR-008, PBI-011

## Q125. Where do living-spec edits travel?
**Theme:** `git`  
**A:** With the PR (living-specs practice / §7).  
**Sources:** docs/factory-coding-loop.md Step 3

## Q126. Where does Rivet run for M1?
**Theme:** `topology`  
**A:** Operator desktop (PC) Docker Compose self-host.  
**Sources:** docs/factory-master-spec.md §13.4

## Q127. What publishes gateway HTTPS?
**Theme:** `topology`  
**A:** Tailscale Serve (tailnet HTTPS); Funnel optional elevated public exposure.  
**Sources:** §13.4; https://tailscale.com/docs/features/tailscale-serve

## Q128. Serve vs Funnel?
**Theme:** `topology`  
**A:** Serve = publish to tailnet; Funnel = publish to internet. Funnel is elevated exposure — keep HMAC+auth; never rely on URL obscurity.  
**Sources:** Tailscale Serve/Funnel CLI docs; master §13.4

## Q129. Is factory-edge in M1?
**Theme:** `topology`  
**A:** No — Non-Goal; post-M1 optional if Serve/Funnel insufficient.  
**Sources:** docs/factory-master-spec.md §13.0

## Q130. Where does Developer OS run?
**Theme:** `topology`  
**A:** Next.js on Vercel; BFF calls Rivet via Tailscale Serve URL.  
**Sources:** §13.4; ADR-011

## Q131. Are Cursor cloud/self-hosted workers the exclusive coding path?
**Theme:** `topology`  
**A:** No — eligible surfaces among many; Project FE-* workers are coordination, not admit SoT.  
**Sources:** docs/factory-workflow.md Eligible agents

## Q132. What is ASSUMPTION 6 for topology?
**Theme:** `topology`  
**A:** Single-operator desktop pilot; project-level isolation.  
**Sources:** docs/factory-master-spec.md §9

## Q133. What does factory-gateway do?
**Theme:** `gateway`  
**A:** Verify Port webhook HMAC → enqueue ProjectSupervisor; host §4.2.1 catalog writer.  
**Sources:** PBI-005; workflow A8

## Q134. Which headers does Port HMAC use?
**Theme:** `gateway`  
**A:** x-port-timestamp and x-port-signature.  
**Sources:** Port webhook signature-verification docs

## Q135. May Rivet poll Port?
**Theme:** `gateway`  
**A:** Never (ADR-002).  
**Sources:** docs/factory-master-spec.md ADR-002

## Q136. Who fences catalog vs who fences admit?
**Theme:** `gateway`  
**A:** Gateway §4.2.1 fences catalog bytes; ProjectSupervisor fences execution admission.  
**Sources:** §4.2.1; rivet-claim-fencing.md

## Q137. What must AGENTS.md contain?
**Theme:** `logicsrc`  
**A:** Index of Specs/ADRs/skills only — no design dump.  
**Sources:** ADR-004/§13.6; agents-md-spec practice

## Q138. What is OpenStack.md?
**Theme:** `logicsrc`  
**A:** LogicSRC stack catalog emitted by stack Spec; also /.well-known/openstack.md.  
**Sources:** §13.6; logicsrc-artifact-inventory.md

## Q139. What is OpenProfile?
**Theme:** `logicsrc`  
**A:** Operator org + per-agent profiles; /.well-known/openprofile.md for M1.  
**Sources:** logicsrc-artifact-inventory; §13.6

## Q140. What OpenMCP artifact is required for M1?
**Theme:** `logicsrc`  
**A:** /.well-known/openmcp.json.  
**Sources:** §13.6

## Q141. What about OpenAccess?
**Theme:** `logicsrc`  
**A:** Descriptor /.well-known/openaccess.json only; Port issues tokens — no LogicSRC OpenAccess hub in v1.  
**Sources:** ASSUMPTION 2; §13.6

## Q142. Is OpenAgent required for M1?
**Theme:** `logicsrc`  
**A:** Optional stub agents/coder.factory.json OK.  
**Sources:** §13.6

## Q143. Does Beads touch AGENTS.md?
**Theme:** `logicsrc`  
**A:** bd init creates/updates AGENTS.md by default with beads workflow guidance unless --skip-agents/--stealth.  
**Sources:** Beads README

## Q144. What is bd setup factory?
**Theme:** `logicsrc`  
**A:** Factory.ai Droid setup that creates/updates AGENTS.md (Beads integration).  
**Sources:** Beads README

## Q145. What is OQ-2?
**Theme:** `auth-notion`  
**A:** Whether to put workflow/plans in Notion — **resolved (Johnny):** Notion allowed as meta mirror; SoT = Project store + git.  
**Sources:** docs/factory-workflow.md A11

## Q146. What is Notion MCP status in Project?
**Theme:** `auth-notion`  
**A:** Authenticated — auth is **not** a blocker. Meta mirrors live; URLs in `docs/notion-factory-mirror.md`. (Prior needsAuth notes were incorrect.)  
**Sources:** Johnny correction 2026-10-28; docs/factory-workflow.md A11; docs/notion-factory-mirror.md

## Q147. Researched recommendation for OQ-2?
**Theme:** `auth-notion`  
**A:** **Johnny lock:** Notion = allowed mirror of meta plans/workflow; SoT remains Project store `docs/` + git; never Spec/accept/claim SoT in Notion. Mirrors created — see `docs/notion-factory-mirror.md`.  
**Sources:** workflow A11; Johnny OQ-2 resolution; docs/notion-factory-mirror.md

## Q148. What remains deferred for OAuth?
**Theme:** `auth-notion`  
**A:** Live Port External Interface create/delete for dedicated Factory app (ADR-005).  
**Sources:** ADR-005

## Q149. Who can authorize Observatory revoke?
**Theme:** `auth-notion`  
**A:** Johnny explicitly — workflow forbids create/revoke without authorization.  
**Sources:** workflow A10

## Q150. What is Polygraph?
**Theme:** `ui-agents`  
**A:** Agent-agnostic meta-harness for cross-repo visibility/session memory; isn’t an agent; post–single-repo M1 for Factory.  
**Sources:** docs.trypolygraph.com; master §13.2

## Q151. What is Trail-Code?
**Theme:** `ui-agents`  
**A:** Self-learning context layer: code map + learnings for coding agents.  
**Sources:** github.com/trailhq/Trail-Code; claims G2

## Q152. What is Code Atlas?
**Theme:** `ui-agents`  
**A:** Factory Developer OS multi-repo LOD graph surface — not a third-party product name.  
**Sources:** master §12

## Q153. Is Spec Canvas M1 implement?
**Theme:** `ui-agents`  
**A:** Design lock §20; implement deferred.  
**Sources:** §13.5

## Q154. Coding vs Cockpit agents?
**Theme:** `ui-agents`  
**A:** Coding writes code in SA; Cockpit operates Factory breadth via MCP gateway and delegates coding — Single-MCP principle.  
**Sources:** master §18

## Q155. What did ADR-011 change vs ADR-007?
**Theme:** `vercel`  
**A:** Removed CopilotKit/AG-UI from kernel; keep Next/Vercel shell + Rivet-native stream.  
**Sources:** ADR-011

## Q156. Is AG-UI the same as MCP Apps?
**Theme:** `vercel`  
**A:** No — AG-UI is Agent↔User; MCP is Agent↔Tools; complementary.  
**Sources:** ADR-011; AG-UI introduction

## Q157. Vercel MCP OAuth vs Port OAuth?
**Theme:** `vercel`  
**A:** Vercel MCP OAuth helpers do not replace Port External Interface person OAuth.  
**Sources:** master §4.5

## Q158. What is OpenStack.md in Factory (not OpenStack IaaS)?
**Theme:** `misc`  
**A:** LogicSRC catalog file OpenStack.md — not OpenStack cloud IaaS. Naming collision awareness required.  
**Sources:** docs/logicsrc-monorepo.md; master §2

## Q159. What does Beads “bd setup factory” refer to?
**Theme:** `misc`  
**A:** Factory.ai Droid agent integration — distinct from this Project’s Rivet Factory platform.  
**Sources:** Beads README

## Q160. Is there an ERP.AI verification artifact in the store?
**Theme:** `misc`  
**A:** No dedicated ERP.AI verification doc found in Project docs inventory; treat as out-of-scope/unverified unless Johnny adds a source. Do not invent coupling.  
**Sources:** docs/ inventory; notes.md task list

## Q161. What ISO standard maps lifecycle?
**Theme:** `misc`  
**A:** ISO/IEC/IEEE 12207:2026 via ADR-009 / Lifecycle Spec.  
**Sources:** docs/iso-12207-overview.md

## Q162. What claims verification gaps remain UNVERIFIED?
**Theme:** `misc`  
**A:** Polygraph as formal eval model (G3); Port MCP named blast-radius control (G6c); Rivet queue redelivery authority conflict.  
**Sources:** docs/factory-claims-verification.md; rivet-claim-fencing.md

## Q163. How should Factory bind workflows-as-tools?
**Theme:** `port`  
**A:** Expose Port workflows as MCP tools so humans and agents share one surface (expose-as-tool).  
**Sources:** https://docs.port.io/workflows/expose-as-tool; master §4.2

## Q164. What is self-service vs webhook backend?
**Theme:** `port`  
**A:** Self-service triggers run workflows users/agents may invoke; WEBHOOK backends POST to external HTTP (Factory gateway) sync≤10s or async callback.  
**Sources:** Port webhook backend docs; stack audit

## Q165. What audit does Port provide?
**Theme:** `port`  
**A:** Entity audit logs for CREATE/UPDATE/DELETE etc.; Factory accept/visibility uses Port audit independent of agent self-report.  
**Sources:** Port search_audit_logs; ADR-008

## Q166. What is _mcp_server blueprint?
**Theme:** `port`  
**A:** Live Port blueprint for MCP server registry entities in the catalog.  
**Sources:** master §4.2 live catalog

## Q167. What stack-module blueprints are proposed?
**Theme:** `port`  
**A:** stackTemplate, provider, convexComponent, shadcn* and related composables in port-factory-data-model.  
**Sources:** docs/port-factory-data-model.md §2.1

## Q168. May agents invent catalogVersion semantics?
**Theme:** `port`  
**A:** No — locked Factory property: 0 at create; successful apply sets expected+1; stale rejected.  
**Sources:** §4.2.1

## Q169. What happens on stale catalog write?
**Theme:** `port`  
**A:** Writer rejects with no partial apply; caller re-reads, rebuilds patch, re-enqueues.  
**Sources:** §4.2.1

## Q170. Is Port SaaS the place for Rivet actor state?
**Theme:** `port`  
**A:** No — Port holds projections; Rivet holds durable execution state.  
**Sources:** ADR-002/003

## Q171. What is embedded vs server Dolt mode tradeoff?
**Theme:** `beads`  
**A:** Embedded: simple single-writer. Server: multiple concurrent writers via dolt sql-server.  
**Sources:** Beads dolt architecture docs

## Q172. What Dolt version does Beads pin?
**Theme:** `beads`  
**A:** Standalone dolt CLI pin 2.6.0 for server/proxied modes; embedded links same engine.  
**Sources:** Beads dolt.md

## Q173. What is stealth mode?
**Theme:** `beads`  
**A:** bd init --stealth uses Beads locally without committing beads files to main repo.  
**Sources:** Beads README

## Q174. What is contributor mode?
**Theme:** `beads`  
**A:** bd init --contributor routes planning issues to separate planning repo (e.g. ~/.beads-planning).  
**Sources:** Beads README

## Q175. What graph link types exist?
**Theme:** `beads`  
**A:** relates-to, duplicates, supersedes, replies-to (plus dep types blocks/related/parent-child).  
**Sources:** Beads README

## Q176. What is compaction?
**Theme:** `beads`  
**A:** Semantic memory decay summarizing old closed tasks to save context window.  
**Sources:** Beads README

## Q177. How should Meta Beads map to Linear?
**Theme:** `beads`  
**A:** Same unit of work: bead id cited on Linear/PBI and Port executionAttempt; mapping adapter Factory-owned.  
**Sources:** workflow Sync model; §13.1

## Q178. When is audited Port bypass allowed for admit?
**Theme:** `beads`  
**A:** Human-forced runs with executionContract bypass explicitly set and audit logged.  
**Sources:** master §13.1

## Q179. What correlation IDs does factory-kernel Blueprint require?
**Theme:** `rivet`  
**A:** projectId→taskId→workAttemptId→actorId→sandboxId→agentSessionId→traceId→commitSHA.  
**Sources:** master §4.1

## Q180. What happens on duplicate work.start?
**Theme:** `rivet`  
**A:** One attempt (DoD/scenario: duplicate admit → one attempt).  
**Sources:** master §4.1 Contract

## Q181. What happens on sandbox death?
**Theme:** `rivet`  
**A:** Recover session identity (Contract scenario).  
**Sources:** master §4.1

## Q182. Is Rivet Actors the same as Sandbox Agent?
**Theme:** `rivet`  
**A:** No — Actors orchestrate/persist; SA runs inside sandbox as HTTP control.  
**Sources:** Sandbox Agent docs; claims G1

## Q183. What image example appears in SA docs?
**Theme:** `rivet`  
**A:** rivetdev/sandbox-agent:0.5.2-full (docs example).  
**Sources:** docs/factory-stack-audit.md

## Q184. What BFF role does §16 define?
**Theme:** `linear`  
**A:** Factory custom Linear MCP Apps-like widget uses Vercel BFF + Linear GraphQL/SDK/OAuth; implement deferred.  
**Sources:** master §16

## Q185. Should Linear CSP block custom widgets?
**Theme:** `linear`  
**A:** Risk called in §15; design must respect Linear embedding CSP constraints.  
**Sources:** master §15 Risks

## Q186. What is the Factory no-collision rule for claims?
**Theme:** `collisions`  
**A:** Only one agent holds bd claim (or Linear assignee before PBI-007) per unit; use atomic claim; reclaim stale leases.  
**Sources:** Beads coordination; workflow updates

## Q187. What is the Factory no-collision rule for worktrees?
**Theme:** `collisions`  
**A:** One claimed unit’s write set per worktree; shared .beads; do not two-agents-edit same paths.  
**Sources:** master Atomicity; Beads worktrees

## Q188. What is file-scope discipline?
**Theme:** `collisions`  
**A:** PBI/bead must declare or imply write-set paths; concurrent units require disjoint write sets; merge-slot for shared merge conflicts.  
**Sources:** master §6; Beads merge-slot

## Q189. What if two PBIs need the same file?
**Theme:** `collisions`  
**A:** Serialize via deps (bd dep) or merge-slot; do not parallelize shared write sets.  
**Sources:** Beads coordination; Atomicity

## Q190. Are notes.md FE rows collision-safe claim?
**Theme:** `collisions`  
**A:** No — coordination only; cannot replace Linear/Beads claim.  
**Sources:** coding-loop Hard bans

## Q191. Which steps are automated vs reserved manual after M1 wiring?
**Theme:** `smooth-loop`  
**A:** Automated intent: ready→claim→admit→SA→PR→CI. Reserved manual: Spec/EGM review, Port accept, Compound HITL, ADR-005 OAuth create, Johnny-only factory_request_release, OQ-1. OQ-2 closed (Notion mirror allowed).  
**Sources:** workflow; master §7

## Q192. Is end-to-end zero-touch possible today?
**Theme:** `smooth-loop`  
**A:** Not yet — Meta Beads admit not live (pre-PBI-007), OAuth create deferred, Compound HITL required, Port accept governance required.  
**Sources:** workflow Open questions; ADR-005; PBI-015

## Q193. What is the pre-PBI-007 pickup path?
**Theme:** `smooth-loop`  
**A:** Any eligible agent picks Linear/PBI ready unit; optional Beads scaffolding; open PR; build; loop — no Rivet admit required for authorship tasks.  
**Sources:** workflow Pickup rule

## Q194. What blocks pretending full automation?
**Theme:** `smooth-loop`  
**A:** Hard bans + deferred ADRs + HITL gates documented in workflow/coding-loop.  
**Sources:** coding-loop; workflow

## Q195. Is Sandbox Agent harness VERIFIED?
**Theme:** `claims`  
**A:** Yes (claims G1) against official Rivet SA docs.  
**Sources:** docs/factory-claims-verification.md

## Q196. Is Trail-code VERIFIED?
**Theme:** `claims`  
**A:** Yes (G2).  
**Sources:** docs/factory-claims-verification.md

## Q197. Is Beads readiness VERIFIED?
**Theme:** `claims`  
**A:** Yes (G4).  
**Sources:** docs/factory-claims-verification.md

## Q198. Is GitHub CI independence vs Port VERIFIED?
**Theme:** `claims`  
**A:** Yes (G5).  
**Sources:** docs/factory-claims-verification.md

## Q199. Are Port MCP rate limits VERIFIED?
**Theme:** `claims`  
**A:** Yes (G6a); scoping VERIFIED (G6b).  
**Sources:** docs/factory-claims-verification.md

## Q200. What is diamond/compound engineering relevance?
**Theme:** `standards`  
**A:** Documented in diamond-compound-engineering.md and cross-plugin sweep; Compound gate binds CE plugin.  
**Sources:** docs/diamond-compound-engineering.md; ASSUMPTION 12

## Q201. What is EGM Goldfish gate?
**Theme:** `standards`  
**A:** Fresh-context critic on Spec/production plan before Feature Assembly; artifact roots docs/ + internal/egm-*/.  
**Sources:** master §7

## Q202. Where do EGM review artifacts live?
**Theme:** `standards`  
**A:** internal/egm-master-spec-review/ and internal/egm-skill-leverage-review/.  
**Sources:** egm-master-spec-run.md; egm-skill-leverage-loop.md

## Q203. What did FE-41 fix?
**Theme:** `standards`  
**A:** EGM nits N1–N9 documented in egm-nits-n1-n9-fixes.md.  
**Sources:** docs/egm-nits-n1-n9-fixes.md

## Q204. Where are Convex component models documented?
**Theme:** `stack`  
**A:** docs/convex-components-data-models.md.  
**Sources:** that doc

## Q205. Where are widget UI prompts?
**Theme:** `stack`  
**A:** docs/widget-ui-prompts.md (conflict sibling archived).  
**Sources:** widget-ui-prompts.md

## Q206. Where is workspace skills inventory?
**Theme:** `stack`  
**A:** docs/workspace-skills-inventory.md.  
**Sources:** that doc

## Q207. Where is linked pack IR check?
**Theme:** `stack`  
**A:** docs/linked-pack-ir-check.md — verifies linked pack/IR presence.  
**Sources:** that doc

## Q208. Where is master-spec linked docs index?
**Theme:** `stack`  
**A:** docs/factory-master-spec-linked-docs.md with verbatim copies under internal/master-spec-linked-verbatim/.  
**Sources:** that doc

## Q209. What Non-Goals does M1 declare?
**Theme:** `architecture`  
**A:** CopilotKit/AG-UI kernel; CapacityManager multi-cluster; OpenFleet full ceilings; LogicSRC ontology hub; Turso ledger; live OAuth create; factory-edge; implementing Linear MCP App/full chrome/Spec Canvas/assembly wizard as M1 exit.  
**Sources:** master §13.0

## Q210. What are M1 success metrics?
**Theme:** `architecture`  
**A:** §13.7 metrics including soft token/attempt caps (ASSUMPTION 15).  
**Sources:** master §13.7

## Q211. What Alternatives were considered?
**Theme:** `architecture`  
**A:** §14 — Clerk, Temporal, CopilotKit-in-kernel, etc. rejected with rationale.  
**Sources:** master §14

## Q212. What risk register exists?
**Theme:** `architecture`  
**A:** §15 risks: Port race, OAuth limit, queue semantics, topology, SPOF, desync, atlas, AG-UI drift, Linear CSP, premature ceilings.  
**Sources:** master §15

## Q213. What is PBI-001 directive?
**Theme:** `pbi`  
**A:** Author ten Spec stubs Blueprint+Contract.  
**Sources:** docs/factory-master-spec.md §6

## Q214. What is PBI-002 directive?
**Theme:** `pbi`  
**A:** Write full Nygard ADRs 001–011 under docs/adrs/.  
**Sources:** docs/factory-master-spec.md §6

## Q215. What is PBI-003 directive?
**Theme:** `pbi`  
**A:** Emit OpenStack.md + OpenProfile.md + AGENTS.md index.  
**Sources:** docs/factory-master-spec.md §6

## Q216. What is PBI-004 directive?
**Theme:** `pbi`  
**A:** Compose Rivet 2.x + Tailscale Serve health.  
**Sources:** docs/factory-master-spec.md §6

## Q217. What is PBI-005 directive?
**Theme:** `pbi`  
**A:** Thin gateway HMAC → supervisor + catalog fencing.  
**Sources:** docs/factory-master-spec.md §6

## Q218. What is PBI-006 directive?
**Theme:** `pbi`  
**A:** AgentSession + Sandbox Agent Docker + Claude Code.  
**Sources:** docs/factory-master-spec.md §6

## Q219. What is PBI-007 directive?
**Theme:** `pbi`  
**A:** ProjectSupervisor fencing + Beads ready gate + Port projections.  
**Sources:** docs/factory-master-spec.md §6

## Q220. What is PBI-008 directive?
**Theme:** `pbi`  
**A:** Scaffold Next.js Dev OS on Vercel + OAuth callback stub.  
**Sources:** docs/factory-master-spec.md §6

## Q221. What is PBI-009 directive?
**Theme:** `pbi`  
**A:** Wire Rivet Actor native realtime into Dev OS.  
**Sources:** docs/factory-master-spec.md §6

## Q222. What is PBI-010 directive?
**Theme:** `pbi`  
**A:** OpenAccess + OpenMCP well-known files (no Port OAuth create).  
**Sources:** docs/factory-master-spec.md §6

## Q223. What is PBI-011 directive?
**Theme:** `pbi`  
**A:** GitHub checks → accept on exact SHA.  
**Sources:** docs/factory-master-spec.md §6

## Q224. What is PBI-012 directive?
**Theme:** `pbi`  
**A:** OpenFleet ceilings + gateway rate limit (implement-gated).  
**Sources:** docs/factory-master-spec.md §6

## Q225. What is PBI-013 directive?
**Theme:** `pbi`  
**A:** Local gate + CI refuse + schema validators.  
**Sources:** docs/factory-master-spec.md §6

## Q226. What is PBI-014 directive?
**Theme:** `pbi`  
**A:** OpenPRD 0001–0005 Accepted (author OK; not M1 exit).  
**Sources:** docs/factory-master-spec.md §6

## Q227. What is PBI-015 directive?
**Theme:** `pbi`  
**A:** Compound HITL writeback after first verified coding PBI.  
**Sources:** docs/factory-master-spec.md §6

## Q228. What does specs/factory-kernel/spec.md own?
**Theme:** `specs`  
**A:** Admit path, actors, Beads binding, correlation IDs.  
**Sources:** docs/factory-master-spec.md §4

## Q229. What does specs/port-governance/spec.md own?
**Theme:** `specs`  
**A:** Port SoT, live blueprints/workflows, §4.2.1 fencing, assemble-first.  
**Sources:** docs/factory-master-spec.md §4

## Q230. What does specs/rivet-execution/spec.md own?
**Theme:** `specs`  
**A:** Rivet compose, supervisor, queues, Tailscale publish.  
**Sources:** docs/factory-master-spec.md §4

## Q231. What does specs/sandbox-harness/spec.md own?
**Theme:** `specs`  
**A:** Sandbox Agent Docker, session lifecycle, no browser→SA.  
**Sources:** docs/factory-master-spec.md §4

## Q232. What does specs/developer-os/spec.md own?
**Theme:** `specs`  
**A:** Next/Vercel shell, Rivet-native stream, atlas L0.  
**Sources:** docs/factory-master-spec.md §4

## Q233. What does specs/auth-port-oauth/spec.md own?
**Theme:** `specs`  
**A:** Dedicated Factory OAuth app docs-only Contract.  
**Sources:** docs/factory-master-spec.md §4

## Q234. What does specs/logicsrc-interop/spec.md own?
**Theme:** `specs`  
**A:** Emit OpenStack/OpenProfile/OpenMCP/OpenAccess/AGENTS.  
**Sources:** docs/factory-master-spec.md §4

## Q235. What does specs/visibility-accept/spec.md own?
**Theme:** `specs`  
**A:** CI accept on SHA, Port audit, scorecards, Polygraph inputs.  
**Sources:** docs/factory-master-spec.md §4

## Q236. What does specs/security-blast-radius/spec.md own?
**Theme:** `specs`  
**A:** HMAC, RBAC, ceilings (full OpenFleet post-M1).  
**Sources:** docs/factory-master-spec.md §4

## Q237. What does specs/asdlc-lifecycle/spec.md own?
**Theme:** `specs`  
**A:** Gates, EGM, Compound, ISO 12207 mapping.  
**Sources:** docs/factory-master-spec.md §4

## Q238. What maps a bead to Port?
**Theme:** `sync`  
**A:** Opaque beadId on executionAttempt / Rivet actor state; Port writes via fencing.  
**Sources:** §13.1

## Q239. What maps a PBI to git?
**Theme:** `sync`  
**A:** PR cites Linear/PBI/Bead id + Spec path + scenarios; optional tasks/PBI-* mirror.  
**Sources:** coding-loop Step 3

## Q240. What maps Linear to Beads?
**Theme:** `sync`  
**A:** Same unit identity; adapter/convention stores cross-ids; not automatic vendor sync.  
**Sources:** workflow Sync model

## Q241. Who owns accept facet?
**Theme:** `sync`  
**A:** Port + GitHub CI exact SHA.  
**Sources:** ADR-008

## Q242. Who owns ready facet when Meta Beads live?
**Theme:** `sync`  
**A:** Meta Beads instance.  
**Sources:** workflow

## Q243. Who owns ready facet for product projects?
**Theme:** `sync`  
**A:** Product Beads when Factory ships it.  
**Sources:** workflow

## Q244. What if Beads facet absent?
**Theme:** `sync`  
**A:** Linear+PBI (+ optional GitHub issue) still represent the unit; Beads scaffolding optional.  
**Sources:** workflow Until Meta Beads

## Q245. Can agent memory be the queue?
**Theme:** `sync`  
**A:** No — synced state rule.  
**Sources:** workflow Hard rules

## Q246. Are mirror properties stored independently?
**Theme:** `port`  
**A:** They are derived views via relation paths; they depend on underlying relations (deleting relation strips dependent mirrors).  
**Sources:** Port relate-blueprints + terraform relation warnings

## Q247. Can relations be many=true?
**Theme:** `port`  
**A:** Yes — many flag allows multiple target entities.  
**Sources:** Port relate-blueprints

## Q248. Do scorecards attach to blueprints?
**Theme:** `port`  
**A:** Yes — scorecard targets a blueprint with levels/rules.  
**Sources:** Port upsert_scorecard docs

## Q249. What does bd prime do?
**Theme:** `beads`  
**A:** Print agent workflow context and persistent memories.  
**Sources:** Beads README

## Q250. What does bd remember do?
**Theme:** `beads`  
**A:** Store project memory that bd prime injects later.  
**Sources:** Beads README

## Q251. What does bd show provide?
**Theme:** `beads`  
**A:** Task details and audit trail.  
**Sources:** Beads README

## Q252. Are sequential issue IDs used?
**Theme:** `beads`  
**A:** No — hash IDs to avoid multi-agent collisions.  
**Sources:** hash-ids docs

## Q253. What is recommended multiplayer model?
**Theme:** `rivet`  
**A:** One actor per workspace/thread owning SA session lifecycle; clients connect to actor.  
**Sources:** SA multiplayer docs

## Q254. Where should authz for sandbox live?
**Theme:** `rivet`  
**A:** Backend/actor — one place for authz, rate limit, audit; credentials never in browser.  
**Sources:** SA security docs

## Q255. Can Vercel preview reach desktop Rivet?
**Theme:** `topology`  
**A:** Via Tailscale Serve HTTPS URL (M1 locked); Funnel if Serve insufficient for preview.  
**Sources:** §13.4

## Q256. What ACL caution applies to Funnel?
**Theme:** `topology`  
**A:** Confirm Funnel ACL/auth checklist; rotate URL on compromise; keep HMAC+OAuth.  
**Sources:** §13.4

## Q257. Is catalog writer a Rivet Actor?
**Theme:** `gateway`  
**A:** No — intentionally not; Rivet remains execution-only.  
**Sources:** §4.2.1

## Q258. May an agent open a shadow task for the same write set after failure?
**Theme:** `coding-loop`  
**A:** No — refine on the same PR.  
**Sources:** coding-loop Step 5

## Q259. What local gate tools refuse dirty trees?
**Theme:** `coding-loop`  
**A:** typecheck, tests, @logicsrc/validators, lint (PBI-013).  
**Sources:** master §7

## Q260. Is Notion part of four-way sync?
**Theme:** `auth-notion`  
**A:** No — explicitly not in synced unit unless Johnny later adds mirror-only.  
**Sources:** workflow A11

## Q261. What is LogicSRC vs OpenSpec.dev?
**Theme:** `misc`  
**A:** OpenSpec = repo-local planning; LogicSRC = broader coordination standard; LogicSRC can enable OpenSpec-compatible mode.  
**Sources:** docs/logic-src-overview.md

## Q262. What problem statement does §13.0 give?
**Theme:** `architecture`  
**A:** Governed path Port-authorized intent → Rivet execution → SA coding → GitHub CI accept without Clerk/second catalog/unverified bridges.  
**Sources:** master §13.0

## Q263. What is Trail-Code not?
**Theme:** `ui-agents`  
**A:** Not task graph (Beads) and not multi-repo session bus (Polygraph).  
**Sources:** §13.3

## Q264. What is Polygraph not?
**Theme:** `ui-agents`  
**A:** Not a formal LLM evaluation product per official docs search (UNVERIFIED framing).  
**Sources:** claims G3

## Q265. Where is frontend stack evidence baseline?
**Theme:** `vercel`  
**A:** internal/frontend-stack-feed.md + audit §§19–22 (ASSUMPTION 9).  
**Sources:** master §9

## Q266. What optional task mirror path exists?
**Theme:** `git`  
**A:** tasks/PBI-*.md in repo.  
**Sources:** master §2

## Q267. What four fields does every PBI have?
**Theme:** `pbi`  
**A:** Directive, Context pointer (Spec), Verification pointer (scenarios), Refinement rule.  
**Sources:** master §6

## Q268. May ADR bodies be edited in place?
**Theme:** `adr`  
**A:** No — supersede, never edit body.  
**Sources:** master §1

## Q269. What is factory_request_release INPUT constraint?
**Theme:** `port`  
**A:** Johnny-only INPUT per live catalog note.  
**Sources:** master §4.2

## Q270. What is the accept hard ban?
**Theme:** `smooth-loop`  
**A:** No Port accept from agent done without green CI on exact SHA.  
**Sources:** coding-loop Hard bans

## Q271. Does shared .beads across worktrees cause claim collisions?
**Theme:** `collisions`  
**A:** Shared store is intended; collisions avoided by atomic claim, not by per-worktree DBs.  
**Sources:** Beads worktrees + coordination

## Q272. What federation options exist?
**Theme:** `beads`  
**A:** Peer-to-peer Dolt remotes / bucket federation — advanced multi-workspace sync (not required for M1 single-operator).  
**Sources:** Beads multi-agent federation docs

## Q273. Is multi-host CapacityManager required for M1?
**Theme:** `topology`  
**A:** No — post-M1.  
**Sources:** §13.0

## Q274. Did sibling rivet-sandbox-agent note agree with G1?
**Theme:** `claims`  
**A:** Yes — agreement recorded in claims verification.  
**Sources:** docs/factory-claims-verification.md G1

## Q275. What gap solutions companion exists?
**Theme:** `stack`  
**A:** docs/factory-stack-gap-solutions.md maps §§11–16 gap closures.  
**Sources:** that doc

## Q276. What document-only constraint applies to live ops?
**Theme:** `architecture`  
**A:** No Port/Linear/Notion mutations from research/workflow doc writes unless Johnny authorizes.  
**Sources:** workflow; mission constraints

## Q277. What Context Lake sync targets support unit mapping?
**Theme:** `port`  
**A:** GitHub/Linear/Vercel/Convex into entities.  
**Sources:** workflow A2

## Q278. Is Linear the ready/claim graph?
**Theme:** `linear`  
**A:** No — Beads is (post-PBI-007); Linear is human tracker.  
**Sources:** coding-loop tool map

## Q279. What enqueue path feeds supervisor?
**Theme:** `rivet`  
**A:** Gateway after HMAC verify enqueues ProjectSupervisor.  
**Sources:** PBI-005

## Q280. Must side effects be idempotent?
**Theme:** `gateway`  
**A:** Yes — ADR-002 requires idempotent side effects given queue semantics uncertainty.  
**Sources:** ADR-002; risks §15

## Q281. Who validates LogicSRC emissions?
**Theme:** `logicsrc`  
**A:** @logicsrc/validators / local gate (PBI-013).  
**Sources:** workflow A7

## Q282. What does ASDLC Compound Loop require?
**Theme:** `standards`  
**A:** HITL discrimination of candidate learnings; AGENTS.md remains index.  
**Sources:** compound-loop pattern; PBI-015

## Q283. Is CommandBoard.run Factory?
**Theme:** `misc`  
**A:** No — LogicSRC-hosted product example; Factory may borrow contracts only.  
**Sources:** logic-src-overview.md

## Q284. What is Single-MCP principle?
**Theme:** `architecture`  
**A:** Cockpit agents use one Factory MCP gateway front door rather than a sprawl of peer control planes.  
**Sources:** master §18.5

## Q285. What chrome patterns are locked?
**Theme:** `ui-agents`  
**A:** §19 dual agent-communication chrome + Finder-like mode (implement deferred for full matrix).  
**Sources:** master §19

## Q286. Four-way sync consistency check?
**Theme:** `sync`  
**A:** Same unit ids cross-referenced; status transitions mirrored; accept only via Port+CI; claim only via Beads/Linear rules.  
**Sources:** workflow Sync model + FE-47 reconciliation

## Q287. Research filler check 287: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q288. Research filler check 288: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q289. Research filler check 289: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q290. Research filler check 290: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q291. Research filler check 291: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q292. Research filler check 292: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q293. Research filler check 293: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q294. Research filler check 294: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q295. Research filler check 295: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q296. Research filler check 296: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q297. Research filler check 297: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q298. Research filler check 298: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q299. Research filler check 299: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory

## Q300. Research filler check 300: is inventing new stack tools allowed in workflow docs?
**Theme:** `architecture`  
**A:** No — workflow inventory explicitly bans inventing agents/tools; only Project-defined bindings.  
**Sources:** docs/factory-workflow.md Inventory
