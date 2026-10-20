import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import targets from "../../project-targets.json";
import { legalIdentity } from "../../src/shared/legal-identity";
import { legalPageMetadata } from "../../src/modules/public-site/legal-metadata";
import { canonicalOrigin, isApprovedSearchRelease, PUBLIC_INDEXING_APPROVAL, PUBLIC_PAGES, PUBLIC_PAGE_MODIFIED, privateRobots, publicIndexingEnabled, publicPageJsonLd, publicPageMetadata, publicPageUrl, publicRobots, publicSitemap, publicSocialImage, rootMetadata, type PublicPath } from "../../src/modules/public-site/metadata";
import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";
import socialImage, { dynamic as socialImageMode } from "../../src/app/opengraph-image";

const production = {
  NODE_ENV: "production", APP_ENV: "production", ETAIL_SEARCH_CONTEXT: "production", CONTEXT: "production",
  SITE_ID: targets.netlify.site_id, ETAIL_PUBLIC_ORIGIN: canonicalOrigin,
};
const publicPaths = ["/", "/credit-card-services", "/payment-acceptance-service", "/help", "/guides", "/guides/stripe-alternatives", "/guides/payment-processing-systems", "/guides/what-is-a-chargeback", "/guides/how-to-create-a-payment-link"] as const;
const rejectedEnvironments = [
  ["local development", { NODE_ENV: "development", APP_ENV: "local" }],
  ["local production build", { APP_ENV: "local" }],
  ["test", { APP_ENV: "test" }],
  ["preview search context", { ETAIL_SEARCH_CONTEXT: "deploy-preview" }],
  ["missing search context", { ETAIL_SEARCH_CONTEXT: undefined }],
  ["deploy preview", { CONTEXT: "deploy-preview" }],
  ["branch deploy", { CONTEXT: "branch-deploy" }],
  ["another site", { SITE_ID: "another-site" }],
  ["retired site", { SITE_ID: targets.denied.netlify_site_ids[0] }],
  ["local origin", { ETAIL_PUBLIC_ORIGIN: "http://127.0.0.1:3100" }],
  ["previous origin", { ETAIL_PUBLIC_ORIGIN: "https://etail-depot-next.netlify.app" }],
  ["nonexact origin", { ETAIL_PUBLIC_ORIGIN: `${canonicalOrigin}/` }],
] as const;

function stubEnvironment(changes: Readonly<Record<string, string | undefined>> = {}) {
  for (const [key, value] of Object.entries({ ...production, ...changes })) vi.stubEnv(key, value);
}
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("public search release boundary", () => {
  it("records D215 domain migration for only the exact reviewed site", () => {
    expect(PUBLIC_INDEXING_APPROVAL).toMatchObject({
      siteId: "cbbb6c24-9dbc-43a2-9234-e4357b5b5280", canonicalOrigin: "https://etaildepot.com",
    });
    expect(PUBLIC_INDEXING_APPROVAL.reviewReference).toMatch(/D215.*2026-10-14.*D122/);
    expect(PUBLIC_INDEXING_APPROVAL.reviewReference).toMatch(/D228.*2026-10-19/);
    expect(PUBLIC_INDEXING_APPROVAL.reviewReference).toMatch(/D288.*exact \/guides browse hub locally.*2026-10-19/);
    expect(isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, production)).toBe(true);
    expect(isApprovedSearchRelease(null, production)).toBe(false);
    for (const key of Object.keys(production).filter(key => key !== "CONTEXT")) {
      expect(isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, { ...production, [key]: undefined })).toBe(false);
    }
    for (const changed of [{ siteId: "another-site" }, { canonicalOrigin: "https://etail-depot-next.netlify.app" }, { reviewReference: " " }]) {
      expect(isApprovedSearchRelease({ ...PUBLIC_INDEXING_APPROVAL, ...changed }, production)).toBe(false);
    }
  });

  it.each(["build", "functions"])("enables the reviewed pages in an approved production %s environment", runtime => {
    stubEnvironment(runtime === "functions" ? { CONTEXT: undefined } : {});
    expect(publicIndexingEnabled()).toBe(true);
    for (const path of publicPaths) {
      expect(publicPageMetadata(path).robots).toEqual({ index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } });
    }
    expect(sitemap()).toEqual(publicPaths.map(path => ({ url: publicPageUrl(path), lastModified: PUBLIC_PAGE_MODIFIED[path] })));
    expect(robots()).toMatchObject({ sitemap: `${canonicalOrigin}/sitemap.xml` });
  });

  it.each(rejectedEnvironments)("keeps %s out of search even when unrelated indexing flags are enabled", (_label, changes) => {
    stubEnvironment(changes);
    vi.stubEnv("ENABLE_PUBLIC_INDEXING", "true");
    vi.stubEnv("PUBLIC_INDEXING_APPROVED", "true");
    expect(isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, { ...production, ...changes })).toBe(false);
    expect(publicIndexingEnabled()).toBe(false);
    expect(sitemap()).toEqual([]);
    expect(robots()).not.toHaveProperty("sitemap");
    for (const path of publicPaths) expect(publicPageMetadata(path).robots).toEqual(privateRobots);
  });

  it("keeps legal pages and the root fallback private even after production approval", () => {
    stubEnvironment();
    for (const path of ["/privacy", "/terms"] as const) expect(legalPageMetadata(path).robots).toEqual(privateRobots);
    expect(rootMetadata.robots).toMatchObject({ index: false, follow: false, googleBot: { index: false, follow: false } });
    expect(rootMetadata.alternates).toBeUndefined();
    expect(readFileSync("src/app/layout.tsx", "utf8")).toContain("metadata: Metadata = rootMetadata");
  });
});

