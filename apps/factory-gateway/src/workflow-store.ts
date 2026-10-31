import type { CatalogEntity, CatalogStore } from "./types.js";

/**
 * Workflow-backed §4.2.1 catalog store (Johnny decision 2026-10-30: "go with
 * the spec" — owner-queue item 9 resolved to option (b)).
 *
 * Spec mechanics (factory-master-spec §§4.1/4.2.1, ADR-003;
 * port-factory-data-model §4.1): the CatalogWriter inside this gateway is the
 * single-writer fence; the Port entity upsert itself is performed by the Port
 * workflow path — the `factory_*` workflows' WEBHOOK round-trip — NOT by a
 * direct Port REST client. This gateway therefore holds **no Port REST API
 * credential** and never dual-writes Port.
 *
 * Wire (smallest choice where the spec is silent — see PR body assumptions):
 * the store POSTs one JSON envelope per operation to a single configured
 * round-trip URL (`PORT_CATALOG_WORKFLOW_URL`):
 *
 *   { kind: "catalog_read", blueprint, entityIdentifier }
 *     → 200 { entity: CatalogEntity | null }
 *   { kind: "catalog_upsert", entity: CatalogEntity }
 *     → 200 { ok: true }   (the workflow's UPSERT_ENTITY node applies it)
 *
 * Reads round-trip too: the writer must load the current entity inside the
 * fence (spec write protocol step "load current entity"), and the workflow
 * side is the only Port reader available to a credential-free gateway (the
 * live workflows already fetch current entities via their fencing nodes).
 *
 * Every failure (non-2xx, malformed body, timeout) throws — fail closed.
 * A failed apply records nothing gateway-side; the caller re-reads, rebuilds
 * the patch with a fresh `expectedCatalogVersion`, and re-enqueues
 * (§4.2.1 retry rule).
 */

export type CatalogWorkflowReadEnvelope = {
  kind: "catalog_read";
  blueprint: string;
  entityIdentifier: string;
};

export type CatalogWorkflowUpsertEnvelope = {
  kind: "catalog_upsert";
  entity: CatalogEntity;
};

export type CatalogWorkflowEnvelope =
  | CatalogWorkflowReadEnvelope
  | CatalogWorkflowUpsertEnvelope;

/**
 * Transport seam for the Port workflow round-trip. Tests inject a mock;
 * production uses {@link fetchCatalogWorkflowTransport}.
 */
export type CatalogWorkflowTransport = {
  read(args: {
    blueprint: string;
    entityIdentifier: string;
  }): Promise<CatalogEntity | null>;
  upsert(entity: CatalogEntity): Promise<void>;
};

/** Port sync WEBHOOK nodes wait ≤ 10s in-band (port-factory-data-model §3). */
export const DEFAULT_WORKFLOW_ROUND_TRIP_TIMEOUT_MS = 10_000;

function isCatalogEntity(value: unknown): value is CatalogEntity {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.blueprint === "string" &&
    typeof v.entityIdentifier === "string" &&
    typeof v.catalogVersion === "number" &&
    typeof v.properties === "object" &&
    v.properties !== null
  );
}

function cloneEntity(entity: CatalogEntity): CatalogEntity {
  return { ...entity, properties: { ...entity.properties } };
}

