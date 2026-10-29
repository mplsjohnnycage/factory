import { NextRequest, NextResponse } from "next/server";
import { FACTORY_PORT_CLIENT_ENV, OBSERVATORY_FORBIDDEN_ENV } from "@/lib/port-oauth";

/**
 * Port OAuth callback Route Handler stub (PBI-008).
 *
 * Compiles and validates callback shape. Token exchange lands when Factory
 * client secrets are provisioned via env — never Observatory, never Clerk.
 * This handler does not create/delete/revoke Port External Interface apps.
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
  const expected = req.cookies.get("factory_port_oauth_state")?.value;

  if (error) {
    return NextResponse.json(
      { ok: false, error: "port_oauth_denied", detail: error },
      { status: 400 },
    );
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

  if (!expected || expected !== state) {
    return NextResponse.json(
      { ok: false, error: "state_mismatch", detail: "OAuth state cookie mismatch" },
      { status: 400 },
    );
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

  // PBI-008 stub: acknowledge successful callback shape without token exchange.
  // Live token exchange + session cookie = follow-on when secrets are authorized.
  const res = NextResponse.redirect(new URL("/?port=signed-in-stub", url.origin), 302);
  res.cookies.delete("factory_port_oauth_state");
  res.headers.set("x-factory-oauth-stub", "callback-accepted");
  res.headers.set("x-factory-port-client", "factory");
  return res;
}
