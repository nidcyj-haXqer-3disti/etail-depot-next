import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { Shell } from "@/ui/shell";
import { PaymentJourneyArt } from "@/ui/payment-journey-art";
import { PaymentExperience } from "@/ui/payment-experience";
import { PaymentExampleProvider } from "@/ui/payment-example-context";
import { PaymentPortalLink } from "@/ui/service-entry";
import { ConsumerHero } from "@/ui/consumer-layout";
import { Icon } from "@/ui/icon";
import { productFacts } from "@/shared/product-facts";
import "@/ui/public-site.css";
import "@/ui/payment-page.css";

export const metadata = publicPageMetadata("/payment-acceptance-service");
export default function PaymentServicesPage() {
  return <Shell><PublicPageStructuredData path="/payment-acceptance-service" /><div className="consumer-page consumer-product consumer-payments">
    <PaymentExampleProvider>
    <ConsumerHero product service="payments" title={<>Create. Share.<br /><span>Get paid.</span></>}
      description="Sell goods, services or information. Create a payment request, then share it wherever your customers are."
      actions={<><PaymentPortalLink>Continue to Trolleys</PaymentPortalLink><a className="consumer-text-link" href="#fees">View pricing<Icon name="arrow" /></a></>}
      note={<p className="payment-hero-price"><strong>{productFacts.payments.cardRateLabel}</strong> per successful domestic online card payment.<br />No monthly fee. Create and share included.</p>}
      visual={<PaymentJourneyArt />}
    />
    <PaymentExperience />
    </PaymentExampleProvider>
    <section className="public-section page-container public-faq-section" aria-labelledby="payment-questions-title">
      <div><p className="eyebrow">Before you start</p><h2 id="payment-questions-title">Good to know.</h2><Link href="/help#payments" className="consumer-text-link">Payment acceptance help<Icon name="arrow" /></Link></div>
      <div className="public-questions">
        <details><summary>How do I get started?<span aria-hidden="true">+</span></summary><p>Apply with Trolleys. Once approved and set up, create payment requests and manage payments from your account.</p></details>
        <details><summary>What can I request payment for?<span aria-hidden="true">+</span></summary><p>Goods can include physical products and orders. Services can include appointments and project work. Information can include research, analysis or advice delivered in a report, briefing or consultation. Make clear what the customer will receive, when it will be delivered and any access conditions. Business eligibility and account approval apply.</p></details>
        <details><summary>How can I share a payment request?<span aria-hidden="true">+</span></summary><p>Copy the payment link into a text message, email, social post or direct message. Add it to a link or button on your website, or display its QR code on a sign or printed material. Each takes the customer to the same online payment page. Sharing a link by text does not include a messaging subscription.</p></details>
        <details id="payouts"><summary>When will I receive my money?<span aria-hidden="true">+</span></summary><p>Payment confirmation, available funds and bank arrival are separate steps. Your account’s payout schedule applies; fees, refunds, disputes and holds affect the amount available. First payouts, reviews, reserves and bank holidays can affect timing.</p></details>
        <details id="refunds-and-disputes"><summary>How do refunds and disputes work?<span aria-hidden="true">+</span></summary><p>Manage the original payment in Trolleys. Refunds reduce funds available for payout; original processing and currency conversion fees are not returned. For disputes, check the response deadline and provide the requested records.</p></details>
        <details><summary>Does Clarity prevent every dispute?<span aria-hidden="true">+</span></summary><p>No. Eligibility depends on the payment, participating bank and available data. Order Insight does not guarantee a dispute outcome. Automatic refund programs and managed chargeback responses are separate services.</p></details>
      </div>
    </section>
  </div></Shell>;
}
