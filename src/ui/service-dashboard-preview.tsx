"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "./icon";

// Fixed public illustrations. Actual service links require authentication;
// example selection never reads private records or issues a financial command.
const cards = [
  { name:"Maya",fullName:"MAYA CHEN",card:"Everyday",lastFour:"2048",available:"$820.00",spent:"$180.00",limit:"$1,000.00",note:"Your card",width:"18%" },
  { name:"Liam",fullName:"LIAM PATEL",card:"Team supplies",lastFour:"7316",available:"$280.00",spent:"$120.00",limit:"$400.00",note:"Card you manage",width:"30%" },
] as const;

export function ServiceDashboardPreview() {
  const [service,setService]=useState<"cardholder"|"merchant">("cardholder");
  const [selected,setSelected]=useState(0),card=cards[selected]!;
  return <div className="service-showcase">
    <div className="service-showcase-switch" role="group" aria-label="Cards and payments"><button type="button" aria-pressed={service==="cardholder"} onClick={()=>setService("cardholder")}><Icon name="card" />Cards</button><button type="button" aria-pressed={service==="merchant"} onClick={()=>setService("merchant")}><Icon name="shop" />Payments</button></div>
    <div className="service-showcase-window">
      {service==="cardholder"?<section className="showcase-body" aria-label="Cards dashboard"><div className="showcase-title"><p>MAYA’S CARD ACCOUNT</p><h2>Cards & spending</h2></div><div className="showcase-balance"><div><span>Card balance</span><strong>$2,400.00</strong><small>Available to the cards in this account</small></div><Link href="/card-services">How it works <Icon name="arrow" /></Link></div><div className="showcase-card-options" role="group" aria-label="Choose a card"><button type="button" aria-pressed={selected===0} onClick={()=>setSelected(0)}>Maya’s card</button><button type="button" aria-pressed={selected===1} onClick={()=>setSelected(1)}>Liam’s card</button></div><div className="showcase-card-grid"><div className={`showcase-card ${selected?"showcase-card-sage":""}`}><div><span>etail depot</span><Icon name="card" /></div><p>{card.card}</p><span className="showcase-card-number">•••• &nbsp; •••• &nbsp; {card.lastFour}</span><div><span>{card.fullName}</span><span>VISA</span></div></div><div className="showcase-card-amount"><span>{card.note}</span><small>Available to spend</small><strong>{card.available}</strong><span className="showcase-active">● Active</span></div></div><div className="showcase-spending"><div><span>Spent so far</span><strong>{card.spent} <span>of {card.limit}</span></strong></div><div className="showcase-spending-track" aria-hidden="true"><span style={{width:card.width}} /></div><p>You set the spending limit for each card.</p></div><Link href="/cardholder-services" prefetch={false} className="showcase-open">Open your cards <Icon name="arrow" /></Link></section>
      :<section className="showcase-body" aria-label="Payments dashboard"><div className="showcase-title"><p>MAYA’S FLOWER SHOP</p><h2>Business payments</h2></div><div className="showcase-balance"><div><span>Payment balance</span><strong>$640.00</strong><small>Available for refunds and withdrawals</small></div><Icon name="shop" /></div><div className="showcase-merchant-totals"><div><span>Payment terminals</span><strong>2</strong></div><div><span>Payments received</span><strong>3</strong></div></div><div className="showcase-activity-title"><h3>Recent payments</h3><span>Amount</span></div><ul className="showcase-payment-list">{[{name:"Weekend flowers",merchant:"Market stall",amount:"$120.00",icon:"qr"},{name:"Event arrangement",merchant:"Flower shop",amount:"$280.00",icon:"document"},{name:"Monthly blooms",merchant:"Flower shop",amount:"$240.00",icon:"link"}].map(row=><li key={row.name}><span className="showcase-payment-icon"><Icon name={row.icon} /></span><div><strong>{row.name}</strong><span>{row.merchant} · Received</span></div><strong>{row.amount}</strong></li>)}</ul><Link href="/merchant-services" prefetch={false} className="showcase-open">Open your payments <Icon name="arrow" /></Link></section>}
      <p className="showcase-caption"><Icon name="lock" />{service==="cardholder"?"Each cardholder sees only their own cards.":"Your card balance and payment balance stay separate."}</p></div><p className="showcase-instruction">Choose Cards or Payments to explore.</p>
  </div>;
}
