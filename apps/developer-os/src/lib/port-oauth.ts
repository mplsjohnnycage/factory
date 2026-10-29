/**
 * Port External Interface OAuth helpers for Developer OS (ADR-005 / ADR-011).
 *
 * Sign-in target = dedicated Factory app client id via env.
 * NEVER configure Harness Observatory as the OAuth client.
 * This module does not create/delete/revoke External Interface apps.
 */

export const FACTORY_PORT_CLIENT_ENV = "PORT_FACTORY_CLIENT_ID" as const;
export const OBSERVATORY_FORBIDDEN_ENV = "PORT_OBSERVATORY_CLIENT_ID" as const;

export type PortOAuthConfig = {
  clientId: string;
  redirectUri: string;
  authorizeUrl: string;
};

export type EnvMap = Record<string, string | undefined>;

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

  const explicit = env.NEXT_PUBLIC_DEVOS_URL?.trim();
  const vercelHost = env.VERCEL_URL?.trim();
  const base =
    explicit || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
  const origin = base.replace(/\/$/, "");

  return {
    clientId,
    redirectUri: `${origin}/api/auth/port/callback`,
    authorizeUrl: env.PORT_OAUTH_AUTHORIZE_URL?.trim() || "https://api.getport.io/v1/oauth/authorize",
  };
}

export function buildAuthorizeRedirect(config: PortOAuthConfig, state: string): string {
  const url = new URL(config.authorizeUrl);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  return url.toString();
}
