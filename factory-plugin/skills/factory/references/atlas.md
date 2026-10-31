# Code Atlas — the multi-repo zoomable graph

Code Atlas is a **Developer OS surface** (not a third-party product) that renders the codebase
as one full-bleed, zoomable graph with three overlaid systems (master spec §12.1).

## The three overlays — spec truth (master spec §12.1, §13.1–13.3)

| Layer | System | Graph meaning | M1 status |
|---|---|---|---|
| Code structure | **Trail-Code** (ex-**Graft**) | Per-repo functions, symbols, callers — "what a change can break" | **M1 authoritative** (§12.2) |
| Task readiness | **Beads** | Dependency-aware issue graph: `bd ready` → claim → close; ready/blocked accents on nodes | M1 (§13.1) |
| Multi-repo session/PR edges | **Polygraph** | Cross-repo agent sessions, PR/CI coordination, session memory | **Post-M1** — activates at ≥2 repos per delivery run (§13.2) |

Locked clarifications (these kill recurring confusions):

- **Graft is Trail-Code's former name, not a fourth system** (§13.3; §12.1 "Trail-Code
  (Graft)"). Trail-Code is a self-learning context layer: code map + learnings. It is not the
  task graph (Beads) and not the session bus (Polygraph).
- **Polygraph is not an agent and not an LLM-eval product** (§13.2). "Polygraph isn't an
  agent" — it is an agent-agnostic meta-harness for cross-repo visibility, session memory, and
  PR/CI coordination. The eval framing is explicitly UNVERIFIED; ADR-008's "Polygraph evals"
  means Factory visibility inputs from Polygraph session/review artifacts, plus Port scorecards
  and Rivet traces.
- **Langfuse is not a spec overlay.** It appears in the *shipped code's* overlay enum (below)
  but has no layer in §12.1. Per §0 the master spec wins: the Atlas overlay set is Trail-Code +
  Beads + Polygraph.

## Ownership and the hard rule (§12.5)

Index + API + UI are owned by the `developer-os` Spec (§4.5); ready-overlay semantics by the
Beads contract (§13.1); cross-repo edge truth by the Polygraph contract (§13.2); accept by
`visibility-accept`. **Atlas never accepts.** It is read-only display: auth is the Port
External Interface session (ADR-005), and every mutation stays in Port/Linear/Beads tools
(§12.3 step 5).

## Data pipeline and serving (spec, §12.3–12.4)

1. **Index** (async workers, never the browser): M1 runs Trail-Code per single indexed repo,
   emitting JSONL `{repo, symbolId, kind, path, range, callers[]}`. Infigraph / Code-Graph-RAG
   enrichment is post-M1 (§12.2).
2. **Multi-repo edges**: post-M1, from Polygraph session graph —
   `{fromRepo, toRepo, kind: session|pr|ci, sessionId}`.
3. **Task overlay**: Beads → nodes `{beadId, status, blockers[]}` linked to repo paths via
   issue metadata (convention: Beads description cites `repo:path` or the Port
   `executionContract` id).
4. **Serving API**: `GET /api/atlas/subgraph?level=org|repo|package|symbol&focus=&depth=`
   returns a viewport-capped graph — **max 2,000 nodes at M1** — as `{nodes, edges, levels}`.
   No full-monorepo dump to the client.
5. **Zoom (LOD)**: L0 org → L1 repo → L2 package → L3 symbol. Interaction is
   **expand-in-place, locked** (§12.4): clicking a node expands it inline like a file-tree
   folder while the graph stays visible; it must not take over the screen, open a detail page,
   navigate the shell away, or use a modal/drawer as the primary expand path. URL state
   `?atlasFocus=` restores expand state without route takeover. Edges: solid = intra-repo,
   dashed = cross-repo. The frosted MCP widget dock (Vercel, Convex, Docker, Port, Turso,
   GitHub + second row) stays visible under the graph.
6. **DoD** (§12.4): L0 for ≥1 indexed repo paints a skeleton in ≤2s; expand to L3 loads via
   `/api/atlas/subgraph` with no full reload; Beads toggle shows the ready count from
   `bd ready` JSON. Canonical visual target: `media/code-atlas-mockup.png` — locked, implement
   to match, do not redesign.

