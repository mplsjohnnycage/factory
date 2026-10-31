# Factory open-source analogs survey

**Status:** Document-only survey (FE-20)  
**Date:** 2026-10-28  
**Scope:** Public GitHub / official docs analogs for five Factory architecture slices. Not endorsements; not a build plan.  
**Factory stack baseline:** [`factory-master-spec.md`](./factory-master-spec.md), [`factory-stack-audit.md`](./factory-stack-audit.md), [`rivet-engineering-spec.md`](./rivet-engineering-spec.md)

**Method:** Live web search + GitHub About/`LICENSE` (SPDX where API reports it). Claims without a citation are marked **UNVERIFIABLE**. Licenses can change — re-check before adoption.

**Factory stack shorthand (for “mapping” columns):**

| Factory piece | Role |
|---------------|------|
| **Port** | Catalog / RBAC / workflows / MCP gateway / audit (SoR) |
| **Rivet** | Durable actors, queues, execution kernel |
| **ASDLC Spec** | Spec-anchored agentic SDLC (Blueprint + Contract) |
| **Sandbox Agent + Docker** | In-sandbox coding harness; container/microVM isolation |
| **Developer OS** | Next.js/Vercel shell; Rivet-native stream; CopilotKit/AG-UI **deferred** |
| **Beads / Polygraph / Trail-Code** | Ready graph / multi-repo coord / code-map for agents |

---

## 1. Bridging Rivet-like durable actors → AG-UI / CopilotKit / agent-UI

