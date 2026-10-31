# Linear MCP Apps / iframe widget verification

**Status:** Docs/web evidence only (FE-30)  
**Date:** 2026-10-28  
**Scope:** Whether an MCP Apps (sandboxed iframe widget) implementation exists for Linear  
**Non-goals:** No Port mutations; Port capacity deliverables already exist ([port-full-capacity.md](./port-full-capacity.md), [port-factory-data-model.md](./port-factory-data-model.md)); no `factory-master-spec.md` edits

---

## Verdict

**Does not exist.** Linear has an official **tools-only** remote MCP server. There is no documented Linear MCP Apps / `ui://` iframe widget implementation from Linear, the MCP Apps registry/examples, or community projects. There is also no Linear SDK-based public UI widget library for embeddable issue/board widgets.

---

## 1. Linear official MCP server docs

| Check | Result | Source |
|-------|--------|--------|
| MCP Apps / iframe / `ui://` / interactive widget claims | **Absent** | [MCP server – Linear Docs](https://linear.app/docs/mcp) |
| Documented surface | Authenticated remote MCP (Streamable HTTP); tools to find/create/update issues, projects, comments | same |
| Product doc search for “MCP Apps iframe widget UI” | Returns the tools MCP page only; no Apps/UI docs | Linear `search_documentation` |
| Changelog MCP entries | Tools expansions, auth, Agent-as-MCP-client — not Apps | [Linear MCP server](https://linear.app/changelog/2025-05-01-mcp), [Linear MCP for product management](https://linear.app/changelog/2026-02-05-linear-mcp-for-product-management), [Linear Agent MCP support](https://linear.app/changelog/2026-04-23-linear-agent-mcp-support) |

Page scrape + structured extract of [linear.app/docs/mcp](https://linear.app/docs/mcp): `mentions_mcp_apps: false`, `mentions_iframe: false`, `mentions_ui_resource: false`, `mentions_widget: false`. Described capability is tools + OAuth/bearer auth only.

---

## 2. MCP Apps spec / registry for Linear entries

| Check | Result | Source |
|-------|--------|--------|
| MCP Apps extension exists (generic) | **Yes** — servers declare UI via `_meta.ui.resourceUri` / `ui://`; hosts render sandboxed iframes | [MCP Apps Overview](https://apps.extensions.modelcontextprotocol.io/api/documents/overview.html), [MCP Apps announcement](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/) (2026-01-26) |
| Linear named as Apps example / partner | **No** | Official Apps blog examples: `threejs-server`, `map-server`, `pdf-server`, `system-monitor-server`, `sheet-music-server` — no Linear. `site:github.com/modelcontextprotocol/ext-apps linear` → **0 hits** |
| Published Apps launch partners | Amplitude, Asana, Box, Canva, Clay, Figma, Hex, monday.com, Slack, Salesforce — **Linear not listed** | [WorkOS MCP 2026 overview](https://workos.com/blog/everything-your-team-needs-to-know-about-mcp-in-2026) |
| Official MCP Registry `search=linear` | `app.linear/linear` (+ community tool servers) as **remote tools MCP**; no Apps/UI capability fields | [registry.modelcontextprotocol.io/v0.1/servers?search=linear](https://registry.modelcontextprotocol.io/v0.1/servers?search=linear) |

Note: WorkOS lists Linear among **MCP server adopters** (tools), distinct from **MCP Apps launch partners**. That does not imply Apps/iframe support.

---

## 3. Community Linear MCP Apps / iframe widgets

| Project class | What exists | Apps/iframe? | Sources |
|---------------|-------------|--------------|---------|
| Official Linear MCP | Hosted tools at `https://mcp.linear.app/mcp` | No | [Linear MCP docs](https://linear.app/docs/mcp) |
| Community Linear MCPs | Tools CRUD via `@linear/sdk` / GraphQL (e.g. tacticlaunch, cline, touchlab, zalab-inc) | No — tools servers | [tacticlaunch/mcp-linear](https://github.com/tacticlaunch/mcp-linear), [cline/linear-mcp](https://github.com/cline/linear-mcp), [touchlab/linear-mcp-integration](https://github.com/touchlab/linear-mcp-integration), [zalab-inc/mcp-linear-app](https://github.com/zalab-inc/mcp-linear-app) |
| Registry community Linear entries | `io.github.*` Linear MCPs — tools/prompts only | No | [MCP Registry search=linear](https://registry.modelcontextprotocol.io/v0.1/servers?search=linear) |
| Hypothetical mention | Reddit post imagines “Your Linear MCP can ship a triage card” as a *future* Apps benefit | Not an implementation | [r/mcp discussion](https://www.reddit.com/r/mcp/comments/1t58a7n/mcp_apps_shipped_a_few_months_ago_and_almost/) |
| `mkusaka/mcp-server-linear` | Archived tools/resources MCP; `ext-apps` appears only in build allowlist, not as a Linear Apps UI | No | [mkusaka/mcp-server-linear](https://github.com/mkusaka/mcp-server-linear) |

**Finding:** Community Linear MCP work is tools-oriented. No public repo was found that registers Linear-backed `ui://` MCP App resources or iframe widgets using Linear’s API under the MCP Apps extension.

---

## 4. Linear SDK-based UI widget libraries

| Check | Result | Source |
|-------|--------|--------|
| `@linear/sdk` | Typed GraphQL API client (`LinearClient`) — not a UI kit | [Linear SDK docs](https://linear.app/developers/sdk), [npm @linear/sdk](https://www.npmjs.com/package/@linear/sdk) |
| Official open-source packages | `sdk`, `import`, `codegen-doc`, `codegen-sdk`, `codegen-test` — **no UI/widget package** | [linear/linear monorepo](https://github.com/linear/linear) |
| Orbiter design system | Internal to Linear product (Radix-based); **not** a public SDK widget library | [Radix case study: Linear](https://www.radix-ui.com/primitives/case-studies/linear) |
| Aesthetic clones | Third-party “Linear-inspired” UI (e.g. Framer card demos) — not Linear SDK widgets / not MCP Apps | [ui-layouts Linear Card](https://ui-layouts.com/components/linear-modal) |

**Finding:** No Linear-maintained or SDK-based embeddable issue/board iframe/widget library for third-party hosts. Product embeds in Linear’s own editor are inbound (Loom, etc.), not outbound Linear widgets.

---

## Related (out of scope, already delivered)

- Port capacity mapping: [port-full-capacity.md](./port-full-capacity.md)
- Port Factory data model: [port-factory-data-model.md](./port-factory-data-model.md)
- Broader Linear-as-task-manager eval (tools MCP fit): [linear-factory-task-manager.md](./linear-factory-task-manager.md)

---

## Sources

- [MCP server – Linear Docs](https://linear.app/docs/mcp)
- [Linear MCP server – Changelog](https://linear.app/changelog/2025-05-01-mcp) (2025-05-01)
- [Linear MCP for product management – Changelog](https://linear.app/changelog/2026-02-05-linear-mcp-for-product-management) (2026-02-05)
- [Linear Agent MCP support – Changelog](https://linear.app/changelog/2026-04-23-linear-agent-mcp-support) (2026-04-23)
- [MCP Apps Overview](https://apps.extensions.modelcontextprotocol.io/api/documents/overview.html)
- [MCP Apps - Bringing UI Capabilities To MCP Clients](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/) (2026-01-26)
- [modelcontextprotocol/ext-apps](https://github.com/modelcontextprotocol/ext-apps)
- [Official MCP Registry API search=linear](https://registry.modelcontextprotocol.io/v0.1/servers?search=linear)
- [WorkOS: Everything your team needs to know about MCP in 2026](https://workos.com/blog/everything-your-team-needs-to-know-about-mcp-in-2026) (Mar 2026)
- [Getting started – Linear SDK](https://linear.app/developers/sdk)
- [linear/linear – Tools, SDKs and plugins](https://github.com/linear/linear)
- [Radix Primitives – Linear case study](https://www.radix-ui.com/primitives/case-studies/linear)
- Community Linear MCPs: [tacticlaunch/mcp-linear](https://github.com/tacticlaunch/mcp-linear), [cline/linear-mcp](https://github.com/cline/linear-mcp), [touchlab/linear-mcp-integration](https://github.com/touchlab/linear-mcp-integration), [zalab-inc/mcp-linear-app](https://github.com/zalab-inc/mcp-linear-app), [mkusaka/mcp-server-linear](https://github.com/mkusaka/mcp-server-linear)
- [r/mcp: MCP Apps shipped…](https://www.reddit.com/r/mcp/comments/1t58a7n/mcp_apps_shipped_a_few_months_ago_and_almost/) (aspirational only)
