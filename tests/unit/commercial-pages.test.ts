import { describe, it, expect } from "vitest";
import { COMMERCIAL_PATHS } from "../../src/shared/commercial-paths";
import { COMMERCIAL_PAGES } from "../../src/modules/public-site/commercial-content";
import { INDEXABLE_PUBLIC_PATHS, publicDocumentPath, publicPayloadPath } from "../../src/shared/public-page-inventory";
import { managedContentRoute } from "../../src/shared/public-routes";
import { servicePageMetadata } from "../../src/modules/public-site/metadata";
import { forbiddenStatic } from "../../tools/public-artifact-policy";

describe("PayFac commercial page scope", () => {
  it("includes exactly the thirteen approved decisions without adding industry or account routes", () => {
    expect(COMMERCIAL_PATHS).toEqual(["/merchant-onboarding", "/payment-methods", "/payouts-and-reconciliation", "/refunds-and-disputes", "/pricing", "/payment-partnerships", "/payment-facilitator", "/company", "/trust", "/contact", "/ach-payments", "/switch-payment-providers", "/platform-payment-models"]);
    expect(Object.keys(COMMERCIAL_PAGES)).toEqual([...COMMERCIAL_PATHS]);
  });
  it.each(COMMERCIAL_PATHS)("keeps %s in exact metadata, export and boundary scope", path => {
    expect(INDEXABLE_PUBLIC_PATHS).toContain(path);
    expect(servicePageMetadata(path).alternates?.canonical).toBe(`https://etaildepot.com${path}`);
    expect(JSON.stringify(servicePageMetadata(path).title).match(/Etail Depot/g)).toHaveLength(1);
    expect(publicDocumentPath(path + ".html")).toBe(path);
    expect(publicPayloadPath(path + ".txt")).toBe(path);
    expect(managedContentRoute(path + "/unreviewed")).toBe(true);
    expect(publicDocumentPath(path + "/unreviewed")).toBeNull();
    expect(forbiddenStatic(path.slice(1) + "/unreviewed.html")).toBe(true);
  });
});
