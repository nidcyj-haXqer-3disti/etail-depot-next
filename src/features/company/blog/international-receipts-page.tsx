import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { internationalReceiptsArticle } from "./international-receipts-content";

export function InternationalReceiptsPage() {
  return <BlogArticlePage article={internationalReceiptsArticle}>
    <p>Imagine a supplier expecting USD 5,000 from an overseas buyer. The agreement requires the supplier to receive the full amount. The buyer sends USD 5,000 and forwards the payment confirmation. The supplier’s bank records USD 4,975.</p>
    <p>The buyer says the bill is paid. The supplier says USD 25 is missing. Both can produce a record that supports what they see, but neither record explains the whole payment.</p>
    <p>Sending and receiving international business payments takes more than agreeing a price. The businesses also need to agree what amount must arrive, which currency it must arrive in and how any deductions will be handled. Otherwise, a completed transfer can leave an unfinished commercial conversation.</p>

    <section id="agree-the-receipt" aria-labelledby="agree-the-receipt-title">
      <h2 id="agree-the-receipt-title">Agree what settles the bill</h2>
      <p>Choose the payment arrangement while negotiating the sale. The International Trade Administration describes the competing interests plainly: sellers want to be paid promptly, while buyers want confidence that they will receive the goods. A payment method has to fit those terms, not just be familiar to the person making the transfer.</p>
      <p>For a bank-paid invoice, state the amount, currency, due date and invoice reference. Agree whether the recipient must receive the full invoiced amount or will accept specified deductions. If payment in another currency is allowed, record how that amount will be determined and when it becomes fixed.</p>
      <p>That agreement between buyer and seller is separate from the bank’s instructions about fees. The provider needs to explain which charges are included in its quote and whether other banks may deduct more. Do not assume a fee option on a transfer screen guarantees the recipient’s final credit.</p>
      <p>Wise’s documentation for its global-currency Swift transfers makes that limitation explicit. It says correspondent-bank fees can reduce the amount received even when an instruction indicates that the sender pays charges. This is a limitation of the documented service, not a claim that every international payment loses money in transit.</p>
      <p>The receiving business should obtain the appropriate incoming-payment instructions from its bank for the currency and route. The sender should use those instructions when requesting the transfer quote. An account that can receive one type of payment is not evidence that the same details work for every currency or transfer method.</p>
      <p>Include a reference that lets the recipient apply the receipt to the right invoice. If one payment covers several invoices, send an allocation showing the amount for each. A transfer confirmation helps explain what was sent; it does not, on its own, show what arrived or which invoices the receiving team closed.</p>
    </section>

    <section id="investigate-the-short-receipt" aria-labelledby="investigate-the-short-receipt-title">
      <h2 id="investigate-the-short-receipt-title">Find the difference before asking for more</h2>
      <p>Return to the hypothetical USD 5,000 invoice and USD 4,975 credit. The USD 25 difference is an amount to investigate, not proof of a particular bank fee. These are assumed figures, not a typical deduction or a Trolleys price.</p>
      <p>Compare the invoice, sender’s transfer record and receiver’s credit record. Check the currency and reference before comparing amounts. Determine whether the receiving record shows a reduced transfer, a full credit followed by a separate charge, or an amount converted into another currency. Those are different explanations and can require different treatment.</p>
      <p>The sender can ask its provider about the released amount and known deductions. The recipient can ask its bank about the credit and any receiving charges. Share the relevant references securely so the investigation follows the same payment on both sides.</p>
      <p>Once the cause is established, apply the agreed terms. A confirmed shortfall may require an additional payment, an agreed credit or a correction by the responsible party. Record that resolution against the original invoice. Do not silently write off an amount, automatically bill it again or resend the original USD 5,000.</p>
      <p>If an additional payment is required, confirm its approved amount and whether further fees could create another shortfall. Also verify the destination. A request to “send the remaining balance here” should not bypass the controls used for the first payment.</p>
      <p>The FBI recommends verifying changes to account details or payment procedures with the requesting party, using an independently obtained or established contact. A familiar email thread can still be compromised. Resolve a conflicting destination before sending more money.</p>
      <p>Give the supplier or buyer a useful update: the amount received, the difference still under review and who is following up. Closing the invoice should reflect the agreement and the evidence. Marking a transfer successful does not settle a disagreement about the amount owed.</p>
    </section>

    <section id="merchant-fees-and-invoice-balances" aria-labelledby="merchant-fees-and-invoice-balances-title">
      <h2 id="merchant-fees-and-invoice-balances-title">A smaller merchant payout is a different question</h2>
      <p>Now change the payment method in the example. A customer pays an agreed USD 5,000 invoice by card. Assume the completed payment is recorded for USD 5,000 and a later merchant payout is USD 4,975 after an agreed USD 25 processing charge, with no other adjustments.</p>
      <p>Those hypothetical figures describe a merchant expense. The smaller payout does not, by itself, mean the customer underpaid by USD 25. Do not send the customer another invoice merely to make the deposit equal the sale. Any permitted customer-facing charge needs separate disclosure and must comply with applicable law, network rules and account terms.</p>
      <p>That distinction matters when accepting payments from overseas customers too. Keep the customer’s charge separate from your processing costs, currency conversion and payout adjustments. Later refunds or disputes still need their own records; the original payment amount does not remove those possibilities.</p>
      <p>Trolleys, an Etail Depot service, helps merchants compare <Link href="/services/reconciliation" prefetch={false}>merchant account and gateway reports</Link> using payment references, amounts and status. The <Link href="/services/payouts" prefetch={false}>payout record</Link> then explains the eligible activity and adjustments behind the deposit. Comparing a sale total directly with a net payout can create an apparent missing payment where the difference is an accounted-for charge.</p>
      <p>For a Trolleys merchant, accepting an international customer’s payment remains subject to the <Link href="/company/legal/merchant-services#approval" prefetch={false}>approved methods, currencies and territories</Link>. Current <Link href="/company/legal/payouts-and-reserves#scope" prefetch={false}>funding arrangements</Link> cover USD payouts to approved US bank accounts. They do not establish an outgoing international supplier-transfer service.</p>
      <p>Bring an unexplained merchant payment or payout difference to our <Link href="/company/contact#account-support" prefetch={false}>account support team</Link>. Bring a supplier-wire discrepancy to the bank or provider that handled that transfer. The useful starting point is the same: identify which obligation the payment belongs to, what the records actually show and which amount remains unresolved.</p>
      <p>An argument about “paid” often begins with two businesses looking at different records. Put those records together before asking either side to pay again.</p>
    </section>
  </BlogArticlePage>;
}
