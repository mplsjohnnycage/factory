/**
 * Wire types for the catalog round-trip.
 *
 * Gateway side (must stay byte-compatible with
 * `apps/factory-gateway/src/workflow-store.ts` — the gateway is NOT modified
 * by this package):
 *
 *   { kind: "catalog_read", blueprint, entityIdentifier }
 *     → 200 { entity: CatalogEntity | null }
 *   { kind: "catalog_upsert", entity: CatalogEntity }
 *     → 200 { ok: true }
 *
 * Declared locally on purpose: this is a separate process/package, coupled
 * to the gateway only by this HTTP contract.
 */
export type CatalogEntity = {
  blueprint: string;
  entityIdentifier: string;
  catalogVersion: number;
  properties: Record<string, unknown>;
};

export type CatalogReadEnvelope = {
  kind: "catalog_read";
  blueprint: string;
  entityIdentifier: string;
};

export type CatalogUpsertEnvelope = {
  kind: "catalog_upsert";
  entity: CatalogEntity;
};

export type CatalogEnvelope = CatalogReadEnvelope | CatalogUpsertEnvelope;

/** Raw Port entity shape (Port entity API / workflow run outputs). */
export type PortEntity = {
  identifier: string;
  blueprint?: string;
  title?: string;
  properties?: Record<string, unknown>;
  relations?: Record<string, unknown>;
};

/** Port self-service / workflow run, normalized to what the translator needs. */
export type PortRun = {
  id: string;
  status: string;
  /** Run outputs, when the workflow surfaces them (shape is workflow-owned). */
  output?: Record<string, unknown> | null;
  properties?: Record<string, unknown> | null;
};

export function isCatalogEntity(value: unknown): value is CatalogEntity {
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

export function parseEnvelope(value: unknown): CatalogEnvelope {
  if (typeof value !== "object" || value === null) {
    throw new Error("catalog envelope must be a JSON object");
  }
  const v = value as Record<string, unknown>;
  if (v.kind === "catalog_read") {
    if (typeof v.blueprint !== "string" || typeof v.entityIdentifier !== "string") {
      throw new Error("catalog_read envelope requires blueprint + entityIdentifier strings");
    }
    return { kind: "catalog_read", blueprint: v.blueprint, entityIdentifier: v.entityIdentifier };
  }
  if (v.kind === "catalog_upsert") {
    if (!isCatalogEntity(v.entity)) {
      throw new Error("catalog_upsert envelope requires a valid CatalogEntity in `entity`");
    }
    return { kind: "catalog_upsert", entity: v.entity };
  }
  throw new Error(`unknown catalog envelope kind: ${String(v.kind)}`);
}

/** Map a Port entity to the gateway's CatalogEntity (catalogVersion lives in properties). */
export function portEntityToCatalog(blueprint: string, entity: PortEntity): CatalogEntity {
  const properties = { ...(entity.properties ?? {}) };
  const rawVersion = properties.catalogVersion;
  const catalogVersion = typeof rawVersion === "number" ? rawVersion : 0;
  return {
    blueprint: entity.blueprint ?? blueprint,
    entityIdentifier: entity.identifier,
    catalogVersion,
    properties,
  };
}

export function catalogToPortEntity(entity: CatalogEntity): PortEntity {
  return {
    identifier: entity.entityIdentifier,
    blueprint: entity.blueprint,
    properties: { ...entity.properties, catalogVersion: entity.catalogVersion },
  };
}
