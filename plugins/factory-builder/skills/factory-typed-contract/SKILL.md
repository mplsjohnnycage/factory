---
name: factory-typed-contract
description: Validate or author the Factory 19-field PBI/typed-contract body (DoR). Use before claiming or starting any unit of work.
---

# Factory typed contract (DoR)

Master §0.1. **PBI ≡ typed contract.** Unit not startable until this entire body is filled. Prefer Port-native / Spec Contract / workflow INPUT schemas for typed edges — no parallel type system.

## Contract core (C1–C3)

| # | Field | Required |
|---|--------|----------|
| **C1** | Inputs + types | Names and types (schemas, Spec pointers, entity ids, paths) |
| **C2** | Outputs + types | Artifacts, evidence, entity updates, PR SHA |
| **C3** | Write targets | **Meta Beads** *xor* **Product Beads** (exactly one by lane), Linear, git/GitHub, Port, Rivet, filesystem, other — no vague “Beads” |

## Operational body (1–16)

| # | Field | Required |
|---|--------|----------|
| **1** | Acceptance criteria | Measurable done-when; ties to Spec Contract scenarios |
| **2** | Exact task description | Imperative, unambiguous |
| **3** | Almost-exact directories | Paths / packages / Spec domains in scope |
| **4** | What not to touch | Out-of-scope paths, systems, boards, Beads instances |
| **5** | Skills to use | Named skills/practices |
| **6** | MCPs needed | Named servers/tools (prefer Factory Single-MCP / Port-governed) |
| **7** | Agent type required | §0.7 roster name **and** `personal-agent` *xor* `coding-agent` |
| **8** | CI requirements | Checks that must green on exact SHA for accept |
| **9** | Dependencies | Prior PBI/unit ids (same equivalence chain) |
| **10** | Branch / worktree naming | Exact pattern |
| **11** | Failure / rollback | Fail behavior; unwind writes |
| **12** | Reviewer for the PR | Named human/agent |
| **13** | Environment prerequisites | Services that must be running |
| **14** | Time estimate | Expected effort (Linear seed / planning) |
| **15** | Secrets handling | Required secrets location; never plaintext in body |
| **16** | Observability hook | Port audit / deliveryRun·executionAttempt, Rivet traces, CI, Linear |

Also on the same unit: **Spec pointer**, **Verification pointer**, **Refinement rule** (default: update Spec in same PR).

## §0.7 roster (field 7)

| Agent type | Default task kind |
|------------|-------------------|
| Muse | personal-agent |
| ChatGPT regular | personal-agent (may be coding when unit says so) |
| ChatGPT Work | personal-agent |
| Codex | coding-agent |
| Grok | personal-agent (may be coding when unit says so) |
| Claude | personal-agent |
| Claude Code | coding-agent |
| Claude Design | personal-agent |

Extensible via **master-first** edit only. Personal-agent ≠ Sandbox Agent coding admit. Coding-agent follows factory-coding-loop.

## Validation script for agents

1. List missing C1–C3 / 1–16 / Spec·Verification·Refinement.
2. If any missing → **refuse start**; report gaps; do not invent sidecar “contract” docs.
3. Confirm lane + Beads instance name match C3.
4. Confirm field 7 task kind matches the work (coding vs Cockpit).
5. Only then claim / start.
