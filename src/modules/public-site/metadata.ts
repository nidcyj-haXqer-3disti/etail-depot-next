import type { Metadata, MetadataRoute } from "next";
import { INDEXABLE_PUBLIC_PATHS, isIndexablePath } from "@/shared/public-page-inventory";
import { serviceLabels } from "@/shared/service-language";
import { productFacts } from "@/shared/product-facts";
import { cardProduct } from "@/shared/card-product";
import { legalIdentity, publicCompanyDescription } from "@/shared/legal-identity";
import { canonicalOrigin, PUBLIC_INDEXING_APPROVAL, isApprovedSearchRelease } from "@/shared/public-release";
export { canonicalOrigin, PUBLIC_INDEXING_APPROVAL, isApprovedSearchRelease } from "@/shared/public-release";

const cardFeesDescription = productFacts.cards.annualFeeDollars === productFacts.cards.monthlyFeeDollars
  ? `$${productFacts.cards.annualFeeDollars} annual and monthly fees`
  : `$${productFacts.cards.annualFeeDollars} annual fee and $${productFacts.cards.monthlyFeeDollars} monthly fee`;

export const PUBLIC_PAGES = {
  "/": { title: "Merchant Services & Credit Card Processing", description: "Merchant services for US businesses and payment partnerships for software providers. Explore card and ACH acceptance, checkout, transaction records and payouts." },
  "/credit-card-services": { title: "Card Services: Ledgix Secured Credit Card", description: `${cardProduct.name}: virtual ${cardProduct.creditType}, $${productFacts.cards.minimumDepositDollars} minimum deposit, ${cardFeesDescription}. ${productFacts.cards.repayment}. Applications are not open.` },
  "/payment-acceptance-service": { title: "Merchant Services & Online Card Processing", description: "Accept online card and ACH payments with Trolleys. Explore checkout, transaction records, payouts, refunds and disputes, plus clear card processing fees." },
  "/help": { title: "Help Center: Merchant and Card Services", description: "Find Trolleys merchant support, Ledgix secured credit card inquiries and help signing in. Contact Etail Depot for website, privacy and legal questions." },
  "/guides": { title: "ISO 20022 & ISO 8583 Code Reference", description: "Browse ISO 20022 external code sets and an independent ISO 8583 implementation reference, with message types, field formats, explanations and identified sources." },
} as const;
export type PublicPath = keyof typeof PUBLIC_PAGES;

// UTC dates of each candidate page's last significant content update. Maintain when
// its content, relevant shared content, metadata or links materially change.
// Do not advance for deployments, cosmetic edits or copyright-year changes alone.
// Local revisions become public only in the next approved release.
export const PUBLIC_PAGE_MODIFIED = {
  "/": "2026-10-27",
  "/credit-card-services": "2026-10-24",
  "/payment-acceptance-service": "2026-10-27",
  "/help": "2026-10-27",
  "/guides": "2026-10-28",
} as const satisfies Record<PublicPath, string>;

export function publicIndexingEnabled(): boolean {
  return isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, process.env);
}

