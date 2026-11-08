import { DEVELOPER_NAVIGATION } from "./developer-paths";
import { serviceLabels } from "./service-language";

/** Public information architecture; these are local information pages, not account routes. */
export const serviceNavigation = [
  { href: "/services/merchant-services", label: serviceLabels.payments, description: "Credit card processing, wallets and ACH." },
  { href: "/services/card-services", label: serviceLabels.cards, description: "A virtual Visa secured credit card." },
] as const;
export const audienceUseCaseNavigation = [
  { href: "/use-cases/software-platforms", label: "Software platforms", description: "Merchant services for your software." },
  { href: "/use-cases/online-businesses", label: "Online businesses", description: "Online checkout for your customers." },
  { href: "/use-cases/switch-merchant-services", label: "Switch merchant services", description: "Account options, fees and the steps to switch." },
] as const;

export const useCaseNavigation = audienceUseCaseNavigation;
export const platformContextNavigation = [
  { href: "/use-cases/software-platforms/payment-models", label: "Payment models", description: "Seller, account and payment responsibilities." },
  { href: "/use-cases/software-platforms/partnerships", label: "Payment partnerships", description: "Merchant accounts, integration and support." },
] as const;
export const merchantDetailNavigation = [
  { href: "/services/merchant-onboarding", label: "Merchant onboarding", description: "Business details, review and account setup." },
  { href: "/services/payment-methods", label: "Payment methods", description: "Cards, digital wallets and ACH." },
  { href: "/services/ach-payments", label: "ACH payments", description: "Bank payments, authorization and reconciliation." },
  { href: "/services/payouts", label: "Payouts", description: "Understand the activity behind your bank deposit." },
  { href: "/services/refunds", label: "Refunds", description: "Return funds against the original payment." },
  { href: "/services/reconciliation", label: "Reconciliation", description: "Match transactions, payouts and bank records." },
  { href: "/services/disputes", label: "Disputes", description: "Review the claim and follow the case." },
] as const;

/** One label and destination for each entry in the shared menu and footer. */
const destinations = {
  online: { label: "Online businesses", href: "/use-cases/online-businesses" },
  methods: { label: "Payment methods", href: "/services/payment-methods" },
  ach: { label: "ACH payments", href: "/services/ach-payments" },
  cards: { label: "Card services", href: "/services/card-services" },
  switchProvider: { label: "Switch merchant services", href: "/use-cases/switch-merchant-services" },
  onboarding: { label: "Merchant onboarding", href: "/services/merchant-onboarding" },
  pricing: { label: "Pricing", href: "/pricing" },
  platforms: { label: "Software platforms", href: "/use-cases/software-platforms" },
  payouts: { label: "Payouts", href: "/services/payouts" },
  reconciliation: { label: "Reconciliation", href: "/services/reconciliation" },
  refunds: { label: "Refunds", href: "/services/refunds" },
  disputes: { label: "Disputes", href: "/services/disputes" },
  marketplaces: { label: "Commerce marketplaces", href: "/use-cases/software-platforms#commerce-marketplaces" },
  freight: { label: "Freight platforms", href: "/use-cases/software-platforms#freight-platforms" },
  travel: { label: "Travel platforms", href: "/use-cases/software-platforms#travel-platforms" },
  legal: { label: "Legal software", href: "/use-cases/software-platforms#legal-software" },
  guides: { label: "Guides", href: "/resources/guides" },
  help: { label: "Help center", href: "/resources/help" },
  accountSetup: { label: "Merchant account setup", href: "/resources/merchant-account-setup" },
  woocommerce: { label: "WooCommerce integration", href: "/resources/woocommerce-gateway-integration" },
  shopify: { label: "Shopify integration", href: "/resources/shopify-gateway-integration" },
  company: { label: "About", href: "/company/about" },
  trust: { label: "Security and privacy", href: "/company/security" },
  contact: { label: "Contact", href: "/company/contact" },
  legalCenter: { label: "Legal", href: "/company/legal" },
} as const;

export const publicNavigationGroups = [
  { id: "services", label: "Services", sections: [
    { label: "Services", links: [destinations.onboarding, destinations.methods, destinations.ach, destinations.payouts, destinations.reconciliation, destinations.refunds, destinations.disputes, destinations.cards] },
  ] },
  { id: "use-cases", label: "Use cases", sections: [
    { label: "Use cases", links: [destinations.online, destinations.platforms, destinations.marketplaces, destinations.freight, destinations.travel, destinations.legal, destinations.switchProvider] },
  ] },
  { id: "developers", label: "Developers", sections: [
    { label: "Developers", links: DEVELOPER_NAVIGATION },
  ] },
  { id: "resources", label: "Resources", sections: [
    { label: "Resources", links: [destinations.accountSetup, destinations.shopify, destinations.woocommerce, destinations.guides, destinations.help] },
  ] },
] as const;

export const publicNavigationLinks = [destinations.pricing] as const;

/** Core service and integration destinations, with audience detail in the header. */
export const publicFooterGroups = [
  { label: "Services", links: [destinations.onboarding, destinations.methods, destinations.ach, destinations.payouts, destinations.reconciliation, destinations.refunds, destinations.disputes, destinations.cards] },
  { label: "Use cases", links: [destinations.online, destinations.platforms, destinations.switchProvider] },
  { label: "Developers", links: DEVELOPER_NAVIGATION },
  { label: "Resources", links: [destinations.accountSetup, destinations.shopify, destinations.woocommerce, destinations.guides, destinations.help] },
  { label: "Company", links: [destinations.company, destinations.trust, destinations.contact, destinations.legalCenter] },
] as const;

export function publicDomainForPath(pathname: string): string | undefined {
  if (pathname === "/services/merchant-services") return "services";
  if (["/use-cases/software-platforms/payment-models", "/use-cases/software-platforms/partnerships"].includes(pathname)) return "use-cases";
  // A specific destination can belong to a different group than its URL parent.
  let match: { id: string; path: string } | undefined;
  for (const group of publicNavigationGroups) {
    for (const section of group.sections) {
      for (const link of section.links) {
        const path = link.href.split("#")[0];
        if ((pathname === path || pathname.startsWith(`${path}/`)) && (!match || path.length > match.path.length)) {
          match = { id: group.id, path };
        }
      }
    }
  }
  return match?.id;
}
