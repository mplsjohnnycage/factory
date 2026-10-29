---
name: factory-dor-check
description: "Check Definition-of-Ready for a PBI/typed-contract unit (19 fields). Usage: /factory-dor-check [PBI id or path]"
---

# Typed-contract DoR check

## Unit: $ARGUMENTS

Use the **factory-typed-contract** skill.

1. Load the unit (Linear / PBI file / bead description).
2. Score C1–C3 and fields 1–16 plus Spec · Verification · Refinement.
3. List every missing or vague field.
4. Verdict: **startable** or **not startable** (refuse claim if not).
5. Do not invent a sidecar contract document — fill the PBI itself.
