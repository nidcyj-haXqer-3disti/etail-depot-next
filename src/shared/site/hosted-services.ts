import { legalIdentity } from "./legal-identity";

/** Both account intents begin with email entry at the hosted welcome page. */
const merchantWelcomeUrl = "https://merchantapp.io/etaildepot/UserAccount/Login";

/** Set only after the operator confirms the Calendly booking page and participating hosts’ connected calendars. */
const salesBookingUrl: string | null = "https://calendly.com/etail-depot/sales-call-with-aaron-rich";

/** Public service entrances confirmed by the operator; never include credentials or user data. */
export const hostedServices = {
  sales: {
    provider: "Calendly",
    bookingUrl: salesBookingUrl,
    // Keep these verified event details aligned with the configured appointment.
    durationMinutes: 30,
    hostName: "Aaron Rich",
  },
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
