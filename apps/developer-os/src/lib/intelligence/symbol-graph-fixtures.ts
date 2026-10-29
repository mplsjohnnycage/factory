/**
 * Codebase Intelligence fixture graph — locked to
 * docs/design/mockups/Codebase Intelligence.dc.html + PNG.
 * Fixtures only; no Port upserts; no secrets.
 */

export type SymbolKind = "COMPONENT" | "FUNCTION" | "TYPE";

export type EdgeScope = "in-repo" | "cross-repo";

export type SymbolNode = {
  id: string;
  label: string;
  kind: SymbolKind;
  repo: string;
  file: string;
  sig: string;
  /** Node card top-left inside the 820×420 graph canvas */
  x: number;
  y: number;
  /** Cross-repo references shown in the inspector */
  cross: Array<{ name: string; repo: string }>;
  /** In-repo call names (display strings) */
  local: string[];
};

export type SymbolEdge = {
  id: string;
  from: string;
  to: string;
  scope: EdgeScope;
};

export type RepoStatus = {
  id: string;
  label: string;
  status: "ready" | "indexing";
};

export type KindFilter = "all" | SymbolKind | "cross-repo";

export const KIND_COLOR: Record<SymbolKind, string> = {
  COMPONENT: "#2563eb",
  FUNCTION: "#16a34a",
  TYPE: "#9333ea",
};

export const CROSS_REPO_STROKE = "#b06a1a";
export const IN_REPO_STROKE = "#b4b4c4";

export const GRAPH_WIDTH = 820;
export const GRAPH_HEIGHT = 420;
export const NODE_W = 150;
export const NODE_H = 34;

export const INTEL_REPOS: RepoStatus[] = [
  { id: "web-app", label: "web-app", status: "ready" },
  { id: "api-service", label: "api-service", status: "ready" },
  { id: "shared-lib", label: "shared-lib", status: "indexing" },
];

/** Lane backgrounds: left offsets match the HTML comp. */
export const REPO_LANES = [
  { repo: "web-app", left: 0 },
  { repo: "api-service", left: 280 },
  { repo: "shared-lib", left: 560 },
] as const;

export const INTEL_NODES: SymbolNode[] = [
  {
    id: "HomeScreen",
    label: "HomeScreen",
    kind: "COMPONENT",
    repo: "web-app",
    file: "src/screens/Home.tsx",
    sig: "export function HomeScreen(): JSX.Element",
    x: 20,
    y: 70,
    cross: [],
    local: ["useCatalog()"],
  },
  {
    id: "useCatalog",
    label: "useCatalog()",
    kind: "FUNCTION",
    repo: "web-app",
    file: "src/hooks/useCatalog.ts",
    sig: "export function useCatalog(): Catalog",
    x: 90,
    y: 130,
    cross: [{ name: "CatalogRouter", repo: "api-service" }],
    local: ["fetchTitles()"],
  },
  {
    id: "fetchTitles",
    label: "fetchTitles()",
    kind: "FUNCTION",
    repo: "web-app",
    file: "src/api/titles.ts",
    sig: "async function fetchTitles(page: number): Promise<Title[]>",
    x: 20,
    y: 200,
    cross: [],
    local: ["DockView", "formatDuration()"],
  },
  {
    id: "DockView",
    label: "DockView",
    kind: "COMPONENT",
    repo: "web-app",
    file: "src/components/DockView.tsx",
    sig: "export function DockView(props: DockProps)",
    x: 90,
    y: 270,
    cross: [{ name: "TitleModel", repo: "api-service" }],
    local: ["formatDuration()"],
  },
  {
    id: "formatDuration",
    label: "formatDuration()",
    kind: "FUNCTION",
    repo: "web-app",
    file: "src/utils/time.ts",
    sig: "export function formatDuration(ms: number): string",
    x: 20,
    y: 340,
    cross: [{ name: "db.query()", repo: "api-service" }],
    local: ["called by fetchTitles()", "called by DockView"],
  },
  {
    id: "CatalogRouter",
    label: "CatalogRouter",
    kind: "COMPONENT",
    repo: "api-service",
    file: "routes/catalog.ts",
    sig: "export const CatalogRouter: Router",
    x: 300,
    y: 90,
    cross: [
      { name: "useCatalog()", repo: "web-app" },
      { name: "Duration", repo: "shared-lib" },
    ],
    local: ["listTitles()"],
  },
  {
    id: "listTitles",
    label: "listTitles()",
    kind: "FUNCTION",
    repo: "api-service",
    file: "services/titles.ts",
    sig: "export async function listTitles(q: TitleQuery)",
    x: 370,
    y: 160,
    cross: [{ name: "formatTime()", repo: "shared-lib" }],
    local: ["TitleModel"],
  },
  {
    id: "TitleModel",
    label: "TitleModel",
    kind: "TYPE",
    repo: "api-service",
    file: "models/title.ts",
    sig: "export interface TitleModel { id: string; runtime: Duration }",
    x: 300,
    y: 230,
    cross: [{ name: "DockView", repo: "web-app" }],
    local: ["db.query()"],
  },
  {
    id: "dbquery",
    label: "db.query()",
    kind: "FUNCTION",
    repo: "api-service",
    file: "db/index.ts",
    sig: "query<T>(sql: string, params?: unknown[]): Promise<T[]>",
    x: 370,
    y: 320,
    cross: [
      { name: "formatDuration()", repo: "web-app" },
      { name: "retry()", repo: "shared-lib" },
    ],
    local: ["called by TitleModel"],
  },
  {
    id: "Duration",
    label: "Duration",
    kind: "TYPE",
    repo: "shared-lib",
    file: "src/time/duration.ts",
    sig: "export type Duration = { ms: number }",
    x: 580,
    y: 70,
    cross: [{ name: "CatalogRouter", repo: "api-service" }],
    local: ["formatTime()"],
  },
  {
    id: "formatTime",
    label: "formatTime()",
    kind: "FUNCTION",
    repo: "shared-lib",
    file: "src/time/format.ts",
    sig: "export function formatTime(d: Duration): string",
    x: 650,
    y: 130,
    cross: [{ name: "listTitles()", repo: "api-service" }],
    local: ["Logger"],
  },
  {
    id: "Logger",
    label: "Logger",
    kind: "COMPONENT",
    repo: "shared-lib",
    file: "src/log/logger.ts",
    sig: "export class Logger",
    x: 580,
    y: 200,
    cross: [],
    local: ["retry()", "Config"],
  },
  {
    id: "retry",
    label: "retry()",
    kind: "FUNCTION",
    repo: "shared-lib",
    file: "src/net/retry.ts",
    sig: "export function retry<T>(fn: () => Promise<T>, n = 3)",
    x: 650,
    y: 270,
    cross: [{ name: "db.query()", repo: "api-service" }],
    local: ["Config"],
  },
  {
    id: "Config",
    label: "Config",
    kind: "TYPE",
    repo: "shared-lib",
    file: "src/config.ts",
    sig: "export interface Config { retries: number }",
    x: 580,
    y: 340,
    cross: [],
    local: ["called by Logger", "called by retry()"],
  },
];

