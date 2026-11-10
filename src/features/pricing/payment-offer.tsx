import "./site-artwork-polish-pricing.css";
import { productFacts } from "@/shared/site/product-facts";
import { PaymentFeeEstimate } from "./payment-fee-estimate";
import { Icon } from "../../shared/ui/icon";
import "../../shared/styles/product-confidence.css";

export function PaymentOffer() {
  const fees = productFacts.payments;
  return <section className="page-container payment-offer-section" id="fees" aria-labelledby="payment-fees-title">
    <div className="consumer-section-heading"><div><h2 id="payment-fees-title">Credit card processing fees.</h2></div></div>
    <div className="pricing-panel">
      <div className="pricing-rate">
        <h3>Online card payments</h3>
        <p className="payment-base-rate">{fees.cardRateLabel}</p>
        <p className="pricing-rate-basis">per successful domestic online card payment</p>
        <dl className="pricing-account-fees">
          <div><dt>Monthly fee</dt><dd>${fees.monthlyFeeDollars}</dd></div>
          <div><dt>Setup fee</dt><dd>${fees.setupFeeDollars}</dd></div>
        </dl>
        <div className="pricing-included">
          <p>Included</p>
          <ul aria-label="Included services">
            <li><Icon name="link" /><span>Payment links</span></li>
            <li><Icon name="qr" /><span>QR sharing</span></li>
            <li><Icon name="document" /><span>Basic payment receipts</span></li>
          </ul>
        </div>
        <p className="pricing-scope">Published offer for US businesses accepting payments in USD. Account approval applies. Your accepted fee schedule determines your charges.</p>
      </div>
      <PaymentFeeEstimate />
    </div>
    <details className="offer-details"><summary>Additional fees and refunds<span aria-hidden="true">+</span></summary><div className="offer-details-body">
      <dl className="fee-exceptions">
        <div><dt>International cards</dt><dd>+{fees.internationalRateLabel}</dd></div>
        <div><dt>Currency conversion, when required</dt><dd>+{fees.conversionRateLabel}</dd></div>
        <div><dt>Card details entered by the merchant</dt><dd>+{fees.manualEntryRateLabel}</dd></div>
        <div><dt>Disputes received</dt><dd>${fees.disputeFeeDollars} each</dd></div>
        <div><dt>Manual dispute response</dt><dd>${fees.disputeResponseFeeDollars}; returned if you win</dd></div>
      </dl>
      <div className="pricing-conditions">
        <h3>When other charges apply</h3>
        <p>The additional fee for manual entry applies when you enter a customer’s card details. It does not apply when customers enter their own details at online checkout.</p>
        <h3>Refunds and other costs</h3>
        <p>Original processing and currency conversion fees are not returned when a payment is refunded. Network charges and optional services may add costs. Sharing a link by text does not include a messaging subscription.</p>
      </div>
    <div className="payment-method-scope"><strong>ACH bank payments</strong><p>ACH has separate pricing and payout terms. Confirm the options for your account. The rate and calculator above apply to card payments.</p></div>
    </div></details>
  </section>;
}
