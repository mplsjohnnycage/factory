---
cursor:
  subagentId: "bc-46618e13-3653-5142-8e26-c2d8ea5294a3"
---

# Factory UI — design direction (locked)

**When:** 2026-10-29 ~14:20 America/Chicago  
**Source:** Johnny upload `UI mockups design.zip` → Project media  
**Status:** **Design direction for Dev OS / Code Atlas / Cockpit / provider widgets**  
**Audience:** Orca · OpenCode · Codex · Antigravity · Cursor · Claude · Grokbot · Projects Manager  

**Repo PR:** https://github.com/mplsjohnnycage/factory/pull/98 — **squash-MERGED** @ `99ff64c` (`docs/design/`)  
**Linear:** [STL-218](https://linear.app/johnny-cage/issue/STL-218/lock-factory-ui-design-direction-cockpit-v3-atlas-v5) (lock) · [STL-219](https://linear.app/johnny-cage/issue/STL-219/implement-dev-os-ui-against-cockpit-v3-atlas-v5-comps) (implement)  
**Project FE:** **FE-192 Done** (#98 / STL-218) · **FE-193** implement = STL-219 on worker `bc-11b0b922-044f-5de0-9eaa-f9e75995ee50` (not this session — keep author≠reviewer clear)  
**Independent reviewer (FE-192):** `bc-ab31632f-65b2-5312-9fb2-665dca2aef38` merged #98  
**Meta Beads:** **server SoT** `refs/dolt/data` @ `9bdcab27cba03a74633a8dac8ea3a032d114f24c` — `factory-cbv` CLOSED; `factory-dtm` ready. Sync detail: [`docs/dolt-remote-server-sync.md`](./dolt-remote-server-sync.md). Other boxes: `bd dolt pull` before claim. This author session idle on FE-193.

**Do not invent a second visual language.** Implement against these comps. Prefer latest version of each surface (v3 Cockpit, v5 Atlas).

---

## 1. Artifact locations

| Kind | Absolute path |
|------|----------------|
| Zip archive | `/cursor/stores/self/media/ui-mockups/UI_mockups_design.zip` |
| HTML comps (Drawers / `.dc.html`) | `/cursor/stores/self/media/ui-mockups/` |
| Symbol-graph PNG | `/cursor/stores/self/media/ui-mockups/uploads/codebase-intelligence-symbol-graph.png` |
| Provider-grid PNG | `/cursor/stores/self/media/ui-mockups/uploads/provider-widget-grid-dark.png` |
| Raw paste names (same bytes) | `…/uploads/pasted-1793201151024-0.png`, `…/pasted-1793223900694-0.png` |

### Surfaces in the pack

| File | Role | Canon? |
|------|------|--------|
| `Factory Cockpit v3.dc.html` | Dark home — Code Atlas Factory, Assembly line, Apps, Ask Factory | **Yes (latest)** |
| `Factory Cockpit v2.dc.html` / `Factory Cockpit.dc.html` | Earlier Cockpit | Superseded by v3 |
| `Code Atlas v5.dc.html` | Light Code Atlas — lake table, symbol map, ⌘K | **Yes (latest)** |
| `Code Atlas` … `v4.dc.html` | Earlier Atlas | Superseded by v5 |
| `Codebase Intelligence.dc.html` | Cross-repo symbol graph explorer | **Yes** (pairs with PNG) |
| `Provider Dashboard.dc.html` | Connected-provider detail panel | **Yes** |
| `Port Widget.dc.html` · `Vercel Widget.dc.html` · `GitHub Widget.dc.html` · `Convex Widget.dc.html` · `Docker Widget.dc.html` · `Turso Widget.dc.html` | Per-provider glass tiles / drawers | **Yes** |
| `support.js` · `image-slot.js` | Comp runtime helpers (not product code) | Reference only |

---

## 2. Product IA (from comps)

```text
Code Atlas / Factory Cockpit
├── Home (Cockpit) — Port Context Lake hero · Assembly line · Apps
├── Code Atlas — Views · Lake table · Symbol / repo map · ⌘K
├── Codebase Intelligence — cross-repo symbol graph
├── Provider Dashboard — connect toggle · KPIs · activity
└── Widgets — Port · Vercel · GitHub · Convex · Docker · Turso (+ Add)
```

**Brand signal:** Product name is **Code Atlas** with **Factory** as sibling mark on Cockpit (`Code Atlas` + muted `Factory`). CTA **Ask Factory** (⌘J).

**Not a generic SaaS dashboard first-viewport:** Cockpit hero is Port Context Lake + constellation / assembly narrative, not a KPI strip.

---

## 3. Visual language

### Two ambient modes (both approved)

| Mode | Use | Background |
|------|-----|------------|
| **Dark cockpit** | Factory Cockpit v3 home | Near-black `#0a0d15` with soft blue / violet / green / amber radial glows |
| **Light atlas** | Code Atlas v5, Provider Dashboard, Codebase Intelligence | Soft grey `#e5eaf0` / `#e6ebf1` with peach / sky / mint / lilac radials |

### Glass

- Frosted panels: `backdrop-filter: blur(22–30px) saturate(1.6–1.9)`  
- Fill: translucent white gradients (`rgba(255,255,255,.05–.46)`)  
- Edge: inset 1px highlight + soft outer shadow  
- Radii: large — pills `999px`, cards `20–40px`, screen chrome `24–30px`

### Type

| Role | Stack |
|------|--------|
| UI sans | SF Pro / `-apple-system` / Helvetica Neue (Geist acceptable on Cockpit body) |
| Mono | **JetBrains Mono** (Geist Mono OK) — badges, agent ids, tags |
| Graph explorer alt | Archivo on Codebase Intelligence (keep for that surface only) |

Avoid Inter / Roboto / Arial as the primary face.

### Accent colors (recurring)

| Token | Hex (approx) | Use |
|-------|----------------|-----|
| Port green | `#16a34a` | Port mark, healthy |
| Link blue | `#2f6fe0` / `#0a84ff` / `#64d2ff` | Links, focus |
| Violet | `#bf5af2` / `#5e6ad2` | Avatar / glow |
| Cross-repo dashed | `#b06a1a` | Graph edges across repos |
| Danger | `#ff453a` / `#d0393e` / `#e11d48` | Fail chips, badges |
| Muted text (light) | `#6b717c` / `#8a909a` | Secondary |
| Muted text (dark) | `rgba(235,240,250,.55–.66)` | Secondary on cockpit |

### Motion

- Short rises/fades (`dcRise`, `dcFade`, `dcSettle`) — presence, not noise  
- Pill/segment width transitions on assembly progress  
- Prefer 2–3 intentional motions per screen (comps already encode this)

---

## 4. Component patterns to preserve

1. **Pill segmented controls** — view switchers, chat toggle, connect switch.  
2. **Assembly-line cards** — 340×200 glass cards, status pill, progress segments, mono agent id.  
3. **Lake table** — tinted status dot + name/sub + owner + tier chip.  
4. **Symbol graph** — repo columns as soft glass lanes; solid = in-repo call; **dashed brown** = cross-repo; node left-edge color = kind (component/function/type).  
5. **Provider tile** — logo · name · status dot + short status · chevron; brand-colored rear glow; dark grid optional (PNG).  
6. **Ask Factory** — persistent CTA with ⌘J; opens chat drawer (Cockpit).  
7. **⌘K** — “Search everything” on Atlas.

### Cards rule

Cards are **interaction containers** (assembly row, app tile, provider widget) — not decorative boxes in the hero. Cockpit hero is glass narrative panel over the field, not a card grid.

---

## 5. Implementation guidance (Dev OS)

| Do | Don't |
|----|-------|
| Match Comp latest (Cockpit v3 / Atlas v5) | Invent purple-on-white or cream-serif terra-cotta “AI default” look |
| Glass + radial atmosphere | Flat single-color page chrome |
| Port as Context Lake entry | Dual control-plane UI outside Port |
| Widgets as read/status surfaces | Live Port schema upserts from UI chrome |
| File new screens under `apps/developer-os` against these comps | Ship inset hero media cards / promo chip overlays |

Existing Atlas code lives under `apps/developer-os/src/lib/atlas/` + hero components — **converge toward these comps**, don’t fork a second design system.

---

## 6. Relation to Meta lane (non-UI)

- Funnel / gateway / Beads kits stay **ops** — UI shows health/status via widgets & lake, does not replace Port governance.  
- FE-142 / FE-172 remain **CLOSED** — no secret fields in mockups to “fill.”  
- Provider widgets (Port, Vercel, GitHub, …) are **presentation**; connection secrets stay env/PM.  

---

## 7. Next build steps (suggested)

1. Snapshot tokens from Cockpit v3 + Atlas v5 into `apps/developer-os` CSS variables / theme.  
2. Align AtlasHero / SessionStream chrome with light-atlas glass language.  
3. Prototype provider widget grid (dark PNG) as optional Cockpit “Apps” / integrations strip.  
4. Symbol-graph view: reuse Codebase Intelligence + PNG semantics (calls vs cross-repo).  
5. Independent review before any design-system PR merge (author ≠ reviewer).

---

## PM 3-line

- **Board:** UI mockups zip ingested as **locked design direction** — media + this doc.  
- **Canon:** Factory Cockpit **v3** (dark) · Code Atlas **v5** (light) · Codebase Intelligence graph · provider widgets/grid.  
- **Next:** Implement Dev OS against these comps; no parallel visual language; no Port upserts from UI.
