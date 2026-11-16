import type { BlogArticle } from "./content";

/** Archive G0256, adapted with current ISO role and merchant selection guidance. */
export const processorsIsosArticle: BlogArticle = {
  path: "/company/blog/payment-processors-vs-isos",
  title: "Payment processors vs. ISOs: who sells and supports the service?",
  description: "An independent sales organization, or ISO, can sell payment acceptance services and help merchants get started. A payment processor performs the underlying transaction processing. Buying through an ISO and using a processor are not necessarily alternatives: the same service can involve both.",
  summary: "Compare payment processors and ISOs by the work they provide, the full cost of the service and who takes responsibility when you need help.",
  searchTitle: "Payment processors vs. ISOs: a merchant’s comparison",
  relatedPaths: ["/company/blog/payment-processor-vs-merchant-acquirer", "/company/blog/choose-a-merchant-services-provider"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "understand-the-service-chain", title: "Identify the roles in the offer" },
    { id: "compare-what-you-receive", title: "Compare what you receive" },
    { id: "test-support-ownership", title: "Ask how a real problem will be handled" },
    { id: "review-before-signing", title: "Keep the relationship clear after signing" },
  ],
  sources: [
    { label: "Visa: Third Party Agent roles and functional descriptions", href: "https://usa.visa.com/dam/VCOM/download/merchants/tpa-types-functional-descriptions.pdf" },
    { label: "Stripe: Payment processors and independent sales organizations", href: "https://stripe.com/resources/more/payment-processors-vs.-independent-sales-organizations" },
    { label: "Etail Depot: Pricing and account terms", href: "/pricing" },
    { label: "Etail Depot: Setup after merchant account approval", href: "/developers/getting-started" },
    { label: "Etail Depot: Acquirer and provider responsibilities", href: "/company/legal/acquirer-disclosure" },
  ],
};
