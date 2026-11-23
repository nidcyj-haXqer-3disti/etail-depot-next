import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { annualRenewalCostsArticle } from "./annual-renewal-costs-content";

export function AnnualRenewalCostsPage() {
  return <BlogArticlePage article={annualRenewalCostsArticle}>
    <p>A business looks at the subscriptions due to renew next month and sees a reassuring total. Customers are already enrolled. The invoices can be generated automatically. The year ahead seems partly funded.</p>
    <p>Between “due to renew” and “money available” sit failed payments, retries, cancellations, refunds and the account’s funding terms. Annual billing concentrates those events. A small forecasting error can become a noticeable cash gap when many customers renew together.</p>

    <section id="renewals-are-not-receipts" aria-labelledby="renewals-are-not-receipts-title">
      <h2 id="renewals-are-not-receipts-title">A schedule is a claim on future collection</h2>
    <p>The renewal list describes what the business expects to bill. Successful payment records show what was collected. Available funds show what can presently support the business. If most renewals fall in one week, spreading that expected cash evenly across the month conceals how much depends on that week’s collections. The timing of the total matters as much as its size.</p>
    <p>Payment details may need updating after a year. A failed attempt may later recover, or it may require the customer to take action. Repeatedly scheduling an attempt does not prove that another charge was sent or that it succeeded. Stripe’s retry documentation explicitly distinguishes scheduled retries from executed charges in certain failure conditions.</p>
    <p>For an operating forecast, that means recovery should be based on observed outcomes and timing. A promised renewal that eventually pays in week three does not fund a bill due in week one.</p>
    </section>

    <section id="what-the-cash-has-to-do" aria-labelledby="what-the-cash-has-to-do-title">
      <h2 id="what-the-cash-has-to-do-title">The year’s money has a year’s work attached</h2>
    <p>Annual collection can improve cash timing, but the business may still owe months of service. A large deposit at renewal is not evidence that the full amount is available to spend without regard to future delivery costs, refund obligations or other commitments.</p>
    <p>Payment costs belong in the cash plan as well. Apply successful-payment fees to the activity that incurs them, and include separately agreed billing or attempt charges where applicable. If refunds follow renewal, their principal and any retained original processing fees affect what remains.</p>
    <p>A renewal report is more useful when it separates customers who paid, customers whose payment remains unresolved and customers who chose to leave. Those groups require different work. Combining them into one collection shortfall can send support after the wrong problem while the cash forecast stays too optimistic.</p>
    <p>For Trolleys merchants, the <Link href="/company/legal/fees" prefetch={false}>fee terms</Link> establish the charging rules; the business’s own renewal history supplies the forecast. Neither should be replaced with the assumption that automatic billing means automatic cash.</p>
    <p>The first payroll after renewal will be paid from available cash, not the renewal schedule. The earlier the forecast recognizes that distinction, the more time the business has to deal with a shortfall without interrupting the service customers renewed.</p>
    </section>
  </BlogArticlePage>;
}
