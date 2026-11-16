import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { invoiceReceiptArticle } from "./invoice-receipt-content";

export function InvoiceReceiptPage() {
  return <BlogArticlePage article={invoiceReceiptArticle}>
    <p>A customer asks for a receipt after paying. Sending the invoice again, this time marked Paid, seems like a reasonable answer. But the person asking may need to show when the payment happened, how much it covered or which card was used. The document can be accurate and still leave their question unanswered.</p>
    <p>The distinction between an invoice and a receipt is about that evidence. An invoice explains the charges and the amount requested. A payment receipt records a payment against a purchase or bill. One describes what the customer owes; the other helps explain how money was paid.</p>
    <p>The two can share a document. Stripe, for instance, supports itemized paid invoices after a purchase as well as payment receipts. There is no need to insist on two PDFs if one contains the information the customer needs. The problem is treating a label as a substitute for that information.</p>

    <section id="what-cleared-the-balance" aria-labelledby="what-cleared-the-balance-title">
      <h2 id="what-cleared-the-balance-title">What cleared the balance?</h2>
      <p>An invoice can show nothing left to collect without a new payment passing through the invoicing provider. Stripe allows a business to mark an invoice paid when the customer paid outside Stripe. Its documentation also explains that a credit note reducing an open invoice’s balance to zero changes its status to paid, without recording a payment.</p>
      <p>Those are useful functions. A bank transfer received elsewhere still needs to be reflected in the bill. An agreed reduction needs to stop the business chasing money no longer owed. But a payment and a reduction in the amount owed are different explanations for the same remaining balance.</p>
      <p>Before sending proof to the customer, look at the entries behind the status. If payment arrived elsewhere, connect its confirmation to the invoice. If a credit cleared the balance, show the credit and the reason for it. Do not describe a reduction as money received.</p>
      <p>For a payment receipt, make the amount, currency, date and relevant invoice or order reference easy to find. Identify the payment method using the safe details supplied by the provider, rather than copying full card or bank credentials. Keep the receipt tied to the confirmed transaction.</p>
      <p>Confirmation also has a timing boundary. Stripe sends payment receipts after success, including waiting for confirmation on methods that take longer. An order acknowledgment or a message saying payment is being processed should not be presented as a completed payment receipt.</p>
    </section>

    <section id="keep-each-payment-visible" aria-labelledby="keep-each-payment-visible-title">
      <h2 id="keep-each-payment-visible-title">A deposit needs its own answer</h2>
      <p>Suppose a customer pays a deposit and settles the balance later. The first receipt should make clear what that first payment covered. It should not imply that the whole bill is paid simply because the invoice total also appears on the page.</p>
      <p>Keep the original charge, the payments applied and the amount still due distinguishable. Stripe’s partial-payment workflow updates the paid and remaining amounts when a payment succeeds. That is the distinction a customer needs to see too: the amount of this payment is not necessarily the total paid to date.</p>
      <p>When the final payment arrives, retain both payment records. A person checking their card statement should be able to connect each charge to the same purchase without wondering whether the business billed them twice. Our article on <Link href="/company/blog/create-an-invoice" prefetch={false}>creating an invoice</Link> covers making the underlying charges clear.</p>
      <p>A later refund adds another event. Keep the original payment record, then connect the refund confirmation and any relevant credit document to it. Reducing the original receipt to the amount retained would hide why the customer’s statement shows a larger charge followed by money returned.</p>
      <p>For a business customer, these connections can matter more than the document title. The IRS notes that a combination of supporting documents may be needed to substantiate a purchase or expense. An itemized bill can explain what was bought while a payment record supplies a different part of the evidence. Our article on <Link href="/company/blog/expense-receipts" prefetch={false}>expense receipts</Link> looks at the questions a reimbursement reviewer may still need answered.</p>
      <p>When someone asks for a receipt, start with the payment they are trying to trace. Send a record that identifies it, explains what it covered and makes any remaining balance or later adjustment understandable. The customer should be able to finish their own records without asking your team to explain the same transaction again.</p>
    </section>
  </BlogArticlePage>;
}
