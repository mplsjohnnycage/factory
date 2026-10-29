import { NextResponse } from "next/server";
import {
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  buildAuthorizeRedirect,
  cookieSecure,
  pkceChallengeS256,
  randomUrlSafeString,
  resolvePortOAuthConfig,
} from "@/lib/port-oauth";

/**
 * Begin Port OAuth (Authorization Code + PKCE) for the Factory External Interface app.
 * Does not create/delete External Interface apps. Never uses Observatory.
 */
export async function GET() {
  try {
    const config = resolvePortOAuthConfig();
    const state = randomUrlSafeString();
    const verifier = randomUrlSafeString();
    const challenge = pkceChallengeS256(verifier);
    const location = buildAuthorizeRedirect(config, state, challenge);
    const secure = cookieSecure();

    const res = NextResponse.redirect(location, 302);
    res.cookies.set(OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 600,
    });
    res.cookies.set(OAUTH_VERIFIER_COOKIE, verifier, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 600,
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "oauth_misconfigured";
    return NextResponse.json(
      {
        ok: false,
        error: "port_oauth_not_configured",
        detail: message,
        hint: "Set PORT_FACTORY_CLIENT_ID to the Factory External Interface app. Never Observatory.",
      },
      { status: 503 },
    );
  }
}
