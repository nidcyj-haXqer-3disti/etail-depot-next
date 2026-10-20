import { describe, expect, it } from "vitest";
import { GUIDE_TOPICS, PUBLISHED_GUIDES, paginateGuides, searchGuides, type GuideEntry, type GuideFormat } from "../../src/modules/public-site/guide-catalog";
import { PUBLIC_PAGES } from "../../src/modules/public-site/metadata";
import { reviewedPublicAppModule } from "../../tools/public-artifact-policy";

const approvedArticlePaths = [
  "/guides/how-to-create-a-payment-link", "/guides/payment-processing-systems", "/guides/stripe-alternatives",
  "/guides/optimize-your-mobile-checkout-experience", "/guides/cart-abandonment-vs-checkout-abandonment",
  "/guides/consuming-webhooks", "/guides/designing-robust-and-predictable-apis-with-idempotency",
  "/guides/what-is-a-chargeback", "/guides/how-3d-secure-works", "/guides/account-takeover-fraud",
  "/guides/important-invoice-management-tips", "/guides/types-of-invoice-discrepancies", "/guides/b2b-payment-methods",
  "/guides/ach-debit", "/guides/edi-payment-how-does-it-differ-from-ach-and-eft",
  "/guides/pick-the-right-payment-methods-in-a-new-country", "/guides/important-information-about-bic-and-swift-codes",
  "/guides/profit-and-loss-statement", "/guides/read-a-balance-sheet", "/guides/credit-card-interest",
];
const utilityArticlePaths = [
  "/guides/how-to-create-a-payment-link", "/guides/stripe-alternatives",
  "/guides/payment-processing-systems", "/guides/what-is-a-chargeback",
];
// The metadata helpers remain pure utilities; search, sorting and pagination are not library controls.
const utilityGuides = utilityArticlePaths.map(path => PUBLISHED_GUIDES.find(guide => guide.path === path)!);

function catalogFixture(count: number): readonly GuideEntry[] {
  const formats: GuideFormat[] = ["How-to", "Explainer", "Comparison"];
  return Object.freeze(Array.from({ length: count }, (_, index): GuideEntry => Object.freeze({
    path: `/guides/fixture-${index}`,
    title: `Guide ${String(index).padStart(4, "0")}`,
    description: `Café payments for merchant ${index}.`,
    topic: GUIDE_TOPICS[index % GUIDE_TOPICS.length].id,
    subtopic: "Synthetic test metadata",
    format: formats[index % formats.length],
    keywords: Object.freeze(["checkout", `segment-${index % 10}`]),
  })));
}

