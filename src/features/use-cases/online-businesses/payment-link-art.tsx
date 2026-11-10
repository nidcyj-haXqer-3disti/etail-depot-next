import { serviceExample } from "@/shared/ui/artwork/service-example";
import { CommerceProductArt } from "../../services/overview/commerce-product-art";
import { Icon } from "../../../shared/ui/icon";
import "./payment-link-art.css";

/** Static acceptance flow; no payable link, encoded QR or payment action. */
export function PaymentLinkArt() {
  return <figure className="payment-link-art" role="img" aria-label={`Payment request flow: create a $100 request for ${serviceExample.description}, share it with a customer, and let the customer pay on a hosted payment page. The example request is ${serviceExample.requestReference} for ${serviceExample.customer}, linked to order ${serviceExample.orderReference}. No payment is made here.`}>
    <div className="payment-link-art-window" aria-hidden="true">
      <div className="payment-link-art-header"><span><Icon name="business" />Your business</span><span>{serviceExample.requestReference}</span></div>
      <ol className="payment-link-art-flow">
        <li>
          <div className="payment-link-art-stage"><span>1</span><strong>Create</strong></div>
          <div className="payment-link-art-order"><p className="payment-link-art-reference">Order {serviceExample.orderReference}</p><div className="payment-link-art-product">
            <span className="commerce-product-thumbnail"><CommerceProductArt /></span>
            <div><strong>{serviceExample.description}</strong><span>{serviceExample.productDetail}</span><span className="payment-link-art-amount">$100.00 <small>USD</small></span></div>
          </div></div>
        </li>
        <li>
          <div className="payment-link-art-stage"><span>2</span><strong>Share</strong></div>
          <div className="payment-link-art-message">
            <p><span>To</span>{serviceExample.customerEmail}</p>
            <div><Icon name="message" /><strong>Your order is ready</strong></div>
            <p>Hi Alex, here is the payment request for your order {serviceExample.orderReference}.</p>
            <span className="payment-link-art-message-link">View payment request <Icon name="link" /></span>
          </div>
        </li>
        <li>
          <div className="payment-link-art-stage"><span>3</span><strong>Customer pays</strong></div>
          <div className="payment-link-art-destination"><span><Icon name="lock" /></span><div><strong>Pay $100.00 USD</strong><span>Hosted payment page · {serviceExample.requestReference}</span></div></div>
        </li>
      </ol>
    </div>
  </figure>;
}
