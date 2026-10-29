import { spawn } from "node:child_process";
import type { MetaBeadsGate } from "./meta-beads.js";
import type { ReadyTaskEvent } from "./types.js";

/**
 * Live Meta Beads adapter (factory-cvl / PBI-007 follow-on).
 *
 * Shells out to `bd` against the repo `.beads/` Dolt instance.
 * CI keeps using `MemoryMetaBeads` (no `bd` binary / no Dolt required).
 * Inject `BdRunner` in unit tests — never Product Beads.
 */

export const META_BEADS_ID_PREFIX = "factory-";

export type BdExecResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

export type BdRunner = {
  /** Run `bd` with args relative to the Meta Beads cwd. */
  run(args: string[], opts?: { actor?: string }): Promise<BdExecResult>;
};

export type BdIssue = {
  id: string;
  status?: string;
  assignee?: string | null;
  started_at?: string;
  updated_at?: string;
  created_at?: string;
  /** Optional Port EC binding when operators store it on the bead. */
  execution_contract_id?: string;
  metadata?: Record<string, unknown>;
};

export type BdMetaBeadsOptions = {
  /** Repo root that owns `.beads/` (Meta instance). */
  cwd: string;
  /** Injectable CLI (tests). Default: spawn `bdBin` in `cwd`. */
  runner?: BdRunner;
  /** Binary name or absolute path. Default: `bd`. */
  bdBin?: string;
  /** Allowed bead id prefix. Default: `factory-` (Meta only). */
  idPrefix?: string;
};

