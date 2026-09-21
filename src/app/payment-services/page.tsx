import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { hostedServices } from "@/shared/hosted-services";
import { Shell } from "@/ui/shell";
import { PaymentChannelPreview } from "@/ui/payment-channel-preview";
import { PaymentJourneyArt } from "@/ui/payment-journey-art";
import { PaymentUseCases } from "@/ui/product-use-cases";
import { PaymentPortalLink } from "@/ui/service-entry";
import { ConsumerHero } from "@/ui/consumer-layout";
import { Icon } from "@/ui/icon";
import "@/ui/public-site.css";

export const metadata = publicPageMetadata("/payment-services");
export default function PaymentServicesPage() {
  return <Shell><PublicPageStructuredData path="/payment-services" /><div className="consumer-page consumer-product consumer-payments">
    <ConsumerHero product service="payments" title={<>Accept payments.<br /><span>Your way.</span></>}
      description="Create a payment request and share it with your customer. They review the amount and pay by card."
      actions={<PaymentPortalLink>Get started with Trolleys</PaymentPortalLink>}
      note={<div className="consumer-product-note">Continue to Trolleys to apply.</div>}
      visual={<PaymentJourneyArt />}
    />
    <PaymentUseCases />
    <section className="page-container consumer-product-section" id="payment-channels" aria-labelledby="payment-channels-title">
      <div className="consumer-section-heading"><div><p className="eyebrow">Payment links</p><h2 id="payment-channels-title">One link.<br /><span>Seven ways to share.</span></h2></div><p>Send a link, add it to an invoice or display a QR code. Choose a format to see an example.</p></div><PaymentChannelPreview />
    </section>
    <section className="public-section page-container public-faq-section" aria-labelledby="payment-questions-title">
      <div><p className="eyebrow">Getting started</p><h2 id="payment-questions-title">A few things <br /><span>to know.</span></h2><Link href="/help#payments" className="consumer-text-link">Payment help<Icon name="arrow" /></Link></div>
      <div className="public-questions">
        <details><summary>How do I start accepting payments?<span aria-hidden="true">+</span></summary><p>Apply for payment services with Trolleys. Once your account is approved and set up, you can create a payment request and share it with your customer.</p></details>
        <details><summary>Where do I manage my account?<span aria-hidden="true">+</span></summary><p>You set up and manage your payment account with Trolleys. There is no separate Etail Depot login to create.</p></details>
        <details><summary>Who can help with payment questions?<span aria-hidden="true">+</span></summary><p>Contact the payments team at <a href={hostedServices.payments.contactHref}>{hostedServices.payments.email}</a>.</p></details>
      </div>
    </section>
  </div></Shell>;
}