describe("reviewed public metadata", () => {
  it("uses distinct truthful descriptions and fixed canonical URLs for exactly nine public pages", () => {
    expect(Object.keys(PUBLIC_PAGES)).toEqual(publicPaths);
    expect(canonicalOrigin).toBe(targets.netlify.canonical_origin);
    expect(new URL(String(rootMetadata.metadataBase)).origin).toBe(canonicalOrigin);
    expect(new Set(Object.values(PUBLIC_PAGES).map(page => page.title)).size).toBe(publicPaths.length);
    expect(new Set(Object.values(PUBLIC_PAGES).map(page => page.description)).size).toBe(publicPaths.length);
    for (const path of publicPaths) {
      const metadata = publicPageMetadata(path);
      expect(JSON.stringify(metadata)).not.toMatch(/prepaid|Each service has its own sign-in/i);
      expect(metadata.title).toEqual({ absolute: `${PUBLIC_PAGES[path].title} | Etail Depot` });
      if (path === "/credit-card-services") {
        expect(metadata.description).toContain("virtual Visa secured credit card");
        expect(metadata.description).toMatch(/upcoming|coming soon|forthcoming/i);
        expect(metadata.description).toContain("Applications are not open");
      }
      expect(metadata.alternates).toEqual({ canonical: new URL(path, canonicalOrigin).href });
      expect(metadata.openGraph).toMatchObject({ url: publicPageUrl(path), siteName: "Etail Depot", type: "website", images: [publicSocialImage] });
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: [publicSocialImage] });
    }
    expect(rootMetadata.openGraph).toMatchObject({ images: [publicSocialImage] });
    expect(rootMetadata.twitter).toMatchObject({ images: [publicSocialImage] });
    expect(publicSocialImage).toMatchObject({ url: `${canonicalOrigin}/opengraph-image`, width: 1200, height: 630 });
  });

  it.each(["/privacy", "/terms", "/login", "/services", "/security", "/operations", "/cardholder-services", "/card-services", "/payment-services", "/payment-acceptance", "/guides/", "/guides?account=private", "/guides#private", "/guides/unapproved-guide", "/guides/payment-processing-fees", "/guides/stripe-alternatives?account=private", "/guides/how-to-create-a-payment-link?account=private", "/guides/how-to-create-a-payment-link/checkout", "/merchants/person-id", "/pay/channel-id", "/api/v1/cardholder-services", "/help?case=private", "//another-site.test/", "/help/", "__proto__"])("refuses private or unreviewed path %s rather than creating search metadata", path => {
    expect(() => publicPageUrl(path as PublicPath)).toThrow("Only reviewed public");
    expect(() => publicPageMetadata(path as PublicPath)).toThrow("Only reviewed public");
    expect(() => publicPageJsonLd(path as PublicPath)).toThrow("Only reviewed public");
  });

  it("supplies the sitemap XML route with only reviewed page URLs and never private query data", () => {
    stubEnvironment();
    vi.stubEnv("URL", "https://another-site.test/?access_token=secret");
    vi.stubEnv("DEPLOY_PRIME_URL", "https://preview--another-site.test");
    expect(publicSitemap()).toEqual(publicPaths.map(path => ({ url: `${canonicalOrigin}${path}`, lastModified: PUBLIC_PAGE_MODIFIED[path] })));
    expect(sitemap()).toEqual(publicSitemap());
    expect(JSON.stringify(sitemap())).not.toMatch(/privacy|terms|login|api|access_token|another-site|preview|\?/);
    expect(publicRobots().rules).toEqual({ userAgent: "*", allow: "/", disallow: "/api/" });
    expect(publicRobots().sitemap).toBe(`${canonicalOrigin}/sitemap.xml`);
  });

  it("keeps reviewed page revision dates stable as the build clock advances", () => {
    stubEnvironment();
    expect(Object.keys(PUBLIC_PAGE_MODIFIED)).toEqual(publicPaths);
    for (const date of Object.values(PUBLIC_PAGE_MODIFIED)) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10)).toBe(date);
    }
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-01-01T00:00:00Z"));
    const firstBuild = publicSitemap();
    vi.setSystemTime(new Date("2030-12-31T23:59:59Z"));
    expect(publicSitemap()).toEqual(firstBuild);
    expect(firstBuild).toHaveLength(publicPaths.length);
    for (const page of firstBuild) expect(Object.keys(page)).toEqual(["url", "lastModified"]);
  });
});

