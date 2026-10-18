"use client";

import { useId, useState } from "react";
import { paymentChannels, type ChannelPresentation } from "@/shared/channel-presentation";
import { paymentExamples, type PaymentExamplePurpose } from "@/modules/public-site/payment-examples";
import { formatUsdCents } from "@/modules/public-site/fee-estimate";
import { Icon } from "./icon";
import { PaymentChannelTabs } from "./payment-channel-tabs";
import "./payment-channel-preview.css";

type ExampleDetails = (typeof paymentExamples)[PaymentExamplePurpose] & { amount: string };

type PaymentChannelPreviewProps = {
  purpose: PaymentExamplePurpose;
};


function PaymentLinkCard({ example, label = "Pay by card" }: { example: ExampleDetails; label?: string }) {
  return <div className="marketing-payment-link"><span className="marketing-link-icon"><Icon name="link" /></span><span><strong>{label}</strong><small>{example.description}</small></span><b>{example.amount}</b><Icon name="arrow" /></div>;
}

/** Illustrations only: selecting a format never sends a request or opens checkout. */
function ChannelIllustration({ channel, purpose, example }: { channel: ChannelPresentation; purpose: PaymentExamplePurpose; example: ExampleDetails }) {
  if (channel === "LINK") return <div className="channel-medium marketing-portable-link">
    <span className="portable-link-emblem"><Icon name="link" /></span>
    <span className="marketing-document-kicker">{example.context}</span>
    <strong>{example.description}</strong><b>{example.amount}</b>
    <div className="portable-link-address"><Icon name="lock" /><span>Your payment link</span><Icon name="layers" /></div>
    <div className="portable-link-destinations" aria-hidden="true"><Icon name="message" /><Icon name="mail" /><Icon name="qr" /><Icon name="business" /></div>
  </div>;
  if (channel === "SMS") return <div className="channel-medium marketing-message">
    <div className="sharing-phone-status" aria-hidden="true"><span>9:41</span><i /><span className="sharing-phone-battery" /></div>
    <div className="marketing-medium-title"><span className="marketing-medium-icon"><Icon name="message" /></span><span><strong>{example.context}</strong><small>Text message</small></span></div>
    <div className="marketing-message-thread"><p className="marketing-incoming">{example.question}</p><div className="marketing-outgoing"><p>Here’s your payment link.</p><PaymentLinkCard example={example} /></div></div>
    <div className="sharing-phone-home" aria-hidden="true" />
  </div>;
  if (channel === "EMAIL") return <div className="channel-medium marketing-email">
    <div className="marketing-email-subject"><Icon name="mail" /><strong>{example.context}</strong></div>
    <div className="marketing-email-body"><span className="marketing-document-kicker">Payment request</span><strong>Your payment details.</strong><p>Review the amount, then pay by card.</p><PaymentLinkCard example={example} /></div>
  </div>;
  if (channel === "SOCIAL") return <div className="channel-medium marketing-social">
    <div className="marketing-social-heading"><span><Icon name="person" />{example.context}</span><span aria-hidden="true">•••</span></div><div className="marketing-social-poster"><span className="marketing-document-kicker">PAY BY CARD</span><strong>{example.description}</strong><span>{example.amount}</span></div><div className="marketing-social-caption"><p>View the details and continue to payment.</p><PaymentLinkCard example={example} /></div>
  </div>;
  if (channel === "QR") return <div className="channel-medium marketing-counter">
    <span className="marketing-document-kicker">{example.context}</span><h4>Scan to pay.</h4><div className="marketing-qr-art" aria-hidden="true"><Icon name="qr" /></div><div className="marketing-counter-amount"><span>{example.description}</span><strong>{example.amount}</strong></div><span className="marketing-counter-instruction"><Icon name="card" />Credit and debit cards accepted</span>
  </div>;
  return <div className="channel-medium marketing-website">
    <div className="marketing-browser" aria-hidden="true"><span /><span /><span /><div><Icon name="lock" />Payment summary</div></div><div className="marketing-web-body"><span className="marketing-document-kicker">{example.context}</span><div className="marketing-order-product">{purpose === "goods" ? <div className="marketing-parcel" aria-hidden="true"><span /></div> : <div className={`marketing-product-symbol marketing-product-${purpose}`} aria-hidden="true"><Icon name={purpose === "information" ? "document" : "person"} /><span /><span /></div>}<div><h4>{example.description}</h4><span>{example.quantity}</span><strong>{example.amount}</strong></div></div><div className="marketing-line-item"><span>Total</span><b>{example.amount}</b></div><PaymentLinkCard example={example} label="Continue to payment" /></div>
  </div>;
}

export function PaymentChannelPreview({ purpose }: PaymentChannelPreviewProps) {
  const [selected, setSelected] = useState<ChannelPresentation>("LINK");
  const id = useId();
  const example = { ...paymentExamples[purpose], amount: formatUsdCents(paymentExamples[purpose].amountCents) };
  const channel = paymentChannels.find(item => item.id === selected)!;

  return <div className="channel-showcase channel-marketing">
    <PaymentChannelTabs value={selected} onChange={setSelected} idPrefix={id} />
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${selected}`} tabIndex={0} className="channel-panel marketing-channel-panel" data-channel={selected}>
      <div className="marketing-channel-journey"><ChannelIllustration channel={selected} purpose={purpose} example={example} /></div>
      <div className="marketing-channel-copy"><h3>{channel.title}</h3><p>{channel.detail}</p></div>
    </div>
  </div>;
}
