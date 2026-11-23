import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { advanceObligationsArticle } from "./advance-obligations-content";

export function AdvanceObligationsPage() {
  return <BlogArticlePage article={advanceObligationsArticle}>
    <p>The customer pays a deposit. The business buys materials. Both sides have committed to the project, but the customer may still have received very little.</p>
    <p>That gap matters in a merchant review. Calling the charge a deposit describes the payment arrangement. It does not, by itself, explain what has been delivered, what remains refundable or how the work will be completed.</p>

    <section id="three-timelines" aria-labelledby="three-timelines-title">
      <h2 id="three-timelines-title">Keep the payment, work and acceptance records separate.</h2>
    <p>A project can have three different timelines: when money is collected, when work is performed and when the customer accepts a deliverable. They may line up. They may not.</p>
    <p>Take an illustrative $2,400 custom order with a $600 deposit. If twenty customers have paid that deposit before production, the business has collected $12,000 against orders still awaiting completion. That is useful operating context. It is not an automatic reserve calculation or a statement that the entire amount must be refunded in every circumstance.</p>
    <p>Explain the actual agreement, the stage each order has reached and what remains owed to the customer. Spending a deposit on materials does not prove that the customer received the finished item.</p>
    </section>

    <section id="milestones" aria-labelledby="milestones-title">
      <h2 id="milestones-title">Name the event that makes the next amount due.</h2>
    <p>A second installment might become due on a calendar date, on completion of production or after the customer approves a deliverable. Those are materially different triggers.</p>
    <p>If the business calls a charge a milestone payment, identify the milestone and how it is recorded. An invoice sent is not the same event as work accepted. If customer approval is required, explain what happens when it is delayed or disputed.</p>
    <p>Show how changes affect the schedule. Additional work, a revised specification or a postponed installation can change the amount or delivery date. Preserve the agreement to the change rather than treating a later invoice as proof that it was accepted.</p>
    </section>

    <section id="funding-the-promise" aria-labelledby="funding-the-promise-title">
      <h2 id="funding-the-promise-title">The reviewer needs to understand how unfinished work gets finished.</h2>
    <p>The payment schedule has to work in chronological order. Suppose a supplier needs payment before production, but the customer’s next installment is due only after the finished item is accepted. Listing that installment as future income does not explain how the business gets to completion. Describe the costs still to be paid, when the money for them is available and what happens if a stage runs late. Collected deposits still have unfinished work attached.</p>
    <p>For Trolleys, substantial advance payments and extended delivery require specific written approval under the applicable account scope. Present the actual schedule before processing it. The account’s funding and any reserve conditions are separate from the payment schedule you offer customers.</p>
    <p>Our article on <Link href="/company/blog/contract-invoices" prefetch={false}>contract invoices</Link> explores how to make each bill understandable. For the merchant application, take the same discipline one step further: connect the bill to the work, the customer’s rights and the business’s ability to complete what it has sold.</p>
    </section>
  </BlogArticlePage>;
}
