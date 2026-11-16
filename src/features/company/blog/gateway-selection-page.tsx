import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { gatewaySelectionArticle } from "./gateway-selection-content";

export function GatewaySelectionPage() {
  return <BlogArticlePage article={gatewaySelectionArticle}>
    <p>The presenter opens checkout on a phone. A familiar payment button appears. A few taps later, the order is approved. The demonstration moves on to a map of supported countries.</p>
    <p>That shows you a sale going well. It says much less about the afternoon when a customer calls to ask whether you took their money, while your store still shows an unpaid order.</p>
    <p>Choosing an international payment gateway means buying a way to handle those afternoons too. Before the demonstration ends, ask the team to show a controlled test where something does not go to plan. The useful question is simple:</p>
    <blockquote><p>When the customer cannot tell whether they paid, how will my team find out?</p></blockquote>

    <section id="coverage-for-your-checkout" aria-labelledby="coverage-for-your-checkout-title">
      <h2 id="coverage-for-your-checkout-title">Coverage has to reach your actual checkout</h2>
      <p>A payment gateway connects your checkout with payment processing. Its country list is a starting point for a conversation, not an approval letter for your business.</p>
      <p>Take one sale you intend to make. Name the business accepting it, where the customer is, the currency you will charge and the payment method they should see. If it is a subscription, say so. Ask the provider to confirm that combination for your account and your website connection.</p>
      <p>Stripe’s support documentation, for example, separates business location, customer country, currency and integration support. A method can have limits that disappear in a broad coverage claim. That is a useful distinction to bring to any provider discussion; it does not make one provider’s eligibility rules apply to another.</p>
      <p>Then follow the sale into your own records. Which merchant account receives it? Which currency will the payout use? Who supplies the processing terms? Get those answers alongside the gateway proposal. A checkout that can display a currency has not necessarily established how your business will receive the proceeds.</p>
    </section>

    <section id="uncertain-payment-demo" aria-labelledby="uncertain-payment-demo-title">
      <h2 id="uncertain-payment-demo-title">Follow the order when the screen stops helping</h2>
      <p>Ask for a documented declined-payment test first. Your store should keep the order unpaid and give the customer an understandable response. Entering invalid form data is not the same demonstration as a payment the issuer declines.</p>
      <p>Next, ask the integration team to simulate a lost response in its test environment. This is a different situation: the website did not receive a clear answer, but that alone does not tell you whether the payment went through.</p>
      <p>Cybersource’s timeout guidance warns that treating an uncertain result as a failure and immediately submitting the payment again can create duplicate authorizations or charges. Ask the team to locate the original operation, establish its status and show how it decides what can happen next. The exact recovery procedure depends on the connection and processor.</p>
      <p>Watch the customer-facing part as closely as the technical explanation. Does the order appear unpaid, paid or awaiting confirmation? Can the customer accidentally start another attempt? Who follows up if the result remains unresolved? “Refresh and try again” is not an adequate handover when the first attempt may have succeeded.</p>
      <p>Where cardholder authentication is enabled, ask what happens if the customer abandons that screen. For methods you plan to offer, request a refund demonstration too. Find the original payment and the refund’s own record. A button changing to “refunded” should lead to an explanation of the operation’s status, not a promise that the customer’s bank has already posted the money.</p>
      <p>Keep these demonstrations in the appropriate test environment. Cybersource’s sandbox simulates processing without sending payments to financial institutions and uses separate credentials. It cannot prove a real bank deposit or card refund. Agree any live checks separately, including who authorizes them.</p>
    </section>

    <section id="gateway-handover" aria-labelledby="gateway-handover-title">
      <h2 id="gateway-handover-title">Buy the handover, not just the connection</h2>
      <p>A developer may finish the integration and leave the project. Your customer service team still has to answer the next payment question. Before choosing the gateway, ask that future operator to join the demonstration.</p>
      <p>Give them an order reference and ask them to find the payment without the presenter driving the mouse. Can they identify the right store, amount, currency and status? Can they find a related refund? Can they explain what remains unknown without guessing?</p>
      <p>That exercise is also a fair test of the service around the software. Ask who owns a missing-result investigation, how your team submits the relevant references securely and what support hours and response commitments are actually agreed. Do not assume the company selling the gateway also owns every processing, funding or website issue.</p>
      <p>For Trolleys, an Etail Depot service, the <Link href="/developers/getting-started" prefetch={false}>merchant setup</Link> makes the account roles explicit. The Back Office Operations Portal covers merchant operations. The separate gateway account provides payment records and connection settings for the store. Our <Link href="/developers/testing#acceptance-tests" prefetch={false}>checkout testing guidance</Link> covers declines, interrupted flows and recovery, so your web team has more to validate than a successful screen.</p>
      <p>A Trolleys merchant can use <Link href="/services/reconciliation" prefetch={false}>merchant account and gateway reports</Link> to investigate mismatched records, and bring unresolved account questions to <Link href="/company/contact#account-support" prefetch={false}>our support team</Link>. Confirm the <Link href="/company/legal/merchant-services#approval" prefetch={false}>approved methods, currencies and territories</Link> for the business before treating any international feature as available.</p>
      <p>Finally, compare written costs for that actual setup: the connection, processing, international activity, currency conversion and any applicable recurring or exception charges. Ask which fees can apply even when a sale is declined, canceled or refunded. A single headline rate cannot answer all of those questions.</p>
      <p>The best demonstration leaves your team able to explain a payment after the presenter has gone. Choose the connection you can operate with confidence, including on the day the checkout does not behave as expected.</p>
    </section>
  </BlogArticlePage>;
}
