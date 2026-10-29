import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CROSS_REPO_STROKE,
  INTEL_EDGES,
  INTEL_NODES,
  KIND_COLOR,
  assertNoSecretFields,
  filterEdges,
  filterNodes,
  graphSummary,
  nodeById,
  nodeCenter,
} from "../src/lib/intelligence/symbol-graph-fixtures.js";

describe("intelligence symbol graph fixtures", () => {
  it("matches locked comp counts (14 symbols, 13 in-repo, 6 cross-repo)", () => {
    assert.equal(INTEL_NODES.length, 14);
    assert.equal(INTEL_EDGES.filter((e) => e.scope === "in-repo").length, 13);
    assert.equal(INTEL_EDGES.filter((e) => e.scope === "cross-repo").length, 6);
    assert.match(graphSummary(), /14 symbols.*13 calls.*6 cross-repo/);
  });

  it("uses kind left-edge colors and brown cross-repo stroke", () => {
    assert.equal(KIND_COLOR.COMPONENT, "#2563eb");
    assert.equal(KIND_COLOR.FUNCTION, "#16a34a");
    assert.equal(KIND_COLOR.TYPE, "#9333ea");
    assert.equal(CROSS_REPO_STROKE, "#b06a1a");
  });

  it("resolves edge endpoints to known nodes", () => {
    for (const e of INTEL_EDGES) {
      const a = nodeById(e.from);
      const b = nodeById(e.to);
      assert.ok(a, `missing from ${e.from}`);
      assert.ok(b, `missing to ${e.to}`);
      if (e.scope === "in-repo") {
        assert.equal(a.repo, b.repo, `in-repo edge ${e.id} spans repos`);
      } else {
        assert.notEqual(a.repo, b.repo, `cross-repo edge ${e.id} same repo`);
      }
      const ca = nodeCenter(a);
      const cb = nodeCenter(b);
      assert.ok(Number.isFinite(ca.cx) && Number.isFinite(cb.cy));
    }
  });

  it("filters by kind and cross-repo without leaking secrets", () => {
    assertNoSecretFields({ nodes: INTEL_NODES, edges: INTEL_EDGES });
    const comps = filterNodes("COMPONENT");
    assert.ok(comps.every((n) => n.kind === "COMPONENT"));
    assert.ok(comps.length >= 3);

    const crossNodes = filterNodes("cross-repo");
    const ids = new Set(crossNodes.map((n) => n.id));
    const crossEdges = filterEdges("cross-repo", ids);
    assert.ok(crossEdges.length === 6);
    assert.ok(crossEdges.every((e) => e.scope === "cross-repo"));
  });

  it("defaults inspector target formatDuration from the HTML comp", () => {
    const n = nodeById("formatDuration");
    assert.ok(n);
    assert.equal(n.kind, "FUNCTION");
    assert.equal(n.repo, "web-app");
    assert.ok(n.cross.some((c) => c.repo === "api-service"));
  });
});
