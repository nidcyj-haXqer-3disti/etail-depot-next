import { publicNavigationGroups, publicFooterGroups } from "../../src/shared/site/site-navigation";
import { describe, it, expect } from "vitest";
import { COMMERCIAL_PATHS } from "../../src/shared/site/commercial-paths";
import { COMMERCIAL_PAGES } from "../../src/features/commercial-catalog";
import { INDEXABLE_PUBLIC_PATHS, publicDocumentPath, publicPayloadPath } from "../../src/shared/site/public-page-inventory";
import { managedContentRoute } from "../../src/shared/site/public-routes";
import { servicePageMetadata } from "../../src/features/metadata";
import { forbiddenStatic } from "../../tools/public-artifact-policy";

describe("PayFac commercial page scope", () => {
  it("includes exactly the fifteen approved decisions without adding industry or account routes", () => {
    expect(COMMERCIAL_PATHS).toEqual(["/services/merchant-onboarding", "/services/payment-methods", "/services/payouts", "/services/refunds", "/pricing", "/use-cases/software-platforms/partnerships", "/services/payment-facilitator", "/company/about", "/company/security", "/company/contact", "/services/ach-payments", "/use-cases/switch-merchant-services", "/use-cases/software-platforms/payment-models", "/services/reconciliation", "/services/disputes"]);
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


describe("dedicated service destinations", () => {
  it("gives all eight services distinct canonical pages shared by header and footer", () => {
    const services = publicNavigationGroups.find(group => group.id === "services")!.sections[0].links;
    expect(services.map(link => link.href)).toEqual(["/services/merchant-onboarding", "/services/payment-methods", "/services/ach-payments", "/services/payouts", "/services/reconciliation", "/services/refunds", "/services/disputes", "/services/card-services"]);
    expect(new Set(services.map(link => link.href)).size).toBe(8);
    expect(publicFooterGroups[0].links).toEqual(services);
    for (const link of services) { expect(link.href).not.toContain("#"); expect(INDEXABLE_PUBLIC_PATHS).toContain(link.href); }
  });
});
