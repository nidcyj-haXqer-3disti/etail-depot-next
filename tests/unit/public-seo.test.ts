import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import targets from "../../project-targets.json";
import { canonicalOrigin, isApprovedSearchRelease, PUBLIC_INDEXING_APPROVAL, PUBLIC_PAGES, privateRobots, publicIndexingEnabled, publicPageJsonLd, publicPageMetadata, publicPageUrl, publicRobots, publicSitemap, rootMetadata, type PublicPath } from "../../src/modules/public-site/metadata";
import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";
import socialImage from "../../src/app/opengraph-image";

const production = { NODE_ENV: "production", APP_ENV: "production", CONTEXT: "production", SITE_ID: targets.netlify.site_id, ETAIL_PUBLIC_ORIGIN: canonicalOrigin };
const approved = { siteId: targets.netlify.site_id, canonicalOrigin, reviewReference: "review-fixture-only" };
afterEach(() => vi.unstubAllEnvs());

describe("public search release boundary", () => {
  it("requires explicit reviewed approval plus every bound production condition", () => {
    expect(isApprovedSearchRelease(approved, production)).toBe(true);
    expect(isApprovedSearchRelease(null, production)).toBe(false);
    for (const key of Object.keys(production)) expect(isApprovedSearchRelease(approved, { ...production, [key]: undefined })).toBe(false);
    for (const changed of [{ APP_ENV: "local" }, { APP_ENV: "test" }, { CONTEXT: "deploy-preview" }, { CONTEXT: "branch-deploy" }, { SITE_ID: targets.denied.netlify_site_ids[0] }, { SITE_ID: "another-site" }, { ETAIL_PUBLIC_ORIGIN: "http://127.0.0.1:3100" }, { ETAIL_PUBLIC_ORIGIN: `${canonicalOrigin}/` }, { ETAIL_PUBLIC_ORIGIN: "https://etaildepot.com" }]) {
      expect(isApprovedSearchRelease(approved, { ...production, ...changed })).toBe(false);
    }
    for (const changed of [{ siteId: "another-site" }, { canonicalOrigin: "https://etaildepot.com" }, { reviewReference: " " }]) expect(isApprovedSearchRelease({ ...approved, ...changed }, production)).toBe(false);
  });
  it("cannot turn today's unapproved sandbox into an indexed site through environment flags", () => {
    for (const [key, value] of Object.entries(production)) vi.stubEnv(key, value);
    vi.stubEnv("ENABLE_PUBLIC_INDEXING", "true");
    vi.stubEnv("PUBLIC_INDEXING_APPROVED", "true");
    expect(PUBLIC_INDEXING_APPROVAL).toBeNull();
    expect(publicIndexingEnabled()).toBe(false);
    expect(sitemap()).toEqual([]);
    expect(robots()).not.toHaveProperty("sitemap");
    for (const path of Object.keys(PUBLIC_PAGES) as PublicPath[]) expect(publicPageMetadata(path).robots).toEqual(privateRobots);
  });
});

describe("public content and private service metadata", () => {
  it("has exactly four reviewed public pages, canonicalized to the recorded new site", () => {
    expect(Object.keys(PUBLIC_PAGES)).toEqual(["/", "/card-services", "/payment-services", "/help"]);
    expect(canonicalOrigin).toBe(targets.netlify.canonical_origin);
    expect(new URL(String(rootMetadata.metadataBase)).origin).toBe(canonicalOrigin);
    for (const path of Object.keys(PUBLIC_PAGES) as PublicPath[]) {
      const metadata = publicPageMetadata(path);
      expect(metadata.alternates).toEqual({ canonical: new URL(path, canonicalOrigin).href });
      expect(metadata.openGraph).toMatchObject({ url: publicPageUrl(path), siteName: "Etail Depot", type: "website" });
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    }
  });
  it.each(["/login", "/services", "/security", "/operations", "/cardholder-services", "/merchants/person-id", "/pay/channel-id", "/api/v1/cardholder-services", "/help?case=private", "//another-site.test/", "/help/", "__proto__"])("refuses private or unreviewed path %s rather than creating a canonical", path => {
    expect(() => publicPageUrl(path as PublicPath)).toThrow("Only reviewed public");
    expect(() => publicPageMetadata(path as PublicPath)).toThrow("Only reviewed public");
    expect(() => publicPageJsonLd(path as PublicPath)).toThrow("Only reviewed public");
  });
  it("keeps the private default and lets crawlers observe noindex on HTML", () => {
    expect(rootMetadata.robots).toMatchObject({ index: false, follow: false, googleBot: { index: false, follow: false } });
    expect(rootMetadata.alternates).toBeUndefined();
    expect(publicRobots().rules).toEqual({ userAgent: "*", allow: "/", disallow: "/api/" });
    expect(publicSitemap()).toEqual([]);
    expect(readFileSync("src/app/layout.tsx", "utf8")).toContain("metadata: Metadata = rootMetadata");
  });
  it("publishes only known brand and informational page facts, never product approval or private records", () => {
    const serialized = publicPageJsonLd("/payment-services");
    const data = JSON.parse(serialized);
    expect(data["@graph"].map((node: { "@type": string }) => node["@type"])).toEqual(["Organization", "WebSite", "WebPage"]);
    expect(data["@graph"][0]).toEqual({ "@type": "Organization", "@id": `${canonicalOrigin}/#organization`, name: "Etail Depot", url: `${canonicalOrigin}/`, logo: `${canonicalOrigin}/brand/logo.png` });
    expect(data["@graph"][2].url).toBe(`${canonicalOrigin}/payment-services`);
    expect(serialized).not.toMatch(/<|FinancialService|BankOrCreditUnion|aggregateRating|address|personId|cardId|channelId|access_token/);
  });
});


it("renders the real social image as a bounded PNG with indexing disabled", async () => {
  const response = socialImage();
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe("image/png");
  expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  const bytes = Buffer.from(await response.arrayBuffer());
  expect(bytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
});
