import Link from "next/link";
import { IntegrationGuideStepState } from "../../components/integration-guide-step-state";
import { woocommerceGuidePath, woocommerceSetupSteps, wooExample } from "@/features/resources/integrations/woocommerce/woocommerce-content";
import { WooCommerceStepLocation } from "./woocommerce-guide-panels";
import { WooCommerceApiWalkthrough, WooCommerceCertificateDownload, WooCommerceCertificateSettings } from "./woocommerce-connection-walkthrough";
import { WooCommerceFileTransfer } from "./woocommerce-file-transfer";
import { Shell } from "../../../../shared/layout/shell";
import { TrolleysBrand } from "../../../../shared/brand/trolleys-brand";
import { ShopifyCredentialsEmailArt } from "../shopify/shopify-credentials-email-art";
import { WooCommerceGuideScreenshot } from "./woocommerce-guide-screenshot";
import styles from "../shopify/shopify-gateway-guide.module.css";
import woo from "../../components/integration-guide.module.css";
const phases = [
  { start: 0, range: "1–3", title: "Install the payment plugin", detail: "WordPress admin", minutes: 5 },
  { start: 3, range: "4–7", title: "Copy keys and download .p12", detail: "Email and Cybersource", minutes: 8 },
  { start: 7, range: "8–10", title: "Upload the file and save", detail: "Cyberduck and WordPress", minutes: 15 },
  { start: 10, range: "11–13", title: "Check a payment and refund", detail: "WooCommerce and Cybersource", minutes: 5 },
];
export function WooCommerceGatewayGuide() {
  const structuredData = {
    "@context": "https://schema.org", "@type": "TechArticle", headline: "Set up your WooCommerce checkout",
    description: "Set up WooCommerce card payments on WordPress.com with Trolleys, powered by Etail Depot. Follow account, certificate upload and checkout steps.",
    url: `https://etaildepot.com${woocommerceGuidePath}`, dateModified: "2026-11-14", inLanguage: "en-US",
    author: { "@type": "Organization", name: "Etail Depot", url: "https://etaildepot.com/company/about" },
    publisher: { "@type": "Organization", name: "Etail Depot", url: "https://etaildepot.com" },
  };
  return <Shell><article data-integration-guide className={`${styles.page} ${woo.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}} />
    <header className={`${styles.hero} ${woo.hero}`}>
      <div><p className={styles.eyebrow}>WooCommerce integration</p><h1>Set up your<br /> WooCommerce checkout.</h1><p className={styles.lead}>Add card payments to your WooCommerce store on WordPress.com.</p><p className={styles.meta}>WordPress.com setup <span aria-hidden="true">·</span> Updated November 14, 2026</p></div>
    </header>
    <div className={woo.readingLayout}>
      <div className={woo.overview}>
        <nav className={woo.journey} aria-label="Setup overview">{phases.map((phase,index)=><a href={`#${woocommerceSetupSteps[phase.start].id}`} key={phase.start}>
          <span className={woo.journeyTop}><span className={woo.journeyNumber}>{index+1}</span><span className={woo.timeEstimate}>About {phase.minutes} min</span></span>
          <strong>{phase.title}</strong>
          <span className={woo.journeyMeta}><span className={woo.journeyRange}>Steps {phase.range}</span><span className={woo.journeyLocation}>{phase.detail}</span></span>
        </a>)}</nav>
        <p className={woo.timingNote}>Estimated hands on time with your account ready. Downloads and payment processing may take longer.</p>
      </div>
      <div className={styles.content}>
        <section id="before-you-start" className={woo.beforeStart}><h2>Before you start</h2><TrolleysBrand spacing="intro" />
          <p>Start after Trolleys confirms your Cybersource account is ready for live payments with Unified Checkout.</p>
          <dl className={woo.requirementsGrid}>
            <div><dt>Your WordPress.com store</dt><dd>Administrator access, WooCommerce, HTTPS and a product ready to buy. Your plan must support plugins and <a href="https://wordpress.com/support/sftp/" target="_blank" rel="noopener noreferrer">SFTP file access</a>.</dd></div>
            <div><dt>Your account email</dt><dd>The Cybersource sign in details from Trolleys for this store. Each store may have its own gateway account.</dd></div>
            <div><dt>Your computer</dt><dd>A Mac or Windows computer. You will paste two API values into WordPress and use Cyberduck to upload one .p12 file.</dd></div>
          </dl>
          <p className={styles.note}><strong>Hosted somewhere else?</strong> The plugin steps are similar, but file access and the certificate path depend on your host. <Link prefetch={false} href="/company/contact#account-support">Ask Trolleys for the right setup.</Link></p>
        </section>
        <section id="setup"><h2>Follow one step at a time</h2>
          <ol className={woo.steps}>{woocommerceSetupSteps.map((step,index)=><li key={step.id}>
            {phases.some(phase=>phase.start===index) && <p className={woo.phaseLabel}>{phases.find(phase=>phase.start===index)?.title}</p>}
            <details id={step.id} name="woo-setup" open={index===0} className={woo.guideStep}>
              <summary className={woo.stepHeading}><span className={woo.stepBadge}>{index+1}</span><h3>{step.title}</h3><span className={woo.disclosureIcon} aria-hidden="true">+</span></summary>
              <div className={woo.stepBody}>
                <WooCommerceStepLocation step={step} />
                {step.actions.length > 0 && <div className={woo.instructionBody}>
                  <ol className={woo.actionList}>{step.actions.map(action=><li key={action.title}><strong>{action.title}.</strong> {action.text}</li>)}</ol>
                  {step.note && <p className={woo.stepNote}>{step.note}</p>}
                </div>}
                {step.artwork === "file-transfer" && <WooCommerceFileTransfer />}
                {step.artwork === "api-copy" && <WooCommerceApiWalkthrough />}
                {step.artwork === "certificate-download" && <WooCommerceCertificateDownload />}
                {step.artwork === "certificate-settings" && <WooCommerceCertificateSettings />}
                {step.id === "save-settings" && <details className={woo.smallHelp}><summary>Apple Pay or another payment method is missing</summary><p>Payment methods are managed in Cybersource under <strong>Payment Configuration → Unified Checkout</strong>. Apple Pay also needs verification of your checkout domain. Check the <a href="https://developer.cybersource.com/docs/cybs/en-us/unified-checkout/developer/all/rest/unified-checkout/uc-pay-methods-intro/uc-pay-methods-dig-wallets/uc-pay-methods-dig-wallets-applepay/uc-enable-digital-pay-applepay.html" target="_blank" rel="noopener noreferrer">Apple Pay setup instructions</a>, or <Link prefetch={false} href="/company/contact#account-support">ask Trolleys</Link> which methods are enabled for your store.</p></details>}
                {step.screenshot ? <WooCommerceGuideScreenshot name={step.screenshot} title={step.title} step={index+1} caption={step.caption} /> : step.artwork === "email" ? <ShopifyCredentialsEmailArt store="WooCommerce" exampleValues={{organization: wooExample.organization, username: wooExample.username}} /> : null}
              </div>
            </details>
          </li>)}</ol>
        </section>
        <div id="before-going-live">
          <details className={woo.sources}><summary>Platform documentation</summary><ul>
            <li><a href="https://developer.cybersource.com/docs/cybs/en-us/isv-plugins/admin/all/na/isv-plugin-o/built-by-us/wc-introduction/wc-configuration/wc-minimum-configuration.html" target="_blank" rel="noopener noreferrer">Cybersource WooCommerce configuration</a></li>
            <li><a href="https://developer.cybersource.com/docs/cybs/en-us/isv-plugins/admin/all/na/isv-plugin-o/built-by-us/wc-introduction/wc-prerequisites/wc-req-prerequisites.html" target="_blank" rel="noopener noreferrer">WooCommerce required keys and certificate</a></li>
            <li><a href="https://developer.cybersource.com/docs/cybs/en-us/platform/developer/all/rest/rest-getting-started/restgs-jwt-shared-secret-intro/restgs-shared-secret-create-intro/restgs-shared-secret-create-task.html" target="_blank" rel="noopener noreferrer">Cybersource API key setup and screen reference</a></li>
            <li><a href="https://developer.cybersource.com/docs/cybs/en-us/security-keys/user/all/ada/security-keys/restgs-security-mle-reply.html" target="_blank" rel="noopener noreferrer">Cybersource response certificate setup and screen reference</a></li>
            <li><a href="https://wordpress.com/support/sftp/" target="_blank" rel="noopener noreferrer">WordPress.com file access</a></li>
            <li><a href="https://wordpress.com/support/sftp/sftp-client/" target="_blank" rel="noopener noreferrer">WordPress.com Cyberduck instructions</a></li>
            <li><a href="https://cyberduck.io/download/" target="_blank" rel="noopener noreferrer">Cyberduck downloads</a></li>
            <li><a href="https://docs.cyberduck.io/cyberduck/transfer/" target="_blank" rel="noopener noreferrer">Cyberduck file transfers</a></li>
            <li><a href="https://developer.wordpress.com/docs/guides/manage-permissions/" target="_blank" rel="noopener noreferrer">WordPress.com file access and privacy errors</a></li>
            <li><a href="https://docs.cyberduck.io/cyberduck/browser/" target="_blank" rel="noopener noreferrer">Cyberduck file and folder actions</a></li>
            <li><a href="https://docs.cyberduck.io/cyberduck/info/" target="_blank" rel="noopener noreferrer">Cyberduck file permissions</a></li>
            <li><a href="https://woocommerce.com/document/fraud-protection/" target="_blank" rel="noopener noreferrer">WooCommerce fraud prevention</a></li>
          </ul></details>
        </div>
      </div>
    </div>
    <IntegrationGuideStepState />
  </article></Shell>;
}
