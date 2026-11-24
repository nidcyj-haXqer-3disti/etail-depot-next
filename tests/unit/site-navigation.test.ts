import { describe, expect, it } from "vitest";
import { DEVELOPER_PAGES } from "../../src/shared/site/developer-paths";
import { audienceUseCaseNavigation, publicDomainForPath, publicFooterGroups, publicNavigationGroups, publicNavigationLinks } from "../../src/shared/site/site-navigation";

describe("public navigation ownership", () => {
  it("places no-code checkout in Use cases while keeping the five Resource destinations unchanged", () => {
    const path = "/use-cases/no-code-checkout-experience";
    expect(audienceUseCaseNavigation).toHaveLength(4);
    expect(audienceUseCaseNavigation.at(-1)?.href).toBe(path);
    expect(publicDomainForPath(path)).toBe("use-cases");
    const resources = ["Merchant account setup", "Shopify integration", "WooCommerce integration", "Guides", "Help center"];
    expect(publicNavigationGroups.find(group => group.id === "resources")?.sections.flatMap(section => section.links.map(link => link.label))).toEqual(resources);
    expect(publicFooterGroups.find(group => group.label === "Resources")?.links.map(link => link.label)).toEqual(resources);
    const useCases = publicFooterGroups.find(group => group.label === "Use cases")!;
    expect(useCases.links.map(link => link.label)).toEqual(["Online businesses", "Software platforms", "Switch merchant services", "No code checkout experience"]);
    expect(useCases.links.at(-1)?.href).toBe(path);
    for (const groups of [publicFooterGroups, publicNavigationGroups.map(group => ({ label: group.label, links: group.sections.flatMap(section => section.links.map(link => ({ href: link.href }))) }))]) {
      const owningGroups = groups.filter(group => group.links.some(link => link.href === path)).map(group => group.label);
      expect(owningGroups).toEqual(["Use cases"]);
      expect(groups.flatMap(group => [...group.links]).some(link => String(link.href) === "/resources/no-code-checkout-experience")).toBe(false);
    }
  });

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
    for (const page of DEVELOPER_PAGES) expect(publicDomainForPath(page.href), page.label).toBe("developers");
    expect(publicDomainForPath("/developers/sdks-other")).toBeUndefined();
    expect(publicDomainForPath("/resources/guides/iso-8583/fields/39")).toBe("resources");
    expect(publicDomainForPath("/developers/getting-started-other")).toBeUndefined();
  });

  it("preserves supporting service and use-case contexts without inventing menu entries", () => {
    expect(publicDomainForPath("/services/merchant-services")).toBe("services");
    expect(publicDomainForPath("/services/payment-facilitator")).toBe("services");
    expect(publicDomainForPath("/use-cases/software-platforms/payment-models")).toBe("use-cases");
    expect(publicDomainForPath("/use-cases/software-platforms/partnerships")).toBe("use-cases");
    for (const pathname of ["/", "/pricing", "/company/about", "/company/legal", "/missing-page"]) {
      expect(publicDomainForPath(pathname), pathname).toBeUndefined();
    }
  });
});


it("offers one agent entrance outside the traditional topic menus", () => {
  expect(publicNavigationLinks.map(link => [link.label,link.href])).toEqual([["Pricing","/pricing"],["For agents","/agents"]]);
  expect(publicNavigationGroups.some(group=>group.sections.some(section=>section.links.some(link=>String(link.href)==="/agents")))).toBe(false);
  expect(publicFooterGroups.some(group=>group.links.some(link=>String(link.href)==="/agents"))).toBe(false);
  expect(publicDomainForPath("/agents")).toBeUndefined();
});
