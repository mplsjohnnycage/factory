"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PaletteItem } from "@/lib/atlas/lake-fixtures";
import styles from "./CommandPalette.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  items: PaletteItem[];
  onSelect: (item: PaletteItem) => void;
};

/**
 * Atlas v5 ⌘K — Search everything (entities, views, symbols, nav).
 * Local fixture search only; no Port / secrets.
 */
export function CommandPalette({ open, onClose, items, onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.sub.toLowerCase().includes(q) ||
        it.group.toLowerCase().includes(q),
    );
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, PaletteItem[]>();
    for (const it of filtered) {
      const list = map.get(it.group) ?? [];
      list.push(it);
      map.set(it.group, list);
    }
    return [...map.entries()].map(([title, groupItems]) => ({ title, items: groupItems }));
  }, [filtered]);

  const flat = filtered;

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setIndex(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(flat.length - 1, i + 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const hit = flat[index];
        if (hit) onSelect(hit);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, index, onClose, onSelect]);

  if (!open) return null;

  let running = 0;

  return (
    <>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close command palette"
        onClick={onClose}
      />
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Search everything"
      >
        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entities, symbols, notes, sources"
            aria-label="Search everything"
            autoComplete="off"
            spellCheck={false}
          />
          <span className={styles.esc}>esc</span>
        </div>
        <div className={styles.list}>
          {groups.length === 0 ? (
            <div className={styles.empty}>No results.</div>
          ) : (
            groups.map((g) => (
              <div key={g.title}>
                <div className={styles.groupTitle}>{g.title}</div>
                {g.items.map((it) => {
                  const i = running;
                  running += 1;
                  const active = i === index;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      className={active ? `${styles.item} ${styles.itemActive}` : styles.item}
                      onMouseEnter={() => setIndex(i)}
                      onClick={() => onSelect(it)}
                    >
                      <span
                        className={styles.dot}
                        style={{
                          background: it.color,
                          borderRadius: it.radius,
                        }}
                      />
                      <span className={it.mono ? styles.labelMono : styles.label}>
                        {it.label}
                      </span>
                      <span className={styles.sub}>{it.sub}</span>
                      {active ? <span className={styles.enter}>↵</span> : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className={styles.footer}>
          <span>↑ ↓ move</span>
          <span>↵ open</span>
          <span>⌘1–3 views</span>
          <span>esc close</span>
        </div>
      </div>
    </>
  );
}
