import type { Metadata, MetadataRoute } from "next";
import { INDEXABLE_PUBLIC_PATHS, isIndexablePath } from "@/shared/site/public-page-inventory";
import { socialPreviewImage } from "./social-preview";
import { publicPageModified } from "@/shared/site/public-page-revisions";
import { canonicalOrigin, PUBLIC_INDEXING_APPROVAL, isApprovedSearchRelease } from "@/shared/site/public-release";
export { canonicalOrigin, PUBLIC_INDEXING_APPROVAL, isApprovedSearchRelease } from "@/shared/site/public-release";
export { publicPageModified } from "@/shared/site/public-page-revisions";
export type PageMetadataContent = { title: string; description: string };

export function publicIndexingEnabled(): boolean {
  return isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, process.env);
}

export const privateRobots: Metadata["robots"] = { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } };

export const publicSocialImage = socialPreviewImage("/", canonicalOrigin);

export const socialImageForPage = (path: string) => socialPreviewImage(path, canonicalOrigin);

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

export function publicPageMetadata(path: string, page: PageMetadataContent): Metadata {
  const url = new URL(path, canonicalOrigin).href;
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

export function servicePageMetadata(path: string, page: PageMetadataContent): Metadata {
  const url = new URL(path, canonicalOrigin).href;
  const title = page.title.endsWith("Etail Depot") ? page.title : `${page.title} | Etail Depot`;
  const image = socialImageForPage(path);
  return {
    title: { absolute: title }, description: page.description,
    alternates: { canonical: url }, robots: pageRobots(path),
    openGraph: { type: "website", url, title, description: page.description, siteName: "Etail Depot", locale: "en_US", images: [image] },
    twitter: { card: "summary_large_image", title, description: page.description, images: [image] },
  };
}
