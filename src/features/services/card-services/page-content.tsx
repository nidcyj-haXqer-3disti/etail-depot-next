import { CardServicesArt } from "./artwork";
import { pageJsonLd } from "./metadata";
import Link from "next/link";
import "@/shared/styles/connected-services.css";
import { PublicPageStructuredData } from "@/shared/seo/structured-data";
import { cardProduct } from "@/shared/site/card-product";
import { productFacts } from "@/shared/site/product-facts";
import { Shell } from "@/shared/layout/shell";
import { Icon } from "@/shared/ui/icon";
import { ServiceDetailHero } from "@/features/services/shared/service-detail-layout";

import { LedgixCardFace, WalletCardArt } from "@/features/services/card-services/wallet-card-art";
import { WalletGuide } from "@/features/services/card-services/wallet-guide";
import { SecuredCreditArt } from "@/features/services/card-services/secured-credit-art";
import "@/shared/styles/public-site.css";
import "@/features/services/card-services/card-services.css";
import "@/shared/styles/service-blueprint.css";
import "@/shared/styles/enterprise-support.css";

import "@/shared/styles/service-craft.css";

export default function CardServicesPage() {
  return <Shell><PublicPageStructuredData json={pageJsonLd()} /><div className="consumer-page consumer-product consumer-cards service-blueprint card-craft enterprise-support cw-cards">
    <ServiceDetailHero label="Card services" title="Secured credit for your digital wallet."
      intro={<>A virtual {cardProduct.creditType} backed by your security deposit. Use it with Apple&nbsp;Wallet or Google&nbsp;Wallet, where supported.</>}
      actions={<Link className="button primary" href="/company/contact#cards">Ask about card services</Link>}
      note="An inquiry is not an application."
      artwork={<CardServicesArt cardFace={<LedgixCardFace />} title="A virtual secured credit card backed by a separate security deposit" caption="Your deposit backs the account. Repay purchases separately under your cardholder agreement." />}
    />

    <section className="page-container card-details-section" id="card-details" aria-labelledby="card-details-title">
      <div className="consumer-section-heading"><div><h2 id="card-details-title">Know the cost. Understand the deposit.</h2></div></div>
      <dl className="card-details-grid">
        <div className="card-detail-deposit"><dt><span className="card-detail-symbol"><Icon name="lock" /></span>Security deposit</dt><dd><strong>{"$" + productFacts.cards.minimumDepositDollars}</strong><span className="card-detail-note">Minimum deposit</span><p>Backs your credit account. It does not pay for purchases.</p></dd></div>
        <div><dt><span className="card-detail-symbol"><Icon name="card" /></span>Annual and monthly fees</dt><dd className="card-detail-fees"><span><strong>{"$" + productFacts.cards.annualFeeDollars}</strong><span className="card-detail-note">Annual fee</span></span><span><strong>{"$" + productFacts.cards.monthlyFeeDollars}</strong><span className="card-detail-note">Monthly fee</span></span></dd></div>
        <div className="card-detail-repayment"><dt><span className="card-detail-symbol"><Icon name="document" /></span>Repayment</dt><dd><strong>{productFacts.cards.repayment}</strong><span className="card-detail-note">Repay your full statement balance. Earlier or daily payments are optional.</span></dd></div>
      </dl>
      <p className="card-details-disclosure">Eligibility, credit limits, other charges and terms for returning your deposit are governed by the cardholder agreement.</p>
    </section>
    <section className="page-container wallet-credit-section" id="secured-credit" aria-labelledby="wallet-credit-title">
      <div className="consumer-section-heading"><div><h2 id="wallet-credit-title">From purchase to monthly repayment.</h2></div><p>Keep the security deposit separate from the statement balance you repay.</p></div>
      <SecuredCreditArt />
    </section>
    <span id="card-questions-title" /><span id="card-contact-title" /><section className="wallet-guide-section" id="wallets" aria-labelledby="wallet-guide-title"><div className="page-container wallet-guide-grid">
      <div className="wallet-guide-copy"><p className="eyebrow">Digital wallets</p><h2 id="wallet-guide-title">Take your eligible card into your wallet.</h2><p className="wallet-guide-note">Follow the instructions from your wallet app and card issuer. Availability depends on your card, device and region.</p></div>
      <WalletGuide><WalletCardArt /></WalletGuide>
    </div></section>

  </div></Shell>;
}
