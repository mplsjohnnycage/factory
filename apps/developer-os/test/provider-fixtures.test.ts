import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PROVIDER_DETAILS,
  PROVIDER_TILES,
  TONE_DOT,
  assertNoSecretFields,
  detailById,
  providerSummary,
  tileById,
  type ProviderId,
} from "../src/lib/providers/fixtures.js";

const EXPECTED: ProviderId[] = [
  "port",
  "vercel",
  "github",
  "convex",
  "docker",
  "turso",
];

describe("provider widget fixtures", () => {
  it("ships the locked first-slice six (Port Vercel GitHub Convex Docker Turso)", () => {
    assert.equal(PROVIDER_TILES.length, 6);
    assert.deepEqual(
      PROVIDER_TILES.map((t) => t.id),
      EXPECTED,
    );
    assert.match(providerSummary(), /6 providers/);
  });

  it("gives every tile a brand glow, accent, and status tone", () => {
    for (const t of PROVIDER_TILES) {
      assert.ok(t.glow.includes("rgba"), `${t.id} glow`);
      assert.ok(t.accent.startsWith("#"), `${t.id} accent`);
      assert.ok(t.status.length > 0, `${t.id} status`);
      assert.ok(TONE_DOT[t.tone], `${t.id} tone`);
      assert.equal(tileById(t.id)?.name, t.name);
    }
  });

  it("pairs each tile with KPI + activity detail (4 KPIs, ≥3 activity)", () => {
    for (const id of EXPECTED) {
      const d = detailById(id);
      assert.equal(d.id, id);
      assert.equal(d.kpis.length, 4, `${id} kpis`);
      assert.ok(d.activity.length >= 3, `${id} activity`);
      assert.ok(d.tools.length >= 3, `${id} tools`);
      assert.equal(PROVIDER_DETAILS[id], d);
    }
  });

  it("never carries secret-shaped fields (FE-142 / FE-172 CLOSED)", () => {
    assertNoSecretFields({ tiles: PROVIDER_TILES, details: PROVIDER_DETAILS });
  });

  it("uses Port green accent for the Port tile", () => {
    const port = tileById("port");
    assert.ok(port);
    assert.equal(port.accent, "#16a34a");
    assert.equal(port.tone, "ok");
  });
});
