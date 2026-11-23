import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { ownershipTransitionArticle } from "./ownership-transition-content";

export function OwnershipTransitionPage() {
  return <BlogArticlePage article={ownershipTransitionArticle}>
    <p>A founder buys out a partner. The store keeps its name, team and products. The payment account continues working, so the change is left for the next administrative cleanup.</p>
    <p>The ownership chart now describes one set of people, the account contact list another. That mismatch may stay invisible while routine payments continue. It becomes harder to ignore when an instruction arrives from the person who has left.</p>
    <p>The payment record needs two answers: who owns the business, and who may act for it. An unchanged storefront cannot supply either one.</p>

    <section id="effective-not-announced" aria-labelledby="effective-not-announced-title">
      <h2 id="effective-not-announced-title">Show what changed and when it became effective.</h2>
    <p>Prepare a clear before-and-after account of the relevant ownership and control. A signed proposal, a transaction awaiting conditions and a completed transfer are different stages. Give the actual effective date and identify what remains conditional.</p>
    <p>Use the current company records and the provider’s requested evidence. Do not estimate someone’s interest from their job title, or assume that a person who no longer owns shares has automatically stopped managing the business. Ownership, control and signing authority can change independently.</p>
    <p>If another company becomes an owner, explain that relationship and any requested ownership chain. The <Link href="/company/blog/merchant-application-ownership-evidence" prefetch={false}>ownership evidence article</Link> covers the records in more detail. For an existing account, connect those records to the completed change and its effective date.</p>
    </section>

    <section id="authority-is-not-equity" aria-labelledby="authority-is-not-equity-title">
      <h2 id="authority-is-not-equity-title">Decide what each person can still do.</h2>
    <p>A departing partner may remain temporarily responsible for operations, or may leave immediately. A new investor may have no reason to access payment records at all. Simply replacing the old owner’s name with the new one collapses ownership and operating authority into a single field. Record the role each person actually retains, then align access with that role through the approved process.</p>
    <p>If the recorded representative also changes, the <Link href="/company/blog/replace-merchant-account-representative" prefetch={false}>representative handoff article</Link> explains the notices and access that need attention.</p>
    <p>For Trolleys merchants, changes in control and relevant account information must be reported. Material changes to the approved business or account use require written approval. Do not assume an ownership percentage below one form’s disclosure threshold makes a control change irrelevant. Answer the actual questions and explain the transaction.</p>
    <p>A useful ownership update settles a future disagreement: when an instruction arrives, which current record establishes whether that person may give it? The dated company evidence, representative record and account permissions should support the same answer. That is more durable than relying on everyone to remember what was said when the deal closed.</p>
    </section>
  </BlogArticlePage>;
}
