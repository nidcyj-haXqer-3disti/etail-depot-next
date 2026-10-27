import type { Metadata } from "next";
import { canonicalOrigin, privateRobots } from "./metadata";

const documents = {
  "/privacy": { title: "Privacy Policy", description: "How Etail Depot US, Inc. handles website information, service inquiries, browser tools and earlier account records, alongside separate product privacy notices." },
  "/terms": { title: "Website Terms of Use", description: "Terms for Etail Depot’s website, service information, Guides, documentation and interactive tools, alongside separate merchant and card agreements." },
} as const;

// Legal pages retain their existing search visibility independently of public copy changes.
export function legalPageMetadata(path: keyof typeof documents): Metadata {
  const document = documents[path];
  const title = `${document.title} | Etail Depot`;
  const url = new URL(path, canonicalOrigin).href;
  return {
    title: { absolute: title }, description: document.description, robots: privateRobots,
    alternates: { canonical: url },
    openGraph: { title, description: document.description, type: "website", url, siteName: "Etail Depot" },
    twitter: { card: "summary", title, description: document.description },
  };
}
