import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CatalogWriter, claimNextJob } from "../src/catalog-writer.ts";
import { MemoryCatalogStore } from "../src/memory-store.ts";

describe("CatalogWriter §4.2.1", () => {
  it("creates with expectedCatalogVersion 0 → catalogVersion 1", async () => {
    const store = new MemoryCatalogStore();
    const writer = new CatalogWriter(store);

    const result = await writer.apply({
      blueprint: "executionAttempt",
      entityIdentifier: "att-1",
      expectedCatalogVersion: 0,
      patch: { status: "ready" },
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.entity.catalogVersion, 1);
    assert.equal(result.entity.properties.status, "ready");
  });

  it("rejects stale expectedCatalogVersion with no partial apply", async () => {
    const store = new MemoryCatalogStore();
    const writer = new CatalogWriter(store);

    const first = await writer.apply({
      blueprint: "executionAttempt",
      entityIdentifier: "att-2",
      expectedCatalogVersion: 0,
      patch: { status: "ready", owner: "a" },
    });
    assert.equal(first.ok, true);

    const stale = await writer.apply({
      blueprint: "executionAttempt",
      entityIdentifier: "att-2",
      expectedCatalogVersion: 0,
      patch: { status: "claimed", owner: "b" },
    });

    assert.equal(stale.ok, false);
    if (stale.ok) return;
    assert.equal(stale.reason, "stale_catalog_version");
    assert.equal(stale.currentVersion, 1);

    const current = await store.get("executionAttempt", "att-2");
    assert.equal(current?.properties.owner, "a");
    assert.equal(current?.catalogVersion, 1);
  });

  it("serializes concurrent writers so only one claim wins", async () => {
    const store = new MemoryCatalogStore();
    const writer = new CatalogWriter(store);

    await writer.apply({
      blueprint: "executionAttempt",
      entityIdentifier: "att-3",
      expectedCatalogVersion: 0,
      patch: { status: "ready" },
    });

    const [a, b] = await Promise.all([
      claimNextJob(writer, {
        blueprint: "executionAttempt",
        entityIdentifier: "att-3",
        expectedCatalogVersion: 1,
        owner: "coder-a",
        leaseEpoch: 1,
      }),
      claimNextJob(writer, {
        blueprint: "executionAttempt",
        entityIdentifier: "att-3",
        expectedCatalogVersion: 1,
        owner: "coder-b",
        leaseEpoch: 1,
      }),
    ]);

    const wins = [a, b].filter((r) => r.ok);
    const losses = [a, b].filter((r) => !r.ok);
    assert.equal(wins.length, 1);
    assert.equal(losses.length, 1);

    const current = await store.get("executionAttempt", "att-3");
    assert.equal(current?.catalogVersion, 2);
    assert.equal(current?.properties.status, "claimed");
    assert.ok(
      current?.properties.owner === "coder-a" || current?.properties.owner === "coder-b",
    );
  });
});
