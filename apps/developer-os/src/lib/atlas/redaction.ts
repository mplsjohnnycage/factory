import type {
  AtlasAccessRole,
  AtlasEdge,
  AtlasGraph,
  AtlasNode,
  AtlasNodeSensitivity,
} from "./types";
import { assertNever } from "./types";

const COST_KEYS = new Set(["costUsd", "tokens", "evalScore"]);

function sensitivityVisible(
  sensitivity: AtlasNodeSensitivity,
  role: AtlasAccessRole,
): boolean {
  switch (sensitivity) {
    case "public":
      return true;
    case "operator":
      return role === "operator";
    case "restricted":
      return role === "operator";
    default:
      return assertNever(sensitivity);
  }
}

function redactNodeAttrs(
  node: AtlasNode,
  role: AtlasAccessRole,
  redactions: string[],
): AtlasNode {
  if (!node.attrs) {
    return node;
  }

  if (node.overlay !== "langfuse") {
    return node;
  }

  if (role === "operator") {
    return node;
  }

  const nextAttrs: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node.attrs)) {
    if (COST_KEYS.has(key)) {
      redactions.push(`${node.id}.${key}`);
      continue;
    }
    if (key === "liveOwner") {
      nextAttrs[key] = false;
      continue;
    }
    nextAttrs[key] = value;
  }

  return { ...node, attrs: nextAttrs };
}

/**
 * Apply access/redaction policy to a graph projection.
 * - Restricted/operator nodes hidden from anonymous.
 * - Langfuse cost fields redacted for anonymous.
 * - Unknown joins retained with status=unknown (non-authority).
 * - Langfuse never marked as live session owner.
 */
export function redactGraph(
  graph: AtlasGraph,
  role: AtlasAccessRole,
): { graph: AtlasGraph; redactions: string[] } {
  const redactions: string[] = [];

  const nodes: AtlasNode[] = [];
  for (const node of graph.nodes) {
    if (!sensitivityVisible(node.sensitivity, role)) {
      redactions.push(`node:${node.id}`);
      continue;
    }
    const redacted = redactNodeAttrs(node, role, redactions);
    if (redacted.overlay === "langfuse" && redacted.attrs) {
      nodes.push({
        ...redacted,
        attrs: { ...redacted.attrs, liveOwner: false },
      });
    } else {
      nodes.push(redacted);
    }
  }

  const visible = new Set(nodes.map((n) => n.id));
  const edges: AtlasEdge[] = [];
  for (const edge of graph.edges) {
    if (!visible.has(edge.from) || !visible.has(edge.to)) {
      redactions.push(`edge:${edge.id}`);
      continue;
    }
    if (edge.status === "proven" && !edge.provenance) {
      // Refuse invented proven edges — demote to unknown.
      edges.push({ ...edge, status: "unknown", provenance: null });
      redactions.push(`demote:${edge.id}`);
      continue;
    }
    edges.push(edge);
  }

  return { graph: { nodes, edges }, redactions };
}
