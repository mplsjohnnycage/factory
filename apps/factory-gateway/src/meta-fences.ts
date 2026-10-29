/**
 * Meta catalog fences (§4.2.1 / port-governance).
 *
 * Factory-governed blueprints are Meta-fenced: every create/update must enter
 * the gateway CatalogWriter. Port Ocean native sync and raw Port MCP entity
 * upserts must not dual-write these blueprints.
 *
 * Ocean mirror blueprints (GitHub / Linear / Vercel / Convex Context Lake
 * mirrors) may continue to land via Port Ocean; they are not Meta-fenced.
 * Fail closed: unknown blueprints are treated as Meta-fenced.
 */

/** Live Factory-governed blueprints from specs/port-governance (do not invent names). */
export const META_FENCED_BLUEPRINTS = [
  "product",
  "service",
  "executionContract",
  "deliveryRun",
  "executionAttempt",
  "executionRunner",
  "bot",
  "_mcp_server",
  "agentPlugin",
  "skill",
  "harness_session",
] as const;

export type MetaFencedBlueprint = (typeof META_FENCED_BLUEPRINTS)[number];

/**
 * Port Ocean / Context Lake mirror blueprints (observed installs:
 * github-ocean, factory-pilot-github, linear, vercel-ocean, convex-ocean).
 * Prefix match keeps org-defined github-, linear-, vercel-, convex- mirrors
 * out of the Meta fence without listing every Port kind.
 */
export const OCEAN_MIRROR_PREFIXES = [
  "github",
  "linear",
  "vercel",
  "convex",
] as const;

export type BlueprintFenceClass = "meta_fenced" | "ocean_mirror";

const META_FENCED_SET = new Set<string>(META_FENCED_BLUEPRINTS);

export function isMetaFencedBlueprint(blueprint: string): boolean {
  return classifyBlueprint(blueprint) === "meta_fenced";
}

export function isOceanMirrorBlueprint(blueprint: string): boolean {
  return classifyBlueprint(blueprint) === "ocean_mirror";
}

/**
 * Classify a Port blueprint for write fencing.
 * Unknown identifiers fail closed into Meta-fenced (must use CatalogWriter).
 */
export function classifyBlueprint(blueprint: string): BlueprintFenceClass {
  const id = blueprint.trim();
  if (!id) return "meta_fenced";
  if (META_FENCED_SET.has(id)) return "meta_fenced";

  const lower = id.toLowerCase();
  for (const prefix of OCEAN_MIRROR_PREFIXES) {
    if (lower === prefix || lower.startsWith(prefix)) {
      return "ocean_mirror";
    }
  }
  return "meta_fenced";
}

export function listMetaFencedBlueprints(): readonly string[] {
  return META_FENCED_BLUEPRINTS;
}
