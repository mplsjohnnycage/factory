import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LAKE_ENTITIES,
  buildPaletteItems,
  needsAttention,
  tierFor,
} from "../src/lib/atlas/lake-fixtures.js";

describe("atlas lake fixtures", () => {
  it("ships Factory Meta entities without secret fields", () => {
    assert.ok(LAKE_ENTITIES.length >= 10);
    for (const e of LAKE_ENTITIES) {
      const blob = JSON.stringify(e).toLowerCase();
      assert.equal(blob.includes("client_secret"), false);
      assert.equal(blob.includes("password"), false);
      assert.ok(e.name.length > 0);
      assert.ok(e.bp);
    }
  });

  it("computes tiers and attention from scorecard rules", () => {
    const gateway = LAKE_ENTITIES.find((e) => e.id === "svc-gateway");
    assert.ok(gateway);
    assert.equal(tierFor(gateway), "Gold");
    assert.equal(needsAttention(gateway), false);

    // Building + warn is not attention; degraded / err are
    assert.equal(
      needsAttention({
        ...gateway,
        tone: "warn",
        status: "Building",
      }),
      false,
    );
    assert.equal(
      needsAttention({
        ...gateway,
        tone: "err",
        status: "Failed",
      }),
      true,
    );
  });

  it("builds palette groups covering views and entities", () => {
    const items = buildPaletteItems();
    assert.ok(items.some((i) => i.kind === "view" && i.target === "lake"));
    assert.ok(items.some((i) => i.kind === "entity" && i.target === "svc-devos"));
    assert.ok(items.some((i) => i.kind === "nav" && i.target === "/"));
  });
});
