# Factory UI — design direction (locked)

**When:** 2026-10-29  
**Source:** Johnny `UI mockups design.zip`  
**Status:** Locked for Dev OS / Code Atlas / Cockpit / provider widgets  
**Comps:** [`mockups/`](./mockups/)  
**Project-store mirror:** `/cursor/stores/self/docs/ui-design-direction.md` + `/cursor/stores/self/media/ui-mockups/`

Do **not** invent a second visual language. Prefer latest: Cockpit **v3**, Atlas **v5**.

## Product IA

```text
Code Atlas / Factory Cockpit
├── Home (Cockpit) — Port Context Lake hero · Assembly line · Apps
├── Code Atlas — Views · Lake table · Symbol / repo map · ⌘K
├── Codebase Intelligence — cross-repo symbol graph
├── Provider Dashboard — connect toggle · KPIs · activity
└── Widgets — Port · Vercel · GitHub · Convex · Docker · Turso (+ Add)
```

Brand: **Code Atlas** + muted **Factory**. CTA **Ask Factory** (⌘J). Search **⌘K**.

## Visual language

| Mode | Use | Background |
|------|-----|------------|
| Dark cockpit | Cockpit v3 | `#0a0d15` + blue/violet/green/amber radials |
| Light atlas | Atlas v5, Provider Dashboard, Intelligence | `#e5eaf0` / `#e6ebf1` + peach/sky/mint/lilac radials |

- **Glass:** `backdrop-filter: blur(22–30px) saturate(1.6–1.9)`; translucent white fills; large radii (pills `999px`, cards `20–40px`).
- **Type:** SF Pro / system sans; mono **JetBrains Mono** (Geist Mono OK). Avoid Inter/Roboto/Arial as primary.
- **Accents:** Port `#16a34a` · link `#2f6fe0` / `#0a84ff` · violet `#bf5af2` · cross-repo dashed `#b06a1a` · danger `#d0393e` / `#ff453a`.

## Patterns to preserve

1. Pill segmented controls  
2. Assembly-line glass cards (status pill, progress segments, mono agent id)  
3. Lake table (status dot · name/sub · owner · tier)  
4. Symbol graph — solid = in-repo call; **dashed brown** = cross-repo  
5. Provider tile — logo · name · status · chevron · brand rear glow  
6. Ask Factory ⌘J · Search everything ⌘K  

Cards are interaction containers only — not decorative hero boxes.

## Implementation

- Converge `apps/developer-os` (AtlasHero / atlas lib) toward these comps.  
- Widgets are presentation; secrets stay env/PM.  
- No Port `upsert_*` / WEBHOOK remount from UI.  
- Independent review before merge (author ≠ reviewer).  

## Related

- Spec: `specs/developer-os/spec.md`  
- App README: `apps/developer-os/README.md`  
- Multi-agent handoff (store): `/cursor/stores/self/docs/multi-agent-handoff.md`
