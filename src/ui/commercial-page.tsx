import { isServiceDetailPath } from "@/modules/public-site/service-detail-content";
import { ServiceDetailPage } from "./service-detail-page";
import Link from "next/link";
import { COMMERCIAL_PAGES, type CommercialPage as PageContent, type CommercialPath } from "@/modules/public-site/commercial-content";
import { canonicalOrigin } from "@/shared/public-release";
import { publicPageModified } from "@/modules/public-site/metadata";
import { legalIdentity } from "@/shared/legal-identity";
import { hostedServices } from "@/shared/hosted-services";
import { Shell } from "./shell";
import { Icon } from "./icon";
import { PaymentPortalLink } from "./service-entry";
import { PaymentOffer } from "./payment-offer";
import { AttentionHero, AttentionArt } from "./attention-hero";
import "./attention-pages.css";
import { PaymentDecisionArt } from "./payment-decision-art";
import { serviceBreadcrumb, type ServiceContextPath } from "./service-context";
import { ServiceWorkflowArt, workflowArtPaths } from "./service-workflow-art";
import "./connected-services.css";
import { companyBreadcrumbData, type CompanyContextPath } from "./resource-context";
import "./connected-resources.css";
import { CompanyContextArt } from "./company-context-art";
import { AboutPageContent } from "./about-page";
import { ContactHero } from "./contact-hero";
import "./public-site.css";
import "./brand-pages.css";
import "./commercial-pages.css";
import "./service-purpose.css";
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
  "/reconciliation": ["card", "document", "bank"],
  "/disputes": ["document", "box", "message"],
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

function ContactOptions() {
  const contacts = [
    { id: "integration", bookmark: "platforms", title: "Integration documentation", text: "Request documentation and access requirements for your service. Include your merchant account status.", label: "Contact the integration team", href: `${hostedServices.payments.contactHref}?subject=Integration%20documentation` },
    { id: "account-support", bookmark: "payment-review", title: "Merchant account support", text: "Describe the account or payment issue and include any relevant transaction or payout reference.", label: "Contact merchant support", href: hostedServices.payments.contactHref },
    { id: "cards", title: "Card inquiries", text: "Ask about the secured credit card, deposits or wallet support. An inquiry is not an application.", label: "Contact card services", href: hostedServices.cards.contactHref },
    { id: "compliance", title: "Privacy and compliance", text: "Contact us about privacy, data rights or a compliance matter involving the service.", label: "Contact compliance", href: `mailto:${legalIdentity.complianceEmail}` },
  ];
  return <section id="contact-options" className="commercial-contacts container" aria-labelledby="contact-existing-title">
    <section className="contact-existing" aria-labelledby="contact-existing-title">
      <h2 id="contact-existing-title">Account help and integration.</h2>
      <div className="commercial-contact-list">
        {contacts.map(contact => <article key={contact.id} id={contact.id}><div><h3 id={contact.bookmark}>{contact.title}</h3><p>{contact.text}</p></div><div className="commercial-contact-action"><a className="text-link" href={contact.href}>{contact.label}<Icon name="mail" /></a><span className="commercial-contact-email">{contact.href.slice("mailto:".length).split("?")[0]}</span></div></article>)}
      </div>
    </section>
    <div className="contact-application" id="merchant-application"><div><h2>Ready to apply?</h2><p>Merchant applications open at Trolleys, an Etail Depot service. Submit business documents through the secure account service. Account approval and setup apply.</p></div><PaymentPortalLink className="text-link">Open merchant application</PaymentPortalLink></div>
  </section>;
}

