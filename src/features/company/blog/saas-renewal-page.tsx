import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { saasRenewalArticle } from "./saas-renewal-content";
import s from "./blog.module.css";

const outcomes = [
  ["Renewed", "40", "Met the chosen renewal rule by the reporting date."],
  ["Payment unresolved", "3", "Intend to continue, but payment has not succeeded."],
  ["Decision unresolved", "7", "Have not yet confirmed whether they will continue."],
  ["Total due to renew", "50", "The full eligible group remains in the denominator."],
] as const;

export function SaasRenewalPage() {
  return <BlogArticlePage article={saasRenewalArticle}>
    <section id="denominator" aria-labelledby="denominator-title">
      <h2 id="denominator-title">Build the group due to renew first</h2>
      <p><strong className={s.editorialFormula}>Customer renewal rate = customers who renewed ÷ customers due to renew × 100.</strong></p>
      <p>Choose the reporting window and define what counts as renewed. You might measure an agreed contract extension or a completed renewal payment. These answer different questions, so name the rule and apply it consistently. Record the reporting date and any final cutoff for resolving late renewals.</p>
      <p>Build the eligible list before calculating the result. Include the customers whose terms reach renewal in that window. Exclude customers whose first renewal is not yet due and subscriptions that already ended before the window. Keep a customer who declines an eligible renewal in the denominator; removing them would hide a loss.</p>
      <p>If one customer has several contracts with different dates, choose a customer counting rule or calculate a contract renewal rate. Do not count customers in the numerator and contracts in the denominator. Document how you treat repeated monthly renewals within a longer reporting window.</p>
      <p>Keep the eligible list with the report so later changes are traceable. If nobody is due to renew, show the rate as not applicable rather than 0% or 100%.</p>
    </section>
    <section id="example" aria-labelledby="example-title">
      <h2 id="example-title">Keep unresolved cases visible</h2>
      <p>Consider 50 customers due to renew, with a successful renewal payment required for this calculation. At an interim reporting date, the outcomes are:</p>
      <figure className={s.editorialCohort} aria-labelledby="renewal-outcomes-caption">
        <figcaption id="renewal-outcomes-caption">Renewal outcomes for the same 50 eligible customers</figcaption>
        <div className={s.editorialCohortTotal}>
          <strong>{outcomes[3][1]}</strong>
          <div><h3>{outcomes[3][0]}</h3><p>{outcomes[3][2]}</p></div>
        </div>
        <div className={s.editorialCohortBar} aria-hidden="true">
          {outcomes.slice(0, 3).map(([outcome, count]) => <span key={outcome} style={{ flexGrow: Number(count) }} />)}
        </div>
        <dl className={s.editorialCohortOutcomes}>
          {outcomes.slice(0, 3).map(([outcome, count, meaning]) => <div key={outcome}>
            <dt><strong>{count}</strong><span>{outcome}</span></dt>
            <dd>{meaning}</dd>
          </div>)}
        </dl>
      </figure>
      <p><strong className={s.editorialFormula}>Renewal rate = 40 ÷ 50 × 100 = 80%.</strong> Ten cases are still unresolved. That does not establish a final 20% loss rate.</p>
      <p>Removing the seven undecided customers would produce 40 ÷ 43, or about 93%. Nothing improved; the report simply stopped counting people whose outcomes were unknown.</p>
      <p>If two more customers meet the rule by the final cutoff and no other outcomes change, the rate becomes 42 ÷ 50, or 84%, with eight customers not meeting the rule by that cutoff. Record their actual status. Do not label an unanswered case as a confirmed cancellation.</p>
      <p>Keep the dated 80% interim result and the later 84% result. A recovery after the final cutoff can be reported separately or in a clearly labeled revision, rather than silently changing the earlier report.</p>
    </section>
    <section id="reasons" aria-labelledby="reasons-title">
      <h2 id="reasons-title">Separate customer intent from collection</h2>
      <p>A failed charge does not tell you whether the customer wants to leave. Record the renewal decision, contract status and payment result separately. A customer who wants to continue may need help updating a payment method; a customer who sees little value may need a different conversation.</p>
      <p>The renewal rule matters here. A signed extension can satisfy a contract renewal measure while its invoice remains unpaid. It would not satisfy the paid renewal rule used in the calculation above. Give those measures different labels if you report both.</p>
      <p>A subscription marked active is not universal proof of payment either. Stripe documents configurations where a subscription can be active with an unpaid invoice. After a failed renewal charge, retry settings can also affect its later subscription status. Check the relevant invoice and provider definition before treating a status as a completed collection.</p>
      <p>Send unresolved cases to the right team with a next action and review date. Check the payment result before making another attempt. Our <Link href="/company/blog/saas-payment-processing" prefetch={false}>SaaS payment processing article</Link> explains the separate roles of billing, collection and software access.</p>
    </section>
    <section id="use-results" aria-labelledby="use-results-title">
      <h2 id="use-results-title">Compare customer counts and revenue</h2>
      <ul>
        <li><strong>Customer rate.</strong> Count eligible customers using the same rule. A large account and a small account each carry one vote.</li>
        <li><strong>Revenue view.</strong> Show the recurring value retained separately. Net revenue retention includes expansion; gross retention excludes it. Neither is interchangeable with the percentage of customers who renewed.</li>
        <li><strong>Reasons and timing.</strong> Separate confirmed departures from pending decisions and collection problems. Look at product fit, price, service issues and payment outcomes before choosing an intervention.</li>
      </ul>
      <p>Revenue retention uses a starting revenue group and its own reporting period, which may differ from the group due to renew. ChartMogul also documents settings that alter its net retention calculation. Our <Link href="/company/blog/net-revenue-retention-for-saas-businesses" prefetch={false}>net revenue retention article</Link> walks through the calculation and the difference between net and gross retention.</p>
      <p>Compare similar contract lengths and customer groups, and show counts beside percentages. In a group of 50, one customer changes the rate by two percentage points. The same movement can mean something different in a much larger group.</p>
      <p>Use a consistent series of completed periods to judge changes. A renewal rate is a starting point for investigation, not proof of customer satisfaction or a promise of future revenue.</p>
    </section>
  </BlogArticlePage>;
}
