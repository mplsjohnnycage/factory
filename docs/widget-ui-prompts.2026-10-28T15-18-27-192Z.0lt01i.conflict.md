# Factory cockpit — MCP App widget UI prompts

Paste-ready Claude Design prompts for Developer OS integration widgets. Each widget is an **MCP App**: sandboxed HTML UI (`ui://` resource) plus MCP tool declarations; the host renders the view in an iframe and bridges tool calls via AppBridge / `postMessage`. Aesthetic lock from `factory-master-spec.md` §4.5 / §12.1.1 and the canonical mockup [`media/code-atlas-mockup.png`](../media/code-atlas-mockup.png): frosted-glass, content-forward, minimal chrome; Code Atlas hero + frosted dock.

**Inventory source:** Primary dock **Vercel, Convex, Docker, Port, Turso, GitHub** (+ second-row peers e.g. Linear) — `factory-master-spec.md` §4.5 / §12.1.1. Extended surfaces from `factory-master-spec.md` / `factory-stack-audit.md`: Tailscale Serve, Rivet actors/queues, Polygraph visibility, Beads readiness, Trail-Code map, deferred AG-UI/CopilotKit, ChatGPT Plugins reference, OmniRoute LLM gateway, ISO 12207 lifecycle, Port Context Lake, agent/skill registries, Sandbox Agent sessions, OpenFleet ceilings, Langfuse traces, Factory MCP / OpenMCP gateway.

## Index

