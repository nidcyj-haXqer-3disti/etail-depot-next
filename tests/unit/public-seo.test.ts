import { LEGAL_DOCUMENT_PATHS } from "../../src/shared/site/legal-paths";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import targets from "../../project-targets.json";
import { legalIdentity } from "../../src/shared/site/legal-identity";
import { legalPageMetadata } from "../../src/features/company/legal/metadata";
import { canonicalOrigin, isApprovedSearchRelease, servicePageMetadata, PUBLIC_INDEXING_APPROVAL, PUBLIC_PAGES, PUBLIC_PAGE_MODIFIED, privateRobots, publicIndexingEnabled, publicPageJsonLd, publicPageMetadata, publicPageUrl, publicRobots, publicSitemap, publicSocialImage, socialImageForPage, rootMetadata, type PublicPath } from "../../src/features/metadata";
import { CORE_PAGE_MODIFIED, REFERENCE_PAGE_MODIFIED } from "../../src/shared/site/public-page-revisions";
import { CORE_PUBLIC_PATHS, INDEXABLE_PUBLIC_PATHS } from "../../src/shared/site/public-page-inventory";
import { publicPageModified, pageRobots } from "../../src/features/metadata";
import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";
import socialImage, { dynamic as socialImageMode } from "../../src/app/opengraph-image";

const production = {
  NODE_ENV: "production", APP_ENV: "production", ETAIL_SEARCH_CONTEXT: "production", CONTEXT: "production",
  SITE_ID: targets.netlify.site_id, ETAIL_PUBLIC_ORIGIN: canonicalOrigin,
};
const guidePaths = [] as const;
const publicPaths = ["/", "/services/card-services", "/services/merchant-services", "/resources/help", "/resources/guides", ...guidePaths] as const;
const heldPaths = [
  "/resources/guides/booking-system-with-payment", "/resources/guides/countertop-payment-terminal",
  "/resources/guides/use-a-cash-register", "/resources/guides/charge-cards",
] as const;
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
  it("records candidate preparation for the exact reviewed site", () => {
    expect(PUBLIC_INDEXING_APPROVAL).toMatchObject({
      siteId: "cbbb6c24-9dbc-43a2-9234-e4357b5b5280", canonicalOrigin: "https://etaildepot.com",
    });
    expect(PUBLIC_INDEXING_APPROVAL.reviewReference).toContain("3751 content pages and 3731 search eligible URLs");
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
    expect(sitemap()).toEqual(INDEXABLE_PUBLIC_PATHS.map(path => ({ url: new URL(path, canonicalOrigin).href, lastModified: publicPageModified(path) })));
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
    for (const path of LEGAL_DOCUMENT_PATHS) {
      expect(legalPageMetadata(path).robots).toEqual(privateRobots);
      const metadata = JSON.stringify(legalPageMetadata(path));
      const legalCopy = path === "/company/legal" ? metadata.replaceAll("international documents are coming soon", "international documents") : metadata;
      expect(legalCopy).not.toMatch(/available now|coming soon|forthcoming|upcoming/i);
    }
    expect(rootMetadata.robots).toMatchObject({ index: false, follow: false, googleBot: { index: false, follow: false } });
    expect(rootMetadata.alternates).toBeUndefined();
    expect(readFileSync("src/app/layout.tsx", "utf8")).toContain("metadata: Metadata = rootMetadata");
  });
});

