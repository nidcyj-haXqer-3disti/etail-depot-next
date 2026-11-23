import { BlogArticlePage } from "./article-page";
import { batchFeeQuotesArticle } from "./batch-fee-quotes-content";

export function BatchFeeQuotesPage() {
  return <BlogArticlePage article={batchFeeQuotesArticle}>
    <p>A batch fee is unlikely to be the most important line in a payment proposal. That makes it a useful test of how carefully the proposal was prepared.</p>
    <p>If someone has simply multiplied a small charge by 30, they have assumed one billable batch per day. That may describe the arrangement. It may also ignore multiple merchant accounts, days without settlement or a different billing rule.</p>
    <p>Authorize.net defines its card batch fee by the settled batch. The relevant count therefore comes from the activity covered by that agreement, rather than from the number of days on the calendar. Another provider’s definition must be read on its own terms.</p>
    <p>For a business with several stores or DBAs, a consolidated dashboard does not necessarily mean consolidated billing. The underlying merchant accounts can remain distinct. If a new location adds another account with its own billable batches, the old estimate can fail even though the rate and dashboard look unchanged. A proposal copied from the original store has missed the structure of the business it is supposed to price.</p>
    <p>That does not justify combining accounts merely to save a small fee. Separate accounts may serve approved business, reporting or operating needs. The configuration should follow those needs; the quote should price the resulting arrangement honestly.</p>
    <p>There is a second trap in the word “batch.” A report can group payments by a chosen time range. That grouping need not be the same unit a fee schedule uses. Changing a report’s cutoff is not evidence that a billable event has disappeared. The provider needs to connect the charge to its definition and the corresponding records.</p>
    <p>Once the count is established, the financial comparison should be brief. Number of billable batches multiplied by the agreed charge gives the amount to include. If it is immaterial beside the rest of the proposal, move on. Merchant attention has a cost too.</p>
    <p>A small charge should take little effort to explain. If establishing the count requires repeated calls, the merchant has already incurred another cost: time spent investigating a bill that should have been routine.</p>
  </BlogArticlePage>;
}
