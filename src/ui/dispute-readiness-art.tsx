"use client";

import { useId, useState } from "react";
import { paymentExamples, type PaymentExamplePurpose } from "@/modules/public-site/payment-examples";
import { formatUsdCents } from "@/modules/public-site/fee-estimate";
import { Icon } from "./icon";

/** Illustrates purchase recognition, not a live bank response or dispute result. */
export function DisputeReadinessArt({purpose}: {purpose: PaymentExamplePurpose}) {
  const [view, setView] = useState<"Customer view" | "Bank inquiry">("Customer view");
  const id = useId();
  const sale = paymentExamples[purpose];
  return <figure className="dispute-art" aria-label="Order Insight purchase recognition example">
    <div className="dispute-art-switch" role="group" aria-label="Explore purchase recognition">
      {(["Customer view", "Bank inquiry"] as const).map(name => <button key={name} type="button" aria-pressed={view === name} aria-controls={`${id}-view`} onClick={() => setView(name)}>{name}</button>)}
    </div>
    <div className="dispute-art-window" id={`${id}-view`}>
      <div className="dispute-art-windowbar"><span><Icon name={view === "Customer view" ? "person" : "bank"} />{view === "Customer view" ? "Purchase details" : "Payment inquiry"}</span><span>Example</span></div>
      <article aria-label={`${view} example`}>
        <div className="dispute-merchant"><span className="dispute-merchant-symbol"><Icon name="business" /></span><span><strong>Your business</strong><small>{sale.context}</small></span></div>
        <div className="dispute-charge"><strong>{formatUsdCents(sale.amountCents)}</strong><span>Card payment</span></div>
        {view === "Bank inquiry" && <div className="dispute-inquiry"><Icon name="message" /><p>“What is this payment for?”</p></div>}
        <dl className="dispute-purchase-details"><div><dt>Purchase</dt><dd>{sale.purchaseDetail}</dd></div><div><dt>Reference</dt><dd>{sale.orderReference}</dd></div><div><dt>Business</dt><dd>Your business</dd></div></dl>
        <div className="dispute-context-note"><Icon name="insight" /><p>{view === "Customer view" ? "A familiar purchase is easier to recognize." : "The transaction and purchase details give the bank more context."}</p></div>
      </article>
    </div>
    <div className="dispute-art-connection" aria-label="Purchase details shared through Order Insight to participating banks"><span><Icon name="layers" />Purchase details</span><Icon name="arrow" /><strong>Order Insight</strong><Icon name="arrow" /><span><Icon name="bank" />Bank</span></div>
    <figcaption>Illustrative banking experience. Details and presentation vary by participating bank.</figcaption>
  </figure>;
}
