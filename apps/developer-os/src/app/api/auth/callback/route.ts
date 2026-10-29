import { NextRequest, NextResponse } from "next/server";
import {
  FACTORY_PORT_CLIENT_ENV,
  OBSERVATORY_FORBIDDEN_ENV,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  SESSION_ACCESS_COOKIE,
  SESSION_ID_COOKIE,
  SESSION_REFRESH_COOKIE,
  cookieSecure,
  exchangePortToken,
  resolvePortOAuthConfig,
} from "@/lib/port-oauth";

/**
 * Port OAuth callback — path must match Port + OpenAccess redirect_uris:
 * `/api/auth/callback` (not `/api/auth/port/callback`).
 *
 * Exchanges authorization code + PKCE verifier for tokens at Auth0.
 * No client_secret (public PKCE). Never Observatory / Clerk.
 * Does not create/delete/revoke Port External Interface apps.
 */
export async function GET(req: NextRequest) {
  if (process.env[OBSERVATORY_FORBIDDEN_ENV]) {
    return NextResponse.json(
      {
        ok: false,
        error: "observatory_forbidden",
        detail: "Harness Observatory must not be configured as Factory OAuth client",
      },
      { status: 500 },
    );
  }

  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const expectedState = req.cookies.get(OAUTH_STATE_COOKIE)?.value;
  const verifier = req.cookies.get(OAUTH_VERIFIER_COOKIE)?.value;
  const secure = cookieSecure();

  const clearOauthCookies = (res: NextResponse) => {
    res.cookies.delete(OAUTH_STATE_COOKIE);
    res.cookies.delete(OAUTH_VERIFIER_COOKIE);
  };

  if (error) {
    const res = NextResponse.json(
      { ok: false, error: "port_oauth_denied", detail: error },
      { status: 400 },
    );
    clearOauthCookies(res);
    return res;
  }

  if (!code || !state) {
    return NextResponse.json(
      {
        ok: false,
        error: "missing_code_or_state",
        detail: "Port callback requires code and state query params",
      },
      { status: 400 },
    );
  }

  if (!expectedState || expectedState !== state) {
    const res = NextResponse.json(
      { ok: false, error: "state_mismatch", detail: "OAuth state cookie mismatch" },
      { status: 400 },
    );
    clearOauthCookies(res);
    return res;
  }

  if (!verifier) {
    const res = NextResponse.json(
      {
        ok: false,
        error: "missing_pkce_verifier",
        detail: "PKCE code_verifier cookie missing — restart Sign in with Port",
      },
      { status: 400 },
    );
    clearOauthCookies(res);
    return res;
  }

  const clientId = process.env[FACTORY_PORT_CLIENT_ENV]?.trim();
  if (!clientId) {
    return NextResponse.json(
      {
        ok: false,
        error: "port_oauth_not_configured",
        detail: `${FACTORY_PORT_CLIENT_ENV} missing — Factory External Interface app only`,
      },
      { status: 503 },
    );
  }

  let config;
  try {
    config = resolvePortOAuthConfig();
  } catch (err) {
    const message = err instanceof Error ? err.message : "oauth_misconfigured";
    return NextResponse.json(
      { ok: false, error: "port_oauth_not_configured", detail: message },
      { status: 503 },
    );
  }

  // Always exchange with the same redirect_uri used at authorize
  // (resolvePortOAuthConfig / NEXT_PUBLIC_DEVOS_URL / canonical prod pin).
  // Never rebuild from request Host — deployment hosts break Port allowlist match.

  let tokens;
  try {
    tokens = await exchangePortToken(config, {
      grant_type: "authorization_code",
      code,
      code_verifier: verifier,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "token_exchange_failed";
    const res = NextResponse.json(
      { ok: false, error: "port_token_exchange_failed", detail },
      { status: 502 },
    );
    clearOauthCookies(res);
    return res;
  }

  const postLogin = new URL(config.redirectUri);
  postLogin.pathname = "/";
  postLogin.search = "port=signed-in";
  const res = NextResponse.redirect(postLogin, 302);
  clearOauthCookies(res);

  const accessMaxAge = Math.max(60, tokens.expires_in);
  res.cookies.set(SESSION_ACCESS_COOKIE, tokens.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: accessMaxAge,
  });

  if (tokens.refresh_token) {
    // Port refresh tokens last up to 30 days; keep within browser max.
    res.cookies.set(SESSION_REFRESH_COOKIE, tokens.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if (tokens.id_token) {
    res.cookies.set(SESSION_ID_COOKIE, tokens.id_token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: accessMaxAge,
    });
  }

  res.headers.set("x-factory-oauth", "token-exchanged");
  res.headers.set("x-factory-port-client", "factory");
  return res;
}
