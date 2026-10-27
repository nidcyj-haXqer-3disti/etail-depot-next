import { describe, expect, it, vi } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { RETIRED_ARTICLE_PATHS } from "../../src/shared/retired-article-paths";
import { retiredArticleRoute } from "../../src/shared/public-routes";
import { STANDARD_REFERENCE_PATHS } from "../../src/shared/standard-reference-paths";
import { handlePublicRequest } from "../../netlify/edge-functions/public-boundary";
import { PUBLIC_PAGES, publicPageJsonLd } from "../../src/modules/public-site/metadata";
import { builtPageSources, forbiddenLocalReviewStatic, forbiddenStatic } from "../../tools/public-artifact-policy";

describe("article retirement without changing ISO references", () => {
  it("keeps only the hub and two standards families in the Guides source tree", () => {
    expect(readdirSync("src/app/guides").sort()).toEqual(["iso-20022", "iso-8583", "page.tsx"]);
    expect(existsSync("src/modules/public-site/local-guide-content")).toBe(false);
    expect(existsSync("src/modules/public-site/guide-catalog.ts")).toBe(false);
    expect(existsSync("src/shared/local-guide-paths.ts")).toBe(false);
    expect(STANDARD_REFERENCE_PATHS).toHaveLength(3706);
    expect(STANDARD_REFERENCE_PATHS.every(path => !retiredArticleRoute(path))).toBe(true);
    expect(STANDARD_REFERENCE_PATHS).toContain("/guides/iso-8583/messages/2100");
    expect(builtPageSources).toHaveLength(25);
    for (const path of RETIRED_ARTICLE_PATHS) {
      expect(builtPageSources as readonly string[]).not.toContain(`${path.slice(1)}/page.tsx`);
      expect(Object.hasOwn(PUBLIC_PAGES, path)).toBe(false);
      expect(forbiddenStatic(`${path.slice(1)}.html`)).toBe(true);
      expect(forbiddenLocalReviewStatic(`${path.slice(1)}.html`)).toBe(true);
    }
  });

  it("lists exactly the two visible ISO collections in the hub schema", () => {
    const graph = JSON.parse(publicPageJsonLd("/guides"))["@graph"];
    const list = graph.find((item: { "@type": string }) => item["@type"] === "ItemList");
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement.map((item: { url: string }) => item.url)).toEqual([
      "https://etaildepot.com/guides/iso-20022", "https://etaildepot.com/guides/iso-8583",
    ]);
  });

  it("retires each published address, alias and payload without reading or forwarding submissions", async () => {
    expect(RETIRED_ARTICLE_PATHS).toHaveLength(20);
    for (const path of RETIRED_ARTICLE_PATHS) {
      for (const suffix of ["", "/", ".html", "/index.html", ".txt", ".__next._tree.txt", "/__next._tree.txt"]) {
        for (const method of ["GET", "HEAD", "POST"]) {
          const request = new Request(`http://127.0.0.1:3226${path}${suffix}?token=ignored`, { method, ...(method === "POST" ? { body: "private-input" } : {}) });
          const next = vi.fn(async () => new Response("must not be reached"));
          const response = await handlePublicRequest(request, { next, deploy: { context: "dev" } }, { APP_ENV: "local", ETAIL_SEARCH_CONTEXT: "preview" });
          expect(response.status).toBe(410);
          expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
          expect(response.headers.get("cache-control")).toBe("no-store");
          expect(response.headers.has("location")).toBe(false);
          expect(response.headers.has("set-cookie")).toBe(false);
          expect(request.bodyUsed).toBe(false);
          expect(next).not.toHaveBeenCalled();
          if (method === "HEAD") expect(await response.text()).toBe("");
        }
      }
    }
  });

  it("recognizes encoded article bookmarks without retiring unrelated or ISO routes", () => {
    expect(retiredArticleRoute("/GUIDES/STRIPE-ALTERNATIVES")).toBe(true);
    expect(retiredArticleRoute("/guides/stripe%252dalternatives.html")).toBe(true);
    expect(retiredArticleRoute("//guides//stripe-alternatives.txt")).toBe(true);
    for (const path of ["/guides", "/guides/iso-8583", "/guides/iso-20022", "/guides/create-an-invoice", "/guides/stripe-alternatives-other", "/guides/%ZZ"]) expect(retiredArticleRoute(path)).toBe(false);
  });
});
