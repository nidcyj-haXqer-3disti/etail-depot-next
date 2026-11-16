import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardAuthorizationArticle } from "./card-authorization-content";

export function CardAuthorizationPage() {
  return <BlogArticlePage article={cardAuthorizationArticle}>
    <p>A customer places an order, your checkout reports approval and the customer’s banking app shows a pending payment. These records describe different parts of the same purchase. Understanding them helps your team avoid missed captures, unnecessary refunds and requests for the customer to pay twice.</p>
    <section id="decision" aria-labelledby="decision-title">
      <h2 id="decision-title">Where the approval comes from</h2>
      <p>The authorization request travels through your gateway and processing arrangement, then through the card network, usually to the <strong>issuer</strong>, the financial institution that provides the customer’s card. The issuer returns an approval or decline. Networks can also respond on an issuer’s behalf when it is unavailable.</p>
      <p>Your gateway or payment provider can apply additional checks. An issuer approval does not override a gateway rejection or a transaction waiting for review. Read the overall payment result and any required action, rather than relying on an approval code alone.</p>
      <p>Authorization is also separate from <strong>authentication</strong>. A completed 3D Secure check helps verify the person making the payment; it does not replace the authorization decision for that purchase. Likewise, a customer’s signed permission to charge a card is not approval from the card payment system.</p>
    </section>
    <section id="pending" aria-labelledby="pending-title">
      <h2 id="pending-title">Why a payment looks pending</h2>
      <p>An authorization can reduce the customer’s available credit or balance while the amount is reserved. Their bank may display it as pending. That display alone does not prove that your business has collected the payment.</p>
      <p><strong>Capture</strong> submits the approved payment for collection. Your checkout may request authorization and capture together, or your team may capture later under the supported arrangement. Confirm which applies to your store.</p>
      <p>Settlement and payout follow their own processing steps. Even a settled payment does not necessarily mean a payout has reached your business bank account. The <Link href="/company/blog/payment-processing-systems" prefetch={false}>payment processing overview</Link> explains how these stages fit together.</p>
    </section>
    <section id="expiry" aria-labelledby="expiry-title">
      <h2 id="expiry-title">When an approval expires</h2>
      <p>An authorization is time limited. Its validity depends on the card network, transaction type and processing arrangement. Use the deadline provided for the payment, or confirm the applicable capture window with your provider. Do not apply one fixed number of days to every order.</p>
      <p>A gateway may keep the original authorization record after the issuer’s hold expires. Finding an approval code in an old record does not make it a current approval.</p>
      <p>If an order is delayed beyond its capture window, resolve the payment plan before fulfillment. Confirm whether an adjustment, extension or new authorization is supported and whether the customer needs to act. Keep any new attempt linked to the order and resolve the earlier one so your team does not mistake two approvals for two purchases.</p>
      <p>For a declined or uncertain attempt, follow the provider’s response guidance. A timeout is not a confirmed decline. Check the existing attempt before requesting another payment, as explained in the <Link href="/company/blog/credit-card-declines" prefetch={false}>card decline and retry guide</Link>.</p>
    </section>
    <section id="cancellation" aria-labelledby="cancellation-title">
      <h2 id="cancellation-title">If the order is canceled</h2>
      <p>Suppose a customer cancels while the order is still being prepared. First check whether the payment is only authorized, already captured or settled. That status determines which action is available.</p>
      <p>For an uncaptured authorization, use the supported cancellation or authorization reversal process. A reversal asks for the reserved amount to be released. Check its result and keep the reference. A canceled order in your store does not, by itself, establish that the payment authorization was reversed.</p>
      <p>The pending entry may remain visible while the customer’s bank updates its records. Explain what your provider has confirmed without promising an exact release time. Do not issue a refund solely to remove a pending hold when no payment was captured.</p>
      <p>If capture has already happened, a supported void or refund may be needed instead. Trolleys’ <Link href="/services/refunds" prefetch={false}>refunds and reversals page</Link> explains why the action depends on payment status and account support.</p>
    </section>
    <section id="before-fulfillment" aria-labelledby="before-fulfillment-title">
      <h2 id="before-fulfillment-title">What to check before fulfillment</h2>
      <p>Read the current payment record alongside the order. Your team should be able to answer these questions:</p>
      <ul>
        <li><strong>Correct payment:</strong> Do the merchant account, order and provider reference identify the same attempt?</li>
        <li><strong>Available amount:</strong> Are the currency, authorized amount and amount still available to capture correct?</li>
        <li><strong>Current status:</strong> Has there been a capture, cancellation, reversal, review or other change since the original approval?</li>
        <li><strong>Next action:</strong> Is capture automatic or manual, what deadline applies and who is responsible?</li>
      </ul>
      <p>With Trolleys, an Etail Depot service, review gateway transactions in Cybersource Business Center and merchant activity in the Back Office Operations Portal. Match the correct store or merchant account when <Link href="/services/reconciliation" prefetch={false}>reconciling the records</Link>.</p>
      <p>Follow the capture and fulfillment rules agreed for your business. Authorization does not remove later <Link href="/services/disputes" prefetch={false}>dispute risk</Link>, and an approval code cannot confirm a bank deposit. For money reaching your bank, follow the separate <Link href="/services/payouts" prefetch={false}>payout record</Link>.</p>
    </section>
  </BlogArticlePage>;
}