export const INTEL_EDGES: SymbolEdge[] = [
  // web-app in-repo
  { id: "e1", from: "HomeScreen", to: "useCatalog", scope: "in-repo" },
  { id: "e2", from: "useCatalog", to: "fetchTitles", scope: "in-repo" },
  { id: "e3", from: "fetchTitles", to: "DockView", scope: "in-repo" },
  { id: "e4", from: "fetchTitles", to: "formatDuration", scope: "in-repo" },
  { id: "e5", from: "DockView", to: "formatDuration", scope: "in-repo" },
  // api-service in-repo
  { id: "e6", from: "CatalogRouter", to: "listTitles", scope: "in-repo" },
  { id: "e7", from: "listTitles", to: "TitleModel", scope: "in-repo" },
  { id: "e8", from: "TitleModel", to: "dbquery", scope: "in-repo" },
  // shared-lib in-repo
  { id: "e9", from: "Duration", to: "formatTime", scope: "in-repo" },
  { id: "e10", from: "formatTime", to: "Logger", scope: "in-repo" },
  { id: "e11", from: "Logger", to: "retry", scope: "in-repo" },
  { id: "e12", from: "Logger", to: "Config", scope: "in-repo" },
  { id: "e13", from: "retry", to: "Config", scope: "in-repo" },
  // cross-repo (dashed brown)
  { id: "c1", from: "useCatalog", to: "CatalogRouter", scope: "cross-repo" },
  { id: "c2", from: "DockView", to: "TitleModel", scope: "cross-repo" },
  { id: "c3", from: "formatDuration", to: "dbquery", scope: "cross-repo" },
  { id: "c4", from: "CatalogRouter", to: "Duration", scope: "cross-repo" },
  { id: "c5", from: "listTitles", to: "formatTime", scope: "cross-repo" },
  { id: "c6", from: "dbquery", to: "retry", scope: "cross-repo" },
];

export const DEFAULT_SELECTED_ID = "formatDuration";

export function nodeById(id: string): SymbolNode | undefined {
  return INTEL_NODES.find((n) => n.id === id);
}

export function nodeCenter(n: SymbolNode): { cx: number; cy: number } {
  return { cx: n.x + NODE_W / 2, cy: n.y + NODE_H / 2 };
}

export function filterNodes(filter: KindFilter): SymbolNode[] {
  if (filter === "all") return INTEL_NODES;
  if (filter === "cross-repo") {
    const ids = new Set<string>();
    for (const e of INTEL_EDGES) {
      if (e.scope === "cross-repo") {
        ids.add(e.from);
        ids.add(e.to);
      }
    }
    return INTEL_NODES.filter((n) => ids.has(n.id));
  }
  return INTEL_NODES.filter((n) => n.kind === filter);
}

export function filterEdges(filter: KindFilter, visibleIds: Set<string>): SymbolEdge[] {
  return INTEL_EDGES.filter((e) => {
    if (!visibleIds.has(e.from) || !visibleIds.has(e.to)) return false;
    if (filter === "cross-repo") return e.scope === "cross-repo";
    return true;
  });
}

export function graphSummary(): string {
  const calls = INTEL_EDGES.filter((e) => e.scope === "in-repo").length;
  const cross = INTEL_EDGES.filter((e) => e.scope === "cross-repo").length;
  return `${INTEL_NODES.length} symbols, ${calls} calls, ${cross} cross-repo references.`;
}

/** Ensure fixtures never carry secret-like fields (FE-142 / FE-172 stay closed). */
export function assertNoSecretFields(blob: unknown): void {
  const text = JSON.stringify(blob).toLowerCase();
  if (text.includes("client_secret") || text.includes("password") || text.includes("hmac")) {
    throw new Error("intelligence fixtures must not include secret fields");
  }
}
