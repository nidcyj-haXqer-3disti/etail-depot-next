import type { Metadata, MetadataRoute } from "next";
import { cardProduct } from "@/shared/card-product";
import { legalIdentity } from "@/shared/legal-identity";
import targets from "../../../project-targets.json" with { type: "json" };

export const PUBLIC_PAGES = {
  "/": { title: `Trolleys payments & Ledgix ${cardProduct.name}`, description: `Accept payments with links and QR codes from Trolleys. Explore the upcoming Ledgix ${cardProduct.name}, a virtual ${cardProduct.creditType}.` },
  "/card-services": { title: `Ledgix ${cardProduct.name} — Coming soon`, description: `Meet Ledgix ${cardProduct.name}, a virtual ${cardProduct.creditType} for Apple Wallet and Google Wallet. Coming soon. Contact Ledgix to learn more.` },
  "/payment-services": { title: "Trolleys payments & dispute readiness", description: "Request payment with links and QR codes. Add Dispute readiness to help customers recognize purchases and prevent eligible fraud disputes through Order Insight." },
  "/help": { title: "Help with payments and cards", description: `Contact Trolleys for payment support or Ledgix for ${cardProduct.name} inquiries. Find product access guidance and company compliance contacts.` },
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
/** D122 explicitly authorizes indexing this recorded site; previews and local builds remain excluded. */
export const PUBLIC_INDEXING_APPROVAL: SearchReleaseApproval = {
  siteId: "cbbb6c24-9dbc-43a2-9234-e4357b5b5280",
  canonicalOrigin: "https://etail-depot-next.netlify.app",
  reviewReference: "D122 — user authorization to index and deploy, 2026-09-21",
};
type Environment = Readonly<Record<string, string | undefined>>;

/** Pure guard for release review/tests; request URLs, forwarded hosts and search parameters are never inputs. */
export function isApprovedSearchRelease(approval: SearchReleaseApproval | null, env: Environment): boolean {
  return Boolean(approval && approval.siteId === targets.netlify.site_id && approval.canonicalOrigin === canonicalOrigin &&
    approval.reviewReference.trim() && env.NODE_ENV === "production" && env.APP_ENV === "production" &&
    env.ETAIL_SEARCH_CONTEXT === "production" && (!env.CONTEXT || env.CONTEXT === "production") &&
    env.SITE_ID === targets.netlify.site_id && env.ETAIL_PUBLIC_ORIGIN === canonicalOrigin);
}
export function publicIndexingEnabled(): boolean {
  return isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, process.env);
}

export const privateRobots: Metadata["robots"] = { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } };
export const publicSocialImage = {
  url: `${canonicalOrigin}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: `Etail Depot — Trolleys payments available now; Ledgix ${cardProduct.pluralName} coming soon`,
};
export const rootMetadata: Metadata = {
  metadataBase: new URL(canonicalOrigin),
  title: { default: "Etail Depot — Cards and payments", template: "%s | Etail Depot" },
  description: PUBLIC_PAGES["/"].description,
  applicationName: "Etail Depot",
  robots: privateRobots,
  icons: { icon: "/brand/symbol.png", apple: "/brand/symbol.png" },
  openGraph: { type: "website", siteName: "Etail Depot", locale: "en_US", title: "Etail Depot — Cards and payments", description: PUBLIC_PAGES["/"].description, images: [publicSocialImage] },
  twitter: { card: "summary_large_image", title: "Etail Depot — Cards and payments", description: PUBLIC_PAGES["/"].description, images: [publicSocialImage] },
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
    openGraph: { type: "website", url, title: `${page.title} | Etail Depot`, description: page.description, siteName: "Etail Depot", locale: "en_US", images: [publicSocialImage] },
    twitter: { card: "summary_large_image", title: `${page.title} | Etail Depot`, description: page.description, images: [publicSocialImage] },
  };
}
export function publicSitemap(): MetadataRoute.Sitemap {
  // Never read identities, services, cards, channels, support cases or database rows here.
  return publicIndexingEnabled() ? (Object.keys(PUBLIC_PAGES) as PublicPath[]).map(path => ({ url: publicPageUrl(path) })) : [];
}
export function publicRobots(): MetadataRoute.Robots {
  return {
    // HTML must remain crawlable for its noindex directive to be observed. Retired APIs return no records.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(publicIndexingEnabled() ? { sitemap: `${canonicalOrigin}/sitemap.xml` } : {}),
  };
}
export function publicPageJsonLd(path: PublicPath): string {
  const url = publicPageUrl(path), page = PUBLIC_PAGES[path];
  const organizationId = `${canonicalOrigin}/#organization`;
  const websiteId = `${canonicalOrigin}/#website`;
  const breadcrumbId = `${url}#breadcrumb`;
  const breadcrumbLabels = { "/card-services": "Cards", "/payment-services": "Payments", "/help": "Help" } as const;
  const data = {
    "@context": "https://schema.org", "@graph": [
      {
        "@type": "Organization", "@id": organizationId, name: "Etail Depot", legalName: legalIdentity.company,
        url: `${canonicalOrigin}/`, logo: `${canonicalOrigin}/brand/logo.png`, email: legalIdentity.complianceEmail,
        brand: legalIdentity.brands.map(brand => ({ "@type": "Brand", name: brand.name })),
        contactPoint: legalIdentity.brands.map(brand => ({
          "@type": "ContactPoint", name: brand.name, contactType: brand.service === "Cards" ? "Card inquiries" : "Payment support", email: brand.email,
        })),
      },
      {
        "@type": "WebSite", "@id": websiteId, name: "Etail Depot", url: `${canonicalOrigin}/`,
        description: PUBLIC_PAGES["/"].description, inLanguage: "en-US", publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description,
        inLanguage: "en-US", isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId },
        primaryImageOfPage: { "@type": "ImageObject", url: publicSocialImage.url, width: publicSocialImage.width, height: publicSocialImage.height },
        ...(path !== "/" ? { breadcrumb: { "@id": breadcrumbId } } : {}),
      },
      ...(path !== "/" ? [{
        "@type": "BreadcrumbList", "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Etail Depot", item: publicPageUrl("/") },
          { "@type": "ListItem", position: 2, name: breadcrumbLabels[path], item: url },
        ],
      }] : []),
    ],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
