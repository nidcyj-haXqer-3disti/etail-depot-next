import type { ReactNode } from "react";
import Link from "next/link";
import type { PublicPath } from "@/modules/public-site/metadata";
import { PUBLISHED_GUIDES } from "@/modules/public-site/guide-catalog";
import { PublicPageStructuredData } from "@/modules/public-site/structured-data";
import { legalIdentity } from "@/shared/legal-identity";
import { Shell } from "./shell";
import { PaymentPortalLink } from "./service-entry";
import { PaymentGuides } from "./payment-guides";
import "./payment-guide.css";

type GuideSection = { id: string; title: string; content: ReactNode };
type GuideSource = { title: string; href: string };

export function GuideSourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} rel="external noreferrer" referrerPolicy="no-referrer">{children}</a>;
}

export function GuideTable({ caption, headings, rows }: {
  caption: string;
  headings: string[];
  rows: ReactNode[][];
}) {
  return <div className="payment-guide-table-wrap">
    <p className="payment-guide-table-hint">Scroll the table sideways to compare all columns.</p>
    <div className="payment-guide-table-scroll" role="region" aria-label={caption} tabIndex={0}>
    <table>
      <caption><span>{caption}</span></caption>
      <thead><tr>{headings.map(heading => <th scope="col" key={heading}>{heading}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => cellIndex === 0
        ? <th scope="row" key={cellIndex}>{cell}</th>
        : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
    </table>
    </div>
  </div>;
}

export function PaymentGuide({ path, title, intro, sections, sources, disclosure, numberedContents = true, privateDraft = false, cta = "payment-acceptance", relatedPaths }: {
  path: string;
  privateDraft?: boolean;
  relatedPaths?: string[];
  cta?: "payment-acceptance" | "credit-card";
  title: string;
  intro: string;
  sections: GuideSection[];
  sources: GuideSource[];
  disclosure?: ReactNode;
  numberedContents?: boolean;
}) {
  const ContentsList = numberedContents ? "ol" : "ul";
  const breadcrumbTitle = PUBLISHED_GUIDES.find(guide => guide.path === path)?.title ?? title;
  return <Shell>
    {!privateDraft && <PublicPageStructuredData path={path as PublicPath} />}
    <div className="payment-guide">
      <header className="payment-guide-header">
        <div className="page-container">
          <nav className="payment-guide-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/guides">Guides</Link></li>
              <li aria-current="page">{breadcrumbTitle}</li>
            </ol>
          </nav>
          <div className="payment-guide-heading">
            <p className="eyebrow">Merchant guides</p>
            <h1 id="payment-guide-title">{title}</h1>
            <p className="payment-guide-intro">{intro}</p>
            <p className="payment-guide-byline">{privateDraft ? "Private draft for review · " : "Published by "}{legalIdentity.company}{!privateDraft && ", operator of Trolleys"}</p>
            {disclosure && <p className="payment-guide-disclosure">{disclosure}</p>}
          </div>
        </div>
      </header>
      <div className="page-container payment-guide-body">
        <nav className="payment-guide-contents" aria-labelledby="payment-guide-contents-title">
          <h2 id="payment-guide-contents-title">On this page</h2>
          <ContentsList>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ContentsList>
        </nav>
        <article className="payment-guide-article" aria-labelledby="payment-guide-title">
          {sections.map(section => <section className="payment-guide-section" key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
            <div className="payment-guide-copy">{section.content}</div>
          </section>)}
          <section className="payment-guide-sources" aria-labelledby="sources">
            <h2 id="sources" tabIndex={-1}>References</h2>
            {!privateDraft && <p>Published prices and product terms can change. Check the terms for your account before making a decision.</p>}
            <ul>{sources.map(source => <li key={source.href}><GuideSourceLink href={source.href}>{source.title}</GuideSourceLink></li>)}</ul>
            {!privateDraft && <p>See <Link href="/payment-acceptance-service">Trolleys’ payment acceptance service and fees</Link>. Trolleys is a trade name of {legalIdentity.company}</p>}
          </section>
          <div className="payment-guide-next">
            <h2>{cta === "credit-card" ? "Explore Ledgix secured credit cards." : "Explore Trolleys payment acceptance."}</h2>
            <p>{cta === "credit-card" ? "Ledgix secured credit cards are coming soon. Applications are not open; contact Ledgix with questions." : "Review the service and fees before applying at Trolleys. Business eligibility and account approval are required."}</p>
            <div className="payment-guide-actions">
              {cta === "credit-card" ? <><Link className="button secondary" href="/credit-card-services">See credit cards</Link><a className="button" href="mailto:ledgix@etaildepot.com">Contact Ledgix</a></> : <><Link className="button secondary" href="/payment-acceptance-service">See payment acceptance</Link><PaymentPortalLink>Continue to Trolleys</PaymentPortalLink></>}
            </div>
          </div>
          <a className="payment-guide-top" href="#payment-guide-title">Back to top <span aria-hidden="true">↑</span></a>
        </article>
      </div>
      <PaymentGuides excludePath={path} relatedPaths={relatedPaths} />
    </div>
  </Shell>;
}
