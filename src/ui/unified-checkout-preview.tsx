"use client";

import Image from "next/image";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { serviceExample } from "@/modules/public-site/service-model";
import { PaymentArtworkHeader } from "./payment-artwork-header";
import { Icon } from "./icon";
import { CommerceProductArt } from "./commerce-product-art";
import { NetworkMark } from "./network-brands";
import "./unified-checkout-preview.css";

const methods = ["Card", "Bank payment"] as const;
type Method = typeof methods[number];
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function CheckoutField({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <div className={`unified-preview-field${wide ? " unified-preview-field-wide" : ""}`}>
    <dt>{label}</dt><dd>{children}</dd>
  </div>;
}

/** A presentation of three checkout screens. Method controls never collect or submit payment data. */
export function UnifiedCheckoutPreview({ showPreviewNotice = true }: { showPreviewNotice?: boolean }) {
  const [method, setMethod] = useState<Method>("Card");
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const id = useId();
  const screens = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState(0);
  const screenNames = ["Order", "Details", "Result"];

  function showScreen(index: number) {
    const track = screens.current;
    const panels = track?.querySelectorAll<HTMLElement>(".unified-preview-stage");
    if (!track || !panels?.[index] || !panels[0]) return;
    track.scrollTo({left: panels[index].offsetLeft - panels[0].offsetLeft, behavior: "instant"});
    setScreen(index);
  }

  function trackScreen() {
    const track = screens.current;
    if (!track) return;
    const panels = [...track.querySelectorAll<HTMLElement>(".unified-preview-stage")];
    const first = panels[0];
    if (!first) return;
    const nearest = panels.reduce((best, panel, index) =>
      Math.abs(panel.offsetLeft - first.offsetLeft - track.scrollLeft) < Math.abs(panels[best]!.offsetLeft - first.offsetLeft - track.scrollLeft) ? index : best, 0);
    setScreen(nearest);
  }

  function moveScreen(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "Home" ? 0 : event.key === "End" ? 2
      : event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : null;
    if (next === null) return;
    event.preventDefault();
    showScreen(next);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  }
  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: serviceExample.currency }).format(serviceExample.amountCents / 100);

  function moveMethod(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "Home" ? 0 : event.key === "End" ? methods.length - 1
      : event.key === "ArrowRight" || event.key === "ArrowDown" ? (index + 1) % methods.length
        : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index + methods.length - 1) % methods.length : null;
    if (next === null) return;
    event.preventDefault();
    setMethod(methods[next]!);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  return <section className="unified-preview" data-enhanced={enhanced} aria-labelledby={`${id}-business`}>
    <noscript><span className="unified-preview-no-script" hidden /></noscript>
    <div className="payment-artwork-surface">
    <PaymentArtworkHeader caption="Online checkout" icon="lock" businessId={`${id}-business`} />
    <div className="unified-preview-screen-nav" role="group" aria-label="Checkout screens">
      {screenNames.map((name, index) => <button key={name} type="button" disabled={!enhanced} aria-label={`Show screen ${index + 1}: ${name}`} aria-pressed={screen === index} aria-controls={`${id}-screen-${index}`} onClick={() => showScreen(index)} onKeyDown={event => moveScreen(event, index)}><span aria-hidden="true">{index + 1}</span>{name}</button>)}
    </div>
    <div className="unified-preview-layout" ref={screens} onScroll={trackScreen} tabIndex={enhanced ? 0 : undefined} role="group" aria-label="Checkout artwork" onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : event.key === "ArrowRight" ? Math.min(screen + 1, 2) : event.key === "ArrowLeft" ? Math.max(screen - 1, 0) : null;
      if (next === null) return;
      event.preventDefault();
      showScreen(next);
    }}>
      <div className="unified-preview-stage" id={`${id}-screen-0`}>
        <div className="unified-preview-screen unified-preview-summary" role="group" aria-label="Order summary">
          <h4 className="unified-preview-screen-heading"><span aria-hidden="true">1</span>Your order</h4>
          <div className="unified-preview-screen-body">
            <div className="unified-preview-order">
              <span className="unified-preview-order-icon"><CommerceProductArt /></span>
              <div><strong>{serviceExample.description}</strong><span>{serviceExample.orderReference}</span></div>
            </div>
            <dl className="unified-preview-total"><dt>Total</dt><dd>{amount}<span>{serviceExample.currency}</span></dd></dl>
            <p className="unified-preview-method-label">Choose how to pay</p>
            <div className="unified-preview-methods" role="tablist" aria-orientation="vertical" aria-label="Checkout payment method">
              {methods.map((name, index) => <button key={name} type="button" disabled={!enhanced} role="tab" id={`${id}-method-${index}`} aria-controls={`${id}-method-panel`} aria-selected={method === name} tabIndex={method === name ? 0 : -1} onClick={() => setMethod(name)} onKeyDown={event => moveMethod(event, index)}><Icon name={index === 0 ? "card" : "bank"} /><span>{name}</span><span className="unified-preview-choice" aria-hidden="true" /></button>)}
            </div>
            <div className="unified-preview-wallets" role="group" aria-label="Wallet payment options">
              <div className="unified-preview-wallet-marks">
                <span className="unified-preview-wallet-option"><Image src="/brand/wallets/apple-pay.svg" width={165.52107} height={105.9651} alt="Apple Pay" className="unified-preview-apple" loading="eager" unoptimized /></span>
                <span className="unified-preview-wallet-option"><Image src="/brand/wallets/google-pay.svg" width={1094} height={742} alt="Google Pay" className="unified-preview-google" loading="eager" unoptimized /></span>
              </div>
            </div>
            <div className="unified-preview-networks" role="group" aria-label="Card networks">
              <NetworkMark network="visa" /><NetworkMark network="mastercard" /><NetworkMark network="amex" /><NetworkMark network="discover" />
            </div>
          </div>
        </div>
      </div>

      <div className="unified-preview-stage" id={`${id}-screen-1`}>
        <div className="unified-preview-screen unified-preview-payment">
          <h4 className="unified-preview-screen-heading"><span aria-hidden="true">2</span>Payment details</h4>
          <div className="unified-preview-method-panel unified-preview-screen-body" id={`${id}-method-panel`} role={enhanced ? "tabpanel" : "group"} aria-labelledby={enhanced ? `${id}-method-${methods.indexOf(method)}` : undefined} aria-label={enhanced ? undefined : "Card details"} tabIndex={enhanced ? 0 : undefined}>
            <dl className="unified-preview-contact"><div><dt>Email</dt><dd>••••@••••.com</dd></div></dl>
            <p className="unified-preview-detail-label">{method === "Card" ? "Card details" : "Bank account details"}</p>
            <dl className="unified-preview-fields">
              {method === "Card" ? <>
                <CheckoutField label="Card number" wide><span className="unified-preview-masked">•••• •••• •••• 4242</span><Icon name="card" /></CheckoutField>
                <CheckoutField label="Expiry">MM / YY</CheckoutField>
                <CheckoutField label="Security code">•••</CheckoutField>
                <CheckoutField label="Name on card" wide>•••• ••••••</CheckoutField>
                <CheckoutField label="Country">United States</CheckoutField>
                <CheckoutField label="ZIP code">10001</CheckoutField>
              </> : <>
                <CheckoutField label="Account holder" wide>•••• ••••••</CheckoutField>
                <CheckoutField label="Routing number" wide><span className="unified-preview-masked">•••••••••</span></CheckoutField>
                <CheckoutField label="Account number" wide><span className="unified-preview-masked">•••••••• 1048</span></CheckoutField>
                <CheckoutField label="Account type" wide>Checking</CheckoutField>
              </>}
            </dl>
            {method === "Bank payment" && <p className="unified-preview-bank-note">Review the bank payment authorization before confirming.</p>}
            <div className="unified-preview-pay-specimen" role="img" aria-label={`Checkout total ${amount}; no payment is made`}><Icon name="lock" /><span>{method === "Card" ? "Pay" : "Review payment"} {amount}</span></div>
          </div>
        </div>
      </div>

      <div className="unified-preview-stage" id={`${id}-screen-2`}>
        <div className={`unified-preview-screen unified-preview-confirmation${method === "Bank payment" ? " unified-preview-confirmation-pending" : ""}`} role="group" aria-label={method === "Card" ? "Card payment confirmation" : "Bank payment submission"}>
          <h4 className="unified-preview-screen-heading"><span aria-hidden="true">3</span>Confirmation</h4>
          <div className="unified-preview-screen-body">
            <div className="unified-preview-confirmation-status">
              <span className="unified-preview-status-icon"><Icon name={method === "Card" ? "check" : "document"} /></span>
              <p className="unified-preview-confirmation-title">{method === "Card" ? "Payment approved" : "Payment submitted"}</p>
              <p className="unified-preview-amount">{amount}<span>{serviceExample.currency}</span></p>
            </div>
            <dl className="unified-preview-receipt">
              <div><dt>Order</dt><dd>{serviceExample.orderReference}</dd></div>
              <div><dt>For</dt><dd>{serviceExample.description}</dd></div>
              <div className="unified-preview-receipt-method"><dt>Payment method</dt><dd>{method === "Card" ? <><NetworkMark network="visa" /><span>•••• 4242</span></> : <><Icon name="bank" /><span>Bank account •••• 1048</span></>}</dd></div>
              <div><dt>Status</dt><dd>{method === "Card" ? "Approved" : "Processing"}</dd></div>
            </dl>
            <p className="unified-preview-confirmation-note">{method === "Card" ? "Keep the order reference with your payment receipt." : "Submission does not confirm that the bank payment has cleared."}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div className="unified-preview-notes">
      {showPreviewNotice && <p className="unified-preview-example-note">No payment is made.{method === "Bank payment" && <> Submission is not settlement.</>}</p>}
      <p className="unified-preview-eligibility">Payment methods depend on the merchant account. Wallet availability also depends on the customer’s card and device.</p>
    </div>
  </section>;
}
