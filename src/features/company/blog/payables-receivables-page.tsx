import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { payablesReceivablesArticle } from "./payables-receivables-content";
import s from "./blog.module.css";

const comparison = [
  ["Who owes the money?", "Your business owes a supplier.", "A customer owes your business."],
  ["Balance sheet role", "A liability, usually classified as current.", "An asset, usually classified as current."],
  ["Main record", "The supplier bill and supporting purchase records.", "The customer invoice and supporting sales records."],
  ["Payment direction", "Money goes out to settle the obligation.", "Money comes in to collect the customer balance."],
  ["Review focus", "Due dates, approvals, credits and payments already made.", "Due dates, overdue items, credits and payments already received."],
] as const;

export function PayablesReceivablesPage() {
  return <BlogArticlePage article={payablesReceivablesArticle}>
    <section id="identify-the-side" aria-labelledby="identify-the-side-title">
      <h2 id="identify-the-side-title">Start with your side of the transaction</h2>
      <p>If your business buys goods or services and agrees to pay the supplier later, the unpaid obligation is a payable. If it supplies a customer on credit, the customer’s unpaid balance is a receivable. The distinction depends on whose books you are reading.</p>
      <table className={s.comparison}>
        <caption>Accounts payable and receivable from your business’s perspective</caption>
        <thead><tr><th scope="col">Question</th><th scope="col">Accounts payable (AP)</th><th scope="col">Accounts receivable (AR)</th></tr></thead>
        <tbody>{comparison.map(([question, payable, receivable]) => <tr key={question}>
          <th scope="row">{question}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Accounts payable</span>{payable}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Accounts receivable</span>{receivable}</td>
        </tr>)}</tbody>
      </table>
      <p>These are balances, not interchangeable labels for expenses and revenue. On accrual books, a supplier purchase might be an asset or an expense, depending on what was bought. Revenue timing also needs to follow the applicable accounting rules. An invoice is evidence to review, not a universal instruction to record a sale or expense immediately.</p>
      <p>The <Link href="/company/blog/read-a-balance-sheet" prefetch={false}>balance sheet</Link> shows the recorded asset and liability balances. The <Link href="/company/blog/profit-and-loss-statement" prefetch={false}>profit and loss statement</Link> answers a different question about performance over a period.</p>
    </section>
    <section id="compare-dates" aria-labelledby="compare-dates-title">
      <h2 id="compare-dates-title">Compare dates as well as totals</h2>
      <p>A supplier bill may fall due on Friday while a customer payment is expected the following Tuesday. Even if the customer owes more than the supplier bill, that later receipt cannot fund Friday’s payment unless money becomes available earlier.</p>
      <p><strong>A due date is not proof that payment will arrive.</strong> Use the agreed due dates, realistic collection expectations and available cash in a dated cash forecast. Keep disputed or overdue customer items visible rather than treating every receivable as a dependable receipt.</p>
      <p>A partial customer payment reduces only the balance it settles. Apply it to the correct invoice and keep the unpaid remainder open. Receiving money against a sale already recorded does not create that sale again.</p>
      <p>Likewise, paying a supplier bill already recorded settles the payable. It does not automatically create another expense. Record any fee, discount or approved credit according to its own treatment rather than hiding the difference in the invoice balance.</p>
      <p>If the dates leave a gap, discuss payment terms before relying on a later supplier due date. Changing your forecast does not change the agreement with the supplier.</p>
    </section>
    <section id="review-open-items" aria-labelledby="review-open-items-title">
      <h2 id="review-open-items-title">Review the balances before planning payments</h2>
      <p>Keep a supplier list behind the payable total and a customer list behind the receivable total. Each open item needs a reference, original amount, credits or payments applied, remaining balance and agreed due date.</p>
      <ol>
        <li><strong>Check customer balances.</strong> Identify overdue or disputed invoices, payments not yet allocated and credits awaiting application. Confirm what is still owed before following up.</li>
        <li><strong>Check supplier obligations.</strong> Confirm the goods or services, approvals, credits and payment status. Investigate duplicate bills before scheduling another payment.</li>
        <li><strong>Check the timing gap.</strong> Compare the expected receipts and due payments with available cash. Include other commitments, such as payroll, that may sit outside these two lists.</li>
      </ol>
      <p><strong>Keep unrelated customer debts and supplier bills separate.</strong> Matching totals do not make the obligations cancel each other. Reconcile each detailed list to its corresponding total in the accounting records and investigate differences.</p>
      <p>The IRS explains that invoices, paid bills, receipts and other documents support entries in the books. Keep those records with the payment references and corrections so someone reviewing the balance can follow what happened. Ask your accountant about unfamiliar entries or valuation adjustments.</p>
    </section>
  </BlogArticlePage>;
}
