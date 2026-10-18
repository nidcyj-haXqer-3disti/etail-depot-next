"use client";

import { useId, useState } from "react";
import { paymentExamples, type PaymentExamplePurpose } from "@/modules/public-site/payment-examples";
import { formatUsdCents } from "@/modules/public-site/fee-estimate";
import { Icon } from "./icon";
import "./dispute-readiness-art.css";

const purchaseIcons = { goods: "box", services: "person", information: "insight" } as const;

function PurchaseRecord({purpose}: {purpose: PaymentExamplePurpose}) {
  const sale = paymentExamples[purpose];
  return <dl className="dispute-purchase-details recognition-details">
    <div><dt>Purchase</dt><dd>{sale.purchaseDetail}</dd></div>
    <div><dt>Reference</dt><dd>{sale.orderReference}</dd></div>
    <div><dt>{sale.fulfillmentLabel}</dt><dd>{sale.fulfillmentDetail}</dd></div>
    {"informationAsOf" in sale && <div><dt>As of</dt><dd>{sale.informationAsOf}</dd></div>}
  </dl>;
}

function TransactionFacts() {
  return <dl className="recognition-transaction">
    <div><dt>Transaction date</dt><dd>18 Sep</dd></div>
    <div><dt>Card</dt><dd>Visa •••• 4242</dd></div>
    <div><dt>Statement name</dt><dd>YOUR BUSINESS</dd></div>
  </dl>;
}

function MerchantSupport() {
  return <div className="recognition-support"><Icon name="message" /><div><strong>Merchant support</strong><span>support@yourbusiness.example</span></div></div>;
}

/** Neutral example interfaces. No bank request, delivery or dispute outcome is created. */
export function DisputeReadinessArt({purpose}: {purpose: PaymentExamplePurpose}) {
  const [view, setView] = useState<"Customer view" | "Bank inquiry">("Customer view");
  const id = useId();
  const sale = paymentExamples[purpose];
  const amount = formatUsdCents(sale.amountCents);
  const customerView = view === "Customer view";

  return <figure className="dispute-art recognition-art" aria-label="Order Insight purchase recognition example">
    <div className="recognition-toolbar">
      <p>From your sale to their transaction details.</p>
      <div className="dispute-art-switch recognition-switch" role="group" aria-label="Explore purchase recognition">
        {(["Customer view", "Bank inquiry"] as const).map(name => <button key={name} type="button" aria-pressed={view === name} aria-controls={`${id}-view`} onClick={() => setView(name)}>{name}</button>)}
      </div>
    </div>

    <div className="recognition-scene" data-view={customerView ? "customer" : "bank"}>
      <div className="recognition-source">
        <div className="recognition-source-brand"><span><Icon name="business" /></span><div><strong>Trolleys</strong><small>Your sale record</small></div><span className="recognition-paid">Paid</span></div>
        <div className="recognition-source-purchase"><span className="recognition-purchase-symbol"><Icon name={purchaseIcons[purpose]} /></span><p>{sale.description}</p><strong>{amount}</strong></div>
        <div className="recognition-source-reference"><span>Reference</span><strong>{sale.orderReference}</strong></div>
        <div className="recognition-data-labels" role="group" aria-label="Connected purchase information"><span>Business</span><span>Payment</span><span>Purchase</span></div>
      </div>

      <div className="recognition-bridge" role="group" aria-label="Purchase information connected through Order Insight to a participating bank">
        <span className="recognition-bridge-symbol"><Icon name="layers" /></span>
        <strong>Order Insight</strong>
        <small>Purchase details</small>
      </div>

      <div className="recognition-view-stage" id={`${id}-view`}>
        {customerView ? <div className="dispute-art-window recognition-phone">
          <div className="recognition-phone-status" aria-hidden="true"><span>9:41</span><i /><span className="recognition-battery" /></div>
          <div className="recognition-phone-nav"><Icon name="arrow" /><span>Transaction details</span><Icon name="info" /></div>
          <article aria-label="Customer view example">
            <div className="recognition-phone-merchant"><span><Icon name="business" /></span><strong>Your business</strong><small>{sale.context}</small></div>
            <div className="dispute-charge recognition-phone-amount"><strong>{amount}</strong><span><i />Posted</span></div>
            <TransactionFacts />
            <details className="recognition-receipt" open>
              <summary><Icon name="document" /><span>Purchase details</span><Icon name="arrow" /></summary>
              <div className="recognition-receipt-content"><PurchaseRecord purpose={purpose} /><MerchantSupport /></div>
            </details>
          </article>
          <div className="recognition-phone-home" aria-hidden="true" />
        </div> : <div className="dispute-art-window recognition-bank">
          <div className="recognition-bank-chrome"><span><Icon name="bank" />Bank support</span><span>Transaction inquiries</span></div>
          <article aria-label="Bank inquiry example">
            <div className="recognition-case-heading"><div><p>TRANSACTION INQUIRY</p><strong>{sale.orderReference.replace(/^[^-]+/, "INQ")}</strong></div><span className="recognition-case-status">Ready to review</span></div>
            <div className="recognition-inquiry"><Icon name="message" /><div><small>Customer’s question</small><p>“I don’t recognize this charge.”</p></div></div>
            <div className="recognition-bank-payment"><div><strong>Your business</strong><span>{sale.context}</span></div><div className="dispute-charge"><strong>{amount}</strong><span>Posted · 19 Sep</span></div></div>
            <TransactionFacts />
            <section className="recognition-response" aria-label="Merchant response">
              <div className="recognition-response-heading"><span><Icon name="layers" />Merchant response</span><small>via Order Insight</small></div>
              <p className="recognition-response-status"><Icon name="check" />Purchase details available</p>
              <PurchaseRecord purpose={purpose} /><MerchantSupport />
            </section>
            <ol className="recognition-case-progress" aria-label="Inquiry progress"><li><span>1</span>Inquiry received</li><li><span>2</span>Details returned</li><li><span>3</span>Ready to review</li></ol>
          </article>
        </div>}
      </div>
    </div>
    <figcaption>Example bank screens. The details shown and screen layouts vary by bank.</figcaption>
  </figure>;
}
