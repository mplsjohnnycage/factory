/**
 * Code Atlas v5 lake fixtures — presentation only.
 * Prefer fixtures over live Port; no upserts / secrets (FE-142/FE-172 CLOSED).
 */

export type LakeBlueprint =
  | "service"
  | "api"
  | "package"
  | "deploy"
  | "env"
  | "incident"
  | "db"
  | "container"
  | "team";

export type LakeStatusTone = "ok" | "warn" | "err" | "muted" | "info";

export type LakeEntity = {
  id: string;
  bp: LakeBlueprint;
  name: string;
  owner?: string;
  status: string;
  tone: LakeStatusTone;
  sub: string;
  props: Array<[string, string]>;
  rels: string[];
  rules?: Array<[string, 0 | 1, string?]>;
  acts: Array<[string, string, string]>;
  codeRepo?: string;
};

export type LakeSideFilter = "all" | "attention" | LakeBlueprint;

export type PaletteItem = {
  id: string;
  group: string;
  label: string;
  sub: string;
  kind: "entity" | "view" | "nav" | "symbol";
  /** entity id or view id */
  target: string;
  color: string;
  radius: "2px" | "50%";
  mono?: boolean;
};

export const BP_META: Record<
  LakeBlueprint,
  { label: string; plural: string; color: string }
> = {
  service: { label: "Service", plural: "Services", color: "#2f6fe0" },
  api: { label: "API", plural: "APIs", color: "#0f9a8c" },
  package: { label: "Package", plural: "Packages", color: "#b06a1a" },
  deploy: { label: "Deployment", plural: "Deployments", color: "#1c1e22" },
  env: { label: "Environment", plural: "Environments", color: "#8a909a" },
  incident: { label: "Incident", plural: "Incidents", color: "#d0393e" },
  db: { label: "Database", plural: "Databases", color: "#1f9d55" },
  container: { label: "Container", plural: "Containers", color: "#1d63ed" },
  team: { label: "Team", plural: "Teams", color: "#5e6ad2" },
};

export const TONE_COLOR: Record<LakeStatusTone, string> = {
  ok: "#1f9d55",
  warn: "#c27a00",
  err: "#d0393e",
  muted: "#6b717c",
  info: "#2f6fe0",
};

export const TIER_STYLE = {
  Gold: { c: "#8a5a00", bg: "rgba(194,122,0,.16)", bar: "#c27a00" },
  Silver: { c: "#4a505a", bg: "rgba(107,113,124,.15)", bar: "#8a909a" },
  Bronze: { c: "#8a4b16", bg: "rgba(176,106,26,.14)", bar: "#b06a1a" },
  Basic: { c: "#b3262b", bg: "rgba(208,57,62,.1)", bar: "#d0393e" },
} as const;

export type LakeTier = keyof typeof TIER_STYLE;

