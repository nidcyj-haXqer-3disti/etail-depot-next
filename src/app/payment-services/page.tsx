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
import "@/ui/public-site.css";

export const metadata = publicPageMetadata("/payment-services");
export default function PaymentServicesPage() {
  return <Shell><PublicPageStructuredData path="/payment-services" /><div className="consumer-page consumer-product consumer-payments">
    <PaymentExampleProvider>
    <ConsumerHero product service="payments" title={<>Accept payments.<br /><span>Your way.</span></>}
      description="Turn a conversation, a scan or a click into a card payment. Add Dispute readiness to help customers recognize purchases and banks answer questions."
      actions={<><PaymentPortalLink>Get started with Trolleys</PaymentPortalLink><a className="consumer-text-link" href="#fees">View pricing<Icon name="arrow" /></a></>}
      visual={<PaymentJourneyArt />}
    />
    <PaymentExperience />
    </PaymentExampleProvider>
    <section className="public-section page-container public-faq-section" aria-labelledby="payment-questions-title">
      <div><h2 id="payment-questions-title">Good to know.</h2><Link href="/help#payments" className="consumer-text-link">Payment help<Icon name="arrow" /></Link></div>
      <div className="public-questions">
        <details><summary>How do I get started?<span aria-hidden="true">+</span></summary><p>Apply with Trolleys. Once approved and set up, create and share payment requests from your Trolleys account. You manage your payments there, with no separate Etail Depot login.</p></details>
        <details id="payouts"><summary>When will I receive my money?<span aria-hidden="true">+</span></summary><p>Payment confirmation, available funds and bank arrival are separate steps. Your account’s payout schedule applies; fees, refunds, disputes and holds affect the amount available. First payouts, reviews, reserves and bank holidays can affect timing.</p></details>
        <details><summary>How do refunds and disputes work?<span aria-hidden="true">+</span></summary><p>Manage the original payment in Trolleys. Refunds reduce funds available for payout; original processing and currency-conversion fees are not returned. For disputes, check the response deadline and provide the requested records.</p></details>
        <details><summary>Does Dispute readiness cover every dispute?<span aria-hidden="true">+</span></summary><p>Coverage depends on the payment, participating bank and available data. Order Insight does not guarantee a dispute outcome. Automatic refund programs and managed chargeback responses are separate services.</p></details>
      </div>
    </section>
  </div></Shell>;
}
