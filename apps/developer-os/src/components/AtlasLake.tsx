"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BP_META,
  LAKE_ENTITIES,
  LAKE_SUMMARY,
  TIER_STYLE,
  TONE_COLOR,
  buildPaletteItems,
  entityById,
  needsAttention,
  ownerName,
  tierFor,
  type LakeBlueprint,
  type LakeEntity,
  type LakeSideFilter,
  type PaletteItem,
} from "@/lib/atlas/lake-fixtures";
import { AtlasHero } from "./AtlasHero";
import { CommandPalette } from "./CommandPalette";
import styles from "./AtlasLake.module.css";

type AtlasView = "lake" | "map" | "knowledge";
type LakeMode = "catalog" | "stream";
type SortKey = "name" | "status" | "score" | null;

const BP_ORDER = Object.keys(BP_META) as LakeBlueprint[];

const SRC_COLOR: Record<string, string> = {
  GitHub: "#2563eb",
  Port: "#16a34a",
  Docker: "#1d63ed",
  Beads: "#b06a1a",
  Rivet: "#1c1e22",
  Vercel: "#1c1e22",
  Linear: "#5e6ad2",
  "Dev OS": "#2f6fe0",
};

function ageMin(age: string): number {
  const m = /^(\d+)(m|h|d)$/.exec(age);
  if (m) {
    const n = Number(m[1]);
    const u = m[2];
    if (u === "m") return n;
    if (u === "h") return n * 60;
    return n * 1440;
  }
  return age === "today" ? 600 : 1e6;
}

function severity(e: LakeEntity): number {
  if (e.tone === "err") return 0;
  if (e.tone === "warn") return 1;
  return 2;
}

function tierRank(e: LakeEntity): number {
  const t = tierFor(e);
  if (t === "Gold") return 0;
  if (t === "Silver") return 1;
  if (t === "Bronze") return 2;
  if (t === "Basic") return 3;
  return 9;
}

/**
 * Code Atlas v5 — light-glass lake table + view pills + ⌘K.
 * Fixtures only; Cockpit dark shell stays on `/`.
 */
