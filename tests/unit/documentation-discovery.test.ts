import { describe, expect, it } from "vitest";
import { documentationPages, documentationPath, documentationPaths, documentationServiceLinks } from "../../src/modules/public-site/documentation-catalog";
import { documentationArticles } from "../../src/modules/public-site/documentation-content";
import { documentationJsonLd, publicPageModified, SERVICE_PAGES, servicePageMetadata } from "../../src/modules/public-site/metadata";
import { isPublicContentPath } from "../../src/shared/public-page-inventory";

describe("documentation discovery", () => {
  it("keeps all nine topics aligned across the introduction, metadata and structured data", () => {
    expect(documentationPages).toHaveLength(9);
    for (const topic of documentationPages) {
      const path = documentationPath(topic.slug);
      const graph = JSON.parse(documentationJsonLd(topic.slug))["@graph"];
      const page = graph.find((node: { "@type": string }) => node["@type"] === "WebPage");
      expect(SERVICE_PAGES[path]).toEqual({ title: `${topic.title} documentation`, description: documentationArticles[topic.slug].introduction });
      expect(servicePageMetadata(path).alternates?.canonical).toBe(page.url);
      expect(page.description).toBe(topic.description);
      expect(page.dateModified).toBe(publicPageModified(path));
      expect(isPublicContentPath(documentationServiceLinks[topic.slug].href.split("#")[0])).toBe(true);
    }
  });

  it("describes the exact nine visible topics without duplicating the refunds and disputes article", () => {
    const graph = JSON.parse(documentationJsonLd())["@graph"];
    const list = graph.find((node: { "@type": string }) => node["@type"] === "ItemList");
    const visible = documentationPaths.flatMap(group => group.tasks.flatMap(task => task.links.map(link => documentationPath(link.slug))));
    expect(list.numberOfItems).toBe(9);
    const urls: string[] = list.itemListElement.map((item: { url: string }) => new URL(item.url).pathname);
    expect(new Set(urls)).toEqual(new Set(visible));
    expect(urls).toHaveLength(new Set(urls).size);
  });

  it("keeps documentation metadata distinct from the commercial service pages", () => {
    for (const topic of documentationPages) {
      const servicePath = documentationServiceLinks[topic.slug].href.split("#")[0];
      const metadata = servicePageMetadata(documentationPath(topic.slug));
      expect(metadata.alternates?.canonical).not.toBe(`https://etaildepot.com${servicePath}`);
      expect(metadata.robots).toMatchObject({ index: false, follow: false });
    }
  });
});
