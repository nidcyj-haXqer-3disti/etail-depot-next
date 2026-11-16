import type { BlogArticle } from "./content";

/** Archive G0171, adapted with current provider-selection and account guidance. */
export const choosingProviderArticle: BlogArticle = {
  path: "/company/blog/choose-a-merchant-services-provider",
  title: "How to choose a merchant services provider",
  description: "Choose a merchant services provider by checking how its offer fits your business, checkout and daily operations. Compare the full cost, funding terms and support before deciding. A low headline rate cannot resolve an unsupported integration or unclear account conditions.",
  summary: "Compare merchant services providers on total costs, funding terms and the work your team will do after a sale.",
  searchTitle: "How to choose a merchant services provider",
  relatedPaths: ["/company/blog/merchant-accounts-and-acquiring", "/company/blog/stripe-alternatives"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "business-needs", title: "Start with how your business works" },
    { id: "compare-costs", title: "Compare the full cost" },
    { id: "funding-and-terms", title: "Read the funding and contract terms" },
    { id: "verify-service", title: "Ask for a working demonstration" },
    { id: "choose-and-launch", title: "Choose, then verify the launch" },
  ],
  sources: [
    { label: "Visa: Choosing an acquirer", href: "https://www.visa.co.uk/supporting-info/find-an-acquirer.html" },
    { label: "Stripe: Evaluating a merchant services provider", href: "https://stripe.com/resources/more/how-to-choose-a-merchant-services-provider" },
    { label: "Stripe: Processing charges and additional fees", href: "https://stripe.com/pricing" },
    { label: "Stripe: Settlement timing and payout schedules", href: "https://docs.stripe.com/payouts" },
    { label: "PCI SSC: Merchant responsibilities when outsourcing payments", href: "https://www.pcisecuritystandards.org/faqs/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/" },
    { label: "Etail Depot: Pricing and additional fees", href: "/pricing" },
    { label: "Etail Depot: Payouts and reserves", href: "/company/legal/payouts-and-reserves" },
  ],
};
