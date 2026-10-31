# Infrastructure — where Factory lives

Every entry is tagged **LIVE-VERIFIED 2026-10-30** (observed in the tenant/hosts/repo that
day; evidence = the atlas-map fragment named), **SPEC** (master spec or depth doc — design,
not observed state), or **GAP** (known missing/broken). Registration is not liveness: grade by
what answers (see the convex-ocean and svc:rivet entries).

## The control plane — Port

| Item | State |
|---|---|
| Tenant / org | `org_rNq4tjSc8DXL1ceL` — LIVE-VERIFIED (fragment A1) |
| MCP gateway | **Port's own native MCP gateway** — registering a provider in Port *is* creating an MCP Connector (Connectors → MCP Servers). Host: `https://mcp.port.io/v1` (EU); US: `https://mcp.us.port.io/v1`. This is the one control plane (ADR-001, §18.5) — LIVE-VERIFIED (fragments A10/B10) |
| Catalog | **55 blueprints** with full properties/relations; **29 workflows** incl. the 7 `factory_*` and 5 `atlas_*` — LIVE-VERIFIED (live Port AI tenant map run, 2026-10-30) |
| Key blueprints (SPEC §4.2 bind list) | `product`, `service`, `executionContract`, `deliveryRun`, `executionAttempt`, `executionRunner`, `bot`, `_mcp_server`, `agentPlugin`, `skill`, `harness_session`; assembly entities `stackTemplate`, `provider`, `convexComponent`, `shadcnComponent`, `shadcnRegistry` (port-factory-data-model §2.1) |
| Entity reality | `executionRunner` **0 entities** → `factory_claim_next_job` always ends "runner not active". `deliveryRun` / `executionAttempt` **0 entities**. Several service/product relations to GitHub/Linear are unset by Ocean; some scorecard calculations reference nonexistent fields (stale) — LIVE-VERIFIED (fragments A5/B8) |
| Auth — External Interface app | Name **"Factory"**, app id `iToN9BhXBwPRRb4eX7d6kbG8vZj8Rmug`, client id `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0` (master spec §3, ADR-005 live parameters). **Exactly 3 redirect URIs live**: `http://localhost:3000/api/auth/callback`, `http://127.0.0.1:3000/api/auth/callback`, `https://factory-developer-os.vercel.app/api/auth/callback` — LIVE-VERIFIED (fragment A9). The old "5 URIs, list full" claim is dead; per-deployment redirect derivation was fixed by pinning (repo PR #42) |
| Spec library (the SoT itself) | `factory-master-spec.md` (1,264 lines, §§0–22) + ~210 docs live **only** on JohnnyBox in the Cursor AgentStore docs library — NOT in the GitHub repo. See "JohnnyBox" below — LIVE-VERIFIED (fragment E3) |

## Ocean integrations — how sources map into Port (5, all Ocean)

Port **Ocean** is the integration/sync layer that applies external source state into catalog
entities. Registering/mapping a source in Port means an Ocean integration, not a connector
(LIVE-VERIFIED, fragments B7/B8):

| Integration | Type | Maps | State |
|---|---|---|---|
| `github-ocean` | GitHub App `4885906` | GitHub → Port, all repos **except** painter-os | LIVE |
| `factory-pilot-github` | GitHub App `5182871` | GitHub → Port, painter-os only | LIVE |
| `linear` | Ocean 0.12.29, API key | Linear → Port | LIVE |
| `vercel-ocean` | Custom generic HTTP | Vercel → Port, filtered to 9 project names; fetches 20 records, keeps ~1; **Developer OS is NOT in the catalog** | LIVE but thin — GAP for Dev OS coverage |
| `convex-ocean` | Custom generic HTTP | Intended Convex → Port | **BROKEN**: token invalid — 401 on every call while status shows "ready"; `convexProject`/`convexDeployment` both 0 entities — GAP |

Ocean sync applies are catalog writes, so under §4.2.1 they belong through the gateway writer;
today they are not on that path (spec docs admit it) — see `how-factory-builds.md` step 1.

## MCP Connectors registered in Port (`_mcp_server`)

`_mcp_server` entries: **13** per the repo's Track D record (fragment mcp-port-single-fanout) vs **15** per the live Port AI tenant map run — the counts conflict between sources; what agrees everywhere is that **only one is exposed** (LIVE-VERIFIED, fragment B10):

| Connector | Endpoint | State |
|---|---|---|
| `port-eu-mcp` | `https://mcp.port.io/v1` | **Exposed** — the gateway itself |
| `mcp-github` | `https://api.githubcopilot.com/mcp/` | Registered (Oct 30, by Port AI), `exposed: false`, metadata-only — needs a GitHub OAuth app client ID/secret or Port-secret token header; **account pick (mplsjohnnycage vs johnnyc-9164) is Johnny's open decision — GAP** |
| `mcp-linear` | `https://mcp.linear.app/mcp` | Registered, `exposed: false` |
| `mcp-vercel` | `https://mcp.vercel.com` | Registered, `exposed: false` (custom route) |
| `factory-devos-atlas-bff` | — | A pointer only. Must **NOT** be exposed |
| Convex | — | **GAP**: Convex's official MCP is stdio-only; Port connectors are remote-only. No registration possible today |
| Docker / Sandbox Agent | — | **GAP by design**: no Ocean mapping, no Docker blueprint, and Sandbox Agent must never be a connector (ADR-003/006; fragment E1) |
| Rivet | — | **GAP**: no Ocean mapping, no Rivet blueprint in the tenant |

## Hosts and tailnet services

Tailnet `taildf3a4b.ts.net`. Taxonomy (LIVE-VERIFIED): console **Apps** = third-party SaaS
connectors only; self-hosted = **Services** (`svc:name`), console-defined by the admin,
advertised by a **tagged** host. Untagged nodes cannot host services.

### grok-bot (100.70.202.44, tag:grokbot) — the tagged services host

| Component | Where | State |
|---|---|---|
| OmniRoute (Johnny's AI gateway) | Docker, `127.0.0.1:20128` | `svc:omni-route` **LIVE**: VIP `100.74.8.209`, `https://omni-route.taildf3a4b.ts.net/api/health` → `{"status":"ok"}` from a real tailnet client; also behind Funnel on the node's own name — LIVE-VERIFIED (fragment E4) |
| Rivet engine | `127.0.0.1:6420`, `/health` → engine **2.3.3** ok; token-enforced beyond /health | `svc:rivet` host advertisement **set** → `rivet.taildf3a4b.ts.net`, but **no DNS/VIP yet**: console definition is Johnny's pending step — GAP (fragment E4). Records conflict on whether Rivet runs as a Docker container or the native `/usr/bin/rivet-engine` on this box — flagged, unresolved (fragments C7/B6) |
| Beads Dolt server | Docker container `beads-dolt` (`dolthub/dolt-sql-server`, dolt 2.6.1), host `127.0.0.1:3307`, data `/home/box/beads-dolt/data/`, restart unless-stopped | Stood up 2026-10-30, seeded byte-identical from the embedded store; dolt HEAD `3fejadbd…` matches both sides; 8 issues (3 open / 1 in progress / 4 closed). `svc:dolt` advertisement set (`tcp://dolt.taildf3a4b.ts.net:3307`), console approval pending — GAP; a tailnet node-forward on `grok-bot…:3307` works meanwhile. Credentials live only in `/home/box/beads-dolt/.credentials` (0600) on grok-bot — never copy values out (fragment E5) |
| Docker daemon | Docker 29.1.4; API on **2375, unauthenticated, all interfaces** | Root-equivalent to anyone on the tailnet; verified **not** public (Funnel maps only 443 → OmniRoute). Proposed iptables fix awaits Johnny's go — known exposure (fragment C5) |

Spec topology (§13.4) puts Rivet + sandbox Docker on the *operator desktop*; live state runs
them on grok-bot. Drift — flagged, spec wins on design.

### desktop-3apdbkg (100.94.150.48, untagged) — the gateway host

| Component | Where | State |
|---|---|---|
| factory-gateway | `apps/factory-gateway`, node:http, port **8787** | **Public via Tailscale Funnel**: `https://desktop-3apdbkg.taildf3a4b.ts.net` — `GET /health` → 200 `{"ok":true,"service":"factory-gateway"}` verified off-tailnet. This URL is what all 7 Port `factory_*` webhooks call — LIVE-VERIFIED (fragments C8/E4) |
| `svc:factory-gateway` | — | **Blocked**: desktop is untagged → CLI refuses service hosting. Johnny's steps: tag the node + define the service (fragment E4) — GAP |
| Gateway internals | Memory catalog store hard-wired; `RIVET_SUPERVISOR_URL` unset | See `how-factory-builds.md` step 2 — the §4.2.1 live writer and Rivet forward are GAPs |

### JohnnyBox / johhny-net (100.97.67.9, user `mplsj`, untagged) — where the spec lives

- **The entire build spec** is in the Cursor AgentStore docs library:
  `C:\Users\mplsj\AppData\Local\Cursor\AgentStores\cursor_agent_stores\bc-46618e13-…\files\docs`
  (210 files; a second store, bc-72015999, holds 213 with a byte-identical-size master spec).
  **None of it is in the GitHub repo** (fragment E3).
- Depth docs there: `rivet-engineering-spec.md`, `rivet-sandbox-agent.md`,
  `port-factory-data-model.md` (its §4.1 is the source of the §4.2.1 fence).
- **Four** repo copies exist; the freshest is a Codex copy (Oct 30 14:29). Cursor has **no**
  factory GUI workspace on the box (fragment E3-S1).
- `factory-primary` carries **uncommitted FE-198 Ask-Rivet WIP that exists in no git history**
  — loss risk if the box disk goes (fragment E3). (Two PRs — FE-198 WIP and the docs library —
  were ordered by Johnny on 2026-10-30 to land this work in the repo.)
- Also runs the Utopia stack (llama.cpp embedding :8080, pgvector, codex bridge) — Johnny's
  local-AI box, not Factory runtime.
- SSH user is **`mplsj`** (no L after "mp"); key auth via
  `C:\ProgramData\ssh\administrators_authorized_keys`. The `mpslj` misspelling burned three
  lanes on 2026-10-30 — copy the name exactly.

### Other tailnet nodes (context, not Factory runtime)

grokbot-box (100.98.77.35, stale/offline ~8 days at last sweep) and lead-box (100.105.138.55,
dark) — LIVE-VERIFIED 2026-10-30 sweep.

## GitHub

| Item | State |
|---|---|
| `mplsjohnnycage` | A **user** account, not an org. 13 repos incl. **factory** — LIVE-VERIFIED (fragment C1) |
| `johnnyc-9164` | Second account, 12 repos incl. painter-os; the active `gh` CLI identity — LIVE-VERIFIED (fragment C1) |
| Factory repo | `mplsjohnnycage/factory`, **public**, main protected (PR required; only check `meta-ci-presence`; "Require approvals" unchecked since 2026-10-29; no bypass incl. admins). 1 open draft PR (#110), 40 open issues at last check — LIVE-VERIFIED (fragment C1) |
| Meta Beads SoT | The repo's `refs/dolt/data` ref = git commit `62613d2…`; cross-box beads sync is `bd dolt pull/push` against it (fragments E4/E5; store-doc `dolt-remote-server-sync.md`). The grok-bot Dolt **server** is a replica of this chain until clients are repointed (Johnny's call) |
| OAuth fix branch | `fix/port-oauth-canonical-login` — verified intact, tests 45/45, **not pushed**; PR needs Johnny's go (fragment C9) |

## Linear

Team key **STL**, team titled **ASDLC** (the team is not named "ASDLC" as a key — STL is the
key); project **Factory Meta**. 224 issues, 157 Done at last check — LIVE-VERIFIED (fragment
C2). Linear is the admit/claim SoT until PBI-007 (OQ-1). Note tracker drift: Linear marks
Atlas issues Done while the matching beads stay open (fragment D10) — same units, §0.1; flag,
don't average. `apps/linear-mcp-app` (the §16 Linear MCP App) does **not** exist — ADR-010/§16
intent only (GAP).

## Vercel

Account **johnnyc** (Hobby), **35 projects** at last check (older counts of 29 are stale).
Developer OS prod: `https://factory-developer-os.vercel.app`, with exactly **2 env vars** in
prod (`NEXT_PUBLIC_DEVOS_URL`, `PORT_FACTORY_CLIENT_ID`) → it runs in memory/fixture mode.
Staged, do-not-apply-yet env step: `RIVET_SERVE_URL` + `RIVET_ADMIN_TOKEN` + redeploy, gated
on the grok-bot Rivet service being verified live (fragment C9).

## Convex — NOT Factory's backend

There is **no Factory Convex deployment, project, or URL** in any evidence (fragments B4/C4).
The only Convex deployment in this estate is **Contractor OS's `posh-cobra-868`** — a different
product. The gateway's only Convex code is a Management API *provisioning* client
(`ss_convex_create_preview` / `ss_convex_set_env`) for assembling product stacks (§4.2.2).
Anyone telling you Factory data lives in Convex is wrong. Convex the *company's* MCP is
stdio-only, hence the Port connector GAP above.

## Observability accounts

- **Langfuse**: account created 2026-10-30 under the agent's AgentMail identity
  (`johnnyc@agentmail.to`), org **Factory**, EU region — LIVE-VERIFIED (operator record).
  But: **zero Langfuse SDK imports or env vars exist in any Factory codebase** — the overlay
  mockups showing it live are false (fragment D7). Account ≠ wiring (GAP).
- Rivet traces/Inspector and Port audit + scorecards are the spec'd visibility surfaces
  (ADR-008); Polygraph session/review artifacts feed visibility post-M1 (§13.2).

## Secrets

Factory secrets resolve through the operator's **secrets vault gateway**:
`https://vault-mcp-zeta.vercel.app` (MCP `/mcp`, OpenAPI `/openapi.json`), secrets stored
under project `omniroute.prd` — pointer only; **no secret value ever appears in this plugin,
a Spec, or a unit body** (field 15). Check the vault for an existing secret before asking the
operator for one. Sandbox sessions get scoped repo tokens only (§4.4).

## The repo (meta-repo) layout — SPEC §2 vs live

Mandated (SPEC §2): `AGENTS.md` (index), `specs/` (10 domains), `docs/` (ADRs, master spec),
`tasks/`, `prd/`, `agents/`, `workflows/`, `apps/developer-os`, `apps/factory-gateway`,
`OpenStack.md`, `.well-known/`. Live checkout (LIVE-VERIFIED, repo recon): `specs/` has all 10
domains; `apps/` holds `developer-os`, `factory-gateway`, `project-supervisor`,
`sandbox-harness`; `agents/coder.factory.json` exists (the OpenAgent stub). The master spec
file itself is absent from the repo (JohnnyBox only, above). Working checkout on the
operator's VM: `~/workspace/_scratch/factory-recon`.
