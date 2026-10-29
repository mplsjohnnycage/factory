import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CatalogWriter } from "../src/catalog-writer.ts";
import { MemoryCatalogStore } from "../src/memory-store.ts";
import { applySyncWrite } from "../src/sync-ingress.ts";

describe("sync-ingress Ocean/MCP Meta fence", () => {
  it("routes Ocean sync of Meta-fenced blueprint through CatalogWriter", async () => {
    const store = new MemoryCatalogStore();
    const writer = new CatalogWriter(store);

    const result = await applySyncWrite(writer, {
      source: "ocean",
      blueprint: "executionContract",
      entityIdentifier: "ec-ocean-1",
      expectedCatalogVersion: 0,
      patch: { status: "ready", origin: "ocean" },
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.entity.catalogVersion, 1);
    assert.equal(result.entity.properties.origin, "ocean");
  });

  it("rejects Ocean/MCP bypassFence on Meta-fenced blueprints", async () => {
    const store = new MemoryCatalogStore();
    const writer = new CatalogWriter(store);

    for (const source of ["ocean", "mcp"] as const) {
      const result = await applySyncWrite(writer, {
        source,
        blueprint: "skill",
        entityIdentifier: `skill-${source}`,
        expectedCatalogVersion: 0,
        patch: { name: "evil" },
        bypassFence: true,
      });

      assert.equal(result.ok, false);
      if (result.ok) return;
      assert.equal(result.reason, "meta_fence_bypass_forbidden");
      assert.equal(await store.get("skill", `skill-${source}`), null);
    }
  });

  it("rejects stale MCP sync write with no partial apply", async () => {
    const store = new MemoryCatalogStore();
    const writer = new CatalogWriter(store);

    const first = await applySyncWrite(writer, {
      source: "mcp",
      blueprint: "product",
      entityIdentifier: "factory-meta",
      expectedCatalogVersion: 0,
      patch: { title: "Factory Meta" },
    });
    assert.equal(first.ok, true);

    const stale = await applySyncWrite(writer, {
      source: "mcp",
      blueprint: "product",
      entityIdentifier: "factory-meta",
      expectedCatalogVersion: 0,
      patch: { title: "bypassed" },
    });

    assert.equal(stale.ok, false);
    if (stale.ok) return;
    assert.equal(stale.reason, "stale_catalog_version");
    const current = await store.get("product", "factory-meta");
    assert.equal(current?.properties.title, "Factory Meta");
    assert.equal(current?.catalogVersion, 1);
  });

  it("does not claim Ocean mirror writes via gateway for ocean/mcp sources", async () => {
    const store = new MemoryCatalogStore();
    const writer = new CatalogWriter(store);

    const result = await applySyncWrite(writer, {
      source: "ocean",
      blueprint: "githubRepository",
      entityIdentifier: "org/repo",
      expectedCatalogVersion: 0,
      patch: { name: "repo" },
    });

    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, "ocean_mirror_not_via_gateway");
    assert.equal(await store.get("githubRepository", "org/repo"), null);
  });

  it("still fences workflow writes to Meta-fenced blueprints", async () => {
    const store = new MemoryCatalogStore();
    const writer = new CatalogWriter(store);

    const result = await applySyncWrite(writer, {
      source: "workflow",
      blueprint: "deliveryRun",
      entityIdentifier: "run-1",
      expectedCatalogVersion: 0,
      patch: { status: "running" },
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.entity.catalogVersion, 1);
  });
});
