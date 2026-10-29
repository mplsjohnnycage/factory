#!/usr/bin/env node
/**
 * Kit dry-run for factory-done loop queue mirror
 * (`bd ready` / Linear Todo → notes.md ### Queued).
 *
 * Offline structural checks only:
 *   - ops doc + package script markers
 *   - parse fixtures (bd-ready / linear-todo / notes-sample)
 *   - propose Queued FE-* rows without duplicating In Progress / Done
 *   - skip HITL-held (PBI-015 / hitlHeld)
 *
 * Does NOT:
 *   - shell out to live `bd` or mutate Beads / Dolt
 *   - write Project store notes.md (live mirror = coordinator tick only)
 *   - touch Port schema / print secrets / spend
 *
 * Usage:
 *   node scripts/factory-queue-mirror-dry-run.mjs
 *   npm run dry-run:factory-queue-mirror
 *
 * Exit 0 = kit OK. Exit 1 = missing/broken. Exit 2 = bad args.
 *
 * @see docs/ops/factory-queue-mirror.md
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE_DIR = "fixtures/factory-queue-mirror";

const REQUIRED = [
  {
    path: "docs/ops/factory-queue-mirror.md",
    markers: [
      "bd ready",
      "### Queued",
      "/cursor/stores/self/notes.md",
      "dry-run:factory-queue-mirror",
      "coordinator tick only",
      "PBI-015",
      "/ce-compound",
      "author ≠ reviewer",
      "self-APPROVE",
      "FE-142",
      "FE-172",
      "Port schema",
      "Linear",
      "HITL",
    ],
  },
  {
    path: "scripts/factory-queue-mirror-dry-run.mjs",
    markers: [
      "Kit dry-run for factory-done loop queue mirror",
      "Exit 0 = kit OK",
      "coordinator tick only",
      "does NOT write",
    ],
  },
  {
    path: `${FIXTURE_DIR}/bd-ready.json`,
    markers: ['"id": "factory-r9f"', '"feId": "FE-181"', "PBI-015", "hitlHeld"],
  },
  {
    path: `${FIXTURE_DIR}/linear-todo.json`,
    markers: ['"state": "Todo"', "PBI-015", '"state": "Done"', "hitlHeld"],
  },
  {
    path: `${FIXTURE_DIR}/notes-sample.md`,
    markers: ["### In Progress", "### Queued", "### Done", "FE-161", "FE-177"],
  },
  {
    path: "AGENTS.md",
    markers: ["bd ready", "factory-queue-mirror"],
  },
  {
    path: "docs/meta-beads.md",
    markers: ["factory-queue-mirror", "dry-run:factory-queue-mirror"],
  },
];

const FORBIDDEN_SECRET_ASSIGNMENTS = [
  /(?:^|\n)\s*PORT_CLIENT_SECRET\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*FACTORY_GATEWAY_HANDLER_TOKEN\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*ANTHROPIC_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
  /(?:^|\n)\s*OPENAI_API_KEY\s*=\s*['"]?[^\s'"#]+/i,
];

/** HITL-held titles / ids that must never enter Queued from mirror. */
const HITL_PATTERNS = [/PBI-015/i, /\/ce-compound/i];

/**
 * @param {string} markdown
 * @returns {{ inProgress: Set<string>, queued: Set<string>, done: Set<string> }}
 */
function parseNotesSections(markdown) {
  /** @type {Record<string, Set<string>>} */
  const buckets = {
    "in progress": new Set(),
    queued: new Set(),
    done: new Set(),
  };
  let current = null;
  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^###\s+(.+?)\s*$/);
    if (heading) {
      const key = heading[1].trim().toLowerCase();
      current = Object.prototype.hasOwnProperty.call(buckets, key) ? key : null;
      continue;
    }
    if (!current) continue;
    const m = line.match(/\*\*(FE-\d+)\*\*/);
    if (m) buckets[current].add(m[1]);
  }
  return {
    inProgress: buckets["in progress"],
    queued: buckets.queued,
    done: buckets.done,
  };
}

/**
 * @param {unknown} item
 * @returns {boolean}
 */
function isHitlHeld(item) {
  if (!item || typeof item !== "object") return false;
  const rec = /** @type {Record<string, unknown>} */ (item);
  if (rec.hitlHeld === true) return true;
  const hay = [rec.title, rec.linear, rec.identifier, rec.id, rec.feId]
    .filter((v) => typeof v === "string")
    .join(" ");
  return HITL_PATTERNS.some((re) => re.test(hay));
}

/**
 * @param {unknown[]} source
 * @param {{ inProgress: Set<string>, done: Set<string> }} notes
 * @param {"bd" | "linear"} mode
 * @returns {{ feId: string, title: string, sourceId: string }[]}
 */
function proposeQueued(source, notes, mode) {
  /** @type {{ feId: string, title: string, sourceId: string }[]} */
  const out = [];
  for (const raw of source) {
    if (!raw || typeof raw !== "object") continue;
    const item = /** @type {Record<string, unknown>} */ (raw);
    if (mode === "linear") {
      const state = String(item.state ?? "");
      if (/^done$/i.test(state) || /^canceled$/i.test(state) || /^cancelled$/i.test(state)) {
        continue;
      }
      if (!/^(todo|backlog)$/i.test(state)) continue;
    }
    if (isHitlHeld(item)) continue;
    const feId = typeof item.feId === "string" ? item.feId : "";
    if (!feId) continue;
    if (notes.inProgress.has(feId) || notes.done.has(feId)) continue;
    const title =
      typeof item.title === "string" && item.title.trim()
        ? item.title.trim()
        : feId;
    const sourceId =
      mode === "bd"
        ? String(item.id ?? "")
        : String(item.identifier ?? "");
    out.push({ feId, title, sourceId });
  }
  return out;
}

