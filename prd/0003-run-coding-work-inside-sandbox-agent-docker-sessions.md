---
openprd: "0.3"
id: "0003"
title: Run coding work inside Sandbox Agent Docker sessions
status: Accepted
authors:
  - factory-meta
created: 2026-10-29
updated: 2026-10-29
repo: mplsjohnnycage/factory
tags:
  - meta
  - sandbox-harness
---

## Problem

Coding agents need an isolated, recoverable session with streaming and checkpoint. Running harnesses on the operator laptop or calling them from the browser collapses blast radius and identity.

## Goals

- Sandbox Agent runs in Docker under Rivet session identity.
- Session lifecycle supports create → prompt → stream → checkpoint; kill preserves session identity.
- First harness path uses Claude Code inside the sandbox (M1).

## Non-Goals

- Browser or Developer OS calling Sandbox Agent control APIs directly.
- OpenTask desktop/UI automation tracks for M1 coding path.
- Unbounded sandbox CPU/RAM (soft caps apply).

## Users

- `ProjectSupervisor` / Rivet when starting claimed Meta coding work.
- Coding agents operating inside the sandbox.

## Requirements

- R1 [P0] Sandbox Agent sessions are Docker-isolated and tied to Rivet session identity.
- R2 [P0] Kill/restart preserves session identity so reconnect and checkpoint remain valid.
- R3 [P0] Browser NEVER calls Sandbox Agent control APIs.
- R4 [P1] Optional OpenAgent stub `agents/coder.factory.json` may exist; OpenTask is skipped for M1 coding.
- R5 [P2] Soft caps: ≤4 vCPU / 8 GiB RAM per container; ≤2M tokens per `WorkAttempt` (refuse or human confirm above).

## UX Notes

Operators watch stream/progress via Developer OS Rivet-native client; they do not SSH into sandbox for privileged control. Harness logs are session-scoped.

## Tech Stack

Docker Sandbox Agent, Claude Code harness (`apps/sandbox-harness`), Rivet Actor session. Spec: `sandbox-harness`. Must not depend on Observatory OAuth client for Factory.

## Monetization

_None._ Internal Factory Meta coding harness — not a billed SKU.

## Success Metrics

- create→prompt→stream→checkpoint Contract green.
- Kill preserves session identity (Contract / harness test).
- No browser→Sandbox Agent control path in Meta apps.

## Risks & Open Questions

- Harness vendor churn (Claude Code CLI) — pin versions and refuse scaffold placeholders.
- Token/cost overruns — enforce soft caps at gateway/harness.
