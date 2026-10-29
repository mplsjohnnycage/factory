# ADR-008: Visibility inputs versus accept on exact SHA

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Johnny Cage / Factory Meta

## Context

Factory needs observability — audit, traces, review artifacts, scorecards — and a hard accept gate. Agent self-report, canvases, and a session that “looks good” must never accept delivery. The locked phrase “Polygraph evals” means Factory visibility inputs from Polygraph session and review artifacts, not a Polygraph product named evals and not a pass/fail oracle (master §13.2). GitHub webhooks signal Rivet. Accept is a separate Port governance act.

## Decision

We will treat **visibility** as Port audit plus Rivet traces plus Polygraph evals (session and review artifacts) plus scorecards. We will treat **accept** as **GitHub CI green on the exact commit SHA**, under Port governance. A history rewrite invalidates accept for the previous SHA. Polygraph is never the accept oracle. Evidence tools record. They do not replace CI.

## Consequences

**Positive:** Accept is deterministic and auditable. What operators see stays separate from what Port accepts. Accept binds to the exact SHA.

**Negative:** CI must be wired (PBI-011) before Port accept means anything. Reading “Polygraph evals” as a product gate creates false confidence. An evidence pack without green CI still fails accept.

**Neutral:** Optional Inspect-AI-class harnesses may exist later. They do not replace CI. Linear comments and PR comments are the observability hook until Port audit and Rivet traces are live.

**Reconsider when:** A successor ADR names a different accept oracle. Agent self-report, a canvas, or Polygraph alone is not that oracle.

## Alternatives Considered

- **Accept from agent self-report or a canvas.** Rejected. Explicit hard ban. Not governance-grade.
- **Polygraph, or scorecards alone, as accept.** Rejected. They are visibility inputs. Accept remains GitHub CI on the exact SHA (master risk R-07).
- **Accept by branch name or “latest green” tip.** Rejected. Accept binds the exact SHA. A rewrite denies the old SHA.
