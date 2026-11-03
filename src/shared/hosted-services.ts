import { legalIdentity } from "./legal-identity";

/** Both account intents begin with email entry at the hosted welcome page. */
const merchantWelcomeUrl = "https://merchantapp.io/etaildepot/UserAccount/Login";

/** Public service entrances confirmed by the operator; never include credentials or user data. */
export const hostedServices = {
  cards: {
    name: "Ledgix",
    contactHref: `mailto:${legalIdentity.brands[0].email}`,
    email: legalIdentity.brands[0].email,
  },
  payments: {
    name: "Trolleys",
    signInUrl: merchantWelcomeUrl,
    registrationUrl: merchantWelcomeUrl,
    contactHref: `mailto:${legalIdentity.brands[1].email}`,
    email: legalIdentity.brands[1].email,
  },
} as const;
