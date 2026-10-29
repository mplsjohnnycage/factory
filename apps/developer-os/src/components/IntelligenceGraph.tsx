"use client";

import { useMemo, useState } from "react";
import {
  CROSS_REPO_STROKE,
  DEFAULT_SELECTED_ID,
  GRAPH_HEIGHT,
  GRAPH_WIDTH,
  IN_REPO_STROKE,
  INTEL_REPOS,
  KIND_COLOR,
  REPO_LANES,
  filterEdges,
  filterNodes,
  graphSummary,
  nodeById,
  nodeCenter,
  type KindFilter,
  type SymbolKind,
} from "@/lib/intelligence";
import styles from "./IntelligenceGraph.module.css";

const KIND_FILTERS: Array<{ id: KindFilter; label: string; swatch?: string }> = [
  { id: "all", label: "All symbols" },
  { id: "COMPONENT", label: "Components", swatch: KIND_COLOR.COMPONENT },
  { id: "FUNCTION", label: "Functions", swatch: KIND_COLOR.FUNCTION },
  { id: "TYPE", label: "Types", swatch: KIND_COLOR.TYPE },
  { id: "cross-repo", label: "Cross-repo only" },
];

type SideView = "graph" | "impact" | "search" | "integrations";

/**
 * Codebase Intelligence — cross-repo symbol graph (FE-196).
 * Solid edges = in-repo calls; dashed brown = cross-repo.
 * Fixtures only; light atlas ambient via CockpitShell.
 */
