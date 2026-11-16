import Link from "next/link";
import { productFacts } from "@/shared/site/product-facts";
import { BlogArticlePage } from "./article-page";
import { stripeAlternativesArticle } from "./stripe-alternatives-content";
import s from "./blog.module.css";

const comparison = [
  ["Website checkout", "Stripe offers hosted and embedded Checkout pages, plus Elements for a customized payment interface.", "Trolleys uses Cybersource for gateway checkout. Choose the supported connection for your website and confirm the setup your account needs."],
  ["Payment links", "Stripe Payment Links provides a hosted payment page you can share by link or QR code.", "Pay by Link must be enabled for your merchant account. Confirm access first; payment links and QR payments have an additional charge."],
  ["Recurring payments", "Stripe supports subscription payment links. Review the applicable Billing pricing as well as payment processing fees.", "Trolleys supports recurring payments through Cybersource when enabled for your account. Confirm the setup and applicable fees for your subscription service."],
] as const;

export function StripeAlternativesPage() {
  return <BlogArticlePage article={stripeAlternativesArticle}>
    <p>If you are looking for an alternative to Stripe, start with the part of your current setup that needs to change. It might be checkout, account support, reporting or the terms under which your business can accept payments. Use that need to compare providers, rather than assuming a different name means a better fit. This comparison covers Stripe and Trolleys, an Etail Depot service.</p>
    <section id="payment-workflow" aria-labelledby="payment-workflow-title">
      <h2 id="payment-workflow-title">Start with how you sell</h2>
      <p>For an order agreed by email or over the phone, a payment link may cover the payment step. A QR code gives customers another way to open that online payment page. It does not, by itself, provide an inventory system or card reader.</p>
      <p>For an online store, check the connection your website needs. For subscriptions, check repeat charges, saved payment methods and what happens when a payment fails. List those requirements before comparing prices.</p>
      <p>Etail’s <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify</Link> and <Link href="/resources/woocommerce-gateway-integration" prefetch={false}>WooCommerce</Link> guides explain the platform setup. A custom website has a different integration path, described in <Link href="/developers/getting-started" prefetch={false}>Getting started</Link>.</p>
    </section>
    <section id="checkout-options" aria-labelledby="checkout-options-title">
      <h2 id="checkout-options-title">Compare checkout options</h2>
      <p>A shareable link, a website payment form and a subscription system solve different problems. Compare the option your customers will actually use.</p>
      <table className={s.comparison}>
        <caption>Checkout choices to confirm before selecting a provider</caption>
        <thead><tr><th scope="col">Your requirement</th><th scope="col">Stripe</th><th scope="col">Trolleys</th></tr></thead>
        <tbody>{comparison.map(([need, stripe, etail]) => <tr key={need}>
          <th scope="row">{need}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Stripe</span>{stripe}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Trolleys</span>{etail}</td>
        </tr>)}</tbody>
      </table>
      <p>For Trolleys payment links, account approval alone does not activate the feature. Ask us to confirm availability before planning your launch. See <Link href="/company/blog/how-to-create-a-payment-link" prefetch={false}>how to create and share a payment link</Link>.</p>
    </section>
    <section id="compare-pricing" aria-labelledby="compare-pricing-title">
      <h2 id="compare-pricing-title">Compare total costs</h2>
      <p>For US domestic online card payments, Stripe’s published standard rate is 2.9% + 30¢. Trolleys’ published base rate is {productFacts.payments.cardRateLabel}. The matching base rate does not mean that every payment or service costs the same.</p>
      <p>Stripe includes Payment Links and Checkout with standard payments pricing. Optional products, including Billing and Invoicing, have their own pricing. Trolleys charges an additional fee for successful payment-link and QR payments; see <Link href="/pricing#fees" prefetch={false}>Additional fees and refunds</Link> on our pricing page.</p>
      <p>Compare the charges that apply to your actual sales: international cards, currency conversion, card details entered by your staff, refunds, disputes and optional services. Use your usual order amounts and payment count. The same monthly sales total can cost more when it comes from many small payments because the fixed fee applies each time.</p>
      <p>Prices and product details were checked on <time dateTime="2026-11-15">November 15, 2026</time>. Stripe custom agreements and other markets can differ. Your accepted Trolleys fee schedule determines your charges; check current terms with both providers before deciding.</p>
    </section>
    <section id="payouts-and-approval" aria-labelledby="payouts-and-approval-title">
      <h2 id="payouts-and-approval-title">Check approval and payouts</h2>
      <p>Ask each provider to confirm your business eligibility, permitted activity, first payout, ongoing payout schedule and any reserve or hold conditions. A successful payment message and money arriving in your bank are different events.</p>
      <p>Stripe distinguishes the time funds take to become available from the schedule for sending payouts; bank processing can add time. Trolleys follows the schedule and conditions for your account. Our <Link href="/services/payouts" prefetch={false}>payout explanation</Link> describes that process. Matching processing rates do not mean matching payout times.</p>
      <p>Approval by one provider does not establish eligibility with another. A new Trolleys account requires review and approval, including when a previous provider has declined or closed an account.</p>
    </section>
    <section id="support-and-records" aria-labelledby="support-and-records-title">
      <h2 id="support-and-records-title">Ask about support and records</h2>
      <p>Ask who handles an unsuccessful payment, a refund, a dispute and a delayed payout. Confirm the contact method and any response commitments you depend on. Do not assume every support plan includes the same service.</p>
      <p>With Trolleys, payment records and gateway actions are in the store’s Cybersource Business Center. The Back Office Operations Portal covers merchant account activity and funding records. Check that your team can access both and identify the right store before going live.</p>
      <p>When comparing providers, ask to see the reports you will use each day. You should be able to follow an order through its payment record, any refund or dispute, and the relevant funding activity.</p>
    </section>
    <section id="before-switching" aria-labelledby="before-switching-title">
      <h2 id="before-switching-title">Before you switch</h2>
      <ol>
        <li><strong>Describe the sale.</strong> Record what you sell, delivery timing, customer location and whether payments are one-time or recurring.</li>
        <li><strong>List what must keep working.</strong> Include checkout, subscriptions, order records, refunds and accounting reports. Ask what can be transferred securely; saved payment methods do not move automatically.</li>
        <li><strong>Review the account terms.</strong> Compare total fees, payout timing, reserves, cancellation terms and dispute support before committing.</li>
        <li><strong>Verify the new setup.</strong> Confirm approval and test the required payment flow before replacing customer links. Keep access to old records and a way to handle outstanding refunds or disputes.</li>
      </ol>
      <p>Changing providers does not release funds held by the previous provider or end your existing obligations. If you are considering Trolleys, use our <Link href="/use-cases/switch-merchant-services" prefetch={false}>switching checklist</Link> to prepare for a discussion about your business.</p>
      <p>Etail Depot is independent of Stripe. This comparison is published by Etail Depot and should be read alongside each provider’s current documentation and account terms.</p>
    </section>
  </BlogArticlePage>;
}
