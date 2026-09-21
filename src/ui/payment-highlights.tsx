import { Icon } from "./icon";
import "./payment-highlights.css";

/** Decorative product stories; payment requests are created in Trolleys. */
export function PaymentHighlights() {
  return <div className="consumer-payment-summary payment-highlights">
    <article>
      <div className="payment-highlight-art payment-highlight-message" aria-hidden="true">
        <div className="payment-story-message">Ready to book your session?<br />Here’s the link for your deposit.</div>
        <div className="payment-story-request"><Icon name="link" /><div><span>Photography session</span><strong>$80.00 <small>Deposit</small></strong></div><Icon name="arrow" /></div>
      </div>
      <h3>Booking deposits</h3><p>Send a request when your customer is ready to book.</p>
    </article>
    <article>
      <div className="payment-highlight-art payment-highlight-invoice" aria-hidden="true">
        <div className="payment-story-invoice"><div><Icon name="document" /><span>Payment request</span></div><p>Design project</p><div className="payment-story-total"><span>Amount due</span><strong>$480.00</strong></div><span className="payment-story-pay">Pay by card<Icon name="arrow" /></span></div>
      </div>
      <h3>Payments for your work</h3><p>Send a payment request for the work you deliver.</p>
    </article>
    <article>
      <div className="payment-highlight-art payment-highlight-counter" aria-hidden="true">
        <div className="payment-story-sign"><span>Scan to pay</span><Icon name="qr" /></div>
        <span className="payment-story-link"><Icon name="link" />Or share a link</span>
      </div>
      <h3>Sales wherever you are</h3><p>Share a link online or display a QR code in person.</p>
    </article>
  </div>;
}
