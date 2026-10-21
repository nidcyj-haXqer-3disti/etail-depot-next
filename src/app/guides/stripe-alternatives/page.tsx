import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { GuideSourceLink, GuideTable } from "@/ui/payment-guide";

import { ReadingGuide } from "@/ui/reading-guide";

export const metadata = publicPageMetadata("/guides/stripe-alternatives");

const stripePricing = "https://stripe.com/pricing";
const stripeLinks = "https://docs.stripe.com/payment-links";
const stripeOnlinePayments = "https://docs.stripe.com/payments/online-payments";
const stripePayouts = "https://docs.stripe.com/payouts";
const fees = productFacts.payments;
const exampleAmountCents = 10_000;
const exampleFeeCents = Math.round(exampleAmountCents * fees.cardRateBasisPoints / 10_000) + fees.cardFixedFeeCents;
const clarityFeeCents = Math.round(exampleAmountCents * saleRecordsOffer.rateBasisPoints / 10_000);
const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const salesMixExamples = [
  { count: 10, amountCents: 10_000 },
  { count: 100, amountCents: 1_000 },
].map(({ count, amountCents }) => {
  const feePerPaymentCents = Math.round(amountCents * fees.cardRateBasisPoints / 10_000) + fees.cardFixedFeeCents;
  return { count, amountCents, feePerPaymentCents, totalFeeCents: count * feePerPaymentCents };
});
const extraPayments = salesMixExamples[1].count - salesMixExamples[0].count;
const fixedFeeDifferenceCents = extraPayments * fees.cardFixedFeeCents;

