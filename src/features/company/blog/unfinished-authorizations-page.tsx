import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { unfinishedAuthorizationsArticle } from "./unfinished-authorizations-content";

export function UnfinishedAuthorizationsPage() {
  return <BlogArticlePage article={unfinishedAuthorizationsArticle}>
    <p>A store accepts an order today and ships it later. The payment is authorized, but the business has not yet completed collection. If the processor changes in between, that order sits across two operating arrangements.</p>
    <p>A switch date tells the team where to send a new purchase. It does not tell the person releasing this shipment how to finish collecting for an order already accepted. That decision belongs with the order’s payment state, not the date on the migration calendar.</p>

    <section id="identify-the-open-work" aria-labelledby="identify-the-open-work-title">
      <h2 id="identify-the-open-work-title">Separate approval from completed collection</h2>
    <p>Before the change, identify orders with uncaptured authorizations, partial collections, pending settlement or an uncertain payment result. These are different states. A single list labeled “unpaid” can encourage staff to ask for money that was already authorized or collected.</p>
    <p>Keep the provider and account reference with each order. Confirm how its remaining permitted action will be performed, including any applicable authorization deadline. The correct route depends on the actual processor change, gateway and transaction state; a new connection is not automatically able to complete every earlier action.</p>
    <p>Authorize.net’s documented processor-update behavior illustrates the need for precision. Transactions authorized before an update retain the original processing platform for settlement, while subsequent refunds are sent to the new processor. A failed batch resent after the change also goes to the original platform. This is a documented Authorize.net case, not a rule to apply to every gateway or account.</p>
    </section>

    <section id="resolve-before-retrying" aria-labelledby="resolve-before-retrying-title">
      <h2 id="resolve-before-retrying-title">Do not turn uncertainty into a second payment</h2>
    <p>An order with an unknown result needs investigation before another attempt. Cybersource’s timeout guidance distinguishes an unresolved outcome from a confirmed failure. Moving the next request to a new provider does not establish what happened to the first one.</p>
    <p>Ask the responsible integration team to document the supported treatment for each open state and verify it with the providers. For the shipping team, turn that into an answer about the individual order: what remains to be done, who can do it and where completion will be confirmed. An instruction to “use the new processor now” leaves all three questions open.</p>
    <p>For a Trolleys transition, bring outstanding authorizations and settlement questions into the <Link href="/use-cases/switch-merchant-services" prefetch={false}>account handoff</Link>. Approval of the new account does not transfer previous transactions or grant authority to capture them elsewhere.</p>
    <p>The cleanest migration leaves each order with one understandable payment history. That matters more than making every open item appear in the newest dashboard.</p>
    </section>
  </BlogArticlePage>;
}
