"use client";

import { useId, useRef } from "react";
import Image from "next/image";
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
    <section className="two-step-outcome" id="customer-checkout" aria-label="Illustrative customer checkout">
      <div className="checkout-preview-heading"><div><Icon name="business" /><span>Your business</span></div><span>Checkout example</span></div>
      <div className="checkout-preview-layout">
        <div className="checkout-purchase">
          <div className="marketing-payment-summary"><span>Order summary</span><span className="checkout-purchase-name">{example.description}</span><span className="checkout-purchase-quantity">{example.quantity}</span><div className="checkout-order-reference"><span>Reference</span><span>{example.orderReference}</span></div><div className="checkout-order-total"><span>Total</span><strong>{amount}<small>USD</small></strong></div></div>
          <div className="checkout-accepted-cards"><span>Accepted cards</span><NetworkBrands label="Card networks" /></div>
          <div className="two-step-customer"><span><Icon name="card" /></span><div><strong>Your customer opens the link and pays by card.</strong><p>Payment receipt included.</p></div></div>
        </div>
        <div className="checkout-card-preview" role="img" aria-label={`Checkout illustration for ${example.description}, ${amount}. Apple Pay and Google Pay wallet options, followed by contact details, card number ending 4242, expiration, security code, cardholder name and billing fields, and Pay ${amount}. Wallet availability varies by device and merchant account. No payment is made.`}>
          <div className="checkout-wallet-preview">
            <h4>Pay with a wallet</h4>
            <div className="checkout-wallet-options">
              <div className="checkout-wallet-option"><Image src="/brand/wallets/apple-pay.svg" width={165.52107} height={105.9651} alt="Apple Pay" className="checkout-wallet-apple" loading="eager" unoptimized /></div>
              <div className="checkout-wallet-option"><Image src="/brand/wallets/google-pay.svg" width={1094} height={742} alt="Google Pay" className="checkout-wallet-google" loading="eager" unoptimized /></div>
            </div>
          </div>
          <div className="checkout-method-divider"><span>or pay by card</span></div>
          <div className="checkout-contact-preview"><span>Contact details</span><strong>customer@example.com</strong></div>
          <div className="checkout-payment-details">
            <h4>Payment details</h4>
            <div className="checkout-field-group"><span>Card number</span><div className="checkout-field checkout-card-number"><span>•••• •••• •••• 4242</span><Icon name="card" /></div></div>
            <div className="checkout-field-row">
              <div className="checkout-field-group"><span>Expiry</span><div className="checkout-field">MM / YY</div></div>
              <div className="checkout-field-group"><span>Security code</span><div className="checkout-field">•••</div></div>
            </div>
            <div className="checkout-field-row">
              <div className="checkout-field-group"><span>First name</span><div className="checkout-field">Alex</div></div>
              <div className="checkout-field-group"><span>Last name</span><div className="checkout-field">Morgan</div></div>
            </div>
          </div>
          <div className="checkout-billing-preview"><h4>Billing address</h4><div className="checkout-field-row">
            <div className="checkout-field-group"><span>Country</span><div className="checkout-field">United States</div></div>
            <div className="checkout-field-group"><span>ZIP code</span><div className="checkout-field">10001</div></div>
          </div></div>
          <span className="checkout-pay-example"><Icon name="lock" />Pay {amount}</span>
        </div>
      </div>
      <p className="checkout-preview-note">Wallet availability varies by device and merchant account. Checkout fields may vary.</p>
    </section>
    <figcaption>Payment example. Create and share requests from your Trolleys account after approval and setup.</figcaption>
  </figure>;
}
