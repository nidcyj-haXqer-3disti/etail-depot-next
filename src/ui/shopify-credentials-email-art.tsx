import { TrolleysBrand, TrolleysSymbol } from "./trolleys-brand";
import guideStyles from "./shopify-gateway-guide.module.css";
import styles from "./shopify-credentials-email-art.module.css";

function HiddenEmailValue() {
  return <><span className={styles.masked} aria-hidden="true">••••••••••</span><span className={styles.srOnly}>Provided in your account email</span></>;
}

export function ShopifyCredentialsEmailArt({ store = "Shopify", exampleValues }: { store?: "Shopify" | "WooCommerce"; exampleValues?: { organization: string; username: string } } = {}) {
  return <figure className={guideStyles.figure} data-shopify-artwork="credentials-email">
    <div className={styles.frame}>
      <div className={styles.email}>
        <div className={styles.toolbar} aria-hidden="true">
          <svg viewBox="0 0 20 20"><path d="M16 10H4m5-5-5 5 5 5" /></svg>
          <svg viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="3" rx=".5" /><path d="M4 6v10h12V6M8 10h4" /></svg>
          <svg viewBox="0 0 20 20"><path d="M4 5h12M7 5V3h6v2M6 5v11h8V5M9 8v5m2-5v5" /></svg>
          <svg viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="12" rx="1" /><path d="m3 5 7 5 7-5" /></svg>
          <span className={styles.toolbarEnd}>•••</span>
        </div>
        <div className={styles.subject}>
          <strong>Your Cybersource sign in details</strong>
          <span>Inbox</span>
        </div>
        <div className={styles.sender}>
          <TrolleysSymbol compact />
          <div className={styles.senderName}><strong>Trolleys</strong><span>to me <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" /></svg></span></div>
          <div className={styles.messageIcons} aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m10 2 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8Z" /></svg><svg viewBox="0 0 20 20"><path d="M8 5 3 9l5 4V9h3c3 0 5 2 6 5 0-5-2-8-6-8H8Z" /></svg></div>
        </div>
        <div className={styles.body}>
          <div className={styles.greeting}>Hello,</div>
          <div className={styles.message}>Use your Cybersource account details to connect your {store} store.</div>
          <dl className={styles.details}>
            <div><dt>Organization ID</dt><dd>{exampleValues ? <code>{exampleValues.organization}</code> : <HiddenEmailValue />}</dd></div>
            <div><dt>Username</dt><dd>{exampleValues ? <code>{exampleValues.username}</code> : <HiddenEmailValue />}</dd></div>
            <div><dt>Password</dt><dd>Follow the email instructions</dd></div>
          </dl>
          <div className={styles.message}>Return to Business Center and enter your details to sign in.</div>
          <div className={styles.signature}><TrolleysBrand compact showSymbol={false} /></div>
        </div>
      </div>
    </div>
    <figcaption>{exampleValues ? "Illustrated email with fictional account details. Use the details sent to you." : "Illustrated email. Your message may look different."}</figcaption>
  </figure>;
}
