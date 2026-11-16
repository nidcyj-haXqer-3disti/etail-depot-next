import type { Metadata } from "next";
import { canonicalOrigin, publicPageMetadata, socialImageForPage } from "@/shared/seo/metadata";
import { publicPageJsonLd } from "@/shared/seo/structured-data-builders";
import { publicCompanyDescription } from "@/shared/site/legal-identity";
import { blogArticles, type BlogArticle } from "./content";

export const pageDetails = { title: "Merchant payments Blog", description: "Articles from Etail Depot on accepting payments, merchant accounts, payment holds and working with a payment provider." } as const;
export const metadata = publicPageMetadata("/company/blog", pageDetails);
export const pageJsonLd = () => publicPageJsonLd("/company/blog", pageDetails, publicCompanyDescription, "Blog", blogArticles.length ? {
  id: "articles", name: "Etail Depot articles", items: blogArticles.map(article => ({ name: article.title, path: article.path })),
} : undefined);

export function articleMetadata(article: BlogArticle): Metadata {
  const base = publicPageMetadata(article.path, { title: article.searchTitle, description: article.summary });
  const image = article.cover ? { url: new URL(article.cover.src, canonicalOrigin).href, width: article.cover.width, height: article.cover.height, alt: article.cover.alt } : socialImageForPage(article.path);
  return {
    ...base,
    authors: [{ name: article.author.name, ...(article.author.url ? { url: new URL(article.author.url, canonicalOrigin).href } : {}) }],
    openGraph: { ...base.openGraph, type: "article", ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}), ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}), images: [image] },
    twitter: { ...base.twitter, images: [image.url] },
  };
}

/** Publication dates and attribution come only from the approved editorial record. */
export function articleJsonLd(article: BlogArticle): string {
  const url = new URL(article.path, canonicalOrigin).href;
  const base = JSON.parse(publicPageJsonLd(article.path, { title: article.title, description: article.summary }, publicCompanyDescription, article.title));
  const webpage = base["@graph"].find((node: { "@type": string }) => node["@type"] === "WebPage");
  webpage.mainEntity = { "@id": `${url}#article` };
  delete webpage.dateModified;
  if (article.updatedAt) webpage.dateModified = article.updatedAt;
  const breadcrumbs = base["@graph"].find((node: { "@type": string }) => node["@type"] === "BreadcrumbList");
  breadcrumbs.itemListElement = [
    { "@type": "ListItem", position: 1, name: "Etail Depot", item: `${canonicalOrigin}/` },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${canonicalOrigin}/company/blog` },
    { "@type": "ListItem", position: 3, name: article.title, item: url },
  ];
  // A generic sharing card is not editorial artwork for the article itself.
  const image = article.cover ? { "@type": "ImageObject", url: new URL(article.cover.src, canonicalOrigin).href, width: article.cover.width, height: article.cover.height, ...(article.cover.caption ? { caption: article.cover.caption } : {}) } : undefined;
  delete webpage.primaryImageOfPage;
  if (image) webpage.primaryImageOfPage = image;
  base["@graph"].push({
    "@type": "BlogPosting", "@id": `${url}#article`, url, headline: article.title, description: article.summary,
    inLanguage: "en-US", isAccessibleForFree: true,
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}), ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    author: { "@type": article.author.type, name: article.author.name, ...(article.author.url ? { url: new URL(article.author.url, canonicalOrigin).href } : {}) },
    publisher: { "@id": `${canonicalOrigin}/#organization` }, mainEntityOfPage: { "@id": `${url}#webpage` },
    ...(image ? { image } : {}),
  });
  return JSON.stringify(base).replace(/</g, "\\u003c");
}
