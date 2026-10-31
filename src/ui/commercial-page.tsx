import Link from "next/link";
import { COMMERCIAL_PAGES, type CommercialPage as PageContent, type CommercialPath } from "@/modules/public-site/commercial-content";
import { canonicalOrigin } from "@/shared/public-release";
import { publicPageModified } from "@/modules/public-site/metadata";
import { legalIdentity } from "@/shared/legal-identity";
import { hostedServices } from "@/shared/hosted-services";
import { Shell } from "./shell";
import { Icon } from "./icon";
import { CopyContactEmail } from "./copy-contact-email";
import { PaymentPortalLink } from "./service-entry";
import { PaymentOffer } from "./payment-offer";
import { ConsumerNetworks } from "./consumer-layout";
import { AttentionHero, AttentionArt } from "./attention-hero";
import "./attention-pages.css";
import { PaymentDecisionArt } from "./payment-decision-art";
import { ServiceContext, serviceBreadcrumb, type ServiceContextPath } from "./service-context";
import { ServiceWorkflowArt, workflowArtPaths } from "./service-workflow-art";
import "./connected-services.css";
import { ResourceBreadcrumb, companyCrumbs, companyBreadcrumbData, type CompanyContextPath } from "./resource-context";
import "./connected-resources.css";
import { CompanyContextArt } from "./company-context-art";
import "./public-site.css";
import "./brand-pages.css";
import "./commercial-pages.css";
import "./service-craft.css";
import "./company-context.css";
import "./enterprise-support.css";

const artworkIcons: Record<CommercialPath, readonly string[]> = {
  "/merchant-onboarding": ["business", "document", "document", "check"],
  "/payment-methods": ["card", "card", "bank"],
  "/payouts-and-reconciliation": ["card", "layers", "document", "bank"],
  "/refunds-and-disputes": ["card", "arrow", "document"],
  "/pricing": ["card", "document", "business"],
  "/payment-partnerships": ["layers", "business", "document"],
  "/payment-facilitator": ["business", "layers", "bank"],
  "/company": ["business", "layers", "card"],
  "/trust": ["business", "card", "document"],
  "/contact": ["business", "layers", "message"],
  "/ach-payments": ["person", "bank", "document"],
  "/switch-payment-providers": ["document", "layers", "business"],
  "/platform-payment-models": ["business", "card", "layers"],
};

