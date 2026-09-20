import { Icon } from "./icon";
import { NetworkBrands } from "./network-brands";
import "./payment-journey-art.css";

/** An illustrative request-to-checkout journey, not a live payment form. */
export function PaymentJourneyArt() {
  return <figure className="payment-journey-art" aria-label="Illustrated payment journey">
    <div className="payment-journey-scene">
      <div className="payment-journey-orbit" aria-hidden="true" />
      <div className="payment-journey-request">
        <p className="payment-journey-stage"><span>01</span> Create & share</p>
        <div className="payment-journey-request-copy">
          <p>Studio booking</p>
          <strong>$80.00</strong>
        </div>
        <div className="payment-journey-share" aria-hidden="true">
          <span><Icon name="message" /></span>
          <span><Icon name="mail" /></span>
          <span><Icon name="qr" /></span>
          <span><Icon name="link" /></span>
        </div>
      </div>
      <div className="payment-journey-connector" aria-hidden="true"><Icon name="arrow" /></div>
      <div className="payment-journey-checkout">
        <p className="payment-journey-stage"><span>02</span> Your customer pays</p>
        <div className="payment-journey-order">
          <span className="payment-journey-studio" aria-hidden="true"><span /><span /><span /></span>
          <p>Studio booking</p>
        </div>
        <strong className="payment-journey-total">$80.00</strong>
        <div className="payment-journey-card-details">
          <Icon name="card" /><span>Credit or debit card</span><Icon name="lock" />
        </div>
        <NetworkBrands label="Illustrated checkout card networks" />
        <div className="payment-journey-pay" aria-hidden="true">Pay $80.00 <Icon name="arrow" /></div>
      </div>
    </div>
    <figcaption>Payment example</figcaption>
  </figure>;
}
