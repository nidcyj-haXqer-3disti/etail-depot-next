import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentCaptureArticle } from "./payment-capture-content";
import s from "./blog.module.css";

const orderChecks = [
  ["The entire order is ready", "Confirm the final total and the capture trigger agreed for your account.", "Record the capture result against the order."],
  ["An item is cancelled", "Check whether a lower capture amount is supported and what happens to the unused authorization.", "Keep the final order total and payment record consistent."],
  ["Items will ship separately", "Confirm whether multiple captures are enabled or a later shipment needs a new authorization.", "Track each shipment and payment operation separately."],
  ["The whole order is cancelled", "Check whether it is still authorized, already captured or settled before choosing an action.", "Use the eligible cancellation, void or refund process for its current state."],
] as const;

export function PaymentCapturePage() {
  return <BlogArticlePage article={paymentCaptureArticle}>
    <p>A customer places an order, but an item is unavailable or will ship later. Whether you have already captured the payment changes what happens next. Set that policy before the exception arrives.</p>
    <section id="capture-and-approval" aria-labelledby="capture-and-approval-title">
      <h2 id="capture-and-approval-title">Understand what capture changes</h2>
      <p>Authorization approves a payment and can reserve funds. Capture submits the authorized amount for further processing. Your checkout may request both together, or your setup may support capturing later. An approval alone does not tell you which policy was used.</p>
      <p>Cybersource links a capture to the original authorization using its request ID. Keep that relationship alongside your order reference so staff can distinguish the approval from the operation that follows it.</p>
      <p>Capture is also separate from money arriving in your bank account. Processing, settlement and payout have their own records and timing. Adyen, for example, distinguishes funds received by Adyen from funds paid out to the merchant. Our <Link href="/company/blog/payment-settlement-and-payouts" prefetch={false}>settlement and payouts article</Link> explains that distinction.</p>
    </section>
    <section id="choose-capture-timing" aria-labelledby="choose-capture-timing-title">
      <h2 id="choose-capture-timing-title">Match capture timing to fulfillment</h2>
      <p>Confirm the options available for your processor, payment method and account. Adyen describes immediate automatic capture, delayed automatic capture and manual capture. These are provider options, not a promise that every store or Trolleys connection supports all three.</p>
      <p>Automatic capture follows the configured payment flow. Delayed automatic capture follows a timer. Manual capture requires a separate action by your staff or integration. A timer does not know whether an order is ready, so delayed capture still needs a cancellation and exception process.</p>
      <p>Agree with your provider when capture is appropriate for your goods or services. Then write one operational rule: what event triggers capture, who owns it and what prevents it when the order changes.</p>
      <p>A separate authorization has a deadline. Stripe exposes a capture deadline for card payments and documents that expired holds cannot simply be captured as before. Do not assume every authorization lasts the same number of days. Check the actual payment and arrange the provider’s supported next step if fulfillment will take longer. See <Link href="/company/blog/card-authorization" prefetch={false}>what card approval does and does not mean</Link>.</p>
    </section>
    <section id="handle-partial-orders" aria-labelledby="handle-partial-orders-title">
      <h2 id="handle-partial-orders-title">Decide what happens to partial orders</h2>
      <p>A lower final total and several shipments are different situations. Capturing less once does not necessarily leave the rest available for later. Stripe documents one capture for most payments, with multiple captures limited to eligible card payments.</p>
      <table className={s.comparison}>
        <caption>Questions to settle before an order changes</caption>
        <thead><tr><th scope="col">Order situation</th><th scope="col">Check first</th><th scope="col">Keep track of</th></tr></thead>
        <tbody>{orderChecks.map(([situation, check, record]) => <tr key={situation}>
          <th scope="row">{situation}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Check first</span>{check}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Keep track of</span>{record}</td>
        </tr>)}</tbody>
      </table>
      <p>The Cybersource capture guidance for Global Payments tells merchants fulfilling part of an order to capture the delivered items and obtain a new authorization for the remainder when delivered. Other supported configurations can differ. Ask which process applies to your account before designing a split shipment workflow.</p>
      <p>An unused authorization amount is not a refund of captured money. If an order is cancelled, identify its current payment state first. Our <Link href="/services/refunds" prefetch={false}>refunds page</Link> distinguishes releasing an authorization, an eligible void and returning a captured payment.</p>
    </section>
    <section id="confirm-capture-result" aria-labelledby="confirm-capture-result-title">
      <h2 id="confirm-capture-result-title">Confirm the result before trying again</h2>
      <p>A timeout means your system did not receive a usable response. It does not prove that capture failed. Cybersource distinguishes a request that never arrived from one that succeeded but lost its confirmation. Those cases require different recovery actions.</p>
      <p>Look up the original operation using its reference. Confirm the merchant account, amount, currency and current status. If the result is still unresolved, follow the provider’s reporting and reconciliation process before resubmitting. A confirmed capture needs recording, not a second attempt.</p>
      <p>Check earlier captures and unresolved requests before deciding what remains available. Give one person or system responsibility for recovery so two people do not act on the same uncertainty. If the provider confirms a failure, address its cause before following the documented retry procedure.</p>
      <p>Read each status in its provider context. Adyen explains that a successful capture notification can still be followed by a later capture failure. A request accepted for processing is not proof of bank receipt. Your developer can use our <Link href="/developers/testing" prefetch={false}>payment testing guidance</Link> to include lost responses and duplicate prevention in the test plan.</p>
    </section>
    <section id="review-capture-exceptions" aria-labelledby="review-capture-exceptions-title">
      <h2 id="review-capture-exceptions-title">Give unfinished payments an owner</h2>
      <p>Keep a short exception list that joins order progress to payment progress. Review it before capture deadlines, not only when a customer or your finance team notices a problem:</p>
      <ol>
        <li><strong>Ready orders without confirmed capture.</strong> Check the trigger, payment status and remaining authorization window before taking action.</li>
        <li><strong>Captured orders that cannot be fulfilled.</strong> Confirm what changed and arrange the appropriate customer communication and payment correction.</li>
        <li><strong>Partially fulfilled orders.</strong> Identify what has shipped, what has been captured and how the remaining items will be paid for.</li>
        <li><strong>Uncertain or failed captures.</strong> Assign an owner, record the last verified status and follow the provider’s recovery process.</li>
      </ol>
      <p>Cybersource recommends reconciling capture requests with processor capture reports. For a Trolleys account, the <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> explains how merchant account and gateway records fit together. Keep that comparison separate from checking a deposit in your bank.</p>
      <p>A useful capture policy tells your team when to act, when to wait and how to resolve the exceptions. It should fit the orders you actually fulfill, rather than relying on a checkout setting alone.</p>
    </section>
  </BlogArticlePage>;
}
