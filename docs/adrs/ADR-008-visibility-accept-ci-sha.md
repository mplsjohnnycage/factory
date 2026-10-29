# ADR-008: Visibility inputs vs accept on exact SHA

**Status:** Accepted

**Date:** 2026-10-28

**Deciders:** Johnny Cage / Factory Meta

## Context

Factory needs observability (audit, traces, reviews, scorecards) and a hard accept gate. Agent self-report, canvases, and session “looks good” must never accept delivery. Polygraph provides session/review artifacts useful as **visibility inputs**, not as a pass/fail oracle product named “evals.”

## Decision

We will treat **visibility** as the combination of Port audit + Rivet traces + Polygraph session/review artifacts + scorecards. We will treat **accept** as **GitHub CI green on the exact commit SHA** under Port governance. Rewrite of history invalidates prior accept. Polygraph is never the accept oracle.

## Consequences

**Positive:**
- Deterministic, auditable accept path
- Separates “what operators see” from “what Port accepts”
- Aligns with exact-SHA CI practice

**Negative:**
- CI must be wired (PBI-011) before Port accept is meaningful
- Misreading “Polygraph evals” as a product gate causes false confidence
- Evidence packs without CI still fail accept — by design

**Neutral:**
- Optional Inspect-AI-class harnesses may exist later; they do not replace CI
- Linear/PR comments are tracking/observability until Port/Rivet live

## Alternatives Considered

### Accept from agent self-report or canvas

Rejected — explicit hard ban; not governance-grade.

### Polygraph (or scorecards alone) as accept

Rejected — visibility inputs only; accept remains GitHub CI on exact SHA.

### Branch-name or “latest green” accept

Rejected — must bind the exact SHA; rewrite denies.