export default function StripeAlternativesPage() {
  return <ReadingGuide
    path="/guides/stripe-alternatives"
    title="Stripe alternatives: compare Stripe and Trolleys"
    intro={`Trolleys and Stripe both let businesses share a payment link, and both publish a base rate of ${fees.cardRateLabel} for US domestic online card payments. The choice depends on the checkout, integrations and account terms you need, as well as the additional fees that apply to your sales.`}
    showPaymentAcceptanceLink
    relatedPaths={["/guides/payment-processing-systems", "/guides/how-to-create-a-payment-link"]}
    sections={[
      {
        id: "payment-workflow",
        title: "Start with the way customers pay",
        content: <>
          <p>If you sell through conversations or individual orders, a shareable payment link may cover the payment step. A QR code gives customers another way to open that online payment page. It does not, by itself, provide an inventory system or card reader.</p>
          <p>Trolleys lets approved businesses create payment requests for goods, services or information. Start with one typical order: how the customer receives the payment page, whether you need to charge again later and where you keep the order record. Use those needs to compare the services below.</p>
          <p>For a one-time purchase, both services support payment links and QR codes. If you need recurring charges, Stripe supports subscription payment links with separate Billing pricing. Confirm recurring-payment support and pricing directly with Trolleys before choosing it for that use.</p>
          <p>For a website, you can add a Trolleys payment link to a link or button. Check support for any shopping-cart integration you need. Stripe Payment Links offers a buy button, while Stripe Checkout offers hosted and embedded payment pages. These are different integration choices, so compare the one your store actually needs.</p>
          <p>Neither service’s processing rate tells you when a payout will arrive. Check funds availability, the account’s payout schedule and bank processing, including first-payout and reserve conditions.</p>
          <p className="payment-guide-note">Stripe details: <GuideSourceLink href={stripeLinks}>Payment Links</GuideSourceLink>, <GuideSourceLink href={stripeOnlinePayments}>online payment options</GuideSourceLink> and <GuideSourceLink href={stripePayouts}>payout timing</GuideSourceLink>.</p>
        </>,
      },
      {
        id: "compare-pricing",
        title: "Compare the same payment and fee categories",
        content: <>
          <p>The table compares successful domestic online card payments in USD for US businesses. Stripe figures are its published standard US prices; custom agreements and other markets can differ. Trolleys figures come from our <Link href="/payment-acceptance-service#fees">fee schedule</Link>.</p>
          <GuideTable caption="Trolleys Two Step and Stripe standard US card fees" headings={["Fee", "Published charges"]} rows={[
            ["Domestic online card payment", `Trolleys: ${fees.cardRateLabel}. Stripe: 2.9% + 30¢.`],
            ["Base setup and monthly fees", `Trolleys: $${fees.setupFeeDollars} setup, $${fees.monthlyFeeDollars} monthly. Stripe: $0 setup, $0 monthly.`],
            ["International card", `Trolleys: additional ${fees.internationalRateLabel}. Stripe: additional 1.5%.`],
            ["Currency conversion, when required", `Trolleys: additional ${fees.conversionRateLabel}. Stripe: additional 1%.`],
            ["Merchant-entered card details", `Trolleys: additional ${fees.manualEntryRateLabel}. Stripe: additional 0.5%.`],
            ["Dispute received", `Trolleys: $${fees.disputeFeeDollars} each. Stripe: $15 each.`],
            ["Manual dispute response", `Trolleys: $${fees.disputeResponseFeeDollars}. Stripe: $15. Each returns its response fee if you win.`],
          ]} />
          <p className="payment-guide-note">Pricing checked <time dateTime="2026-10-21">October 21, 2026</time>. <GuideSourceLink href={stripePricing}>Stripe US pricing</GuideSourceLink>. The merchant-entry charge is separate from a customer typing their own card details at checkout. International-card and conversion charges can both apply. Network charges and optional products can add costs.</p>
          <p>Stripe Payment Links is included with standard payments pricing. Its optional custom domain is $10 per month; optional post-payment invoices cost 0.4% of the transaction, capped at $2 per invoice. Recurring charges use Stripe Billing pricing. These are separate choices, so include only the products you need in a cost comparison. See <GuideSourceLink href={stripePricing}>Stripe’s US pricing</GuideSourceLink>.</p>
          <p>Trolleys Clarity is also optional: {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}. It supports purchase recognition and eligible Visa online fraud-dispute prevention through Order Insight. It is a different service from an invoice. Coverage depends on the payment, participating bank and available data; it does not guarantee a dispute outcome. Automatic refund programs and services that respond to chargebacks for you are separate services.</p>
        </>,
      },
      {
        id: "payment-example",
        title: "Compare fees across your sales",
        content: <>
          <div className="payment-guide-callout">
            <p><strong>Illustrative domestic online card payment:</strong> at the published base rate, a $100 payment costs {dollars(exampleFeeCents)}, leaving {dollars(exampleAmountCents - exampleFeeCents)} after that fee. The same base-rate calculation applies to Stripe standard pricing.</p>
            <p>For an eligible Trolleys payment enrolled in Clarity, the additional fee is {dollars(clarityFeeCents)}. Processing and Clarity together cost {dollars(exampleFeeCents + clarityFeeCents)}, leaving {dollars(exampleAmountCents - exampleFeeCents - clarityFeeCents)} before any other applicable charges or adjustments.</p>
          </div>
          <p>Suppose two businesses each collect $1,000 in successful domestic online card payments in USD at {fees.cardRateLabel}. One receives ten $100 payments; the other receives one hundred $10 payments. Calculate each payment’s fee, rounded to the nearest cent, before adding the fees together.</p>
          <GuideTable caption="Illustrative base fees for the same $1,000 in sales" headings={["Payments received", "Total base processing fees"]} rows={salesMixExamples.map(item => [
            `${item.count} payments of ${dollars(item.amountCents)}`,
            `${dollars(item.totalFeeCents)} (${item.count} × ${dollars(item.feePerPaymentCents)})`,
          ])} />
          <p>The percentage component is {dollars(Math.round(100_000 * fees.cardRateBasisPoints / 10_000))} in either example. The second business pays the fixed {fees.cardFixedFeeCents}¢ fee {extraPayments} more times, adding {dollars(fixedFeeDifferenceCents)}. Compare your usual number and size of payments, then add any optional services, international-card or conversion charges, and <Link href="/guides/what-is-a-chargeback#dispute-costs">chargeback costs</Link> that apply.</p>
          <p>The two sales examples show base processing fees only. These calculations are not promised payout amounts: refunds, disputes, holds, reserves and other account adjustments can affect available funds.</p>
        </>,
      },
      {
        id: "payouts-and-approval",
        title: "Check approval, payouts and support",
        content: <>
          <p>Ask each service to confirm your business eligibility, permitted activity, first payout, ongoing payout schedule and any reserve or hold conditions. A successful payment message and money arriving in your bank are different events.</p>
          <p>Check when funds become available, when payouts are sent and how long your bank may take to make the deposit available. Trolleys follows the schedule and conditions for your account; see our <Link href="/payment-acceptance-service#payouts">payout explanation</Link>. Matching processing rates do not mean matching payout times.</p>
          <p>Ask who handles an unsuccessful payment, a refund, a dispute and a delayed payout. Confirm the contact method and any service commitments you depend on. Do not assume approval by one service means approval by another.</p>
        </>,
      },
      {
        id: "before-switching",
        title: "Before you switch",
        content: <ol>
          <li><strong>Describe the sale.</strong> Record what you sell, the usual amount, delivery timing, customer location and whether the payment is one-time or recurring.</li>
          <li><strong>List what must keep working.</strong> Include checkout links, subscriptions, order records, refunds and the accounting reports you use. Ask about each required integration and what can and cannot be transferred.</li>
          <li><strong>Review the account terms.</strong> Compare approval conditions, total fees, payout timing, reserves, cancellation terms and dispute support before committing.</li>
          <li><strong>Plan the transition.</strong> Confirm the new account is approved and ready before replacing customer links. Keep access to the old payment records and a way to handle outstanding refunds or disputes.</li>
        </ol>,
      },

    ]}
    sources={[
      { title: "Stripe — US standard pricing", href: stripePricing },
      { title: "Stripe — Payment Links documentation", href: stripeLinks },
      { title: "Stripe — Online payment options", href: stripeOnlinePayments },
      { title: "Stripe — Receive payouts", href: stripePayouts },
    ]}
  />;
}
