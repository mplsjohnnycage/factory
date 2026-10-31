# LogicSRC overview

**Status:** Resource lookup from live site  
**Date:** 2026-10-28  
**Primary URL:** [https://logicsrc.com/](https://logicsrc.com/)  
**Classification:** Open-specification project (JSON Schema contracts + conventions + reference implementations) — **not** a compiler IR, **not** an ISO/IEEE standard body document, **not** a proprietary platform you must host on.

---

## 1. What it is (evidence)

From [About](https://logicsrc.com/about):

> LogicSRC is the open-specification project from Profullstack, Inc. for coordination between humans, AI agents, plugins, payment systems, and hosted products.

> LogicSRC defines a shared language — open JSON-Schema contracts and conventions — so that independent tools, agents, and services can coordinate without any one vendor owning the standard. Products implement LogicSRC; they don't depend on a proprietary platform to interoperate.

Homepage framing ([https://logicsrc.com/](https://logicsrc.com/)):

> Open schemas, primitives, and conventions for coordination between humans, AI agents, plugins, payment systems, and hosted products.

> Four families of specifications. LogicSRC defines the shared language; products implement it without owning the standard.

Specs index ([https://logicsrc.com/specs](https://logicsrc.com/specs)):

> Four families. Pick one, then a spec, then read its overview or the specification text. Every spec is CC BY 4.0, every rule degrades, and a file at a well-known URL is the whole protocol.

| Label | Fits? | Evidence |
|-------|-------|----------|
| Open-spec / open-standards **project** | **Yes** | About: “open-specification project”; GitHub: “open standards initiative” |
| Family of **software / agent specs** | **Yes** | Specs surface; process family includes ASDLC, OpenPRD, OpenTask… |
| **IR format** (code IR like LLVM) | **No** | Site describes schemas, files at well-known URLs, process/lifecycle docs — not a bytecode/AST IR |
| Formal SDO **standard** (ISO/IEEE) | **No** | Profullstack project; draft maturity on home (“0.1 draft spec”) |
| Hosted **product** only | Partial | Specs are the core; **CommandBoard.run** is the first hosted reference product |

---

## 2. Where to find it

| Role | URL |
|------|-----|
| Home | https://logicsrc.com/ |
| About (definition) | https://logicsrc.com/about |
| Spec families | https://logicsrc.com/specs |
| Agents & process family | https://logicsrc.com/specs/process |
| Docs | https://logicsrc.com/docs |
| OpenSpec.dev comparison | https://logicsrc.com/openspec |
| Source monorepo | https://github.com/profullstack/logicsrc |
| CLI install | `curl -fsSL https://logicsrc.com/install.sh \| sh` |
| App UI | https://app.logicsrc.com/ |

About also states specs/SDKs/CLI/TUI/plugins are developed at `github.com/profullstack/logicsrc`.

---

## 3. What it covers

### Standards surface (About)

From [https://logicsrc.com/about](https://logicsrc.com/about):

- **Identity** — DIDs, OAuth accounts, profiles, and organization membership.
- **Coordination** — boards, tasks, and the workflow primitives agents and humans share.
- **Agents** — agent profiles, capabilities, runs, logs, permissions, and audit trails.
- **Value** — payment, invoicing, and metering hooks.
- **Events** — a common event envelope for policy, audit, and webhooks.

### Four spec families ([https://logicsrc.com/specs](https://logicsrc.com/specs))

1. **People and agents** — “Who someone is, what they have done, and what they offer, in files they own.” (OpenProfile.md, OpenSkill, OpenAgent, AgentByte, …)
2. **Access and credentials** — “Grants you can carry, and the vault the tokens live in.” (OpenAccess, OpenConnection, OpenCreds, Credential Sharing)
3. **Catalogs a site serves about itself** — “One file at a fixed URL, read by directories instead of scraped.” (OpenServer, OpenMCP, OpenSaaS, OpenSite, …)
4. **Agents and process** — “How agents coordinate, settle, stream, and how the software that serves them gets built.” (ASDLC, OpenPRD, OpenSwarm, OpenFleet, OpenTask, OpenWorkflow, …)

### Reference implementation

From About:

> **CommandBoard.run** is the first hosted product built on LogicSRC — a modern BBS where humans and AI agents coordinate work through boards, tasks, DID identity, OAuth, CLI, TUI, plugins, reputation, audit logs, and payments.

Tooling called out on the site/repo: `logicsrc` CLI, `@logicsrc/sdk`, MCP server (`logicsrc mcp` / `@profullstack/logicsrc-mcp`), plugins (CoinPay, uGig), OpenPRD / OpenFleet / OpenOntology packages.

### Vs OpenSpec.dev ([https://logicsrc.com/openspec](https://logicsrc.com/openspec))

Site contrast (paraphrased from comparison page): OpenSpec.dev = lightweight **repo-local** planning for coding agents; LogicSRC = broader **coordination** standard (schemas, agent runs, MCP, CLI/PWA/API). LogicSRC can enable OpenSpec-compatible mode via `logicsrc --openspec`.

---

## 4. Relevance to AI agents building software

### ASDLC — agentic software development lifecycle

Source: [https://logicsrc.com/asdlc](https://logicsrc.com/asdlc)

> The Agentic Software Development Lifecycle: how software gets built when most of the work is done by agents running in parallel, and CI/CD is the only gate that matters.

> When agents write the code, engineering time stops being scarce and two other things become scarce instead: **human attention** and **trunk stability**.

Nine phases (site): Frame → Fan out → Gate locally → Merge → Release → Verify live → Correct → Ratchet → Promote.

Quoted SDLC vs ASDLC row highlights:

| | SDLC | ASDLC |
|---|------|-------|
| Unit of work | A ticket, worked serially | A concern, worked in parallel by N agents |
| Isolation | A branch per developer | A worktree per agent, on one checkout |
| Gate | Code review by a person | A program: typecheck, tests, CI, release guards |
| Done means | Merged | Verified live and announced |
| After an escape | A postmortem | A permanent automated check |

Invariants (site): isolation before parallelism; gate is a program not a person; tooling refuses rather than warns; prod is the honest environment; verified live = done; every escape ratchets.

**Factory take:** Closest LogicSRC artifact to “how agents should build software” — process/lifecycle spec aligned with parallel agents, automated gates, and post-merge verification (compare Factory Rivet/Beads/CI fencing).

### OpenPRD — requirements agents can execute

Source: [https://logicsrc.com/openprd](https://logicsrc.com/openprd)

> A lightweight open standard for product requirements documents authored by humans or AI agents. A repo keeps a numbered, committed collection under `prd/`— one Markdown file per decision, readable a year later.

> A product requirement document an agent can execute and a person can read. *(page title / process-family blurb)*

Fixed front-matter + ten required sections; lifecycle Draft → Review → Accepted → Final; JSON Schema conformance; `logicsrc prd …` tooling. Status cited on page: **0.3**.

**Factory take:** Durable, schema-checked product decisions for human+agent pipelines — adjacent to Factory’s idea/spec → assembly path.

### Other process specs ([https://logicsrc.com/specs/process](https://logicsrc.com/specs/process))

Family intro:

> How agents coordinate, settle, stream, and how the software that serves them gets built.

Notable: OpenFleet (human-controlled agent lineage/caps), OpenSwarm (settlement/proof), OpenTask / OpenWorkflow (portable task meaning, not UI coordinates), OpenErrand (browser automation with human gates), OpenInstall / OpenPkg, OpenOntology, OpenMCP catalogs.

**Factory take:** Coordination and task contracts — useful vocabulary; **not** a substitute for Rivet execution, Port auth/catalog, or Beads readiness.

---

## 5. Bottom line for Factory

1. **LogicSRC = open coordination specs + reference CLI/SDK/MCP/product**, maintained by Profullstack.
2. For agent-built software, read **ASDLC** and **OpenPRD** first.
3. It is **not** a code IR; “file at a well-known URL” / JSON Schema is the interoperability model.
4. Borrow contracts/practices; do not treat it as Factory’s runtime or catalog of record.

---

## 6. Sources (fetched live 2026-10-28)

- https://logicsrc.com/
- https://logicsrc.com/about
- https://logicsrc.com/specs
- https://logicsrc.com/specs/process
- https://logicsrc.com/asdlc
- https://logicsrc.com/openprd
- https://logicsrc.com/openspec
- https://github.com/profullstack/logicsrc
