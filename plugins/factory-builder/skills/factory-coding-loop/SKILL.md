---
name: factory-coding-loop
description: Run the Factory five-step coding sequence (task → standardize → PR → build → loop) for coding-agent units. Use when admitting Feature Assembly, picking up a ready PBI/bead, or enforcing the agent-agnostic loop.
---

# Factory coding loop

Derived from master §0.4 / `factory-coding-loop`. Tool-agnostic. **Coding-agent** units only. Personal-agent / Cockpit work uses Port/browser/provision paths — not this loop.

## Sequence (locked)

| Step | Name | Must happen |
|------|------|-------------|
| 1 | **Task** | Pick one active synced unit; refuse if typed-contract body incomplete |
| 2 | **Standardize** | Align Spec+Contract / assemble-first / §7 gates before code |
| 3 | **Open PR** | Branch + PR early; cite unit ids · Spec · Contract scenarios |
| 4 | **Run build** | Local gate → CI on exact SHA → optional adversarial → Port accept |
| 5 | **Loop back** | Close/refine/compound HITL → next ready unit → Step 1 |

No independent-review / “Merge!” step. Review attaches to PR/build gates.

## Step 1 — Task

Active unit facets (same entity): **Meta Beads** claim (post–PBI-007), Linear ticket, PBI/typed contract (19 fields), GitHub issue.

Rules:

- Prefer **one** active task; concurrent units need disjoint write sets.
- Field **7** = §0.7 roster name + `coding-agent`.
- Before PBI-007: Linear/PBI is enough; Meta Beads optional scaffolding, not admit SoT.
- After PBI-007: coding admit needs Meta Beads ready/claim **or** audited Port `executionContract` bypass.
- `notes.md` never replaces Linear/PBI/Bead identity.

## Step 2 — Standardize

| Norm | Action |
|------|--------|
| Spec + Contract | Build against `/specs/{domain}/spec.md` |
| Assemble-first | Prefer Port catalog composables; flag needs-implementation on catalog miss |
| Gates | Spec review + EGM Goldfish green before Feature Assembly |
| ADRs | Do not re-litigate Accepted ADRs in the PR |

Update Spec in the **same PR** when Contract must change (default).

## Step 3 — Open PR

1. Feature branch from agreed base.
2. Open PR early (draft OK).
3. Cite Linear/PBI/Bead id · Spec path · scenarios under verification.
4. Git is SoT for the change set — not Port, Linear, or `notes.md`.

## Step 4 — Run build

| Layer | Enforces |
|-------|----------|
| Local gate | typecheck, tests, `@logicsrc/validators`, lint |
| CI | GitHub Actions on PR SHA (rewrite invalidates green) |
| Adversarial | Optional critic vs Contract |
| Accept | Port + green checks on **exact SHA** — agent “done” never accepts |

When Rivet admit is live: `ProjectSupervisor` → Sandbox Agent commits into this PR path.

## Step 5 — Loop back

Close Linear/PBI; `bd close` when Beads owns claim; apply refinement rule; Compound HITL when in scope (PBI-015); take next ready unit. On failure, refine on the **same** PR — no shadow task for the same write set.

## Today’s role map (soft-locked)

| Role | Tool |
|------|------|
| Tracking | Linear |
| Ready/claim (Meta) | Meta Beads from PBI-007 |
| PRs + CI | git / GitHub Actions |
| Accept | Port |
| Admit + harness | Rivet ProjectSupervisor + Sandbox Agent |
| Coordination | `notes.md` (not coding SoT) |

## Hard bans

- Skipping Standardize when a Spec exists or is required.
- Day-one Meta Beads as human board SoT before PBI-007.
- Port accept without green CI on exact SHA.
- Hard-coding the loop to one IDE/MCP host.
- Inventing agent types outside master §0.7 without master-first update.
