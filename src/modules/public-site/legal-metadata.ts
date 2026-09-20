import type { Metadata } from "next";
import { canonicalOrigin, privateRobots } from "./metadata";

const documents = {
  "/privacy": { title: "Privacy Policy", description: "How Etail Depot US, Inc. handles website information, cookies and privacy requests, and how notices apply to Ledgix cards and Trolleys payments." },
  "/terms": { title: "Terms of Use", description: "Using the Etail Depot website, accessing Ledgix cards and Trolleys payments, and understanding which service agreements apply." },
} as const;

// Legal pages retain their existing search visibility independently of public copy changes.
export function legalPageMetadata(path: keyof typeof documents): Metadata {
  const document = documents[path];
  const title = document.title;
  const url = new URL(path, canonicalOrigin).href;
  return {
    title, description: document.description, robots: privateRobots,
    alternates: { canonical: url },
    openGraph: { title, description: document.description, type: "website", url, siteName: "Etail Depot" },
    twitter: { card: "summary", title, description: document.description },
  };
}
