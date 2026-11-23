import { BlogArticlePage } from "./article-page";
import { subscriptionTransactionCostsArticle } from "./subscription-transaction-costs-content";

export function SubscriptionTransactionCostsPage() {
  return <BlogArticlePage article={subscriptionTransactionCostsArticle}>
    <p>A payment subscription asks the merchant to pay something before knowing how much they will sell. In return, it may offer a lower charge on each payment or a set of useful services.</p>
    <p>That trade can be sensible. It also changes who carries the cost of a quiet month. Under a usage-only arrangement, the merchant’s bill follows activity. A subscription commits part of that bill before the merchant knows whether the month will be strong or weak.</p>
    <p>For a simple illustration, imagine paying $90 a month to reduce an otherwise identical per-payment charge by 18¢. The fee saving covers the subscription at 500 payments. Below that count, the subscription costs more; above it, it costs less. Other terms are held equal in this example.</p>
    <p>The arithmetic is useful because it shows what the merchant has committed to. It is not a forecast. A store can cross the threshold in December and miss it for much of the year. A new business can plan to cross it and take longer than expected.</p>
    <p>When the commitment spans several months, use the activity expected over those months. Do not annualize the busiest one. If the plan can genuinely be changed monthly, include the applicable notice, effective date and any effect on features before relying on that flexibility.</p>

    <section id="what-else-you-buy" aria-labelledby="what-else-you-buy-title">
      <h2 id="what-else-you-buy-title">The software may be worth more than the rate difference</h2>
    <p>A subscription can include functions the business would otherwise pay for or perform manually. Those benefits should be evaluated on their own merits. A tool that removes recurring work can justify a subscription even when fee savings alone do not.</p>
    <p>The opposite also occurs: an attractive processing discount can draw a merchant into paying for features nobody uses. Counting the retail price of unused tools as a saving makes the package look more valuable without improving the business.</p>
    <p>These are two separate reasons to subscribe. One rests on enough qualifying payments to recover the monthly charge. The other rests on useful work the service will replace. Putting a value on each makes it harder for unused features to disguise a weak processing discount.</p>
    <p>For a store with steady activity, the commitment may be easy to justify. For a new store still discovering how often customers buy, the flexibility to pay with usage may be worth more than the lower advertised rate. The owner is choosing how much of next month’s bill to commit before next month’s customers arrive.</p>
    </section>
  </BlogArticlePage>;
}
