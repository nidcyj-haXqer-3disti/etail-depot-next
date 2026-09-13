"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { Icon } from "./icon";

const channels = [
  { id: "text", name: "Text", icon: "message", title: "Keep it in the conversation.", detail: "Share the payment link in a text. Your customer opens it to review the amount and pay by card." },
  { id: "email", name: "Email", icon: "mail", title: "An email with everything in one place.", detail: "Add the payment link to your email, alongside the order details your customer needs." },
  { id: "invoice", name: "Invoice", icon: "document", title: "Make your invoice easy to pay.", detail: "Share an invoice with a payment link, so customers can go straight from the details to checkout." },
  { id: "bill", name: "Bill", icon: "document", title: "A clear next step on every bill.", detail: "Include a payment link on a bill you share, or a QR code on one you print." },
  { id: "social", name: "Social", icon: "person", title: "Turn a conversation into an order.", detail: "Share the payment link in your own social messages or posts. Customers follow it to pay by card." },
  { id: "qr", name: "QR code", icon: "qr", title: "At the counter. On their phone.", detail: "Display a payment QR code at your shop or event. Customers scan it to open checkout on their own phone." },
  { id: "website", name: "Website", icon: "link", title: "A simple payment link for your website.", detail: "Add the payment link to your website. Customers can review the order and pay without an Etail Depot login." },
] as const;

type ChannelId = typeof channels[number]["id"];

function FlowerMark() {
  return <span className="channel-flower-mark" aria-hidden="true"><svg viewBox="0 0 80 100" fill="none"><path d="M40 46v45M40 74C19 77 18 59 18 59s18-2 22 15ZM40 83c19 0 22-17 22-17S45 63 40 83Z" fill="#365f49" stroke="#365f49" strokeWidth="2"/><path d="M40 41C8 52 8 21 26 21 10 1 43-7 44 13 62-4 82 22 62 28 82 44 56 65 48 46c-3 14-21 12-23 2" fill="#d79b81"/><circle cx="43" cy="31" r="10" fill="#faf0b5"/></svg></span>;
}

function BusinessIdentity({subline}:{subline:string}) {
  return <div className="channel-business"><span className="channel-business-avatar" aria-hidden="true">M</span><div><strong>Maya’s Flower Shop</strong><span>{subline}</span></div></div>;
}

function PaymentLink() {
  return <div className="channel-link-summary"><Icon name="link"/><div><strong>Payment link</strong><span>Market bouquet · $25.00</span></div><Icon name="arrow"/></div>;
}

