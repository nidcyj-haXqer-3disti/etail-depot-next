import Link from "next/link";
import { Icon } from "@/shared/ui/icon";
import { ReadingGuide } from "@/shared/ui/reading-guide/reading-guide";
import { developerJsonLd } from "../metadata";
import { DeveloperNavigation } from "../navigation";
import { developerToolReferences, developerToolsArticle, developerToolsContents } from "./content";

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="docs-text-link" href={href} rel="noreferrer">{children}<Icon name="external" /></a>;
}

function IntegrationTools() {
  return <>
    <p>These are provider resources for your merchant application. Etail does not provide a separate API or SDK for this connection. No API integration with the Back Office Operations Portal is required for standard merchant checkout.</p>
    <dl className="docs-facts">
      <div><dt>Checkout guide</dt><dd>Use the current Unified Checkout flow for the server session, browser library and payment result.<br /><Source href={developerToolReferences.checkout}>Official Unified Checkout guide</Source></dd></div>
      <div><dt>Server SDKs</dt><dd>Choose the official REST SDK for your server language. Check its current release, authentication support and installation instructions. Samples are a starting point; they do not supply your complete order, recovery or security system.<br /><Source href={developerToolReferences.sdks}>Cybersource REST SDKs and samples</Source></dd></div>
    </dl>
    <p>The REST SDK runs on your server. The separate Unified Checkout browser library displays the payment interface. Load its URL and integrity value from the session response; do not put server credentials into the browser.</p>
    <Link prefetch={false} className="docs-text-link" href="/developers/api-reference">Follow our connection walkthrough</Link>
  </>;
}

function SandboxTools() {
  return <>
    <dl className="docs-facts">
      <div><dt>API reference</dt><dd>Inspect request fields and operation responses in the official interactive console. Confirm the test environment before sending a request; the console’s name does not make a request safe to run in production.<br /><Source href={developerToolReferences.api}>Open the Cybersource API reference</Source></dd></div>
      <div><dt>Postman and test data</dt><dd>The official sandbox utilities page links to Cybersource’s Postman collection and processor test guides. Use a private test environment and keep credentials out of shared collections or exports.<br /><Source href={developerToolReferences.sandbox}>Open sandbox utilities</Source></dd></div>
      <div><dt>Response codes</dt><dd>Read the operation status and reason as well as the HTTP response. A successful HTTP request is not enough to mark an order paid.<br /><Source href={developerToolReferences.responses}>Look up response codes</Source></dd></div>
    </dl>
    <Link prefetch={false} className="docs-text-link" href="/developers/testing#acceptance-tests">Run the checkout test scenarios</Link>
  </>;
}

function AccountRecords() {
  return <>
    <dl className="docs-facts">
      <div><dt>Cybersource Business Center</dt><dd>Use the gateway account for the store. Inspect the transaction and related operations, check payment configuration and manage API credentials through authorized roles.</dd></div>
      <div><dt>Back Office Operations Portal</dt><dd>Use your assigned merchant access to review activity, funding, disputes and account maintenance. Select the correct MID and DBA. Reporting periods and available records can differ from the gateway.</dd></div>
    </dl>
    <Link prefetch={false} className="docs-text-link" href="/developers/getting-started#portal-access">Open the correct merchant portal</Link>
    <div className="docs-details"><details>
      <summary>Transaction lookup for developers<span aria-hidden="true">+</span></summary>
      <p>Cybersource’s Transaction Search and Details API supports reporting and investigation. Use the original request ID or order reference and check account scope, dates and time zone. It is not a real-time payment authorization service.</p>
      <p>Records can take time to appear. An empty search result does not establish that a payment failed or that it is safe to charge again. Preserve the unresolved attempt and use the recovery procedure for the original operation.</p>
      <div className="docs-context"><Source href={developerToolReferences.transactions}>Transaction Search and Details API</Source><Link prefetch={false} className="docs-text-link" href="/developers/api-reference#uncertain-result">Recover an uncertain payment</Link></div>
    </details></div>
  </>;
}

function HostedTools() {
  return <>
    <dl className="docs-facts">
      <div><dt>Virtual Terminal</dt><dd>An authorized merchant user can enter a payment in the Business Center when the account permits it. It is not the customer’s website checkout and does not require a Unified Checkout integration.</dd></div>
      <div><dt>Hosted links and invoices</dt><dd>Availability depends on the provider service and account setup. Do not assume Pay by Link or invoicing is included because you can sign in. Confirm access, supported payment methods and the setup process before offering a hosted page or QR code.</dd></div>
    </dl>
    <div className="docs-details"><details>
    <summary>If hosted payment requests are enabled<span aria-hidden="true">+</span></summary>
    <p>Review the business identity, purchase, amount, currency, reference and customer terms before sharing the provider’s link. Check expiry and reuse settings. A QR code opens the same hosted destination; it is not a different payment integration.</p>
    <p>Opening a link, scanning a QR code or viewing an invoice does not prove payment. Match the verified operation, account, amount and currency to the order before fulfillment.</p>
    <p>If payment is uncertain, investigate the original attempt before sending another request. A canceled invoice or edited link does not reverse a payment already processed. Keep the invoice and each payment operation’s references together.</p>
  </details></div></>;
}

export function DeveloperToolsPage() {
  return <ReadingGuide title="Developer tools" article={developerToolsArticle} jsonLd={developerJsonLd("developer-tools")}
    navigation={<DeveloperNavigation current="developer-tools" />} contents={developerToolsContents}
    heading={<span className="docs-audience">Cybersource resources · Merchant account tools</span>}
    sectionContent={{ "integration-tools": <IntegrationTools />, "sandbox-tools": <SandboxTools />, "account-records": <AccountRecords />, "payment-requests": <HostedTools /> }} />;
}
