import { Fragment } from "react";
import { GuideTable } from "./payment-guide";
import { ReadingGuide } from "./reading-guide";

type Block =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; caption: string; headings: string[]; rows: string[][]; note?: string }
  | { type: "steps"; items: string[] }
  | { type: "example"; title: string; paragraphs: string[] };

type Draft = {
  path: string;
  title: string;
  intro: string;
  relatedPaths: string[];
  sections: { id: string; title: string; blocks: Block[] }[];
  sources: { title: string; url: string }[];
  cta: "payment-acceptance" | "credit-card";
};

const MERCHANT_READING_PATHS: readonly string[] = [
  "/guides/optimize-your-mobile-checkout-experience",
  "/guides/cart-abandonment-vs-checkout-abandonment",
  "/guides/ach-debit",
  "/guides/b2b-payment-methods",
  "/guides/important-invoice-management-tips",
  "/guides/types-of-invoice-discrepancies",
];

function ContentBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;
    case "list":
      return <ul>{block.items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
    case "steps":
      return <ol className="reading-guide-steps">{block.items.map((item, index) => <li key={index}>{item}</li>)}</ol>;
    case "example":
      return <figure className="reading-guide-example">
        <figcaption>{block.title}</figcaption>
        {block.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </figure>;
    case "table":
      return <>
        <GuideTable caption={block.caption} headings={block.headings} rows={block.rows} />
        {block.note && <p className="reading-guide-table-note">{block.note}</p>}
      </>;
  }
}

export function PrivateGuideContent({ draft }: { draft: Draft }) {
  const sections = draft.sections.map(section => ({
    id: section.id,
    title: section.title,
    content: <>{section.blocks.map((block, index) => <Fragment key={index}>
      <ContentBlock block={block} />
    </Fragment>)}</>,
  }));
  const sources = draft.sources.map(source => ({ title: source.title, href: source.url }));

  return <ReadingGuide
    path={draft.path}
    title={draft.title}
    intro={draft.intro}
    sections={sections}
    sources={sources}
    relatedPaths={draft.relatedPaths}
    showPaymentAcceptanceLink={MERCHANT_READING_PATHS.includes(draft.path)}
    showCreditCardLink={draft.path === "/guides/credit-card-interest"}
  />;
}
