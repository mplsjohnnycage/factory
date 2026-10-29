/**
 * Provider widget fixtures — presentation / status only.
 * No Port catalog upserts · no secrets · FE-142 / FE-172 CLOSED.
 * Canon: docs/design/mockups/provider-widget-grid-dark.png + Provider Dashboard.dc.html
 */

export type ProviderTone = "ok" | "info" | "warn" | "off";

export type ProviderId =
  | "port"
  | "vercel"
  | "github"
  | "convex"
  | "docker"
  | "turso";

export type ProviderTile = {
  id: ProviderId;
  name: string;
  monogram: string;
  /** Brand glow behind the glass tile */
  glow: string;
  accent: string;
  status: string;
  tone: ProviderTone;
  scope: string;
};

export type ProviderKpi = {
  label: string;
  value: string;
  sub: string;
  warn?: boolean;
};

export type ProviderActivity = {
  text: string;
  age: string;
};

export type ProviderDetail = {
  id: ProviderId;
  kpis: ProviderKpi[];
  activity: ProviderActivity[];
  /** Read-only tool surface names shown in footer — never secrets */
  tools: string[];
};

export const TONE_DOT: Record<ProviderTone, string> = {
  ok: "#30d158",
  info: "#0a84ff",
  warn: "#ff9f0a",
  off: "#9aa0aa",
};

/** First-slice grid: Port · Vercel · GitHub · Convex · Docker · Turso (+ Add in UI). */
export const PROVIDER_TILES: ProviderTile[] = [
  {
    id: "port",
    name: "Port",
    monogram: "P",
    glow: "rgba(22, 163, 74, 0.55)",
    accent: "#16a34a",
    status: "Catalog healthy",
    tone: "ok",
    scope: "acme developer portal",
  },
  {
    id: "vercel",
    name: "Vercel",
    monogram: "▲",
    glow: "rgba(100, 210, 255, 0.45)",
    accent: "#1c1e22",
    status: "All Systems Operational",
    tone: "ok",
    scope: "acme · catalog-web",
  },
  {
    id: "github",
    name: "GitHub",
    monogram: "G",
    glow: "rgba(10, 132, 255, 0.5)",
    accent: "#2563eb",
    status: "3 open PRs",
    tone: "info",
    scope: "mplsjohnnycage/factory",
  },
  {
    id: "convex",
    name: "Convex",
    monogram: "C",
    glow: "rgba(225, 29, 72, 0.45)",
    accent: "#e11d48",
    status: "Healthy",
    tone: "ok",
    scope: "catalog · production",
  },
  {
    id: "docker",
    name: "Docker",
    monogram: "⬡",
    glow: "rgba(29, 99, 237, 0.5)",
    accent: "#1d63ed",
    status: "4 running containers",
    tone: "ok",
    scope: "docker-prod-1 · docker-prod-2",
  },
  {
    id: "turso",
    name: "Turso",
    monogram: "T",
    glow: "rgba(219, 39, 82, 0.45)",
    accent: "#db2752",
    status: "All databases healthy",
    tone: "ok",
    scope: "acme · primary iad",
  },
];

