import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { checkoutExpiryArticle } from "./checkout-expiry-content";

export function CheckoutExpiryPage() {
  return <BlogArticlePage article={checkoutExpiryArticle}>
    <p>A shopper pauses to confirm a delivery address. When they return, the checkout says the session has expired. The basket may still exist. The delivery choice may not. A payment may or may not have been submitted.</p>
    <p>The customer cannot see those distinctions. They see work disappearing and a button asking them to start again.</p>
    <p>“Session expired” is an explanation for the software team. The buyer wants to know whether the order still exists, whether the price still holds and whether any money moved. A recovery screen that ignores those questions can turn a short interruption into a support conversation.</p>

    <section id="different-deadlines" aria-labelledby="different-deadlines-title">
      <h2 id="different-deadlines-title">Name the thing that is expiring.</h2>
    <p>A stock reservation, a quoted price, a store login and a payment-session credential can have different lifetimes. Do not present them as one countdown unless they really end together. A basket remaining on screen does not prove the stock is reserved or the old price still applies.</p>
    <p>The distinction changes what the customer needs to do. If only a delivery slot has expired, asking the buyer to select every product again creates work unrelated to the problem. If a payment result is unresolved, a fresh form creates a much more serious ambiguity. “Start over” makes these situations look alike precisely when the next action should depend on what happened.</p>
    <p>Time limits also need an accessibility review. W3C’s Timing Adjustable criterion provides routes involving turning off, adjusting or extending content-imposed limits, with defined exceptions. A security purpose does not automatically exempt every timer. Some time-limited authentication tokens can be essential; the web team should determine which requirement applies rather than assuming all checkout timeouts are beyond review.</p>
    <p>Where a warning or extension is provided, it must be reachable and understandable. A brief visual toast while the customer is reading elsewhere does little to help. Neither should a merchant invent an extension that the underlying payment service cannot honor.</p>
    </section>

    <section id="before-payment" aria-labelledby="before-payment-title">
      <h2 id="before-payment-title">Preserve useful work within the actual security boundary.</h2>
    <p>Before payment has been submitted, a return path can recover permitted order information while establishing a fresh payment session. The exact behavior belongs to the platform and provider. Recovery must not depend on retaining prohibited payment data. Never retain card verification codes after authorization.</p>
    <p>A recovered screen also carries a promise. If it looks like the earlier order, a customer may reasonably think the earlier price and delivery arrangement still apply. Keeping the basket but silently changing its terms would preserve the customer’s typing while losing the decision they made. Changed tax, shipping, price or availability need to be shown and reconfirmed before payment.</p>
    <p>Keep privacy in view on shared devices. A persistent cart and a screen full of personal contact details are different decisions. Preserve only what the service can safely retain and show, under its actual privacy and security rules.</p>
    </section>

    <section id="after-submission" aria-labelledby="after-submission-title">
      <h2 id="after-submission-title">After submission, find the result before inviting another payment.</h2>
    <p>If payment may already have been submitted, an expired session cannot establish whether it succeeded. Resolve the original attempt through the provider’s supported process before offering another payment. Give the customer an order reference and a clear explanation of how to get the result. Our article on <Link href="/company/blog/payment-confirmation-pages" prefetch={false}>payment confirmation</Link> covers that recovery in more detail.</p>
    <p>A restart can make a broken screen usable without resolving the original payment. That is why the recovery decision has to follow the order’s actual state, rather than the age of the page. Restore permitted unfinished work, explain changed terms and resolve an uncertain payment before another attempt. The customer should not have to guess which kind of expiry the store means.</p>
    </section>
  </BlogArticlePage>;
}
