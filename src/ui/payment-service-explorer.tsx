"use client";

import { useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { CommerceProductArt } from "./commerce-product-art";
import { serviceExample } from "@/modules/public-site/service-model";
import { MerchantOnboardingArt, MerchantPayoutArt } from "./merchant-journey-art";
import { UnifiedCheckoutPreview } from "./unified-checkout-preview";
import "./payment-service-explorer.css";

const views = ["Onboarding", "Checkout", "Card record", "Card payout"] as const;
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function amount(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: serviceExample.currency }).format(cents / 100);
}

/** Local presentation controls only: choosing a view never advances a payment state. */
export function PaymentServiceExplorer() {
  const [selected, setSelected] = useState(1);
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const prefix = useId();
  const controls = useRef<(HTMLButtonElement | null)[]>([]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % views.length;
    else if (event.key === "ArrowLeft") next = (index + views.length - 1) % views.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = views.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    controls.current[next]?.focus();
  }

  return (
    <div className="payment-service-explorer" data-enhanced={enhanced}>
      <noscript><span className="pse-no-script" hidden /></noscript>
      <div className="pse-context"><span>{selected === 0 ? "Merchant application" : selected === 1 ? "Payment journey" : "Card payment"}</span><span>{selected === 0 ? serviceExample.business : `${serviceExample.orderReference} · ${amount(serviceExample.amountCents)} ${serviceExample.currency}`}</span></div>
      <div className="pse-tabs" role="tablist" aria-label="Payment journey views">
        {views.map((view, index) => (
          <button key={view} type="button" disabled={!enhanced} role="tab" id={`${prefix}-tab-${index}`} aria-controls={`${prefix}-panel-${index}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} ref={node => { controls.current[index] = node; }} onClick={() => setSelected(index)} onKeyDown={event => navigate(event, index)}>{view}</button>
        ))}
      </div>
      <div className="pse-panels">
      <div className="pse-panel" id={`${prefix}-panel-0`} role="tabpanel" aria-labelledby={`${prefix}-tab-0`} tabIndex={0} hidden={selected !== 0} aria-hidden={enhanced && selected !== 0} inert={enhanced && selected !== 0}>
        <h3 className="pse-view-title">Set up your merchant account.</h3>
        <MerchantOnboardingArt />
      </div>
      <div className="pse-panel" id={`${prefix}-panel-1`} role="tabpanel" aria-labelledby={`${prefix}-tab-1`} tabIndex={0} hidden={selected !== 1} aria-hidden={enhanced && selected !== 1} inert={enhanced && selected !== 1}>
        <h3 className="pse-view-title">Let customers choose how to pay.</h3>
        <UnifiedCheckoutPreview showPreviewNotice={false} />
      </div>
      <div className="pse-panel" id={`${prefix}-panel-2`} role="tabpanel" aria-labelledby={`${prefix}-tab-2`} tabIndex={0} hidden={selected !== 2} aria-hidden={enhanced && selected !== 2} inert={enhanced && selected !== 2}>
        <h3 className="pse-view-title">Match the card payment to the order.</h3>
        <div className="pse-record-layout">
          <div className="pse-record">
            <div className="pse-record-heading"><p className="pse-label">{serviceExample.business}</p><p className="pse-record-amount">{amount(serviceExample.amountCents)} <span>{serviceExample.currency}</span></p></div>
            <div className="pse-record-product"><span className="commerce-product-thumbnail"><CommerceProductArt /></span><div><p className="pse-record-description">{serviceExample.description}</p><p className="pse-product-detail">1 pair · Chalk / Teal</p></div></div>
            <dl className="pse-facts"><div><dt>Order reference</dt><dd>{serviceExample.orderReference}</dd></div><div><dt>Payment method</dt><dd>Card</dd></div></dl>
            <ol className="pse-stages">
              <li><span className="pse-stage-index" aria-hidden="true">01</span><div><p><strong>Authorization</strong><span>Approved</span></p><p>The issuer approves the payment request.</p></div></li>
              <li><span className="pse-stage-index" aria-hidden="true">02</span><div><p><strong>Capture</strong><span>Captured</span></p><p>The approved payment is submitted for processing.</p></div></li>
            </ol>
            <p className="pse-record-note">Capture does not confirm that money has reached the merchant’s bank.</p>
          </div>
          <aside className="pse-related" aria-label="Related payment information">
            <p className="pse-related-title">Related payment records</p>
            <p>Keep refunds and disputes connected to the original payment.</p>
            <details><summary>Refunds</summary><p>A refund has its own status and reference. Requesting one does not confirm completion.</p></details>
            <details><summary>Disputes</summary><p>A dispute has its own case reference, evidence and response deadline.</p></details>
            <details><summary>If the result is unclear</summary><p>An unknown result is not a decline. Check the original payment reference and its status before trying again.</p></details>
          </aside>
        </div>
      </div>
      <div className="pse-panel" id={`${prefix}-panel-3`} role="tabpanel" aria-labelledby={`${prefix}-tab-3`} tabIndex={0} hidden={selected !== 3} aria-hidden={enhanced && selected !== 3} inert={enhanced && selected !== 3}>
        <h3 className="pse-view-title">Reconcile your card payout.</h3>
        <MerchantPayoutArt />
      </div>
      </div>
    </div>
  );
}
