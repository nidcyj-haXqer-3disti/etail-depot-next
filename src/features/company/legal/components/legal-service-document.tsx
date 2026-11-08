import { currentPublicHref } from "@/shared/site/page-url-migrations";
import Link from "next/link";
import content from "@/features/company/legal/merchant-legal-content.json";
import { legalDocuments, type LegalDocumentSlug } from "@/features/company/legal/legal-center/content";
import { productFacts, saleRecordsOffer } from "@/shared/site/product-facts";
import { LegalDocument, type LegalSection } from "./legal-document";

type SectionCopy = { id: string; title: string; paragraphs: string[]; bullets?: string[]; links?: { label: string; href: string }[]; table?: string; record?: { label: string; description: string }[] };
const fees = productFacts.payments;
const feeRows = [
  ["Domestic online card payment", fees.cardRateLabel, "Per successful payment. Payment request creation and sharing are included."],
  ["Monthly account fee", `$${fees.monthlyFeeDollars}`, "Under the standard merchant offer."],
  ["Account setup", `$${fees.setupFeeDollars}`, "Under the standard merchant offer."],
  ["International card", `+${fees.internationalRateLabel}`, "Additional percentage of the payment amount."],
  ["Currency conversion", `+${fees.conversionRateLabel}`, "Additional percentage when conversion is required."],
  ["Merchant entered card details", `+${fees.manualEntryRateLabel}`, "Does not apply when the customer enters details at online checkout."],
  ["Dispute received", `$${fees.disputeFeeDollars}`, "For each dispute received."],
  ["Manual dispute response", `$${fees.disputeResponseFeeDollars}`, "Separate response fee, returned if the merchant wins the dispute."],
  ["Optional dispute prevention", saleRecordsOffer.rateLabel, "Of eligible successful payment volume enrolled in the service."],
];
const fundingRows = [
  ["Card funds availability", "Your card settlement schedule", "The availability period and cutoff are specified in the account terms confirmed by the funding provider."],
  ["ACH debit availability", "Your ACH processing terms", "ACH availability and return rules are separate from card settlement. Later returns remain possible."],
  ["Payout frequency", "Your agreed payout schedule", "Payouts are initiated from available funds at the frequency enabled for your account."],
  ["First payout", "Your account’s initial payout conditions", "Account activation, verification and applicable funding restrictions must be satisfied."],
  ["Bank receipt", "Determined by the receiving bank", "Availability and initiation are not guaranteed deposit dates."],
];
function Schedule({ type }: { type: string }) {
  return <dl className="legal-rate-list">{(type === "fees" ? feeRows : fundingRows).map(([name, value, explanation]) => <div key={name}><dt>{name}</dt><dd><strong>{value}</strong><p>{explanation}</p></dd></div>)}</dl>;
}
export function LegalServiceDocument({ slug }: { slug: LegalDocumentSlug }) {
  const document = legalDocuments.find(item => item.slug === slug)!;
  const sections: LegalSection[] = (content[slug] as SectionCopy[]).map(section => ({
    id: section.id, title: section.title, content: <>
      {slug === "merchant-services" && section.id === "account-documents" && <span id="retailer-agreement" />}
      {slug === "merchant-services" && section.id === "website-service-disclosures" && <span id="dispute-prevention" />}
      {section.paragraphs.map(paragraph => <p key={paragraph} className={paragraph.includes("\n") ? "legal-address-copy" : undefined}>{paragraph}</p>)}
      {section.table && <Schedule type={section.table} />}
      {section.record && <dl className="legal-record-list">{section.record.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.description}</dd></div>)}</dl>}
      {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
      {section.links && <ul className="legal-related-links">{section.links.map(link => <li key={link.href}>{link.href.startsWith("/") ? <Link href={currentPublicHref(link.href)}>{link.label}</Link> : <a href={link.href} {...(link.href.startsWith("https:") ? { rel: "external noreferrer", referrerPolicy: "no-referrer" as const } : {})}>{link.label}</a>}</li>)}</ul>}
    </>,
  }));
  const updated = ["merchant-services", "fees", "payouts-and-reserves", "acceptable-use", "software-platforms", "acquirer-disclosure", "data-processing", "merchant-privacy"].includes(slug) ? "November 5, 2026" : "November 4, 2026";
  return <LegalDocument title={document.title} description={document.description} updated={updated} sections={sections} />;
}
