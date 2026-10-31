# Live Port MCP connectors / `_mcp_server` verify

**When:** 2026-10-29  
**Lane:** Meta · FE-123 · Track D of [`mcp-port-single-fanout.md`](./mcp-port-single-fanout.md)  
**Org:** `mplsjohnnycage` / `org_rNq4tjSc8DXL1ceL` (Port MCP read-only)  
**Lock under test:** Single-MCP — Factory control plane = Port remote MCP `https://mcp.port.io/v1` (OpenMCP · ADR-001 · master §18.5)  
**Constraints:** No Observatory · stay public · no Port OAuth mutations · no Ocean/gateway remount

## Verdict

| Check | Result |
|-------|--------|
| Factory MCP entry | **PASS** — only live connector is Port EU → `https://mcp.port.io/v1` |
| `_mcp_server` registry | **PASS** — 13 entities; 12 unexposed inventory; 1 exposed connector |
| Ocean ≠ MCP connectors | **PASS** — 5 Ocean installs are catalog sync only |
| `factory_*` workflows-as-tools | **PASS** — all 7 present via `list_self_service_triggers` |
| Observatory as OAuth / MCP | **PASS** — External Interface apps = `Factory` only; no Observatory/`harness` `_mcp_server` |
| Shadow Factory MCP runtime | **PASS** — no second control-plane MCP; `factory-gateway` remains §4.2.1 writer (not MCP proxy) |
| Vendor MCP ungated mutate | **PASS (live)** — Linear/Vercel/etc. registry rows exist but `exposed: false` |

**Bottom line:** Live Port matches the Single-MCP lock. The only MCP server **exposed as a Port connector** is Port EU itself. Other `_mcp_server` rows are plugin-discovered catalog metadata, not live Factory control routes.

## Method (read-only)

| Call | Purpose |
|------|---------|
| `describe_user_details` | Org identity |
| `list_integrations` | Ocean vs connector separation |
| `list_blueprints` / full `_mcp_server` | Schema: `exposed` = “Expose As Port Connector” |
| `list_entities` `_mcp_server` | Live registry + expose flags |
| `list_entities` `_ai_agent` | Agent → MCP relations |
| `list_entities` `agentPlugin` (mcp_servers non-empty) | Plugin → MCP links |
| `list_external_interface_apps` | Observatory absence |
| `list_workflows` / `list_self_service_triggers` `factory_` | Control-plane tools |
| Repo `/.well-known/openmcp.json` | Advertised entry |

No writes. No External Interface create/delete/revoke. No Observatory touch.

## 1. `_mcp_server` live inventory (13)

Blueprint schema: `exposed` = *“If true, this MCP server will be available as a connector in the Port UI, Port AI, and Port MCP.”*

| Identifier | URL | `exposed` | Role vs Single-MCP |
|------------|-----|-----------|--------------------|
| **`port-eu-mcp`** | `https://mcp.port.io/v1` | **true** | **Sole live Factory connector** — matches OpenMCP `mcp` |
| `mcp-port-us` | `https://mcp.us.port.io/v1` | false | Documented US alternate only (`factory.port_mcp_us`); not exposed |
| `mcp-linear` | `https://mcp.linear.app/mcp` | false | Registry / plugin metadata |
| `mcp-vercel` | `https://mcp.vercel.com` | false | Registry / plugin metadata |
| `mcp-cloudflare` | `https://mcp.cloudflare.com/mcp` | false | Registry / plugin metadata |
| `mcp-figma` | `https://mcp.figma.com/mcp` | false | Registry / plugin metadata |
| `mcp-firecrawl` | `https://mcp.firecrawl.dev/v2/mcp-oauth` | false | Registry / plugin metadata |
| `mcp-mem0` | `https://mcp.mem0.ai/mcp` | false | Registry / plugin metadata |
| `mcp-tinyfish` | `https://agent.tinyfish.ai/mcp/chatgpt` | false | Registry / plugin metadata |
| `mcp-tldraw` | `https://codex-app.tldraw.xyz/mcp` | false | Registry / plugin metadata |
| `mcp-remote-desktop-commander` | `https://mcp.desktopcommander.app/mcp` | false | Registry / plugin metadata |
| `mcp-higgsfield` | `https://openai-mcp.higgsfield.ai/mcp` | false | Registry / plugin metadata |
| `mcp-stitch` | `https://stitch-mcp-beige.vercel.app/mcp` | false | Registry / plugin metadata |

