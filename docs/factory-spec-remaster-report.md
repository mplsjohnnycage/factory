# Factory spec remaster report

**Date:** 2026-10-28  
**Worker:** `bc-a8c058bc-3017-5d8f-b7ee-a23cfc8d051b`  
**Canonical SoT:** [`factory-master-spec.md`](./factory-master-spec.md)  
**Inputs:** [`factory-research-300-qa.md`](./factory-research-300-qa.md) · [`factory-research-reconciliation.md`](./factory-research-reconciliation.md) · prior workflow / meta / coding-loop locks  

---

## Hard rule encoded (Johnny)

> **`factory-master-spec.md` is the single canonical source.** Every other Factory doc must **derive from and match** it. **Future edits: master first, then propagate.** Unreconcileable sources are flagged — never invent a parallel SoT.

Encoded in master **§0 Document authority**. Mirrored in derived docs’ Status / Document control rows and Linear **Factory Meta** project description.

**Not added:** independent-review / “Merge!” step. Coding loop remains **task → standardize → PR → build → loop**.

---

## What changed in the master spec

| Area | Change |
|------|--------|
| **§0 Document authority** | New — SoT hierarchy; derived surfaces table; edit order |
| **§0.1 Equivalence + 19 fields** | Folded from workflow/meta: PBI ≡ typed contract ≡ Linear ≡ bead ≡ GitHub; C1–C3 + fields 1–16 DoR |
| **§0.2 Meta XOR Product** | Lane lock; PBI-007 = Meta Beads only; Product Beads gap called out |
| **§0.3 Four-plane sync** | Beads · Linear · git · Port per lane; Linear admit/claim until PBI-007 |
| **§0.4 Coding loop** | Five steps locked; explicit ban on independent-review step |
| **§0.5 Collisions** | Summary pointing at derived workflow table |
| **§0.6 OQs / manuals** | OQ-1 open (hybrid lean); OQ-2 Notion mirror resolved; ADR-005 / Observatory / release INPUT |
| **§0.7 Agent-type roster** | Johnny lock: Muse, ChatGPT regular, ChatGPT Work, Codex, Grok, Claude, Claude Code, Claude Design; personal-agent vs coding-agent; extensible; maps to §18 Cockpit/Coding |
| **§6 Seed PBIs** | Require 19-field body; PBI-007 wording → **Meta Beads**; Atomicity → §0.5; Linear seed pack pointer |
| **§8 / §13.1 / §18 / architecture diagram** | Bare “Beads” → **Meta Beads** where Factory-kernel binding applies |
| **§10 Johnny decisions** | Corrected false “no open decisions”; OQ-1 + ADR-005 remain |
| **§18** | Classes + §0.7 roster cross-link |
| **§22 Remaster hash** | Prior SHA `0cdcefdd…8fbfd`; research pointers |

**Preserved:** EGM-buildable intent, ADR-001…011, ten Spec domains, M1 path Port→HMAC→gateway→ProjectSupervisor→SA→CI SHA→Port accept, §4.2.1 fencing, Non-Goals, no Port OAuth live create/delete, no PBI code execution from docs.

### Content hashes

| Artifact | SHA-256 |
|----------|---------|
| Pre-remaster `factory-master-spec.md` | `0cdcefdd4a04562762c62f485aa808ed24890c6dc02f7437876ee656d008fbfd` |
| Post-remaster + roster `factory-master-spec.md` | `12b70b7ab5a463c182787edf4b99bd0f561cb80707afd5cf70a29a791bca8798` |

---

## Equalization status

| Surface | Status | Notes |
|---------|--------|-------|
| `factory-master-spec.md` | **SoT** | Remastered |
| `factory-workflow.md` | **Equalized** | Status → Derived; field 7 + roster section match §0.7 (`personal-agent` / `coding-agent`); Doc control updated |
| `factory-meta-vs-product.md` | **Equalized** | Derived; fields **1–16** (was 1–13); field 7 → §0.7; Doc control updated |
| `factory-coding-loop.md` | **Equalized** | Derived; Meta Beads; §0.7 roster section; hard ban on independent-review step |
| `factory-architecture-map.md` | **Equalized** | Derived; Doc control points at master SoT |
| `AGENTS.md` | **Staged** | Live at `skills/factory/AGENTS.md` + `docs/factory-agents-md.staged.md` for meta-repo commit (FE-49 scaffold flaky on FUSE) |
| Linear **Factory Meta** | **Equalized** | Project summary + description prepend SoT rule, 19 fields, §0.7 roster, five-step loop; seed issues PBI-001…015 already present (STL-162…176) |
| Notion mirror | **Live** | FE-53 created Meta mirrors (not SoT). URLs: [`notion-factory-mirror.md`](./notion-factory-mirror.md) |
| Repo docs beyond AGENTS | **Partial** | Full meta-repo tree still FE-49; staged AGENTS carries SoT pointer for commit |

---

## Remaining diffs / flags

| ID | Item | Severity | Resolution path |
|----|------|----------|-----------------|
| **R1** | ~~Notion MCP unauthenticated~~ | Closed | Authenticated; mirrors live — [`notion-factory-mirror.md`](./notion-factory-mirror.md); still never SoT |
| **R2** | Product Beads has no §6 seed PBI (D7) | Known gap | Future Product-lane PBI — never fold into PBI-007 |
| **R3** | OQ-1 Meta Beads scaffold timing | Johnny open | Hybrid researched; Linear admit/claim until PBI-007 |
| **R4** | ADR-005 OAuth create | Johnny ops | Docs-only until authorized; never Observatory reuse |
| **R5** | Linear seed bodies may still say “fields 1–13” in older PBI markdown while master requires 1–16 | Mild | Next seed refresh: ensure every `linear-pbi-seed/PBI-*.md` + live issue includes fields 14–16 + §0.7 field 7 (PBI-007 already has 14–16 in seed file) |
| **R6** | Vendor evidence limits (Rivet queue redelivery doc conflict; Port MCP named blast-radius; Polygraph formal eval) | Non-Johnny | Documented UNVERIFIED — no invented stack decision |

**No remaining vocabulary drift** on `personal-agent-capable` / “Canonical SoT” claims in the equalized companion set after this pass.

---

## Explicit non-changes

- No independent-review / Merge! loop step  
- No Port OAuth create/delete  
- No PBI Feature Assembly code execution  
- No Notion page invent from this worker  
- No invented Johnny decisions beyond researched/locked content + §0.7 roster lock  

---

## Document control

| Doc | Role |
|-----|------|
| **This file** | Remaster + equalization status |
| [`factory-master-spec.md`](./factory-master-spec.md) | Single canonical SoT |
| [`factory-agents-md.staged.md`](./factory-agents-md.staged.md) | Staged AGENTS.md for repo commit |
