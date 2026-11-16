import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { consumingWebhooksArticle } from "./consuming-webhooks-content";

export function ConsumingWebhooksPage() {
  return <BlogArticlePage article={consumingWebhooksArticle}>
    <p>When a customer says they have paid but your store still shows an unpaid order, asking them to try again can turn a missing update into a second charge. First establish what happened to the original payment.</p>
    <p>That gap matters to Trolleys merchants because accepting a payment is only useful when the business can connect it to the sale. The customer expects their order, booking or service to move forward. They should not have to investigate the connection between your checkout and your order system.</p>
    <p>A webhook helps carry a payment result from the gateway to your website, independently of the customer’s browser. For a custom site using Cybersource Unified Checkout’s payment processing flow, that notification can supply the result even when the customer closes the page before the browser receives it. Your integration still has to verify the message and update the correct order.</p>
    <p>Etail’s setup guidance follows that whole connection: the approved merchant account, the store’s gateway access, the checkout integration and the checks before launch. A successful payment test is a beginning. The order also needs a reliable way to recover when an update is delayed or interrupted.</p>

    <section id="find-the-original-payment" aria-labelledby="find-the-original-payment-title">
      <h2 id="find-the-original-payment-title">Find the payment before asking for it again</h2>
      <p>Start with the store. Your welcome details from the Etail Depot Merchant Implementation Team pair its name or DBA and Merchant ID with its gateway login. If your company operates several merchant accounts, that mapping prevents a search in the wrong account from looking like a missing payment.</p>
      <p>Next, trace the original payment reference in the correct gateway account. Check the amount, currency and actual result against the order. An authorization, capture and refund are different operations. An approval alone does not show that collection is complete; our article on <Link href="/company/blog/payment-capture" prefetch={false}>when to capture a card payment</Link> explains that distinction.</p>
      <p>Your store’s order record tells you whether its application acted on the result. The Back Office Operations Portal provides a separate view of merchant account activity. Trolleys’ <Link href="/services/reconciliation" prefetch={false}>payment reconciliation service</Link> helps you compare merchant account and gateway reports and investigate unmatched records. Those reports support the investigation; they do not establish that your website released an order or that a warehouse shipped it.</p>
      <p>This is why “the webhook succeeded” is an incomplete answer to a merchant’s question. A successful delivery response can mean that your server accepted the message. It does not prove that the later order update finished.</p>
      <p>The receiving system needs to preserve verified work before acknowledging it, then continue processing from that saved record. Otherwise, a restart can lose the work after the gateway believes delivery succeeded. Your developer should be able to show what happens if the application stops immediately after accepting a notification.</p>
      <p>Keep the customer informed using the outcome you have established. If the payment is confirmed and the order update failed, resolve the order. If the payment result is still uncertain, investigate that attempt before requesting another payment. A missing confirmation page is not proof of a failed charge.</p>
    </section>

    <section id="a-retry-must-not-repeat-the-sale" aria-labelledby="a-retry-must-not-repeat-the-sale-title">
      <h2 id="a-retry-must-not-repeat-the-sale-title">A retry must not repeat the sale</h2>
      <p>A reliable connection must tolerate repeated notifications and handle late updates according to the provider’s rules. It also needs to coordinate the browser result with the webhook. Both can concern the same payment, but they must not independently release the same order.</p>
      <p>Keep two questions separate: have we received this notification before, and have we already completed this action for the order? Recognizing a repeated message helps with the first. Preventing another shipment, receipt or access grant requires the second.</p>
      <p>Consider an interruption after the website requests fulfillment but before it records the answer. Repeating the request blindly might release the order again. Skipping it blindly might leave the order waiting. Recovery needs the fulfillment system’s actual result, or its supported way to repeat the same operation safely. A local “processed” flag cannot settle an unknown outcome in another system.</p>
      <p>Developers call an operation idempotent when repeating it does not repeat its effect. For the merchant, the useful demonstration is one intended order action despite repeated or interrupted delivery. Two notifications arriving together should not both pass a “not done yet” check.</p>
      <p>Security belongs in that demonstration too. An unverified message must not release an order. Follow the gateway’s signature and encryption requirements, confirm the expected account and environment, and keep secrets out of ordinary logs. A valid signature does not by itself prevent the same genuine message from being processed twice.</p>
      <p>Cybersource’s delivery retries follow the webhook subscription’s configuration. Check that policy rather than assuming unlimited redelivery. Once a notification has been accepted, an unfinished internal job still needs a recovery process. Late or conflicting updates should be checked against the authoritative payment record before changing the order.</p>
    </section>

    <p>For merchants using Trolleys, an Etail Depot service, the next step depends on where the connection stopped. Our team can help investigate unmatched payment records and questions about your store’s connection. Your web team checks how its application received the result and handled the order. Give both teams the same store, payment reference, order reference and time of the issue so they can follow the same transaction.</p>
    <p>Our <Link href="/developers/webhooks" prefetch={false}>Cybersource webhook guidance</Link> covers the custom website setup and recovery checks. For an existing account or a connection that needs investigation, use <Link href="/company/contact#account-support" prefetch={false}>Trolleys account and integration support</Link>. Include the relevant reference, not passwords, private keys or card details.</p>
    <p>The value of a payment service continues after the checkout screen. A merchant needs to locate a payment, understand its status and get help when the records do not agree. The customer should not have to become the alert that tells your business a paid order was missed.</p>
  </BlogArticlePage>;
}
