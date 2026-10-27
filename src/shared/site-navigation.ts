import { serviceLabels } from "./service-language";

/** Public information architecture; these are local information pages, not account routes. */
export const serviceNavigation = [
  { href: "/payment-acceptance-service", label: serviceLabels.payments, description: "Card, wallet and ACH payments." },
  { href: "/credit-card-services", label: serviceLabels.cards, description: "A virtual Visa secured credit card." },
] as const;
export const useCaseNavigation = [
  { href: "/online-businesses", label: "Online businesses", description: "Online checkout for your customers." },
  { href: "/software-partners", label: "Software platforms", description: "Merchant services for your software." },
] as const;
