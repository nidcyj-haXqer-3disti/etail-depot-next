import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { accountGroupPricingArticle } from "./account-group-pricing-content";

export function AccountGroupPricingPage() {
  return <BlogArticlePage article={accountGroupPricingArticle}>
    <p>The owner sees one business group. The operations team sees several stores. The provider may see several merchant accounts, each with its own accepted terms. A discount negotiated using the group’s combined sales does not automatically appear on every one of those accounts.</p>
    <p>That gap can first appear on the newest store’s statement. Its sales helped justify the group’s proposal, yet its own account may still be outside the agreed discount. “All our stores” sounded clear in the meeting. Billing needs an actual list.</p>

    <section id="define-the-group" aria-labelledby="define-the-group-title">
      <h2 id="define-the-group-title">The account list is part of the offer</h2>
    <p>A group-level arrangement needs to identify which accounts count toward the threshold and which receive the resulting price. Those need not be identical questions. It also needs to establish whether new locations join automatically, require a review or begin on separate terms.</p>
    <p>Legal company names, DBAs and merchant identifiers serve different purposes. A new DBA under an existing company may involve an additional merchant account. A common dashboard does not, on its own, combine the accounts’ contractual pricing. The records must connect the negotiated offer to the accounts that will actually be billed.</p>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#service-order" prefetch={false}>Merchant Service Order</Link> identifies the business and account, while accepted billing variations identify the provision and effective date they change. A group conversation needs that same precision in the account-level record.</p>
    </section>

    <section id="when-the-group-changes" aria-labelledby="when-the-group-changes-title">
      <h2 id="when-the-group-changes-title">Expansion can alter both sides of the calculation</h2>
    <p>Group pricing also changes how an owner reads the performance of each location. If the discount applies unevenly, spreading the group’s savings evenly across store budgets gives the wrong picture. A new store should be evaluated using the terms that actually apply to its account, even while its sales contribute to a larger group total.</p>
    <p>The reverse problem appears when a location closes. Where its activity helped the remaining accounts qualify for a discount, removing it could change their price as well. That possible effect belongs in the closure decision. It is another reason to agree how the account list changes before a new opening or closure puts the arrangement to the test.</p>
    <p>The business also needs to know what happens when an account leaves the group, changes ownership or uses a different approved payment arrangement. Commercial aggregation must not be confused with permission to run one business’s payments through another business’s account.</p>
    <p>The first bills should show the agreement working account by account. A consolidated total can conceal one location that stayed on the old terms. With an accepted account list and start date, finance can identify the exception instead of reopening the whole negotiation.</p>
    <p>A group discount is useful when the owner can see both what the group saves and where those savings land. Otherwise, expansion can make the headline offer look better while making the cost of an individual store harder to understand.</p>
    </section>
  </BlogArticlePage>;
}
