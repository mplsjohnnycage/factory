/**
 * Atlas access role from the Port session (ADR-005: Port External Interface
 * OAuth, user token passthrough). The role is never taken from the request
 * body or query: `operator` only if Port accepts the caller's own access token.
 */

import {
  DEFAULT_PORT_API_BASE,
  SESSION_ACCESS_COOKIE,
  type EnvMap,
} from "@/lib/port-oauth";
import type { AtlasAccessRole } from "./types";

/** Port endpoint that returns the caller for a valid bearer token. */
export const PORT_WHOAMI_PATH = "/v1/users/me" as const;

export type PortFetch = typeof fetch;

export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      const value = part.slice(eq + 1).trim();
      try {
        return decodeURIComponent(value) || null;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/** GET a Port API path as the signed-in user (token passthrough, read-only). */
export async function portUserFetch(
  token: string,
  path: string,
  opts: { env?: EnvMap; fetchImpl?: PortFetch } = {},
): Promise<Response> {
  const env = opts.env ?? process.env;
  const base = env.PORT_API_BASE?.trim() || DEFAULT_PORT_API_BASE;
  const doFetch = opts.fetchImpl ?? fetch;
  return doFetch(`${base}${path}`, {
    method: "GET",
    headers: { authorization: `Bearer ${token}`, accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
}

export async function resolveAtlasRole(
  request: Request,
  opts: { env?: EnvMap; fetchImpl?: PortFetch } = {},
): Promise<AtlasAccessRole> {
  const token = readCookie(request.headers.get("cookie"), SESSION_ACCESS_COOKIE);
  if (!token) return "anonymous";
  try {
    const res = await portUserFetch(token, PORT_WHOAMI_PATH, opts);
    return res.ok ? "operator" : "anonymous";
  } catch {
    return "anonymous";
  }
}
