import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { relatedArticles, blogArticles, moneyStopsMovingArticle, moneyStopsMovingBody, merchantPayoutHoldsArticle, merchantPayoutHoldsParagraphs, frozenFundsArticle, frozenFundsParagraphs, riskCommunicationArticle, riskCommunicationParagraphs, merchantSupportArticle, merchantSupportParagraphs, instantOnboardingArticle, instantOnboardingParagraphs, riversidePaymentsArticle, riversidePaymentsBody, declinedProcessingArticle, declinedProcessingBody, providerApprovalArticle, providerApprovalBody, payfacOperationsArticle, payfacOperationsBody, merchantCancellationArticle, merchantCancellationBody } from "../../src/features/company/blog/content";
import { articleJsonLd, articleMetadata, pageJsonLd } from "../../src/features/company/blog/metadata";
import { BLOG_PATHS, DRAFT_BLOG_PATHS } from "../../src/shared/site/blog-paths";
import { CORE_PUBLIC_PATHS, INDEXABLE_PUBLIC_PATHS } from "../../src/shared/site/public-page-inventory";
import { publicPageRedirect } from "../../src/shared/site/public-routes";
import { currentPublicHref } from "../../src/shared/site/page-url-migrations";
import { canonicalOrigin, PUBLIC_INDEXING_APPROVAL } from "../../src/shared/site/public-release";
import { pageRobots, privateRobots, publicSitemap } from "../../src/shared/seo/metadata";
import { publicFooterGroups, publicNavigationGroups } from "../../src/shared/site/site-navigation";
import { handlePublicRequest } from "../../netlify/edge-functions/public-boundary";
import { forbiddenStatic, reviewedPublicAppModule } from "../../tools/public-artifact-policy";

// Article digests retain the supplied copy plus the narrowly approved edits of 14 November 2026.
// This includes the approved first-article merchant reports; titles, dates and bylines are unchanged.
const production = {
  NODE_ENV: "production", APP_ENV: "production", ETAIL_SEARCH_CONTEXT: "production",
  CONTEXT: "production", SITE_ID: PUBLIC_INDEXING_APPROVAL.siteId, ETAIL_PUBLIC_ORIGIN: canonicalOrigin,
};
afterEach(() => vi.unstubAllEnvs());

