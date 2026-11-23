import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { pricingAuthorityArticle } from "./pricing-authority-content";

export function PricingAuthorityPage() {
  return <BlogArticlePage article={pricingAuthorityArticle}>
    <p>Imagine two proposals with the same opening price. One holds that price for a defined period. The other allows specified changes through its agreed amendment process. The first statements could look identical, even though the merchant has accepted different terms for what happens next.</p>
    <p>Negotiating only the opening rate misses that difference. The power to change a price determines how much of the proposal the owner can use in a longer forecast, and what would require another decision. The amendment clause belongs in the commercial discussion while the rate is still being negotiated.</p>

    <section id="read-the-amendment-power" aria-labelledby="read-the-amendment-power-title">
      <h2 id="read-the-amendment-power-title">Look for the power the agreement actually grants</h2>
    <p>Identify which fees the provider may revise, the permitted mechanism and any limits. A defined price period, an account-specific amendment and a general schedule can have different effects. Do not assume a new website price automatically replaces a negotiated term, or that negotiating a price once freezes it indefinitely.</p>
    <p>The agreement may distinguish notice from acceptance. Where acceptance is required, establish whose action counts and how it is recorded. The person who receives a billing message may not be the person authorized to bind the business. Equally, a message from a sales representative does not establish that the representative can change another legal party’s agreement.</p>
    <p>A claim that an increase reflects network costs raises a separate evidentiary question, covered in <Link href="/company/blog/network-fee-changes-on-your-statement" prefetch={false}>our article on network fee changes</Link>. Here the issue is whether the account’s accepted terms permit the proposed amendment. A convincing explanation of the cost does not replace that inquiry.</p>
    </section>

    <section id="preserve-the-agreed-version" aria-labelledby="preserve-the-agreed-version-title">
      <h2 id="preserve-the-agreed-version-title">Keep a record of what changed and who accepted it</h2>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#changes" prefetch={false}>change provisions</Link> ordinarily require advance written notice of material adverse changes or increases in Etail’s fees. Changes take effect through the acceptance process specified in the Service Order and permitted by law. Posting revised text alone does not amend an existing agreement.</p>
    <p>The terms preserve a narrow exception for a change strictly required sooner by law or a binding provider or network requirement. They also let the merchant end the affected service before an ordinary covered change takes effect without a charge solely for rejecting it. Existing obligations and separate provider terms still retain their relevant effect.</p>
    <p>When an amendment is accepted, retain the affected account, document version, effective date and acceptance record with the original agreement. That gives billing and management the same answer about which price applies.</p>
    <p>A quoted rate is more useful when the merchant can explain its time horizon: what is settled, what can change and what action a change would require. Without that understanding, two identical opening prices can conceal very different commitments.</p>
    </section>
  </BlogArticlePage>;
}
