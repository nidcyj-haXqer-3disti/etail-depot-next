import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardDeclinesArticle } from "./card-declines-content";
import s from "./blog.module.css";

export function CardDeclinesPage() {
  return <BlogArticlePage article={cardDeclinesArticle}>
    <p>A customer says their card did not work. Before asking them to try again, find out whether the payment was declined, blocked by a security check or left with an unknown result. The same short checkout message can hide very different situations.</p>
    <section id="identify-result" aria-labelledby="identify-result-title">
      <h2 id="identify-result-title">Confirm which result you have</h2>
      <p>Read the payment record and the provider’s explanation, not just the browser message. An issuer decline, a provider’s fraud block, incorrect request data and a lost connection need different responses. Codes are not universal: use the documentation for your processor and integration.</p>
      <p>Some gateway checks can reject a transaction after the issuer has authorized it. Confirm whether an authorization exists and follow any required reversal steps before requesting another payment.</p>
      <p>Keep the order reference, amount, currency, attempt time and gateway reference together. With Trolleys, an Etail Depot service, check the relevant store’s transaction in the Cybersource Business Center. Confirm that you are looking at the right account and payment attempt.</p>
      <p>A timeout is not a confirmed decline. The issuer may have approved the payment even though checkout did not receive the response. An empty search result is not conclusive either, because records can take time to appear. Resolve the original attempt through the provider’s status checks or support before collecting again.</p>
      <p>For the difference between approval, capture and payout, see <Link href="/company/blog/payment-processing-systems" prefetch={false}>how credit card processing works</Link>.</p>
    </section>
    <section id="choose-response" aria-labelledby="choose-response-title">
      <h2 id="choose-response-title">Match the response to the problem</h2>
      <dl className={s.diagnosticList}>
        <div><dt>Incorrect details</dt><dd>Let the customer correct the relevant field through secure checkout. Ask them to check the information rather than send you their card number or security code.</dd></div>
        <div><dt>Authentication needed</dt><dd>Use the supported bank verification flow, such as 3D Secure. Completing authentication does not itself mean the payment was approved; check the payment result afterward.</dd></div>
        <div><dt>Issuer refusal</dt><dd>Follow the response guidance. The customer may need to contact the bank that issued the card or use another supported payment method once the original attempt is confirmed unsuccessful.</dd></div>
        <div><dt>Possible duplicate</dt><dd>Find the recent attempt and its current result before collecting again. A duplicate warning is a reason to investigate the earlier payment.</dd></div>
        <div><dt>Security restriction</dt><dd>Follow the provider’s instructions and use the review process where available. Do not bypass a block or reveal sensitive fraud checks to the customer.</dd></div>
      </dl>
      <p>For example, Stripe’s <code>duplicate_transaction</code> response directs a merchant to check for a recent payment. An incorrect expiry response calls for corrected details. These are provider-specific examples, not codes to apply to every gateway.</p>
    </section>
    <section id="retry-carefully" aria-labelledby="retry-carefully-title">
      <h2 id="retry-carefully-title">Know when to stop retrying</h2>
      <p>Follow the processor’s current retry advice and applicable network restrictions. A response that says not to retry must not be put into an automatic retry loop. Where the response permits a later attempt, follow its conditions rather than applying one waiting period to every failure.</p>
      <p>Terms such as “soft decline” and “hard decline” can be useful shorthand, but the actual response and advice determine the next action. If the instruction is missing or unclear, ask the provider rather than treating the absence of advice as permission to retry.</p>
      <p>If a confirmed incorrect expiry response is followed by a corrected, approved payment, record the successful attempt against the order. If checkout instead closes without a result, resolve that attempt before starting another. These situations may look alike to the customer, but they need different recovery steps.</p>
      <p>If two attempts appear, establish the status of each. A rejected duplicate does not necessarily mean two payments were collected. If a duplicate authorization or collected payment is confirmed, follow the provider’s appropriate reversal, void or <Link href="/services/refunds" prefetch={false}>refund process</Link>. Do not refund a payment simply because the browser displayed an error.</p>
    </section>
    <section id="customer-message" aria-labelledby="customer-message-title">
      <h2 id="customer-message-title">Give the customer a clear next step</h2>
      <p>Keep the message specific to what you know. For a confirmed input error, identify the field to check. For an issuer decline, explain that the payment was not approved and follow the provider’s advice about contacting the issuer or using another method. Do not guess that the customer lacks funds.</p>
      <p>When the result is still unknown, explain that you are checking the payment and ask the customer to wait before submitting again. Do not promise that nothing was charged until the record supports that statement.</p>
      <p>Give support the order reference and gateway reference so the customer does not have to describe the whole journey again. Keep full card numbers, security codes, passwords and bank verification codes out of email and support messages.</p>
    </section>
    <section id="review-patterns" aria-labelledby="review-patterns-title">
      <h2 id="review-patterns-title">Improve the part you can control</h2>
      <p>Review failures by response, checkout version and customer journey. If customers repeatedly mistype one field, improve its label and validation. If bank verification is often abandoned, inspect the handoff and return path. Check mobile keyboards, error placement and whether entered information survives a correctable error.</p>
      <p>Track orders as well as attempts. Several retries from one customer should not look like several different customers lost. Keep confirmed declines, fraud blocks, customer cancellations and unresolved outcomes separate in your reporting.</p>
      <p>Use the provider’s sandbox to test a decline, correction, canceled verification, lost response and repeated submission. Verify that an unpaid order stays unpaid and that one successful payment cannot trigger repeated fulfillment. The <Link href="/developers/testing" prefetch={false}>checkout testing guide</Link> covers these recovery checks.</p>
      <p>For the page experience, follow the <Link href="/company/blog/optimize-your-mobile-checkout-experience" prefetch={false}>mobile checkout checklist</Link>. Fix repeatable problems and measure the result while keeping the account’s fraud protections in place.</p>
    </section>
  </BlogArticlePage>;
}
