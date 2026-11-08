import { canonicalOrigin } from "@/shared/site/public-release";

const contexts = {
  "/services/merchant-onboarding": ["Merchant onboarding", "merchant"],
  "/services/payment-methods": ["Payment methods", "merchant"],
  "/services/ach-payments": ["ACH payments", "merchant"],
  "/services/payouts": ["Payouts", "merchant"],
  "/services/refunds": ["Refunds", "merchant"],
  "/services/reconciliation": ["Reconciliation", "merchant"],
  "/services/disputes": ["Disputes", "merchant"],
  "/pricing": ["Pricing", "merchant"],
  "/use-cases/online-businesses": ["Online businesses", "merchant"],
  "/services/card-services": ["Card services", "home"],
  "/use-cases/software-platforms/payment-models": ["Payment models", "platform"],
  "/use-cases/software-platforms/partnerships": ["Payment partnerships", "platform"],
  "/use-cases/switch-merchant-services": ["Switch merchant services", "merchant"],
} as const;
export type ServiceContextPath = keyof typeof contexts;
export function serviceBreadcrumb(path: ServiceContextPath) {
  const [label, domain] = contexts[path];
  const items = [{ name: "Etail Depot", href: "/" }];
  if (domain !== "home") items.push(domain === "platform" ? { name: "Software platforms", href: "/use-cases/software-platforms" } : { name: "Merchant services", href: "/services/merchant-services" });
  items.push({ name: label, href: path });
  return { "@type": "BreadcrumbList", "@id": `${canonicalOrigin}${path}#breadcrumb`, itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: canonicalOrigin + (item.href === "/" ? "/" : item.href) })) };
}
export function ServiceBreadcrumbStructuredData({ path }: { path: ServiceContextPath }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...serviceBreadcrumb(path) }).replace(/</g, "\\u003c") }} />;
}
