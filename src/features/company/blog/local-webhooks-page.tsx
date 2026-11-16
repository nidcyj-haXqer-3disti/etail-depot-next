import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { localWebhooksArticle } from "./local-webhooks-content";
import s from "./blog.module.css";

const testEvidence = [
  ["A simulated message", "How the application handles the supplied data and chosen failures.", "That the gateway sent it, the subscription works or a payment occurred."],
  ["An authentic sandbox delivery", "That the configured test subscription can reach the receiver and pass its security checks.", "That the order update, receipt or fulfillment action finished."],
  ["A matched test order", "That a supported sandbox payment result reached the intended order and produced the expected action.", "Live processing, settlement, bank receipt or recovery from every interruption."],
] as const;

export function LocalWebhooksPage() {
  return <BlogArticlePage article={localWebhooksArticle}>
    <p>Your developer turns the screen around. A payment notification has appeared in the local test log. The connection is working.</p>
    <p>It is a useful moment. It is also the moment to ask to see the order.</p>
    <p>A webhook carries an update from the gateway to the merchant’s application. It can help the store learn what happened even when a customer closes checkout. But a delivered message and a completed order update are separate achievements. A business can have a healthy connection and still leave a paid customer waiting.</p>
    <p>For a merchant using <Link href="/services/merchant-services" prefetch={false}>Trolleys powered by Etail Depot</Link>, the useful demonstration follows the sale: the intended gateway account, the payment reference, the store’s order and the action your team expects next. You do not need to read the application code to ask whether those records agree.</p>

    <section id="what-the-test-proves" aria-labelledby="what-the-test-proves-title">
      <h2 id="what-the-test-proves-title">First, ask what actually reached the laptop</h2>
      <p>“Localhost” means the developer’s own computer. A gateway cannot deliver to that machine by using its localhost address. Your developer needs a reachable test destination for actual delivery. A development tunnel can forward requests from a public address to a local receiver; a hosted test environment is another option.</p>
      <p>Much of the testing can happen before either is exposed. A developer can send fabricated data to the receiver and deliberately introduce missing fields, unexpected states or repeated events. Those tests are valuable because they are repeatable. They should be described as simulations.</p>
      <table className={s.comparison}>
        <caption>Three different kinds of webhook evidence</caption>
        <thead><tr><th scope="col">What was tested</th><th scope="col">What it can establish</th><th scope="col">What remains unproven</th></tr></thead>
        <tbody>{testEvidence.map(([test, establishes, remaining]) => <tr key={test}>
          <th scope="row">{test}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it can establish</span>{establishes}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What remains unproven</span>{remaining}</td>
        </tr>)}</tbody>
      </table>
      <p>The public address also has to meet the gateway’s requirements. Cybersource reviews webhook destinations when subscriptions are created or updated. A page that opens in a browser is not evidence that the subscription has been approved and activated. Check the destination and subscription status before blaming the application for an absent notification.</p>
      <p>For Unified Checkout, the payment result notification uses the <code>uc.orders.transactionresults</code> event. Its payload requires message level encryption. The receiver also needs the configured signature verification and other required security controls. A generic tutorial that accepts unsigned JSON does not demonstrate this connection. Our <Link href="/developers/webhooks" prefetch={false}>webhook setup guidance</Link> keeps those requirements together.</p>
    </section>

    <section id="make-the-order-test-difficult" aria-labelledby="make-the-order-test-difficult-title">
      <h2 id="make-the-order-test-difficult-title">Make the order test harder than the demonstration</h2>
      <p>Once an authentic test event reaches the application, follow it into the matching test order. Check the gateway account, amount, currency and operation. An authorization should not silently become a captured sale. A notification from one store must not release an order belonging to another.</p>
      <p>Then repeat the same event. The developer should be able to show that the intended action still happens once. A second delivery is not a second purchase. An email, shipment request or access grant should not repeat merely because the receiver saw the message again.</p>
      <p>Run the browser result and notification close together, too. They may describe the same payment. Two independent “payment succeeded” paths can both try to move an order forward unless the application coordinates them.</p>
      <p>The more revealing interruption comes after the receiver acknowledges delivery. Stop processing before the order update finishes, then restart it. Does the work resume from a saved record, or has it disappeared? A successful response to the gateway cannot rescue work that the application never preserved.</p>
      <p>Keep that separate from the test where the receiver is unavailable. Cybersource’s delivery retries depend on the subscription policy. Once the receiver has accepted a message, unfinished internal work needs its own recovery. Retrying an order update is also different from submitting another payment.</p>
      <p>Include rejection tests. An invalid signature, a payload that cannot be decrypted or an unexpected account must not change an order. If a replay tool changes request details, investigate how that affects verification. Disabling security to make the demonstration turn green removes part of what you needed to prove.</p>
      <p>These are controlled development tests with test data and simulated downstream actions. Your developer should not need real customer records, live charges or an actual shipment to show that an interruption is handled correctly.</p>
    </section>

    <section id="a-test-that-can-be-handed-over" aria-labelledby="a-test-that-can-be-handed-over-title">
      <h2 id="a-test-that-can-be-handed-over-title">Leave evidence the next person can use</h2>
      <p>A useful handoff identifies the application version, test account, subscription, destination and event tested, followed by the expected result and what actually happened to the order. Keep the payment and order references together. Record which checks used a simulation and which involved a genuine gateway test delivery.</p>
      <p>Request inspection can make debugging easier, but it can also retain request contents. Decide what the tunnel or inspection service may store before using it. Keep credentials, private keys and customer data out of recordings and shared screenshots. Expose only the intended receiver, then retire temporary access and unneeded test subscriptions when the work is finished.</p>
      <p>For Trolleys merchants with several DBAs or MIDs, retain the mapping between each store and its gateway account. A test passed against one account does not establish that every store is configured. The Back Office Operations Portal remains the place for merchant activity and funding records; a local webhook test checks the store’s handling of gateway results. It does not demonstrate a bank deposit.</p>
      <p>Before launch, repeat the relevant checks on the intended hosted setup and agree any live validation separately. Include who monitors missing updates, who investigates a payment and who repairs an order that stopped moving. Our <Link href="/company/contact#integration" prefetch={false}>account and integration team</Link> can help with gateway access and account questions. Your developer owns the receiver and its connection to your store.</p>
    </section>

    <p>The strongest handoff is an order your team can follow through an interruption. The notification arrived, its contents were verified, the correct action happened once and unfinished work could recover. That is the evidence worth bringing from the developer’s laptop into your launch decision.</p>
  </BlogArticlePage>;
}