function parseIssueArray(stdout: string): BdIssue[] {
  const trimmed = stdout.trim();
  if (!trimmed) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (err) {
    throw new Error(
      `Meta Beads: failed to parse bd JSON: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
  if (Array.isArray(parsed)) {
    return parsed as BdIssue[];
  }
  if (parsed && typeof parsed === "object" && "id" in parsed) {
    return [parsed as BdIssue];
  }
  return [];
}

function createSpawnRunner(cwd: string, bdBin: string): BdRunner {
  return {
    run(args, opts) {
      const argv = opts?.actor
        ? ["--actor", opts.actor, ...args]
        : [...args];
      return new Promise<BdExecResult>((resolve, reject) => {
        const child = spawn(bdBin, argv, {
          cwd,
          env: process.env,
          stdio: ["ignore", "pipe", "pipe"],
        });
        let stdout = "";
        let stderr = "";
        child.stdout.setEncoding("utf8");
        child.stderr.setEncoding("utf8");
        child.stdout.on("data", (chunk: string) => {
          stdout += chunk;
        });
        child.stderr.on("data", (chunk: string) => {
          stderr += chunk;
        });
        child.on("error", (err) => {
          reject(
            new Error(
              `Meta Beads: failed to spawn ${bdBin}: ${err.message}`,
            ),
          );
        });
        child.on("close", (code) => {
          resolve({
            exitCode: code ?? 1,
            stdout,
            stderr,
          });
        });
      });
    },
  };
}

function executionContractFromIssue(issue: BdIssue): string | undefined {
  if (typeof issue.execution_contract_id === "string" && issue.execution_contract_id) {
    return issue.execution_contract_id;
  }
  const meta = issue.metadata;
  if (meta && typeof meta.executionContractId === "string") {
    return meta.executionContractId;
  }
  if (meta && typeof meta.execution_contract_id === "string") {
    return meta.execution_contract_id;
  }
  return undefined;
}

/**
 * Production Meta Beads gate via `bd ready` / `bd update --claim` / `bd unclaim`.
 * Refuse non-`factory-` ids (Product Beads hard rule).
 */
export class BdMetaBeads implements MetaBeadsGate {
  readonly #runner: BdRunner;
  readonly #idPrefix: string;
  readonly cwd: string;

  constructor(opts: BdMetaBeadsOptions) {
    this.cwd = opts.cwd;
    this.#idPrefix = opts.idPrefix ?? META_BEADS_ID_PREFIX;
    this.#runner =
      opts.runner ?? createSpawnRunner(opts.cwd, opts.bdBin ?? "bd");
  }

  #assertMetaId(beadId: string): void {
    if (!beadId.startsWith(this.#idPrefix)) {
      throw new Error(
        `Meta Beads: refuse non-Meta bead id ${beadId} (prefix ${this.#idPrefix} only; never Product Beads)`,
      );
    }
  }

  async #show(beadId: string): Promise<BdIssue | null> {
    const result = await this.#runner.run(["show", beadId, "--json"]);
    if (result.exitCode !== 0) {
      return null;
    }
    const issues = parseIssueArray(result.stdout);
    return issues[0] ?? null;
  }

  async #listReadyIds(): Promise<Set<string>> {
    const result = await this.#runner.run(["ready", "--json"]);
    if (result.exitCode !== 0) {
      throw new Error(
        `Meta Beads: bd ready failed (exit ${result.exitCode}): ${result.stderr.trim() || result.stdout.trim()}`,
      );
    }
    return new Set(parseIssueArray(result.stdout).map((i) => i.id));
  }

  /**
   * Ready = appears in `bd ready`, or already `in_progress` (holder may re-admit).
   * Closed / missing / blocked-open (absent from ready) → not ready.
   */
  async isReady(beadId: string): Promise<boolean> {
    this.#assertMetaId(beadId);
    const issue = await this.#show(beadId);
    if (!issue) return false;
    const status = issue.status ?? "";
    if (status === "in_progress") return true;
    if (status !== "open") return false;
    const ready = await this.#listReadyIds();
    return ready.has(beadId);
  }

  async claim(
    beadId: string,
    args: { projectId: string; claimedBy: string },
  ): Promise<ReadyTaskEvent> {
    this.#assertMetaId(beadId);
    const ready = await this.isReady(beadId);
    if (!ready) {
      throw new Error(`Meta Beads: bead not ready: ${beadId}`);
    }
    const holder = await this.claimHolder(beadId);
    if (holder && holder !== args.claimedBy) {
      throw new Error(`Meta Beads: bead already claimed by ${holder}`);
    }
    const result = await this.#runner.run(
      ["update", beadId, "--claim", "--json"],
      { actor: args.claimedBy },
    );
    if (result.exitCode !== 0) {
      throw new Error(
        `Meta Beads: bd update --claim failed for ${beadId}: ${result.stderr.trim() || result.stdout.trim()}`,
      );
    }
    const updated = parseIssueArray(result.stdout)[0] ?? (await this.#show(beadId));
    if (!updated) {
      throw new Error(`Meta Beads: claim succeeded but bead missing: ${beadId}`);
    }
    const claimedAt =
      updated.started_at ?? updated.updated_at ?? new Date().toISOString();
    const event: ReadyTaskEvent = {
      beadId,
      projectId: args.projectId,
      claimedBy: args.claimedBy,
      claimedAt,
    };
    const ec = executionContractFromIssue(updated);
    if (ec !== undefined) {
      event.executionContractId = ec;
    }
    return event;
  }

  async reclaim(beadId: string): Promise<void> {
    this.#assertMetaId(beadId);
    const result = await this.#runner.run(["unclaim", beadId, "--json"]);
    if (result.exitCode !== 0) {
      // Missing / already open: treat as released (Memory semantics).
      const show = await this.#show(beadId);
      if (!show || show.status === "open" || !show.assignee) {
        return;
      }
      throw new Error(
        `Meta Beads: bd unclaim failed for ${beadId}: ${result.stderr.trim() || result.stdout.trim()}`,
      );
    }
  }

  async claimHolder(beadId: string): Promise<string | null> {
    this.#assertMetaId(beadId);
    const issue = await this.#show(beadId);
    const assignee = issue?.assignee;
    if (typeof assignee === "string" && assignee.length > 0) {
      return assignee;
    }
    return null;
  }
}
