import type { ReactNode } from "react";
import type { CommercialPage as PageContent } from "./page-content-types";
import "./artwork/site-artwork-polish-company.css";
import { CommercialStructuredData } from "../seo/commercial-structured-data";
import Link from "next/link";
import { hostedServices } from "@/shared/site/hosted-services";
import { Shell } from "../layout/shell";
import { Icon } from "./icon";
import { PaymentPortalLink } from "./merchant-portal-link";
import "../styles/attention-pages.css";
import "../styles/connected-services.css";
import "../styles/connected-resources.css";
import "../styles/public-site.css";
import "../styles/brand-pages.css";
import "../styles/commercial-pages.css";
import "../styles/service-purpose.css";
import "../styles/service-craft.css";
import "../styles/company-context.css";
import "../styles/enterprise-support.css";

export function CommercialPage({ path, page, hero, artwork, offer, source }: { path: string; page: PageContent; hero?: ReactNode; artwork?: ReactNode; offer?: ReactNode; source?: ReactNode }) {
  const attention = path === "/switch-payment-providers" ? " attention-site attention-provider" : path === "/pricing" ? " attention-site attention-pricing" : "";
  const refined = !["/trust", "/payment-facilitator"].includes(path);
  const contextKind = path === "/trust" ? "trust" : path === "/payment-facilitator" ? "facilitator" : undefined;
  return <Shell><CommercialStructuredData path={path} page={page} /><div className={`brand-page commercial-page enterprise-support${attention}${refined ? ` service-craft cw-commercial${page.art.layout || path === "/pricing" ? " service-craft-wide" : ""}` : ` company-context cw-company company-context-${contextKind ?? "contact"}`}`}>
    {hero ?? <section className="commercial-hero"><div className="container">
      <div className="commercial-hero-copy"><div>{page.label !== page.heading.replace(/\.$/, "") && <p className="eyebrow">{page.label}</p>}<h1>{page.heading}</h1></div><div><p className="commercial-lead">{page.intro}</p>
        <div className="commercial-action">{page.action.href === hostedServices.payments.registrationUrl ? <PaymentPortalLink intent="register" className="cta">{page.action.label}</PaymentPortalLink> : <Link className="cta" href={page.action.href}>{page.action.label}<Icon name="arrow" /></Link>}{page.secondaryAction && <Link className="text-link" href={page.secondaryAction.href}>{page.secondaryAction.label}</Link>}</div>
        {page.note && <p className="commercial-note">{page.note}</p>}
      </div></div>
      {artwork}
    </div></section>}
    {offer}
    {page.sections.map((section, index) => <section id={section.id} aria-labelledby={refined ? `service-section-${index + 1}` : undefined} className={`commercial-section${index % 2 ? " commercial-section-tint" : ""}${section.layout ? ` service-purpose-${section.layout}` : ""}${section.records ? " service-purpose-records" : ""}`} key={section.title}><div className="container commercial-section-grid"><div><span className="commercial-section-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h2 id={refined ? `service-section-${index + 1}` : undefined}>{section.title}</h2>{section.intro && <p>{section.intro}</p>}{section.records && <figure className="service-record-art" aria-label={`${section.title} Connected records`}><ol>{section.records.map((record, recordIndex) => <li key={record.label}><span aria-hidden="true">{String(recordIndex + 1).padStart(2, "0")}</span><div><strong>{record.label}</strong><p>{record.detail}</p></div></li>)}</ol></figure>}</div><dl className="commercial-details">{section.items.map((item, itemIndex) => <div id={item.id} key={item.title}><dt>{section.layout && <span className="service-purpose-index" aria-hidden="true">{section.layout === "steps" ? String(itemIndex + 1).padStart(2, "0") : <Icon name={itemIndex === 2 ? "bank" : "card"} />}</span>}{item.href ? <Link href={item.href}>{item.title}</Link> : item.title}</dt><dd>{item.text}</dd></div>)}</dl></div></section>)}
    {source}
  </div></Shell>;
}
