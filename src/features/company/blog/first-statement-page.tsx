import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { firstStatementArticle } from "./first-statement-content";

export function FirstStatementPage() {
  return <BlogArticlePage article={firstStatementArticle}>
    <p>The account is working. Customers can pay. Then the first statement arrives at a higher total than the merchant expected.</p>
    <p>There are innocent explanations. The bill may combine a setup charge with a partial service period, or cover different dates for different services. There are also mistakes that are easiest to correct now: an unrecorded waiver, the wrong plan, a subscription enabled before it was wanted. Calling the whole difference “onboarding” is not an explanation.</p>

    <section id="build-the-ordinary-bill" aria-labelledby="build-the-ordinary-bill-title">
      <h2 id="build-the-ordinary-bill-title">Separate the opening cost from the ongoing cost</h2>
    <p>The useful question is what an ordinary full billing period will contain. Identify each recurring service, its billing dates and the event that started the charge. Keep one-time work and credits separate. If a partial month is charged, establish whether the agreement prorates it and how.</p>
    <p>These rules differ by provider and product. Authorize.net, for example, documents proration for its monthly gateway fee. That is evidence for that service, not a reason to assume another provider will reduce every first-month charge in the same way.</p>
    <p>The opening total can mislead in either direction. A short selling period with setup costs can make the effective processing rate look unusually high. An opening credit or a partial service period can make the first bill look unusually low. Removing a one-time charge from the forecast is sensible; carrying a one-time credit into every future month is not. The budget needs the recurring shape of the bill before it can use the total.</p>
    </section>

    <section id="test-the-handoff" aria-labelledby="test-the-handoff-title">
      <h2 id="test-the-handoff-title">Check what survived the handoff to billing</h2>
    <p>A promised setup waiver should appear in the accepted commercial record and then in the charge or credit. The same applies to a negotiated start date. If the account team and billing team disagree, ask them to reconcile the documents rather than requiring the merchant to retell the sales conversation every month.</p>
    <p>For Trolleys merchants, the <Link href="/company/legal/merchant-services#service-order" prefetch={false}>Merchant Service Order</Link> records the account’s commercial terms. The <Link href="/company/legal/fees#billing-record" prefetch={false}>billing record</Link> should also make clear which charges were already collected, so the amount displayed is not mistaken for a second amount due.</p>
    <p>The first bill therefore has two jobs. It should account for what happened during launch, and it should leave the merchant able to recognize an ordinary bill when one arrives. A disappointing opening total may be explainable. A reassuring one deserves the same scrutiny before the business builds its forecast around it.</p>
    </section>
  </BlogArticlePage>;
}
