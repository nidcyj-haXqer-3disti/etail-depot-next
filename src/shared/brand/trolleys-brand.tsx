import { BrandImage } from "./brand-image";
import "./brand-images-trolleys.css";
import styles from "./trolleys-brand.module.css";

/** Reuses the portal symbol without changing the original artwork. */
export function TrolleysSymbol({ compact = false }: { compact?: boolean }) {
  return <span className={`${styles.symbol}${compact ? ` ${styles.smallSymbol}` : ""}`} aria-hidden="true">
    <span className={styles.crop}><BrandImage brand="trolleys" alt="" width={460} height={112} className={styles.portalImage} /></span>
  </span>;
}

export function TrolleysBrand({ compact = false, inverse = false, showSymbol = true, spacing }: {
  compact?: boolean; inverse?: boolean; showSymbol?: boolean; spacing?: "intro";
}) {
  return <span className={[styles.brand, compact && styles.compact, inverse && styles.inverse, spacing === "intro" && styles.intro].filter(Boolean).join(" ")}>
    {showSymbol && <TrolleysSymbol compact={compact} />}
    <span className={styles.identity}><strong className={styles.name}>Trolleys</strong><span className={styles.attribution}>Powered by <span>Etail Depot</span></span></span>
  </span>;
}
