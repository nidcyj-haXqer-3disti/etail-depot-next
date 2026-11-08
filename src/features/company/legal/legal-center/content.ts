export const legalDocumentGroups = [
  { title: "Merchant services", description: "Terms for your account, transactions and software connection." },
  { title: "Privacy and security", description: "How account information is handled and protected." },
] as const;
export const legalDocuments = [
  {
    "slug": "merchant-services",
    "title": "Merchant Services Terms",
    "description": "Account approval, payment acceptance, responsibilities and service terms.",
    "group": "Merchant services"
  },
  {
    "slug": "fees",
    "title": "Fees and billing",
    "description": "Card processing rates, additional charges and billing terms.",
    "group": "Merchant services"
  },
  {
    "slug": "payouts-and-reserves",
    "title": "Payouts and reserves",
    "description": "Funding schedules, adjustments, reserves and account closure.",
    "group": "Merchant services"
  },
  {
    "slug": "acceptable-use",
    "title": "Acceptable use",
    "description": "Permitted use, prohibited conduct and account review.",
    "group": "Merchant services"
  },
  {
    "slug": "software-platforms",
    "title": "Software platform terms",
    "description": "Merchant permissions, integration and platform responsibilities.",
    "group": "Merchant services"
  },
  {
    "slug": "acquirer-disclosure",
    "title": "Acquirer disclosure",
    "description": "The United States acquiring relationship and provider documents.",
    "group": "Merchant services"
  },
  {
    "slug": "merchant-privacy",
    "title": "Merchant privacy notice",
    "description": "Application, owner, bank and account information.",
    "group": "Privacy and security"
  },
  {
    "slug": "data-processing",
    "title": "Data processing terms",
    "description": "Processing roles, safeguards, providers and information rights.",
    "group": "Privacy and security"
  },
  {
    "slug": "security-policy",
    "title": "Security responsibilities",
    "description": "Account access, payment information and incident reporting.",
    "group": "Privacy and security"
  }
] as const;
export type LegalDocumentSlug = (typeof legalDocuments)[number]["slug"];
