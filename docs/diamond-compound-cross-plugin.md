# Diamond / Compound terminology — cross-plugin sweep

Sweep of installed skill, plugin, and local MCP-related paths for the query phrases:

| Phrase | Result (installed surface) |
| --- | --- |
| diamond engineering | **nothing** |
| compound engineering | **hits** (Compound Engineering plugin + ASDLC skill) |
| diamond spec | **nothing** |
| compound spec | **nothing** |
| diamond requirements | **nothing** |
| compound loop | **hits** (ASDLC skill; CE plugin has hyphenated *asset* names only) |
| double diamond | **hits** (ASDLC skill only) |
| agentic diamond | **nothing** (no bare form; see *agentic double diamond*) |
| agentic double diamond | **hits** (ASDLC skill only; related to “agentic diamond”) |

**Scope searched (2026-10-28):**

- `/home/ubuntu/.cursor/skills-cursor`
- `/home/ubuntu/.cursor/plugins` (cache; no `plugins/local`)
- `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/skills`
- `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/plugins`
- `/agent` (empty workspace root; no skills/plugins trees)
- `/home/ubuntu/.cursor/projects/agent/mcps` (MCP server descriptor dirs)

Method: case-insensitive content search for the exact phrases above, plus filename globs `*diamond*` / `*compound*`. Diagram-geometry uses of the word “diamond” (flowchart decision shape) are **not** counted as methodology hits.

---

## Consolidated summary

1. **Only two installed surfaces carry the methodology vocabulary:** Every Inc. **Compound Engineering** plugin (`cursor-public/680`, v3.29.0) and the project-store **ASDLC** skill (`skills/asdlc`).
2. **“Compound engineering”** is native to the CE plugin (~83 files) and is also documented as an ASDLC concept.
3. **“Compound loop” / “Agentic Double Diamond” / “double diamond”** live in ASDLC patterns/concepts. CE does **not** use the spaced phrase “compound loop”; it ships demo assets named `compound-loop.*` and skills `ce-compound` / `ce-compound-refresh`.
4. **Absent everywhere searched:** diamond engineering, diamond spec, compound spec, diamond requirements, and bare “agentic diamond.”
5. **All other** Cursor skills-cursor entries, marketplace plugins, elephant-goldfish plugin tree, `/agent`, and local MCP descriptor dirs: **nothing.**

---

## Hits

### Compound Engineering plugin (`compound-engineering` / EveryInc)

- **Root:** `/home/ubuntu/.cursor/plugins/cache/cursor-public/680/dd1bf2b8d905fb9283ca16459bcc4ed172afa8fd`
- **Identity:** `.cursor-plugin/plugin.json` — `name: compound-engineering`, `displayName: Compound Engineering`, `version: 3.29.0`
- **Phrase hits:**
  - **compound engineering** — pervasive (README, STRATEGY, CONCEPTS, site, docs/guides, docs/specs, tests, skills such as `lfg`, `ce-setup`, `ce-proof`, `ce-work`, etc.; ~83 files)
  - **compound loop** (spaced) — **nothing**
  - **compound-loop** (hyphenated filenames / references) — demo assets and docs that name those assets
  - diamond engineering / diamond spec / compound spec / diamond requirements / double diamond / agentic diamond — **nothing** (HTML “diamond = decision” shape notes in brainstorm/ideate/plan rendering refs are unrelated)

**Primary paths:**

| Role | Path |
| --- | --- |
| Plugin manifest | `.../680/dd1bf2b8d905fb9283ca16459bcc4ed172afa8fd/.cursor-plugin/plugin.json` |
| Compound skill | `.../skills/ce-compound/SKILL.md` |
| Compound refresh skill | `.../skills/ce-compound-refresh/SKILL.md` |
| Guides | `.../docs/guides/ce-compound.md`, `.../docs/guides/ce-compound-refresh.md` |
| Demo “compound loop” assets | `.../assets/demo/compound-loop.tape`, `.../assets/demo/compound-loop.gif`, `.../assets/demo/README.md` |
| Feedback format named CE | `.../skills/ce-riffrec-feedback-analysis/references/compound-engineering-feedback-format.md` |
| Concepts doc | `.../CONCEPTS.md` (§ Compound engineering) |
| Repo config dir name | `.../.compound-engineering` (+ test fixtures under `tests/skill-eval-cell/fixtures/*/.compound-engineering`) |

