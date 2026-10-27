import { serviceExample } from "@/modules/public-site/service-model";
import { CommerceProductArt } from "./commerce-product-art";
import { Icon } from "./icon";
import "./payment-link-art.css";

/** Static acceptance flow; no payable link, encoded QR or payment action. */
export function PaymentLinkArt() {
  return <figure className="payment-link-art" role="img" aria-label={`Payment request flow: create a $100 request for ${serviceExample.description}, share it with a customer, and let the customer pay on a hosted payment page. No payment is made here.`}>
    <div className="payment-link-art-window" aria-hidden="true">
      <div className="payment-link-art-header"><span><Icon name="business" />Your business</span><span>Payment request</span></div>
      <ol className="payment-link-art-flow">
        <li>
          <div className="payment-link-art-stage"><span>1</span><strong>Create</strong></div>
          <div className="payment-link-art-product">
            <span className="commerce-product-thumbnail"><CommerceProductArt /></span>
            <div><strong>{serviceExample.description}</strong><span>1 pair · Chalk / Teal</span><span className="payment-link-art-amount">$100.00 <small>USD</small></span></div>
          </div>
        </li>
        <li>
          <div className="payment-link-art-stage"><span>2</span><strong>Share</strong></div>
          <div className="payment-link-art-delivery">
            <div><Icon name="message" /><span>Email, text or social</span></div>
            <div><Icon name="link" /><span>Website button</span></div>
            <div><Icon name="qr" /><span>QR code</span></div>
          </div>
        </li>
        <li>
          <div className="payment-link-art-stage"><span>3</span><strong>Customer pays</strong></div>
          <div className="payment-link-art-destination"><span><Icon name="lock" /></span><div><strong>Hosted payment page</strong><span>On mobile, tablet or desktop</span></div></div>
        </li>
      </ol>
    </div>
  </figure>;
}
