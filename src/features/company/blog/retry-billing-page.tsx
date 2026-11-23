import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { retryBillingArticle } from "./retry-billing-content";

export function RetryBillingPage() {
  return <BlogArticlePage article={retryBillingArticle}>
    <p>The retry counter keeps climbing. The same renewal is still unpaid.</p>
    <p>For a subscription business, that is the weakness in measuring recovery by activity. Another attempt may help collect the invoice, may wait for the customer to update a card, or may add a charge without bringing in revenue. The report needs to make those outcomes distinguishable.</p>

    <section id="the-recovery-group" aria-labelledby="the-recovery-group-title">
      <h2 id="the-recovery-group-title">Follow the same unpaid invoices</h2>
    <p>Begin with a defined group of failed renewals. Follow those invoices through successful collection, customer action and unresolved failure. Keep the value recovered separate from the number of attempts. One large recovered invoice and many small ones can produce very different economics.</p>
    <p>An attempt count also needs a definition. Stripe’s retry documentation describes circumstances in which a retry is scheduled and the counter advances, but no new charge is executed until payment details change. A schedule is therefore an unsafe proxy for billable gateway activity.</p>
    <p>Use the actual events covered by the fee agreement. Some gateway arrangements charge for unsuccessful transaction requests as well as successful payments. Successful processing fees, gateway event fees and any recovery-service charge each need the appropriate calculation base.</p>
    </section>

    <section id="recovery-without-noise" aria-labelledby="recovery-without-noise-title">
      <h2 id="recovery-without-noise-title">Persistence has limits</h2>
    <p>An expired credential, a temporary shortage of funds and a customer who has withdrawn permission are different problems. The recovery process must respond to the payment result and applicable rules, rather than treating every failure as an invitation to keep trying. A needed customer update cannot be replaced indefinitely by another automated request.</p>
    <p>When evaluating a changed retry policy, compare outcomes over a suitable period and consider other changes in the customer group. Some customers would have updated their details or paid through another permitted route. Collecting their money earlier can still help cash flow, but that benefit is different from recovering an invoice that would otherwise remain unpaid. Counting both as entirely new revenue overstates what the retry policy achieved.</p>
    <p>For Trolleys merchants, the <Link href="/company/legal/fees#calculation" prefetch={false}>fee calculation</Link> distinguishes successful captures from separately agreed event charges. Those records can establish the cost. The subscription business has to establish the improvement in collection and the effect on its customers.</p>
    <p>The question at the end of the month is how much of the overdue money was recovered, at what cost, and what remains for the customer to fix. A busy retry report should not make an unpaid invoice look like progress.</p>
    </section>
  </BlogArticlePage>;
}
