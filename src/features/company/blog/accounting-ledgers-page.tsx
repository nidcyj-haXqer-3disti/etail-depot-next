import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { accountingLedgersArticle } from "./accounting-ledgers-content";
import s from "./blog.module.css";

const saleEntries = [
  ["Record the earned credit sale", "Debit accounts receivable and credit service revenue for the invoice amount.", "Revenue is recorded and the customer owes the invoice amount."],
  ["Receive part of the payment", "Debit cash and credit accounts receivable for the amount received.", "Cash increases and the customer’s unpaid balance decreases. Revenue does not increase again."],
  ["Receive the remaining balance", "Debit cash and credit accounts receivable for the remaining amount received.", "The invoice balance is cleared. The original sale is still the only revenue from this work."],
] as const;

export function AccountingLedgersPage() {
  return <BlogArticlePage article={accountingLedgersArticle}>
    <section id="journal-to-ledger" aria-labelledby="journal-to-ledger-title">
      <h2 id="journal-to-ledger-title">Follow the entry from transaction to account</h2>
      <p>A journal records transactions in date order. Posting assigns each part of an entry to its ledger account, where it contributes to a running balance. Accounting software may perform these steps together, but the connection between the transaction and the account still matters.</p>
      <p>In a double entry system, an entry’s total debits equal its total credits. Debit and credit describe accounting sides, not universal synonyms for money in and money out. An asset increase normally uses a debit; a liability increase normally uses a credit.</p>
      <p>Retain the entry date, description, account, amount and source reference. Where software posts automatically, review which accounts it selects and which date it uses. Being imported does not by itself mean an entry is complete or correctly classified.</p>
      <p><strong>A balanced entry can still be wrong.</strong> It could use the wrong account, fall in the wrong period or duplicate an event already recorded. Follow the source transaction before accepting a total.</p>
    </section>
    <section id="trace-a-sale" aria-labelledby="trace-a-sale-title">
      <h2 id="trace-a-sale-title">Trace a sale and its payments</h2>
      <p>Assume a service business has completed work that qualifies for revenue recognition under its accrual accounting rules and invoices the customer on credit. The customer pays part of the invoice, then the rest. This simplified sequence assumes the receipts reach cash directly, with no tax, fees, discounts or other adjustments.</p>
      <figure className={s.accountingJournal}>
        <figcaption>One sale, separate entries for the payments</figcaption>
        <ol role="list">{saleEntries.map(([event, entry, effect]) => <li key={event}>
          <h3>{event}</h3>
          <p className={s.accountingEntry}>{entry}</p>
          <p className={s.accountingNote}>{effect}</p>
        </li>)}</ol>
      </figure>
      <p>The receivables account contains the original invoice and both reductions. The cash account contains the receipts. The revenue account contains the original recognition, not another sale each time the customer pays.</p>
      <p><strong>Match a bank import to the existing payment before treating it as new income.</strong> A bank line and a recorded receipt may describe the same event. Intuit’s bank matching guidance makes this distinction explicit: matching connects an existing record, while categorizing an unmatched transaction creates a new record.</p>
      <p>Review the amount, date and reference rather than accepting a suggested match without checking it. Fees or grouped deposits can explain why a bank amount differs from an individual payment. Investigate that difference instead of adding another sale to make the totals agree.</p>
    </section>
    <section id="control-and-detail" aria-labelledby="control-and-detail-title">
      <h2 id="control-and-detail-title">Connect totals to supporting detail</h2>
      <p>The general ledger may show one receivables control account: the total recorded customer balance. A subsidiary ledger supplies the detail for each customer and invoice. Compare those totals at the same cutoff and investigate any difference rather than changing the customer list to fit.</p>
      <p>That detail also helps distinguish customer debts from supplier obligations. Our <Link href="/company/blog/accounts-payable-vs-accounts-receivable" prefetch={false}>accounts payable and receivable article</Link> explains the two sides and their payment timing.</p>
      <ul>
        <li><strong>Check completeness.</strong> Confirm that the relevant transactions were posted, including credits, adjustments and payments. Look for missing records and repeated imports.</li>
        <li><strong>Check classification.</strong> Review the account and period against the supporting documents. Equal debit and credit totals do not prove either choice is correct.</li>
        <li><strong>Keep the correction trail.</strong> Use the system’s authorized correction process. Preserve the original reference, reason and approval, and ask your accountant about unfamiliar adjustments.</li>
      </ul>
      <p>A trial balance checks whether the ledger’s debit and credit balances total equally. Reconciliation asks whether the balances agree with their supporting records, allowing for explained differences. They answer related but different questions.</p>
      <p>Ledger balances feed financial statements such as the <Link href="/company/blog/read-a-balance-sheet" prefetch={false}>balance sheet</Link>. Keep the path from the report to the account, entry and source document clear so a reviewer can understand how the result was formed.</p>
    </section>
  </BlogArticlePage>;
}
