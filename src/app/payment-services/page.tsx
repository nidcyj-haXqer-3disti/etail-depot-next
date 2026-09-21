import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { saleRecordsOffer } from "@/shared/product-facts";
import { hostedServices } from "@/shared/hosted-services";
import { Shell } from "@/ui/shell";
import { PaymentJourneyArt } from "@/ui/payment-journey-art";
import { PaymentAftercare } from "@/ui/payment-offer";
import { PaymentExperience } from "@/ui/payment-experience";
import { PaymentExampleProvider } from "@/ui/payment-example-context";
import { PaymentPortalLink } from "@/ui/service-entry";
import { ConsumerHero } from "@/ui/consumer-layout";
import { Icon } from "@/ui/icon";
import "@/ui/public-site.css";

export const metadata = publicPageMetadata("/payment-services");
export default function PaymentServicesPage() {
  return <Shell><PublicPageStructuredData path="/payment-services" /><div className="consumer-page consumer-product consumer-payments">
    <PaymentExampleProvider>
    <ConsumerHero product service="payments" title={<>Accept payments.<br /><span>Your way.</span></>}
      description="Turn a text, a scan or a click into a card payment. Simple ways to get paid, with optional dispute readiness for what comes next."
      actions={<><PaymentPortalLink>Get started with Trolleys</PaymentPortalLink><a className="consumer-text-link" href="#fees">View pricing<Icon name="arrow" /></a></>}
      note={<div className="consumer-product-note">Continue to Trolleys to apply for payments.</div>}
      visual={<PaymentJourneyArt />}
    />
    <PaymentExperience />
    </PaymentExampleProvider>
    <PaymentAftercare />
    <section className="public-section page-container public-faq-section" aria-labelledby="payment-questions-title">
      <div><p className="eyebrow">Getting started</p><h2 id="payment-questions-title">A few things <br /><span>to know.</span></h2><Link href="/help#payments" className="consumer-text-link">Payment help<Icon name="arrow" /></Link></div>
      <div className="public-questions">
        <details><summary>How do I start accepting payments?<span aria-hidden="true">+</span></summary><p>Apply for payment services with Trolleys. Once your account is approved and set up, you can create a payment request and share it with your customer.</p></details>
        <details><summary>How does dispute readiness help my business?<span aria-hidden="true">+</span></summary><p>Trolleys uses Order Insight to connect supported purchase details with participating banks. That helps customers recognize payments and gives bank support teams more context. Eligible Visa online fraud disputes may be deflected when the required evidence is available. The optional Trolleys fee is {saleRecordsOffer.rateLabel} of eligible enrolled successful-payment volume, plus vendor fees and processing.</p></details>
        <details><summary>Does it cover every dispute?<span aria-hidden="true">+</span></summary><p>Coverage depends on the payment, participating bank and available data. Order Insight does not guarantee a dispute outcome. Automatic refund programs and managed chargeback responses are separate services.</p></details>
        <details><summary>Where do I manage my account?<span aria-hidden="true">+</span></summary><p>You set up and manage your payment account with Trolleys. There is no separate Etail Depot login to create.</p></details>
        <details><summary>How do refunds and disputes work?<span aria-hidden="true">+</span></summary><p>Find the original payment in Trolleys to review refund options or a dispute. Refunds reduce the funds available for payout, and the original processing fees are not returned. For a dispute, review the response deadline and provide the requested records. Contact the payments team if you need help.</p></details>
        <details><summary>Who can help with payment questions?<span aria-hidden="true">+</span></summary><p>Contact the payments team at <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a>.</p></details>
      </div>
    </section>
  </div></Shell>;
}