export function CommercialPage({ path }: { path: CommercialPath }) {
  if (isServiceDetailPath(path)) return <ServiceDetailPage path={path} />;
  const page: PageContent = COMMERCIAL_PAGES[path];
  const attention = path === "/switch-payment-providers" ? " attention-site attention-provider" : path === "/pricing" ? " attention-site attention-pricing" : "";
  const url = canonicalOrigin + path;
  const refined = !["/company", "/trust", "/contact", "/payment-facilitator"].includes(path);
  const contextKind = path === "/company" ? "company" : path === "/trust" ? "trust" : path === "/payment-facilitator" ? "facilitator" : undefined;
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": path === "/company" ? "AboutPage" : path === "/contact" ? "ContactPage" : "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description, inLanguage: "en-US", dateModified: publicPageModified(path), isPartOf: { "@id": `${canonicalOrigin}/#website` }, publisher: { "@id": `${canonicalOrigin}/#organization` }, breadcrumb: { "@id": `${url}#breadcrumb` } },
    ...(refined ? [serviceBreadcrumb(path as ServiceContextPath)] : [companyBreadcrumbData(path as CompanyContextPath)]),
  ] };
  if (path === "/company") return <Shell><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><AboutPageContent page={page} /></Shell>;
  return <Shell><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><div className={`brand-page commercial-page enterprise-support${attention}${refined ? ` service-craft cw-commercial${page.art.layout || path === "/pricing" ? " service-craft-wide" : ""}` : ` company-context cw-company company-context-${contextKind ?? "contact"}`}`}>
    {path === "/contact" ? <ContactHero heading={page.heading} intro={page.intro} /> : path === "/switch-payment-providers" ? <AttentionHero id="provider-review-title" label="Changing payment providers"
      title={<>Declined by Stripe?{" "}<em>Let’s look at your business.</em></>}
      intro={page.intro}
      actions={<><Link href={page.action.href}>{page.action.label}</Link><Link href="#service-section-1">How switching works</Link></>}
      note={page.note}
      artwork={<AttentionArt kind="provider" />}
    /> : <section className="commercial-hero"><div className="container">
      <div className="commercial-hero-copy"><div><p className="eyebrow">{page.label}</p><h1>{page.heading}</h1></div><div><p className="commercial-lead">{page.intro}</p>
        <div className="commercial-action">{page.action.href === "https://trolleys.ai" ? <PaymentPortalLink className="cta">{page.action.label}</PaymentPortalLink> : <Link className="cta" href={page.action.href}>{page.action.label}<Icon name="arrow" /></Link>}{page.secondaryAction && <Link className="text-link" href={page.secondaryAction.href}>{page.secondaryAction.label}</Link>}</div>
        {page.note && <p className="commercial-note">{page.note}</p>}
      </div></div>
      {contextKind ? <CompanyContextArt kind={contextKind} /> : path !== "/pricing" && <ServiceDiagram path={path} page={page} />}
    </div></section>}
    {path === "/pricing" && <PaymentOffer />}
    {path === "/contact" && <ContactOptions />}
    {page.sections.map((section, index) => <section id={section.id} aria-labelledby={refined ? `service-section-${index + 1}` : undefined} className={`commercial-section${index % 2 ? " commercial-section-tint" : ""}${section.layout ? ` service-purpose-${section.layout}` : ""}${section.records ? " service-purpose-records" : ""}`} key={section.title}><div className="container commercial-section-grid"><div><span className="commercial-section-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h2 id={refined ? `service-section-${index + 1}` : undefined}>{section.title}</h2>{section.intro && <p>{section.intro}</p>}{section.records && <figure className="service-record-art" aria-label={`${section.title} Connected records`}><ol>{section.records.map((record, recordIndex) => <li key={record.label}><span aria-hidden="true">{String(recordIndex + 1).padStart(2, "0")}</span><div><strong>{record.label}</strong><p>{record.detail}</p></div></li>)}</ol></figure>}</div><dl className="commercial-details">{section.items.map((item, itemIndex) => <div id={item.id} key={item.title}><dt>{section.layout && <span className="service-purpose-index" aria-hidden="true">{section.layout === "steps" ? String(itemIndex + 1).padStart(2, "0") : <Icon name={itemIndex === 2 ? "bank" : "card"} />}</span>}{item.href ? <Link href={item.href}>{item.title}</Link> : item.title}</dt><dd>{item.text}</dd></div>)}</dl></div></section>)}
    {path === "/payment-facilitator" && <aside className="commercial-source container" aria-label="Model reference"><p>For the network’s description of participant roles, see <a href="https://usa.visa.com/content/dam/VCOM/global/support-legal/documents/visa-payment-facilitator-model.pdf">Visa’s payment facilitator model</a>. The service relationship follows the applicable network rules and account agreements.</p></aside>}
  </div></Shell>;
}