describe("human-authored Company Blog articles", () => {
  it("preserves the seven approved text blocks without invented date, image or personal byline", () => {
    const blocks = [moneyStopsMovingArticle.title, moneyStopsMovingArticle.description, moneyStopsMovingBody.opening, moneyStopsMovingBody.heading, ...moneyStopsMovingBody.paragraphs];
    expect(blocks).toHaveLength(7);
    // SHA-256 of the seven approved text blocks, joined with two newlines.
    // Update only when the author supplies or approves revised article wording.
    expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("156f5f1151a2f08465371af2e3417073533174f6a0b92bf46b133babe2ce5fa6");
    expect(blogArticles).toEqual([moneyStopsMovingArticle, merchantPayoutHoldsArticle, frozenFundsArticle, riskCommunicationArticle, merchantSupportArticle, instantOnboardingArticle, riversidePaymentsArticle, declinedProcessingArticle, providerApprovalArticle, payfacOperationsArticle, merchantCancellationArticle]);
    expect(moneyStopsMovingArticle.author).toEqual({ name: "Etail Depot", type: "Organization", url: "/company/about" });
    for (const field of ["publishedAt", "updatedAt", "cover"]) expect(moneyStopsMovingArticle).not.toHaveProperty(field);
  });

  it("preserves the six author-approved second-article blocks without inventing dates or images", () => {
    const blocks = [merchantPayoutHoldsArticle.title, merchantPayoutHoldsArticle.description, ...merchantPayoutHoldsParagraphs];
    expect(blocks).toHaveLength(6);
    expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("256987eebca203969f6a9611effaf635c80b08af6162eae7983e1cbeedc2ff71");
    expect(merchantPayoutHoldsArticle.author).toEqual(moneyStopsMovingArticle.author);
    for (const field of ["publishedAt", "updatedAt", "cover"]) expect(merchantPayoutHoldsArticle).not.toHaveProperty(field);
  });

  it("preserves the four author-approved third-article blocks without inventing dates or images", () => {
    const blocks = [frozenFundsArticle.title, frozenFundsArticle.description, ...frozenFundsParagraphs];
    expect(blocks).toHaveLength(4);
    expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("60cf8265ca6d97c36d4a69b5a6d8998f8fe7e63e0e369e1bce25c215c0224685");
    expect(frozenFundsArticle.author).toEqual(moneyStopsMovingArticle.author);
    for (const field of ["publishedAt", "updatedAt", "cover"]) expect(frozenFundsArticle).not.toHaveProperty(field);
  });

  it("preserves the eight author-approved fourth-article blocks without inventing dates or images", () => {
    const blocks = [riskCommunicationArticle.title, riskCommunicationArticle.description, ...riskCommunicationParagraphs];
    expect(blocks).toHaveLength(8);
    expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("4c1e7a296e3aac263dcf8d432cf4f3c5c3744ae4aa6fb9c8054613b65f41d706");
    expect(riskCommunicationArticle.author).toEqual(moneyStopsMovingArticle.author);
    for (const field of ["publishedAt", "updatedAt", "cover"]) expect(riskCommunicationArticle).not.toHaveProperty(field);
  });

  it("preserves the six author-approved fifth-article blocks without inventing dates or images", () => {
    const blocks = [merchantSupportArticle.title, merchantSupportArticle.description, ...merchantSupportParagraphs];
    expect(blocks).toHaveLength(6);
    expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("7ed15d0e8746157ed8f3a7cc2fe92016a138e8d61bff3e75bc8ddd82e339bc35");
    expect(merchantSupportArticle.author).toEqual(moneyStopsMovingArticle.author);
    for (const field of ["publishedAt", "updatedAt", "cover"]) expect(merchantSupportArticle).not.toHaveProperty(field);
  });

  it("preserves the six author-approved sixth-article blocks without inventing dates or images", () => {
    const blocks = [instantOnboardingArticle.title, instantOnboardingArticle.description, ...instantOnboardingParagraphs];
    expect(blocks).toHaveLength(6);
    expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("51a727609da1af5ab3a0d772b219b7906623ce3460f211f471aa77699e9d802f");
    expect(instantOnboardingArticle.author).toEqual(moneyStopsMovingArticle.author);
    for (const field of ["publishedAt", "updatedAt", "cover"]) expect(instantOnboardingArticle).not.toHaveProperty(field);
  });

  it("preserves the approved Riverside article and remaining comparison cells with original source labels", () => {
    const body = riversidePaymentsBody;
    const blocks = [riversidePaymentsArticle.title, riversidePaymentsArticle.description, ...body.intro,
      ...body.sections.flatMap(section => [section.title, ...section.paragraphs]),
      body.comparisonTitle, ...body.comparison.flat(), body.closingTitle, ...body.closing,
      body.sourcesTitle, ...body.sources.map(parts => parts.map(part => part.text).join(""))];
    expect(blocks).toHaveLength(42);
    expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("f7caf1f2113f2d892c66c07192997042f8b45f9e3a50daf5f6154e4d13177448");
    expect(riversidePaymentsArticle.publishedAt).toBe("2026-11-12");
    expect(riversidePaymentsArticle.author).toEqual(moneyStopsMovingArticle.author);
    expect(riversidePaymentsArticle).not.toHaveProperty("updatedAt");
    expect(riversidePaymentsArticle).not.toHaveProperty("cover");
    expect(body.comparison).toHaveLength(6);
    expect(body.comparison.every(row => row.length === 3)).toBe(true);
    expect(body.sources.flat().flatMap(part => part.href ? [part.href] : [])).toEqual([
      "https://www.ftc.gov/node/338677", "https://www.ftc.gov/node/338680",
      "https://www.atg.wa.gov/news/news-releases/wa-ftc-reach-600k-settlement-payment-processing-company-deceptive-practices",
      "https://www.opb.org/article/2026/11/06/vancouver-credit-card-processor-misleads-customers/",
      "https://www.paymentsdive.com/news/payment-processor-settle-ftc-alleged-deceptive-fees/873669/",
      "https://www.ftc.gov/news-events/news/press-releases/2007/04/ftc-takes-aim-oregon-operation-targeted-small-businesses",
      "https://www.ftc.gov/node/46105",
    ]);
  });

  it("preserves the dated, author-approved processing-decline article and all three sections", () => {
    const body = declinedProcessingBody;
    const blocks = [declinedProcessingArticle.title, declinedProcessingArticle.description, body.intro,
      ...body.sections.flatMap(section => [section.title, ...section.paragraphs])];
    expect(blocks).toHaveLength(13);
    expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("d9ddd28469a6cdf4fda344e637dfd75a786cc640e4b6f458bde38ebdcdb3b62f");
    expect(declinedProcessingArticle.publishedAt).toBe("2026-11-12");
    expect(declinedProcessingArticle.author).toEqual(moneyStopsMovingArticle.author);
    expect(declinedProcessingArticle.sections.map(section => section.id)).toEqual(body.sections.map(section => section.id));
    expect(declinedProcessingArticle).not.toHaveProperty("updatedAt");
    expect(declinedProcessingArticle).not.toHaveProperty("cover");
  });

  it("preserves the dated, author-approved provider-approval article and all four sections", () => {
    const body = providerApprovalBody;
    const blocks = [providerApprovalArticle.title, providerApprovalArticle.description, ...body.intro,
      ...body.sections.flatMap(section => [section.title, ...section.paragraphs])];
    expect(blocks).toHaveLength(19);
    expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("a7cf9f4632609d49415d320915668bb7e663e4397295102869c14b086d4d51a4");
    expect(providerApprovalArticle.publishedAt).toBe("2026-11-12");
    expect(providerApprovalArticle.author).toEqual(moneyStopsMovingArticle.author);
    expect(providerApprovalArticle.sections.map(section => section.id)).toEqual(body.sections.map(section => section.id));
    expect(providerApprovalArticle).not.toHaveProperty("updatedAt");
    expect(providerApprovalArticle).not.toHaveProperty("cover");
  });

  it("preserves the dated, author-approved PayFac operations article and all three sections", () => {
    const body = payfacOperationsBody;
    const blocks = [payfacOperationsArticle.title, payfacOperationsArticle.description, ...body.intro,
      ...body.sections.flatMap(section => [section.title, ...section.paragraphs])];
    expect(blocks).toHaveLength(14);
    expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("2cf867b74f5e6b77c1f31ccbe2fb512023b052f98643cd8b9c318f6a4f54f5d6");
    expect(payfacOperationsArticle.publishedAt).toBe("2026-11-12");
    expect(payfacOperationsArticle.author).toEqual(moneyStopsMovingArticle.author);
    expect(payfacOperationsArticle.sections.map(section => section.id)).toEqual(body.sections.map(section => section.id));
    expect(payfacOperationsArticle).not.toHaveProperty("updatedAt");
    expect(payfacOperationsArticle).not.toHaveProperty("cover");
  });

  it("preserves the dated, author-approved merchant cancellation article and all three sections", () => {
    const body = merchantCancellationBody;
    const blocks = [merchantCancellationArticle.title, merchantCancellationArticle.description, ...body.intro,
      ...body.sections.flatMap(section => [section.title, ...section.paragraphs])];
    expect(blocks).toHaveLength(13);
    expect(createHash("sha256").update(blocks.join("\n\n")).digest("hex")).toBe("31da5e73d6645cd463cf48fc698b0f66cb7b0cd4fb26a6685db5469bfd193798");
    expect(merchantCancellationArticle.publishedAt).toBe("2026-11-12");
    expect(merchantCancellationArticle.author).toEqual(moneyStopsMovingArticle.author);
    expect(merchantCancellationArticle.sections.map(section => section.id)).toEqual(body.sections.map(section => section.id));
    expect(merchantCancellationArticle).not.toHaveProperty("updatedAt");
    expect(merchantCancellationArticle).not.toHaveProperty("cover");
  });

  it("keeps labelled reference links separate from the supplied article wording", () => {
    for (const article of blogArticles.filter(entry => entry !== riversidePaymentsArticle)) {
      expect(article.sources?.length).toBeGreaterThan(0);
      for (const source of article.sources ?? []) {
        expect(source.label.trim()).not.toBe("");
        if (source.href.startsWith("/")) expect(CORE_PUBLIC_PATHS).toContain(source.href);
        else {
          const url = new URL(source.href);
          expect(url.protocol).toBe("https:");
          expect(url.username + url.password).toBe("");
          // Preserve required source identifiers and pagination, without tracking parameters.
          if (url.origin === "https://news.ycombinator.com" && url.pathname === "/item") {
            expect([...url.searchParams.keys()]).toEqual(["id"]);
            expect(url.searchParams.get("id")).toMatch(/^[1-9]\d*$/);
          } else if (url.origin === "https://www.consumeraffairs.com" && url.pathname === "/business/square.html") {
            expect([...url.searchParams.keys()]).toEqual(["page"]);
            expect(url.searchParams.get("page")).toMatch(/^[1-9]\d*$/);
          } else {
            expect(url.search).toBe("");
          }
        }
      }
    }
  });

  it("keeps concise discovery copy separate from the original article and links only to other registered articles", () => {
    expect(new Set(blogArticles.map(article => article.searchTitle)).size).toBe(blogArticles.length);
    expect(new Set(blogArticles.map(article => article.summary)).size).toBe(blogArticles.length);
    for (const article of blogArticles) {
      expect(article.summary).not.toBe(article.description);
      expect(article.searchTitle.trim()).not.toBe("");
      expect(article.summary.trim()).not.toBe("");
      const related = relatedArticles(article);
      expect(related).toHaveLength(2);
      expect(new Set(related.map(entry => entry.path)).size).toBe(2);
      expect(related.map(entry => entry.path)).toEqual(article.relatedPaths);
      expect(related).not.toContain(article);
    }
  });

  it("admits only the twelve exact draft routes and keeps them out of every sitemap", () => {
    expect(BLOG_PATHS).toEqual(["/company/blog", moneyStopsMovingArticle.path, merchantPayoutHoldsArticle.path, frozenFundsArticle.path, riskCommunicationArticle.path, merchantSupportArticle.path, instantOnboardingArticle.path, riversidePaymentsArticle.path, declinedProcessingArticle.path, providerApprovalArticle.path, payfacOperationsArticle.path, merchantCancellationArticle.path]);
    expect(DRAFT_BLOG_PATHS).toEqual(BLOG_PATHS);
    for (const [key, value] of Object.entries(production)) vi.stubEnv(key, value);
    for (const path of BLOG_PATHS) {
      expect(CORE_PUBLIC_PATHS.filter(candidate => candidate === path)).toEqual([path]);
      expect(reviewedPublicAppModule(path.slice(1) + "/page.tsx")).toBe(true);
      expect(forbiddenStatic(path.slice(1) + ".html")).toBe(false);
      expect(pageRobots(path)).toEqual(privateRobots);
      expect(INDEXABLE_PUBLIC_PATHS).not.toContain(path);
    }
    expect(publicSitemap()).toHaveLength(3731);
    expect(publicSitemap().some(entry => entry.url.includes("/company/blog"))).toBe(false);
    vi.stubEnv("CONTEXT", "deploy-preview");
    expect(publicSitemap()).toEqual([]);
    for (const path of BLOG_PATHS) expect(pageRobots(path)).toEqual(privateRobots);
    for (const path of ["company/blog/unreviewed/page.tsx", "company/blog/[slug]/page.tsx", "resources/blog/page.tsx"]) expect(reviewedPublicAppModule(path)).toBe(false);
    expect(forbiddenStatic("company/blog/unreviewed.html")).toBe(true);
    expect(forbiddenStatic("resources/blog.html")).toBe(true);
  });

  it.each(blogArticles)("uses Company canonicals and accurate attribution for $title", article => {
    const metadata = articleMetadata(article);
    expect(metadata.alternates).toEqual({ canonical: canonicalOrigin + article.path });
    expect(metadata.robots).toEqual(privateRobots);
    expect(metadata.title).toEqual({ absolute: article.searchTitle + " | Etail Depot" });
    expect(metadata.description).toBe(article.summary);
    expect(metadata.openGraph).toMatchObject({ title: article.searchTitle + " | Etail Depot", description: article.summary });
    expect(metadata.twitter).toMatchObject({ title: article.searchTitle + " | Etail Depot", description: article.summary });
    expect(metadata.authors).toEqual([{ name: "Etail Depot", url: canonicalOrigin + "/company/about" }]);
    expect(metadata.openGraph).toMatchObject({ type: "article", section: "Merchant services", url: canonicalOrigin + article.path });
    if (article.publishedAt) expect(metadata.openGraph).toMatchObject({ publishedTime: article.publishedAt });
    else expect(metadata.openGraph).not.toHaveProperty("publishedTime");
    expect(metadata.openGraph).not.toHaveProperty("modifiedTime");
    const graph = JSON.parse(articleJsonLd(article))["@graph"];
    const posting = graph.find((node: { "@type": string }) => node["@type"] === "BlogPosting");
    expect(posting).toMatchObject({ headline: article.title, description: article.summary, author: { "@type": "Organization", name: "Etail Depot", url: canonicalOrigin + "/company/about" }, publisher: { "@id": canonicalOrigin + "/#organization" } });
    if (article.publishedAt) expect(posting.datePublished).toBe(article.publishedAt);
    else expect(posting).not.toHaveProperty("datePublished");
    for (const field of ["dateModified", "image"]) expect(posting).not.toHaveProperty(field);
    const webpage = graph.find((node: { "@type": string }) => node["@type"] === "WebPage");
    expect(webpage).not.toHaveProperty("dateModified");
    expect(webpage).not.toHaveProperty("primaryImageOfPage");
    const breadcrumbs = graph.find((node: { "@type": string }) => node["@type"] === "BreadcrumbList");
    expect(breadcrumbs.itemListElement.map((item: { item: string }) => item.item)).toEqual([canonicalOrigin + "/", canonicalOrigin + "/company/blog", canonicalOrigin + article.path]);
    const indexGraph = JSON.parse(pageJsonLd())["@graph"];
    const entries = indexGraph.find((node: { "@type": string }) => node["@type"] === "ItemList");
    expect(entries.numberOfItems).toBe(11);
    expect(entries.itemListElement.map((item: { name: string; url: string }) => ({ name: item.name, url: item.url }))).toEqual(blogArticles.map(entry => ({ name: entry.title, url: canonicalOrigin + entry.path })));
  });

  it("places Blog only in the Company footer and redirects its former exact Resources address", () => {
    const owners = publicFooterGroups.filter(group => group.links.some(link => String(link.href) === "/company/blog"));
    expect(owners.map(group => group.label)).toEqual(["Company"]);
    expect(owners[0].links.map(link => link.label)).toEqual(["About", "Blog", "Security and privacy", "Contact", "Legal"]);
    expect(publicNavigationGroups.flatMap(group => group.sections.flatMap(section => section.links.map(link => String(link.href))))).not.toContain("/company/blog");
    for (const suffix of ["", "/", ".html", "/index.html"]) expect(publicPageRedirect("/resources/blog" + suffix)).toBe("/company/blog");
    expect(currentPublicHref("/resources/blog#main-content")).toBe("/company/blog#main-content");
    for (const path of ["/resources/blog/unreviewed", "/resources/blog.txt", ...BLOG_PATHS]) expect(publicPageRedirect(path)).toBeNull();
  });

  it("serves static drafts read-only and rejects unknown articles or submitted input", async () => {
    for (const path of [...BLOG_PATHS, "/resources/blog", "/company/blog/unreviewed"]) {
      for (const method of ["GET", "HEAD", "POST"]) {
        const request = new Request(`${canonicalOrigin}${path}?private=discard`, { method, ...(method === "POST" ? { body: "not-for-a-blog" } : {}) });
        const next = vi.fn(async () => new Response(method === "HEAD" ? null : "static editorial page"));
        const response = await handlePublicRequest(request, { next, site: { id: PUBLIC_INDEXING_APPROVAL.siteId }, deploy: { context: "production" } }, production);
        expect(request.bodyUsed).toBe(false);
        expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
        expect(response.headers.has("set-cookie")).toBe(false);
        if (method === "POST") {
          expect(response.status).toBe(path === "/company/blog/unreviewed" ? 404 : 405);
          expect(response.headers.has("location")).toBe(false);
          expect(next).not.toHaveBeenCalled();
        } else if (path === "/resources/blog") {
          expect(response.status).toBe(308);
          expect(response.headers.get("location")).toBe(canonicalOrigin + "/company/blog");
          expect(next).not.toHaveBeenCalled();
        } else if (path === "/company/blog/unreviewed") {
          expect(response.status).toBe(404);
          expect(next).not.toHaveBeenCalled();
        } else {
          expect(response.status).toBe(200);
          expect(next).toHaveBeenCalledOnce();
        }
      }
    }
  });
});
