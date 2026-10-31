import { NextResponse } from "next/server";
import {
  parseOverlaysParam,
  projectSubgraph,
} from "@/lib/atlas/projection";
import { resolveAtlasRole } from "@/lib/atlas/session";

export const runtime = "nodejs";

/** Hard ceiling for query depth (projection also clamps node count). */
const MAX_DEPTH = 8;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
} as const;

function json(data: unknown, init?: { status?: number }): Response {
  return NextResponse.json(data, {
    status: init?.status,
    headers: NO_STORE_HEADERS,
  });
}

/**
 * GET /api/atlas/subgraph — viewport-capped four-overlay read projection.
 * Query: level/overlays, focus, depth. Role comes from the Port session, not the query. Read-only; no Port mutations.
 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  try {
    const overlays = parseOverlaysParam(
      url.searchParams.get("overlays") ?? url.searchParams.get("level"),
    );
    const focus = url.searchParams.get("focus") ?? url.searchParams.get("atlasFocus");
    const depthRaw = url.searchParams.get("depth");
    let depth = depthRaw ? Number(depthRaw) : undefined;
    if (depthRaw && !Number.isFinite(depth)) {
      return json({ error: "invalid depth", code: "invalid_args" }, { status: 400 });
    }
    if (typeof depth === "number") {
      if (depth < 0) {
        return json({ error: "depth must be >= 0", code: "invalid_args" }, { status: 400 });
      }
      depth = Math.min(Math.floor(depth), MAX_DEPTH);
    }
    const role = await resolveAtlasRole(request);
    const { subgraph, redactions } = projectSubgraph({
      overlays,
      focus,
      depth,
      role,
    });
    return json({
      ...subgraph,
      redactions,
      authority: {
        provenJoinsOnly: true,
        langfuseLiveOwner: false,
        liveSessionOwner: "rivet",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "subgraph error";
    return json({ error: message, code: "subgraph_error" }, { status: 400 });
  }
}
