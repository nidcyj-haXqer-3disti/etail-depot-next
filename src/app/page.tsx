import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { PublicQuestions } from "@/ui/public-site";
import { PaymentArtwork, ServiceStatus } from "@/ui/service-entry";
import { WalletCardArt } from "@/ui/wallet-card-art";
import { PaymentHighlights } from "@/ui/payment-highlights";
import { serviceLabels } from "@/shared/service-language";
import { productFacts } from "@/shared/product-facts";
import "@/ui/public-site.css";
import { ConsumerHero, ConsumerNetworks } from "@/ui/consumer-layout";

export const metadata = publicPageMetadata("/");

export default function HomePage() {
  return <Shell>
    <PublicPageStructuredData path="/" />
    <div className="consumer-page consumer-home">
      <ConsumerHero service="payments" title={<>Get paid.<br /><span>Keep going.</span></>}
        description="Accept online card payments with Trolleys Two Step. Create a request for your sale, then share a link or QR code."
        actions={<Link href="/payment-acceptance-service" className="button primary">Explore payment acceptance<Icon name="arrow" /></Link>}
        visual={<PaymentArtwork />}
        footer={<ConsumerNetworks />}
      />

      <section className="consumer-channels page-container" id="payment-channels" aria-labelledby="channels-title">
        <div className="consumer-section-heading"><h2 id="channels-title">One payment link. More ways to get paid.</h2></div>
        <PaymentHighlights />
      </section>

      <section className="consumer-card-section" aria-labelledby="ledgix-title">
        <div className="page-container consumer-card-grid">
          <div className="consumer-card-visual"><WalletCardArt compact variant="preview" /></div>
          <div className="consumer-card-copy">
            <div className="consumer-product-eyebrow"><p className="eyebrow">Ledgix · {serviceLabels.cards}</p><ServiceStatus service="cards" /></div>
            <h2 id="ledgix-title">Secured credit.<br /><span>Made for your wallet.</span></h2>
            <p>A virtual Visa secured credit card for Apple Wallet and Google Wallet.</p>
            <p className="consumer-card-terms">A ${productFacts.cards.minimumDepositDollars} minimum security deposit backs your account. No annual or monthly fee. Repay your full statement balance each month.</p>
            <Link href="/credit-card-services" className="consumer-text-link">Explore the Ledgix credit card<Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      <section className="public-section page-container public-faq-section" aria-labelledby="questions-title">
        <div><h2 id="questions-title">Find your next step.</h2><Link href="/help" className="consumer-text-link">Visit the help center<Icon name="arrow" /></Link></div><PublicQuestions />
      </section>
    </div>
  </Shell>;
}
