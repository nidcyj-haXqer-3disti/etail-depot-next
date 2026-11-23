import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { featureContractTermArticle } from "./feature-contract-term-content";

export function FeatureContractTermPage() {
  return <BlogArticlePage article={featureContractTermArticle}>
    <p>Imagine a merchant approaching a review of its payment provider when the team asks for a better reporting tool. The feature looks useful, the monthly price looks modest and the owner is ready to approve it. If the new order also extends the wider agreement, that small purchase could settle the larger renewal decision before the review has happened.</p>
    <p>An upgrade order can start a separate subscription, replace an existing schedule or alter the duration of a broader agreement. The benefit shown in the demonstration tells the owner why the tool might be worth having. It does not show what else the business is being asked to commit to.</p>

    <section id="the-boundary-of-the-upgrade" aria-labelledby="the-boundary-of-the-upgrade-title">
      <h2 id="the-boundary-of-the-upgrade-title">Find what the new order actually changes</h2>
    <p>The decisive detail may be outside the feature description. A new order can set a start date and price for one service while also replacing a provision in the existing agreement. A subscription that can be canceled on its own leaves the merchant with a different choice from an upgrade that extends the entire processing relationship.</p>
    <p>Neither outcome should be inferred from an “Activate” label. The accepted documents need to establish it. If the provider says the rest of the account is unchanged, ask it to identify the provisions the upgrade replaces and those that remain in force.</p>
    <p>A feature trial deserves the same attention. The business needs to know what happens when the trial ends and whether stopping the feature also reverses any associated contractual change. Disabling a tool is not necessarily the same as canceling its subscription.</p>
    <p>Trolleys’ <Link href="/company/legal/fees#billing-record" prefetch={false}>billing terms</Link> require an optional service to be expressly selected with its applicable charges accepted. An account variation identifies the account, affected provision and effective date. That creates a useful boundary: permission to add one service should not be stretched into an unexplained change elsewhere.</p>
    <p>There are two decisions to make when an upgrade extends the wider relationship: whether the feature is worth its cost, and whether the business wants that relationship for the additional period. A useful tool can pass the first test while the second remains unresolved. Asking whether it is available on separate terms makes the tradeoff visible, even if the provider declines.</p>
    <p>The merchant may reasonably accept the whole offer. What matters is that enthusiasm for a feature has not made the renewal decision on the owner’s behalf.</p>
    </section>
  </BlogArticlePage>;
}
