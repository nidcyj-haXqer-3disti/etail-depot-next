import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { netCashFlowArticle } from "./net-cash-flow-content";
import s from "./blog.module.css";

export function NetCashFlowPage() {
  return <BlogArticlePage article={netCashFlowArticle}>
    <p>You should not need three versions of the truth to know whether the business brought in more cash than it paid out. Yet a spreadsheet built from several exports can leave you with exactly that. Every report looks plausible. The total does not match the money.</p>
    <p>Net cash flow is cash coming in minus cash going out during a defined period. The subtraction is straightforward. Deciding which entries belong in it takes more care.</p>
    <p className={s.editorialFormula}>Net cash flow = cash inflows − cash outflows.</p>
    <p>Choose the period and the accounts included before adding anything. A view of one checking account answers a narrower question than a view of the business’s combined cash. Formal financial statements also include qualifying cash equivalents and follow the applicable accounting rules. Keep the scope consistent from the opening balance to the closing balance.</p>
    <section id="one-payment" aria-labelledby="one-payment-title">
      <h2 id="one-payment-title">One payment can appear in three reports</h2>
      <p>Consider an online sale that is paid by card and later included in a bank payout. The sales report records the order. The payment report tracks the charge and its subsequent activity. The bank statement records the deposit. These records help explain each other; they are not three separate customer receipts.</p>
      <p>Adding sales to payouts would count the same commercial activity twice. Counting a payout report entry and its matching bank deposit as two receipts would repeat the mistake. Match the records, then count the movement once within the cash scope you chose.</p>
      <p>A payout may also combine several transactions and reflect fees, refunds or other adjustments. Its amount does not have to equal one day’s gross sales. Keep the transaction detail so the difference can be explained. The article on <Link href="/company/blog/payment-settlement-and-payouts" prefetch={false}>payment settlement and payouts</Link> follows that relationship more closely.</p>
      <p>For a simple bank cash view, use the actual deposit as the bank receipt. If fees were already deducted before that deposit, subtracting those same fees again would understate the bank cash movement. A separate debit for a fee still belongs in the outflows. A full accounting cash flow statement may require a different presentation, so do not mistake a bank deposit summary for the finished financial statement.</p>
      <p>The same discipline applies when moving money between your own accounts. If checking and savings are both included in the total, a transfer between them changes where the cash sits. It does not create new cash for the business. Keep both entries for the account reconciliations, but exclude that internal movement from the combined inflow and outflow totals.</p>
      <p><strong>More records can explain the money better. They cannot make the same money arrive twice.</strong></p>
      <p>An invoice awaiting payment belongs elsewhere too. It may count as revenue under accrual accounting, but it is not yet a cash receipt. Expected collections belong in a forecast. Mixing them into actual cash flow makes the result depend on money that has not arrived.</p>
    </section>
    <section id="explain-the-balance" aria-labelledby="explain-the-balance-title">
      <h2 id="explain-the-balance-title">Make the result explain the balance</h2>
      <p>For a simple calculation in one currency, with the same accounts throughout and no other reconciling effects, opening cash plus net cash flow should equal closing cash. Check that relationship against reconciled records. A difference is a reason to investigate, not a reason to add an unexplained adjustment until the spreadsheet agrees.</p>
      <p>Look for repeated imports, missing payments, inconsistent dates or a transfer counted on only one side. If foreign currency balances are involved, exchange rate movements can also change the reported balance without being cash receipts or payments. Explain those effects separately under the accounting rules being used.</p>
      <p>Then ask what produced the result. Borrowing can lift cash while the sales operation is consuming it. Buying equipment can reduce cash during an otherwise strong trading period. Read the operating, investing and financing sections of the <Link href="/company/blog/cash-flow-statement" prefetch={false}>cash flow statement</Link> before treating a positive total as good performance or a negative total as failure.</p>
      <p>A negative flow also does not mean the closing balance is below zero. The business may have started with enough cash to cover the decrease. Equally, a positive monthly total does not prove cash was available on every payment date within that month. A receipt on Friday cannot pay a bill that was due on Tuesday.</p>
      <p>That is where the calculation earns its place in a business review. It tells you what changed, using records that agree. A separate forecast tests what happens next, including commitments and money that cannot be spent freely. Before approving the next purchase, know which question your number actually answers.</p>
    </section>
  </BlogArticlePage>;
}