function ChannelPresentation({channel}:{channel:ChannelId}) {
  if (channel === "text") return <div className="channel-medium channel-text">
    <BusinessIdentity subline="Text message"/>
    <div className="channel-conversation"><p className="channel-customer-message">I’d love the market bouquet, please.</p><div className="channel-business-message"><p>Of course! Here’s the payment link for your flowers.</p><PaymentLink/></div></div>
  </div>;
  if (channel === "email") return <div className="channel-medium channel-email">
    <div className="channel-mail-subject"><Icon name="mail"/><strong>Your flowers are ready</strong></div>
    <BusinessIdentity subline="To: you"/>
    <div className="channel-email-body"><p>Thanks for your order.</p><p>Your market bouquet is ready to collect. You can review the details and pay using the link below.</p><PaymentLink/><span>See you soon,<br/>Maya</span></div>
  </div>;
  if (channel === "invoice") return <div className="channel-medium channel-invoice">
    <div className="channel-document-heading"><BusinessIdentity subline="Flowers for every day"/><span>INVOICE</span></div>
    <dl className="channel-invoice-meta"><div><dt>Invoice</dt><dd>1042</dd></div><div><dt>Payment</dt><dd>Due on receipt</dd></div></dl>
    <div className="channel-document-item"><span>Market bouquet<small>1 bouquet</small></span><strong>$25.00</strong></div>
    <div className="channel-document-total"><span>Total due</span><strong>$25.00</strong></div>
    <PaymentLink/>
  </div>;
  if (channel === "bill") return <div className="channel-medium channel-bill">
    <Icon name="shop"/><strong>Maya’s Flower Shop</strong><span>Your bill · 1042</span><div className="channel-bill-rule"/>
    <div className="channel-document-item"><span>1 × Market bouquet</span><strong>$25.00</strong></div>
    <div className="channel-document-total"><span>Amount to pay</span><strong>$25.00</strong></div>
    <div className="channel-bill-payment"><Icon name="qr"/><p>Pay by card<small>Scan the code on your bill<br/>or open its payment link.</small></p></div>
    <span className="channel-bill-thanks">A little something to brighten your day.</span>
  </div>;
  if (channel === "social") return <div className="channel-medium channel-social">
    <BusinessIdentity subline="A fresh pick for your day"/>
    <div className="channel-social-art"><FlowerMark/><div><span>FRESH FROM THE MARKET</span><strong>A little joy,<br/>by the bunch.</strong></div></div>
    <div className="channel-social-copy"><p>Market bouquets are here. Choose a little colour for your day.</p><PaymentLink/></div>
  </div>;
  if (channel === "qr") return <div className="channel-medium channel-qr-sign">
    <span className="channel-counter-label">MAYA’S FLOWER SHOP</span><strong>Flowers picked.<br/>Payment made easy.</strong>
    <div className="channel-qr-illustration" aria-hidden="true"><Icon name="qr"/></div>
    <span className="channel-scan-instruction"><Icon name="card"/>Scan your payment code to pay by card</span>
    <span>On your phone. In a few simple steps.</span>
  </div>;
  return <div className="channel-medium channel-website">
    <div className="channel-browser-bar" aria-hidden="true"><span/><span/><span/><div><Icon name="lock"/>Maya’s Flower Shop</div></div>
    <div className="channel-store-heading"><strong>Maya’s Flower Shop</strong><Icon name="shop"/></div>
    <div className="channel-product"><div className="channel-product-art"><FlowerMark/></div><div><span>FRESH FLOWERS</span><strong>Market bouquet</strong><p>A brighter day starts here.</p><b>$25.00</b></div></div>
    <div className="channel-site-payment"><PaymentLink/></div>
  </div>;
}

/** Public illustration: changing a channel changes presentation only. */
export function PaymentChannelPreview() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const channel = channels[selected]!;
  return <div className="channel-showcase">
    <div className="channel-showcase-heading"><span className="eyebrow">MORE WAYS TO GET PAID</span><p>Choose how to share your link.</p></div>
    <div role="tablist" aria-label="Ways to share a payment request" className="channel-tabs">
      {channels.map((item, index) => <button key={item.id} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={index === selected} aria-controls={`${id}-panel`} tabIndex={index === selected ? 0 : -1} ref={element => { tabs.current[index] = element; }} onClick={() => setSelected(index)} onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % channels.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + channels.length) % channels.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = channels.length - 1;
        else return;
        event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
      }}><Icon name={item.icon}/>{item.name}</button>)}
    </div>
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${selected}`} tabIndex={0} className={`channel-panel channel-panel-${channel.id}`}>
      <div className="channel-panel-copy"><h3>{channel.title}</h3><p>{channel.detail}</p></div>
      <div className="channel-presentation"><ChannelPresentation channel={channel.id}/></div>
      <div className="channel-checkout-path"><span aria-hidden="true"/><Icon name="arrow"/><span aria-hidden="true"/></div>
      <div className="channel-checkout"><div className="channel-checkout-heading"><Icon name="card"/><div><strong>One simple card checkout</strong><span>Your customer reviews the amount and pays.</span></div></div><div className="channel-checkout-total"><span>Maya’s Flower Shop<small>Market bouquet</small></span><strong>$25.00</strong></div><div className="channel-networks" role="group" aria-label="Card networks"><span>Visa</span><span>Mastercard</span><span>American Express</span><span>Discover</span></div></div>
    </div>
    <div className="channel-showcase-footer"><Link href="/merchant-services" prefetch={false}>Open your payment tools <Icon name="arrow"/></Link></div>
  </div>;
}
