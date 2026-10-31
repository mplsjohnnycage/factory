# Factory open standards catalog

**Status:** Document-only survey (FE-23)  
**Date:** 2026-10-28  
**Scope:** Open standards and community specifications relevant to Factory architecture.  
**Out of scope:** Proprietary products/SaaS control planes; **LogicSRC product schemas** (interop emission only — see [`logicsrc-artifact-inventory.md`](./logicsrc-artifact-inventory.md)); vendor SDKs that are not protocol specs.

**Factory baseline:** [`factory-master-spec.md`](./factory-master-spec.md), [`iso-12207-overview.md`](./iso-12207-overview.md), [`factory-oss-analogs.md`](./factory-oss-analogs.md)

**Method:** Live web research of official / foundation / community homes. Claims without a cited URL are marked **UNVERIFIABLE**.

### Factory mapping shorthand

| Factory piece | Role |
|---------------|------|
| **Port** | Catalog / RBAC / workflows / MCP gateway / audit (SoR) |
| **Rivet** | Durable actors, queues, execution kernel |
| **ASDLC Spec** | Spec-anchored Blueprint + Contract (`/specs/{domain}/spec.md`) |
| **Sandbox Agent** | In-sandbox coding harness (Docker provider) |
| **Developer OS** | Next.js/Vercel shell; Rivet-native stream; CopilotKit/AG-UI **deferred** |
| **Visibility / accept** | Port audit + Rivet traces + Polygraph evals + GitHub CI on SHA |
| **Beads / Polygraph / Trail-Code** | Ready graph / multi-repo coord / code-map |

---

## 1. Agent coordination

Protocols for **agent↔agent** discovery, delegation, messaging, and identity — complementary to MCP (agent↔tools) and AG-UI (agent↔user).

