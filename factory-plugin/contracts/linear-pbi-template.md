<!-- Linear issue template — canonical body.
     Template name (Linear):  PBI — Typed Contract (§0.1)
     Target team:             ASDLC (key STL) — the Factory Meta tracker facet
     Default title prefix:    PBI:
     Paste target:            the template's description body (Linear team settings →
                              Templates → Issue templates → New template).

     Source of truth: factory master spec §0.1 (C1–C3 + fields 1–16 = 19 fields, plus
     Spec · Verification · Refinement pointers). A PBI IS a typed contract
     (PBI ≡ typed contract ≡ Linear ticket ≡ bead ≡ GitHub issue). This file is the
     canonical markdown body — derived from master §0.1 and the plugin's
     contracts/typed-contract-template.md; it is not a parallel field set.

     Facet twins:
     - GitHub: .github/ISSUE_TEMPLATE/pbi.yml in mplsjohnnycage/factory (PR #112,
       merged ea56aef). NOTE: the GitHub form is the Meta-repo derivative — its C3
       dropdown is restricted to Meta Beads xor None, because that repo's lane rule
       (§0.2 / AGENTS.md) forbids Product-lane write targets filed there. This
       canonical body keeps the full §0.1 C3 text (Meta xor Product, by lane).
     - Plugin blank: contracts/typed-contract-template.md.

     Why this file exists instead of an API-created template: Linear's official MCP
     connector (the route this workspace is connected through) can APPLY a template
     when creating an issue (save_issue `template` param) but exposes no
     template-create/list tool, so the template is created once by pasting this body
     in the Linear UI; afterwards it is applied by name. -->

**One unit of work, five names.** This template is the Linear facet of the typed contract
(master spec §0.1). **Definition of Ready:** a unit is **not startable** until the entire
body below is filled — C1–C3 + fields 1–16 plus the three ASDLC pointers. Name the unit's
other facet ids (PBI-NNN · bead id · GitHub # · Port executionContract) in the title or body.

## Contract core (typed I/O + writes)

- **C1 — Inputs + types:** <explicit input names and types: schemas, Spec pointers, entity ids, paths>
- **C2 — Outputs + types:** <explicit output names and types: artifacts, evidence, entity updates, PR SHA>
- **C3 — Write targets:** <systems this unit may write — **Meta Beads** *xor* **Product Beads** (exactly one instance by lane; never Both, never vague "Beads"), Linear, git/GitHub, Port, Rivet, filesystem, other>

## Operational body

- **1 — Acceptance criteria:** <measurable done-when; ties to Spec Contract scenarios / Verification pointer>
- **2 — Exact task description:** <imperative directive — what to do, unambiguous>
- **3 — Almost-exact directories to work in:** <paths / packages / Spec domains in scope>
- **4 — What not to touch:** <explicit out-of-scope paths, systems, boards, Beads instances>
- **5 — Skills to use:** <named skills / practices (e.g. ASDLC patterns) — no silent invention>
- **6 — MCPs needed:** <named MCP servers/tools (prefer Factory Single-MCP / Port-governed surface)>
- **7 — Agent type required:** <one name from the master spec §0.7 roster: Muse · ChatGPT regular · ChatGPT Work · Codex · Grok · Claude · Claude Code · Claude Design> + task kind (**personal-agent** *xor* **coding-agent**; class map: personal-agent → Cockpit, coding-agent → Coding, §18)
- **8 — CI requirements:** <checks / gates that must green on the exact SHA for accept>
- **9 — Dependencies:** <which PBIs/units must complete first — same equivalence-chain ids>
- **10 — Branch / worktree naming convention:** <exact pattern for this unit>
- **11 — Failure / rollback behavior:** <what happens on fail; how to unwind writes>
- **12 — Reviewer for the PR:** <named human/agent reviewer>
- **13 — Environment prerequisites:** <services that must be running (e.g. Rivet Compose, Tailscale Serve, gateway)>
- **14 — Time estimate:** <expected effort / duration>
- **15 — Secrets handling:** <required secrets, where they live, what must never be logged/committed — name locations, never values; no plaintext secrets in the unit body>
- **16 — Observability hook:** <how progress/evidence is observed (Port audit / deliveryRun·executionAttempt, Rivet traces, CI checks, Linear updates)>

## ASDLC pointers (same unit, §6)

- **Spec pointer:** <specs/{domain}/spec.md or master spec §4 subsection>
- **Verification pointer:** <Contract scenarios in that Spec that this unit is judged against>
- **Refinement rule:** <update Spec in same PR (default) | flag human | deviation log>
