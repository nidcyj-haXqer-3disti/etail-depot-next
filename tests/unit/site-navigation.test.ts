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
    expect(publicDomainForPath("/resources/merchant-account-setup")).toBe("resources");
    expect(publicDomainForPath("/resources/merchant-account-setup/example")).toBe("resources");
    expect(publicDomainForPath("/developers/api-reference")).toBe("developers");
    expect(publicDomainForPath("/resources/guides/iso-8583/fields/39")).toBe("resources");
    expect(publicDomainForPath("/developers/getting-started-other")).toBeUndefined();
  });

  it("preserves supporting service and use-case contexts without inventing menu entries", () => {
    expect(publicDomainForPath("/services/merchant-services")).toBe("services");
    expect(publicDomainForPath("/use-cases/software-platforms/payment-models")).toBe("use-cases");
    expect(publicDomainForPath("/use-cases/software-platforms/partnerships")).toBe("use-cases");
    for (const pathname of ["/", "/pricing", "/company/about", "/company/legal", "/missing-page"]) {
      expect(publicDomainForPath(pathname), pathname).toBeUndefined();
    }
  });
});
