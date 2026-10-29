/**
 * ADR-008 / PBI-011 — accept binds to exact commit SHA.
 * Rewrite invalidates prior accept. Agent/self never accepts.
 */

export type CheckConclusion = "success" | "failure" | "neutral" | "cancelled" | "skipped" | "timed_out" | "action_required" | null;

export type CheckRunSummary = {
  name: string;
  status: "queued" | "in_progress" | "completed";
  conclusion: CheckConclusion;
  /** Commit SHA this check ran against (must equal candidate). */
  headSha: string;
};

export type AcceptActor = "cockpit" | "human";

export type AcceptRecord = {
  sha: string;
  acceptedAt: string;
  actor: AcceptActor;
  requiredChecks: string[];
  evidenceRef?: string;
};

export type AcceptEvaluateInput = {
  sha: string;
  requiredChecks: string[];
  checks: CheckRunSummary[];
  /** Prior accept for any SHA in this delivery (if tip rewrote). */
  priorAccept?: AcceptRecord | null;
};

export type AcceptDenyReason =
  | "empty_sha"
  | "missing_required_checks"
  | "failed_required_checks"
  | "incomplete_required_checks"
  | "check_sha_mismatch"
  | "prior_accept_stale_after_rewrite"
  | "agent_self_accept_forbidden";

export type AcceptEvaluateResult =
  | { ok: true; sha: string; greenChecks: string[] }
  | { ok: false; sha: string; reason: AcceptDenyReason; detail?: string };

const FORBIDDEN_ACTORS = new Set(["agent", "canvas", "self", "cursor", "coding"]);

export function isForbiddenAcceptActor(actor: string): boolean {
  return FORBIDDEN_ACTORS.has(actor.trim().toLowerCase());
}

/**
 * Evaluate whether Port may accept delivery for exact SHA `sha`.
 * Does not mutate Port. Cockpit/human still perform the governance accept.
 */
export function evaluateAcceptOnSha(input: AcceptEvaluateInput): AcceptEvaluateResult {
  const sha = input.sha.trim().toLowerCase();
  if (!sha || !/^[0-9a-f]{7,40}$/.test(sha)) {
    return { ok: false, sha: input.sha, reason: "empty_sha" };
  }

  if (input.priorAccept && input.priorAccept.sha.toLowerCase() !== sha) {
    return {
      ok: false,
      sha,
      reason: "prior_accept_stale_after_rewrite",
      detail: `prior_accept=${input.priorAccept.sha} tip=${sha}`,
    };
  }

  const byName = new Map<string, CheckRunSummary>();
  for (const check of input.checks) {
    if (check.headSha.toLowerCase() !== sha) {
      return {
        ok: false,
        sha,
        reason: "check_sha_mismatch",
        detail: `${check.name}@${check.headSha}`,
      };
    }
    byName.set(check.name, check);
  }

  const missing: string[] = [];
  const failed: string[] = [];
  const incomplete: string[] = [];
  const green: string[] = [];

  for (const name of input.requiredChecks) {
    const run = byName.get(name);
    if (!run) {
      missing.push(name);
      continue;
    }
    if (run.status !== "completed") {
      incomplete.push(name);
      continue;
    }
    if (run.conclusion !== "success") {
      failed.push(name);
      continue;
    }
    green.push(name);
  }

  if (missing.length) {
    return {
      ok: false,
      sha,
      reason: "missing_required_checks",
      detail: missing.join(","),
    };
  }
  if (incomplete.length) {
    return {
      ok: false,
      sha,
      reason: "incomplete_required_checks",
      detail: incomplete.join(","),
    };
  }
  if (failed.length) {
    return {
      ok: false,
      sha,
      reason: "failed_required_checks",
      detail: failed.join(","),
    };
  }

  return { ok: true, sha, greenChecks: green };
}

/**
 * In-memory accept ledger: one active accept per delivery key.
 * Recording a new tip SHA after rewrite replaces and invalidates the prior.
 */
export class AcceptLedger {
  #byDelivery = new Map<string, AcceptRecord>();

  get(deliveryKey: string): AcceptRecord | undefined {
    return this.#byDelivery.get(deliveryKey);
  }

  /**
   * Record Port-governed accept evidence. Refuses agent/self actors.
   * Caller must already have `evaluateAcceptOnSha` ok for `sha`.
   */
  record(opts: {
    deliveryKey: string;
    sha: string;
    actor: string;
    requiredChecks: string[];
    evidenceRef?: string;
  }): { ok: true; record: AcceptRecord } | { ok: false; reason: AcceptDenyReason } {
    if (isForbiddenAcceptActor(opts.actor) || (opts.actor !== "cockpit" && opts.actor !== "human")) {
      return { ok: false, reason: "agent_self_accept_forbidden" };
    }
    const prior = this.#byDelivery.get(opts.deliveryKey);
    if (prior && prior.sha.toLowerCase() !== opts.sha.toLowerCase()) {
      // Tip rewrote — prior accept is stale; allow fresh record only after re-eval.
      this.#byDelivery.delete(opts.deliveryKey);
    }
    const record: AcceptRecord = {
      sha: opts.sha.toLowerCase(),
      acceptedAt: new Date().toISOString(),
      actor: opts.actor as AcceptActor,
      requiredChecks: [...opts.requiredChecks],
    };
    if (opts.evidenceRef) record.evidenceRef = opts.evidenceRef;
    this.#byDelivery.set(opts.deliveryKey, record);
    return { ok: true, record };
  }

  /** True iff an accept exists and still matches tip SHA (rewrite → false). */
  isValidForTip(deliveryKey: string, tipSha: string): boolean {
    const rec = this.#byDelivery.get(deliveryKey);
    if (!rec) return false;
    return rec.sha.toLowerCase() === tipSha.trim().toLowerCase();
  }

  invalidate(deliveryKey: string): void {
    this.#byDelivery.delete(deliveryKey);
  }
}

/** Default Meta required check for day-to-day accept gate (ADR-008). */
export const META_ALWAYS_REQUIRED_CHECKS = ["meta-ci-presence"] as const;