**Finding:** No first-party **Rivet ↔ AG-UI** bridge appears in AG-UI’s supported-framework tables ([AG-UI Overview](https://docs.ag-ui.com/introduction); Project ADR-011 / audit §§19–22). Closest OSS pattern = **durable/checkpointed agent runtime + AG-UI adapter + CopilotKit client**.

| Project | Repo | What it does | Factory mapping | License |
|---------|------|--------------|-----------------|---------|
| **AG-UI protocol** | [ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui) | Event protocol for Agent↔User Interaction; integrations for LangGraph, CrewAI, Mastra, Cloudflare Agents, Bedrock AgentCore, etc. ([docs](https://docs.ag-ui.com/introduction)) | Target wire format for deferred Developer OS agent UI; **not** Rivet-native | MIT |
| **CopilotKit** | [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | AG-UI client + generative UI (React/etc.); runtime adapters to agent backends ([docs](https://docs.copilotkit.ai/)) | Deferred Developer OS client stack (ADR-011) | MIT |
| **LangGraph + AG-UI** | [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) + [`@ag-ui/langgraph` / `ag_ui_langgraph`](https://github.com/ag-ui-protocol/ag-ui) | Durable graph agents with checkpoints/interrupts; first-class AG-UI adapters stream HITL as AG-UI events ([CopilotKit LangGraph](https://docs.copilotkit.ai/langgraph/); [AG-UI Dojo](https://dojo.ag-ui.com/)) | Closest **durable runtime → AG-UI** pattern (checkpointing ≈ Rivet durability *role*, different product) | MIT (LangGraph) |
| **Mastra ↔ AG-UI / CopilotKit** | [ag-ui Mastra integration](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/mastra/typescript) | Registers Mastra agents through AG-UI for CopilotKit ([docs](https://docs.copilotkit.ai/mastra/)) | Agent-framework → AG-UI adapter pattern Factory would invent for Rivet | see AG-UI monorepo (MIT) |
| **Cloudflare Agents ↔ AG-UI** | [cloudflare/agents](https://github.com/cloudflare/agents) + [community AG-UI integration](https://github.com/ag-ui-protocol/ag-ui/tree/main/integrations/community/cloudflare-agents) | Edge Durable Object–style agents with community AG-UI bridge ([AG-UI supported list](https://docs.ag-ui.com/introduction)) | Durable-actor *platform* with AG-UI path (Cloudflare DO class ≠ Rivet) | MIT (agents SDK) |
| **AWS Bedrock AgentCore + AG-UI** | Platform docs: [runtime AG-UI](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-agui.html); template [awslabs/fullstack-solution-template-for-agentcore](https://github.com/awslabs/fullstack-solution-template-for-agentcore) | Managed agent runtime with first-party AG-UI contract | Managed durable agent host ↔ AG-UI (commercial control plane; OSS template) | see template repo |
| **Rivet (execution only)** | [rivet-dev/rivet](https://github.com/rivet-dev/rivet) | Durable actors for stateful/AI workloads ([rivet.dev](https://rivet.dev/)) | Factory kernel — **no AG-UI listing** | Apache-2.0 |
| **Rivet Agents** | [rivet-dev/agents](https://github.com/rivet-dev/agents) | Durable process-per-agent with surviving memory | Rivet-side agent durability primitive; still not AG-UI | Apache-2.0 |

**Gap:** A Factory **Rivet Actor → AG-UI event projector** would be net-new design (same adapter class as LangGraph/Mastra integrations), not a vendor product.

**Sources:** [docs.ag-ui.com/introduction](https://docs.ag-ui.com/introduction), [docs.copilotkit.ai/langgraph](https://docs.copilotkit.ai/langgraph/), GitHub repos above, Project [`frontend-stack-feed.md`](../internal/frontend-stack-feed.md).

---

## 2. Open-source MCP gateway implementations (beyond Port)

Port remains Factory’s intended governed MCP gateway / registry (ADR-001). These are **self-hostable OSS alternatives or complements**, not Port replacements with Port’s Context Lake/RBAC model.

| Project | Repo | What it does | Factory mapping | License |
|---------|------|--------------|-----------------|---------|
| **IBM ContextForge** | [IBM/mcp-context-forge](https://github.com/IBM/mcp-context-forge) | AI gateway/registry/proxy federating MCP, A2A, REST/gRPC with governance, discovery, observability | Closest **enterprise MCP + A2A federation** analog to Port’s MCP connectors / gateway role | Apache-2.0 |
| **Docker MCP Gateway** | [docker/mcp-gateway](https://github.com/docker/mcp-gateway) | `docker mcp` CLI plugin; routes clients to MCP servers running in Docker; catalog/profile model ([README](https://github.com/docker/mcp-gateway)) | Aligns with Factory Docker-heavy sandbox path; local/dev MCP aggregation | MIT |
| **Microsoft MCP Gateway** | [microsoft/mcp-gateway](https://github.com/microsoft/mcp-gateway) | K8s reverse proxy + session-aware routing + MCP server lifecycle | Cluster-scale MCP data plane (Port-like routing without Port catalog) | MIT |
| **MCP Gateway Registry** | [agentic-community/mcp-gateway-registry](https://github.com/agentic-community/mcp-gateway-registry) | Enterprise gateway + registry; OAuth/OIDC; inventory/audit; grew toward AI asset registry | Port-shaped **control plane + data plane** split | Apache-2.0 |
| **MetaMCP** | [metatool-ai/metamcp](https://github.com/metatool-ai/metamcp) | Aggregator / orchestrator / middleware / gateway in Docker | Lightweight multi-server composition | MIT |
| **Lasso MCP Gateway** | [lasso-security/mcp-gateway](https://github.com/lasso-security/mcp-gateway) | Plugin-based orchestration of other MCP servers | Policy/plugin layer in front of tool MCPs | MIT |
| **Unla** | [AmoyLab/Unla](https://github.com/AmoyLab/Unla) | Go gateway: REST→MCP and MCP proxy; SSE / Streamable HTTP; management UI | Zero-code API→MCP exposure (Factory “MCP Apps / tools” packaging adjacent) | MIT |
| **Bifrost** | [maximhq/bifrost](https://github.com/maximhq/bifrost) | Combined LLM + MCP + agent gateway (OpenAI-compatible) | OmniRouter/OmniRoute-class gateway with MCP plane | Apache-2.0 |
| **mcp-proxy (stdio↔HTTP)** | [sparfenyuk/mcp-proxy](https://github.com/sparfenyuk/mcp-proxy) | Bridge Streamable HTTP ↔ stdio MCP transports | Transport adapter (not full governance gateway) | MIT |
| **open-mcp-proxy** | [grll/open-mcp-proxy](https://github.com/grll/open-mcp-proxy) | Lightweight bidirectional MCP proxy with callbacks | Custom policy hooks at proxy boundary | MIT |
| **Awesome list** | [e2b-dev/awesome-mcp-gateways](https://github.com/e2b-dev/awesome-mcp-gateways) | Curated index of MCP gateways | Discovery aid (Obot, Pomerium, Open Edison, etc.) | — (list) |

**Sources:** GitHub About/LICENSE for each repo; [awesome-mcp-gateways](https://github.com/e2b-dev/awesome-mcp-gateways); Port role from [`port-capabilities.md`](./port-capabilities.md).

---

## 3. Spec-driven agentic SDLC frameworks (ASDLC-like)

Factory locks **ASDLC Spec** (`/specs/{domain}/spec.md` Blueprint+Contract) as the build-against artifact (ADR-004). Analogs below are **methodology / toolkit** peers.

| Project | Repo | What it does | Factory mapping | License |
|---------|------|--------------|-----------------|---------|
| **ASDLC.io knowledge base** | [villetakanen/asdlc-io](https://github.com/villetakanen/asdlc-io) | Patterns/practices for Agentic SDLC; MCP server + downloadable skill | Direct **ASDLC** lineage (Factory skill installed from zip; same domain vocabulary) | MIT |
| **GitHub Spec Kit** | [github/spec-kit](https://github.com/github/spec-kit) | Spec-driven development toolkit / Specify CLI for AI coding agents | Spec→implement workflow peer to ASDLC Spec production | MIT |
| **OpenSpec** | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) ([docs](https://openspec.dev/docs)) | Lightweight SDD layer for AI coding assistants | Spec planning/implement loop; less Port/Rivet coupled | MIT |
| **BMAD Method** | [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | Agentic agile method with structured agent roles/workflows | Multi-agent SDLC process pack | MIT (LICENSE file; GitHub SPDX `NOASSERTION`) |
| **Agentic SDLC Spec Kit (Tikal)** | [tikalk/agentic-sdlc-spec-kit](https://github.com/tikalk/agentic-sdlc-spec-kit) | Spec-driven Agentic SDLC toolkit with agent integrations | Spec Kit × ASDLC branding overlap | MIT |
| **Chainloop** | [chainloop-dev/chainloop](https://github.com/chainloop-dev/chainloop) | Agentic SDLC infrastructure: guardrails, signed evidence, policy-as-code over AI/CI signals | Closest to Factory **visibility/accept** (audit + attestations + CI), not Spec authorship | Apache-2.0 |
| **LogicSRC** (interop, not SDLC method) | See [`logic-src-overview.md`](./logic-src-overview.md) / logicsrc.com | Open schemas (OpenPRD, OpenAgent, OpenWorkflow, …) | Factory **interop emission** from Specs — complementary, not Spec replacement | see LogicSRC repos |

**Sources:** GitHub repos above; ASDLC skill in Project store; Factory ADR-004 in [`factory-master-spec.md`](./factory-master-spec.md).

---

## 4. Docker sandboxes + durable agent execution

Factory: Rivet-orchestrated **Sandbox Agent** with **Docker provider** isolation (ADR-006); Docker **Sandboxes** microVMs are a related but distinct Docker product ([docs.docker.com/ai/sandboxes](https://docs.docker.com/ai/sandboxes/); audit §8).

| Project | Repo / docs | What it does | Factory mapping | License |
|---------|-------------|----------------|-----------------|---------|
| **Rivet + Sandbox Agent** | [rivet-dev/rivet](https://github.com/rivet-dev/rivet); [rivet-sandbox-agent.md](./rivet-sandbox-agent.md) | Durable actors orchestrating coding agents; Docker (and other) providers | **Factory kernel + harness** | Apache-2.0 |
| **Rivet Agents** | [rivet-dev/agents](https://github.com/rivet-dev/agents) | Durable per-agent process/memory | Durable agent side of Rivet stack | Apache-2.0 |
| **E2B** | [e2b-dev/E2B](https://github.com/e2b-dev/E2B) ([e2b.dev](https://e2b.dev/)) | Open-source Firecracker microVM sandboxes for AI code; SDKs | Sandbox isolation peer (microVM class like Docker Sandboxes; often paired with agents) | Apache-2.0 |
| **Daytona** | [daytonaio/daytona](https://github.com/daytonaio/daytona) ([docs](https://www.daytona.io/docs/)) | OCI/Docker-compatible elastic sandboxes for AI-generated code; persistence; listed as Rivet Sandbox Agent provider in Factory audit | Closest **sandbox platform** peer to Factory isolation layer | AGPL-3.0 (LICENSE at tag `v0.190.0`; confirm current default branch) |
| **OpenHands** | [OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) | Open agentic coding platform; Docker/remote runtimes (third-party E2B/Daytona/Modal historically split out) | Full coding-agent product (Rivet+Sandbox Agent role combined) | MIT |
| **Docker Sandboxes** | [docs.docker.com/ai/sandboxes](https://docs.docker.com/ai/sandboxes/) | Agent isolation in per-agent **microVMs** (not shared-kernel containers) | Isolation model Factory cites; first-party Rivet↔Docker Cloud Sandboxes adapter still **UNVERIFIABLE** | Docker product (not a single SPDX OSS repo) |
| **Modal Sandboxes** | [modal.com/docs/guide/sandboxes](https://modal.com/docs/guide/sandboxes); example [modal-labs/claude-managed-agents-modal-sandbox](https://github.com/modal-labs/claude-managed-agents-modal-sandbox) | Managed container sandboxes for long-running agents | Cloud sandbox backend alternative | see example repo |

**Sources:** Rivet/E2B/Daytona/OpenHands GitHub; Docker Sandboxes docs; [`factory-stack-audit.md`](./factory-stack-audit.md) §8; [`rivet-sandbox-agent.md`](./rivet-sandbox-agent.md).

---

## 5. Code-atlas / dependency-graph visualization (multi-repo)

Factory notes reference **Trail-Code / Graft** as the agent code-map, **Polygraph** for multi-repo coordination, and “Code Atlas” as a hero/intel concept — **no single verified “Code Atlas” product** matching that name ([audit §7.4](./factory-stack-audit.md)).

| Project | Repo | What it does | Factory mapping | License |
|---------|------|--------------|-----------------|---------|
| **Trail-Code (Graft)** | [trailhq/Trail-Code](https://github.com/trailhq/Trail-Code) ([trailhq.com/graft](https://trailhq.com/graft)) | Self-learning context layer / code map (functions, callers) + learnings for coding agents | Factory’s cited **code-map** component | MIT |
| **Beads** | [gastownhall/beads](https://github.com/gastownhall/beads) | Distributed dependency-aware issue graph for agents (`bd ready` / claim) | Ready/dependency **task** graph (not AST code atlas) | MIT |
| **Infigraph** | [intuit/infigraph](https://github.com/intuit/infigraph) | AST + SCIP enrichment; Cypher over codebase; **multi-repo** grouping / cross-repo queries | Strongest OSS **multi-repo code graph** peer to “Code Atlas” ambition | Apache-2.0 (LICENSE file; GitHub SPDX `NOASSERTION`) |
| **Code-Graph-RAG** | [vitali87/code-graph-rag](https://github.com/vitali87/code-graph-rag) | Tree-sitter → embedded graph DB; monorepo multi-language RAG | Agent-facing code structure intelligence | MIT |
| **SCIP** | [scip-code/scip](https://github.com/scip-code/scip) (Sourcegraph SCIP protocol) | Code intelligence index format feeding precise graphs/nav | Index substrate for atlas-style tools | Apache-2.0 |
| **dependency-cruiser** | [sverweij/dependency-cruiser](https://github.com/sverweij/dependency-cruiser) | Validate/visualize JS/TS module graphs | Single-repo / package dep visualization | MIT |
| **Madge** | [pahen/madge](https://github.com/pahen/madge) | Module dependency graphs / cycles | Lightweight dep viz | MIT |
| **Nx graph** | [nrwl/nx](https://github.com/nrwl/nx) ([nx.dev](https://nx.dev)) | Project graph for monorepos (and Polygraph adjacency via Nx team) | Monorepo project graph; Polygraph is commercial multi-repo meta-harness ([trypolygraph.com](https://trypolygraph.com/)) | MIT |

**Sources:** GitHub repos; Trail-Code / Beads / Polygraph sections in [`factory-stack-audit.md`](./factory-stack-audit.md) §§5–7.

---

## Summary — strongest analogs per category

| # | Category | Top OSS finds |
|---|----------|---------------|
| 1 | Durable actors → AG-UI | **LangGraph + `@ag-ui/langgraph`**, **Mastra AG-UI**, **Cloudflare Agents AG-UI**; Rivet itself has **no** AG-UI bridge |
| 2 | MCP gateways | **IBM ContextForge**, **Docker MCP Gateway**, **Microsoft MCP Gateway**, **agentic-community MCP Gateway Registry** |
| 3 | Spec-driven agentic SDLC | **asdlc-io**, **github/spec-kit**, **OpenSpec**, **BMAD-METHOD**; **Chainloop** for evidence/guardrails |
| 4 | Sandboxes + durable agents | **Rivet (+ Agents)**, **E2B**, **Daytona**, **OpenHands**; Docker Sandboxes docs for microVM model |
| 5 | Code atlas / multi-repo graph | **Trail-Code**, **Infigraph**, **Code-Graph-RAG**, **SCIP**; Beads for task graphs; Nx/Polygraph for monorepo/meta-harness |

---

## Sources (index)

- [AG-UI Overview](https://docs.ag-ui.com/introduction)
- [CopilotKit LangGraph](https://docs.copilotkit.ai/langgraph/)
- [Docker AI Sandboxes](https://docs.docker.com/ai/sandboxes/)
- [Daytona docs](https://www.daytona.io/docs/)
- [OpenSpec docs](https://openspec.dev/docs)
- [Polygraph](https://trypolygraph.com/) / [docs](https://docs.trypolygraph.com/)
- [Trail Graft](https://trailhq.com/graft)
- [e2b-dev/awesome-mcp-gateways](https://github.com/e2b-dev/awesome-mcp-gateways)
- GitHub repos linked in tables (SPDX from GitHub API / LICENSE files, 2026-10-28)
- Project: [`factory-master-spec.md`](./factory-master-spec.md), [`factory-stack-audit.md`](./factory-stack-audit.md), [`frontend-stack-feed.md`](../internal/frontend-stack-feed.md)
