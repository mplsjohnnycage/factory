import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { admitFromPayload, type AdmitFromPayloadResult } from "./admit-entry.js";
import type { ProjectSupervisorActor } from "./project-supervisor.js";

/**
 * Thin HTTP admit listener for offline / local dry-run (G6).
 *
 * Point gateway `RIVET_SUPERVISOR_URL` at `http://127.0.0.1:<port>/admit`
 * (Compose default engine URL is not an admit consumer).
 * No Rivet SDK — plain node:http.
 */

export type AdmitServerDeps = {
  supervisor: ProjectSupervisorActor;
  /** Optional host. Default 127.0.0.1. */
  host?: string;
};

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  return JSON.parse(raw) as unknown;
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function httpStatusForAdmit(result: AdmitFromPayloadResult): number {
  if (result.ok === true) {
    return 200;
  }

  const reason = result.reason;
  switch (reason) {
    case "invalid_body":
    case "missing_task_id":
    case "missing_work_key":
    case "claim_or_bypass_required":
      return 400;
    case "not_port_authorized":
      return 403;
    case "claim_id_required":
    case "bead_not_ready":
    case "bead_claim_mismatch":
      return 409;
    default: {
      const _exhaustive: never = reason;
      void _exhaustive;
      return 500;
    }
  }
}

/**
 * Create an HTTP server: GET /health, POST /admit.
 * Does not listen until caller calls server.listen.
 */
export function createAdmitServer(deps: AdmitServerDeps): Server {
  const { supervisor } = deps;

  return createServer((req, res) => {
    void (async () => {
      try {
        const url = new URL(req.url ?? "/", "http://127.0.0.1");
        const path = url.pathname;

        if (req.method === "GET" && (path === "/health" || path === "/")) {
          sendJson(res, 200, { ok: true, service: "project-supervisor-admit" });
          return;
        }

        if (req.method === "POST" && path === "/admit") {
          let body: unknown;
          try {
            body = await readJsonBody(req);
          } catch {
            sendJson(res, 400, {
              ok: false,
              reason: "invalid_body",
              detail: "POST /admit requires JSON body",
            });
            return;
          }
          const result = await admitFromPayload(supervisor, body);
          const status = httpStatusForAdmit(result);
          sendJson(res, status, result);
          return;
        }

        sendJson(res, 404, { ok: false, reason: "not_found" });
      } catch (err) {
        sendJson(res, 500, {
          ok: false,
          reason: "internal_error",
          detail: err instanceof Error ? err.message : String(err),
        });
      }
    })();
  });
}

export type ListenAdmitServerResult = {
  server: Server;
  baseUrl: string;
  port: number;
  close: () => Promise<void>;
};

/** Listen on an ephemeral (or given) port for local dry-run / tests. */
export async function listenAdmitServer(
  deps: AdmitServerDeps,
  opts?: { port?: number },
): Promise<ListenAdmitServerResult> {
  const host = deps.host ?? "127.0.0.1";
  const server = createAdmitServer(deps);
  const port = opts?.port ?? 0;

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve());
  });

  const addr = server.address();
  if (!addr || typeof addr === "string") {
    server.close();
    throw new Error("admit server failed to bind");
  }

  const baseUrl = `http://${host}:${addr.port}`;
  return {
    server,
    baseUrl,
    port: addr.port,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}
