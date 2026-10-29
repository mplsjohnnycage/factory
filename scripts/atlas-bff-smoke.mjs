#!/usr/bin/env node
/**
 * Code Atlas BFF smoke (STL-154 follow-up).
 * Zero Port mutations / zero spend. Hits Dev OS read-projection only.
 *
 * Usage:
 *   node scripts/atlas-bff-smoke.mjs
 *   ATLAS_BFF_BASE=http://localhost:3000 node scripts/atlas-bff-smoke.mjs
 *   node scripts/atlas-bff-smoke.mjs --base https://factory-developer-os.vercel.app
 *   node scripts/atlas-bff-smoke.mjs --dry-run
 */
import { parseArgs } from "node:util";

const DEFAULT_BASE = "https://factory-developer-os.vercel.app";

const { values } = parseArgs({
  options: {
    base: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
  allowPositionals: false,
});

if (values.help) {
  console.log(`Atlas BFF smoke — read-only checks against Dev OS /api/atlas/*

Options:
  --base <url>   BFF origin (default: ${DEFAULT_BASE} or ATLAS_BFF_BASE)
  --dry-run      Print planned requests only; no network
  --help         Show this help

Checks:
  1. GET  /api/atlas/tools                 → 200, five dotted atlas.* tools + naming map
  2. POST atlas.find_node {query:bead}     → 200 ok:true
  3. POST atlas_find_node (Port alias)     → 200 (underscore accepted)
  4. POST get_agent_traces asLiveOwner     → 422 langfuse_not_live_owner
`);
  process.exit(0);
}

const base = (values.base || process.env.ATLAS_BFF_BASE || DEFAULT_BASE).replace(
  /\/$/,
  "",
);
const dryRun = values["dry-run"] === true;

const EXPECTED_TOOLS = [
  "atlas.find_node",
  "atlas.expand_dependencies",
  "atlas.get_task_impact",
  "atlas.get_related_sessions",
  "atlas.get_agent_traces",
];

let failures = 0;

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

async function request(method, path, body) {
  const url = `${base}${path}`;
  if (dryRun) {
    console.log(`[dry-run] ${method} ${url}${body ? ` ${JSON.stringify(body)}` : ""}`);
    return { status: 0, json: null, dryRun: true };
  }
  const init = {
    method,
    headers: { Accept: "application/json" },
  };
  if (body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  const res = await fetch(url, init);
  let json = null;
  const text = await res.text();
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    fail(`${method} ${path}: non-JSON body (status ${res.status})`);
    return { status: res.status, json: null, text };
  }
  return { status: res.status, json, text };
}

async function main() {
  console.log(`Atlas BFF smoke → ${base}${dryRun ? " (dry-run)" : ""}`);
  console.log("Lane: Meta · No Port schema · No secrets\n");

  if (dryRun) {
    await request("GET", "/api/atlas/tools");
    await request("POST", "/api/atlas/tools", {
      tool: "atlas.find_node",
      args: { query: "bead" },
      role: "anonymous",
    });
    await request("POST", "/api/atlas/tools", {
      tool: "atlas_find_node",
      args: { query: "bead" },
      role: "anonymous",
    });
    await request("POST", "/api/atlas/tools", {
      tool: "atlas.get_agent_traces",
      args: { sessionId: "sess-atlas-1", asLiveOwner: true },
      role: "operator",
    });
    console.log("\nDry-run complete — no network calls.");
    return;
  }

  // 1. List tools
  const list = await request("GET", "/api/atlas/tools");
  if (list.status !== 200) {
    fail(`GET /api/atlas/tools expected 200, got ${list.status}`);
  } else {
    ok("GET /api/atlas/tools → 200");
  }
  const tools = list.json?.tools;
  if (!Array.isArray(tools)) {
    fail("GET tools missing tools[]");
  } else {
    for (const name of EXPECTED_TOOLS) {
      if (!tools.includes(name)) fail(`tools[] missing ${name}`);
    }
    if (EXPECTED_TOOLS.every((n) => tools.includes(n))) {
      ok(`tools[] has five dotted atlas.* names`);
    }
    if (tools.some((t) => typeof t === "string" && t.startsWith("atlas_"))) {
      fail("tools[] must not list underscore Port IDs as primary names");
    }
  }
  if (list.json?.naming?.openmcp !== "dotted") {
    fail("GET naming.openmcp expected 'dotted'");
  } else {
    ok("naming.openmcp = dotted");
  }
  if (list.json?.langfuseLiveOwner !== false) {
    fail("langfuseLiveOwner must be false");
  } else {
    ok("langfuseLiveOwner = false");
  }

  // 2. find_node (dotted)
  const find = await request("POST", "/api/atlas/tools", {
    tool: "atlas.find_node",
    args: { query: "bead" },
    role: "anonymous",
  });
  if (find.status !== 200 || find.json?.ok !== true) {
    fail(
      `POST atlas.find_node expected 200 ok:true, got status=${find.status} ok=${find.json?.ok}`,
    );
  } else {
    ok("POST atlas.find_node {query:bead} → 200 ok:true");
  }
  if (find.json?.tool !== "atlas.find_node") {
    fail(`find_node response.tool must be dotted, got ${JSON.stringify(find.json?.tool)}`);
  }

  // 3. Port underscore alias
  const alias = await request("POST", "/api/atlas/tools", {
    tool: "atlas_find_node",
    args: { query: "bead" },
    role: "anonymous",
  });
  if (alias.status !== 200 || alias.json?.ok !== true) {
    fail(
      `POST atlas_find_node (Port alias) expected 200 ok:true, got status=${alias.status} ok=${alias.json?.ok}`,
    );
  } else if (alias.json?.tool !== "atlas.find_node") {
    fail(
      `Port alias must normalize to atlas.find_node, got ${JSON.stringify(alias.json?.tool)}`,
    );
  } else {
    ok("POST atlas_find_node alias → 200, response.tool=atlas.find_node");
  }

  // 4. Langfuse live-owner refuse
  const traces = await request("POST", "/api/atlas/tools", {
    tool: "atlas.get_agent_traces",
    args: { sessionId: "sess-atlas-1", asLiveOwner: true },
    role: "operator",
  });
  if (traces.status !== 422 || traces.json?.code !== "langfuse_not_live_owner") {
    fail(
      `POST get_agent_traces asLiveOwner expected 422 langfuse_not_live_owner, got status=${traces.status} code=${traces.json?.code}`,
    );
  } else {
    ok("POST atlas.get_agent_traces asLiveOwner=true → 422 langfuse_not_live_owner");
  }

  if (failures > 0) {
    console.error(`\nAtlas BFF smoke FAILED (${failures})`);
    process.exit(1);
  }
  console.log("\nAtlas BFF smoke PASSED. Zero Port mutations.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
