import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { cardProduct } from "@/shared/card-product";
import { productFacts } from "@/shared/product-facts";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { CardContactLink } from "@/ui/service-entry";
import { WalletCardArt } from "@/ui/wallet-card-art";
import { WalletGuide } from "@/ui/wallet-guide";
import { SecuredCreditArt } from "@/ui/secured-credit-art";
import { ConsumerHero } from "@/ui/consumer-layout";
import "@/ui/public-site.css";
import "@/ui/card-services.css";

export const metadata = publicPageMetadata("/card-services");
export default function CardServicesPage() {
  return <Shell><PublicPageStructuredData path="/card-services" /><div className="consumer-page consumer-product consumer-cards">
    <ConsumerHero product service="cards" productLabel={`Ledgix · ${cardProduct.name}`} title={<>Secured credit. <br /><span>Made for your wallet.</span></>}
      description={<>A virtual {cardProduct.creditType} for Apple Wallet and Google Wallet. Keep your card on your phone and pay in stores, in apps and online where supported.</>}
      actions={<><CardContactLink /><a href="#card-details" className="consumer-text-link">View card details<Icon name="arrow" /></a></>}
      note={<div className="consumer-product-note">Applications are not open yet.</div>}
      visual={<WalletCardArt variant="preview" />}
    />
    <section className="page-container card-details-section" id="card-details" aria-labelledby="card-details-title">
      <div className="consumer-section-heading"><div><h2 id="card-details-title">The details, up front.</h2></div></div>
      <dl className="card-details-grid">
        <div className="card-detail-deposit"><dt><span className="card-detail-symbol"><Icon name="lock" /></span>Security deposit</dt><dd><strong>{"$" + productFacts.cards.minimumDepositDollars}</strong><span className="card-detail-note">Minimum deposit</span><p>Backs your card account.</p></dd></div>
        <div><dt><span className="card-detail-symbol"><Icon name="card" /></span>Account fees</dt><dd className="card-detail-fees"><span><strong>{"$" + productFacts.cards.annualFeeDollars}</strong><span className="card-detail-note">Annual fee</span></span><span><strong>{"$" + productFacts.cards.monthlyFeeDollars}</strong><span className="card-detail-note">Monthly fee</span></span></dd></div>
        <div className="card-detail-repayment"><dt><span className="card-detail-symbol"><Icon name="document" /></span>Repayment</dt><dd><strong>{productFacts.cards.repayment}</strong><span className="card-detail-note">Earlier or daily payments are optional.</span></dd></div>
      </dl>
      <p className="card-details-disclosure">Final eligibility, credit limits, other charges and deposit-return terms will be provided before applications open.</p>
    </section>
    <section className="page-container wallet-credit-section" id="secured-credit" aria-labelledby="wallet-credit-title">
      <div className="consumer-section-heading"><div><h2 id="wallet-credit-title">How secured credit works.</h2></div><p>Your deposit backs the account. Your payments cover what you spend.</p></div>
      <SecuredCreditArt />
    </section>
    <section className="wallet-guide-section" id="wallets" aria-labelledby="wallet-guide-title"><div className="page-container wallet-guide-grid">
      <div className="wallet-guide-copy"><p className="eyebrow">From card to wallet</p><h2 id="wallet-guide-title">Set up your wallet.</h2><p>See the steps for Apple Wallet or Google Wallet: add your card, verify it and get ready to pay.</p><p className="wallet-guide-note">Follow your wallet app and card issuer’s instructions. Availability depends on your card, device and region.</p></div>
      <WalletGuide><WalletCardArt /></WalletGuide>
    </div></section>
    <section className="page-container public-section public-faq-section" aria-labelledby="card-questions-title">
      <div><h2 id="card-questions-title">Good to know.</h2><Link href="/help#cards" className="consumer-text-link">Card help<Icon name="arrow" /></Link></div>
      <div className="public-questions">
        <details><summary>Can I apply now?<span aria-hidden="true">+</span></summary><p>Applications are not open yet. Contact Ledgix with questions about the upcoming card.</p></details>
        <details><summary>When is the security deposit returned?<span aria-hidden="true">+</span></summary><p>Deposit-return conditions and timing will be set out in the card agreement before applications open. Your security deposit is separate from repayments for purchases.</p></details>
        <details><summary>How do repayments work?<span aria-hidden="true">+</span></summary><p>{productFacts.cards.repayment}. You can also pay earlier or daily. Your security deposit does not replace your monthly payment.</p></details>
        <details><summary>Where can I use the card?<span aria-hidden="true">+</span></summary><p>Use your card through Apple Wallet or Google Wallet at participating stores, in apps and online. Card, wallet and merchant acceptance requirements apply.</p></details>
        <details><summary>What if I lose my phone?<span aria-hidden="true">+</span></summary><p>Use Apple Find My or Google Find Hub to secure your device. Contact Ledgix promptly about your card and any unrecognized purchases.</p></details>
        <details><summary>Where will I manage my card account?<span aria-hidden="true">+</span></summary><p>You’ll manage your card account and get support through Ledgix when the service launches.</p></details>
      </div>
    </section>
  </div></Shell>;
}
