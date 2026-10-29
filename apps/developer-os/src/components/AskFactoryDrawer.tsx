"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HttpActorTransport } from "@/lib/rivet/http-transport";
import { RivetSessionClient } from "@/lib/rivet/session-client";
import type { SessionEvent } from "@/lib/rivet/session-events";
import styles from "./AskFactoryDrawer.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

type ChatLine = {
  id: string;
  sender: "client" | "agent" | "system";
  text: string;
};

const SESSION_ID = "factory-ask-cockpit"; // server-side twin: ASK_SESSION_ID in src/lib/rivet/ask-session.ts
const MAX_TEXT = 2000;

function eventToLine(event: SessionEvent): ChatLine | null {
  const payload = event.payload as { text?: unknown } | null | undefined;
  const text = typeof payload?.text === "string" ? payload.text : "";
  if (!text) return null;
  return { id: `${event.type}-${event.sequence}`, sender: event.sender, text };
}

/** Id-deduped append — reconnect gap replay can never double-render a transcript. */
function appendLine(prev: ChatLine[], line: ChatLine): ChatLine[] {
  if (prev.some((l) => l.id === line.id)) return prev;
  return [...prev, line];
}

/**
 * Ask Factory drawer (⌘J) — live Rivet-native wiring (FE-198).
 *
 * Client subscribes to the Dev OS BFF session stream (RivetHttpActorTransport →
 * /api/rivet/sessions/…) and posts asks through the BFF messages route. The
 * browser never calls Rivet Serve / Sandbox Agent directly; no Port writes.
 */
export function AskFactoryDrawer({ open, onClose }: Props) {
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [state, setState] = useState<string>("idle");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState<"live" | "memory" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<RivetSessionClient | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    // Reset transcript/mode on fresh open — replay rebuilds in one pass.
    setLines([]);
    setMode(null);
    setError(null);
    const transport = new HttpActorTransport(window.location.origin);
    const client = new RivetSessionClient({
      sessionId: SESSION_ID,
      transport,
      onEvent: (event) => {
        const line = eventToLine(event);
        if (line) setLines((prev) => appendLine(prev, line));
      },
      onState: (s) => setState(s),
    });
    clientRef.current = client;
    void client.connect().catch(() => setState("error"));

    return () => {
      client.close();
      clientRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const send = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const text = draft.trim();
      if (!text || sending) return;
      setSending(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/rivet/sessions/${encodeURIComponent(SESSION_ID)}/messages`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ text }),
          },
        );
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          setError(body.error ?? `HTTP ${res.status}`);
        } else {
          const body = (await res.json()) as { mode?: "live" | "memory" };
          setMode(body.mode ?? null);
          setDraft("");
        }
      } catch {
        setError("post_failed");
      } finally {
        setSending(false);
      }
    },
    [draft, sending],
  );

  if (!open) return null;

  const modeBadge = mode
    ? `${mode === "live" ? "Rivet Serve live" : "Memory fixture"} · ${state}`
    : state === "live" ? "Live session" : `Stream: ${state}`;

  return (
    <>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close Ask Factory"
        onClick={onClose}
      />
      <aside className={styles.drawer} role="dialog" aria-label="Ask Factory">
        <header className={styles.header}>
          <h2 className={styles.title}>Ask Factory</h2>
          <span className={styles.mode} aria-live="polite">
            {modeBadge}
          </span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className={styles.body} ref={bodyRef}>
          {lines.length === 0 ? (
            <div className={styles.bubble}>
              <strong>Factory</strong>
              Rivet-native AgentSession chat. Ask about assembly status, Code Atlas
              overlays, or session health. Routes through the Developer OS BFF — never
              Sandbox Agent, no Port writes, no CopilotKit.
            </div>
          ) : (
            lines.map((line) => (
              <div
                key={line.id}
                className={
                  line.sender === "client"
                    ? styles.bubbleClient
                    : styles.bubble
                }
              >
                <strong>{line.sender === "client" ? "You" : "Factory"}</strong>
                {line.text}
              </div>
            ))
          )}
          {error ? (
            <div className={styles.bubble} role="alert">
              <strong>Error</strong>
              {error}
            </div>
          ) : null}
        </div>
        <p className={styles.hint}>No secrets — no Port schema writes.</p>
        <form className={styles.footer} onSubmit={send}>
          <input
            className={styles.input}
            placeholder="Ask about Factory…"
            aria-label="Ask Factory message"
            maxLength={MAX_TEXT}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className={styles.send} disabled={sending || !draft.trim()}>
            Send
          </button>
        </form>
      </aside>
    </>
  );
}
