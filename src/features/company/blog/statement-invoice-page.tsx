import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { statementInvoiceArticle } from "./statement-invoice-content";

export function StatementInvoicePage() {
  return <BlogArticlePage article={statementInvoiceArticle}>
    <p>You receive an invoice, approve it and schedule payment. Later, the supplier sends an account statement with that invoice listed again. Someone opening the new email needs to know whether anything remains to be paid.</p>
    <p>If the statement is entered as another bill, the same purchase can appear twice in the payment queue. If it is dismissed without review, a missing invoice or an incorrectly applied payment can go unnoticed. The document deserves attention for what it tells you about the account.</p>
    <p>An invoice explains a particular charge and its payment terms. A customer account statement brings together existing invoices, payments, credits or outstanding balances. It may ask you to settle what remains owed, but listing an invoice again does not create a second obligation for that purchase.</p>

    <section id="check-which-statement-you-have" aria-labelledby="check-which-statement-you-have-title">
      <h2 id="check-which-statement-you-have-title">Check which statement you have</h2>
      <p>Not every line on a statement represents an unpaid bill. QuickBooks Online offers different formats: Balance Forward shows invoices, payments and a balance for a period; Open Item lists unpaid invoices within its scope; Transaction Statement lists recorded transactions across a date range. Those views can answer different questions about the same account.</p>
      <p>Start with the account, currency and dates. If your business buys through several locations or customer accounts, check which ones the statement includes. QuickBooks, for example, can include a sub-customer’s transactions on the parent customer’s statement when that billing arrangement is configured.</p>
      <p>Then examine any balance carried forward. It can contain unpaid charges from before the statement period. Adding the old invoices to that opening balance again would count them twice. Ask for the invoices behind an unexplained opening figure instead of entering it as a fresh purchase.</p>
      <p>Read each payment and credit against the charge it reduces. A payment covering several invoices needs a clear allocation. A partial payment leaves a remainder; a credit may change what was owed. The closing total is useful only when you can trace how the account reached it.</p>
      <p>There is also a difference between an account balance and an amount already overdue. Check the individual due dates and any payment made since the statement was produced. Our article on <Link href="/company/blog/open-invoices" prefetch={false}>open invoices</Link> explains why a list of outstanding bills is not automatically a list of late customers.</p>
    </section>

    <section id="resolve-the-line-behind-the-total" aria-labelledby="resolve-the-line-behind-the-total-title">
      <h2 id="resolve-the-line-behind-the-total-title">Resolve the line behind the total</h2>
      <p>When your records disagree with the statement, a message saying the balance is wrong leaves the other person to reconstruct the problem. Identify the invoice number, the amount in question and what your records show instead.</p>
      <p>A missing invoice calls for a copy and enough detail to understand the charge. A payment that is absent from the account calls for its date, reference and intended invoice allocation. Confirm the payment’s actual outcome before asking the supplier to close the balance. A payment scheduled in your system may still be waiting to leave.</p>
      <p>For an agreed reduction, look for the adjustment record. Stripe documents credit notes as a way to reduce an invoice without replacing the original. It also makes clear that reducing the amount due does not record a payment. A statement should let the reader distinguish money received from a correction to the charge.</p>
      <p>If the original invoice was already recorded, handle the agreed correction against that record using your accounting system’s process. Do not add the statement total as another expense merely to make the figures agree. Ask the supplier to confirm the corrected allocation or balance, then retain the explanation with the affected documents.</p>
      <p>Keep the version you actually received when investigating a difference. QuickBooks notes that statements update when underlying transactions change. A newly generated copy can therefore need comparing with the earlier document, especially after a payment or correction has been recorded.</p>
      <p>The statement does not replace every supporting record. The IRS notes that documenting a purchase can require a combination of documents showing the payee, amount, payment evidence, date and description. Keep the invoice and relevant payment evidence connected. Our article on <Link href="/company/blog/invoice-vs-receipt" prefetch={false}>invoices and receipts</Link> explains what each contributes.</p>
    </section>

    <p>If you are the business sending statements, read yours from the customer’s side before sending it. Make the period, existing invoice references, recorded payments and remaining balance clear. Confirm that an agreed credit has actually reached the account. The customer should finish reading with fewer questions about what they owe.</p>
    <p>A useful statement brings the conversation back to the same records. Both sides can identify the charge, see what reduced it and agree what remains. That is a better reason to send another document than simply repeating a demand for payment.</p>
  </BlogArticlePage>;
}
