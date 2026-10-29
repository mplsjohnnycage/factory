import { randomUUID } from "node:crypto";
import { M1_CODING_AGENT } from "./image-pin.js";
import type { SandboxLease } from "./sandbox-lease.js";
import type {
  AgentSessionIdentity,
  AgentSessionState,
  CheckpointResult,
  CreateSessionOptions,
  PromptResult,
  SessionEvent,
} from "./types.js";

/**
 * Rivet-shaped AgentSession owner (Meta M1).
 *
 * Owns session identity + event persistence. Calls Sandbox Agent only through
 * a SandboxLease (Docker live / Memory for CI). Browser never calls SA.
 *
 * Contract: create → prompt → stream → checkpoint; kill preserves identity.
 */
export class AgentSessionActor {
  #state: AgentSessionState | null = null;
  readonly #lease: SandboxLease;

  constructor(lease: SandboxLease) {
    this.#lease = lease;
  }

  get state(): AgentSessionState | null {
    return this.#state;
  }

  identity(): AgentSessionIdentity {
    const s = this.#requireState();
    return {
      sessionId: s.sessionId,
      sandboxId: s.sandboxId,
      agent: s.agent,
      createdAt: s.createdAt,
      sandboxAlive: s.sandboxAlive,
      checkpointSha: s.checkpointSha,
      eventCount: s.events.length,
    };
  }

  events(): readonly SessionEvent[] {
    return this.#requireState().events;
  }

  async create(opts: CreateSessionOptions = {}): Promise<AgentSessionIdentity> {
    if (this.#state) {
      throw new Error("AgentSession already created");
    }

    const sessionId = opts.sessionId ?? randomUUID();
    const agent = opts.agent ?? M1_CODING_AGENT;

    await this.#lease.start();
    const createOpts: {
      sessionId: string;
      agent: typeof agent;
      cwd?: string;
    } = { sessionId, agent };
    if (opts.cwd !== undefined) createOpts.cwd = opts.cwd;
    const { remoteSessionId } = await this.#lease.createAgentSession(createOpts);

    const createdAt = new Date().toISOString();
    this.#state = {
      sessionId: remoteSessionId,
      sandboxId: this.#lease.sandboxId,
      agent,
      createdAt,
      sandboxAlive: true,
      checkpointSha: null,
      eventCount: 0,
      events: [
        {
          sequence: 0,
          sessionId: remoteSessionId,
          sender: "system",
          type: "session_created",
          at: createdAt,
          payload: { sandboxId: this.#lease.sandboxId, agent },
        },
      ],
    };

    return this.identity();
  }

  async prompt(text: string): Promise<PromptResult> {
    const s = this.#requireState();
    if (!s.sandboxAlive) {
      throw new Error(
        "sandbox is dead — session identity preserved; recreate lease to continue",
      );
    }

    const collected: SessionEvent[] = [];
    const result = await this.#lease.prompt({
      remoteSessionId: s.sessionId,
      text,
      onEvent: (raw) => {
        const event = this.#append(raw);
        collected.push(event);
      },
    });

    return { stopReason: result.stopReason, events: collected };
  }

  async checkpoint(message = "factory checkpoint"): Promise<CheckpointResult> {
    const s = this.#requireState();
    if (!s.sandboxAlive) {
      throw new Error("cannot checkpoint: sandbox is dead");
    }

    const { sha } = await this.#lease.checkpoint({
      remoteSessionId: s.sessionId,
      message,
    });
    const at = new Date().toISOString();
    s.checkpointSha = sha;
    this.#append({
      sender: "system",
      type: "checkpoint",
      at,
      payload: { sha, message },
    });

    return { sha, at, eventSequence: s.events.length - 1 };
  }

  /**
   * Kill the sandbox. Session identity + persisted events remain on this Actor.
   * Ephemeral FS is discarded by the lease (Spec guardrail).
   */
  async killSandbox(): Promise<AgentSessionIdentity> {
    const s = this.#requireState();
    await this.#lease.kill();
    s.sandboxAlive = false;
    s.sandboxId = this.#lease.sandboxId;
    this.#append({
      sender: "system",
      type: "sandbox_killed",
      at: new Date().toISOString(),
      payload: { preservedSessionId: s.sessionId },
    });
    return this.identity();
  }

  #requireState(): AgentSessionState {
    if (!this.#state) {
      throw new Error("AgentSession not created");
    }
    return this.#state;
  }

  #append(
    raw: Omit<SessionEvent, "sequence" | "sessionId">,
  ): SessionEvent {
    const s = this.#requireState();
    const event: SessionEvent = {
      ...raw,
      sequence: s.events.length,
      sessionId: s.sessionId,
    };
    s.events.push(event);
    s.eventCount = s.events.length;
    return event;
  }
}
