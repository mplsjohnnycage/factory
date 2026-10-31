<!-- Typed-contract template — master spec §0.1 (factory-master-spec.md, the single canonical SoT).
     A PBI IS a typed contract (PBI ≡ typed contract ≡ Linear ticket ≡ bead ≡ GitHub issue).
     DoR: a unit is NOT startable until the ENTIRE body below is filled (C1–C3 + fields 1–16 = 19 fields)
     plus the three ASDLC pointers. Prefer Port-native / Spec Contract / workflow INPUT schemas for
     typed edges when they already exist — no parallel type system. -->

# UNIT: <id — PBI-NNN / STL-NNN / bead id / GitHub # (same unit, all facets named)>

## Contract core (typed I/O + writes)

- **C1 — Inputs + types:** <explicit input names and types: schemas, Spec pointers, entity ids, paths>
- **C2 — Outputs + types:** <explicit output names and types: artifacts, evidence, entity updates, PR SHA>
- **C3 — Write targets:** <systems this unit may write — Meta Beads *xor* Product Beads (exactly one
  instance by lane; never Both, never vague "Beads"), Linear, git/GitHub, Port, Rivet, filesystem, other>

## Operational body

- **1 — Acceptance criteria:** <measurable done-when; ties to Spec Contract scenarios / Verification pointer>
- **2 — Exact task description:** <imperative directive — what to do, unambiguous>
- **3 — Almost-exact directories to work in:** <paths / packages / Spec domains in scope>
- **4 — What not to touch:** <explicit out-of-scope paths, systems, boards, Beads instances>
- **5 — Skills to use:** <named skills / practices (e.g. ASDLC patterns) — no silent invention>
- **6 — MCPs needed:** <named MCP servers/tools (prefer Factory Single-MCP / Port-governed surface)>
- **7 — Agent type required:** <name from the master spec §0.7 roster> + task kind
  (**personal-agent** *xor* **coding-agent**); class map: Coding vs Cockpit (§18)
- **8 — CI requirements:** <checks / gates that must green on the exact SHA for accept>
- **9 — Dependencies:** <which PBIs/units must complete first — same equivalence-chain ids>
- **10 — Branch / worktree naming convention:** <exact pattern for this unit>
- **11 — Failure / rollback behavior:** <what happens on fail; how to unwind writes>
- **12 — Reviewer for the PR:** <named human/agent reviewer>
- **13 — Environment prerequisites:** <services that must be running (e.g. Rivet Compose, Tailscale Serve, gateway)>
- **14 — Time estimate:** <expected effort / duration (Linear seed / planning)>
- **15 — Secrets handling:** <required secrets, where they live, what must never be logged/committed;
  no plaintext secrets in the unit body>
- **16 — Observability hook:** <how progress/evidence is observed (Port audit / `deliveryRun`·`executionAttempt`,
  Rivet traces, CI checks, Linear updates)>

## ASDLC pointers (same unit, §6)

- **Spec pointer:** <specs/{domain}/spec.md or master spec §4 subsection>
- **Verification pointer:** <Contract scenarios in that Spec that this unit is judged against>
- **Refinement rule:** <update Spec in same PR (default) | flag human | deviation log>
