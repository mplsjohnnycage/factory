# Diamond / Compound Engineering — term lookup

**Date:** 2026-10-28  
**Primary source:** Project ASDLC skill at `skills/asdlc/`  
**Also checked:** live web, GitHub, Context7 (CopilotKit / AG-UI), LogicSRC site + GitHub, other Project/workspace skills  

---

## Verdict (term table)

| Term | Defined in ASDLC skill? | What it refers to | External corroboration |
|------|-------------------------|-------------------|------------------------|
| **Compound Engineering** | **Yes** — concept | Every, Inc. practice: Plan → Work → Review → **Compound** (write learnings back to persistent context) | Strong — Every guides, GitHub plugin, secondary articles |
| **Compound Loop** | **Yes** — pattern | ASDLC structural shape under Compound Engineering: HITL-gated writeback + specialized JIT context | ASDLC-owned naming; web discusses CE loop, not always this name |
| **Agentic Double Diamond** | **Yes** — pattern | Design-Council Double Diamond remade as agentic pipeline (Discover → Define → Spec → Assemble → Run) | ASDLC.io + cited Effective Delivery / Design Council; thin secondary use of exact phrase |
| **Diamond engineering** | **No** | — | **No** agentic-SDLC methodology found (hits are civil firms, materials, Sheffield “Diamond” building) |
| **Diamond spec** | **No** as coined methodology | Spec is a *phase* + pattern inside Agentic Double Diamond / The Spec — not a named “diamond spec” method | Phrase not found as coined methodology |
| **Compound spec** | **No** as coined methodology | — | Only incidental English (“compound spec gaps”), not a named method |
| **Diamond requirements** | **No** | — | **Nothing found** as coined methodology |

**ASDLC does not define** the phrases *diamond engineering*, *diamond spec*, *compound spec*, or *diamond requirements*. Closest diamond match is **Agentic Double Diamond**; closest compound match is **Compound Engineering** (+ **Compound Loop**).

---

## 1. ASDLC skill — quotes and paths

Skill root: `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/skills/asdlc/`

### 1.1 Compound Engineering

