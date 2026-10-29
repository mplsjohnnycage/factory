/**
 * Port External Interface OAuth helpers for Developer OS (ADR-005 / ADR-011).
 *
 * Sign-in target = dedicated Factory app client id via env (public PKCE — no secret).
 * NEVER configure Harness Observatory as the OAuth client.
 * This module does not create/delete/revoke External Interface apps.
 *
 * Callback path must match Port + OpenAccess redirects: `/api/auth/callback`.
 */

import { createHash, randomBytes } from "node:crypto";

export const FACTORY_PORT_CLIENT_ENV = "PORT_FACTORY_CLIENT_ID" as const;
export const OBSERVATORY_FORBIDDEN_ENV = "PORT_OBSERVATORY_CLIENT_ID" as const;

/** Live Factory client id (OpenAccess / Port External Interface app). Public PKCE identifier. */
export const FACTORY_PORT_CLIENT_ID_LIVE = "tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0" as const;

export const OAUTH_STATE_COOKIE = "factory_port_oauth_state" as const;
export const OAUTH_VERIFIER_COOKIE = "factory_port_oauth_verifier" as const;
export const SESSION_ACCESS_COOKIE = "factory_port_access_token" as const;
export const SESSION_REFRESH_COOKIE = "factory_port_refresh_token" as const;
export const SESSION_ID_COOKIE = "factory_port_id_token" as const;

/** EU production Auth0 + API (org uses mcp.port.io / api.getport.io). */
export const DEFAULT_AUTH0_DOMAIN = "auth.getport.io" as const;
export const DEFAULT_PORT_API_BASE = "https://api.getport.io" as const;
export const DEFAULT_OAUTH_SCOPES = "openid profile email offline_access" as const;

/**
 * Real Port / OpenAccess callback path (NOT `/api/auth/port/callback`).
 * Login lives under `/api/auth/port/login`; callback is sibling `/api/auth/callback`.
 */
export const CALLBACK_PATH = "/api/auth/callback" as const;

/** Stable Vercel production alias — Port External Interface allowlist SoT for HTTPS. */
export const STABLE_DEVOS_ORIGIN = "https://factory-developer-os.vercel.app" as const;

export type PortOAuthConfig = {
  clientId: string;
  redirectUri: string;
  authorizeUrl: string;
  tokenUrl: string;
  audience: string;
  scopes: string;
  auth0Domain: string;
};

export type EnvMap = Record<string, string | undefined>;

export type PortTokenResponse = {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in: number;
  token_type?: string;
  scope?: string;
};

/**
 * Origin used for Port `redirect_uri`.
 * Prefer `NEXT_PUBLIC_DEVOS_URL`, else stable prod alias on Vercel/production,
 * else localhost. **Never** `VERCEL_URL` — deployment hosts rotate and are not
 * on the Port allowlist.
 */
export function resolveDevosOrigin(env: EnvMap = process.env): string {
  const explicit = env.NEXT_PUBLIC_DEVOS_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  if (env.VERCEL || env.NODE_ENV === "production") {
    return STABLE_DEVOS_ORIGIN;
  }
  return "http://localhost:3000";
}

export function resolvePortOAuthConfig(env: EnvMap = process.env): PortOAuthConfig {
  if (env[OBSERVATORY_FORBIDDEN_ENV]) {
    throw new Error(
      "Observatory client id must not be configured for Developer OS (developer-os Contract)",
    );
  }

  const clientId = env[FACTORY_PORT_CLIENT_ENV]?.trim();
  if (!clientId) {
    throw new Error(
      `${FACTORY_PORT_CLIENT_ENV} is required for Port sign-in (Factory External Interface app)`,
    );
  }

  const origin = resolveDevosOrigin(env);

  const auth0Domain =
    env.PORT_AUTH0_DOMAIN?.trim() || DEFAULT_AUTH0_DOMAIN;
  const audience =
    env.PORT_API_BASE?.trim() || DEFAULT_PORT_API_BASE;
  const scopes = env.PORT_OAUTH_SCOPES?.trim() || DEFAULT_OAUTH_SCOPES;

  return {
    clientId,
    redirectUri: `${origin}${CALLBACK_PATH}`,
    authorizeUrl:
      env.PORT_OAUTH_AUTHORIZE_URL?.trim() ||
      `https://${auth0Domain}/authorize`,
    tokenUrl:
      env.PORT_OAUTH_TOKEN_URL?.trim() ||
      `https://${auth0Domain}/oauth/token`,
    audience,
    scopes,
    auth0Domain,
  };
}

/** High-entropy URL-safe string for PKCE verifier / OAuth state. */
export function randomUrlSafeString(byteLength = 32): string {
  return base64Url(randomBytes(byteLength));
}

export function pkceChallengeS256(verifier: string): string {
  return base64Url(createHash("sha256").update(verifier, "utf8").digest());
}

function base64Url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function buildAuthorizeRedirect(
  config: PortOAuthConfig,
  state: string,
  codeChallenge: string,
): string {
  const url = new URL(config.authorizeUrl);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", config.scopes);
  url.searchParams.set("audience", config.audience);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

/**
 * Exchange authorization code (or refresh token) at Auth0.
 * Public PKCE client — never send client_secret.
 */
export async function exchangePortToken(
  config: PortOAuthConfig,
  params: {
    grant_type: "authorization_code" | "refresh_token";
    code?: string;
    code_verifier?: string;
    refresh_token?: string;
  },
  fetchImpl: typeof fetch = fetch,
): Promise<PortTokenResponse> {
  const body = new URLSearchParams();
  body.set("client_id", config.clientId);
  body.set("grant_type", params.grant_type);

  if (params.grant_type === "authorization_code") {
    if (!params.code || !params.code_verifier) {
      throw new Error("authorization_code grant requires code and code_verifier");
    }
    body.set("code", params.code);
    body.set("code_verifier", params.code_verifier);
    body.set("redirect_uri", config.redirectUri);
  } else {
    if (!params.refresh_token) {
      throw new Error("refresh_token grant requires refresh_token");
    }
    body.set("refresh_token", params.refresh_token);
  }

  const res = await fetchImpl(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = (await res.json()) as PortTokenResponse & {
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !json.access_token) {
    const detail = json.error_description || json.error || `HTTP ${res.status}`;
    throw new Error(`port_token_exchange_failed: ${detail}`);
  }

  return {
    access_token: json.access_token,
    id_token: json.id_token,
    refresh_token: json.refresh_token,
    expires_in: typeof json.expires_in === "number" ? json.expires_in : 3600,
    token_type: json.token_type,
    scope: json.scope,
  };
}

export function cookieSecure(env: EnvMap = process.env): boolean {
  return env.NODE_ENV === "production" || Boolean(env.VERCEL);
}
