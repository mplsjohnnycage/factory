import { createHash, randomUUID } from "node:crypto";
import type { SandboxLease } from "./sandbox-lease.js";
import type { CodingAgentId, PromptResult, SessionEvent } from "./types.js";

/**
 * In-process SandboxLease for unit tests / CI.
 * Simulates create→prompt→stream→checkpoint without Docker or Claude credentials.
 * Kill drops the ephemeral FS stand-in; does not wipe caller-held session identity.
 */
export class MemorySandboxLease implements SandboxLease {
  readonly sandboxId: string;
  #alive = false;
  #remoteSessions = new Map<string, { agent: CodingAgentId; cwd: string }>();
  /** Ephemeral FS stand-in — discarded on kill. */
  #ephemeralFs = new Map<string, string>();
  #promptCount = 0;

  constructor(sandboxId?: string) {
    this.sandboxId = sandboxId ?? `memory/${randomUUID()}`;
  }

  get alive(): boolean {
    return this.#alive;
  }

  /** Test helper: read ephemeral FS before kill. */
  readEphemeral(path: string): string | undefined {
    return this.#ephemeralFs.get(path);
  }

  async start(): Promise<void> {
    if (this.#alive) return;
    this.#alive = true;
  }

  async createAgentSession(opts: {
    sessionId: string;
    agent: CodingAgentId;
    cwd?: string;
  }): Promise<{ remoteSessionId: string }> {
    this.#assertAlive();
    const remoteSessionId = opts.sessionId;
    this.#remoteSessions.set(remoteSessionId, {
      agent: opts.agent,
      cwd: opts.cwd ?? "/workspace",
    });
    return { remoteSessionId };
  }

  async prompt(opts: {
    remoteSessionId: string;
    text: string;
    onEvent: (event: Omit<SessionEvent, "sequence" | "sessionId">) => void;
  }): Promise<PromptResult> {
    this.#assertAlive();
    if (!this.#remoteSessions.has(opts.remoteSessionId)) {
      throw new Error(`unknown remote session: ${opts.remoteSessionId}`);
    }

    this.#promptCount += 1;
    const at = new Date().toISOString();
    const events: Omit<SessionEvent, "sequence" | "sessionId">[] = [
      {
        sender: "client",
        type: "prompt",
        at,
        payload: { text: opts.text },
      },
      {
        sender: "agent",
        type: "message",
        at,
        payload: {
          text: `mock-ack:${opts.text.slice(0, 64)}`,
          promptIndex: this.#promptCount,
        },
      },
    ];

    // Ephemeral FS write — lost on kill (Spec: unsaved FS not durable SoT).
    this.#ephemeralFs.set(
      `/tmp/prompt-${this.#promptCount}.txt`,
      opts.text,
    );

    for (const e of events) opts.onEvent(e);

    return {
      stopReason: "end_turn",
      events: events.map((e, i) => ({
        ...e,
        sequence: i,
        sessionId: opts.remoteSessionId,
      })),
    };
  }

  async checkpoint(opts: {
    remoteSessionId: string;
    message: string;
  }): Promise<{ sha: string }> {
    this.#assertAlive();
    if (!this.#remoteSessions.has(opts.remoteSessionId)) {
      throw new Error(`unknown remote session: ${opts.remoteSessionId}`);
    }
    const material = `${opts.remoteSessionId}:${opts.message}:${this.#promptCount}`;
    const sha = createHash("sha256").update(material).digest("hex").slice(0, 40);
    // Checkpoint is durable evidence recorded by AgentSessionActor — not FS.
    return { sha };
  }

  async kill(): Promise<void> {
    this.#alive = false;
    this.#remoteSessions.clear();
    this.#ephemeralFs.clear();
  }

  #assertAlive(): void {
    if (!this.#alive) {
      throw new Error(`sandbox ${this.sandboxId} is not alive`);
    }
  }
}
