import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentReferencesArticle } from "./payment-references-content";
import s from "./blog.module.css";

const referencePurposes = [
  ["Customer code", "The customer’s account in your own records.", "It may not identify which of several invoices the payment covers."],
  ["Invoice reference", "The bill the payer intends to pay.", "It still needs to be checked against the amount and payment received."],
  ["Bank transaction or ACH trace reference", "The payment entry used for bank or provider investigation.", "It does not replace the customer’s explanation of which invoices to pay."],
] as const;

export function PaymentReferencesPage() {
  return <BlogArticlePage article={paymentReferencesArticle}>
    <p>A payment reference is useful only if it reaches the record your accounts team uses. Check the receipt and export before asking customers to rely on a field called a memo, description or customer reference. If the provider supplies a required reference, preserve it exactly.</p>
    <section id="choose-reference" aria-labelledby="choose-reference-title">
      <h2 id="choose-reference-title">Choose a reference your team can use</h2>
      <p>Decide whether you need to identify the customer, the invoice or both. The clearest instruction is one your customer can follow and your accounts team can use without guessing.</p>
      <table className={s.comparison}>
        <caption>These identifiers answer different questions</caption>
        <thead><tr><th scope="col">Reference</th><th scope="col">Identifies</th><th scope="col">Keep in mind</th></tr></thead>
        <tbody>{referencePurposes.map(([reference, identifies, limit]) => <tr key={reference}>
          <th scope="row">{reference}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Identifies</span>{identifies}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Keep in mind</span>{limit}</td>
        </tr>)}</tbody>
      </table>
      <p>For one payment per invoice, a short invoice identifier can make the allocation clear, if the receiving service supports it. A customer name alone may leave several open invoices that could match.</p>
      <p>When a customer pays several invoices together, ask for a separate allocation list if the reference field cannot hold the necessary detail. Remittance advice is the payer’s explanation of which invoices and amounts the transfer covers. Keep it with the receipt.</p>
      <p>Use a concise business identifier. Avoid putting full bank details, personal information or confidential project descriptions in a field that may appear on statements or exports. The <Link href="/company/blog/accepting-bank-transfers-for-business-payments" prefetch={false}>bank transfer receiving article</Link> covers the wider invoice and receipt process.</p>
    </section>
    <section id="test-reference" aria-labelledby="test-reference-title">
      <h2 id="test-reference-title">Check what reaches your records</h2>
      <p>Do not assume that every service accepts the same length or characters. Nacha defines payment information fields for ACH, but notes that the receiving bank may or may not display that information, depending on its capabilities and how the customer accesses the record.</p>
      <ol>
        <li><strong>Confirm the field.</strong> Ask which reference or payment information field customers should use, including any required format or provider-generated value.</li>
        <li><strong>Check submission.</strong> Use the provider’s test process, or a separately agreed payment, to enter the reference as a customer would. Include any spaces or punctuation your instructions require.</li>
        <li><strong>Inspect the receipt and export.</strong> Check the actual bank or provider record your team uses. Look for missing text, changed characters or a reference that appears on screen but not in the export.</li>
        <li><strong>Try the match.</strong> Confirm that the received reference identifies the intended customer or invoice. Also check what happens when it is missing or matches more than one open item.</li>
      </ol>
      <p>If your provider allocates payments automatically, review its matching rules and exception controls. Some services use references first and other matching rules when those references are absent. Do not assume every system stops for manual review.</p>
    </section>
    <section id="review-matches" aria-labelledby="review-matches-title">
      <h2 id="review-matches-title">Review uncertain matches</h2>
      <p>Customers may omit a reference, reuse an old one or combine several invoices. Treat an unclear allocation as something to resolve, even when the customer name or amount looks familiar.</p>
      <p>Confirm that funds were received, then ask a known customer contact which invoices they intended to pay. Record any partial payment, excess amount or agreed adjustment rather than quietly forcing a match. Keep the allocation decision with the payment record.</p>
      <p>If the question is where the money went, ask the bank or provider for the relevant transaction reference and investigation process. An <Link href="/company/blog/ach-trace-number" prefetch={false}>ACH trace number</Link> helps identify an ACH entry; an invoice reference helps explain the intended allocation.</p>
      <p>Retain both. A useful invoice label does not move money, authorize a debit or establish receipt on its own.</p>
    </section>
  </BlogArticlePage>;
}
