import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { customerMixCostsArticle } from "./customer-mix-costs-content";

export function CustomerMixCostsPage() {
  return <BlogArticlePage article={customerMixCostsArticle}>
    <p>An owner sees the processing cost rise as a percentage of sales and starts looking for a rate increase. The rates are unchanged. What changed was the customer base.</p>
    <p>Perhaps the store acquired customers abroad. Perhaps regular buyers began placing smaller replenishment orders. Perhaps more sales now come through a payment method with different terms. The effective cost can rise even when the provider applies exactly the same pricing.</p>
    <p>The uncomfortable part is that this can happen during good growth. A worse payment ratio does not, by itself, establish a worse business.</p>

    <section id="price-and-mix" aria-labelledby="price-and-mix-title">
      <h2 id="price-and-mix-title">Separate the bill from the business behind it</h2>
    <p>There are two questions worth answering. What would the current activity have cost under the previous prices? And what would the previous activity cost under the current prices? Comparing like activity helps expose a genuine pricing change; comparing activity under consistent prices shows the effect of the sales mix.</p>
    <p>Keep the periods and charging basis consistent; refund timing, fixed fees and separately billed services can otherwise blur the result. The distinction changes the response. A higher price for the same activity belongs in a discussion about terms. More costly activity at unchanged prices calls for a look at what the new sales earn. Treating both as a rate increase can send the owner into the wrong negotiation.</p>
    <p>That explanation should be more specific than “your customers use expensive cards.” It should identify the relevant payment categories and their contribution to the change, without pretending that the merchant controls every card a customer carries.</p>
    </section>

    <section id="what-the-customers-earn" aria-labelledby="what-the-customers-earn-title">
      <h2 id="what-the-customers-earn-title">The fee ratio cannot rank your customers</h2>
    <p>A customer who costs more to process may buy at full price, need little support and return regularly. A customer with a cheaper payment method may require a large acquisition discount and return much of the order. Payment expense alone cannot rank those relationships.</p>
    <p>Examine what the business keeps after serving the customer, including the costs relevant to that sale. Where repeat behavior matters, use observed contribution over time. A plan to recover losses from future purchases needs evidence, rather than a convenient lifetime-value assumption.</p>
    <p>This does not make the fee increase unimportant. A growing store may have a sound reason to negotiate new terms or offer an appropriate additional payment method. The point is to preserve the valuable demand while improving the cost of serving it.</p>
    <p>For Trolleys, the <Link href="/company/legal/fees#calculation" prefetch={false}>calculation rules</Link> explain how the payment affects the fee. The merchant’s own records explain how the customer affects the business. Keeping both in view avoids a costly mistake: discouraging profitable customers because their transactions make one ratio look worse.</p>
    </section>
  </BlogArticlePage>;
}
