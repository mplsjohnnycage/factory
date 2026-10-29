import Link from "next/link";
import type { AppTile } from "@/lib/cockpit/fixtures";
import { APPS, ASSEMBLY, CONSTELLATION, HERO } from "@/lib/cockpit/fixtures";
import styles from "./CockpitHome.module.css";

function AppFace({ app }: { app: AppTile }) {
  return (
    <>
      <div className={styles.appFace}>
        <span className={styles.appGlow} style={{ background: app.glow }} aria-hidden />
        <span className={styles.appMono}>{app.monogram}</span>
        <span className={styles.appSheen} aria-hidden />
        {app.badge ? <span className={styles.appBadge}>{app.badge}</span> : null}
      </div>
      <div className={styles.appName}>{app.name}</div>
    </>
  );
}

function AppTileLink({ app }: { app: AppTile }) {
  if (app.href === "#") {
    return (
      <div className={styles.appTile}>
        <AppFace app={app} />
      </div>
    );
  }
  if (app.href.startsWith("http")) {
    return (
      <a
        className={styles.appTile}
        href={app.href}
        target="_blank"
        rel="noreferrer"
      >
        <AppFace app={app} />
      </a>
    );
  }
  return (
    <Link className={styles.appTile} href={app.href}>
      <AppFace app={app} />
    </Link>
  );
}

/**
 * Factory Cockpit home — Port Context Lake hero, Assembly line, Apps.
 * Source of truth: docs/design/mockups/Factory Cockpit v3.dc.html
 */
export function CockpitHome() {
  return (
    <section className={styles.home} aria-label="Factory Cockpit home">
      <div className={styles.field}>
        <div className={styles.constellation} aria-hidden>
          {CONSTELLATION.map((n, i) => (
            <span
              key={i}
              className={styles.node}
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                width: n.s,
                height: n.s,
                background: n.c,
                color: n.c,
                opacity: n.op,
              }}
            >
              {"label" in n && n.label ? (
                <span className={styles.nodeLabel}>{n.label}</span>
              ) : null}
            </span>
          ))}
        </div>
        <div className={styles.fade} />

        <div className={styles.hero}>
          <span className={styles.heroShine} aria-hidden />
          <div className={styles.portMark}>
            <span className={styles.portBadge}>P</span>
            Port · Context Lake
            <span className={styles.portSlash}>/</span>
            <span className={styles.portBp}>{HERO.blueprint}</span>
          </div>
          <h1 className={styles.heroTitle}>{HERO.name}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.status}>
              <span className={styles.statusDot} aria-hidden />
              {HERO.statusLabel}
            </span>
            <span className={styles.owner}>{HERO.owner}</span>
            <span className={styles.tier}>{HERO.tier}</span>
          </div>
          <p className={styles.lede}>{HERO.meta}</p>
          <div className={styles.ctaRow}>
            <Link className={styles.ctaPrimary} href="/api/auth/port/login">
              Sign in with Port
            </Link>
            <Link className={styles.ctaGhost} href="/atlas">
              Open Code Atlas
            </Link>
            <Link className={styles.ctaGhost} href="/session/demo">
              Session stream
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Assembly line</h2>
        <span className={styles.sectionSub}>
          {ASSEMBLY.length} active · Meta lane fixtures
        </span>
      </div>
      <div className={styles.assembly}>
        {ASSEMBLY.map((card, index) => (
          <Link
            key={card.id}
            href={card.href}
            className={styles.card}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className={styles.cardTop}>
              <span
                className={styles.bpDot}
                style={{ background: card.blueprintColor }}
                aria-hidden
              />
              <span className={styles.entity}>{card.entity}</span>
              <span
                className={styles.pill}
                style={{ color: card.pillColor, background: card.pillBg }}
              >
                {card.pill}
              </span>
            </div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <div className={styles.segs} aria-hidden>
              {card.segments.map((seg) => (
                <div key={seg.label} className={styles.seg}>
                  <div className={styles.segTrack}>
                    <div
                      className={styles.segFill}
                      style={{ width: seg.width, background: seg.color }}
                    />
                  </div>
                  <span className={styles.segLabel} style={{ color: seg.labelColor }}>
                    {seg.label}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.cardFoot}>
              <span>{card.line}</span>
              <span className={styles.agentId}>{card.agent}</span>
            </div>
          </Link>
        ))}
        <div className={`${styles.card} ${styles.newCard}`} aria-hidden>
          <span className={styles.newPlus}>+</span>
          <p className={styles.newTitle}>New build</p>
          <p className={styles.newSub}>Provision from a template</p>
        </div>
      </div>

      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>Apps</h2>
        <span className={styles.sectionSub}>Connected surfaces · status only</span>
      </div>
      <div className={styles.apps}>
        {APPS.map((app) => (
          <AppTileLink key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}
