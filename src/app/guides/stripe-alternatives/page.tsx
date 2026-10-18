import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { GuideSourceLink, GuideTable, PaymentGuide } from "@/ui/payment-guide";

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

export default function StripeAlternativesPage() {
  return <PaymentGuide
    path="/guides/stripe-alternatives"
    title="Stripe alternatives: compare Stripe and Trolleys"
    intro={`Trolleys is an option for US businesses that want to create payment requests and share a link or QR code for online card payments. Trolleys and Stripe have the same published base rate of ${fees.cardRateLabel} for domestic online card payments; compare additional fees, required features and account terms before choosing.`}
    disclosure="Etail Depot publishes this guide and operates Trolleys. This is a comparison of Trolleys with selected Stripe US features and standard prices, not an independent ranking of every provider."
    sections={[
      {
        id: "payment-workflow",
        title: "Start with the way customers pay",
        content: <>
          <p>If you sell through conversations or individual orders, a shareable payment link may cover the payment step. A QR code gives customers another way to open that online payment page. It does not, by itself, provide an inventory system or card reader.</p>
          <p>Trolleys lets approved businesses create payment requests for goods, services or information. Use the comparison below to check which service supports the way you sell.</p>
          <GuideTable caption="Compare Stripe and Trolleys for the payments you need" headings={["Requirement", "Stripe", "Trolleys"]} rows={[
            ["Payment links and QR codes", "Share a payment link or its QR code for a one-time purchase.", "Share a payment request by link or QR code for an online card payment."],
            ["Recurring payments", "Subscription payment links are supported; Stripe Billing pricing applies.", "Confirm whether recurring payments are supported and what they cost before choosing."],
            ["Website integrations", "Payment Links offers a website buy button. Stripe Checkout also supports embedded or hosted payment pages.", "Add the payment link to a website link or button. Confirm support for any store or shopping-cart integration you need."],
            ["Payout terms", "Timing depends on funds availability, the account’s payout schedule and bank processing.", "Your account’s payout schedule applies. Confirm the first payout, any holds or reserves and when funds will reach your bank."],
          ]} />
          <p className="payment-guide-note">Stripe details: <GuideSourceLink href={stripeLinks}>Payment Links</GuideSourceLink>, <GuideSourceLink href={stripeOnlinePayments}>online payment options</GuideSourceLink> and <GuideSourceLink href={stripePayouts}>payout timing</GuideSourceLink>. Ask Trolleys whether it supports any recurring payments or store integrations you need before choosing.</p>
        </>,
      },
      {
        id: "compare-pricing",
        title: "Compare the same payment and fee categories",
        content: <>
          <p>The table compares successful domestic online card payments in USD for US businesses. Stripe figures are its published standard US prices reviewed October 19, 2026; custom agreements and other markets can differ. Trolleys figures come from our <Link href="/payment-acceptance-service#fees">fee schedule</Link>.</p>
          <GuideTable caption="Selected US online card fees, reviewed October 19, 2026" headings={["Fee category", "Trolleys Two Step", "Stripe standard"]} rows={[
            ["Domestic online card payment", fees.cardRateLabel, "2.9% + 30¢"],
            ["Base setup / monthly fee", `$${fees.setupFeeDollars} / $${fees.monthlyFeeDollars}`, "$0 / $0"],
            ["International card", `Additional ${fees.internationalRateLabel}`, "Additional 1.5%"],
            ["Currency conversion, when required", `Additional ${fees.conversionRateLabel}`, "Additional 1%"],
            ["Merchant-entered card details", `Additional ${fees.manualEntryRateLabel}`, "Additional 0.5%"],
            ["Dispute received", `$${fees.disputeFeeDollars} each`, "$15 each"],
            ["Manual dispute response", `$${fees.disputeResponseFeeDollars}; returned if you win`, "$15; returned if you win"],
          ]} />
          <p className="payment-guide-note">Source: <GuideSourceLink href={stripePricing}>Stripe US pricing</GuideSourceLink>. The merchant-entry charge is separate from a customer typing their own card details at checkout. International-card and conversion charges can both apply. Network charges and optional products can add costs.</p>
          <p>Stripe Payment Links is included with standard payments pricing. Its optional custom domain is $10 per month; optional post-payment invoices cost 0.4% of the transaction, capped at $2 per invoice. Recurring charges use Stripe Billing pricing. These are separate choices, so include only the products you need in a cost comparison. See <GuideSourceLink href={stripePricing}>Stripe’s US pricing</GuideSourceLink>.</p>
          <p>Trolleys Clarity is also optional: {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}. It supports purchase recognition and eligible Visa online fraud-dispute prevention through Order Insight. It is a different service from an invoice. Coverage depends on the payment, participating bank and available data; it does not guarantee a dispute outcome. Automatic refund programs and services that respond to chargebacks for you are separate services.</p>
        </>,
      },
      {
        id: "payment-example",
        title: "Work through a $100 payment",
        content: <>
          <div className="payment-guide-callout">
            <p><strong>Illustrative domestic online card payment:</strong> at the published base rate, a $100 payment costs {dollars(exampleFeeCents)}, leaving {dollars(exampleAmountCents - exampleFeeCents)} after that fee. The same base-rate calculation applies to Stripe standard pricing.</p>
            <p>For an eligible Trolleys payment enrolled in Clarity, the additional fee is {dollars(clarityFeeCents)}. Processing and Clarity together cost {dollars(exampleFeeCents + clarityFeeCents)}, leaving {dollars(exampleAmountCents - exampleFeeCents - clarityFeeCents)} before any other applicable charges or adjustments.</p>
          </div>
          <p>Matching base rates do not necessarily mean matching total costs. Your card mix, optional services and disputes can change the result. This calculation is not a promised payout amount: refunds, holds, reserves and other account adjustments can affect available funds.</p>
        </>,
      },
      {
        id: "payouts-and-approval",
        title: "Check approval, payouts and support",
        content: <>
          <p>Ask each service to confirm your business eligibility, permitted activity, first payout, ongoing payout schedule and any reserve or hold conditions. A successful payment message and money arriving in your bank are different events.</p>
          <p><GuideSourceLink href={stripePayouts}>Stripe’s payout guidance</GuideSourceLink> distinguishes first-payout timing, funds becoming available and the account’s payout schedule. Trolleys likewise follows the schedule and conditions for your account; see our <Link href="/payment-acceptance-service#payouts">payout explanation</Link>. Neither the matching card rate nor a payment link establishes faster bank arrival.</p>
          <p>Ask who handles an unsuccessful payment, a refund, a dispute and a delayed payout. Confirm the contact method and any service commitments you depend on. Do not assume approval by one service means approval by another.</p>
        </>,
      },
      {
        id: "before-switching",
        title: "Use a short checklist before switching",
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
