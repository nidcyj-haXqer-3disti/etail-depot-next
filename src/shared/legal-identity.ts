// Public, user-confirmed display information. No domain, account or provider configuration.
export const legalIdentity = {
  company: "Etail Depot US, Inc.",
  location: "Washington, DC, United States",
  complianceEmail: "compliance@etaildepot.com",
  brands: [
    { name: "Ledgix", service: "Cards", operator: "Etail Depot US, Inc. DBA Ledgix", website: "https://ledgix.com", domain: "ledgix.com", email: "ledgix@etaildepot.com" },
    { name: "Trolleys", service: "Payments", operator: "Etail Depot US, Inc. DBA Trolleys", website: "https://trolleys.ai", domain: "trolleys.ai", email: "trolleys@etaildepot.com" },
  ],
} as const;
