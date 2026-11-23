import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { fundingPremiumArticle } from "./funding-premium-content";

export function FundingPremiumPage() {
  return <BlogArticlePage article={fundingPremiumArticle}>
    <p>A supplier will hold the stock until Friday. The standard payout is expected on Monday. Getting the money earlier could preserve a sale, avoid borrowing or keep an order on schedule. In that situation, speed has a job to do.</p>
    <p>On another week, the same accelerated payout might simply sit in the bank. The fee would still be real. The business benefit would be harder to identify.</p>
    <p>That distinction is a better starting point than deciding whether faster funding is generally “worth it.” The merchant is buying earlier use of a particular amount of money, for a particular purpose.</p>

    <section id="the-deadline" aria-labelledby="the-deadline-title">
      <h2 id="the-deadline-title">The deadline determines the value</h2>
    <p>Identify the decision that changes if the money arrives sooner. Paying a supplier in time to secure inventory is different from making the bank balance look more comfortable. Where the alternative is borrowing, compare the actual cost of that alternative over the relevant period, including fees. Where the benefit is avoiding a missed sale, use the contribution the sale would earn, rather than treating all its revenue as profit.</p>
    <p>Then establish whether the service can meet the deadline. Eligibility, available balance, receiving account and transfer limits can restrict what is accelerated. A faster payout option cannot be assumed to make every dollar in the dashboard immediately accessible.</p>
    <p>Stripe’s Instant Payout documentation, for example, separates the eligible balance from other funds and applies limits and fees. That illustrates why a product name alone is insufficient. The merchant needs the conditions for the account they actually use.</p>
    </section>

    <section id="paying-for-a-pattern" aria-labelledby="paying-for-a-pattern-title">
      <h2 id="paying-for-a-pattern-title">An occasional bridge can become a recurring expense</h2>
    <p>A fee that is reasonable during an unusual cash gap can become expensive if every payout is accelerated. Repeated use deserves a look at the pattern behind it: supplier terms, inventory timing, customer collection or the ordinary funding schedule. There may be a better way to coordinate those dates.</p>
    <p>It is equally unhelpful to treat every need for earlier cash as a failure of planning. A growing business can encounter a worthwhile opportunity before its scheduled funds arrive. The decision should be made with the cost and the expected benefit visible.</p>
    <p>Trolleys’ published payout schedule does not include instant payouts or accelerated settlement. Confirm the schedule that applies to your account under the <Link href="/company/legal/payouts-and-reserves" prefetch={false}>accepted funding terms</Link>. Changing payout frequency does not itself make unsettled funds available sooner.</p>
    <p>Before paying for speed, finish the sentence: “Getting this amount by this date allows us to…” A specific answer gives the fee something to be measured against. Without one, faster may simply mean paying extra to receive money the business did not yet need.</p>
    </section>
  </BlogArticlePage>;
}
