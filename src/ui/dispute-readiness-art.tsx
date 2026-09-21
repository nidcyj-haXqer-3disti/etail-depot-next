"use client";

import { useId, useState } from "react";
import { paymentExamples, type PaymentExamplePurpose } from "@/modules/public-site/payment-examples";
import { formatUsdCents } from "@/modules/public-site/fee-estimate";
import { Icon } from "./icon";
import "./dispute-readiness-art.css";

const purchaseIcons = { goods: "box", services: "person", information: "insight" } as const;

/** Connected illustrations; no bank inquiry, response or dispute result is created. */
export function DisputeReadinessArt({purpose}: {purpose: PaymentExamplePurpose}) {
  const [view, setView] = useState<"Customer view" | "Bank inquiry">("Customer view");
  const id = useId();
  const sale = paymentExamples[purpose];
  const amount = formatUsdCents(sale.amountCents);
  const customerView = view === "Customer view";

  return <figure className="dispute-art recognition-art" aria-label="Order Insight purchase recognition example">
    <div className="recognition-toolbar">
      <p>Give the payment its story.</p>
      <div className="dispute-art-switch recognition-switch" role="group" aria-label="Explore purchase recognition">
        {(["Customer view", "Bank inquiry"] as const).map(name => <button key={name} type="button" aria-pressed={view === name} aria-controls={`${id}-view`} onClick={() => setView(name)}>{name}</button>)}
      </div>
    </div>

    <div className="recognition-scene">
      <div className="recognition-source">
        <div className="recognition-source-brand"><span><Icon name="business" /></span><div><strong>Trolleys</strong><small>Your sale record</small></div></div>
        <div className="recognition-source-purchase"><span className="recognition-purchase-symbol"><Icon name={purchaseIcons[purpose]} /></span><p>{sale.description}</p><strong>{amount}</strong></div>
        <div className="recognition-source-reference"><span>Reference</span><strong>{sale.orderReference}</strong></div>
        <div className="recognition-data-labels" aria-label="Connected purchase information"><span>Business</span><span>Payment</span><span>Purchase</span></div>
      </div>

      <div className="recognition-bridge" aria-label="Purchase information connected through Order Insight to a participating bank">
        <span className="recognition-bridge-symbol"><Icon name="layers" /></span>
        <strong>Order Insight</strong>
        <small>Connecting the details</small>
      </div>

      <div className={`dispute-art-window recognition-window ${customerView ? "recognition-customer" : "recognition-bank"}`} id={`${id}-view`}>
        <div className="recognition-windowbar"><span><Icon name="bank" />{customerView ? "Your customer’s banking app" : "A participating bank"}</span><small>Example</small></div>
        <article aria-label={`${view} example`}>
          {customerView ? <>
            <div className="recognition-statement"><span><Icon name="card" />Card payment</span><strong>{amount}</strong></div>
            <div className="recognition-reveal"><span /><p>A closer look at the purchase</p><span /></div>
          </> : <div className="recognition-inquiry"><span><Icon name="message" /></span><div><small>Customer’s question</small><p>“What is this payment for?”</p></div></div>}
          <div className="recognition-merchant"><span className="recognition-merchant-symbol"><Icon name="business" /></span><div><strong>Your business</strong><small>{sale.context}</small></div><div className="dispute-charge recognition-charge"><strong>{amount}</strong></div></div>
          <dl className="dispute-purchase-details recognition-details"><div><dt>Purchase</dt><dd>{sale.purchaseDetail}</dd></div><div><dt>Reference</dt><dd>{sale.orderReference}</dd></div></dl>
          <div className="recognition-context"><Icon name={customerView ? "insight" : "layers"} /><p>{customerView ? "More context to help your customer recognize the charge." : "Purchase context for the bank to review with the inquiry."}</p></div>
        </article>
      </div>
    </div>
    <figcaption>Illustrative banking experience. Details and presentation vary by participating bank.</figcaption>
  </figure>;
}
