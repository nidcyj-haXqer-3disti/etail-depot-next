import type { ReactNode } from "react";
import Link from "next/link";
import { Shell } from "./shell";
import "./legal-document.css";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalDocumentProps = {
  title: string;
  description: string;
  updated: string;
  currentPage: "privacy" | "terms";
  sections: LegalSection[];
};

/** Shared public policy layout; the date identifies the latest content revision. */
export function LegalDocument({ title, description, updated, currentPage, sections }: LegalDocumentProps) {
  return <Shell>
    <div className="legal-document">
      <div className="legal-document-intro">
        <div className="page-container">
          <nav className="legal-document-navigation" aria-label="Legal documents">
            <Link href="/privacy" aria-current={currentPage === "privacy" ? "page" : undefined}>Privacy</Link>
            <Link href="/terms" aria-current={currentPage === "terms" ? "page" : undefined}>Terms</Link>
          </nav>
          <header className="legal-document-heading">
            <h1 id="legal-document-title">{title}</h1>
            <p className="legal-document-description">{description}</p>
            <p className="legal-document-date">Last updated {updated}</p>
          </header>
        </div>
      </div>
      <div className="page-container legal-document-body">
        <nav className="legal-document-contents legal-document-contents-desktop" aria-labelledby="legal-document-contents-title">
          <h2 id="legal-document-contents-title">On this page</h2>
          <ol>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
        </nav>
        <details className="legal-document-contents-mobile">
          <summary>On this page <span aria-hidden="true">+</span></summary>
          <nav className="legal-document-contents" aria-label="On this page">
            <ol>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
          </nav>
        </details>
        <article className="legal-document-content" aria-labelledby="legal-document-title">
          {sections.map(section => <section className="legal-document-section" key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
            <div className="legal-section-copy">{section.content}</div>
          </section>)}
          <a className="legal-document-top" href="#legal-document-title">Back to top <span aria-hidden="true">↑</span></a>
        </article>
      </div>
    </div>
  </Shell>;
}
