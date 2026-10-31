import { documentationPages, documentationPaths, documentationPath, documentationMetadata, type DocumentationSlug } from "./documentation-catalog";
import { COMMERCIAL_PAGES } from "./commercial-content";
import { industryUseCaseNavigation } from "@/shared/industry-use-cases";
import type { Metadata, MetadataRoute } from "next";
import { INDEXABLE_PUBLIC_PATHS, isIndexablePath } from "@/shared/public-page-inventory";
import { socialPreviewImage } from "@/shared/social-preview";
import { CORE_PAGE_MODIFIED, publicPageModified } from "@/shared/public-page-revisions";
export { publicPageModified } from "@/shared/public-page-revisions";
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
  "/": { title: "Merchant Services for Businesses and Platforms", description: "Merchant services for US businesses and software platforms. Credit card processing, ACH payments, online checkout and payout reporting." },
  "/credit-card-services": { title: "Card Services: Ledgix Secured Credit Card", description: `${cardProduct.name}: virtual ${cardProduct.creditType}, $${productFacts.cards.minimumDepositDollars} minimum deposit, ${cardFeesDescription}. ${productFacts.cards.repayment}.` },
  "/payment-acceptance-service": { title: "Merchant Services and Credit Card Processing", description: "Merchant services and credit card processing for US businesses. Explore account setup, online checkout, ACH payments, refunds and payout reporting." },
  "/help": { title: "Help Center", description: "Get help with merchant account access, payment status, refunds, disputes and payouts. Find contacts for software integrations, card inquiries and privacy." },
  "/guides": { title: "ISO 20022 and ISO 8583 Payment References", description: "Find ISO 20022 external code definitions and independent ISO 8583 message and field explanations, with their code set, implementation and source context." },
} as const;
export type PublicPath = keyof typeof PUBLIC_PAGES;

// Preserve the public metadata subset while sharing one explicit page revision register.
export const PUBLIC_PAGE_MODIFIED = {
  "/": CORE_PAGE_MODIFIED["/"],
  "/credit-card-services": CORE_PAGE_MODIFIED["/credit-card-services"],
  "/payment-acceptance-service": CORE_PAGE_MODIFIED["/payment-acceptance-service"],
  "/help": CORE_PAGE_MODIFIED["/help"],
  "/guides": CORE_PAGE_MODIFIED["/guides"],
} as const satisfies Record<PublicPath, string>;

export function publicIndexingEnabled(): boolean {
  return isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, process.env);
}

export const privateRobots: Metadata["robots"] = { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } };
export const publicSocialImage = socialPreviewImage("/", canonicalOrigin);
export const socialImageForPage = (path: string) => socialPreviewImage(path, canonicalOrigin);
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
  const image = socialImageForPage(path);
  return {
    // Absolute titles also brand Home, where the root layout's child template does not apply.
    title: { absolute: title }, description: page.description,
    alternates: { canonical: url },
    robots: pageRobots(path),
    openGraph: { type: "website", url, title, description: page.description, siteName: "Etail Depot", locale: "en_US", images: [image] },
    twitter: { card: "summary_large_image", title, description: page.description, images: [image] },
  };
}

// Reviewed service and documentation pages share the same exact production guard.
export const SERVICE_PAGES = {
  ...COMMERCIAL_PAGES,
  ...documentationMetadata,
  "/online-businesses": { title: "Online Payments and Checkout", description: "Accept credit cards, digital wallets and ACH online. Connect checkout to orders and payment records using the methods enabled for your merchant account." },
  "/docs": { title: "Documentation", description: "Set up a merchant account, connect checkout and follow payments through to reconciliation." },
  "/software-partners": { title: "Merchant Services for Software Platforms", description: "Merchant accounts, credit card processing, checkout and reporting for software platforms, with guidance on integration and merchant eligibility." },
} as const;
export function servicePageMetadata(path: keyof typeof SERVICE_PAGES): Metadata {
  if (!Object.hasOwn(SERVICE_PAGES, path)) throw new Error("Only the exact reviewed service page may use service metadata.");
  const page = SERVICE_PAGES[path], url = new URL(path, canonicalOrigin).href;
  const title = page.title.endsWith("Etail Depot") ? page.title : `${page.title} | Etail Depot`;
  const image = socialImageForPage(path);
  return {
    title: { absolute: title }, description: page.description,
    alternates: { canonical: url }, robots: pageRobots(path),
    openGraph: { type: "website", url, title, description: page.description, siteName: "Etail Depot", locale: "en_US", images: [image] },
    twitter: { card: "summary_large_image", title, description: page.description, images: [image] },
  };
}
export function pageRobots(path: string): Metadata["robots"] {
  return isIndexablePath(path) && publicIndexingEnabled() ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } } : privateRobots;
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
        dateModified: publicPageModified(path),
        inLanguage: "en-US", isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId },
        primaryImageOfPage: { "@type": "ImageObject", url: socialImageForPage(path).url, width: 1200, height: 630 },
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

