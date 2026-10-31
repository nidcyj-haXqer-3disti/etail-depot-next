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
  { href: "/payouts-and-reconciliation", label: "Payouts and reconciliation", description: "Match payments to bank deposits." },
  { href: "/refunds-and-disputes", label: "Refunds and disputes", description: "Follow the original payment and its outcome." },
] as const;

/** One label and destination for each entry in the shared menu and footer. */
const destinations = {
  merchant: { label: "Merchant services", href: "/payment-acceptance-service" },
  online: { label: "Online businesses", href: "/online-businesses" },
  methods: { label: "Payment methods", href: "/payment-methods" },
  ach: { label: "ACH payments", href: "/ach-payments" },
  cards: { label: "Card services", href: "/credit-card-services" },
  switchProvider: { label: "Switch merchant services", href: "/switch-payment-providers" },
  onboarding: { label: "Merchant onboarding", href: "/merchant-onboarding" },
  pricing: { label: "Pricing", href: "/pricing" },
  platforms: { label: "Software platforms", href: "/software-partners" },
  models: { label: "Payment models", href: "/platform-payment-models" },
  docs: { label: "Documentation", href: "/docs" },
  guides: { label: "Guides", href: "/guides" },
  help: { label: "Help center", href: "/help" },
  company: { label: "About", href: "/company" },
  facilitator: { label: "Payment facilitator model", href: "/payment-facilitator" },
  trust: { label: "Security and privacy", href: "/trust" },
  contact: { label: "Contact", href: "/contact" },
} as const;

export const publicNavigationGroups = [
  { id: "services", label: "Services", sections: [
    { label: "Our services", links: [destinations.merchant, destinations.online, destinations.methods, destinations.ach, destinations.cards] },
    { label: "Merchant accounts", links: [destinations.switchProvider, destinations.onboarding] },
  ] },
  { id: "platforms", label: "Platforms", sections: [
    { label: "Platforms", links: [destinations.platforms, destinations.models] },
  ] },
  { id: "resources", label: "Resources", sections: [
    { label: "Resources", links: [destinations.docs, destinations.guides, destinations.help] },
  ] },
  { id: "company", label: "Company", sections: [
    { label: "Company", links: [destinations.company, destinations.facilitator, destinations.trust] },
  ] },
] as const;

export const publicNavigationLinks = [destinations.pricing] as const;

/** A compact directory. Detailed tasks stay connected through their service pages. */
export const publicFooterGroups = [
  { label: "Services", links: [destinations.merchant, destinations.switchProvider, destinations.cards] },
  { label: "Platforms", links: [destinations.platforms, destinations.models] },
  { label: "Resources", links: [destinations.docs, destinations.guides, destinations.help] },
  { label: "Company", links: [destinations.company, destinations.trust, destinations.contact] },
] as const;

export function publicDomainForPath(pathname: string): string | undefined {
  if (["/refunds-and-disputes", "/payouts-and-reconciliation"].includes(pathname)) return "services";
  if (pathname === "/contact") return "company";
  if (pathname === "/payment-partnerships") return "platforms";
  return publicNavigationGroups.find(group => group.sections.some(section => section.links.some(link => pathname === link.href || pathname.startsWith(`${link.href}/`))))?.id;
}
