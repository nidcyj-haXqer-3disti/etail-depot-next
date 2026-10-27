import { NetworkMark } from "./network-brands";
import "./partner-program-art.css";

function SampleBag() {
  return (
    <svg className="ppa-bag" width="48" height="52" viewBox="0 0 48 52" fill="none" aria-hidden="true" focusable="false">
      <path d="M15 17v-5a9 9 0 0 1 18 0v5" stroke="currentColor" strokeWidth="2" />
      <path d="M8 17h32l3 30H5l3-30Z" fill="#e4e9d9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 17v13h20V17M19 35h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Fictional, matched payment records; this is not an enabled provider interface. */
export function PartnerProgramArt() {
  return (
    <figure className="partner-program-art" aria-label="From checkout to payment record">
      <div className="ppa-workspace">
        <div className="ppa-merchant">
          <span className="ppa-merchant-mark" aria-hidden="true">K</span>
          <div><strong>Kestrel Workshop</strong><span>Online order</span></div>
        </div>
        <div className="ppa-experience">
          <div className="ppa-checkout" role="group" aria-label="Customer checkout">
            <p className="ppa-panel-title">Customer checkout</p>
            <div className="ppa-purchase">
              <span className="ppa-product-art"><SampleBag /></span>
              <div><strong>Canvas field bag</strong><span>1 item</span></div>
            </div>
            <p className="ppa-order-reference">Order ORD-1048</p>
            <div className="ppa-checkout-total"><span>Total</span><strong>$64.00 <small>USD</small></strong></div>
            <div className="ppa-card-marks" role="group" aria-label="Visa and Mastercard">
              <NetworkMark network="visa" decorative />
              <NetworkMark network="mastercard" decorative />
            </div>
            <div className="ppa-checkout-complete">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>Payment complete</span>
            </div>
          </div>
          <div className="ppa-payment" role="group" aria-label="Payment record">
            <div className="ppa-payment-heading"><p className="ppa-panel-title">Payment details</p><span className="ppa-payment-state">Captured</span></div>
            <p className="ppa-payment-amount">$64.00 <span>USD</span></p>
            <dl className="ppa-payment-facts">
              <div><dt>Payment</dt><dd>PAY-1048</dd></div>
              <div><dt>Order</dt><dd>ORD-1048</dd></div>
              <div><dt>Card</dt><dd>Visa ···· 4242</dd></div>
            </dl>
            <div className="ppa-related-records">
              <details><summary>Refunds</summary><p>No refund recorded.</p></details>
              <details><summary>Disputes</summary><p>No dispute recorded.</p></details>
            </div>
          </div>
        </div>
      </div>
      <figcaption>From checkout to payment record</figcaption>
    </figure>
  );
}
