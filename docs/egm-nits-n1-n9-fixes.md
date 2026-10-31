# EGM nits N1–N9 fixes

**Date:** 2026-10-28  
**Source:** [`internal/egm-skill-leverage-review/iter3_consolidated.md`](../internal/egm-skill-leverage-review/iter3_consolidated.md) Nits table  
**Touched:** [`factory-master-spec.md`](./factory-master-spec.md), [`factory-skill-leverage.md`](./factory-skill-leverage.md) (N5 only)

| Nit | What changed | File(s) |
|-----|--------------|---------|
| **N1** | §13.4: Funnel public-exposure / URL-rotation / auth-checklist note. §15: new **R-15** (Funnel) alongside Serve-only R-14. | `factory-master-spec.md` |
| **N2** | §4 intro + §4.1–§4.6 LogicSRC map bullets: inline **M1 emit §13.6 / M1 implement §13.5** guards (authorship catalogs ≠ full-phase M1). | `factory-master-spec.md` |
| **N3** | §7 EGM Goldfish row: Project `docs/` + `internal/egm-*/` = **canonical** automation roots; `.dev/docs/` upstream-only, never sole root. | `factory-master-spec.md` |
| **N4** | §4.2.1 “Ocean sync applies”: one-line **Port Ocean** definition (integration/sync layer → catalog entities). | `factory-master-spec.md` |
| **N5** | Normative scope table: **Implement vs authorship** row + `apps/factory-gateway/` (mirrors master §10/§2). | `factory-skill-leverage.md` |
| **N6** | §10 + §17: brief scanner notes — two “Document control” H2s intentional (early vs extended); not a merge. | `factory-master-spec.md` |
| **N7** | Proposed Architecture H2: scanner note — unnumbered between §12/§13 intentional (FE-22). | `factory-master-spec.md` |
| **N8** | §16.4 + §16.5: **Altitude** lines — design-lock authorship / Spec home, not M1 implement (§13.5). | `factory-master-spec.md` |
| **N9** | §19 + §20 Locks: **Post-M1 implement** (§13.5) guards; subsections inherit. | `factory-master-spec.md` |

**Verification:** Each edit grepped present on disk after write. No Port/account spend; no master restructure beyond nit scope.
