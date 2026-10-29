"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { AtlasOverlay, AtlasSubgraph } from "@/lib/atlas/types";
import { ATLAS_OVERLAYS } from "@/lib/atlas/types";
import styles from "./AtlasHero.module.css";

const OVERLAY_STROKE: Record<AtlasOverlay, string> = {
  beads: "rgba(15, 110, 86, 0.55)",
  polygraph: "rgba(26, 107, 138, 0.55)",
  graft: "rgba(120, 72, 32, 0.5)",
  langfuse: "rgba(90, 90, 110, 0.45)",
};

/**
 * First-viewport Code Atlas composition (PBI-008 shell + STL-154 overlays).
 * Full-bleed graph plane + brand — not a dashboard of cards.
 * Overlay data from /api/atlas/subgraph (fixture read projection).
 */
export function AtlasHero() {
  const [enabled, setEnabled] = useState<Record<AtlasOverlay, boolean>>({
    beads: true,
    polygraph: true,
    graft: true,
    langfuse: false,
  });
  const [subgraph, setSubgraph] = useState<AtlasSubgraph | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const overlaysParam = useMemo(
    () => ATLAS_OVERLAYS.filter((o) => enabled[o]).join(","),
    [enabled],
  );

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch(
          `/api/atlas/subgraph?overlays=${encodeURIComponent(overlaysParam)}&depth=3&role=anonymous`,
          { signal: controller.signal },
        );
        if (!res.ok) {
          throw new Error(`subgraph ${res.status}`);
        }
        const json = (await res.json()) as AtlasSubgraph;
        startTransition(() => {
          setSubgraph(json);
          setError(null);
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "subgraph failed");
      }
    };
    void load();
    return () => controller.abort();
  }, [overlaysParam]);

  const toggle = (overlay: AtlasOverlay) => {
    setEnabled((prev) => ({ ...prev, [overlay]: !prev[overlay] }));
  };

  return (
    <section className={styles.hero} aria-label="Factory Code Atlas">
      <svg
        className={styles.graph}
        viewBox="0 0 1200 720"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Four-overlay Code Atlas graph"
      >
        <defs>
          <linearGradient id="plane" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(232,238,244,0.05)" />
          </linearGradient>
          <filter id="soft">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>
        <rect width="1200" height="720" fill="url(#plane)" />

        {subgraph?.edges.map((edge) => {
          const from = subgraph.nodes.find((n) => n.id === edge.from);
          const to = subgraph.nodes.find((n) => n.id === edge.to);
          if (!from?.x || !from.y || !to?.x || !to.y) return null;
          const dashed = edge.scope === "cross" || edge.status === "unknown";
          return (
            <path
              key={edge.id}
              d={`M${from.x} ${from.y} L${to.x} ${to.y}`}
              fill="none"
              stroke={
                edge.status === "unknown"
                  ? "rgba(90,90,110,0.25)"
                  : OVERLAY_STROKE[from.overlay]
              }
              strokeWidth={edge.status === "proven" ? 1.6 : 1}
              strokeDasharray={dashed ? "6 10" : undefined}
              className={styles.edgeA}
            />
          );
        })}

        <g filter="url(#soft)">
          {subgraph?.nodes.map((node) => {
            if (node.x == null || node.y == null) return null;
            return (
              <g key={node.id}>
                <rect
                  x={node.x - 3}
                  y={node.y - 10}
                  width={3}
                  height={20}
                  fill={OVERLAY_STROKE[node.overlay]}
                  rx={1}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.kind === "symbol" ? 8 : 11}
                  className={styles.node}
                />
                <title>
                  {node.overlay}:{node.label}
                </title>
              </g>
            );
          })}
        </g>
      </svg>

      <div className={styles.veil} />

      <div className={styles.copy}>
        <p className={styles.brand}>Factory</p>
        <h1 className={styles.headline}>Developer OS</h1>
        <p className={styles.lede}>
          Code Atlas four-overlay read projection — Beads · Polygraph · Graft ·
          Langfuse (history only).
        </p>
        <div className={styles.cta}>
          <a className={styles.primary} href="/api/auth/port/login">
            Sign in with Port
          </a>
          <a className={styles.secondary} href="/session/demo">
            Open session stream
          </a>
          <div className={styles.overlays} role="group" aria-label="Atlas overlays">
            {ATLAS_OVERLAYS.map((overlay) => (
              <button
                key={overlay}
                type="button"
                className={
                  enabled[overlay] ? styles.overlayOn : styles.overlayOff
                }
                aria-pressed={enabled[overlay]}
                onClick={() => toggle(overlay)}
              >
                {overlay}
              </button>
            ))}
          </div>
          <span className={styles.hint}>
            {error
              ? `Atlas: ${error}`
              : subgraph
                ? `${subgraph.nodes.length} nodes · ${subgraph.edges.length} edges · unknown joins stay unknown`
                : "Loading atlas projection…"}
          </span>
        </div>
      </div>
    </section>
  );
}
