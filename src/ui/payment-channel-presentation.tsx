"use client";

import Image from "next/image";
import {useId,useRef} from "react";
import type {ChannelPresentation} from "@/modules/acquiring/contracts";
import {Icon} from "./icon";
import "./payment-channel-presentation.css";

export const paymentChannelOptions = [
 {id:"SMS",name:"Text",icon:"message",title:"Get paid in the conversation.",detail:"Send a payment link in a text. Your customer opens it, checks the amount and pays by card.",action:"Open text message"},
 {id:"EMAIL",name:"Email",icon:"mail",title:"An easy next step in every email.",detail:"Send the order details and payment link together. Your customer can pay when they open your email.",action:"Open email"},
 {id:"INVOICE",name:"Invoice",icon:"document",title:"Give your invoice a way to pay.",detail:"Add a payment link to your invoice, or print a payment request to include with it.",action:"Print payment request"},
 {id:"BILL",name:"Bill",icon:"document",title:"From the bill to card payment.",detail:"Include a payment link with a bill. Customers review the amount and pay on their own phone.",action:"Print payment request"},
 {id:"SOCIAL",name:"Social",icon:"person",title:"Turn interest into a paid order.",detail:"Share your link in a post or private conversation. Your customers can pay without an Etail Depot login.",action:"Open WhatsApp"},
 {id:"QR",name:"QR code",icon:"qr",title:"Scan. Review. Pay.",detail:"Display your payment code at the counter, at an event or on a printed sign. One scan opens card checkout.",action:"Download QR code"},
 {id:"WEB",name:"Website",icon:"link",title:"Your website. One simple checkout.",detail:"Add a payment link or button to your website. Customers follow it to pay by card.",action:"Copy website button"},
] as const satisfies readonly {id:ChannelPresentation;name:string;icon:string;title:string;detail:string;action:string}[];

export interface PaymentPresentationData {businessName:string;description:string;amount:string;terminalName?:string;reference?:string;paymentUrl?:string;qrUrl?:string}

export function NetworkBrands(){return <div className="channel-networks" role="group" aria-label="Card networks"><span className="network-visa">Visa</span><span className="network-mastercard"><i aria-hidden="true"/>Mastercard</span><span className="network-amex">American Express</span><span className="network-discover">Discover</span></div>;}

export function PaymentChannelTabs({value,onChange,allowed=paymentChannelOptions.map(item=>item.id),label="Ways to share a payment request",disabled=false,idPrefix}:{value:ChannelPresentation;onChange:(value:ChannelPresentation)=>void;allowed?:readonly ChannelPresentation[];label?:string;disabled?:boolean;idPrefix?:string}){
 const generatedId=useId(),id=idPrefix??generatedId,refs=useRef<(HTMLButtonElement|null)[]>([]),options=paymentChannelOptions.filter(item=>allowed.includes(item.id));
 return <div className="channel-tabs" role="tablist" aria-label={label}>{options.map((item,index)=><button key={item.id} type="button" role="tab" disabled={disabled} id={`${id}-${item.id}`} aria-selected={value===item.id} aria-controls={`${id}-panel`} tabIndex={value===item.id?0:-1} ref={element=>{refs.current[index]=element;}} onClick={()=>onChange(item.id)} onKeyDown={event=>{let next=index;if(event.key==="ArrowRight")next=(index+1)%options.length;else if(event.key==="ArrowLeft")next=(index+options.length-1)%options.length;else if(event.key==="Home")next=0;else if(event.key==="End")next=options.length-1;else return;event.preventDefault();onChange(options[next]!.id);refs.current[next]?.focus();}}><Icon name={item.icon}/>{item.name}</button>)}</div>;
}

function Identity({data,subline}:{data:PaymentPresentationData;subline:string}){return <div className="channel-business"><span className="channel-business-avatar" aria-hidden="true">{data.businessName.slice(0,1)}</span><div><strong>{data.businessName}</strong><span>{subline}</span></div></div>;}
function LinkCard({data}:{data:PaymentPresentationData}){return <div className="channel-link-summary"><Icon name="lock"/><div><strong>Pay by card</strong><span>{data.description} · {data.amount}</span></div><Icon name="arrow"/></div>;}
function Qr({data}:{data:PaymentPresentationData}){return data.qrUrl?<Image unoptimized src={data.qrUrl} width={180} height={180} alt={`Payment code for ${data.description}`}/>:<Icon name="qr"/>;}

