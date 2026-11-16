import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { invoiceNumberArticle } from "./invoice-number-content";

export function InvoiceNumberPage() {
  return <BlogArticlePage article={invoiceNumberArticle}>
    <p>Two invoices can carry the same number without either being a duplicate. Stripe documents this for Connect: when invoices are issued on behalf of separate merchant accounts, their prefixes and sequence numbers can match, even for the same customer. Each issuing merchant has its own sequence.</p>
    <p>That is a useful warning for anyone searching a spreadsheet by invoice number alone. The reference identifies a bill within a particular set of records. You also need to know which business issued it.</p>
    <p>Most customers will never think about your numbering system until something goes wrong. They cannot find the bill, your reminder appears to request a second payment, or their finance team has a payment you cannot locate. At that point, a consistent reference is more useful than a clever format.</p>

    <section id="keep-the-whole-reference" aria-labelledby="keep-the-whole-reference-title">
      <h2 id="keep-the-whole-reference-title">Keep the whole reference</h2>
      <p>An invoice number identifies a specific invoice. A customer number identifies the customer, and a purchase order identifies the buyer’s order. One customer can receive many invoices; one order may be billed in stages. Label these references separately rather than asking the recipient to guess which one to quote.</p>
      <p>A prefix can be part of the identity, not just decoration. Stripe offers numbering by customer, with a separate prefix and sequence for each, or numbering across the account, with a common prefix and one sequence. Removing the prefix from a customer’s reference can therefore remove the part that distinguishes their bill.</p>
      <p>Carry the complete reference into the invoice email, reminder and payment instructions. Keep the issuing business recognizable in each. If your customer’s portal assigns its own tracking number, retain that alongside your invoice number rather than replacing the reference on the document you already sent.</p>
      <p>The buyer’s software may rely on this consistency too. Oracle Fusion Payables requires invoice numbers to be unique for each supplier when importing invoices. A duplicate number for that supplier prevents the import from creating another invoice. Renaming an existing bill to get past a rejection can defeat the very check that is asking you to investigate.</p>
      <p>A match still needs context. Check the supplier, customer, amount, currency and underlying order before deciding that two records describe the same charge. An invoice number alone proves neither that the request is genuine nor that it has been paid.</p>
    </section>

    <section id="another-copy-is-the-same-bill" aria-labelledby="another-copy-is-the-same-bill-title">
      <h2 id="another-copy-is-the-same-bill-title">Another copy is still the same bill</h2>
      <p>When someone asks you to send an invoice again, retrieve the issued document. Keep its number and date, identify the message as a resend, and show the current balance where appropriate. Creating a fresh invoice because the first email was lost gives the customer another charge to investigate.</p>
      <p>A correction is different. If the agreed price or billed work has changed, use the correction process supported by your accounting system and the requirements that apply to the invoice. Keep the original reference visible in the record of what changed.</p>
      <p>Stripe, for example, does not let you delete a finalized invoice. Cancellation uses a void status, while substantive revisions can require a replacement invoice. The important relationship is between the original document and its correction, including which one remains payable. Two unexplained PDFs leave that work to the customer.</p>
      <p>Where a credit note is appropriate, give it its own reference and connect it to the affected invoice. Our article on <Link href="/company/blog/credit-notes" prefetch={false}>credit notes and refunds</Link> explains why the correction and the movement of money need to remain distinguishable.</p>
    </section>

    <section id="change-software-without-losing-the-history" aria-labelledby="change-software-without-losing-the-history-title">
      <h2 id="change-software-without-losing-the-history-title">New software should not erase the history</h2>
      <p>Moving systems is an easy moment to overlook old invoice references. Before issuing the first bill from the new system, establish which numbers have already been used and how open invoices will be carried across. Stripe allows the next sequence number to be set above numbers already used, supporting continuity when migrating.</p>
      <p>Keep the original references on imported records wherever the system permits. If it assigns new internal identifiers, retain a searchable connection to the references customers have. A customer replying to last month’s invoice should not need to know that you changed software yesterday.</p>
      <p>Do not assume a fresh calendar year means the same bare numbers can be reused. Numbering rules vary. For full UK VAT invoices, HMRC specifies a unique sequential number from one or more series and allows letters as well as digits. That is a UK VAT requirement, not a universal rule for every invoice. Check the requirements relevant to your business before changing or restarting a series.</p>
      <p>The format can stay simple. Let the billing system assign references consistently, preserve issued documents and make the number easy to find. The article on <Link href="/company/blog/create-an-invoice" prefetch={false}>creating a clear invoice</Link> covers the other information that belongs around it.</p>
      <p>The test comes after the invoice leaves your desk: can the customer, your accounts team and the next system still find the same bill? A good invoice number keeps that conversation attached to the right record.</p>
    </section>
  </BlogArticlePage>;
}
