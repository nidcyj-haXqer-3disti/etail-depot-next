import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { flowAccountabilityArticle } from "./flow-accountability-content";

export function FlowAccountabilityPage() {
  return <BlogArticlePage article={flowAccountabilityArticle}>
    <p>A diagram connects the customer to the platform, the platform to the gateway and the gateway to a bank. It looks complete.</p>
    <p>Ask who sold the product, and the team points to the word platform. Ask who owes a refund, and the answer takes longer.</p>
    <p>A payment flow is useful in a commercial review when it makes responsibility visible. The technical systems matter, but their names do not establish the seller, the account holder or permission to move someone else’s funds.</p>

    <section id="label-the-relationship" aria-labelledby="label-the-relationship-title">
      <h2 id="label-the-relationship-title">Label the business relationship before the software.</h2>
    <p>Identify the buyer and the actual seller. Name the legal business applying for the merchant account and explain how any platform, supplier or additional DBA relates to it. Then identify the account intended to receive the payment activity and the receiving bank arrangement, subject to provider approval.</p>
    <p>A platform receiving a payment notification does not mean it receives the customer’s funds. If the same arrow means both “sends a notification” and “receives funds,” the picture can suggest authority the platform does not have. Label the arrows as carefully as the businesses, and distinguish a shared view of merchants from any arrangement to hold their funds.</p>
    <p>Mark proposed arrangements as proposed. Where a provider determines the processing or settlement route, confirm that route rather than drawing the one the software team would prefer.</p>
    </section>

    <section id="follow-the-return" aria-labelledby="follow-the-return-title">
      <h2 id="follow-the-return-title">Follow a return after the sale has been paid out.</h2>
    <p>Use one ordinary purchase to test the diagram. The customer pays, the seller fulfills the order and the funds become available under the account arrangements. Later, the customer is owed a refund.</p>
    <p>The return separates three jobs that the original picture may have combined: deciding that the customer is owed a refund, submitting the authorized refund instruction and supplying the funds. One business might answer the customer while another controls the relevant account. The drawing needs to show how the decision reaches the party able to act, including what happens if the available balance is insufficient. If a platform fee or seller allocation exists, trace its treatment under the approved model too.</p>
    <p>Do the same for a dispute notice. Identify who receives it, who holds the relevant customer and fulfillment records and who can respond within the deadline. The diagram should lead to an accountable person or business, rather than end at a box called support.</p>
    </section>

    <section id="standard-platform-scope" aria-labelledby="standard-platform-scope-title">
      <h2 id="standard-platform-scope-title">Keep the drawing within the agreement being proposed.</h2>
    <p>Under Trolleys’ standard platform terms, each merchant has its own application and account terms. The platform is not appointed to hold merchant funds, aggregate seller payments or act as merchant of record by that agreement. Seller transfers and aggregation require a separate expressly approved arrangement.</p>
    <p>That makes the diagram valuable before implementation. If the business plan depends on collecting for independent sellers or distributing funds, bring that fact into the approval conversation. Do not discover it only after building the checkout.</p>
    <p>The <Link href="/company/blog/embedded-payments-for-online-marketplaces" prefetch={false}>marketplace payments article</Link> examines the broader model. For a review diagram, keep the purpose narrower: every meaningful movement of money, every seller and every customer obligation should have a name. Any unanswered relationship is a decision to resolve before it becomes code.</p>
    </section>
  </BlogArticlePage>;
}
