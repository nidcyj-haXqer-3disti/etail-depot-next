import { serviceLabels } from "./service-language";

/** Public information architecture; these are local information pages, not account routes. */
export const serviceNavigation = [
  { href: "/payment-acceptance-service", label: serviceLabels.payments, description: "Credit card processing, wallets and ACH." },
  { href: "/credit-card-services", label: serviceLabels.cards, description: "A virtual Visa secured credit card." },
] as const;
export const audienceUseCaseNavigation = [
  { href: "/software-partners", label: "Software platforms", description: "Merchant services for your software." },
  { href: "/online-businesses", label: "Online businesses", description: "Online checkout for your customers." },
  { href: "/switch-payment-providers", label: "Switch merchant services", description: "Account options, fees and the steps to switch." },
] as const;

export const useCaseNavigation = audienceUseCaseNavigation;
export const platformContextNavigation = [
  { href: "/platform-payment-models", label: "Payment models", description: "Seller, account and payment responsibilities." },
  { href: "/payment-partnerships", label: "Payment partnerships", description: "Merchant accounts, integration and support." },
] as const;
export const merchantDetailNavigation = [
  { href: "/merchant-onboarding", label: "Merchant onboarding", description: "Business details, review and account setup." },
  { href: "/payment-methods", label: "Payment methods", description: "Cards, digital wallets and ACH." },
  { href: "/ach-payments", label: "ACH payments", description: "Bank payments, authorization and reconciliation." },
  { href: "/payouts-and-reconciliation", label: "Payouts", description: "Understand the activity behind your bank deposit." },
  { href: "/refunds-and-disputes", label: "Refunds", description: "Return funds against the original payment." },
  { href: "/reconciliation", label: "Reconciliation", description: "Match transactions, payouts and bank records." },
  { href: "/disputes", label: "Disputes", description: "Review the claim and follow the case." },
] as const;

/** One label and destination for each entry in the shared menu and footer. */
const destinations = {
  online: { label: "Online businesses", href: "/online-businesses" },
  methods: { label: "Payment methods", href: "/payment-methods" },
  ach: { label: "ACH payments", href: "/ach-payments" },
  cards: { label: "Card services", href: "/credit-card-services" },
  switchProvider: { label: "Switch merchant services", href: "/switch-payment-providers" },
  onboarding: { label: "Merchant onboarding", href: "/merchant-onboarding" },
  pricing: { label: "Pricing", href: "/pricing" },
  platforms: { label: "Software platforms", href: "/software-partners" },
  payouts: { label: "Payouts", href: "/payouts-and-reconciliation" },
  reconciliation: { label: "Reconciliation", href: "/reconciliation" },
  refunds: { label: "Refunds", href: "/refunds-and-disputes" },
  disputes: { label: "Disputes", href: "/disputes" },
  marketplaces: { label: "Commerce marketplaces", href: "/software-partners#commerce-marketplaces" },
  freight: { label: "Freight platforms", href: "/software-partners#freight-platforms" },
  travel: { label: "Travel platforms", href: "/software-partners#travel-platforms" },
  legal: { label: "Legal software", href: "/software-partners#legal-software" },
  docs: { label: "Documentation", href: "/docs" },
  access: { label: "Integration requirements", href: "/docs/integration-access" },
  checkout: { label: "Checkout integration", href: "/docs/checkout" },
  updates: { label: "Payment updates", href: "/docs/webhooks" },
  launch: { label: "Launch preparation", href: "/docs/testing-and-launch" },
  guides: { label: "Guides", href: "/guides" },
  help: { label: "Help center", href: "/help" },
  accountSetup: { label: "Merchant account setup", href: "/docs/merchant-onboarding" },
  shopify: { label: "Shopify integration", href: "/resources/shopify-gateway-integration" },
  company: { label: "About", href: "/company" },
  trust: { label: "Security and privacy", href: "/trust" },
  contact: { label: "Contact", href: "/contact" },
  legalCenter: { label: "Legal", href: "/legal" },
} as const;

export const publicNavigationGroups = [
  { id: "services", label: "Services", sections: [
    { label: "Services", links: [destinations.onboarding, destinations.methods, destinations.ach, destinations.payouts, destinations.reconciliation, destinations.refunds, destinations.disputes, destinations.cards] },
  ] },
  { id: "use-cases", label: "Use cases", sections: [
    { label: "Use cases", links: [destinations.online, destinations.platforms, destinations.marketplaces, destinations.freight, destinations.travel, destinations.legal, destinations.switchProvider] },
  ] },
  { id: "developers", label: "Developers", sections: [
    { label: "Developers", links: [destinations.docs, destinations.access, destinations.checkout, destinations.updates, destinations.launch] },
  ] },
  { id: "resources", label: "Resources", sections: [
    { label: "Resources", links: [destinations.accountSetup, destinations.shopify, destinations.guides, destinations.help] },
  ] },
] as const;

export const publicNavigationLinks = [destinations.pricing] as const;

/** Core service and integration destinations, with audience detail in the header. */
export const publicFooterGroups = [
  { label: "Services", links: [destinations.onboarding, destinations.methods, destinations.ach, destinations.payouts, destinations.reconciliation, destinations.refunds, destinations.disputes, destinations.cards] },
  { label: "Use cases", links: [destinations.online, destinations.platforms, destinations.switchProvider] },
  { label: "Developers", links: [destinations.docs, destinations.access, destinations.checkout, destinations.updates, destinations.launch] },
  { label: "Resources", links: [destinations.accountSetup, destinations.shopify, destinations.guides, destinations.help] },
  { label: "Company", links: [destinations.company, destinations.trust, destinations.contact, destinations.legalCenter] },
] as const;

export function publicDomainForPath(pathname: string): string | undefined {
  if (pathname === "/payment-acceptance-service") return "services";
  if (["/platform-payment-models", "/payment-partnerships"].includes(pathname)) return "use-cases";
  return publicNavigationGroups.find(group => group.sections.some(section => section.links.some(link => {
    const path = link.href.split("#")[0];
    return pathname === path || pathname.startsWith(`${path}/`);
  })))?.id;
}
