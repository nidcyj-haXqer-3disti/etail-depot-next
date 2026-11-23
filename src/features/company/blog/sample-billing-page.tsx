import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { sampleBillingArticle } from "./sample-billing-content";

export function SampleBillingPage() {
  return <BlogArticlePage article={sampleBillingArticle}>
    <p>A sales proposal explains why to buy. An invoice reveals what the finance team will have to live with.</p>
    <p>Before accepting a payment quote, ask the provider to show how the proposed arrangement would appear on a bill. A redacted sample or a clearly hypothetical illustration can do that without exposing another merchant’s confidential statement. A generic sample is useful only if the provider identifies where your proposed charges and collection arrangements would differ.</p>

    <section id="follow-one-payment" aria-labelledby="follow-one-payment-title">
      <h2 id="follow-one-payment-title">Follow one payment through the paperwork</h2>
    <p>Give the illustration a small, deliberate history: a successful customer payment, a later refund and any agreed recurring service. Ask where each charge appears, which period contains it and how a credit would be identified. The point is to understand the treatment, not to force every possible event into a single sample.</p>
    <p>Then follow collection. Some amounts may already have been deducted under the account arrangement; others may remain payable. The bill must let the reader distinguish the cost of the service from the amount still due. A total with no explanation of prior collections creates avoidable doubt and can lead to paying twice.</p>
    <p>A refund is an especially useful test. Returning the purchase amount to the customer does not necessarily return the original processing fee. The sample should reflect the actual agreement rather than an idealized account where every reversal erases every cost.</p>
    </section>

    <section id="finance-before-signature" aria-labelledby="finance-before-signature-title">
      <h2 id="finance-before-signature-title">Bring the person who closes the month into the decision</h2>
    <p>The owner may understand the negotiated percentage while the bookkeeper needs account identifiers, billing periods and a usable export. Both needs belong in the buying decision. If the business has several merchant accounts, the sample should show how the proposed grouping or separate billing will work.</p>
    <p>Trolleys’ <Link href="/company/legal/fees#billing-record" prefetch={false}>billing terms</Link> distinguish the charging party, charges and credits, amounts collected and the remaining balance. A bank debit authorization is separate from the invoice itself. That separation matters when someone asks whether a displayed balance will be collected automatically.</p>
    <p>A sample cannot amend the contract or guarantee a future total. Its value appears when the bookkeeper tries to reconcile it. A question about an unfamiliar abbreviation may need a short explanation. An inability to tell whether a fee has already been collected points to a more consequential gap in the billing design.</p>
    <p>Let the person who closes the month read the sample before the demonstration. Their unanswered questions show what the business will face when the salesperson is no longer beside them. Resolving those questions before checkout moves turns a quoted price into an arrangement the business can actually administer.</p>
    </section>
  </BlogArticlePage>;
}
