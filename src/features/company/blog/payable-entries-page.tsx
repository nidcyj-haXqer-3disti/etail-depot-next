import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { payableEntriesArticle } from "./payable-entries-content";
import s from "./blog.module.css";

const payableEntries = [
  ["Record the bill", "Debit repairs expense and credit accounts payable for the accepted bill amount.", "The expense and supplier liability increase. Cash has not moved."],
  ["Record the supplier credit", "Debit accounts payable and credit repairs expense for the approved overcharge credit.", "The amount owed and the repair expense decrease. This is not a cash refund."],
  ["Pay the remaining balance", "Debit accounts payable and credit cash for the remaining amount paid.", "This bill’s payable balance is cleared and cash decreases. The repair expense is not recorded again."],
] as const;

export function PayableEntriesPage() {
  return <BlogArticlePage article={payableEntriesArticle}>
    <section id="recognize-the-purchase" aria-labelledby="recognize-the-purchase-title">
      <h2 id="recognize-the-purchase-title">Identify the purchase before choosing accounts</h2>
      <p>Match the supplier document to what was received and the applicable accounting period. Placing an order for future delivery does not, by itself, prove that the goods arrived. Equipment, inventory, prepaid services and current expenses can require different accounts even when their invoices look similar.</p>
      <p>A credit to accounts payable increases the liability; a debit reduces it. Total debits and credits must balance within each entry. That does not mean every individual account must end with equal debit and credit totals. An unpaid supplier balance can remain in the payable account.</p>
      <p>The <Link href="/company/blog/accounts-payable-vs-accounts-receivable" prefetch={false}>difference between payables and receivables</Link> is whose obligation you are recording: money your business owes a supplier or money a customer owes your business.</p>
      <p><strong>Check whether the bill has already created the accounting entry.</strong> Accounting software may post it when you save or approve the bill. Do not add a manual journal entry for the same purchase if it is already recorded.</p>
    </section>
    <section id="follow-the-entries" aria-labelledby="follow-the-entries-title">
      <h2 id="follow-the-entries-title">Follow the bill, credit and payment</h2>
      <p>Assume completed maintenance qualifies as a current repair expense under the business’s accrual accounting policy. Before payment, the supplier approves a credit for part of an overcharge. The bill and credit belong to the same accounting period, with no tax, discounts or other adjustments. The remaining balance is then paid directly from cash.</p>
      <figure className={s.accountingJournal}>
        <figcaption>One repair bill through three accounting events</figcaption>
        <ol role="list">{payableEntries.map(([event, entry, result]) => <li key={event}>
          <h3>{event}</h3>
          <p className={s.accountingEntry}>{entry}</p>
          <p className={s.accountingNote}>{result}</p>
        </li>)}</ol>
      </figure>
      <p>Across this sequence, the repair expense is the accepted bill less the supplier credit. Paying the balance settles the obligation. It does not create another repair expense.</p>
      <p>If you make only a partial payment, debit accounts payable and credit cash for that payment amount. The unpaid remainder stays in accounts payable. Apply both the credit and payment to the correct supplier bill so the detail agrees with the <Link href="/company/blog/accounting-ledgers" prefetch={false}>ledger balance</Link>.</p>
    </section>
    <section id="handle-exceptions" aria-labelledby="handle-exceptions-title">
      <h2 id="handle-exceptions-title">Correct the record that actually changed</h2>
      <p>If an unpaid invoice was entered in error and no goods or services were received, correcting it affects accounts payable and the account originally debited. <strong>Reversing an unpaid bill does not move cash.</strong> No payment occurred.</p>
      <p>If money was already sent, track the supplier credit and any expected refund separately. A credit available against a future bill is not evidence that money has returned to your bank account. The treatment depends on the original purchase and what the supplier actually provided.</p>
      <ul>
        <li><strong>Keep the support.</strong> Retain the bill, evidence of goods or services received, credit note and payment reference as applicable.</li>
        <li><strong>Check the period and account.</strong> Review the acquisition date, the period the service covers and the chart of accounts. The invoice date alone may not settle the treatment.</li>
        <li><strong>Prevent duplicates.</strong> Search by supplier and invoice reference, including amended documents. A corrected copy should not create a second bill for the same obligation.</li>
      </ul>
      <p>Use the approved correction process for locked periods or significant prior errors, and ask your accountant which period and accounts to use. This repair sequence explains the mechanics; it does not make every supplier purchase a current expense or put every correction in the latest month.</p>
    </section>
  </BlogArticlePage>;
}
