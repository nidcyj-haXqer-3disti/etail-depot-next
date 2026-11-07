import Link from "next/link";
import { shopifyGuidePath, shopifySetupSteps } from "@/modules/public-site/shopify-guide-content";
import { Shell } from "./shell";
import { ShopifyGuideScreenshot } from "./shopify-guide-screenshot";
import { ShopifyCredentialsEmailArt } from "./shopify-credentials-email-art";
import { ShopifyVerificationArt } from "./shopify-verification-art";
import { IntegrationGuideStepState } from "./integration-guide-step-state";
import { TrolleysBrand } from "./trolleys-brand";
import { Icon } from "./icon";
import styles from "./shopify-gateway-guide.module.css";
import guide from "./integration-guide.module.css";

const phases = [
  { start: 0, range: "1–6", title: "Install the payment app", location: "Shopify admin", minutes: 5 },
  { start: 6, range: "7–9", title: "Sign in and confirm access", location: "Email and Cybersource", minutes: 5 },
  { start: 9, range: "10–12", title: "Activate and check a payment", location: "Shopify and Cybersource", minutes: 8 },
];

function ShopifyStepLocation({ id }: { id: string }) {
  const login = id === "business-center-login" || id === "review-agreement";
  const email = id === "check-your-email";
  const verify = id === "verify-integration";
  return <div className={guide.location} role="group" aria-label="Where to complete this step">
    <div className={guide.destination}>
      <Icon name={email ? "mail" : login ? "shield" : "business"} />
      <div>
        <strong>{email ? "Your email inbox" : login ? (id === "review-agreement" ? "Cybersource account connection" : "Cybersource sign in opened by Shopify") : "Shopify admin"}</strong>
        {email ? <span className={guide.destinationText}>Your account email from Trolleys</span> : login ? <span className={guide.destinationText}>ebc2.cybersource.com</span> : <a href="https://admin.shopify.com/" target="_blank" rel="noopener noreferrer">admin.shopify.com</a>}
      </div>
    </div>
    {verify && <div className={guide.destination}><Icon name="shield" /><div><strong>Cybersource Business Center</strong><a href="https://ubc.cybersource.com/ebc2/" target="_blank" rel="noopener noreferrer">ubc.cybersource.com</a></div></div>}
  </div>;
}

export function ShopifyGatewayGuide() {
  const structuredData = {
    "@context": "https://schema.org", "@type": "TechArticle",
    headline: "Connect Shopify to Cybersource", description: "A screenshot guide to installing and activating Cybersource for your Shopify checkout with Trolleys, powered by Etail Depot.",
    url: `https://etaildepot.com${shopifyGuidePath}`, dateModified: "2026-11-07", inLanguage: "en-US",
    author: { "@type": "Organization", name: "Etail Depot", url: "https://etaildepot.com/company" },
    publisher: { "@type": "Organization", name: "Etail Depot", url: "https://etaildepot.com" },
  };
  return <Shell><article data-integration-guide className={`${styles.page} ${guide.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <header className={`${styles.hero} ${guide.hero}`}>
      <div>
        <p className={styles.eyebrow}>Shopify integration</p>
        <h1>Connect Shopify<br /> to Cybersource.</h1>
        <p className={styles.lead}>Add card payments to your Shopify checkout. No coding is needed for this setup.</p>
        <p className={styles.meta}>Live store setup <span aria-hidden="true">·</span> Updated November 7, 2026</p>
      </div>
    </header>
    <div className={guide.readingLayout}>
      <div className={guide.overview}>
        <nav className={`${guide.journey} ${guide.threeParts}`} aria-label="Setup overview">
          {phases.map((phase, index) => <a href={`#${shopifySetupSteps[phase.start].id}`} key={phase.start}>
            <span className={guide.journeyTop}><span className={guide.journeyNumber}>{index + 1}</span><span className={guide.timeEstimate}>About {phase.minutes} min</span></span>
            <strong>{phase.title}</strong>
            <span className={guide.journeyMeta}><span className={guide.journeyRange}>Steps {phase.range}</span><span className={guide.journeyLocation}>{phase.location}</span></span>
          </a>)}
        </nav>
        <p className={guide.timingNote}>Estimated hands on time with your account ready. Payment processing may take longer.</p>
      </div>
      <div className={styles.content}>
        <section id="before-you-start" className={guide.beforeStart}>
          <h2>Before you start</h2>
          <TrolleysBrand spacing="intro" />
          <p>Start after Trolleys confirms your Cybersource account is ready for live payments with Shopify.</p>
          <dl className={guide.requirementsGrid}>
            <div><dt>Shopify store owner access</dt><dd>Sign in as the owner of the store you want to connect. Only the owner can add or change its payment provider.</dd></div>
            <div><dt>Cybersource account email</dt><dd>The email from Trolleys with your Organization ID, Username and password setup instructions.</dd></div>
            <div><dt>Your payment settings</dt><dd>The cards, currencies, payment capture and 3D Secure settings confirmed by Trolleys for your store.</dd></div>
          </dl>
          <p className={styles.note}><strong>Need help?</strong> <Link prefetch={false} href="/contact#account-support">Contact Trolleys support.</Link></p>
        </section>
        <section id="setup">
          <h2>Follow one step at a time</h2>
          <ol className={guide.steps}>
            {shopifySetupSteps.map((step, index) => <li key={step.id}>
              {phases.some(phase => phase.start === index) && <p className={guide.phaseLabel}>{phases.find(phase => phase.start === index)?.title}</p>}
              <details id={step.id} name="shopify-setup" open={index === 0} className={guide.guideStep}>
                <summary className={guide.stepHeading}><span className={guide.stepBadge}>{index + 1}</span><h3>{step.title}</h3><span className={guide.disclosureIcon} aria-hidden="true">+</span></summary>
                <div className={guide.stepBody}>
                  <ShopifyStepLocation id={step.id} />
                  <div className={guide.instructionBody}>
                    <p className={guide.stepIntro}>{step.text}</p>
                    {"choices" in step && <details className={styles.alternatives}><summary>My screen looks different<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 6 3 3 3-3" /></svg></summary><dl className={styles.choices}>{step.choices.map(choice => <div key={choice.condition}><dt>{choice.condition}</dt><dd>{choice.action}</dd></div>)}</dl></details>}
                    {"actions" in step && ("ordered" in step ? <ol className={guide.plainActions}>{step.actions.map(action => <li key={action}>{action}</li>)}</ol> : <ul className={guide.plainActions}>{step.actions.map(action => <li key={action}>{action}</li>)}</ul>)}
                    {"note" in step && <p className={guide.stepNote}>{step.note}</p>}
                  </div>
                  {"artwork" in step ? <div className={guide.illustration}>{step.artwork === "credentials-email" ? <ShopifyCredentialsEmailArt /> : <ShopifyVerificationArt />}</div> : <ShopifyGuideScreenshot {...step} step={index + 1} />}
                </div>
              </details>
            </li>)}
          </ol>
        </section>
      </div>
    </div>
    <IntegrationGuideStepState />
  </article></Shell>;
}
