# Factory stack gap solutions — companion

**Date:** 2026-10-28  
**Master spec:** [`factory-master-spec.md`](./factory-master-spec.md)  
**Worker:** FE-32 (proactive gap closure; EGM freeze open — master spec edited with numbered additions only)

---

## What was added (master-spec section → gap)

| Master-spec section | Gap closed | Primary sources |
|---------------------|------------|-----------------|
| **§11 Rivet↔AG-UI bridge** | No official Rivet↔AG-UI product; Factory SSE→AG-UI adapter + event map + placement | AG-UI events/encoder docs; Rivet request-handler SSE; Sandbox Agent `sessionUpdate`; ADR-011; audit §§19–22; oss-analogs §1 |
| **§12 Code Atlas** | UNVERIFIABLE “Code Atlas” product → Factory multi-repo LOD graph | Trail-Code, Polygraph, Beads; Infigraph / Code-Graph-RAG / SCIP patterns; audit §§5–7 |
| **§13 EGM majors** | Beads/Polygraph/Trailcode Spec homes; topology desktop+Vercel; Problem/Goals/Non-Goals; M1 first-wave cut (B1); ADR-008 Polygraph clarification | egm-master-spec-run; consolidated_review; claims verification; Rivet self-host + Tailscale Serve |
| **§14 Alternatives considered** | EGM B2 missing Alternatives | Locked ADRs + rejected peers (Clerk, Temporal, CopilotKit-in-kernel, etc.) |
| **§15 Risks & mitigations** | EGM B3 missing Risks | Port race, OAuth limit, queue semantics, topology, SPOF, desync, atlas, AG-UI drift, Linear CSP, premature ceilings |
| **§16 Linear MCP Apps widget** | Linear has no MCP Apps; Factory HTML+BFF+Vercel design | linear-mcp-apps-verify; linear-factory-task-manager; MCP Apps registerApp*; Linear GraphQL/SDK/OAuth |
| **§17 Document control (extended)** | Index for §§11–16 + this companion | — |

---

## Preserved locks (not reopened)

- Port fencing §4.2.1 / Port SoT (ADR-001)  
- Port auth not Clerk (ADR-001/005)  
- Rivet-native kernel stream; CopilotKit/AG-UI deferred (ADR-011)  
- No live Port mutation from this work  
- No new TBDs; deferred items remain ADR-005 / ADR-011 / §13.5 implement gates  

---

## EGM freeze note

EGM review artifacts under `internal/egm-master-spec-review/` remain the FAIL baseline. This companion + §§11–16 are the remediation pass against that baseline (Alternatives, Risks, component defs, topology, atlas DoD, M1 cut). Re-run `/egm-review` is out of scope for FE-32 unless the coordinator schedules it.