/** Describe the visible task library, without implying an API contract or rich result. */
export function documentationJsonLd(slug?: DocumentationSlug): string {
  const page = slug ? documentationPages.find(item => item.slug === slug)! : null;
  const path = slug ? documentationPath(slug) : "/docs";
  const details = SERVICE_PAGES[path];
  const url = new URL(path, canonicalOrigin).href;
  const group = page ? documentationPaths.find(item => item.title === page.group)! : null;
  const breadcrumbId = `${url}#breadcrumb`;
  const graph: object[] = [{
    "@type": slug ? "WebPage" : "CollectionPage", "@id": `${url}#webpage`,
    url, name: details.title, description: details.description,
    inLanguage: "en-US", dateModified: publicPageModified(path),
    isPartOf: { "@id": slug ? `${canonicalOrigin}/docs#webpage` : `${canonicalOrigin}/#website` },
    publisher: { "@id": `${canonicalOrigin}/#organization` },
    breadcrumb: { "@id": breadcrumbId },
    ...(!slug ? { mainEntity: { "@id": `${url}#topics` } } : {}),
  }];
  graph.push({
    "@type": "BreadcrumbList", "@id": breadcrumbId,
    itemListElement: [
      ...(!page ? [{ name: "Etail Depot", item: `${canonicalOrigin}/` }] : []),
      { name: "Documentation", item: `${canonicalOrigin}/docs` },
      ...(group ? [{ name: group.title, item: `${canonicalOrigin}/docs#${group.id}` }] : []),
      ...(page ? [{ name: page.title, item: url }] : []),
    ].map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })),
  });
  if (!page) {
    graph.push({
      "@type": "ItemList", "@id": `${url}#topics`, name: "Documentation topics",
      numberOfItems: documentationPages.length, itemListOrder: "https://schema.org/ItemListUnordered",
      itemListElement: documentationPaths.flatMap(group => documentationPages.filter(item => item.group === group.title))
        .map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.title, url: new URL(documentationPath(item.slug), canonicalOrigin).href })),
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

/** Describe only the visible platform overview and its four reviewed use cases. */
export function platformPageJsonLd(path: "/software-partners"): string {
  const overviewPath = "/software-partners";
  if (path !== overviewPath) throw new Error("Unknown software platform page.");
  const page = SERVICE_PAGES[path];
  const url = new URL(path, canonicalOrigin).href;
  const overviewUrl = new URL(overviewPath, canonicalOrigin).href;
  const breadcrumbId = `${url}#breadcrumb`;
  const trail = [
    { name: "Etail Depot", item: `${canonicalOrigin}/` },
    { name: "Software platforms", item: overviewUrl },
  ];
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`, url, name: page.title, description: page.description,
        inLanguage: "en-US", dateModified: publicPageModified(path),
        isPartOf: { "@id": `${canonicalOrigin}/#website` },
        publisher: { "@id": `${canonicalOrigin}/#organization` },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": `${overviewUrl}#industries` },
      },
      {
        "@type": "BreadcrumbList", "@id": breadcrumbId,
        itemListElement: trail.map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })),
      },
      ...([{
        "@type": "ItemList", "@id": `${overviewUrl}#industries`, name: "Industry use cases",
        numberOfItems: industryUseCaseNavigation.length, itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: industryUseCaseNavigation.map((item, index) => ({
          "@type": "ListItem", position: index + 1, name: item.label, url: new URL(item.href, canonicalOrigin).href,
        })),
      }]),
    ],
  }).replace(/</g, "\\u003c");
}