describe("reviewed public metadata", () => {
  it("keeps the reviewed Home and software platform metadata distinct", () => {
    expect(PUBLIC_PAGES["/"]).toEqual({
      title: "Merchant Services for Businesses and Platforms",
      description: "Merchant services for US businesses and software platforms. Credit card processing, ACH payments, online checkout and payout reporting.",
    });
    for (const changes of [{}, ...rejectedEnvironments.map(([, changes]) => changes)]) {
      stubEnvironment(changes);
      const metadata = servicePageMetadata("/use-cases/software-platforms");
      expect(metadata.robots).toEqual(pageRobots("/use-cases/software-platforms"));
      expect(metadata.alternates).toEqual({ canonical: `${canonicalOrigin}/use-cases/software-platforms` });
      expect(metadata.title).toEqual({ absolute: "Merchant Services for Software Platforms | Etail Depot" });
      expect(metadata.description).toBe("Merchant accounts, credit card processing, checkout and reporting for software platforms, with guidance on integration and merchant eligibility.");
      expect(metadata.openGraph).toMatchObject({ url: `${canonicalOrigin}/use-cases/software-platforms` });
      expect(publicSitemap().some(entry => entry.url.endsWith("/use-cases/software-platforms"))).toBe(publicIndexingEnabled());
    }
    expect(PUBLIC_PAGES).not.toHaveProperty("/use-cases/software-platforms");
    expect(PUBLIC_PAGE_MODIFIED).not.toHaveProperty("/use-cases/software-platforms");
    for (const path of ["/use-cases/software-platforms", "/use-cases/software-platforms/", "/use-cases/software-platforms?account=private", "/use-cases/software-platforms/contact"]) {
      expect(() => publicPageUrl(path as PublicPath)).toThrow("Only reviewed public");
      expect(() => publicPageMetadata(path as PublicPath)).toThrow("Only reviewed public");
      expect(() => publicPageJsonLd(path as PublicPath)).toThrow("Only reviewed public");
    }
    for (const path of ["/", "/use-cases/software-platforms/", "/use-cases/software-platforms?account=private", "/use-cases/software-platforms#private", "/use-cases/software-platforms/contact", "__proto__"]) {
      expect(() => servicePageMetadata(path as "/use-cases/software-platforms")).toThrow("Only the exact reviewed service page");
    }
  });

  it.each(["/developers/getting-started", "/use-cases/online-businesses", "/resources/merchant-account-setup", "/developers/getting-started", "/developers/getting-started", "/developers/developer-tools", "/developers/api-reference", "/developers/api-reference", "/developers/api-reference", "/developers/webhooks", "/developers/testing"] as const)("applies the exact production guard to %s", (previewPath) => {
    for (const changes of [{}, ...rejectedEnvironments.map(([, changes]) => changes)]) {
      stubEnvironment(changes);
      expect(servicePageMetadata(previewPath).robots).toEqual(pageRobots(previewPath));
      expect(servicePageMetadata(previewPath).alternates).toEqual({ canonical: `${canonicalOrigin}${previewPath}` });
      expect(publicSitemap().some(entry => entry.url.endsWith(previewPath))).toBe(publicIndexingEnabled() && !previewPath.startsWith("/developers/"));
    }
    expect(PUBLIC_PAGES).not.toHaveProperty(previewPath);
    expect(() => publicPageUrl(previewPath as PublicPath)).toThrow("Only reviewed public");
    for (const path of [`${previewPath}/`, `${previewPath}/api`, `${previewPath}?account=private`, `${previewPath}#private`]) {
      expect(() => servicePageMetadata(path as typeof previewPath)).toThrow("Only the exact reviewed service page");
    }
  });

  it("uses distinct truthful descriptions and fixed canonical URLs for the five retained nonlegal core pages", () => {
    expect(publicPaths).toHaveLength(5);
    expect(Object.keys(PUBLIC_PAGES)).toEqual(publicPaths);
    expect(canonicalOrigin).toBe(targets.netlify.canonical_origin);
    expect(new URL(String(rootMetadata.metadataBase)).origin).toBe(canonicalOrigin);
    expect(new Set(Object.values(PUBLIC_PAGES).map(page => page.title)).size).toBe(publicPaths.length);
    expect(new Set(Object.values(PUBLIC_PAGES).map(page => page.description)).size).toBe(publicPaths.length);
    for (const path of publicPaths) {
      const metadata = publicPageMetadata(path);
      expect(JSON.stringify(metadata)).not.toMatch(/prepaid|Each service has its own sign-in|available now|coming soon|forthcoming|upcoming/i);
      expect(metadata.title).toEqual({ absolute: `${PUBLIC_PAGES[path].title} | Etail Depot` });
      if (path === "/services/card-services") {
        expect(metadata.description).toContain("virtual Visa secured credit card");
        expect(metadata.description).toContain("$200 minimum deposit");
        expect(metadata.description).toContain("$0 annual and monthly fees");
        expect(metadata.description).toContain("Pay in full each month");
        expect(metadata.description).not.toContain("Applications are not open");
      }
      expect(metadata.alternates).toEqual({ canonical: new URL(path, canonicalOrigin).href });
      expect(metadata.openGraph).toMatchObject({ url: publicPageUrl(path), siteName: "Etail Depot", type: "website", images: [socialImageForPage(path)] });
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: [socialImageForPage(path)] });
    }
    expect(rootMetadata.openGraph).toMatchObject({ images: [publicSocialImage] });
    expect(rootMetadata.twitter).toMatchObject({ images: [publicSocialImage] });
    expect(publicSocialImage).toMatchObject({ url: `${canonicalOrigin}/opengraph-image`, width: 1200, height: 630 });
  });

  it.each(["/company/privacy", "/company/terms", "/login", "/services", "/security", "/operations", "/cardholder-services", "/card-services", "/payment-services", "/payment-acceptance", "/resources/guides/", "/resources/guides?account=private", "/resources/guides#private", "/resources/guides/unapproved-guide", "/resources/guides/payment-processing-fees", "/resources/guides/stripe-alternatives?account=private", "/resources/guides/how-to-create-a-payment-link?account=private", "/resources/guides/how-to-create-a-payment-link/checkout", "/merchants/person-id", "/pay/channel-id", "/api/v1/cardholder-services", "/resources/help?case=private", "//another-site.test/", "/resources/help/", "__proto__", ...heldPaths, "/resources/guides/sections/payment-processing-checkout", "/resources/guides/page/2", "/resources/guides#topic=payment-processing-checkout", "/resources/guides/ach-debit?source=private", "/resources/guides/ach-debit/checkout"])("refuses private or unreviewed path %s rather than creating search metadata", path => {
    expect(() => publicPageUrl(path as PublicPath)).toThrow("Only reviewed public");
    expect(() => publicPageMetadata(path as PublicPath)).toThrow("Only reviewed public");
    expect(() => publicPageJsonLd(path as PublicPath)).toThrow("Only reviewed public");
  });

  it("supplies the sitemap XML route with only reviewed page URLs and never private query data", () => {
    stubEnvironment();
    vi.stubEnv("URL", "https://another-site.test/?access_token=secret");
    vi.stubEnv("DEPLOY_PRIME_URL", "https://preview--another-site.test");
    expect(publicSitemap()).toEqual(INDEXABLE_PUBLIC_PATHS.map(path => ({ url: new URL(path, canonicalOrigin).href, lastModified: publicPageModified(path) })));
    expect(sitemap()).toEqual(publicSitemap());
    for (const entry of sitemap()) {
      const url = new URL(entry.url);
      expect(url.origin).toBe(canonicalOrigin);
      expect(url.search).toBe("");
      expect(url.hash).toBe("");
      expect(url.pathname).not.toMatch(/^\/(?:privacy|terms|login|api)(?:\/|$)/);
      expect(heldPaths).not.toContain(url.pathname);
    }
    expect(JSON.stringify(sitemap())).not.toMatch(/access_token|another-site|preview|\?/);
    expect(publicRobots().rules).toEqual({ userAgent: "*", allow: "/", disallow: "/api/" });
    expect(publicRobots().sitemap).toBe(`${canonicalOrigin}/sitemap.xml`);
  });

  it("requires an explicit revision for every core page and preserves unchanged reference dates", () => {
    expect(Object.keys(CORE_PAGE_MODIFIED).sort()).toEqual([...CORE_PUBLIC_PATHS].sort());
    expect(publicPageModified("/services/merchant-onboarding")).toBe("2026-11-05");
    expect(publicPageModified("/services/payment-methods")).toBe("2026-11-01");
    for (const [collection, date] of Object.entries(REFERENCE_PAGE_MODIFIED)) {
      expect(date).toBe("2026-10-29");
      for (const path of INDEXABLE_PUBLIC_PATHS.filter(path => path === collection || path.startsWith(`${collection}/`))) {
        expect(publicPageModified(path)).toBe(date);
      }
    }
  });

  it("does not invent revision dates for aliases, queries, retired or unknown references", () => {
    for (const path of ["/merchant-services", "/services/merchant-onboarding/", "/developers/getting-started?account=private", "/resources/guides#articles", "/resources/guides/iso-20022/unknown/code", "/resources/guides/iso-8583/2023/messages/2100", "/resources/guides/stripe-alternatives", "__proto__"]) {
      expect(() => publicPageModified(path)).toThrow("Only an exact reviewed page");
    }
  });

  it("keeps reviewed page revision dates stable as the build clock advances", () => {
    stubEnvironment();
    expect(Object.keys(PUBLIC_PAGE_MODIFIED)).toEqual(publicPaths);
    expect(PUBLIC_PAGE_MODIFIED["/resources/guides"]).toBe("2026-11-09");
    expect(PUBLIC_PAGE_MODIFIED["/services/merchant-services"]).toBe("2026-11-05");
    expect(PUBLIC_PAGE_MODIFIED["/resources/help"]).toBe("2026-11-05");
    expect(PUBLIC_PAGE_MODIFIED["/"]).toBe("2026-11-05");
    expect(PUBLIC_PAGE_MODIFIED["/services/card-services"]).toBe("2026-11-01");
    for (const date of Object.values(PUBLIC_PAGE_MODIFIED)) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10)).toBe(date);
    }
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-01-01T00:00:00Z"));
    const firstBuild = publicSitemap();
    vi.setSystemTime(new Date("2030-12-31T23:59:59Z"));
    expect(publicSitemap()).toEqual(firstBuild);
    expect(firstBuild).toHaveLength(INDEXABLE_PUBLIC_PATHS.length);
    for (const page of firstBuild) expect(Object.keys(page)).toEqual(["url", "lastModified"]);
  });
});

