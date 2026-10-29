import type { CatalogWriter } from "./catalog-writer.js";
import {
  classifyBlueprint,
  isMetaFencedBlueprint,
  type BlueprintFenceClass,
} from "./meta-fences.js";
import type { CatalogWriteRequest, CatalogWriteResult } from "./types.js";

/** Who proposed the catalog mutation. */
export type SyncSource = "ocean" | "mcp" | "workflow" | "rivet" | "gateway";

export type SyncWriteRequest = CatalogWriteRequest & {
  source: SyncSource;
  /**
   * Explicit dual-write / skip-writer flag. Always rejected for Meta-fenced
   * blueprints — Ocean/MCP cannot opt out of §4.2.1.
   */
  bypassFence?: boolean;
};

export type SyncWriteBypassForbidden = {
  ok: false;
  reason: "meta_fence_bypass_forbidden";
  blueprint: string;
  source: SyncSource;
  fenceClass: BlueprintFenceClass;
};

export type SyncWriteMirrorNotOwned = {
  ok: false;
  reason: "ocean_mirror_not_via_gateway";
  blueprint: string;
  source: SyncSource;
  fenceClass: "ocean_mirror";
  hint: string;
};

export type SyncWriteInvalidSource = {
  ok: false;
  reason: "invalid_sync_source";
};

export type SyncWriteResult =
  | CatalogWriteResult
  | SyncWriteBypassForbidden
  | SyncWriteMirrorNotOwned
  | SyncWriteInvalidSource;

const SYNC_SOURCES = new Set<SyncSource>([
  "ocean",
  "mcp",
  "workflow",
  "rivet",
  "gateway",
]);

export function isSyncSource(value: unknown): value is SyncSource {
  return typeof value === "string" && SYNC_SOURCES.has(value as SyncSource);
}

/**
 * Gate Ocean / MCP / workflow sync proposals before CatalogWriter apply.
 *
 * - Meta-fenced + bypassFence → reject (no Ocean/MCP dual-write escape hatch)
 * - Meta-fenced → always CatalogWriter.apply
 * - Ocean mirror + ocean|mcp → gateway does not own the write; Port Ocean may
 *   apply natively (not a Meta fence). Callers must not use this path to
 *   pretend they fenced a mirror write.
 * - Other sources on mirrors still go through CatalogWriter when explicitly asked
 */
export async function applySyncWrite(
  writer: CatalogWriter,
  request: SyncWriteRequest,
): Promise<SyncWriteResult> {
  if (!isSyncSource(request.source)) {
    return { ok: false, reason: "invalid_sync_source" };
  }

  const fenceClass = classifyBlueprint(request.blueprint);

  if (request.bypassFence === true && isMetaFencedBlueprint(request.blueprint)) {
    return {
      ok: false,
      reason: "meta_fence_bypass_forbidden",
      blueprint: request.blueprint,
      source: request.source,
      fenceClass,
    };
  }

  if (
    fenceClass === "ocean_mirror" &&
    (request.source === "ocean" || request.source === "mcp")
  ) {
    return {
      ok: false,
      reason: "ocean_mirror_not_via_gateway",
      blueprint: request.blueprint,
      source: request.source,
      fenceClass: "ocean_mirror",
      hint: "Ocean/MCP mirror blueprints sync via Port Ocean native path; Meta fence applies only to Factory-governed blueprints",
    };
  }

  // Meta-fenced (and non-ocean mirror sources): single-writer path only.
  return writer.apply({
    blueprint: request.blueprint,
    entityIdentifier: request.entityIdentifier,
    expectedCatalogVersion: request.expectedCatalogVersion,
    patch: request.patch,
  });
}
