import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { buildAuthorizeRedirect, resolvePortOAuthConfig } from "@/lib/port-oauth";

/**
 * Begin Port OAuth for the dedicated Factory External Interface app.
 * Stub for PBI-008 — compiles + redirects when PORT_FACTORY_CLIENT_ID is set.
 * Does not create/delete External Interface apps. Never uses Observatory.
 */
export async function GET() {
  try {
    const config = resolvePortOAuthConfig();
    const state = randomUUID();
    const location = buildAuthorizeRedirect(config, state);
    const res = NextResponse.redirect(location, 302);
    res.cookies.set("factory_port_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
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
