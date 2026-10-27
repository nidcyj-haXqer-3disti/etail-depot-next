import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { PublicQuestions } from "@/ui/public-site";
import { HomeBrandArt } from "@/ui/home-brand-art";
import { WalletCardArt } from "@/ui/wallet-card-art";
import { serviceLabels } from "@/shared/service-language";
import { productFacts } from "@/shared/product-facts";
import { ConsumerHero, ConsumerNetworks } from "@/ui/consumer-layout";
import "@/ui/public-site.css";
import "@/ui/service-home.css";

export const metadata = publicPageMetadata("/");

const serviceAreas = [
  { title: "Onboarding", description: "Submit your business details for review. Once approved, complete your account setup before accepting payments." },
  { title: "Checkout", description: "Accept online card and ACH payments with the methods enabled for your account." },
  { title: "Payout", description: "Match payments, fees and adjustments to the funds paid into your bank account." },
];

export default function HomePage() {
  return <Shell>
    <PublicPageStructuredData path="/" />
    <div className="consumer-page consumer-home service-home">
      <ConsumerHero service="payments" productLabel={null}
        title={<>Payment processing.<br /><span>Built around business.</span></>}
        description="Merchant services for online businesses and the software platforms that serve them. Connect account setup, checkout and payouts."
        actions={<><Link href="/payment-acceptance-service" className="button primary">Merchant services<Icon name="arrow" /></Link><Link href="/software-partners" className="consumer-text-link">For software platforms<Icon name="arrow" /></Link></>}
        visual={<HomeBrandArt />}
      />

      <section className="page-container service-home-lifecycle" id="payment-channels" aria-labelledby="service-lifecycle-title">
        <div className="service-home-section-intro">
          <p className="eyebrow">{serviceLabels.payments}</p>
          <div className="consumer-section-heading"><h2 id="service-lifecycle-title">From onboarding<br />to payout.</h2></div>
        </div>
        <ol className="service-home-areas" role="list">{serviceAreas.map((area, index) => <li key={area.title}>
          <div className="service-home-step-heading"><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{area.title}</h3></div><p>{area.description}</p>
        </li>)}</ol>
        <Link href="/payment-acceptance-service" className="consumer-text-link service-home-section-link">Explore merchant services<Icon name="arrow" /></Link>
        <ConsumerNetworks />
      </section>

      <section className="consumer-card-section" aria-labelledby="ledgix-title">
        <div className="page-container consumer-card-grid">
          <div className="consumer-card-visual"><WalletCardArt compact variant="preview" /></div>
          <div className="consumer-card-copy">
            <div className="consumer-product-eyebrow"><p className="eyebrow">{serviceLabels.cards}</p></div>
            <h2 id="ledgix-title">Secured credit.<br /><span>Made for your wallet.</span></h2>
            <p><span data-nosnippet="">A virtual Visa secured credit card for Apple Wallet and Google Wallet.</span></p>
            <dl className="home-card-facts" data-nosnippet=""><div><dt>Minimum security deposit</dt><dd>${productFacts.cards.minimumDepositDollars}</dd></div><div><dt>Annual and monthly fees</dt><dd>$0</dd></div></dl>
            <Link href="/credit-card-services" className="consumer-text-link">Explore card services<Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      <section className="home-use-cases" aria-labelledby="use-cases-title">
        <div className="page-container">
          <div className="home-section-heading">
            <p className="eyebrow">Use cases</p>
            <h2 id="use-cases-title">For your business.<br /><span>For your platform.</span></h2>
          </div>
          <div className="home-audiences">
            <article aria-labelledby="online-businesses-title">
              <div className="home-audience-symbol" aria-hidden="true"><Icon name="business" /></div>
              <h3 id="online-businesses-title">Online businesses</h3>
              <p>Connect the customer’s purchase to checkout, a payment record and your bank deposit.</p>
              <Link href="/online-businesses" className="consumer-text-link">Explore online payments<Icon name="arrow" /></Link>
            </article>
            <article aria-labelledby="software-partners-title">
              <div className="home-audience-symbol" aria-hidden="true"><Icon name="layers" /></div>
              <h3 id="software-partners-title">Software platforms</h3>
              <p>Bring merchant onboarding, checkout and payment records into the software your merchants use. Plan the connection and responsibilities with our team.</p>
              <Link href="/software-partners" className="consumer-text-link">Explore platform payments<Icon name="arrow" /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="home-resources page-container" aria-labelledby="resources-title">
        <div className="home-section-heading">
          <p className="eyebrow">Documentation and Guides</p>
          <h2 id="resources-title">Implementation help.<br /><span>Industry references.</span></h2>
        </div>
        <div className="home-resource-grid">
          <article aria-labelledby="home-docs-title">
            <p className="home-resource-label">Documentation</p>
            <h3 id="home-docs-title">Set up your connection.</h3>
            <p>Follow account setup, checkout integration and payment operations. Understand the access, records and checks your connection needs.</p>
            <ul className="home-resource-outline" aria-label="Documentation topics">
              <li><span aria-hidden="true">01</span>Account setup</li>
              <li><span aria-hidden="true">02</span>Checkout and payment status</li>
              <li><span aria-hidden="true">03</span>Refunds, disputes and payouts</li>
            </ul>
            <Link href="/docs" className="consumer-text-link">Open documentation<Icon name="arrow" /></Link>
          </article>
          <article aria-labelledby="home-guides-title">
            <p className="home-resource-label">Guides</p>
            <h3 id="home-guides-title">Understand payment codes.</h3>
            <p>Look up payment codes and message types, with published definitions, source releases and context for each edition.</p>
            <dl className="home-reference-outline">
              <>
                <div><dt>ISO 20022</dt><dd>External code sets and definitions</dd></div>
                <div><dt>ISO 8583</dt><dd>Card payment codes and messages</dd></div>
              </>
            </dl>
            <Link href="/guides" className="consumer-text-link">Browse Guides<Icon name="arrow" /></Link>
          </article>
        </div>
      </section>

      <section className="public-section page-container public-faq-section" aria-labelledby="questions-title">
        <div><p className="eyebrow">Help center</p><h2 id="questions-title">Questions about our services.</h2><Link href="/help" className="consumer-text-link">Visit the help center<Icon name="arrow" /></Link></div><PublicQuestions />
      </section>
    </div>
  </Shell>;
}
