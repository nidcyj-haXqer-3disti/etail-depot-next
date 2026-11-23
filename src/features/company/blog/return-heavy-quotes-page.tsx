import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { returnHeavyQuotesArticle } from "./return-heavy-quotes-content";

export function ReturnHeavyQuotesPage() {
  return <BlogArticlePage article={returnHeavyQuotesArticle}>
    <p>An apparel order can be paid, shipped, partly returned and exchanged for another size before the merchant knows what the customer will keep. A payment quote built around the first checkout sees only the beginning of that order.</p>
    <p>For a store where returns are routine, that is an incomplete picture of the business. The processor has priced money collected. The owner needs to understand the cost of the sales that remain.</p>

    <section id="the-return-has-several-endings" aria-labelledby="the-return-has-several-endings-title">
      <h2 id="the-return-has-several-endings-title">A returned item does not always mean refunded money</h2>
    <p>A return can end in a full refund, a partial refund, an even exchange or a further amount to collect. Those outcomes create different payment activity. Shopify’s return workflow explicitly distinguishes them, including the additional collection that can follow an exchange.</p>
    <p>Treating every return as a full refund overstates some costs and misses others. A cheaper replacement can leave a partial refund. A more expensive replacement can require a new payment. An even exchange may move stock without another payment at all.</p>
    <p>A recent sales week can be a misleading sample if customers are still deciding what to keep. Its payment costs look complete while its returns and exchanges have yet to unfold. Representative orders need enough history to reveal those later events. Applying each proposal to that history captures retained original fees, refund charges and additional collections where the agreement charges for them.</p>
    <p>For Trolleys merchants, original processing and currency conversion fees remain after a refund under the <Link href="/company/legal/fees#refund-treatment" prefetch={false}>published terms</Link>. That cost needs to be part of the store’s return economics before a quote can claim a saving.</p>
    </section>

    <section id="the-policy-is-part-of-the-product" aria-labelledby="the-policy-is-part-of-the-product-title">
      <h2 id="the-policy-is-part-of-the-product-title">A return policy can earn its cost</h2>
    <p>An easy return can help a customer buy with confidence, particularly when fit or suitability is difficult to judge online. The business may deliberately accept the cost as part of its offer. That decision should be evaluated against what the relationship earns, including repeat purchases where they actually occur.</p>
    <p>It should also distinguish avoidable returns from useful flexibility. An inaccurate product description, inconsistent sizing or fulfillment error can produce payment and handling costs without delivering the customer benefit the policy was designed for. Better product information may solve a more important problem than negotiating a fraction off the processing rate.</p>
    <p>There is a timing dimension too. The sale may fund an earlier period while the refund must be paid in a later one. Comparing a sales peak with a subsequent refund-heavy month without tracing the orders can distort both the fee analysis and cash expectations.</p>
    <p>For this store, the order’s financial result emerges after the customer has decided what to keep. A quote judged only at checkout stops too early to tell the owner whether it fits.</p>
    </section>
  </BlogArticlePage>;
}
