import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { volumeDiscountTermsArticle } from "./volume-discount-terms-content";

export function VolumeDiscountTermsPage() {
  return <BlogArticlePage article={volumeDiscountTermsArticle}>
    <p>A merchant doubles sales and expects the processing rate to improve. The provider continues billing the accepted rate. The merchant sees loyalty going unrewarded; the provider may see an agreement that never contained an automatic adjustment.</p>
    <p>Growth is a good reason to reopen the commercial discussion. It is not a substitute for the terms of that discussion.</p>

    <section id="which-part-gets-cheaper" aria-labelledby="which-part-gets-cheaper-title">
      <h2 id="which-part-gets-cheaper-title">Find out what is being discounted</h2>
    <p>The headline percentage can contain costs with different owners. A discount on the provider’s margin reduces that component, while card mix and other underlying charges can still move. If growth brings more payments with higher underlying costs, the average cost could rise despite a genuine margin discount. The merchant needs to check the promised reduction against the component it applies to, then judge what the whole arrangement costs.</p>
    <p>Helcim, for example, applies tiers to its margin using average monthly card volume over the preceding three months. Its rule identifies a measurement period and a price component, so growth can be connected to a particular adjustment. Trolleys and other providers have their own terms; the same volume figure does not necessarily produce the same change.</p>
    <p>Custom pricing can instead require a conversation and an amended agreement. In that situation, the effective date matters as much as the offered rate. A lower rate discussed in a sales call has not produced a saving until it applies to the account.</p>
    </section>

    <section id="growth-on-paper" aria-labelledby="growth-on-paper-title">
      <h2 id="growth-on-paper-title">Projected volume and proven volume have different weight</h2>
    <p>A launch forecast may justify a proposal, but it brings uncertainty about whether the activity will arrive. A commitment based on that forecast can create a minimum or other obligation the merchant must understand. Historical processing gives both sides a firmer basis, although a seasonal peak still needs context.</p>
    <p>The account boundary matters too. A business group’s combined revenue does not automatically establish qualifying volume for every merchant account. The proposal should say whether accounts are considered together and which payment types count.</p>
    <p>For Trolleys, any account-specific pricing variation belongs in the <Link href="/company/legal/fees#scope" prefetch={false}>accepted terms</Link>. The merchant should be able to connect the negotiated change to the rate on the bill, without relying on an informal assurance that growth will eventually be recognized.</p>
    <p>A growing merchant has more to bring to a pricing discussion than a larger sales total. Sustained volume and a documented payment mix give the provider something concrete to price. The commercial result is an agreed change with an effective date, rather than another promise to revisit the account when the business gets bigger.</p>
    </section>
  </BlogArticlePage>;
}
