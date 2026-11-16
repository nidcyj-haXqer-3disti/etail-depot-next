import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { bankReconciliationArticle } from "./bank-reconciliation-content";
import s from "./blog.module.css";

const reconcilingItems = [
  ["Deposit in transit", "Add the deposit to the statement balance on the reconciliation worksheet.", "No second entry if the deposit is already recorded correctly. Keep the deposit evidence and check when it posts."],
  ["Outstanding check", "Subtract the check from the statement balance on the reconciliation worksheet.", "No second entry if the payment is already recorded correctly. Keep the check reference and watch for clearance."],
  ["Bank fee", "No adjustment if the statement already includes the correct fee.", "Verify the charge, record the fee expense and reduce the cash balance."],
  ["Interest credit", "No adjustment if the statement already includes the correct interest.", "Verify the credit, record interest income and increase the cash balance."],
] as const;

export function BankReconciliationPage() {
  return <BlogArticlePage article={bankReconciliationArticle}>
    <section id="collect-and-match" aria-labelledby="collect-and-match-title">
      <h2 id="collect-and-match-title">Use the same account and closing date</h2>
      <p>Start with one bank account, one currency and one closing date. Gather the prior completed reconciliation, the current statement and the cash-account transactions through that date. Check the opening balance and period activity before investigating the closing difference.</p>
      <p>Today’s available balance is not a substitute for the statement at month-end. Match deposits and withdrawals by reference as well as amount. Two payments for the same amount may be different transactions.</p>
      <p>A bank deposit may contain the net payout from many customer payments. Use the <Link href="/company/blog/payment-settlement-and-payouts" prefetch={false}>settlement and payout records</Link> to explain that deposit, then confirm that it posted to the bank account. Matching a payout’s contents and matching the bank account to your books are related checks with different source records.</p>
      <p>Carry forward individual outstanding checks and deposits in transit from the previous reconciliation. Check which have since cleared before adding new items. Each timing difference needs an underlying transaction and a reason it is absent from the statement.</p>
    </section>
    <section id="two-sided-example" aria-labelledby="two-sided-example-title">
      <h2 id="two-sided-example-title">Separate timing differences from book corrections</h2>
      <p>Assume the books already include a deposit and issued checks that have not yet appeared on the statement. The bank has also posted a valid fee and interest credit that are missing from the books. These differences affect different sides of the reconciliation.</p>
      <figure className={s.accountingReconciliation}>
        <figcaption>Which side needs an adjustment?</figcaption>
        <div className={s.accountingSides}>
          <div>
            <h3>Bank side</h3>
            <p className={s.accountingSideLabel}>Timing on the worksheet</p>
            <dl>{reconcilingItems.slice(0, 2).map(([item, bank, books]) => <div key={item}>
              <dt>{item}</dt>
              <dd><p>{bank}</p><p className={s.accountingNote}><strong>Books:</strong> {books}</p></dd>
            </div>)}</dl>
          </div>
          <div>
            <h3>Book side</h3>
            <p className={s.accountingSideLabel}>Corrections to the records</p>
            <dl>{reconcilingItems.slice(2).map(([item, bank, books]) => <div key={item}>
              <dt>{item}</dt>
              <dd><p>{books}</p><p className={s.accountingNote}><strong>Bank:</strong> {bank}</p></dd>
            </div>)}</dl>
          </div>
        </div>
      </figure>
      <p>The bank-side calculation explains timing on a worksheet. It does not alter the original statement. Book-side corrections update the accounting records through the approved process. Once all supported adjustments are included, the two adjusted balances should agree.</p>
      <p><strong>Do not post the whole difference just to make the balances match.</strong> The gap can contain several timing items and corrections, not one missing expense. Check which record is wrong before choosing an entry. The <Link href="/company/blog/accounting-reconciliation" prefetch={false}>accounting reconciliation guide</Link> explains how to investigate a difference and preserve its evidence.</p>
    </section>
    <section id="follow-open-items" aria-labelledby="follow-open-items-title">
      <h2 id="follow-open-items-title">Follow the items that have not cleared</h2>
      <ul>
        <li><strong>Suspected bank error.</strong> Verify your own record, keep the transaction evidence and contact the bank. Track its response separately from any correction your books need.</li>
        <li><strong>Old outstanding item.</strong> Check whether it cleared, was returned, was replaced or remains unresolved. For a missing ACH entry, collect the <Link href="/company/blog/ach-trace-number" prefetch={false}>trace number</Link> and dates. Confirm the status with the responsible bank or provider before arranging a replacement.</li>
        <li><strong>Unexplained remainder.</strong> Keep the amount visible with an owner and an evidence request. Do not label an unexplained difference as a valid timing item.</li>
        <li><strong>Missing book entry.</strong> Verify the transaction, post the approved correction and retain its reference. The final cash ledger should agree with the supported adjusted book balance.</li>
      </ul>
      <p>If one outstanding check clears on the next statement, mark that specific item cleared. Carry the others with their original dates and references. <strong>A check clearing does not create another expense if it was already recorded.</strong> A deposit still missing in the next period needs follow-up, not automatic acceptance as a timing difference.</p>
      <p>Keep the statements, worksheet, outstanding-item list and approved corrections together. IRS Publication 583 recommends monthly reconciliation; higher activity or risk can justify more frequent checks. A reconciled balance at the cutoff is not necessarily cash available to spend now. Later payments, holds and other obligations still matter.</p>
    </section>
  </BlogArticlePage>;
}
