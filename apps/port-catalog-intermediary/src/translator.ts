import type { PortApiClient } from "./port-client.js";
import {
  catalogToPortEntity,
  isCatalogEntity,
  portEntityToCatalog,
  type CatalogEnvelope,
  type CatalogEntity,
  type PortEntity,
  type PortRun,
} from "./types.js";

/**
 * The translator core (option (a), owner-queue item 14).
 *
 * Why this exists: Port workflows have NO inbound HTTP trigger and NO
 * synchronous return node (live-verified 2026-10-31), so the URL the
 * gateway's WorkflowCatalogStore POSTs to cannot be a Port workflow. This
 * process IS that URL. It holds the only Port API credential, performs the
 * operation against Port, and answers synchronously in the exact JSON the
 * gateway expects:
 *
 *   catalog_read   → { entity: CatalogEntity | null }
 *   catalog_upsert → { ok: true }
 *
 * Two execution modes:
 *  - "workflow" (spec-faithful, default): each operation starts the
 *    configured Port workflow/action run with the Port API credential,
 *    polls the run to a terminal status, and extracts the result. Reads
 *    expect the read workflow to surface the entity in its run output
 *    (`output.entity`, `output.result.entity`, or `properties.entity`);
 *    if the output instead carries `output.entityIdentifier`, the entity
 *    is fetched through the entity API as a fallback.
 *  - "entity": the intermediary performs the read/upsert directly against
 *    the Port entity API. Pragmatic fallback if Port-side catalog
 *    workflows are never defined; the gateway contract is identical.
 *
 * Failure semantics mirror the gateway's: anything that is not a clean
 * success throws — the HTTP layer answers non-2xx and the gateway fails
 * closed (records nothing, caller re-reads and retries per §4.2.1).
 *
 * Timing: the gateway's round-trip timeout is 10s
 * (DEFAULT_WORKFLOW_ROUND_TRIP_TIMEOUT_MS in workflow-store.ts), so the
 * default poll deadline is 9s. Raise INTERMEDIARY_RUN_DEADLINE_MS only
 * together with a gateway timeout bump (follow-up PR, noted in README).
 */

export type TranslatorMode = "workflow" | "entity";

export type TranslatorOpts = {
  client: PortApiClient;
  mode: TranslatorMode;
  /** Required in workflow mode. */
  readWorkflowId?: string;
  upsertWorkflowId?: string;
  pollIntervalMs?: number;
  runDeadlineMs?: number;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
};

const SUCCESS_STATUSES = new Set(["completed", "complete", "success", "succeeded", "successful"]);
const FAILURE_STATUSES = new Set(["failed", "failure", "error", "cancelled", "canceled", "terminated", "failure_timeout"]);

export const DEFAULT_POLL_INTERVAL_MS = 500;
export const DEFAULT_RUN_DEADLINE_MS = 9_000;

function extractEntity(run: PortRun): PortEntity | CatalogEntity | null | undefined {
  const bags: Array<Record<string, unknown> | null | undefined> = [
    run.output,
    run.output?.result as Record<string, unknown> | undefined,
    run.properties,
  ];
  for (const bag of bags) {
    if (!bag) continue;
    const candidate = bag.entity;
    if (candidate === null) return null;
    if (typeof candidate === "object" && candidate !== undefined) {
      return candidate as PortEntity | CatalogEntity;
    }
  }
  return undefined;
}

function extractedIdentifier(run: PortRun): string | null {
  const id = run.output?.entityIdentifier ?? run.properties?.entityIdentifier;
  return typeof id === "string" ? id : null;
}

function toCatalog(blueprint: string, raw: PortEntity | CatalogEntity): CatalogEntity {
  if (isCatalogEntity(raw)) {
    return { ...raw, properties: { ...raw.properties } };
  }
  return portEntityToCatalog(blueprint, raw);
}

export class CatalogTranslator {
  readonly #client: PortApiClient;
  readonly #mode: TranslatorMode;
  readonly #readWorkflowId?: string;
  readonly #upsertWorkflowId?: string;
  readonly #pollIntervalMs: number;
  readonly #runDeadlineMs: number;
  readonly #sleep: (ms: number) => Promise<void>;
  readonly #now: () => number;

  constructor(opts: TranslatorOpts) {
    if (opts.mode === "workflow" && (!opts.readWorkflowId || !opts.upsertWorkflowId)) {
      throw new Error(
        "workflow mode requires PORT_CATALOG_READ_WORKFLOW_ID and PORT_CATALOG_UPSERT_WORKFLOW_ID",
      );
    }
    this.#client = opts.client;
    this.#mode = opts.mode;
    this.#readWorkflowId = opts.readWorkflowId;
    this.#upsertWorkflowId = opts.upsertWorkflowId;
    this.#pollIntervalMs = opts.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
    this.#runDeadlineMs = opts.runDeadlineMs ?? DEFAULT_RUN_DEADLINE_MS;
    this.#sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
    this.#now = opts.now ?? Date.now;
  }

  async handle(envelope: CatalogEnvelope): Promise<{ entity: CatalogEntity | null } | { ok: true }> {
    return envelope.kind === "catalog_read"
      ? { entity: await this.#read(envelope.blueprint, envelope.entityIdentifier) }
      : (await this.#upsert(envelope.entity), { ok: true as const });
  }

  async #pollRun(runId: string, kind: string): Promise<PortRun> {
    const deadline = this.#now() + this.#runDeadlineMs;
    for (;;) {
      const run = await this.#client.getRun(runId);
      const status = run.status.trim().toLowerCase();
      if (SUCCESS_STATUSES.has(status)) return run;
      if (FAILURE_STATUSES.has(status)) {
        throw new Error(`Port workflow run for ${kind} ended in status "${run.status}" (run ${runId})`);
      }
      if (this.#now() >= deadline) {
        throw new Error(
          `Port workflow run for ${kind} did not complete within ${this.#runDeadlineMs}ms (run ${runId}, last status "${run.status}")`,
        );
      }
      await this.#sleep(this.#pollIntervalMs);
    }
  }

  async #read(blueprint: string, entityIdentifier: string): Promise<CatalogEntity | null> {
    if (this.#mode === "entity") {
      const entity = await this.#client.getEntity(blueprint, entityIdentifier);
      return entity ? portEntityToCatalog(blueprint, entity) : null;
    }
    const runId = await this.#client.startRun(this.#readWorkflowId!, {
      blueprint,
      entityIdentifier,
    });
    const run = await this.#pollRun(runId, "catalog_read");
    const found = extractEntity(run);
    if (found === null) return null;
    if (found !== undefined) return toCatalog(blueprint, found);
    // Fallback: the run named the entity but did not inline it — fetch it.
    const identifier = extractedIdentifier(run) ?? entityIdentifier;
    const entity = await this.#client.getEntity(blueprint, identifier);
    return entity ? portEntityToCatalog(blueprint, entity) : null;
  }

  async #upsert(entity: CatalogEntity): Promise<void> {
    if (this.#mode === "entity") {
      await this.#client.upsertEntity(entity.blueprint, catalogToPortEntity(entity));
      return;
    }
    const runId = await this.#client.startRun(this.#upsertWorkflowId!, {
      blueprint: entity.blueprint,
      entityIdentifier: entity.entityIdentifier,
      catalogVersion: entity.catalogVersion,
      properties: { ...entity.properties, catalogVersion: entity.catalogVersion },
    });
    await this.#pollRun(runId, "catalog_upsert");
  }
}
