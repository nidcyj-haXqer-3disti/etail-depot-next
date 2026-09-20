import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { cardProduct } from "@/shared/card-product";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { CardContactLink } from "@/ui/service-entry";
import { WalletCardArt } from "@/ui/wallet-card-art";
import { WalletUseCases } from "@/ui/product-use-cases";
import { ConsumerHero, ConsumerClosing } from "@/ui/consumer-layout";
import "@/ui/card-services.css";

export const metadata = publicPageMetadata("/card-services");
export default function CardServicesPage() {
  return <Shell><PublicPageStructuredData path="/card-services" /><div className="consumer-page consumer-product consumer-cards">
    <ConsumerHero product service="cards" title={<>Digital Wallet <br /><span>Card.</span></>}
      description={<>A virtual {cardProduct.creditType} for your family or business. Carry it on your phone. Pay in stores and online.</>}
      actions={<><CardContactLink /><Link href="/help#cards" className="consumer-text-link">Card questions<Icon name="arrow" /></Link></>}
      note={<div className="consumer-product-note">Applications are not open yet.</div>}
      visual={<WalletCardArt />}
    />
    <WalletUseCases />
    <section className="page-container consumer-product-section" id="wallets" aria-labelledby="wallet-options-title">
      <div className="consumer-section-heading"><div><p className="eyebrow">Made for your wallet</p><h2 id="wallet-options-title">Your card. <br /><span>A familiar way to pay.</span></h2></div><p>Bring Ledgix to the wallet you already use.</p></div>
      <div className="wallet-options-grid">
        <article><h3>Apple Wallet</h3><p>Add your card and use Apple Pay in stores, in apps and online.</p><span>On compatible Apple devices</span></article>
        <article><h3>Google Wallet</h3><p>Keep your card on your Android phone and tap to pay where Google Pay is accepted.</p><span>On compatible Android devices</span></article>
      </div>
      <p className="wallet-eligibility">Wallet availability and features depend on your device, location and card eligibility.</p>
    </section>
    <section className="wallet-credit-section" aria-labelledby="wallet-credit-title"><div className="page-container wallet-credit-grid">
      <div><p className="eyebrow">The account behind your card</p><h2 id="wallet-credit-title">Digital convenience. <br /><span>Secured credit.</span></h2><p>Your security deposit backs your credit account. Purchases create a balance to repay; your deposit stays separate from those repayments.</p></div>
      <div className="wallet-account-summary"><Icon name="lock" /><h3>Your account stays with Ledgix.</h3><p>Use your wallet to pay. Sign in to Ledgix for your card account, activity and support when the service launches.</p><p className="wallet-account-note">Eligibility, account controls and full product terms will be available at launch.</p></div>
    </div></section>
    <ConsumerClosing eyebrow="Stay in touch" title={<>Meet your next <br /><span>everyday card.</span></>}><CardContactLink /></ConsumerClosing>
  </div></Shell>;
}
