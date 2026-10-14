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

export const metadata = publicPageMetadata("/credit-card-services");
export default function CardServicesPage() {
  return <Shell><PublicPageStructuredData path="/credit-card-services" /><div className="consumer-page consumer-product consumer-cards">
    <ConsumerHero product service="cards" productLabel="Ledgix · Secured credit card" title={<>Secured credit. <br /><span>Made for your wallet.</span></>}
      description={<>A virtual {cardProduct.creditType} for Apple&nbsp;Wallet and Google&nbsp;Wallet. Keep your card on your phone and pay in stores, in apps and online where supported.</>}
      actions={<><CardContactLink /><a href="#card-details" className="consumer-text-link">View card details<Icon name="arrow" /></a></>}
      note={<div className="consumer-product-note">Applications are not open yet.</div>}
      visual={<WalletCardArt variant="preview" />}
    />
    <section className="page-container card-details-section" id="card-details" aria-labelledby="card-details-title">
      <div className="consumer-section-heading"><div><h2 id="card-details-title">Card fees, deposit and repayment.</h2></div></div>
      <dl className="card-details-grid">
        <div className="card-detail-deposit"><dt><span className="card-detail-symbol"><Icon name="lock" /></span>Security deposit</dt><dd><strong>{"$" + productFacts.cards.minimumDepositDollars}</strong><span className="card-detail-note">Minimum deposit</span><p>Backs your credit account. It does not pay for purchases.</p></dd></div>
        <div><dt><span className="card-detail-symbol"><Icon name="card" /></span>Annual and monthly fees</dt><dd className="card-detail-fees"><span><strong>{"$" + productFacts.cards.annualFeeDollars}</strong><span className="card-detail-note">Annual fee</span></span><span><strong>{"$" + productFacts.cards.monthlyFeeDollars}</strong><span className="card-detail-note">Monthly fee</span></span></dd></div>
        <div className="card-detail-repayment"><dt><span className="card-detail-symbol"><Icon name="document" /></span>Repayment</dt><dd><strong>{productFacts.cards.repayment}</strong><span className="card-detail-note">Repay your full statement balance. Earlier or daily payments are optional.</span><p>Your security deposit does not replace your monthly payment.</p></dd></div>
      </dl>
      <p className="card-details-disclosure">Final eligibility, credit limits, other charges and terms for returning your deposit will be provided before applications open.</p>
    </section>
    <section className="page-container wallet-credit-section" id="secured-credit" aria-labelledby="wallet-credit-title">
      <div className="consumer-section-heading"><div><h2 id="wallet-credit-title">How secured credit works.</h2></div><p>Your deposit backs the account. Repay purchases separately.</p></div>
      <SecuredCreditArt />
    </section>
    <section className="wallet-guide-section" id="wallets" aria-labelledby="wallet-guide-title"><div className="page-container wallet-guide-grid">
      <div className="wallet-guide-copy"><p className="eyebrow">From card to wallet</p><h2 id="wallet-guide-title">Preview the wallet experience.</h2><p>See the typical steps for Apple Wallet and Google Wallet. Applications are not open yet.</p><p className="wallet-guide-note">Follow the instructions from your wallet app and card issuer. Availability depends on your card, device and region.</p><p className="wallet-guide-contact"><CardContactLink className="consumer-text-link" /></p><p className="wallet-guide-note">Email Ledgix with questions about the card. Inquiries do not submit an application or subscribe you to launch updates.</p></div>
      <WalletGuide><WalletCardArt /></WalletGuide>
    </div></section>
    <section className="page-container public-section public-faq-section" aria-labelledby="card-questions-title">
      <div><p className="eyebrow">Before launch</p><h2 id="card-questions-title">Credit card questions.</h2><Link href="/help#cards" className="consumer-text-link">Credit card help<Icon name="arrow" /></Link></div>
      <div className="public-questions">
        <details><summary>Can I apply for the Ledgix Digital Wallet Card now?<span aria-hidden="true">+</span></summary><p>Applications are not open yet. Contact Ledgix with questions about the card. An inquiry does not submit an application or subscribe you to launch updates.</p></details>
        <details><summary>How does the security deposit work?<span aria-hidden="true">+</span></summary><p>The minimum security deposit is ${productFacts.cards.minimumDepositDollars}. It backs your credit account; it does not pay for purchases. The card agreement will explain credit limits and when and under what conditions your deposit can be returned. These terms will be provided before applications open.</p></details>
        <details><summary>What fees and repayments apply?<span aria-hidden="true">+</span></summary><p>The annual fee is ${productFacts.cards.annualFeeDollars}, and the monthly fee is ${productFacts.cards.monthlyFeeDollars}. Repay your full statement balance each month. Earlier or daily payments are optional. Your security deposit does not replace your monthly payment. Other charges and final terms will be provided before applications open.</p></details>
        <details><summary>Can I use Ledgix with Apple Wallet or Google Wallet?<span aria-hidden="true">+</span></summary><p>When the card service launches, eligible cards can be added to Apple Wallet or Google Wallet for purchases at participating stores, in apps and online. Availability depends on your card, device and region; wallet and merchant acceptance requirements apply. <a href="#wallets">Preview the wallet experience</a>.</p></details>
        <details><summary>What if I lose my phone?<span aria-hidden="true">+</span></summary><p>Use Apple Find My or Google Find Hub to secure your device. Contact Ledgix promptly about your card and any unrecognized purchases.</p></details>
        <details><summary>Where will I manage my card account?<span aria-hidden="true">+</span></summary><p>You’ll manage your card account and get support through Ledgix when the service launches.</p></details>
      </div>
    </section>
  </div></Shell>;
}
