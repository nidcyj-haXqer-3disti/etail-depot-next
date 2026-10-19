import type { Metadata, MetadataRoute } from "next";
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
  "/": { title: "Payment Acceptance & Credit Card Processing", description: `Explore Trolleys for online payment acceptance and the ${cardProduct.name}, a virtual ${cardProduct.creditType} coming soon. Find product details, pricing and support.` },
  "/credit-card-services": { title: "Ledgix Secured Credit Card — Coming Soon", description: `Meet the ${cardProduct.name}, a virtual ${cardProduct.creditType} coming soon. $${productFacts.cards.minimumDepositDollars} minimum deposit; ${cardFeesDescription}. Applications are not open.` },
  "/payment-acceptance-service": { title: "Trolleys Payment Processing System", description: "Accept online card payments with Trolleys payment links and QR codes. Compare fees and optional Clarity chargeback prevention, including eligibility and limits." },
  "/help": { title: "Payment Acceptance & Credit Card Help", description: "Find Trolleys payment acceptance support, Ledgix credit card inquiries and sign-in guidance. Contact Etail Depot for website, privacy and legal questions." },
  "/guides/stripe-alternatives": { title: "Stripe Alternatives: Stripe vs Trolleys", description: "Compare Stripe and Trolleys for online card payments. Review payment links, processing and dispute fees, account requirements and questions to ask before switching." },
  "/guides/payment-processing-systems": { title: "Payment Processing Systems: A Merchant Guide", description: "Understand payment gateways, processors and merchant accounts. Compare ways to accept online payments, costs, payout terms and the setup your business needs." },
  "/guides/what-is-a-chargeback": { title: "What Is a Chargeback? Fees & Prevention", description: "Understand chargebacks vs. refunds, dispute fees and response evidence. Learn about chargeback prevention and what optional Trolleys Clarity covers." },
  "/guides/how-to-create-a-payment-link": { title: "How to Create and Share a Payment Link", description: "Prepare a Trolleys payment request, share a link or QR code and check payment status. Learn what to include, what customers see and how fees apply." },
} as const;
export type PublicPath = keyof typeof PUBLIC_PAGES;

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
  const breadcrumbLabels = { "/credit-card-services": serviceLabels.cards, "/payment-acceptance-service": serviceLabels.payments, "/help": "Help", "/guides/stripe-alternatives": "Stripe alternatives", "/guides/payment-processing-systems": "Payment processing systems", "/guides/what-is-a-chargeback": "What is a chargeback?", "/guides/how-to-create-a-payment-link": "Create a payment link" } as const;
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
        inLanguage: "en-US", isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId },
        primaryImageOfPage: { "@type": "ImageObject", url: publicSocialImage.url, width: publicSocialImage.width, height: publicSocialImage.height },
        ...(path !== "/" ? { breadcrumb: { "@id": breadcrumbId } } : {}),
      },
      ...(path !== "/" ? [{
        "@type": "BreadcrumbList", "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Etail Depot", item: publicPageUrl("/") },
          ...(isGuide ? [{ "@type": "ListItem", position: 2, name: serviceLabels.payments, item: publicPageUrl("/payment-acceptance-service") }] : []),
          { "@type": "ListItem", position: isGuide ? 3 : 2, name: breadcrumbLabels[path], item: url },
        ],
      }] : []),
    ],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