export function AtlasLake() {
  const router = useRouter();
  const [view, setView] = useState<AtlasView>("lake");
  const [lakeMode, setLakeMode] = useState<LakeMode>("catalog");
  const [filter, setFilter] = useState<LakeSideFilter>("all");
  const [selectedId, setSelectedId] = useState("svc-devos");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [palOpen, setPalOpen] = useState(false);

  const paletteItems = useMemo(() => buildPaletteItems(), []);

  const openPal = useCallback(() => setPalOpen(true), []);
  const closePal = useCallback(() => setPalOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      const tag = (e.target as HTMLElement | null)?.tagName;
      const inInput = tag === "INPUT" || tag === "TEXTAREA";

      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && palOpen) {
        e.preventDefault();
        setPalOpen(false);
        return;
      }
      if (inInput || palOpen) return;
      if (mod && e.key === "1") {
        e.preventDefault();
        setView("lake");
      } else if (mod && e.key === "2") {
        e.preventDefault();
        setView("map");
      } else if (mod && e.key === "3") {
        e.preventDefault();
        setView("knowledge");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [palOpen]);

  const scoped = useMemo(() => {
    return LAKE_ENTITIES.filter((e) => {
      if (filter === "all") return true;
      if (filter === "attention") return needsAttention(e);
      return e.bp === filter;
    });
  }, [filter]);

  const rows = useMemo(() => {
    let list = [...scoped];
    if (sortKey === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name) * sortDir);
    } else if (sortKey === "status") {
      list.sort((a, b) => (severity(a) - severity(b)) * sortDir);
    } else if (sortKey === "score") {
      list.sort((a, b) => (tierRank(a) - tierRank(b)) * sortDir);
    }
    return list;
  }, [scoped, sortKey, sortDir]);

  useEffect(() => {
    if (!rows.some((r) => r.id === selectedId) && rows[0]) {
      setSelectedId(rows[0].id);
    }
  }, [rows, selectedId]);

  const selected = entityById(selectedId) ?? rows[0] ?? LAKE_ENTITIES[0];
  const selectedTier = selected ? tierFor(selected) : null;
  const attN = LAKE_ENTITIES.filter(needsAttention).length;

  const stream = useMemo(() => {
    const events: Array<{
      entityId: string;
      entityName: string;
      src: string;
      text: string;
      age: string;
      m: number;
    }> = [];
    for (const e of scoped) {
      for (const [src, text, age] of e.acts) {
        events.push({
          entityId: e.id,
          entityName: e.name,
          src,
          text,
          age,
          m: ageMin(age),
        });
      }
    }
    events.sort((a, b) => a.m - b.m);
    return events;
  }, [scoped]);

  const tableTitle =
    filter === "all"
      ? "All entities"
      : filter === "attention"
        ? "Needs attention"
        : BP_META[filter].plural;

  const toggleSort = (key: SortKey) => {
    if (!key) return;
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const onSelectPalette = useCallback(
    (item: PaletteItem) => {
      setPalOpen(false);
      switch (item.kind) {
        case "entity":
        case "symbol":
          setView("lake");
          setSelectedId(item.target);
          setFilter("all");
          break;
        case "view":
          if (item.target === "knowledge") {
            router.push("/intelligence");
            break;
          }
          if (item.target === "lake" || item.target === "map") {
            setView(item.target);
          }
          break;
        case "nav":
          router.push(item.target);
          break;
        default: {
          const _exhaustive: never = item.kind;
          void _exhaustive;
        }
      }
    },
    [router],
  );

  return (
    <div className={styles.workspace}>
      <div className={styles.toolbar}>
        <div className={styles.summary}>
          <span className={styles.summaryTitle}>Code Atlas</span>
          <span className={styles.summarySub}>{LAKE_SUMMARY}</span>
        </div>
        <div className={styles.views} role="tablist" aria-label="Atlas views">
          {(
            [
              ["lake", "Lake"],
              ["map", "Map"],
              ["knowledge", "Knowledge"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              className={view === id ? styles.viewActive : styles.view}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" className={styles.searchTrigger} onClick={openPal}>
          <span className={styles.searchLabel}>Search everything</span>
          <kbd className={styles.searchKbd}>⌘K</kbd>
        </button>
      </div>

      {view === "lake" ? (
        <div className={styles.lakeLayout}>
          <aside className={`${styles.side} ${styles.glass}`} aria-label="Lake filters">
            <div className={styles.sideSection}>
              <div className={styles.sideTitle}>Smart lists</div>
              <button
                type="button"
                className={filter === "all" ? styles.sideRowOn : styles.sideRow}
                onClick={() => setFilter("all")}
              >
                <span
                  className={styles.sideDot}
                  style={{ background: "#1c1e22", borderRadius: "2px" }}
                />
                <span className={styles.sideLabel}>All entities</span>
                <span className={styles.sideCount}>{LAKE_ENTITIES.length}</span>
              </button>
              <button
                type="button"
                className={filter === "attention" ? styles.sideRowOn : styles.sideRow}
                onClick={() => setFilter("attention")}
              >
                <span
                  className={styles.sideDot}
                  style={{ background: "#d0393e", borderRadius: "50%" }}
                />
                <span className={styles.sideLabel}>Needs attention</span>
                <span className={`${styles.sideCount} ${styles.sideCountHot}`}>{attN}</span>
              </button>
            </div>
            <div className={styles.sideSection}>
              <div className={styles.sideTitle}>Blueprints</div>
              {BP_ORDER.map((bp) => {
                const count = LAKE_ENTITIES.filter((e) => e.bp === bp).length;
                return (
                  <button
                    key={bp}
                    type="button"
                    className={filter === bp ? styles.sideRowOn : styles.sideRow}
                    onClick={() => setFilter(bp)}
                  >
                    <span
                      className={styles.sideDot}
                      style={{ background: BP_META[bp].color, borderRadius: "2px" }}
                    />
                    <span className={styles.sideLabel}>{BP_META[bp].plural}</span>
                    <span className={styles.sideCount}>{count}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className={`${styles.tablePanel} ${styles.glass}`} aria-label="Lake catalog">
            <div className={styles.tableHead}>
              <span className={styles.tableTitle}>{tableTitle}</span>
              <span className={styles.tableCount}>
                {lakeMode === "catalog" ? rows.length : `${stream.length} events`}
              </span>
              <div className={styles.modes} role="group" aria-label="Lake mode">
                <button
                  type="button"
                  className={lakeMode === "catalog" ? styles.modeOn : styles.mode}
                  onClick={() => setLakeMode("catalog")}
                >
                  Catalog
                </button>
                <button
                  type="button"
                  className={lakeMode === "stream" ? styles.modeOn : styles.mode}
                  onClick={() => setLakeMode("stream")}
                >
                  Activity
                </button>
              </div>
            </div>

            {lakeMode === "catalog" ? (
              <>
                <div className={styles.cols}>
                  <span aria-hidden />
                  <button
                    type="button"
                    className={
                      sortKey === "name"
                        ? `${styles.colBtn} ${styles.colBtnActive}`
                        : styles.colBtn
                    }
                    onClick={() => toggleSort("name")}
                  >
                    Name{sortKey === "name" ? (sortDir > 0 ? " ↑" : " ↓") : ""}
                  </button>
                  <span>Owner</span>
                  <button
                    type="button"
                    className={
                      sortKey === "status"
                        ? `${styles.colBtn} ${styles.colBtnActive}`
                        : styles.colBtn
                    }
                    onClick={() => toggleSort("status")}
                  >
                    Status{sortKey === "status" ? (sortDir > 0 ? " ↑" : " ↓") : ""}
                  </button>
                  <button
                    type="button"
                    className={
                      sortKey === "score"
                        ? `${styles.colBtn} ${styles.colBtnActive}`
                        : styles.colBtn
                    }
                    onClick={() => toggleSort("score")}
                  >
                    Scorecard{sortKey === "score" ? (sortDir > 0 ? " ↑" : " ↓") : ""}
                  </button>
                  <span className={styles.colRight}>Links</span>
                </div>
                <div className={styles.rows}>
                  {rows.map((e) => {
                    const tier = tierFor(e);
                    const on = e.id === selected?.id;
                    return (
                      <button
                        key={e.id}
                        type="button"
                        className={on ? styles.rowOn : styles.row}
                        onClick={() => setSelectedId(e.id)}
                      >
                        <span
                          className={styles.bpDot}
                          style={{ background: BP_META[e.bp].color }}
                        />
                        <div className={styles.nameBlock}>
                          <span className={styles.name}>{e.name}</span>
                          <span className={styles.sub}>{e.sub}</span>
                        </div>
                        <span className={styles.owner}>{ownerName(e)}</span>
                        <span className={styles.status}>
                          <span
                            className={styles.statusDot}
                            style={{ background: TONE_COLOR[e.tone] }}
                          />
                          <span className={styles.statusLabel}>{e.status}</span>
                        </span>
                        <span className={styles.tierWrap}>
                          {tier ? (
                            <span
                              className={styles.tier}
                              style={{ color: TIER_STYLE[tier].c, background: TIER_STYLE[tier].bg }}
                            >
                              {tier}
                            </span>
                          ) : null}
                        </span>
                        <span className={styles.rel}>{e.rels.length}</span>
                      </button>
                    );
                  })}
                  {rows.length === 0 ? (
                    <div className={styles.knowledgeHint} style={{ padding: "3rem 1rem" }}>
                      Nothing needs attention here.
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <div className={styles.rows}>
                {stream.map((x) => {
                  const on = x.entityId === selected?.id;
                  return (
                    <button
                      key={`${x.entityId}-${x.src}-${x.age}-${x.text}`}
                      type="button"
                      className={on ? `${styles.streamRow} ${styles.streamRowOn}` : styles.streamRow}
                      onClick={() => setSelectedId(x.entityId)}
                    >
                      <span className={styles.src}>
                        <span
                          className={styles.srcMono}
                          style={{ background: SRC_COLOR[x.src] ?? "#6b717c" }}
                        >
                          {x.src[0]}
                        </span>
                        <span className={styles.srcName}>{x.src}</span>
                      </span>
                      <span className={styles.streamText}>{x.text}</span>
                      <span className={styles.streamEnt}>{x.entityName}</span>
                      <span className={styles.streamAge}>{x.age}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className={styles.hint}>
              {lakeMode === "catalog"
                ? "↑ ↓ via selection · click a column title to sort · fixtures only"
                : "Newest first · fixture activity · no live Port upserts"}
            </div>
          </section>

          {selected ? (
            <aside className={`${styles.detail} ${styles.glass}`} aria-label="Entity detail">
              <div>
                <div className={styles.detailBp}>
                  <span
                    className={styles.bpDot}
                    style={{ background: BP_META[selected.bp].color }}
                  />
                  {BP_META[selected.bp].label}
                </div>
                <div className={styles.detailName}>{selected.name}</div>
                <div className={styles.detailStatus}>
                  <span
                    className={styles.statusDot}
                    style={{ background: TONE_COLOR[selected.tone] }}
                  />
                  <span>{selected.status}</span>
                  {selected.owner ? (
                    <>
                      <span className={styles.mutedDot}>· owned by</span>
                      <button
                        type="button"
                        className={styles.ownerLink}
                        onClick={() => selected.owner && setSelectedId(selected.owner)}
                      >
                        {ownerName(selected)}
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className={styles.props}>
                {selected.props.map(([k, v]) => (
                  <div key={k} style={{ display: "contents" }}>
                    <span className={styles.propKey}>{k}</span>
                    <span className={styles.propVal}>{v}</span>
                  </div>
                ))}
              </div>

              {selectedTier && selected.rules ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div className={styles.scoreHead}>
                    <span className={styles.scoreLabel}>Production readiness</span>
                    <span className={styles.scoreCount}>
                      {selected.rules.filter((r) => r[1]).length} of {selected.rules.length}
                    </span>
                    <span
                      className={styles.tier}
                      style={{
                        color: TIER_STYLE[selectedTier].c,
                        background: TIER_STYLE[selectedTier].bg,
                      }}
                    >
                      {selectedTier}
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${Math.round(
                          (selected.rules.filter((r) => r[1]).length / selected.rules.length) *
                            100,
                        )}%`,
                        background: TIER_STYLE[selectedTier].bar,
                      }}
                    />
                  </div>
                  {selected.rules.map(([n, pass, note]) => (
                    <div key={n} className={styles.rule}>
                      <span
                        className={styles.ruleMark}
                        style={{ color: pass ? "#1f9d55" : "#d0393e" }}
                      >
                        {pass ? "✓" : "✕"}
                      </span>
                      <span className={styles.ruleName}>{n}</span>
                      {note ? <span className={styles.ruleNote}>{note}</span> : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {selected.codeRepo ? (
                <div>
                  <div className={styles.sectionLabel}>Code</div>
                  <p className={styles.knowledgeLede} style={{ fontSize: "0.85rem" }}>
                    Symbols indexed in {selected.codeRepo}. Open Map for four-overlay projection
                    (Beads · Polygraph · Graft · Langfuse).
                  </p>
                  <button
                    type="button"
                    className={styles.relChip}
                    style={{
                      marginTop: "0.5rem",
                      background: "#1c1e22",
                      color: "#fff",
                      padding: "0.4rem 0.85rem",
                    }}
                    onClick={() => setView("map")}
                  >
                    Open in Repo Intelligence
                  </button>
                </div>
              ) : null}

              <div>
                <div className={styles.sectionLabel}>Related · {selected.rels.length}</div>
                <div className={styles.rels}>
                  {selected.rels.map((id) => {
                    const rel = entityById(id);
                    if (!rel) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        className={styles.relChip}
                        onClick={() => setSelectedId(id)}
                      >
                        <span
                          className={styles.bpDot}
                          style={{ background: BP_META[rel.bp].color }}
                        />
                        {rel.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className={styles.sectionLabel}>Activity</div>
                {selected.acts.length === 0 ? (
                  <div className={styles.knowledgeHint}>No recent events.</div>
                ) : (
                  selected.acts.map(([src, text, age]) => (
                    <div key={`${src}-${age}-${text}`} className={styles.act}>
                      <span className={styles.actSrc}>{src}</span>
                      <span className={styles.actText}>{text}</span>
                      <span className={styles.actAge}>{age}</span>
                    </div>
                  ))
                )}
              </div>
            </aside>
          ) : null}
        </div>
      ) : null}

      {view === "map" ? (
        <div className={styles.mapPane}>
          <AtlasHero />
        </div>
      ) : null}

      {view === "knowledge" ? (
        <div className={`${styles.knowledge} ${styles.glass}`}>
          <p className={styles.knowledgeBrand}>Knowledge</p>
          <p className={styles.knowledgeLede}>
            Cross-repo symbol graph ships as Codebase Intelligence — solid in-repo edges, dashed
            brown cross-repo. Lake + ⌘K stay here; graph lives on its own light route.
          </p>
          <button
            type="button"
            className={styles.searchTrigger}
            style={{ alignSelf: "flex-start", marginTop: "0.75rem" }}
            onClick={() => router.push("/intelligence")}
          >
            <span className={styles.searchLabel}>Open Intelligence graph</span>
          </button>
          <span className={styles.knowledgeHint}>FE-196 · /intelligence · fixtures</span>
        </div>
      ) : null}

      <CommandPalette
        open={palOpen}
        onClose={closePal}
        items={paletteItems}
        onSelect={onSelectPalette}
      />
    </div>
  );
}
