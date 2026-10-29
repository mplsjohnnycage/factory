import type {
  ActorStreamTransport,
  SessionEvent,
  StreamConnectionState,
} from "./session-events";

export type RivetSessionClientOptions = {
  sessionId: string;
  transport: ActorStreamTransport;
  /** Exclusive lower bound; resume from this sequence on first connect. Default -1. */
  afterSequence?: number;
  onEvent?: (event: SessionEvent) => void;
  onState?: (state: StreamConnectionState) => void;
  /** Max automatic reconnect attempts after a blip. Default 5. */
  maxReconnectAttempts?: number;
};

/**
 * Rivet Actor native realtime client for Developer OS (ADR-011 / PBI-009).
 *
 * Contract: on disconnect, resubscribe from last `sequence` — snapshot/gap
 * replay then live. No CopilotKit. Browser never calls Sandbox Agent.
 */
export class RivetSessionClient {
  readonly sessionId: string;
  readonly #transport: ActorStreamTransport;
  readonly #onEvent?: (event: SessionEvent) => void;
  readonly #onState?: (state: StreamConnectionState) => void;
  readonly #maxReconnect: number;

  #lastSequence: number;
  #state: StreamConnectionState = "idle";
  #events: SessionEvent[] = [];
  #unsubscribe: (() => void) | null = null;
  #reconnectAttempts = 0;
  #closed = false;

  constructor(opts: RivetSessionClientOptions) {
    this.sessionId = opts.sessionId;
    this.#transport = opts.transport;
    this.#lastSequence = opts.afterSequence ?? -1;
    this.#maxReconnect = opts.maxReconnectAttempts ?? 5;
    if (opts.onEvent) this.#onEvent = opts.onEvent;
    if (opts.onState) this.#onState = opts.onState;
  }

  get lastSequence(): number {
    return this.#lastSequence;
  }

  get connectionState(): StreamConnectionState {
    return this.#state;
  }

  get events(): readonly SessionEvent[] {
    return this.#events;
  }

  async connect(): Promise<void> {
    if (this.#closed) throw new Error("RivetSessionClient is closed");
    this.#setState(this.#reconnectAttempts > 0 ? "reconnecting" : "connecting");

    const gap = await this.#transport.fetchSince(this.sessionId, this.#lastSequence);
    for (const event of gap) this.#apply(event);

    this.#unsubscribe?.();
    this.#unsubscribe = this.#transport.subscribe(
      this.sessionId,
      this.#lastSequence,
      {
        onEvent: (event) => this.#apply(event),
        onError: (error) => {
          void this.#handleDisconnect(error);
        },
        // Intentional pause()/close() unsubscribes do not pass onClose from transport.
        // Unexpected transport close → auto-reconnect from last sequence.
        onClose: () => {
          if (this.#closed || this.#state === "reconnecting" || this.#state === "closed") {
            return;
          }
          void this.#handleDisconnect(new Error("transport closed"));
        },
      },
    );

    this.#reconnectAttempts = 0;
    this.#setState("live");
  }

  close(): void {
    this.#closed = true;
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.#setState("closed");
  }

  /**
   * Drop the live channel without clearing lastSequence (browser blip).
   * Does not auto-reconnect — call `reconnect()` / `connect()` to resume.
   */
  pause(): void {
    if (this.#closed) return;
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.#setState("reconnecting");
  }

  /** Resume from the current lastSequence after `pause` or a blip. */
  async reconnect(): Promise<void> {
    if (this.#closed) throw new Error("RivetSessionClient is closed");
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.#reconnectAttempts += 1;
    await this.connect();
  }

  #apply(event: SessionEvent): void {
    if (event.sessionId !== this.sessionId) return;
    if (event.sequence <= this.#lastSequence) return;
    this.#events.push(event);
    this.#lastSequence = event.sequence;
    this.#onEvent?.(event);
  }

  async #handleDisconnect(_error: Error): Promise<void> {
    if (this.#closed || this.#state === "closed") return;
    this.#unsubscribe?.();
    this.#unsubscribe = null;

    if (this.#reconnectAttempts >= this.#maxReconnect) {
      this.#setState("error");
      return;
    }

    this.#reconnectAttempts += 1;
    this.#setState("reconnecting");
    try {
      await this.connect();
    } catch {
      this.#setState("error");
    }
  }

  #setState(state: StreamConnectionState): void {
    this.#state = state;
    this.#onState?.(state);
  }
}
