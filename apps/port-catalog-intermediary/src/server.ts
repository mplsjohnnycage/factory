import { createServer, type Server } from "node:http";
import type { CatalogTranslator } from "./translator.js";
import { parseEnvelope } from "./types.js";

/**
 * HTTP surface — deliberately tiny, mirroring the gateway's expectations:
 *
 *   GET  /health   → 200 { ok: true, service: "port-catalog-intermediary" }
 *   POST /catalog  → the catalog round-trip endpoint. Point the gateway's
 *                    PORT_CATALOG_WORKFLOW_URL at http://<host>:8788/catalog
 *                    (POST / is accepted as an alias).
 *
 * Every failure answers non-2xx with { error } — the gateway's transport
 * throws on non-2xx, which is the fail-closed behavior §4.2.1 wants.
 * Request bodies are size-capped; this endpoint is meant to be reached
 * only by the co-located gateway (loopback / tailnet bind, see config).
 */
export const MAX_BODY_BYTES = 1_048_576;

export function createIntermediaryServer(translator: CatalogTranslator): Server {
  return createServer(async (req, res) => {
    const send = (status: number, body: unknown) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(body));
    };

    try {
      const url = new URL(req.url ?? "/", "http://intermediary.local");
      if (req.method === "GET" && url.pathname === "/health") {
        send(200, { ok: true, service: "port-catalog-intermediary" });
        return;
      }
      if (req.method !== "POST" || (url.pathname !== "/catalog" && url.pathname !== "/")) {
        send(404, { error: "not_found" });
        return;
      }

      const chunks: Buffer[] = [];
      let size = 0;
      for await (const chunk of req) {
        size += (chunk as Buffer).length;
        if (size > MAX_BODY_BYTES) {
          send(413, { error: "request_too_large" });
          return;
        }
        chunks.push(chunk as Buffer);
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        send(400, { error: "invalid_json" });
        return;
      }

      const envelope = parseEnvelope(parsed);
      const result = await translator.handle(envelope);
      send(200, result);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Envelope-shape problems are client errors; everything downstream
      // (Port auth, run failure, timeout) is a bad-gateway the gateway
      // must treat as "write did not land".
      const isClientError =
        message.startsWith("catalog ") || message.startsWith("unknown catalog envelope");
      send(isClientError ? 400 : 502, { error: message });
    }
  });
}
