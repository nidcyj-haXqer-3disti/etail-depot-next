"use client";

import { useId, useRef, useState } from "react";
import { Icon } from "./icon";
import { NetworkBrands } from "./network-brands";
import "./payment-journey-art.css";

const examples = [
  { name: "Booking", description: "Studio booking", amount: "$80.00" },
  { name: "Invoice", description: "Design services", amount: "$480.00" },
  { name: "Sale", description: "Homeware set", amount: "$64.00" },
] as const;

/** Local examples of collection; selecting a story never creates a payment. */
export function PaymentJourneyArt() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const example = examples[selected]!;

  return <figure className="payment-journey-art" aria-label="Illustrated payment journey">
    <div className="payment-journey-selector" role="tablist" aria-label="Payment examples">
      {examples.map((item, index) => <button
        key={item.name}
        type="button"
        role="tab"
        id={`${id}-${index}`}
        aria-selected={selected === index}
        aria-controls={`${id}-panel`}
        tabIndex={selected === index ? 0 : -1}
        ref={element => { tabs.current[index] = element; }}
        onClick={() => setSelected(index)}
        onKeyDown={event => {
          let next = index;
          if (event.key === "ArrowRight") next = (index + 1) % examples.length;
          else if (event.key === "ArrowLeft") next = (index + examples.length - 1) % examples.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = examples.length - 1;
          else return;
          event.preventDefault();
          setSelected(next);
          tabs.current[next]?.focus();
        }}
      >{item.name}</button>)}
    </div>
    <div className="payment-journey-scene" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${selected}`} tabIndex={0}>
      <div className="payment-journey-orbit" aria-hidden="true" />
      <div className="payment-journey-request">
        <p className="payment-journey-stage"><span>01</span> You create and share</p>
        <div className="payment-journey-request-copy">
          <p>{example.description}</p>
          <strong>{example.amount}</strong>
        </div>
        <div className="payment-journey-share" aria-hidden="true">
          <span><Icon name="message" /></span>
          <span><Icon name="mail" /></span>
          <span><Icon name="qr" /></span>
          <span><Icon name="link" /></span>
        </div>
      </div>
      <div className="payment-journey-connector" aria-hidden="true"><Icon name="arrow" /></div>
      <div className="payment-journey-checkout">
        <p className="payment-journey-stage"><span>02</span> Your customer pays</p>
        <div className="payment-journey-order">
          <span className="payment-journey-studio" aria-hidden="true"><span /><span /><span /></span>
          <p>{example.description}</p>
        </div>
        <strong className="payment-journey-total">{example.amount}</strong>
        <div className="payment-journey-card-details">
          <Icon name="card" /><span>Credit or debit card</span><Icon name="lock" />
        </div>
        <NetworkBrands label="Illustrated checkout card networks" />
        <div className="payment-journey-pay" aria-hidden="true">Pay {example.amount} <Icon name="arrow" /></div>
      </div>
    </div>
    <figcaption>Payment example</figcaption>
  </figure>;
}
