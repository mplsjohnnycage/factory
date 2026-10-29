import styles from "./AtlasHero.module.css";

/**
 * First-viewport Code Atlas composition (PBI-008 shell).
 * Full-bleed graph plane + brand — not a dashboard of cards.
 * L0 indexed graph data lands in later PBIs; this is the visual shell.
 */
export function AtlasHero() {
  return (
    <section className={styles.hero} aria-label="Factory Code Atlas">
      <svg
        className={styles.graph}
        viewBox="0 0 1200 720"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
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
        <g stroke="rgba(26,107,138,0.28)" strokeWidth="1.5" fill="none">
          <path d="M180 420 C280 300, 360 260, 480 300" className={styles.edgeA} />
          <path d="M480 300 C620 350, 700 220, 860 250" className={styles.edgeB} />
          <path d="M480 300 C520 420, 640 480, 760 470" className={styles.edgeC} />
          <path d="M860 250 C940 320, 980 400, 1040 460" className={styles.edgeA} />
          <path d="M280 520 C360 480, 420 500, 480 300" className={styles.edgeB} />
          <path d="M760 470 C840 520, 920 500, 1000 560" className={styles.edgeC} />
        </g>
        <g filter="url(#soft)">
          <circle cx="180" cy="420" r="10" className={styles.node} />
          <circle cx="280" cy="520" r="8" className={styles.nodeSoft} />
          <circle cx="480" cy="300" r="14" className={styles.node} />
          <circle cx="760" cy="470" r="11" className={styles.node} />
          <circle cx="860" cy="250" r="12" className={styles.node} />
          <circle cx="1040" cy="460" r="9" className={styles.nodeSoft} />
          <circle cx="1000" cy="560" r="8" className={styles.nodeSoft} />
        </g>
      </svg>

      <div className={styles.veil} />

      <div className={styles.copy}>
        <p className={styles.brand}>Factory</p>
        <h1 className={styles.headline}>Developer OS</h1>
        <p className={styles.lede}>
          Meta control shell — Code Atlas first, Port-authorized actions only.
        </p>
        <div className={styles.cta}>
          <a className={styles.primary} href="/api/auth/port/login">
            Sign in with Port
          </a>
          <a className={styles.secondary} href="/session/demo">
            Open session stream
          </a>
          <span className={styles.hint}>
            Factory External Interface · Rivet-native stream · never Observatory / CopilotKit
          </span>
        </div>
      </div>
    </section>
  );
}
