import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { socialPreviewImage, socialPreviewKey, socialPreviews } from "../../src/shared/social-preview";
import { canonicalOrigin, publicPageJsonLd, publicPageMetadata, publicPageModified, PUBLIC_PAGES, servicePageMetadata } from "../../src/modules/public-site/metadata";
import { documentationPages, documentationPath } from "../../src/modules/public-site/documentation-catalog";

describe("Search presentation matches the page purpose", () => {
  it.each([
    ["/", "brand"], ["/payment-acceptance-service", "merchant"], ["/software-partners", "platforms"],
    ["/switch-payment-providers", "provider"], ["/docs/checkout", "documentation"], ["/guides", "references"],
    ["/guides/iso-20022/external-return-reason1-code/ac01", "iso20022"], ["/guides/iso-8583/fields/2", "iso8583"],
    ["/credit-card-services", "cards"],
  ] as const)("selects the correct static preview for %s", (path, family) => {
    expect(socialPreviewKey(path)).toBe(family);
    const image = socialPreviewImage(path, canonicalOrigin);
    expect(image).toMatchObject({ width: 1200, height: 630 });
    expect(image.url).toBe(`${canonicalOrigin}${family === "brand" ? "/opengraph-image" : `/brand/social/${family}.png`}`);
    if (family === "cards") expect(image.alt).toContain("Virtual secured credit card");
    else expect(image.alt).not.toMatch(/Ledgix|Applications are not open/);
  });
  it("provides actual static PNGs for every specialized preview", () => {
    for (const key of Object.keys(socialPreviews).filter(key => key !== "brand")) {
      const bytes = readFileSync(`public/brand/social/${key}.png`);
      expect(bytes.subarray(1, 4).toString()).toBe("PNG");
      expect(bytes.readUInt32BE(16)).toBe(1200);
      expect(bytes.readUInt32BE(20)).toBe(630);
      expect(bytes.length).toBeLessThan(150000);
    }
  });
  it("describes the card product without application status copy", () => {
    expect(publicPageMetadata("/credit-card-services").description).toContain("virtual Visa secured credit card");
    expect(publicPageMetadata("/credit-card-services").description).not.toMatch(/applications are not open/i);
  });
  it("uses one modification date in the sitemap policy and structured page record", () => {
    for (const path of Object.keys(PUBLIC_PAGES) as Array<keyof typeof PUBLIC_PAGES>) {
      const nodes = JSON.parse(publicPageJsonLd(path))["@graph"];
      const page = nodes.find((node: Record<string, unknown>) => ["WebPage", "CollectionPage"].includes(String(node["@type"])));
      expect(page.dateModified).toBe(publicPageModified(path));
      expect(page.primaryImageOfPage.url).toBe(socialPreviewImage(path, canonicalOrigin).url);
    }
  });
  it("distinguishes documentation from service pages without changing navigation labels or URLs", () => {
    for (const page of documentationPages) {
      const metadata = servicePageMetadata(documentationPath(page.slug));
      expect(metadata.title).toEqual({ absolute: `${page.title} documentation | Etail Depot` });
      expect(metadata.alternates).toEqual({ canonical: `${canonicalOrigin}/docs/${page.slug}` });
      expect(metadata.description).toBe(page.description);
      expect(page.title).not.toContain("Documentation");
    }
  });
});
