import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { profitLossArticle } from "./profit-loss-content";
import s from "./blog.module.css";

const statementLines = [
  ["Net sales", "Starting revenue", "Sales after relevant returns, allowances and discounts."],
  ["Cost of sales", "Subtract", "Costs associated with the goods or services sold in the period."],
  ["Gross profit", "Subtotal", "Net sales minus cost of sales."],
  ["Operating expenses", "Subtract", "Other operating costs, such as administration and marketing, not already included above."],
  ["Operating profit", "Subtotal", "Gross profit minus operating expenses."],
  ["Other income and expenses", "Add or subtract", "Income adds to the result; expenses reduce it. Interest is a common example."],
  ["Income tax expense", "If applicable", "Apply the treatment appropriate to the business and accounting basis."],
  ["Net profit or loss", "Final result", "The amount remaining after all reported income, costs and expenses."],
] as const;

export function ProfitLossPage() {
  return <BlogArticlePage article={profitLossArticle}>
    <section id="main-parts" aria-labelledby="main-parts-title">
      <h2 id="main-parts-title">Start with the period and accounting basis</h2>
      <p>A P&L covers a span of time, such as a month, quarter or year. Check the dates, currency and business included before reading the total. Comparing a full month with a partly completed month can produce a misleading picture.</p>
      <p>The accounting basis determines when amounts enter the report. Under a cash method, income and expenses generally follow receipt and payment. Accrual accounting generally records earned revenue and incurred expenses even when cash moves later. Specific accounting and tax rules can create exceptions.</p>
      <p>Use the method appropriate to the business and confirm it with your accountant. The IRS describes rules for choosing and changing a tax accounting method. Changing a report label or software filter does not by itself change that method.</p>
    </section>
    <section id="statement-lines" aria-labelledby="statement-lines-title">
      <h2 id="statement-lines-title">Follow revenue down to net profit</h2>
      <p>A statement with several subtotals helps show where the result changes. This common structure separates the cost of sales from other operating costs, then accounts for other income, expenses and applicable income tax.</p>
      <figure className={s.financialStatement}>
        <figcaption>How the main P&L lines relate to one another</figcaption>
        <dl>{statementLines.map(([line, role, meaning]) => <div key={line}
          className={role === "Final result" ? s.financialTotal : role === "Subtotal" ? s.financialSubtotal : undefined}>
          <dt><span>{line}</span><span className={s.financialRole}>{role}</span></dt>
          <dd>{meaning}</dd>
        </div>)}</dl>
      </figure>
      <p><strong>Gross profit is a subtotal, not the final profit.</strong> It still has to cover the expenses shown below it. Operating profit is another subtotal; other income, financing costs and applicable tax can change the final result.</p>
      <p>A simpler statement may group income and expenses without showing every subtotal. Categories and presentation vary by business. Keep the classification consistent, and do not deduct the same cost in both cost of sales and operating expenses.</p>
    </section>
    <section id="prepare" aria-labelledby="prepare-title">
      <h2 id="prepare-title">Prepare the figures from your records</h2>
      <ol>
        <li><strong>Set the scope.</strong> Choose the period, business, currency and accounting basis. Use the same scope for every supporting report.</li>
        <li><strong>Gather the records.</strong> Bring together the books, sales records, supplier invoices, payroll, receipts and relevant account statements. Include returns, credits and corrections.</li>
        <li><strong>Classify and reconcile.</strong> Put each item in the appropriate account once. Trace totals back to the records and investigate unmatched or repeated entries.</li>
        <li><strong>Review before sharing.</strong> Check the subtotals, incomplete entries and unusual changes. Keep the supporting documents and a dated copy of the completed statement.</li>
      </ol>
      <p>The IRS explains that invoices, receipts and other business documents support entries in the books. A payment export is useful evidence, but it is not a complete set of business accounts. It may omit costs, noncard sales and accounting adjustments.</p>
      <p>Check what each payment report row represents before adding it to the books. Our <Link href="/company/blog/transaction-details-reports" prefetch={false}>transaction details report article</Link> explains how repeated operations and different dates can affect a total.</p>
    </section>
    <section id="profit-cash" aria-labelledby="profit-cash-title">
      <h2 id="profit-cash-title">Check cash separately</h2>
      <p>Under accrual accounting, revenue from an earned sale can appear before the customer pays. Some reported expenses may also remain unpaid. A profitable period therefore does not prove that the business has enough cash for its next payments.</p>
      <p>Borrowing provides another distinction. A loan brings in cash and creates a liability; the loan proceeds are not sales revenue. Repayment of the principal is different from interest expense.</p>
      <p><strong>A P&L does not show the bank balance.</strong> Read it with the balance sheet, which shows assets, liabilities and equity at a date, and the cash flow statement, which explains cash movements during a period.</p>
      <p>Likewise, a processor payout is a transfer of funds, not a calculation of business profit. Match the underlying sales, fees and adjustments to the books rather than treating the deposit total as the P&L result.</p>
    </section>
    <section id="read-it" aria-labelledby="read-it-title">
      <h2 id="read-it-title">Find what changed the result</h2>
      <p>Compare equivalent periods using the same accounting basis and categories. If sales rise while operating profit falls, look at the cost of sales and operating expenses separately. Higher sales do not necessarily produce higher profit.</p>
      <p>Keep a large unusual item visible and explain its effect. Compare the actual figures with a separately labeled budget or forecast, then investigate the underlying records. Do not change the classification merely to make the result look better.</p>
      <p>Payment acceptance and collection reports can help investigate a particular problem, but they answer different questions from a P&L. Our <Link href="/company/blog/payment-analytics" prefetch={false}>payment analytics article</Link> explains how to identify what each metric measures before using it to make a decision.</p>
    </section>
  </BlogArticlePage>;
}
