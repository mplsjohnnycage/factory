import { MemoryCatalogStore } from "./memory-store.js";
import type { CatalogStore } from "./types.js";
import {
  WorkflowCatalogStore,
  fetchCatalogWorkflowTransport,
} from "./workflow-store.js";

export type CatalogStoreKind = "memory" | "workflow";

/**
 * Catalog store selection (§4.2.1 writer backend).
 *
 * - `FACTORY_CATALOG_STORE` unset or `memory` (default): in-process
 *   MemoryCatalogStore — tests / local dry-runs. This is the safe default:
 *   no behavior change unless the workflow store is explicitly configured.
 * - `FACTORY_CATALOG_STORE=workflow`: WorkflowCatalogStore — applies land in
 *   Port via the `factory_*` workflow WEBHOOK round-trip (spec option (b);
 *   the gateway holds no Port REST credential). Requires
 *   `PORT_CATALOG_WORKFLOW_URL`.
 *
 * Misconfiguration fails closed at boot: an explicit `workflow` selection
 * without its round-trip URL throws instead of silently falling back to the
 * memory store (which would acknowledge writes Port never received).
 */
export function catalogStoreFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): CatalogStore {
  const raw = (env.FACTORY_CATALOG_STORE ?? "").trim().toLowerCase();
  const kind: CatalogStoreKind =
    raw === "" ? "memory" : (raw as CatalogStoreKind);

  if (kind === "memory") {
    return new MemoryCatalogStore();
  }

  if (kind === "workflow") {
    const url = (env.PORT_CATALOG_WORKFLOW_URL ?? "").trim();
    if (!url) {
      throw new Error(
        "FACTORY_CATALOG_STORE=workflow requires PORT_CATALOG_WORKFLOW_URL " +
          "(Port workflow catalog round-trip endpoint); refusing to start " +
          "with a store that cannot reach Port",
      );
    }
    return new WorkflowCatalogStore(fetchCatalogWorkflowTransport({ url }));
  }

  throw new Error(
    `unknown FACTORY_CATALOG_STORE value "${raw}" (expected "memory" or "workflow")`,
  );
}