describe("public structured data", () => {
  it.each(publicPaths)("connects confirmed organization, website and page facts for %s", path => {
    const serialized = publicPageJsonLd(path);
    const data = JSON.parse(serialized);
    const [organization, website, page] = data["@graph"];
    const expectedTypes = ["Organization", "WebSite", path === "/resources/guides" ? "CollectionPage" : "WebPage", ...(path === "/resources/guides" ? ["ItemList"] : []), ...(path === "/" ? [] : ["BreadcrumbList"])];
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
      dateModified: publicPageModified(path),
      isPartOf: { "@id": website["@id"] }, publisher: { "@id": organization["@id"] },
      primaryImageOfPage: { "@type": "ImageObject", url: socialImageForPage(path).url, width: 1200, height: 630 },
    });
    expect(serialized).not.toMatch(/<|FinancialService|BankOrCreditUnion|aggregateRating|offers|address|sameAs|personId|cardId|channelId|access_token/);
    expect(page).not.toHaveProperty("author");
    expect(page).not.toHaveProperty("datePublished");
  });

  it("describes the real guide collection without claiming a search feature or new destination", () => {
    const graph = JSON.parse(publicPageJsonLd("/resources/guides"))["@graph"];
    const collection = graph.find((node: { "@type": string }) => node["@type"] === "CollectionPage");
    const list = graph.find((node: { "@type": string }) => node["@type"] === "ItemList");
    expect(collection.mainEntity).toEqual({ "@id": list["@id"] });
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement.map((item: { url: string }) => item.url)).toEqual([`${canonicalOrigin}/resources/guides/iso-20022`, `${canonicalOrigin}/resources/guides/iso-8583`]);
    expect(list.itemListElement.map((item: { name: string }) => item.name)).toEqual(["ISO 20022", "ISO 8583"]);
    expect(new Set(list.itemListElement.map((item: { url: string }) => item.url)).size).toBe(2);
    expect(JSON.stringify(graph)).not.toMatch(/SearchAction|aggregateRating|FAQPage/);
  });

  it("provides two-level breadcrumbs for inner pages and no artificial home breadcrumb", () => {
    const labels = { "/services/card-services": "Card services", "/services/merchant-services": "Merchant services", "/resources/help": "Help", "/resources/guides": "Guides" } as const;
    for (const path of Object.keys(labels) as (keyof typeof labels)[]) {
      const graph = JSON.parse(publicPageJsonLd(path))["@graph"];
      const breadcrumb = graph.find((node: { "@type": string }) => node["@type"] === "BreadcrumbList");
      expect(graph[2].breadcrumb).toEqual({ "@id": breadcrumb["@id"] });
      expect(breadcrumb.itemListElement).toEqual([
        { "@type": "ListItem", position: 1, name: "Etail Depot", item: publicPageUrl("/") },
        { "@type": "ListItem", position: 2, name: labels[path], item: publicPageUrl(path) },
      ]);
    }
    expect(JSON.parse(publicPageJsonLd("/"))["@graph"][2]).not.toHaveProperty("breadcrumb");
  });

  it("escapes script-closing characters while preserving valid JSON and its original text", () => {
    const page = PUBLIC_PAGES["/resources/help"];
    const original = Object.getOwnPropertyDescriptor(page, "description")!;
    const maliciousText = 'A </script><script>alert("unsafe")</script> description';
    try {
      Object.defineProperty(page, "description", { ...original, value: maliciousText });
      const serialized = publicPageJsonLd("/resources/help");
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
