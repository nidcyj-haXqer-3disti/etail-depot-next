import { legalDocuments } from "./legal-center/content";
import type { Metadata } from "next";
import { canonicalOrigin, privateRobots } from "@/shared/seo/metadata";

const documents: Record<string, { title: string; description: string }> = {
  "/legal": { title: "Legal", description: "Merchant service terms, privacy and security by region. United States documents are available; international documents are coming soon." },
  ...Object.fromEntries(legalDocuments.map(document => [`/legal/${document.slug}`, document])),
  "/privacy": { title: "Website Privacy Policy", description: "How Etail Depot US, Inc. handles website information, inquiries, browser tools and retained records. Merchant account and card service privacy is addressed separately." },
  "/terms": { title: "Website Terms of Use", description: "Terms for using etaildepot.com, its content, Guides, documentation and interactive tools." },
} as const;

// Legal pages retain their existing search visibility independently of public copy changes.
export function legalPageMetadata(path: keyof typeof documents): Metadata {
  const document = documents[path];
  if (!document) throw new Error("Unknown legal document metadata.");
  const title = `${document.title} | Etail Depot`;
  const url = new URL(path, canonicalOrigin).href;
  return {
    title: { absolute: title }, description: document.description, robots: privateRobots,
    alternates: { canonical: url },
    openGraph: { title, description: document.description, type: "website", url, siteName: "Etail Depot" },
    twitter: { card: "summary", title, description: document.description },
  };
}
