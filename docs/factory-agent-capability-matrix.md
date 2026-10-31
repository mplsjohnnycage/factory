# Factory agent capability & cost matrix

**Status:** Research deliverable for FE-56. Document-only.  
**Date:** 2026-10-28  
**Contract SoT:** [`factory-workflow.md`](./factory-workflow.md) (classes + Johnny roster) · [`factory-master-spec.md`](./factory-master-spec.md) §0.7 / §18  
**Scope:** Johnny roster + named research targets. Marks are **Y / N / Partial** with a short note. Sources are official docs unless noted.

**Legend (columns)**

| Column | Meaning for Factory Meta PBIs |
|--------|-------------------------------|
| **Repo** | Read/write a git working tree (clone, edit, commit) |
| **Cmd** | Shell / terminal command execution |
| **PR** | Create or drive GitHub pull requests |
| **Browser** | Automate or drive a real web browser |
| **Creds** | Use/store passwords or signed-in sessions for human sites (not just API keys) |
| **Provision** | Port UI / catalog / browser provisioning (Cockpit-class) |
| **Parallel** | Multiple concurrent agent sessions without colliding |
| **Worktree** | First-class git worktree isolation |

---

## 1. Capability matrix

### 1.1 Johnny roster (locked)

| Agent | Repo | Cmd | PR | Browser | Creds | Provision | Parallel | Worktree | Notes |
|-------|------|-----|----|---------|-------|-----------|----------|----------|-------|
| **Muse** (Meta) | Partial | Y | N | Y | Y | Y | Partial | N | Dedicated cloud VM + browser + terminal; secure credential store (model does not see passwords); Sentinel approval for outbound. Best Factory **personal-agent** fit. |
| **ChatGPT (regular)** | Partial | Partial | N | Partial | N | N | N | N | Chat / plugins / code artifacts; not a reliable Port provisioner or SA coding process. |
| **ChatGPT Work** | Partial | Y | Partial | Y | Y | Partial–Y | Partial | N | Cloud browser + cloud computer; secure sign-in (credentials not visible to model); can drive signed-in web tasks incl. admin UIs when sites allow. |
| **Codex** | Y | Y | Y | Partial | N | N | Y | Y | Local/cloud coding agent; managed worktrees; GitHub PR / `@codex review`; SA-eligible in-sandbox process. |
| **Grok** | Partial | Partial | N | Partial | Partial | Partial | Partial | N | Chat + Grok Bot (Premium+) with cloud computer / apps — personal-capable when Bot tier; coding path only if unit explicitly tags `coding-agent`. |
| **Claude** | Partial | Y | N | Partial | Partial | Partial | N | N | Web/desktop chat, connectors, Claude in Chrome (Pro+); Cockpit client surface — not Claude Code. |
| **Claude Code** | Y | Y | Y | N | N | N | Y | Y | M1 first SA harness (PBI-006). Native `--worktree`, parallel agents, GitHub Action → PRs. |
| **Claude Design** | Partial | N | N | N | N | N | N | N | Design/prototype artifacts canvas; export/handoff to Claude Code — **not** Port provisioning by default. |

### 1.2 Coding research targets

| Agent | Repo | Cmd | PR | Browser | Creds | Provision | Parallel | Worktree | Notes |
|-------|------|-----|----|---------|-------|-----------|----------|----------|-------|
| **Devin** | Y | Y | Y | Y | N | N | Y | Partial | Cloud SWE agent: shell, IDE, interactive browser, GitHub PRs; concurrent sessions (plan-capped). |
| **Aider** | Y | Y | Partial | N | N | N | Partial | Partial | Local git pair-programmer; auto-commits; PR via `gh`/user; worktrees via AiderDesk / manual git. |
| **SWE-agent** / **mini-SWE-agent** | Y | Y | Y | N | N | N | Partial | N | Docker ACI; `--actions.open_pr`; SWE-agent maintenance-mode — prefer mini-SWE-agent. |
| **OpenHands** | Y | Y | Y | Partial | N | N | Y | Partial | OSS/cloud coding agents in Docker sandboxes; GitHub issue→PR (`@openhands`). |
| **OpenCode** | Y | Y | Partial | N | N | N | Y | Partial | OSS terminal/desktop/IDE agent; multi-session; SA-documented process; PR via shell/`gh`. |
| **Continue** | Y | Y | Partial | N | N | N | N | N | IDE Agent mode: edit files + run terminal; PR not first-class. |
| **GitHub Copilot** (coding agent) | Y | Y | Y | N | N | N | Y | N | Async cloud agent opens draft PRs via Actions; Pro+ required for agent. |
| **AutoGPT** | Partial | Partial | Partial | Partial | Partial | N | Y | N | Workflow / “Experts” platform with integrations — **not** an SA coding admit process. |

