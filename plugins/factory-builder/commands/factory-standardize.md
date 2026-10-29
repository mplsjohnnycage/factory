---
name: factory-standardize
description: "Align Spec+Contract, assemble-first, and §7 gates before Feature Assembly code. Usage: /factory-standardize [Spec domain or path]"
---

# Factory standardize

## Target: $ARGUMENTS

Run **factory-coding-loop** Step 2 only:

1. Locate `/specs/{domain}/spec.md` (or named path) — Blueprint + Contract present?
2. Check Spec review + EGM Goldfish gate status for this Spec.
3. Prefer Port assemble-first composables; flag catalog misses as needs-implementation.
4. List Accepted ADRs that must not be re-litigated.
5. If Spec/Contract must change, plan edits in the **same PR** as code.
6. Report ready-to-code or blocked with missing gates.