function ServiceDiagram({ path, page }: { path: CommercialPath; page: PageContent }) {
  if ((workflowArtPaths as readonly string[]).includes(path)) return <ServiceWorkflowArt path={path} art={page.art} />;
  if (page.art.layout) return <PaymentDecisionArt art={page.art} />;
  const branch = path === "/refunds-and-disputes";
  const sequence = path === "/merchant-onboarding" || path === "/payouts-and-reconciliation";
  return <figure className={`commercial-diagram${branch ? " is-branch" : ""}${sequence ? " is-sequence" : ""}`}>
    <div className="commercial-diagram-title"><span className="commercial-diagram-mark" aria-hidden="true"><Icon name="layers" /></span><strong>{page.art.title}</strong></div>
    <div className={`commercial-diagram-nodes count-${page.art.steps.length}`}>
      {page.art.steps.map((step, index) => <div className="commercial-diagram-node" key={step.title}>
        <span className="commercial-node-icon"><Icon name={artworkIcons[path][index]} /></span>
        {sequence && <span className="commercial-node-position" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
        <h2>{step.title}</h2><p>{step.detail}</p>
      </div>)}
    </div>
    <figcaption>{page.art.caption}</figcaption>
  </figure>;
}

function CompanyOffices() {
  return <section className="commercial-offices container" aria-labelledby="company-offices-title"><h2 id="company-offices-title">Business contact details.</h2><div>{legalIdentity.offices.map(office => <address key={office.label}><h3>{office.label}</h3>{office.address.map(line => <p key={line}>{line}</p>)}<a className="text-link" href={office.phoneHref}>{office.phone}</a></address>)}</div></section>;
}

function ContactOptions() {
  const inquiries = [
    { id: "platforms", category: "Software platforms", title: "For your software platform", include: "Your software website and the types of businesses that need merchant services.", next: "We’ll explain merchant account requirements, integration options and support for your platform.", note: "A partnership inquiry does not approve or activate merchant accounts.", label: "Email about your platform", href: `${hostedServices.payments.contactHref}?subject=Software%20payment%20partnership` },
    { id: "payment-review", category: "Business owners", title: "For your business", include: "Your business website and what you need from a merchant services provider.", next: "We’ll explain the account requirements, payment options and steps to apply for your business.", note: "An inquiry is not an application or approval. Account terms are confirmed through the application process.", label: "Email about your business", href: `${hostedServices.payments.contactHref}?subject=Payment%20options%20review` },
  ];
  const contacts = [
    { id: "integration", title: "Integration documentation", text: "Request the specifications and access requirements for your service. Include your merchant account status.", label: "Contact the integration team", href: `${hostedServices.payments.contactHref}?subject=Integration%20documentation` },
    { id: "account-support", title: "Merchant account support", text: "Describe the account or payment issue and include any relevant transaction or payout reference.", label: "Contact merchant support", href: hostedServices.payments.contactHref },
    { id: "cards", title: "Card inquiries", text: "Ask about the secured credit card, deposits or wallet support. An inquiry is not an application.", label: "Contact card services", href: hostedServices.cards.contactHref },
    { id: "compliance", title: "Privacy and compliance", text: "Contact us about privacy, data rights or a compliance matter involving the service.", label: "Contact compliance", href: `mailto:${legalIdentity.complianceEmail}` },
  ];
  return <section id="contact-options" className="commercial-contacts container" aria-labelledby="contact-options-title">
    <h2 id="contact-options-title">How can we help?</h2>
    <div className="contact-inquiry-grid">
      {inquiries.map(contact => <article key={contact.id} id={contact.id} aria-labelledby={`${contact.id}-title`}>
        <h3 id={`${contact.id}-title`}>{contact.title}</h3>
        <dl><div><dt>To get started</dt><dd>{contact.include}</dd></div><div><dt>What happens next</dt><dd>{contact.next}</dd></div></dl>
        <p className="contact-inquiry-note">{contact.note}</p>
        <div className="commercial-contact-action"><a className="cta" href={contact.href}>{contact.label}</a><div className="contact-email-tools"><span className="commercial-contact-email">{hostedServices.payments.email}</span><CopyContactEmail email={hostedServices.payments.email} label={`Copy email address for ${contact.category.toLowerCase()}`} /></div></div>
      </article>)}
    </div>
    <section className="contact-existing" aria-labelledby="contact-existing-title">
      <h2 id="contact-existing-title">Account help and integration.</h2>
      <div className="commercial-contact-list">
        {contacts.map(contact => <article key={contact.id} id={contact.id}><div><h3>{contact.title}</h3><p>{contact.text}</p></div><div className="commercial-contact-action"><a className="text-link" href={contact.href}>{contact.label}<Icon name="mail" /></a><span className="commercial-contact-email">{contact.href.slice("mailto:".length).split("?")[0]}</span></div></article>)}
      </div>
    </section>
    <div className="contact-application" id="merchant-application"><div><h2>Ready to apply?</h2><p>Merchant applications open at Trolleys, an Etail Depot service. Submit business documents through the secure account service. Account approval and setup apply.</p></div><PaymentPortalLink className="text-link">Open merchant application</PaymentPortalLink></div>
  </section>;
}

export function CommercialPage({ path }: { path: CommercialPath }) {
  const page: PageContent = COMMERCIAL_PAGES[path];
  const attention = path === "/switch-payment-providers" ? " attention-site attention-provider" : path === "/pricing" ? " attention-site attention-pricing" : "";
  const url = canonicalOrigin + path;
  const refined = !["/company", "/trust", "/contact", "/payment-facilitator"].includes(path);
  const contextKind = path === "/company" ? "company" : path === "/trust" ? "trust" : path === "/payment-facilitator" ? "facilitator" : undefined;
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": path === "/company" ? "AboutPage" : path === "/contact" ? "ContactPage" : "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description, inLanguage: "en-US", dateModified: publicPageModified(path), isPartOf: { "@id": `${canonicalOrigin}/#website` }, publisher: { "@id": `${canonicalOrigin}/#organization` }, breadcrumb: { "@id": `${url}#breadcrumb` } },
    ...(refined ? [serviceBreadcrumb(path as ServiceContextPath)] : [companyBreadcrumbData(path as CompanyContextPath)]),
  ] };
  return <Shell><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><div className={`brand-page commercial-page enterprise-support${attention}${refined ? ` service-craft cw-commercial${page.art.layout || path === "/pricing" ? " service-craft-wide" : ""}` : ` company-context cw-company company-context-${contextKind ?? "contact"}`}`}>
    {refined ? <ServiceContext path={path as ServiceContextPath} /> : <div className="container"><ResourceBreadcrumb items={companyCrumbs(path as CompanyContextPath)} /></div>}
    {path === "/switch-payment-providers" ? <AttentionHero id="provider-review-title" label="Changing payment providers"
      title={<>Declined by Stripe?{" "}<em>Let’s look at your business.</em></>}
      intro={page.intro}
      actions={<><Link href={page.action.href}>{page.action.label}</Link><Link href="#service-section-1">How switching works</Link></>}
      note={page.note}
      artwork={<AttentionArt kind="provider" />}
    /> : <section className="commercial-hero"><div className="container">
      <div className="commercial-hero-copy"><div><p className="eyebrow">{page.label}</p><h1>{page.heading}</h1></div><div><p className="commercial-lead">{page.intro}</p>
        {path !== "/contact" && <div className="commercial-action">{page.action.href === "https://trolleys.ai" ? <PaymentPortalLink className="cta">{page.action.label}</PaymentPortalLink> : <Link className="cta" href={page.action.href}>{page.action.label}<Icon name="arrow" /></Link>}{page.secondaryAction && <Link className="text-link" href={page.secondaryAction.href}>{page.secondaryAction.label}</Link>}</div>}
        {page.note && <p className="commercial-note">{page.note}</p>}
      </div></div>
      {contextKind ? <CompanyContextArt kind={contextKind} /> : path !== "/pricing" && path !== "/contact" && <ServiceDiagram path={path} page={page} />}
    </div></section>}
    {path === "/pricing" && <PaymentOffer />}
    {path === "/contact" && <ContactOptions />}
    {path === "/payment-methods" && <div className="commercial-methods container"><ConsumerNetworks /></div>}
    {page.sections.map((section, index) => <section aria-labelledby={refined ? `service-section-${index + 1}` : undefined} className={`commercial-section${index % 2 ? " commercial-section-tint" : ""}`} key={section.title}><div className="container commercial-section-grid"><div><span className="commercial-section-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h2 id={refined ? `service-section-${index + 1}` : undefined}>{section.title}</h2>{section.intro && <p>{section.intro}</p>}</div><dl className="commercial-details">{section.items.map(item => <div key={item.title}><dt>{item.href ? <Link href={item.href}>{item.title}</Link> : item.title}</dt><dd>{item.text}</dd></div>)}</dl></div></section>)}
    {path === "/company" && <CompanyOffices />}
    {path === "/payment-facilitator" && <aside className="commercial-source container" aria-label="Model reference"><p>For the network’s description of participant roles, see <a href="https://usa.visa.com/content/dam/VCOM/global/support-legal/documents/visa-payment-facilitator-model.pdf">Visa’s payment facilitator model</a>. The service relationship follows the applicable network rules and account agreements.</p></aside>}
  </div></Shell>;
}