/** Factory Meta Context Lake entities (fixture). */
export const LAKE_ENTITIES: LakeEntity[] = [
  {
    id: "svc-gateway",
    bp: "service",
    name: "factory-gateway",
    owner: "team-meta",
    status: "Healthy",
    tone: "ok",
    sub: "apps/factory-gateway",
    props: [
      ["Repo", "mplsjohnnycage/factory"],
      ["Language", "TypeScript"],
      ["Tier", "1 · control plane"],
      ["Path", "apps/factory-gateway"],
    ],
    rels: ["api-admit", "dep-gateway-prod", "db-beads", "ctr-gateway", "team-meta"],
    rules: [
      ["Has owner", 1],
      ["README present", 1],
      ["On-call rotation", 1],
      ["CI passing on main", 1],
      ["Internal deps current", 1],
      ["Runbook linked", 1],
    ],
    acts: [
      ["GitHub", "CI green on e4542ba · Cockpit v3", "12m"],
      ["Port", "Context Lake projection healthy", "5m"],
      ["Docker", "gateway health :8787 ok", "2m"],
    ],
    codeRepo: "factory",
  },
  {
    id: "svc-supervisor",
    bp: "service",
    name: "project-supervisor",
    owner: "team-meta",
    status: "Healthy",
    tone: "ok",
    sub: "apps/project-supervisor",
    props: [
      ["Repo", "mplsjohnnycage/factory"],
      ["Language", "TypeScript"],
      ["Admit", "Meta Beads ready ∨ audited bypass"],
      ["Runtime", "Rivet ProjectSupervisor"],
    ],
    rels: ["svc-gateway", "svc-sandbox", "team-meta"],
    rules: [
      ["Has owner", 1],
      ["README present", 1],
      ["On-call rotation", 1],
      ["CI passing on main", 1],
      ["Internal deps current", 1],
      ["Runbook linked", 0, "admit dry-run kit only"],
    ],
    acts: [
      ["Beads", "bd ready mirrored to notes Queued", "18m"],
      ["Rivet", "Supervisor actor warm", "4m"],
    ],
    codeRepo: "factory",
  },
  {
    id: "svc-sandbox",
    bp: "service",
    name: "sandbox-harness",
    owner: "team-meta",
    status: "Guarded",
    tone: "info",
    sub: "apps/sandbox-harness",
    props: [
      ["Repo", "mplsjohnnycage/factory"],
      ["Language", "TypeScript"],
      ["Rule", "NEVER from browser"],
      ["Runtime", "Docker sandbox"],
    ],
    rels: ["svc-supervisor", "ctr-sandbox", "team-meta"],
    rules: [
      ["Has owner", 1],
      ["README present", 1],
      ["Browser fence documented", 1],
      ["CI passing on main", 1],
      ["Internal deps current", 1],
      ["Runbook linked", 1],
    ],
    acts: [
      ["Docker", "Harness image build kit PASS", "1h"],
      ["Linear", "FE-175 CLOSED · harness readiness", "2d"],
    ],
    codeRepo: "factory",
  },
  {
    id: "svc-devos",
    bp: "service",
    name: "developer-os",
    owner: "team-meta",
    status: "Building",
    tone: "warn",
    sub: "apps/developer-os",
    props: [
      ["Repo", "mplsjohnnycage/factory"],
      ["Language", "TypeScript · Next.js"],
      ["Surface", "Cockpit v3 · Atlas v5"],
      ["Host", "factory-developer-os.vercel.app"],
    ],
    rels: [
      "api-atlas-subgraph",
      "dep-devos-preview",
      "pkg-atlas",
      "team-meta",
      "inc-ui-slice",
    ],
    rules: [
      ["Has owner", 1],
      ["README present", 1],
      ["On-call rotation", 0],
      ["CI passing on main", 1],
      ["Design comps locked", 1],
      ["Runbook linked", 0],
    ],
    acts: [
      ["Vercel", "Preview building · Atlas v5 lake", "1m"],
      ["GitHub", "PR open · FE-195", "3m"],
      ["Linear", "STL-219 Atlas lake / ⌘K In Progress", "20m"],
    ],
    codeRepo: "factory",
  },
  {
    id: "api-admit",
    bp: "api",
    name: "POST /admit",
    owner: "team-meta",
    status: "p95 42 ms",
    tone: "ok",
    sub: "factory-gateway",
    props: [
      ["Service", "factory-gateway"],
      ["Auth", "HMAC · Port contract"],
      ["Calls / min", "fixture"],
    ],
    rels: ["svc-gateway"],
    acts: [["Port", "Admit contract read-only from Dev OS", "1h"]],
  },
  {
    id: "api-atlas-subgraph",
    bp: "api",
    name: "GET /api/atlas/subgraph",
    owner: "team-meta",
    status: "Fixture OK",
    tone: "ok",
    sub: "developer-os BFF",
    props: [
      ["Service", "developer-os"],
      ["Overlays", "beads · polygraph · graft · langfuse"],
      ["Cap", "viewport-bounded"],
    ],
    rels: ["svc-devos", "pkg-atlas"],
    acts: [["Dev OS", "Anonymous fixture graph served", "8m"]],
  },
  {
    id: "pkg-atlas",
    bp: "package",
    name: "@factory/atlas-projection",
    owner: "team-meta",
    status: "STL-154 live",
    tone: "ok",
    sub: "src/lib/atlas",
    props: [
      ["Path", "apps/developer-os/src/lib/atlas"],
      ["Joins", "unknown stay unknown"],
      ["Tools", "atlas.* MCP list"],
    ],
    rels: ["svc-devos", "api-atlas-subgraph"],
    acts: [["GitHub", "Four-overlay projection tests green", "2h"]],
  },
  {
    id: "dep-gateway-prod",
    bp: "deploy",
    name: "factory-gateway · main",
    owner: "team-meta",
    status: "Ready",
    tone: "ok",
    sub: "Docker · Tailscale Serve",
    props: [
      ["Branch", "main"],
      ["Via", "compose + Serve"],
      ["SHA", "e4542ba"],
    ],
    rels: ["env-prod", "svc-gateway"],
    acts: [["Docker", "Health check passing", "6m"]],
  },
  {
    id: "dep-devos-preview",
    bp: "deploy",
    name: "developer-os · atlas-v5",
    owner: "team-meta",
    status: "Building",
    tone: "warn",
    sub: "Vercel preview",
    props: [
      ["Branch", "cursor/atlas-v5-lake-command-palette-a08b"],
      ["Via", "Vercel"],
      ["Ticket", "FE-195"],
    ],
    rels: ["env-prev", "svc-devos"],
    acts: [["Vercel", "Build running · Atlas lake slice", "1m"]],
  },
  {
    id: "env-prod",
    bp: "env",
    name: "Production",
    owner: "team-meta",
    status: "Healthy",
    tone: "ok",
    sub: "iad · Tailscale",
    props: [
      ["Region", "iad"],
      ["Plane", "Port · Rivet · Gateway"],
    ],
    rels: [],
    acts: [["Port", "Catalog SoT reachable", "4m"]],
  },
  {
    id: "env-prev",
    bp: "env",
    name: "Preview",
    owner: "team-meta",
    status: "Healthy",
    tone: "ok",
    sub: "One per branch",
    props: [["Scope", "Vercel preview hosts"]],
    rels: [],
    acts: [],
  },
  {
    id: "inc-ui-slice",
    bp: "incident",
    name: "Atlas lake deferred after Cockpit",
    owner: "team-meta",
    status: "SEV3 · tracking",
    tone: "muted",
    sub: "FE-193 follow-up → FE-195",
    props: [
      ["Opened", "After #99 merge"],
      ["Impact", "Atlas stayed hero stub"],
      ["Fix", "Lake table + ⌘K this PR"],
    ],
    rels: ["svc-devos"],
    acts: [["Linear", "FE-195 claimed for Atlas v5 lake", "30m"]],
  },
  {
    id: "db-beads",
    bp: "db",
    name: "meta-beads",
    owner: "team-meta",
    status: "Synced",
    tone: "ok",
    sub: "refs/dolt/data",
    props: [
      ["Provider", "Beads Dolt"],
      ["Prefix", "factory-"],
      ["Layout", "hybrid · embeddeddolt gitignored"],
    ],
    rels: ["svc-supervisor"],
    acts: [["Beads", "Server SoT preferred · local bd optional", "1h"]],
  },
  {
    id: "ctr-gateway",
    bp: "container",
    name: "factory-gateway",
    owner: "team-meta",
    status: "Running",
    tone: "ok",
    sub: "compose",
    props: [
      ["Image", "factory-gateway:local"],
      ["Port", "8787"],
    ],
    rels: ["svc-gateway"],
    acts: [["Docker", "Health check passing", "2m"]],
  },
  {
    id: "ctr-sandbox",
    bp: "container",
    name: "sandbox-agent",
    owner: "team-meta",
    status: "Idle",
    tone: "info",
    sub: "Docker only via Rivet",
    props: [
      ["Fence", "No browser invoke"],
      ["Host", "sandbox-harness"],
    ],
    rels: ["svc-sandbox"],
    acts: [],
  },
  {
    id: "team-meta",
    bp: "team",
    name: "Factory Meta",
    status: "Lane · meta only",
    tone: "info",
    sub: "Linear · Beads · Port",
    props: [
      ["Board", "Factory Meta"],
      ["Beads", "factory- prefix"],
      ["Rule", "No Product Beads"],
    ],
    rels: [],
    acts: [["Linear", "FE-195 Atlas UI slice In Progress", "today"]],
  },
];

