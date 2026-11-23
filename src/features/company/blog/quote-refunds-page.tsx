import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { quoteRefundsArticle } from "./quote-refunds-content";

export function QuoteRefundsPage() {
  return <BlogArticlePage article={quoteRefundsArticle}>
    <p>A completed refund resolves what the customer is owed. It does not necessarily restore the merchant to the position they were in before the order.</p>
    <p>There may already have been packaging, shipping, handling and payment costs. Some can be recovered. Others remain. A processing comparison that ends at the original sale gives no answer about those costs, even though returns may be routine for the business.</p>
    <p>That omission is particularly easy to miss when a proposal says there is no refund fee.</p>

    <section id="two-different-promises" aria-labelledby="two-different-promises-title">
      <h2 id="two-different-promises-title">“No refund fee” is an incomplete answer</h2>
    <p>A fee for issuing a refund and the fee for processing the original payment are two different charges. A provider can waive the first while retaining the second. The merchant has paid no additional refund fee, yet still bears a payment cost on revenue returned to the customer.</p>
    <p>Stripe’s documentation states that its original processing fees are not returned. Trolleys’ <Link href="/company/legal/fees#refund-treatment" prefetch={false}>refund terms</Link> likewise retain original processing and currency conversion fees. These are concrete terms to account for, rather than a reason to assume every provider follows the same policy.</p>
    <p>Where a proposal offers a fee credit, the scope matters: which part of the original charge, on which payments, and under what conditions? A partial credit should be valued as a partial credit. An assurance about “free refunds” cannot substitute for that detail.</p>
    </section>

    <section id="the-cost-of-kept-sales" aria-labelledby="the-cost-of-kept-sales-title">
      <h2 id="the-cost-of-kept-sales-title">Judge the offer after customers have made up their minds</h2>
    <p>Returns change the relationship between payment volume and the sales the business ultimately keeps. A merchant may process the full purchase, refund part of it and retain a much smaller sale. The original payment fee was incurred on a different amount from the retained revenue.</p>
    <p>That does not make the fee calculation wrong. It makes a comparison based only on checkout volume incomplete for the owner’s decision.</p>
    <p>A proposal that returns more of the original fee is not automatically cheaper. A higher charge on every sale can outweigh the credits on returned ones. Equally, a lower checkout rate can lose its advantage when the merchant bears more of the cost of refunds. Full refunds, partial refunds and any additional charges belong in the same comparison, applied to the same store activity.</p>
    <p>If returns are negligible, this distinction may change little. If they are routine, refund treatment can decide which offer saves money. “No refund fee” describes one line of the bill. The owner needs the cost of the business left after customers have been repaid.</p>
    </section>
  </BlogArticlePage>;
}
