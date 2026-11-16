import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { accountingReconciliationArticle } from "./accounting-reconciliation-content";
import s from "./blog.module.css";

const accountEvidence = [
  ["Payables or receivables", "Compare the general ledger control balance with the supplier or customer detail.", "Trace differences to invoices, credits, payment allocations and receipts. The control total cannot identify the incorrect item on its own."],
  ["Prepayments", "Compare the remaining asset with the original payment and the expense allocation schedule.", "A bank debit supports the payment. The schedule and underlying agreement explain how much remains prepaid."],
  ["Cash", "Compare the cash account with the bank statement for the same account and cutoff.", "Identify outstanding checks, deposits and other differences. A timing item needs evidence and follow-up, not an arbitrary ledger adjustment."],
] as const;

export function AccountingReconciliationPage() {
  return <BlogArticlePage article={accountingReconciliationArticle}>
    <section id="set-the-boundary" aria-labelledby="set-the-boundary-title">
      <h2 id="set-the-boundary-title">Define what you are comparing</h2>
      <p>Choose one account, business entity, currency and cutoff date. A month end payable balance cannot be compared directly with a supplier list that includes next month’s invoices. Save the report versions and filters, and check whether each uses transaction date, posting date or another basis.</p>
      <p>An <Link href="/company/blog/accounting-ledgers" prefetch={false}>accounting ledger</Link> brings entries together by account. Reconciliation asks whether that balance agrees with the records supporting it, allowing for differences you can explain.</p>
      <table className={s.comparison}>
        <caption>Choose records that support the balance</caption>
        <thead><tr><th scope="col">Account</th><th scope="col">Compare</th><th scope="col">What to investigate</th></tr></thead>
        <tbody>{accountEvidence.map(([account, compare, investigate]) => <tr key={account}>
          <th scope="row">{account}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Compare</span>{compare}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to investigate</span>{investigate}</td>
        </tr>)}</tbody>
      </table>
      <p>Payables and receivables need separate supporting lists because one records supplier obligations and the other customer debts. Our <Link href="/company/blog/accounts-payable-vs-accounts-receivable" prefetch={false}>payables and receivables article</Link> explains the distinction.</p>
      <p>A second export of the same ledger may reproduce the same error. Ask what the comparison adds: transaction detail, a supplier statement, a bank record or a separately prepared schedule. Keep the invoices, receipts and payment records that support the entries.</p>
    </section>
    <section id="work-the-difference" aria-labelledby="work-the-difference-title">
      <h2 id="work-the-difference-title">Separate explanation from correction</h2>
      <p>Suppose the general ledger shows a higher payable balance than the supplier report for the same date. The review finds two causes: an invoice duplicated only in the general ledger, and a valid opening obligation recorded in both ledgers but excluded from the supplier report by a filter.</p>
      <ul>
        <li><strong>The duplicate needs an accounting correction.</strong> Confirm the original entry and supporting invoice, obtain the required approval and correct the duplicate using the system’s correction process.</li>
        <li><strong>The excluded item needs a report correction.</strong> Include the already recorded opening obligation in the report. Changing the filter does not create another bill.</li>
      </ul>
      <p><strong>Do not post the whole difference just to make the totals match.</strong> That would mix a bookkeeping error with a reporting error. Keep the causes and actions separate, then rerun the comparison.</p>
      <p>Equal totals can still hide a wrong allocation. If a receipt is assigned to the wrong customer, total receivables may agree with the general ledger while one customer appears unpaid and another owes too little. Check the payment reference and invoice allocation as well as the total.</p>
    </section>
    <section id="resolve-and-retain" aria-labelledby="resolve-and-retain-title">
      <h2 id="resolve-and-retain-title">Keep the evidence and open work together</h2>
      <p>Give each unmatched item a reason and a next action. An amount labelled “fee” or “rounding” still needs support; a write-off requires its own justification and approval.</p>
      <ol>
        <li><strong>Timing.</strong> Record the original event, why the difference exists at this cutoff and what later evidence should clear it. Follow up rather than carrying the item indefinitely.</li>
        <li><strong>Accounting error.</strong> Identify the incorrect record, support the proposed correction, obtain approval and rerun the comparison after posting.</li>
        <li><strong>Report error.</strong> Correct the filter, incomplete export or duplicate report row. Establish whether the underlying books are wrong before creating a journal entry.</li>
        <li><strong>Unresolved.</strong> Keep the amount, age, evidence request and owner visible. Do not describe an unexplained difference as reconciled.</li>
      </ol>
      <p>Retain enough for another person to repeat the work: the reports and cutoff, opening balance, activity, individual explanations, approved corrections and remaining follow-up. For larger volumes, check duplicate references and payments covering several invoices rather than matching equal amounts alone.</p>
      <p>Where practical, have someone other than the preparer review exceptions and corrections. Choose a review frequency that fits the account’s activity and risk. Repeated differences from the same source are a reason to fix the process that produces them.</p>
      <p><strong>A supported timing difference is not the same as an unexplained balance.</strong> Keep that distinction visible when you sign off the reconciliation and carry open work into the next review.</p>
    </section>
  </BlogArticlePage>;
}
