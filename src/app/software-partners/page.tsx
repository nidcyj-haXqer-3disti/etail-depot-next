import Link from "next/link";
import { customerJourneys } from "@/modules/public-site/customer-journeys";
import { servicePageMetadata } from "@/modules/public-site/metadata";
import { PlatformServicesArt } from "@/ui/service-blueprint-art";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { PlatformOnboardingArt, PlatformCheckoutArt, PlatformPayoutArt, PlatformIntegrationArt } from "@/ui/partner-workflow-art";
import { ServiceSectionNav } from "@/ui/service-section-nav";
import "@/ui/public-site.css";
import "@/ui/consumer-site.css";
import "@/ui/partner-page.css";
import "@/ui/service-blueprint.css";

export const metadata = servicePageMetadata("/software-partners");

const partnerEmail = "mailto:trolleys@etaildepot.com?subject=Software%20payment%20partnership";

const paymentJourney = [
  {
    title: "Onboarding",
    action: "Connect a merchant account",
    handoff: "Application",
    returns: false,
    artwork: <PlatformOnboardingArt />,
  },
  {
    title: "Checkout",
    action: "Connect the order to checkout",
    handoff: "Order reference",
    returns: false,
    artwork: <PlatformCheckoutArt />,
  },
  {
    title: "Payouts",
    action: "Match payments to payout records",
    handoff: "Payment and payout records",
    returns: true,
    artwork: <PlatformPayoutArt />,
  },
];

const integrationOverview = [
  {
    task: "Checkout",
    description: "Keep order and payment references together. Confirm payment before fulfillment; submission alone is not confirmation.",
  },
  {
    task: "Data and permissions",
    description: "We agree which records your software receives, how they arrive and when they update. Refund and dispute actions require separate permissions.",
  },
  {
    task: "Support",
    description: "Agree account roles and support responsibilities before implementation. A software connection does not waive merchant approval or grant unrestricted account access.",
  },
];

export default function SoftwarePartnersPage() {
  return <Shell quietAccess>
    <div className="consumer-page partner-page service-blueprint">
      <ServiceSectionNav title="Software platforms" links={[
        { href: "#payment-experience", label: "Merchant journey" },
        { href: "#integration", label: "Integration" },
        { href: "#partner-commercial-title", label: "Pricing" },
        { href: "#partner-contact", label: "Contact" },
      ]} />
      <section className="partner-hero" aria-labelledby="partner-title">
        <div className="page-container partner-hero-grid">
          <div className="partner-hero-copy">
            <h1 id="partner-title">Payment processing <br /><span>for software platforms.</span></h1>
            <p className="partner-intro">Connect US businesses using your software to merchant accounts, checkout and payouts.</p>
            <div className="partner-actions">
              <a className="button primary" href="#partner-contact">Talk to our payments team<Icon name="arrow" /></a>
            </div>
            <p className="partner-hero-note">Each merchant needs an approved account before accepting payments.</p>
          </div>
          <PlatformServicesArt />
        </div>
      </section>


      <section className="page-container partner-section" id="payment-experience" aria-labelledby="experience-title">
        <div className="partner-section-heading">
          <div><p className="eyebrow">Merchant journey</p><h2 id="experience-title">From account setup <span>to payout.</span></h2></div>
        </div>
        <div className="platform-journey-owner"><Icon name="layers" /><span>Your software</span></div>
        <ol className="platform-journey" role="list">
          {paymentJourney.map((step, index) => <li key={step.title}>
            <div className="platform-software-step">
              <span className="platform-mobile-owner">Your software</span>
              <div className="platform-journey-heading">
                <span className="platform-step" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
              </div>
              <p>{step.action}</p>
            </div>
            <div className={`platform-journey-handoff${step.returns ? " platform-journey-handoff--return" : ""}`}>
              <Icon name="arrow" /><span>{step.handoff}</span>
            </div>
            {step.artwork}
          </li>)}
        </ol>
      </section>

      <section className="partner-integration" id="integration" aria-labelledby="integration-title">
        <div className="page-container partner-section">
          <div className="partner-section-heading">
            <div><p className="eyebrow">Integration</p><h2 id="integration-title">Connect payments<br /><span>to your workflow.</span></h2></div>
            <p>Match order references with payment and payout records.</p>
          </div>
          <PlatformIntegrationArt />
          <div className="platform-integration-notes">
            <h3>Your integration.</h3>
            <div>
              <div className="partner-function-details">
                {integrationOverview.map(item => <details key={item.task}>
                  <summary>{item.task}<span aria-hidden="true" /></summary>
                  <p className="partner-function-copy">{item.description}</p>
                </details>)}
              </div>
              <Link href={customerJourneys.platform.documentation} className="consumer-text-link partner-documentation-link">{customerJourneys.platform.documentationLabel}<Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container partner-commercial" aria-labelledby="partner-commercial-title">
        <div>
          <p className="eyebrow">Pricing</p>
          <h2 id="partner-commercial-title">Processing fees.<br /><span>Platform terms.</span></h2>
        </div>
        <div className="partner-commercial-copy">
          <p>Card processing fees apply per payment. Platform implementation and service charges are agreed separately.</p>
          <p>ACH pricing and funding terms are confirmed separately.</p>
          <Link href="/payment-acceptance-service#fees" className="consumer-text-link">View processing fees<Icon name="arrow" /></Link>
        </div>
      </section>

      <section className="page-container partner-section partner-questions" aria-labelledby="partner-questions-title">
        <div className="partner-section-intro">
          <h2 id="partner-questions-title">Platform questions.</h2>
        </div>
        <div className="public-questions">
          <details><summary>Can the businesses using my software apply?<span aria-hidden="true">+</span></summary><p>Independent US businesses using your software can apply to accept payments in USD from their own customers. Each business needs its own account review.</p></details>
          <details><summary>Can we handle refunds and disputes in our software?<span aria-hidden="true">+</span></summary><p>That depends on the merchant’s permissions and your service agreement. Refund and dispute fees, deadlines and service rules still apply, and no dispute outcome is guaranteed.</p></details>
          <details><summary>When will our merchants get paid?<span aria-hidden="true">+</span></summary><p>Each merchant has an agreed funding schedule. Reviews, holds and bank processing can affect when the money arrives. ACH timing is confirmed separately.</p></details>
        </div>
      </section>

      <section className="page-container partner-contact-wrap" id="partner-contact" aria-labelledby="contact-title">
        <div className="partner-contact">
          <div><h2 id="contact-title">Let’s talk about <span>your platform.</span></h2></div>
          <div>
            <p>Tell us about your software, the businesses it serves and how their customers pay.</p>
            <a href={partnerEmail} className="button primary">Email our payments team<Icon name="mail" /></a>
          </div>
        </div>
      </section>
    </div>
  </Shell>;
}
