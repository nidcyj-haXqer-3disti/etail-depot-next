import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { GuideSourceLink, GuideTable, PaymentGuide } from "@/ui/payment-guide";

export const metadata = publicPageMetadata("/guides/what-is-a-chargeback");

const visaSource = "https://www.visa.com/en-us/support/business/dispute-resolution";
const disputeSource = "https://docs.stripe.com/disputes/how-disputes-work";
const evidenceSource = "https://docs.stripe.com/disputes/responding";
const evidenceCategoriesSource = "https://docs.stripe.com/disputes/categories";
const orderInsightSource = "https://www.visa.com/en-us/products/order-insight";
const fees = productFacts.payments;

export default function ChargebackGuidePage() {
  return <PaymentGuide
    path="/guides/what-is-a-chargeback"
    title="What is a chargeback? A merchant guide"
    intro="A chargeback reverses all or part of a card payment through the card issuer’s dispute process. If you receive one, check the reason and response deadline, then gather the relevant records."
    sections={[
      {
        id: "chargeback-vs-refund",
        title: "Chargeback vs. refund: what is the difference?",
        content: <>
          <p>A customer may dispute an unrecognized payment, a purchase they say was not delivered or another problem with a transaction. The card issuer’s dispute process can reverse the payment amount. <GuideSourceLink href={visaSource}>Visa’s merchant dispute guidance</GuideSourceLink> describes a dispute as a full or partial reversal through the issuer and acquiring side of the payment system.</p>
          <GuideTable caption="Refunds and card-payment disputes" headings={["Question", "Refund", "Chargeback"]} rows={[
            ["How does it start?", "The business initiates a return of funds through its payment service.", "The cardholder raises a dispute with the card issuer."],
            ["Who handles the decision?", "The business handles the refund under the applicable policy and obligations.", "The issuer reviews the dispute through card-network procedures."],
            ["What does the merchant need?", "The original payment and the refund amount and reason.", "The dispute notice, response deadline and relevant transaction records."],
            ["Can there be costs?", "Original processing fees may not be returned; check the service terms.", "The disputed amount and dispute-related fees can affect the account."],
          ]} />
          <p>A customer contacting you about a purchase is not automatically a formal chargeback. Check the original payment and any account notice before deciding how to respond. If a formal dispute is already open, follow that process and ask your payment service how to handle any proposed refund without duplicating the return of funds.</p>
        </>,
      },
      {
        id: "what-happens-next",
        title: "How to respond to a chargeback",
        content: <>
          <p>The notice identifies the disputed payment, the reason and the steps available to you. Depending on the case, you may accept the dispute or submit a response with evidence. Funds and fees can be deducted while the case is reviewed; submitting evidence does not itself return the money.</p>
          <p>Read the deadline shown for your actual case. A customer’s time to raise a dispute is different from a merchant’s time to respond. Deadlines and evidence requirements vary; do not substitute a general number of days for the date in the notice.</p>
          <p><GuideSourceLink href={disputeSource}>Stripe explains what happens when a dispute arrives</GuideSourceLink>, how to respond and how the issuer decides. Its account instructions are specific to Stripe. For a Trolleys payment, manage the original payment in Trolleys and follow the instructions for that account.</p>
          <div className="payment-guide-callout"><p><strong>First action:</strong> note the response deadline, confirm which payment is involved and read the stated reason. Then decide which records answer that reason. Contact your payment service promptly if the notice or next step is unclear.</p></div>
        </>,
      },
      {
        id: "relevant-evidence",
        title: "Collect evidence that answers the reason",
        content: <>
          <p>A useful response explains the transaction in a short, consistent sequence. Keep original records and select material relevant to the allegation. For example, a delivery complaint calls for different evidence from an alleged duplicate charge.</p>
          <ul>
            <li><strong>The purchase:</strong> the order description, amount, transaction date and the terms presented when the customer agreed to buy.</li>
            <li><strong>Delivery or performance:</strong> relevant shipping and delivery records, service completion records or agreed digital-access details.</li>
            <li><strong>Customer communication:</strong> messages that clarify what was ordered, changes, delivery issues or the resolution offered.</li>
            <li><strong>Refunds or cancellations:</strong> the request, the policy communicated at purchase and records of any refund already processed.</li>
          </ul>
          <p>Use these illustrative examples to organize records, then follow the evidence requirements and response deadline in your own notice.</p>
          <GuideTable caption="Illustrative evidence by dispute reason" headings={["Dispute reason", "Records to review", "What those records address"]} rows={[
            ["Goods not received", "The agreed delivery date, tracking and delivery confirmation tied to the order, and relevant customer messages.", "Whether the goods reached the customer or were not yet due for delivery."],
            ["Duplicate charge", "Separate itemized receipts and payment records for each purchase, or a record of any duplicate payment already refunded.", "Whether the charges were for separate purchases or a duplicate was already refunded."],
            ["Canceled or refunded purchase", "The cancellation or return request, policy shown before purchase, related messages and any processed refund record with its date and amount.", "What was requested, which terms were communicated and whether a refund was processed."],
          ]} />
          <p>Use the case’s requested format and submit through the payment service’s designated process. An authorization or a successful payment record does not, on its own, answer whether goods or services were delivered. See <GuideSourceLink href={evidenceSource}>Stripe’s response guidance</GuideSourceLink> and <GuideSourceLink href={evidenceCategoriesSource}>evidence examples by dispute reason</GuideSourceLink>. Evidence can support a response; it cannot guarantee the issuer’s decision.</p>
        </>,
      },
      {
        id: "dispute-costs",
        title: "Understand the payment amount and fees separately",
        content: <>
          <p>For Trolleys, the published fee is ${fees.disputeFeeDollars} for each dispute received. A manual dispute response has a separate ${fees.disputeResponseFeeDollars} fee, returned if you win. These fees are separate from the disputed payment amount.</p>
          <div className="payment-guide-callout">
            <p><strong>Illustrative $100 dispute:</strong> the $100 disputed amount and the ${fees.disputeFeeDollars} dispute fee are different items. If you submit a manual response, the additional response fee is ${fees.disputeResponseFeeDollars}. This illustration excludes original processing fees and any other applicable charges.</p>
            <p>The outcome determines what happens to the disputed funds. If you win, the manual response fee is returned. Other fees are not necessarily returned.</p>
          </div>
          <p>For a refund, Trolleys’ original processing and currency-conversion fees are not returned. Refunds and disputes can both reduce funds available for payout. See the current <Link href="/payment-acceptance-service#fees">fee schedule</Link> and <Link href="/payment-acceptance-service#refunds-and-disputes">refund and dispute guidance</Link>.</p>
        </>,
      },
      {
        id: "reduce-avoidable-disputes",
        title: "Chargeback prevention: reduce avoidable disputes",
        content: <>
          <p>Give the customer a clear description, the amount due, the delivery or service arrangement and the applicable refund or cancellation policy. See <Link href="/payment-acceptance-service#request-details">what to include in a payment request</Link>.</p>
          <p>Keep customers informed if fulfillment changes and make it easy for them to identify and ask about a purchase. Check for duplicate payments before processing the same order again. These steps align with <GuideSourceLink href={visaSource}>Visa’s guidance on clear policies, transaction records and customer communication</GuideSourceLink>.</p>
        </>,
      },
      {
        id: "clarity-chargeback-prevention",
        title: "How does Clarity help prevent chargebacks?",
        content: <>
          <p>Trolleys Clarity uses <GuideSourceLink href={orderInsightSource}>Visa Order Insight</GuideSourceLink> to share supported purchase details with participating banks. This helps customers recognize a charge and can prevent eligible Visa online fraud disputes before they become chargebacks, when the required payment history and data qualify.</p>
          <p>Clarity is optional and costs an additional {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}. Payment processing is separate. <Link href="/payment-acceptance-service#dispute-readiness">Explore Clarity chargeback prevention and fees</Link>.</p>
          <p>Clarity does not cover every bank, payment or dispute reason, and no outcome is guaranteed. Prevention is different from responding to an existing chargeback: automatic refund programs and services that respond to chargebacks for you are separate services. If a dispute arrives, follow the instructions and deadline in your Trolleys account.</p>
        </>,
      },
    ]}
    sources={[
      { title: "Visa — Merchant dispute resolution", href: visaSource },
      { title: "Stripe — How disputes work", href: disputeSource },
      { title: "Stripe — Respond to disputes", href: evidenceSource },
      { title: "Stripe — Dispute reason code categories", href: evidenceCategoriesSource },
      { title: "Visa — Order Insight", href: orderInsightSource },
    ]}
  />;
}
