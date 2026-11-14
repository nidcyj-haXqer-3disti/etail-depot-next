import Link from "next/link";
import { Icon } from "@/shared/ui/icon";
import { ReadingGuide } from "@/shared/ui/reading-guide/reading-guide";
import { developerJsonLd } from "../metadata";
import { DeveloperNavigation } from "../navigation";
import { testingArticle, testingContents, testingReferences } from "./content";

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="docs-text-link" href={href} rel="noreferrer">{children}<Icon name="external" /></a>;
}

function TestSetup() {
  return <>
    <p>This checklist covers your merchant connection to Cybersource. There is no Etail test API. For Shopify or WooCommerce, follow the payment app’s test instructions alongside the relevant checks below.</p>
    <dl className="docs-facts">
      <div><dt>Separate accounts</dt><dd>Use sandbox credentials, records and notifications. Keep live keys and customer payment details out of the test setup. If you only have live access, ask the integration team for a suitable test account.</dd></div>
      <div><dt>Correct environment</dt><dd>For the Cybersource flow in this guide, create sessions on <code>https://apitest.cybersource.com</code>. Confirm the environment before sending any request. Use the browser library returned by that test session.</dd></div>
      <div><dt>Current test data</dt><dd>Use the provider’s test data for the selected method and processor. Follow the required expiry, security code and authentication instructions. If a published value is expired or rejected, ask for a current test value rather than inventing one.</dd></div>
    </dl>
    <div className="docs-context"><Source href={testingReferences.setup}>Unified Checkout test checklist</Source><Source href={testingReferences.cards}>Test cards and wallets</Source><Source href={testingReferences.processors}>Processor test scenarios</Source></div>
    <p>Confirm the <Link prefetch={false} href="/developers/getting-started#portal-access">account access from your welcome email</Link> before starting. A live portal login is not a sandbox credential.</p>
  </>;
}

function MethodChecks() {
  return <div className="docs-details"><details>
    <summary>Digital wallets and other enabled methods<span aria-hidden="true">+</span></summary>
    <p>Check the offered methods on supported devices and browsers, including cancellation and the final verified result. A wallet button appearing on screen does not prove that a payment works.</p>
    <dl className="docs-facts">
      <div><dt>Apple Pay</dt><dd>Verify the website domain and prepare an Apple sandbox tester, supported test device and test card using Apple’s instructions. Domain verification and the wallet test setup are separate. Repeat the required domain setup for the production store.</dd></div>
      <div><dt>Google Pay and Click to Pay</dt><dd>Follow the provider’s test mode and wallet or test-profile requirements for the enabled method. Standard card-entry test data is not a substitute for every wallet or authentication scenario.</dd></div>
      <div><dt>ACH and other methods</dt><dd>If enabled for this connection, use their own test values and confirm pending, failed and completed outcomes. Do not apply card authorization or settlement assumptions to another payment method.</dd></div>
    </dl>
    <div className="docs-context"><Source href={testingReferences.wallets}>Wallet setup and testing</Source><Source href={testingReferences.apple}>Apple Pay sandbox instructions</Source></div>
  </details></div>;
}

export function TestingPage() {
  return <ReadingGuide title="Testing" article={testingArticle} jsonLd={developerJsonLd("testing")}
    navigation={<DeveloperNavigation current="testing" />} contents={testingContents}
    heading={<span className="docs-audience">Cybersource Unified Checkout · Launch checklist</span>}
    sectionContent={{ "testing-and-launch-specifications": <TestSetup /> }}
    sectionDetails={{ "acceptance-tests": <MethodChecks /> }} />;
}
