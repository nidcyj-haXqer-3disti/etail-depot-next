import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { cardProduct } from "@/shared/card-product";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { CardContactLink } from "@/ui/service-entry";
import { WalletCardArt } from "@/ui/wallet-card-art";
import { ConsumerHero } from "@/ui/consumer-layout";
import "@/ui/public-site.css";
import "@/ui/card-services.css";

export const metadata = publicPageMetadata("/card-services");
export default function CardServicesPage() {
  return <Shell><PublicPageStructuredData path="/card-services" /><div className="consumer-page consumer-product consumer-cards">
    <ConsumerHero product service="cards" productLabel={`Ledgix ${cardProduct.name}`} title={<>Secured credit. <br /><span>Made for your wallet.</span></>}
      description={<>A virtual {cardProduct.creditType} for Apple Wallet and Google Wallet. Pay in stores and online where supported.</>}
      actions={<CardContactLink />}
      note={<div className="consumer-product-note">Applications are not open yet.</div>}
      visual={<WalletCardArt variant="preview" />}
    />
    <section className="page-container wallet-credit-section" aria-labelledby="wallet-credit-title">
      <div className="consumer-section-heading"><div><p className="eyebrow">The account behind your card</p><h2 id="wallet-credit-title">How secured credit works.</h2></div></div>
      <ol className="wallet-credit-steps">
        <li><span className="wallet-credit-number" aria-hidden="true">01</span><h3>A security deposit</h3><p>Your deposit backs the credit account. It stays separate from your purchase balance and repayments.</p></li>
        <li><span className="wallet-credit-number" aria-hidden="true">02</span><h3>Purchases on credit</h3><p>Use your card where supported. Purchases create a balance on your card account.</p></li>
        <li><span className="wallet-credit-number" aria-hidden="true">03</span><h3>Separate repayment</h3><p>Repay your purchase balance under your card agreement. Adding a security deposit does not repay it.</p></li>
      </ol>
    </section>
    <section className="wallet-guide-section" id="wallets" aria-labelledby="wallet-guide-title"><div className="page-container wallet-guide-grid">
      <div className="wallet-guide-copy"><p className="eyebrow">On your phone</p><h2 id="wallet-guide-title">Set up your wallet.</h2><p>Choose your wallet to see how to add a card, complete verification and pay.</p><p className="wallet-guide-note">Follow your wallet app and card issuer’s instructions. Availability depends on your card, device and region.</p></div>
      <WalletCardArt />
    </div></section>
    <section className="page-container public-section public-faq-section" aria-labelledby="card-questions-title">
      <div><p className="eyebrow">Before you get started</p><h2 id="card-questions-title">Card questions.</h2><Link href="/help#cards" className="consumer-text-link">More card help<Icon name="arrow" /></Link></div>
      <div className="public-questions">
        <details><summary>Can I apply now?<span aria-hidden="true">+</span></summary><p>Ledgix {cardProduct.name} is coming soon. Applications are not open yet. Contact Ledgix if you have a question about the card.</p></details>
        <details><summary>Where can I use the card?<span aria-hidden="true">+</span></summary><p>Use your card through Apple Wallet or Google Wallet at participating stores, in apps and online. Card, wallet and merchant acceptance requirements apply.</p></details>
        <details><summary>Where will I manage my card account?<span aria-hidden="true">+</span></summary><p>You’ll manage your card account and get support through Ledgix when the service launches.</p></details>
      </div>
    </section>
  </div></Shell>;
}
