import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { PaymentFeeEstimate } from "./payment-fee-estimate";
import { hostedServices } from "@/shared/hosted-services";
import { Icon } from "./icon";
import "./product-confidence.css";

export function PaymentOffer({saleRecords,onSaleRecordsChange}: {saleRecords: boolean; onSaleRecordsChange: (enabled: boolean) => void}) {
  const fees = productFacts.payments;
  return <section className="page-container payment-offer-section" id="fees" aria-labelledby="payment-fees-title">
    <div className="consumer-section-heading"><div><p className="eyebrow">Pricing</p><h2 id="payment-fees-title">Know your fees.</h2></div><p>Standard pricing for US businesses taking online payments in USD. Eligibility and account approval apply.</p></div>
    <div className="payment-offer-grid">
      <div className="payment-price-card">
        <h3>Pay as you go</h3><p className="payment-base-rate">{fees.cardRateLabel}</p><p>per successful domestic online card payment</p>
        <dl className="payment-inclusions"><div><dt>Setup & monthly fee</dt><dd>${fees.setupFeeDollars}</dd></div><div><dt>Payment links & QR sharing</dt><dd>Included</dd></div><div><dt>Basic payment receipts</dt><dd>Included</dd></div></dl>
        <a href="#dispute-readiness" className="consumer-text-link">Explore {saleRecordsOffer.name}<Icon name="arrow" /></a>
        <p className="offer-small">Prices in USD. Review the complete fee schedule and payout terms during application, before accepting the merchant agreement.</p>
      </div>
      <PaymentFeeEstimate saleRecords={saleRecords} onSaleRecordsChange={onSaleRecordsChange} />
    </div>
    <details className="offer-details"><summary>Additional fees & refunds<span aria-hidden="true">+</span></summary><div className="offer-details-body">
      <dl className="fee-exceptions"><div><dt>International cards</dt><dd>+{fees.internationalRateLabel}</dd></div><div><dt>Currency conversion, when required</dt><dd>+{fees.conversionRateLabel}</dd></div><div><dt>Manually entered cards</dt><dd>+{fees.manualEntryRateLabel}</dd></div><div><dt>Disputes received</dt><dd>${fees.disputeFeeDollars} each</dd></div><div><dt>Manually countering a dispute</dt><dd>${fees.disputeResponseFeeDollars}; returned if you win</dd></div></dl>
      <p>Original processing and currency-conversion fees are not returned when a payment is refunded. Network charges and optional services may add costs; review the applicable terms. Sharing a link by text does not include a messaging subscription.</p>
      <p>{saleRecordsOffer.name} adds a {saleRecordsOffer.rateLabel} Trolleys service fee on eligible enrolled successful-payment volume, plus quoted vendor charges. Review your eligibility, vendor quote and service refund terms before enrollment.</p>
      <a className="consumer-text-link" href={hostedServices.payments.contactHref}>Ask about fees<Icon name="arrow" /></a>
    </div></details>
  </section>;
}

export function PaymentAftercare() {
  return <section className="payment-aftercare" id="payouts" aria-labelledby="payment-aftercare-title"><div className="page-container">
    <div className="consumer-section-heading"><div><p className="eyebrow">After payment</p><h2 id="payment-aftercare-title">From payment to payout.</h2></div><p>Track each step in Trolleys, from confirmed payment to bank deposit.</p></div>
    <ol className="payment-money-flow">
      <li><span className="payment-flow-icon"><Icon name="check" /></span><p className="eyebrow">01 · Confirmed</p><h3>Payment received</h3><p>Confirm the payment status and amount before fulfilling the order.</p></li>
      <li><span className="payment-flow-icon"><Icon name="document" /></span><p className="eyebrow">02 · Available</p><h3>Funds available</h3><p>Fees, refunds, disputes and holds affect the amount ready for payout.</p></li>
      <li><span className="payment-flow-icon"><Icon name="arrow" /></span><p className="eyebrow">03 · Paid out</p><h3>Sent to your bank</h3><p>Check your payout status. Bank arrival can take additional time.</p></li>
    </ol>
    <p className="payment-timing-note">Your account’s payout schedule applies. First payouts, reviews, reserves and bank holidays can affect availability.</p>
  </div></section>;
}
