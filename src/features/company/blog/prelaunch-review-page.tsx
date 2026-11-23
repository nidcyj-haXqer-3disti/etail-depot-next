import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { prelaunchReviewArticle } from "./prelaunch-review-content";

export function PrelaunchReviewPage() {
  return <BlogArticlePage article={prelaunchReviewArticle}>
    <p>The designer is waiting for the payment connection. The payment application asks for the website. The owner is caught between two tasks that seem to require each other to be finished first.</p>
    <p>The two teams are waiting for different kinds of readiness. The developer needs to know how the approved payment connection will work. The reviewer needs to know what the business intends to sell and promise customers.</p>
    <p>A complete visual design is not necessarily a complete business presentation. Placeholder products, draft prices and a copied refund policy can leave the important questions unanswered even when the pages look ready.</p>

    <section id="reviewable-business" aria-labelledby="reviewable-business-title">
      <h2 id="reviewable-business-title">Make the commercial offer reviewable.</h2>
    <p>An unfinished policy page can reveal an unfinished business decision. If nobody has settled where orders ship from or what delivery period the store can promise, the web team has no accurate wording to finish. Resolve those decisions alongside the actual products, seller, prices or pricing method, currency and customer contact route. Then the site can present the terms intended for launch. Mark any remaining proposal clearly rather than presenting it as an operating fact.</p>
    <p>Ask whether the reviewer can assess a staging or otherwise controlled version, how to provide access and which items must be complete before activation. Do not assume a screenshot of a homepage is enough, or that making an unfinished site public is always required.</p>
    <p>Stripe states that an incomplete website may prevent activation until the necessary business information is available. That is a specific provider requirement, but it illustrates the distinction: opening an application is different from satisfying the conditions to start selling.</p>
    </section>

    <section id="work-in-parallel" aria-labelledby="work-in-parallel-title">
      <h2 id="work-in-parallel-title">Keep the launch dependencies visible.</h2>
    <p>The developer can prepare product pages, order records, customer communications and the supported integration approach while commercial review proceeds. Use approved testing arrangements; a technical demonstration is not live account activation.</p>
    <p>For Trolleys, confirm the approved business, website, methods and account conditions through the actual setup process. Our <Link href="/developers/getting-started" prefetch={false}>after-approval developer guidance</Link> explains the handoff once the merchant account is ready. Avoid treating a login, gateway credential or completed application as the final permission to open checkout.</p>
    <p>Keep a short record of what is still outstanding and who resolves it. A missing shipping policy belongs with the business. A broken page belongs with the web team. An approval condition belongs with the implementation contact and responsible provider. This prevents everyone waiting for a vague task called payments.</p>
    </section>

    <section id="the-published-version" aria-labelledby="the-published-version-title">
      <h2 id="the-published-version-title">The site launched should be the business that was reviewed.</h2>
    <p>Before launch, compare the real offer with what the application described. A late change from stocked goods to preorders, or from one-time sales to automatic renewals, can change the payment arrangement even if the design barely changes.</p>
    <p>Trolleys requires accurate activity information and appropriate approval for material changes. Bring the changed model back into that conversation rather than relying on a review of an earlier version.</p>
    <p>A store can be ready for review before it is ready to take money. Treating those as separate milestones gives the developer useful work to finish and the owner a clearer view of what still stands between the business and launch.</p>
    </section>
  </BlogArticlePage>;
}
