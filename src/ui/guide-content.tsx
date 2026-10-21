import { Fragment } from "react";
import Link from "next/link";
import type { PublicPath } from "@/modules/public-site/metadata";
import { GuideTable } from "./payment-guide";
import { ReadingGuide } from "./reading-guide";

type GuidePath = Extract<PublicPath, `/guides/${string}`>;
type LinkedText = { text: string; inlineLink?: { text: string; href: GuidePath | `${GuidePath}#${string}` } };

type Block =
  | ({ type: "paragraph" } & LinkedText)
  | { type: "list"; items: string[] }
  | { type: "table"; caption: string; headings: string[]; rows: string[][]; note?: string }
  | { type: "checks"; caption: string; items: { term: string; description: string }[]; note?: string }
  | { type: "steps"; items: (string | LinkedText)[] }
  | { type: "example"; title: string; paragraphs: string[] };

type GuideContentData = {
  path: PublicPath;
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

function InlineText({ text, inlineLink }: LinkedText) {
  const start = inlineLink?.text ? text.indexOf(inlineLink.text) : -1;
  return inlineLink && start >= 0
    ? <>{text.slice(0, start)}<Link href={inlineLink.href}>{inlineLink.text}</Link>{text.slice(start + inlineLink.text.length)}</>
    : <>{text}</>;
}

function ContentBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return <p><InlineText {...block} /></p>;
    case "list":
      return <ul>{block.items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
    case "steps":
      return <ol className="reading-guide-steps">{block.items.map((item, index) => <li key={index}>{typeof item === "string" ? item : <InlineText {...item} />}</li>)}</ol>;
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
    case "checks":
      return <>
        <figure className="reading-guide-checklist">
          <figcaption>{block.caption}</figcaption>
          <dl className="reading-guide-checks">{block.items.map(item => <div key={item.term}>
            <dt>{item.term}</dt><dd>{item.description}</dd>
          </div>)}</dl>
        </figure>
        {block.note && <p className="reading-guide-table-note">{block.note}</p>}
      </>;
  }
}

export function GuideContent({ guide }: { guide: GuideContentData }) {
  const sections = guide.sections.map(section => ({
    id: section.id,
    title: section.title,
    content: <>{section.blocks.map((block, index) => <Fragment key={index}>
      <ContentBlock block={block} />
    </Fragment>)}</>,
  }));
  const sources = guide.sources.map(source => ({ title: source.title, href: source.url }));

  return <ReadingGuide
    path={guide.path}
    title={guide.title}
    intro={guide.intro}
    sections={sections}
    sources={sources}
    relatedPaths={guide.relatedPaths}
    showPaymentAcceptanceLink={MERCHANT_READING_PATHS.includes(guide.path)}
    showCreditCardLink={guide.path === "/guides/credit-card-interest"}
  />;
}
