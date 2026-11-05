import Link from "next/link";
import { shopifyGuidePath, shopifySetupSteps } from "@/modules/public-site/shopify-guide-content";
import { Shell } from "./shell";
import { ShopifyGuideScreenshot } from "./shopify-guide-screenshot";
import { ShopifyCredentialsEmailArt } from "./shopify-credentials-email-art";
import { ShopifyVerificationArt } from "./shopify-verification-art";
import { TrolleysBrand } from "./trolleys-brand";
import styles from "./shopify-gateway-guide.module.css";

const sections = [
  ["before-you-start", "Before you start"],
  ["setup", "Connect your store"],
  ["verify-integration", "Verify the integration"],
];

export function ShopifyGatewayGuide() {
  const structuredData = {
    "@context": "https://schema.org", "@type": "TechArticle",
    headline: "Connect Shopify to Cybersource", description: "A screenshot guide to installing and activating the Cybersource gateway in Shopify with Etail Depot.",
    url: `https://etaildepot.com${shopifyGuidePath}`, dateModified: "2026-11-05", inLanguage: "en-US",
    author: { "@type": "Organization", name: "Etail Depot", url: "https://etaildepot.com/company" },
    publisher: { "@type": "Organization", name: "Etail Depot", url: "https://etaildepot.com" },
  };
  return <Shell><article className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <header className={styles.hero}>
      <div>
        <p className={styles.eyebrow}>Shopify integration</p>
        <h1>Connect Shopify<br /> to Cybersource.</h1>
        <p className={styles.lead}>Follow these steps to connect payments for your Shopify store. No coding is needed for this setup.</p>
        <p className={styles.meta}>Live store setup <span aria-hidden="true">·</span> Updated November 5, 2026</p>
      </div>
      <div className={styles.overview} role="group" aria-label="Connection overview">
        <p>Three parts to the setup.</p>
        <ol>
          <li><span aria-hidden="true">01</span><div><strong>Install the app</strong><span>Find Cybersource in Shopify’s payment settings</span></div></li>
          <li><span aria-hidden="true">02</span><div><strong>Connect your account</strong><span>Sign in to Cybersource and confirm access</span></div></li>
          <li><span aria-hidden="true">03</span><div><strong>Activate and verify</strong><span>Check a small payment in both accounts</span></div></li>
        </ol>
      </div>
    </header>
    <div className={styles.readingLayout}>
      <nav className={styles.contents} aria-label="On this page"><strong>On this page</strong>{sections.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav>
      <div className={styles.content}>
        <section id="before-you-start">
          <h2>Before you start</h2>
          <TrolleysBrand spacing="intro" />
          <p>Cybersource connects your Shopify checkout to your merchant account. Start once Trolleys has confirmed your account is ready to accept payments.</p>
          <dl className={styles.requirements}>
            <div><dt>Your Shopify owner account</dt><dd>The store owner must add or change the payment provider.</dd></div>
            <div><dt>Your Cybersource sign in</dt><dd>Have your Cybersource sign in email from Trolleys ready.</dd></div>
            <div><dt>Your setup details from Etail</dt><dd>Have Etail’s instructions for cards, currencies, payment capture and 3D Secure. Payment capture collects an authorized payment; 3D Secure adds a cardholder identity check.</dd></div>
          </dl>
          <p className={styles.note}><strong>Need your Cybersource sign in details?</strong> <Link href="/contact#account-support">Contact Etail support.</Link></p>
        </section>
        <section id="setup">
          <h2>Connect your store</h2>
          <p>Follow the steps in order. Select a screenshot to enlarge it. Your store may show different payment options or fees.</p>
          <ol className={styles.steps}>
            {shopifySetupSteps.map((step, index) => <li key={step.id} id={step.id}>
              <div className={styles.stepCopy}>
                <span className={styles.stepNumber}>Step {index + 1}</span><h3>{step.title}</h3>
                <p>{step.text}</p>
                {"choices" in step && <details className={styles.alternatives}><summary>My screen looks different<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 6 3 3 3-3" /></svg></summary><dl className={styles.choices}>{step.choices.map(choice => <div key={choice.condition}><dt>{choice.condition}</dt><dd>{choice.action}</dd></div>)}</dl></details>}
                {"actions" in step && ("ordered" in step ? <ol className={styles.actions}>{step.actions.map(action => <li key={action}>{action}</li>)}</ol> : <ul className={styles.actions}>{step.actions.map(action => <li key={action}>{action}</li>)}</ul>)}
                {"note" in step && <p className={styles.stepNote}>{step.note}</p>}
              </div>
              {"artwork" in step ? (step.artwork === "credentials-email" ? <ShopifyCredentialsEmailArt /> : <ShopifyVerificationArt />) : <ShopifyGuideScreenshot {...step} step={index + 1} />}
            </li>)}
          </ol>
        </section>
      </div>
    </div>
  </article></Shell>;
}