describe("public structured data", () => {
  it.each(publicPaths)("connects confirmed organization, website and page facts for %s", path => {
    const serialized = publicPageJsonLd(path);
    const data = JSON.parse(serialized);
    const [organization, website, page] = data["@graph"];
    const expectedTypes = ["Organization", "WebSite", "WebPage", ...(path === "/" ? [] : ["BreadcrumbList"])];
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@graph"].map((node: { "@type": string }) => node["@type"])).toEqual(expectedTypes);
    expect(organization).toMatchObject({
      "@id": `${canonicalOrigin}/#organization`, name: "Etail Depot", legalName: legalIdentity.company,
      url: `${canonicalOrigin}/`, logo: `${canonicalOrigin}/brand/logo.png`, email: legalIdentity.complianceEmail,
      brand: legalIdentity.brands.map(brand => ({ "@type": "Brand", name: brand.name })),
    });
    expect(organization.contactPoint.map((contact: { email: string }) => contact.email)).toEqual(legalIdentity.brands.map(brand => brand.email));
    expect(website).toMatchObject({
      "@id": `${canonicalOrigin}/#website`, name: "Etail Depot", url: `${canonicalOrigin}/`, inLanguage: "en-US",
      publisher: { "@id": organization["@id"] },
    });
    expect(page).toMatchObject({
      url: publicPageUrl(path), name: PUBLIC_PAGES[path].title, description: PUBLIC_PAGES[path].description, inLanguage: "en-US",
      isPartOf: { "@id": website["@id"] }, publisher: { "@id": organization["@id"] },
      primaryImageOfPage: { "@type": "ImageObject", url: publicSocialImage.url, width: 1200, height: 630 },
    });
    expect(serialized).not.toMatch(/<|FinancialService|BankOrCreditUnion|aggregateRating|offers|address|sameAs|personId|cardId|channelId|access_token/);
  });

  it("provides two-level breadcrumbs for inner pages and no artificial home breadcrumb", () => {
    const labels = { "/credit-card-services": "Credit card", "/payment-acceptance-service": "Payment acceptance", "/help": "Help", "/guides": "Guides" } as const;
    for (const path of Object.keys(labels) as (keyof typeof labels)[]) {
      const graph = JSON.parse(publicPageJsonLd(path))["@graph"];
      const breadcrumb = graph[3];
      expect(graph[2].breadcrumb).toEqual({ "@id": breadcrumb["@id"] });
      expect(breadcrumb.itemListElement).toEqual([
        { "@type": "ListItem", position: 1, name: "Etail Depot", item: publicPageUrl("/") },
        { "@type": "ListItem", position: 2, name: labels[path], item: publicPageUrl(path) },
      ]);
    }
    expect(JSON.parse(publicPageJsonLd("/"))["@graph"][2]).not.toHaveProperty("breadcrumb");
  });

  it("connects each approved article to the exact Guides hub", () => {
    const labels = { "/guides/stripe-alternatives": "Stripe alternatives", "/guides/payment-processing-systems": "Payment processing systems", "/guides/what-is-a-chargeback": "What is a chargeback?", "/guides/how-to-create-a-payment-link": "Create a payment link" } as const;
    for (const path of Object.keys(labels) as (keyof typeof labels)[]) {
      const graph = JSON.parse(publicPageJsonLd(path))["@graph"];
      expect(graph[2].breadcrumb).toEqual({ "@id": graph[3]["@id"] });
      expect(graph[3].itemListElement).toEqual([
        { "@type": "ListItem", position: 1, name: "Etail Depot", item: publicPageUrl("/") },
        { "@type": "ListItem", position: 2, name: "Guides", item: publicPageUrl("/guides") },
        { "@type": "ListItem", position: 3, name: labels[path], item: publicPageUrl(path) },
      ]);
    }
  });

  it("escapes script-closing characters while preserving valid JSON and its original text", () => {
    const page = PUBLIC_PAGES["/help"];
    const original = Object.getOwnPropertyDescriptor(page, "description")!;
    const maliciousText = 'A </script><script>alert("unsafe")</script> description';
    try {
      Object.defineProperty(page, "description", { ...original, value: maliciousText });
      const serialized = publicPageJsonLd("/help");
      expect(serialized).not.toContain("<");
      expect(serialized).toContain("\\u003c/script>");
      expect(JSON.parse(serialized)["@graph"][2].description).toBe(maliciousText);
    } finally {
      Object.defineProperty(page, "description", original);
    }
  });
});

describe("social image release boundary", () => {
  it.each([
    ["approved production", {}, null],
    ["local production build", { APP_ENV: "local" }, "noindex, nofollow"],
    ["deploy preview", { CONTEXT: "deploy-preview" }, "noindex, nofollow"],
    ["another site", { SITE_ID: "another-site" }, "noindex, nofollow"],
  ] as const)("renders a bounded PNG with the correct indexing header for %s", async (_label, changes, expectedHeader) => {
    stubEnvironment({ CONTEXT: undefined, ...changes });
    expect(socialImageMode).toBe("force-static");
    const response = socialImage();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.headers.get("x-robots-tag")).toBe(expectedHeader);
    const bytes = Buffer.from(await response.arrayBuffer());
    expect(bytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
  });
});
