import { NextRequest, NextResponse } from "next/server";
import { getOrCreateDemoTransport } from "@/lib/rivet/demo-store";
import { liveRivetBase } from "@/lib/rivet/ask-session";

/**
 * Gap-replay endpoint for Rivet native session stream (PBI-009).
 * Serves durable events with sequence > `after`.
 * Live path may proxy Tailscale Serve; Memory fixture used when Rivet unreachable.
 * Never proxies Sandbox Agent. No CopilotKit.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await ctx.params;
  const after = Number(req.nextUrl.searchParams.get("after") ?? "-1");
  if (!Number.isFinite(after)) {
    return NextResponse.json({ ok: false, error: "invalid_after" }, { status: 400 });
  }

  const liveBase = liveRivetBase();
  if (liveBase) {
    const url = new URL(
      `${liveBase}/actors/agent-session/${encodeURIComponent(sessionId)}/events`,
    );
    url.searchParams.set("after", String(after));
    try {
      const upstream = await fetch(url.toString(), {
        headers: {
          accept: "application/json",
          ...(process.env.RIVET_ADMIN_TOKEN
            ? { authorization: `Bearer ${process.env.RIVET_ADMIN_TOKEN}` }
            : {}),
        },
      });
      if (upstream.ok) {
        const body = await upstream.json();
        return NextResponse.json(body);
      }
      // Live configured but failed → explicit error, never fake live.
      return NextResponse.json(
        { ok: false, error: `live_rivet_serve_http_${upstream.status}` },
        { status: 502 },
      );
    } catch {
      return NextResponse.json(
        { ok: false, error: "live_rivet_serve_unreachable" },
        { status: 502 },
      );
    }
  }

  const transport = getOrCreateDemoTransport(sessionId);
  const events = await transport.fetchSince(sessionId, after);
  return NextResponse.json({
    ok: true,
    mode: "memory",
    sessionId,
    after,
    events,
  });
}
