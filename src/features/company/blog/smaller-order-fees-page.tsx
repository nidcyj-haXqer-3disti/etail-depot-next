import { BlogArticlePage } from "./article-page";
import { smallerOrderFeesArticle } from "./smaller-order-fees-content";

export function SmallerOrderFeesPage() {
  return <BlogArticlePage article={smallerOrderFeesArticle}>
    <p>Revenue is flat. Order count is up. The team is busier, the packaging bill has grown and the effective processing cost has risen. The provider’s rate has not changed.</p>
    <p>The business is doing more work to earn the same sales.</p>
    <p>A fixed payment charge makes part of that visible. At an illustrative 30¢ per payment, 1,000 payments cost $300 in fixed charges; 2,000 cost $600. The percentage component could stay identical if total payment value stayed the same. Packing, support and delivery can add their own cost each time another order is created.</p>

    <section id="why-the-baskets-shrank" aria-labelledby="why-the-baskets-shrank-title">
      <h2 id="why-the-baskets-shrank-title">The cause matters more than the average</h2>
    <p>Smaller baskets can signal very different things. A promotion may have attracted customers buying only the discounted item. Regular customers may be returning more frequently for replenishment. A new entry product may be bringing people into the business who would never have made the larger purchase.</p>
    <p>A regular customer can spend the same amount over a season while spreading it across more deliveries. The relationship has become busier without necessarily becoming more valuable. A new buyer trying an entry product presents a different possibility: demand the store did not previously have. Average order value combines both changes, while order count can make both look like growth.</p>
    <p>Follow what remains from the sale after product, fulfillment and payment costs, then examine the customer’s subsequent behavior. Repeat business has to be observed over an appropriate period. Hoping a loss-making first purchase eventually becomes valuable is not evidence that it does.</p>
    </section>

    <section id="the-cost-of-fixing-it" aria-labelledby="the-cost-of-fixing-it-title">
      <h2 id="the-cost-of-fixing-it-title">A larger basket has to be earned</h2>
    <p>Minimum orders, bundles and shipping thresholds can change buying behavior. They can also make the purchase less useful to the customer. The additional margin from a larger order needs to be weighed against customers who stop buying or defer a purchase.</p>
    <p>There is no reason to redesign a store around a payment fee in isolation. A small order may be attractive if it is inexpensive to fulfill and brings a customer back. A large order can be unattractive if discounts and delivery concessions consume the contribution.</p>
    <p>The processing arrangement should nevertheless reflect the current pattern. If a store now generates many more payments for the same revenue, the fixed charge has become more consequential. That is a concrete reason to revisit the quote, rather than describing the increase as a mysterious rise in the provider’s rate.</p>
    <p>Order count is useful evidence of activity. Profit depends on what that activity earns. The owner needs both views before celebrating the extra orders or trying to discourage them.</p>
    </section>
  </BlogArticlePage>;
}
