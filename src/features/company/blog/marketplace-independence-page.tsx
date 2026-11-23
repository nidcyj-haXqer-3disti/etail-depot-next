import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { marketplaceIndependenceArticle } from "./marketplace-independence-content";

export function MarketplaceIndependencePage() {
  return <BlogArticlePage article={marketplaceIndependenceArticle}>
    <p>The merchant knows the product sells. Marketplace orders arrive every day, the reviews are encouraging and the payout is predictable enough to plan around.</p>
    <p>Opening a direct store looks like a way to keep more control and reduce the charges deducted from each sale.</p>
    <p>That may be a good commercial move. But the marketplace’s fee is not the only thing that disappears. Some work it performed, restricted or coordinated now needs an owner inside the business.</p>

    <section id="what-the-platform-did" aria-labelledby="what-the-platform-did-title">
      <h2 id="what-the-platform-did-title">Work out which responsibilities are actually moving.</h2>
    <p>Read the arrangement for the marketplace you use. Platforms differ in who processes the payment, appears as seller, handles tax obligations, provides customer support and manages disputes. Do not assume that every marketplace has acted as merchant of record, or that every responsibility was outsourced simply because the buyer paid on its website.</p>
    <p>For direct sales, identify the legal seller and the proposed merchant account. Then follow a hypothetical return. The customer writes to the store, the team finds the order, someone authorizes the remedy and the permitted payment process confirms what happened. Wherever the marketplace used to supply a step, the direct store needs an answer of its own. The customer should encounter that answer through clear terms and working support, not discover the missing step after buying.</p>
    <p>Trolleys’ review needs the proposed direct business, website, delivery and expected activity. Marketplace history can support the story, but identify what those reports actually show. Net payouts after platform deductions are not automatically the same measure as gross card volume expected on the new account.</p>
    </section>

    <section id="two-histories" aria-labelledby="two-histories-title">
      <h2 id="two-histories-title">The old marketplace orders do not become direct orders.</h2>
    <p>Keep earlier sales identifiable by their original platform and payment references. A return from an old order may need the marketplace’s process; a new direct transaction follows the approved process for its own account. Staff should not issue a second reimbursement simply because they cannot see the first one in the new dashboard.</p>
    <p>Customer access and consent need the same care. A marketplace customer record does not prove permission to use stored payment details or contact the buyer for unrelated marketing. Follow the platform agreement, privacy requirements and supported migration arrangements. Do not export credentials or recreate charges to make a customer appear subscribed in the new store.</p>
    <p>The store can invite a customer to make a new purchase through a clear, permitted journey. Whether anything else can be transferred must be established, not assumed.</p>
    </section>

    <section id="margin-and-control" aria-labelledby="margin-and-control-title">
      <h2 id="margin-and-control-title">Measure what control costs as well as what it saves.</h2>
    <p>Compare the complete direct-sale operation: payment charges, website costs, customer acquisition, fulfillment, support and the cash needed for refunds. Some direct-store work must be done even when only a few orders arrive. A comparison that assumes all marketplace volume will immediately move over can spread those costs across sales the new store has not earned. Use a plausible direct-sales volume and show what happens if the store starts smaller.</p>
    <p>Start with an approved setup and a manageable direct offer. Confirm that the first orders produce the records your team needs, and that someone owns each action after the customer pays. Our <Link href="/resources/merchant-account-setup" prefetch={false}>merchant account setup guide</Link> is the starting point for the Trolleys account workflow.</p>
    <p>Direct selling gives the business more decisions to make about its customer relationship. Those decisions can be valuable, but they need time, records and people behind them. The first direct return is as useful a test of independence as the first direct sale: it shows whether the business has taken ownership of the work as well as the storefront.</p>
    </section>
  </BlogArticlePage>;
}
