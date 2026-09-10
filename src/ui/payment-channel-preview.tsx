"use client";

import { useRef, useState } from "react";
import { Icon } from "./icon";

const channels = [
  { name: "Text", icon: "message", title: "A friendly text. A simple next step.", context: "Text message", message: "Thanks for stopping by! Here’s the payment request for your order.", use: "For a customer you’re already chatting with." },
  { name: "Email", icon: "mail", title: "Send the details to their inbox.", context: "Email · Your order is ready", message: "Your order is ready. Review your payment request and keep the details together.", use: "For orders that need a little more detail." },
  { name: "Invoice", icon: "document", title: "A clear request for the work you do.", context: "Invoice · Example order", message: "Order details and the amount to pay, brought together in one request.", use: "For services, custom orders and project work." },
  { name: "Bill", icon: "document", title: "Make the next step clear on the bill.", context: "Bill · Example purchase", message: "Your purchase details and payment request, ready to review together.", use: "For a bill you hand over or share with a customer." },
  { name: "Social", icon: "person", title: "Meet customers where they find you.", context: "Social post · New collection", message: "Found something you love? Open the payment request to review your order.", use: "For a conversation or post on your social page." },
  { name: "QR code", icon: "qr", title: "Bring the payment request to the counter.", context: "QR code · At your shop or event", message: "Show a QR code that opens the payment request on your customer’s phone.", use: "For the counter, a pop-up or an event." },
  { name: "Web link", icon: "link", title: "A payment request with a place online.", context: "Web link · Your online order", message: "Add a payment link to your website so customers can open their request.", use: "For your website or an online conversation." },
] as const;

/** Read-only marketing examples. No checkout, account data or message delivery. */
export function PaymentChannelPreview() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const channel = channels[selected];
  return <div className="channel-showcase"><div className="channel-showcase-heading"><span className="eyebrow">ONE REQUEST. MORE WAYS TO SHARE.</span><p>Choose a channel to see an example.</p></div><div role="tablist" aria-label="Payment channel examples" className="channel-example-tabs">{channels.map((item, index) => <button key={item.name} type="button" role="tab" id={`channel-tab-${index}`} aria-selected={index === selected} aria-controls="channel-example-panel" tabIndex={index === selected ? 0 : -1} ref={element => { tabs.current[index] = element; }} onClick={() => setSelected(index)} onKeyDown={event => { let next = index; if (event.key === "ArrowRight") next = (index + 1) % channels.length; else if (event.key === "ArrowLeft") next = (index - 1 + channels.length) % channels.length; else if (event.key === "Home") next = 0; else if (event.key === "End") next = channels.length - 1; else return; event.preventDefault(); setSelected(next); tabs.current[next]?.focus(); }}><Icon name={item.icon} />{item.name}</button>)}</div><div id="channel-example-panel" role="tabpanel" aria-labelledby={`channel-tab-${selected}`} tabIndex={0} className="channel-example-panel"><div className="channel-example-context"><span className="channel-merchant-icon"><Icon name={channel.icon} /></span><span>{channel.context}</span><small>EXAMPLE</small></div><div className="channel-message"><p>{channel.message}</p><div className="channel-payment-card"><span className="channel-payment-brand">Maya’s Flower Shop · Market stall</span><strong>$25.00</strong><span>Example payment request</span><div className="channel-preview-action">Collected for Maya’s Flower Shop</div></div></div><h3>{channel.title}</h3><p className="channel-example-use">{channel.use}</p></div><p className="channel-demo-note"><Icon name="info" />Examples only. No messages are sent or money collected.</p></div>;
}
