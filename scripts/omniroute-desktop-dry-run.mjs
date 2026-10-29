#!/usr/bin/env node
/**
 * Kit dry-run for OmniRoute / OmniRouter desktop install staging.
 *
 * Verifies scripts/docs exist and contain required markers.
 * Does not install OmniRoute, call providers, touch Port, or print secrets.
 *
 * Usage: node scripts/omniroute-desktop-dry-run.mjs
 *        npm run dry-run:omniroute-desktop
 * Exit 0 = kit OK. Exit 1 = missing/broken kit.
 *
 * @see docs/ops/omniroute-desktop-install.md
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const REQUIRED = [
  {
    path: "docs/ops/omniroute-desktop-install.md",
    markers: [
      "localhost:20128",
      "127.0.0.1:20128",
      "/healthz",
      "OmniRoute",
      "OmniRouter",
      "design-only",
      "never commit",
      "omniroute-desktop-dry-run.mjs",
      "no spend",
    ],
  },
  {
    path: "scripts/windows/omniroute.env.example",
    markers: [
      "OMNIROUTE_PORT=20128",
      "APP_BIND_HOST=127.0.0.1",
      "REQUIRE_API_KEY",
      "OMNIROUTE_BASE_URL=http://127.0.0.1:20128",
      "NEVER commit",
    ],
  },
  {
    path: "scripts/windows/omniroute-desktop-verify.ps1",
    markers: [
      "DryRun",
      "Health",
      "127.0.0.1:20128",
      "healthz",
      "Port mutate: REFUSED",
    ],
  },
  {
    path: "scripts/omniroute-desktop-dry-run.mjs",
    markers: ["Kit dry-run for OmniRoute", "Exit 0 = kit OK"],
  },
];

/** Reject committed non-empty provider/API key assignments (empty KEY= in example is OK). */
const FORBIDDEN_SECRET_ASSIGNMENTS = [
  /(?:^|\n)\s*OPENAI_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*ANTHROPIC_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*OMNIROUTE_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*GROQ_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
];

let failed = false;

console.log("=== OmniRoute / OmniRouter desktop install kit dry-run ===");
console.log("Repo root:", root);
console.log("Port mutate: REFUSED");
console.log("Provider spend / live chat: REFUSED");
console.log("Live desktop install: STAGED (PM / DESKTOP-3APDBKG)");
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
  for (const re of FORBIDDEN_SECRET_ASSIGNMENTS) {
    if (re.test(body)) {
      console.error(`FAIL possible secret assignment in ${item.path}`);
      failed = true;
    }
  }
  console.log(`OK  ${item.path}`);
}

const pkgPath = join(root, "package.json");
if (!existsSync(pkgPath)) {
  console.error("FAIL missing: package.json");
  failed = true;
} else {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const script = pkg.scripts?.["dry-run:omniroute-desktop"];
  if (script !== "node scripts/omniroute-desktop-dry-run.mjs") {
    console.error(
      'FAIL package.json scripts["dry-run:omniroute-desktop"] missing or wrong',
    );
    failed = true;
  } else {
    console.log('OK  package.json scripts["dry-run:omniroute-desktop"]');
  }
}

console.log("");
console.log("PM / desktop (after merge/pull) — zero spend install verify:");
console.log("  1. npm install -g omniroute && omniroute --version");
console.log("  2. omniroute   # listens on 127.0.0.1:20128");
console.log("  3. curl -fsS http://127.0.0.1:20128/healthz");
console.log(
  "  4. Optional: powershell -File scripts\\windows\\omniroute-desktop-verify.ps1 -Action Health",
);
console.log("  5. Skip provider connect / paid models until a spend-approved tick");
console.log("");

if (failed) {
  console.error("Kit dry-run FAILED");
  process.exit(1);
}
console.log(
  "Kit dry-run PASS (scripts staged; live OmniRoute start pending desktop; no providers required)",
);
process.exit(0);
