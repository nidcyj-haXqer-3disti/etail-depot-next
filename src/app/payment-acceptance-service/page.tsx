import Link from "next/link";
import { customerJourneys } from "@/modules/public-site/customer-journeys";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { productFacts } from "@/shared/product-facts";
import { Shell } from "@/ui/shell";
import { ConsumerHero } from "@/ui/consumer-layout";
import { MerchantCheckoutArt } from "@/ui/service-blueprint-art";
import { ConsumerNetworks } from "@/ui/consumer-layout";
import { PaymentLifecycleArt } from "@/ui/payment-lifecycle-art";
import { PaymentOffer } from "@/ui/payment-offer";
import { PaymentPortalLink } from "@/ui/service-entry";
import { Icon } from "@/ui/icon";
import { ServiceSectionNav } from "@/ui/service-section-nav";
import "@/ui/public-site.css";
import "@/ui/payment-page.css";
import "@/ui/service-blueprint.css";

export const metadata = publicPageMetadata("/payment-acceptance-service");

export default function PaymentServicesPage() {
  return <Shell quietAccess>
    <PublicPageStructuredData path="/payment-acceptance-service" />
    <div className="consumer-page consumer-product consumer-payments service-blueprint">
      <ServiceSectionNav title="Merchant services" className="payment-section-nav" links={[
        { href: "#payment-operations", label: "Payment operations" },
        { href: "#fees", label: "Pricing" },
        { href: "#payment-questions-title", label: "Questions" },
      ]} />
      <ConsumerHero product service="payments" productLabel="Merchant services"
        title={<>Online payments.<br /><span>From checkout to payout.</span></>}
        description="Accept online card and ACH payments for your US business. Manage transactions, refunds and disputes, and match payouts to your bank statement."
        actions={<PaymentPortalLink>Apply for a merchant account</PaymentPortalLink>}
        note={<p className="payment-hero-price"><strong>{productFacts.payments.cardRateLabel}</strong> per successful domestic online card payment.<br />No monthly fee. ACH pricing is separate.<span className="payment-hero-handoff">Applications open at Trolleys, an Etail Depot service. Account approval and setup apply.</span></p>}
        visual={<MerchantCheckoutArt />}
      />

      <div className="bp-method-band"><div className="page-container">
        <span id="customer-checkout" className="payment-legacy-anchor" aria-hidden="true" />
        <span id="payment-channels" className="payment-legacy-anchor" aria-hidden="true" />
        <span id="request-details" className="payment-legacy-anchor" aria-hidden="true" />
        <ConsumerNetworks />
      </div></div>

        <section className="payment-operations-section" id="payment-operations" aria-labelledby="payment-operations-title">
          <div className="page-container">
            <div className="consumer-section-heading">
              <h2 id="payment-operations-title">From payment<br /><span>to bank deposit.</span></h2>
              <p>Follow each payment through processing, account for fees and adjustments, then match the payout to your bank statement.</p>
            </div>
            <div className="bp-operations-layout">
              <ol className="payment-operations-grid payment-funding-steps" aria-label="From payment to bank deposit" role="list">
                <li className="payment-operation" id="payment-records">
                  <div className="payment-operation-heading"><span className="payment-step-number" aria-hidden="true">1</span><h3>Capture</h3></div>
                  <div className="payment-operation-content">
                    <p>Confirm the approved payment has been submitted for processing. Check its status before fulfilling the order.</p>
                    <details className="payment-operation-details">
                      <summary>If the payment result is unclear<span aria-hidden="true" /></summary>
                      <p>Check the existing attempt before trying again. A timeout does not establish that the payment failed, and a customer screenshot alone does not confirm payment. Contact account support if the result is still unclear.</p>
                    </details>
                  </div>
                </li>
                <li className="payment-operation">
                  <div className="payment-operation-heading"><span className="payment-step-number" aria-hidden="true">2</span><h3>Settlement</h3></div>
                  <div className="payment-operation-content">
                    <p>Track the payment through settlement. Settlement and arrival in your bank account are separate.</p>
                  </div>
                </li>
                <li className="payment-operation">
                  <div className="payment-operation-heading"><span className="payment-step-number" aria-hidden="true">3</span><h3>Payout calculation</h3></div>
                  <div className="payment-operation-content">
                    <p>See how settled payments, applicable fees, refunds and chargeback adjustments determine the payout amount. A payout may combine several payments.</p>
                  </div>
                </li>
                <li className="payment-operation payment-to-bank" id="payouts" aria-labelledby="payment-to-bank-title">
                  <div className="payment-operation-heading"><span className="payment-step-number" aria-hidden="true">4</span><h3 id="payment-to-bank-title">Bank deposit</h3></div>
                  <div className="payment-operation-content">
                    <p>Check the payout status and match the deposit to your bank statement.</p>
                    <details className="payment-operation-details">
                      <summary>What affects payout timing?<span aria-hidden="true" /></summary>
                      <p>Your account’s payout schedule applies. Payment confirmation, available funds and bank arrival are separate. First payouts, reviews, holds, reserves and bank holidays can affect your payout schedule.</p>
                    </details>
                  </div>
                </li>
              </ol>
              <div className="bp-operations-art"><PaymentLifecycleArt variant="merchant" /></div>
            </div>
            <div className="payment-aftercare" id="refunds-and-disputes" role="group" aria-labelledby="payment-aftercare-title">
              <span id="dispute-readiness" className="payment-legacy-anchor" aria-hidden="true" />
              <span id="sale-records" className="payment-legacy-anchor" aria-hidden="true" />
              <div className="payment-aftercare-heading">
                <h3 id="payment-aftercare-title">Refunds and disputes</h3>
                <p>Refunds and chargebacks can affect later payouts, including after the original payment has been deposited.</p>
              </div>
              <div className="payment-aftercare-grid">
                <details className="payment-operation-details payment-support-detail">
                  <summary>Manage a refund<span aria-hidden="true" /></summary>
                  <div className="payment-support-content">
                    <p>Issue a refund from the original transaction and track its status. Before settlement, a void or authorization reversal may be appropriate.</p>
                    <p className="payment-operation-note">Refunds reduce funds available for payout. Available actions depend on the payment status and your account permissions.</p>
                  </div>
                </details>
                <details className="payment-operation-details payment-support-detail">
                  <summary>Respond to a dispute<span aria-hidden="true" /></summary>
                  <div className="payment-support-content">
                    <p>Review the reason and response deadline, provide the requested records, and track the case through resolution.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>
      <PaymentOffer />

      <section className="public-section page-container public-faq-section" aria-labelledby="payment-questions-title">
        <div className="service-questions-intro">
          <p className="eyebrow">Account setup</p>
          <h2 id="payment-questions-title">Your merchant account.</h2>
          <Link href={customerJourneys.merchant.documentation} className="consumer-text-link">{customerJourneys.merchant.documentationLabel}<Icon name="arrow" /></Link>
        </div>
        <div className="payment-faq-content">
          <div className="public-questions">
            <details><summary>Can my business apply?<span aria-hidden="true">+</span></summary><p>US businesses can apply to accept payments in USD for goods, services or information. We review each business before approving an account.</p></details>
            <details><summary>How do I open a merchant account?<span aria-hidden="true">+</span></summary><p>Apply through Trolleys, the merchant account service operated by Etail Depot US, Inc. Review your fees, payout schedule and account terms before accepting the agreement. You can start accepting payments once your account is approved and set up.</p></details>
            <details><summary>Can my customers pay by ACH?<span aria-hidden="true">+</span></summary><p>Yes. Check the ACH fees, timing and options for your account before you start. The prices and calculator on this page are for card payments.</p></details>
            <details><summary>Which payment methods can I offer at checkout?<span aria-hidden="true">+</span></summary><p>We’ll confirm the checkout and payment methods available for your account during setup. Digital wallet payments also depend on your customer’s card and device.</p></details>
          </div>
        </div>
      </section>
    </div>
  </Shell>;
}
