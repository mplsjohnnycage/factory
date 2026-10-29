"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AskFactoryDrawer } from "./AskFactoryDrawer";
import styles from "./CockpitShell.module.css";

const TABS = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/atlas", label: "Code Atlas", match: (p: string) => p.startsWith("/atlas") },
  {
    href: "/session/demo",
    label: "Session",
    match: (p: string) => p.startsWith("/session"),
  },
] as const;

type Props = {
  children: React.ReactNode;
  mode?: "cockpit" | "atlas";
};

/**
 * Factory Cockpit chrome — Code Atlas + Factory brand, pill tabs, Ask Factory ⌘J.
 * Aligns to docs/design/mockups/Factory Cockpit v3.dc.html.
 */
export function CockpitShell({ children, mode }: Props) {
  const pathname = usePathname() ?? "/";
  const resolvedMode = mode ?? (pathname.startsWith("/atlas") ? "atlas" : "cockpit");
  const [chatOpen, setChatOpen] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      setClock(
        new Intl.DateTimeFormat(undefined, {
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date()),
      );
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setChatOpen((v) => !v);
      }
      if (e.key === "Escape") setChatOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className={
        resolvedMode === "atlas" ? `${styles.shell} ${styles.shellAtlas}` : styles.shell
      }
    >
      <header className={styles.top}>
        <Link href="/" className={styles.brand} aria-label="Code Atlas Factory home">
          <span className={styles.brandPrimary}>Code Atlas</span>
          <span className={styles.brandMuted}>Factory</span>
        </Link>

        <nav className={styles.tabs} aria-label="Primary">
          {TABS.map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={active ? styles.tabActive : styles.tab}
                aria-current={active ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <span className={styles.clock} aria-hidden>
            {clock}
          </span>
          <button
            type="button"
            className={chatOpen ? `${styles.ask} ${styles.askOpen}` : styles.ask}
            onClick={() => setChatOpen((v) => !v)}
            aria-pressed={chatOpen}
            aria-haspopup="dialog"
          >
            Ask Factory
            <kbd>⌘J</kbd>
          </button>
          <span className={styles.avatar} aria-hidden>
            FC
          </span>
        </div>
      </header>

      <div className={styles.main}>{children}</div>
      <AskFactoryDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
