import Link from "next/link";
import { customerJourneys } from "@/modules/public-site/customer-journeys";
import { servicePageMetadata, platformPageJsonLd } from "@/modules/public-site/metadata";
import { industryCases } from "@/modules/public-site/industry-content";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";
import { PlatformPaymentArt, PlatformIndustryArt } from "@/ui/platform-experience-art";
import { ServiceSectionNav } from "@/ui/service-section-nav";
import "@/ui/public-site.css";
import "@/ui/consumer-site.css";
import "@/ui/platform-experience.css";

export const metadata = servicePageMetadata("/software-partners");
const partnerEmail = "mailto:trolleys@etaildepot.com?subject=Software%20payment%20partnership";

const sectors = [
  { page: industryCases.marketplaces, caption: "Keep seller orders, customer payments and refunds connected through to reconciliation." },
  { page: industryCases.freight, caption: "Match customer payments to freight invoices, loads and shipment references." },
  { page: industryCases.travel, caption: "Keep planning fees distinct from booking payments, with a clear record when plans change." },
  { page: industryCases.legal, caption: "Connect legal billing to the matter, the invoice and the right receiving account." },
];
const journey = [
  { title: "Onboard the business", body: "Confirm the business activity, account owner and payout destination. Each merchant needs approval before accepting payments." },
  { title: "Accept the payment", body: "Add checkout to the agreed customer journey, with the order, invoice or booking reference attached to the payment." },
  { title: "Reconcile the deposit", body: "Match each payout to the bank deposit, with refunds and adjustments tied to the original payment." },
];
const integration = [
  { title: "Account structure", detail: "Which business owns each merchant account and who can access it." },
  { title: "Checkout", detail: "Where customers pay and which methods the account supports." },
  { title: "Payment updates", detail: "How payment results reach your software and link to the right record." },
  { title: "Reconciliation", detail: "How payments, fees and adjustments match the bank deposit." },
];

