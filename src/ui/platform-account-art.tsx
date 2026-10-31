import Image from "next/image";
import { Icon } from "./icon";
import styles from "./platform-account-art.module.css";

export function PlatformAccountArt({ title, caption }: { title: string; caption: string }) {
  return <figure className={styles.art} data-platform-account-art aria-label={title}>
    <div className={styles.workspace}>
      <div className={styles.toolbar}>
        <span className={styles.platformName}><Icon name="layers" />Your software</span>
        <span className={styles.context}>Orders, bookings and invoices</span>
      </div>
      <div className={styles.scene}>
        <div className={styles.purchase}>
          <div className={styles.purchaseHeader}>
            <span className={styles.customerIcon}><Icon name="person" /></span>
            <div><span className={styles.label}>Customer experience</span><strong className={styles.purchaseTitle}>The purchase.</strong></div>
          </div>
          <dl className={styles.purchaseDetails}>
            <div><dt>Purchase record</dt><dd>Order or invoice</dd></div>
            <div className={styles.seller}><dt>Selling business</dt><dd><Icon name="business" />Your merchant</dd></div>
          </dl>
          <div className={styles.checkout}>
            <span className={styles.checkoutIcon}><Icon name="card" /></span>
            <div><strong>Online checkout</strong><span>Enabled payment methods</span></div>
            <Icon name="lock" />
          </div>
        </div>
        <div className={styles.connection}>
          <span className={styles.connectionIcon}><Icon name="link" /></span>
          <span>Merchant<br className={styles.desktopBreak} /> reference</span>
        </div>
        <div className={styles.account}>
          <div className={styles.accountHeader}>
            <span className={styles.label}>Account relationship</span>
            <span className={styles.accountIcon}><Icon name="business" /></span>
          </div>
          <strong className={styles.accountTitle}>The merchant account.</strong>
          <span className={styles.accountSummary}>For the business making the sale.</span>
          <dl className={styles.accountDetails}>
            <div><dt>Account holder</dt><dd>Your merchant</dd></div>
            <div><dt>Account records</dt><dd>Payments and payouts</dd></div>
          </dl>
          <div className={styles.service}>
            <span className={styles.brandMark}><Image src="/brand/symbol.png" width={36} height={22} alt="" unoptimized /></span>
            <div><strong>Etail Depot</strong><span>Merchant services</span></div>
          </div>
        </div>
      </div>
    </div>
    <figcaption className={styles.caption}>{caption}</figcaption>
  </figure>;
}
