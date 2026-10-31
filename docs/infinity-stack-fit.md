# Infinity — Factory stack fit

**Status:** FE-42 evaluation (document only)  
**Date:** 2026-10-28  
**Primary sources:** [infinity.hydro.run](https://infinity.hydro.run/), linked docs, [hydro.run](https://hydro.run/), [github.com/hydro-project/infinity](https://github.com/hydro-project/infinity)  
**Factory baseline:** [factory-master-spec.md](./factory-master-spec.md) ADRs + Proposed Architecture  
**Prior store mentions:** only FE-42 in `notes.md` (no prior Infinity / hydro.run tech writeups under `docs/`)

**Method note:** Context `web-scrape` / `web-map` of infinity.hydro.run + docs; GitHub/crates.io APIs for dates. Bright Data scrape returned auth failure; Exa MCP needed auth — not used.

---

## 1. What Infinity is

Infinity is an open-source **Rust agent stack** with three entry layers ([homepage](https://infinity.hydro.run/)):

| Layer | Role |
|-------|------|
| **Infinity Runtime** | Time-sliced agent runtime: short non-blocking **execution slices**, hibernating idle agents as stored history (~100 KB after 20 tool turns; marketed “75k agents on a Raspberry Pi”). Actor-like **agent systems** with per-thread FIFO mailboxes. Embed locally or run on **AWS Lambda** (SQS FIFO + Aurora DSQL + DynamoDB) via CDK. ([Runtime overview](https://infinity.hydro.run/docs/infinity-runtime/overview), [Architecture](https://infinity.hydro.run/docs/infinity-runtime/architecture)) |
| **Reactive Agent Protocol (RAP)** | Open **async tool protocol**: fire-and-forget HTTP invoke + callback URL; subscriptions and long-running tools without holding connections. Explicitly positioned as complement to synchronous MCP. ([What is RAP?](https://infinity.hydro.run/docs/rap/what-is-rap), [MCP compatibility](https://infinity.hydro.run/docs/rap/about/mcp-compatibility), [RAP spec](https://infinity.hydro.run/docs/rap/spec/overview)) |
| **Infinity Code** | Local coding harness on the runtime: sandboxed jj/git worktrees, parallel threads, daemon + TUI/web UI, MCP/RAP tools, ACP editor mode. ([Infinity Code](https://infinity.hydro.run/docs/infinity-code/overview)) |

Docs also live under canonical host `reactiveagentprotocol.dev` (OG/canonical on scraped pages).

---

## 2. Who makes it

A **Hydro** project ([hydro.run](https://hydro.run/), [hydro-project/infinity](https://github.com/hydro-project/infinity)). Site footer: co-led by open-source developers from the [Sky Computing Lab](https://sky.cs.berkeley.edu) (UC Berkeley), **Amazon Web Services**, and participating institutions.

Hydro itself: UC Berkeley research lineage (Joe Hellerstein et al.); core team at Berkeley + AWS ([People](https://hydro.run/people/)). License: **Apache-2.0**.

---

## 3. Release date (verified)

| Milestone | Date | Source |
|-----------|------|--------|
| GitHub repo created | **2026-04-13** | GitHub API `created_at` |
| Earliest public GitHub Releases | **2026-09-03** (`rap-protocol-v0.1.0` … then `infinity-agent-core-v0.1.0` same day) | [Releases](https://github.com/hydro-project/infinity/releases) |
| crates.io first publish (`infinity-agent-core` / `infinity-agent-cli` 0.1.0) | **2026-09-03** | crates.io API |
| Latest crate line | **0.2.0** on **2026-10-22** | crates.io / GitHub tags |

No dated “launch blog” found on infinity.hydro.run itself. **Earliest verifiable public artifact date: 2026-09-03** (first GitHub Releases + crates.io). Repo existence from April 2026.

---

## 4. What problem it solves

Agents spend most of their life **waiting** (builds, webhooks, humans). Process-per-agent or blocking-tool runtimes pay for that wait. Infinity’s claim:

1. **Never block a slice** on external I/O — yield after dispatch; wake on the next message.  
2. **Hibernate for free** — idle agent = conversation bytes, not a held process.  
3. **Async tools as protocol** — RAP so tool servers can answer agents that currently have no process.  
4. **Same code local + serverless** — Lambda scale-to-zero as the hibernation mechanism.

Secondary product: Infinity Code as a concurrent coding agent with stacked sandboxes.

---

## 5. Fit vs Factory stack

Factory M1 (ADR-001…011 + [Proposed Architecture](./factory-master-spec.md#proposed-architecture-m1-index)):

```txt
Port (SoT/catalog/RBAC/MCP) → thin gateway → Rivet ProjectSupervisor → Sandbox Agent (Docker) → GitHub
Developer OS (Next.js/Vercel) ← Rivet Actor realtime
```

| Factory piece | Infinity relation |
|---------------|-------------------|
| **Port** | No overlap as SoT/RBAC/catalog/audit. Infinity is not a governance plane. |
| **Rivet 2.x** | **Strong conceptual overlap** with Infinity Runtime (actors/queues, durable ordered work, wake-on-message). Factory already locked Rivet as execution kernel (ADR-002/003); Rivet never polls Port. Infinity is a competing agent-runtime center of gravity, not a drop-in Rivet peer. |
| **Thin gateway** | Unrelated. Port webhook HMAC + §4.2.1 catalog writer stay Factory-owned. |
| **Sandbox Agent / ADR-006** | **Overlap with Infinity Code** (sandboxed coding harness). M1 harness is Rivet-orchestrated Sandbox Agent + Claude Code — not Infinity Code. |
| **Developer OS** | No fit. Infinity’s UI is its own daemon/web TUI; Factory shell is Next.js/Vercel + Rivet-native stream (ADR-011). |
| **MCP Apps** | No fit. Infinity bridges MCP as **tools** into RAP/runtime; it does not implement MCP Apps (`ui://` iframes). Factory MCP Apps stay ADR-010 / Developer OS. |

**Net:** Infinity addresses “async agent concurrency / hibernate while waiting” — a real problem — but Factory already assigns durable admit + session lifecycle to **Rivet** and coding isolation to **Sandbox Agent**. Infinity does not fill a missing Factory plane for M1.

---

## 6. Overlap vs complement

| Area | Verdict |
|------|---------|
| Port catalog / RBAC / MCP gateway | **Complement (orthogonal)** — Port stays front door; Infinity does not replace it. |
| Rivet actors / queues / supervisor | **Overlap (substitute-class)** — dual kernels would fight ownership of admit, recovery, and session identity. |
| MCP tools | **Partial complement** — Infinity consumes MCP via bridge/proxy; RAP adds async/subscription semantics MCP lacks. Factory already aggregates tools behind Port MCP. |
| Coding harness | **Overlap** — Infinity Code vs Sandbox Agent + Claude Code. |
| MCP Apps / Developer OS chrome | **Neither** — different product surface. |

Interesting research complement only: **RAP** as an open async-tool contract (subscriptions, multi-day callbacks) if Factory later needs protocol-level hibernation for tools that outlive MCP sync calls — without adopting Infinity Runtime as the kernel.

---

## 7. Compatibility / integration considerations

- **Language/runtime:** Rust-first; Factory M1 orchestration is TypeScript (gateway, Rivet clients, Developer OS). Embedding Infinity Runtime means a second language/runtime boundary.  
- **Deploy model:** Infinity’s first-class cloud path is **AWS Lambda + SQS FIFO**; Factory M1 topology is **desktop Rivet Compose + Tailscale Serve + Vercel** ([§13.4](./factory-master-spec.md)). Mismatch, not unblockable but invasive.  
- **MCP:** Compatible as a client of MCP servers ([MCP compatibility](https://infinity.hydro.run/docs/rap/about/mcp-compatibility)); does **not** replace Port’s MCP gateway or Factory MCP Apps hosts.  
- **Authz:** No Port External Interface / RBAC story. Wiring Infinity agents to privileged Factory actions would still need Port workflows + gateway fencing.  
- **Harness:** Infinity Code sandboxes (jj/git worktrees) ≠ Rivet Sandbox Agent Docker provider (ADR-006). Dual harnesses break single-admit / correlation ID contracts.  
- **Maturity:** Public crates ~7 weeks old (0.1 → 0.2); research/AWS-backed OSS — viable to watch, not a locked Factory dependency.

---

## 8. Recommendation: **defer**

**Do not add Infinity Runtime or Infinity Code to the Factory stack for M1 (or as a Rivet/Sandbox substitute).** Rationale:

1. ADRs already freeze **Port SoT** and **Rivet execution** — Infinity Runtime is a parallel kernel, not a complementary sidecar.  
2. Coding path is locked to **Sandbox Agent + Claude Code** — Infinity Code duplicates that plane.  
3. No gap in Developer OS / MCP Apps / thin gateway that Infinity closes.  
4. Adopting it now forces dual admit ownership, dual harnesses, and AWS-Lambda-shaped topology against the locked desktop Rivet pilot.

**Optional later revisit (still “defer,” not “add”):** track **RAP** as an open-standards candidate in post-M1 research if long-running async tool subscriptions become a concrete Factory pain MCP cannot express — evaluate RAP servers **behind** Port/Rivet, never as a second supervisor. Re-open only with an ADR that preserves ADR-001/002/006.

**Skip** would also be defensible for product adoption; **defer** is preferred so RAP can stay on the open-standards watchlist without implying stack membership.

---

## Sources

- https://infinity.hydro.run/  
- https://infinity.hydro.run/docs/infinity-runtime/overview  
- https://infinity.hydro.run/docs/infinity-runtime/architecture  
- https://infinity.hydro.run/docs/rap/what-is-rap  
- https://infinity.hydro.run/docs/rap/about/mcp-compatibility  
- https://infinity.hydro.run/docs/rap/spec/overview  
- https://infinity.hydro.run/docs/infinity-code/overview  
- https://hydro.run/ · https://hydro.run/people/  
- https://github.com/hydro-project/infinity · crates.io `infinity-agent-core` / `infinity-agent-cli`  
- Factory: [factory-master-spec.md](./factory-master-spec.md) ADRs 001–011 + Proposed Architecture  
