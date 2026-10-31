import type { ProjectSupervisorActor } from "./project-supervisor.js";
import type { SessionSpawner, SpawnedSession } from "./session-spawn.js";
import type { WorkAttempt } from "./types.js";

/**
 * Real SessionSpawner: runs an admitted WorkAttempt in a sandbox session.
 *
 * Structural types only, so `@factory/sandbox-harness` stays out of this
 * package graph. `AgentSessionActor` satisfies `SandboxSession`; pair it with
 * `DockerSandboxLease` live or `MemorySandboxLease` in CI.
 *
 * Lifecycle: create → running → prompt → checkpoint → completed | failed,
 * each transition projected to Port through the supervisor. The sandbox is
 * always killed afterwards; session identity survives on the actor.
 */

export type SandboxSession = {
  create(opts: { sessionId?: string; cwd?: string }): Promise<{
    sessionId: string;
    sandboxId: string | null;
    agent: string;
  }>;
  prompt(text: string): Promise<{ stopReason: string }>;
  checkpoint(message?: string): Promise<{ sha: string }>;
  killSandbox(): Promise<unknown>;
};

export type SandboxRunnerOptions = {
  supervisor: ProjectSupervisorActor;
  /** Fresh session (and lease) per attempt. */
  newSession: (attempt: WorkAttempt) => SandboxSession;
  /** Prompt for the coding agent. Default names the work item. */
  promptFor?: (attempt: WorkAttempt) => string;
  cwd?: string;
  /** Resolve spawn() after session creation; run continues in background. */
  detach?: boolean;
};

export type RunOutcome =
  | { ok: true; checkpointSha: string; stopReason: string }
  | { ok: false; error: string };

export function defaultPrompt(attempt: WorkAttempt): string {
  return `Work item ${attempt.taskId} (bead ${attempt.beadId}, key ${attempt.workKey}) for project ${attempt.projectId}. Implement it, run the tests, and leave the change ready to commit.`;
}

export class SandboxSessionSpawner implements SessionSpawner {
  readonly #opts: SandboxRunnerOptions;
  readonly #sessions = new Map<string, SpawnedSession>();
  readonly #runs = new Map<string, Promise<RunOutcome>>();

  constructor(opts: SandboxRunnerOptions) {
    this.#opts = opts;
  }

  get(workAttemptId: string): SpawnedSession | undefined {
    return this.#sessions.get(workAttemptId);
  }

  /** Outcome of the run for an attempt (resolves immediately unless detached). */
  whenSettled(workAttemptId: string): Promise<RunOutcome> | undefined {
    return this.#runs.get(workAttemptId);
  }

  async spawn(attempt: WorkAttempt): Promise<SpawnedSession> {
    const existing = this.#sessions.get(attempt.workAttemptId);
    if (existing) return existing;

    const { supervisor, cwd } = this.#opts;
    const session = this.#opts.newSession(attempt);
    let identity;
    try {
      identity = await session.create({
        sessionId: attempt.workAttemptId,
        ...(cwd !== undefined ? { cwd } : {}),
      });
    } catch (err) {
      await supervisor.markStatus(attempt.workAttemptId, "failed");
      await session.killSandbox().catch(() => undefined);
      throw err;
    }

    const spawned: SpawnedSession = {
      workAttemptId: attempt.workAttemptId,
      sessionId: identity.sessionId,
      sandboxId: identity.sandboxId,
      agent: identity.agent,
    };
    this.#sessions.set(attempt.workAttemptId, spawned);

    const run = this.#run(attempt, session);
    this.#runs.set(attempt.workAttemptId, run);
    if (!this.#opts.detach) await run;
    return spawned;
  }

  async #run(attempt: WorkAttempt, session: SandboxSession): Promise<RunOutcome> {
    const { supervisor } = this.#opts;
    const id = attempt.workAttemptId;
    try {
      await supervisor.markStatus(id, "running");
      const text = (this.#opts.promptFor ?? defaultPrompt)(attempt);
      const { stopReason } = await session.prompt(text);
      const { sha } = await session.checkpoint(`factory: ${attempt.workKey}`);
      await supervisor.markStatus(id, "completed");
      return { ok: true, checkpointSha: sha, stopReason };
    } catch (err) {
      await supervisor.markStatus(id, "failed");
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    } finally {
      await session.killSandbox().catch(() => undefined);
    }
  }
}
