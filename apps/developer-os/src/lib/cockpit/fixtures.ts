/** Static Cockpit home fixtures — presentation only; no Port writes. */

export type AssemblyCard = {
  id: string;
  entity: string;
  blueprintColor: string;
  pill: string;
  pillColor: string;
  pillBg: string;
  title: string;
  line: string;
  agent: string;
  href: string;
  segments: Array<{ label: string; width: string; color: string; labelColor: string }>;
};

export type AppTile = {
  id: string;
  name: string;
  href: string;
  glow: string;
  badge?: string;
  monogram: string;
};

export const HERO = {
  blueprint: "service",
  name: "factory-gateway",
  statusLabel: "Healthy",
  statusColor: "#30d158",
  owner: "Meta · Port Context Lake",
  tier: "Production",
  tierColor: "#86efac",
  tierBg: "rgba(48, 209, 88, 0.16)",
  meta: "Thin Port → Rivet admit path. Read-only lake projection — no schema upserts from this chrome.",
  fails: [] as string[],
} as const;

export const ASSEMBLY: AssemblyCard[] = [
  {
    id: "fe-195",
    entity: "developer-os · Atlas v5",
    blueprintColor: "#0a84ff",
    pill: "Building",
    pillColor: "#a8e6ff",
    pillBg: "rgba(10, 132, 255, 0.18)",
    title: "Atlas v5 lake table · ⌘K command palette",
    line: "Assembly · UI chrome",
    agent: "cursor-atlas",
    href: "/atlas",
    segments: [
      { label: "Spec", width: "100%", color: "#30d158", labelColor: "rgba(235,240,250,.66)" },
      { label: "Build", width: "75%", color: "#0a84ff", labelColor: "#a8e6ff" },
      { label: "Review", width: "0%", color: "transparent", labelColor: "rgba(235,240,250,.4)" },
      { label: "CI", width: "0%", color: "transparent", labelColor: "rgba(235,240,250,.4)" },
      { label: "Accept", width: "0%", color: "transparent", labelColor: "rgba(235,240,250,.4)" },
    ],
  },
  {
    id: "fe-193",
    entity: "developer-os · STL-219",
    blueprintColor: "#30d158",
    pill: "Accepted",
    pillColor: "#86efac",
    pillBg: "rgba(48, 209, 88, 0.16)",
    title: "Cockpit v3 shell · Factory home — #99",
    line: "Assembly · UI chrome",
    agent: "cursor-devos",
    href: "/",
    segments: [
      { label: "Spec", width: "100%", color: "#30d158", labelColor: "rgba(235,240,250,.66)" },
      { label: "Build", width: "100%", color: "#30d158", labelColor: "rgba(235,240,250,.66)" },
      { label: "Review", width: "100%", color: "#30d158", labelColor: "rgba(235,240,250,.66)" },
      { label: "CI", width: "100%", color: "#30d158", labelColor: "rgba(235,240,250,.66)" },
      { label: "Accept", width: "100%", color: "#30d158", labelColor: "rgba(235,240,250,.66)" },
    ],
  },
  {
    id: "session-demo",
    entity: "rivet · AgentSession",
    blueprintColor: "#bf5af2",
    pill: "Live",
    pillColor: "#e9d5ff",
    pillBg: "rgba(191, 90, 242, 0.18)",
    title: "Session stream demo — Rivet-native reconnect",
    line: "Execution · no Sandbox from browser",
    agent: "rivet-demo",
    href: "/session/demo",
    segments: [
      { label: "Spec", width: "100%", color: "#30d158", labelColor: "rgba(235,240,250,.66)" },
      { label: "Build", width: "100%", color: "#30d158", labelColor: "rgba(235,240,250,.66)" },
      { label: "Review", width: "100%", color: "#30d158", labelColor: "rgba(235,240,250,.66)" },
      { label: "CI", width: "40%", color: "#bf5af2", labelColor: "#e9d5ff" },
      { label: "Accept", width: "0%", color: "transparent", labelColor: "rgba(235,240,250,.4)" },
    ],
  },
];

export const APPS: AppTile[] = [
  { id: "port", name: "Port", href: "/api/auth/port/login", glow: "rgba(22, 163, 74, 0.45)", monogram: "P" },
  { id: "atlas", name: "Code Atlas", href: "/atlas", glow: "rgba(10, 132, 255, 0.4)", monogram: "A" },
  { id: "github", name: "GitHub", href: "https://github.com/mplsjohnnycage/factory", glow: "rgba(255, 255, 255, 0.2)", monogram: "G" },
  { id: "vercel", name: "Vercel", href: "https://factory-developer-os.vercel.app", glow: "rgba(255, 255, 255, 0.18)", monogram: "▲" },
  { id: "rivet", name: "Rivet", href: "/session/demo", glow: "rgba(191, 90, 242, 0.35)", monogram: "R" },
  { id: "add", name: "Add", href: "#", glow: "rgba(255, 255, 255, 0.08)", monogram: "+" },
];

/** Simplified constellation nodes for the Context Lake field. */
export const CONSTELLATION = [
  { x: 62, y: 28, s: 10, c: "#0a84ff", op: 0.95, label: "factory-gateway" },
  { x: 74, y: 42, s: 7, c: "#30d158", op: 0.85, label: "project-supervisor" },
  { x: 48, y: 48, s: 8, c: "#bf5af2", op: 0.8, label: "sandbox-harness" },
  { x: 82, y: 22, s: 6, c: "#64d2ff", op: 0.7 },
  { x: 58, y: 18, s: 5, c: "#ff9f0a", op: 0.65 },
  { x: 70, y: 58, s: 6, c: "#0a84ff", op: 0.55 },
  { x: 88, y: 48, s: 5, c: "#30d158", op: 0.5 },
  { x: 42, y: 32, s: 4, c: "#bf5af2", op: 0.45 },
  { x: 78, y: 68, s: 4, c: "#64d2ff", op: 0.4 },
] as const;
