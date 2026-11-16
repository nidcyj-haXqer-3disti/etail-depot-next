import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { gatewayTestingArticle } from "./gateway-testing-content";

export function GatewayTestingPage() {
  return <BlogArticlePage article={gatewayTestingArticle}>
    <p>When your developer shows you a successful test payment, it is tempting to call the checkout finished. The card was accepted. The confirmation appeared. The order is in the store.</p>
    <p>That demonstration answers an important question: can this particular purchase get through? It leaves several others open. What will a declined customer see? Could a second click create another charge? Can your team find and refund the original payment without asking the developer to investigate?</p>
    <p>Payment gateway testing becomes useful to a merchant when it answers those operating questions. A report full of successful requests can still leave the business unprepared for its first uncertain payment.</p>
    <p>For a merchant using <Link href="/services/merchant-services" prefetch={false}>Trolleys, an Etail Depot service</Link>, the account, checkout and support arrangements need to agree. The gateway result must belong to the correct store. The order must reflect what happened. The people taking customer calls must know where to look. That is the standard worth discussing before a launch date is agreed.</p>

    <section id="what-approved-means" aria-labelledby="what-approved-means-title">
      <h2 id="what-approved-means-title">Agree what “approved” is supposed to mean</h2>
      <p>A merchant may hear “the payment worked” and assume that money is on its way. The developer may mean that an authorization succeeded. The store may simply have received a response it recognizes.</p>
      <p>These are different observations. An authorization approves the payment request; capture submits the authorized amount for collection. Cybersource Unified Checkout supports authorization followed by a later capture, as well as a combined authorization and capture. Your test needs to match the arrangement your business will actually use.</p>
      <p>If you capture when goods ship, show what starts that capture and how the team finds an order still awaiting it. If your checkout captures immediately, verify the matching operation and the order update. Neither arrangement should be declared ready from a success message alone.</p>
      <p>Before the test, describe the expected result in business terms. Which store receives the transaction? What amount and currency should appear? Should the order be ready for fulfillment, awaiting capture or still unpaid? Then compare the customer’s screen with the order and gateway records. A mismatch is something to explain and resolve, even when the screen looks reassuring.</p>
      <p>Etail’s <Link href="/developers/testing" prefetch={false}>payment integration testing guidance</Link> gives your developer the detailed cases. As the merchant, you should be able to read the result without having to interpret application logs.</p>
    </section>

    <section id="the-failure-that-looks-successful" aria-labelledby="the-failure-that-looks-successful-title">
      <h2 id="the-failure-that-looks-successful-title">The difficult test is the one with no answer</h2>
      <p>A confirmed decline has a clear starting point for recovery. The order stays unpaid and the customer needs a useful message. A missing response is harder: the customer pressed Pay, something stopped responding, and nobody yet knows whether another attempt would charge them twice.</p>
      <p>Cybersource’s timeout guidance treats an unknown result as a reason to investigate the original transaction before retrying. A test should demonstrate that investigation, including what the customer sees while the outcome is unresolved. Turning every error into “payment failed” may produce a tidy screen and a misleading instruction.</p>
      <p>Ask your developer to show a payment whose response is interrupted after submission. The business should retain the existing order and attempt, avoid automatically sending another charge, and apply the confirmed result when it becomes available. Closing the browser should not erase the evidence needed to finish that work.</p>
      <p>Repeated events deserve the same attention. Refresh the confirmation page, repeat a submit action in a controlled test, and replay a payment notification where the integration supports that test. Look for repeated business actions as well as duplicate payments. One payment should not produce two shipment requests or two refund instructions.</p>
      <p>Use the provider’s documented scenarios for approvals, declines, authentication and enabled wallets. A rejected request with missing fields is not the same test as a valid request declined by the simulated issuer. If a condition is reproduced by your developer’s own test code, label it that way. It can establish how the application responds without proving that the gateway generated or delivered that result.</p>
      <p>The customer experience is part of the result. Read the error on a phone, return after cancellation and try the flow with keyboard navigation. Check that an unresolved payment has a reference and a next action. A waiting customer should have a way to understand what is happening and ask for help.</p>
    </section>

    <section id="can-your-team-finish-the-job" aria-labelledby="can-your-team-finish-the-job-title">
      <h2 id="can-your-team-finish-the-job-title">Let the person handling customers finish the test</h2>
      <p>Hand a completed test order to the colleague who would handle a real refund. Ask them to locate the payment, identify its current state and explain which action is available. That exercise tests whether the connection is usable beyond the developer’s workstation.</p>
      <p>Where partial refunds are supported, check the remaining refundable amount and the link back to the original payment. Distinguish a submitted refund request from its confirmed result. Check what the customer is told, too. The <Link href="/services/refunds" prefetch={false}>refund process</Link> needs enough detail for your team to answer a question later.</p>
      <p>A Trolleys merchant uses the Cybersource gateway account for payment operations and the Back Office Operations Portal for merchant activity and funding records. Keep the store, MID, reporting period and payment references aligned. Our <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> helps make sense of those records; the store supplies the order and customer context.</p>
      <p>Do not require a sandbox transaction to appear in a live merchant report. Confirm which account records the test environment can provide, and list the production checks that still remain. Otherwise, a test report can claim a complete journey while never examining the part your finance team relies on.</p>
    </section>

    <section id="the-live-decision" aria-labelledby="the-live-decision-title">
      <h2 id="the-live-decision-title">Keep the live decision separate</h2>
      <p>Cybersource’s sandbox does not process actual payments or send transactions to financial institutions. It uses separate credentials from production. Passing its tests does not demonstrate a real bank deposit, a credit on a customer’s card or approval to activate a merchant account.</p>
      <p>Agree the live validation with your account team: the approved store and methods, who may make an actual payment, the permitted amount, any follow-up action and when to stop. Sandbox test cards belong only in the sandbox. Any authorized production check uses an authorized real payment method and can move real money.</p>
      <p>Before opening checkout to customers, the handoff should identify the live configuration, completed checks, unresolved items and the people responsible for payment problems. Include who watches delayed results and who can pause new attempts. A software rollback does not undo a transaction that has already been accepted.</p>
      <p>Bring that handoff to our <Link href="/company/contact#integration" prefetch={false}>account and integration team</Link>. We can help confirm the merchant and gateway requirements and investigate the relevant account records. Your developer remains responsible for the store’s order handling, recovery and release. Keep those responsibilities explicit rather than letting “testing passed” stand in for agreement.</p>
    </section>

    <p>The best result of payment testing is a business that knows what it can safely do next. A customer can finish a purchase, your team can find the money’s record, and an interruption has a path to resolution. That is a stronger reason to launch than a screen showing Approved.</p>
  </BlogArticlePage>;
}
