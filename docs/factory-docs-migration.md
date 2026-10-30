# Factory documentation migration status

The master and companion files were copied from the Cursor agent store on 2026-10-30 to make them available outside Cursor. They are preserved as source snapshots; portability and reconciliation are incomplete.

- The master describes Linear as the admit/claim authority until PBI-007; the newer root AGENTS.md and `docs/meta-beads.md` describe the PBI-007 cutover. Verify current live behavior and reconcile the master before treating this point as settled.
- The imported documents contain links to other Cursor-store documents and skills that are not yet in this checkout. Do not assume all linked evidence has been migrated.
- [Linear master snapshot](https://linear.app/johnny-cage/document/factory-master-specification-cursor-store-snapshot-2026-10-30-1335eef22ab3) is a reference copy, not a second editable authority.
- Notion remains a human-readable mirror. Historical status statements are not proof of current runtime health or cross-system sync.
- Before updating the authority location, reconcile content and links, review publication scope, and propagate the decision to Linear and Notion.
- The imported workflow also contains historical ADR-005 OAuth status that conflicts with the newer repository instructions. Treat it as a dated snapshot until reconciled.
