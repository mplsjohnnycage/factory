# Port Meta blueprints — FE-105

**Date:** 2026-10-29  
**Repo PR:** [#27](https://github.com/mplsjohnnycage/factory/pull/27) (`cursor/port-meta-blueprints-55ed`)  
**Lane:** Meta  
**Live Port:** org via Port MCP (mutations applied)

## Done

1. **`catalogVersion` (number)** added to live blueprints `product` and `executionContract` (Port MCP `upsert_blueprint` PATCH merge).
2. **Seeded entities**
   - `product` / `factory-meta` — relates to GitHub repo `factory` and Linear project Factory Meta (`66aabc4a-3e16-49a1-81c5-39f3f259656a`); `catalogVersion: 0`.
   - `executionContract` / `factory-meta-bootstrap-contract` — relates to `factory-meta`; required `contractHash` set; `catalogVersion: 0`.
3. **Repo YAML mirrors** under `port/` (blueprints patches + entities + README). Live Port remains SoT; YAML is trackable for review/re-apply.

## Explicit non-touches

- No Ocean delete or remapping
- No External Interface OAuth create/delete/revoke
- No Dev OS OAuth / `.well-known` / vercel-ci collision

## Verify

```text
list_blueprints → product.properties includes catalogVersion
list_blueprints → executionContract.properties includes catalogVersion
list_entities product → count ≥ 1 (factory-meta)
list_entities executionContract → factory-meta-bootstrap-contract
```

## Follow-ups (not this PR)

- Roll `catalogVersion` onto other Factory-governed BPs (`deliveryRun`, `executionAttempt`, …) when FE-111 / writer path lands.
- Wire `factory_*` WEBHOOK backends through gateway §4.2.1 (separate FE).
