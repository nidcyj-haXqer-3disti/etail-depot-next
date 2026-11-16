import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { accruedPayableArticle } from "./accrued-payable-content";
import s from "./blog.module.css";

const accrualEntries = [
  ["Record the June cost", "Debit support expense and credit accrued liabilities for the supported estimate.", "June includes the cost and the obligation, even though the bill has not arrived."],
  ["Record the verified bill", "Debit accrued liabilities for the estimate, debit support expense for the verified difference, and credit accounts payable for the full bill.", "The accrual is cleared. June expense equals the verified cost, and the unpaid bill moves into accounts payable."],
  ["Pay the bill", "Debit accounts payable and credit cash for the amount paid.", "The supplier balance is settled. Payment does not create another support expense."],
] as const;

export function AccruedPayablePage() {
  return <BlogArticlePage article={accruedPayableArticle}>
    <section id="recognition-and-evidence" aria-labelledby="recognition-and-evidence-title">
      <h2 id="recognition-and-evidence-title">Separate the service period from the invoice date</h2>
      <p>A business can use electricity or receive support services before the supplier sends a bill. Under accrual accounting, waiting for that bill can leave an incurred cost and its liability out of the period. Meter readings, service records, hours worked and agreed rates can support the amount recorded.</p>
      <p>Receiving an invoice does not make every purchase a current expense. It may cover inventory, equipment or services for a future period. Identify what was received and when before choosing the accounts. An accrued expense affects the expense account as well as the liability; it is not only a balance sheet item.</p>
      <p>Account names and posting routines vary. Your accounting system may group some obligations differently. The distinction here is an unbilled cost supported by records versus a verified supplier bill awaiting payment.</p>
      <p><strong>A later bill should replace the estimate, not add a second copy of the cost.</strong> Check the existing accrual before recording the invoice. The <Link href="/company/blog/accounts-payable-journal-entry" prefetch={false}>accounts payable journal entry guide</Link> explains how a bill and its payment affect different accounts.</p>
    </section>
    <section id="accrual-to-invoice" aria-labelledby="accrual-to-invoice-title">
      <h2 id="accrual-to-invoice-title">Connect the estimate to the later bill</h2>
      <p>Assume support work received in June qualifies as a current expense. The business estimates the unbilled cost from recorded hours and the agreed rate. Before June’s accounts are finalized, an invoice and verified timesheet show a slightly higher June cost. There are no taxes or other charges, and no automatic reversal has been posted.</p>
      <table className={s.comparison}>
        <caption>One service cost, from accrual to bill to payment</caption>
        <thead><tr><th scope="col">Event</th><th scope="col">Entry</th><th scope="col">Result</th></tr></thead>
        <tbody>{accrualEntries.map(([event, entry, result]) => <tr key={event}>
          <th scope="row">{event}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Entry</span>{entry}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Result</span>{result}</td>
        </tr>)}</tbody>
      </table>
      <p>This sequence clears the estimate directly and updates June’s expense for the verified difference. If the invoice is lower, that difference reduces the expense instead. Confirm that the bill covers the same work and period before clearing the accrual.</p>
      <p>Some systems reverse selected accruals at the start of the next period and then record the bill through their normal process. Follow your configured method. <strong>Do not reverse and manually clear the same accrual twice.</strong> If the relevant period is already closed, ask your accountant how to handle the difference rather than assuming it belongs in the latest month.</p>
    </section>
    <section id="review-the-schedule" aria-labelledby="review-the-schedule-title">
      <h2 id="review-the-schedule-title">Keep a record you can clear</h2>
      <p>A useful accrual schedule is a list of unbilled costs with enough detail to connect each one to later evidence. Review three things:</p>
      <ol>
        <li><strong>The basis.</strong> Record the supplier, service period, quantity, rate and supporting document. Explain the estimate rather than carrying an unexplained round number.</li>
        <li><strong>The later bill.</strong> Link the invoice to the original accrual, explain any difference and identify the period it affects. Check whether software has already posted a reversal or clearing entry.</li>
        <li><strong>The remaining obligation.</strong> Investigate older balances and record what is still owed. A missing bill does not, by itself, mean the obligation has disappeared.</li>
      </ol>
      <p>Reconcile the accrual schedule and accounts payable detail separately to their ledger balances for the same date. The same supplier can correctly appear in both when one period is billed and another is still unbilled. Compare the service dates and documents, not just the supplier name. The <Link href="/company/blog/accounting-reconciliation" prefetch={false}>accounting reconciliation guide</Link> explains how to investigate and retain the evidence for a difference.</p>
    </section>
  </BlogArticlePage>;
}
