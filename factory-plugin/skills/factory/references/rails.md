# Rails — the never-list for agents working in Factory

Every rule below is locked in the master spec or a live ADR. Violating one is not a style
issue; several are the exact failure modes the architecture exists to prevent. When a rail
blocks your task, stop and surface it — do not route around it.

## Control plane

- **Exactly one control plane.** The Port MCP gateway is the only privileged Factory control
  surface (master spec §18.5 Single-MCP; ADR-001). Catalog, provisioning, coding-agent
  start/cancel, CI steering, settings, accept — all of it goes through Port-governed tools.
- **No shadow control planes.** Never route a privileged Factory mutation around the Port
  gateway via a vendor MCP, a provider dashboard API, or a raw provider call. Raw dashboards
  are human break-glass only; Factory *agents* get no second ungated path for the same
  mutations (§18.5).
- **No catalog writes outside the §4.2.1 writer.** Every Port catalog write — direct API/MCP,
  Ocean sync apply, workflow entity node — enqueues to the single writer inside the
  factory-gateway, keyed `{blueprint}:{entityIdentifier}`, with `catalogVersion`
  reject-stale semantics. No bypass for "sync-only" or "claim-only" callers (§4.2.1;
  port-factory-data-model §4.1). Ocean/MCP clients call the writer API; they never dual-write.
- **Rivet never polls Port** (ADR-002). Port reaches Rivet only via the signed webhook →
  gateway → `ProjectSupervisor` path (ADR-003). Port catalog projections of runs still enter
  through §4.2.1 — Rivet actors never raw-write Port either (§4.3).

## Sandbox and coding

- **Browser never calls Sandbox Agent.** No browser or ungoverned client talks to the Sandbox
  Agent HTTP API — control, streaming, or otherwise (master spec §4.4 constraints; §18.3 hard
  bans; ADR-006). The Sandbox Agent SDK runs on the Rivet backend only; Cockpit agents reach
  sandboxes exclusively by enqueuing through `ProjectSupervisor` / `AgentSession` actors.
- **No Sandbox Agent MCP connector.** Do not register Sandbox Agent as a Port MCP Connector or
  expose it as an MCP server: it is REST/SSE + ACP, not MCP, and ADR-003/006 ban direct
  connector/browser control of it (LIVE-VERIFIED analysis, fragment E1). If a sandbox surface
  ever needs MCP shape, the only legal pattern is a Factory-owned MCP facade behind Port RBAC
  (ADR-010) — which does not exist yet (GAP).
- **Cockpit never holds sandbox credentials** and never SSHes a container; cancel/extend goes
  through Port/Rivet tools that signal the `WorkAttempt` (§18.4).
- **One coding agent per admitted `WorkAttempt`**; fan-out means multiple attempts under
  ceilings, each still a single Coding agent (§18.4).
- **Personal-agent tasks must not self-admit coding work or self-accept on a SHA** (§0.7).
- **Agent "done" is not accept.** Accept = GitHub CI green on the exact SHA + Port governance
  (ADR-008). Evidence tools record; they never replace CI (§4.8). A history rewrite invalidates
  a prior accept.

## Doctrine and sources of truth

- **Master spec first.** Design changes edit `factory-master-spec.md` first, then propagate to
  derived surfaces (§0). If a doc, ticket, or mirror conflicts with the master spec, flag it —
  never invent a parallel source of truth.
- **Notion is a mirror only** — never Spec, accept, or claim SoT (OQ-2, §0.6). Cursor project
  `notes.md` is coordination scratch, never SoT.
- **Linear is the admit/claim SoT until PBI-007** (OQ-1 hybrid, §0.3/§0.6). Meta Beads is
  scaffolding (deps, `bd ready`) until then. Do not claim work in Beads as if it were the
  admit gate yet — and once PBI-007 lands, claim in Beads *before* the Rivet queue message
  that starts the Sandbox Agent (§13.1/§18.2).
- **Meta XOR Product, always** (§0.2). Never write to the other lane's board, Beads instance,
  repo, or catalog ownership. Write targets name Meta Beads *xor* Product Beads explicitly.
- **No invented Port names.** Bind to the live catalog names (master spec §4.2 lists them);
  do not create parallel blueprint/workflow names for the same concepts.
- **ADR-005 is closed.** Never create/delete/revoke Port External Interface apps from the
  meta-repo, and never configure anything against the revoked Harness Observatory client
  (repo `AGENTS.md`; §4.6).

## Spin-up and provisioning

- **Anything that needs to be spun up with a CLI gets a GitHub Action** (Johnny's standing
  rule, 2026-10-30). CLI-launched services/workers/runners are provisioned and started through
  GitHub Actions workflows, never by manual/local launch. This matches the spec's own route:
  on Port validation success, **GitHub Actions** (and Port provision workflows) provision and
  connect (§4.2.2 step 3).
- **Provision only on validation success.** No scaffold, no provision, no Coding admit for a
  stack Port rejected (§4.2.2). Catalog miss → flag **needs implementation** → Beads/PBI delta
  (§0.0).

## Secrets and identity

- **No plaintext secrets in unit bodies, Specs, PRDs, git, or this plugin** (field 15, §0.1;
  §4.9 LogicSRC map: OpenCreds — no secrets in Specs/git). A unit names *which* secrets it
  needs and where they live; it never contains a value.
- Factory secrets resolve through the operator's secrets vault gateway — pointer only:
  vault MCP gateway `https://vault-mcp-zeta.vercel.app`, project `omniroute.prd`
  (LIVE-VERIFIED 2026-10-30). Sandbox credentials are scoped repo tokens only (§4.4), and
  machine auth paths are distinct from interactive MCP auth (§4.9).
- **Identity steps are Johnny's alone.** Government ID, video selfie, account access
  challenges (e.g. a locked social account), Tailscale console service definitions/tags, and
  `factory_request_release` (Johnny-only INPUT, §0.6) are never performed by an agent. Agents
  prepare everything up to the step and hand it over as one batch.
- **Money, contracts, ownership, and security changes are Johnny's calls.** An agent's "go"
  covers execution inside already-granted scope, nothing more.

## Hosts and tailnet

- **Tailscale taxonomy:** console **Apps** = third-party SaaS connectors only. A self-hosted
  component registers as a **Service** (`svc:name`), defined in the console by the admin and
  advertised by a *tagged* host (LIVE-VERIFIED 2026-10-30, fragments E4/E5). Untagged nodes
  cannot host services — the CLI refuses ("service hosts must be tagged nodes").
- **Do not disturb live network state to start fresh**: never sign out of an existing session,
  never tear down a working Funnel/Serve config (the gateway's public Funnel URL is what Port's
  `factory_*` webhooks call — fragments C8/E4), never replace what works when an additive
  route exists.
- **Docker on grok-bot port 2375 is unauthenticated** (root-equivalent on the tailnet;
  verified not public — LIVE-VERIFIED 2026-10-30, fragment C5). Treat it as a known exposure
  with a proposed fix awaiting Johnny's go — not as a sanctioned control path, and not
  something to silently use or silently close.

## Verification discipline

- **Never trust an agent's self-report — including your own tooling's.** A chunk of work is
  done only when live state agrees (counts, read-backs, HEAD hashes, HTTP answers). This rule
  exists because Factory-adjacent automation has repeatedly reported completions that live
  checks disproved (operator standing rule, 2026-10-30).
- **Grade services by what answers, not by what is listed.** A catalog entry, a serve
  advertisement, or a workflow definition proves registration, not liveness (the svc:rivet and
  convex-ocean lessons, fragments E4/B4 — see `infrastructure.md`).
