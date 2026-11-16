import type { BlogArticle } from "./content";

/** Archive G1915, adapted around merchant fit in an ISV payment partnership. */
export const isvPaymentsArticle: BlogArticle = {
  path: "/company/blog/isv-payments",
  title: "Your payment partner has to fit your customers",
  description: "Choosing payment services for an independent software vendor starts with merchant fit. Compare approval, integration, support and partnership economics with Trolleys.",
  summary: "A payment partnership can look attractive on paper and still miss the businesses using your software. Start with the customers you need to serve.",
  searchTitle: "ISV payments: choosing a merchant services partner",
  relatedPaths: ["/company/blog/embedded-payments-vs-integrated-payments", "/company/blog/embedded-payments-for-saas-platforms"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Referral, enablement and reseller partnerships", href: "https://developer.cybersource.com/docs/cybs/en-us/isv-plugins/get-started/all/na/isv-getting-started/isv-partner-starter-intro.html" },
    { label: "Visa Acceptance: Technology partner roles and permissions", href: "https://docs.visaacceptance.com/experience/merchant/get-started/tech-partner/overview/" },
    { label: "Visa: Third party agent registration", href: "https://partner.visa.com/site/programs/third-party-agent-registration.html" },
    { label: "Cybersource: Testing a partner solution", href: "https://developer.cybersource.com/docs/cybs/en-us/isv-plugins/get-started/all/na/isv-getting-started/isv-parter-starter-integration-testing.html" },
  ],
};
