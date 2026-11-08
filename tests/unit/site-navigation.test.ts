import { describe, expect, it } from "vitest";
import { publicDomainForPath, publicNavigationGroups } from "../../src/shared/site/site-navigation";

describe("public navigation ownership", () => {
  it("highlights the group containing each published menu destination", () => {
    for (const group of publicNavigationGroups) {
      for (const section of group.sections) {
        for (const link of section.links) {
          const pathname = link.href.split("#")[0];
          expect(publicDomainForPath(pathname), `${group.label}: ${link.label}`).toBe(group.id);
        }
      }
    }
  });

  it("keeps the more specific resource destination ahead of the documentation parent", () => {
    expect(publicDomainForPath("/docs/merchant-onboarding")).toBe("resources");
    expect(publicDomainForPath("/docs/merchant-onboarding/example")).toBe("resources");
    expect(publicDomainForPath("/docs/payment-status")).toBe("developers");
    expect(publicDomainForPath("/guides/iso-8583/fields/39")).toBe("resources");
    expect(publicDomainForPath("/docs-other")).toBeUndefined();
  });

  it("preserves supporting service and use-case contexts without inventing menu entries", () => {
    expect(publicDomainForPath("/payment-acceptance-service")).toBe("services");
    expect(publicDomainForPath("/platform-payment-models")).toBe("use-cases");
    expect(publicDomainForPath("/payment-partnerships")).toBe("use-cases");
    for (const pathname of ["/", "/pricing", "/company", "/legal", "/missing-page"]) {
      expect(publicDomainForPath(pathname), pathname).toBeUndefined();
    }
  });
});
