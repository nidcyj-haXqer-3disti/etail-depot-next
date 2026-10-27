/** Information-page connections only. This does not configure a vendor integration. */
export const customerJourneys = {
  merchant: {
    label: "Merchant services", href: "/payment-acceptance-service",
    documentation: "/docs/merchant-onboarding", documentationLabel: "Prepare your merchant account",
  },
  online: {
    label: "Online businesses", href: "/online-businesses",
    documentation: "/docs/merchant-onboarding", documentationLabel: "Set up online payments",
    description: "Prepare your merchant account, choose your checkout setup and follow payments through to bank deposit.",
  },
  platform: {
    label: "Software platforms", href: "/software-partners",
    documentation: "/docs/integration-access", documentationLabel: "Plan your integration",
    description: "Connect merchant accounts, checkout and payment records with the access assigned to your software.",
  },
  card: {
    label: "Card services", href: "/credit-card-services",
  },
} as const;
