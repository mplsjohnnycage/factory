import type { CodingAgentId, PromptResult, SessionEvent } from "./types.js";

/**
 * Isolation lease under an AgentSession.
 * Docker provider is the M1 live path; Memory is CI / unit SoT stand-in.
 * Browser never holds a lease (ADR-006).
 */
export interface SandboxLease {
  readonly sandboxId: string;
  readonly alive: boolean;

  /** Start in-sandbox HTTP control plane (Sandbox Agent server). */
  start(): Promise<void>;

  /**
   * Create a coding-agent session inside the sandbox.
   * Returns the remote session id from Sandbox Agent (or mock id).
   */
  createAgentSession(opts: {
    sessionId: string;
    agent: CodingAgentId;
    cwd?: string;
  }): Promise<{ remoteSessionId: string }>;

  /**
   * Prompt the agent and stream events back via onEvent.
   * Events are NOT durable here — AgentSessionActor persists them.
   */
  prompt(opts: {
    remoteSessionId: string;
    text: string;
    onEvent: (event: Omit<SessionEvent, "sequence" | "sessionId">) => void;
  }): Promise<PromptResult>;

  /**
   * Checkpoint: produce a commit SHA on the feature branch.
   * Memory lease synthesizes SHA from event digest; Docker may shell git.
   */
  checkpoint(opts: {
    remoteSessionId: string;
    message: string;
  }): Promise<{ sha: string }>;

  /** Permanent sandbox deletion. Session Actor state must already hold identity. */
  kill(): Promise<void>;
}
