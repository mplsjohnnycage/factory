import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { CatalogWriter, claimNextJob } from "./catalog-writer.js";
import { verifyPortWebhookHmac } from "./hmac.js";
import { MemoryCatalogStore } from "./memory-store.js";
import { ProjectSupervisorQueue } from "./supervisor.js";
import type { CatalogWriteRequest, PortWebhookBody } from "./types.js";

export type GatewayDeps = {
  secret: string;
  writer: CatalogWriter;
  supervisor: ProjectSupervisorQueue;
};

async function readRawBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

export function createGatewayServer(deps: GatewayDeps) {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://gateway.local");

      if (req.method === "GET" && url.pathname === "/health") {
        sendJson(res, 200, { ok: true, service: "factory-gateway" });
        return;
      }

      if (req.method === "POST" && url.pathname === "/webhooks/port") {
        const rawBody = await readRawBody(req);
        const signature = String(req.headers["x-port-signature"] ?? "");
        const timestamp = String(req.headers["x-port-timestamp"] ?? "");

        const valid = verifyPortWebhookHmac({
          secret: deps.secret,
          rawBody,
          headers: { signature, timestamp },
        });
        if (!valid) {
          sendJson(res, 401, { ok: false, error: "invalid_port_signature" });
          return;
        }

        let body: PortWebhookBody;
        try {
          body = JSON.parse(rawBody) as PortWebhookBody;
        } catch {
          sendJson(res, 400, { ok: false, error: "invalid_json" });
          return;
        }

        const admit = await deps.supervisor.enqueue(body);
        sendJson(res, 202, {
          ok: true,
          admitId: admit.id,
          note: "enqueued_project_supervisor; rivet_never_polls_port",
        });
        return;
      }

      if (req.method === "POST" && url.pathname === "/catalog/write") {
        const rawBody = await readRawBody(req);
        let request: CatalogWriteRequest;
        try {
          request = JSON.parse(rawBody) as CatalogWriteRequest;
        } catch {
          sendJson(res, 400, { ok: false, error: "invalid_json" });
          return;
        }

        if (
          !request.blueprint ||
          !request.entityIdentifier ||
          typeof request.expectedCatalogVersion !== "number" ||
          typeof request.patch !== "object" ||
          request.patch === null
        ) {
          sendJson(res, 400, { ok: false, error: "invalid_catalog_write" });
          return;
        }

        const result = await deps.writer.apply(request);
        sendJson(res, result.ok ? 200 : 409, result);
        return;
      }

      if (req.method === "POST" && url.pathname === "/catalog/claim-next") {
        const rawBody = await readRawBody(req);
        let body: {
          blueprint?: string;
          entityIdentifier?: string;
          expectedCatalogVersion?: number;
          owner?: string;
          leaseEpoch?: number;
        };
        try {
          body = JSON.parse(rawBody) as typeof body;
        } catch {
          sendJson(res, 400, { ok: false, error: "invalid_json" });
          return;
        }

        if (
          !body.blueprint ||
          !body.entityIdentifier ||
          typeof body.expectedCatalogVersion !== "number" ||
          !body.owner ||
          typeof body.leaseEpoch !== "number"
        ) {
          sendJson(res, 400, { ok: false, error: "invalid_claim" });
          return;
        }

        const result = await claimNextJob(deps.writer, {
          blueprint: body.blueprint,
          entityIdentifier: body.entityIdentifier,
          expectedCatalogVersion: body.expectedCatalogVersion,
          owner: body.owner,
          leaseEpoch: body.leaseEpoch,
        });
        sendJson(res, result.ok ? 200 : 409, result);
        return;
      }

      sendJson(res, 404, { ok: false, error: "not_found" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      sendJson(res, 500, { ok: false, error: "internal", message });
    }
  });
}

export function buildDefaultDeps(env: NodeJS.ProcessEnv = process.env): GatewayDeps {
  const secret = env.PORT_CLIENT_SECRET ?? "";
  const store = new MemoryCatalogStore();
  return {
    secret,
    writer: new CatalogWriter(store),
    supervisor: new ProjectSupervisorQueue({
      rivetSupervisorUrl: env.RIVET_SUPERVISOR_URL || undefined,
    }),
  };
}
