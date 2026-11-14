import Link from "next/link";
import { Icon } from "@/shared/ui/icon";
import { ReadingGuide } from "@/shared/ui/reading-guide/reading-guide";
import { developerJsonLd } from "../metadata";
import { DeveloperNavigation } from "../navigation";
import { webhookEvent, webhookReferences, webhooksArticle, webhooksContents } from "./content";

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="docs-text-link" href={href} rel="noreferrer">{children}<Icon name="external" /></a>;
}

function CheckoutEvent() {
  return <>
    <p>This guide is for a custom website using <Link prefetch={false} href="/developers/api-reference#display-checkout">Unified Checkout with <code>completeMandate</code></Link>. Cybersource sends the processing result independently of the browser callback. It is not an Etail webhook service.</p>
    <dl className="docs-facts">
      <div><dt>Product</dt><dd><code>{webhookEvent.productId}</code></dd></div>
      <div><dt>Event type</dt><dd><code>uc.orders.<wbr />transactionresults</code></dd></div>
      <div><dt>What it reports</dt><dd>The result of payment processing initiated through Unified Checkout. It is not a subscription to every later capture, refund or bank deposit.</dd></div>
    </dl>
    <p>The separate <code>payments.payments.updated</code> event belongs to alternative payment methods. Do not select it as a general card payment notification.</p>
    <p>Funding and merchant account activity belong in the Back Office Operations Portal. No separate webhook integration with that portal is required for standard merchant checkout. For Shopify or WooCommerce, follow the payment app’s notification instructions before adding a separate receiver.</p>
    <Source href={webhookReferences.checkout}>Unified Checkout event reference</Source>
  </>;
}

function SubscriptionSetup() {
  return <>
    <ol className="docs-steps">
      <li><span className="docs-step-number" aria-hidden="true">1</span><div><h3>Prepare the receiving server</h3><p>Create a reachable HTTPS receiver in your merchant application, with secure receipt storage and background processing. A public website page or customer redirect is not a webhook receiver.</p></div></li>
      <li><span className="docs-step-number" aria-hidden="true">2</span><div><h3>Configure keys and encryption</h3><p>Use REST credentials for subscription management. Set up the separate webhook digital signature key and register the certificate required for webhook message level encryption (MLE). Keep private material on your server.</p></div></li>
      <li><span className="docs-step-number" aria-hidden="true">3</span><div><h3>Confirm the event is enabled</h3><p>Retrieve the products and events enabled for the gateway organization. If <code>{webhookEvent.productId}</code> or <code>{webhookEvent.eventType}</code> is missing, ask the implementation team or Cybersource account manager to check enablement.</p></div></li>
      <li><span className="docs-step-number" aria-hidden="true">4</span><div><h3>Create and verify the subscription</h3><p>Register the receiver, event, security policy and intended organization scope. Save the subscription ID and check URL approval and <code>ACTIVE</code> status. Creating a subscription alone does not prove that notifications can be received.</p></div></li>
    </ol>
    <div className="docs-details"><details>
      <summary>Management endpoints and activation<span aria-hidden="true">+</span></summary>
      <p>Use <code>https://apitest.cybersource.com</code> for test requests and <code>https://api.cybersource.com</code> for live requests. Authenticate these requests from your server.</p>
      <div className="docs-table-scroll" role="region" aria-label="Webhook management endpoints. Scroll horizontally if needed." tabIndex={0}><table className="docs-table"><caption>Subscription setup requests</caption><thead><tr><th scope="col">Request</th><th scope="col">Purpose</th></tr></thead><tbody>
        <tr><th scope="row"><code>GET /notification-subscriptions/<wbr />v2/products/<wbr />&#123;organizationId&#125;</code></th><td>Check the events enabled for the intended gateway organization.</td></tr>
        <tr><th scope="row"><code>POST /notification-subscriptions/<wbr />v2/webhooks</code></th><td>Create the subscription using the provider’s required configuration.</td></tr>
      </tbody></table></div>
      <p>The notification format’s version 3 is separate from the <code>/v2/</code> management path. Check the returned subscription configuration; do not invent a <code>/v3/</code> endpoint.</p>
      <p>Review the returned organization scope. Do not assume it is limited to one store, or subscribe to other organizations without authorization. A subscription marked <code>PENDING_REVIEW</code>, <code>BLOCKED</code>, <code>INACTIVE</code> or <code>SUSPENDED</code> needs attention before relying on delivery.</p>
      <p>Cybersource validates submitted URLs. A configured health check can support automatic activation and revalidation. Confirm the actual status and receiver behavior before launch.</p>
      <div className="docs-context"><Source href={webhookReferences.products}>Enabled products and events</Source><Source href={webhookReferences.subscription}>Create a subscription</Source><Source href={webhookReferences.health}>Activation and health checks</Source></div>
    </details></div>
  </>;
}

