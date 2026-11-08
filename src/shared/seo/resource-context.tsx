import { canonicalOrigin } from "@/shared/site/public-release";

type ResourceCrumb = { name: string; href: string };

const companyLabels = {
  "/company": "Company",
  "/payment-facilitator": "Payment facilitator model",
  "/trust": "Security and privacy",
  "/contact": "Contact",
} as const;
export type CompanyContextPath = keyof typeof companyLabels;
function companyCrumbs(path: CompanyContextPath): ResourceCrumb[] {
  return [{ name: "Etail Depot", href: "/" }, ...(path === "/company" ? [] : [{ name: "Company", href: "/company" }]), { name: companyLabels[path], href: path }];
}
export function companyBreadcrumbData(path: CompanyContextPath) {
  return { "@type": "BreadcrumbList", "@id": `${canonicalOrigin}${path}#breadcrumb`, itemListElement: companyCrumbs(path).map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: canonicalOrigin + item.href })) };
}
