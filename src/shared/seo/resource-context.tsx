import { canonicalOrigin } from "@/shared/site/public-release";

type ResourceCrumb = { name: string; href: string };

const companyLabels = {
  "/company/about": "Company",
  "/services/payment-facilitator": "Payment facilitator model",
  "/company/security": "Security and privacy",
  "/company/contact": "Contact",
} as const;
export type CompanyContextPath = keyof typeof companyLabels;
function companyCrumbs(path: CompanyContextPath): ResourceCrumb[] {
  return [{ name: "Etail Depot", href: "/" }, ...(path === "/company/about" ? [] : [{ name: "Company", href: "/company/about" }]), { name: companyLabels[path], href: path }];
}
export function companyBreadcrumbData(path: CompanyContextPath) {
  return { "@type": "BreadcrumbList", "@id": `${canonicalOrigin}${path}#breadcrumb`, itemListElement: companyCrumbs(path).map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: canonicalOrigin + item.href })) };
}
