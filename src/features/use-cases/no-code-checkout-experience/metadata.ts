import { publicPageMetadata, canonicalOrigin, publicPageModified } from "@/shared/seo/metadata";

const path = "/use-cases/no-code-checkout-experience";
export const pageDetails = {
  title: "No code checkout experience",
  description: "Learn how to create and share a payment link or QR code, add a Pay button and check payments. No custom website or code required.",
} as const;
export const metadata = publicPageMetadata(path, pageDetails);

export function noCodeCheckoutJsonLd() {
  const url = canonicalOrigin + path;
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: pageDetails.title, description: pageDetails.description, inLanguage: "en-US", dateModified: publicPageModified(path), isPartOf: { "@id": `${canonicalOrigin}/#website` }, publisher: { "@id": `${canonicalOrigin}/#organization` }, breadcrumb: { "@id": `${url}#breadcrumb` } },
    { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
      { "@type": "ListItem", position: 1, name: "Etail Depot", item: `${canonicalOrigin}/` },
      { "@type": "ListItem", position: 2, name: pageDetails.title, item: url },
    ] },
  ] }).replace(/</g, "\\u003c");
}
