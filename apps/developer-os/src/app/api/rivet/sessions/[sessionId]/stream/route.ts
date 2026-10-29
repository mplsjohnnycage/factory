import { NextRequest } from "next/server";
import { getOrCreateDemoTransport } from "@/lib/rivet/demo-store";
import type { SessionEvent } from "@/lib/rivet/session-events";

/**
 * SSE live channel for Rivet native session stream (PBI-009).
 * Browser → Dev OS BFF only. Never Sandbox Agent. No CopilotKit.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await ctx.params;
  const after = Number(req.nextUrl.searchParams.get("after") ?? "-1");
  const transport = getOrCreateDemoTransport(sessionId);

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const enc = new TextEncoder();
      const send = (event: SessionEvent) => {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const ping = setInterval(() => {
        controller.enqueue(enc.encode(`: ping\n\n`));
      }, 15000);

      const demoTimer = setTimeout(() => {
        void transport.fetchSince(sessionId, after).then((existing) => {
          const last = existing.at(-1)?.sequence ?? after;
          transport.append({
            sequence: last + 1,
            sessionId,
            sender: "system",
            type: "stream.live",
            at: new Date().toISOString(),
            payload: { note: "live Memory tick" },
          });
        });
      }, 50);

      const unsub = transport.subscribe(sessionId, after, {
        onEvent: send,
        onError: () => {
          clearInterval(ping);
          clearTimeout(demoTimer);
          controller.close();
        },
        onClose: () => {
          clearInterval(ping);
          clearTimeout(demoTimer);
          controller.close();
        },
      });

      req.signal.addEventListener("abort", () => {
        clearInterval(ping);
        clearTimeout(demoTimer);
        unsub();
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-factory-stream": "rivet-native",
      "x-factory-no-copilotkit": "1",
    },
  });
}
