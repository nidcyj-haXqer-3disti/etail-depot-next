import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { retirePaymentAccessArticle } from "./retire-payment-access-content";

export function RetirePaymentAccessPage() {
  return <BlogArticlePage article={retirePaymentAccessArticle}>
    <p>The new checkout works, so the old integration is removed from the website. That does not prove the old payment access has ended.</p>
    <p>A scheduled job, a connected app or a forgotten administrative account may still have authority. The reverse mistake is possible too: deleting every credential can interrupt a refund or reporting process that the business deliberately kept during the transition.</p>

    <section id="access-follows-a-job" aria-labelledby="access-follows-a-job-title">
      <h2 id="access-follows-a-job-title">Give every remaining connection a current purpose</h2>
    <p>Review access by the work it permits. Creating new payments, handling earlier transactions, reading records and receiving notifications are separate needs, even when a provider combines some of them under one credential. “We still need the old reports” explains why records matter; it does not by itself justify keeping every payment permission that came with the old integration.</p>
    <p>Identify the systems and people that still use the old arrangement. A credential removed from the storefront may remain in another deployment or integration. Keep secret values out of the inventory; record their identifiers, owners and permitted purpose instead.</p>
    <p>Then use the provider’s supported permissions and retirement controls. Stripe, for example, distinguishes restricted keys from broadly privileged secret keys and treats webhook signing secrets separately. Its controls are not universal, but they demonstrate why “delete the API key” is an incomplete description of retiring access.</p>
    </section>

    <section id="finish-the-retirement" aria-labelledby="finish-the-retirement-title">
      <h2 id="finish-the-retirement-title">Complete closure without deleting the business record</h2>
    <p>Stop obsolete jobs and integrations through a controlled change. Verify the required remaining operations still work through authorized access, then revoke credentials that no longer serve an agreed purpose. Investigate unexpected calls rather than restoring broad access simply to quiet an error log.</p>
    <p>If a credential may have been compromised, follow the provider’s incident process promptly. Routine migration convenience is not a reason to preserve unsafe access. The right remedy may require a replacement credential with narrower permissions while legitimate work continues.</p>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#termination" prefetch={false}>closure terms</Link> require affected service use to stop, with exceptions for expressly permitted closure activity and required records. Its <Link href="/company/legal/security-policy#account-access" prefetch={false}>access policy</Link> also calls for removing permissions people no longer need. Those are compatible duties: finish the authorized work securely, and preserve the records without leaving unnecessary processing authority behind.</p>
    <p>For access that remains, record what would make it unnecessary: completion of an approved closure task, a supported replacement or another agreed endpoint. “Keep it for now” can outlast the person who made the decision. A named owner and a reason to revisit it make temporary access something the business can actually retire.</p>
    </section>
  </BlogArticlePage>;
}