Full skill list under that plugin includes `ce-brainstorm`, `ce-plan`, `ce-work`, `ce-compound`, `ce-compound-refresh`, `lfg`, and the rest of the CE catalog — all branded under Compound Engineering even when individual skill files do not repeat every search phrase.

---

### ASDLC skill (project store)

- **Root:** `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/skills/asdlc`
- **Skill entry:** `.../skills/asdlc/SKILL.md`

| Phrase | Files |
| --- | --- |
| **compound engineering** | `concepts/compound-engineering.md`, `concepts/index.md`, `patterns/compound-loop.md` |
| **compound loop** | `patterns/compound-loop.md`, `concepts/compound-engineering.md`, `concepts/levels-of-autonomy.md`, `patterns/index.md` |
| **double diamond** | `patterns/agentic-double-diamond.md`, `patterns/index.md`, `patterns/the-spec.md`, `patterns/adversarial-code-review.md`, `practices/adversarial-requirement-review.md`, `concepts/4d-framework.md` |
| **agentic double diamond** | `patterns/agentic-double-diamond.md`, `patterns/index.md`, `patterns/adversarial-code-review.md`, `practices/adversarial-requirement-review.md` |
| diamond engineering / diamond spec / compound spec / diamond requirements / agentic diamond | **nothing** |

**Canonical articles:**

- `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/skills/asdlc/concepts/compound-engineering.md`
- `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/skills/asdlc/patterns/compound-loop.md`
- `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/skills/asdlc/patterns/agentic-double-diamond.md`

---

## Nothing (explicit)

### `/home/ubuntu/.cursor/skills-cursor`

All installed Cursor-built-in skills (agent-sdk-*, canvas, env-setup, migrate-to-builds, subscribe, walkthrough-artifacts): **nothing.**

### Project store plugins

`/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/plugins` (incl. elephant-goldfish-model skills tree): **nothing.**

### `/agent`

No skills/plugins trees; content search: **nothing.**

### MCP-related local dirs

`/home/ubuntu/.cursor/projects/agent/mcps` (Svelte, Bright_Data, Convex, Playwright, Encore-mcp, Opensearch, Shadcn, AWS MCP servers, Ddg-search, etc.): **nothing.** No separate MCP-local skill directories containing the phrases were found under `/home/ubuntu`.

### Other Cursor marketplace plugins (cache)

Every installed plugin under `/home/ubuntu/.cursor/plugins/cache/cursor-public/` **except** `680` (Compound Engineering): **nothing.**

Including (non-exhaustive of IDs; all swept): Postman, svelte, convex, Port, composio, apollo, apify, Agent Compatibility, Encore, dbt, notion-workspace, cloudflare, Gmail/Calendar/Docs/Drive, Bright Data, agentmail, Playwright, X, remotion, here.now, linear, Mobbin, Manufact, Context.dev, Treg, Exa, Customer.io, Ahrefs, Semrush, postiz, Turso, Crustdata, Grok Voice, Docs Canvas, PR Review Canvas, monid, Create Plugin, vercel-plugin, Browserless, orthogonal, slack, browse, superpowers, OpenSearch Agent Skills, Refero, shadcn/ui, Parallel, adapter-mind, clerk, Floot, docker-skills, gsap-skills, Simmie, impeccable, n8n, huggingface-skills, Context7, Langfuse, runlayer, adaption, 21st.dev, fullenrich, Firecrawl, pstack, and remaining cached IDs in that tree.

### `plugins/local`

Path absent / empty: **nothing** to search beyond cache.
