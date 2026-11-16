import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { invoiceDiscrepanciesArticle } from "./invoice-discrepancies-content";

export function InvoiceDiscrepanciesPage() {
  return <BlogArticlePage article={invoiceDiscrepanciesArticle}>
    <p>Recalculating an invoice can tell you whether the numbers add up. It cannot tell you whether the customer agreed to that price, received that quantity or has already paid part of the bill.</p>
    <p>That is why an invoice discrepancy needs more than a corrected total. It is a difference between the bill and the records behind it. BILL’s overview includes duplicate invoices, incorrect prices, timesheet errors and missing information among the common causes. Each points to a different place to investigate.</p>
    <p>Whether you issued the invoice or received it, the first useful question is the same: which part of the bill disagrees with which record? Answering that precisely gives both businesses something they can resolve.</p>

    <section id="find-the-disagreement" aria-labelledby="find-the-disagreement-title">
      <h2 id="find-the-disagreement-title">Find the disagreement behind the number</h2>
      <p>A price dispute starts with the quote, purchase order or contract that applies to the work. Check any approved change as well. An old price list might explain how the wrong figure reached the invoice, but it does not establish which price the parties agreed to use.</p>
      <p>Quantity needs a separate check. Microsoft’s invoice-matching documentation distinguishes comparing invoice prices with purchase order prices from also comparing billed quantities with receipt records. Those checks answer different questions. Fixing the unit price alone can leave the quantity wrong.</p>
      <p>If only part of an order arrived, establish what the agreement says about billing that delivery. The purchase order may describe the full order while the receipt records only one shipment. A mismatch deserves an explanation; it does not, by itself, establish that either document is false.</p>
      <p>For services, the equivalent evidence may be approved hours, a completed milestone or the period covered. A monthly charge can be correct for one period and duplicated in another. Look at what the line represents before deciding that an identical amount means the same work was billed twice.</p>
      <p>Possible duplicate invoices need payment history as well as document history. Another copy, a reminder and a new charge can look similar in an inbox. Compare the invoice reference, underlying order and any payment already applied. If you are the seller, make those distinctions visible rather than leaving the customer to infer them.</p>
      <p>Keep extra charges visible during the review. Delivery, discounts and tax can change the final amount even when the main line is right. Recalculate the invoice, then check the disputed charge against the applicable terms or ask the responsible billing or tax specialist to explain it.</p>
      <p>When raising the issue, identify the invoice and line, the difference you found and the document supporting your position. A specific question about a rate or delivery gives the other party a starting point. Calling the entire invoice wrong leaves them to repeat the investigation.</p>
    </section>

    <section id="make-the-correction-visible" aria-labelledby="make-the-correction-visible-title">
      <h2 id="make-the-correction-visible-title">Make the correction visible on both sides</h2>
      <p>Changing a number in your own spreadsheet does not tell the other business what happened. Agree whether the issue calls for an explanation, a replacement invoice or an adjustment, then use the correction process appropriate to the invoice and your accounting requirements.</p>
      <p>Stripe’s credit-note documentation illustrates an important distinction. A credit note reduces an invoice amount without voiding and replacing the original invoice. On an open invoice, it reduces what remains due. It is an adjustment to the bill, not a record that the customer sent money.</p>
      <p>If the customer already paid, decide what happens to the resulting credit. Stripe distinguishes a credit toward the customer’s invoice balance, a refund through its platform and a refund recorded outside it. Issuing a credit note does not automatically return money to the customer’s payment method.</p>
      <p>Make the agreed outcome explicit in the message accompanying the correction. The customer should know whether they owe a reduced balance, will receive a refund or have credit to use later. Our article on <Link href="/company/blog/important-invoice-management-tips" prefetch={false}>invoice management</Link> explains why keeping that conversation with the balance matters.</p>
      <p>Keep the original document and the linked correction. The IRS identifies invoices, receipts and paid bills as supporting records for entries in the books. Someone reviewing the account later should be able to follow the change without relying on the employee who remembers the conversation.</p>
      <p>Before releasing another payment or sending another reminder, check what has already been paid and what the correction leaves outstanding. Agree how the disputed and undisputed portions will be handled under the contract while the issue is being resolved. A payment reminder should reflect that agreement.</p>
      <p>Then correct the source of the error. Update the obsolete rate, the customer record or the process that confused a reminder with a new bill. Correcting each invoice manually while leaving the same faulty input in place makes the next disagreement predictable. The approval controls discussed in <Link href="/company/blog/an-accounts-payable-internal-controls-checklist" prefetch={false}>accounts payable controls</Link> can help define who reviews changes before money moves.</p>
    </section>

    <section id="check-the-payment-destination" aria-labelledby="check-the-payment-destination-title">
      <h2 id="check-the-payment-destination-title">A familiar amount does not verify new bank details</h2>
      <p>A bill can match the order perfectly and still contain a dangerous change to its payment instructions. Treat that as a separate question from whether the goods, work or total are correct.</p>
      <p>The FBI’s Internet Crime Complaint Center recommends verifying changes to account information through a separate channel with the intended recipient. Use a trusted contact route before redirecting a payment. Confirmation from the same email conversation is not an independent check if that conversation has been compromised.</p>
      <p>A billing mistake, a disagreement about the work and a suspicious payment destination call for different responses. Keep those questions separate. The resolution is complete when both sides understand the correction, the remaining balance is accurate and any money still due has a verified destination.</p>
    </section>
  </BlogArticlePage>;
}
