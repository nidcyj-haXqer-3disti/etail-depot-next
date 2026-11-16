import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { balanceSheetArticle } from "./balance-sheet-content";
import s from "./blog.module.css";

const balanceLines = [
  ["Cash", "Asset", "Reconcile the recorded amount to the account statements and explain timing differences."],
  ["Customer receivables", "Asset", "Check which invoices remain unpaid and whether the recorded amounts are collectible."],
  ["Inventory", "Asset", "Check quantities, condition and valuation. Stock is not money already in the bank."],
  ["Equipment", "Asset", "Read the recorded amount with depreciation and other relevant adjustments."],
  ["Supplier bills and accrued expenses", "Liability", "Confirm unpaid obligations, including amounts incurred but not yet invoiced."],
  ["Borrowing", "Liability", "Separate the portion classified as current from later obligations using the loan terms and accounting rules."],
  ["Owners’ equity", "Equity", "Trace contributions, accumulated results and distributions. It is not a separate cash account."],
] as const;

export function BalanceSheetPage() {
  return <BlogArticlePage article={balanceSheetArticle}>
    <section id="categories" aria-labelledby="categories-title">
      <h2 id="categories-title">Read the three parts</h2>
      <p><strong>Assets</strong> include cash, customer receivables, inventory and equipment. <strong>Liabilities</strong> include unpaid supplier bills, accrued obligations and borrowing. <strong>Equity</strong> is the remaining recorded interest after subtracting liabilities from assets.</p>
      <p>Owner contributions, accumulated profits or losses and distributions can change equity. Equity is not the same as the current period’s profit, and it is not a promise of what the business would sell for.</p>
      <p><strong>Assets = liabilities + equity.</strong> A balanced total is only the first check. Entries must also be complete, correctly valued and classified. A missing transaction or an entry in the wrong account may still leave the equation balanced.</p>
    </section>
    <section id="classifications" aria-labelledby="classifications-title">
      <h2 id="classifications-title">Look at what makes up the totals</h2>
      <p>Confirm the business name, statement date and currency. A balance sheet is a snapshot at that date, not a total of sales during the month. Read the notes and accounting policies before comparing it with another statement.</p>
      <table className={s.comparison}>
        <caption>Common balance sheet lines and what to check</caption>
        <thead><tr><th scope="col">Line</th><th scope="col">Part</th><th scope="col">Reading check</th></tr></thead>
        <tbody>{balanceLines.map(([line, part, check]) => <tr key={line}>
          <th scope="row">{line}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Part</span>{part}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Reading check</span>{check}</td>
        </tr>)}</tbody>
      </table>
      <p>Current and noncurrent categories help explain timing. The distinction considers when assets are expected to be used or realized and when obligations must be settled. Use the classifications required by the applicable accounting framework.</p>
      <p>Some valuable resources are not recorded as assets. The amounts shown also do not necessarily equal current market values. Read a large balance with its supporting detail rather than assuming it can immediately be turned into cash.</p>
    </section>
    <section id="cash" aria-labelledby="cash-title">
      <h2 id="cash-title">Working capital is not all cash</h2>
      <p><strong>Working capital = current assets − current liabilities.</strong> It compares the two current categories, but current assets can include unpaid customer invoices and inventory as well as cash.</p>
      <p>A supplier may need payment before customers pay their invoices. Positive working capital alone does not cover that timing gap. Check when receivables are likely to arrive and obligations fall due, alongside a cash forecast.</p>
      <p>Ask what makes each balance usable. An overdue receivable needs collection, stock needs a buyer, and any restrictions on cash matter when planning payments. One positive total does not answer all three questions.</p>
    </section>
    <section id="changes" aria-labelledby="changes-title">
      <h2 id="changes-title">Follow what changes when a bill is paid</h2>
      <p>Consider a supplier bill already recorded in accounts payable. If the business pays that bill in full from cash, with no fee, discount or other adjustment, cash and the payable fall by the same amount.</p>
      <p>Total assets and total liabilities both decrease. Equity stays unchanged for that payment, so the balance sheet still balances.</p>
      <p><strong>Paying a bill already recorded does not create the same expense again.</strong> The original entry may have recorded an expense or an asset, depending on the purchase. The payment settles the liability; other transactions and adjustments are separate.</p>
    </section>
    <section id="review" aria-labelledby="review-title">
      <h2 id="review-title">Check what supports the balances</h2>
      <ol>
        <li><strong>Match the records.</strong> Reconcile cash and debt to their supporting statements. Use invoices, receipts and other documents to explain the entries.</li>
        <li><strong>Investigate aging balances.</strong> Review overdue receivables, unusable inventory and bills or obligations that may be missing.</li>
        <li><strong>Check the timing.</strong> Review current and later obligations, including the loan split. Ask an accountant about unfamiliar classifications or valuation adjustments.</li>
        <li><strong>Explain the changes.</strong> Compare with a relevant prior date using consistent accounting policies. Identify the transactions behind large movements.</li>
      </ol>
      <p>The IRS explains that supporting business documents substantiate entries in the books. A payment report can help trace a transaction, but it does not replace the full accounting records. Our <Link href="/company/blog/transaction-details-reports" prefetch={false}>transaction details report article</Link> explains how to read payment records before combining them.</p>
      <p>Read the balance sheet with the <Link href="/company/blog/profit-and-loss-statement" prefetch={false}>profit and loss statement</Link> and cash flow statement. The P&L reports performance over a period; the balance sheet shows amounts at a date; the cash flow statement explains cash movements. Together they give a fuller picture.</p>
    </section>
  </BlogArticlePage>;
}
