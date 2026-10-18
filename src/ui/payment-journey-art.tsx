"use client";

import { useId, useRef } from "react";
import { paymentExamples, type PaymentExamplePurpose } from "@/modules/public-site/payment-examples";
import { formatUsdCents } from "@/modules/public-site/fee-estimate";
import { usePaymentExample } from "./payment-example-context";
import { PaymentChannelPreview } from "./payment-channel-preview";
import { Icon } from "./icon";
import { NetworkBrands } from "./network-brands";
import "./payment-journey-art.css";

const saleTypes = Object.keys(paymentExamples) as PaymentExamplePurpose[];
const typeDescriptions = { goods: "Products & orders", services: "Projects & appointments", information: "Research & insights" } as const;
const requestGuidance = {
  goods: "Describe the item, quantity, amount due and delivery arrangements. Make the return terms clear before payment.",
  services: "Describe the work, the amount due now and any remaining balance. Include the delivery date and cancellation terms.",
  information: "State the subject, format, delivery deadline and access conditions. Explain when the information is current and whether updates are included.",
} as const;

function SaleThumbnail({ type }: { type: PaymentExamplePurpose }) {
  return <span className="sale-thumbnail" data-sale={type} aria-hidden="true">
    {type === "goods" ? <><span className="sale-parcel"><i /></span><span className="sale-bag"><i /></span></>
      : type === "services" ? <span className="sale-calendar"><i /><span><b /><b /><b /><b /><b /><b /></span><Icon name="person" /></span>
      : <span className="sale-report"><i /><i /><span><b /><b /><b /><b /></span><em /></span>}
  </span>;
}

/** One local marketing example: two merchant actions, followed by customer checkout. */
export function PaymentJourneyArt() {
  const { purpose, setPurpose } = usePaymentExample();
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const example = paymentExamples[purpose];
  const amount = formatUsdCents(example.amountCents);

  return <figure className="payment-journey-art payment-two-step" id="payment-channels" aria-label="Illustrated payment journey">
    <div className="two-step-signature"><h2><Icon name="link" />Trolleys Two Step</h2><p>Explore a payment from request to checkout.</p></div>
    <div className="two-step-stages">
      <section className="payment-create-step" aria-labelledby={`${id}-create`}>
        <div className="two-step-heading"><span aria-hidden="true">01</span><div><h3 id={`${id}-create`}>Create a payment request</h3><p>Choose what you sell. Add the details and amount.</p></div></div>
        <div className="request-workspace">
          <div className="request-workspace-chrome"><span><Icon name="business" />Trolleys</span><span>New payment request</span></div>
          <div className="request-workspace-body">
          <div className="sale-type-tabs" role="tablist" aria-label="What you sell">
            {saleTypes.map((type, index) => <button key={type} type="button" role="tab" id={`${id}-${type}`} aria-label={paymentExamples[type].name} aria-selected={purpose === type} aria-controls={`${id}-sale`} tabIndex={purpose === type ? 0 : -1} ref={element => { tabs.current[index] = element; }} onClick={() => setPurpose(type)} onKeyDown={event => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % saleTypes.length;
              else if (event.key === "ArrowLeft") next = (index + saleTypes.length - 1) % saleTypes.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = saleTypes.length - 1;
              else return;
              event.preventDefault(); setPurpose(saleTypes[next]!); tabs.current[next]?.focus();
            }}><SaleThumbnail type={type} /><strong>{paymentExamples[type].name}</strong><span className="sale-choice-check" aria-hidden="true"><Icon name="check" /></span></button>)}
          </div>
          <div className="sale-type-panel" role="tabpanel" id={`${id}-sale`} aria-labelledby={`${id}-${purpose}`} tabIndex={0}>
            <p className="payment-use-case">{typeDescriptions[purpose]}</p>
            <div className="payment-request-preview">
              <dl><div><dt>Payment for</dt><dd>{example.description}</dd></div><div><dt>Details</dt><dd>{example.quantity}</dd></div><div><dt>Reference</dt><dd>{example.orderReference}</dd></div></dl>
              <div className="request-preview-amount"><span>Amount</span><strong>{amount}</strong></div>
              <div className="request-preview-link"><Icon name="check" /><span>Ready to share</span><Icon name="arrow" /></div>
            </div>
            <div className="request-guidance" id="request-details">
              <h4>Before you share</h4>
              {saleTypes.map(type => <p key={type} hidden={purpose !== type}>{requestGuidance[type]}</p>)}
            </div>
          </div>
          </div>
        </div>
      </section>
      <section className="payment-share-step" aria-labelledby={`${id}-share`}>
        <div className="two-step-heading"><span aria-hidden="true">02</span><div><h3 id={`${id}-share`}>Share your payment link</h3><p>Send it by text, email or social media. Share a QR code or add the link to your website.</p></div></div>
        <PaymentChannelPreview purpose={purpose} />
      </section>
    </div>
    <section className="two-step-outcome" aria-label="Illustrative customer checkout">
      <div className="checkout-purchase">
        <div className="two-step-customer"><span><Icon name="card" /></span><div><strong>Your customer opens the link and pays by card.</strong><p>Payment receipt included.</p></div></div>
        <div className="marketing-payment-summary"><span>Your business</span><span className="checkout-purchase-name">{example.description}</span><strong>{amount}</strong></div>
        <NetworkBrands label="Card networks" />
      </div>
      <div className="checkout-card-preview" role="img" aria-label={`Card-entry illustration for ${example.description}, ${amount}. Card number ending 4242, expiration and security code fields, and Pay ${amount}. No payment is made.`}>
        <div className="checkout-preview-heading"><span>Pay by card</span><span>Checkout example</span></div>
        <div className="checkout-field-group"><span>Card number</span><div className="checkout-field checkout-card-number"><span>•••• •••• •••• 4242</span><Icon name="card" /></div></div>
        <div className="checkout-field-row">
          <div className="checkout-field-group"><span>Expiration</span><div className="checkout-field">MM / YY</div></div>
          <div className="checkout-field-group"><span>Security code</span><div className="checkout-field">•••</div></div>
        </div>
        <span className="checkout-pay-example">Pay {amount}<Icon name="lock" /></span>
      </div>
    </section>
    <figcaption>Payment example. Create and share requests from your Trolleys account after approval and setup.</figcaption>
  </figure>;
}
