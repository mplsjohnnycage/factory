#!/usr/bin/env node
/**
 * PBI-010 — validate OpenMCP + OpenAccess well-known descriptors.
 * No Port mutations. JSON shape checks only (LogicSRC validators optional later).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

function load(rel) {
  const path = resolve(root, rel);
  const raw = readFileSync(path, "utf8");
  try {
    return { path, json: JSON.parse(raw) };
  } catch (err) {
    throw new Error(`${rel}: invalid JSON — ${err.message}`);
  }
}

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

const openmcp = load(".well-known/openmcp.json");
const openaccess = load(".well-known/openaccess.json");

if (typeof openmcp.json.mcp !== "string" || !openmcp.json.mcp) {
  fail("openmcp.json missing required string key `mcp`");
} else {
  ok(`openmcp.mcp = ${openmcp.json.mcp}`);
}
if (openmcp.json.openmcp !== "0.1") {
  fail(`openmcp.openmcp expected "0.1", got ${JSON.stringify(openmcp.json.openmcp)}`);
} else {
  ok("openmcp.openmcp = 0.1");
}
if (openmcp.json.factory?.no_port_oauth_mutation !== true) {
  fail("openmcp.factory.no_port_oauth_mutation must be true");
} else {
  ok("openmcp declares no Port OAuth mutation");
}
if (JSON.stringify(openmcp.json).includes("0.0.0-scaffold")) {
  fail("openmcp still scaffold placeholder");
} else {
  ok("openmcp is not a scaffold placeholder");
}

if (openaccess.json.openaccess !== "0.1") {
  fail(`openaccess.openaccess expected "0.1", got ${JSON.stringify(openaccess.json.openaccess)}`);
} else {
  ok("openaccess.openaccess = 0.1");
}
for (const key of ["name", "url", "operator", "redirect_uris", "scopes", "hubs"]) {
  if (!(key in openaccess.json)) fail(`openaccess.json missing required key \`${key}\``);
  else ok(`openaccess.${key} present`);
}
if (!Array.isArray(openaccess.json.redirect_uris) || openaccess.json.redirect_uris.length < 1) {
  fail("openaccess.redirect_uris must be a non-empty array");
} else {
  for (const uri of openaccess.json.redirect_uris) {
    if (typeof uri !== "string" || (!uri.startsWith("https://") && !uri.startsWith("http://127.0.0.1") && !uri.startsWith("http://localhost"))) {
      fail(`openaccess.redirect_uris entry not https/loopback: ${uri}`);
    }
  }
  ok(`openaccess.redirect_uris (${openaccess.json.redirect_uris.length})`);
}
if (typeof openaccess.json.scopes !== "object" || Array.isArray(openaccess.json.scopes)) {
  fail("openaccess.scopes must be an object map");
} else {
  ok(`openaccess.scopes (${Object.keys(openaccess.json.scopes).length})`);
}
if (openaccess.json.factory?.no_port_oauth_create_delete !== true) {
  fail("openaccess.factory.no_port_oauth_create_delete must be true");
} else {
  ok("openaccess declares no Port OAuth create/delete");
}
if (openaccess.json.factory?.observatory_forbidden !== true) {
  fail("openaccess.factory.observatory_forbidden must be true");
} else {
  ok("openaccess forbids Observatory reuse");
}
if (!openaccess.json.factory?.port_client_id) {
  fail("openaccess.factory.port_client_id must publish recorded Factory client id");
} else {
  ok("openaccess publishes recorded Port client id");
}
if (JSON.stringify(openaccess.json).includes("0.0.0-scaffold")) {
  fail("openaccess still scaffold placeholder");
} else {
  ok("openaccess is not a scaffold placeholder");
}

if (process.exitCode) {
  console.error("\nwell-known validation failed");
  process.exit(1);
}
console.log("\nInventory §7 items 9–10 shape OK (OpenMCP + OpenAccess). Zero Port mutations.");