export function tierFor(entity: LakeEntity): LakeTier | null {
  if (!entity.rules?.length) return null;
  const pass = entity.rules.filter((r) => r[1]).length / entity.rules.length;
  if (pass === 1) return "Gold";
  if (pass >= 0.7) return "Silver";
  if (pass >= 0.5) return "Bronze";
  return "Basic";
}

export function needsAttention(entity: LakeEntity): boolean {
  return entity.tone === "err" || (entity.tone === "warn" && entity.status !== "Building");
}

export function entityById(id: string): LakeEntity | undefined {
  return LAKE_ENTITIES.find((e) => e.id === id);
}

export function ownerName(entity: LakeEntity): string {
  if (!entity.owner) return "—";
  return entityById(entity.owner)?.name ?? entity.owner;
}

export function buildPaletteItems(): PaletteItem[] {
  const entities: PaletteItem[] = LAKE_ENTITIES.map((e) => ({
    id: `ent:${e.id}`,
    group: "Entities",
    label: e.name,
    sub: `${BP_META[e.bp].label} · ${e.status}`,
    kind: "entity",
    target: e.id,
    color: BP_META[e.bp].color,
    radius: "2px",
  }));

  const views: PaletteItem[] = [
    {
      id: "view:lake",
      group: "Views",
      label: "Lake",
      sub: "Catalog · activity stream",
      kind: "view",
      target: "lake",
      color: "#1c1e22",
      radius: "50%",
    },
    {
      id: "view:map",
      group: "Views",
      label: "Map",
      sub: "Four-overlay symbol graph",
      kind: "view",
      target: "map",
      color: "#2f6fe0",
      radius: "50%",
    },
    {
      id: "view:knowledge",
      group: "Views",
      label: "Knowledge",
      sub: "Deferred to FE-196 Intelligence",
      kind: "view",
      target: "knowledge",
      color: "#5e6ad2",
      radius: "50%",
    },
  ];

  const nav: PaletteItem[] = [
    {
      id: "nav:home",
      group: "Navigate",
      label: "Cockpit home",
      sub: "Factory dark shell",
      kind: "nav",
      target: "/",
      color: "#16a34a",
      radius: "50%",
    },
    {
      id: "nav:session",
      group: "Navigate",
      label: "Session demo",
      sub: "Rivet-native stream",
      kind: "nav",
      target: "/session/demo",
      color: "#bf5af2",
      radius: "50%",
    },
  ];

  const symbols: PaletteItem[] = [
    {
      id: "sym:AtlasHero",
      group: "Symbols",
      label: "AtlasHero",
      sub: "apps/developer-os · component",
      kind: "symbol",
      target: "svc-devos",
      color: "#2f6fe0",
      radius: "2px",
      mono: true,
    },
    {
      id: "sym:projectSubgraph",
      group: "Symbols",
      label: "projectSubgraph()",
      sub: "lib/atlas/projection · function",
      kind: "symbol",
      target: "pkg-atlas",
      color: "#1f9d55",
      radius: "2px",
      mono: true,
    },
    {
      id: "sym:CockpitShell",
      group: "Symbols",
      label: "CockpitShell",
      sub: "apps/developer-os · component",
      kind: "symbol",
      target: "svc-devos",
      color: "#2f6fe0",
      radius: "2px",
      mono: true,
    },
  ];

  return [...views, ...nav, ...entities, ...symbols];
}

export const LAKE_SUMMARY = `${LAKE_ENTITIES.length} entities · fixture lake · no Port writes`;
