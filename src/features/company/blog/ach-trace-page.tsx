import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { achTraceArticle } from "./ach-trace-content";
import s from "./blog.module.css";

const investigationFindings = [
  ["Not submitted", "Whether the transfer is still scheduled or was rejected before submission.", "Ask the initiating provider to resolve the instruction."],
  ["Pending or not located", "The relevant dates, destination and any evidence still needed.", "Keep the inquiry open with the bank or provider and agree on the next update."],
  ["Returned or wrong destination", "The return information or destination finding.", "Request the approved correction process before making a replacement."],
  ["Posted but unrecognized", "The posted amount, date and available reference.", "Match the bank entry to the payment or payout record."],
] as const;

export function AchTracePage() {
  return <BlogArticlePage article={achTraceArticle}>
    <p>When a provider says a payment was sent but the recipient cannot find it, start by identifying the transfer. An invoice number, a payment ID and an ACH trace can all appear in the same conversation while referring to different records.</p>
    <section id="identify-entry" aria-labelledby="identify-entry-title">
      <h2 id="identify-entry-title">Identify the right number</h2>
      <p>An ACH trace number has <strong>15 digits</strong>. The first eight identify the originating bank’s routing-number prefix, followed by a seven-digit entry sequence. Nacha describes the trace as identifying an entry within a batch and file, so keep its payment context rather than treating it as a globally unique lookup code.</p>
      <p>Request the original value and preserve any leading zeroes. Ask explicitly for the ACH trace of the transfer being investigated and whether that entry was submitted. A provider’s transaction ID, payout ID or support case number is not automatically the ACH trace.</p>
      <p>If the transfer used another payment network, request the reference for that network instead. The <Link href="/company/blog/ach-payments" prefetch={false}>ACH payments article</Link> explains the bank roles and the difference between credits and debits.</p>
    </section>
    <section id="payment-or-payout" aria-labelledby="payment-or-payout-title">
      <h2 id="payment-or-payout-title">Check which transfer is missing</h2>
      <p>A customer’s card payment can lead to a separate ACH payout to the merchant. If the customer payment succeeded but the merchant deposit is missing, the bank inquiry concerns the payout. It does not concern the original card transaction.</p>
      <p>A payout may combine several sales with fees, refunds or other account adjustments. Use the amount of the transfer actually sent to the bank, rather than the total on one customer invoice.</p>
      <p>Check the payout status first. If it is only scheduled, ask the provider when it will be sent. If it was sent, request the transfer method, trace or reference, dates and destination. The <Link href="/company/blog/payment-settlement-and-payouts" prefetch={false}>settlement and payouts article</Link> explains these separate stages.</p>
      <p>For merchants using Trolleys, an Etail Depot service, the <Link href="/services/payouts" prefetch={false}>payout record</Link> connects included payments and adjustments to the expected deposit. A missing merchant payout is not a reason to charge the customer again.</p>
    </section>
    <section id="prepare-inquiry" aria-labelledby="prepare-inquiry-title">
      <h2 id="prepare-inquiry-title">Build a useful investigation request</h2>
      <ol>
        <li><strong>Amount and direction.</strong> Record the exact entry amount and whether the account should receive a credit or debit. Keep the sender, intended recipient and invoice or payout reference with it.</li>
        <li><strong>Dates and status.</strong> Include the requested payment date, the date marked sent and the settlement date if known. Ask what the provider’s status label means.</li>
        <li><strong>Destination.</strong> Confirm the intended bank and masked account details. Provide full account details only through the bank or provider’s verified secure support channel.</li>
        <li><strong>Trace and case references.</strong> Keep the trace exactly as received, any return information, the support case number and the agreed next update. These references serve different purposes.</li>
      </ol>
      <p>The Federal Reserve’s Payment Trace Request lets an originating bank ask the receiving bank about an entry’s status. The inquiry uses details such as the trace, amount, effective date and settlement date. This is a service for participating institutions, not a public form for merchants.</p>
      <p>Start with your bank or the organization that initiated the transfer. Nacha does not process payments or hold individual transaction records. If both parties open bank inquiries, keep the responses linked to the same transfer.</p>
    </section>
    <section id="close-investigation" aria-labelledby="close-investigation-title">
      <h2 id="close-investigation-title">Resolve the payment before replacing it</h2>
      <figure>
        <figcaption>Let the investigation finding determine the next action</figcaption>
        <dl className={s.diagnosticList}>
          {investigationFindings.map(([result, detail, action]) => <div key={result}>
            <dt>{result}</dt>
            <dd><p><strong>Confirm:</strong> {detail}</p><p><strong>Next step:</strong> {action}</p></dd>
          </div>)}
        </dl>
      </figure>
      <p>A pending deposit can reflect notice of a future payment before the funds arrive. A posted entry may also have an unfamiliar statement description. Ask the bank to explain the record rather than assuming either means the payment failed.</p>
      <p>Avoid sending a replacement solely because the first payment is not visible. Confirm its outcome or agree on a controlled replacement process with the bank or provider so both payments do not arrive unnoticed.</p>
      <p>If the issue is an unfamiliar or potentially unauthorized debit, report it to the bank promptly. Reporting and return rules depend on the account and entry; a trace number does not create a universal investigation deadline or guarantee recovery.</p>
      <p>Record the finding, the next action and who owns it before closing the case. Having a trace number is useful evidence for an inquiry, not a resolution by itself.</p>
    </section>
  </BlogArticlePage>;
}
