import type { CatalogWriterPort, WorkAttempt } from "./types.js";

/**
 * Map Rivet WorkAttempt lifecycle onto live Port blueprints
 * (executionContract / deliveryRun / executionAttempt) via §4.2.1 writer only.
 *
 * Does not invent parallel blueprint names. Does not dual-write Port.
 */
export class PortProjectionMapper {
  readonly #writer: CatalogWriterPort;

  constructor(writer: CatalogWriterPort) {
    this.#writer = writer;
  }

  /** Upsert the three Port projections for an admitted (or recovered) attempt. */
  async projectAttempt(attempt: WorkAttempt): Promise<void> {
    await this.#upsert("executionContract", attempt.executionContractId, 0, {
      projectId: attempt.projectId,
      taskId: attempt.taskId,
      workKey: attempt.workKey,
      beadId: attempt.beadId,
      status: "active",
      portBypassId: attempt.portBypassId,
    });

    await this.#upsert("deliveryRun", attempt.deliveryRunId, 0, {
      projectId: attempt.projectId,
      executionContractId: attempt.executionContractId,
      workAttemptId: attempt.workAttemptId,
      beadId: attempt.beadId,
      status: attempt.status,
    });

    await this.#upsert("executionAttempt", attempt.executionAttemptId, 0, {
      projectId: attempt.projectId,
      deliveryRunId: attempt.deliveryRunId,
      executionContractId: attempt.executionContractId,
      workAttemptId: attempt.workAttemptId,
      beadId: attempt.beadId,
      taskId: attempt.taskId,
      workKey: attempt.workKey,
      status: attempt.status,
      duplicateOf: attempt.duplicateOf,
    });
  }

  async #upsert(
    blueprint: string,
    entityIdentifier: string,
    expectedCatalogVersion: number,
    patch: Record<string, unknown>,
  ): Promise<void> {
    const first = await this.#writer.apply({
      blueprint,
      entityIdentifier,
      expectedCatalogVersion,
      patch,
    });
    if (first.ok) return;

    // Idempotent re-project after recover: bump from current version.
    if (first.reason === "stale_catalog_version") {
      const retry = await this.#writer.apply({
        blueprint,
        entityIdentifier,
        expectedCatalogVersion: first.currentVersion,
        patch,
      });
      if (!retry.ok) {
        throw new Error(
          `Port projection stale after retry: ${blueprint}:${entityIdentifier}`,
        );
      }
    }
  }
}
