import type { PageMetadataContent } from "./metadata";
import { canonicalOrigin, socialImageForPage, publicPageModified } from "@/shared/seo/metadata";
import { legalIdentity, publicCompanyDescription } from "@/shared/site/legal-identity";

export function publicPageJsonLd(path: string, page: PageMetadataContent, homeDescription: string, breadcrumbLabel?: string, collection?: { id: string; name: string; items: { name: string; path: string }[] }): string {
  const url = new URL(path, canonicalOrigin).href;
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
        description: homeDescription, inLanguage: "en-US", publisher: { "@id": organizationId },
      },
      {
        "@type": collection ? "CollectionPage" : "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description,
        ...(collection ? { mainEntity: { "@id": `${url}#${collection.id}` } } : {}),
        dateModified: publicPageModified(path),
        inLanguage: "en-US", isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId },
        primaryImageOfPage: { "@type": "ImageObject", url: socialImageForPage(path).url, width: 1200, height: 630 },
        ...(path !== "/" ? { breadcrumb: { "@id": breadcrumbId } } : {}),
      },
      ...(collection ? [{
        "@type": "ItemList", "@id": `${url}#${collection.id}`, name: collection.name,
        numberOfItems: collection.items.length, itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: collection.items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: new URL(item.path, canonicalOrigin).href })),
      }] : []),
      ...(path !== "/" ? [{
        "@type": "BreadcrumbList", "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Etail Depot", item: new URL("/", canonicalOrigin).href },
          { "@type": "ListItem", position: 2, name: breadcrumbLabel, item: url },
        ],
      }] : []),
    ],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
