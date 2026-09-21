import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { PaymentFeeEstimate } from "./payment-fee-estimate";
import { hostedServices } from "@/shared/hosted-services";
import { Icon } from "./icon";
import "./product-confidence.css";

export function PaymentOffer({saleRecords,onSaleRecordsChange}: {saleRecords: boolean; onSaleRecordsChange: (enabled: boolean) => void}) {
  const fees = productFacts.payments;
  return <section className="page-container payment-offer-section" id="fees" aria-labelledby="payment-fees-title">
    <div className="consumer-section-heading"><div><h2 id="payment-fees-title">Know your fees.</h2></div><p>For US businesses accepting online payments in USD. Eligibility and account approval apply.</p></div>
    <div className="payment-offer-grid">
      <div className="payment-price-card">
        <h3>Card payments</h3><p className="payment-base-rate">{fees.cardRateLabel}</p><p>per successful domestic online card payment</p>
        <dl className="payment-inclusions"><div><dt>Setup & monthly fee</dt><dd>${fees.setupFeeDollars}</dd></div><div><dt>Payment links & QR sharing</dt><dd>Included</dd></div><div><dt>Basic payment receipts</dt><dd>Included</dd></div></dl>
        <p className="offer-small">Review your full fee schedule and payout terms before accepting the merchant agreement.</p>
      </div>
      <PaymentFeeEstimate saleRecords={saleRecords} onSaleRecordsChange={onSaleRecordsChange} />
    </div>
    <details className="offer-details"><summary>Additional fees & refunds<span aria-hidden="true">+</span></summary><div className="offer-details-body">
      <dl className="fee-exceptions"><div><dt>International cards</dt><dd>+{fees.internationalRateLabel}</dd></div><div><dt>Currency conversion, when required</dt><dd>+{fees.conversionRateLabel}</dd></div><div><dt>Manually entered cards</dt><dd>+{fees.manualEntryRateLabel}</dd></div><div><dt>Disputes received</dt><dd>${fees.disputeFeeDollars} each</dd></div><div><dt>Manually countering a dispute</dt><dd>${fees.disputeResponseFeeDollars}; returned if you win</dd></div></dl>
      <p>Original processing and currency-conversion fees are not returned when a payment is refunded. Network charges and optional services may add costs; review the applicable terms. Sharing a link by text does not include a messaging subscription.</p>
      <p>The {saleRecordsOffer.name} fee is {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}. Review eligibility, applicable charges and service refund terms before enrollment.</p>
      <a className="consumer-text-link" href={hostedServices.payments.contactHref}>Ask about fees<Icon name="arrow" /></a>
    </div></details>
  </section>;
}
