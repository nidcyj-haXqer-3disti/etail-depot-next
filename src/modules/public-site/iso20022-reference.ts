import type { Metadata } from "next";
import snapshot from "./iso20022-data.json";
import { canonicalOrigin, pageRobots, publicSocialImage } from "./metadata";

export const ISO20022_SOURCE = "https://www.iso20022.org/catalogue/additional-content-messages/external-code-sets";
export const ISO20022_PATH = "/guides/iso-20022";
export const ISO20022_RELEASE = snapshot.release;
export const ISO20022_WORKBOOK = snapshot.sourceFile;
export interface SourceReference { source_id: string; locator: string; sha256: string }
export interface IsoCode {
  id: string; path: string; collection_id: string; code: string; source_name: string;
  source_definition: string; source_status: string; created: string | null; last_updated: string | null;
  additional_information?: string | null; replaced_by?: string | null;
  source_definition_sha256: string; source_refs: SourceReference[];
}
export interface IsoCodeSet {
  id: string; path: string; slug: string; title: string; collection_id: string; source_definition: string;
  min_length?: number | null; max_length?: number | null; pattern?: string | null; source_refs: SourceReference[]; codes: IsoCode[];
  messages: { message_name: string; message_id: string; locator: string }[];
  obsolete: { code: string; source_name: string; locator: string }[];
}
export const ISO20022_SETS: readonly IsoCodeSet[] = snapshot.sets;
const bySlug = new Map(ISO20022_SETS.map(set => [set.slug, set]));
export function isoCodeSet(slug: string) { return bySlug.get(slug); }
export function isoCode(set: IsoCodeSet, slug: string) { return set.codes.find(code => code.path.split("/").at(-1) === slug); }
export function sourceName(name: string) {
  return name.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").replace(/([a-z\d])([A-Z])/g, "$1 $2");
}
export function codeHeading(code: IsoCode) {
  if (code.collection_id === "ExternalPaymentTransactionStatus1Code") {
    if (code.code === "ACSP") return "Accepted for execution";
    if (code.code === "ACCC") return "Creditor account settlement completed";
  }
  return sourceName(code.source_name);
}
export function codeReplacement(set: IsoCodeSet, code: IsoCode) {
  return code.replaced_by ? set.codes.find(item => item.code === code.replaced_by) : undefined;
}
export function codeUsageRestriction(code: IsoCode) {
  return code.additional_information?.trim().toLowerCase() === "do not use." ? code.additional_information : null;
}
export function codePeers(code: IsoCode) {
  return ISO20022_SETS.flatMap(set => set.collection_id === code.collection_id ? [] : set.codes.filter(peer => peer.code === code.code).map(peer => ({ set, code: peer })));
}
export function sourceDate(value: string | null) {
  if (!value) return "Not supplied";
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });
}
export function isoIdentity(set?: IsoCodeSet, code?: IsoCode) {
  const path = code?.path ?? set?.path ?? ISO20022_PATH;
  const name = code ? `${code.code}: ${codeHeading(code)}` : set ? `${set.title} codes` : "ISO 20022 external code sets";
  const title = code ? `${name} | ${set!.title} | ISO 20022 | Etail Depot` : `${name} | Etail Depot`;
  const description = code ? `${code.code} in ${set!.collection_id}. ${code.source_definition}${code.replaced_by ? ` Source replacement: ${code.replaced_by}.` : ""}${codeUsageRestriction(code) ? ` Source note: ${codeUsageRestriction(code)}` : ""}` : set ? `${set.codes.length} registered codes in ${set.collection_id}, with definitions, message versions and source details.` : "Browse 140 ISO 20022 external code sets and 3,314 registered codes, with published definitions, message references and source release details.";
  return { path, name, title, description };
}
export function isoMetadata(set?: IsoCodeSet, code?: IsoCode): Metadata {
  const entry = isoIdentity(set, code), url = canonicalOrigin + entry.path;
  return { title: { absolute: entry.title }, description: entry.description, alternates: { canonical: url }, robots: pageRobots(entry.path),
    openGraph: { type: "website", title: entry.title, description: entry.description, url, siteName: "Etail Depot", images: [publicSocialImage] },
    twitter: { card: "summary_large_image", title: entry.title, description: entry.description, images: [publicSocialImage] } };
}
export function isoJsonLd(set?: IsoCodeSet, code?: IsoCode) {
  const entry = isoIdentity(set, code), url = canonicalOrigin + entry.path;
  const crumbs = [{ name: "Guides", path: "/guides" }, { name: "ISO 20022", path: ISO20022_PATH }];
  if (set) crumbs.push({ name: set.title, path: set.path });
  if (code) crumbs.push({ name: code.code, path: code.path });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [
    { "@type": code ? "WebPage" : "CollectionPage", "@id": url + "#webpage", url, name: entry.title, description: entry.description, inLanguage: "en-US", citation: ISO20022_SOURCE,
      publisher: { "@id": `${canonicalOrigin}/#organization` }, isPartOf: { "@id": `${canonicalOrigin}/#website` }, breadcrumb: { "@id": url + "#breadcrumb" }, mainEntity: { "@id": url + "#reference" } },
    { "@type": "BreadcrumbList", "@id": url + "#breadcrumb", itemListElement: crumbs.map((crumb, i) => ({ "@type": "ListItem", position: i + 1, name: crumb.name, item: canonicalOrigin + crumb.path })) },
    code ? { "@type": "DefinedTerm", "@id": url + "#reference", url, name: codeHeading(code), termCode: code.code, description: code.source_definition, inDefinedTermSet: { "@type": "DefinedTermSet", "@id": canonicalOrigin + set!.path + "#reference", name: set!.collection_id, url: canonicalOrigin + set!.path }, citation: ISO20022_SOURCE }
      : set ? { "@type": "DefinedTermSet", "@id": url + "#reference", url, name: set.collection_id, description: set.source_definition, hasDefinedTerm: set.codes.map(item => ({ "@type": "DefinedTerm", "@id": canonicalOrigin + item.path + "#reference", url: canonicalOrigin + item.path, name: codeHeading(item), termCode: item.code })), citation: ISO20022_SOURCE }
      : { "@type": "ItemList", "@id": url + "#reference", numberOfItems: ISO20022_SETS.length, itemListElement: ISO20022_SETS.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.title, url: canonicalOrigin + item.path })) },
  ] }).replace(/</g, "\\u003c");
}
