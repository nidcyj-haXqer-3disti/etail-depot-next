import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { bankTransfersArticle } from "./bank-transfers-content";
import s from "./blog.module.css";

const receiptDifferences = [
  ["One payment, several invoices", "Ask which invoices and amounts the payment covers.", "Apply the confirmed allocation and keep any remaining balances open."],
  ["Less than the amount due", "Check for fees, a partial payment, a mistake or an agreed adjustment.", "Record the difference rather than silently marking the full invoice paid."],
  ["More than the amount due", "Confirm whether the extra amount belongs to another invoice or is an overpayment.", "Follow the agreed credit or refund process and record the outcome."],
  ["No clear customer reference", "Investigate the bank reference and ask for remittance information.", "Keep the receipt unmatched until the payer and purpose are confirmed."],
] as const;

export function BankTransfersPage() {
  return <BlogArticlePage article={bankTransfersArticle}>
    <p>This article covers transfers that customers initiate, such as ACH credits and wires. Collecting an authorized ACH debit is a different arrangement: the business initiates a debit with the customer’s permission. Decide which process you are offering before writing the invoice instructions.</p>
    <section id="receiving-instructions" aria-labelledby="receiving-instructions-title">
      <h2 id="receiving-instructions-title">Give instructions for the right transfer</h2>
      <p>Ask your bank or payment provider which incoming methods, currencies and payment amounts your account supports. Obtain its receiving instructions for the selected method. An ACH credit, a domestic wire and an international transfer may require different details.</p>
      <p>Some banks use separate routing numbers for ACH and wires. Do not assume that the details used for one method work for another. The <Link href="/company/blog/ach-vs-wire-transfers" prefetch={false}>ACH and wire comparison</Link> explains the timing and receiving checks.</p>
      <p>Show the currency, amount due, due date and invoice reference alongside the approved bank instructions. Explain how to identify a payment covering several invoices and where to send its allocation details.</p>
      <p>Use a controlled process for changing receiving details. Tell customers how to verify a change through a contact method they already know. An unexpected email should not be enough to replace the payment destination.</p>
    </section>
    <section id="first-invoice" aria-labelledby="first-invoice-title">
      <h2 id="first-invoice-title">Prepare before sending the first invoice</h2>
      <ol>
        <li><strong>Confirm the receiving arrangement.</strong> Check account suitability, supported methods, currencies, limits, fees and the expected confirmation process with your bank or provider.</li>
        <li><strong>Review the customer instructions.</strong> Ask someone who did not write them to explain how they would pay. Resolve unclear fields and references before customers use the instructions.</li>
        <li><strong>Define proof of receipt.</strong> Decide which bank or provider record your team uses to confirm incoming funds. Treat a customer’s screenshot as supporting information, not the sole evidence of payment.</li>
        <li><strong>Assign responsibility.</strong> Name who matches receipts, investigates differences and approves refunds. Give that person a way to hold an order while a payment question is unresolved.</li>
      </ol>
      <p>Confirm whether the provider offers unique payment references, virtual account details or automatic matching. These tools can reduce manual work, but their availability and behavior depend on the receiving service. They should not be assumed to come with every business bank account.</p>
    </section>
    <section id="match-receipts" aria-labelledby="match-receipts-title">
      <h2 id="match-receipts-title">Match receipts to what customers owe</h2>
      <p>A customer may send one transfer for several invoices and include only a customer code. Identifying the customer is useful, but it does not always establish which balances the payment should close. Request an allocation when the intended invoices are unclear.</p>
      <table className={s.comparison}>
        <caption>Use the amount actually received and resolve any difference</caption>
        <thead><tr><th scope="col">Receipt</th><th scope="col">Check</th><th scope="col">Record</th></tr></thead>
        <tbody>{receiptDifferences.map(([receipt, check, record]) => <tr key={receipt}>
          <th scope="row">{receipt}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Check</span>{check}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Record</span>{record}</td>
        </tr>)}</tbody>
      </table>
      <p>Keep the bank transaction identifier, customer reference, invoice allocation and approved adjustments together. Remittance advice is the payer’s explanation of what a payment covers; it does not by itself prove that the money arrived.</p>
      <p>If the bank record omits that detail, agree on a separate way for customers to provide it. Where a provider matches payments automatically, check how it handles partial payments and excess funds before relying on the result.</p>
    </section>
    <section id="handle-exceptions" aria-labelledby="handle-exceptions-title">
      <h2 id="handle-exceptions-title">Resolve exceptions before closing the order</h2>
      <p>Set a review process for duplicate payments, the wrong currency and money received after an order was canceled. Record the receipt even when its treatment is unresolved. Do not let an ambiguous payment automatically release an order.</p>
      <p>If a customer says a payment was sent but you cannot find it, confirm the amount, destination, date and transfer method. Ask your bank or provider for the investigation process. For an ACH entry, the <Link href="/company/blog/ach-trace-number" prefetch={false}>trace-number article</Link> explains which details help.</p>
      <p>For a refund, link the request to the original receipt and use the bank or provider’s approved process. Verify the requester and any new destination through a known contact. Avoid sending a separate payment while a return or refund is already in progress.</p>
      <p>Refund options and recovery rules vary by transfer method and provider. Do not promise that every transfer can be canceled or that every received payment is beyond challenge. Keep the refund or return reference with the original payment and invoice.</p>
      <p>If your business instead needs to collect authorized debits, review <Link href="/services/ach-payments" prefetch={false}>Trolleys’ ACH payment service</Link>. Availability, fees, limits and payout terms depend on the merchant account.</p>
    </section>
  </BlogArticlePage>;
}
