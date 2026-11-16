import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { invoiceReconciliationArticle } from "./invoice-reconciliation-content";
import s from "./blog.module.css";

export function InvoiceReconciliationPage() {
  return <BlogArticlePage article={invoiceReconciliationArticle}>
    <p>An order arrives in parts. So do the supplier’s invoices. Each bill carries a valid order number and an agreed price, and someone can find a delivery record to support it. That can look like enough to approve payment.</p>
    <p>One question remains: how much of that delivery has already been matched to another invoice?</p>
    <p>For a merchant buying stock, invoice reconciliation connects the supplier’s bill to the purchase and receiving records. The problem here is on the purchasing side, before paying a supplier. As deliveries and invoices accumulate, reviewing each document in isolation can lose track of the quantities already accounted for.</p>
    <p>Microsoft’s three-way matching documentation compares invoice prices with purchase order prices and invoice quantities with the selected receipt records. Oracle also describes matching invoices to receipts as a way to handle partial shipments. The connection between those documents matters as much as having them all on file.</p>

    <section id="track-the-remaining-quantity" aria-labelledby="track-the-remaining-quantity-title">
      <h2 id="track-the-remaining-quantity-title">Keep the remaining quantity visible</h2>
      <p>Consider a simple quantity illustration, with no prices involved. An order covers 100 identical units. The first delivery contains 60 and the second contains 40. The supplier sends two invoices for 50 units each, as the agreed billing arrangement permits.</p>
      <p>Both invoices can be legitimate. They still need the right allocation:</p>
      <table className={s.comparison}>
        <caption>How two invoices use the received quantities</caption>
        <thead><tr><th scope="col">Invoice</th><th scope="col">Receipt allocation</th></tr></thead>
        <tbody>
          <tr><th scope="row">First invoice<br />50 units</th><td><span className={s.comparisonLabel} aria-hidden="true">Receipt allocation</span>Use 50 of the first delivery’s 60 units. That leaves 10 available from the first delivery.</td></tr>
          <tr><th scope="row">Second invoice<br />50 units</th><td><span className={s.comparisonLabel} aria-hidden="true">Receipt allocation</span>Use the remaining 10 from the first delivery and all 40 from the second. All 100 received units are now accounted for.</td></tr>
        </tbody>
      </table>
      <p>If the second reviewer assigns another 50 units entirely to the first delivery, the record now allocates 100 units against a receipt for 60. The second receipt incorrectly appears unused. The invoices themselves have not become false; the links behind their approval are wrong.</p>
      <p>That is not proof that the business has already overpaid. The two invoices still total the 100 units ordered and received. It is a control failure that can mislead the next review, especially if someone treats the apparently unused receipt as support for another bill.</p>
      <p>Keep the invoice line, purchase order line, receipt line and allocated quantity connected. Show what earlier invoices used and what remains available. Oracle’s matching documentation describes updating billed quantities and amounts on purchase order schedules; that running record is more useful than a folder of documents individually marked checked.</p>
      <p>Pending approvals need attention too. If two people review separate invoices at the same time, both should be able to see quantities already committed to the other review. Verify how your system handles that overlap. An invoice waiting to be paid does not make its matched delivery available to support another charge.</p>
    </section>

    <section id="define-what-approval-means" aria-labelledby="define-what-approval-means-title">
      <h2 id="define-what-approval-means-title">Define what the match allows you to approve</h2>
      <p>A label such as three-way matching is useful shorthand, but it does not describe every check your business needs. Microsoft separately documents price, quantity and charge comparisons, with configurable tolerances. Find out which differences your setup actually checks and who can approve an exception.</p>
      <p>Delivery and acceptance can also be different events. Oracle’s four-way approval adds quantities accepted after inspection to the purchase order, receipt and invoice comparison. If your agreement requires inspection before payment approval, a warehouse receipt alone may leave that requirement unfinished.</p>
      <p>For services, define the evidence around the work: approved hours for a stated period, or acceptance of a specified milestone. The person who authorized the purchase may not be the person confirming completion. Make those responsibilities clear before the invoice enters review.</p>
      <p>An agreed advance payment needs its own documented approval route. Do not record goods as received simply to make an advance invoice pass a receipt-based check. The records should explain why the payment is permitted at that point in the agreement.</p>
      <p>Corrections need the same precision. A reduction in price does not mean the goods were never received. A return of goods changes a different part of the record. Preserve the reason for the adjustment and use the system’s appropriate reversal or correction process before changing quantities available for later matching. Our article on <Link href="/company/blog/types-of-invoice-discrepancies" prefetch={false}>invoice discrepancies</Link> covers agreeing the underlying correction.</p>
      <p>Finally, keep matching, payment approval and payment completion distinct. A bill can pass a document comparison and still await an authorized payment decision. The <Link href="/company/blog/an-accounts-payable-internal-controls-checklist" prefetch={false}>accounts payable controls article</Link> follows the later steps, including checking the payment destination.</p>
      <p>The useful result is a record another person can follow: what was ordered, what arrived or was accepted, which invoice used it and what remains. That lets the next bill be reviewed against the current position, without counting the same delivery again.</p>
    </section>
  </BlogArticlePage>;
}
