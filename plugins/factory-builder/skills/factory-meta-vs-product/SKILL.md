---
name: factory-meta-vs-product
description: Classify Factory work as Meta XOR Product. Use when labeling artifacts, choosing boards/Beads/repos, or catching lane contamination.
---

# Meta XOR Product

Derived from master §0.2 / `factory-meta-vs-product`. Labels **shared / both / either** are forbidden.

## One-line definitions

| Lane | Meaning |
|------|---------|
| **Meta** | Building the Factory itself |
| **Product** | What Factory does when assembling a user project |

Shapes may rhyme; ownership must not.

## What each lane owns

| | Meta | Product |
|--|------|---------|
| Linear | Factory Meta | Distinct product board(s) |
| Beads | **Meta Beads** | **Product Beads** (per product, when shipped) |
| Repo | Factory meta-repo | Product repos |
| Docs | Project store `docs/` + meta `docs/` | Product docs trees |
| Port | Kernel catalog / fencing | Delivery projections for that product run |
| Seed PBIs | PBI-001…015 | Future Product-lane PBIs only |

## PBI-007 verdict

**Meta only** — wires **Meta Beads** into factory-kernel admit. Does **not** ship Product Beads. Never say “PBI-007 later becomes Product Beads.”

## Classify checklist

1. Whose board / Beads instance / repo owns the unit? → that lane only.
2. Is the 19-field body complete with Beads write target = Meta Beads *xor* Product Beads?
3. §6 seed PBI or meta-repo change? → Meta.
4. Assembling a **user** project? → Product.
5. Unsure → **stop and ask**; never pick Both. Default Meta only for this Project’s FE-* coordination.
6. Need both names in prose → **two sentences** (one Meta, one Product).

## Defect patterns (treat as bugs)

- Bare “Beads” without Meta/Product qualifier on a write target.
- One workflow doc dual-serving Meta and Product loops without split.
- Treating PBI and “typed contract” as two startable artifacts.
- Blurring unit typed contract with ASDLC Spec Contract (Spec Contract = scenarios the PBI **points at**).

## Unit type (same in both lanes)

Linear ticket = bead = GitHub issue = PBI = typed contract. Contract fields = unit shape. Lane = which instance hosts it.