### 1.3 Browser / environment research targets

| Agent / product | Repo | Cmd | PR | Browser | Creds | Provision | Parallel | Worktree | Notes |
|-----------------|------|-----|----|---------|-------|-----------|----------|----------|-------|
| **Stagehand** | N | N | N | Y | Partial | Partial | Y | N | Browserbase AI browser SDK (`act` / `extract` / `observe`). Hands for an agent brain — not a roster agent. |
| **Browserbase** | N | N | N | Y | Partial | Partial | Y | N | Hosted browser infra for Stagehand/Playwright; Free→Developer $20/mo. |
| **Orca** ([onorca.dev](https://www.onorca.dev/)) | Y | Y | Partial | Y | Partial | Partial | Y | Y | **Clarified:** Stably’s **agent development environment** (not an LLM brand). Runs Claude Code/Codex/etc. in parallel worktrees; embedded Chromium + `orca computer` desktop use + CLI. Not Johnny roster. |

> **Orca disambiguation:** In this research pass, **Orca = Stably Orca** (agent IDE with per-worktree browser + computer-use CLI). It is **not** a Meta Muse synonym, not Browserbase Stagehand, and not an Oracle product. If Johnny meant a different “Orca,” re-lock the name before tagging contracts.

### 1.4 Orchestrators (do **not** fit Factory M1 as SA coding processes)

| Framework | Repo | Cmd | PR | Browser | Creds | Provision | Parallel | Worktree | Factory M1 flag |
|-----------|------|-----|----|---------|-------|-----------|----------|----------|-----------------|
| **CrewAI** | Partial | Partial | Partial | Partial | N | N | Y | N | **Orchestrator only** — multi-agent crews/flows; must wrap an SA-admitted coding process or Cockpit client. Not a Sandbox Agent harness. |
| **AutoGen** | Partial | Partial | Partial | Partial | N | N | Y | N | **Orchestrator only**; Microsoft marks AutoGen **maintenance mode** → prefer Microsoft Agent Framework for new work. Same Factory gap: no SA binding. |

Rivet **Actors** (orchestration) ≠ Sandbox Agent (coding) ≠ Muse-class computer use — [`factory-workflow.md`](./factory-workflow.md).

---

## 2. Cheapest viable configs for Factory Meta PBIs

**Viable** = can execute the tagged class for a Meta unit:

- **coding-agent:** repo edit + commands + path to PR (task → standardize → PR → build → loop).
- **personal-agent-capable:** browser + signed-in / credentialed Port UI or similar provisioning.

Rough **$/task** is order-of-magnitude from published benches or plan amortization — not a quote.

### 2.1 Coding-agent class — cheapest viable

| Rank | Agent + model/config | Rough cost | Why viable |
|------|----------------------|------------|------------|
| **1** | **OpenCode** + Zen **free** models (e.g. Big Pickle / listed Free Flash models) when offers apply | **~$0** inference (+ local compute) | Local repo + shell; multi-session; PR via `gh`. Free-tier quality varies — fail closed to paid Flash/DeepSeek if edits break. |
| **2** | **Aider** + **DeepSeek chat / V3.2-Exp Chat** | **~$0.01–0.50**/small–medium PBI | Aider polyglot bench: DeepSeek-V3.2 Chat ≈ **$0.88 / 225** exercises (~**$0.004**/exercise). Real Meta PBI larger → still typically **≪$1**. Commits native; open PR with `gh`. |
| **3** | **Aider** / **OpenCode** / **mini-SWE-agent** + **DeepSeek reasoner** *or* **GitHub Copilot Pro** coding agent | **~$0.05–2**/task *or* **$10/mo** + AI credits | Reasoner higher quality (~$1.3/225 on Aider board). Copilot Pro amortizes draft-PR cloud agent for light Meta volume. |

**Honorable / M1-aligned (not cheapest):**

| Agent + config | Rough cost | Note |
|----------------|------------|------|
| **Claude Code** + Sonnet (Pro $20/mo shared pool) | Plan-amortized; heavy days ~**$6–15**/active-day (Anthropic enterprise avg cited ~$13/dev/day) | **M1 first harness** — prefer for admit path even when not cheapest. |
| **Codex** on ChatGPT Plus/Pro | Plus **$20/mo** / Pro **$200/mo** + usage | SA-eligible; worktrees + PR workflows documented. |
| **OpenHands** OSS + BYOK cheap model | Model tokens only | Full agent product; self-host free, Teams $500/mo. |
| **Devin** Pro | **$20/mo** + on-demand credits | Strong parallel SWE; overkill/costly vs OSS for Meta seed PBIs. |
| **SWE-agent** / mini + frontier model | Cap via `--per_instance_cost_limit` (docs example **$2**) | Research harness; maintenance-mode for classic SWE-agent. |

#### Coding-agent cost ranking (cheapest → dearest for Meta-scale tasks)

1. OpenCode + Zen free models  
2. Aider + DeepSeek Chat  
3. mini-SWE-agent / OpenHands BYOK + cheap model  
4. Copilot Pro coding agent  
5. Claude Code on Pro (Sonnet)  
6. Codex on Plus  
7. Claude Code / Codex on Max or Opus  
8. Devin Max / Teams  

### 2.2 Personal-agent-capable class — cheapest viable

| Rank | Agent + config | Rough cost | Why viable for Port/browser provisioning |
|------|----------------|------------|------------------------------------------|
| **1** | **ChatGPT Work** on **Plus** | **$20/mo** | Official cloud browser + secure credential entry; cloud computer controls; can operate signed-in admin UIs when sites allow bots. |
| **2** | **Claude** Pro + Claude in Chrome / computer-use beta | **$20/mo** ($17/mo annual) | Browser assist + connectors; weaker than Muse/Work for password-bearing Port flows. |
| **Top capability (not cheapest)** | **Muse** | Meta personal agent (availability/pricing regional — confirm at signup) | Factory roster #1 for provisioning: VM + browser + credential store + approval. |
| Alt | **Grok Bot** (X Premium+) | Premium subscription (~**$30/mo** class) | Own cloud computer / apps — personal-capable when Bot tier unlocked. |

#### Personal-agent cost ranking (cheapest → dearest among capable options)

1. ChatGPT Work on Plus ($20)  
2. Claude Pro + Chrome ($20)  
3. Grok Bot on Premium+  
4. Muse (best capability match; confirm pricing/access)  
5. ChatGPT Pro / Claude Max / Gemini Ultra tiers for heavier cloud-browser quotas  

**Claude Design** is cheap (Free+) but **fails** Port provisioning — design artifacts only. Use for UI mock PBIs tagged personal/design, not catalog provision.

**Stagehand + Browserbase Free/Developer ($0–$20)** can script Port UI as a **tool under** a personal agent / orchestrator — not a roster agent by itself.

---

## 3. Factory contract class map

From [`factory-workflow.md`](./factory-workflow.md): every unit field **7** = `{class}:{roster-tag}` where class is **`personal-agent-capable`** *xor* **`coding-agent`**.

| Agent | Recommended class | Roster? | Fits Factory M1? | Flag |
|-------|-------------------|---------|------------------|------|
| **Muse** | `personal-agent-capable` | Yes (#1) | Yes (Cockpit / provision) | — |
| **ChatGPT regular** | either (tag explicitly) | Yes (#2) | Partial | Weak for both SA coding and Port provision — prefer Work or Claude Code. |
| **ChatGPT Work** | either; **personal** for provision | Yes (#3) | Yes (personal) | Prefer personal for Meta Port setup; coding only if unit says so. |
| **Codex** | `coding-agent` | Yes (#4) | Yes (SA process) | — |
| **Grok** | either (tag explicitly) | Yes (#5) | Partial | Bot tier → personal; chat-only → weak. |
| **Claude** | either; default personal | Yes (#6) | Partial | Cockpit client; not Claude Code. |
| **Claude Code** | `coding-agent` | Yes (#7) | **Yes — M1 first** | PBI-006 / ADR-006. |
| **Claude Design** | `personal-agent-capable` | Yes (#8) | Partial | Design/UI only — **do not** assign Port provision. |
| **Devin** | `coding-agent` | Research / extensible | Yes as coding product | Not on locked roster until Johnny adds. |
| **Aider** | `coding-agent` | Research | Yes (local coding) | Not roster; good cheap Meta executor. |
| **SWE-agent / mini** | `coding-agent` | Research | Yes | Prefer mini-SWE-agent. |
| **OpenHands** | `coding-agent` | Research | Yes | — |
| **OpenCode** | `coding-agent` | Research (§18.1 SA list) | Yes | Eligible SA process; add to roster to tag contracts. |
| **Continue** | `coding-agent` | Research | Partial | IDE assist; weak autonomous PR loop. |
| **GitHub Copilot coding agent** | `coding-agent` | Research | Yes | Native GH draft PRs. |
| **AutoGPT** | neither cleanly | Research | **No for M1 SA** | Workflow platform ≠ SA coding admit. |
| **Stagehand** | tool (under personal) | No | Tool only | Pair with Muse/Work/Crew for provision scripts. |
| **Browserbase** | infra | No | Infra only | — |
| **Orca** | environment | No | Env for coding agents | Hosts Claude Code/Codex worktrees; not itself a class. |
| **CrewAI** | orchestrator | No | **No as SA** | Needs SA coding process underneath. |
| **AutoGen** | orchestrator | No | **No as SA** | Maintenance mode; same gap. |

### M1 non-fits (summary)

Do **not** assign Factory M1 coding `WorkAttempt` units to: **CrewAI**, **AutoGen**, **AutoGPT** (alone), **Claude Design**, **Stagehand/Browserbase** (alone), or **Orca** (alone). Orchestrators/environments may **supervise** Claude Code / Codex / OpenCode inside Rivet Sandbox Agent, but the contract’s coding agent must be an SA-eligible process.

---

## 4. Sources (official)

| Topic | Source |
|-------|--------|
| Factory classes / roster | [`factory-workflow.md`](./factory-workflow.md); [`factory-master-spec.md`](./factory-master-spec.md) §0.7 / §18 |
| Devin | [docs.devin.ai intro](https://docs.devin.ai/get-started/devin-intro); [GitHub integration](https://docs.devin.ai/integrations/gh); [pricing](https://devin.ai/pricing); [self-serve plans](https://docs.devin.ai/admin/billing/self-serve) |
| Aider | [aider.chat/docs](https://aider.chat/docs/); [LLMs](https://aider.chat/docs/llms.html); [leaderboards](https://aider.chat/docs/leaderboards/) |
| SWE-agent | [swe-agent.com](https://swe-agent.com/latest/); [CLI tutorial / open_pr](https://github.com/princeton-nlp/SWE-agent/blob/main/docs/usage/cl_tutorial.md) |
| OpenHands | [docs.openhands.dev GitHub](https://docs.openhands.dev/openhands/usage/cloud/github-installation); [pricing](https://www.openhands.dev/pricing); [GitHub README](https://github.com/OpenHands/OpenHands) |
| Codex | [Worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees); [Workflows / PR](https://developers.openai.com/codex/workflows/); [CLI](https://learn.chatgpt.com/docs/codex/cli) |
| Claude Code | [Worktrees](https://code.claude.com/docs/en/worktrees); [Parallel agents](https://code.claude.com/docs/en/agents); [GitHub Actions](https://code.claude.com/docs/en/github-actions); [Costs](https://code.claude.com/docs/en/costs); [claude.com/pricing](https://claude.com/pricing) |
| OpenCode | [opencode.ai/docs](https://opencode.ai/docs/); [Zen pricing](https://opencode.ai/docs/zen/) |
| Continue | [Agent mode tools](https://docs.continue.dev/ide-extensions/agent/how-it-works) |
| Copilot | [Coding agent GA](https://github.blog/changelog/2025-09-25-copilot-coding-agent-is-now-generally-available/); [Plans](https://github.com/features/copilot/plans); [AI credits billing](https://docs.github.com/en/copilot/concepts/billing-and-usage/individuals/billing) |
| AutoGPT | [agpt.co](https://agpt.co/); [Platform API](https://agpt.co/docs/platform/api-and-integrations/api-guide) |
| Stagehand / Browserbase | [Stagehand intro](https://docs.stagehand.dev/v4/first-steps/introduction); [Browserbase Stagehand quickstart](https://docs.browserbase.com/welcome/quickstarts/stagehand); [Browserbase pricing](https://www.browserbase.com/pricing) |
| Orca | [onorca.dev](https://www.onorca.dev/); [Browser overview](https://www.onorca.dev/docs/browser/overview); [Computer use](https://www.onorca.dev/docs/cli/computer-use) |
| CrewAI | [docs.crewai.com](https://docs.crewai.com/); [Flows](https://docs.crewai.com/edge/en/concepts/flows) |
| AutoGen | [microsoft/autogen](https://github.com/microsoft/autogen) (maintenance mode notice) |
| Muse | [Meta intro](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/); [Safety / VM / creds](https://ai.meta.com/blog/security-and-safety-for-ai-agents-our-approach-with-muse/); [Browser help](https://www.meta.com/help/artificial-intelligence/2124746764949121/) |
| ChatGPT Work | [Cloud browser](https://help.openai.com/en/articles/20001280-using-cloud-browser-in-chatgpt); [chatgpt.com/pricing](https://chatgpt.com/pricing/) |
| Claude Design | [Get started](https://support.claude.com/en/articles/14604416-get-started-with-claude-design); [claude.com/product/design](https://claude.com/product/design) |

---

## 5. Bottom line for Meta execution

- **Cheapest coding path that still ships PRs:** OpenCode (free Zen) → Aider+DeepSeek → Copilot Pro / Claude Code Pro.  
- **M1 default coding tag remains Claude Code** even when OSS is cheaper.  
- **Cheapest personal provision path:** ChatGPT Work on Plus.  
- **Best personal capability match:** Muse.  
- **Do not confuse** Orca (agent IDE), Stagehand (browser SDK), and Muse (personal agent).
