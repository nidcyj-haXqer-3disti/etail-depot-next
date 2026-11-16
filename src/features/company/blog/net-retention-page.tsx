import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { netRetentionArticle } from "./net-retention-content";
import s from "./blog.module.css";

const movements = [
  ["Starting revenue", "100", "Recurring revenue from the customers in the starting group."],
  ["Churn", "−10", "Revenue lost when customers in that group cancel."],
  ["Contraction", "−5", "Revenue lost when remaining customers reduce their plans or spending."],
  ["Expansion", "+20", "Additional recurring revenue from customers already in the group."],
  ["Ending group revenue", "105", "100 − 10 − 5 + 20. New customer revenue is excluded."],
] as const;

export function NetRetentionPage() {
  return <BlogArticlePage article={netRetentionArticle}>
    <section id="formula" aria-labelledby="formula-title">
      <h2 id="formula-title">Define the starting group and revenue basis</h2>
      <p>Choose the reporting period and list the customers included at its start. This fixed group is the cohort. Measure recurring revenue from those same customers at the end, keeping customers who canceled in the original group with no remaining recurring revenue.</p>
      <p><strong className={s.editorialFormula}>NRR = ending recurring revenue from the starting group ÷ starting recurring revenue × 100.</strong></p>
      <p>Use a consistent basis, such as monthly recurring revenue, or MRR, at both dates. MRR expresses recurring subscriptions as a monthly value. An annual subscription therefore needs a monthly equivalent rather than its full annual payment in one month. Keep one time charges out of a recurring revenue calculation.</p>
      <p>Document the dates, currency treatment and rules for discounts, reactivations and overdue accounts. If a customer in the starting group leaves and returns, record that departure and return consistently. Do not silently add returning customers who were outside the group used for your calculation.</p>
      <p>Provider reports can apply different policies. ChartMogul, for example, offers settings that change how reactivations and contraction affect NRR. Inspect the selected definition before comparing reports. If starting recurring revenue is zero, the ratio is undefined; report it as not applicable.</p>
    </section>
    <section id="worked-cohort" aria-labelledby="worked-cohort-title">
      <h2 id="worked-cohort-title">Calculate NRR for the starting customer group</h2>
      <p>Without reactivations or currency adjustments, ending group revenue is starting revenue minus churn and contraction, plus expansion. The following calculation sets starting MRR to 100 revenue units and uses that same scale throughout.</p>
      <figure className={s.editorialRevenueBridge} aria-labelledby="revenue-movements-caption">
        <figcaption id="revenue-movements-caption">Recurring revenue movements for the same customer group</figcaption>
        <ol className={s.editorialRevenueMovements} role="list">
          {movements.map(([movement, units, meaning], index) => <li key={movement} className={index === 0 ? s.editorialRevenueOpening : index === movements.length - 1 ? s.editorialRevenueClosing : undefined}>
            <span className={s.editorialRevenueUnits}>{units}</span>
            <div><h3>{movement}</h3><p>{meaning}</p></div>
          </li>)}
        </ol>
      </figure>
      <p><strong className={s.editorialFormula}>NRR = 105 ÷ 100 × 100 = 105%.</strong> The starting customer group now generates 5% more recurring revenue, even though some of its revenue was lost.</p>
      <p>Suppose newly acquired customers contribute another 30 revenue units. Total ending MRR becomes 135, but the NRR numerator remains 105. Dividing 135 by 100 would mix retention with acquisition. Track new customer revenue separately.</p>
      <p>Use the recurring revenue values at the two dates, not the sum of every invoice issued between them. Keep monthly, quarterly and annual comparison periods clearly labeled rather than treating their percentages as interchangeable.</p>
    </section>
    <section id="gross-retention" aria-labelledby="gross-retention-title">
      <h2 id="gross-retention-title">Check what expansion is hiding</h2>
      <p>Gross revenue retention, or GRR, measures the starting recurring revenue retained after churn and contraction, without adding expansion. In this calculation, the retained amount before expansion is 85 units: 100 minus 10 minus 5.</p>
      <p><strong className={s.editorialFormula}>GRR = 85 ÷ 100 × 100 = 85%.</strong> The pair, 105% net and 85% gross, shows that growth in some existing accounts more than offsets losses elsewhere.</p>
      <p>Inspect which accounts supply that expansion. One large upgrade can conceal widespread downgrades or cancellations. Segment by customer size or product when those groups have materially different patterns, while retaining the original overall calculation. Do not remove a failed segment to make the headline improve.</p>
      <p>NRR measures revenue retention rather than the percentage of customers retained. Track customer counts separately so higher spending by a few accounts does not obscure a shrinking customer base.</p>
    </section>
    <section id="interpret" aria-labelledby="interpret-title">
      <h2 id="interpret-title">Use the metric alongside operating evidence</h2>
      <ul>
        <li><strong>Reconcile the movement.</strong> Account for the difference between starting and ending group revenue with identifiable account changes. Check that a cancellation or downgrade has not been counted twice.</li>
        <li><strong>Keep the policy consistent.</strong> Record any change to discount, currency, reactivation or overdue account treatment. A definition change can move the metric without changing customer behavior.</li>
        <li><strong>Keep cash separate.</strong> Recurring revenue metrics are not bank receipts. Collection delays, annual prepayments and refunds need separate analysis.</li>
      </ul>
      <p>Stripe’s analytics documentation, for example, includes subscriptions marked past due in its MRR definition until they meet its churn conditions. That is one reason a recurring revenue total is not proof that every invoice has been collected. Our <Link href="/company/blog/saas-payment-processing" prefetch={false}>SaaS payment processing article</Link> separates billing, collection and software access.</p>
      <p>NRR does not measure profit, acquisition cost or customer satisfaction. Use it to locate account patterns and investigate their causes. There is no single target that fits every SaaS model, and a rising percentage alone does not establish a healthier business. Compare it with the collection and operating records described in our <Link href="/company/blog/payment-analytics" prefetch={false}>payment analytics article</Link>.</p>
    </section>
  </BlogArticlePage>;
}
