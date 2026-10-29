---
name: factory-workflow-setup
description: Run Factory Phase A upfront setup before Feature Assembly — Spec placement, Port native-first, git layout, Linear/PBIs, Meta Beads, ADRs, LogicSRC, execution plane, gates. Use when standing up meta-building or checking prerequisites.
---

# Factory workflow — Phase A setup

Derived from `factory-workflow` (must match master). Complete **before** Feature Assembly coding against a Spec. No Port/Linear/Notion mutations from this skill alone — only describe or execute when the active unit’s write targets authorize them.

## Hard rules (recap)

- Equivalence chain: Linear ≡ bead ≡ GitHub issue ≡ PBI ≡ typed contract.
- Typed contracts everywhere; DoR = full canonical body.
- Agent-agnostic loop; synced state (not agent memory).
- Native-first Port; no second catalog / invented Port tool IDs.
- Meta ≠ Product (instances separate; unit type one).
- Accept on exact SHA; `notes.md` coordination only.

## Phase A checklist

| ID | Step | Done when |
|----|------|-----------|
| **A1** | Spec placement | Working docs in Project `docs/`; canonical `/specs/{domain}/spec.md` in meta-repo once live |
| **A2** | Port upfront | Blueprints, relations, MCP registry, workflows/actions, RBAC, audit, Context Lake, §4.2.1 fencing, assemble-first validation configured (prefer natives) |
| **A3** | Git layout | Mandated §2 tree (`AGENTS.md`, `OpenStack.md`, `specs/`, `docs/adrs/`, apps, `.well-known`, …) |
| **A4** | Linear + PBIs | Meta units on Factory Meta board; each unit = full typed-contract body; seed PBI-001…015 match master §6 |
| **A5** | Meta Beads | OQ-1 Johnny: hybrid OK (scaffold optional; Linear = admit/claim SoT until PBI-007) |
| **A6** | ADRs | Full Nygard bodies under `docs/adrs/`; immutable after Accepted |
| **A7** | M1 LogicSRC | `AGENTS.md`, OpenStack/OpenProfile, OpenMCP, OpenAccess well-knowns — interop only, not primary IR |
| **A8** | Execution plane | Rivet Compose + Tailscale, thin factory-gateway, Sandbox Agent, Dev OS shell, CI accept path (when standing up runtime) |
| **A9** | Context gates | Spec review + EGM Goldfish before Feature Assembly; local/CI/adversarial/Compound/Port accept as defined |
| **A10** | OAuth | ADR-005 deferred — document only; never Observatory reuse; no create without Johnny |
| **A11** | Notion | Allowed **mirror** of meta plans; SoT = Project store + git; Notion ≠ Spec/accept/claim |
| **A12** | Later pieces | Name but do not invent: Code Atlas, Polygraph, Spec Canvas, Product Beads (separate Product PBI), OpenFleet, etc. |

## Phase B pointer

After A gates for the active Spec are green → use **factory-coding-loop** skill: task → standardize → PR → build → loop.

## Collision avoidance

| Layer | Rule |
|-------|------|
| Claim | One holder; post–PBI-007: `bd ready` → claim before admit |
| Worktree | One write set per worktree; share one `.beads` across worktrees |
| File-scope | Concurrent units → disjoint paths; else serialize or Beads merge-slot |
| IDs | Beads hash IDs; `notes.md` is not claim authority |

## Manual / reserved

OQ-1 · ADR-005 OAuth create · Spec review + EGM Goldfish · Port accept · Compound HITL · `factory_request_release` (Johnny-only).
