---
cursor:
  subagentId: "bc-591fc896-002b-5df1-8440-72f99fa6977d"
---

# Loop tick ~05:01Z (bc-591fc896)

Coordinator constraint update. Hygiene stand-by.

## Hard rules (this session)

| Rule | Action |
|------|--------|
| Johnny stopped Linear→Cursor issue delegates | Do **not** re-enable / re-delegate any `STL-*` |
| STL-173…176 (deferred) | Leave alone |
| Merge path | **Project workers only** — this session does not merge |
| Role | Hygiene / stand-by only |

## Prior holds still in force

- No self-review; no spawn when a pool reviewer already owns a PR
- No dual-claim of Project-worker authorship lanes
- Do not overwrite other agents’ store reports / shared `loop-development-tick.md`

## Next

Stand by until coordinator assigns a hygiene gap that does not violate the above.
