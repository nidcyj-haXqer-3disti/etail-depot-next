import { paymentExamples } from "@/modules/public-site/payment-examples";
import { formatUsdCents } from "@/modules/public-site/fee-estimate";
import { Icon } from "./icon";
import "./payment-highlights.css";

/** Decorative product stories; payment requests are created in Trolleys. */
export function PaymentHighlights() {
  return <div className="consumer-payment-summary payment-highlights">
    <article>
      <div className="payment-highlight-art payment-highlight-message" aria-hidden="true">
        <div className="payment-story-message">Your order is ready.<br />Here’s your payment link.</div>
        <div className="payment-story-request"><Icon name="link" /><div><span>{paymentExamples.goods.description}</span><strong>{formatUsdCents(paymentExamples.goods.amountCents)}</strong></div><Icon name="arrow" /></div>
      </div>
      <h3>Orders by message</h3><p>Share a payment link by text, email or social message.</p>
    </article>
    <article>
      <div className="payment-highlight-art payment-highlight-request" aria-hidden="true">
        <div className="payment-story-paper"><div><Icon name="document" /><span>Payment request</span></div><p>{paymentExamples.information.description}</p><div className="payment-story-total"><span>Amount due</span><strong>{formatUsdCents(paymentExamples.information.amountCents)}</strong></div><span className="payment-story-pay">Pay by card<Icon name="arrow" /></span></div>
      </div>
      <h3>Online checkout</h3><p>Let customers review the amount and pay by card on your payment page.</p>
    </article>
    <article>
      <div className="payment-highlight-art payment-highlight-counter" aria-hidden="true">
        <div className="payment-story-sign"><span>Scan to pay</span><Icon name="qr" /><small>Pay by card</small></div>
        <span className="payment-story-link"><Icon name="link" />Same payment link</span>
      </div>
      <h3>QR code payments</h3><p>Generate a QR code for your payment link so customers can scan and pay by card.</p>
    </article>
  </div>;
}
