import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentFailoverArticle } from "./payment-failover-content";

export function PaymentFailoverPage() {
  return <BlogArticlePage article={paymentFailoverArticle}>
    <p>A customer charged twice will not experience your backup payment route as a success. Your team may have kept the website selling. The customer now has a problem they did not have before they bought from you.</p>
    <p>That is the commercial tension behind payment failover: moving eligible payments to an alternative processing connection when the usual one is unavailable. The idea is sensible. An outage should not have to stop every new sale. But the decision depends on what happened to each payment before the switch.</p>
    <p>For a merchant, the important question is not just “Can we use another provider?” It is “Which orders can safely use it, and who looks after the rest?”</p>

    <section id="different-orders-different-decisions" aria-labelledby="different-orders-different-decisions-title">
      <h2 id="different-orders-different-decisions-title">An outage does not put every order in the same position</h2>
      <p>Imagine checkout becomes unreliable during a busy afternoon. One customer has just arrived. Another clicked Pay and is waiting. A third received a card decline. They may all contact your support team, but sending all three through the same backup would ignore what you already know.</p>
      <ul>
        <li><strong>A payment not yet submitted</strong> may use an alternative connection that is approved, enabled and suitable for that transaction.</li>
        <li><strong>A submitted payment with no clear result</strong> needs investigation through the original provider’s documented recovery process. A missing response does not establish that no payment occurred.</li>
        <li><strong>A confirmed decline</strong> needs the response reason and applicable retry rules. A refusal is not, by itself, evidence of an outage.</li>
      </ul>
      <p>Cybersource warns that a timeout can occur after processing succeeds. Resubmitting immediately can create duplicate authorizations, captures or charges. A separate provider being available tells you nothing about the outcome of that original attempt.</p>
      <p>Declines need their own judgment. Cybersource’s authorization guidance distinguishes responses that permit a controlled retry from those that prohibit one. Changing the route should never be used to get around a restriction on the payment or the merchant account.</p>
      <p>Your customer should see language that reflects the known result. If the payment is being checked, say that and explain how they will receive an update. Do not turn uncertainty into an invitation to pay again.</p>
    </section>

    <section id="backup-needs-its-own-preparation" aria-labelledby="backup-needs-its-own-preparation-title">
      <h2 id="backup-needs-its-own-preparation-title">A backup needs more than a second login</h2>
      <p>The least convenient time to discover what your alternative connection cannot do is while customers are waiting. Before relying on it, confirm the merchant account, supported payment methods, currencies and any authentication requirements. Your checkout software must actually support the proposed switch.</p>
      <p>A saved payment method also needs attention. Do not assume a token or wallet credential held by one provider can be used by another. Confirm the permitted connection and any required transfer or fresh customer action before promising continuity.</p>
      <p>Even duplicate protection has boundaries. Developers often use an idempotency key, a reference that lets a provider recognize a repeated request. Adyen documents that its keys are checked within a company account, with separate limitations across regional endpoints. That is a specific protection within a provider’s system.</p>
      <p>It is not a universal “this customer has already paid” flag. Reusing your order number or a technical key with another provider does not establish that the two systems coordinate duplicate prevention. Your developer needs an explicit answer about how the whole checkout prevents overlapping attempts.</p>
      <p>This is also why a second merchant account should not be treated as a spare identity. Each account has approved business activity and terms. If your current account is restricted, discuss the situation openly with the provider. A backup plan does not replace account review.</p>
    </section>

    <section id="the-work-after-the-switch" aria-labelledby="the-work-after-the-switch-title">
      <h2 id="the-work-after-the-switch-title">The sale is only part of the recovery</h2>
      <p>Before an incident, decide who can change the payment route and who owns the orders needing attention. A small business may assign both jobs to one person. A platform may involve several teams. Either way, there should be a clear handoff between restoring new sales and resolving earlier attempts.</p>
      <p>For the person answering customers, a useful record starts with the order number and leads to the correct merchant account, payment reference and known status. They should not have to guess which connection was active when the customer clicked Pay.</p>
      <p>Plan the return to normal as carefully as the switch. Restarting the usual route should not cause it to submit an order that the alternative route has already handled. Restored service also does not close the investigation into an earlier uncertain payment.</p>
      <p>Afterward, look beyond the number of successful payments. How many orders still need an answer? Were any customers charged twice? Could staff find and explain each result? These questions reveal whether the recovery worked for the people who bought from you.</p>
      <p>Our article on <Link href="/company/blog/use-multiple-payment-gateways" prefetch={false}>managing multiple payment gateways</Link> covers the records that remain with each connection. Those records still matter after the outage disappears from a status page.</p>
    </section>

    <section id="a-plan-for-your-business" aria-labelledby="a-plan-for-your-business-title">
      <h2 id="a-plan-for-your-business-title">Build the plan around the business you actually run</h2>
      <p>Trolleys, an Etail Depot service, helps merchants prepare payment acceptance for their approved accounts. If continuity is a concern, bring us your current setup, the payment methods you need and the point where orders get stuck. That gives the discussion something more useful than a general request for a second gateway.</p>
      <p>A Trolleys merchant using a supported store plugin has different options from a business running a custom integration. Our <Link href="/developers/getting-started" prefetch={false}>Getting started information</Link> explains the account and connection details your team needs. Confirm what your software supports and who maintains it before treating any alternative as ready.</p>
      <p>If you are <Link href="/use-cases/switch-merchant-services" prefetch={false}>changing merchant services</Link>, a new account requires review, approval and setup. It does not automatically take over the old account’s transactions or provide automatic switching between providers.</p>
      <p><Link href="/company/contact" prefetch={false}>Talk with our team about your payment setup</Link>. The right continuity plan should fit your sales, your staff and your account terms. For some businesses, that may include another approved connection. For others, clearer recovery procedures and a dependable support handoff are the first improvement.</p>
    </section>

    <p>Keeping the next sale moving is valuable. Knowing what happened to the last one is how you keep the customer.</p>
  </BlogArticlePage>;
}
