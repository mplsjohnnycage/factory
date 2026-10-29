# Port catalog mirrors (Meta)

Trackable YAML for Factory Meta Port blueprints and seed entities.
**Live SoT remains Port.** These files mirror what was applied via Port MCP
so Meta git can review fencing fields and seed identifiers.

## Scope (FE-105)

| Artifact | Live identifier | Notes |
|----------|-----------------|-------|
| Blueprint patch | `product` | Adds `catalogVersion` (number) for §4.2.1 |
| Blueprint patch | `executionContract` | Adds `catalogVersion` (number) for §4.2.1 |
| Entity | `product` / `factory-meta` | Meta product; relates to GitHub `factory` + Linear Factory Meta |
| Entity | `executionContract` / `factory-meta-bootstrap-contract` | Bootstrap contract; `catalogVersion: 0` |

## Out of scope (do not touch from this tree)

- Ocean integrations (no delete / remapping here)
- Port External Interface OAuth apps / Dev OS OAuth wiring
- Vercel CI setup branches and workflows owned by FE-93

## Layout

```
port/
  README.md
  blueprints/
    product.catalogVersion.yaml
    executionContract.catalogVersion.yaml
  entities/
    factory-meta.product.yaml
    factory-meta-bootstrap-contract.executionContract.yaml
```

## Apply

Prefer Port MCP (`upsert_blueprint`, `upsert_entity`) against the live org.
YAML is the reviewable mirror; re-apply only the fields in these files
(deep-merge / PATCH semantics — do not PUT-replace whole blueprints).

`catalogVersion` starts at `0` on seed create. The Factory gateway
§4.2.1 writer bumps by `1` on each successful apply.
