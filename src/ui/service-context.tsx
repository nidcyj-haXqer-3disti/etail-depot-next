import Link from "next/link";
import { canonicalOrigin } from "@/shared/public-release";

const contexts = {
  "/merchant-onboarding": ["Merchant onboarding", "merchant"],
  "/payment-methods": ["Payment methods", "merchant"],
  "/ach-payments": ["ACH payments", "merchant"],
  "/payouts-and-reconciliation": ["Payouts and reconciliation", "merchant"],
  "/refunds-and-disputes": ["Refunds and disputes", "merchant"],
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
export function ServiceContext({ path, structured = false }: { path: ServiceContextPath; structured?: boolean }) {
  const breadcrumb = serviceBreadcrumb(path);
  return <>{structured && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...breadcrumb }).replace(/</g, "\\u003c") }} />}<nav className="cw-context" aria-label="Breadcrumb"><ol>{breadcrumb.itemListElement.map((item, index) => <li key={item.item}>{index === breadcrumb.itemListElement.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.item.slice(canonicalOrigin.length)}>{item.name}</Link>}</li>)}</ol></nav></>;
}
