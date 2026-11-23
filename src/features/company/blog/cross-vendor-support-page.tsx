import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { crossVendorSupportArticle } from "./cross-vendor-support-content";

export function CrossVendorSupportPage() {
  return <BlogArticlePage article={crossVendorSupportArticle}>
    <p>The store says the customer paid. The gateway shows a payment record. The merchant operations report does not show the result the owner expected. Each support team can explain its own screen, but the business still needs one coherent answer.</p>
    <p>The reports may describe different stages of the same purchase. A reply that a system is working can therefore be accurate without resolving what happened to the payment. The case stalls when each team treats its own answer as the end of the investigation and leaves the merchant to connect the findings.</p>

    <section id="one-history-next-action" aria-labelledby="one-history-next-action-title">
      <h2 id="one-history-next-action-title">Keep one history and assign the next question</h2>
    <p>Start with verified facts: the account, relevant time zone, order and provider references, observed states and the precise result being investigated. Separate what a system reports from what someone assumes it means. A successful authorization, a capture and a funded amount are different events.</p>
    <p>Use the designated secure channels and disclose only what the investigation needs. Passwords, full card numbers and broad exports of unrelated customers do not belong in a shared email thread. The merchant can maintain a short case summary without collecting sensitive payment data.</p>
    <p>Then identify the next unresolved question and the party able to answer it. If the gateway has confirmed submission, the next action should be specific about what the responsible processing team must verify. If the storefront did not update, the developer may need a confirmed payment result rather than another attempt to charge the customer.</p>
    <p>Do not resubmit an uncertain payment merely to make the screens agree. Establish the original result through the provider’s supported recovery process first.</p>
    </section>

    <section id="coordination-without-overclaiming" aria-labelledby="coordination-without-overclaiming-title">
      <h2 id="coordination-without-overclaiming-title">Coordination is valuable even when authority is divided</h2>
    <p>One person can own the merchant’s case history and follow-up without controlling every provider’s systems. The task is to keep evidence, responsibilities and the next update connected. It is not to promise that an account team can overturn an issuer decision or release funds controlled by another responsible provider.</p>
    <p>For Trolleys merchants, our <Link href="/company/legal/merchant-services#service-commitments" prefetch={false}>service responsibilities</Link> cover the assistance and coordination assigned to Etail. Our <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> distinguishes merchant account records from gateway records. That separation helps locate the discrepancy instead of treating a difference between reports as proof that money is missing.</p>
    <p>Each handoff should narrow the uncertainty. A specific unanswered question and the evidence already gathered give the next specialist a place to begin; another general request to check the payment starts the conversation again. The merchant has a usable answer when it can connect the verified result to the customer’s order and understand any remaining action. Closing the individual support tickets is not enough on its own.</p>
    </section>
  </BlogArticlePage>;
}