**Observatory / Harness search** on `_mcp_server` (`observ` / `Observ` / `harness` / `Harness` / url `observatory`): **0 entities**.

Unexposed rows share the same catalog note: *“Remote MCP discovered from an installed plugin manifest. Metadata only; authenticate and expose explicitly before use.”* They are **not** live Port→external MCP connector routes until `exposed` is flipped (ops decision; not done here).

`port-eu-mcp` properties of note: `allowed_tools: ["*"]`, `headers: { "x-read-only-mode": "0" }`, `oauth_config: null` (Port-hosted OAuth path).

## 2. Integrations (Ocean) — not MCP connectors

| Identifier | Type | Resync |
|------------|------|--------|
| `github-ocean` | `github-ocean` SaasOAuth2 | completed `06:24–06:26Z` |
| `factory-pilot-github` | `github-ocean` SaasOAuth2 | completed `07:37–07:42Z` |
| `linear` | `linear` Saas | completed `06:24–06:25Z` |
| `vercel-ocean` | `custom` Saas | completed `06:24–06:24Z` |
| `convex-ocean` | `custom` Saas | completed `06:24–06:26Z` |

These persist Context Lake entities. They are **not** Port MCP connectors and do **not** create a second Factory MCP entry. GitHub Ocean has **no** `MCP` / `mcp_server` lake kind table (probe → object missing) — MCP registry is the `_mcp_server` blueprint, not Ocean ingest.

## 3. Agents / plugins → MCP

| Surface | Live |
|---------|------|
| `_ai_agent` with `mcp_servers` | Only **`codex_primary_agent`** → `port-eu-mcp` |
| Other 10 `_ai_agent` | `mcp_servers: []` (tool regex only) |
| `agentPlugin` → MCP | Port / Port Operator → EU (+ Operator also links unexposed US); curated plugins link Linear/Vercel/Figma/Cloudflare/Mem0/Stitch **entities** — those servers remain **`exposed: false`** |

Plugin→entity links populate the registry; they do not by themselves expose connectors.

## 4. Control-plane tools + OAuth client

| Surface | Live |
|---------|------|
| OpenMCP `mcp` | `https://mcp.port.io/v1` |
| `factory_*` workflows (7) | All present; self-service triggers executable |
| External Interface apps | **`Factory` only** (`clientId` `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0`); `lastLoginAt` set |
| Observatory EI app | **Absent** (matches FE-59/85 + OpenAccess `observatory_forbidden`) |

## 5. Gaps vs Single-MCP (named)

| Gap | Severity | Notes |
|-----|----------|-------|
| 12 unexposed vendor/US `_mcp_server` rows in catalog | Soft | Inventory only; lock holds while `exposed` stays false. Exposing vendor MCP would reopen the “ungated mutate” ban — require explicit ops + Port RBAC. |
| `mcp-port-us` unexposed | Soft / intentional | OpenMCP documents US as alternate host; EU is the live connector. |
| Port MCP tools have no separate `list_connectors` API | Soft | Connector truth = `_mcp_server.exposed` per blueprint schema. |
| `factory-gateway` WEBHOOK remount | Out of scope here | §4.2.1 writer / HMAC — not an MCP surface; tracked in [`factory-gateway-public-url.md`](./factory-gateway-public-url.md). |
| Ocean dual-write fencing | Separate | Meta unmap done ([`ocean-meta-unmap.md`](./ocean-meta-unmap.md)); not an MCP connector issue. |

**No gap** that Dev OS, App Router, Observatory, or `factory-gateway` is a live Factory control-plane MCP.

## Hard bans reconfirmed

- Do not host Port control-plane MCP inside Dev OS App Router.  
- Do not configure Harness Observatory as Factory OAuth / MCP client.  
- Do not dual-write Port catalog outside §4.2.1 `factory-gateway`.  
- Do not treat vendor MCP (Linear / Rivet / Vercel / …) as ungated Factory mutation path.  
- Repo stays public.

## Related

- Sibling fan-out: [`mcp-port-single-fanout.md`](./mcp-port-single-fanout.md) (Track D)  
- Prep inventory (pre-live connectors): [`port-prep-inventory.md`](./port-prep-inventory.md) §2  
- Capacity docs (connectors concept): [`port-full-capacity.md`](./port-full-capacity.md) §4  
- OAuth SoT: [`port-factory-oauth-live.md`](./port-factory-oauth-live.md)
