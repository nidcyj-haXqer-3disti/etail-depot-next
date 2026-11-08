import { BrandImage } from "../../../shared/brand/brand-image";
import { Icon } from "../../../shared/ui/icon";
import s from "./merchant-record-art.module.css";

/** Opening marks arrive with this page's stylesheet, retaining their exact source proportions. */
function PaymentMark({ brand, width, height, displayWidth }: { brand: "apple-pay" | "google-pay" | "visa" | "mastercard" | "amex" | "discover"; width: number; height: number; displayWidth: number }) {
  return <span data-payment-mark={brand}><BrandImage brand={brand} alt="" width={width} height={height} className="payment-choice-mark" style={{ width: displayWidth, height: "auto" }} /></span>;
}

/** Static workflow illustrations. These do not represent a signed in account or payment controls. */
export function PaymentChoiceArt() {
  return <div className={s.choiceArt} role="img" aria-label="Customer checkout for order 10482 offers enabled cards, digital wallets and ACH. The same order reference connects to the merchant payment record. A browser return does not confirm payment.">
    <div aria-hidden="true">
      <div className={s.checkout}><div className={s.checkoutHeading}><span>Order #10482</span><Icon name="lock" /></div><strong className={s.checkoutTitle}>Choose how to pay.</strong>
        <div className={s.wallets}><div><PaymentMark brand="apple-pay" width={165.52107} height={105.9651} displayWidth={52} /></div><div><PaymentMark brand="google-pay" width={1094} height={742} displayWidth={57} /></div></div>
        <div className={s.cardMethod}><div><Icon name="card" /><strong>Credit or debit card</strong></div><div className={s.networks}><PaymentMark brand="visa" width={278.075} height={169.374} displayWidth={37} /><PaymentMark brand="mastercard" width={126} height={82.8} displayWidth={30} /><PaymentMark brand="amex" width={1} height={1} displayWidth={24} /><PaymentMark brand="discover" width={521} height={342} displayWidth={39} /></div></div>
        <div className={s.bankMethod}><Icon name="bank" /><span>US bank account</span><strong>ACH</strong></div>
      </div>
      <div className={s.recordBridge}><Icon name="link" /><span>Keep the order reference</span></div>
      <div className={s.result}><div className={s.resultHeading}><span>Merchant payment record</span><strong>#10482</strong></div><div className={s.resultFields}><div><span>Payment reference</span><strong>Linked to the order</strong></div><div><span>Recorded status</span><strong>Check before fulfillment</strong></div></div></div>
    </div>
  </div>;
}

export function ReconciliationMatchArt() {
  return <div className={s.matchArt} role="img" aria-label="Reconciliation compares a payout report with the bank statement. The diagram pairs reference PO 10482 and 96 dollars 80 cents in USD on both records. Confirm the merchant account, included activity and bank credit; investigate any remaining difference.">
    <div aria-hidden="true">
      <div className={s.activity}><Icon name="layers" /><span>Payments, fees and adjustments</span><Icon name="arrow" /></div>
      <div className={s.comparison}>
        <div className={s.report}><div className={s.recordHeading}><Icon name="document" /><strong>Payout report</strong></div><dl><div><dt>Payout reference</dt><dd>PO 10482</dd></div><div><dt>Payout amount</dt><dd>$96.80 <small>USD</small></dd></div></dl></div>
        <div className={s.statement}><div className={s.recordHeading}><Icon name="bank" /><strong>Bank statement</strong></div><dl><div><dt>Related reference</dt><dd>PO 10482</dd></div><div><dt>Posted credit</dt><dd>$96.80 <small>USD</small></dd></div></dl></div>
      </div>
      <div className={s.matchRule}><Icon name="link" /><div><strong>Reference and amount match</strong><span>Confirm the credit has reached the bank.</span></div></div>
      <div className={s.unresolved}><span>Difference remains?</span><strong>Check the unmatched amount.</strong></div>
    </div>
  </div>;
}
