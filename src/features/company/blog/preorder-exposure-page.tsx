import { BlogArticlePage } from "./article-page";
import { preorderExposureArticle } from "./preorder-exposure-content";

export function PreorderExposurePage() {
  return <BlogArticlePage article={preorderExposureArticle}>
    <p>The launch sells out. The campaign worked, customers paid and the sales report looks exceptional.</p>
    <p>The product has not shipped to anyone.</p>
    <p>That is the central tension of a preorder. Demand is visible immediately; the obligations it creates may take months to discharge. A merchant review needs to understand the second part before the first part becomes a funding problem.</p>

    <section id="demand-and-capacity" aria-labelledby="demand-and-capacity-title">
      <h2 id="demand-and-capacity-title">Demand does not establish production capacity.</h2>
    <p>Explain which parts of the supply plan are confirmed and which depend on the launch. A finished prototype, a supplier quotation and a booked production run establish different levels of readiness. Keep those distinctions visible.</p>
    <p>The first allocation and the next one may be different promises. Suppose the booked production run is full and additional orders need a later manufacturing slot. Reopening checkout with the original date would sell the next customers a wait the supply plan no longer supports. Decide what happens at capacity: close the allocation or present the supported timing for the next one. A checkout that keeps accepting orders does not prove that the original delivery promise remains credible.</p>
    <p>If customer payments fund manufacturing, say so. Show the important commitments and the points where delays or additional costs could affect delivery. Presenting the business as ordinary stocked retail would leave the reviewer assessing a different operation.</p>
    </section>

    <section id="payouts-are-an-assumption" aria-labelledby="payouts-are-an-assumption-title">
      <h2 id="payouts-are-an-assumption-title">Do not build the launch around unconfirmed access to funds.</h2>
    <p>The timing of a customer charge and the timing of an available payout are separate. Account conditions, reviews and reserves can affect when funds become usable. Obtain the actual arrangements before promising the supplier money on a date that depends on an assumed payout.</p>
    <p>Trolleys’ terms identify substantial advance payments and extended delivery as activities requiring specific written approval. Discuss the preorder structure, expected launch volume and fulfillment timeline before opening the campaign. A normal store approval should not be assumed to include a materially different launch.</p>
    <p>The business also needs to understand how it would meet customer remedies if production fails. A payment already sent to the supplier does not settle what the customer is owed.</p>
    </section>

    <section id="the-promise-after-launch" aria-labelledby="the-promise-after-launch-title">
      <h2 id="the-promise-after-launch-title">The campaign page should survive its own success.</h2>
    <p>State clearly that the item is a preorder, what is being charged and what shipping expectation is supported. For merchandise covered by the FTC’s order rule, an inability to ship as promised triggers the applicable delay-consent or refund requirements. A revised date in the warehouse system is not, by itself, customer consent.</p>
    <p>Preserve the offer customers accepted and the allocation their orders belong to. If a later campaign has different dates, keep that separate. Support should be able to tell one buyer where their order stands without relying on the latest version of the marketing page.</p>
    <p>A successful preorder should leave the business with a delivery plan it can execute. Selling out is the beginning of that test, not the evidence that it has been passed.</p>
    </section>
  </BlogArticlePage>;
}