| Name | Maintainer | URL | What it defines | Factory mapping |
|------|------------|-----|-----------------|-----------------|
| **Agent2Agent (A2A)** | Linux Foundation ([a2aproject](https://github.com/a2aproject/A2A)); originated by Google | [a2a-protocol.org](https://a2a-protocol.org/latest/); [spec](https://a2a-protocol.org/latest/specification/) | Peer agent interoperability: **Agent Cards**, tasks/artifacts, messages/parts, JSON-RPC over HTTP(S), SSE streaming, auth schemes; opaque agents (no shared memory/tools required) | Cross-agent / cross-org delegation beside Port workflows; Factory multi-agent handoffs (supervisor ↔ specialists) without exposing Rivet internals. Not a Rivet substitute. |
| **AGNTCY (Internet of Agents)** | Linux Foundation ([agntcy](https://github.com/agntcy)) | [agntcy.org](https://agntcy.org/); [docs](https://docs.agntcy.org/) | Open stack for agent **discovery** (OASF), **identity**, **messaging** (SLIM), **observability/evaluation**; designed to work with A2A + MCP | Enterprise federation layer over Port MCP connectors + Rivet traces; directory/identity for OpenFleet-class agent registries |
| **Agent Communication Protocol (ACP)** — legacy | Originally IBM Research / BeeAI ([i-am-bee/acp](https://github.com/i-am-bee/acp)); community docs at [agentcommunicationprotocol.dev](https://agentcommunicationprotocol.dev/introduction/welcome) | Historical REST multimodal agent messaging (runs, messages, await, sessions) | **Merged / redirected toward A2A** in community reporting — do not design new Factory surfaces on ACP alone; treat as migration reference |

**Layering (community consensus):** MCP = tools/data; A2A/AGNTCY = agent coordination; AG-UI = user interaction ([AG-UI Overview](https://docs.ag-ui.com/introduction)).

---

## 2. Spec-driven development (SDD)

There is **no single ISO “SDD standard.”** SDD is a methodology spectrum (spec-first → **spec-anchored** → spec-as-source) revived for AI coding assistants ([arxiv:2602.00180](https://arxiv.org/abs/2602.00180v1)). Factory locks **spec-anchored** ASDLC Specs (ADR-004): Specs are living state; code remains runtime SoT.

| Name | Maintainer | URL | What it defines | Factory mapping |
|------|------------|-----|-----------------|-----------------|
| **SDD practice spectrum** (literature) | Research / practitioner community | [Spec-Driven Development paper](https://arxiv.org/abs/2602.00180v1); [IBM SDD overview](https://www.ibm.com/think/topics/spec-driven-development) | Shared vocabulary: write/agree machine-usable specs before or alongside implementation; rigor levels | Explains Factory **spec-anchored** choice vs LogicSRC-as-IR or code-first vibe coding |
| **Gherkin** | Cucumber open-source community | [cucumber.io/docs/gherkin](https://cucumber.io/docs/gherkin/reference/) | Executable scenario language (`Feature` / `Scenario` / `Given`–`When`–`Then`) | **Contract scenarios** in every `/specs/*/spec.md` (Factory master Spec skeleton) |
| **OpenAPI Specification** | OpenAPI Initiative (Linux Foundation) | [spec.openapis.org](https://spec.openapis.org/oas/); [v3.1.0](https://spec.openapis.org/oas/v3.1.0.html) | HTTP API description (paths, schemas, security) as machine-readable contract | REST surfaces for Port External Interfaces, Developer OS BFF, gateway APIs — design-first + codegen/mock/contract-test |
| **AsyncAPI** | AsyncAPI Initiative (Linux Foundation) | [asyncapi.com](https://www.asyncapi.com/); [v3.1.0](https://www.asyncapi.com/docs/reference/specification/v3.1.0) | Protocol-agnostic event/async API descriptions | Rivet/Port webhook + event buses; `logicsrc.event`-class streams |
| **Arazzo** | OpenAPI Initiative | [openapis.org/arazzo-specification](https://www.openapis.org/arazzo-specification) | Sequences of API calls and dependencies (workflows over OpenAPI/AsyncAPI) | Multi-step admit→run→verify→accept paths as declarative workflows (complements Port workflows / OpenWorkflow emission) |

**Not catalogued as standards (toolkits):** GitHub Spec Kit, OpenSpec, BMAD — OSS methodologies; see [`factory-oss-analogs.md`](./factory-oss-analogs.md) §3.

---

## 3. Intermediate representations (IR) for AI-built software

Portable, framework-agnostic representations that agents/tools can emit, validate, and execute — distinct from LogicSRC wire formats.

| Name | Maintainer | URL | What it defines | Factory mapping |
|------|------------|-----|-----------------|-----------------|
| **Open Agent Specification (Agent Spec)** | Oracle open source ([oracle/agent-spec](https://github.com/oracle/agent-spec)) | [oracle.github.io/agent-spec](https://oracle.github.io/agent-spec/); [arxiv tech report](https://arxiv.org/html/2510.04173v1) | Declarative JSON/YAML IR for agents and multi-agent workflows (ONNX-like portability across LangGraph/CrewAI/AutoGen/… runtimes); complements MCP/A2A | Candidate **agent config IR** for Sandbox Agent / OpenAgent-shaped definitions if Factory wants runtime-portable agent graphs (not locked in ADRs) |
| **SCIP (Code Intelligence Protocol)** | SCIP community ([scip-code/scip](https://github.com/scip-code/scip); originated at Sourcegraph) | [scip-code.org](https://scip-code.org/) | Language-agnostic code index (Protobuf): defs/refs/impls for precise navigation | Substrate for **Trail-Code / Code Atlas** style agent maps; multi-repo intelligence without inventing a private index format |
| **WebAssembly Component Model** | W3C / Bytecode Alliance community | [WebAssembly Component Model](https://component-model.bytecodealliance.org/) (community docs); Wasm standards track via W3C | Portable binary modules + typed component interfaces for cross-language composition | Optional portable artifact IR for sandboxed tool plugins / policy modules (adjacent to Docker isolation) |
| **ONNX** | LF AI & Data / ONNX community | [onnx.ai](https://onnx.ai/) | Cross-framework ML model IR | Eval/scoring models and local judges — not Factory’s primary software IR |
| **Protocol Buffers** | Google open source; industry IDL | [protobuf.dev](https://protobuf.dev/) | Language-neutral schema + wire format | SCIP/gRPC/A2A-adjacent serialization; internal typed event payloads |

---

## 4. MCP protocol + MCP Apps

| Name | Maintainer | URL | What it defines | Factory mapping |
|------|------------|-----|-----------------|-----------------|
| **Model Context Protocol (MCP)** | Agentic AI Foundation (AAIF) under Linux Foundation; originated by Anthropic | [modelcontextprotocol.io](https://modelcontextprotocol.io/); [spec (example revision)](https://modelcontextprotocol.io/specification/2025-06-18); [org](https://github.com/modelcontextprotocol); [AAIF](https://aaif.io/) | JSON-RPC client–server protocol: **tools**, **resources**, **prompts**; transports (stdio, Streamable HTTP/SSE); capability negotiation | **Port MCP gateway** + connectors; Rivet/agents invoke Port workflows as tools; ADR-001/ADR-010 surface |
| **MCP Apps (SEP-1865)** | MCP project / AAIF; first official MCP extension | [Announcement](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/); [ext-apps repo + apps.mdx](https://github.com/modelcontextprotocol/ext-apps); [apps.extensions.modelcontextprotocol.io](https://apps.extensions.modelcontextprotocol.io/api/documents/Quickstart.html) | Interactive UI from MCP servers: `ui://` resources, `_meta.ui.resourceUri`, sandboxed HTML iframes, JSON-RPC over `postMessage` | **Developer OS integrations UI** (ADR-010 ChatGPT Plugins reference); distinct from AG-UI and from Port iframes — do not equate without compliance ([factory-master-spec](./factory-master-spec.md) §4.5) |
| **AGENTS.md** (AAIF project) | Agentic AI Foundation | [aaif.io/projects](https://aaif.io/projects) | Community convention for repo agent instruction indexes | Factory `AGENTS.md` as Spec/ADR/skill index (ASDLC practice) — not a design dump |

**Related (generative UI, not MCP core):** MCP-UI community work fed MCP Apps; OpenAI Apps SDK patterns aliased to MCP Apps fields ([OpenAI Plugins UI](https://developers.openai.com/plugins/build/chatgpt-ui)).

---

## 5. AG-UI (Agent–User Interaction)

| Name | Maintainer | URL | What it defines | Factory mapping |
|------|------------|-----|-----------------|-----------------|
| **AG-UI Protocol** | ag-ui-protocol community ([ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui)); originated with CopilotKit | [docs.ag-ui.com](https://docs.ag-ui.com/introduction); [GitHub](https://github.com/ag-ui-protocol/ag-ui) | Event-based Agent↔User stream (~16 event types); transport-agnostic (SSE/WebSocket/HTTP); bi-directional UI state | **Deferred** Developer OS path (ADR-011). Complementary to MCP/A2A. First-party Rivet↔AG-UI **UNVERIFIABLE** — any adapter is Factory design |
| **Generative UI specs (related)** | Google (A2UI), OpenAI (Open-JSON-UI), Microsoft+Shopify (MCP-UI lineage) | [AG-UI generative UI docs](https://docs.ag-ui.com/concepts/generative-ui-specs) | Declarative UI trees/components agents can emit | Optional payloads *over* AG-UI or MCP Apps; AG-UI itself is the interaction runtime, not a generative UI schema |

---

## 6. API contracts

Machine-readable interface contracts (REST, events, schemas, RPC) used for design-first and contract testing.

| Name | Maintainer | URL | What it defines | Factory mapping |
|------|------------|-----|-----------------|-----------------|
| **OpenAPI** | OpenAPI Initiative (LF) | [openapis.org](https://www.openapis.org/); [spec](https://spec.openapis.org/oas/) | Sync HTTP API contracts | Port External Interface / gateway / BFF contracts |
| **AsyncAPI** | AsyncAPI Initiative (LF) | [asyncapi.com](https://www.asyncapi.com/) | Async/event API contracts | Webhooks Port→Rivet; agent run event streams |
| **Arazzo** | OpenAPI Initiative | [Arazzo](https://www.openapis.org/arazzo-specification) | Multi-call workflow contracts over OpenAPI/AsyncAPI | Admit/verify/accept sequences as testable workflows |
| **JSON Schema** | JSON Schema project (community; IETF-related drafts) | [json-schema.org](https://json-schema.org/) | Vocabulary for JSON document validation | Spec Contract fixtures, MCP tool `inputSchema`, LogicSRC validators peer |
| **GraphQL SDL** | GraphQL Foundation (LF) | [graphql.org](https://graphql.org/) | Schema Definition Language for GraphQL APIs | Optional Developer OS / catalog query surfaces |
| **gRPC + Protocol Buffers** | CNCF gRPC / Protobuf community | [grpc.io](https://grpc.io/); [protobuf.dev](https://protobuf.dev/) | RPC + IDL contracts | High-perf internal services if Factory adds non-HTTP planes |
| **SARIF** | OASIS | [SARIF v2.1.0](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html) | Static analysis results interchange | CI security/lint evidence into visibility/accept |

---

## 7. Evaluation frameworks & observability conventions

Open harnesses and conventions for scoring models/agents and standardizing GenAI telemetry. Prefer **OSS frameworks** here; hosted commercial dashboards are out of scope.

| Name | Maintainer | URL | What it defines | Factory mapping |
|------|------------|-----|-----------------|-----------------|
| **Inspect AI** | UK AI Security Institute (AISI) | [inspect.aisi.org.uk](https://inspect.aisi.org.uk/) | Dataset + solver + scorer eval framework (MIT); agent/tool evals | Polygraph-class / Factory agent quality gates in CI |
| **HELM** | Stanford CRFM | [crfm.stanford.edu/helm](https://crfm.stanford.edu/helm/) | Holistic multi-scenario LLM evaluation methodology + leaderboards | Baseline model selection / regression comparisons |
| **lm-evaluation-harness** | EleutherAI | [github.com/EleutherAI/lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) | Standardized few-shot academic LLM benchmarks | Offline model regression suite |
| **OpenAI Evals** | OpenAI (open-source framework) | [github.com/openai/evals](https://github.com/openai/evals) (community-known OSS eval registry/framework) | Crowdsourced/custom eval classes + datasets | Prompt/agent failure-mode registry pattern |
| **DeepEval** | Confident AI (OSS core) | [deepeval.com](https://deepeval.com/); [github.com/confident-ai/deepeval](https://github.com/confident-ai/deepeval) | Pytest-style LLM/agent metrics (G-Eval, task completion, RAG, …) | Unit-test style Contract checks for agent trajectories |
| **promptfoo** | promptfoo community | [promptfoo.dev](https://www.promptfoo.dev/) (project site via ecosystem indexes) | Declarative YAML prompt/red-team evals in CI | Security/prompt regression for harness prompts |
| **Ragas** | Vibrant Labs / Ragas OSS | Community RAG/agent metrics library (Apache-2.0 ecosystem) | RAG and expanding agent evaluation metrics | Retrieval-grounded Factory knowledge agents |
| **OpenTelemetry GenAI Semantic Conventions** | OpenTelemetry GenAI SIG | [github.com/open-telemetry/semantic-conventions-genai](https://github.com/open-telemetry/semantic-conventions-genai); pointer from [opentelemetry.io GenAI page](https://opentelemetry.io/docs/specs/semconv/gen-ai/) | Standard `gen_ai.*` spans/metrics/events (LLM calls, agents, MCP tooling) | **Rivet OTel / Inspector** alignment for visibility-accept Spec; correlating `workAttemptId`↔model spans |

---

## 8. Lifecycle specs beyond ISO/IEC/IEEE 12207

Factory already maps **ISO/IEC/IEEE 12207:2026** into ASDLC Specs ([`iso-12207-overview.md`](./iso-12207-overview.md); ADR-009). Adjacent open process / supply-chain standards:

| Name | Maintainer | URL | What it defines | Factory mapping |
|------|------------|-----|-----------------|-----------------|
| **ISO/IEC/IEEE 15288** | ISO/IEC JTC 1/SC 7 + IEEE | [ISO 15288 catalog](https://www.iso.org/standard/81739.html) (systems life cycle processes; 2023 edition commonly cited) | System life cycle process framework aligned with 12207 | System-of-systems view around Factory (Port+Rivet+GitHub+Vercel as one system) |
| **ISO/IEC/IEEE 15289** | ISO/IEC/IEEE | [IEEE SA 15289](https://standards.ieee.org/ieee/15289/11891/) | Content of life-cycle **information items** (documentation) | What evidence artifacts Spec Contracts must produce (not formats — formats via OpenAPI/SPDX/etc.) |
| **ISO/IEC/IEEE 24748** (esp. Part 1) | ISO/IEC/IEEE | [ISO/IEC/IEEE 24748-1](https://www.iso.org/standard/72896.html) | Guidance for joint use / management of 15288+12207 life cycles | `specs/asdlc-lifecycle` tailoring narrative |
| **SWEBOK Guide** | IEEE Computer Society | [IEEE CS SWEBOK](https://blp.ieee.org/software-engineering-body-of-knowledge-swebok/) | Consensus body of knowledge (KA catalog), not a process mandatory standard | Skill/curriculum map for agent roles; gap analysis vs ASDLC phases |
| **SLSA** | OpenSSF (Linux Foundation) | [openssf.org/projects/slsa](https://openssf.org/projects/slsa/) | Supply-chain Levels for Software Artifacts — provenance tracks (build-focused v1) | Accept gates: signed provenance for Factory-produced packages/images |
| **SPDX** | SPDX project (LF); ISO/IEC 5962:2021 | [spdx.dev](https://spdx.dev/) | SBOM + license/security metadata exchange | Artifact inventory for sandboxes, containers, agent-generated deps |
| **CycloneDX** | OWASP / Ecma TC54 (ECMA-424) | [cyclonedx.org](https://cyclonedx.org/) | Security-oriented SBOM (+ VEX, ML-BOM, …) | CI vulnerability/accept evidence alongside SPDX |
| **OpenChain** | OpenChain Project (LF); ISO/IEC 5230 & 18974 | [openchainproject.org](https://openchainproject.org/get-started) | Org process requirements for OSS license compliance (5230) and security assurance (18974) | Factory org readiness for shipping OSS-containing Agent images |

---

## 9. Cross-cutting stack view

```text
Human UI  ←—— AG-UI (deferred) / MCP Apps (iframes) / Rivet-native stream ——→  Developer OS
                │
Agents    ←—— A2A / AGNTCY ——→ peer agents
                │
Tools/data ←—— MCP (+ Apps extension) ——→ Port gateway / connectors
                │
Specs     ←—— ASDLC Spec (Gherkin Contracts) + OpenAPI/AsyncAPI/Arazzo ——→ build/verify
                │
IR        ←—— Agent Spec (agents) · SCIP (code atlas) · JSON Schema/Protobuf ——→ portability
                │
Evidence  ←—— OTel GenAI · Inspect/HELM/DeepEval · SLSA/SPDX/CycloneDX · SARIF ——→ accept
                │
Lifecycle ←—— 12207 + 15288/15289/24748 · OpenChain · SWEBOK ——→ asdlc-lifecycle Spec
```

---

## 10. Sources (index)

- [A2A Protocol](https://a2a-protocol.org/latest/) / [A2A Specification](https://a2a-protocol.org/latest/specification/) / [a2aproject/A2A](https://github.com/a2aproject/A2A)
- [Linux Foundation A2A press](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents)
- [AGNTCY](https://agntcy.org/) / [docs.agntcy.org](https://docs.agntcy.org/) / [LF AGNTCY welcome](https://www.prnewswire.com/news-releases/linux-foundation-welcomes-the-agntcy-project-to-standardize-open-multi-agent-system-infrastructure-and-break-down-ai-agent-silos-302515443.html)
- [ACP (historical)](https://agentcommunicationprotocol.dev/introduction/welcome) / [i-am-bee/acp](https://github.com/i-am-bee/acp)
- [MCP intro](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro) / [MCP specification](https://modelcontextprotocol.io/specification/2025-06-18) / [MCP → AAIF](https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/) / [aaif.io](https://aaif.io/)
- [MCP Apps announcement](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/) / [modelcontextprotocol/ext-apps](https://github.com/modelcontextprotocol/ext-apps)
- [AG-UI Overview](https://docs.ag-ui.com/introduction) / [Generative UI specs](https://docs.ag-ui.com/concepts/generative-ui-specs) / [ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui)
- [Open Agent Spec](https://oracle.github.io/agent-spec/) / [oracle/agent-spec](https://github.com/oracle/agent-spec)
- [SCIP](https://scip-code.org/) / [scip-code/scip](https://github.com/scip-code/scip)
- [OpenAPI](https://spec.openapis.org/oas/) / [Arazzo](https://www.openapis.org/arazzo-specification) / [AsyncAPI](https://www.asyncapi.com/) / [JSON Schema](https://json-schema.org/) / [Gherkin](https://cucumber.io/docs/gherkin/reference/)
- [SARIF](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)
- [Inspect AI](https://inspect.aisi.org.uk/) / [HELM](https://crfm.stanford.edu/helm/) / [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) / [DeepEval](https://github.com/confident-ai/deepeval)
- [OTel GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai)
- [SLSA](https://openssf.org/projects/slsa/) / [SPDX](https://spdx.dev/) / [CycloneDX](https://cyclonedx.org/) / [OpenChain](https://openchainproject.org/get-started)
- [ISO/IEC/IEEE 24748-1](https://www.iso.org/standard/72896.html) / [SWEBOK](https://blp.ieee.org/software-engineering-body-of-knowledge-swebok/)
- [SDD arxiv](https://arxiv.org/abs/2602.00180v1)
- Project: [`factory-master-spec.md`](./factory-master-spec.md), [`iso-12207-overview.md`](./iso-12207-overview.md), [`factory-oss-analogs.md`](./factory-oss-analogs.md)
