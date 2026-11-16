import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { threeDSecureArticle } from "./three-d-secure-content";

export function ThreeDSecurePage() {
  return <BlogArticlePage article={threeDSecureArticle}>
    <p>A customer can approve a purchase in their banking app and still return to an unpaid order. From the buyer’s perspective, they have done what the bank asked. From the store’s perspective, the payment may not have been approved yet.</p>
    <p>That gap is an important part of 3D Secure. It is easy to focus on the security screen and overlook what comes after it: the payment result, the order update and the answer your customer sees.</p>
    <p>For a merchant, a successful setup needs to make sense to the person buying, the staff fulfilling the order and the team reviewing a payment later.</p>

    <section id="security-without-an-extra-screen" aria-labelledby="security-without-an-extra-screen-title">
      <h2 id="security-without-an-extra-screen-title">The security step you may never see</h2>
      <p>EMV 3D Secure, often shortened to 3DS, helps a card issuer assess whether the person making an online purchase is the legitimate cardholder. The issuer is the institution that issued the buyer’s card. The technology exchanges information about the transaction, payment method and device between the merchant side and the issuer.</p>
      <p>The issuer can complete authentication without asking the customer to do anything extra. This is called a frictionless flow. In a challenge flow, the buyer must take another step, such as entering a one time code or approving the request in a banking app. The method depends on the issuer and the supported setup.</p>
      <p>So two customers using the same checkout may have different experiences. One continues without an additional screen. Another has to authenticate through their bank. An extra prompt does not, by itself, mean your checkout is broken, and the absence of a prompt does not prove that authentication was skipped.</p>
      <p>EMVCo describes both risk assessment and regional authentication requirements as factors in the process. The practical question is which behavior applies to your account, customers and integration. Ask before choosing settings simply because they appear to remove a step.</p>
      <p>For the buyer, the transition should feel understandable. Explain that their bank may ask them to verify the purchase. Let the bank’s approved authentication flow handle that verification; your staff should never ask the customer to send a banking password or security code to support.</p>
    </section>

    <section id="authentication-is-not-payment-approval" aria-labelledby="authentication-is-not-payment-approval-title">
      <h2 id="authentication-is-not-payment-approval-title">Approved by the buyer, still unpaid</h2>
      <p>Authentication checks the cardholder. Authorization is the issuer’s decision on the payment request. A successful authentication can be followed by a declined payment. If your setup captures payments separately, capture is another operation to track.</p>
      <p>Cybersource’s payer authentication workflow makes the handoff explicit: after the appropriate authentication result, the integration proceeds to authorization and passes the required authentication data. Closing a challenge window is not a substitute for obtaining the result and completing the payment flow.</p>
      <p>This distinction changes what your store should say. A buyer who has just verified with their bank should not receive a paid receipt unless the order has reached the verified payment state that supports it. A warehouse should not release goods because a browser screen disappeared.</p>
      <p>Consider the less tidy journey. The buyer leaves the browser for a banking app, completes the check and returns to a page that is still waiting. They may refresh or press Pay again. Customer service now needs to establish whether authentication finished, whether a payment was attempted and what result came back.</p>
      <p>The software must resolve the original attempt before inviting another charge when its outcome is unknown. If the payment is confirmed declined, the buyer needs an appropriate way to continue. If it is already approved, they need the order updated. Repeating the security check indiscriminately does not answer either question.</p>
      <p>Before launch, ask your developer or plugin provider to demonstrate more than the easy purchase. See the return from a banking app, a canceled challenge and a successful authentication followed by a declined payment, using the provider’s supported test cases. Check the customer message and the order record together.</p>
      <p>Our <Link href="/developers/testing" prefetch={false}>checkout testing guidance</Link> keeps authentication and payment approval separate. This is a business check as much as a technical one: a member of your team should be able to explain to the customer whether they paid and what happens next.</p>
    </section>

    <section id="understand-the-protection" aria-labelledby="understand-the-protection-title">
      <h2 id="understand-the-protection-title">Protection still depends on the payment</h2>
      <p>One reason merchants consider 3D Secure is liability shift. For eligible transactions and certain fraud disputes, responsibility can move from the merchant to the issuer. But successful authentication is not a guarantee of that protection for every payment or claim.</p>
      <p>The network rules, authentication result and circumstances of the transaction matter. Your integration must also carry the required information into the payment correctly. A setting labeled “3D Secure enabled” is not enough to establish how a particular transaction will be treated.</p>
      <p>Nor does authenticating a cardholder prove that an order was delivered or a promised refund was processed. Those questions still depend on the sale and its records. If a dispute arrives, read its reason and response instructions rather than dismissing it because the buyer completed a bank check.</p>
      <p>For a Trolleys merchant, the useful conversation starts with the actual store and connection. Trolleys, an Etail Depot service, helps merchants prepare their approved account and payment setup. Confirm which authentication options are enabled for your account, how your website or plugin handles them and who investigates an interrupted checkout.</p>
      <p>Bring the order reference, gateway payment reference where available, time and observed behavior to our <Link href="/company/contact#integration" prefetch={false}>account and integration team</Link>. Your developer can then distinguish a presentation problem from an authentication or payment result. Keep private credentials, card information and customer security codes out of the support request.</p>
      <p>Review the customer journey again when the plugin, integration or relevant settings change. The protection you intended and the experience the customer receives both depend on the connection continuing to work.</p>
    </section>

    <p>The bank check earns its place when it helps protect the purchase without leaving the buyer or your team guessing about the order. Finishing that journey is part of accepting the payment.</p>
  </BlogArticlePage>;
}
