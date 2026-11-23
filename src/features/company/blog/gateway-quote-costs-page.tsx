import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { gatewayQuoteCostsArticle } from "./gateway-quote-costs-content";

export function GatewayQuoteCostsPage() {
  return <BlogArticlePage article={gatewayQuoteCostsArticle}>
    <p>A payment proposal can be cheaper without making every payment bill smaller. That is easy to overlook when the merchant thinks of checkout as a single service.</p>
    <p>The gateway connects the checkout to payment processing. Depending on the arrangement, its account and charges can be separate from the processor’s. Authorize.net’s gateway-only offer is a familiar example: the merchant uses an existing merchant account alongside a separately priced gateway service.</p>
    <p>If the store keeps that gateway during a processor switch, its charges may continue. The new proposal has to compare the part of the bill it is actually replacing.</p>

    <section id="what-stays" aria-labelledby="what-stays-title">
      <h2 id="what-stays-title">Continuity can be worth paying for</h2>
    <p>Keeping a compatible gateway can preserve useful parts of an existing integration. It may reduce the work involved in changing providers. The value depends on the store’s setup, supported processors, saved payment arrangements and the capabilities approved for the new account.</p>
    <p>That continuity is a commercial benefit even when the gateway has a separate cost. A zero-fee replacement is not automatically the cheaper project if it requires rebuilding recurring billing, changing plugins or asking customers to update payment details. Those costs belong in the decision before the old arrangement is canceled.</p>
    <p>Equally, a gateway should not survive indefinitely just because nobody knows what depends on it. An unused service can remain on a bill after its original purpose has disappeared. The merchant needs a clear account of which checkout, stores and processes still use it.</p>
    </section>

    <section id="what-changes" aria-labelledby="what-changes-title">
      <h2 id="what-changes-title">The quote should describe the boundary of the change</h2>
    <p>The practical comparison has three parts: services being replaced, services remaining in place, and new costs introduced by the move. A charge belongs in one place. Counting it twice exaggerates cost; omitting it exaggerates savings.</p>
    <p>Consider a simplified monthly comparison: the current arrangement costs $750 for processing and $150 for the gateway. A replacement processing quote of $650 saves $100 if the $150 gateway bill remains. Comparing the old $900 total with the new $650 processing quote would claim a $250 saving that the merchant will never see. These are fictional amounts, not Trolleys prices.</p>
    <p>Provider labels can complicate this. “Gateway included” may refer to a particular product or plan, while the store currently uses a different integration. Inclusion has value only if the included service can do the job the merchant requires.</p>
    <p>Trolleys’ <Link href="/company/legal/fees#billing-record" prefetch={false}>billing records</Link> distinguish the agreed charges and who collects them. That is the level of clarity a merchant needs across the whole arrangement. A payment journey can involve several companies without making the owner responsible for guessing where one bill ends and another begins.</p>
    <p>A processor switch can be worthwhile while the gateway stays. Its savings calculation should survive acknowledging that. If the gateway must change for the advertised saving to exist, the proposal also owes the merchant a realistic account of that work.</p>
    </section>
  </BlogArticlePage>;
}
