import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { hostedServices } from "@/shared/hosted-services";
import { Shell } from "@/ui/shell";
import { PaymentChannelPreview } from "@/ui/payment-channel-preview";
import { PaymentJourneyArt } from "@/ui/payment-journey-art";
import { PaymentUseCases } from "@/ui/product-use-cases";
import { PaymentPortalLink } from "@/ui/service-entry";
import { ConsumerHero, ConsumerClosing } from "@/ui/consumer-layout";

export const metadata = publicPageMetadata("/payment-services");
export default function PaymentServicesPage() {
  return <Shell><PublicPageStructuredData path="/payment-services" /><div className="consumer-page consumer-product consumer-payments">
    <ConsumerHero product service="payments" title={<>Accept payments.<br /><span>Your way.</span></>}
      description="Create a payment request and share it by text, email, invoice or QR code. Your customer reviews the amount and pays by card."
      actions={<PaymentPortalLink />}
      note={<div className="consumer-product-note">Continue at {hostedServices.payments.portalDomain} to get started.</div>}
      visual={<PaymentJourneyArt />}
    />
    <PaymentUseCases />
    <section className="page-container consumer-product-section" id="payment-channels" aria-labelledby="payment-channels-title">
      <div className="consumer-section-heading"><div><p className="eyebrow">Payment links</p><h2 id="payment-channels-title">One link.<br /><span>Seven ways to share.</span></h2></div><p>Choose an option to see a payment example.</p></div><PaymentChannelPreview />
    </section>
    <ConsumerClosing eyebrow="Get started" title={<>Your payments.<br /><span>One place to manage them.</span></>} description="Visit Trolleys to apply for payment services."><PaymentPortalLink /></ConsumerClosing>
  </div></Shell>;
}
