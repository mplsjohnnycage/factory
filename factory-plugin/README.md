# Factory plugin

An installable knowledge plugin for **Factory** — Johnny's autonomous software-delivery
control plane. Any agent that installs it can answer, from the package alone:

- **What Factory is** — Port (system of record) → gateway → Rivet (execution kernel) →
  Sandbox Agent (coding in Docker) → GitHub CI accept on exact SHA.
- **Where its infrastructure lives** — the Port tenant and its Ocean integrations and MCP
  connectors, the tailnet hosts and services (grok-bot, desktop, JohnnyBox), GitHub, Linear,
  Vercel — each marked LIVE-VERIFIED 2026-10-30, SPEC-ONLY, or GAP.
- **How to build in it** — the 19-field unit of work, the locked coding loop
  (task → standardize → PR → build → loop), §4.2.1 catalog fencing, the sandbox path, the
  spin-up rule (CLI → GitHub Action).
- **What Factory builds** — machine-validated stack assembly (assemble-first, §4.2.2), the
  Meta/Product lanes, the M1 cut vs post-M1.
- **The rails** — one control plane, no browser→Sandbox Agent, no catalog writes outside the
  §4.2.1 writer, secrets never in bodies, identity steps are the operator's.

Doctrine derives from **`factory-master-spec.md`**, the single canonical source of truth
(master spec §0). Live-state facts derive from the 2026-10-30 atlas-map swarm (fragments
A1–E5), cited inline. Where spec and live state conflict, the package states the conflict and
which wins (§0: the master spec) — it never silently picks.

Pattern: **ADR-010** — plugins = skills + MCP + optional UI (ChatGPT Plugins as reference).
This package is the skills half. The MCP half is the existing **Port MCP gateway**; the plugin
points at it and never re-implements it.

## Layout

```txt
factory-plugin/
  plugin.json                  manifest (name: factory, version, MCP pointer)
  .claude-plugin/plugin.json   the same manifest at the Claude Code loader's location
  README.md                    this file
  skills/
    factory/
      SKILL.md                 core doctrine (§0) + routing table
      references/
        infrastructure.md      where everything lives (live-verified map)
        how-factory-builds.md  the execution path, step by step
        what-factory-builds.md assemble-first product model, M1 cut, LogicSRC
        atlas.md               Code Atlas overlays, contract, live-bind gap
        rails.md               the never-list for agents in Factory
  pbis/                        the 15 seed PBI bodies + seed data
  contracts/                   per-domain Spec Contracts + the §0.1 templates
  units/                       facet snapshots (Linear / GitHub / Beads) + UNITS.md map
```

## Install

The core is loader-agnostic: a `SKILL.md` skill with progressive-disclosure references.

**Keep the layout whole.** `SKILL.md` and its references route to the sibling `pbis/`,
`contracts/`, and `units/` directories for the unit bodies, the full Spec Contracts, the
templates, and the facet snapshots. Every install mode below preserves the complete
`factory-plugin/` tree — copying `skills/factory/` alone strands that material.

**Claude Code**

```bash
# as a plugin (manifest: .claude-plugin/plugin.json) — load the local tree for a session:
claude --plugin-dir ./factory-plugin
# (a persistent install needs the plugin registered through a marketplace first;
#  /plugin install takes a marketplace plugin name, not a local path.)

# or as a plain skill — register the skill inside the whole tree, e.g.:
cp -r factory-plugin ~/factory-plugin
# then point your loader at ~/factory-plugin/skills/factory (SKILL.md + references/,
# with pbis/, contracts/, units/ preserved as siblings of skills/)
```

**Cursor**

```bash
cp -r factory-plugin <your-project>/factory-plugin
# Register <your-project>/factory-plugin/skills/factory as the skill; keep the
# references/ folder beside SKILL.md and the sibling directories in place.
```

**Generic skills loaders / other agents**

Copy the whole `factory-plugin/` tree anywhere, and point your loader at
`skills/factory/` inside it. The skill is Markdown only — no scripts, no network calls,
no credentials.

## Connect the MCP half (the control plane)

Register **one** MCP endpoint — Port's gateway — with your client. Auth is Port-issued
(External Interface OAuth app "Factory", ADR-005; machine credentials for unattended runs).
No credential ships in this package.

```json
{
  "mcpServers": {
    "factory": {
      "type": "http",
      "url": "https://mcp.port.io/v1"
    }
  }
}
```

US-region tenant: `https://mcp.us.port.io/v1`. That endpoint **is** the Factory control plane
(§18.5 Single-MCP). Do not register raw provider MCPs as a substitute privileged path, and
never register the Sandbox Agent as an MCP connector (ADR-003/006 — see
`skills/factory/references/rails.md`).

## Freshness

Live-state marks are dated **2026-10-30**. Infrastructure drifts (connectors get exposed,
console service definitions land, runners register). Before acting on a LIVE-VERIFIED line,
re-verify it against the live surface — the package teaches you where to look and what
"answering" looks like. Doctrine (§-cited) changes only master-first in
`factory-master-spec.md`; when the master spec moves, this plugin must be re-derived.

## Provenance

Derived 2026-10-30 from: the JohnnyBox store-docs library (24 load-bearing docs incl.
`factory-master-spec.md` §§0–22, `port-factory-data-model.md`, `rivet-engineering-spec.md`,
`rivet-sandbox-agent.md`), the atlas-map swarm fragments in `~/workspace/your_files/atlas-map-swarm/`
(A1–A10, B1–B10, C1–C10, D1–D10, E1–E5), and the factory repo at
`~/workspace/_scratch/factory-recon`. Nothing in this package was written back to the repo,
the hosts, or Port.
