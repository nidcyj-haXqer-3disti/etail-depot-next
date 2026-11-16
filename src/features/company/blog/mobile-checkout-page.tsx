import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { mobileCheckoutArticle } from "./mobile-checkout-content";

export function MobileCheckoutPage() {
  return <BlogArticlePage article={mobileCheckoutArticle}>
    <p>A checkout can look tidy on a desktop and still be difficult to use on a phone. A keyboard may cover the next button, an address error may erase useful entries, or a customer may return from their banking app without knowing whether the order is paid.</p>
    <p>Follow the purchase through to its result before changing the page’s appearance. A shorter form helps only if customers can complete it and recover when something goes wrong.</p>
    <section id="walk-the-journey" aria-labelledby="walk-the-journey-title">
      <h2 id="walk-the-journey-title">Start with a phone</h2>
      <p>Use your payment provider’s approved test environment and documented test details. Begin at the product or invoice page, then continue through checkout and confirmation. Do not use live customer cards for these checks.</p>
      <p>Choose the phones and browsers your customers use, including a smaller or older device where possible. Test the actual website or app, not just a desktop window made narrow. Keep the device, browser, order reference and payment method with your notes.</p>
      <p>Try a first visit as well as a return visit. Check that the order, fields and payment action remain usable while the page loads. A screenshot taken after everything has finished loading can miss a button that moves just as someone tries to tap it.</p>
    </section>
    <section id="make-the-order-clear" aria-labelledby="make-the-order-clear-title">
      <h2 id="make-the-order-clear-title">Make the purchase clear</h2>
      <p>Before the customer commits, show what they are buying, the currency and the full amount, including applicable shipping and tax. Make delivery or service arrangements easy to find. If a selection changes the total, show the updated amount before payment.</p>
      <p>Let customers check and edit their order without losing valid entries. Where an account is not needed for the purchase, offer guest checkout. Keep newsletter signup and other optional requests separate from the information required to complete the order.</p>
      <p>Use a clear final button label that explains the commitment. The confirmation should identify the purchase, amount and reference, then explain what happens next. A bank verification screen is not the order confirmation.</p>
    </section>
    <section id="make-entry-clear" aria-labelledby="make-entry-clear-title">
      <h2 id="make-entry-clear-title">Make forms easier to use</h2>
      <p>Keep field labels visible while the customer types. A placeholder that disappears after entry should not be the only explanation. Ask for information the purchase needs, and explain any unusual requirement.</p>
      <p>Use suitable keyboards and address autofill where supported. With the keyboard open, check that the current field, error message and next action remain reachable. Make controls easy to distinguish and tap, and allow customers to enlarge text.</p>
      <p>When a field needs correcting, identify it and explain the next action. “Check the postal code for the selected country” is more useful than “Invalid input.” Keep unrelated valid entries where security and privacy requirements permit. An error should be explained in text rather than by a red border alone.</p>
      <p>For provider hosted payment fields, use the provider’s supported settings. Your web team can improve the surrounding order summary and navigation without replacing the secure card fields.</p>
    </section>
    <section id="check-payment-methods" aria-labelledby="check-payment-methods-title">
      <h2 id="check-payment-methods-title">Check wallets and bank verification</h2>
      <p>A wallet can reduce typing, but its availability depends on the merchant setup, device, browser and customer’s wallet. Test each method you actually offer, including the return to your store after approval or cancellation.</p>
      <p>Some card payments require the customer to verify with their bank. Check that returning from that step preserves the intended order and shows a clear result. Successful verification alone does not mean the payment was approved or collected.</p>
      <p>If you use Trolleys’ Cybersource connection, follow the <Link href="/developers/testing" prefetch={false}>checkout testing guidance</Link> for the enabled methods. For a platform store, use the relevant <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify</Link> or <Link href="/resources/woocommerce-gateway-integration" prefetch={false}>WooCommerce</Link> setup guide as well.</p>
    </section>
    <section id="test-sheet" aria-labelledby="test-sheet-title">
      <h2 id="test-sheet-title">Run five checkout tests</h2>
      <p>Run these in the approved test environment with your web team or payment provider. Check the order and provider records as well as the customer’s screen.</p>
      <ol>
        <li><strong>Correct an address error.</strong> Leave a required address field incomplete. Check that the message points to the right field and that unrelated valid entries remain where permitted.</li>
        <li><strong>Cancel verification.</strong> Follow the provider’s test scenario for canceling bank or wallet verification. Check where the customer returns, what the order status says and how they can continue.</li>
        <li><strong>Submit twice.</strong> Tap the payment button twice in a controlled test. Confirm that the same purchase does not create a duplicate charge or duplicate order fulfillment. A disabled button alone is not proof.</li>
        <li><strong>Lose the connection.</strong> Interrupt the connection after submitting. An unknown payment result must not be presented as a confirmed failure. Check how the original attempt is resolved before another charge is attempted.</li>
        <li><strong>Complete a payment.</strong> Use the documented successful test scenario. Match the confirmation to the order amount, currency, reference and provider result. Check the receipt or order follow-up too.</li>
      </ol>
      <p>Record the expected result, what happened and the exact customer message. Give each failure an owner, then rerun the affected test after the fix. These checks supplement the provider’s requirements and accessibility review.</p>
    </section>
    <section id="choose-changes" aria-labelledby="choose-changes-title">
      <h2 id="choose-changes-title">Fix blockers, then measure</h2>
      <p>Start with blocked purchases, duplicate submissions and unclear payment outcomes. Then reduce unnecessary typing and improve the layout. Keep payment security checks in place while making the customer’s next action easier to understand.</p>
      <p>Compare similar journeys before and after a change. Look at device, browser, traffic source and payment method. Separate people leaving checkout from issuer declines and unfinished bank verification. A change in the overall completion rate alone does not tell you which design choice caused it.</p>
      <p>Use checkout events that describe the step and result, without recording card details or sensitive form entries. Retest after changes to your theme, checkout plugin or payment configuration, even when the visible page looks the same.</p>
    </section>
  </BlogArticlePage>;
}
