import { createFixtureAtlasGraph } from "./fixture-graph";
import { redactGraph } from "./redaction";
import type {
  AtlasAccessRole,
  AtlasEdge,
  AtlasGraph,
  AtlasNode,
  AtlasOverlay,
  AtlasSubgraph,
} from "./types";
import { ATLAS_OVERLAYS, isAtlasOverlay } from "./types";

const DEFAULT_MAX_NODES = 2000;

export type SubgraphQuery = {
  overlays?: AtlasOverlay[];
  focus?: string | null;
  depth?: number;
  maxNodes?: number;
  role?: AtlasAccessRole;
  /** Inject graph for tests; defaults to fixture. */
  graph?: AtlasGraph;
};

function neighbors(
  edges: AtlasEdge[],
  id: string,
): { edge: AtlasEdge; other: string }[] {
  const out: { edge: AtlasEdge; other: string }[] = [];
  for (const edge of edges) {
    if (edge.from === id) {
      out.push({ edge, other: edge.to });
    } else if (edge.to === id) {
      out.push({ edge, other: edge.from });
    }
  }
  return out;
}

/**
 * Viewport-capped subgraph projection.
 * Proven joins only carry authority; unknown joins stay tagged unknown.
 */
export function projectSubgraph(query: SubgraphQuery = {}): {
  subgraph: AtlasSubgraph;
  redactions: string[];
} {
  const role = query.role ?? "anonymous";
  const depth = Math.max(0, query.depth ?? 2);
  const maxNodes = Math.min(
    query.maxNodes ?? DEFAULT_MAX_NODES,
    DEFAULT_MAX_NODES,
  );
  const overlays =
    query.overlays && query.overlays.length > 0
      ? query.overlays
      : [...ATLAS_OVERLAYS];

  const raw = query.graph ?? createFixtureAtlasGraph();
  const { graph, redactions } = redactGraph(raw, role);

  const overlaySet = new Set(overlays);
  const seedNodes = graph.nodes.filter((n) => overlaySet.has(n.overlay));
  const byId = new Map(seedNodes.map((n) => [n.id, n]));

  const focus = query.focus ?? null;
  const selected = new Set<string>();
  const selectedEdges = new Map<string, AtlasEdge>();

  if (focus && byId.has(focus)) {
    const queue: { id: string; d: number }[] = [{ id: focus, d: 0 }];
    selected.add(focus);
    while (queue.length > 0) {
      const cur = queue.shift();
      if (!cur) break;
      if (cur.d >= depth) continue;
      for (const { edge, other } of neighbors(graph.edges, cur.id)) {
        if (!byId.has(other)) continue;
        selectedEdges.set(edge.id, edge);
        if (!selected.has(other)) {
          selected.add(other);
          queue.push({ id: other, d: cur.d + 1 });
        }
      }
    }
  } else {
    for (const n of seedNodes) {
      selected.add(n.id);
    }
    for (const edge of graph.edges) {
      if (selected.has(edge.from) && selected.has(edge.to)) {
        selectedEdges.set(edge.id, edge);
      }
    }
  }

  let truncated = false;
  let nodeIds = [...selected];
  if (nodeIds.length > maxNodes) {
    truncated = true;
    nodeIds = nodeIds.slice(0, maxNodes);
  }
  const keep = new Set(nodeIds);
  const nodes: AtlasNode[] = nodeIds
    .map((id) => byId.get(id))
    .filter((n): n is AtlasNode => Boolean(n));

  const edges: AtlasEdge[] = [];
  const unknownJoinIds: string[] = [];
  for (const edge of selectedEdges.values()) {
    if (!keep.has(edge.from) || !keep.has(edge.to)) {
      truncated = true;
      continue;
    }
    edges.push(edge);
    if (edge.status === "unknown") {
      unknownJoinIds.push(edge.id);
    }
  }

  const subgraph: AtlasSubgraph = {
    nodes,
    edges,
    levels: overlays,
    focus,
    depth,
    maxNodes,
    truncated,
    unknownJoinIds,
  };

  return { subgraph, redactions };
}

export function parseOverlaysParam(
  value: string | null,
): AtlasOverlay[] | undefined {
  if (!value) return undefined;
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const out: AtlasOverlay[] = [];
  for (const part of parts) {
    if (!isAtlasOverlay(part)) {
      throw new Error(`invalid overlay: ${part}`);
    }
    out.push(part);
  }
  return out;
}
