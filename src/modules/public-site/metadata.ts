import type { Metadata, MetadataRoute } from "next";
import { serviceLabels } from "@/shared/service-language";
import { productFacts } from "@/shared/product-facts";
import { cardProduct } from "@/shared/card-product";
import { legalIdentity, publicCompanyDescription } from "@/shared/legal-identity";
import { canonicalOrigin, PUBLIC_INDEXING_APPROVAL, isApprovedSearchRelease } from "@/shared/public-release";
import { PUBLISHED_GUIDES } from "./guide-catalog";
export { canonicalOrigin, PUBLIC_INDEXING_APPROVAL, isApprovedSearchRelease } from "@/shared/public-release";

const cardFeesDescription = productFacts.cards.annualFeeDollars === productFacts.cards.monthlyFeeDollars
  ? `$${productFacts.cards.annualFeeDollars} annual and monthly fees`
  : `$${productFacts.cards.annualFeeDollars} annual fee and $${productFacts.cards.monthlyFeeDollars} monthly fee`;

type GuidePath = (typeof PUBLISHED_GUIDES)[number]["path"];
type PageDescription = { title: string; description: string };

// Reviewed search titles and descriptions for the original four articles.
const existingGuideMetadata = {
  "/guides/stripe-alternatives": { title: "Stripe Alternatives: Stripe vs Trolleys", description: "Compare Stripe and Trolleys for online card payments. Review payment links, processing and dispute fees, account requirements and questions to ask before switching." },
  "/guides/payment-processing-systems": { title: "Credit Card Processing Systems: How They Work", description: "Follow an online card payment from checkout to bank payout. Understand gateways, processors and merchant accounts, then compare fees and setup requirements." },
  "/guides/what-is-a-chargeback": { title: "What Is a Chargeback? A Merchant Response Guide", description: "Understand chargebacks vs. refunds, fees and response evidence. Use a chargeback worksheet to organize the notice, deadline, records and submission." },
  "/guides/how-to-create-a-payment-link": { title: "How to Create and Share a Payment Link", description: "Prepare a Trolleys payment request, share a link or QR code and check payment status. Learn what to include, what customers see and how fees apply." },
} as const satisfies Partial<Record<GuidePath, PageDescription>>;

// Only the explicit publication catalog supplies article metadata. No draft directory,
// research register, section fragment or unknown /guides path becomes a public page.
const guideMetadata = Object.fromEntries(PUBLISHED_GUIDES.map(guide => [
  guide.path,
  Object.hasOwn(existingGuideMetadata, guide.path)
    ? existingGuideMetadata[guide.path as keyof typeof existingGuideMetadata]
    : { title: guide.title, description: guide.description },
])) as Record<GuidePath, PageDescription>;

export const PUBLIC_PAGES = {
  "/": { title: "Payment Acceptance & Credit Card Processing", description: "Accept online payments with Trolleys’ credit card processing system. Explore payment options, compare fees and learn what a chargeback is." },
  "/credit-card-services": { title: "Ledgix Secured Credit Card — Coming Soon", description: `Meet the ${cardProduct.name}, a virtual ${cardProduct.creditType} coming soon. $${productFacts.cards.minimumDepositDollars} minimum deposit; ${cardFeesDescription}. Applications are not open.` },
  "/payment-acceptance-service": { title: "Online Credit Card Processing with Trolleys", description: "Accept online credit and debit card payments with Trolleys. Create and share payment links or QR codes. Compare processing fees and optional Clarity coverage." },
  "/help": { title: "Payment Acceptance & Credit Card Help", description: "Find Trolleys payment acceptance support, Ledgix credit card inquiries and sign-in guidance. Contact Etail Depot for website, privacy and legal questions." },
  "/guides": { title: "Payment Acceptance Guides", description: "Practical guides for online merchants: payment links, checkout, fees, chargebacks, bank payments, invoicing and business finance." },
  ...guideMetadata,
} as const;
export type PublicPath = keyof typeof PUBLIC_PAGES;

// UTC dates of each candidate page's last significant content update. Maintain when
// its content, relevant shared content, metadata or links materially change.
// Do not advance for deployments, cosmetic edits or copyright-year changes alone.
// Local revisions become public only in the next approved release.
export const PUBLIC_PAGE_MODIFIED = {
  "/": "2026-10-19",
  "/credit-card-services": "2026-10-19",
  "/payment-acceptance-service": "2026-10-21",
  "/help": "2026-10-21",
  "/guides": "2026-10-21",
  ...Object.fromEntries(PUBLISHED_GUIDES.map(guide => [guide.path, "2026-10-20"])) as Record<GuidePath, string>,
  "/guides/payment-processing-systems": "2026-10-21",
  "/guides/what-is-a-chargeback": "2026-10-21",
  "/guides/how-to-create-a-payment-link": "2026-10-21",
  "/guides/how-3d-secure-works": "2026-10-21",
  "/guides/stripe-alternatives": "2026-10-21",
  "/guides/profit-and-loss-statement": "2026-10-21",
  "/guides/important-invoice-management-tips": "2026-10-21",
  "/guides/designing-robust-and-predictable-apis-with-idempotency": "2026-10-21",
} as const satisfies Record<PublicPath, string>;

