import type {
  CatalogEntity,
  CatalogWriteRequest,
  CatalogWriteResult,
  CatalogWriterPort,
} from "./types.js";

type WriterKey = `${string}:${string}`;

function writerKey(blueprint: string, entityIdentifier: string): WriterKey {
  return `${blueprint}:${entityIdentifier}`;
}

/**
 * In-process §4.2.1-shaped catalog store for supervisor projection tests.
 * Live path uses apps/factory-gateway CatalogWriter — never dual-write Port here.
 */
export class MemoryCatalogWriter implements CatalogWriterPort {
  readonly #entities = new Map<WriterKey, CatalogEntity>();
  readonly #tails = new Map<WriterKey, Promise<unknown>>();

  snapshot(): CatalogEntity[] {
    return [...this.#entities.values()].map((e) => ({
      ...e,
      properties: { ...e.properties },
    }));
  }

  get(blueprint: string, entityIdentifier: string): CatalogEntity | null {
    return this.#entities.get(writerKey(blueprint, entityIdentifier)) ?? null;
  }

  async apply(request: CatalogWriteRequest): Promise<CatalogWriteResult> {
    const key = writerKey(request.blueprint, request.entityIdentifier);
    const prior = this.#tails.get(key) ?? Promise.resolve();
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const chain = prior.then(() => gate);
    this.#tails.set(key, chain.catch(() => undefined));

    try {
      await prior.catch(() => undefined);
      return this.#applyUnlocked(request);
    } finally {
      release();
      if (this.#tails.get(key) === chain) this.#tails.delete(key);
    }
  }

  #applyUnlocked(request: CatalogWriteRequest): CatalogWriteResult {
    const current = this.#entities.get(
      writerKey(request.blueprint, request.entityIdentifier),
    );
    const storedVersion = current?.catalogVersion ?? 0;
    if (request.expectedCatalogVersion !== storedVersion) {
      return {
        ok: false,
        reason: "stale_catalog_version",
        currentVersion: storedVersion,
        expectedCatalogVersion: request.expectedCatalogVersion,
      };
    }
    const nextVersion = request.expectedCatalogVersion + 1;
    const entity: CatalogEntity = {
      blueprint: request.blueprint,
      entityIdentifier: request.entityIdentifier,
      catalogVersion: nextVersion,
      properties: {
        ...(current?.properties ?? {}),
        ...request.patch,
        catalogVersion: nextVersion,
      },
    };
    this.#entities.set(writerKey(entity.blueprint, entity.entityIdentifier), entity);
    return { ok: true, entity };
  }
}
