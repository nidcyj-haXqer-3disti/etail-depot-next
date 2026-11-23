import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { platformBillingCostsArticle } from "./platform-billing-costs-content";

export function PlatformBillingCostsPage() {
  return <BlogArticlePage article={platformBillingCostsArticle}>
    <p>A platform can explain every charge on a merchant’s payment statement and still have an unfinished model for its own subscription revenue. The oversight begins when the software price is treated as the amount the platform will keep.</p>
    <p>Two sales are taking place: the merchant sells to its customer, and the platform sells software to the merchant. Those relationships have different sellers, account terms and payment costs. Expertise in the first does not settle the economics of the second.</p>

    <section id="separate-the-two-sales" aria-labelledby="separate-the-two-sales-title">
      <h2 id="separate-the-two-sales-title">Revenue from the merchant is still revenue to collect</h2>
    <p>For a separately billed subscription, the platform needs an appropriate payment arrangement for its own software sales. The fact that a customer already has a connected merchant account does not by itself authorize the platform to charge a card or deduct its invoice from that merchant’s payouts.</p>
    <p>Trolleys’ <Link href="/company/legal/software-platforms" prefetch={false}>software platform terms</Link> make the boundary explicit: platform charges, any collection route and the affected permissions must be agreed. A technical connection alone does not supply that authority. The platform relationship also does not approve every merchant or make the platform the seller of its merchants’ goods.</p>
    <p>Once the collection route is established, its costs belong in the software product’s economics. Processing, failed collection, refunds and billing operations can reduce the subscription revenue the platform keeps. The useful unit here is the software account: what did collecting and supporting this subscription leave behind? The merchant’s sales volume is a different measure. It cannot tell the platform whether the subscription covers the work of collecting and supporting that subscription.</p>
    </section>

    <section id="price-the-relationship" aria-labelledby="price-the-relationship-title">
      <h2 id="price-the-relationship-title">The billing design affects the customer relationship</h2>
    <p>A subscription, a usage charge and an agreed share of payment activity create different expectations for the merchant. The charge should identify what service the platform provides and how its amount is determined. If a payment-related charge is collected alongside another amount, the merchant still needs to understand who is charging it and why.</p>
    <p>This is especially important at cancellation. Ending the software subscription and ending a merchant processing agreement are separate decisions. Under Trolleys’ platform terms, a software debt is not authority to interrupt an unrelated merchant account or withhold its funds.</p>
    <p>For the platform owner, the commercially useful exercise is to follow one subscription from the price shown to the amount retained after collection and support. If the margin depends on an unapproved deduction or an assumed free collection method, the model has not been completed.</p>
    <p>The merchant encounters the partnership partly through that invoice. If the platform cannot explain its own charge clearly, the payment expertise behind the software becomes harder to trust. Getting the collection economics right and making the bill understandable are part of the same product decision.</p>
    </section>
  </BlogArticlePage>;
}
