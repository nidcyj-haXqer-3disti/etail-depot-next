import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { Shell } from "@/ui/shell";
import { PaymentJourneyArt } from "@/ui/payment-journey-art";
import { PaymentExperience } from "@/ui/payment-experience";
import { PaymentGuides } from "@/ui/payment-guides";
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
      description="US businesses can accept credit and debit card payments online with Trolleys. Create a request for goods, services or information, then share a payment link or QR code with your customer."
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
        <details><summary>Who operates Trolleys?<span aria-hidden="true">+</span></summary><p>Trolleys is a trade name of Etail Depot US, Inc. Account setup and payment management take place at Trolleys.</p></details>
        <details><summary>What can I request payment for?<span aria-hidden="true">+</span></summary><p>Goods can include physical products and orders. Services can include appointments and project work. Information can include research, analysis or advice delivered in a report, briefing or consultation. Make clear what the customer will receive, when it will be delivered and any access conditions. Business eligibility and account approval apply.</p></details>
        <details><summary>How can I share a payment request?<span aria-hidden="true">+</span></summary><p>A payment link opens an online page where your customer can pay by card. Share it in a text message, email, social post or direct message without building a checkout into your own website. You can also add it to a website button or display its QR code on a sign or printed material. Each opens the same payment page. Sharing a link by text does not include a messaging subscription.</p></details>
        <details><summary>Can I accept ACH payments?<span aria-hidden="true">+</span></summary><p>Yes. Trolleys also supports ACH payments. Contact Trolleys for ACH fees, timing and the payment options available for your account. The prices and fee calculator on this page apply to card payments.</p></details>
        <details><summary>What should I compare when choosing a payment processing system?<span aria-hidden="true">+</span></summary><p>Compare how customers can pay, the full fee schedule, business eligibility, payout terms and support. Trolleys focuses on online card payments through requests shared by link or QR code. Account approval and setup are required. Read our <Link href="/guides/payment-processing-systems">guide to payment processing systems</Link>.</p></details>
        <details id="payouts"><summary>When will I receive my money?<span aria-hidden="true">+</span></summary><p>Payment confirmation, available funds and bank arrival are separate steps. Your account’s payout schedule applies; fees, refunds, disputes and holds affect the amount available. First payouts, reviews, reserves and bank holidays can affect timing.</p></details>
        <details><summary>What is a chargeback?<span aria-hidden="true">+</span></summary><p>A chargeback reverses a card payment through the card issuer’s dispute process. It differs from a refund your business initiates. If a dispute arrives, follow the response deadline and provide the requested records. <a href="#fees">Dispute fees</a> may apply. Our <Link href="/guides/what-is-a-chargeback">chargeback guide</Link> explains the process and which records can help.</p></details>
        <details id="refunds-and-disputes"><summary>How do refunds and disputes work?<span aria-hidden="true">+</span></summary><p>Manage the original payment in Trolleys. Refunds reduce funds available for payout; original processing and currency conversion fees are not returned. For disputes, check the response deadline and provide the requested records.</p></details>
        <details><summary>Does Clarity prevent every chargeback?<span aria-hidden="true">+</span></summary><p>No. Eligibility depends on the payment, participating bank and available data. Order Insight does not guarantee a dispute outcome. Automatic refund programs and services that respond to chargebacks for you are separate services.</p></details>
      </div>
    </section>
    <PaymentGuides showCta />
  </div></Shell>;
}
