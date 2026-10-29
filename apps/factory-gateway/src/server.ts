import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import {
  AcceptLedger,
  evaluateAcceptOnSha,
  META_ALWAYS_REQUIRED_CHECKS,
  type CheckRunSummary,
} from "./accept-sha.js";
import { CatalogWriter, claimNextJob } from "./catalog-writer.js";
import {
  isFactoryWorkflowId,
  resolveFactoryActionIdentifier,
} from "./factory-workflows.js";
import { gateFleetSpawn } from "./fleet-spawn.js";
import { verifyPortWebhookHmac } from "./hmac.js";
import { MemoryCatalogStore } from "./memory-store.js";
import type { ApprovalsMode, OpenFleetCeiling } from "./openfleet-ceilings.js";
import {
  buildOpenFleetLedger,
  type OpenFleetLedger,
} from "./openfleet-ledger.js";
import {
  rateLimitConfigFromEnv,
  rateLimitKeyFromRequest,
  SlidingWindowRateLimiter,
} from "./rate-limit.js";
import {
  convexClientFromEnv,
  dispatchSelfService,
  verifyHandlerBearer,
  type SelfServiceRequest,
} from "./self-service-handlers.js";
import type { ConvexManagementClient } from "./convex-management.js";
import { ProjectSupervisorQueue } from "./supervisor.js";
import { applySyncWrite, isSyncSource } from "./sync-ingress.js";
import type { CatalogWriteRequest, PortWebhookBody } from "./types.js";

/** Match POST /webhooks/port or /webhooks/port/<factory_*>. */
function matchPortWebhookPath(
  pathname: string,
): { ok: true; pathAction?: string } | { ok: false } {
  if (pathname === "/webhooks/port") return { ok: true };
  const prefix = "/webhooks/port/";
  if (!pathname.startsWith(prefix)) return { ok: false };
  const pathAction = pathname.slice(prefix.length);
  if (!pathAction || pathAction.includes("/")) return { ok: false };
  if (!isFactoryWorkflowId(pathAction)) return { ok: false };
  return { ok: true, pathAction };
}

export type GatewayDeps = {
  secret: string;
  writer: CatalogWriter;
  supervisor: ProjectSupervisorQueue;
  acceptLedger: AcceptLedger;
  /** OpenFleet ledger for ceiling.refuse (PBI-012). */
  openFleetLedger: OpenFleetLedger;
  /** Gateway rate limiter (PBI-012). */
  rateLimiter: SlidingWindowRateLimiter;
  /** Bearer for Port WEBHOOK → /handlers/self-service (Meta SS handlers). */
  handlerToken: string;
  /** Convex Management API client; null when CONVEX_TEAM_TOKEN unset. */
  convex: ConvexManagementClient | null;
};

async function readRawBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function sendJson(
  res: ServerResponse,
  status: number,
  body: unknown,
  extraHeaders?: Record<string, string | number>,
): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(payload),
    ...extraHeaders,
  });
  res.end(payload);
}

function applyRateLimit(
  deps: GatewayDeps,
  req: IncomingMessage,
  res: ServerResponse,
  path: string,
): boolean {
  const key = rateLimitKeyFromRequest({
    headers: req.headers as Record<string, string | string[] | undefined>,
    remoteAddress: req.socket.remoteAddress,
    path,
  });
  const result = deps.rateLimiter.take(key);
  res.setHeader("x-ratelimit-limit", String(result.limit));
  res.setHeader("x-ratelimit-remaining", String(result.remaining));
  res.setHeader("x-ratelimit-reset", String(Math.ceil(result.resetAt / 1000)));
  if (!result.ok) {
    sendJson(
      res,
      429,
      { ok: false, error: "rate_limited", retryAfterSec: result.retryAfterSec },
      { "retry-after": result.retryAfterSec },
    );
    return false;
  }
  return true;
}

