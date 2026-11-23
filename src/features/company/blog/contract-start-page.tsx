import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { contractStartArticle } from "./contract-start-content";

export function ContractStartPage() {
  return <BlogArticlePage article={contractStartArticle}>
    <p>Imagine the website launch slipping by six weeks. The merchant has not taken a payment, so the team assumes its processing arrangement has not really begun.</p>
    <p>That assumption needs checking. A contract may use an acceptance date, an effective date or another defined event. A subscription may have its own billing start. Processing activation is another event again. The first sale does not automatically control all three.</p>

    <section id="three-distinct-events" aria-labelledby="three-distinct-events-title">
      <h2 id="three-distinct-events-title">Separate the commitment, the bill and the permission to process</h2>
    <p>The agreement’s start establishes when its obligations begin. The fee terms establish when particular charges are incurred. Activation establishes when the account may process under the responsible provider’s approval. One date can serve more than one purpose, but only if the documents make that connection.</p>
    <p>For Trolleys, the <Link href="/company/legal/merchant-services#scope" prefetch={false}>merchant agreement</Link> begins when both parties accept the Service Order and the terms it identifies. Starting an application or browsing the website does not accept that agreement. Processing starts only after the responsible provider confirms activation. The <Link href="/company/legal/merchant-services#agreement-acceptance" prefetch={false}>acceptance record</Link> preserves the accepted versions and relevant dates.</p>
    <p>A delayed website can therefore leave the business in an awkward middle: paying for an active service while still unable to open checkout. The useful question is which obligations have begun and which approval is still outstanding. “We have not made a sale” does not answer either one.</p>
    </section>

    <section id="a-delay-needs-a-decision" aria-labelledby="a-delay-needs-a-decision-title">
      <h2 id="a-delay-needs-a-decision-title">Resolve a launch delay before it becomes a billing surprise</h2>
    <p>Before accepting the arrangement, the launch budget should separate services needed during implementation from services needed only once customers can pay. Usage-based charges and active subscriptions can behave differently during a delay. Any deferral needs the responsible party’s agreement; leaving a service unused does not create one.</p>
    <p>A revised project calendar is easy to mistake for a revised commercial plan. In the hypothetical delayed launch, the developer might move the checkout work while finance still expects charges to begin on the original date. Neither team can settle the provider’s terms internally. The delay needs a recorded decision about which services will remain active, which changes are being requested and what the responsible party has actually accepted. Lack of transactions is not evidence that an account has been canceled.</p>
    <p>The same date clarity helps at renewal or closure. If the agreement uses a defined term, the business needs the actual starting event to calculate its end. Reconstructing that date from the first bank deposit may produce the wrong answer.</p>
    <p>When the launch date moves, the person managing service costs needs to hear about it alongside the person building checkout. The aim is to see the cost of the delay while there is still a decision to make, instead of discovering it on a bill after everyone thought the schedule had been settled.</p>
    </section>
  </BlogArticlePage>;
}