function parseArgs(argv) {
  for (const a of argv) {
    if (a === "--help" || a === "-h") {
      console.log(`Usage:
  npm run dry-run:factory-queue-mirror
  node scripts/factory-queue-mirror-dry-run.mjs

Offline structural dry-run only. Does not mutate Beads or write notes.md.
Live mirror writes Project store notes on the coordinator tick only.`);
      process.exit(0);
    }
    if (a.startsWith("-")) {
      console.error(`Unknown arg: ${a} (pass --help)`);
      process.exit(2);
    }
  }
}

parseArgs(process.argv.slice(2));

let failed = false;

console.log("=== Factory queue mirror kit dry-run ===");
console.log("Repo root:", root);
console.log("Live bd / Beads DB mutate: REFUSED");
console.log("Project notes.md write (CI): REFUSED — coordinator tick only");
console.log("Port mutate: REFUSED");
console.log("Secrets print / Johnny ping / spend: REFUSED");
console.log("FE-142 / FE-172: CLOSED");
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
  const script = pkg.scripts?.["dry-run:factory-queue-mirror"];
  if (script !== "node scripts/factory-queue-mirror-dry-run.mjs") {
    console.error(
      'FAIL package.json scripts["dry-run:factory-queue-mirror"] missing or wrong',
    );
    failed = true;
  } else {
    console.log('OK  package.json scripts["dry-run:factory-queue-mirror"]');
  }
}

console.log("");
console.log("== Fixture parse / Queued proposal ==");

const notesPath = join(root, FIXTURE_DIR, "notes-sample.md");
const bdPath = join(root, FIXTURE_DIR, "bd-ready.json");
const linearPath = join(root, FIXTURE_DIR, "linear-todo.json");

/** @type {{ inProgress: Set<string>, queued: Set<string>, done: Set<string> } | null} */
let notes = null;
try {
  notes = parseNotesSections(readFileSync(notesPath, "utf8"));
  if (!notes.inProgress.has("FE-161") || !notes.done.has("FE-177")) {
    console.error("FAIL notes-sample.md missing expected In Progress/Done FE ids");
    failed = true;
  } else {
    console.log(
      `OK  notes sections: inProgress=${[...notes.inProgress].join(",")} queued=${[...notes.queued].join(",")} done=${[...notes.done].join(",")}`,
    );
  }
} catch (err) {
  console.error("FAIL parse notes-sample.md:", err instanceof Error ? err.message : err);
  failed = true;
}

try {
  const bdReady = JSON.parse(readFileSync(bdPath, "utf8"));
  if (!Array.isArray(bdReady) || bdReady.length < 2) {
    throw new Error("bd-ready.json must be a non-empty array");
  }
  if (!notes) throw new Error("notes parse required");
  const proposed = proposeQueued(bdReady, notes, "bd");
  const ids = proposed.map((p) => p.feId);
  // FE-181 ready + not In Progress/Done → Queued; FE-182 new; FE-161 In Progress skip; HITL skip
  if (!ids.includes("FE-181") || !ids.includes("FE-182")) {
    console.error(`FAIL bd-ready proposal missing FE-181/FE-182; got ${ids.join(",")}`);
    failed = true;
  } else if (ids.includes("FE-161") || ids.includes("FE-145")) {
    console.error(`FAIL bd-ready proposal leaked In Progress or HITL: ${ids.join(",")}`);
    failed = true;
  } else {
    console.log(
      `OK  bd-ready → Queued proposal: ${proposed.map((p) => `${p.feId}(${p.sourceId})`).join(", ")}`,
    );
  }
} catch (err) {
  console.error("FAIL parse bd-ready.json:", err instanceof Error ? err.message : err);
  failed = true;
}

try {
  const linear = JSON.parse(readFileSync(linearPath, "utf8"));
  if (!Array.isArray(linear)) throw new Error("linear-todo.json must be an array");
  if (!notes) throw new Error("notes parse required");
  const proposed = proposeQueued(linear, notes, "linear");
  const ids = proposed.map((p) => p.feId);
  if (!ids.includes("FE-183")) {
    console.error(`FAIL linear proposal missing FE-183; got ${ids.join(",")}`);
    failed = true;
  } else if (
    ids.includes("FE-177") ||
    ids.includes("FE-115") ||
    ids.includes("FE-099")
  ) {
    console.error(
      `FAIL linear proposal leaked Done/HITL/Done-state: ${ids.join(",")}`,
    );
    failed = true;
  } else {
    console.log(
      `OK  linear-todo → Queued proposal: ${proposed.map((p) => `${p.feId}(${p.sourceId})`).join(", ")}`,
    );
  }
} catch (err) {
  console.error(
    "FAIL parse linear-todo.json:",
    err instanceof Error ? err.message : err,
  );
  failed = true;
}

// Explicit guard: this process never writes live notes.
const liveNotesCandidates = [
  "/cursor/stores/self/notes.md",
  join(root, "notes.md"),
];
for (const p of liveNotesCandidates) {
  // Presence is fine; writing is refused. Document refusal only.
  if (existsSync(p)) {
    console.log(`OK  notes path exists but write refused in dry-run: ${p}`);
  }
}
console.log("OK  notes.md write: REFUSED (live mirror = coordinator tick only)");

console.log("");
if (failed) {
  console.error("Kit dry-run FAILED");
  process.exit(1);
}
console.log(
  "Kit dry-run PASS (fixtures parsed; Queued proposal excludes In Progress/Done/HITL; no Beads mutate; no notes write)",
);
process.exit(0);
