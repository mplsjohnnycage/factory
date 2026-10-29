import { buildDefaultDeps, createGatewayServer } from "./server.js";

export { verifyPortWebhookHmac, portJsonBody } from "./hmac.js";
export { CatalogWriter, claimNextJob } from "./catalog-writer.js";
export {
  META_FENCED_BLUEPRINTS,
  OCEAN_MIRROR_PREFIXES,
  classifyBlueprint,
  isMetaFencedBlueprint,
  isOceanMirrorBlueprint,
  listMetaFencedBlueprints,
} from "./meta-fences.js";
export {
  FACTORY_WORKFLOW_IDS,
  isFactoryWorkflowId,
  resolveFactoryActionIdentifier,
} from "./factory-workflows.js";
export type { FactoryWorkflowId } from "./factory-workflows.js";
export { MemoryCatalogStore, writerKey } from "./memory-store.js";
export { ProjectSupervisorQueue } from "./supervisor.js";
export { createGatewayServer, buildDefaultDeps } from "./server.js";
export { applySyncWrite, isSyncSource } from "./sync-ingress.js";
export {
  AcceptLedger,
  evaluateAcceptOnSha,
  isForbiddenAcceptActor,
  META_ALWAYS_REQUIRED_CHECKS,
} from "./accept-sha.js";
export {
  evaluateSpawnAgainstCeiling,
  mergeCeilingsNarrow,
  parseBudgetAmount,
} from "./openfleet-ceilings.js";
export {
  MemoryOpenFleetLedger,
  FileOpenFleetLedger,
  buildOpenFleetLedger,
  recordCeilingRefuse,
} from "./openfleet-ledger.js";
export { gateFleetSpawn } from "./fleet-spawn.js";
export {
  SlidingWindowRateLimiter,
  rateLimitConfigFromEnv,
  rateLimitKeyFromRequest,
} from "./rate-limit.js";
export type * from "./types.js";
export type {
  AcceptActor,
  AcceptRecord,
  AcceptEvaluateResult,
  CheckRunSummary,
} from "./accept-sha.js";
export type {
  OpenFleetCeiling,
  ApprovalsMode,
  CeilingRefuseReason,
  SpawnCeilingInput,
  SpawnCeilingResult,
} from "./openfleet-ceilings.js";
export type {
  OpenFleetLedger,
  OpenFleetLedgerEvent,
  CeilingRefuseEvent,
} from "./openfleet-ledger.js";
export type { FleetSpawnRequest, FleetSpawnResult } from "./fleet-spawn.js";
export type { RateLimitConfig, RateLimitResult } from "./rate-limit.js";
export type {
  BlueprintFenceClass,
  MetaFencedBlueprint,
} from "./meta-fences.js";
export type {
  SyncSource,
  SyncWriteRequest,
  SyncWriteResult,
} from "./sync-ingress.js";
export {
  dispatchSelfService,
  verifyHandlerBearer,
  convexClientFromEnv,
  META_SELF_SERVICE_ACTIONS,
  PRODUCT_SELF_SERVICE_STUBS,
} from "./self-service-handlers.js";
export {
  createConvexManagementClient,
  CONVEX_MANAGEMENT_BASE,
} from "./convex-management.js";
export type {
  SelfServiceRequest,
  SelfServiceResult,
  MetaSelfServiceAction,
} from "./self-service-handlers.js";
export type {
  ConvexManagementClient,
  CreateDeploymentInput,
} from "./convex-management.js";

const isMain =
  process.argv[1]?.endsWith("src/index.ts") ||
  process.argv[1]?.endsWith("dist/index.js");

if (isMain) {
  const host = process.env.GATEWAY_HOST ?? "0.0.0.0";
  const port = Number(process.env.GATEWAY_PORT ?? "8787");
  const deps = buildDefaultDeps();
  if (!deps.secret) {
    console.warn(
      "[factory-gateway] PORT_CLIENT_SECRET unset — webhook HMAC will reject all requests",
    );
  }
  const server = createGatewayServer(deps);
  server.listen(port, host, () => {
    console.log(`[factory-gateway] listening on http://${host}:${port}`);
  });
}
