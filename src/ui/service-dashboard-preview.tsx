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
    <div className="service-showcase-switch" role="group" aria-label="Service dashboard preview"><button type="button" aria-pressed={service==="cardholder"} onClick={()=>setService("cardholder")}><Icon name="card" />Cardholder</button><button type="button" aria-pressed={service==="merchant"} onClick={()=>setService("merchant")}><Icon name="shop" />Merchant</button></div>
    <div className="service-showcase-window"><div className="showcase-window-bar"><span>etail depot.</span><span>Dashboard preview</span></div>
      {service==="cardholder"?<section className="showcase-body" aria-label="Cardholder dashboard example"><div className="showcase-title"><p>YOUR CARD GROUP</p><h2>A little more freedom.</h2></div><div className="showcase-balance"><div><span>Card money · Example</span><strong>$2,400.00</strong><small>One balance, shared by your cards</small></div><Link href="/card-services">How it works <Icon name="arrow" /></Link></div><div className="showcase-card-options" role="group" aria-label="Example cardholder"><button type="button" aria-pressed={selected===0} onClick={()=>setSelected(0)}>Maya’s card</button><button type="button" aria-pressed={selected===1} onClick={()=>setSelected(1)}>Liam’s card</button></div><div className="showcase-card-grid"><div className={`showcase-card ${selected?"showcase-card-sage":""}`}><div><span>etail depot</span><Icon name="card" /></div><p>{card.card}</p><span className="showcase-card-number">•••• &nbsp; •••• &nbsp; {card.lastFour}</span><div><span>{card.fullName}</span><span>VIRTUAL</span></div></div><div className="showcase-card-amount"><span>{card.note}</span><small>Available to spend</small><strong>{card.available}</strong><span className="showcase-active">● Active</span></div></div><div className="showcase-spending"><div><span>Allowance used</span><strong>{card.spent} <span>of {card.limit}</span></strong></div><div className="showcase-spending-track" aria-hidden="true"><span style={{width:card.width}} /></div><p>A total allowance for this card. No monthly reset.</p></div><Link href="/cardholder-services" className="showcase-open">Open Cardholder services <Icon name="arrow" /></Link></section>
      :<section className="showcase-body" aria-label="Merchant dashboard example"><div className="showcase-title"><p>MAYA’S FLOWER SHOP · ALL TERMINALS</p><h2>Your business, in view.</h2></div><div className="showcase-balance"><div><span>Payments received · Example month</span><strong>$640.00</strong><small>From your shop and market-stall terminals</small></div><Icon name="shop" /></div><div className="showcase-merchant-totals"><div><span>Awaiting settlement</span><strong>$240.00</strong></div><div><span>Merchant money</span><strong>$400.00</strong></div></div><div className="showcase-activity-title"><h3>Recent payments</h3><span>Amount</span></div><ul className="showcase-payment-list">{[{name:"Weekend flowers",merchant:"Market stall",amount:"$120.00",icon:"qr"},{name:"Event arrangement",merchant:"Flower shop",amount:"$280.00",icon:"document"},{name:"Monthly blooms",merchant:"Flower shop",amount:"$240.00",icon:"link"}].map(row=><li key={row.name}><span className="showcase-payment-icon"><Icon name={row.icon} /></span><div><strong>{row.name}</strong><span>{row.merchant} · Received</span></div><strong>{row.amount}</strong></li>)}</ul><Link href="/merchant-services" className="showcase-open">Open Merchant services <Icon name="arrow" /></Link></section>}
      <p className="showcase-caption"><Icon name="lock" />Illustrative owner view · Sample figures, not your balance.</p></div><p className="showcase-instruction">Select a service to take a look inside.</p>
  </div>;
}
