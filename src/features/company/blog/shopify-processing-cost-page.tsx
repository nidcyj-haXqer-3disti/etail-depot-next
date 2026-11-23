import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { shopifyProcessingCostArticle } from "./shopify-processing-cost-content";

export function ShopifyProcessingCostPage() {
  return <BlogArticlePage article={shopifyProcessingCostArticle}>
    <p>A merchant receives a processing quote below its current rate and assumes moving the Shopify store will reduce costs. The quote may be accurate. The conclusion can still be wrong.</p>
    <p>An external provider’s processing bill is not necessarily the only transaction cost added by the move. Shopify can charge its own third-party transaction fee in addition to that bill.</p>

    <section id="price-the-same-orders" aria-labelledby="price-the-same-orders-title">
      <h2 id="price-the-same-orders-title">Run both arrangements against the same orders</h2>
    <p>Shopify’s published rules make the additional rate dependent on the store’s plan. The calculation includes the product amount after discounts, tax and shipping. Compare the same eligible orders, rather than applying one provider’s rate to product revenue and another to the full customer payment.</p>
    <p>Refund treatment matters as well. Where Shopify Payments is available in the store’s country, Shopify says its third-party transaction fees are not returned on a refund. Its published treatment differs where Shopify Payments is unavailable. The processor’s own refund terms are another component. A return-heavy merchant needs both in the forecast.</p>
    <p>Payment mix can change the result. Shopify provides specific exemptions, including PayPal transactions when Shopify Payments is the primary provider. Do not apply one additional rate indiscriminately to every tender type without checking the store’s actual configuration.</p>
    </section>

    <section id="cost-and-fit" aria-labelledby="cost-and-fit-title">
      <h2 id="cost-and-fit-title">The lowest bill still has to support the store</h2>
    <p>Suppose a hypothetical comparison of the same orders shows $120 less in processing charges but $150 more in platform charges. The store spends $30 more before considering implementation work. These are illustrative amounts, not Shopify or Trolleys prices. The lower processing bill is real within the example; it simply does not cover the other cost of obtaining it.</p>
    <p>Include any further costs caused by the change, such as a required app, a different plan or implementation work. Keep unchanged costs visible without counting the existing Shopify subscription as a new expense if the store would pay it either way. Then confirm the required features. Subscription compatibility, customer payment methods and the merchant’s region can constrain the choices. A proposal that cannot support an essential sales model is not an equivalent lower-priced offer.</p>
    <p>Trolleys’ <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify integration</Link> connects an approved account through Cybersource. The Trolleys quote does not remove Shopify’s own charges or requirements. Ask for a comparison that identifies both sets of costs and verifies the functions the store uses before moving payments.</p>
    <p>An external provider can still be worth choosing for account service, an appropriate commercial arrangement or another verified requirement. In that case, the merchant is deciding whether the benefit warrants the full cost, and can judge it on that basis. Keeping that decision separate from a savings claim makes the proposal clearer: the owner can see what becomes cheaper, what becomes more expensive and what the business expects to gain.</p>
    </section>
  </BlogArticlePage>;
}
