import Image from "next/image";
import portalLogo from "./assets/trolleys-portal-logo.png";
import styles from "./trolleys-brand.module.css";

/** Reuses the portal symbol without changing the original artwork. */
export function TrolleysSymbol({ compact = false, preload = false }: { compact?: boolean; preload?: boolean }) {
  return <span className={`${styles.symbol}${compact ? ` ${styles.smallSymbol}` : ""}`} aria-hidden="true">
    <span className={styles.crop}><Image src={portalLogo} alt="" width={184} height={45} unoptimized preload={preload} /></span>
  </span>;
}

export function TrolleysBrand({ compact = false, inverse = false, showSymbol = true, preload = false, spacing }: {
  compact?: boolean; inverse?: boolean; showSymbol?: boolean; preload?: boolean; spacing?: "intro";
}) {
  return <span className={[styles.brand, compact && styles.compact, inverse && styles.inverse, spacing === "intro" && styles.intro].filter(Boolean).join(" ")}>
    {showSymbol && <TrolleysSymbol compact={compact} preload={preload} />}
    <span className={styles.identity}><strong className={styles.name}>Trolleys</strong><span className={styles.attribution}>Powered by <span>Etail Depot</span></span></span>
  </span>;
}