export default function SoftwarePartnersPage() {
  return <Shell quietAccess><div className="consumer-page platform-experience">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: platformPageJsonLd("/software-partners") }} />
    <ServiceSectionNav title="Software platforms" links={[
      { href: "#industries", label: "Industries" },
      { href: "#payment-experience", label: "Payment journey" },
      { href: "#integration", label: "Integration" },
      { href: "#partner-commercial-title", label: "Pricing" },
      { href: "#partner-contact", label: "Contact" },
    ]} />
    <section className="platform-opening" aria-labelledby="partner-title"><div className="page-container platform-opening-grid">
      <div className="platform-opening-copy"><p className="eyebrow">Software platforms</p><h1 id="partner-title">Payment processing for software platforms.</h1><p className="platform-opening-intro">Connect merchant accounts, card and ACH payments, and reconciliation to your software. For commerce marketplaces, freight, travel and legal businesses.</p><a className="button primary" href="#partner-contact">Talk to our team<Icon name="arrow" /></a></div>
      <PlatformPaymentArt />
    </div></section>

    <section className="page-container platform-industries" id="industries" aria-labelledby="industries-title">
      <div className="platform-section-heading"><h2 id="industries-title">Every industry has its<br /> own payment needs.</h2><p>Connect each payment to the order, shipment, trip or legal matter it belongs to.</p></div>
      <div className="platform-case-grid">{sectors.map(({page, caption}) => <article className="platform-case" id={page.slug} key={page.slug} aria-labelledby={`${page.slug}-title`}>
        <PlatformIndustryArt industry={page.slug} />
        <div className="platform-case-copy"><h3 id={`${page.slug}-title`}>{page.label}</h3><p className="platform-case-intro">{caption}</p>
          <details className="platform-case-details">
            <summary aria-label={`${page.label}: payment flow and account requirements`}>Payment flow and account requirements<span className="platform-case-toggle" aria-hidden="true">+</span></summary>
            <div className="platform-case-expanded"><p className="platform-case-context">{page.intro}</p><h4>{page.workflowTitle}</h4><ol className="platform-case-steps">{page.workflow.map((step, i) => <li key={step.title}><span className="platform-step-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><div><h5>{step.title}</h5><p>{step.body}</p></div></li>)}</ol><div className="platform-case-scope"><h4>{page.scopeTitle}</h4><p>{page.scope}</p></div></div>
          </details>
        </div>
      </article>)}</div>
      <p className="platform-eligibility">Business activity and payment flow are reviewed for each merchant. Availability is confirmed before integration.</p>
    </section>

    <section className="platform-journey-section" id="payment-experience" aria-labelledby="experience-title"><div className="page-container">
      <div className="platform-section-heading"><div><p className="eyebrow">The merchant journey</p><h2 id="experience-title">From merchant account<br /> to bank deposit.</h2></div><p>Keep the customer’s order, invoice or booking reference with every payment.</p></div>
      <ol className="platform-journey-list" role="list">{journey.map((step, i) => <li key={step.title}><span className="platform-journey-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
    </div></section>

    <section className="page-container platform-integration-section" id="integration" aria-labelledby="integration-title">
      <div className="platform-integration-intro"><p className="eyebrow">Integration</p><h2 id="integration-title">Keep the payment connected<br /> to your software.</h2><p>Plan the account structure, payment flow and records your software needs. Our integration team provides documentation and access for the agreed setup.</p><Link href={customerJourneys.platform.documentation} className="platform-inline-link">{customerJourneys.platform.documentationLabel}<Icon name="arrow" /></Link></div>
      <dl className="platform-integration-details">{integration.map(({title,detail},i)=><div key={title}><dt><span aria-hidden="true">{String(i+1).padStart(2,"0")}</span>{title}</dt><dd>{detail}</dd></div>)}</dl>
    </section>

    <section className="platform-commercial-section" aria-labelledby="partner-commercial-title"><div className="page-container platform-commercial-inner">
      <div><p className="eyebrow">Commercial terms</p><h2 id="partner-commercial-title">Know the costs<br /> before you build.</h2></div>
      <div className="platform-commercial-details"><div><h3>Payment processing</h3><p>Card fees apply per payment. ACH pricing and funding terms are confirmed separately.</p><Link href="/payment-acceptance-service#fees" className="platform-inline-link">View processing fees<Icon name="arrow" /></Link></div><div><h3>Platform arrangement</h3><p>Agree implementation scope and service charges for your workflow and account structure.</p></div></div>
    </div></section>

    <section className="page-container platform-questions-section" aria-labelledby="partner-questions-title"><div><p className="eyebrow">Before we talk</p><h2 id="partner-questions-title">Your questions.</h2></div><div className="public-questions">
      <details><summary>Our payment provider cannot support some customers. Can you help?<span aria-hidden="true">+</span></summary><p>We can review the businesses and payment activities your current provider cannot support. Tell us what changed or why the arrangement does not fit. Each merchant and payment flow needs approval before integration.</p></details>
      <details><summary>Would we need to move every customer?<span aria-hidden="true">+</span></summary><p>We agree the scope before planning a move. Existing contracts, merchant accounts, saved payment details and open transactions can affect what is possible. A selective rollout or data transfer needs confirmation.</p></details>
      <details><summary>What happens after we contact you?<span aria-hidden="true">+</span></summary><p>We start with the businesses you serve and the payments they need to accept. If the activity is eligible, we agree the account structure, integration requirements and commercial terms before implementation.</p></details>
    </div></section>

    <section className="platform-contact-section" id="partner-contact" aria-labelledby="contact-title"><div className="page-container platform-contact-inner"><h2 id="contact-title">Tell us how your<br /> customers get paid.</h2><div><p>Share the businesses you serve, how they accept payments and what your current provider cannot support.</p><a href={partnerEmail} className="button primary">Email our payments team<Icon name="arrow" /></a></div></div></section>
  </div></Shell>;
}
