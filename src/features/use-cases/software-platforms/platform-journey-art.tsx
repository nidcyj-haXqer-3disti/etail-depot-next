import { TrolleysBrand } from "@/shared/brand/trolleys-brand";
import { Icon } from "@/shared/ui/icon";
import s from "./platform-journey-art.module.css";

const payments = [
  { order: "1048", item: "Cotton towel set", amount: "$150.00" },
  { order: "1047", item: "Pillowcase set", amount: "$42.00" },
  { order: "1046", item: "Duvet cover set", amount: "$240.00" },
] as const;

export function PlatformJourneyArt() {
  return <figure className={s.journey} data-platform-journey aria-label="Example merchant journey for Cotton Supply. A $150 checkout is one of three payments totaling $432. After $13.43 in example fees, payout P1048 is $418.57. A matching $418.57 bank credit is shown as posted.">
    <div className={s.scene}>
      <div className={s.context}><span><Icon name="business" /><strong>Cotton Supply</strong><small>MID 824630170001</small></span><span>Example merchant journey · USD</span></div>
      <div className={s.flow}>
        <div className={s.checkout} data-journey-checkout>
          <div className={s.cardHeading}><Icon name="lock" /><span>Checkout</span></div>
          <span className={s.eyebrow}>ORDER #1048</span><strong className={s.total}>$150.00</strong>
          <div className={s.product}><span className={s.productTile} aria-hidden="true"><i /><i /></span><span>Cotton towel set<small>2 × $75.00</small></span></div>
          <div className={s.cardMethod}><Icon name="card" /><span>Visa ending 4242</span></div>
          <div className={s.paid}><Icon name="check" />Payment captured</div>
        </div>
        <div className={s.report} data-journey-records>
          <div className={s.reportBar}><TrolleysBrand compact /><span>Merchant view</span></div>
          <div className={s.reportBody}>
            <div className={s.reportHeading}><strong>Payments in this payout</strong><span>P1048</span></div>
            <div className={s.salesTotal}><span>Gross sales</span><strong>$432.00</strong><small>3 payments</small></div>
            <div className={s.payments}>{payments.map(payment=><div className={s.payment} key={payment.order}><span><strong>Order #{payment.order}</strong><small>{payment.item}</small></span><b>{payment.amount}</b></div>)}</div>
            <dl className={s.breakdown}><div><dt>Example processing fees</dt><dd>−$13.43</dd></div><div><dt>Net payout</dt><dd>$418.57</dd></div></dl>
          </div>
        </div>
        <div className={s.bank} data-journey-bank>
          <div className={s.cardHeading}><Icon name="bank" /><span>Business checking</span></div>
          <span className={s.bankAccount}>Account ending 2108</span>
          <div className={s.bankTitle}><strong>Account activity</strong><span>10 Nov 2026</span></div>
          <div className={s.bankCredit}><span>Card settlement</span><strong>+$418.57</strong><span className={s.posted}><Icon name="check" />Posted</span></div>
          <dl className={s.bankFields}><div><dt>Related reference</dt><dd>P1048</dd></div><div><dt>Currency</dt><dd>USD</dd></div></dl>
        </div>
      </div>
      <ol className={s.explanations}>
        <li><span>01</span><div><h3>A customer pays.</h3><p>The purchase stays linked to the merchant account.</p></div></li>
        <li><span>02</span><div><h3>The merchant sees the detail.</h3><p>Sales, fees and adjustments explain the net payout.</p></div></li>
        <li><span>03</span><div><h3>The bank records the credit.</h3><p>Match the payout with the bank statement.</p></div></li>
      </ol>
    </div>
    <figcaption>Example records. Checkout and bank views are separate from the merchant portal. Payout timing, fees and available payment methods depend on the approved account.</figcaption>
  </figure>;
}
