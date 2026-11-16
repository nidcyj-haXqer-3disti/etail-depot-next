import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cogsExpensesArticle } from "./cogs-expenses-content";
import s from "./blog.module.css";

const classificationEffects = [
  ["Net sales", "Unchanged", "The sales recorded for the period have not changed."],
  ["Cost of goods sold", "Higher", "The reclassified cost is now included here."],
  ["Gross profit", "Lower", "Subtracting more cost of goods sold leaves less gross profit."],
  ["Operating expenses", "Lower", "The same cost is removed from this section, not counted again."],
  ["Operating profit", "Unchanged", "Total costs for the period are unchanged. Only their placement has moved."],
] as const;

export function CogsExpensesPage() {
  return <BlogArticlePage article={cogsExpensesArticle}>
    <section id="cost-follows-purpose" aria-labelledby="cost-follows-purpose-title">
      <h2 id="cost-follows-purpose-title">Start with what the cost is for</h2>
      <p>For a retailer, the cost of goods sold begins with the cost assigned to merchandise sold. For a manufacturer, qualifying costs of making the goods also matter. Inventory can include purchase costs, production labor and allocated production overhead. When the goods are sold, their carrying cost is recognized alongside the related revenue under the applicable accounting rules.</p>
      <p>Selling and administration serve a different purpose. Advertising a product and running the office are not the same activity as acquiring or producing inventory. Review what a cost supports rather than choosing an account from the supplier’s name.</p>
      <p><strong>Fixed does not automatically mean operating expense.</strong> Qualifying factory overhead can enter inventory cost even when it does not change with each unit produced. A selling cost may vary with sales while belonging outside cost of goods sold. Cost behavior and accounting classification answer different questions.</p>
      <p>A business selling services may use the label “cost of services” or “cost of revenue.” The activities and reporting policy determine what belongs there. Do not copy a retailer’s categories into a different business without checking their meaning.</p>
    </section>
    <section id="classification-effect" aria-labelledby="classification-effect-title">
      <h2 id="classification-effect-title">See what changes in the profit statement</h2>
      <p>Suppose a retailer discovers that a cost recorded in operating expenses belongs in cost of goods sold. Assume the related goods have all been sold, the full cost belongs in the same reporting period and no other figures change. Correcting that classification produces this result:</p>
      <figure className={s.financialStatement}>
        <figcaption>Moving the same cost from operating expenses to cost of goods sold</figcaption>
        <dl>{classificationEffects.map(([line, change, explanation]) => <div key={line}
          className={line === "Operating profit" ? s.financialTotal : line === "Gross profit" ? s.financialSubtotal : undefined}>
          <dt><span>{line}</span><span className={s.financialRole}>{change}</span></dt>
          <dd>{explanation}</dd>
        </div>)}</dl>
      </figure>
      <p><strong>The gross margin changed; the business did not spend more money.</strong> With sales unchanged, gross profit as a percentage of sales also falls. Operating profit stays the same because the expense moved between two parts of the same period’s statement.</p>
      <p>That conclusion depends on the assumptions. If some of the cost belongs in unsold inventory instead, the amount recognized as an expense this period can change too. A reclassification between expenses is different from correcting when a cost becomes an expense.</p>
      <p>The <Link href="/company/blog/profit-and-loss-statement" prefetch={false}>profit and loss statement guide</Link> shows where these subtotals sit. Neither gross profit nor operating profit tells you how much cash is available.</p>
    </section>
    <section id="inventory-and-records" aria-labelledby="inventory-and-records-title">
      <h2 id="inventory-and-records-title">Follow inventory through to the sale</h2>
      <p>For a simple reseller, assuming net inventory purchases include all qualifying acquisition costs and there are no other inventory adjustments:</p>
      <p><strong className={s.editorialFormula}>Cost of goods sold = beginning inventory + net inventory purchases − ending inventory.</strong></p>
      <p>Buying more stock does not make all of it a cost of goods sold immediately. Unsold stock remains part of inventory under this model. Use cost values consistently; the retail selling price is not the inventory cost.</p>
      <p>Support the calculation with purchase records, supplier credits and an accurate closing inventory. Include qualifying inbound freight once. Production costs, write-downs, losses and other adjustments need their proper treatment rather than being forced into the short formula. Tax inventory rules and exceptions also need review for the specific business.</p>
      <p>For a mixed invoice, identify the goods or services behind each line. Document the classification and any allocation method. Keep the same approach across comparable periods, and correct genuine errors through the approved accounting process. Do not move costs merely to improve a reported margin.</p>
      <p>Review uncertain classifications with your accountant. Keep the invoice, receiving records and explanation with the entry. Our <Link href="/company/blog/accounting-ledgers" prefetch={false}>ledger article</Link> explains that audit trail; the <Link href="/company/blog/cash-vs-accrual-accounting" prefetch={false}>cash and accrual comparison</Link> separates reporting dates from payment dates.</p>
    </section>
  </BlogArticlePage>;
}
