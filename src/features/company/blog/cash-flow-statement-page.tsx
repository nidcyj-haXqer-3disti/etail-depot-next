import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cashFlowStatementArticle } from "./cash-flow-statement-content";
import s from "./blog.module.css";

const cashFlowSections = [
  ["Operating", "Customer collections and payments for inventory, staff and other operating costs.", "Did the business’s usual activities generate cash or use it?"],
  ["Investing", "Cash paid for equipment or received from selling long-term assets and investments outside cash equivalents.", "Is the business buying assets or releasing cash by selling them?"],
  ["Financing", "New borrowing, loan principal repayments and cash contributed by owners or returned to them.", "How much cash came from funding, and how much went back to lenders or owners?"],
] as const;

export function CashFlowStatementPage() {
  return <BlogArticlePage article={cashFlowStatementArticle}>
    <section id="three-sections" aria-labelledby="three-sections-title">
      <h2 id="three-sections-title">Ask where the money came from</h2>
      <p>Start with the reporting dates and the notes explaining which balances count as cash and cash equivalents. Cash equivalents are qualifying liquid investments, not every investment the business owns. Compare the same period and scope when reading the other financial statements.</p>
      <figure className={s.financialMovements}>
        <figcaption>What each section helps you understand</figcaption>
        <dl>{cashFlowSections.map(([section, movements, question]) => <div key={section}>
          <dt>{section}</dt>
          <dd><p>{movements}</p><p className={s.financialQuestion}>{question}</p></dd>
        </div>)}</dl>
      </figure>
      <p>These are common examples, not a classification rule for every business. Interest, dividends and unusual funding arrangements need the treatment required by the applicable accounting framework.</p>
      <p>Buying equipment entirely on credit creates no cash purchase at that point. Depreciation also uses no current cash. Significant noncash investing and financing activity belongs in the required separate disclosures, not in cash receipts or payments.</p>
    </section>
    <section id="read-the-total" aria-labelledby="read-the-total-title">
      <h2 id="read-the-total-title">Distinguish a cash increase from healthy operations</h2>
      <p>Suppose customer collections are lower than operating payments during a quarter. The business also buys equipment for cash, but a new loan brings in more than both outflows combined. Assuming no other movements, cash ends higher even though operations consumed cash.</p>
      <p><strong>Borrowing can increase cash without increasing profit.</strong> Check the three section totals separately. An asset sale can also provide cash that will not recur, while buying useful equipment can reduce cash without indicating weaker sales.</p>
      <p>The net change tells you how much cash moved, not how much remains. Add the period’s increase to the opening balance, or subtract its decrease. Include separately presented effects, such as exchange-rate changes, exactly once. Match the closing total to the corresponding <Link href="/company/blog/read-a-balance-sheet" prefetch={false}>balance sheet</Link> amounts and notes, using the same definition of cash.</p>
      <p>This report can cover several accounts and qualifying cash equivalents. A <Link href="/company/blog/bank-reconciliation-statement" prefetch={false}>bank reconciliation</Link> checks an individual bank account against the books. It supports accurate records but does not replace the statement of cash flows.</p>
    </section>
    <section id="direct-and-indirect" aria-labelledby="direct-and-indirect-title">
      <h2 id="direct-and-indirect-title">Understand the operating section’s method</h2>
      <p>The direct method groups operating cash collected and paid. The indirect method starts from a profit measure, often net income, and adjusts for noncash items, operating balances and items belonging in other sections. Use the starting measure required by the reporting framework. Both methods should explain the same operating cash total from the same records.</p>
      <p>For example, revenue recorded before collection can increase profit without increasing cash. An unpaid supplier bill can reduce profit before the payment leaves. These timing differences help explain why the <Link href="/company/blog/profit-and-loss-statement" prefetch={false}>profit and loss statement</Link> and operating cash flow differ.</p>
      <ul>
        <li><strong>Check the balance bridge.</strong> Confirm the opening balance, movements and separately reported effects reach the closing balance.</li>
        <li><strong>Check the source of the increase.</strong> Separate cash from operations from new borrowing, owner contributions and asset sales.</li>
        <li><strong>Check the timing.</strong> Investigate customer collections, inventory purchases and supplier payments before treating a difference from profit as an error.</li>
      </ul>
      <p><strong>A historical cash flow statement is not a forecast.</strong> Plan upcoming obligations separately. The closing balance alone does not show whether next month’s receipts will arrive on time or whether all the money is available to spend.</p>
    </section>
  </BlogArticlePage>;
}
