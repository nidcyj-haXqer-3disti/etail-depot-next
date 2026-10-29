import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { cardProduct } from "@/shared/card-product";
import { productFacts } from "@/shared/product-facts";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { CardContactLink } from "@/ui/service-entry";
import { CardProgramArt } from "@/ui/service-blueprint-art";
import { WalletCardArt } from "@/ui/wallet-card-art";
import { WalletGuide } from "@/ui/wallet-guide";
import { SecuredCreditArt } from "@/ui/secured-credit-art";
import { ConsumerHero } from "@/ui/consumer-layout";
import { ServiceSectionNav } from "@/ui/service-section-nav";
import "@/ui/public-site.css";
import "@/ui/card-services.css";
import "@/ui/service-blueprint.css";

export const metadata = publicPageMetadata("/credit-card-services");
export default function CardServicesPage() {
  return <Shell quietAccess><PublicPageStructuredData path="/credit-card-services" /><div className="consumer-page consumer-product consumer-cards service-blueprint">
    <ServiceSectionNav title="Card services" links={[
      { href: "#card-details", label: "Card details" },
      { href: "#secured-credit", label: "How it works" },
      { href: "#wallets", label: "Digital wallets" },
      { href: "#card-questions-title", label: "Questions" },
    ]} />
    <ConsumerHero product service="cards" productLabel="Card services" title={<>Secured credit. <br /><span>Made for your wallet.</span></>}
      description={<>Ledgix is a virtual {cardProduct.creditType} for Apple&nbsp;Wallet and Google&nbsp;Wallet, where supported.</>}
      actions={<CardContactLink />}
      note={<div className="consumer-product-note">Applications are not open yet. Inquiries do not submit an application or subscribe you to launch updates.</div>}
      visual={<CardProgramArt />}
    />

    <section className="page-container card-details-section" id="card-details" aria-labelledby="card-details-title">
      <div className="consumer-section-heading"><div><h2 id="card-details-title">Card fees, deposit and repayment.</h2></div></div>
      <dl className="card-details-grid">
        <div className="card-detail-deposit"><dt><span className="card-detail-symbol"><Icon name="lock" /></span>Security deposit</dt><dd><strong>{"$" + productFacts.cards.minimumDepositDollars}</strong><span className="card-detail-note">Minimum deposit</span><p>Backs your credit account. It does not pay for purchases.</p></dd></div>
        <div><dt><span className="card-detail-symbol"><Icon name="card" /></span>Annual and monthly fees</dt><dd className="card-detail-fees"><span><strong>{"$" + productFacts.cards.annualFeeDollars}</strong><span className="card-detail-note">Annual fee</span></span><span><strong>{"$" + productFacts.cards.monthlyFeeDollars}</strong><span className="card-detail-note">Monthly fee</span></span></dd></div>
        <div className="card-detail-repayment"><dt><span className="card-detail-symbol"><Icon name="document" /></span>Repayment</dt><dd><strong>{productFacts.cards.repayment}</strong><span className="card-detail-note">Repay your full statement balance. Earlier or daily payments are optional.</span></dd></div>
      </dl>
      <p className="card-details-disclosure">Final eligibility, credit limits, other charges and terms for returning your deposit will be provided before applications open.</p>
    </section>
    <section className="page-container wallet-credit-section" id="secured-credit" aria-labelledby="wallet-credit-title">
      <div className="consumer-section-heading"><div><h2 id="wallet-credit-title">How secured credit works.</h2></div><p>A deposit backs your credit account. Purchases create a separate balance that you repay each month.</p></div>
      <SecuredCreditArt />
    </section>
    <section className="wallet-guide-section" id="wallets" aria-labelledby="wallet-guide-title"><div className="page-container wallet-guide-grid">
      <div className="wallet-guide-copy"><p className="eyebrow">Digital wallets</p><h2 id="wallet-guide-title">Add a card to your wallet.</h2><p>See how an eligible card is added to Apple Wallet or Google Wallet. Applications are not open yet.</p><p className="wallet-guide-note">Follow the instructions from your wallet app and card issuer. Availability depends on your card, device and region.</p></div>
      <WalletGuide><WalletCardArt /></WalletGuide>
    </div></section>
    <section className="page-container public-section public-faq-section" aria-labelledby="card-questions-title">
      <div className="card-questions-intro" id="card-contact-title"><h2 id="card-questions-title">Questions about<br /> the card?</h2><p>Contact Ledgix about the security deposit, repayment or wallet experience.</p><CardContactLink /></div>
      <div className="public-questions">
        <details><summary>Can I apply for the card yet?<span aria-hidden="true">+</span></summary><p>Applications are not open yet. You can contact Ledgix with questions, but an inquiry isn’t an application and won’t sign you up for launch updates.</p></details>
        <details><summary>When can I get my deposit back?<span aria-hidden="true">+</span></summary><p>The card agreement will set out when you can get your deposit back and any conditions. You’ll receive those terms, along with eligibility and credit limits, before applications open.</p></details>
        <details><summary>Can I pay my balance early?<span aria-hidden="true">+</span></summary><p>Yes. You can pay early or make daily payments. You still need to repay your full statement balance each month; your deposit does not cover that payment.</p></details>
        <details><summary>Can I add the card to Apple Wallet or Google Wallet?<span aria-hidden="true">+</span></summary><p>Once the service launches, eligible cards can be added to Apple Wallet or Google Wallet. You can use them at participating stores, in apps and online, where your card, wallet, device and region are supported.</p></details>
        <details><summary>What if I lose my phone?<span aria-hidden="true">+</span></summary><p>Use Apple Find My or Google Find Hub to secure your device. Contact Ledgix promptly about your card and any unrecognized purchases.</p></details>
        <details><summary>Where will I manage my card?<span aria-hidden="true">+</span></summary><p>You’ll manage your credit card account and get support through Ledgix when the service launches.</p></details>
      </div>
    </section>
  </div></Shell>;
}
