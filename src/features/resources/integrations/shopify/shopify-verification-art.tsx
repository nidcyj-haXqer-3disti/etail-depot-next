import guideStyles from "./shopify-gateway-guide.module.css";
import styles from "./shopify-verification-art.module.css";

function Check() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8 3 3 6-6" /></svg>;
}

export function ShopifyVerificationArt() {
  return <figure className={guideStyles.figure} data-shopify-artwork="integration-verification">
    <div className={styles.frame}>
      <div className={styles.exampleLabel}><span>Payment captured</span></div>

      <div className={styles.shopify} role="group" aria-label="Shopify order and payment details">
        <div className={styles.shopifyBar}>
          <span className={styles.brand}>Shopify</span><span>Orders</span>
          <svg viewBox="0 0 18 18" aria-hidden="true"><circle cx="7.5" cy="7.5" r="4.5" /><path d="m11 11 4 4" /></svg>
        </div>
        <div className={styles.shopifyBody}>
          <div className={styles.orderTitle}>
            <span className={styles.back} aria-hidden="true">‹</span>
            <strong>#1001</strong><span className={styles.paid}><Check />Paid</span>
            <span className={styles.refundLabel}>Refund</span>
          </div>
          <div className={styles.paymentSummary}>
            <span><Check />Paid</span><strong>$5.00 <small>USD</small></strong>
          </div>
          <div className={styles.timeline}>
            <strong>Timeline</strong>
            <div className={styles.event}>
              <span className={styles.eventDot} aria-hidden="true" />
              <div>
                <span className={styles.eventTitle}>A $5.00 USD payment was processed on Cybersource.</span>
                <div className={styles.gatewayInfo}>
                  <span className={styles.gatewayTitle}><span aria-hidden="true">⌄</span> Information from the gateway</span>
                  <dl className={styles.matchField}><dt>Payment ID</dt><dd>example7f2a91</dd></dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.matchCaption}>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 3v14m-3-3 3 3 3-3M14 17V3m-3 3 3-3 3 3" /></svg>
        <span>Same payment ID, amount and currency</span>
      </div>

      <div className={styles.cybersource} role="group" aria-label="Cybersource transaction details">
        <div className={styles.cybersourceBar}><strong>Cybersource</strong><span>Business Center</span></div>
        <div className={styles.transactionBody}>
          <div className={styles.location}>Transaction Management <span aria-hidden="true">›</span> Transactions</div>
          <div className={styles.transactionTitle}><strong>Transaction details</strong><span className={styles.success}><Check />Success</span></div>
          <div className={styles.transactionCard}>
            <strong className={styles.cardTitle}>Order information</strong>
            <dl className={styles.transactionSummary}>
              <div><dt>Amount</dt><dd>5.00 <small>USD</small></dd></div>
              <div><dt>Application</dt><dd>Sale</dd></div>
            </dl>
            <dl className={styles.matchField}><dt>Merchant reference number</dt><dd>example7f2a91</dd></dl>
          </div>
        </div>
      </div>

      <div className={styles.refundNote}>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 3-4 4 4 4M3 7h8a5 5 0 0 1 0 10H8" /></svg>
        <div><strong>Then refund in Shopify</strong><span>Check the refund or void in Business Center.</span></div>
      </div>
    </div>
    <figcaption>Payment status depends on capture and settlement.</figcaption>
  </figure>;
}
