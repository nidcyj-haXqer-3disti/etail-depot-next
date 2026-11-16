import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { transactionReportsArticle } from "./transaction-reports-content";
import s from "./blog.module.css";

const importedRows = [
  ["A captured payment", "The capture is a distinct operation included in the selected report period.", "Include it in the appropriate payment activity total."],
  ["A later partial refund", "The refund has its own operation and reporting date.", "Keep it as a separate event. Do not overwrite the capture."],
  ["The same refund in an overlapping export", "Both rows represent the same complete entry, using the report’s documented identity.", "Exclude the repeated copy from the analysis and record why."],
  ["Another refund for the same payment", "It is a separate operation, even if the amount matches an earlier refund.", "Keep it. A shared payment reference does not make it a duplicate."],
] as const;

export function TransactionReportsPage() {
  return <BlogArticlePage article={transactionReportsArticle}>
    <p>A report is useful when you can trace its total back to the activity behind it. Start with the question you need to answer: whether a sale was captured, why two reports differ or which entries belong to a particular batch.</p>
    <section id="identify-the-report" aria-labelledby="identify-the-report-title">
      <h2 id="identify-the-report-title">Read the report definition first</h2>
      <p>Confirm the merchant accounts, reporting period, time zone, currencies and entry types included. Check whether a date means payment creation, capture, settlement, an accounting entry or a payout. The day you download a file is not necessarily the day its activity occurred.</p>
      <p>Keep the original export unchanged and use a working copy for analysis. Save the report name, filters and generation time so another person can reproduce the result. Use the provider’s field definitions when a column is unclear.</p>
      <p>For example, Adyen’s Settlement details report includes different entry types, including settled payments, refunds, adjustments and payouts. Its Creation Date refers to when the original payment was created, rather than the date of every later event. That field cannot answer every timing question.</p>
      <p>For merchants using Trolleys, an Etail Depot service, compare the corresponding merchant account report in the Back Office Operations Portal with the gateway report in Cybersource Business Center. Choose the same business, currency and comparable activity period. The <Link href="/services/reconciliation" prefetch={false}>reconciliation service page</Link> explains this comparison. A bank statement is a separate record used to confirm deposits.</p>
    </section>
    <section id="link-the-records" aria-labelledby="link-the-records-title">
      <h2 id="link-the-records-title">Follow the references, not just the amount</h2>
      <p>Find the order reference, provider payment reference and any separate capture, refund or dispute references. A batch or payout reference connects groups of entries to other reports. Use the documented connection between those fields; two unrelated payments can have the same amount.</p>
      <p>Preserve identifiers as text when importing a file into a spreadsheet. Leading zeros and long references must survive the import unchanged. Check the first few imported rows against the original export before using the file to match records.</p>
      <p>One order may have several payment attempts, and one payment may have several operations. When combining exports, check how many rows match on each side. Matching every order row to every payment row can multiply amounts even when both source files are correct.</p>
      <p>A status also needs context. A captured payment can have a later partial refund, so retain both events and their dates. Stripe documents a balance entry called <code>refund</code> for the uncaptured portion of a payment when authorization and capture are separate. Read the underlying operation before telling a customer that a refund was issued.</p>
      <p>The <Link href="/company/blog/payment-capture" prefetch={false}>payment capture article</Link> explains why authorization, capture and later changes need separate records.</p>
    </section>
    <section id="avoid-double-counting" aria-labelledby="avoid-double-counting-title">
      <h2 id="avoid-double-counting-title">Check repeated rows before totaling</h2>
      <p>Suppose you download two reports with overlapping dates. A captured payment and its later refund are separate events, but the refund may appear in both exports. Keep the real operations while identifying the repeated import.</p>
      <table className={s.comparison}>
        <caption>Check the identity of each entry before excluding a row</caption>
        <thead><tr><th scope="col">Imported row</th><th scope="col">What to verify</th><th scope="col">How to treat it</th></tr></thead>
        <tbody>{importedRows.map(([row, check, treatment]) => <tr key={row}>
          <th scope="row">{row}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to verify</span>{check}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">How to treat it</span>{treatment}</td>
        </tr>)}</tbody>
      </table>
      <p>Do not remove rows solely because they share a payment reference. Even an operation reference may need context: Adyen notes that a chargeback’s Modification Reference can match the capture reference. The entry type and the report’s identity rules matter.</p>
      <p>Keep payments, refunds, fees and payouts in their appropriate groups. A payout entry is not another sale. Stripe’s Balance summary report includes activity and payouts within the selected period, but it is not the report for assigning individual payments to each payout.</p>
      <p>Use the report’s debit and credit conventions, currency and amount units. If you total a net amount that already includes a fee deduction, subtracting the fee breakdown again will distort the result. Never combine currencies into one amount without an explicit conversion basis.</p>
    </section>
    <section id="investigate-a-difference" aria-labelledby="investigate-a-difference-title">
      <h2 id="investigate-a-difference-title">Use the report to narrow the question</h2>
      <p>If the totals still differ, work through four checks:</p>
      <ol>
        <li><strong>Compare the same activity.</strong> Match the accounts, currency, date basis and included statuses. A gateway authorization total and a merchant captured sales total answer different questions.</li>
        <li><strong>Check the imported rows.</strong> Look for overlapping exports and matches that multiplied entries. A repeated reference may be a valid later operation, not a duplicate.</li>
        <li><strong>Check signs and deductions.</strong> Establish whether the amount is gross or net and whether fees or adjustments are already included.</li>
        <li><strong>Keep the unresolved difference visible.</strong> Tie it to specific references or a question about the report definition. Do not add an assumed fee just to make the total match.</li>
      </ol>
      <p>Document each exclusion in the working copy. A useful support request includes the report names and filters, the affected account, questioned references, expected and observed amounts, and the remaining difference. Share only the records needed through the approved support channel.</p>
      <p>Etail’s <Link href="/developers/developer-tools#support-handoff" prefetch={false}>support handoff guidance</Link> explains what information helps an investigation and what to keep out of screenshots and messages.</p>
      <p>If merchant and gateway activity reconcile but a deposit is still missing, continue with <Link href="/company/blog/payment-settlement-and-payouts" prefetch={false}>settlement and payouts</Link>. A provider’s payout record and the bank’s confirmation of receipt are different checks. Resolving the report difference does not by itself prove that money arrived.</p>
    </section>
  </BlogArticlePage>;
}
