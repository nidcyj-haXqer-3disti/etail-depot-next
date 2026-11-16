import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { ecommerceDiscountsArticle } from "./ecommerce-discounts-content";
import s from "./blog.module.css";

const calculation = [
  ["Income", "Record the selling price and delivery charges you retain.", "Use the discounted price and any delivery charges the customer still pays."],
  ["Order costs", "Include product cost, payment fees, packing, fulfillment and expected returns.", "Recalculate costs for the offer, including changes in quantities, fees and handling."],
  ["Contribution", "Subtract variable order costs from the income retained.", "Subtract the revised variable costs from the discounted income."],
  ["Campaign", "Keep ongoing overhead separate from contribution per order.", "Deduct additional campaign spending once when comparing total results."],
] as const;

export function EcommerceDiscountsPage() {
  return <BlogArticlePage article={ecommerceDiscountsArticle}>
    <section id="objective" aria-labelledby="objective-title">
      <h2 id="objective-title">Give the discount a clear purpose</h2>
      <p>A clearance offer, a first purchase incentive and a quantity discount solve different problems. State the objective precisely enough to evaluate it: sell a specified group of aging items, acquire customers who return, or reduce the handling cost per item. Avoid treating all discounted revenue as evidence of success.</p>
      <p>Choose the eligible products and customers before writing the headline. Exclude items that cannot support the offer, or deliberately budget the loss as part of the test. If a promotion depends on a threshold, clarify whether that threshold is measured before discounts, shipping and tax.</p>
      <p>Use a genuine reference price when advertising savings. The FTC’s guidance on former price comparisons warns against inventing or inflating an earlier price simply to make a discount look larger. Keep the price history behind a “was” price; also check requirements that apply where you sell.</p>
    </section>
    <section id="math" aria-labelledby="math-title">
      <h2 id="math-title">Calculate the contribution tradeoff</h2>
      <p>Contribution is the income left after variable costs, available to cover fixed costs and profit. It is not the same as the business’s final profit. If costs stay the same, a price reduction removes that amount from contribution, so the percentage fall in contribution can be much larger than the advertised discount.</p>
      <table className={s.comparison}>
        <caption>Compare the same product or basket using your actual costs</caption>
        <thead><tr><th scope="col">Measure</th><th scope="col">Before the offer</th><th scope="col">With the offer</th></tr></thead>
        <tbody>{calculation.map(([measure, before, after]) => <tr key={measure}>
          <th scope="row">{measure}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Before the offer</span>{before}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">With the offer</span>{after}</td>
        </tr>)}</tbody>
      </table>
      <p>To estimate the sales volume needed to preserve total contribution, divide the original contribution per unit by the discounted contribution per unit. Multiply the original unit volume by that ratio. This comparison assumes both contributions are positive, the same product mix and no additional campaign or fixed costs.</p>
      <p>If discounted contribution is zero or negative, selling more at that price cannot restore a positive contribution from those sales alone. If extra advertising, returns or fulfillment overtime are required, the hurdle is higher. Recalculate rather than assuming every cost stays fixed when volume grows.</p>
      <p>Exclude taxes you collect for authorities from income retained. Count shipping subsidies and campaign costs once, using the same treatment on both sides of the comparison. Our <Link href="/company/blog/create-an-online-shop" prefetch={false}>online shop launch article</Link> covers the underlying order costs.</p>
    </section>
    <section id="rules" aria-labelledby="rules-title">
      <h2 id="rules-title">Make the rules work in the cart</h2>
      <p>Decide whether discounts combine and how the cart calculates them. If two 10% reductions are applied sequentially to the remaining price, the total reduction is 19%. If both apply to the same original amount, the total reduction is 20%. Neither calculation should be assumed from the wording of a coupon field.</p>
      <p>Shopify, for example, calculates combinable percentage order discounts from the same order subtotal, after product discounts. Its supported combinations depend on settings and eligibility. Test your actual cart rather than assuming that every platform or discount type follows the same rule.</p>
      <ul>
        <li><strong>Eligibility.</strong> Identify products, quantities, dates and customer restrictions that staff can explain. Test eligible and excluded baskets, including the exact minimum spend.</li>
        <li><strong>Customer total.</strong> Show the savings and payable amount clearly, with delivery and tax treatment stated where relevant. Confirm the amount sent for payment matches the final order.</li>
        <li><strong>Returns.</strong> Define and test how a partial return affects a bundle discount or minimum spend offer. Base refunds on the order’s actual discounted amounts and applicable return terms.</li>
        <li><strong>Inventory.</strong> Check that promoted stock and fulfillment capacity can support the expected orders. Confirm that an expired offer cannot still be applied.</li>
      </ul>
      <p>Our <Link href="/company/blog/choosing-an-ecommerce-shopping-cart-for-your-store" prefetch={false}>shopping cart checklist</Link> helps test what happens when a customer changes an order.</p>
    </section>
    <section id="evaluate" aria-labelledby="evaluate-title">
      <h2 id="evaluate-title">Measure against a useful comparison</h2>
      <p>Track contribution after the discount, variable costs and incremental campaign spending. Compare similar periods or groups where possible, accounting for seasonality and product mix. Revenue alone cannot show whether customers bought earlier than planned or simply received a discount they did not need.</p>
      <p>For a first purchase offer, follow later purchasing behavior before claiming better customer value. For clearance, consider released storage and avoided markdown risk. Include returns that arrive after the promotion ends, so an early sales report does not hide their cost.</p>
      <p>Stop or revise an offer when its actual costs invalidate the assumptions, even if its sales dashboard looks busy. Keep the successful rules and the failed assumptions in the campaign record before running the offer again.</p>
    </section>
  </BlogArticlePage>;
}
