import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PORT_WHOAMI_PATH,
  readCookie,
  resolveAtlasRole,
} from "../src/lib/atlas/session.js";

const req = (cookie?: string) =>
  new Request("https://factory-developer-os.vercel.app/api/atlas/subgraph", {
    headers: cookie ? { cookie } : {},
  });

describe("Atlas role from Port session", () => {
  it("parses cookies", () => {
    assert.equal(readCookie("a=1; factory_port_access_token=tok%2Fx", "factory_port_access_token"), "tok/x");
    assert.equal(readCookie(null, "x"), null);
  });

  it("is anonymous without a token and never calls Port", async () => {
    let called = false;
    const role = await resolveAtlasRole(req(), {
      fetchImpl: (async () => ((called = true), new Response("{}"))) as typeof fetch,
    });
    assert.equal(role, "anonymous");
    assert.equal(called, false);
  });

  it("is operator only when Port accepts the user's bearer token", async () => {
    let seen: { url: string; auth: string | null } | null = null;
    const ok = (async (url: string, init: RequestInit) => {
      seen = { url, auth: new Headers(init.headers).get("authorization") };
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;
    const role = await resolveAtlasRole(req("factory_port_access_token=abc"), {
      env: { PORT_API_BASE: "https://port.test" },
      fetchImpl: ok,
    });
    assert.equal(role, "operator");
    assert.deepEqual(seen, { url: `https://port.test${PORT_WHOAMI_PATH}`, auth: "Bearer abc" });
  });

  it("falls back to anonymous on rejected token or network error", async () => {
    const opts = (f: typeof fetch) => ({ env: {}, fetchImpl: f });
    const c = "factory_port_access_token=abc";
    assert.equal(
      await resolveAtlasRole(req(c), opts((async () => new Response("", { status: 401 })) as typeof fetch)),
      "anonymous",
    );
    assert.equal(
      await resolveAtlasRole(req(c), opts((async () => { throw new Error("down"); }) as typeof fetch)),
      "anonymous",
    );
  });
});
