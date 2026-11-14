import { afterEach, describe, expect, it, vi } from "vitest";
import { metadata, noCodeCheckoutJsonLd } from "../../src/features/use-cases/no-code-checkout-experience/metadata";
import { CORE_PUBLIC_PATHS, INDEXABLE_PUBLIC_PATHS, PUBLIC_CONTENT_PATHS } from "../../src/shared/site/public-page-inventory";
import { canonicalOrigin, PUBLIC_INDEXING_APPROVAL } from "../../src/shared/site/public-release";
import { pageRobots, privateRobots, publicSitemap } from "../../src/shared/seo/metadata";
import { currentPublicHref } from "../../src/shared/site/page-url-migrations";
import { publicPageRedirect } from "../../src/shared/site/public-routes";
import { handlePublicRequest } from "../../netlify/edge-functions/public-boundary";
import { forbiddenStatic, publicPageSources } from "../../tools/public-artifact-policy";

const path = "/use-cases/no-code-checkout-experience";
const oldPath = "/resources/no-code-checkout-experience";
const production = {
  NODE_ENV: "production", APP_ENV: "production", ETAIL_SEARCH_CONTEXT: "production",
  CONTEXT: "production", SITE_ID: PUBLIC_INDEXING_APPROVAL.siteId, ETAIL_PUBLIC_ORIGIN: canonicalOrigin,
};
afterEach(() => vi.unstubAllEnvs());

describe("no-code checkout use case", () => {
  it("has one current page and canonical while its unfinished setup stays out of search", () => {
    expect(CORE_PUBLIC_PATHS).toHaveLength(58);
    expect(PUBLIC_CONTENT_PATHS.filter(value => value === path)).toEqual([path]);
    expect(PUBLIC_CONTENT_PATHS).not.toContain(oldPath);
    expect(publicPageSources).toContain("use-cases/no-code-checkout-experience/page.tsx");
    expect(publicPageSources).not.toContain("resources/no-code-checkout-experience/page.tsx");
    expect(forbiddenStatic("use-cases/no-code-checkout-experience.html")).toBe(false);
    expect(forbiddenStatic("resources/no-code-checkout-experience.html")).toBe(true);
    expect(metadata.alternates).toEqual({ canonical: canonicalOrigin + path });
    expect(metadata.openGraph).toMatchObject({ url: canonicalOrigin + path });
    expect(metadata.robots).toEqual(privateRobots);
    const graph = JSON.parse(noCodeCheckoutJsonLd())["@graph"];
    expect(graph.map((node: { "@type": string }) => node["@type"])).toEqual(["WebPage", "BreadcrumbList"]);
    expect(graph[0].url).toBe(canonicalOrigin + path);
    expect(graph[1].itemListElement.at(-1).item).toBe(canonicalOrigin + path);
    expect(noCodeCheckoutJsonLd()).not.toContain(oldPath);
    for (const [key, value] of Object.entries(production)) vi.stubEnv(key, value);
    expect(pageRobots(path)).toEqual(privateRobots);
    expect(INDEXABLE_PUBLIC_PATHS).not.toContain(path);
    expect(publicSitemap()).toHaveLength(3731);
    expect(publicSitemap().some(entry => entry.url === canonicalOrigin + path)).toBe(false);
    vi.stubEnv("CONTEXT", "deploy-preview");
    expect(pageRobots(path)).toEqual(privateRobots);
    expect(publicSitemap()).toEqual([]);
  });

  it("moves only the exact former Resource page and retains authored section bookmarks", () => {
    for (const suffix of ["", "/", ".html", "/index.html"]) expect(publicPageRedirect(oldPath + suffix)).toBe(path);
    expect(currentPublicHref(oldPath + "#setup")).toBe(path + "#setup");
    expect(publicPageRedirect(path)).toBeNull();
    for (const retiredOrUnknown of [oldPath + ".txt", oldPath + "/submit", "/resources/custom-website-integration", "/services/checkout-experience"]) {
      expect(publicPageRedirect(retiredOrUnknown), retiredOrUnknown).toBeNull();
      expect(PUBLIC_CONTENT_PATHS, retiredOrUnknown).not.toContain(retiredOrUnknown);
    }
  });

  it("keeps the draft and its redirect noindex and never reads or forwards submitted bodies", async () => {
    for (const route of [path, oldPath]) {
      for (const method of ["GET", "HEAD", "POST"]) {
        const request = new Request(`${canonicalOrigin}${route}?private=discard`, { method, ...(method === "POST" ? { body: "private-input-must-not-be-read" } : {}) });
        const next = vi.fn(async () => new Response(method === "HEAD" ? null : "static draft"));
        const response = await handlePublicRequest(request, { next, site: { id: PUBLIC_INDEXING_APPROVAL.siteId }, deploy: { context: "production" } }, production);
        expect(request.bodyUsed).toBe(false);
        expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
        expect(response.headers.has("set-cookie")).toBe(false);
        if (method === "POST") {
          expect(response.status).toBe(405);
          expect(response.headers.has("location")).toBe(false);
          expect(next).not.toHaveBeenCalled();
        } else if (route === oldPath) {
          expect(response.status).toBe(308);
          expect(response.headers.get("location")).toBe(canonicalOrigin + path);
          expect(await response.text()).toBe("");
          expect(next).not.toHaveBeenCalled();
        } else {
          expect(response.status).toBe(200);
          expect(response.headers.has("location")).toBe(false);
          expect(next).toHaveBeenCalledOnce();
        }
      }
    }
  });
});
