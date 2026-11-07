import "./site-artwork-polish-company.css";
import type { ServiceDetailPath } from "@/modules/public-site/service-detail-content";
import { CommercialStructuredData } from "./commercial-structured-data";
import Link from "next/link";
import { hostedServices } from "@/shared/hosted-services";
import { COMMERCIAL_PAGES, type CommercialPage as PageContent, type CommercialPath } from "@/modules/public-site/commercial-content";
import { Shell } from "./shell";
import { Icon } from "./icon";
import { PaymentPortalLink } from "./service-entry";
import { PaymentOffer } from "./payment-offer";
import { AttentionHero, AttentionArt } from "./attention-hero";
import "./attention-pages.css";
import { PaymentDecisionArt } from "./payment-decision-art";
import { ServiceWorkflowArt, workflowArtPaths } from "./service-workflow-art";
import "./connected-services.css";
import "./connected-resources.css";
import { CompanyContextArt } from "./company-context-art";
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


export function CommercialPage({ path }: { path: Exclude<CommercialPath, ServiceDetailPath | "/company" | "/contact"> }) {
  const page: PageContent = COMMERCIAL_PAGES[path];
  const attention = path === "/switch-payment-providers" ? " attention-site attention-provider" : path === "/pricing" ? " attention-site attention-pricing" : "";
  const refined = !["/trust", "/payment-facilitator"].includes(path);
  const contextKind = path === "/trust" ? "trust" : path === "/payment-facilitator" ? "facilitator" : undefined;
  return <Shell><CommercialStructuredData path={path} /><div className={`brand-page commercial-page enterprise-support${attention}${refined ? ` service-craft cw-commercial${page.art.layout || path === "/pricing" ? " service-craft-wide" : ""}` : ` company-context cw-company company-context-${contextKind ?? "contact"}`}`}>
    {path === "/switch-payment-providers" ? <AttentionHero id="provider-review-title" label="Changing payment providers"
      title={<>Declined by Stripe?{" "}<em>Let’s look at your business.</em></>}
      intro={page.intro}
      actions={<><Link href={page.action.href}>{page.action.label}</Link><Link href="#service-section-1">How switching works</Link></>}
      note={page.note}
      artwork={<AttentionArt kind="provider" />}
    /> : <section className="commercial-hero"><div className="container">
      <div className="commercial-hero-copy"><div>{page.label !== page.heading.replace(/\.$/, "") && <p className="eyebrow">{page.label}</p>}<h1>{page.heading}</h1></div><div><p className="commercial-lead">{page.intro}</p>
        <div className="commercial-action">{page.action.href === hostedServices.payments.registrationUrl ? <PaymentPortalLink intent="register" className="cta">{page.action.label}</PaymentPortalLink> : <Link className="cta" href={page.action.href}>{page.action.label}<Icon name="arrow" /></Link>}{page.secondaryAction && <Link className="text-link" href={page.secondaryAction.href}>{page.secondaryAction.label}</Link>}</div>
        {page.note && <p className="commercial-note">{page.note}</p>}
      </div></div>
      {contextKind ? <CompanyContextArt kind={contextKind} /> : path !== "/pricing" && <ServiceDiagram path={path} page={page} />}
    </div></section>}
    {path === "/pricing" && <PaymentOffer />}
    {page.sections.map((section, index) => <section id={section.id} aria-labelledby={refined ? `service-section-${index + 1}` : undefined} className={`commercial-section${index % 2 ? " commercial-section-tint" : ""}${section.layout ? ` service-purpose-${section.layout}` : ""}${section.records ? " service-purpose-records" : ""}`} key={section.title}><div className="container commercial-section-grid"><div><span className="commercial-section-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h2 id={refined ? `service-section-${index + 1}` : undefined}>{section.title}</h2>{section.intro && <p>{section.intro}</p>}{section.records && <figure className="service-record-art" aria-label={`${section.title} Connected records`}><ol>{section.records.map((record, recordIndex) => <li key={record.label}><span aria-hidden="true">{String(recordIndex + 1).padStart(2, "0")}</span><div><strong>{record.label}</strong><p>{record.detail}</p></div></li>)}</ol></figure>}</div><dl className="commercial-details">{section.items.map((item, itemIndex) => <div id={item.id} key={item.title}><dt>{section.layout && <span className="service-purpose-index" aria-hidden="true">{section.layout === "steps" ? String(itemIndex + 1).padStart(2, "0") : <Icon name={itemIndex === 2 ? "bank" : "card"} />}</span>}{item.href ? <Link href={item.href}>{item.title}</Link> : item.title}</dt><dd>{item.text}</dd></div>)}</dl></div></section>)}
    {path === "/payment-facilitator" && <aside className="commercial-source container" aria-label="Model reference"><p>For the network’s description of participant roles, see <a href="https://usa.visa.com/content/dam/VCOM/global/support-legal/documents/visa-payment-facilitator-model.pdf">Visa’s payment facilitator model</a>. The service relationship follows the applicable network rules and account agreements.</p></aside>}
  </div></Shell>;
}
