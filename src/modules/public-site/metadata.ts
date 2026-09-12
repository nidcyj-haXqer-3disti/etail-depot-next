import type { Metadata, MetadataRoute } from "next";
import targets from "../../../project-targets.json" with { type: "json" };

export const PUBLIC_PAGES = {
  "/": { title: "Cards for family and teams, shared payment tools", description: "Explore cards for adult family members and teams, plus shared payment tools by text, email, invoice, QR code and more. Try the Etail Depot sandbox." },
  "/card-services": { title: "Cards for your family, team and trusted people", description: "Explore one prepaid card group for trusted adults, monthly spending limits for each person, private card activity and shared oversight in the Etail Depot sandbox." },
  "/payment-services": { title: "Get paid together with shared merchant payment tools", description: "Give family, teams and helpers payment tools for your merchant. Explore text, email, invoice, bill, social, QR and web payment requests in the sandbox." },
  "/help": { title: "Help with cards and payments", description: "Learn how Etail Depot card controls, payment tools and shared access work. Find help with the demo and what is available today." },
} as const;
export type PublicPath = keyof typeof PUBLIC_PAGES;

function boundCanonicalOrigin(): string {
  const raw = targets.netlify.canonical_origin;
  const parsed = new URL(raw);
  if (targets.project_key !== "ETAIL_DEPOT_NEXT_GREENFIELD_2026" || !targets.netlify.site_id ||
      parsed.protocol !== "https:" || parsed.origin !== raw || parsed.username || parsed.password ||
      targets.denied.netlify_site_ids.includes(targets.netlify.site_id) || targets.denied.domains.includes(parsed.hostname)) {
    throw new Error("Public metadata requires the recorded, isolated canonical site binding.");
  }
  return parsed.origin;
}
export const canonicalOrigin = boundCanonicalOrigin();

export interface SearchReleaseApproval {
  siteId: string;
  canonicalOrigin: string;
  reviewReference: string;
}
/** No public indexing approval exists. Only a reviewed source change may record one. */
export const PUBLIC_INDEXING_APPROVAL: SearchReleaseApproval | null = null;
type Environment = Readonly<Record<string, string | undefined>>;

/** Pure guard for release review/tests; request URLs, forwarded hosts and search parameters are never inputs. */
export function isApprovedSearchRelease(approval: SearchReleaseApproval | null, env: Environment): boolean {
  return Boolean(approval && approval.siteId === targets.netlify.site_id && approval.canonicalOrigin === canonicalOrigin &&
    approval.reviewReference.trim() && env.NODE_ENV === "production" && env.APP_ENV === "production" &&
    env.CONTEXT === "production" && env.SITE_ID === targets.netlify.site_id && env.ETAIL_PUBLIC_ORIGIN === canonicalOrigin);
}
export function publicIndexingEnabled(): boolean {
  return isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, process.env);
}

export const privateRobots: Metadata["robots"] = { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } };
export const rootMetadata: Metadata = {
  metadataBase: new URL(canonicalOrigin),
  title: { default: "Etail Depot — Cards and payments", template: "%s | Etail Depot" },
  description: PUBLIC_PAGES["/"].description,
  applicationName: "Etail Depot",
  robots: privateRobots,
  icons: { icon: "/brand/symbol.png", apple: "/brand/symbol.png" },
  openGraph: { type: "website", siteName: "Etail Depot", locale: "en_US", title: "Etail Depot — Cards and payments", description: PUBLIC_PAGES["/"].description },
  twitter: { card: "summary_large_image", title: "Etail Depot — Cards and payments", description: PUBLIC_PAGES["/"].description, images: [{ url: "/opengraph-image", alt: "Etail Depot — Card services and payment services" }] },
};

export function publicPageUrl(path: PublicPath): string {
  if (!Object.hasOwn(PUBLIC_PAGES, path)) throw new Error("Only reviewed public information pages can publish search metadata.");
  return new URL(path, canonicalOrigin).href;
}
export function publicPageMetadata(path: PublicPath): Metadata {
  const url = publicPageUrl(path), page = PUBLIC_PAGES[path];
  return {
    title: page.title, description: page.description,
    alternates: { canonical: url },
    robots: publicIndexingEnabled() ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } } : privateRobots,
    openGraph: { type: "website", url, title: `${page.title} | Etail Depot`, description: page.description, siteName: "Etail Depot", locale: "en_US" },
    twitter: { card: "summary_large_image", title: `${page.title} | Etail Depot`, description: page.description, images: [{ url: "/opengraph-image", alt: "Etail Depot — Card services and payment services" }] },
  };
}
export function publicSitemap(): MetadataRoute.Sitemap {
  // Never read identities, services, cards, channels, support cases or database rows here.
  return publicIndexingEnabled() ? (Object.keys(PUBLIC_PAGES) as PublicPath[]).map(path => ({ url: publicPageUrl(path) })) : [];
}
export function publicRobots(): MetadataRoute.Robots {
  return {
    // HTML must remain crawlable for its noindex directive to be observed. Authentication protects private records.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(publicIndexingEnabled() ? { sitemap: `${canonicalOrigin}/sitemap.xml` } : {}),
  };
}
export function publicPageJsonLd(path: PublicPath): string {
  const url = publicPageUrl(path), page = PUBLIC_PAGES[path];
  const data = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "Organization", "@id": `${canonicalOrigin}/#organization`, name: "Etail Depot", url: `${canonicalOrigin}/`, logo: `${canonicalOrigin}/brand/logo.png` },
      { "@type": "WebSite", "@id": `${canonicalOrigin}/#website`, name: "Etail Depot", url: `${canonicalOrigin}/`, publisher: { "@id": `${canonicalOrigin}/#organization` } },
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description, isPartOf: { "@id": `${canonicalOrigin}/#website` } },
    ],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
