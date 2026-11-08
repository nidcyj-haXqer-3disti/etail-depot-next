import { servicePageMetadata } from "@/shared/seo/metadata";

export const pageDetails = { title: "Merchant Services for Software Platforms", description: "Merchant accounts, credit card processing, checkout and reporting for software platforms, with guidance on integration and merchant eligibility." } as const;
export const metadata = servicePageMetadata("/use-cases/software-platforms", pageDetails);

import { industryUseCaseNavigation } from "@/shared/site/industry-use-cases";
import { canonicalOrigin, publicPageModified } from "@/shared/seo/metadata";
export function platformPageJsonLd(path: "/use-cases/software-platforms"): string {
  const overviewPath = "/use-cases/software-platforms";
  if (path !== overviewPath) throw new Error("Unknown software platform page.");
  const page = pageDetails;
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
