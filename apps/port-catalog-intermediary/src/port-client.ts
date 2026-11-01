import type { PortEntity, PortRun } from "./types.js";

/**
 * Port API client — the ONLY place a Port API credential is used.
 *
 * Auth (Port docs): client-credentials exchange
 *   POST {base}/v1/auth/access_token  { clientId, clientSecret }
 *     → { accessToken, expiresIn }
 * then `Authorization: Bearer <accessToken>` on every call. The token is
 * cached in-process until shortly before expiry. Secrets arrive via the
 * constructor (from env in config.ts) and are never logged or returned.
 *
 * Endpoints used:
 *   Start run : POST {base}/v1/actions/{actionIdentifier}/runs
 *               body { properties: { ...inputs } } → 201 { id }
 *   Poll run  : GET  {base}/v1/actions/runs/{runId}
 *   Get entity: GET  {base}/v1/blueprints/{bp}/entities/{identifier}
 *   Upsert    : POST {base}/v1/blueprints/{bp}/entities?upsert=true&merge=true
 *
 * All HTTP goes through an injectable fetch so tests run fully offline.
 */
export interface PortApiClient {
  startRun(actionIdentifier: string, inputs: Record<string, unknown>): Promise<string>;
  getRun(runId: string): Promise<PortRun>;
  /** Resolves null on 404 (entity does not exist). */
  getEntity(blueprint: string, identifier: string): Promise<PortEntity | null>;
  upsertEntity(blueprint: string, entity: PortEntity): Promise<PortEntity>;
}

export type HttpPortApiClientOpts = {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  fetchImpl?: typeof fetch;
  /** Injectable clock for token-cache tests. */
  now?: () => number;
  /** Refresh the token this many ms before its stated expiry. */
  tokenRefreshSkewMs?: number;
};

type AccessTokenResponse = { accessToken?: unknown; expiresIn?: unknown };

function normalizeRun(raw: unknown): PortRun {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Port run response was not an object");
  }
  const r = raw as Record<string, unknown>;
  // Port wraps some responses as { run: {...} } / { ok, run } — unwrap.
  const inner =
    typeof r.run === "object" && r.run !== null ? (r.run as Record<string, unknown>) : r;
  const id = inner.id ?? inner.runId;
  if (typeof id !== "string" || !id) throw new Error("Port run response carried no run id");
  const status = typeof inner.status === "string" ? inner.status : "UNKNOWN";
  const output =
    typeof inner.output === "object" && inner.output !== null
      ? (inner.output as Record<string, unknown>)
      : null;
  const properties =
    typeof inner.properties === "object" && inner.properties !== null
      ? (inner.properties as Record<string, unknown>)
      : null;
  return { id, status, output, properties };
}

export class HttpPortApiClient implements PortApiClient {
  readonly #baseUrl: string;
  readonly #clientId: string;
  readonly #clientSecret: string;
  readonly #fetch: typeof fetch;
  readonly #now: () => number;
  readonly #skewMs: number;
  #token: { value: string; expiresAtMs: number } | null = null;

  constructor(opts: HttpPortApiClientOpts) {
    this.#baseUrl = opts.baseUrl.replace(/\/+$/, "");
    this.#clientId = opts.clientId;
    this.#clientSecret = opts.clientSecret;
    this.#fetch = opts.fetchImpl ?? fetch;
    this.#now = opts.now ?? Date.now;
    this.#skewMs = opts.tokenRefreshSkewMs ?? 30_000;
  }

  async #accessToken(): Promise<string> {
    if (this.#token && this.#now() < this.#token.expiresAtMs - this.#skewMs) {
      return this.#token.value;
    }
    const res = await this.#fetch(`${this.#baseUrl}/v1/auth/access_token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ clientId: this.#clientId, clientSecret: this.#clientSecret }),
    });
    if (!res.ok) {
      throw new Error(`Port auth failed: HTTP ${res.status} (credential rejected or API down)`);
    }
    const body = (await res.json()) as AccessTokenResponse;
    if (typeof body.accessToken !== "string" || !body.accessToken) {
      throw new Error("Port auth response carried no accessToken");
    }
    const expiresInSec = typeof body.expiresIn === "number" ? body.expiresIn : 3600;
    this.#token = { value: body.accessToken, expiresAtMs: this.#now() + expiresInSec * 1000 };
    return this.#token.value;
  }

  async #call(path: string, init: RequestInit): Promise<Response> {
    const token = await this.#accessToken();
    return this.#fetch(`${this.#baseUrl}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(init.headers ?? {}),
        authorization: `Bearer ${token}`,
      },
    });
  }

  async startRun(actionIdentifier: string, inputs: Record<string, unknown>): Promise<string> {
    const res = await this.#call(
      `/v1/actions/${encodeURIComponent(actionIdentifier)}/runs`,
      { method: "POST", body: JSON.stringify({ properties: inputs }) },
    );
    if (!res.ok) {
      throw new Error(`Port startRun(${actionIdentifier}) failed: HTTP ${res.status}`);
    }
    const run = normalizeRun(await res.json());
    return run.id;
  }

  async getRun(runId: string): Promise<PortRun> {
    const res = await this.#call(`/v1/actions/runs/${encodeURIComponent(runId)}`, {
      method: "GET",
    });
    if (!res.ok) throw new Error(`Port getRun(${runId}) failed: HTTP ${res.status}`);
    return normalizeRun(await res.json());
  }

  async getEntity(blueprint: string, identifier: string): Promise<PortEntity | null> {
    const res = await this.#call(
      `/v1/blueprints/${encodeURIComponent(blueprint)}/entities/${encodeURIComponent(identifier)}`,
      { method: "GET" },
    );
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`Port getEntity(${blueprint}/${identifier}) failed: HTTP ${res.status}`);
    }
    const body = (await res.json()) as { entity?: PortEntity } | PortEntity;
    const entity = (body as { entity?: PortEntity }).entity ?? (body as PortEntity);
    if (!entity || typeof entity.identifier !== "string") {
      throw new Error(`Port getEntity(${blueprint}/${identifier}) returned a malformed entity`);
    }
    return entity;
  }

  async upsertEntity(blueprint: string, entity: PortEntity): Promise<PortEntity> {
    const res = await this.#call(
      `/v1/blueprints/${encodeURIComponent(blueprint)}/entities?upsert=true&merge=true&create_missing_related_entities=false`,
      {
        method: "POST",
        body: JSON.stringify({
          identifier: entity.identifier,
          ...(entity.title ? { title: entity.title } : {}),
          properties: entity.properties ?? {},
        }),
      },
    );
    if (!res.ok) {
      throw new Error(`Port upsertEntity(${blueprint}/${entity.identifier}) failed: HTTP ${res.status}`);
    }
    const body = (await res.json()) as { entity?: PortEntity } | PortEntity;
    return (body as { entity?: PortEntity }).entity ?? (body as PortEntity);
  }
}
