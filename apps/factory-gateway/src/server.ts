import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import {
  AcceptLedger,
  evaluateAcceptOnSha,
  META_ALWAYS_REQUIRED_CHECKS,
  type CheckRunSummary,
} from "./accept-sha.js";
import { CatalogWriter, claimNextJob } from "./catalog-writer.js";
import { verifyPortWebhookHmac } from "./hmac.js";
import { MemoryCatalogStore } from "./memory-store.js";
import { ProjectSupervisorQueue } from "./supervisor.js";
import type { CatalogWriteRequest, PortWebhookBody } from "./types.js";

export type GatewayDeps = {
  secret: string;
  writer: CatalogWriter;
  supervisor: ProjectSupervisorQueue;
  acceptLedger: AcceptLedger;
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

      // PBI-011 — evaluate accept eligibility for exact SHA (no Port mutation).
      if (req.method === "POST" && url.pathname === "/accept/evaluate") {
        const rawBody = await readRawBody(req);
        let body: {
          sha?: string;
          requiredChecks?: string[];
          checks?: CheckRunSummary[];
          deliveryKey?: string;
        };
        try {
          body = JSON.parse(rawBody) as typeof body;
        } catch {
          sendJson(res, 400, { ok: false, error: "invalid_json" });
          return;
        }
        if (!body.sha || !Array.isArray(body.checks)) {
          sendJson(res, 400, { ok: false, error: "invalid_accept_evaluate" });
          return;
        }
        const requiredChecks = body.requiredChecks?.length
          ? body.requiredChecks
          : [...META_ALWAYS_REQUIRED_CHECKS];
        const prior =
          body.deliveryKey !== undefined
            ? deps.acceptLedger.get(body.deliveryKey) ?? null
            : null;
        const result = evaluateAcceptOnSha({
          sha: body.sha,
          requiredChecks,
          checks: body.checks,
          priorAccept: prior,
        });
        sendJson(res, result.ok ? 200 : 409, {
          ...result,
          note: "evaluate_only; cockpit_or_human_performs_port_accept",
        });
        return;
      }

      // PBI-011 — record Cockpit/human accept evidence after green CI on exact SHA.
      // Refuses agent/self. Does not call Port MCP write APIs.
      if (req.method === "POST" && url.pathname === "/accept/record") {
        const actorHeader = String(req.headers["x-factory-accept-actor"] ?? "");
        const rawBody = await readRawBody(req);
        let body: {
          deliveryKey?: string;
          sha?: string;
          requiredChecks?: string[];
          checks?: CheckRunSummary[];
          evidenceRef?: string;
        };
        try {
          body = JSON.parse(rawBody) as typeof body;
        } catch {
          sendJson(res, 400, { ok: false, error: "invalid_json" });
          return;
        }
        if (!body.deliveryKey || !body.sha || !Array.isArray(body.checks)) {
          sendJson(res, 400, { ok: false, error: "invalid_accept_record" });
          return;
        }
        const requiredChecks = body.requiredChecks?.length
          ? body.requiredChecks
          : [...META_ALWAYS_REQUIRED_CHECKS];
        const evalResult = evaluateAcceptOnSha({
          sha: body.sha,
          requiredChecks,
          checks: body.checks,
        });
        if (!evalResult.ok) {
          sendJson(res, 409, {
            ok: false,
            error: "accept_denied",
            sha: evalResult.sha,
            reason: evalResult.reason,
            detail: evalResult.detail,
          });
          return;
        }
        const recorded = deps.acceptLedger.record({
          deliveryKey: body.deliveryKey,
          sha: body.sha,
          actor: actorHeader,
          requiredChecks,
          evidenceRef: body.evidenceRef,
        });
        if (!recorded.ok) {
          sendJson(res, 403, { ok: false, error: recorded.reason });
          return;
        }
        sendJson(res, 200, {
          ok: true,
          record: recorded.record,
          note: "evidence_recorded; port_catalog_accept_remains_cockpit_governance",
        });
        return;
      }

      if (req.method === "GET" && url.pathname === "/accept/status") {
        const deliveryKey = url.searchParams.get("deliveryKey") ?? "";
        const tipSha = url.searchParams.get("tipSha") ?? "";
        if (!deliveryKey || !tipSha) {
          sendJson(res, 400, { ok: false, error: "deliveryKey_and_tipSha_required" });
          return;
        }
        const record = deps.acceptLedger.get(deliveryKey) ?? null;
        sendJson(res, 200, {
          ok: true,
          deliveryKey,
          tipSha,
          record,
          validForTip: deps.acceptLedger.isValidForTip(deliveryKey, tipSha),
        });
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
    acceptLedger: new AcceptLedger(),
  };
}