## Live state — what is actually shipped (LIVE-VERIFIED 2026-10-30, fragments D1–D10, A8)

- **Fixture-only today.** Dev OS's Atlas renders `createFixtureAtlasGraph()` — an 8-node graph
  frozen 2026-10-29 — by default on every `atlas.*` call. There is **no live bind**: no Port
  catalog client exists in Dev OS (only `src/lib/port-oauth.ts`), and the
  `factory_port_access_token` cookie set by the OAuth callback is read nowhere (fragment C9/D8).
- **Render contract (code)**: node type requires 7 fields; kind strings are open; the shipped
  overlay enum is **closed: `beads | polygraph | graft | langfuse`**. Tools surface:
  `find_node`, `expand_dependencies`, `get_task_impact`, `get_related_sessions`,
  `get_agent_traces`. `/api/atlas/subgraph` runs a redact-first BFS with the 2,000-node cap;
  role defaults to anonymous and `operator` is self-asserted with no auth check (fragment D3 —
  a known hole vs the §12.3 step-5 auth design).
- **Overlay reality check**: no overlay feeds Atlas live data. Beads does have a real adapter
  (STL-195's `BdMetaBeads`) — but it feeds **ProjectSupervisor admit, not Atlas**; Atlas's two
  Beads nodes are hard-coded fixture entries (`factory-stl154`/`factory-stl151`, ids that do
  not exist in the real Beads store), and the live Beads DAG has **zero dependency edges**
  (fragment D4). Polygraph has no PR node and no client in the codebase. Graft/Trail-Code has
  no client. Langfuse has zero SDK imports or env vars anywhere — mockups that show it live
  are false (fragments D4–D7).
- **Workflow direction**: Port's `atlas_*` workflows call *into* Dev OS (`POST
  /api/atlas/tools`) — Port → Dev OS, not the reverse (fragment A8).

## Conflicts — stated, with the winner

1. **Overlay set**: shipped code enum = beads|polygraph|**graft**|**langfuse** — and the
   repo's own derived `specs/developer-os/spec.md` (§18) carries the same four values — vs
   master spec §12.1 = Trail-Code + Beads + Polygraph. **Winner: the master spec** (§0
   authority rule: derived specs and code reconcile to master, never the reverse). The
   four-value set is drift wherever it appears: `graft` is Trail-Code's old name (§13.3 calls
   Trail-Code's map "ex-Graft"; repo evidence alone leaves the rename unproven — fragment D6 —
   but the master spec settles it), and `langfuse` has no §12 layer.
2. **Source model**: Notion's architecture notes describe Atlas as a read-only projection fed
   by Beads/Polygraph/Graft/Langfuse with Port entering only via auth + contract-ID join +
   tool-name map; Johnny's framing and §12 describe Atlas rendering the Port catalog map and
   everything behind Port. **Winner: the master spec** (§12.3 pipeline: Trail-Code index +
   Beads overlay + Port session auth; Port catalog truth reaches Atlas through the governed
   surfaces). The live-bind design decision itself (per-request user OAuth passthrough vs
   gateway-routed reads) is **open and Johnny-gated — GAP**, not settled by any source
   (fragments D8/D9).
3. **Tracker state**: Linear marks the Atlas issues (STL-154 et al.) Done while Meta Beads
   holds the corresponding beads (factory-dtm/factory-cvl/factory-r9f) open (fragment D10).
   Per §0.1 they are the same units — this is facet drift to flag, and per OQ-1 Linear is the
   admit/claim SoT until PBI-007 while Beads owns ready/claim facets. Neither "Done"
   overrides the fixture reality above: Atlas does not serve live data today.

## The live-bind gap, precisely (GAP)

Atlas becomes real when: (a) a live source replaces the fixture graph behind the same render
contract; (b) the credential model for live reads is decided (Johnny's call); (c) the
developer-os Spec scenarios move from fixture-given to live bind (spec amendments are
master-first and Johnny-gated); (d) the `operator` role assertion hole in the subgraph route
is closed. Until then, treat every Atlas screenshot or demo as a fixture rendering.
