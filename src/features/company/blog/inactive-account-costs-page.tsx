import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { inactiveAccountCostsArticle } from "./inactive-account-costs-content";

export function InactiveAccountCostsPage() {
  return <BlogArticlePage article={inactiveAccountCostsArticle}>
    <p>The last order is shipped. The checkout is disabled. The owner moves on to the next part of the business. A month later, another account charge arrives.</p>
    <p>From the owner’s perspective, the service stopped being useful when sales stopped. From the agreement’s perspective, the account may still be open. Both facts can be true. A merchant should be able to understand the cost of that gap before it becomes an unwelcome bank debit.</p>

    <section id="what-you-are-retaining" aria-labelledby="what-you-are-retaining-title">
      <h2 id="what-you-are-retaining-title">An open account should have a purpose</h2>
    <p>There are legitimate reasons to retain an account after trading slows or stops. The business may expect to reopen. It may still need records, refund access or a way to manage unresolved activity. Those needs have to be compared with the charges and capabilities that actually continue.</p>
    <p>An account is not a useful backup simply because credentials still work. The merchant should establish whether it remains approved for the intended activity and what restarting would require. Otherwise an ongoing bill may be buying less readiness than the owner imagines.</p>
    <p>A pause also needs to be a real contractual option. Authorize.net, for example, says its accounts cannot be suspended or placed on hold; closure is a separate process. That illustrates why an informal assumption about inactivity is an unsafe substitute for the provider’s stated procedure.</p>
    </section>

    <section id="closing-well" aria-labelledby="closing-well-title">
      <h2 id="closing-well-title">Closure needs a clean handoff</h2>
    <p>Before ending access, preserve the records the business is entitled to retain and establish how outstanding refunds and disputes will be handled. Closing a merchant account does not erase obligations from earlier transactions.</p>
    <p>Separate agreements deserve particular attention. The merchant account, gateway, store platform and optional services may have different cancellation processes. Ending one does not prove that every other subscription has ended. A final confirmation and a clear effective date are more useful than a verbal assurance that “it is all taken care of.”</p>
    <p>Trolleys merchants can request closure through support under the <Link href="/company/legal/merchant-services#termination" prefetch={false}>termination terms</Link>. Outstanding responsibilities remain, and separately contracted provider services may need their own cancellation. That distinction matters when the owner is expecting the next bill to be the last.</p>
    <p>Paying to preserve access until a planned reopening is a different decision from paying because the business might reopen someday. In the second case, each modest monthly charge can pass without anyone reconsidering the purpose of the account. A useful reason to keep it open should have a point at which it can be revisited. Otherwise the agreement can outlive the plan it was retained to serve.</p>
    </section>
  </BlogArticlePage>;
}