export const PROVIDER_DETAILS: Record<ProviderId, ProviderDetail> = {
  port: {
    id: "port",
    kpis: [
      { label: "Catalog entities", value: "22", sub: "9 blueprints" },
      { label: "Scorecard average", value: "Silver", sub: "2 below target", warn: true },
      { label: "Self-service runs", value: "3", sub: "1 waiting approval" },
      { label: "Ownership coverage", value: "86%", sub: "entities with owner" },
    ],
    activity: [
      { text: "Upgrade dependency requested by J. Park", age: "20m" },
      { text: "search-indexer dropped to Bronze", age: "6h" },
      { text: "Blueprint Container added", age: "2d" },
    ],
    tools: [
      "list_blueprints",
      "list_entities",
      "list_workflows",
      "search_audit_logs",
    ],
  },
  vercel: {
    id: "vercel",
    kpis: [
      { label: "Deployments today", value: "14", sub: "+3 vs yesterday" },
      { label: "Build time p50", value: "1m 48s", sub: "−6s this week" },
      { label: "Edge requests", value: "2.4M", sub: "last 24h" },
      { label: "Error rate", value: "0.12%", sub: "last hour" },
    ],
    activity: [
      { text: "Preview build started for 3d8e1b7", age: "1m" },
      { text: "a41c9e2 promoted to production", age: "14m" },
      { text: "Certificate renewal queued for staging", age: "3h" },
    ],
    tools: [
      "list_deployments",
      "get_deployment",
      "get_runtime_logs",
      "list_projects",
    ],
  },
  github: {
    id: "github",
    kpis: [
      { label: "Open PRs", value: "7", sub: "2 awaiting review" },
      { label: "CI pass rate", value: "94%", sub: "last 7 days", warn: true },
      { label: "Median review", value: "3.2 h", sub: "last 7 days" },
      { label: "Open issues", value: "18", sub: "+2 this week" },
    ],
    activity: [
      { text: "M. Ortiz pushed 2 commits to feat/beads-overlay", age: "3m" },
      { text: "deploy-staging failed on search-indexer", age: "35m" },
      { text: "J. Park opened #130", age: "1h" },
    ],
    tools: ["list_pull_requests", "list_workflow_runs", "get_checks"],
  },
  convex: {
    id: "convex",
    kpis: [
      { label: "Function calls", value: "1.8M", sub: "last 24h" },
      { label: "Documents", value: "76.6k", sub: "1.1 GB stored" },
      { label: "Query p95", value: "38 ms", sub: "last hour" },
      { label: "Function errors", value: "6", sub: "last 24h", warn: true },
    ],
    activity: [
      { text: "search:run threw TimeoutError", age: "8m" },
      { text: "Functions deployed · v118", age: "3h" },
      { text: "Index by_repo built on edges_cache", age: "1d" },
    ],
    tools: ["list_tables", "list_functions", "query_logs"],
  },
  docker: {
    id: "docker",
    kpis: [
      { label: "Running", value: "4", sub: "of 6 containers" },
      { label: "CPU", value: "41%", sub: "average across hosts" },
      { label: "Memory", value: "3.2 GB", sub: "of 8 GB" },
      { label: "Restarts", value: "3", sub: "last hour", warn: true },
    ],
    activity: [
      { text: "search-indexer exited 137 (OOM) and restarted", age: "6m" },
      { text: "catalog-api health check passing", age: "2m" },
      { text: "Pulled catalog-api:7be03d1", age: "3h" },
    ],
    tools: ["list_containers", "list_images", "view_logs"],
  },
  turso: {
    id: "turso",
    kpis: [
      { label: "Databases", value: "4", sub: "all healthy" },
      { label: "Rows read", value: "12.4M", sub: "last 24h" },
      { label: "Storage", value: "2.9 GB", sub: "of 9 GB" },
      { label: "Replica lag", value: "38 ms", sub: "p95" },
    ],
    activity: [
      { text: "catalog-prod replica nrt caught up", age: "1m" },
      { text: "Branch catalog-prod-pr131 created", age: "3m" },
      { text: "Auth token rotated for edges-cache", age: "2d" },
    ],
    tools: ["list_databases", "list_tables", "create_branch"],
  },
};

const SECRET_FIELD_RE =
  /(secret|password|token|apikey|api_key|client_secret|private_key|credential)/i;

/** Guard: fixture objects must never carry secret-shaped keys. */
export function assertNoSecretFields(value: unknown, path = "root"): void {
  if (value === null || value === undefined) return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => assertNoSecretFields(item, `${path}[${i}]`));
    return;
  }
  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SECRET_FIELD_RE.test(k)) {
        throw new Error(`Secret-shaped field at ${path}.${k}`);
      }
      assertNoSecretFields(v, `${path}.${k}`);
    }
  }
}

export function tileById(id: ProviderId): ProviderTile | undefined {
  return PROVIDER_TILES.find((t) => t.id === id);
}

export function detailById(id: ProviderId): ProviderDetail {
  return PROVIDER_DETAILS[id];
}

export function providerSummary(): string {
  return `${PROVIDER_TILES.length} providers · Port Vercel GitHub Convex Docker Turso · fixtures only`;
}
