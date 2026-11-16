import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { meteredBillingArticle } from "./metered-billing-content";

export function MeteredBillingPage() {
  return <BlogArticlePage article={meteredBillingArticle}>
    <p>A customer questions a usage charge. Finance can see the invoice. Support can see a usage total. Engineering can see the activity logs. If those records cannot be connected, a simple question about a bill becomes a task passed between three teams.</p>
    <p>Metered billing calculates charges from measured consumption, such as messages sent, documents processed or storage used over time. It can connect the price to how much a customer uses the product. It also makes the business responsible for explaining the measurement.</p>
    <p>A correct rate multiplied by an unreliable quantity still produces an unreliable bill. The important test is whether your team can trace a questioned charge back to the activity and agreement behind it.</p>

    <section id="count-the-promised-unit" aria-labelledby="count-the-promised-unit-title">
      <h2 id="count-the-promised-unit-title">Count what you promised to charge for</h2>
      <p>Suppose a document service charges for each successful conversion. A completed job is reported to the billing system, but the acknowledgment is lost. The service sends the record again. There are now two deliveries of a usage record, but only one conversion.</p>
      <p>The retry needs to remain identifiable as the same event. Stripe’s Billing Meters documentation recommends idempotency keys to prevent repeated reporting caused by latency or other issues. In ordinary language, that means giving a usage submission a stable identity so resending it need not create another chargeable record.</p>
      <p>That protection cannot decide your commercial rules. If the customer deliberately runs the conversion again, is that a new billable job? If a job fails, does it still incur a charge? The answer depends on what you sell and promise. Agree on the unit before asking engineering to count it. Our article on <Link href="/company/blog/billing-models" prefetch={false}>billing models</Link> examines that choice.</p>
      <p>The records also need to identify the correct customer and period. Keep enough references to explain the activity without storing the customer’s document contents merely as billing evidence. An unexplained total is difficult to defend; an unnecessary copy of every document creates a different problem.</p>
      <p>When the price includes an allowance, distinguish total qualifying use from the units charged above it. Keep the applicable rate and allowance with the billing period, including any agreed change. Recalculating an old bill using today’s plan settings can produce an answer the customer never agreed to.</p>
    </section>

    <section id="close-the-billing-period" aria-labelledby="close-the-billing-period-title">
      <h2 id="close-the-billing-period-title">The billing period can end before the data arrives</h2>
      <p>Activity can occur before the period closes and reach the billing system afterward. Decide how long the business will wait for those records, which billing time zone applies and how later corrections will be handled. A customer should not have to discover this policy through an unexpected charge.</p>
      <p>Stripe’s Billing Meters documentation makes a consequential distinction: an accepted late event can appear in meter summaries without changing a finalized invoice or being added to the next one. Its finalization grace period allows qualifying invoices more time to incorporate usage, but the rules differ by invoice type and include exceptions for price changes during a cycle.</p>
      <p>Those are rules for that particular billing setup, not universal behavior. Confirm what your own system does before telling finance that accepted usage has been billed. Equally, a recent submission may not yet appear in a total: Stripe processes Billing Meters events asynchronously.</p>
      <p>Show customers when a usage view was last updated and whether the amount is still provisional. Give staff the same context. Otherwise, the number quoted by support and the number on the eventual invoice can differ even when both came from the system.</p>
    </section>

    <section id="correct-the-customer-record" aria-labelledby="correct-the-customer-record-title">
      <h2 id="correct-the-customer-record-title">A corrected meter is only part of the repair</h2>
      <p>Finding and fixing bad usage data does not establish that the customer’s bill has changed. Orb’s documentation, for example, says a historical usage update changes relevant draft invoices but leaves issued invoices unchanged. It does not reissue those invoices.</p>
      <p>Follow the correction through the affected records. Establish the accurate usage, identify the invoice that used the earlier figure and determine the appropriate adjustment under your billing process. If money was already collected, record whether the agreed remedy is a refund or credit, and confirm that it actually happened.</p>
      <p>The customer needs a readable explanation of the original charge, the error and the correction. Preserve that connection internally too. Our article on <Link href="/company/blog/saas-payment-processing" prefetch={false}>SaaS payment processing</Link> explains why billing, collection and software access need separate decisions.</p>
      <p>Before launching metered pricing, ask someone outside engineering to resolve a questioned bill using the records you intend to keep. If they can explain the units, the rate and any correction without reconstructing the month from raw logs, the business is better prepared to support the price it is selling.</p>
    </section>
  </BlogArticlePage>;
}
