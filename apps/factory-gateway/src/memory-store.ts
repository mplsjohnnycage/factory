import type { CatalogEntity, CatalogStore, WriterKey } from "./types.js";

export function writerKey(blueprint: string, entityIdentifier: string): WriterKey {
  return `${blueprint}:${entityIdentifier}`;
}

/** In-process Port catalog stand-in for unit tests and local dry-runs (no dual-write). */
export class MemoryCatalogStore implements CatalogStore {
  readonly #entities = new Map<WriterKey, CatalogEntity>();

  async get(blueprint: string, entityIdentifier: string): Promise<CatalogEntity | null> {
    return this.#entities.get(writerKey(blueprint, entityIdentifier)) ?? null;
  }

  async put(entity: CatalogEntity): Promise<void> {
    this.#entities.set(writerKey(entity.blueprint, entity.entityIdentifier), {
      ...entity,
      properties: { ...entity.properties },
    });
  }

  snapshot(): CatalogEntity[] {
    return [...this.#entities.values()].map((e) => ({
      ...e,
      properties: { ...e.properties },
    }));
  }
}
