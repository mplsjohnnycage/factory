import type { M1_CODING_AGENT } from "./image-pin.js";

export type CodingAgentId = typeof M1_CODING_AGENT | "mock";

export type SessionEventSender = "client" | "agent" | "system";

export interface SessionEvent {
  /** Monotonic per-session sequence (Rivet Actor / persist offset). */
  sequence: number;
  sessionId: string;
  sender: SessionEventSender;
  type: string;
  at: string;
  payload: unknown;
}

export interface CheckpointResult {
  /** Feature-branch commit SHA produced by checkpoint (synthetic in Memory lease). */
  sha: string;
  at: string;
  eventSequence: number;
}

/**
 * Rivet-shaped AgentSession durable identity.
 * Survives sandbox kill; unsaved FS does not.
 */
export interface AgentSessionIdentity {
  sessionId: string;
  sandboxId: string | null;
  agent: CodingAgentId;
  createdAt: string;
  sandboxAlive: boolean;
  checkpointSha: string | null;
  eventCount: number;
}

export interface AgentSessionState extends AgentSessionIdentity {
  events: SessionEvent[];
}

export interface PromptResult {
  stopReason: string;
  events: SessionEvent[];
}

export interface CreateSessionOptions {
  sessionId?: string;
  /** M1 default = claude; tests may use mock. */
  agent?: CodingAgentId;
  cwd?: string;
}
