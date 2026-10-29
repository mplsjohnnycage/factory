import { createFixtureAtlasGraph } from "./fixture-graph";
import { projectSubgraph } from "./projection";
import { redactGraph } from "./redaction";
import type {
  AtlasAccessRole,
  AtlasGraph,
  AtlasMcpTool,
  AtlasToolError,
  AtlasToolRequest,
  AtlasToolResult,
} from "./types";
import { ATLAS_MCP_TOOLS, assertNever } from "./types";

function isMcpTool(value: string): value is AtlasMcpTool {
  return (ATLAS_MCP_TOOLS as readonly string[]).includes(value);
}

function asString(args: Record<string, unknown> | undefined, key: string): string | null {
  const v = args?.[key];
  return typeof v === "string" && v.length > 0 ? v : null;
}

function roleOf(req: AtlasToolRequest): AtlasAccessRole {
  return req.role === "operator" ? "operator" : "anonymous";
}

function fail(
  tool: AtlasMcpTool,
  code: AtlasToolError["code"],
  error: string,
): AtlasToolError {
  return { tool, ok: false, error, code };
}

function ok(
  tool: AtlasMcpTool,
  data: unknown,
  redactions: string[],
): AtlasToolResult {
  return { tool, ok: true, data, redactions };
}

/**
 * Bounded Code Atlas MCP tool dispatcher (Port MCP read projection surface).
 * Read-only. Does not invent graph authority. Langfuse is never live owner.
 */
export function invokeAtlasTool(
  req: AtlasToolRequest,
  graph: AtlasGraph = createFixtureAtlasGraph(),
): AtlasToolResult | AtlasToolError {
  const tool = req.tool;
  if (!isMcpTool(tool)) {
    return fail("atlas.find_node", "unknown_tool", `unknown tool: ${String(tool)}`);
  }

  const role = roleOf(req);
  const { graph: visible, redactions } = redactGraph(graph, role);

  switch (tool) {
    case "atlas.find_node": {
      const query = asString(req.args, "query") ?? asString(req.args, "id");
      if (!query) {
        return fail(tool, "invalid_args", "query or id required");
      }
      const q = query.toLowerCase();
      const matches = visible.nodes.filter(
        (n) =>
          n.id.toLowerCase().includes(q) ||
          n.label.toLowerCase().includes(q) ||
          n.sourceId.toLowerCase().includes(q),
      );
      return ok(tool, { matches }, redactions);
    }
    case "atlas.expand_dependencies": {
      const nodeId = asString(req.args, "nodeId") ?? asString(req.args, "id");
      if (!nodeId) {
        return fail(tool, "invalid_args", "nodeId required");
      }
      if (!visible.nodes.some((n) => n.id === nodeId)) {
        return fail(tool, "not_found", `node not found: ${nodeId}`);
      }
      const depth =
        typeof req.args?.depth === "number" ? Math.max(0, req.args.depth) : 1;
      const { subgraph, redactions: more } = projectSubgraph({
        focus: nodeId,
        depth,
        role,
        graph,
      });
      return ok(
        tool,
        {
          focus: nodeId,
          nodes: subgraph.nodes,
          edges: subgraph.edges,
          unknownJoinIds: subgraph.unknownJoinIds,
        },
        [...redactions, ...more],
      );
    }
    case "atlas.get_task_impact": {
      const taskId =
        asString(req.args, "taskId") ??
        asString(req.args, "beadId") ??
        asString(req.args, "id");
      if (!taskId) {
        return fail(tool, "invalid_args", "taskId required");
      }
      const task =
        visible.nodes.find((n) => n.id === taskId) ??
        visible.nodes.find(
          (n) => n.overlay === "beads" && (n.sourceId === taskId || n.id.endsWith(`:${taskId}`)),
        );
      if (!task) {
        return fail(tool, "not_found", `task not found: ${taskId}`);
      }
      const { subgraph, redactions: more } = projectSubgraph({
        focus: task.id,
        depth: 3,
        role,
        graph,
      });
      const symbols = subgraph.nodes.filter((n) => n.overlay === "graft");
      const sessions = subgraph.nodes.filter((n) => n.overlay === "polygraph");
      return ok(
        tool,
        {
          task,
          impactedSymbols: symbols,
          relatedSessions: sessions,
          edges: subgraph.edges.filter((e) => e.status === "proven"),
          unknownJoinsExcludedFromAuthority: subgraph.unknownJoinIds,
        },
        [...redactions, ...more],
      );
    }
    case "atlas.get_related_sessions": {
      const nodeId = asString(req.args, "nodeId") ?? asString(req.args, "id");
      if (!nodeId) {
        return fail(tool, "invalid_args", "nodeId required");
      }
      if (!visible.nodes.some((n) => n.id === nodeId)) {
        return fail(tool, "not_found", `node not found: ${nodeId}`);
      }
      const { subgraph, redactions: more } = projectSubgraph({
        focus: nodeId,
        depth: 2,
        overlays: ["polygraph", "beads", "graft", "langfuse"],
        role,
        graph,
      });
      const sessions = subgraph.nodes.filter(
        (n) => n.overlay === "polygraph" && n.kind === "session",
      );
      return ok(
        tool,
        {
          nodeId,
          sessions,
          provenEdges: subgraph.edges.filter((e) => e.status === "proven"),
          unknownJoinIds: subgraph.unknownJoinIds,
        },
        [...redactions, ...more],
      );
    }
    case "atlas.get_agent_traces": {
      const sessionId =
        asString(req.args, "sessionId") ??
        asString(req.args, "nodeId") ??
        asString(req.args, "id");
      if (!sessionId) {
        return fail(tool, "invalid_args", "sessionId required");
      }

      // Langfuse is historical — refuse any request that claims it as live owner.
      if (req.args?.asLiveOwner === true) {
        return fail(
          tool,
          "langfuse_not_live_owner",
          "Langfuse is historical observability only; Rivet owns live sessions",
        );
      }

      const sessionNode =
        visible.nodes.find((n) => n.id === sessionId) ??
        visible.nodes.find(
          (n) =>
            n.overlay === "polygraph" &&
            (n.sourceId === sessionId || n.id.endsWith(`:${sessionId}`)),
        );

      const traces = visible.nodes.filter((n) => {
        if (n.overlay !== "langfuse") return false;
        if (!sessionNode) {
          return (
            n.sourceId === sessionId ||
            n.id.includes(sessionId) ||
            String(n.attrs?.sessionId ?? "") === sessionId
          );
        }
        return visible.edges.some(
          (e) =>
            e.status === "proven" &&
            ((e.from === sessionNode.id && e.to === n.id) ||
              (e.to === sessionNode.id && e.from === n.id)),
        );
      });

      if (role === "anonymous" && traces.length === 0) {
        // May be redacted — distinguish forbidden vs empty when restricted-only.
        const rawTraces = graph.nodes.filter((n) => n.overlay === "langfuse");
        if (rawTraces.length > 0 && traces.length === 0) {
          return fail(tool, "forbidden", "operator role required for Langfuse traces");
        }
      }

      return ok(
        tool,
        {
          sessionId,
          liveOwner: "rivet",
          langfuseIsLiveOwner: false,
          traces,
        },
        redactions,
      );
    }
    default:
      return assertNever(tool);
  }
}

export function listAtlasMcpTools(): readonly AtlasMcpTool[] {
  return ATLAS_MCP_TOOLS;
}