export function IntelligenceGraph() {
  const [filter, setFilter] = useState<KindFilter>("all");
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED_ID);
  const [sideView, setSideView] = useState<SideView>("graph");

  const nodes = useMemo(() => filterNodes(filter), [filter]);
  const visibleIds = useMemo(() => new Set(nodes.map((n) => n.id)), [nodes]);
  const edges = useMemo(() => filterEdges(filter, visibleIds), [filter, visibleIds]);

  const selected = nodeById(selectedId) ?? nodeById(DEFAULT_SELECTED_ID)!;
  const selectedVisible = visibleIds.has(selected.id)
    ? selected
    : nodes[0] ?? selected;

  return (
    <div className={styles.root} data-surface="codebase-intelligence">
      <header className={styles.top}>
        <div className={styles.mark}>CODEBASE INTEL</div>
        <div className={styles.search}>
          <div className={styles.searchInner} role="search" aria-label="Jump to symbol">
            <span>Jump to symbol, file, or repo</span>
            <kbd>⌘K</kbd>
          </div>
        </div>
        <div className={styles.user}>
          <span>acme / catalog</span>
          <span className={styles.avatar} aria-hidden>
            MH
          </span>
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.side} aria-label="Intelligence views">
          <div>
            <div className={styles.sideTitle}>VIEWS</div>
            <div className={styles.sideList}>
              {(
                [
                  ["graph", "Symbol graph"],
                  ["impact", "Impact analysis"],
                  ["search", "Search"],
                  ["integrations", "Integrations"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={sideView === id ? styles.sideItemOn : styles.sideItem}
                  onClick={() => setSideView(id)}
                  aria-current={sideView === id ? "page" : undefined}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className={styles.sideTitle}>REPOS</div>
            <div className={styles.sideList}>
              {INTEL_REPOS.map((repo) => (
                <div key={repo.id} className={styles.sideItem} style={{ cursor: "default" }}>
                  <span className={styles.sideMono}>{repo.label}</span>
                  {repo.status === "ready" ? (
                    <span className={styles.dot} aria-label="ready" />
                  ) : (
                    <span className={styles.indexing}>indexing</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className={styles.main}>
          {sideView === "graph" ? (
            <>
              <div className={styles.headerRow}>
                <div>
                  <p className={styles.eyebrow}>CODEBASE INTELLIGENCE</p>
                  <h1 className={styles.title}>Cross-repo symbol graph</h1>
                </div>
                <div className={styles.legend} aria-label="Edge legend">
                  <div className={styles.legendRow}>
                    <span className={styles.legendSolid} />
                    call within a repo
                  </div>
                  <div className={styles.legendRow}>
                    <span className={styles.legendDash} />
                    reference across repos
                  </div>
                </div>
              </div>

              <div className={styles.filters} role="toolbar" aria-label="Symbol filters">
                {KIND_FILTERS.map((f) => {
                  const on = filter === f.id;
                  const muted = f.id === "cross-repo";
                  return (
                    <button
                      key={f.id}
                      type="button"
                      className={`${on ? styles.pillOn : styles.pill}${muted ? ` ${styles.pillMuted}` : ""}`}
                      onClick={() => setFilter(f.id)}
                      aria-pressed={on}
                    >
                      {f.swatch ? (
                        <span
                          className={styles.kindSwatch}
                          style={{ background: f.swatch }}
                          aria-hidden
                        />
                      ) : null}
                      {f.label}
                    </button>
                  );
                })}
              </div>

              <div className={styles.canvasWrap}>
                <div
                  className={styles.canvas}
                  style={{ width: GRAPH_WIDTH, height: GRAPH_HEIGHT }}
                  role="img"
                  aria-label="Cross-repo symbol graph"
                >
                  {REPO_LANES.map((lane) => (
                    <div
                      key={lane.repo}
                      className={styles.lane}
                      style={{ left: lane.left }}
                      aria-hidden
                    />
                  ))}
                  {REPO_LANES.map((lane) => (
                    <div
                      key={`${lane.repo}-label`}
                      className={styles.laneLabel}
                      style={{ left: lane.left + 20 }}
                    >
                      {lane.repo}
                    </div>
                  ))}

                  <svg
                    className={styles.edges}
                    width={GRAPH_WIDTH}
                    height={GRAPH_HEIGHT}
                    aria-hidden
                  >
                    {edges.map((edge) => {
                      const a = nodeById(edge.from);
                      const b = nodeById(edge.to);
                      if (!a || !b) return null;
                      const { cx: x1, cy: y1 } = nodeCenter(a);
                      const { cx: x2, cy: y2 } = nodeCenter(b);
                      const cross = edge.scope === "cross-repo";
                      return (
                        <line
                          key={edge.id}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={cross ? CROSS_REPO_STROKE : IN_REPO_STROKE}
                          strokeWidth={cross ? 1.75 : 1.5}
                          strokeDasharray={cross ? "6 4" : undefined}
                        />
                      );
                    })}
                  </svg>

                  {nodes.map((n) => {
                    const on = n.id === selectedVisible.id;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        className={on ? `${styles.node} ${styles.nodeOn}` : styles.node}
                        style={{
                          left: n.x,
                          top: n.y,
                          borderLeftColor: KIND_COLOR[n.kind as SymbolKind],
                        }}
                        onClick={() => setSelectedId(n.id)}
                        aria-pressed={on}
                      >
                        {n.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className={styles.foot}>
                Click a symbol to inspect it. {graphSummary()}
              </p>
            </>
          ) : (
            <div>
              <p className={styles.eyebrow}>CODEBASE INTELLIGENCE</p>
              <h1 className={styles.title}>
                {sideView === "impact"
                  ? "Impact analysis"
                  : sideView === "search"
                    ? "Search"
                    : "Integrations"}
              </h1>
              <p className={styles.foot} style={{ marginTop: "1rem" }}>
                First slice ships the symbol graph. {sideView} lands with provider widgets
                (FE-197) — fixtures only; no Port writes.
              </p>
            </div>
          )}
        </div>

        {sideView === "graph" ? (
          <aside className={styles.inspector} aria-label="Symbol inspector">
            <div>
              <p className={styles.inspKind}>{selectedVisible.kind}</p>
              <p className={styles.inspName}>{selectedVisible.label}</p>
              <p className={styles.inspPath}>
                {selectedVisible.repo} / {selectedVisible.file}
              </p>
            </div>

            <div className={styles.sig}>{selectedVisible.sig}</div>

            <div>
              <p className={styles.sectionTitle}>CROSS-REPO REFERENCES</p>
              {selectedVisible.cross.length === 0 ? (
                <p className={styles.emptyHint}>
                  None. This symbol is only used inside its repo.
                </p>
              ) : (
                <div className={styles.crossList}>
                  {selectedVisible.cross.map((r) => (
                    <div key={`${r.repo}:${r.name}`} className={styles.crossItem}>
                      <span>{r.name}</span>
                      <span className={styles.crossRepo}>{r.repo}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className={styles.sectionTitle}>CALLS IN REPO</p>
              <div className={styles.localList}>
                {selectedVisible.local.map((name) => (
                  <div key={name} className={styles.localItem}>
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.primary} disabled title="Fixture slice">
                Open in editor
              </button>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => setSideView("impact")}
              >
                Impact analysis
              </button>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
