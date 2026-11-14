import Link from "next/link";
import { Icon } from "@/shared/ui/icon";
import { ReadingGuide } from "@/shared/ui/reading-guide/reading-guide";
import { developerJsonLd } from "../metadata";
import { DeveloperNavigation } from "../navigation";
import { accountDetails, connectionOptions, gettingStartedArticle, gettingStartedContents, merchantPortals } from "./content";
import styles from "./page.module.css";

function PortalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="docs-text-link" href={href} rel="noreferrer" referrerPolicy="no-referrer">{children}<Icon name="external" /></a>;
}

function AccountDetails() {
  return <>
    <dl className="docs-facts">{accountDetails.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
    <p>Use the values supplied for your store. The processing MID and gateway Organization ID may be different.</p>
  </>;
}

function PortalAccess() {
  return <>
    <div className={styles.portals}>
      <section className={styles.portal} aria-labelledby="backoffice-title">
        <p className={styles.eyebrow}><Icon name="layers" />Merchant operations</p>
        <h3 id="backoffice-title">Back Office Operations Portal</h3>
        <p>View transactions, funding reports and disputes for the merchant accounts assigned to you.</p>
        <dl><div><dt>Sign in with</dt><dd>Your administrator email and the password created during enrollment.</dd></div><div><dt>Account access</dt><dd>One login for your assigned MIDs. If a store is missing, ask the implementation team to check your access.</dd></div></dl>
        <PortalLink href={merchantPortals.backoffice}>Open Back Office</PortalLink>
        <span className="docs-audience">backoffice.infinicept.com</span>
      </section>
      <section className={styles.portal} aria-labelledby="gateway-title">
        <p className={styles.eyebrow}><Icon name="card" />Payment gateway</p>
        <h3 id="gateway-title">Cybersource Business Center</h3>
        <p>Manage payment methods, API keys, payment records and Virtual Terminal for the selected store.</p>
        <dl><div><dt>Set your password</dt><dd>Use the setup link emailed for that store.</dd></div><div><dt>Then sign in with</dt><dd>Its Organization ID, User ID and the password you created. Use the separate gateway details supplied for each store.</dd></div></dl>
        <PortalLink href={merchantPortals.gateway}>Open Business Center</PortalLink>
        <span className="docs-audience">ebc2.cybersource.com</span>
      </section>
    </div>
    <p>Use the gateway address supplied in your welcome email if it differs. Missing an email or unable to sign in? <Link prefetch={false} href="/company/contact#integration">Contact the implementation team</Link>.</p>
  </>;
}

function ConnectionOptions() {
  return <>
    <ul className={`docs-steps ${styles.connections}`}>{connectionOptions.map(option => <li key={option.title}>
      <span className="docs-step-number"><Icon name={option.icon} /></span>
      <div><span className="docs-audience">{option.owner}</span><h3>{option.title}</h3><p>{option.text}</p>
        {option.href.startsWith("https://") ? <PortalLink href={option.href}>{option.label}</PortalLink> : <Link prefetch={false} className="docs-text-link" href={option.href}>{option.label}<Icon name="arrow" /></Link>}
      </div>
    </li>)}</ul>
    <p>Use the Back Office Operations Portal to manage your merchant accounts. No API integration with the portal is required for this setup.</p>
  </>;
}

function PaymentMethods() {
  return <>
    <aside className="docs-note" aria-label="Google Pay and Click to Pay"><Icon name="info" /><div>
      <strong>Google Pay and Click to Pay</strong>
      <p>Your welcome email confirms these are activated in the provisioned gateway. For Unified Checkout, check that they are selected. Availability also depends on the integration and customer’s device.</p>
    </div></aside>
    <div className="docs-details"><details>
      <summary>Apple Pay: verify your checkout domain<span aria-hidden="true">+</span></summary>
      <div className={styles.wallet}>
        <p>For a custom Unified Checkout website, the merchant and web team complete this together. For Shopify or WooCommerce, follow that integration’s wallet instructions.</p>
        <ol>
          <li><strong>Merchant:</strong> In Unified Checkout, choose <strong>Set Up</strong> under Apple Pay and download the domain verification file.</li>
          <li><strong>Web team:</strong> Place it at <code>https://yourstore.com/.well-known/apple-developer-merchantid-domain-association</code> on the checkout domain. Confirm the file opens over HTTPS.</li>
          <li><strong>Merchant:</strong> Return to Apple Pay setup, enter the merchant name and domain, and submit for verification. Repeat for each checkout domain.</li>
        </ol>
        <p>This public domain verification file is not the private .p12 encryption certificate or an API secret.</p>
        <a className="docs-text-link" href="https://developer.cybersource.com/docs/cybs/en-us/unified-checkout/developer/all/rest/unified-checkout/uc-pay-methods-intro/uc-pay-methods-dig-wallets/uc-pay-methods-dig-wallets-applepay/uc-enable-digital-pay-applepay.html" rel="noreferrer">Cybersource Apple Pay instructions<Icon name="external" /></a>
      </div>
    </details></div>
    <p>Using Virtual Terminal only? Confirm access and approved payment types with the implementation team. Unified Checkout setup is not required for that path.</p>
    <p>If a required feature is missing, ask the implementation team to confirm enablement and your user permissions.</p>
  </>;
}

function BeforeLaunch() {
  return <>
    <dl className={`docs-facts ${styles.handoff}`}>
      <div><dt>Merchant confirms</dt><dd><ul>
        <li>The store, DBA, MID and gateway account match.</li>
        <li>Portal access and approved payment methods are ready. Website checkout has any required domain verification.</li>
        <li>The person handling payment, refund and dispute questions is identified.</li>
      </ul></dd></div>
      <div><dt>Web team, for website checkout</dt><dd><ul>
        <li>The plugin or custom connection uses the correct account and environment.</li>
        <li>API secrets stay in protected server settings, outside browser code and logs.</li>
        <li>Successful, declined and interrupted payments are tested in the sandbox. Test credentials and cards stay separate from production.</li>
      </ul></dd></div>
    </dl>
    <p>A browser redirect alone does not prove payment. Verify the result before fulfilling an order. If a result is uncertain, check the original attempt in Cybersource before trying another charge. Back Office reports may update later.</p>
    <div className="docs-context"><Link prefetch={false} className="docs-text-link" href="/developers/testing">Review the testing checklist<Icon name="arrow" /></Link><Link prefetch={false} className="docs-text-link" href="/company/contact#integration">Get integration support</Link></div>
    <details className="docs-references"><summary>Official references<span aria-hidden="true">+</span></summary><ul>
      <li><a href="https://developer.infinicept.com/docs/getting-started-with-infinicept" rel="noreferrer">Infinicept platform overview</a></li>
      <li><a href="https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/get-started/" rel="noreferrer">Cybersource Unified Checkout setup</a></li>
    </ul></details>
  </>;
}

export function GettingStartedPage() {
  return <ReadingGuide title="Getting started" article={gettingStartedArticle} jsonLd={developerJsonLd("getting-started")}
    navigation={<DeveloperNavigation current="getting-started" />} contents={gettingStartedContents}
    heading={<span className="docs-audience">After merchant approval · For merchants and web teams</span>}
    sectionContent={{ "integration-access": <AccountDetails />, "portal-access": <PortalAccess />, checkout: <ConnectionOptions />, "payment-methods": <PaymentMethods />, "complete-payment": <BeforeLaunch /> }} />;
}
