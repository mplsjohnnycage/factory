import type { SupervisorAdmit } from "./types.js";

/**
 * Typed-enough Supervisor admit over Rivet's documented HTTP queue API
 * (https://rivet.dev/docs/api/gateway/queue/). Stdlib fetch only: the gateway
 * image has no runtime npm deps.
 *
 * RIVET_ENDPOINT = `https://<namespace>:<token>@<host>/` (secret; never logged).
 */
export type RivetTarget = { base: string; namespace: string; token: string };

export function parseRivetEndpoint(raw: string): RivetTarget {
  const u = new URL(raw);
  const namespace = decodeURIComponent(u.username);
  const token = decodeURIComponent(u.password);
  if (!namespace || !token) {
    throw new Error("RIVET_ENDPOINT must be https://<namespace>:<token>@<host>/");
  }
  return { base: `${u.protocol}//${u.host}`, namespace, token };
}

export type AdmitForwarder = (admit: SupervisorAdmit) => Promise<void>;

export function createRivetAdmitForwarder(opts: {
  endpoint: string;
  /** Actor key; the Meta lane uses "meta" (admit-entry default projectId). */
  key?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}): AdmitForwarder {
  const target = parseRivetEndpoint(opts.endpoint);
  const key = opts.key ?? "meta";
  const timeout = opts.timeoutMs ?? 10_000;
  const doFetch = opts.fetchImpl ?? fetch;
  const qs = new URLSearchParams({
    "rvt-namespace": target.namespace,
    "rvt-method": "getOrCreate",
    "rvt-key": key,
    "rvt-pool": "default",
  });
  const url = `${target.base}/gateway/projectSupervisor/queue/admitFromPayload?${qs}`;

  return async (admit) => {
    const res = await doFetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-rivet-token": target.token },
      body: JSON.stringify({ body: admit, wait: true, timeout }),
    });
    if (!res.ok) {
      throw new Error(`ProjectSupervisor admit failed: HTTP ${res.status}`);
    }
    const out = (await res.json()) as { status?: string; response?: { ok?: boolean; reason?: string } };
    if (out.status !== "completed") {
      throw new Error(`ProjectSupervisor admit ${out.status ?? "no_status"}`);
    }
    if (out.response && out.response.ok === false) {
      throw new Error(`ProjectSupervisor refused admit: ${out.response.reason ?? "unknown"}`);
    }
  };
}
