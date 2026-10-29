import { describe, expect, it, vi } from "vitest";
import { industryUseCaseNavigation } from "../../src/shared/industry-use-cases";
import { INDEXABLE_PUBLIC_PATHS, PUBLIC_CONTENT_PATHS } from "../../src/shared/public-page-inventory";
import { handlePublicRequest } from "../../netlify/edge-functions/public-boundary";
import { PUBLIC_INDEXING_APPROVAL, canonicalOrigin } from "../../src/shared/public-release";
import { platformPageJsonLd, publicSitemap, SERVICE_PAGES } from "../../src/modules/public-site/metadata";
import { forbiddenStatic, forbiddenLocalReviewStatic, localPreviewPageSources, localReviewHtmlFiles } from "../../tools/public-artifact-policy";

const sections = ["commerce-marketplaces", "freight-platforms", "travel-platforms", "legal-software"];
const removed = ["collection-software", ...sections];
describe("industry use cases share the Software platforms page", () => {
  it("keeps one canonical page and one sitemap member for the four sections", () => {
    vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("APP_ENV", "production");
    vi.stubEnv("ETAIL_SEARCH_CONTEXT", "production"); vi.stubEnv("ETAIL_PUBLIC_ORIGIN", canonicalOrigin);
    vi.stubEnv("SITE_ID", PUBLIC_INDEXING_APPROVAL.siteId); vi.stubEnv("CONTEXT", "production");
    try {
      expect(localPreviewPageSources).toEqual([]);
      expect(localReviewHtmlFiles).toHaveLength(3725);
      expect(INDEXABLE_PUBLIC_PATHS).toHaveLength(3723);
      const sitemap = publicSitemap();
      expect(sitemap).toHaveLength(3723);
      expect(sitemap.filter(item => item.url.includes("/use-cases/") || item.url.includes("#"))).toEqual([]);
      expect(sitemap.find(item => item.url === `${canonicalOrigin}/software-partners`)?.lastModified).toBe("2026-10-29");
      for (const slug of removed) {
        const route = `/use-cases/${slug}`;
        expect(PUBLIC_CONTENT_PATHS).not.toContain(route);
        expect(Object.hasOwn(SERVICE_PAGES, route)).toBe(false);
        for (const suffix of [".html", ".txt", "/__next._tree.txt", "/__next._full.txt", `/__next.use-cases.${slug}.__PAGE__.txt`]) {
          expect(forbiddenStatic(route.slice(1) + suffix)).toBe(true);
          expect(forbiddenLocalReviewStatic(route.slice(1) + suffix)).toBe(true);
        }
      }
    } finally { vi.unstubAllEnvs(); }
  });
  it("does not serve removed standalone routes at the hosting boundary", async () => {
    for (const slug of removed) {
      for (const context of ["production", "deploy-preview"]) {
        const next = vi.fn(async () => new Response("should not be served"));
        const response = await handlePublicRequest(new Request(`${canonicalOrigin}/use-cases/${slug}`), {next,site:{id:PUBLIC_INDEXING_APPROVAL.siteId},deploy:{context}}, {NODE_ENV:"production",APP_ENV:"production",ETAIL_SEARCH_CONTEXT:"production",ETAIL_PUBLIC_ORIGIN:canonicalOrigin});
        expect(response.status).toBe(404); expect(next).not.toHaveBeenCalled();
        expect(response.headers.get("x-robots-tag")).toContain("noindex");
      }
    }
  });
  it("describes the visible sections without inventing extra pages or offers", () => {
    const graph = JSON.parse(platformPageJsonLd("/software-partners"))["@graph"];
    expect(graph.map((node: { "@type": string }) => node["@type"])).toEqual(["WebPage", "BreadcrumbList", "ItemList"]);
    const list = graph[2];
    expect(list.numberOfItems).toBe(4);
    expect(list.itemListElement.map((item: {url:string}) => item.url)).toEqual(industryUseCaseNavigation.map(item => canonicalOrigin + item.href));
    expect(list.itemListElement.map((item: {url:string}) => new URL(item.url).hash)).toEqual(sections.map(slug => `#${slug}`));
    expect(() => platformPageJsonLd("/use-cases/collection-software" as Parameters<typeof platformPageJsonLd>[0])).toThrow("Unknown software");
  });
});
