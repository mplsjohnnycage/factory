/**
 * OpenFleet ceilings (PBI-012 / security-blast-radius).
 *
 * Ceiling keys: approvals, budget, depth, fan_out, hosts, until.
 * Over-ceiling spawn must refuse and ledger `ceiling.refuse`.
 * Ceiling narrows only — never widen on spawn.
 */

export type ApprovalsMode = "native" | "bypass";

export type OpenFleetCeiling = {
  /** Most a member may run with: native (engine prompts stand) or bypass. */
  approvals?: ApprovalsMode;
  /**
   * Spend cap. Forms: `"<amount> <ISO4217>"`, CAIP-19 asset id, or `"<n> tokens"`.
   * Absent = uncapped.
   */
  budget?: string;
  /** Deepest member allowed (root = 0). Absent = 1. */
  depth?: number;
  /** Max members one swarm may hold. Absent = engine default (treated as uncapped here). */
  fan_out?: number;
  /** Hostnames members may run on. Absent = host the ceiling was set on. */
  hosts?: string[];
  /** ISO 8601 UTC after which members under this ceiling must stop. */
  until?: string;
};

export type CeilingRefuseReason =
  | "depth"
  | "fan_out"
  | "hosts"
  | "until"
  | "approvals"
  | "budget";

export type SpawnCeilingInput = {
  /** Effective ceiling for the proposed member (already merged fleet∩swarm). */
  ceiling: OpenFleetCeiling;
  /** Depth the proposed member would sit at (parent depth + 1 for swarm members). */
  proposedDepth: number;
  /** Current live/queued members already in this swarm (before this spawn). */
  currentSwarmMembers: number;
  /** Hostname the proposed member would run on. */
  host: string;
  /** Approvals mode the proposed member would start with. */
  approvals: ApprovalsMode;
  /**
   * Spend already attributed under this ceiling (from member.spend), in the
   * same numeric unit as `proposedSpend` / ceiling.budget amount.
   */
  spendSoFar?: number;
  /** Additional spend this spawn would immediately attribute (optional). */
  proposedSpend?: number;
  /** Wall clock for `until` checks (defaults to now). */
  now?: Date;
};

export type SpawnCeilingOk = { ok: true };
export type SpawnCeilingRefuse = {
  ok: false;
  reason: CeilingRefuseReason;
  detail: string;
};
export type SpawnCeilingResult = SpawnCeilingOk | SpawnCeilingRefuse;

const DEFAULT_DEPTH = 1;

/** Parse leading numeric amount from a budget string (`"100 USD"`, `"5000 tokens"`). */
export function parseBudgetAmount(budget: string): number | null {
  const m = budget.trim().match(/^([0-9]+(?:\.[0-9]+)?)\b/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

/**
 * Evaluate whether a proposed spawn is allowed under the effective ceiling.
 * Does not mutate ledger — caller records `ceiling.refuse` on refuse.
 */
export function evaluateSpawnAgainstCeiling(
  input: SpawnCeilingInput,
): SpawnCeilingResult {
  const { ceiling } = input;
  const now = input.now ?? new Date();

  if (ceiling.until) {
    const untilMs = Date.parse(ceiling.until);
    if (!Number.isNaN(untilMs) && now.getTime() > untilMs) {
      return {
        ok: false,
        reason: "until",
        detail: `ceiling.until ${ceiling.until} has passed`,
      };
    }
  }

  const maxDepth = ceiling.depth ?? DEFAULT_DEPTH;
  if (input.proposedDepth > maxDepth) {
    return {
      ok: false,
      reason: "depth",
      detail: `proposed depth ${input.proposedDepth} exceeds ceiling.depth ${maxDepth}`,
    };
  }

  if (typeof ceiling.fan_out === "number") {
    if (input.currentSwarmMembers + 1 > ceiling.fan_out) {
      return {
        ok: false,
        reason: "fan_out",
        detail: `swarm would hold ${input.currentSwarmMembers + 1} members; ceiling.fan_out=${ceiling.fan_out}`,
      };
    }
  }

  if (ceiling.hosts && ceiling.hosts.length > 0) {
    const allowed = new Set(ceiling.hosts.map((h) => h.toLowerCase()));
    if (!allowed.has(input.host.trim().toLowerCase())) {
      return {
        ok: false,
        reason: "hosts",
        detail: `host ${input.host} not in ceiling.hosts [${ceiling.hosts.join(", ")}]`,
      };
    }
  }

  const ceilingApprovals: ApprovalsMode = ceiling.approvals ?? "native";
  if (input.approvals === "bypass" && ceilingApprovals !== "bypass") {
    return {
      ok: false,
      reason: "approvals",
      detail: "bypass approvals not allowed under ceiling.approvals=native",
    };
  }

  if (ceiling.budget) {
    const cap = parseBudgetAmount(ceiling.budget);
    if (cap !== null) {
      const spend =
        (input.spendSoFar ?? 0) + (input.proposedSpend ?? 0);
      if (spend > cap) {
        return {
          ok: false,
          reason: "budget",
          detail: `spend ${spend} would exceed ceiling.budget ${ceiling.budget}`,
        };
      }
    }
  }

  return { ok: true };
}

/**
 * Merge ceilings with narrow-only semantics.
 * Child may only tighten: lower depth/fan_out/budget amount, fewer hosts,
 * earlier until, approvals native⊂bypass (cannot introduce bypass if parent is native).
 */
export function mergeCeilingsNarrow(
  parent: OpenFleetCeiling,
  child: OpenFleetCeiling,
): OpenFleetCeiling {
  const out: OpenFleetCeiling = { ...parent };

  if (child.approvals !== undefined) {
    const parentMode = parent.approvals ?? "native";
    if (child.approvals === "bypass" && parentMode !== "bypass") {
      out.approvals = parentMode;
    } else {
      out.approvals = child.approvals;
    }
  }

  if (typeof child.depth === "number") {
    const parentDepth = parent.depth ?? DEFAULT_DEPTH;
    out.depth = Math.min(parentDepth, child.depth);
  }

  if (typeof child.fan_out === "number") {
    out.fan_out =
      typeof parent.fan_out === "number"
        ? Math.min(parent.fan_out, child.fan_out)
        : child.fan_out;
  }

  if (child.hosts) {
    if (parent.hosts && parent.hosts.length > 0) {
      const parentSet = new Set(parent.hosts.map((h) => h.toLowerCase()));
      out.hosts = child.hosts.filter((h) => parentSet.has(h.toLowerCase()));
    } else {
      out.hosts = [...child.hosts];
    }
  }

  if (child.until) {
    if (!parent.until) {
      out.until = child.until;
    } else {
      const p = Date.parse(parent.until);
      const c = Date.parse(child.until);
      out.until =
        !Number.isNaN(p) && !Number.isNaN(c) && c < p
          ? child.until
          : parent.until;
    }
  }

  if (child.budget) {
    if (!parent.budget) {
      out.budget = child.budget;
    } else {
      const pAmt = parseBudgetAmount(parent.budget);
      const cAmt = parseBudgetAmount(child.budget);
      if (pAmt !== null && cAmt !== null) {
        out.budget = cAmt < pAmt ? child.budget : parent.budget;
      } else {
        out.budget = child.budget;
      }
    }
  }

  return out;
}
