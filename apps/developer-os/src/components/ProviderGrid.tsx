"use client";

import { useMemo, useState } from "react";
import type { ProviderId, ProviderTile } from "@/lib/providers";
import {
  PROVIDER_TILES,
  TONE_DOT,
  detailById,
  providerSummary,
  tileById,
} from "@/lib/providers";
import styles from "./ProviderGrid.module.css";

/**
 * Provider widget grid (dark PNG) + light Provider Dashboard detail.
 * Canon: provider-widget-grid-dark.png · Provider Dashboard.dc.html
 * Fixtures only — no Port upserts, no secrets.
 */
export function ProviderGrid() {
  const [selected, setSelected] = useState<ProviderId>("port");
  const tile = useMemo(() => tileById(selected), [selected]);
  const detail = useMemo(() => detailById(selected), [selected]);

  return (
    <section className={styles.wrap} aria-label="Provider widgets">
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Providers</h1>
          <p className={styles.sub}>
            Connected surfaces · status tiles · fixture KPIs — no catalog writes
          </p>
        </div>
        <span className={styles.badge}>{providerSummary()}</span>
      </header>

      <div className={styles.grid} role="list">
        {PROVIDER_TILES.map((t, i) => (
          <ProviderTileButton
            key={t.id}
            tile={t}
            active={t.id === selected}
            delay={i * 45}
            onSelect={() => setSelected(t.id)}
          />
        ))}
        <div
          className={`${styles.tile} ${styles.addTile}`}
          role="listitem"
          aria-label="Add widget"
        >
          <span className={styles.addMark} aria-hidden>
            +
          </span>
          <div className={styles.tileBody}>
            <span className={styles.tileName}>Add Widget</span>
            <span className={styles.addSub}>Connect a new service</span>
          </div>
        </div>
      </div>

      {tile ? (
        <article
          className={styles.dashboard}
          aria-label={`${tile.name} provider dashboard`}
        >
          <div className={styles.dashHead}>
            <div
              className={styles.dashLogo}
              style={{ background: tile.accent }}
              aria-hidden
            >
              {tile.monogram}
            </div>
            <div className={styles.dashTitles}>
              <h2 className={styles.dashName}>{tile.name}</h2>
              <p className={styles.dashScope}>{tile.scope}</p>
            </div>
            <div className={styles.conn}>
              <span>Connected</span>
              <span className={styles.switch} aria-hidden>
                <span className={styles.knob} />
              </span>
            </div>
            <span className={styles.openExt}>Open in {tile.name}</span>
          </div>

          <div className={styles.kpis}>
            {detail.kpis.map((k) => (
              <div key={k.label} className={styles.kpi}>
                <span className={styles.kpiLabel}>{k.label}</span>
                <div className={styles.kpiRow}>
                  <span className={styles.kpiValue}>{k.value}</span>
                  <span
                    className={styles.kpiSub}
                    style={k.warn ? { color: "#9a5b00" } : undefined}
                  >
                    {k.sub}
                  </span>
                </div>
                <div className={styles.bars} aria-hidden>
                  {sparkBars(tile.id + k.label).map((h, i) => (
                    <span
                      key={i}
                      style={{
                        height: h,
                        background: k.warn ? "#c27a00" : tile.accent === "#1c1e22" ? "#2f6fe0" : tile.accent,
                        opacity: i === 15 ? 1 : 0.45,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.dashBody}>
            <div className={styles.activityPanel}>
              <div className={styles.actTitle}>Recent activity</div>
              <ul className={styles.actList}>
                {detail.activity.map((a) => (
                  <li key={a.text + a.age} className={styles.actItem}>
                    <span>{a.text}</span>
                    <span className={styles.actAge}>{a.age}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.toolsPanel}>
              <div className={styles.actTitle}>Surface tools</div>
              <p className={styles.toolsNote}>
                Read/status presentation only. Connection secrets stay env / PM —
                FE-142 · FE-172 CLOSED.
              </p>
              <div className={styles.toolChips}>
                {detail.tools.map((t) => (
                  <code key={t} className={styles.toolChip}>
                    {t}
                  </code>
                ))}
              </div>
            </div>
          </div>
        </article>
      ) : null}
    </section>
  );
}

function ProviderTileButton({
  tile,
  active,
  delay,
  onSelect,
}: {
  tile: ProviderTile;
  active: boolean;
  delay: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="listitem"
      className={active ? `${styles.tile} ${styles.tileActive}` : styles.tile}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`${tile.name}: ${tile.status}`}
    >
      <span
        className={styles.glow}
        style={{ background: tile.glow }}
        aria-hidden
      />
      <span
        className={styles.logo}
        style={{ background: tile.accent }}
        aria-hidden
      >
        {tile.monogram}
      </span>
      <span className={styles.tileBody}>
        <span className={styles.tileName}>{tile.name}</span>
        <span className={styles.tileStatus}>
          <span
            className={styles.dot}
            style={{ background: TONE_DOT[tile.tone] }}
            aria-hidden
          />
          {tile.status}
        </span>
      </span>
      <span className={styles.chevron} aria-hidden>
        ›
      </span>
    </button>
  );
}

/** Deterministic sparkline heights from a seed (matches Provider Dashboard bars). */
function sparkBars(seed: string): string[] {
  let h = 7;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  let v = 40;
  const out: string[] = [];
  for (let i = 0; i < 16; i++) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    const r = ((h >>> 16) % 100) / 100;
    v += 3 + (r - 0.5) * 16;
    v = Math.max(12, Math.min(96, v));
    out.push(`${Math.round(v)}%`);
  }
  return out;
}
