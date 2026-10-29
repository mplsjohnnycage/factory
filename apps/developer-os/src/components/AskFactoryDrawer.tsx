"use client";

import styles from "./AskFactoryDrawer.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Ask Factory drawer (⌘J) — local UI chrome only.
 * No Port mutations; no secret capture; FE-142/FE-172 stay CLOSED.
 */
export function AskFactoryDrawer({ open, onClose }: Props) {
  if (!open) return null;

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
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className={styles.body}>
          <div className={styles.bubble}>
            <strong>Factory</strong>
            Cockpit chat stub. Ask about assembly status, Code Atlas overlays, or session
            health. Live agent routing stays on Rivet — this drawer does not call Sandbox
            Agent or upsert Port.
          </div>
          <div className={styles.bubble}>
            <strong>Shortcuts</strong>
            ⌘J toggles this panel · Home is Cockpit · Code Atlas is the light lake view ·
            Session opens Rivet-native stream.
          </div>
        </div>
        <p className={styles.hint}>Presentation only — no secrets, no Port schema writes.</p>
        <form
          className={styles.footer}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            className={styles.input}
            placeholder="Ask about Factory…"
            aria-label="Ask Factory message"
            disabled
          />
          <button type="submit" className={styles.send} disabled>
            Send
          </button>
        </form>
      </aside>
    </>
  );
}
