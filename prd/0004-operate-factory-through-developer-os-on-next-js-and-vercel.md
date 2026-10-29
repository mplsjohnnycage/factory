---
openprd: "0.3"
id: "0004"
title: Operate Factory through Developer OS on Next.js and Vercel
status: Accepted
authors:
  - factory-meta
created: 2026-10-29
updated: 2026-10-29
repo: mplsjohnnycage/factory
tags:
  - meta
  - developer-os
---

## Problem

Operators need a human control surface for intent, approvals, live session progress, and code atlas. Embedding CopilotKit/AG-UI in the kernel or reusing Observatory OAuth confuses identity and streaming ownership.

## Goals

- Developer OS shell is Next.js App Router on Vercel (ADR-011).
- Kernel streaming is Rivet Actor native realtime; reconnect from last `sequence`.
- Port OAuth callback uses the dedicated Factory External Interface client (ADR-005).

## Non-Goals

- CopilotKit / AG-UI in the M1 kernel path (deferred per ADR-011).
- Configuring Harness Observatory as Factory OAuth client.
- Full chrome matrix / Spec Canvas as M1 exit criteria.

## Users

- Factory Meta human operators.
- Agents that render Port widgets / MCP Apps inside the shell (display only).

## Requirements

- R1 [P0] Developer OS deploys as Next.js on Vercel with atlas hero shell (PBI-008).
- R2 [P0] Session view uses Rivet-native realtime client; reconnect resumes from last Actor `sequence` (PBI-009).
- R3 [P0] OAuth Route Handler targets the dedicated Factory Port External Interface app — never Observatory.
- R4 [P1] UI/MCP Apps are display channels; privileged mutations go through Port actions only.
- R5 [P2] Atlas L0 skeleton expands in place without navigation; full chrome deferred post-M1.

## UX Notes

First viewport favors brand + session/atlas presence over dashboard clutter. Privileged controls are Port actions; the shell never exposes Sandbox Agent kill/create APIs to the browser.

## Tech Stack

Next.js App Router, Vercel (`apps/developer-os`), Rivet native realtime client, Port OAuth. Specs: `developer-os`, `auth-port-oauth`. Must not depend on Clerk or CopilotKit kernel routes.

## Monetization

_None._ Internal Factory Meta operator shell — not a billed SKU.

## Success Metrics

- Preview deploy serves shell; OAuth Route Handler stub compiles.
- Reconnect-from-sequence Contract green.
- No Observatory client id configured for Developer OS.

## Risks & Open Questions

- Rivet↔AG-UI remains UNVERIFIABLE as vendor product — any later adapter is Factory design, not M1.
- Vercel preview vs production OAuth redirect drift — keep OpenAccess descriptor redirects honest.
