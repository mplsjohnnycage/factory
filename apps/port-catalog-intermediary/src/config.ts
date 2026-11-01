import { HttpPortApiClient } from "./port-client.js";
import { CatalogTranslator, type TranslatorMode } from "./translator.js";

/**
 * Environment configuration (NAMES ONLY — values come from the host's
 * secret store at deploy time; never commit real values):
 *
 *   PORT_CLIENT_ID / PORT_CLIENT_SECRET   Port API credential. Held ONLY by
 *                                         this process — never by the gateway.
 *   PORT_API_BASE_URL                     default https://api.getport.io
 *   PORT_CATALOG_MODE                     "workflow" (default) | "entity"
 *   PORT_CATALOG_READ_WORKFLOW_ID         Port workflow/action id for reads
 *   PORT_CATALOG_UPSERT_WORKFLOW_ID       Port workflow/action id for upserts
 *   INTERMEDIARY_HOST                     default 127.0.0.1 (same-host deploy;
 *                                         the gateway reaches it over loopback
 *                                         or the tailnet — never public)
 *   INTERMEDIARY_PORT                     default 8788
 *   INTERMEDIARY_POLL_INTERVAL_MS         default 500
 *   INTERMEDIARY_RUN_DEADLINE_MS          default 9000 (must stay under the
 *                                         gateway's 10s round-trip timeout)
 *
 * Misconfiguration fails closed at boot, same rule as the gateway's
 * catalogStoreFromEnv: a translator that cannot reach Port must not start
 * and silently ack writes Port never received.
 */
export type IntermediaryConfig = {
  host: string;
  port: number;
  translator: CatalogTranslator;
};

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = (env[name] ?? "").trim();
  if (!value) {
    throw new Error(
      `${name} is required for the port-catalog-intermediary; refusing to start without it`,
    );
  }
  return value;
}

function intOr(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = (env[name] ?? "").trim();
  if (!raw) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${name} must be a positive number`);
  return n;
}

export function intermediaryFromEnv(env: NodeJS.ProcessEnv = process.env): IntermediaryConfig {
  const clientId = required(env, "PORT_CLIENT_ID");
  const clientSecret = required(env, "PORT_CLIENT_SECRET");
  const baseUrl = (env.PORT_API_BASE_URL ?? "").trim() || "https://api.getport.io";

  const modeRaw = (env.PORT_CATALOG_MODE ?? "").trim().toLowerCase() || "workflow";
  if (modeRaw !== "workflow" && modeRaw !== "entity") {
    throw new Error(`unknown PORT_CATALOG_MODE value "${modeRaw}" (expected "workflow" or "entity")`);
  }
  const mode: TranslatorMode = modeRaw;

  const client = new HttpPortApiClient({ baseUrl, clientId, clientSecret });
  const translator = new CatalogTranslator({
    client,
    mode,
    readWorkflowId:
      mode === "workflow" ? required(env, "PORT_CATALOG_READ_WORKFLOW_ID") : undefined,
    upsertWorkflowId:
      mode === "workflow" ? required(env, "PORT_CATALOG_UPSERT_WORKFLOW_ID") : undefined,
    pollIntervalMs: intOr(env, "INTERMEDIARY_POLL_INTERVAL_MS", 500),
    runDeadlineMs: intOr(env, "INTERMEDIARY_RUN_DEADLINE_MS", 9_000),
  });

  return {
    host: (env.INTERMEDIARY_HOST ?? "").trim() || "127.0.0.1",
    port: intOr(env, "INTERMEDIARY_PORT", 8788),
    translator,
  };
}
