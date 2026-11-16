import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { grossNetProfitArticle } from "./gross-net-profit-content";

export function GrossNetProfitPage() {
  return <BlogArticlePage article={grossNetProfitArticle}>
    <p>The sales report says the business is growing. The income statement says it is earning less. Before blaming prices or asking everyone to spend less, find out where the result changed.</p>
    <p>A sale can cover the cost of the goods and still leave too little to support the company that sold them. Marketing, administration and other operating expenses may sit below gross profit. Financing costs and applicable income taxes can reduce earnings further. A busy store can therefore report positive gross profit and a net loss.</p>
    <p>Gross profit is net sales minus the cost of those sales. Net profit, also called net income, is the result after the income and expenses reported on the income statement for that period. The gap between them tells you what happened beyond the gross profit subtotal. Understanding that gap is more useful than choosing whichever number makes the month look better.</p>
    <section id="find-the-change" aria-labelledby="find-the-change-title">
      <h2 id="find-the-change-title">Find the change before choosing the cut</h2>
      <p>Start with a comparison that holds together: the same business, equivalent periods and consistent accounting treatment. Then follow the result from <Link href="/company/blog/gross-profit" prefetch={false}>gross profit</Link> through operating profit to net profit. Each change narrows the question you need to answer.</p>
      <p>If gross profit falls, investigate sales volume, pricing, product mix and cost of sales. If gross profit holds steady but operating profit falls, inspect the operating expenses and any other operating items between them. If operating profit holds steady while net profit falls, look further down the statement at financing costs, other income and expenses, and applicable tax.</p>
      <p>Those are starting points for investigation, not automatic instructions to cut a particular budget. A late expense entry or a change in classification can distort the comparison. An administrative cost moved into cost of sales can lower gross profit without changing net profit. Verify the records before treating a reporting change as a commercial problem.</p>
      <p>Suppose gross profit is unchanged and the business adds a customer support team whose costs are recorded as operating expenses. Holding everything else before tax constant, operating profit falls by that additional expense. Negotiating a cheaper product supplier might improve a future result, but it would not explain the decline that actually happened.</p>
      <p>The decision about the team then needs its own evidence. Was it clearing a temporary backlog, supporting a growing customer base or compensating for a product problem? Could better processes reduce the workload? Cutting the team immediately could save money while leaving the cause of the work untouched.</p>
      <p><strong>The location of a cost tells you where to investigate. Its purpose helps you decide what to change.</strong></p>
      <p>Borrowing deserves the same separation. Higher interest expense can reduce net profit even when the store’s operating performance is stable. That calls for a review of financing alongside the business results, rather than assuming a healthy product suddenly became unprofitable.</p>
    </section>
    <section id="repeatable-profit" aria-labelledby="repeatable-profit-title">
      <h2 id="repeatable-profit-title">Decide what the next month can repeat</h2>
      <p>A weaker net result may include deliberate spending ahead of future revenue. A launch campaign or a new hire can reduce current earnings. That can be a reasonable choice, but the future benefit still needs to arrive. Calling an expense an investment does not establish that it will pay for itself.</p>
      <p>Keep the reported result visible, then explain the spending separately. Give a temporary project an actual scope, end point and way to assess its benefit. If similar launches or hiring costs are needed repeatedly to sustain growth, treating each occurrence as an exception can make the ordinary cost of running the business disappear from the forecast.</p>
      <p>The SEC addresses a related problem in public company reporting: excluding normal recurring operating expenses can make an adjusted performance measure misleading. Its guidance also cautions against removing unusual charges while retaining unusual gains. The practical lesson for an internal review is consistency. Do not make exceptions only when they improve the story.</p>
      <p>A stronger net result needs that scrutiny too. A gain on selling an asset may lift reported earnings without improving the sales operation. Explain it before using that month as the basis for a permanent hiring commitment. Net profit includes more than the performance of the products you sell.</p>
      <p>Neither profit measure establishes what you can pay out today. Under accrual accounting, sales may be recognized before customers pay. Inventory purchases, equipment spending and repayment of loan principal can also use cash differently from expenses on the income statement. Read the <Link href="/company/blog/cash-flow-statement" prefetch={false}>cash flow statement</Link> alongside the profit figures before committing the apparent surplus.</p>
      <p>The useful conclusion is specific: which part of the result changed, why it changed and whether that change belongs in the next forecast. That gives you a basis for a pricing decision, a spending decision or a financing conversation. “Sales are up” and “costs are too high” are much less useful places to stop.</p>
    </section>
  </BlogArticlePage>;
}
