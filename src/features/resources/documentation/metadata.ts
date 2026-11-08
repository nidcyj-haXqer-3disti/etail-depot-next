import { servicePageMetadata } from "@/shared/seo/metadata";

export const pageDetails = { title: "Merchant Services Documentation", description: "Merchant account setup, checkout integration, payment updates, refunds and payout reconciliation for businesses and software platforms." } as const;
export const metadata = servicePageMetadata("/docs", pageDetails);

import { documentationPages, documentationPaths, documentationPath, documentationMetadata, type DocumentationSlug } from "./catalog";
import { canonicalOrigin, publicPageModified } from "@/shared/seo/metadata";
export function documentationJsonLd(slug?: DocumentationSlug): string {
  const page = slug ? documentationPages.find(item => item.slug === slug)! : null;
  const path = slug ? documentationPath(slug) : "/docs";
  const details = slug ? documentationMetadata[documentationPath(slug)] : pageDetails;
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
