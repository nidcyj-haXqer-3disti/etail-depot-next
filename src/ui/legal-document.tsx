import type { ReactNode } from "react";
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
  updated?: string;
  sections: LegalSection[];
};

/** Shared public policy layout; the date identifies the latest content revision. */
export function LegalDocument({ title, description, updated, sections }: LegalDocumentProps) {
  return <Shell>
    <div className="legal-document">
      <div className="legal-document-intro">
        <div className="page-container">
          <header className="legal-document-heading">
            <h1 id="legal-document-title" tabIndex={-1}>{title}</h1>
            <p className="legal-document-description">{description}</p>
            {updated && <p className="legal-document-date">Last updated {updated}</p>}
          </header>
        </div>
      </div>
      <div className="page-container legal-document-body">
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
