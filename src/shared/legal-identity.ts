// Public, user-confirmed display information. No domain, account or provider configuration.
export const legalIdentity = {
  company: "Etail Depot US, Inc.",
  location: "Washington, DC, United States",
  complianceEmail: "compliance@etaildepot.com",
  offices: [
    {
      label: "United States",
      address: ["2001 L Street NW, Suite 500", "Washington DC 20036"],
      phone: "+1 202-449-4962",
      phoneHref: "tel:+12024494962",
    },
    {
      label: "International",
      address: ["〒105-6415 Tokyo, Minato-ku", "Toranomon 1-17-1", "Toranomon Hills Business Tower 15F"],
      phone: "+81 70-3537-2563",
      phoneHref: "tel:+817035372563",
    },
  ],
  brands: [
    { name: "Ledgix", service: "Secured credit card", operator: "Etail Depot US, Inc. DBA Ledgix", website: "https://ledgix.com", domain: "ledgix.com", email: "ledgix@etaildepot.com" },
    { name: "Trolleys", service: "Payment acceptance", operator: "Etail Depot US, Inc. DBA Trolleys", website: "https://trolleys.ai", domain: "trolleys.ai", email: "trolleys@etaildepot.com" },
  ],
} as const;
