import { BlogArticlePage } from "./article-page";
import { ratePerOrderArticle } from "./rate-per-order-content";

export function RatePerOrderPage() {
  return <BlogArticlePage article={ratePerOrderArticle}>
    <p>A tenth of a percentage point looks important in a proposal. Twenty cents looks incidental. On a small order, the twenty cents can matter much more.</p>
    <p>For illustration, compare 2.4% plus 30¢ with 2.7% plus 10¢. A $20 payment costs 78¢ under the first offer and 64¢ under the second. The higher percentage is cheaper. At $100, the result reverses: $2.70 against $2.80. These are invented offers used only to isolate the effect of the fixed charge.</p>
    <p>Nothing about either rate changed between those purchases. The order changed.</p>
    <p>A business selling replacement parts and a business selling entire machines can have the same monthly revenue and very different payment counts. The first may incur the fixed charge many more times. A comparison that uses revenue alone misses the difference.</p>
    <p>Under a simple percentage plus fixed fee structure, total payment value and the number of charged transactions are enough to calculate those two components. But a real agreement may also distinguish payment methods, card origin, account charges or other events. The useful proposal starts with the activity the merchant actually expects.</p>
    <p>An average order value can help summarize that activity. It should not conceal a new product line whose smaller payments will change the mix. A quote for last year’s equipment sales may be a poor quote for this year’s accessories business.</p>
    <p>Once the fixed fee is visible, it can be tempting to treat small orders as a problem to eliminate. That goes too far. A small first purchase may introduce a good customer. A replenishment order may carry little acquisition cost. The payment fee alone cannot tell you what either relationship is worth.</p>
    <p>It can tell you whether the quote fits the business you intend to run. Compare the offers at that business’s expected payment value and count, then consider the rest of the service. A saving measured in cents per order can be material at scale, but it should not excuse unreliable support or an integration that creates avoidable work.</p>
    <p>That changes the negotiation. A merchant with many small payments may gain more from a lower fixed charge than from a conspicuous percentage reduction. If the provider lowers one component and raises the other, the same expected payment value and count reveal what the concession is worth. The better offer is the one that costs less for those purchases, even when its headline percentage is higher.</p>
  </BlogArticlePage>;
}
