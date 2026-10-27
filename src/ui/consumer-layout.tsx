import type { ReactNode } from "react";
import Image from "next/image";
import { Icon } from "./icon";
import { serviceLabels } from "@/shared/service-language";
import { NetworkBrands } from "./network-brands";
import "./consumer-site.css";

/** Shared framing for the public product pages. */
export function ConsumerHero({service,title,description,actions,visual,note,footer,product=false,productLabel}: {
  service:"cards"|"payments";title:ReactNode;description:ReactNode;actions?:ReactNode;visual:ReactNode;note?:ReactNode;footer?:ReactNode;product?:boolean;productLabel?:string|null;
}) {
  return <section className={`consumer-hero${product ? " consumer-product-hero" : ""}`} aria-labelledby="welcome-title">
    <div className="page-container consumer-hero-grid">
      <div className="consumer-hero-copy">
        {productLabel !== null && <div className="consumer-product-eyebrow"><p className="eyebrow">{productLabel ?? serviceLabels[service]}</p></div>}
        <h1 id="welcome-title">{title}</h1>
        <p>{description}</p>
        {actions && <div className="consumer-hero-actions">{actions}</div>}
        {note}
      </div>
      {visual}
    </div>
    {footer && <div className="page-container">{footer}</div>}
  </section>;
}

export function ConsumerNetworks() {
  return <div className="consumer-networks">
    <div className="consumer-payment-methods">
      <NetworkBrands variant="accepted" label="Accepted card networks" />
      <div className="consumer-bank-wallets" role="group" aria-label="Digital wallets and bank payments">
        <span className="consumer-payment-mark"><Image src="/brand/wallets/apple-pay.svg" width={165.52107} height={105.9651} alt="Apple Pay" className="consumer-apple-pay" loading="eager" decoding="sync" unoptimized /></span>
        <span className="consumer-payment-mark"><Image src="/brand/wallets/google-pay.svg" width={1094} height={742} alt="Google Pay" className="consumer-google-pay" loading="eager" decoding="sync" unoptimized /></span>
        <span className="consumer-payment-mark consumer-ach" role="img" aria-label="ACH bank payments"><Icon name="bank" /><span aria-hidden="true">ACH</span></span>
      </div>
    </div>
  </div>;
}
