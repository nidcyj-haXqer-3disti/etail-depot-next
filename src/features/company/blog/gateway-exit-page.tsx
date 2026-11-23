import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { gatewayExitArticle } from "./gateway-exit-content";

export function GatewayExitPage() {
  return <BlogArticlePage article={gatewayExitArticle}>
    <p>The new checkout takes its first successful payment. The website team considers the move complete. Finance receives another bill from the old gateway the following month.</p>
    <p>That bill may be an error, but it may also be for a separate service no one canceled. More importantly, closing it immediately may not be the right remedy if the business still needs to handle activity created there.</p>

    <section id="old-orders-still-exist" aria-labelledby="old-orders-still-exist-title">
      <h2 id="old-orders-still-exist-title">The old account still has a past</h2>
    <p>Customers can need refunds after new sales have moved. Recurring billing instructions may still be active in the former system. Transaction and billing records may be needed long after the last new payment. The transition has to account for these dependencies before access disappears.</p>
    <p>Establish which party will handle remaining refunds and disputes, how authorized recurring arrangements will move, and what records must be retained securely. Do not assume stored payment credentials can be downloaded or copied into a new service. Any transfer requires the permitted process and the parties authorized to perform it.</p>
    <p>Provider closure rules can affect the sequence. Authorize.net warns that closing an account ends Merchant Interface access and recommends retrieving needed transaction history beforehand. That makes record retention a pre-closure task for that service, not an errand to postpone until after the last bill.</p>
    </section>

    <section id="close-a-named-service" aria-labelledby="close-a-named-service-title">
      <h2 id="close-a-named-service-title">Make each closure explicit</h2>
    <p>The purpose of an overlap should be specific unfinished work. “We may need the old account” is too vague to distinguish a necessary expense from inertia. A merchant should be able to explain what still depends on the service, why retained records or another agreed process would not meet that need, and what event will let the service end. Any limited access or continued service still needs confirmation of its availability and cost.</p>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#termination" prefetch={false}>closure terms</Link> acknowledge this distinction. Separate provider or platform agreements continue under their own terms unless expressly ended. Closure also leaves existing refunds, disputes and other obligations in place. A closure request should therefore lead to confirmation of the remaining provider steps, not an assumption that every related account has vanished.</p>
    <p>After the agreed dates, review the final bills and any continuing access. Confirm that recurring instructions have not been left running in both systems and that the business can still obtain the records it is entitled to receive.</p>
    <p>The old bill becomes easier to judge once it is attached to a named service and a defined remaining job. Pay for a planned overlap where the work justifies it, then close the service when that purpose ends under the agreed terms. A new checkout button proves only that the next customer can pay somewhere else; it says nothing about whether the previous customers are finished with the business.</p>
    </section>
  </BlogArticlePage>;
}
