import type { ReactNode } from "react";
import Link from "next/link";
import type { PublicPath } from "@/modules/public-site/metadata";
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

export function PaymentGuide({ path, title, intro, sections, sources, disclosure }: {
  path: PublicPath;
  title: string;
  intro: string;
  sections: GuideSection[];
  sources: GuideSource[];
  disclosure?: ReactNode;
}) {
  return <Shell>
    <PublicPageStructuredData path={path} />
    <div className="payment-guide">
      <header className="payment-guide-header">
        <div className="page-container">
          <nav className="payment-guide-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/payment-acceptance-service">Payment acceptance</Link></li>
              <li aria-current="page">Merchant guide</li>
            </ol>
          </nav>
          <div className="payment-guide-heading">
            <p className="eyebrow">Merchant guides</p>
            <h1 id="payment-guide-title">{title}</h1>
            <p className="payment-guide-intro">{intro}</p>
            <p className="payment-guide-byline">Published by {legalIdentity.company}, operator of Trolleys<span aria-hidden="true"> · </span><span>Reviewed <time dateTime="2026-10-19">October 19, 2026</time></span></p>
            {disclosure && <p className="payment-guide-disclosure">{disclosure}</p>}
          </div>
        </div>
      </header>
      <div className="page-container payment-guide-body">
        <nav className="payment-guide-contents" aria-labelledby="payment-guide-contents-title">
          <h2 id="payment-guide-contents-title">On this page</h2>
          <ol>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
          <a href="#sources">Sources</a>
        </nav>
        <article className="payment-guide-article" aria-labelledby="payment-guide-title">
          {sections.map(section => <section className="payment-guide-section" key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
            <div className="payment-guide-copy">{section.content}</div>
          </section>)}
          <section className="payment-guide-sources" aria-labelledby="sources">
            <h2 id="sources" tabIndex={-1}>Sources</h2>
            <p>Official sources reviewed on October 19, 2026. Published prices and product terms can change; check the terms for your account before making a decision.</p>
            <ul>{sources.map(source => <li key={source.href}><GuideSourceLink href={source.href}>{source.title}</GuideSourceLink></li>)}</ul>
            <p>See <Link href="/payment-acceptance-service">Trolleys’ payment acceptance service and fees</Link>. Trolleys is a trade name of {legalIdentity.company}</p>
          </section>
          <div className="payment-guide-next">
            <h2>Explore Trolleys payment acceptance.</h2>
            <p>Review the service and fees, then continue to Trolleys to apply. Eligibility and approval apply.</p>
            <div className="payment-guide-actions">
              <Link className="button secondary" href="/payment-acceptance-service">See payment acceptance</Link>
              <PaymentPortalLink>Continue to Trolleys</PaymentPortalLink>
            </div>
          </div>
          <a className="payment-guide-top" href="#payment-guide-title">Back to top <span aria-hidden="true">↑</span></a>
        </article>
      </div>
      <PaymentGuides excludePath={path} />
    </div>
  </Shell>;
}
