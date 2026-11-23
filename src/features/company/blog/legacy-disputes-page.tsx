import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { legacyDisputesArticle } from "./legacy-disputes-content";

export function LegacyDisputesPage() {
  return <BlogArticlePage article={legacyDisputesArticle}>
    <p>The team stops watching the old account because new sales no longer appear there. That is precisely when an old notification can become easy to miss.</p>
    <p>A customer’s complaint follows the purchase, not the merchant’s preferred migration date. Moving the checkout does not make earlier transactions belong to the new provider or remove the responsibilities attached to them.</p>

    <section id="keep-a-responsible-person" aria-labelledby="keep-a-responsible-person-title">
      <h2 id="keep-a-responsible-person-title">Assign the remaining work before the account becomes old news</h2>
    <p>Receiving a notice and taking responsibility for it are different events. If finance forwards a case to support, the handoff remains unfinished until someone accepts the work and knows who can submit the response. Name who receives notices for earlier payments, who obtains the evidence and who is authorized to respond through the provider’s required channel. A shared inbox can distribute the news without assigning the deadline to anyone.</p>
    <p>Give that person a reliable way to connect the original payment with the order, delivery evidence, customer correspondence and any refund. Keep the original account and transaction references. Searching the new dashboard alone may not reveal the history needed to understand the claim.</p>
    <p>The deadline comes from the actual notice and applicable process. Do not substitute an internal weekly review for a response requirement. If access or ownership is uncertain, resolve it with the responsible provider while there is still time to act.</p>
    </section>

    <section id="closure-is-a-separate-decision" aria-labelledby="closure-is-a-separate-decision-title">
      <h2 id="closure-is-a-separate-decision-title">Keep access and responsibility in the same conversation</h2>
    <p>A closed account can be materially different from an open account that has stopped accepting new sales. Stripe states that closing its account removes the ability to issue refunds or respond to disputes there. Other arrangements must be confirmed with the relevant provider before access ends.</p>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#termination" prefetch={false}>termination terms</Link> likewise preserve existing refund, dispute and other obligations. They do not promise that a new provider takes over the old account’s cases. Establish the permitted closure process, remaining contacts and any ongoing funding obligations for the specific account.</p>
    <p>The goal is to preserve an agreed way to finish the work, with secure access and appropriate records for as long as required. Review that arrangement when staff or access changes. A named owner who can no longer retrieve evidence or send a response has responsibility on paper but no practical way to exercise it.</p>
    <p>The new provider can be working perfectly while an unanswered case in the old account costs the merchant money. The person watching that account still has a current job, even when the team calls the system retired.</p>
    </section>
  </BlogArticlePage>;
}
