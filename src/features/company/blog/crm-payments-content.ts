import type { BlogArticle } from "./content";

/** Archive G0082, adapted around customer trust and accurate payment allocation. */
export const crmPaymentsArticle: BlogArticle = {
  path: "/company/blog/crm-payment-processing",
  title: "A payment belongs to a bill, not just a customer",
  description: "CRM payment integration should show what was paid, what is still due and which merchant account received it. Your customer relationship depends on getting those details right.",
  summary: "A payment marked against the wrong invoice can trigger another reminder or hide an unpaid balance. Connect the sale to its records before automating the conversation.",
  searchTitle: "CRM payment integration: connect payments to the right bill",
  relatedPaths: ["/company/blog/open-invoices", "/company/blog/consuming-webhooks"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Order references and transaction searches", href: "https://developer.cybersource.com/docs/cybs/en-us/api-fields/reference/all/rest/api-fields/client-ref-info-aa/client-ref-info-code.html" },
    { label: "HubSpot: Payment states and manually recorded payments", href: "https://knowledge.hubspot.com/payments/manage-payments" },
    { label: "HubSpot: Relationships between customer and business records", href: "https://knowledge.hubspot.com/records/associate-records" },
    { label: "HubSpot: Record merges and their effect on connected data", href: "https://knowledge.hubspot.com/records/merge-records" },
  ],
};
