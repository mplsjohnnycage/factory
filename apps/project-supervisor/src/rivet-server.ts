import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { registry } from "./rivet-registry.js";

/**
 * Hono app: RivetKit handler at /api/rivet/* plus /health.
 * RIVET_ENDPOINT (secret) and RIVET_PUBLIC_ENDPOINT come from the environment only.
 */
export function createRivetApp(): Hono {
  const app = new Hono();
  app.get("/health", (c) => c.json({ ok: true }));
  app.all("/api/rivet/*", (c) => registry.handler(c.req.raw));
  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.RIVET_PORT ?? 3000);
  serve({ fetch: createRivetApp().fetch, port });
  console.log(`rivet server listening on :${port}`);
}
