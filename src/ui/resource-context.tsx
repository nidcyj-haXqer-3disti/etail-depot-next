import Link from "next/link";
import { canonicalOrigin } from "@/shared/public-release";

export type ResourceCrumb = { name: string; href: string };

export function ResourceBreadcrumb({ items }: { items: readonly ResourceCrumb[] }) {
  return <nav className="resource-crumbs" aria-label="Breadcrumb"><ol>{items.map((item, index) => <li key={item.href}>{index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.href} prefetch={false}>{item.name}</Link>}</li>)}</ol></nav>;
}

const companyLabels = {
  "/company": "Company",
  "/payment-facilitator": "Payment facilitator model",
  "/trust": "Security and privacy",
  "/contact": "Contact",
} as const;
export type CompanyContextPath = keyof typeof companyLabels;
export function companyCrumbs(path: CompanyContextPath): ResourceCrumb[] {
  return [{ name: "Etail Depot", href: "/" }, ...(path === "/company" ? [] : [{ name: "Company", href: "/company" }]), { name: companyLabels[path], href: path }];
}
export function companyBreadcrumbData(path: CompanyContextPath) {
  return { "@type": "BreadcrumbList", "@id": `${canonicalOrigin}${path}#breadcrumb`, itemListElement: companyCrumbs(path).map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: canonicalOrigin + item.href })) };
}
