"use client";

import {useId,useState} from "react";
import type {ChannelPresentation} from "@/shared/channel-presentation";
import {Icon} from "./icon";
import {PaymentChannelTabs} from "./payment-channel-tabs";
import {NetworkBrands} from "./network-brands";
import "./payment-channel-preview.css";

type ChannelStory = {title:string;detail:string;context:string;description:string;amount:string};
const stories:Record<ChannelPresentation,ChannelStory> = {
 SMS:{title:"Request a booking payment",detail:"Text a payment link for a booking. Your customer reviews the amount and pays by card.",context:"Appointment booking",description:"Consultation",amount:"$80.00"},
 EMAIL:{title:"Email a payment request",detail:"Email the order details with a payment link so your customer can review and pay.",context:"Order payment request",description:"Custom stationery",amount:"$120.00"},
 INVOICE:{title:"Get paid for completed work",detail:"Add a payment link to an invoice showing the work completed and the amount due.",context:"Project invoice",description:"Design services",amount:"$480.00"},
 BILL:{title:"Make a service bill easy to pay",detail:"Share a service bill with a payment link. Your customer reviews the charges and pays by card.",context:"Service bill",description:"Garden care",amount:"$65.00"},
 SOCIAL:{title:"Turn a conversation into an order",detail:"Share a payment link in a post or direct message so customers can review the offer and pay.",context:"Workshop booking",description:"Studio workshop",amount:"$45.00"},
 QR:{title:"Take payments in person",detail:"Display a QR code at your counter or on a table. Customers scan it to review the amount and pay by card.",context:"Counter payment",description:"Lunch order",amount:"$18.00"},
 WEB:{title:"Connect your site to checkout",detail:"Add a payment link or button to your website so customers can continue to card checkout.",context:"Online order",description:"Homeware set",amount:"$64.00"},
};

function PaymentLinkCard({story,label="Pay by card"}:{story:ChannelStory;label?:string}) {
 return <div className="marketing-payment-link"><span className="marketing-link-icon"><Icon name="link"/></span><span><strong>{label}</strong><small>{story.description}</small></span><b>{story.amount}</b><Icon name="arrow"/></div>;
}

/** Product illustrations only; no customer information, live links or payment inputs. */
function ChannelIllustration({channel,story}:{channel:ChannelPresentation;story:ChannelStory}) {
 if(channel==="SMS") return <div className="channel-medium marketing-message">
  <div className="marketing-medium-title"><span className="marketing-medium-icon"><Icon name="message"/></span><span><strong>{story.context}</strong><small>Text message</small></span></div>
  <div className="marketing-message-thread"><p className="marketing-incoming">Is Friday afternoon available?</p><div className="marketing-outgoing"><p>Yes. Here’s the payment link for your consultation.</p><PaymentLinkCard story={story}/></div></div>
  <span className="marketing-message-status">Delivered</span>
 </div>;
 if(channel==="EMAIL") return <div className="channel-medium marketing-email">
  <div className="marketing-email-subject"><Icon name="mail"/><strong>{story.context}</strong></div>
  <div className="marketing-email-body"><span className="marketing-document-kicker">ORDER DETAILS</span><strong>Ready when you are.</strong><p>Thanks for your order. Here are the payment details.</p><div className="marketing-line-item"><span>{story.description}</span><b>{story.amount}</b></div><PaymentLinkCard story={story}/></div>
 </div>;
 if(channel==="INVOICE") return <div className="channel-medium marketing-invoice">
  <div className="marketing-document-top"><Icon name="document"/><span>INVOICE</span></div><h4>{story.context}</h4><div className="marketing-invoice-meta"><span>Professional services</span><span>Due on receipt</span></div><div className="marketing-line-item"><span>{story.description}</span><b>{story.amount}</b></div><div className="marketing-document-total"><span>Total due</span><strong>{story.amount}</strong></div><PaymentLinkCard story={story} label="Pay invoice"/>
 </div>;
 if(channel==="BILL") return <div className="channel-medium marketing-bill">
  <span className="marketing-bill-symbol"><Icon name="document"/></span><h4>{story.context}</h4><div className="marketing-line-item"><span>{story.description}</span><b>{story.amount}</b></div><div className="marketing-document-total"><span>Amount due</span><strong>{story.amount}</strong></div><PaymentLinkCard story={story} label="Pay bill"/>
 </div>;
 if(channel==="SOCIAL") return <div className="channel-medium marketing-social">
  <div className="marketing-social-heading"><span><Icon name="person"/>{story.context}</span><span aria-hidden="true">•••</span></div><div className="marketing-social-poster"><span className="marketing-poster-orbit marketing-poster-orbit-one" aria-hidden="true"/><span className="marketing-poster-orbit marketing-poster-orbit-two" aria-hidden="true"/><span className="marketing-document-kicker">MAKE SOMETHING NEW</span><strong>Time to<br/>get creative.</strong><span>{story.description} · {story.amount}</span></div><div className="marketing-social-caption"><p>Join the next studio workshop. Pay by card.</p><PaymentLinkCard story={story} label="Pay for the workshop"/></div>
 </div>;
 if(channel==="QR") return <div className="channel-medium marketing-counter">
  <span className="marketing-document-kicker">{story.context}</span><h4>A quick scan.<br/>You’re on your way.</h4><div className="marketing-qr-art" aria-hidden="true"><Icon name="qr"/></div><div className="marketing-counter-amount"><span>{story.description}</span><strong>{story.amount}</strong></div><span className="marketing-counter-instruction"><Icon name="card"/>Scan to pay by card</span>
 </div>;
 return <div className="channel-medium marketing-website">
  <div className="marketing-browser" aria-hidden="true"><span/><span/><span/><div><Icon name="lock"/>Order summary</div></div><div className="marketing-web-body"><span className="marketing-document-kicker">{story.context}</span><div className="marketing-order-product"><div className="marketing-parcel" aria-hidden="true"><span/><Icon name="check"/></div><div><h4>{story.description}</h4><span>1 set</span><strong>{story.amount}</strong></div></div><div className="marketing-line-item"><span>Order total</span><b>{story.amount}</b></div><PaymentLinkCard story={story} label="Continue to payment"/></div>
 </div>;
}

export function PaymentChannelPreview(){
 const [selected,setSelected]=useState<ChannelPresentation>("SMS"),id=useId(),story=stories[selected];
 return <div className="channel-showcase channel-marketing">
  <PaymentChannelTabs value={selected} onChange={setSelected} idPrefix={id}/>
  <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${selected}`} tabIndex={0} className="channel-panel marketing-channel-panel">
   <div className="marketing-channel-copy"><h3>{story.title}</h3><p>{story.detail}</p></div>
   <div className="marketing-channel-journey">
    <ChannelIllustration channel={selected} story={story}/>
    <span className="marketing-channel-connector" aria-hidden="true"><Icon name="arrow"/></span>
    <div className="channel-checkout marketing-payment-view"><span className="marketing-checkout-icon"><Icon name="card"/></span><h4>Your customer pays</h4><p>They review the amount and pay by card.</p><div className="marketing-payment-summary"><span>{story.description}</span><strong>{story.amount}</strong></div><NetworkBrands/><div className="marketing-payment-finish" aria-hidden="true"><Icon name="lock"/><span>Pay {story.amount}</span><Icon name="arrow"/></div></div>
   </div>
  </div>
 </div>;
}