export function fetchCatalogWorkflowTransport(opts: {
  url: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): CatalogWorkflowTransport {
  const fetchImpl = opts.fetchImpl ?? fetch;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_WORKFLOW_ROUND_TRIP_TIMEOUT_MS;

  async function roundTrip(envelope: CatalogWorkflowEnvelope): Promise<unknown> {
    let res: Response;
    try {
      res = await fetchImpl(opts.url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(envelope),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `catalog workflow round-trip failed (${envelope.kind}): ${message}`,
      );
    }
    if (!res.ok) {
      throw new Error(
        `catalog workflow round-trip failed (${envelope.kind}): HTTP ${res.status}`,
      );
    }
    try {
      return (await res.json()) as unknown;
    } catch {
      throw new Error(
        `catalog workflow round-trip failed (${envelope.kind}): invalid JSON response`,
      );
    }
  }

  return {
    async read({ blueprint, entityIdentifier }) {
      const body = await roundTrip({
        kind: "catalog_read",
        blueprint,
        entityIdentifier,
      });
      // Absence is only ever an explicit `entity: null`; any other shape
      // (`{}`, `{ error }`) is a malformed envelope and must fail closed.
      if (
        typeof body !== "object" ||
        body === null ||
        !("entity" in body)
      ) {
        throw new Error(
          "catalog workflow round-trip failed (catalog_read): response missing entity field",
        );
      }
      const entity = (body as { entity: unknown }).entity;
      if (entity === null) return null;
      if (!isCatalogEntity(entity)) {
        throw new Error(
          "catalog workflow round-trip failed (catalog_read): malformed entity in response",
        );
      }
      return cloneEntity(entity);
    },

    async upsert(entity) {
      const body = await roundTrip({ kind: "catalog_upsert", entity });
      if ((body as { ok?: unknown } | null)?.ok !== true) {
        throw new Error(
          "catalog workflow round-trip failed (catalog_upsert): workflow did not ack the upsert",
        );
      }
    },
  };
}

/**
 * After an upsert fails with an unknown outcome (timeout, network error, 5xx,
 * missing ack) the workflow may still apply it late. Aborting the HTTP request
 * does not cancel the workflow's Port write, so the record stays quarantined
 * for this long before the gateway will fence another write against it.
 */
export const DEFAULT_AMBIGUOUS_UPSERT_HOLD_MS = 60_000;

/**
 * CatalogStore whose persistence is the Port workflow round-trip.
 * Holds no entity bytes of its own — Port remains the system of record.
 *
 * The only gateway-side state is a quarantine of records whose last upsert
 * had an ambiguous outcome: reads and writes for that record fail closed
 * until the upsert is reconciled (a read shows it applied) or the hold
 * expires, so a late workflow write cannot land under a newer version.
 */
export class WorkflowCatalogStore implements CatalogStore {
  readonly #transport: CatalogWorkflowTransport;
  readonly #holdMs: number;
  readonly #now: () => number;
  readonly #pending = new Map<
    string,
    { catalogVersion: number; until: number }
  >();

  constructor(
    transport: CatalogWorkflowTransport,
    opts: { ambiguousHoldMs?: number; now?: () => number } = {},
  ) {
    this.#transport = transport;
    this.#holdMs = opts.ambiguousHoldMs ?? DEFAULT_AMBIGUOUS_UPSERT_HOLD_MS;
    this.#now = opts.now ?? Date.now;
  }

  #assertNotQuarantined(key: string): void {
    const hold = this.#pending.get(key);
    if (!hold) return;
    if (this.#now() >= hold.until) return;
    throw new Error(
      `catalog record ${key} quarantined: previous upsert outcome unknown; retry after reconciliation`,
    );
  }

  async get(
    blueprint: string,
    entityIdentifier: string,
  ): Promise<CatalogEntity | null> {
    const key = `${blueprint}:${entityIdentifier}`;
    const hold = this.#pending.get(key);
    const found = await this.#transport.read({ blueprint, entityIdentifier });
    if (hold) {
      if (found && found.catalogVersion >= hold.catalogVersion) {
        // The ambiguous upsert is definitively visible: reconciled.
        this.#pending.delete(key);
      } else {
        this.#assertNotQuarantined(key);
        this.#pending.delete(key);
      }
    }
    return found;
  }

  async put(entity: CatalogEntity): Promise<void> {
    const key = `${entity.blueprint}:${entity.entityIdentifier}`;
    this.#assertNotQuarantined(key);
    try {
      await this.#transport.upsert(cloneEntity(entity));
    } catch (err) {
      this.#pending.set(key, {
        catalogVersion: entity.catalogVersion,
        until: this.#now() + this.#holdMs,
      });
      throw err;
    }
  }
}
