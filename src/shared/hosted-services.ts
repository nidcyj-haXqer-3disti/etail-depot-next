import { legalIdentity } from "./legal-identity";

/** Public service entrances confirmed by the operator; never include credentials or user data. */
export const hostedServices = {
  cards: {
    name: "Ledgix",
    status: "Coming soon",
    contactHref: `mailto:${legalIdentity.brands[0].email}`,
    email: legalIdentity.brands[0].email,
  },
  payments: {
    name: "Trolleys",
    status: "Available now",
    portalUrl: "https://trolleys.ai",
    portalDomain: "trolleys.ai",
    contactHref: `mailto:${legalIdentity.brands[1].email}`,
    email: legalIdentity.brands[1].email,
  },
} as const;

export type PublicService = keyof typeof hostedServices;
