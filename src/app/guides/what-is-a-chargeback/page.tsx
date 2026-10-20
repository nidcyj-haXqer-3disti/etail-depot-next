import Link from "next/link";
import { publicPageMetadata } from "@/modules/public-site/metadata";
import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { GuideSourceLink, GuideTable } from "@/ui/payment-guide";

import { ReadingGuide } from "@/ui/reading-guide";

export const metadata = publicPageMetadata("/guides/what-is-a-chargeback");

const visaSource = "https://www.visa.com/en-us/support/business/dispute-resolution";
const evidenceSource = "https://usa.visa.com/content/dam/VCOM/global/support-legal/documents/merchants-dispute-management-guidelines.pdf";
const caseRecordsSource = "https://developer.cybersource.com/docs/cybs/en-us/reporting/developer/all/rest/reporting/reporting_fields/chargeback.html";
const orderInsightSource = "https://www.visa.com/en-us/products/order-insight";
const fees = productFacts.payments;

export default function ChargebackGuidePage() {
  return <ReadingGuide
    path="/guides/what-is-a-chargeback"
    title="What is a chargeback? A merchant guide"
    intro="A chargeback reverses all or part of a card payment through the card issuer’s dispute process. If you receive one, check the reason and response deadline, then gather the relevant records."
    showPaymentAcceptanceLink
    relatedPaths={["/guides/how-to-create-a-payment-link", "/guides/payment-processing-systems"]}
    sections={[
      {
        id: "chargeback-vs-refund",
        title: "Chargeback vs. refund: what is the difference?",
        content: <>
          <p>A customer may dispute an unrecognized payment, a purchase they say was not delivered or another problem with a transaction. The issuer is the bank that issued the customer’s card. The card network carries the dispute to your merchant bank or processor, which may ask for records to respond. This process can reverse all or part of the payment.</p>
          <p>With a refund, your business returns money through its payment service under the applicable policy and obligations. You need the original payment, refund amount and reason. Original processing fees may not be returned.</p>
          <p>A chargeback follows the card issuer’s dispute process. You need the notice, response deadline and records that answer the stated reason. The disputed amount and dispute fees can affect your account while the case is being reviewed.</p>
          <p>A customer contacting you about a purchase is not automatically a formal chargeback. Check the original payment and any account notice before deciding how to respond. If a formal dispute is already open, follow that process and ask your payment service how to handle any proposed refund without duplicating the return of funds.</p>
        </>,
      },
      {
        id: "what-happens-next",
        title: "How to respond to a chargeback",
        content: <>
          <p>The notice identifies the disputed payment, the reason and the steps available to you. Depending on the case, you may accept the dispute or submit a response with evidence. Funds and fees can be deducted while the case is reviewed; submitting evidence does not itself return the money.</p>
          <ol>
            <li><strong>Match the notice to the sale.</strong> Find the original payment and order. Check the disputed amount and currency; the case may concern only part of a payment. Read the reason and any customer statement before gathering documents.</li>
            <li><strong>Decide whether the records support a response.</strong> Check what was sold, delivered, canceled or refunded. If you cannot answer the stated reason, ask your payment service about the available next steps, including accepting the dispute.</li>
            <li><strong>Follow the response instructions in the notice.</strong> Explain the relevant facts, attach the requested records and meet the response deadline. For a Trolleys payment, follow the instructions for that case in your Trolleys account.</li>
            <li><strong>Keep the submission and follow the case.</strong> Save what you sent and any submission confirmation. Check for further requests and the final outcome, then reconcile the disputed amount and fees with your payment records.</li>
          </ol>
          <p>Read the deadline shown for your actual case. A customer’s time to raise a dispute is different from a merchant’s time to respond. Deadlines and evidence requirements vary; do not substitute a general number of days for the date in the notice.</p>
          <div className="payment-guide-callout"><p><strong>Keep one case record:</strong> the case reference, original payment and order references, disputed amount and currency, reason or reason code, response deadline, submission date and final outcome. Keep fees and fund adjustments as separate entries so you can see what changed.</p></div>
        </>,
      },
      {
        id: "relevant-evidence",
        title: "Choose records that answer the dispute",
        content: <>
          <p>A useful response explains the transaction in a short, consistent sequence. Keep original records and select material relevant to the allegation. For example, a delivery complaint calls for different evidence from an alleged duplicate charge.</p>
          <p>Start with the order description, amount, date and terms presented at purchase. Add the relevant delivery, service-completion or access records, customer messages, and any cancellation or refund record. You do not need to submit every document merely because you have it.</p>
          <p>Use these illustrative examples to organize records, then follow the evidence requirements and response deadline in your own notice.</p>
          <GuideTable caption="Illustrative records for different dispute reasons" headings={["Dispute reason", "Records that may answer it"]} rows={[
            ["Goods not received", "Connect the agreed delivery date and address to tracking, delivery confirmation and relevant customer messages. Explain how those records address the claimed missing delivery."],
            ["Duplicate charge", "Match both charges to their orders and receipts. Explain whether they concern separate purchases, or identify a duplicate payment already refunded."],
            ["Canceled or refunded purchase", "Use the cancellation or return request, policy shown before purchase, related messages and any refund date, amount and reference. Explain what was requested and what happened."],
          ]} />
          <p>For example, if a customer disputes a delivered order, connect the order reference, agreed address and delivery record in your explanation. A payment receipt alone shows a charge; it does not establish delivery. If a refund was already processed, identify its date, amount and payment reference so it can be matched to the disputed sale.</p>
          <p>Keep the explanation concise and the documents readable. Use the case’s requested format and include only records that help answer the reason. Evidence can support a response; it cannot guarantee the issuer’s decision.</p>
        </>,
      },
      {
        id: "dispute-costs",
        title: "The disputed amount and fees are separate",
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
          <p>Give the customer a clear description, the amount due, the delivery or service arrangement and the applicable refund or cancellation policy. The <Link href="/guides/how-to-create-a-payment-link#prepare-the-request">payment-link preparation checklist</Link> helps you collect these details before sharing a request.</p>
          <p>Keep customers informed if fulfillment changes and make it easy for them to identify and ask about a purchase. Check the original payment status before retrying a charge or sending another request for the same order. Retain the terms and messages from the time of purchase so you can reconstruct what was agreed.</p>
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
      { title: "Visa — Dispute management guide: response and evidence", href: evidenceSource },
      { title: "Cybersource — Chargeback and retrieval fields: case records and response dates", href: caseRecordsSource },
      { title: "Visa — Order Insight", href: orderInsightSource },
    ]}
  />;
}
