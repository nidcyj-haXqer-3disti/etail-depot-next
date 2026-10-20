import type { ReactNode } from "react";
import Link from "next/link";
import { PUBLISHED_GUIDES } from "@/modules/public-site/guide-catalog";
import { GuideSourceLink } from "./payment-guide";
import { Shell } from "./shell";
import "./reading-guide.css";

type ReadingSection = { id: string; title: string; content: ReactNode };
type ReadingSource = { title: string; href: string };

function ContentsLinks({ sections }: { sections: ReadingSection[] }) {
  return <ul>
    {sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}
    <li><a href="#sources">References</a></li>
  </ul>;
}

export function ReadingGuide({
  path,
  title,
  intro,
  disclosure,
  sections,
  sources,
  relatedPaths,
  showPaymentAcceptanceLink = false,
  showCreditCardLink = false,
}: {
  path: string;
  title: string;
  intro: string;
  disclosure?: string;
  sections: ReadingSection[];
  sources: ReadingSource[];
  relatedPaths: string[];
  showPaymentAcceptanceLink?: boolean;
  showCreditCardLink?: boolean;
}) {
  const relatedGuides = [...new Set(relatedPaths)]
    .filter(relatedPath => relatedPath !== path)
    .slice(0, 3)
    .flatMap(relatedPath => {
      const guide = PUBLISHED_GUIDES.find(item => item.path === relatedPath);
      return guide ? [guide] : [];
    });

  return <Shell>
    <div className="reading-guide">
      <div className="page-container reading-guide-layout">
        <header className="reading-guide-header">
          <nav className="reading-guide-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/guides">Guides</Link></li>
            </ol>
          </nav>
          <h1 id="payment-guide-title">{title}</h1>
          <p className="reading-guide-intro">{intro}</p>
          {disclosure && <p className="reading-guide-disclosure">{disclosure}</p>}
          <details className="reading-guide-mobile-contents">
            <summary>On this page</summary>
            <nav aria-label="On this page">
              <ContentsLinks sections={sections} />
            </nav>
          </details>
        </header>
        <nav className="reading-guide-desktop-contents" aria-labelledby="reading-guide-contents-title">
          <h2 id="reading-guide-contents-title">On this page</h2>
          <ContentsLinks sections={sections} />
        </nav>
        <article className="reading-guide-article" aria-labelledby="payment-guide-title">
          {sections.map(section => <section className="reading-guide-section" key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
            <div className="reading-guide-copy">{section.content}</div>
          </section>)}
          <section className="reading-guide-sources" aria-labelledby="sources">
            <h2 id="sources" tabIndex={-1}>References</h2>
            <ul>{sources.map(source => <li key={source.href}>
              <GuideSourceLink href={source.href}>{source.title}</GuideSourceLink>
            </li>)}</ul>
          </section>
          {relatedGuides.length > 0 && <nav className="reading-guide-related" aria-labelledby="reading-guide-related-title">
            <h2 id="reading-guide-related-title">Related guides</h2>
            <ul>{relatedGuides.map(guide => <li key={guide.path}>
              <Link href={guide.path} prefetch={false}>{guide.title}</Link>
            </li>)}</ul>
          </nav>}
          {showPaymentAcceptanceLink && <p className="reading-guide-product-link">
            <Link href="/payment-acceptance-service">See Trolleys payment acceptance and fees</Link>
          </p>}
          {showCreditCardLink && <p className="reading-guide-product-link">
            Ledgix credit card applications are not open yet.{" "}
            <Link href="/credit-card-services">View credit card details and inquiries</Link>
          </p>}
          <a className="reading-guide-top" href="#payment-guide-title">Back to top <span aria-hidden="true">↑</span></a>
        </article>
      </div>
    </div>
  </Shell>;
}
