import { NextResponse } from "next/server";
import {
  parseOverlaysParam,
  projectSubgraph,
} from "@/lib/atlas/projection";
import type { AtlasAccessRole } from "@/lib/atlas/types";

export const runtime = "nodejs";

function parseRole(value: string | null): AtlasAccessRole {
  return value === "operator" ? "operator" : "anonymous";
}

/**
 * GET /api/atlas/subgraph — viewport-capped four-overlay read projection.
 * Query: level/overlays, focus, depth, role. Read-only; no Port mutations.
 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  try {
    const overlays = parseOverlaysParam(
      url.searchParams.get("overlays") ?? url.searchParams.get("level"),
    );
    const focus = url.searchParams.get("focus") ?? url.searchParams.get("atlasFocus");
    const depthRaw = url.searchParams.get("depth");
    const depth = depthRaw ? Number(depthRaw) : undefined;
    if (depthRaw && !Number.isFinite(depth)) {
      return NextResponse.json(
        { error: "invalid depth" },
        { status: 400 },
      );
    }
    const role = parseRole(url.searchParams.get("role"));
    const { subgraph, redactions } = projectSubgraph({
      overlays,
      focus,
      depth,
      role,
    });
    return NextResponse.json({
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
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
