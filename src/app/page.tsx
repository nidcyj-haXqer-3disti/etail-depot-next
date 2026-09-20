import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { PublicQuestions } from "@/ui/public-site";
import { PaymentArtwork, ServiceStatus } from "@/ui/service-entry";
import { WalletCardArt } from "@/ui/wallet-card-art";
import { PaymentHighlights } from "@/ui/payment-highlights";
import "@/ui/public-site.css";
import { ConsumerHero, ConsumerNetworks } from "@/ui/consumer-layout";

export const metadata = publicPageMetadata("/");

export default function HomePage() {
  return <Shell>
    <PublicPageStructuredData path="/" />
    <div className="consumer-page consumer-home">
      <ConsumerHero service="payments" title={<>Get paid.<br /><span>Keep going.</span></>}
        description="Payment links for your next booking, invoice or sale. Create a request, share it your way and let your customer pay by card."
        visual={<PaymentArtwork />}
        footer={<ConsumerNetworks />}
      />

      <section className="consumer-channels page-container" id="payment-channels" aria-labelledby="channels-title">
        <div className="consumer-section-heading"><div><p className="eyebrow">More ways to get paid</p><h2 id="channels-title">Made for the way<br /><span>you do business.</span></h2></div><Link href="/payment-services#payment-channels" className="consumer-text-link consumer-channel-heading-link">See ways to get paid<Icon name="arrow" /></Link></div>
        <PaymentHighlights />
      </section>

      <section className="consumer-card-section" aria-labelledby="ledgix-title">
        <div className="page-container consumer-card-grid">
          <div className="consumer-card-visual"><WalletCardArt compact /></div>
          <div className="consumer-card-copy">
            <div className="consumer-product-eyebrow"><p className="eyebrow">Ledgix · Cards</p><ServiceStatus service="cards" /></div>
            <h2 id="ledgix-title">Your everyday card.<br /><span>Made for your wallet.</span></h2>
            <p>Meet the Ledgix Digital Wallet Card. A virtual Visa secured credit card for your family or business, with Apple Wallet and Google Wallet support.</p>
            <Link href="/card-services" className="consumer-text-link">Explore Digital Wallet Card<Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      <section className="public-section page-container public-faq-section" aria-labelledby="questions-title">
        <div><p className="eyebrow">A little clarity</p><h2 id="questions-title">Good questions.<br />{" "}<span>Clear answers.</span></h2><Link href="/help" className="consumer-text-link">Visit the help center<Icon name="arrow" /></Link></div><PublicQuestions />
      </section>
    </div>
  </Shell>;
}
