import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { saasPaymentsArticle } from "./saas-payments-content";
import s from "./blog.module.css";

const records = [
  ["Subscription", "What the customer agreed to buy and when it renews.", "Plan, billing period, agreed price and scheduled changes."],
  ["Invoice", "What is due for a particular period or adjustment.", "Invoice reference, due date, credits and remaining balance."],
  ["Payment", "What happened when collection was attempted.", "Payment reference, amount, currency and verified result."],
  ["Software access", "Which features the customer can use and for how long.", "Included features, effective dates and the agreed access policy."],
] as const;

export function SaasPaymentsPage() {
  return <BlogArticlePage article={saasPaymentsArticle}>
    <section id="separate-states" aria-labelledby="separate-states-title">
      <h2 id="separate-states-title">Separate the promise from the payment</h2>
      <p>Software as a service, or SaaS, combines an ongoing product relationship with repeated billing. The plan, invoice, payment and access records answer different questions. Collapsing them into one “active” flag makes it difficult to explain why a customer has access or still owes money.</p>
      <table className={s.comparison}>
        <caption>Four records behind a software subscription</caption>
        <thead><tr><th scope="col">Record</th><th scope="col">What it explains</th><th scope="col">What to retain</th></tr></thead>
        <tbody>{records.map(([record, purpose, details]) => <tr key={record}>
          <th scope="row">{record}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it explains</span>{purpose}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to retain</span>{details}</td>
        </tr>)}</tbody>
      </table>
      <p>Provider status names need interpretation. Stripe documents configurations where an active subscription still has unpaid invoices, and payment methods whose results arrive later. Read the behavior of the setup you use, especially trials, invoice collection and delayed confirmation.</p>
      <p>Define when your product grants, changes or ends access. Keep the decision tied to the customer’s agreement and the relevant billing events. A payment provider’s status label is useful evidence, but its meaning must be understood before it controls your product.</p>
    </section>
    <section id="plan-change" aria-labelledby="plan-change-title">
      <h2 id="plan-change-title">Make a plan change understandable</h2>
      <p>Suppose a customer upgrades halfway through a paid billing period. Your policy might credit unused time on the old plan and charge for the remaining time on the new plan. It might instead start the upgrade at the next renewal. The agreement and billing settings determine the result.</p>
      <p>Adjusting a charge for part of a billing period is called proration. It does not automatically mean money is collected or refunded immediately. Stripe, for example, documents separate behavior for calculating those adjustments and billing or refunding them.</p>
      <p>Before the customer confirms, show the effective date, any amount due now, any credit and the next renewal amount and date. Preview the actual adjustment through the billing system rather than assuming every month has the same number of days.</p>
      <p>Also check whether the current invoice was paid. A credit for unused time should not be treated as a refund of money you never collected. Decide what happens to the upgrade if its payment fails, so the invoice and the features available to the customer remain consistent.</p>
    </section>
    <section id="failure-policy" aria-labelledby="failure-policy-title">
      <h2 id="failure-policy-title">Write a failure and recovery policy</h2>
      <p>A failed renewal needs a planned response from product, finance and support. Agree on four decisions before customers encounter the problem:</p>
      <ul>
        <li><strong>Grace period.</strong> Define whether existing customers keep access during collection recovery, when that access ends and which notices they receive.</li>
        <li><strong>Cancellation.</strong> Distinguish stopping the next renewal from ending access now. Explain any remaining balance, final usage charge or refund under the agreement.</li>
        <li><strong>Recovery.</strong> Give the customer a trusted way to update payment details. Associate the retry with the existing invoice and confirm which payment method future attempts will use.</li>
        <li><strong>Reconciliation.</strong> Record adjustments, refunds and recovered payments separately so a corrected bill does not look like a second sale.</li>
      </ul>
      <p>Not every decline should be retried automatically. Follow the provider’s response and retry rules. Stripe’s documentation, for example, identifies declines that require a new payment method and distinguishes card retries from direct debit retries.</p>
      <p>Updating a card is not the same as paying the open invoice. Verify the collection result before applying your recovery policy. Our <Link href="/company/blog/card-on-file" prefetch={false}>card on file article</Link> explains consent and stored payment details.</p>
      <p>Test a customer who replaces a card after a failed renewal and a customer who cancels with an invoice still open. Staff should be able to explain the balance and access end date without creating an unrelated second subscription.</p>
    </section>
    <section id="buying-test" aria-labelledby="buying-test-title">
      <h2 id="buying-test-title">Choose around your billing model</h2>
      <p>Before comparing processors, describe your hardest ordinary month: seats added, usage arriving late, annual renewals, discounts expiring or payments in different currencies. Request a demonstration of the cases you actually sell, including their invoices and customer notices.</p>
      <p>Identify which service calculates the bill, which collects it, and which system controls software access. Include billing software, processing, implementation and support costs in the comparison. A recurring charge alone does not establish that every part of your subscription model is supported.</p>
      <p>Trolleys, an Etail Depot service, supports recurring payments through Cybersource when enabled for the merchant account. Confirm the permitted methods, authorizations and notices with the account team. Your software’s plan changes and access rules still need their own design; do not assume that gateway activation configures them.</p>
      <p>If your software will accept payments on behalf of other businesses, discuss that separate model through <Link href="/use-cases/software-platforms" prefetch={false}>Software platforms</Link>. Charging customers for your own software does not, by itself, establish a platform payment arrangement.</p>
      <p>Measure collection performance separately from customer retention. A customer who wants to stay but has a payment problem needs a different response from someone who no longer needs the product.</p>
    </section>
  </BlogArticlePage>;
}
