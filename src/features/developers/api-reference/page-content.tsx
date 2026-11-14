import Link from "next/link";
import { Icon } from "@/shared/ui/icon";
import { ReadingGuide } from "@/shared/ui/reading-guide/reading-guide";
import { developerJsonLd } from "../metadata";
import { DeveloperNavigation } from "../navigation";
import { apiReferenceArticle, apiReferenceContents, checkoutCode, checkoutMarkup, cybsReferences, paymentOperations, sessionRequest } from "./content";
import styles from "./page.module.css";

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="docs-text-link" href={href} rel="noreferrer">{children}<Icon name="external" /></a>;
}

function Code({ label, children }: { label: string; children: string }) {
  return <figure className={styles.code}><figcaption>{label}</figcaption><pre tabIndex={0} role="region" aria-label={`${label}. Scroll horizontally if needed.`}><code>{children}</code></pre></figure>;
}

function Detail({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="docs-details"><details><summary>{title}<span aria-hidden="true">+</span></summary><div className={styles.detail}>{children}</div></details></div>;
}

function Credentials() {
  return <>
    <p>First complete <Link prefetch={false} href="/developers/getting-started">Getting started</Link> and confirm Unified Checkout is enabled for the store. This page documents the Cybersource connection for your website. It is not an Etail API.</p>
    <p>Start in the sandbox with its <strong>gateway merchant ID, REST Key ID and shared secret</strong>. Your processing MID and portal password are not substitutes.</p>
    <dl className="docs-facts">
      <div><dt>Your server</dt><dd>Holds API secrets, selects the merchant account, creates sessions and records verified payment outcomes against orders.</dd></div>
      <div><dt>Customer’s browser</dt><dd>Loads Cybersource’s checkout library, displays hosted fields and returns the result to your server.</dd></div>
    </dl>
    <p>A hosted payment form still needs a secure server connection. No API integration with the Back Office Operations Portal is required for this merchant checkout.</p>
    <Detail title="Credentials, authentication and encryption">
      <dl className="docs-facts">
        <div><dt>REST shared secret</dt><dd>In the correct Business Center account, open Payment Configuration → Key Management. Create the REST Shared Secret key for the integration and keep the Key ID and shared secret in protected server configuration.</dd></div>
        <div><dt>Gateway merchant ID</dt><dd>Use the gateway merchant identifier paired with those credentials. Do not substitute the processing MID or portal User ID.</dd></div>
        <div><dt>JWT authentication</dt><dd>Use the current Cybersource REST SDK or authentication instructions to sign server requests. A REST shared secret can be used for JWT authentication. Portal passwords cannot.</dd></div>
        <div><dt>Message level encryption (MLE)</dt><dd>Follow the account’s encryption requirements. Response MLE uses a separate REST API Response MLE key and protected private key material. It is distinct from API authentication and Apple Pay domain verification.</dd></div>
      </dl>
      <p>Keep test and live credentials separate. Never put private keys, secrets or certificate passwords in browser code, a public repository or logs. HTTP Signature is being retired; use the current JWT and MLE setup instructions for a new integration.</p>
      <Source href={cybsReferences.authentication}>REST authentication setup</Source><Source href={cybsReferences.encryption}>MLE configuration</Source>
    </Detail>
  </>;
}

function Session() {
  return <>
    <dl className={`docs-facts ${styles.endpoints}`}>
      <div><dt>Test</dt><dd><code>POST https://apitest.cybersource.com/uc/v1/sessions</code></dd></div>
      <div><dt>Live</dt><dd><code>POST https://api.cybersource.com/uc/v1/sessions</code></dd></div>
    </dl>
    <p>Use the exact HTTPS origin where checkout runs. Subdomains are separate origins; wildcards are not supported. If checkout is inside another iframe, include the required parent and frame origins.</p>
    <Detail title="Session request: card payment with automatic processing">
      <p>This request shows the JSON fields before any required MLE encryption. Replace the origin and order values with your server’s validated data. Configure billing, fraud checks and cardholder authentication for your account.</p>
      <Code label="Server · Session request body">{JSON.stringify(sessionRequest, null, 2)}</Code>
      <p><code>completeMandate</code> is at the top level; order details and the merchant reference are inside <code>data</code>. <code>CAPTURE</code> requests authorization and capture together. It does not confirm settlement or a bank deposit.</p>
      <p>This request offers card entry only. Offer wallets only when they are enabled and their setup is complete. <Link prefetch={false} href="/developers/getting-started#payment-methods">Check wallet setup</Link>.</p>
      <Source href={cybsReferences.sessions}>Session fields and processing options</Source>
    </Detail>
    <p>The response is a signed session JWT, also called a capture context. Verify it before using its configuration. Pass the session to your page and load its returned <code>clientLibrary</code> with <code>clientLibraryIntegrity</code>. Do not hardcode the library URL or integrity value.</p>
  </>;
}

function HostedCheckout() {
  return <>
    <ol className="docs-steps">
      <li><span className="docs-step-number" aria-hidden="true">1</span><div><h3>Load the library</h3><p>Use the script URL and integrity hash returned for this session, with <code>crossorigin=&quot;anonymous&quot;</code>. Configure your site’s content security policy using the provider’s integration requirements.</p></div></li>
      <li><span className="docs-step-number" aria-hidden="true">2</span><div><h3>Mount checkout</h3><p>Initialize <code>VAS.UnifiedCheckout</code>, create checkout and mount it in the page containers.</p></div></li>
      <li><span className="docs-step-number" aria-hidden="true">3</span><div><h3>Return the result to your server</h3><p>With the <code>completeMandate</code> above, checkout processes the payment and returns a result. Do not submit that result as a new payment to <code>/pts/v2/payments</code>.</p></div></li>
    </ol>
    <Detail title="Browser setup: Unified Checkout v1">
      <Code label="Browser · Checkout containers">{checkoutMarkup}</Code>
      <Code label="Browser · Checkout lifecycle">{checkoutCode}</Code>
      <p>This fragment shows the checkout lifecycle, not a complete application. Your website supplies session delivery, server verification, error handling, repeat submission protection and order confirmation. Clean up the checkout when leaving the page.</p>
      <p>Current guidance permits omitting <code>clientVersion</code> to use the latest supported release. If you pin a version, use the documented major or minor format and still load the library returned by that session.</p>
      <Source href={cybsReferences.javascript}>JavaScript reference</Source><Source href={cybsReferences.versioning}>Versioning guidance</Source>
    </Detail>
    <Detail title="If you choose authorization only or token collection">
      <p><code>completeMandate.type: &quot;AUTH&quot;</code> requests authorization only. Your server must capture the eligible authorization later, using its transaction ID.</p>
      <p>Without a <code>completeMandate</code>, checkout returns a transient token rather than a completed payment. That separate flow requires server payment processing. Do not treat a transient token as approval, and do not combine the token flow with automatic processing for the same purchase.</p>
      <Source href={cybsReferences.start}>Choose the integration flow</Source>
    </Detail>
  </>;
}

function Verification() {
  return <>
    <ol className="docs-steps">
      <li><span className="docs-step-number" aria-hidden="true">1</span><div><h3>Verify the provider response</h3><p>Use Cybersource’s verification procedure and a maintained JWT library. Decoding is not signature verification. Use trusted keys for the configured environment and validate the required issuer and expiry claims.</p></div></li>
      <li><span className="docs-step-number" aria-hidden="true">2</span><div><h3>Match the order and operation</h3><p>Check the gateway account, order reference, amount, currency, transaction ID and operation result against your server’s order. Obtain the authoritative provider record if the returned result does not establish the necessary facts.</p></div></li>
      <li><span className="docs-step-number" aria-hidden="true">3</span><div><h3>Apply the result once</h3><p>Record authorization and capture separately. Confirm an order only when the verified status meets your fulfillment policy. Declined, pending, review and unknown results need their own handling.</p></div></li>
    </ol>
    <aside className="docs-note" aria-label="Different tokens have different purposes"><Icon name="info" /><div><strong>Different tokens have different purposes</strong><p>The authentication JWT signs your server’s API request. The session JWT configures checkout. The payment result reports processing. A transient token represents payment details for a separate processing flow.</p></div></aside>
    <Detail title="Token verification and payment status">
      <p>For session and transient tokens, Cybersource documents reading <code>kid</code>, retrieving the public key from <code>/flex/v2/public-keys/&#123;kid&#125;</code> on the configured Cybersource host, and verifying the signature. Never use an arbitrary key URL supplied by an untrusted token.</p>
      <p>Use the result format documented for your integration. Do not assume a session or transient token’s claim layout is the completed payment result contract. If that contract is unclear, confirm the verifier with Cybersource before launch.</p>
      <p>An HTTP success response alone does not establish the payment state. Authorization is approval to proceed, capture submits an eligible payment for further processing, and bank receipt is a later event. ACH and alternative methods have their own completion and return states.</p>
      <Source href={cybsReferences.verification}>Token verification</Source><Source href={cybsReferences.start}>Server verification handoff</Source>
    </Detail>
  </>;
}

function PaymentActions() {
  return <>
    <Detail title="Card payment endpoints and the ID each needs">
      <p>All operations below use <code>POST</code> on the configured test or live host. Replace <code>&#123;id&#125;</code> with the indicated Cybersource operation ID, not your order number. Use the current processor guide for required fields, amount limits and eligibility.</p>
      <dl className={styles.operations}>{paymentOperations.map(operation => <div key={operation.path}><dt>{operation.title}</dt><dd><code>{operation.path}</code><p><strong>{operation.reference}.</strong> {operation.text}</p></dd></div>)}</dl>
      <Source href={cybsReferences.endpoints}>Cybersource endpoint reference</Source><Source href={cybsReferences.payments}>Payment API reference</Source>
    </Detail>
    <div id="refund-payment" className={styles.anchor}><h3>Keep refunds linked to the purchase</h3><p>Check the original capture or sale, earlier refunds and open disputes. Include pending refunds when calculating the remaining amount. Keep the refund ID and outcome; if the response is lost, investigate that operation before repeating it. A refund request is not confirmation of the customer’s bank posting.</p></div>
    <div id="dispute-case" className={styles.anchor}><h3>Handle disputes through the case</h3><p>Follow the notice in the merchant operations portal, including its deadline. Check earlier refunds before issuing another credit. Submit the required response and retain its acknowledgment. A saved attachment alone does not confirm submission.</p></div>
  </>;
}

function AccountRecords() {
  return <>
    <div id="reconcile" className={styles.anchor}><h3>Match gateway and merchant activity</h3><p>Keep the original order, authorization, capture, reversal and refund IDs together. Compare Cybersource’s transaction records with the related merchant account activity. Allow for reporting delays and different cutoffs or time zones.</p></div>
    <div id="payment-to-deposit" className={styles.anchor}><h3>Check funding separately</h3><p>Submission for funding is not confirmation of bank receipt. Compare the reported funding amount with the posted bank credit and reference. Do not subtract a fee again if the report already includes it in a net total.</p></div>
    <p>For standard merchant checkout, use the Back Office Operations Portal to follow funding under your account’s terms. You do not need to submit funding instructions through an API.</p>
    <div className="docs-context"><Link prefetch={false} className="docs-text-link" href="/services/reconciliation">Reconciliation</Link><Link prefetch={false} className="docs-text-link" href="/services/payouts">Payouts</Link><Link prefetch={false} className="docs-text-link" href="/developers/testing">Testing checklist</Link><Link prefetch={false} className="docs-text-link" href="/company/contact#integration">Integration support</Link></div>
  </>;
}

export function ApiReferencePage() {
  return <ReadingGuide title="API reference" article={apiReferenceArticle} jsonLd={developerJsonLd("api-reference")}
    navigation={<DeveloperNavigation current="api-reference" />} contents={apiReferenceContents}
    heading={<span className="docs-audience">Cybersource Unified Checkout · For website developers</span>}
    sectionContent={{ "api-credentials": <Credentials />, "create-session": <Session />, "display-checkout": <HostedCheckout />, "payment-status": <Verification />, "refunds-and-disputes": <PaymentActions />, payouts: <AccountRecords /> }} />;
}
