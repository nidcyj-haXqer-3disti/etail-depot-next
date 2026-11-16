import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { grossChurnArticle } from "./gross-churn-content";
import s from "./blog.module.css";

export function GrossChurnPage() {
  return <BlogArticlePage article={grossChurnArticle}>
    <p>A dashboard can show a falling churn rate while the same number of customers keep leaving. If the calculation includes new customers in its denominator, strong acquisition can make the percentage look better without reducing the departures.</p>
    <p>Recurring revenue can tell a similarly incomplete story. New sales and upgrades may keep the total rising while an existing part of the customer base steadily shrinks. The growth is real. So are the losses it covers.</p>
    <p>Gross churn makes those losses visible before gains offset them. It is useful precisely because it leaves the successful sales conversation out of the calculation. But you still need to know which customers, which revenue and which period the number describes.</p>

    <section id="two-kinds-of-loss" aria-labelledby="two-kinds-of-loss-title">
      <h2 id="two-kinds-of-loss-title">Losing customers and losing revenue are different problems</h2>
      <p>Gross customer churn counts departures. Gross revenue churn includes recurring revenue lost through cancellations and reductions in spending. Stripe’s gross-churn guidance describes both using a starting population, with new sales and expansion kept out of the loss calculation.</p>
      <p>For a simple customer calculation, take the paying customers present at the beginning of the period and identify which of them left during it. Count each departing customer once and report returns separately.</p>
      <p><strong className={s.editorialFormula}>Customer churn = customers lost from the starting group ÷ starting customers × 100.</strong></p>
      <p>Then measure the recurring revenue lost from that same group. A downgrade matters here even if the customer stays. Use a consistent recurring revenue basis, such as monthly recurring revenue, or MRR, rather than mixing subscription values with cash collected.</p>
      <p><strong className={s.editorialFormula}>Gross revenue churn = recurring revenue lost to cancellations and reductions ÷ starting recurring revenue × 100.</strong></p>
      <p>If the starting customer or revenue base is zero, its rate is undefined. Report it as not applicable. For other periods, keep the underlying counts and revenue amounts beside the percentages so a small customer base does not make a large-looking movement impossible to interpret.</p>
      <p>The two rates can move differently. Losing one large account can leave customer churn looking modest while removing substantial revenue. Losing several small accounts can produce the opposite picture. A customer who reduces their subscription may remain in your customer count while contributing less to the business.</p>
      <p>ChartMogul illustrates another distinction: a customer with multiple subscriptions remains active when they cancel only some of them. Its reporting treats that reduction as contraction rather than the loss of the entire customer. Decide whether your own unit is a customer, business or subscription before comparing the numbers.</p>
      <p>Expansion belongs in a separate view. Our article on <Link href="/company/blog/net-revenue-retention-for-saas-businesses" prefetch={false}>net revenue retention</Link> explains how growing accounts can offset losses elsewhere. Looking at both measures lets you recognize successful expansion without treating it as evidence that fewer customers are leaving.</p>
    </section>

    <section id="check-the-definition" aria-labelledby="check-the-definition-title">
      <h2 id="check-the-definition-title">The dashboard label is not the definition</h2>
      <p>Stripe’s Billing Analytics documentation defines its subscriber churn rate over the past 30 days using starting active subscribers plus new subscribers in the denominator. That differs from a calculation restricted to the starting group. Holding the number of departures constant, adding more new subscribers lowers that reported percentage.</p>
      <p>Neither calculation can be interpreted properly without its definition. Do not compare the two as if they answered the same question, or conclude that retention improved merely because you moved to a report with a larger denominator.</p>
      <p>Settings can change the revenue view too. ChartMogul documents an option to exclude contraction from its gross MRR churn calculation. Selecting it lowers the reported loss by leaving downgrades out. That may suit a particular analysis, but it does not mean the lost revenue returned.</p>
      <p>Record the period, starting group and treatment of cancellations, returns, discounts and currency changes. Use a consistent rule for accounts that change plans repeatedly so the same revenue is not counted as lost more than once. Keep monthly and annual rates distinct. When a definition changes, label the break in the comparison instead of presenting it as a change in customer behavior.</p>
      <p>A failed payment also needs careful treatment. Stripe considers a subscriber churned when all their subscriptions are canceled or marked unpaid. A payment attempt still in recovery is not, by itself, proof that the customer chose to leave. Keep the billing outcome and the customer’s decision separate.</p>
    </section>

    <section id="investigate-the-loss" aria-labelledby="investigate-the-loss-title">
      <h2 id="investigate-the-loss-title">Find the customers behind the movement</h2>
      <p>A churn rate locates a problem; it does not explain the cause. Review the actual departures and reductions. Did the customer stop using the product, need fewer seats, close the business or run into a billing problem? Keep unknown reasons visible rather than assigning every loss to price or dissatisfaction.</p>
      <p>Group comparable customers when investigating a pattern. Recent signups may be struggling to get started while established accounts are reducing usage. Those call for different conversations. Preserve the overall result while examining smaller groups, and show their size before treating a percentage as a trend.</p>
      <p>For a billing-related loss, investigate whether the customer had a workable way to resolve the payment. Our article on <Link href="/company/blog/dunning-emails" prefetch={false}>failed-payment emails</Link> examines that recovery experience. Sending more reminders will not fix an unclear product offer, and changing the product will not correct a broken payment-update process.</p>
      <p>The useful outcome is an identified loss with a credible reason and an appropriate response. A lower percentage is encouraging when it reflects that work. It deserves a second look when it comes only from new sales, a changed setting or a different definition.</p>
    </section>
  </BlogArticlePage>;
}
