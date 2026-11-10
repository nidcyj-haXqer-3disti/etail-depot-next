import { BrandImage } from "../../shared/brand/brand-image";
import "../../shared/brand/brand-images-symbol.css";
import { Icon } from "../../shared/ui/icon";
import styles from "./home-overview.module.css";
import { HomeArtMotion } from "./home-art-motion";

const connections = [
  "M244 186H270Q294 186 294 210V266Q294 290 318 290H352",
  "M448 206V242Q448 264 426 264H404",
  "M330 306V350Q330 374 354 374H448V480",
];

/** A service relationship illustration, with no transaction or account state. */
export function HomeCompanyArt() {
  return <HomeArtMotion className={styles.art} label="Etail Depot connects three service areas: merchant accounts, checkout and reporting; software platform integrations; and virtual secured credit cards. Merchant accounts require approval.">
    <div className={styles.artBackdrop} aria-hidden="true" />
    <svg className={styles.connections} viewBox="0 0 600 550" fill="none" aria-hidden="true">
      {connections.map(d => <path d={d} key={d} data-company-connection />)}
      <g className={styles.connectionFlows}>
        {connections.map(d => <path className={styles.connectionFlow} d={d} pathLength="100" key={d} />)}
      </g>
    </svg>
    <div className={styles.artBrand} aria-hidden="true">
      <BrandImage brand="symbol" alt="" width={800} height={484} className="" />
      <strong>Etail Depot</strong>
    </div>
    <div data-home-service-panel className={`${styles.artPanel} ${styles.merchantPanel}`} aria-hidden="true">
      <span className={styles.panelLabel}>For businesses</span>
      <strong className={styles.panelTitle}>Merchant services</strong>
      <div className={styles.merchantFunctions}>
        <div><span><Icon name="business" /></span><div><strong>Account</strong><small>Business review and setup</small></div></div>
        <div><span><Icon name="card" /></span><div><strong>Checkout</strong><small>Cards, wallets and ACH</small></div></div>
        <div><span><Icon name="document" /></span><div><strong>Reporting</strong><small>Payments and payouts</small></div></div>
      </div>
    </div>
    <div data-home-service-panel className={`${styles.artPanel} ${styles.platformPanel}`} aria-hidden="true">
      <div className={styles.panelTop}><Icon name="layers" /><span className={styles.panelLabel}>For software</span></div>
      <strong className={styles.panelTitle}>Platform partnerships</strong>
      <div className={styles.platformRecords}><span>Orders</span><span>Invoices</span><span>Bookings</span></div>
      <div className={styles.platformAccount}><span className={styles.recordConnector} /><Icon name="business" /><span>Merchant accounts</span></div>
    </div>
    <div data-home-service-panel className={`${styles.artPanel} ${styles.cardPanel}`} aria-hidden="true">
      <div className={styles.cardFace}><span>Etail Depot</span><svg viewBox="0 0 32 24" fill="none"><rect x="1" y="1" width="30" height="22" rx="5" /><path d="M10 1v7H1m30 0H21V1M10 23v-7H1m30 0H21v7M10 8h11v8H10Z" /></svg><span>Virtual card</span></div>
      <div><span className={styles.panelLabel}>For cardholders</span><strong className={styles.panelTitle}>Card services</strong><p>Virtual secured credit</p></div>
    </div>
  </HomeArtMotion>;
}
