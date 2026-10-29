#!/usr/bin/env node
/**
 * Kit dry-run for factory-gateway Windows logon auto-start.
 *
 * Verifies scripts/docs exist and contain required markers.
 * Does not run PowerShell, touch Port, or print secrets.
 *
 * Usage: node scripts/gateway-windows-logon-dry-run.mjs
 * Exit 0 = kit OK. Exit 1 = missing/broken kit.
 *
 * @see docs/ops/gateway-windows-logon-autostart.md
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED = [
  {
    path: "scripts/windows/factory-gateway-logon-start.ps1",
    markers: [
      "Import-DotEnvFile",
      "127.0.0.1:8787/health",
      "tailscale funnel",
      "PORT_CLIENT_SECRET",
    ],
  },
  {
    path: "scripts/windows/factory-gateway-register-logon-task.ps1",
    markers: [
      "FactoryGatewayLogon",
      "AtLogOn",
      "DryRun",
      "Register-ScheduledTask",
      "DESKTOP-3APDBKG",
    ],
  },
  {
    path: "scripts/windows/gateway.env.example",
    markers: ["PORT_CLIENT_SECRET", "FACTORY_GATEWAY_HANDLER_TOKEN", "GATEWAY_PORT"],
  },
  {
    path: "docs/ops/gateway-windows-logon-autostart.md",
    markers: [
      "Task Scheduler",
      "DESKTOP-3APDBKG",
      "factory-gateway-register-logon-task.ps1",
      "never commit",
    ],
  },
];

const FORBIDDEN_SECRET_PATTERNS = [
  /PORT_CLIENT_SECRET\s*=\s*['"]?[^\s'"]{12,}/i,
  /FACTORY_GATEWAY_HANDLER_TOKEN\s*=\s*['"]?[^\s'"]{12,}/i,
];

let failed = false;

console.log("=== factory-gateway Windows logon autostart kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Live Windows reboot+logon: STAGED for DESKTOP-3APDBKG (Johnny desktop)");
console.log("");

for (const item of REQUIRED) {
  const abs = join(root, item.path);
  if (!existsSync(abs)) {
    console.error(`FAIL missing: ${item.path}`);
    failed = true;
    continue;
  }
  const body = readFileSync(abs, "utf8");
  const missing = item.markers.filter((m) => !body.includes(m));
  if (missing.length) {
    console.error(`FAIL markers in ${item.path}: ${missing.join(", ")}`);
    failed = true;
    continue;
  }
  for (const re of FORBIDDEN_SECRET_PATTERNS) {
    if (re.test(body) && !item.path.endsWith(".example")) {
      // Allow empty KEY= in example; real assigned values elsewhere fail.
      console.error(`FAIL possible secret assignment in ${item.path}`);
      failed = true;
    }
  }
  console.log(`OK  ${item.path}`);
}

console.log("");
console.log("Johnny on DESKTOP-3APDBKG (after merge/pull):");
console.log("  1. Copy scripts/windows/gateway.env.example → %USERPROFILE%\\.factory\\gateway.env");
console.log("  2. Fill secrets locally (never commit)");
console.log("  3. powershell -File scripts\\windows\\factory-gateway-register-logon-task.ps1 -Action DryRun");
console.log("  4. powershell -File scripts\\windows\\factory-gateway-register-logon-task.ps1 -Action Register");
console.log("  5. Reboot+logon → curl http://127.0.0.1:8787/health + Funnel /health");
console.log("");

if (failed) {
  console.error("Kit dry-run FAILED");
  process.exit(1);
}
console.log("Kit dry-run PASS (scripts staged; live Windows verify pending Johnny desktop)");
process.exit(0);
