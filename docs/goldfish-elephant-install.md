# Goldfish / Elephant install

## What was found

| Repo | URL | Notes |
|------|-----|--------|
| **google/elephant-goldfish-model** (EGM) | https://github.com/google/elephant-goldfish-model | Official Google open-source **Agent Plugin** for spec-driven design: Elephant drafts with full context; Goldfish reviewers run in fresh/zero conversation context. Skills: brainstorm, draft, review, resolve, bootstrap, review-loop, drift-report. |
| Fallenstedt/elephant-goldfish | https://github.com/Fallenstedt/elephant-goldfish | Community fork of vshvedov; Claude/Codex/Gemini/**Cursor** bootstraps (`eg-*` skills under `.cursor/skills/`). |
| vshvedov/elephant-goldfish | https://github.com/vshvedov/elephant-goldfish | Upstream of the community Cursor bootstrap (`cursor/BOOTSTRAP.md`). |

Related: open issue [google/elephant-goldfish-model#145](https://github.com/google/elephant-goldfish-model/issues/145) tracks **verified Cursor** support (not claimed on `main` yet). Site: https://egm.dev. Essay origin: Dave Rensin’s Elephant/Goldfish piece.

No separate GitHub Releases were required for install (clone from `main`).

## Which picked

**Picked: [google/elephant-goldfish-model](https://github.com/google/elephant-goldfish-model)** — most relevant for AI coding agents (official EGM plugin used for design-before-code).

Did **not** install the Fallenstedt/vshvedov community Cursor bootstraps (different `eg-*` skill set; not the Google plugin).

## What install did

Official README install paths are Antigravity / Claude Code / Codex / omp. For other agents it says: *Ask your agent: `Install https://github.com/google/elephant-goldfish-model`*. Harnesses docs require the **complete** plugin (`skills/` + `agents/` + `resources/`); skill-only copies break EGM.

Cursor loads **Agent Plugins** (`plugin.json` at root) from `~/.cursor/plugins/local/<name>/`, so install was a full shallow clone there (not `npx skills add`, which only copies skill folders).

Commit installed: `05f8984` from `main`.

Also: workspace clone + Project store copy; short `/agent/AGENTS.md` with EGM artifact-dir hint. A brief accidental `npx skills add … egm-brainstorm` skill-only install was removed.

**Caveat:** Cursor host support is not yet verified upstream (#145). Reload Cursor / reopen agent session so local plugin discovery picks up `egm`. Goldfish reviews need fresh subagents.

## Paths installed

| Path | Role |
|------|------|
| `~/.cursor/plugins/local/egm/` | Primary Cursor local Agent Plugin (full tree: `plugin.json`, `skills/`, `agents/`, `resources/`, …) |
| `/agent/elephant-goldfish-model/` | Workspace clone of the same repo |
| `/cursor/stores/bc-72015999-a671-4fe7-8415-0047060819ae/artifacts/elephant-goldfish-model/` | Project-store durable copy |
| `/agent/AGENTS.md` | Notes EGM location + `EGM artifact directory: .dev/docs` |

Skills under the plugin: `egm-bootstrap`, `egm-brainstorm`, `egm-draft`, `egm-drift-report`, `egm-resolve`, `egm-review`, `egm-review-loop`.
