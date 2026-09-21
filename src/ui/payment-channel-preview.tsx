"use client";

import { useId, useState } from "react";
import type { ChannelPresentation } from "@/shared/channel-presentation";
import { paymentExamples, type PaymentExamplePurpose } from "@/modules/public-site/payment-examples";
import { formatUsdCents } from "@/modules/public-site/fee-estimate";
import { Icon } from "./icon";
import { PaymentChannelTabs } from "./payment-channel-tabs";
import { NetworkBrands } from "./network-brands";
import "./payment-channel-preview.css";

type ExampleDetails = (typeof paymentExamples)[PaymentExamplePurpose] & { amount: string };

export type PaymentChannelPreviewProps = {
  purpose: PaymentExamplePurpose;
};

const stories: Record<ChannelPresentation, { title: string; detail: string }> = {
  SMS: { title: "Send a payment request", detail: "Share the amount and a payment link by text." },
  EMAIL: { title: "Put the details in an email", detail: "Send your customer the payment details and a link to checkout." },
  SOCIAL: { title: "Share where you connect", detail: "Add your payment link to a post or direct message." },
  QR: { title: "Let customers scan to pay", detail: "Display a QR code that opens the payment page on their phone." },
  WEB: { title: "Connect your site to checkout", detail: "Add a payment link or button to your website." },
};

function PaymentLinkCard({ example, label = "Pay by card" }: { example: ExampleDetails; label?: string }) {
  return <div className="marketing-payment-link"><span className="marketing-link-icon"><Icon name="link" /></span><span><strong>{label}</strong><small>{example.description}</small></span><b>{example.amount}</b><Icon name="arrow" /></div>;
}

/** Illustrations only: selecting a format never sends a request or opens checkout. */
function ChannelIllustration({ channel, purpose, example }: { channel: ChannelPresentation; purpose: PaymentExamplePurpose; example: ExampleDetails }) {
  if (channel === "SMS") return <div className="channel-medium marketing-message">
    <div className="marketing-medium-title"><span className="marketing-medium-icon"><Icon name="message" /></span><span><strong>{example.context}</strong><small>Text message</small></span></div>
    <div className="marketing-message-thread"><p className="marketing-incoming">{example.question}</p><div className="marketing-outgoing"><p>Here’s your payment link.</p><PaymentLinkCard example={example} /></div></div>
  </div>;
  if (channel === "EMAIL") return <div className="channel-medium marketing-email">
    <div className="marketing-email-subject"><Icon name="mail" /><strong>{example.context}</strong></div>
    <div className="marketing-email-body"><span className="marketing-document-kicker">PAYMENT REQUEST</span><strong>Your payment details.</strong><p>Review the amount, then pay by card.</p><div className="marketing-line-item"><span>{example.description}</span><b>{example.amount}</b></div><PaymentLinkCard example={example} /></div>
  </div>;
  if (channel === "SOCIAL") return <div className="channel-medium marketing-social">
    <div className="marketing-social-heading"><span><Icon name="person" />{example.context}</span><span aria-hidden="true">•••</span></div><div className="marketing-social-poster"><span className="marketing-poster-orbit marketing-poster-orbit-one" aria-hidden="true" /><span className="marketing-poster-orbit marketing-poster-orbit-two" aria-hidden="true" /><span className="marketing-document-kicker">PAY BY CARD</span><strong>{example.description}</strong><span>{example.amount}</span></div><div className="marketing-social-caption"><p>View the details and continue to payment.</p><PaymentLinkCard example={example} /></div>
  </div>;
  if (channel === "QR") return <div className="channel-medium marketing-counter">
    <span className="marketing-document-kicker">{example.context}</span><h4>Scan to open<br />your payment.</h4><div className="marketing-qr-art" aria-hidden="true"><Icon name="qr" /></div><div className="marketing-counter-amount"><span>{example.description}</span><strong>{example.amount}</strong></div><span className="marketing-counter-instruction"><Icon name="card" />Scan to pay by card</span>
  </div>;
  return <div className="channel-medium marketing-website">
    <div className="marketing-browser" aria-hidden="true"><span /><span /><span /><div><Icon name="lock" />Payment summary</div></div><div className="marketing-web-body"><span className="marketing-document-kicker">{example.context}</span><div className="marketing-order-product">{purpose === "goods" ? <div className="marketing-parcel" aria-hidden="true"><span /></div> : <div className={`marketing-product-symbol marketing-product-${purpose}`} aria-hidden="true"><Icon name={purpose === "information" ? "document" : "person"} /><span /><span /></div>}<div><h4>{example.description}</h4><span>{example.quantity}</span><strong>{example.amount}</strong></div></div><div className="marketing-line-item"><span>Total</span><b>{example.amount}</b></div><PaymentLinkCard example={example} label="Continue to payment" /></div>
  </div>;
}

export function PaymentChannelPreview({ purpose }: PaymentChannelPreviewProps) {
  const [selected, setSelected] = useState<ChannelPresentation>("SMS");
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const example = { ...paymentExamples[purpose], amount: formatUsdCents(paymentExamples[purpose].amountCents) };
  const story = stories[selected];

  return <div className="channel-showcase channel-marketing">
    <PaymentChannelTabs value={selected} onChange={setSelected} idPrefix={id} />
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${selected}`} tabIndex={0} className="channel-panel marketing-channel-panel">
      <div className="marketing-channel-copy"><h3>{story.title}</h3><p>{story.detail}</p><button type="button" className="marketing-example-toggle" aria-expanded={expanded} aria-controls={`${id}-journey`} onClick={() => setExpanded(value => !value)}>{expanded ? "Hide example" : "Show example"}<span aria-hidden="true">{expanded ? "−" : "+"}</span></button></div>
      <div id={`${id}-journey`} className="marketing-channel-journey" data-expanded={expanded}>
        <ChannelIllustration channel={selected} purpose={purpose} example={example} />
        <span className="marketing-channel-connector" aria-hidden="true"><Icon name="arrow" /></span>
        <div className="channel-checkout marketing-payment-view"><span className="marketing-checkout-icon"><Icon name="card" /></span><h4>Your customer pays</h4><p>They review the amount and pay by card.</p><div className="marketing-payment-summary"><span>{example.description}</span><strong>{example.amount}</strong></div><NetworkBrands /><div className="marketing-payment-finish" aria-hidden="true"><Icon name="lock" /><span>Pay {example.amount}</span><Icon name="arrow" /></div><div className="marketing-payment-receipt"><Icon name="document" /><div><span>After successful payment</span><strong>Payment receipt included</strong></div></div></div>
      </div>
    </div>
  </div>;
}
