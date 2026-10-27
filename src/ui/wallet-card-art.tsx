"use client";

import Image from "next/image";
import { BrandImage } from "./brand-image";
import "./brand-images-ledgix.css";
import { useId, useState } from "react";
import type { KeyboardEvent } from "react";
import { useClientReady } from "./use-client-ready";
import { Icon } from "./icon";
import { NetworkMark } from "./network-brands";
import "./wallet-card-art.css";

const wallets = ["Apple Wallet", "Google Wallet"] as const;
type Wallet = typeof wallets[number];
const payMarks = {
  "Apple Wallet": { src: "/brand/wallets/apple-pay.svg", width: 165.52107, height: 105.9651, className: "wallet-setup-apple-pay" },
  "Google Wallet": { src: "/brand/wallets/google-pay.svg", width: 1094, height: 742, className: "wallet-setup-google-pay" },
} as const;
const steps = ["Add card", "Verify", "Use wallet"] as const;
const guides = {
  "Apple Wallet": [
    { title: "Start in Apple Wallet.", description: "Tap +, choose Debit or Credit Card, then Continue. Enter your Ledgix card details manually.", screen: "Add Card", option: "Debit or Credit Card", action: "Enter Card Details Manually" },
    { title: "Confirm it’s your card.", description: "Follow the wallet prompts and any verification requested by your card issuer.", screen: "Verify your card", option: "Card verification", action: "Follow the verification steps" },
    { title: "Pay with Apple Pay.", description: "Once setup is complete, use Apple Pay at participating stores, in apps and online.", screen: "Wallet", option: "Apple Pay", action: "Ready for Apple Pay" },
  ],
  "Google Wallet": [
    { title: "Start in Google Wallet.", description: "Tap Add to Wallet, choose Payment card, then New credit or debit card. Enter your Ledgix card details manually.", screen: "Add to Wallet", option: "Payment card", action: "New credit or debit card" },
    { title: "Confirm it’s your card.", description: "Save your details, review the issuer terms and complete any verification requested by your card issuer.", screen: "Verify your card", option: "Card verification", action: "Follow the verification steps" },
    { title: "Pay with Google Pay.", description: "Once setup is complete, tap to pay with your phone or use Google Pay at participating online checkouts.", screen: "Google Wallet", option: "Google Pay", action: "Tap to pay" },
  ],
} as const;

export function LedgixCardFace() {
  return <div className="ledgix-wallet-card">
    <div className="ledgix-wallet-card-accent" />
    <BrandImage brand="ledgix" className="ledgix-wallet-card-logo" alt="" width={512} height={182} />
    <span className="ledgix-wallet-card-name">Secured credit card</span>
    <div className="ledgix-wallet-card-network"><NetworkMark network="visa" decorative /></div>
  </div>;
}

function WalletProductPreview({ compact }: { compact: boolean }) {
  return <figure className={`wallet-product-art${compact ? " wallet-product-art-compact" : ""}`} aria-label="Preview of the Ledgix credit card for Apple Wallet and Google Wallet">
    <div className="wallet-product-device" aria-hidden="true">
      <div className="wallet-product-screen">
        <span className="wallet-product-camera" />
        <div className="wallet-product-card"><LedgixCardFace /></div>
        <div className="wallet-product-marks">
          {wallets.map(name => {
            const mark = payMarks[name];
            return <Image key={name} unoptimized loading="eager" src={mark.src} width={mark.width} height={mark.height} className={mark.className} alt="" />;
          })}
        </div>
        <span className="wallet-product-home" />
      </div>
    </div>
  </figure>;
}

/** Preview introduces the product; the guide changes only its illustration and never provisions a card. */
export function WalletCardArt({ compact = false, variant = "guide" }: { compact?: boolean; variant?: "guide" | "preview" }) {
  return variant === "preview" ? <WalletProductPreview compact={compact} /> : <WalletSetupGuide compact={compact} />;
}

function WalletSetupGuide({ compact }: { compact: boolean }) {
  const ready = useClientReady();
  const [wallet, setWallet] = useState<Wallet>("Apple Wallet");
  const [step, setStep] = useState(0);
  const id = useId();
  const guide = guides[wallet][step]!;
  function selectWallet(next: Wallet) { setWallet(next); setStep(0); }
  function handleKeys(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "Home" ? 0 : event.key === "End" ? wallets.length - 1 : event.key === "ArrowRight" ? (index + 1) % wallets.length : event.key === "ArrowLeft" ? (index + wallets.length - 1) % wallets.length : null;
    if (next === null) return;
    event.preventDefault();
    selectWallet(wallets[next]!);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[next]?.focus();
  }
  return <div className={`wallet-card-art${compact ? " wallet-card-art-compact" : ""}`}>
    <div className="wallet-setup-tabs" role="tablist" aria-label="Wallet preview options">
      {wallets.map((name, index) => <button type="button" disabled={!ready} role="tab" key={name} id={`${id}-wallet-${index}`} aria-selected={wallet === name} aria-controls={`${id}-panel`} tabIndex={wallet === name ? 0 : -1} onClick={() => selectWallet(name)} onKeyDown={event => handleKeys(event, index)}>{name}</button>)}
    </div>
    <div className="wallet-setup-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-wallet-${wallets.indexOf(wallet)}`} tabIndex={0}>
      <ol className="wallet-setup-steps">
        {steps.map((label, index) => <li key={label}><button type="button" disabled={!ready} aria-label={`Show step ${index + 1}: ${label}`} aria-pressed={step === index} onClick={() => setStep(index)}><span>{index + 1}</span>{label}</button></li>)}
      </ol>
      <div className="wallet-setup-scene">
        <div className={`wallet-setup-phone wallet-setup-phone-${wallet === "Apple Wallet" ? "apple" : "google"}`} aria-hidden="true">
          <div className="wallet-setup-screen">
            <span className="wallet-setup-camera" />
            <div className="wallet-setup-screen-heading"><span>{guide.screen}</span>{step === 0 ? <b>+</b> : <Icon name={step === 1 ? "lock" : "card"} />}</div>
            <div className="wallet-setup-card-wrap"><LedgixCardFace /></div>
            <div className="wallet-setup-screen-info">
              <div className="wallet-setup-pay-mark">
                {/* Keep each decoded logo on its own image when the wallet changes. */}
                {wallets.map(name => {
                  const mark = payMarks[name];
                  return <Image key={name} unoptimized loading="eager" hidden={wallet !== name} src={mark.src} width={mark.width} height={mark.height} className={mark.className} alt="" />;
                })}
              </div>
              <strong>{guide.option}</strong>
            </div>
            <div className="wallet-setup-screen-action">{guide.action}{step === 0 && <Icon name="arrow" />}</div>
            <span className="wallet-setup-home" />
          </div>
        </div>
        <div className="wallet-setup-description" aria-live="polite" aria-atomic="true"><h3>{guide.title}</h3><p>{guide.description}</p></div>
      </div>
    </div>
  </div>;
}