**Path:** `skills/asdlc/concepts/compound-engineering.md`  
**Online:** [asdlc.io/concepts/compound-engineering](https://asdlc.io/concepts/compound-engineering/)  
**Status in frontmatter:** Live (published/updated 2026-05-21)

Definition:

> **Compound engineering** is a practice of structuring knowledge work around feedback loops where each cycle's output includes both the artifact and the learnings about producing it, written back to persistent context for future practitioners — human or agent — to ingest. The term was popularized by Every, Inc. in January 2026 in the context of software development.

Operational loop:

> Compound engineering, as articulated by Every, is operationalized as a four-stage loop:  
> - **Plan** (roughly 40% of cycle time)…  
> - **Work**. The agent generates changes alongside matching tests…  
> - **Review**. Automated layers… then structural review…  
> - **Compound**. The reviewer extracts the operational lessons… and writes them back to persistent context files on disk — `AGENTS.md`, `CLAUDE.md`, skill registries, `STRATEGY.md`.

Adjacent distinction (do not conflate):

> The Berkeley Artificial Intelligence Research group uses *compound AI system* to describe an architecture that composes multiple interacting components… within a single inference session… It is not the same as Every's compound engineering. Berkeley composes capability within a session; Every accumulates capability across sessions.

ASDLC mapping:

> In ASDLC's vocabulary, the structural pattern compound engineering operationalizes is documented as the [Compound Loop](../patterns/compound-loop.md)…

Skill references (from frontmatter): Every “Definitive Guide”, Every “How Every Codes With Agents”, [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin), Vinci Rufus secondary summary, BAIR compound AI systems post, Kevin Rose interview.

### 1.2 Compound Loop

**Path:** `skills/asdlc/patterns/compound-loop.md`  
**Online:** [asdlc.io/patterns/compound-loop](https://asdlc.io/patterns/compound-loop)  
**Status:** Live (2026-05-21)

> The compound-loop is a structural pattern in which each cycle of iterative work produces both an artifact and candidate machine-readable learnings about producing it. The learnings cross a human-in-the-loop gate before being persisted to specialized, scoped context artifacts; the next cycle ingests those artifacts on demand rather than loading the team's full accumulated memory.

> **[Compound Engineering](../concepts/compound-engineering.md)** — the named practice that operationalizes this pattern, articulated by Every in January 2026 with the Plan-Work-Review-Compound vocabulary. The concept article describes the term as the industry uses it; this pattern article describes the structural shape ASDLC documents underneath.

### 1.3 Agentic Double Diamond (not “diamond engineering”)

**Path:** `skills/asdlc/patterns/agentic-double-diamond.md`  
**Online:** [asdlc.io/patterns/agentic-double-diamond](https://asdlc.io/patterns/agentic-double-diamond/)  
**Status:** Experimental (lastUpdated 2026-02-25)

> The **Agentic Double Diamond** is a computational framework that transforms the traditional design thinking model (Discover, Define, Develop, Deliver) into an executable pipeline where every phase produces machine-readable context rather than static artifacts.

> In this model, the **Spec** becomes the primary source code, and "Coding" becomes an automated assembly step. The human role shifts from *Implementation* to *Context Engineering* and *Verification*.

> The Agentic Double Diamond reimagines the two diamonds not as workshop phases, but as **Context Furnaces**. Each furnace ingests raw, unstructured input and refines it into a stricter, more deterministic state.  
> - **Diamond 1 (Problem Space):** Ingests Chaos → Refines to **Insight**.  
> - **Diamond 2 (Solution Space):** Ingests Insight → Refines to **Implementation**.

Phases named in the skill: **DISCOVER → DEFINE → SPEC → ASSEMBLE → RUN**, with adversarial gates (requirement review / code review).

Skill references: Design Council Double Diamond; Codurance “Spec is Code”; Daniel Donbavand adversarial requirement review; Effective Delivery AI-driven framework (30–40% speed claim).

**Grep confirmation:** phrase `diamond engineering` — **zero matches** anywhere under `skills/asdlc/`.

### 1.4 Related ASDLC mentions (not separate coined methods)

| Path | Note |
|------|------|
| `patterns/the-spec.md` | Aligns living specs with classic “double diamond” (Develop → Deliver); does **not** coin “diamond spec” |
| `practices/adversarial-requirement-review.md` | Points at Agentic Double Diamond as gate to the second diamond |
| `concepts/4d-framework.md` | Contrasts 4D with process models “e.g., Agile or Double Diamond” |
| `concepts/index.md` / `patterns/index.md` | Index **Compound Engineering** and **Agentic Double Diamond** |

**ASDLC does not define:** diamond engineering; diamond spec; compound spec; diamond requirements.

---

## 2. Web / GitHub / Context7 — corroboration or contradiction

### 2.1 Compound Engineering — corroborated

| Source | Role |
|--------|------|
| [Compound Engineering — Every guide](https://every.to/guides/compound-engineering) | Canonical loop; ~80% plan/review, 20% work/compound; Compound step “most important” |
| [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) | Official plugin (`/ce-brainstorm`, `/ce-plan`, `/ce-work`, `/ce-compound`, …) |
| [asdlc.io Compound Engineering](https://asdlc.io/concepts/compound-engineering/) | Matches skill text |
| [agentpatterns.ai compound-engineering](https://agentpatterns.ai/workflows/compound-engineering/) | Same cycle vocabulary |
| [velvetshark.com](https://velvetshark.com/compound-engineering-workflow), [vincirufus.com](https://www.vincirufus.com/en/posts/compound-engineering/) | Secondary popularization |
| [AI Engineer talk](https://ai.engineer/talks/_ehJyfHg1Vk-era-compound-engineering) / Klaassen | “Era of Compound Engineering” |

**No contradiction** with ASDLC’s Every attribution or Plan–Work–Review–Compound framing. ASDLC *adds* HITL discrimination / Intent Debt critique and maps CE → Compound Loop — that is extension, not contradiction of Every’s marketing.

**Related but different:** BAIR [Compound AI Systems](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/) — runtime multi-component systems; ASDLC explicitly warns against conflating with Compound Engineering.

### 2.2 Agentic Double Diamond — weak external footprint; no contradiction

- Origin of shape: [Design Council Double Diamond](https://www.designcouncil.org.uk/our-work/skills-learning/tools-frameworks/framework-for-innovation-design-council-s-evolved-double-diamond/) (classic design, not agentic coinage).
- Exact phrase **Agentic Double Diamond** primarily surfaces via [asdlc.io](https://asdlc.io/patterns/agentic-double-diamond/) (and this skill). Industry “Research → Plan → Implement → Review” examples (e.g. Effective Delivery) align thematically; they do not widely rebrand as “Agentic Double Diamond.”
- Web search for `"diamond engineering"` + agent/SDLC returned **unrelated** hits (civil “Diamond Engineering” companies, materials science diamond, Sheffield Diamond Engineering building / AI student story) — **not** an agentic methodology.

### 2.3 Coined variants — nothing found as methodologies

| Phrase | Finding |
|--------|---------|
| diamond engineering | **Not** an agentic-SDLC coined method in search results |
| diamond spec | **Not found** as named method |
| compound spec | **Not found** as named method (incidental prose only) |
| diamond requirements | **Not found** |

### 2.4 Context7 (CopilotKit / AG-UI)

| Library | Query | Result |
|---------|-------|--------|
| `/websites/copilotkit_ai` | compound / diamond engineering / agentic double diamond | **No documentation matched** |
| `/websites/ag-ui` | same | Returns protocol design principles / building blocks only — **no** Compound Engineering or Double Diamond methodology |

AG-UI/CopilotKit are **interaction/UI protocols and clients**, not SDLC methodology brands.

---

## 3. LogicSRC (`logicsrc.com` + `github.com/profullstack/logicsrc`)

**Do they use these terms?** **No evidence they do**, for the methodology phrases under study.

| Check | Result |
|-------|--------|
| [logicsrc.com/specs/process](https://logicsrc.com/specs/process) | Lists ASDLC, OpenPRD, OpenSwarm, … — **no** compound/diamond engineering language |
| [logicsrc.com/asdlc](https://logicsrc.com/asdlc) | Own **nine-phase** Agentic SDLC (Frame → Fan out → … → Ratchet → Promote). Highlights for compound/diamond returned **no** such terms |
| GitHub search `site:github.com/profullstack` for compound-engineering / agentic-double-diamond / Compound Engineering / double diamond | **Empty results** |
| Project notes `docs/logic-src-overview.md`, `logicsrc-monorepo.md`, `logicsrc-artifact-inventory.md` | **No** compound/diamond matches |

**Important distinction:** LogicSRC’s **ASDLC** product page is a lifecycle/conformance spec hosted under LogicSRC. The Project skill `skills/asdlc/` is the **asdlc.io knowledge base** (concepts/patterns including Compound Engineering and Agentic Double Diamond). Sharing the “ASDLC” acronym does **not** mean LogicSRC documents Compound Engineering or Agentic Double Diamond on the pages scraped for this report.

---

## 4. AG-UI, CopilotKit, other workspace skills

| Surface | Hits on diamond/compound *methodology*? |
|---------|------------------------------------------|
| **AG-UI docs** (Context7 + prior stack audit) | **No** — protocol only |
| **CopilotKit docs** (Context7) | **No** |
| Factory docs mentioning AG-UI/CopilotKit | Stack/master-spec treat them as UI/HITL layer; **no** diamond/compound methodology linkage |
| **Project `skills/`** | Only **`skills/asdlc/`** defines these terms |
| Other Cursor plugin caches | **Every Compound Engineering plugin** present under `~/.cursor/plugins/cache/cursor-public/680/…` (plugin tree with `ce-*` skills) — **corroborates Compound Engineering tooling**, not “diamond engineering” |

---

## 5. How the two ASDLC matches relate (for Factory use)

```
Agentic Double Diamond          Compound Engineering / Compound Loop
(problem→spec→assembly)         (cross-cycle memory)
Discover → Define → Spec        Plan → Work → Review → Compound
         → Assemble → Run              ↑ writeback to AGENTS.md / skills
              │                        │
              └──── Spec as code ──────┘ learnings may feed living specs
                   (Learning Loop)       or agent-context substrate
```

- Use **Agentic Double Diamond** language for *how a feature is framed and verified before assembly*.  
- Use **Compound Engineering / Compound Loop** for *how the factory gets smarter every cycle*.  
- Do **not** invent “diamond engineering” as a synonym unless a primary source appears later.

---

## Sources

### ASDLC skill (local)
- `skills/asdlc/concepts/compound-engineering.md`
- `skills/asdlc/patterns/compound-loop.md`
- `skills/asdlc/patterns/agentic-double-diamond.md`
- `skills/asdlc/patterns/the-spec.md`
- `skills/asdlc/practices/adversarial-requirement-review.md`
- `skills/asdlc/concepts/4d-framework.md`

### Web / GitHub
- [Compound Engineering \| ASDLC.io](https://asdlc.io/concepts/compound-engineering/)
- [Agentic Double Diamond \| ASDLC.io](https://asdlc.io/patterns/agentic-double-diamond/)
- [Compound Engineering — Every](https://every.to/guides/compound-engineering)
- [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)
- [Design Council Double Diamond](https://www.designcouncil.org.uk/our-work/skills-learning/tools-frameworks/framework-for-innovation-design-council-s-evolved-double-diamond/)
- [BAIR Compound AI Systems](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/)
- [LogicSRC ASDLC](https://logicsrc.com/asdlc)
- [LogicSRC Agents and process](https://logicsrc.com/specs/process)
- [AG-UI introduction / architecture](https://docs.ag-ui.com/introduction) (via Context7 `/websites/ag-ui`)
- CopilotKit docs (Context7 `/websites/copilotkit_ai` — no methodology hits)
