import { BlogArticlePage } from "./article-page";
import { processingHistoryBridgeArticle } from "./processing-history-bridge-content";

export function ProcessingHistoryBridgePage() {
  return <BlogArticlePage article={processingHistoryBridgeArticle}>
    <p>In a hypothetical merchant review, the application reports $50,000 in processing volume. The reviewer sees $43,300 of related deposits and asks about the difference.</p>
    <p>The wrong response is to change the sales figure until the two totals match. The better response is to establish what each number measures and account for the difference.</p>
    <p>Processing reports, gateway reports, bank statements and company accounts can describe the same business from different points in the payment flow. Their totals are not interchangeable.</p>

    <section id="follow-the-difference" aria-labelledby="follow-the-difference-title">
      <h2 id="follow-the-difference-title">Show the calculation, including money still in transit.</h2>
    <p>Consider this hypothetical month. All amounts are in USD, and each adjustment below is assumed to be deducted once from the same identified group of processed payments. The business has no opening balance, prior-period releases or other adjustments in this simplified example.</p>
    <div data-table-scroll><table>
<caption>Illustrative processing-to-deposit calculation, USD</caption>
<thead><tr><th scope="col">Record</th><th scope="col">Amount</th></tr></thead>
<tbody><tr><th scope="row">Processed payments</th><td>$50,000</td></tr><tr><th scope="row">Refunds deducted</th><td>$2,000</td></tr><tr><th scope="row">Fees deducted</th><td>$1,200</td></tr><tr><th scope="row">Dispute deductions</th><td>$500</td></tr><tr><th scope="row">Reserve withheld</th><td>$1,000</td></tr><tr><th scope="row">Not yet deposited at cutoff</th><td>$2,000</td></tr><tr><th scope="row">Deposits received</th><td>$43,300</td></tr></tbody></table></div>
    <p>The $43,300 deposit total follows from the assumptions. The $2,000 still awaiting deposit has not become a fee merely because it has not reached the bank. If it arrives in the following month, it explains part of that month’s deposits without becoming new processing volume for that month. Carrying the amount forward is what makes the two periods connect; forcing each month’s deposits to equal its sales would lose that connection.</p>
    <p>Actual accounts can have earlier balances, delayed adjustments and different fee collection arrangements. Use the provider’s records rather than treating this example as a universal payout formula. The calculation is useful because every difference has a stated meaning, not because every account uses these particular lines.</p>
    <p>Identify whether each report uses payment, settlement or payout dates, and whether its cutoff and currency match the comparison. A statement ending on the last day of the month may exclude a payout that arrives the next morning. Show that timing difference instead of inventing an expense to close the gap.</p>
    </section>

    <section id="several-providers" aria-labelledby="several-providers-title">
      <h2 id="several-providers-title">A second report is not always a second stream of sales.</h2>
    <p>When several providers were used, prepare a summary with the legal merchant, account reference, covered period, currency and measure for each source. Preserve the underlying statements. Keep genuine processing streams separate from reports that show the same transactions again at another stage.</p>
    <p>For example, gateway records and acquiring statements can describe the same card payments. Adding both volumes would double count the activity. If two processors handled different transactions during a migration, they may both belong in the history, but refunds or later adjustments still need to be assigned correctly.</p>
    <p>Do not average provider percentages to create an overall dispute or refund rate. Use a consistent, disclosed definition and the appropriate underlying totals, and retain any provider or network measure in its original form. Explain where records cannot be combined reliably.</p>
    <p>The same caution applies to a Form 1099-K. IRS guidance describes its reported gross payment amount before adjustments such as fees and refunds. It is not a bank-deposit total or, by itself, a calculation of taxable profit. A tax adviser can resolve tax-reporting questions; the application still needs the processing history actually requested.</p>
    </section>

    <section id="a-checkable-history" aria-labelledby="a-checkable-history-title">
      <h2 id="a-checkable-history-title">Give the reviewer a route back to the records.</h2>
    <p>For a Trolleys application, label historical processing separately from expected future volume. Explain which sales channels and businesses the history represents. A previous company’s results can describe experience without becoming the applicant’s own sales.</p>
    <p>Provide the summary and requested authentic evidence through the secure account process. Separate differences supported by records from amounts still under investigation. A total that balances only because the unexplained remainder is labeled other is not a completed explanation. Keep that remainder visible until a record establishes what it represents.</p>
    <p>An accurate history can include complicated movement of money. What makes it convincing is that another person can follow the totals without being asked to take the merchant’s word for the missing amount.</p>
    </section>
  </BlogArticlePage>;
}
