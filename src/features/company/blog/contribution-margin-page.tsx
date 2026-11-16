import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { contributionMarginArticle } from "./contribution-margin-content";
import s from "./blog.module.css";

export function ContributionMarginPage() {
  return <BlogArticlePage article={contributionMarginArticle}>
    <p>Revenue is an easy number to celebrate after a promotion. It is visible on the dashboard, easy to compare with last month and reassuring when it goes up. The harder question is how much of that increase remains after the business has fulfilled the orders.</p>
    <p>A lower selling price does not automatically make the product cheaper to buy, pack or deliver. If those costs stay the same, the discount comes out of the amount each sale contributes to running the business. More orders can make up the difference. Whether they actually do is the part that deserves attention before the promotion goes live.</p>
    <p>That amount has a name: contribution margin. Across a defined set of sales, the calculation is:</p>
    <p><strong className={s.editorialFormula}>Contribution margin = sales revenue − variable costs.</strong></p>
    <p>For one item, subtract its variable cost from its selling price. Divide that contribution by the selling price to get the contribution margin ratio. What remains helps cover fixed costs; only the excess after those costs becomes operating profit in this model. A positive contribution is useful, but it is not proof that the business is profitable.</p>
    <section id="discount-volume" aria-labelledby="discount-volume-title">
      <h2 id="discount-volume-title">Your discount has a volume target</h2>
      <p>Consider the arithmetic of a product that contributes 30% of its original selling price after variable costs. If you reduce its price by 10% and the variable cost per item stays unchanged, each sale now contributes an amount equal to 20% of the original price.</p>
      <p><strong>The price fell by a tenth. The contribution per sale fell by a third.</strong></p>
      <p>To recover the same total contribution, you would need to sell 50% more units: 30 divided by 20 is 1.5. With fixed costs unchanged, that extra volume only restores the previous operating result. It has not improved it. This is a conditional calculation, not a forecast of how customers will respond.</p>
      <p>Real costs can move too. A fee calculated as a percentage of the selling price may fall with the discount. A fixed charge per transaction does not. A larger purchase might earn a supplier discount, while a rush of orders might require more expensive fulfillment. Recalculate with the costs that actually change rather than assuming every cost rises or falls together.</p>
      <p>Also consider who receives the discount. An offer available to everyone reduces the contribution from customers who would have bought at the original price, as well as from the new customers it attracts. Counting every discounted order as an extra sale makes the promotion look more effective than that comparison supports.</p>
      <p>This does not rule out discounting. Clearing stock or acquiring customers may be worth a lower contribution today. The commercial decision becomes clearer when the cost of that choice is visible and the hoped for benefit is assessed separately. A possible repeat purchase is still a possibility, not money already earned.</p>
    </section>
    <section id="growth-worth-keeping" aria-labelledby="growth-worth-keeping-title">
      <h2 id="growth-worth-keeping-title">Growth worth keeping</h2>
      <p>The calculation is only as useful as the costs behind it. For an online order, those may include the goods sold, packaging, shipping paid by the merchant, fulfillment charges and payment fees. Their behavior matters. A monthly subscription and a charge for each order should not be treated as if they respond to sales in the same way.</p>
      <p>Nor can you simply copy gross profit from the accounts and rename it contribution. <Link href="/company/blog/cogs-vs-operating-expenses" prefetch={false}>Cost of goods sold and operating expenses</Link> are accounting classifications. Contribution margin groups costs by how they change with activity, including variable selling costs that may sit outside cost of goods sold.</p>
      <p>Growth can change the assumptions. If the new volume needs another employee or more warehouse space, the fixed costs you planned to cover may rise. If customers buy a different mix of products, last month’s average contribution ratio may no longer fit. Looking only at the companywide sales total can hide both changes.</p>
      <p>The percentage alone can mislead too. A lower margin on much greater volume may produce more total contribution. A high margin on a product that barely sells may contribute little toward the bills. Compare the total amount left after variable costs, then account for the additional fixed costs and capacity the plan requires.</p>
      <p>For a single product with a positive contribution per unit and stable costs, fixed costs divided by that contribution gives the number of units needed to break even. That is a useful reality check on a sales target. It does not establish whether the demand exists or whether you can fund and fulfill those orders.</p>
      <p>Read that result alongside the <Link href="/company/blog/profit-and-loss-statement" prefetch={false}>profit and loss statement</Link> and your cash needs. Before calling a promotion a success, ask what it left the business after the extra work. A fuller order queue is worth celebrating when the business benefits from filling it.</p>
    </section>
  </BlogArticlePage>;
}
