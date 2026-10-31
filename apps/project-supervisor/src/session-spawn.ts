import type { ProjectSupervisorActor } from "./project-supervisor.js";
import type {
  AdmitOk,
  AdmitRefused,
  AdmitRequest,
  WorkAttempt,
} from "./types.js";

/**
 * ProjectSupervisor → AgentSession wiring. `SandboxSessionSpawner`
 * (sandbox-runner.ts) is the real runner; `SessionSpawnRegistry` is the test double.
 *
 * Injectable `SessionSpawner` keeps `@factory/sandbox-harness` out of the
 * supervisor package graph (CI typecheck has no `^build` dep). Tests wire
 * real `AgentSessionActor` + `MemorySandboxLease` via the spawner.
 * Docker / Rivet Actor host remain ops (G5/G9).
 */

export type SpawnedSession = {
  workAttemptId: string;
  sessionId: string;
  sandboxId: string | null;
  agent: string;
};

export type SessionSpawner = {
  /** Create a session for a freshly admitted WorkAttempt. */
  spawn(attempt: WorkAttempt): Promise<SpawnedSession>;
  /** Lookup prior spawn (duplicate admit path). */
  get?(workAttemptId: string): SpawnedSession | undefined;
};

export type AdmitAndSpawnOk = {
  ok: true;
  admit: AdmitOk;
  session: SpawnedSession | null;
  /** True only when spawner.spawn ran for a non-duplicate admit. */
  spawned: boolean;
};

export type AdmitAndSpawnRefused = {
  ok: false;
  admit: AdmitRefused;
};

export type AdmitAndSpawnResult = AdmitAndSpawnOk | AdmitAndSpawnRefused;

/**
 * Admit then optionally spawn a sandbox session.
 * Duplicate workKey admits do not re-spawn; returns prior session if known.
 */
export async function admitAndSpawn(
  supervisor: ProjectSupervisorActor,
  request: AdmitRequest,
  spawner: SessionSpawner,
): Promise<AdmitAndSpawnResult> {
  const admit = await supervisor.admit(request);
  if (!admit.ok) {
    return { ok: false, admit };
  }

  if (admit.duplicate) {
    const prior = spawner.get?.(admit.attempt.workAttemptId) ?? null;
    return { ok: true, admit, session: prior, spawned: false };
  }

  const session = await spawner.spawn(admit.attempt);
  return { ok: true, admit, session, spawned: true };
}

/**
 * In-memory spawner registry used by Memory/AgentSession wiring in tests.
 * Holds SpawnedSession records; callers attach real actors externally.
 */
export class SessionSpawnRegistry implements SessionSpawner {
  readonly #byAttempt = new Map<string, SpawnedSession>();
  readonly #spawnFn: (attempt: WorkAttempt) => Promise<SpawnedSession>;

  constructor(spawnFn: (attempt: WorkAttempt) => Promise<SpawnedSession>) {
    this.#spawnFn = spawnFn;
  }

  get(workAttemptId: string): SpawnedSession | undefined {
    return this.#byAttempt.get(workAttemptId);
  }

  list(): readonly SpawnedSession[] {
    return [...this.#byAttempt.values()];
  }

  async spawn(attempt: WorkAttempt): Promise<SpawnedSession> {
    const existing = this.#byAttempt.get(attempt.workAttemptId);
    if (existing) return existing;
    const session = await this.#spawnFn(attempt);
    this.#byAttempt.set(attempt.workAttemptId, session);
    return session;
  }
}