describe("published guide catalog", () => {
  it("contains exactly the twenty approved articles in the reviewed order and public boundaries", () => {
    expect(PUBLISHED_GUIDES.map(guide => guide.path)).toEqual(approvedArticlePaths);
    expect(new Set(PUBLISHED_GUIDES.map(guide => guide.path)).size).toBe(20);
    for (const guide of PUBLISHED_GUIDES) {
      expect(Object.hasOwn(PUBLIC_PAGES, guide.path)).toBe(true);
      expect(reviewedPublicAppModule(`${guide.path.slice(1)}/page.tsx`)).toBe(true);
      expect(GUIDE_TOPICS.some(topic => topic.id === guide.topic)).toBe(true);
      expect(["How-to", "Explainer", "Comparison"]).toContain(guide.format);
      expect(guide.subtopic.trim()).not.toBe("");
      expect(guide.path).not.toMatch(/draft|batch|preview|\?|#/);
    }
    expect(PUBLISHED_GUIDES.some(guide => String(guide.path) === "/guides/payment-processing-fees")).toBe(false);
  });

  it("has the ten approved topic groups while leaving empty groups without invented entries", () => {
    expect(GUIDE_TOPICS.map(topic => topic.id)).toEqual([
      "payment-processing-checkout", "ach-bank-transfers", "payments-by-business", "business-finance-accounting",
      "credit-cards-issuing", "in-person-payments-pos", "invoicing-recurring-payments", "gateways-apis-integrations",
      "chargebacks-refunds-fraud", "cross-border-merchant-infrastructure",
    ]);
    expect(new Set(GUIDE_TOPICS.map(topic => topic.label)).size).toBe(10);
    expect(GUIDE_TOPICS.map(topic => PUBLISHED_GUIDES.filter(guide => guide.topic === topic.id).length)).toEqual([5, 2, 1, 2, 1, 0, 2, 2, 3, 2]);
    expect(searchGuides(PUBLISHED_GUIDES, { topic: "in-person-payments-pos" })).toEqual([]);
    expect(new Set(PUBLISHED_GUIDES.map(guide => guide.topic)).size).toBe(9);
    for (const path of ["/guides/booking-system-with-payment", "/guides/countertop-payment-terminal", "/guides/use-a-cash-register", "/guides/charge-cards"]) {
      expect(PUBLISHED_GUIDES.some(guide => String(guide.path) === path)).toBe(false);
      expect(Object.hasOwn(PUBLIC_PAGES, path)).toBe(false);
    }
  });
});

describe("guide metadata search", () => {
  it("preserves recommended order and matches case-insensitive tokens across public metadata", () => {
    expect(searchGuides(utilityGuides)).toEqual(utilityGuides);
    expect(searchGuides(utilityGuides, { query: "  QR\tREQUEST  " }).map(guide => guide.path)).toEqual([utilityArticlePaths[0]]);
    expect(searchGuides(utilityGuides, { query: "CHARGE BACK" }).map(guide => guide.path)).toEqual([utilityArticlePaths[3]]);
    expect(searchGuides(utilityGuides, { query: "technology gateway" }).map(guide => guide.path)).toEqual([utilityArticlePaths[2]]);
    expect(searchGuides(utilityGuides, { query: "credit card processing", topic: "payment-processing-checkout", format: "Explainer" }).map(guide => guide.path)).toEqual([utilityArticlePaths[2]]);
    expect(searchGuides(utilityGuides, { query: "qr chargeback" })).toEqual([]);
  });

  it("combines topic, format and query filters and returns no results for regex-like input", () => {
    expect(searchGuides(utilityGuides, { query: "fees", topic: "payment-processing-checkout", format: "Comparison" }).map(guide => guide.path)).toEqual([utilityArticlePaths[1]]);
    expect(searchGuides(utilityGuides, { query: "fees", topic: "chargebacks-refunds-fraud", format: "Comparison" })).toEqual([]);
    expect(searchGuides(utilityGuides, { topic: "unapproved-topic" })).toEqual([]);
    expect(searchGuides(utilityGuides, { subtopic: "unapproved-subtopic" })).toEqual([]);
    expect(searchGuides(utilityGuides, { topic: "payment-processing-checkout", subtopic: "Payment processing", query: "credit card" }).map(guide => guide.path)).toEqual([utilityArticlePaths[2]]);
    expect(searchGuides(utilityGuides, { topic: "payment-processing-checkout", subtopic: "Payment links and QR codes", query: "credit card" })).toEqual([]);
    expect(searchGuides(utilityGuides, { format: "unapproved-format" })).toEqual([]);
    expect(searchGuides(utilityGuides, { query: `QR${" ".repeat(158)}ignored-over-limit-token` }).map(guide => guide.path)).toEqual([utilityArticlePaths[0]]);
    for (const query of [".*", "[", "(?=payment)", "<script>"]) expect(searchGuides(utilityGuides, { query })).toEqual([]);
  });

  it("sorts titles without mutating the recommended catalog", () => {
    const original = structuredClone(utilityGuides);
    expect(searchGuides(utilityGuides, { sort: "title" }).map(guide => guide.path)).toEqual([
      utilityArticlePaths[0], utilityArticlePaths[2], utilityArticlePaths[1], utilityArticlePaths[3],
    ]);
    expect(utilityGuides).toEqual(original);
    expect(searchGuides(utilityGuides)).not.toBe(utilityGuides);
  });

  it("filters 2000 frozen synthetic entries with token AND and accent normalization", () => {
    const entries = catalogFixture(2000);
    const before = JSON.stringify(entries);
    const matches = searchGuides(entries, { query: "CAFÉ segment-7" });
    expect(matches).toHaveLength(200);
    expect(matches.every(entry => entry.keywords.includes("segment-7"))).toBe(true);
    expect(searchGuides(entries, { query: "CAFE checkout" })).toHaveLength(2000);
    expect(searchGuides(entries, { query: "cafe missing-term" })).toEqual([]);
    const combined = searchGuides(entries, { query: "cafe", topic: "payment-processing-checkout", format: "Explainer" });
    expect(combined.length).toBeGreaterThan(0);
    expect(combined.every(entry => entry.topic === "payment-processing-checkout" && entry.format === "Explainer")).toBe(true);
    const reverseEntries = Object.freeze([...entries].reverse());
    expect(searchGuides(reverseEntries, { sort: "title" })).toEqual(entries);
    expect(JSON.stringify(entries)).toBe(before);
  });
});

describe("guide pagination", () => {
  it("handles empty and single-page catalogs with accurate counts", () => {
    expect(paginateGuides([], 99)).toEqual({ items: [], page: 1, totalPages: 0, total: 0 });
    expect(paginateGuides(utilityGuides, 99)).toEqual({ items: utilityGuides, page: 1, totalPages: 1, total: 4 });
  });

  it("clamps finite page values and bounds or defaults invalid page sizes", () => {
    const entries = catalogFixture(100);
    for (const page of [0, -9, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      expect(paginateGuides(entries, page).page).toBe(1);
    }
    expect(paginateGuides(entries, 2.9).page).toBe(2);
    expect(paginateGuides(entries, 999).page).toBe(9);
    for (const size of [0, -2, 0.9, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(paginateGuides(entries, 1, size).items).toHaveLength(12);
    }
    expect(paginateGuides(entries, 1, 4.9).items).toHaveLength(4);
    expect(paginateGuides(entries, 1, 999).items).toHaveLength(48);
  });

  it("visits every entry across 2000-item and filtered catalogs without gaps, duplicates or mutation", () => {
    const entries = catalogFixture(2000);
    const before = JSON.stringify(entries);
    const first = paginateGuides(entries, 1);
    expect(first).toMatchObject({ page: 1, totalPages: 167, total: 2000 });
    const pages = Array.from({ length: first.totalPages }, (_, index) => paginateGuides(entries, index + 1));
    expect(pages.flatMap(page => page.items)).toEqual(entries);
    expect(pages.at(-1)?.items).toHaveLength(8);
    const filtered = searchGuides(entries, { query: "segment-7" });
    const last = paginateGuides(filtered, 999);
    expect(last).toMatchObject({ page: 17, totalPages: 17, total: 200 });
    expect(last.items).toEqual(filtered.slice(192));
    expect(JSON.stringify(entries)).toBe(before);
  });
});
