---
name: factory-setup
description: "Audit or run Factory Phase A upfront setup before Feature Assembly. Usage: /factory-setup [optional focus: port|git|linear|beads|gates]"
---

# Factory Phase A setup

## Focus: $ARGUMENTS

Use the **factory-workflow-setup** skill.

1. Walk A1–A12 (or the named focus only).
2. Mark each step done / missing / blocked.
3. Respect OQ-1 (Meta Beads) and ADR-005 (no OAuth create without Johnny).
4. Do not mutate Port / Linear / Notion unless the active unit’s write targets authorize it.
5. When Phase A is green for the active Spec, point to `/factory-loop` for Phase B.
