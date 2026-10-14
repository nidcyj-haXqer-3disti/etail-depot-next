import type { ReactNode } from "react";
import { ServiceStatus } from "./service-entry";
import { NetworkBrands } from "./network-brands";
import "./consumer-site.css";

/** Shared framing for the public product pages. */
export function ConsumerHero({service,title,description,actions,visual,note,footer,product=false,productLabel}: {
  service:"cards"|"payments";title:ReactNode;description:ReactNode;actions?:ReactNode;visual:ReactNode;note?:ReactNode;footer?:ReactNode;product?:boolean;productLabel?:string;
}) {
  return <section className={`consumer-hero${product ? " consumer-product-hero" : ""}`} aria-labelledby="welcome-title">
    <div className="page-container consumer-hero-grid">
      <div className="consumer-hero-copy">
        <div className="consumer-product-eyebrow"><p className="eyebrow">{productLabel ?? (service === "cards" ? "Ledgix · Secured credit card" : "Trolleys · Payment acceptance")}</p><ServiceStatus service={service}/></div>
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
    <p>Accept major credit and debit cards.</p>
    <NetworkBrands variant="accepted" label="Accepted card networks" loading="eager" />
  </div>;
}
