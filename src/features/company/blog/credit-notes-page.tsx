import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { creditNotesArticle } from "./credit-notes-content";

export function CreditNotesPage() {
  return <BlogArticlePage article={creditNotesArticle}>
    <p>QuickBooks Online can automatically apply a customer credit to their oldest unpaid invoice. If that setting is enabled, the credit can settle an earlier bill rather than remain available for the purchase the customer just called about.</p>
    <p>The software may have followed its instructions perfectly. The customer may still be waiting for a refund. “We have credited your account” leaves room for both sides to believe something different happened.</p>
    <p>A credit note documents a reduction to an invoice, such as an agreed price correction or credit for returned goods. Some systems use the term credit memo. The document explains the adjustment. It does not, by itself, prove that money reached the customer’s card or bank account.</p>

    <section id="decide-where-the-credit-goes" aria-labelledby="decide-where-the-credit-goes-title">
      <h2 id="decide-where-the-credit-goes-title">Decide where the credit goes</h2>
      <p>Start with the invoice and the payments already recorded against it. If the invoice is unpaid, the adjustment can reduce what remains due. If it is partly paid, calculate the corrected charge against the payment already received. Depending on those amounts, the customer may still owe something or may have paid too much.</p>
      <p>For an invoice already paid in full, there is no outstanding balance on that invoice to collect. The resulting credit needs a destination. Stripe distinguishes refunding the payment, adding credit to the customer’s invoice balance and recording an adjustment made outside its platform. Choose the treatment that matches the agreed resolution and applicable requirements.</p>
      <p>Those outcomes are not interchangeable from the customer’s perspective. A credit for future purchases may be welcome to someone who intends to order again. It does not accomplish the same thing as the refund you promised a customer who is leaving. Confirm the intended outcome before letting a default setting decide it.</p>
      <p>Allocation matters even when both sides want an account credit. In QuickBooks, automatic application can carry any excess credit from the oldest unpaid invoice to the next one. Without automatic application, an invoice and an unapplied credit can both remain open. Check the affected invoices instead of assuming that creating the document finished the job.</p>
      <p>Keep the correction traceable: the original invoice, the affected item or amount, the reason, the credit’s reference and date, and the resulting balance. Stripe recommends linking credits to invoice line items where possible. That makes the adjustment easier to follow than an unexplained reduction to a total.</p>
      <p>The original invoice and the correction tell the story together. A credit note in Stripe reduces the invoice without replacing it. Use the correction workflow appropriate to your system and invoicing requirements, including any tax adjustment; quietly changing the customer’s original bill can leave the two businesses working from different records.</p>
    </section>

    <section id="the-refund-needs-its-own-evidence" aria-labelledby="the-refund-needs-its-own-evidence-title">
      <h2 id="the-refund-needs-its-own-evidence-title">A refund needs its own evidence</h2>
      <p>If the resolution is a refund, establish whether money has already been returned before starting another one. Stripe’s credit note integration supports linking an existing refund as well as creating a new refund. That distinction matters when customer support has acted in the payment dashboard before the accounting team prepares the correction.</p>
      <p>A refund and a credit note can properly describe the same adjustment. The error is giving the customer the refund while also leaving a separate, spendable credit for the same amount unintentionally. Connect the records and verify the remaining account balance. Do not count each document as another benefit owed.</p>
      <p>Follow the refund beyond the button click. Stripe documents pending and failed refund outcomes, and provides payment references for tracing some refunds with the customer’s bank. Availability varies. Use the actual provider status and available reference rather than treating a credit note PDF as evidence that a transfer completed.</p>
      <p>If the customer cannot see the money, investigate the existing refund first. Confirm the original payment, amount, currency and current status. Sending another refund simply because the first is not yet visible can create a second problem. If a refund has failed, resolve it through the provider’s supported process and keep the customer informed.</p>
      <p>Make the message specific enough to be useful: identify the invoice whose balance was reduced, the credit retained for future invoices or the refund submitted to the original payment method. State the remaining amount due where relevant. “Credited” should not require the customer to inspect three systems to learn what you meant.</p>
    </section>

    <p>There is one more reporting trap. Stripe notes that a credit note which reduces an open invoice’s balance to zero changes its status to paid without recording a payment. A cleared balance is therefore not always a successful collection. Our article on <Link href="/company/blog/invoice-vs-receipt" prefetch={false}>invoices and receipts</Link> looks at the evidence behind that label.</p>
    <p>Before the next statement or reminder goes out, check that it reflects the adjustment and any refund allocation. The discussion of <Link href="/company/blog/statement-vs-invoice" prefetch={false}>statements versus invoices</Link> explains why repeating an old balance can undo a useful correction. The customer should be able to see what changed, where the credit went and whether anything remains to be paid.</p>
  </BlogArticlePage>;
}