| Widget | Role |
|--------|------|
| [Code Atlas](#code-atlas) | Hero — cross-repo symbol graph + frosted dock shell |
| [Linear](#linear) | Task manager — issues, projects, cycles (dock second row) |
| [Vercel](#vercel) | Deployments — preview / production (dock) |
| [Convex](#convex) | Database — tables, docs, functions (dock) |
| [Port](#port) | Catalog — blueprints, entities, workflows (dock) |
| [Docker](#docker) | Containers — Sandbox Agent / runtime (dock) |
| [Turso](#turso) | libSQL / databases — groups, SQL read (dock) |
| [GitHub](#github) | Repos / PRs — checks, SHA accept (dock) |
| [Tailscale](#tailscale) | Tailnet Serve — private HTTPS to localhost backends |
| [Rivet](#rivet) | Actors / queues / ProjectSupervisor dashboard |
| [Polygraph](#polygraph) | Multi-repo sessions, reviews, scorecard hints |
| [Beads](#beads) | Task readiness — ready / claim / dependency graph |
| [Trailcode](#trailcode) | Code map — symbols, callers, learnings |
| [AG-UI / CopilotKit](#ag-ui--copilotkit) | Deferred Agent↔User stream + generative UI |
| [ChatGPT Plugins](#chatgpt-plugins) | Skills + MCP + optional UI packaging reference |
| [OmniRoute](#omniroute) | LLM gateway — providers, fallback, usage |
| [ISO 12207](#iso-12207) | Lifecycle process map ↔ Factory Spec ownership |
| [Context Lake](#context-lake) | Port semantic catalog — ingest, entities, search |
| [Agent registry](#agent-registry) | Port AI agents, bots, MCP servers, readiness |
| [Skill registry](#skill-registry) | Port skills + agentPlugin bundles |
| [Sandbox Agent](#sandbox-agent) | In-sandbox harness sessions (Rivet-owned) |
| [OpenFleet](#openfleet) | Blast-radius ceilings — budget, depth, fan-out |
| [Langfuse](#langfuse) | Observability — traces, prompts, eval scores |
| [Factory MCP Gateway](#factory-mcp-gateway) | Single-MCP control surface / OpenMCP well-known |

---

## Code Atlas

```
Design the Factory Developer OS Code Atlas hero — the primary full-bleed surface of the cockpit — matching the locked visual target media/code-atlas-mockup.png (factory-master-spec.md §12).

Context: This is the Developer OS atlas composition (not a third-party product). The graph is served by Factory atlas APIs (Trail-Code symbol edges + Polygraph cross-repo edges + Beads readiness overlay). MCP App widgets sit in a frosted dock under the graph; individual dock widgets are separate prompts (Vercel, Convex, Docker, Port, Turso, GitHub, Linear). Deliver a high-fidelity UI mock of the full first viewport: graph plane + dock chrome.

Visual direction — locked to the mockup:
- Soft light atmospheric field (desaturated cool neutrals / soft mesh) behind a full-bleed symbol graph — not flat white, not dark mode, not purple/indigo glow.
- Frosted-glass chrome only where needed (dock, quiet HUD). Content-forward: the graph is the composition.
- Repo clusters clearly grouped and labeled: web-app, api-service, shared-lib (additional clusters allowed).
- Nodes: compact frosted pills/rects with a short accent color bar on the leading edge (repo or kind cue). No floating promo badges/stickers on the graph.
- Edges: SOLID lines = intra-repo call/dependency edges; DASHED lines = cross-repo edges (shared-lib imports, Polygraph session/PR links). Edge contrast must read at a glance.
- Typography: refined modern UI sans for cluster labels and HUD; mono only for symbol paths / ids if shown.
- Motion (2–3 only): gentle cluster settle on load, expand-in-place open/close, dock sheet soft enter. No glow pulses, no particle noise.

Layout (first viewport = one composition):
1. Full-bleed graph plane as the hero — edge to edge; no inset media card, no side-panel hero, no card grid of stats.
2. Quiet HUD corners only if needed (search, LOD/level indicator, Beads overlay toggle) — never competing with the brand/composition.
3. Bottom frosted MCP App dock: translucent blurred strip with hairline border. Primary row icons/labels: Vercel | Convex | Docker | Port | Turso | GitHub. Quiet second row for additional widgets (e.g. Linear). Dock stays visible while the graph is used.
4. No dashboard chrome, no multi-column marketing blocks in the first viewport.

Interaction — expand-in-place (HARD LOCK):
- Clicking a node MUST expand like a file-tree folder: child symbols / package contents open INLINE within or immediately adjacent to that node.
- The surrounding graph MUST remain visible and mounted; layout may gently reflow around the expanded node.
- MUST NOT navigate away, replace the hero with a detail route, take over the screen, or use a modal/drawer that covers the graph as the primary expand path.
- Collapse restores the prior footprint. Multiple expands may coexist when space allows (tree-folder semantics).
- Optional quiet inspector strip may mirror metadata for the focused node WITHOUT hiding the graph.
- Deep link / URL state restores the same expand-in-place path — still no route takeover.

Data / affordances to show in the mock:
- Cluster labels web-app / api-service / shared-lib
- Mix of solid and dashed edges
- Accent bars on nodes
- One node shown mid-expand (inline children visible) to demonstrate the interaction
- Frosted dock with Vercel, Convex, Docker, Port, Turso, GitHub (+ second row)

Constraints: Read-only atlas display. No Port mutations. No emoji. No purple theme. Match media/code-atlas-mockup.png. Deliver desktop + narrow-width compositions ready to implement.
```

---

## Linear

```
Design a Factory Developer OS MCP App widget for Linear as the task manager.

Context: This is an MCP App (SEP-1865 pattern). The deliverable is a sandboxed HTML UI view that a host embeds in an iframe; the same MCP server also declares tools the UI invokes through the host AppBridge (postMessage). Progressive enhancement: tools still work as text if the host has no UI. Package as HTML + CSS (+ light JS) suitable for a ui:// resource, with a short list of tool declarations the view calls.

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted glass panel (backdrop blur, soft white/light-neutral fill at ~60–80% opacity) over a soft desaturated atmospheric background (subtle cool gray-blue gradient or soft mesh — not flat white, not dark mode, not purple glow).
- Generous rounded corners (≈16–20px), thin hairline border with slight light edge, soft single-layer ambient shadow.
- Minimal chrome: no heavy title bars, no sidebar nav chrome, no card stacks, no floating badges/stickers overlaying content. Content-forward: data and controls are the UI.
- Typography: refined SF-like system UI (or Inter as stand-in only if needed) — clear hierarchy, ample whitespace, quiet secondary labels.
- Motion: 2–3 subtle motions only (sheet enter fade/slide, row hover lift, status pill soft crossfade). No noise, no glow pulses.

Layout (single compact widget sheet, ~420–480px wide, ~560px tall, mobile-friendly stack):
1. Quiet header: “Linear” wordmark-weight label + team/workspace name; optional cycle name as secondary text. Tiny connection status dot.
2. Filter row (minimal): segmented control or quiet chips — Mine / Team / Cycle; search field for issue title/id.
3. Issue list (primary content): scrollable rows — identifier (e.g. FE-33), title, status pill (Backlog / Todo / In Progress / Done), assignee avatar initials, priority glyph. Selected row expands inline (not a modal) to show description excerpt + latest comment snippet.
4. Detail strip when an issue is selected: status dropdown, assignee, project, labels as quiet tags.
5. Footer actions (text/icon buttons, not heavy cards): New issue, Refresh, Open in Linear (external).

Data displayed:
- Workspace / team / active cycle
- Issue id, title, status, priority, assignee, project, labels
- Comment count or latest comment preview
- Empty and loading states that stay frosted and calm

Core controls (wire to MCP tools conceptually):
- list_issues / get_issue — populate list and detail
- save_issue — create/update title, status, assignee, project
- list_issue_statuses / list_projects / list_teams — drive dropdowns
- list_comments / save_comment — show and append comment
- list_cycles — cycle filter

Constraints: Read-first presentation; mutations only through declared tools (no fake admin panels). No Port branding inside this widget. No emoji. No purple-on-white theme. Produce a polished high-fidelity UI mock (desktop + narrow width) ready to implement as MCP App HTML UI.
```

---

## Vercel

```
Design a Factory Developer OS MCP App widget for Vercel deployments.

Context: This is an MCP App (SEP-1865 pattern). Deliver a sandboxed HTML UI for iframe embedding, plus MCP tool declarations the view invokes via host AppBridge / postMessage. Progressive enhancement: tools remain usable without UI. Target HTML + CSS (+ light JS) as a ui:// resource for the Factory cockpit Integrations surface.

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted glass panel with backdrop blur and soft light fill; rounded corners (~16–20px); hairline border; soft ambient shadow.
- Minimal chrome, content-forward. No inset media cards, no promo badges, no multi-layer neon shadows. Quiet atmospheric background behind the sheet (soft slate/sky gradient), not flat single color.
- Typography: clean modern UI sans with strong hierarchy; monospaced micro-labels only for deployment ids / URLs.
- Motion: sheet entrance, deployment row status pulse (subtle), promote confirmation fade — restrained.

Layout (~440–500px wide sheet):
1. Header: “Vercel” + project name; environment segmented control — Preview | Production.
2. Current deployment hero strip (still content, not a card stack): status (Building / Ready / Error / Canceled), unique deployment URL, git branch + short SHA, relative time.
3. Deployment list: chronological rows — status glyph, commit message truncated, branch, SHA (7 chars), age; selected row highlights with frosted inset.
4. Actions for selected deployment: Open URL, Copy URL, View logs (opens log panel sliding within sheet), Promote to production (confirm inline), Redeploy.
5. Compact log panel (collapsible): streaming-style log lines in muted mono, auto-scroll toggle.

Data displayed:
- Project / team name
- Environment (preview vs production)
- Deployment status, URL (*.vercel.app), branch, SHA, commit message, createdAt
- Build duration or relative age
- Recent log tail when opened

Core controls (map to Vercel MCP / platform tools conceptually):
- list_deployments / get_deployment — list and detail
- list_deployment_events / get_runtime_logs — logs panel
- create_deployment / request_promote — redeploy / promote
- list_projects — project switcher if space allows
- cancel_deployment — when Building

Constraints: Privileged production promote must show a clear confirm step. Do not invent Port OAuth UI here. No dark-mode default, no purple gradients, no emoji. High-fidelity frosted MCP App widget mock for desktop and narrow widths.
```

---

## Convex

```
Design a Factory Developer OS MCP App widget for Convex as the Factory database surface.

Context: MCP App pattern — HTML UI resource served by an MCP server, rendered in a sandboxed iframe by the Developer OS host; tools declared alongside the UI and called through AppBridge / postMessage. Progressive enhancement required. Output HTML-ready frosted widget UI plus the tool surface the view expects.

Visual direction — frosted-glass Apple-like:
- Translucent blurred sheet, rounded corners, hairline border, soft shadow, content-forward.
- Atmosphere: soft cool neutrals behind the glass; avoid flat white, cream-terracotta, and purple/indigo AI clichés.
- Minimal chrome; no dashboard of competing cards. One job: inspect Convex data and functions.
- Motion: gentle sheet enter, table row selection, document pane crossfade.

Layout (~460px wide, taller if needed):
1. Header: “Convex” + deployment / project name; env pill (dev / prod) as quiet text, not a loud badge.
2. Left or top rail inside the sheet: Tables list (names + approximate doc counts). Secondary tab: Functions.
3. Main pane — Tables: spreadsheet-like but airy rows for documents; columns inferred from sample fields (id, _creationTime, key business fields). Pagination / load more at bottom.
4. Document detail: selecting a row opens a frosted side pane with pretty-printed JSON (read-only by default) and field list.
5. Functions tab: list queries / mutations / actions with name and type; Run opens a minimal args form + result panel (JSON).

Data displayed:
- Project / deployment identifier
- Table names, document counts, sample documents
- Document fields and JSON body
- Function names, kind (query / mutation / action), last run result preview
- Connection / sync health as a tiny status text

Core controls (conceptual MCP tools):
- list_tables / list_documents / get_document — table browser
- run_query / run_mutation (gated) — function runner with confirm on mutations
- get_deployment_info — header metadata
- search_documents — optional filter bar

Constraints: Default read-only posture; mutations require explicit confirm. No fake admin credentials UI. Keep the sheet calm and dense with data, not chrome. No emoji. Deliver a high-fidelity MCP App HTML UI mock suitable for Factory Integrations.
```

---

## Port

```
Design a Factory Developer OS MCP App widget for Port as the software catalog and governance surface.

Context: MCP App (tools + sandboxed HTML UI). Host embeds the view in an iframe; UI calls declared Port MCP tools via AppBridge. This is a display channel in Factory Developer OS — privileged catalog mutations still go through Port actions / workflows; the widget should emphasize browse + invoke self-service, not raw destructive admin. No live Port mutations are implied by the design itself.

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted panel, backdrop blur, rounded corners (~16–20px), hairline border, soft shadow.
- Content-forward catalog UI; minimal chrome; no card grids of stats; no floating promo chips.
- Soft atmospheric background behind the sheet. Light, airy, Apple Settings / Control Center lineage — not dark neon ops dashboards.
- Motion: sheet enter, blueprint→entity drill-in transition, run status soft update.

Layout (~480px wide):
1. Header: “Port” + organization name; quiet search across entities.
2. Segmented control: Catalog | Workflows | Audit.
3. Catalog: blueprint list (product, service, executionContract, deliveryRun, executionAttempt, executionRunner, bot, _mcp_server, agentPlugin, skill, harness_session, and similar) → selecting a blueprint shows entity rows (identifier, title, ownership, scorecard hint). Entity select opens a frosted detail with properties and relations as definition lists — not nested cards.
4. Workflows: list factory_* self-service actions (e.g. factory_start_delivery_run, factory_submit_evidence, factory_record_review_verdict) with short descriptions; Run opens a minimal INPUT form sheet-within-sheet + run status.
5. Audit: compact chronological log — actor, action, target, timestamp; filter by blueprint/entity.

Data displayed:
- Org / catalog context
- Blueprint names and entity identifiers/titles
- Key properties and relations for selected entity
- Scorecard status if present (quiet text or single indicator)
- Workflow run id / status when invoked
- Audit entries (who / what / when)

Core controls (Port MCP tools conceptually):
- list_blueprints / list_entities / get entities detail — catalog browse
- list_workflows / list_self_service_triggers / trigger_run / get_run — workflows
- search_audit_logs — audit tab
- list_scorecards — optional score hints
- Describe-only: no revoke/delete external interface apps in this widget

Constraints: Read and governed trigger_run only; do not design create/delete OAuth app flows or bulk upsert consoles. RBAC-aware empty states (“no access”). No Clerk. No emoji. No purple theme. High-fidelity frosted MCP App widget for catalog cockpit use.
```

---

## Docker

```
Design a Factory Developer OS MCP App widget for Docker containers used by Factory Sandbox Agent / Rivet harness isolation.

Context: MCP App pattern — HTML UI in a sandboxed iframe plus MCP tool declarations. The widget surfaces container / sandbox runtime state for operators; the browser must never call Sandbox Agent control APIs directly in Factory architecture — tools go through the MCP host bridge to an authorized backend. Design the UI as if those tools exist.

Visual direction — frosted-glass Apple-like:
- Translucent blurred sheet, rounded corners, hairline border, soft ambient shadow, content-forward.
- Soft cool atmospheric backdrop (machine-room calm, not cyberpunk). Avoid dark-mode default, glow borders, and emoji.
- Dense but breathable list of runtimes; minimal chrome.
- Motion: sheet enter, status state crossfade, log pane slide.

Layout (~440–500px wide):
1. Header: “Docker” + host/context name (e.g. local Compose / cloud target); tiny health text.
2. Filter: All | Running | Exited; search by name/image.
3. Container list (primary): name, image tag (e.g. rivetdev/sandbox-agent:…), status pill (Running / Exited / Created), CPU% and memory as quiet secondary metrics, uptime.
4. Selection detail: ports, mounts (summary), env keys only (values masked), related AgentSession / attempt id if provided by tools.
5. Actions: Start, Stop, Restart, View logs, Attach (disabled with tooltip if policy forbids). Logs open an in-sheet mono pane.
6. Optional secondary strip: Sandboxes vs ordinary containers — quiet segmented note that Sandboxes (microVM) differ from containers when the tool payload says so; do not invent false equivalence.

Data displayed:
- Container/sandbox id and name
- Image and tag
- Status, uptime, CPU, memory
- Published ports, mount summaries
- Masked secret indicators
- Recent log lines

Core controls (conceptual MCP tools):
- list_containers / get_container — inventory and detail
- start_container / stop_container / restart_container — lifecycle (confirm on stop)
- get_container_logs — log pane
- list_images — optional image filter metadata
- health / disk summary — header health

Constraints: Emphasize safety — destructive actions need confirm. No credential values shown. No Port mutations. Keep aesthetic frosted and calm. Deliver a high-fidelity MCP App HTML UI mock for the Factory cockpit.
```

---

## Turso

```
Design a Factory Developer OS MCP App widget for Turso (libSQL) databases — dock peer in the Code Atlas frosted MCP tool strip (media/code-atlas-mockup.png; factory-master-spec.md §4.5 / §12.1.1).

Context: MCP App (SEP-1865): sandboxed HTML UI + tool declarations. Host embeds the iframe in the Integrations / Code Atlas dock; UI invokes Turso MCP tools via AppBridge / postMessage. Factory treats Port workflow runs + audit as the default approval receipt store; this widget is an optional database / credentials-app surface (libSQL), not a required approval ledger. Progressive enhancement: tools remain usable without UI.

Visual direction — frosted-glass dock sheet matching the mockup aesthetic:
- Translucent frosted glass panel (backdrop blur, soft light fill ~60–80% opacity) over the same soft atmospheric field as the Code Atlas hero.
- Rounded corners (~16–20px), hairline border, soft single-layer ambient shadow.
- Minimal chrome, content-forward; no card stacks, no floating badges, no purple/indigo glow, no dark-mode default.
- Typography: refined UI sans; mono for SQL, db urls, and row ids.
- Motion: sheet enter, row selection, query result crossfade — restrained (2–3).

Layout (~420–480px wide dock sheet):
1. Header: “Turso” + organization / group name; quiet connection status text.
2. Segmented control: Databases | SQL | Groups.
3. Databases: list name, group, region/hostname summary, status; selected row shows size / createdAt as secondary text and Open SQL affordance.
4. SQL tab: database picker, single statement editor (mono), Run (confirm on writes), results table or JSON preview in a calm pane; read-first default.
5. Groups: compact list of groups with database counts; no destructive admin chrome.

Data displayed:
- Org, group, database name
- Hostname / libSQL URL (copy), region if present
- Status / health quiet text
- Query result rows or error message
- Empty/loading states that stay frosted

Core controls (Turso MCP / platform tools conceptually):
- list_databases / get_database — inventory and detail
- list_groups / list_organizations — header and filters
- read_database / execute read SQL — default path
- write_database only behind explicit confirm (optional; prefer read-first in dock)
- create_database — optional gated create, not the primary job of the sheet

Constraints: Read-first; no secret tokens shown. Do not present Turso as the Factory approval ledger. No Port mutations. No emoji. No purple theme. High-fidelity frosted MCP App widget mock sized for the Code Atlas dock (desktop + narrow).
```

---

## GitHub

```
Design a Factory Developer OS MCP App widget for GitHub repos and pull requests — Factory’s source and independent CI evidence surface.

Context: MCP App (SEP-1865): sandboxed HTML UI + tool declarations. Host renders the iframe; UI invokes tools through AppBridge / postMessage. Factory accept policy uses green checks on exact SHA — the widget must make check status and SHA first-class, without claiming GitHub itself implements “Factory accept.”

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted glass, backdrop blur, rounded corners, hairline border, soft shadow.
- Content-forward PR and checks UI; minimal chrome; no card collage; no floating labels on media.
- Soft light atmospheric background; refined UI typography; mono for SHAs and filenames.
- Motion: sheet enter, checks status soft update, diff file switch fade — restrained (2–3 motions).

Layout (~480px wide):
1. Header: “GitHub” + org/repo selector (owner/name); default branch as secondary text.
2. Segmented control: Pull requests | Checks | Repos (compact).
3. Pull requests: list open PRs — number, title, author, branch → base, CI rollup glyph (pending / success / failure), updated time. Selected PR shows description excerpt, commit SHA (full + copy), files changed count, review state.
4. Checks tab (or PR subpane): check runs for the exact head SHA — name, status, conclusion, link affordance. Visual emphasis on “exact SHA” so rewrite invalidation is obvious.
5. Actions: Open on GitHub, Refresh, Copy SHA, Request checks refresh (tool). Optional compact file list for the PR (names only).

Data displayed:
- Repository full name and default branch
- PR number, title, author, branches, state, review state
- Head SHA (exact), commit message
- Check run names, statuses, conclusions
- Recent workflow run summary if available
- Empty/loading/error states that stay frosted

Core controls (conceptual GitHub MCP / API tools):
- list_pull_requests / get_pull_request — PR list and detail
- list_check_runs_for_sha / get_commit_status — checks for exact SHA
- list_repos / get_repo — repo switcher
- list_workflow_runs — optional CI summary
- create_pull_request_comment (optional, confirm) — light review note

Constraints: Read-first; no merge button unless gated behind a clear confirm and policy note (“accept is Port/GitHub checks on SHA — merge is separate”). No Port OAuth chrome. No emoji. No purple theme. High-fidelity frosted MCP App widget mock for desktop and narrow widths.
```

---

## Tailscale

```
Design a Factory Developer OS MCP App widget for Tailscale Serve — private HTTPS fronting local Rivet / control backends on the factory desktop.

Context: MCP App (SEP-1865): sandboxed HTML UI + tool declarations. Host embeds the iframe in the Code Atlas frosted dock (second row); UI invokes Tailscale MCP/CLI-backed tools via AppBridge / postMessage. Factory uses Tailscale Serve (not Funnel) to share localhost services on the tailnet with TLS on *.ts.net names. Progressive enhancement: tools remain usable without UI.

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted glass (backdrop blur, soft light fill ~60–80%), rounded corners (~16–20px), hairline border, soft single-layer ambient shadow.
- Soft cool atmospheric field behind the sheet; content-forward; no card collage, no floating badges, no purple glow, no dark-mode default.
- Typography: refined UI sans; mono for hostnames, ports, and serve paths.
- Motion: sheet enter, status crossfade, route row selection — restrained (2–3).

Layout (~420–480px wide dock sheet):
1. Header: “Tailscale” + tailnet / machine name; quiet online/offline status text (not a loud badge).
2. Segmented control: Serve | Status | Peers.
3. Serve: list of active serve routes — public path (https://….ts.net/…), backend (localhost:port or path), HTTPS/HTTP mode, Funnel off (locked quiet note that Factory uses Serve only). Selected row shows identity-header toggle summary and copy-URL affordance.
4. Status: daemon health, MagicDNS name, Serve enabled yes/no, last error if any.
5. Peers (compact): devices on the tailnet that can reach this Serve (hostname, OS, last seen) — read-only.
6. Actions: Refresh, Copy Serve URL, Open in browser (tailnet), Disable route (confirm).

Data displayed:
- Tailnet name, machine hostname, online state
- Serve route path → backend target, TLS hostname
- Serve vs Funnel mode (Funnel must read Off / unavailable for Factory)
- Peer list summaries
- Empty/loading that stay frosted

Core controls (conceptual MCP / CLI tools):
- get_serve_status / list_serve_routes — primary inventory
- set_serve_route / remove_serve_route — gated mutations with confirm
- get_tailscale_status — header health + MagicDNS
- list_tailnet_peers — peers tab
- copy_serve_url — clipboard via host

Constraints: Never design public Funnel exposure as default. No secrets/auth keys shown. No Port mutations. No emoji. No purple theme. High-fidelity frosted MCP App widget for desktop + narrow widths.
```

---

## Rivet

```
Design a Factory Developer OS MCP App widget for Rivet — actors, queues, and ProjectSupervisor dashboard (execution kernel surface).

Context: MCP App (SEP-1865): sandboxed HTML UI + tools via AppBridge. Rivet is Factory’s durable execution kernel (ADR-002): ProjectSupervisor single admission queue, per-actor ordered queues, single-writer; Rivet never polls Port. Browser must not call Sandbox Agent control APIs — this widget talks to Rivet Inspector / Factory gateway tools only. Progressive enhancement required.

Visual direction — frosted-glass Apple-like:
- Translucent blurred sheet, rounded corners, hairline border, soft ambient shadow, content-forward.
- Soft cool neutrals; calm ops — not cyberpunk neon, not dark-mode default, not purple glow.
- Dense but breathable actor/queue lists; mono for actor ids and sequence numbers.
- Motion: sheet enter, queue depth soft update, attempt status crossfade.

Layout (~480px wide):
1. Header: “Rivet” + project / cluster name; quiet health (actors up / queue lag).
2. Segmented control: Supervisor | Actors | Queues | Traces.
3. Supervisor: ProjectSupervisor admission state — queue depth, last admit, fencing note (single admission owner); list recent WorkAttempt ids with status (admitted / running / awaiting evidence / closed).
4. Actors: rows — actor name/key, mailbox depth, last sequence, alive/crashed; select expands inline metadata (not a modal takeover).
5. Queues: named queues with depth, oldest age, completable/retry hint as quiet text (do not invent CAS claim UI — product has no claim-lease API).
6. Traces: compact Rivet OTel/Inspector span list for selected attempt — name, duration, status; Open Inspector external link.

Data displayed:
- Project / supervisor identity
- WorkAttempt id, status, linked bead / executionAttempt opaque ids
- Actor keys, queue depths, sequence
- Trace span summaries
- Empty/loading frosted states

Core controls (conceptual MCP / Rivet tools):
- get_supervisor_status / list_work_attempts — supervisor tab
- list_actors / get_actor — actors tab
- list_queues / get_queue_depth — queues tab
- list_traces / get_attempt_trace — traces
- signal_attempt (optional, confirm) — cancel/recover only when Port-authorized recover path exists

Constraints: Emphasize ordered queues + single-writer; do not fake Port↔Rivet first-party product chrome. No Port catalog mutations. No Sandbox Agent direct control from this sheet. No emoji. High-fidelity frosted MCP App widget mock.
```

---

## Polygraph

```
Design a Factory Developer OS MCP App widget for Polygraph — multi-repo session visibility, PR/CI coordination, and Factory scorecard/review inputs (not a standalone LLM-eval product).

Context: MCP App (SEP-1865). Polygraph by Nx is a meta-harness: cross-repo visibility, persistent session memory, PR/CI coordination — “Polygraph isn’t an agent.” ADR-008 “Polygraph evals” means Factory visibility from session/review artifacts plus Port scorecards / Rivet traces — do not invent a Polygraph scoring API. M1 single-repo path does not require Polygraph; widget still designs the multi-repo surface. Host iframe + AppBridge tools.

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted panel, backdrop blur, rounded corners (~16–20px), hairline border, soft shadow.
- Content-forward session list; minimal chrome; no promo badges; soft atmospheric backdrop.
- Typography: refined UI sans; mono for session ids and SHAs.
- Motion: sheet enter, session row select, review pane crossfade — restrained.

Layout (~460–500px wide):
1. Header: “Polygraph” + org/workspace; quiet connected status.
2. Segmented control: Sessions | Reviews | Scorecards | Repos.
3. Sessions: cross-repo agent sessions — title, repos involved (chips as quiet text tags, not floating stickers), PR links count, CI rollup glyph, updated time. Select expands inline: session memory excerpt, linked PRs, related WorkAttempt id if Factory-bound.
4. Reviews: adversarial / session review list — reviewer, outcome summary, timestamp; open excerpt pane within sheet.
5. Scorecards: Port scorecard hints bound to services/repos in the session (quiet pass/warn/fail text) — sourced via Port tools, labeled as Port scorecards.
6. Repos: compact list from Polygraph list_repos / Port service set.

Data displayed:
- Session id, title, repos, memory snippet
- PR numbers, CI status, SHAs when present
- Review outcomes / adversarial notes
- Scorecard name + status for linked entities
- Empty state explaining single-repo M1 (Polygraph optional)

Core controls (conceptual MCP tools):
- list_sessions / get_session — sessions
- list_session_reviews / run_session_review (confirm) — reviews
- list_repos — repos tab
- list_scorecards / get_scorecard (Port) — scorecards tab
- list_prs_for_session — PR coordination strip

Constraints: Do not brand Polygraph as an eval harness product. Atlas cross-repo dashed edges consume this data — widget is the ops sheet, not the hero graph. No Port mutations beyond read + governed review triggers. No emoji. No purple theme. High-fidelity frosted MCP App widget.
```

---

## Beads

```
Design a Factory Developer OS MCP App widget for Beads — dependency-aware task readiness graph for AI agents (`bd`).

Context: MCP App (SEP-1865). Beads owns readiness/claim (not harness, not Port catalog, not Rivet runtime). Factory ProjectSupervisor admits coding work only when Beads reports ready (or Port executionContract carries audited bypass). CLI/MCP: bd create → deps → bd ready → bd update --claim → bd close. Widget is the readiness cockpit for the Code Atlas Beads overlay.

Visual direction — frosted-glass Apple-like:
- Translucent frosted sheet, rounded corners, hairline border, soft shadow, content-forward.
- Soft light atmosphere; calm graph-adjacent list UI; mono for bead ids.
- Motion: sheet enter, ready-count soft update, claim confirm fade.

Layout (~420–480px wide):
1. Header: “Beads” + project/db name; ready count as quiet secondary text (“N ready”).
2. Segmented control: Ready | Graph | All.
3. Ready: primary list from bd ready JSON — bead id, title, priority, blocker count (0), age. Actions per row: Claim (confirm), Open detail.
4. Graph: compact dependency view — selected bead with blockers / blocked-by as indented or inline tree (expand-in-place rows, not a modal). Show status pills (open / claimed / closed).
5. All: filterable issue list with search; status + assignee/agent claim holder.
6. Detail strip: description excerpt, repo:path or executionContract id convention, deps, claim holder, timestamps.

Data displayed:
- Bead id, title, status, priority
- Blockers / dependents
- Ready set membership
- Claim holder / claim time
- Linked Port attempt / Rivet opaque ids if present
- Empty/loading frosted states

Core controls (Beads MCP / CLI conceptually):
- bd_ready / list_ready — Ready tab
- bd_show / get_bead — detail
- bd_update_claim — Claim (confirm before Rivet admit path)
- bd_create / bd_close — gated create/close
- bd_deps / list_deps — Graph tab
- bd_list — All tab

Constraints: Claim is explicit and logged; do not auto-start Sandbox Agent from the widget. No Port catalog mutations. Readiness overlay feeds Code Atlas — keep chrome minimal. No emoji. High-fidelity frosted MCP App widget mock.
```

---

## Trailcode

```
Design a Factory Developer OS MCP App widget for Trail-Code (Graft) — per-repo code map: symbols, callers, and learnings for agents.

Context: MCP App (SEP-1865). Trail-Code is the self-learning context layer (`@trailhq/trail-code`, trail/graft CLI). Code Atlas hero consumes Trail-Code symbol edges; this dock widget is the inspect/query sheet for one repo’s map and learnings — not a second atlas. Sandbox Agent images may preinstall Trail-Code; browser tools go through MCP host, not direct FS.

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted glass, backdrop blur, rounded corners, hairline border, soft shadow.
- Content-forward symbol browser; soft atmospheric backdrop; mono for symbol paths.
- Motion: sheet enter, symbol expand-in-place (tree-folder), learnings pane fade.

Layout (~460px wide):
1. Header: “Trail-Code” + repo name; index freshness (last trail init / map refresh) as quiet text.
2. Segmented control: Map | Callers | Learnings.
3. Map: searchable symbol/package list — kind (fn/class/mod), path, short signature. Select expands inline children / members (file-tree semantics inside the sheet).
4. Callers: for focused symbol — callers[] and callees with repo-local paths; jump focuses Map without leaving the sheet.
5. Learnings: team/agent decision notes tied to symbols or paths — title, excerpt, updatedAt; read-first.
6. Actions: Refresh index (tool), Copy symbol id, Open in Atlas (deep-link query param — does not navigate away from dock host).

Data displayed:
- Repo, index timestamp, symbol counts
- Symbol id, kind, path, range
- Caller/callee edges
- Learning titles and excerpts
- Empty state when repo not indexed

Core controls (conceptual MCP / CLI tools):
- trail_status / get_map_meta — header
- search_symbols / get_symbol — Map
- list_callers / list_callees — Callers
- list_learnings / get_learning — Learnings
- refresh_map (confirm, async) — reindex affordance

Constraints: Widget is inspect-only by default; atlas hero remains the graph composition. No Port mutations. No emoji. No purple theme. High-fidelity frosted MCP App HTML UI mock for dock use.
```

---

## AG-UI / CopilotKit

```
Design a Factory Developer OS MCP App widget for deferred AG-UI / CopilotKit surfaces — Agent↔User event stream and optional generative UI (not the kernel path).

Context: MCP App (SEP-1865). ADR-011: kernel streaming = Rivet Actor native realtime; CopilotKit / AG-UI are deferred optional display channels. AG-UI is complementary to MCP (Agent↔User vs Agent↔Tools), not identical to MCP Apps. First-party Rivet↔AG-UI is UNVERIFIABLE — any adapter is Factory design (projector from Actor events → AG-UI SSE). Privileged mutations stay Port actions. Design a frosted “session stream” widget that can bind either Rivet-native events (current) or mapped AG-UI events (deferred).

Visual direction — frosted-glass Apple-like:
- Translucent frosted sheet, rounded corners, hairline border, soft shadow, content-forward transcript.
- Soft light atmosphere; no neon chat bubbles, no purple glow, no emoji.
- Typography: refined UI sans for messages; mono for sequence / event types.
- Motion: sheet enter, new-event soft append, reconnect banner fade.

Layout (~480px wide, taller transcript):
1. Header: “Session” + AgentSession id; transport pill as quiet text — Rivet native | AG-UI (deferred); sequence cursor.
2. Reconnect strip when gap detected: “Resume from sequence N” primary quiet button.
3. Event transcript (primary): chronological rows — EventType (TEXT_MESSAGE_CONTENT, TOOL_CALL_START, STATE_SNAPSHOT, …), truncated payload, timestamp. Group consecutive text deltas into readable bubbles without heavy card chrome.
4. Generative UI slot (optional CopilotKit path): frosted inset region that can host MCP App / generative components when present — empty placeholder labeled deferred when kernel path only.
5. Composer (display channel only): prompt field + Send enqueues to Actor via Factory tools — never calls Sandbox Agent from browser.
6. Footer: Copy transcript, Open Rivet Inspector, note “mutations via Port”.

Data displayed:
- Session id, transport mode, last sequence
- AG-UI / Actor event types and payloads (summarized)
- Tool call names and statuses
- STATE_SNAPSHOT summary
- Reconnect / gap state

Core controls (conceptual tools):
- subscribe_session / resubscribe_from_sequence — stream
- list_session_events — backfill
- enqueue_prompt — composer (confirm)
- get_agui_projector_status — deferred path health
- cancel_session (gated) — stop attempt display + Port-authorized cancel tool

Constraints: Label CopilotKit/AG-UI as deferred; default mock shows Rivet-native with AG-UI mapping as secondary/toggle. No Port OAuth invent. No emoji. High-fidelity frosted MCP App widget for desktop + narrow.
```

---

## ChatGPT Plugins

```
Design a Factory Developer OS MCP App widget that documents and previews the ChatGPT Plugins packaging reference for Factory MCP Apps (ADR-010).

Context: MCP App (SEP-1865). OpenAI Plugins for ChatGPT/Codex combine Skills (SKILL.md), optional MCP server (tools/auth/structured results), optional UI resources, optional lifecycle hooks. ChatGPT supports the open MCP Apps UI standard; ChatGPT-specific extensions are optional. This widget is a reference / operator checklist for packaging Factory’s Single-MCP gateway as a ChatGPT plugin — not a live ChatGPT admin console. Progressive enhancement.

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted panel, backdrop blur, rounded corners, hairline border, soft shadow.
- Content-forward checklist and package map; minimal chrome; soft atmospheric backdrop.
- Typography: refined UI sans; mono for file paths and tool names.
- Motion: sheet enter, section expand-in-place, copy feedback fade.

Layout (~440–480px wide):
1. Header: “ChatGPT Plugins” + “Factory packaging reference”; quiet ADR-010 note.
2. Segmented control: Package | Tools | UI | Publish checklist.
3. Package: tree of plugin contents — SKILL.md skills, MCP server entry, ui:// resources, lifecycle hooks — each row expands inline with purpose and Factory mapping (Port MCP behind Single-MCP gateway).
4. Tools: sample tool list the plugin would expose (list_self_service_triggers, catalog reads, Linear/Vercel connectors under RBAC) — read-only inventory.
5. UI: preview frame placeholder of an MCP App sheet (e.g. Linear or Port) as the optional UI resource; note progressive enhancement.
6. Publish checklist: installable package steps as quiet checklist (no live publish button inventing OpenAI credentials).

Data displayed:
- Package file map and versions
- Skill names and short descriptions
- MCP tool names and auth mode (person vs machine)
- UI resource urls (ui://…)
- Checklist completion state (local mock)

Core controls (conceptual):
- get_plugin_manifest / list_skills — Package
- list_gateway_tools — Tools (Factory MCP)
- list_ui_resources — UI
- validate_plugin_package — checklist validation
- export_manifest (optional) — download JSON/YAML for operators

Constraints: Reference pattern only — do not claim a published Factory ChatGPT plugin exists. No secrets. No Port mutations. No emoji. No purple theme. High-fidelity frosted MCP App widget mock.
```

---

## OmniRoute

```
Design a Factory Developer OS MCP App widget for OmniRoute — self-hosted LLM gateway (OpenAI-compatible router with providers and automatic fallback).

Context: MCP App (SEP-1865). OmniRoute (omniroute.online; MIT) exposes an OpenAI-compatible endpoint (e.g. localhost:20128/v1), multi-provider routing, fallback. Naming note: prior text said “OmniRouter”; public branding is OmniRoute — label OmniRoute in UI. Factory wiring to Port/Rivet is design-only (UNVERIFIABLE as vendor stack). Widget is operator visibility into gateway health, providers, and recent route decisions — not a prompt playground that exfiltrates secrets.

Visual direction — frosted-glass Apple-like:
- Translucent frosted sheet, rounded corners, hairline border, soft shadow, content-forward.
- Soft cool atmosphere; calm gateway ops UI; mono for model ids and request ids.
- Motion: sheet enter, provider health crossfade, latency spark soft update.

Layout (~460px wide):
1. Header: “OmniRoute” + base URL (copy); quiet health (up / degraded).
2. Segmented control: Providers | Routes | Usage.
3. Providers: list — name, model aliases, health (up/down), latency p50 quiet text, fallback rank. Selected row shows endpoint host (no API keys).
4. Routes: recent routing decisions — request id, requested model, chosen provider, fallback hops, status, latency. Expand inline for error message.
5. Usage: compact totals — requests, tokens in/out, error rate over a quiet time range selector (1h / 24h).
6. Actions: Refresh, Open dashboard URL, Test chat completions (optional gated probe that shows status only).

Data displayed:
- Gateway base URL and version if known
- Provider health and rank
- Recent route rows
- Aggregate usage metrics
- Empty/loading frosted states

Core controls (conceptual MCP / admin tools):
- get_gateway_health / get_omniroute_status — header
- list_providers / get_provider — Providers
- list_recent_routes — Routes
- get_usage_stats — Usage
- probe_chat_completions (confirm) — health probe without showing secrets

Constraints: Never display API keys or raw provider credentials. Do not invent Port billing chrome. No Port mutations. No emoji. No purple theme. High-fidelity frosted MCP App widget for dock/second row.
```

---

## ISO 12207

```
Design a Factory Developer OS MCP App widget for ISO/IEC/IEEE 12207:2026 lifecycle views mapped to Factory Spec ownership (ASDLC alignment display).

Context: MCP App (SEP-1865). 12207 is a process framework standard (Agreement; Organizational project-enabling; Technical management; Technical processes), not runtime software. Factory maps process groups to Spec ownership (asdlc-lifecycle; iso-12207-overview.md). Widget is a frosted lifecycle map + coverage matrix — read-only education/ops alignment, not a standards editor. Full normative text is paid; UI uses public process names/groups only.

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted panel, backdrop blur, rounded corners, hairline border, soft shadow.
- One job: show process groups → Factory Spec owners → gate status. No card grid of marketing stats.
- Soft atmospheric backdrop; refined UI sans; quiet secondary labels.
- Motion: sheet enter, process expand-in-place, coverage filter crossfade.

Layout (~480px wide):
1. Header: “ISO 12207” + “2026 process map”; quiet “alignment view” subtitle.
2. Segmented control: Groups | Coverage | Gates.
3. Groups: four process groups as expandable rows — Agreement; Organizational project-enabling; Technical management; Technical. Expand-in-place lists named processes (Acquisition, Supply, Implementation, Operation, Maintenance, Disposal, etc. from public TOC). Selecting a process shows Factory Spec owner + ASDLC phase mapping as a definition list.
4. Coverage: matrix rows — process → Spec id → Contract DoD present? (yes/partial/gap) as quiet text indicators.
5. Gates: Context Gates / Workflow-as-Code checkpoints tied to lifecycle stages; link affordance to Spec docs (in-host open).
6. Footer: link outs to ISO catalog / IEEE SA (external) — no pirated normative text.

Data displayed:
- Edition 2026 label
- Process group and process names (public TOC)
- Factory Spec owner and ASDLC phase
- Coverage status
- Gate names and last review quiet date if provided by tools

Core controls (conceptual):
- list_process_groups / list_processes — Groups
- get_factory_mapping / list_spec_owners — Coverage
- list_context_gates — Gates
- open_spec_doc — documentation deep link
- export_alignment_csv (optional) — operator export

Constraints: No copyrighted standard body text verbatim. Read-only. No Port mutations. No emoji. No purple theme. High-fidelity frosted MCP App widget mock.
```

---

## Context Lake

```
Design a Factory Developer OS MCP App widget for Port Context Lake — the persistent semantic catalog layer (blueprints, entities, relations, ingestion).

Context: MCP App (SEP-1865). Port Context Lake is SoT for Factory catalog data; Ocean sync covers GitHub/Linear/Vercel/Convex; ingestion lands as entities. Cockpit agents answer questions over Context Lake search, audit, scorecards. This widget is browse/search/ingest-status — not a bulk upsert console. Catalog writes remain §4.2.1 single-writer + catalogVersion; UI emphasizes read + governed workflows. No live Port mutations from the design itself.

Visual direction — frosted-glass Apple-like:
- Translucent frosted sheet, rounded corners, hairline border, soft shadow, content-forward.
- Soft cool neutrals; airy search + entity list; no dashboard card collage.
- Motion: sheet enter, search results crossfade, entity detail slide-within-sheet.

Layout (~480px wide):
1. Header: “Context Lake” + org name; quiet sync health (Ocean integrations summary).
2. Segmented control: Search | Blueprints | Ingestion | Relations.
3. Search: prominent query field; results as rows — blueprint, identifier, title, updatedAt; select opens property/relation definition list.
4. Blueprints: compact catalog of live types (product, service, executionContract, deliveryRun, executionAttempt, bot, _mcp_server, agentPlugin, skill, harness_session, mirrors…).
5. Ingestion: Ocean / integration status rows — github-ocean, linear, vercel-ocean, convex-ocean, custom — last sync, error quiet text.
6. Relations: for selected entity, related entities as calm linked rows (not nested cards).

Data displayed:
- Search hits with blueprint + identifier
- Blueprint list and entity counts when available
- Integration sync status
- Properties, relations, scorecard hints
- RBAC empty states (“no access”)

Core controls (Port MCP conceptually):
- search / ask-style Context Lake query tools — Search
- list_blueprints / list_entities — Blueprints
- list_integrations / get_integration_sync — Ingestion
- get entity detail + relations — Relations
- search_audit_logs — optional recent mutations strip
- trigger_run only for governed sync/refresh workflows (confirm)

Constraints: Read-first; no invent upsert/delete admin. No Clerk. No emoji. No purple theme. Distinct from the Port catalog widget by emphasizing search + ingestion health. High-fidelity frosted MCP App widget.
```

---

## Agent registry

```
Design a Factory Developer OS MCP App widget for the Port agent registry — AI agents, bots, MCP servers, and readiness scorecards.

Context: MCP App (SEP-1865). ADR-001: Port owns agent/skill registry. Live blueprints include _ai_agent, bot, bot_hire_proposal, bot_decision, agentPlugin, _mcp_server, harness_session; scorecard agent_readiness on _ai_agent. Widget browses registry and readiness; hire/approve flows only via governed Port workflows (trigger_run), never raw destructive admin. Machine ≠ interactive MCP auth paths stay visible as quiet labels.

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted panel, backdrop blur, rounded corners, hairline border, soft shadow.
- Content-forward agent list; minimal chrome; soft atmospheric backdrop.
- Typography: refined UI sans; mono for agent ids and MCP server keys.
- Motion: sheet enter, readiness indicator soft update, detail expand-in-place.

Layout (~460–500px wide):
1. Header: “Agent registry” + org; quiet counts (agents / bots / MCP servers).
2. Segmented control: Agents | Bots | MCP servers | Readiness.
3. Agents: _ai_agent rows — title, type, owner team, readiness hint, last invocation quiet text. Select expands properties, linked skills/plugins, conversation summary if present.
4. Bots: external bot entities + hire proposals / decisions as secondary inline sections (status only).
5. MCP servers: _mcp_server catalog — name, connector mode, RBAC scope summary; no secret tokens.
6. Readiness: agent_readiness scorecard rules as a calm checklist per selected agent.

Data displayed:
- Agent/bot/server identifiers and titles
- Ownership, relations to skill / agentPlugin
- Readiness pass/warn/fail quiet indicators
- Recent invocation / daily summary snippets when tools provide them
- Auth path label (person vs machine)

Core controls (Port MCP conceptually):
- list_entities filtered by _ai_agent / bot / _mcp_server
- list_scorecards / get agent_readiness
- list_plugins / list related agentPlugin
- list_workflows / trigger_run for hire/approve (confirm, Johnny/RBAC gated)
- search_audit_logs for agent mutations

Constraints: Describe-only for revoke/delete external apps. No Port OAuth app create UI. No emoji. No purple theme. High-fidelity frosted MCP App widget mock.
```

---

## Skill registry

```
Design a Factory Developer OS MCP App widget for the Port skill registry — skills and agentPlugin bundles used to assemble Factory capabilities.

Context: MCP App (SEP-1865). Port skills and agentPlugin blueprints bundle reusable agent capabilities; relations attach skills to services, agents, and MCP servers. Cockpit “assemble software” resolves product/service/stackTemplate/skill/agentPlugin entities. Widget is browse + bind preview; publishing/bundling mutations only through governed workflows. Complements Agent registry (agents consume skills).

Visual direction — frosted-glass Apple-like:
- Translucent frosted sheet, rounded corners, hairline border, soft shadow, content-forward.
- Soft light atmosphere; airy skill list; mono for skill ids and package refs.
- Motion: sheet enter, skill select, plugin bundle expand-in-place.

Layout (~440–480px wide):
1. Header: “Skill registry” + org; quiet skill / plugin counts.
2. Segmented control: Skills | Plugins | Attachments.
3. Skills: rows — identifier, title, version/tag if present, owner, used-by count. Select shows description excerpt, inputs/outputs summary, linked agentPlugins.
4. Plugins: agentPlugin bundles — name, contained skill list (expand-in-place), target agents/MCP servers.
5. Attachments: for a selected service/product — which skills/plugins are attached (catalog relations); optional “assemble preview” read-only plan list.
6. Actions: Refresh, Open in Port (external), Trigger bundle workflow (confirm) when RBAC allows.

Data displayed:
- Skill and plugin identifiers, titles, versions
- Relations to agents, services, MCP servers
- Bundle membership
- Assemble preview module list (read-only)
- Empty/loading frosted states

Core controls (Port MCP conceptually):
- list_entities for skill / agentPlugin
- get entity detail + relations — Attachments
- list_blueprints — header context
- trigger_run for governed bundle/provision workflows (confirm)
- search Context Lake for skill text — optional filter

Constraints: No free-form catalog upsert UI. No secrets in skill env display. No emoji. No purple theme. High-fidelity frosted MCP App widget for desktop + narrow.
```

---

## Sandbox Agent

```
Design a Factory Developer OS MCP App widget for Rivet Sandbox Agent sessions — in-sandbox harness control visibility (HTTP SDK inside the sandbox).

Context: MCP App (SEP-1865). Sandbox Agent runs inside the sandbox (image e.g. rivetdev/sandbox-agent:…); Rivet Actor owns session lifecycle/persistence; browsers must never call Sandbox Agent control APIs directly — tools go through Factory gateway / Rivet Actor. Providers include docker, local, e2b, daytona, vercel, cloudflare. Distinct from the Docker engine inventory widget: this sheet is session/harness oriented.

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted glass, backdrop blur, rounded corners, hairline border, soft shadow.
- Content-forward session list + event tail; soft cool atmosphere; mono for session ids.
- Motion: sheet enter, SSE event append, status crossfade.

Layout (~480px wide):
1. Header: “Sandbox Agent” + provider (docker/…); quiet health (/v1/health).
2. Segmented control: Sessions | Files | Terminal.
3. Sessions: Actor-owned sessions — id, harness (Claude Code / Codex / Cursor / …), status, workspace path, uptime. Select shows event sequence tail (sessionUpdate summaries).
4. Files: read-only workspace tree summary for selected session (paths only); download/open via tools.
5. Terminal: recent command summaries / exit codes — not an interactive shell in-browser unless policy tool allows gated exec preview.
6. Actions: Refresh, Stop session (confirm, Port/Rivet authorized), Open Rivet session stream widget.

Data displayed:
- Session id, provider, harness kind, status
- Workspace path, mounts summary
- Recent SSE sessionUpdate kinds
- File path list; command history summaries
- Health and image tag

Core controls (conceptual — Actor/gateway mediated):
- list_sessions / get_session — Sessions
- get_sandbox_health — header
- list_workspace_files / read_file_preview — Files
- list_terminal_events — Terminal
- stop_session / cancel_attempt (confirm) — lifecycle

Constraints: Hard ban on browser→Sandbox Agent direct control. No credential values. No Port catalog mutations. No emoji. High-fidelity frosted MCP App widget mock.
```

---

## OpenFleet

```
Design a Factory Developer OS MCP App widget for OpenFleet — blast-radius ceilings and ledger for Factory agent sessions (LogicSRC OpenFleet records).

Context: MCP App (SEP-1865). Security Spec uses OpenFleet ceilings: approvals, budget, depth, fan_out, hosts, until. Over-ceiling → ledger ceiling.refuse. CapacityManager / full multi-host matrix is post-M1; widget still designs the ceiling cockpit for operators. Complements Rivet supervisor (execution) and Port RBAC (authz) — OpenFleet is the quantitative blast-radius ledger.

Visual direction — frosted-glass Apple-like:
- Translucent frosted sheet, rounded corners, hairline border, soft shadow, content-forward.
- Soft atmospheric backdrop; calm numeric ceilings — not alarmist red dashboards; warn states as quiet text.
- Typography: refined UI sans; mono for ledger event ids.
- Motion: sheet enter, utilization bar soft update, refuse event highlight fade.

Layout (~440–480px wide):
1. Header: “OpenFleet” + fleet/project name; overall posture (within ceilings / refused recently).
2. Segmented control: Ceilings | Ledger | Sessions.
3. Ceilings: rows for approvals, budget, depth, fan_out, hosts, until — limit, current usage, remaining; quiet progress as thin lines (not chunky cards).
4. Ledger: chronological ceiling.admit / ceiling.refuse events — actor/session, which ceiling, timestamp, message.
5. Sessions: active sessions with consumed budget/depth/fan-out; link to Rivet attempt id.
6. Actions: Refresh, Export ledger, Propose ceiling change (docs-only / workflow trigger confirm — no silent raise).

Data displayed:
- Ceiling names, limits, usage
- Refuse/admit ledger entries
- Session consumption summaries
- until expiry if set
- Empty/loading frosted states

Core controls (conceptual LogicSRC / gateway tools):
- get_openfleet_ceilings / list_ceilings — Ceilings
- list_ledger_events — Ledger
- list_fleet_sessions — Sessions
- check_admit_preview — dry-run against ceilings
- trigger_run / propose_ceiling_update (gated) — change requests

Constraints: Post-M1 implementation gate may disable edits — show read-only with “gated” quiet note when applicable. No Port mutations. No emoji. No purple theme. High-fidelity frosted MCP App widget.
```

---

## Langfuse

```
Design a Factory Developer OS MCP App widget for Langfuse — observability for traces, prompts, and evaluation scores feeding Factory visibility (alongside Port audit + Rivet OTel).

Context: MCP App (SEP-1865). Langfuse is open-source observability (traces, prompts, evals, OTel). Factory OTel→Langfuse wiring is design (UNVERIFIABLE as prebuilt Rivet export). Widget surfaces recent traces and scores for coding/cockpit runs; accept policy remains GitHub CI on exact SHA — Langfuse does not accept. Progressive enhancement.

Visual direction — frosted-glass Apple-like cockpit sheet:
- Translucent frosted glass, backdrop blur, rounded corners, hairline border, soft shadow.
- Content-forward trace list; soft cool atmosphere; mono for trace ids and model names.
- Motion: sheet enter, score update crossfade, trace expand-in-place.

Layout (~460px wide):
1. Header: “Langfuse” + project name; quiet ingestion health.
2. Segmented control: Traces | Scores | Prompts.
3. Traces: rows — name, user/session id, latency, token usage quiet text, status. Expand inline: span waterfall summary (name, duration) without heavy nested cards.
4. Scores: eval score list — name, value, trace link, comment excerpt; filter by score name.
5. Prompts: versioned prompt names + labels; select shows read-only template preview.
6. Actions: Refresh, Open in Langfuse (external), Copy trace id.

Data displayed:
- Trace ids, latencies, token counts
- Span summaries
- Score names/values
- Prompt versions
- Empty/loading frosted states

Core controls (conceptual Langfuse / OTel tools):
- list_traces / get_trace — Traces
- list_scores / get_score — Scores
- list_prompts / get_prompt — Prompts
- get_project_stats — header health
- search_traces — filter bar

Constraints: Observability only — no deploy/accept controls. No API keys shown. No Port mutations. No emoji. No purple theme. High-fidelity frosted MCP App widget mock.
```

---

## Factory MCP Gateway

```
Design a Factory Developer OS MCP App widget for the Factory Single-MCP gateway / OpenMCP well-known control surface.

Context: MCP App (SEP-1865). §18 lock: one Factory MCP gateway is the universal control surface for Coding and Cockpit agents and for Developer OS; Port MCP is the governed front door; Factory-owned Apps register behind that governance. OpenMCP emission: /.well-known/openmcp.json documents the one surface (not a second runtime). Widget shows gateway health, registered tool families, connectors, and well-known descriptor — operator map of the Single-MCP principle.

Visual direction — frosted-glass Apple-like:
- Translucent frosted sheet, rounded corners, hairline border, soft shadow, content-forward.
- Soft atmospheric field; calm registry UI; mono for tool names and URLs.
- Motion: sheet enter, tool-family expand-in-place, health crossfade.

Layout (~480px wide):
1. Header: “Factory MCP” + entry URL (copy); quiet auth mode (person / machine).
2. Segmented control: Tools | Connectors | OpenMCP | Clients.
3. Tools: grouped families — Catalog, Workflows, GitHub/CI, Linear/tasks, Deploy (Vercel), Data (Convex/Turso), Runtime (Rivet/Docker), Q&A (Context Lake), Assemble — each expands to tool name list (list_self_service_triggers, trigger_run, etc.).
4. Connectors: Port MCP connectors / Ocean-backed providers with RBAC summary; status up/down.
5. OpenMCP: pretty-printed /.well-known/openmcp.json summary — endpoint, scopes, skills/apps advertised; Validate button.
6. Clients: which hosts are expected (Claude, ChatGPT plugins, Cursor, Developer OS) as quiet checklist — documentation, not live telemetry invent.

Data displayed:
- Gateway URL and health
- Tool family inventories
- Connector statuses
- OpenMCP descriptor fields
- Client/host matrix
- RBAC-denied empty states

Core controls (conceptual):
- list_gateway_tools / list_self_service_triggers — Tools
- list_integrations / list MCP connectors — Connectors
- get_openmcp_descriptor / validate_openmcp — OpenMCP
- get_gateway_health — header
- trigger_run only via named governed workflows (confirm)

Constraints: Emphasize one entry URL; do not encourage N privileged raw provider MCPs. No Port OAuth app create. No emoji. No purple theme. High-fidelity frosted MCP App widget for desktop + narrow widths.
```
