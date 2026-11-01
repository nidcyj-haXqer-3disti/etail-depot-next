import { canonicalOrigin } from "@/shared/public-release";

const contexts = {
  "/merchant-onboarding": ["Merchant onboarding", "merchant"],
  "/payment-methods": ["Payment methods", "merchant"],
  "/ach-payments": ["ACH payments", "merchant"],
  "/payouts-and-reconciliation": ["Payouts", "merchant"],
  "/refunds-and-disputes": ["Refunds", "merchant"],
  "/reconciliation": ["Reconciliation", "merchant"],
  "/disputes": ["Disputes", "merchant"],
  "/pricing": ["Pricing", "merchant"],
  "/online-businesses": ["Online businesses", "merchant"],
  "/credit-card-services": ["Card services", "home"],
  "/platform-payment-models": ["Payment models", "platform"],
  "/payment-partnerships": ["Payment partnerships", "platform"],
  "/switch-payment-providers": ["Switch merchant services", "merchant"],
} as const;
export type ServiceContextPath = keyof typeof contexts;
export function serviceBreadcrumb(path: ServiceContextPath) {
  const [label, domain] = contexts[path];
  const items = [{ name: "Etail Depot", href: "/" }];
  if (domain !== "home") items.push(domain === "platform" ? { name: "Software platforms", href: "/software-partners" } : { name: "Merchant services", href: "/payment-acceptance-service" });
  items.push({ name: label, href: path });
  return { "@type": "BreadcrumbList", "@id": `${canonicalOrigin}${path}#breadcrumb`, itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: canonicalOrigin + (item.href === "/" ? "/" : item.href) })) };
}
export function ServiceBreadcrumbStructuredData({ path }: { path: ServiceContextPath }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...serviceBreadcrumb(path) }).replace(/</g, "\\u003c") }} />;
}