export const privateRobots: Metadata["robots"] = { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } };
export const publicSocialImage = {
  url: `${canonicalOrigin}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: `Etail Depot: Merchant services and card services. ${cardProduct.name}: applications are not open.`,
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
    robots: pageRobots(path),
    openGraph: { type: "website", url, title, description: page.description, siteName: "Etail Depot", locale: "en_US", images: [publicSocialImage] },
    twitter: { card: "summary_large_image", title, description: page.description, images: [publicSocialImage] },
  };
}

// Reviewed service and documentation pages share the same exact production guard.
export const SERVICE_PAGES = {
  "/docs/merchant-onboarding": { title: "Merchant Account Setup | Documentation", description: "Prepare a merchant application, complete account review and confirm processing readiness." },
  "/docs/integration-access": { title: "Integration Access | Documentation", description: "Map merchant accounts, permissions and separate credentials for checkout and reporting." },
  "/docs/checkout": { title: "Online Checkout | Documentation", description: "Connect an order to checkout, payment completion and a verified transaction result." },
  "/docs/payment-requests": { title: "Payment Requests | Documentation", description: "Create and share a hosted payment request, then match the transaction to the order." },
  "/docs/payment-status": { title: "Payment Status | Documentation", description: "Understand authorization, capture, pending results and safe recovery from an interrupted payment." },
  "/docs/refunds-and-disputes": { title: "Refunds and Disputes | Documentation", description: "Choose the appropriate refund or dispute action and follow the operation through its result." },
  "/docs/payouts": { title: "Payouts and Reconciliation | Documentation", description: "Reconcile settlements, fees and adjustments with funding records and bank receipt." },
  "/docs/webhooks": { title: "Events and Webhooks | Documentation", description: "Handle account, payment and funding events with verification, deduplication and recovery." },
  "/docs/testing-and-launch": { title: "Sandbox and Launch | Documentation", description: "Arrange sandbox access, confirm payment setup and prepare for launch." },
  "/online-businesses": { title: "Online Payments for Businesses", description: "Explore merchant onboarding, online card and ACH checkout, payment requests and payout records for your US business." },
  "/docs": { title: "Payment Documentation: Merchant Operations and Developer Integration", description: "Set up merchant accounts, integrate checkout, and manage payments through reconciliation. Documentation for merchant operations and developer integration." },
  "/software-partners": { title: "Payment Processing for Software Platforms", description: "Explore Trolleys merchant services for the US businesses using your software: card and ACH acceptance, payment records, refunds and disputes." },
} as const;
export function servicePageMetadata(path: keyof typeof SERVICE_PAGES): Metadata {
  if (!Object.hasOwn(SERVICE_PAGES, path)) throw new Error("Only the exact reviewed service page may use service metadata.");
  const page = SERVICE_PAGES[path], url = new URL(path, canonicalOrigin).href;
  const title = `${page.title} | Etail Depot`;
  return {
    title: { absolute: title }, description: page.description,
    alternates: { canonical: url }, robots: pageRobots(path),
    openGraph: { type: "website", url, title, description: page.description, siteName: "Etail Depot", locale: "en_US", images: [publicSocialImage] },
    twitter: { card: "summary_large_image", title, description: page.description, images: [publicSocialImage] },
  };
}
export function pageRobots(path: string): Metadata["robots"] {
  return isIndexablePath(path) && publicIndexingEnabled() ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } } : privateRobots;
}
export function publicPageModified(path: string): string {
  return Object.hasOwn(PUBLIC_PAGE_MODIFIED, path) ? PUBLIC_PAGE_MODIFIED[path as PublicPath] : path.startsWith("/guides/iso-8583") ? "2026-10-28" : "2026-10-27";
}
export function publicSitemap(): MetadataRoute.Sitemap {
  // Never read identities, services, cards, channels, support cases or database rows here.
  return publicIndexingEnabled() ? INDEXABLE_PUBLIC_PATHS.map(path => ({
    url: new URL(path, canonicalOrigin).href, lastModified: publicPageModified(path),
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
} satisfies Record<Exclude<PublicPath, "/">, string>;

export function publicPageJsonLd(path: PublicPath): string {
  const url = publicPageUrl(path), page = PUBLIC_PAGES[path];
  const organizationId = `${canonicalOrigin}/#organization`;
  const websiteId = `${canonicalOrigin}/#website`;
  const breadcrumbId = `${url}#breadcrumb`;
  const data = {
    "@context": "https://schema.org", "@graph": [
      {
        "@type": "Organization", "@id": organizationId, name: "Etail Depot", legalName: legalIdentity.company,
        description: publicCompanyDescription,
        url: `${canonicalOrigin}/`, logo: `${canonicalOrigin}/brand/logo.png`, email: legalIdentity.complianceEmail,
        brand: legalIdentity.brands.map(brand => ({ "@type": "Brand", name: brand.name })),
        contactPoint: legalIdentity.brands.map(brand => ({
          "@type": "ContactPoint", name: brand.name, contactType: brand.name === "Ledgix" ? "Credit card inquiries" : "Merchant support", email: brand.email,
        })),
      },
      {
        "@type": "WebSite", "@id": websiteId, name: "Etail Depot", url: `${canonicalOrigin}/`,
        description: PUBLIC_PAGES["/"].description, inLanguage: "en-US", publisher: { "@id": organizationId },
      },
      {
        "@type": path === "/guides" ? "CollectionPage" : "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description,
        ...(path === "/guides" ? { mainEntity: { "@id": `${url}#reference-collections` } } : {}),
        dateModified: PUBLIC_PAGE_MODIFIED[path],
        inLanguage: "en-US", isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId },
        primaryImageOfPage: { "@type": "ImageObject", url: publicSocialImage.url, width: publicSocialImage.width, height: publicSocialImage.height },
        ...(path !== "/" ? { breadcrumb: { "@id": breadcrumbId } } : {}),
      },
      ...(path === "/guides" ? [{
        "@type": "ItemList", "@id": `${url}#reference-collections`, name: "Payment standards",
        numberOfItems: 2, itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ISO 20022", url: `${url}/iso-20022` },
          { "@type": "ListItem", position: 2, name: "ISO 8583", url: `${url}/iso-8583` },
        ],
      }] : []),
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
