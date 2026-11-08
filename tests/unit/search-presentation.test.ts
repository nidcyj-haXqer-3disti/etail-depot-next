import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { socialPreviewImage, socialPreviewKey, socialPreviews } from "../../src/shared/seo/social-preview";
import { canonicalOrigin, publicPageJsonLd, publicPageMetadata, publicPageModified, PUBLIC_PAGES, servicePageMetadata } from "../../src/features/metadata";
import { DEVELOPER_NAVIGATION } from "../../src/shared/site/developer-paths";
import { developerPageDetails } from "../../src/features/developers/metadata";

describe("Search presentation matches the page purpose", () => {
  it.each([
    ["/", "brand"], ["/services/merchant-services", "merchant"], ["/use-cases/software-platforms", "platforms"],
    ["/use-cases/switch-merchant-services", "provider"], ["/developers/getting-started", "documentation"], ["/resources/guides", "references"],
    ["/resources/guides/iso-20022/external-return-reason1-code/ac01", "iso20022"], ["/resources/guides/iso-8583/fields/2", "iso8583"],
    ["/services/card-services", "cards"],
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
    expect(publicPageMetadata("/services/card-services").description).toContain("virtual Visa secured credit card");
    expect(publicPageMetadata("/services/card-services").description).not.toMatch(/applications are not open/i);
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
    for (const page of DEVELOPER_NAVIGATION) {
      const metadata = servicePageMetadata(page.href);
      expect(metadata.title).toEqual({ absolute: `${page.label} | Etail Depot` });
      expect(metadata.alternates).toEqual({ canonical: `${canonicalOrigin}${page.href}` });
      expect(metadata.description).toBe(developerPageDetails[page.href].description);
      expect(page.label).not.toContain("Documentation");
    }
  });
});