/** A presentation only. Sending, printing and payment commands stay with their existing owners. */
export function PaymentChannelPresentation({channel,data,checkout=true}:{channel:ChannelPresentation;data:PaymentPresentationData;checkout?:boolean}){
 let medium;
 if(channel==="SMS")medium=<div className="channel-medium channel-text"><Identity data={data} subline="Text message"/><div className="channel-conversation"><p className="channel-customer-message">I’d like to place an order, please.</p><div className="channel-business-message"><p>Here’s your payment link for {data.description}.</p><LinkCard data={data}/></div></div></div>;
 else if(channel==="EMAIL")medium=<div className="channel-medium channel-email"><div className="channel-mail-subject"><Icon name="mail"/><strong>Your order · {data.description}</strong></div><Identity data={data} subline="To: your customer"/><div className="channel-email-body"><p>Thanks for your order.</p><p>You can review the details and pay {data.amount} using the link below.</p><LinkCard data={data}/><span>Thank you,<br/>{data.businessName}</span></div></div>;
 else if(channel==="INVOICE"||channel==="BILL")medium=<div className={`channel-medium ${channel==="BILL"?"channel-bill":"channel-invoice"}`}><div className="channel-document-heading"><Identity data={data} subline={data.terminalName??"Your order"}/><span>PAYMENT REQUEST</span></div>{data.reference&&<p className="channel-document-reference">Reference · {data.reference}</p>}<div className="channel-document-item"><span>{data.description}</span><strong>{data.amount}</strong></div><div className="channel-document-total"><span>Amount to pay</span><strong>{data.amount}</strong></div><LinkCard data={data}/>{data.paymentUrl&&<p className="channel-document-url">{data.paymentUrl}</p>}<p className="channel-document-note">{channel==="INVOICE"?"Include this payment request with your invoice.":"Keep your bill and payment details together."}</p></div>;
 else if(channel==="SOCIAL")medium=<div className="channel-medium channel-social"><Identity data={data} subline="Share with your customers"/><div className="channel-social-art"><Icon name="shop"/><div><span>READY WHEN YOU ARE</span><strong>{data.description}</strong><b>{data.amount}</b></div></div><div className="channel-social-copy"><p>Love it? Make it yours.</p><LinkCard data={data}/></div></div>;
 else if(channel==="QR")medium=<div className="channel-medium channel-qr-sign"><span className="channel-counter-label">{data.businessName}</span><strong>{data.description}</strong><span className="channel-qr-amount">{data.amount}</span><div className="channel-qr-illustration"><Qr data={data}/></div><span className="channel-scan-instruction"><Icon name="card"/>Scan to pay by card</span><span>On your phone. In a few simple steps.</span></div>;
 else medium=<div className="channel-medium channel-website"><div className="channel-browser-bar" aria-hidden="true"><span/><span/><span/><div><Icon name="lock"/>{data.businessName}</div></div><div className="channel-store-heading"><strong>{data.businessName}</strong><Icon name="shop"/></div><div className="channel-product"><div className="channel-product-art"><Icon name="shop"/></div><div><span>YOUR ORDER</span><strong>{data.description}</strong><p>Ready for a simple checkout.</p><b>{data.amount}</b></div></div><div className="channel-site-payment"><LinkCard data={data}/></div></div>;
 return <div className="channel-visual"><div className="channel-presentation">{medium}</div>{checkout&&<><div className="channel-checkout-path"><span/><Icon name="arrow"/><span/></div><div className="channel-checkout"><div className="channel-checkout-heading"><Icon name="card"/><div><strong>One simple card checkout</strong><span>Your customer reviews the amount and pays.</span></div></div><div className="channel-checkout-total"><span>{data.businessName}<small>{data.description}</small></span><strong>{data.amount}</strong></div><NetworkBrands/></div></>}</div>;
}
