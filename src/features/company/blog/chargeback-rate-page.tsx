import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { chargebackRateArticle } from "./chargeback-rate-content";
import s from "./blog.module.css";

const monthlyActivity = [
  ["Month A", "20 chargebacks received; 4,000 completed card payments", "20 ÷ 4,000 × 100 = 0.50%"],
  ["Month B", "20 chargebacks received; 8,000 completed card payments", "20 ÷ 8,000 × 100 = 0.25%"],
] as const;

export function ChargebackRatePage() {
  return <BlogArticlePage article={chargebackRateArticle}>
    <p>The monthly report arrives with good news: the chargeback rate has fallen by half. Sales are up. The chart looks better. It would be easy to conclude that the changes made to customer support are working.</p>
    <p>Then someone opens the case list. The same number of disputes arrived, and the same delivery complaint keeps appearing. More successful payments have changed the percentage. Whether the underlying problem improved is still an unanswered question.</p>
    <p>A count-based chargeback rate compares a defined count of chargebacks with a defined count of payments. The definition matters as much as the arithmetic. Before asking whether your rate is better than an industry average, ask what your report actually counted.</p>

    <section id="read-both-numbers" aria-labelledby="read-both-numbers-title">
      <h2 id="read-both-numbers-title">A better percentage can still mean the same workload</h2>
      <p>Consider this hypothetical internal report. It divides chargebacks received in each month by completed card payments in that same month, then multiplies by 100. It covers the same merchant account and payment scope in both periods. This is an operating measure chosen for the example, not a universal card network formula.</p>
      <table className={s.comparison}>
        <caption>More payments, the same number of incoming chargebacks</caption>
        <thead><tr><th scope="col">Period</th><th scope="col">Underlying counts</th><th scope="col">Internal ratio</th></tr></thead>
        <tbody>{monthlyActivity.map(([period, counts, ratio]) => <tr key={period}>
          <th scope="row">{period}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Underlying counts</span>{counts}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Internal ratio</span>{ratio}</td>
        </tr>)}</tbody>
      </table>
      <p>The lower ratio is real: the business received fewer chargebacks relative to its current payment volume. But it still has 20 cases to review. The percentage alone does not show that the delivery problem was fixed, that less money is at risk or that the support change caused the improvement.</p>
      <p>The opposite can happen during a quiet month. Fewer new sales can make this ratio rise while the number of arriving disputes stays unchanged. That increase still matters for any measure that uses those periods. It simply needs an explanation more useful than “customers suddenly got worse.”</p>
      <p>Keep the counts beside the percentage. Keep disputed money visible separately too. A handful of expensive orders can create more financial exposure than a larger number of small ones. A count-based rate and the amount at stake answer different business questions.</p>
      <p>If several stores use exactly the same definition and reporting period, combine their underlying counts before calculating an overall ratio. An unweighted average of store percentages gives a small store the same influence as a large one. Keep each store’s result visible as well; a healthy combined figure can hide a local problem.</p>
    </section>

    <section id="follow-the-original-sales" aria-labelledby="follow-the-original-sales-title">
      <h2 id="follow-the-original-sales-title">This month’s complaints may belong to last month’s sales</h2>
      <p>The customer buys first and disputes later. A report organized by the date a dispute arrived is useful for understanding current case activity. A report organized by the original payment date helps investigate which sales produced that activity. They are different views of the same business.</p>
      <p>Return to the delivery complaint. Suppose the merchant changed its shipping promise at the start of Month B. Some disputes received during Month B may concern orders placed before that change. Counting them against the new month’s sales does not tell you whether the new promise is more accurate.</p>
      <p>For that question, compare orders placed before and after the change, with similar time allowed for complaints and disputes to emerge. Recent sales have had less time to produce a dispute. Label that incomplete view rather than declaring a new process successful after its first quiet week.</p>
      <p>Then read the cases. Are customers saying nothing arrived, that delivery was later than promised or that a cancellation was ignored? Those complaints may sit near each other in a report but require different work. A shipping estimate will not fix a cancellation request that support never handled.</p>
      <p>The purpose of this second view is to diagnose the problem. It does not replace the reporting method your provider or card network requires. Keep both views clearly named so the team does not mistake an internal explanation for a change in its obligations.</p>
    </section>

    <section id="average-is-not-permission" aria-labelledby="average-is-not-permission-title">
      <h2 id="average-is-not-permission-title">An industry average is not your account’s limit</h2>
      <p>An average chargeback rate is only comparable when you know the businesses included, payment types, period and calculation. A figure from a different sales model or a report using disputed dollars instead of transaction counts can answer a different question altogether.</p>
      <p>Network monitoring adds another distinction. Visa’s Acquirer Monitoring Program, or VAMP, combines specified fraud and dispute reports for covered payments against settled transaction counts, with additional conditions and exclusions. That measure is not simply the chargeback percentage in a merchant’s own spreadsheet.</p>
      <p>Confirm the current applicable program and account terms with your provider. Ask which events count, which sales form the denominator, what period is used and whether any exclusions apply. Regional rules and effective dates matter. A published average cannot tell you whether your particular account meets those requirements.</p>
      <p>Winning a dispute is also different from preventing one. Do not erase a received case from an activity report just because money was recovered. Follow the definition of the measure you are reporting, including its treatment of outcomes and excluded events.</p>
      <p>For a Trolleys merchant, the useful starting point is the merchant account, the period being compared and the transactions behind the figure. Trolleys, an Etail Depot service, helps merchants <Link href="/services/disputes" prefetch={false}>review dispute notices and follow account outcomes</Link>. When two reports disagree, <Link href="/company/contact#payment-review" prefetch={false}>ask our team to review the difference</Link> with the report names, date ranges and relevant references. Account-specific review is more useful than treating a generic internet percentage as a safe limit.</p>
    </section>

    <p>The next report should let you explain why the number moved. Perhaps sales grew. Perhaps older complaints arrived. Perhaps a change to fulfillment finally reduced the disputes attached to those orders.</p>
    <p>All three are worth knowing. Only the last tells you that this particular customer problem is improving. Keep the percentage, but make sure the business can see the story underneath it.</p>
  </BlogArticlePage>;
}
