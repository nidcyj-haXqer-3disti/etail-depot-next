import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentRetriesArticle } from "./payment-retries-content";

export function PaymentRetriesPage() {
  return <BlogArticlePage article={paymentRetriesArticle}>
    <p>Disabling the Pay button after a click is sensible. It does not stop a server from submitting the same purchase again when its first request takes too long.</p>
    <p>The customer may have clicked only once. Behind that click, a connection can close before the result comes back. If the website treats silence as a failed payment and starts over, the first request may still complete. One purchase can now have two payment attempts.</p>
    <p>That is a merchant service issue as much as an engineering issue. The customer wants to know which amount is owed, which payment counts and whether they need to act. A second authorization hold or charge gives your team a problem to explain and resolve.</p>
    <p>Etail’s <Link href="/developers/api-reference#uncertain-result" prefetch={false}>custom website integration guidance</Link> treats a timeout as an unresolved outcome. Keep the original attempt, trace it in the correct gateway account and establish its result before starting another charge. A screen that stops waiting cannot tell you that the payment stopped processing.</p>

    <section id="remember-the-payment-attempt" aria-labelledby="remember-the-payment-attempt-title">
      <h2 id="remember-the-payment-attempt-title">The payment attempt needs a memory</h2>
      <p>Idempotency is the technical name for making a repeated operation have the same intended effect as performing it once. For payment APIs that support it, an idempotency key identifies which operation a request is trying to complete. A permitted retry uses that original identity rather than presenting itself as a new instruction.</p>
      <p>The key matters because “try again” can mean two different things: recover the result of the purchase already submitted, or ask for another payment. Generating a fresh key on every attempt can tell the provider to do the second while your website believes it is doing the first.</p>
      <p>Your application therefore needs to preserve the attempt before sending it. Keep the order, store’s gateway account, environment, amount, currency and operation references together. If two background jobs resume the same work, they need to find that same record and coordinate their action. Two independently generated keys do not protect one purchase from duplication.</p>
      <p>An order number helps locate the sale, but it is not automatically an idempotency key. Nor does adding a header from an online code sample create protection in an endpoint that does not support it. Your developer needs the documented rules for the actual gateway operation, including account settings and processor support where relevant.</p>
      <p>For Trolleys’ Cybersource connection, confirm those rules for the operation being implemented. Do not assume every authorization, capture or refund has identical duplicate controls. These are separate financial actions, and each needs its own identity and recovery treatment within the order’s history.</p>
      <p>The protection can also have a time limit. Providers and API versions differ in how long they retain keys and how they handle concurrent requests or stored errors. Once the applicable protection expires, the same key text may no longer prevent another operation. The recovery plan needs a way to investigate the payment, not just a longer retry loop.</p>
    </section>

    <section id="a-changed-request-is-a-new-decision" aria-labelledby="a-changed-request-is-a-new-decision-title">
      <h2 id="a-changed-request-is-a-new-decision-title">A changed request is a new decision</h2>
      <p>Suppose a customer changes delivery options while a payment is unresolved. The total changes. Reusing the old key with a different amount can violate the provider’s parameter rules; generating a new key can leave the earlier payment running alongside its replacement. Neither shortcut establishes what happened to the original request.</p>
      <p>Resolve that attempt first. Then, if a different payment is needed, create it deliberately with the correct amount and the customer’s agreement. A replacement purchase is different from resending the same instruction because a response was lost.</p>
      <p>The same discipline applies to refunds. If a refund request times out, sending another one may return money twice. Etail’s <Link href="/services/refunds" prefetch={false}>refund guidance</Link> starts from the original payment and any existing returns. Confirm the permitted action, remaining amount and earlier request’s outcome before submitting more money back.</p>
      <p>A clear decline is another situation again. The gateway may return a reason and specific advice about whether another attempt is appropriate. Do not apply a generic timeout loop to a known decline, or turn an unknown result into a decline just to display a simpler message. Our article on <Link href="/company/blog/credit-card-declines" prefetch={false}>card declines</Link> covers that distinction.</p>
      <p>For an unresolved result, use a checking state that reflects what the application is actually doing. Give the customer an order reference and a way to recover the result or reach support. Avoid pushing them toward another card or a fresh checkout while the first payment remains unconfirmed.</p>
    </section>

    <p>Before launch, ask your web team to demonstrate a lost response, two simultaneous attempts to resume the same work, and a changed amount while the original request is unresolved. Inspect the gateway records as well as the screen. The useful result is controlled payment activity with a traceable outcome, not merely a spinner that disappears.</p>
    <p>Payment creation and order completion need separate protection. A retry response and a later notification may both confirm the same payment. They should update the existing attempt and lead to one intended order action. The companion article on <Link href="/company/blog/consuming-webhooks" prefetch={false}>paid orders that get stuck</Link> follows that next part of the connection.</p>
    <p>If a Trolleys merchant cannot establish the original outcome, our <Link href="/company/contact#account-support" prefetch={false}>account and integration support</Link> can help investigate the payment or connection. Provide the store, order and available transaction references, time zone and error details. Your developer remains responsible for the application’s retry behavior; our team helps with the account and payment investigation.</p>
    <p>A dependable checkout gives an uncertain payment somewhere to be resolved. It should not make the customer place the same purchase again simply because the first answer arrived late.</p>
  </BlogArticlePage>;
}
