"use client";

import { useEffect, useMemo, useState } from "react";
import { HttpActorTransport } from "@/lib/rivet/http-transport";
import { RivetSessionClient } from "@/lib/rivet/session-client";
import type { SessionEvent, StreamConnectionState } from "@/lib/rivet/session-events";
import styles from "./SessionStream.module.css";

type Props = {
  sessionId: string;
};

/**
 * Developer OS session view — Rivet Actor native realtime (ADR-011).
 * Reconnects from last sequence. No CopilotKit. No browser→Sandbox Agent.
 */
export function SessionStream({ sessionId }: Props) {
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [state, setState] = useState<StreamConnectionState>("idle");
  const [lastSequence, setLastSequence] = useState(-1);

  const baseUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  useEffect(() => {
    if (!baseUrl) return;
    const transport = new HttpActorTransport(baseUrl);
    const client = new RivetSessionClient({
      sessionId,
      transport,
      onEvent: (event) => {
        setEvents((prev) => {
          if (prev.some((e) => e.sequence === event.sequence)) return prev;
          return [...prev, event];
        });
        setLastSequence(event.sequence);
      },
      onState: setState,
    });

    void client.connect();
    return () => client.close();
  }, [baseUrl, sessionId]);

  return (
    <section className={styles.panel} aria-label="AgentSession stream">
      <header className={styles.header}>
        <div>
          <p className={styles.brand}>Rivet · AgentSession</p>
          <h1 className={styles.title}>Session stream</h1>
          <p className={styles.meta}>
            <code>{sessionId}</code> · Rivet-native · no CopilotKit · no Sandbox from browser
          </p>
        </div>
        <div className={styles.status} data-state={state}>
          <span className={styles.dot} aria-hidden />
          <span>
            {state} · seq {lastSequence < 0 ? "—" : lastSequence}
          </span>
        </div>
      </header>

      <ol className={styles.list}>
        {events.length === 0 ? (
          <li className={styles.empty}>Waiting for Actor events…</li>
        ) : (
          events.map((event) => (
            <li key={event.sequence} className={styles.item}>
              <span className={styles.seq}>#{event.sequence}</span>
              <span className={styles.sender}>{event.sender}</span>
              <span className={styles.type}>{event.type}</span>
              <pre className={styles.payload}>{JSON.stringify(event.payload)}</pre>
            </li>
          ))
        )}
      </ol>
    </section>
  );
}