export function createGatewayServer(deps: GatewayDeps) {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://gateway.local");

      if (req.method === "GET" && url.pathname === "/health") {
        sendJson(res, 200, { ok: true, service: "factory-gateway" });
        return;
      }

      const webhookMatch =
        req.method === "POST" ? matchPortWebhookPath(url.pathname) : null;
      if (webhookMatch?.ok) {
        if (!applyRateLimit(deps, req, res, "/webhooks/port")) return;

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

        const actionIdentifier = resolveFactoryActionIdentifier({
          pathAction: webhookMatch.pathAction,
          body,
        });
        const enriched: PortWebhookBody =
          actionIdentifier && body.action !== actionIdentifier
            ? { ...body, action: actionIdentifier }
            : body;

        const admit = await deps.supervisor.enqueue(enriched);
        sendJson(res, 202, {
          ok: true,
          admitId: admit.id,
          actionIdentifier: admit.actionIdentifier,
          note: "enqueued_project_supervisor; rivet_never_polls_port",
        });
        return;
      }

      if (req.method === "POST" && url.pathname === "/catalog/write") {
        if (!applyRateLimit(deps, req, res, url.pathname)) return;
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

      // §4.2.1 — Ocean/MCP sync ingress; Meta-fenced blueprints cannot bypass CatalogWriter.
      if (req.method === "POST" && url.pathname === "/catalog/sync-write") {
        if (!applyRateLimit(deps, req, res, url.pathname)) return;
        const rawBody = await readRawBody(req);
        let body: CatalogWriteRequest & {
          source?: unknown;
          bypassFence?: unknown;
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
          typeof body.patch !== "object" ||
          body.patch === null ||
          !isSyncSource(body.source)
        ) {
          sendJson(res, 400, { ok: false, error: "invalid_sync_write" });
          return;
        }

        const result = await applySyncWrite(deps.writer, {
          source: body.source,
          blueprint: body.blueprint,
          entityIdentifier: body.entityIdentifier,
          expectedCatalogVersion: body.expectedCatalogVersion,
          patch: body.patch,
          bypassFence: body.bypassFence === true,
        });

        if (!result.ok && result.reason === "meta_fence_bypass_forbidden") {
          sendJson(res, 403, result);
          return;
        }
        if (!result.ok && result.reason === "ocean_mirror_not_via_gateway") {
          sendJson(res, 409, result);
          return;
        }
        if (!result.ok && result.reason === "invalid_sync_source") {
          sendJson(res, 400, result);
          return;
        }
        sendJson(res, result.ok ? 200 : 409, result);
        return;
      }

      // PBI-012 — OpenFleet ceiling-gated spawn (over-ceiling → ledger ceiling.refuse).
      if (req.method === "POST" && url.pathname === "/fleet/spawn") {
        if (!applyRateLimit(deps, req, res, url.pathname)) return;
        const rawBody = await readRawBody(req);
        let body: {
          fleet?: string;
          swarm?: string;
          member?: string;
          by?: string;
          host?: string;
          approvals?: ApprovalsMode;
          proposedDepth?: number;
          currentSwarmMembers?: number;
          fleetCeiling?: OpenFleetCeiling;
          swarmCeiling?: OpenFleetCeiling;
          spendSoFar?: number;
          proposedSpend?: number;
        };
        try {
          body = JSON.parse(rawBody) as typeof body;
        } catch {
          sendJson(res, 400, { ok: false, error: "invalid_json" });
          return;
        }
        if (
          !body.fleet ||
          !body.swarm ||
          !body.member ||
          !body.by ||
          !body.host ||
          !body.approvals ||
          typeof body.proposedDepth !== "number" ||
          typeof body.currentSwarmMembers !== "number" ||
          typeof body.fleetCeiling !== "object" ||
          body.fleetCeiling === null
        ) {
          sendJson(res, 400, { ok: false, error: "invalid_fleet_spawn" });
          return;
        }
        const result = gateFleetSpawn(deps.openFleetLedger, {
          fleet: body.fleet,
          swarm: body.swarm,
          member: body.member,
          by: body.by,
          host: body.host,
          approvals: body.approvals,
          proposedDepth: body.proposedDepth,
          currentSwarmMembers: body.currentSwarmMembers,
          fleetCeiling: body.fleetCeiling,
          swarmCeiling: body.swarmCeiling,
          spendSoFar: body.spendSoFar,
          proposedSpend: body.proposedSpend,
        });
        if (!result.ok) {
          sendJson(res, 403, {
            ok: false,
            error: "ceiling_refuse",
            reason: result.reason,
            detail: result.detail,
            ledgerEvent: result.ledgerEvent,
            effectiveCeiling: result.effectiveCeiling,
          });
          return;
        }
        sendJson(res, 200, {
          ok: true,
          effectiveCeiling: result.effectiveCeiling,
          note: "spawn_allowed; caller writes member record + member.start",
        });
        return;
      }

      if (req.method === "GET" && url.pathname === "/fleet/ledger") {
        const fleet = url.searchParams.get("fleet") ?? "";
        if (!fleet) {
          sendJson(res, 400, { ok: false, error: "fleet_required" });
          return;
        }
        const events = deps.openFleetLedger.list(fleet);
        sendJson(res, 200, {
          ok: true,
          fleet,
          events,
          ceilingRefuses: deps.openFleetLedger.listCeilingRefuses(fleet),
        });
        return;
      }

      // PBI-011 — evaluate accept eligibility for exact SHA (no Port mutation).
      if (req.method === "POST" && url.pathname === "/accept/evaluate") {
        if (!applyRateLimit(deps, req, res, url.pathname)) return;
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
        if (!applyRateLimit(deps, req, res, url.pathname)) return;
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

      // Meta Port self-service handlers (NEEDS HANDLER → WEBHOOK).
      // Auth: Port classic HMAC (preferred) OR Bearer FACTORY_GATEWAY_HANDLER_TOKEN.
      if (req.method === "POST" && url.pathname === "/handlers/self-service") {
        if (!applyRateLimit(deps, req, res, url.pathname)) return;

        const rawBody = await readRawBody(req);
        const signature = String(req.headers["x-port-signature"] ?? "");
        const timestamp = String(req.headers["x-port-timestamp"] ?? "");
        const authorization = String(req.headers.authorization ?? "");

        const hmacOk = verifyPortWebhookHmac({
          secret: deps.secret,
          rawBody,
          headers: { signature, timestamp },
        });
        const bearerOk = verifyHandlerBearer({
          expectedToken: deps.handlerToken,
          authorizationHeader: authorization,
        });
        if (!hmacOk && !bearerOk) {
          sendJson(res, 401, { ok: false, error: "unauthorized_handler" });
          return;
        }

        let body: SelfServiceRequest;
        try {
          body = JSON.parse(rawBody) as SelfServiceRequest;
        } catch {
          sendJson(res, 400, { ok: false, error: "invalid_json" });
          return;
        }

        try {
          const result = await dispatchSelfService(body, {
            convex: deps.convex,
            writer: deps.writer,
            allowMissingCredentials: true,
          });
          const status = result.ok
            ? 200
            : result.error === "product_lane_stub"
              ? 501
              : result.error === "missing_credentials"
                ? 503
                : result.error === "unknown_self_service_action"
                  ? 404
                  : 400;
          sendJson(res, status, result);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          sendJson(res, 502, {
            ok: false,
            action: body.action,
            error: "handler_upstream_failed",
            detail: message,
          });
        }
        return;
      }

      if (req.method === "POST" && url.pathname === "/catalog/claim-next") {
        if (!applyRateLimit(deps, req, res, url.pathname)) return;
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
    openFleetLedger: buildOpenFleetLedger(env),
    rateLimiter: new SlidingWindowRateLimiter(rateLimitConfigFromEnv(env)),
    handlerToken: env.FACTORY_GATEWAY_HANDLER_TOKEN ?? "",
    convex: convexClientFromEnv(env),
  };
}
