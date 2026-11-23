import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { qualifiedRateArticle } from "./qualified-rate-content";

export function QualifiedRatePage() {
  return <BlogArticlePage article={qualifiedRateArticle}>
    <p>A low rate can be perfectly accurate and still be a poor description of what a merchant will pay. That happens when the price applies to a narrow part of the business while the proposal allows it to stand for the whole.</p>
    <p>“Qualified” deserves particular attention. In a tiered processing proposal, it can label the lowest priced group. Other transactions may fall into more expensive groups under the provider’s rules. Chase’s pricing explanation, for example, distinguishes qualified, mid-qualified and non-qualified tiers. The headline alone does not reveal the bill.</p>

    <section id="price-the-other-sales" aria-labelledby="price-the-other-sales-title">
      <h2 id="price-the-other-sales-title">The other sales are part of the offer</h2>
    <p>The proposal becomes useful when it prices the transactions the merchant already receives. A representative period should show the amount and count in each tier, the price attached to it and the reason the transactions landed there. If the lowest tier covers only a small share, most of the buying decision sits in the other rows.</p>
    <p>For a simplified illustration, suppose $10,000 of payments is split between 20% at a 2% qualified rate and 80% at a 3.5% rate. The percentage charges are $40 plus $280, or $320. That is 3.2% across the payments, before any fixed or other charges. These fictional rates are not Trolleys pricing. They show why the lowest number cannot describe the offer on its own.</p>
    <p>An online seller cannot evaluate an offer built around transactions it does not accept. Nor should it assume that an unfamiliar tier means its staff made an error. Card characteristics, payment channel and the agreed classification rules may determine the result. Where a controllable processing practice affects qualification, the provider should identify it separately from conditions the merchant cannot change.</p>
    <p>There is also a distinction between a provider’s retail pricing tiers and the card networks’ underlying interchange categories. Visa describes merchant pricing as an arrangement between the merchant and its financial institution. A tier name in a sales quote is not, by itself, a network instruction to charge that retail price.</p>
    </section>

    <section id="make-the-promise-testable" aria-labelledby="make-the-promise-testable-title">
      <h2 id="make-the-promise-testable-title">A useful rate can be tested after the sale</h2>
    <p>The first normal billing period should let the merchant compare the promised mix with the actual mix. If the lowest tier covers much less activity than the proposal assumed, the question is what changed: the business, the classification or the original assumption.</p>
    <p>Trolleys merchants should use the <Link href="/company/legal/fees" prefetch={false}>accepted account pricing</Link>, including any documented variation, rather than importing another provider’s tier labels into their agreement. A rate presented during a conversation needs to retain its conditions when it becomes an account charge.</p>
    <p>A merchant does not need every sale to qualify for the cheapest rate. It needs the price of the whole business to make sense. That is what the proposal must demonstrate.</p>
    </section>
  </BlogArticlePage>;
}