export function publicIndexingEnabled(): boolean {
  return isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, process.env);
}

export const privateRobots: Metadata["robots"] = { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } };
export const publicSocialImage = {
  url: `${canonicalOrigin}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: `Etail Depot — Trolleys payment acceptance available now; ${cardProduct.name} coming soon`,
};
const homeTitle = `${PUBLIC_PAGES["/"].title} | Etail Depot`;
export const rootMetadata: Metadata = {
  metadataBase: new URL(canonicalOrigin),
  title: { default: homeTitle, template: "%s | Etail Depot" },
  description: PUBLIC_PAGES["/"].description,
  applicationName: "Etail Depot",
  robots: privateRobots,
  icons: { icon: { url: "/brand/favicon-192.png", type: "image/png", sizes: "192x192" }, apple: { url: "/brand/apple-touch-icon.png", type: "image/png", sizes: "180x180" } },
  openGraph: { type: "website", siteName: "Etail Depot", locale: "en_US", title: homeTitle, description: PUBLIC_PAGES["/"].description, images: [publicSocialImage] },
  twitter: { card: "summary_large_image", title: homeTitle, description: PUBLIC_PAGES["/"].description, images: [publicSocialImage] },
};

export function publicPageUrl(path: PublicPath): string {
  if (!Object.hasOwn(PUBLIC_PAGES, path)) throw new Error("Only reviewed public information pages can publish search metadata.");
  return new URL(path, canonicalOrigin).href;
}
export function publicPageMetadata(path: PublicPath): Metadata {
  const url = publicPageUrl(path), page = PUBLIC_PAGES[path];
  const title = `${page.title} | Etail Depot`;
  return {
    // Absolute titles also brand Home, where the root layout's child template does not apply.
    title: { absolute: title }, description: page.description,
    alternates: { canonical: url },
    robots: publicIndexingEnabled() ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } } : privateRobots,
    openGraph: { type: "website", url, title, description: page.description, siteName: "Etail Depot", locale: "en_US", images: [publicSocialImage] },
    twitter: { card: "summary_large_image", title, description: page.description, images: [publicSocialImage] },
  };
}
export function publicSitemap(): MetadataRoute.Sitemap {
  // Never read identities, services, cards, channels, support cases or database rows here.
  return publicIndexingEnabled() ? (Object.keys(PUBLIC_PAGES) as PublicPath[]).map(path => ({
    url: publicPageUrl(path), lastModified: PUBLIC_PAGE_MODIFIED[path],
  })) : [];
}
export function publicRobots(): MetadataRoute.Robots {
  return {
    // HTML must remain crawlable for its noindex directive to be observed. Retired APIs return no records.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(publicIndexingEnabled() ? { sitemap: `${canonicalOrigin}/sitemap.xml` } : {}),
  };
}
const breadcrumbLabels = {
  "/credit-card-services": serviceLabels.cards,
  "/payment-acceptance-service": serviceLabels.payments,
  "/help": "Help",
  "/guides": "Guides",
  ...Object.fromEntries(PUBLISHED_GUIDES.map(guide => [guide.path, guide.title])) as Record<GuidePath, string>,
} satisfies Record<Exclude<PublicPath, "/">, string>;

export function publicPageJsonLd(path: PublicPath): string {
  const url = publicPageUrl(path), page = PUBLIC_PAGES[path];
  const organizationId = `${canonicalOrigin}/#organization`;
  const websiteId = `${canonicalOrigin}/#website`;
  const breadcrumbId = `${url}#breadcrumb`;
  const isGuide = path.startsWith("/guides/");
  const data = {
    "@context": "https://schema.org", "@graph": [
      {
        "@type": "Organization", "@id": organizationId, name: "Etail Depot", legalName: legalIdentity.company,
        description: publicCompanyDescription,
        url: `${canonicalOrigin}/`, logo: `${canonicalOrigin}/brand/logo.png`, email: legalIdentity.complianceEmail,
        brand: legalIdentity.brands.map(brand => ({ "@type": "Brand", name: brand.name })),
        contactPoint: legalIdentity.brands.map(brand => ({
          "@type": "ContactPoint", name: brand.name, contactType: brand.name === "Ledgix" ? "Credit card inquiries" : "Payment acceptance support", email: brand.email,
        })),
      },
      {
        "@type": "WebSite", "@id": websiteId, name: "Etail Depot", url: `${canonicalOrigin}/`,
        description: PUBLIC_PAGES["/"].description, inLanguage: "en-US", publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description,
        dateModified: PUBLIC_PAGE_MODIFIED[path],
        inLanguage: "en-US", isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId },
        primaryImageOfPage: { "@type": "ImageObject", url: publicSocialImage.url, width: publicSocialImage.width, height: publicSocialImage.height },
        ...(path !== "/" ? { breadcrumb: { "@id": breadcrumbId } } : {}),
      },
      ...(path !== "/" ? [{
        "@type": "BreadcrumbList", "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Etail Depot", item: publicPageUrl("/") },
          ...(isGuide ? [{ "@type": "ListItem", position: 2, name: "Guides", item: publicPageUrl("/guides") }] : []),
          { "@type": "ListItem", position: isGuide ? 3 : 2, name: breadcrumbLabels[path], item: url },
        ],
      }] : []),
    ],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
