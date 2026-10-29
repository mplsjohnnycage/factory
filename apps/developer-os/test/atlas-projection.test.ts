import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createFixtureAtlasGraph } from "../src/lib/atlas/fixture-graph.js";
import { projectSubgraph } from "../src/lib/atlas/projection.js";
import { redactGraph } from "../src/lib/atlas/redaction.js";
import {
  atlasPortWorkflowId,
  normalizeAtlasToolName,
} from "../src/lib/atlas/tool-names.js";
import { invokeAtlasTool } from "../src/lib/atlas/tools.js";

describe("Code Atlas four-overlay read projection (STL-154)", () => {
  it("projects fixture with proven joins and keeps unknown joins non-authority", () => {
    const { subgraph } = projectSubgraph({ role: "operator", depth: 4 });
    assert.ok(subgraph.nodes.length >= 4);
    const proven = subgraph.edges.filter((e) => e.status === "proven");
    const unknown = subgraph.edges.filter((e) => e.status === "unknown");
    assert.ok(proven.length >= 1);
    for (const edge of proven) {
      assert.ok(edge.provenance);
      assert.ok(edge.provenance.sourceSystem);
      assert.ok(edge.provenance.sourceId);
      assert.ok(edge.provenance.target);
      assert.ok(edge.provenance.evidence);
      assert.ok(edge.provenance.observedAt);
    }
    for (const edge of unknown) {
      assert.equal(edge.provenance, null);
      assert.ok(subgraph.unknownJoinIds.includes(edge.id));
    }
  });

  it("redacts Langfuse cost fields and restricted nodes for anonymous", () => {
    const graph = createFixtureAtlasGraph();
    const { graph: visible, redactions } = redactGraph(graph, "anonymous");
    assert.ok(!visible.nodes.some((n) => n.id === "langfuse:obs-restricted-cost"));
    assert.ok(redactions.some((r) => r.includes("obs-restricted-cost")));
    const trace = visible.nodes.find((n) => n.id === "langfuse:trace-atlas-1");
    assert.ok(trace);
    assert.equal(trace.attrs?.costUsd, undefined);
    assert.equal(trace.attrs?.evalScore, undefined);
    assert.equal(trace.attrs?.durationMs, 1280);
    assert.equal(trace.attrs?.liveOwner, false);
    assert.ok(redactions.some((r) => r.endsWith(".costUsd")));
  });

  it("operator can see Langfuse traces but never as live owner", () => {
    const { graph } = redactGraph(createFixtureAtlasGraph(), "operator");
    const trace = graph.nodes.find((n) => n.id === "langfuse:trace-atlas-1");
    assert.ok(trace);
    assert.equal(trace.attrs?.liveOwner, false);
  });

  it("atlas.find_node returns fixture task", () => {
    const result = invokeAtlasTool({
      tool: "atlas.find_node",
      args: { query: "STL-154" },
      role: "operator",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const matches = (result.data as { matches: { id: string }[] }).matches;
    assert.ok(matches.some((m) => m.id.includes("stl154")));
  });

  it("atlas.expand_dependencies walks proven neighborhood", () => {
    const result = invokeAtlasTool({
      tool: "atlas.expand_dependencies",
      args: { nodeId: "beads:factory-stl154", depth: 2 },
      role: "operator",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const data = result.data as { nodes: { id: string }[]; edges: unknown[] };
    assert.ok(data.nodes.length >= 2);
  });

  it("atlas.get_task_impact excludes unknown joins from authority list", () => {
    const result = invokeAtlasTool({
      tool: "atlas.get_task_impact",
      args: { taskId: "factory-stl154" },
      role: "operator",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const data = result.data as {
      edges: { status: string }[];
      unknownJoinsExcludedFromAuthority: string[];
    };
    assert.ok(data.edges.every((e) => e.status === "proven"));
  });

  it("atlas.get_related_sessions returns polygraph session via proven edge", () => {
    const result = invokeAtlasTool({
      tool: "atlas.get_related_sessions",
      args: { nodeId: "beads:factory-stl154" },
      role: "operator",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const data = result.data as { sessions: { id: string }[] };
    assert.ok(data.sessions.some((s) => s.id === "polygraph:sess-atlas-1"));
  });

  it("atlas.get_agent_traces refuses Langfuse as live owner", () => {
    const result = invokeAtlasTool({
      tool: "atlas.get_agent_traces",
      args: { sessionId: "sess-atlas-1", asLiveOwner: true },
      role: "operator",
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, "langfuse_not_live_owner");
  });

  it("atlas.get_agent_traces returns historical traces for operator", () => {
    const result = invokeAtlasTool({
      tool: "atlas.get_agent_traces",
      args: { sessionId: "sess-atlas-1" },
      role: "operator",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const data = result.data as {
      liveOwner: string;
      langfuseIsLiveOwner: boolean;
      traces: unknown[];
    };
    assert.equal(data.liveOwner, "rivet");
    assert.equal(data.langfuseIsLiveOwner, false);
    assert.ok(data.traces.length >= 1);
  });

  it("anonymous gets redacted public traces but not restricted cost rollup", () => {
    const result = invokeAtlasTool({
      tool: "atlas.get_agent_traces",
      args: { sessionId: "sess-atlas-1" },
      role: "anonymous",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const data = result.data as {
      traces: { id: string; attrs?: Record<string, unknown> }[];
    };
    assert.ok(data.traces.some((t) => t.id === "langfuse:trace-atlas-1"));
    assert.ok(!data.traces.some((t) => t.id === "langfuse:obs-restricted-cost"));
    const publicTrace = data.traces.find((t) => t.id === "langfuse:trace-atlas-1");
    assert.equal(publicTrace?.attrs?.costUsd, undefined);
    assert.ok(result.redactions.some((r) => r.endsWith(".costUsd")));
  });

  it("normalizes Port underscore workflow ids to OpenMCP dotted names", () => {
    assert.equal(normalizeAtlasToolName("atlas.find_node"), "atlas.find_node");
    assert.equal(normalizeAtlasToolName("atlas_find_node"), "atlas.find_node");
    assert.equal(
      normalizeAtlasToolName("atlas_get_agent_traces"),
      "atlas.get_agent_traces",
    );
    assert.equal(normalizeAtlasToolName("ATLAS.FIND_NODE"), "atlas.find_node");
    assert.equal(normalizeAtlasToolName("not_a_tool"), null);
    assert.equal(atlasPortWorkflowId("atlas.find_node"), "atlas_find_node");
  });
});
