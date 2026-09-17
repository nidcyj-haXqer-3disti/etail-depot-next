"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "./icon";
import "./service-dashboard-preview.css";

// Fixed public illustrations. Selection never reads private records or issues a command.
const cards = [
  { card: "Everyday", lastFour: "2048", available: "$820.00", spent: "$180", limit: "$1,000", note: "For you", width: "18%" },
  { card: "Team supplies", lastFour: "7316", available: "$280.00", spent: "$120", limit: "$400", note: "For your team", width: "30%" },
] as const;
const payments = [
  { name: "Weekend flowers", channel: "QR code", amount: "$120.00", icon: "qr" },
  { name: "Event arrangement", channel: "Invoice", amount: "$280.00", icon: "document" },
  { name: "Monthly blooms", channel: "Payment link", amount: "$240.00", icon: "link" },
];

export function ServiceDashboardPreview() {
  const [service, setService] = useState<"cardholder" | "merchant">("cardholder");
  const [selected, setSelected] = useState(0);
  const card = cards[selected]!;
  return <div className="service-showcase">
    <div className="service-showcase-switch" role="group" aria-label="Cards and payments">
      <button type="button" aria-pressed={service === "cardholder"} onClick={() => setService("cardholder")}><Icon name="card" />Cards</button>
      <button type="button" aria-pressed={service === "merchant"} onClick={() => setService("merchant")}><Icon name="shop" />Payments</button>
    </div>
    <div className="service-showcase-window">
      {service === "cardholder" ? <section className="showcase-body" aria-label="Cards dashboard">
        <div className="showcase-heading"><h2>Your card account</h2><Icon name="card" /></div>
        <div className="showcase-balance"><span>Available to spend</span><strong>$2,400.00</strong><span>Shared across your cards</span></div>
        <div className="showcase-card-options" role="group" aria-label="Choose a card">
          {cards.map((item, index) => <button key={item.card} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>{item.card}</span><small>{item.note}</small></button>)}
        </div>
        <div className="showcase-card-grid">
          <div className={`showcase-card ${selected ? "showcase-card-sage" : ""}`}><div><Icon name="card" /><span>VISA</span></div><strong>{card.card}</strong><span>•••• {card.lastFour}</span></div>
          <div className="showcase-card-amount"><span>Remaining on this card</span><strong>{card.available}</strong><span className="showcase-active"><span aria-hidden="true">●</span> Active</span></div>
        </div>
        <div className="showcase-spending"><div><span>{card.spent} spent</span><span>{card.limit} limit</span></div><div className="showcase-spending-track" aria-hidden="true"><span style={{ width: card.width }} /></div></div>
        <Link href="/cardholder-services" prefetch={false} className="showcase-open">Open your cards <Icon name="arrow" /></Link>
      </section> : <section className="showcase-body" aria-label="Payments dashboard">
        <div className="showcase-heading"><h2>Your business payments</h2><Icon name="shop" /></div>
        <div className="showcase-balance"><span>Available for payout</span><strong>$640.00</strong><span>Flower shop · 2 terminals</span></div>
        <div className="showcase-activity-title"><h3>Payments received</h3><span>3 payments</span></div>
        <ul className="showcase-payment-list">{payments.map(row => <li key={row.name}><span className="showcase-payment-icon"><Icon name={row.icon} /></span><div><strong>{row.name}</strong><span>{row.channel}</span></div><strong>+{row.amount}</strong></li>)}</ul>
        <Link href="/merchant-services" prefetch={false} className="showcase-open">Open your payments <Icon name="arrow" /></Link>
      </section>}
      <p className="showcase-caption"><Icon name="lock" />{service === "cardholder" ? "Each cardholder sees only their own cards." : "Your card balance and payment balance stay separate."}</p>
    </div>
  </div>;
}