function DeliverySecurity() {
  return <>
    <dl className="docs-facts">
      <div><dt>Transport and receiver access</dt><dd>Use HTTPS and the configured receiver security policy. OAuth, when configured, is an additional delivery control. Header names or a claimed organization ID alone do not authenticate a notification.</dd></div>
      <div><dt>Encrypted payment payload</dt><dd>Use a unique asymmetric certificate for each webhook subscription. Register its public X.509 certificate and keep the matching private key on your server for JWE decryption. The REST response certificate and Apple Pay domain file are not substitutes for this setup.</dd></div>
      <div><dt>Digital signature</dt><dd>Validate <code>v-c-signature</code> using the webhook signature key for the expected account. Encryption does not replace this signature check.</dd></div>
      <div><dt>Account and event</dt><dd>After verification, match the configured environment, gateway organization, product and event. Do not allow an event from another account to change the order.</dd></div>
    </dl>
    <div className="docs-details"><details>
      <summary>Signature format and key handling<span aria-hidden="true">+</span></summary>
      <p>The signature header contains <code>t</code>, <code>keyId</code> and <code>sig</code>. The provider’s procedure uses HMAC SHA256 over its specified timestamp and payload representation. For encrypted notifications, follow the documented decryption and signature validation sequence.</p>
      <p>Preserve the exact payload representation required by the verifier. Do not replace it with a parsed and reformatted JSON object or assume the outer encrypted body is the signed content. Use a timing safe signature comparison.</p>
      <p>Resolve key IDs through your trusted configuration or the authenticated provider service. Cybersource instructs annual signature key replacement, and generating a replacement overrides the old key. Coordinate that change with your receiver and plan encryption certificate renewal. Reject unknown or unverifiable keys; never accept a key or lookup URL supplied by an untrusted sender.</p>
      <p>Confirm the timestamp and replay rules for the notification format. Do not copy a timing window from another payment provider or use a successful signature as the only duplicate check.</p>
      <div className="docs-context"><Source href={webhookReferences.signature}>Digital signature instructions</Source><Source href={webhookReferences.encryption}>Webhook MLE instructions</Source><Source href={webhookReferences.certificate}>Register the certificate</Source></div>
    </details></div>
  </>;
}

function ReceiptProcessing() {
  return <aside className="docs-note" aria-label="Agree the receiver response contract"><Icon name="info" /><div><strong>Confirm the receiver response contract</strong><p>Use the acknowledgment status and response deadline confirmed for your subscription. A successful subscription API response is different from acknowledging an incoming notification. Keep slow fulfillment work outside the acknowledgment path.</p></div></aside>;
}

function Recovery() {
  return <>
    <aside className="docs-note" aria-label="Retries follow the subscription"><Icon name="info" /><div><strong>Retries follow the subscription</strong><p>Cybersource’s documented default is three retries, starting one minute after a failed delivery and spaced one minute apart. The policy can be changed. Check your subscription’s saved settings, health check behavior and status instead of assuming unlimited redelivery.</p></div></aside>
    <div className="docs-context"><Source href={webhookReferences.retry}>Retry policy</Source><Source href={webhookReferences.troubleshooting}>Delivery troubleshooting</Source></div>
    <p>Before launch, test a valid delivery, altered signature, decryption failure, wrong account, duplicate delivery, late event, unavailable receiver and interrupted worker. Confirm that the browser result and webhook together still produce only one order action.</p>
    <p>For support, keep the environment, subscription and trace IDs, event type, operation reference, receipt time and failure stage. Exclude private keys, complete tokens and decrypted payment details from ordinary logs.</p>
    <div className="docs-context"><Link prefetch={false} className="docs-text-link" href="/developers/api-reference#uncertain-result">Recover an uncertain payment</Link><Link prefetch={false} className="docs-text-link" href="/developers/testing">Testing checklist</Link><Link prefetch={false} className="docs-text-link" href="/company/contact#integration">Integration support</Link></div>
  </>;
}

export function WebhooksPage() {
  return <ReadingGuide title="Webhooks" article={webhooksArticle} jsonLd={developerJsonLd("webhooks")}
    navigation={<DeveloperNavigation current="webhooks" />} contents={webhooksContents}
    heading={<span className="docs-audience">Cybersource payment notifications · For website developers</span>}
    sectionContent={{ "event-domains": <CheckoutEvent />, "webhooks-specifications": <SubscriptionSetup />, "event-security": <DeliverySecurity />, "payment-event": <Source href={webhookReferences.fields}>Notification field reference</Source>, "event-handler": <ReceiptProcessing />, "recovery-cases": <Recovery /> }} />;
}
