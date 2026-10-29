import { writerKey } from "./memory-store.js";
import type {
  CatalogStore,
  CatalogWriteRequest,
  CatalogWriteResult,
  WriterKey,
} from "./types.js";

/**
 * §4.2.1 / port-factory-data-model §4.1 catalog writer.
 *
 * Single-flight per `{blueprint}:{entityIdentifier}`; reject when
 * `expectedCatalogVersion !==` stored `catalogVersion` (no partial apply).
 * Rivet never becomes catalog SoT — this writer is the only Port mutation path
 * from Factory services.
 */
export class CatalogWriter {
  readonly #store: CatalogStore;
  readonly #tails = new Map<WriterKey, Promise<unknown>>();

  constructor(store: CatalogStore) {
    this.#store = store;
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
      return await this.#applyUnlocked(request);
    } finally {
      release();
      if (this.#tails.get(key) === chain) this.#tails.delete(key);
    }
  }

  async #applyUnlocked(request: CatalogWriteRequest): Promise<CatalogWriteResult> {
    const current = await this.#store.get(request.blueprint, request.entityIdentifier);
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
    const entity = {
      blueprint: request.blueprint,
      entityIdentifier: request.entityIdentifier,
      catalogVersion: nextVersion,
      properties: {
        ...(current?.properties ?? {}),
        ...request.patch,
        catalogVersion: nextVersion,
      },
    };

    await this.#store.put(entity);
    return { ok: true, entity };
  }
}

/**
 * Claim-next path: lease fields mutate only inside the same apply that bumps
 * catalogVersion (factory_claim_next_job semantics).
 */
export async function claimNextJob(
  writer: CatalogWriter,
  args: {
    blueprint: string;
    entityIdentifier: string;
    expectedCatalogVersion: number;
    owner: string;
    leaseEpoch: number;
  },
): Promise<CatalogWriteResult> {
  return writer.apply({
    blueprint: args.blueprint,
    entityIdentifier: args.entityIdentifier,
    expectedCatalogVersion: args.expectedCatalogVersion,
    patch: {
      status: "claimed",
      owner: args.owner,
      leaseEpoch: args.leaseEpoch,
    },
  });
}
