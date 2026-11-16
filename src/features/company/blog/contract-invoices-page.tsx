import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { contractInvoicesArticle } from "./contract-invoices-content";

export function ContractInvoicesPage() {
  return <BlogArticlePage article={contractInvoicesArticle}>
    <p>The project can feel finished to you and still look unfinished to the person who has to approve the bill. You delivered the work. They are looking for a sign-off, a missing reference or an explanation of why the amount differs from the original agreement.</p>
    <p>At that point, sending the same invoice again will do little to resolve the question. The customer needs to connect the payment request to something they agreed to buy.</p>
    <p>A contract invoice makes that connection. It identifies the agreement, the work or period being billed and the reason payment is being requested now. Stripe’s guidance describes several possible billing events, including an advance payment, a scheduled date, a milestone or the customer’s approval. The agreement determines which one applies.</p>
    <p>Those distinctions matter. If the contract calls for approval of a deliverable, sending the file and receiving that approval are separate events. If it calls for monthly billing, waiting until the entire project is finished may mean financing work for longer than you intended. Follow the actual arrangement and keep the record that supports the charge.</p>
    <p>There is a useful question to ask before an invoice goes out: could a colleague explain why this amount is billable today, using the records you have kept? If the answer depends on someone remembering a conversation, the billing process is carrying a risk that better invoice formatting will not remove.</p>

    <section id="agree-the-change" aria-labelledby="agree-the-change-title">
      <h2 id="agree-the-change-title">The extra work needs a clear decision</h2>
      <p>A request can sound small in a conversation and become substantial in delivery. Another revision. An extra report. A change that requires redoing work already approved. The person making the request may assume it is included; the person doing it may assume the additional time will be paid.</p>
      <p>Neither assumption belongs on the final invoice without being resolved. Before the additional work proceeds, identify what changes, what it costs, how it affects delivery and how it will be approved under the agreement. Confirm who can authorize that decision. A friendly working relationship is easier to preserve when both sides understand the consequence of a request.</p>
      <p>The Australian Government’s contractor guidance recommends recording variations in writing, including their effect on scope, cost and timing, and keeping the agreed change with the original contract. That is useful recordkeeping practice. The approval method still needs to follow your agreement and applicable rules; a convenient email exchange is not automatically enough for every contract.</p>
      <p>Keep a distinction between an additional service and work needed to meet the original promise. A customer should be able to see why you consider something an extra charge. If that is disputed, discuss the specific work and the relevant agreement before turning the disagreement into a vague line called additional services.</p>
      <p>Sometimes a business deliberately absorbs the cost to preserve a relationship. Make that a conscious decision and record it. Otherwise, the team doing the work, the person pricing the project and the person sending the invoice can each be acting on a different understanding.</p>
      <p>If the work has already been done and approval is uncertain, gather the correspondence and resolve the uncertainty directly. An invoice can describe the work, but its description cannot establish what another person agreed to. Our article on <Link href="/company/blog/types-of-invoice-discrepancies" prefetch={false}>invoice discrepancies</Link> looks at separating a questioned charge from the rest of the account.</p>
    </section>

    <section id="show-current-charge" aria-labelledby="show-current-charge-title">
      <h2 id="show-current-charge-title">Make the current charge unmistakable</h2>
      <p>A project total, an amount previously invoiced and the amount due on this invoice answer different questions. On a staged project, the remaining contract value can include work that is not billable yet. Presenting it as the current amount due invites an avoidable disagreement.</p>
      <p>Show the charge for this period or milestone clearly. Identify approved additions separately. Account for deposits and credits as the agreement requires, and check earlier invoices before billing the same work again. Keep amounts previously billed distinct from payments actually received. Sending an invoice does not mean the customer has paid it.</p>
      <p>The person checking the bill may never have attended the project meetings. The UK Small Business Commissioner advises using clear descriptions and including a purchase-order reference when one has been issued. A contract number helps locate the agreement; a readable line description explains what this particular charge covers. Give the reviewer both when they are needed.</p>
      <p>Use the customer’s agreed names for deliverables where possible. For time-based work, show the period, hours and rate with the required supporting record. For a milestone, reference the relevant delivery or acceptance record. Confirm the correct recipient or submission portal early, so a complete invoice reaches the person who can process it.</p>
      <p>Billing software can help carry this context. Stripe, for example, supports invoice memos and custom fields for references such as purchase-order numbers. Its documentation says custom fields cannot be changed after an invoice is finalized. Check these details while the invoice is still a draft, and use your system’s correction process if an issued document needs changing.</p>
      <p>After sending, keep the invoice, its supporting record and the payment history connected. Our article on <Link href="/company/blog/important-invoice-management-tips" prefetch={false}>invoice management</Link> covers that follow-through. Rewriting the project history every time someone asks a question makes collection more work than it needs to be.</p>
      <p>A well-supported invoice gives the customer a straightforward decision to make: check the agreed work, confirm the charge and arrange payment. The conversation about what the project includes should already have happened.</p>
    </section>
  </BlogArticlePage>;
}
