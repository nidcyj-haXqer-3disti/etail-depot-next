import Link from "next/link";
import { ServiceContext } from "@/ui/service-context";
import "@/ui/connected-services.css";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { cardProduct } from "@/shared/card-product";
import { productFacts } from "@/shared/product-facts";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { CardProgramArt } from "@/ui/service-blueprint-art";
import { WalletCardArt } from "@/ui/wallet-card-art";
import { WalletGuide } from "@/ui/wallet-guide";
import { SecuredCreditArt } from "@/ui/secured-credit-art";
import { ConsumerHero } from "@/ui/consumer-layout";
import { ServiceSectionNav } from "@/ui/service-section-nav";
import "@/ui/public-site.css";
import "@/ui/card-services.css";
import "@/ui/service-blueprint.css";
import "@/ui/enterprise-support.css";

import "@/ui/service-craft.css";

export const metadata = publicPageMetadata("/credit-card-services");
export default function CardServicesPage() {
  return <Shell><PublicPageStructuredData path="/credit-card-services" /><div className="consumer-page consumer-product consumer-cards service-blueprint card-craft enterprise-support cw-cards">
    <ServiceContext path="/credit-card-services" />
    <ServiceSectionNav title="Card services" links={[
      { href: "#card-details", label: "Card details" },
      { href: "#secured-credit", label: "How it works" },
      { href: "#wallets", label: "Digital wallets" },
    ]} />
    <ConsumerHero product service="cards" productLabel="Card services" title={<>Secured credit. <br /><span>Made for your wallet.</span></>}
      description={<>A virtual {cardProduct.creditType} for Apple&nbsp;Wallet and Google&nbsp;Wallet, where supported.</>}
      actions={<Link className="button primary" href="/contact#cards">Ask about card services</Link>}
      note={<div className="consumer-product-note">An inquiry is not an application.</div>}
      visual={<CardProgramArt />}
    />

    <section className="page-container card-details-section" id="card-details" aria-labelledby="card-details-title">
      <div className="consumer-section-heading"><div><h2 id="card-details-title">Card fees, deposit and repayment.</h2></div></div>
      <dl className="card-details-grid">
        <div className="card-detail-deposit"><dt><span className="card-detail-symbol"><Icon name="lock" /></span>Security deposit</dt><dd><strong>{"$" + productFacts.cards.minimumDepositDollars}</strong><span className="card-detail-note">Minimum deposit</span><p>Backs your credit account. It does not pay for purchases.</p></dd></div>
        <div><dt><span className="card-detail-symbol"><Icon name="card" /></span>Annual and monthly fees</dt><dd className="card-detail-fees"><span><strong>{"$" + productFacts.cards.annualFeeDollars}</strong><span className="card-detail-note">Annual fee</span></span><span><strong>{"$" + productFacts.cards.monthlyFeeDollars}</strong><span className="card-detail-note">Monthly fee</span></span></dd></div>
        <div className="card-detail-repayment"><dt><span className="card-detail-symbol"><Icon name="document" /></span>Repayment</dt><dd><strong>{productFacts.cards.repayment}</strong><span className="card-detail-note">Repay your full statement balance. Earlier or daily payments are optional.</span></dd></div>
      </dl>
      <p className="card-details-disclosure">Eligibility, credit limits, other charges and terms for returning your deposit are governed by the cardholder agreement.</p>
    </section>
    <section className="page-container wallet-credit-section" id="secured-credit" aria-labelledby="wallet-credit-title">
      <div className="consumer-section-heading"><div><h2 id="wallet-credit-title">How secured credit works.</h2></div><p>A deposit backs your credit account. Purchases create a separate balance that you repay each month.</p></div>
      <SecuredCreditArt />
    </section>
    <span id="card-questions-title" /><span id="card-contact-title" /><section className="wallet-guide-section" id="wallets" aria-labelledby="wallet-guide-title"><div className="page-container wallet-guide-grid">
      <div className="wallet-guide-copy"><p className="eyebrow">Digital wallets</p><h2 id="wallet-guide-title">Add a card to your wallet.</h2><p>See how an eligible card is added to Apple Wallet or Google Wallet.</p><p className="wallet-guide-note">Follow the instructions from your wallet app and card issuer. Availability depends on your card, device and region.</p></div>
      <WalletGuide><WalletCardArt /></WalletGuide>
    </div></section>

  </div></Shell>;
}
