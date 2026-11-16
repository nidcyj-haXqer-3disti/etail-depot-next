import type { BlogArticle } from "./content";

/** Archive G0013, adapted with current ACH tracing guidance. */
export const achTraceArticle: BlogArticle = {
  path: "/company/blog/ach-trace-number",
  title: "ACH trace numbers: how to investigate a missing payment",
  description: "An ACH trace number helps a bank identify a payment entry in the US ACH network. Use it with the amount, dates and destination to investigate a missing transfer. The number alone does not prove that money reached the intended account, and it is not a public tracking code you can look up online.",
  summary: "Learn where to request an ACH trace number, what information a bank needs and how to investigate a missing payment without sending a duplicate.",
  searchTitle: "ACH trace numbers: how to investigate a missing payment",
  relatedPaths: ["/company/blog/ach-payments", "/company/blog/payment-settlement-and-payouts"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "identify-entry", title: "Identify the right number" },
    { id: "payment-or-payout", title: "Check which transfer is missing" },
    { id: "prepare-inquiry", title: "Build a useful investigation request" },
    { id: "close-investigation", title: "Resolve the payment before replacing it" },
  ],
  sources: [
    { label: "US Treasury: ACH trace number definition", href: "https://tfx.treasury.gov/taxonomy/term/10847" },
    { label: "Nacha: ACH entry references", href: "https://achdevguide.nacha.org/ach-file-details" },
    { label: "Federal Reserve: Payment Trace Request", href: "https://www.frbservices.org/resources/financial-services/fedach-services-resources/exception-resolution-service-quick-reference-guide-qrg/exception-resolution-service-case-types/payment-trace-request-ptr/" },
    { label: "Nacha: Who can help with an ACH payment", href: "https://www.nacha.org/content/consumer-faqs-ach-payments" },
    { label: "Etail Depot: Payout records and missing deposits", href: "/services/payouts" },
  ],
};
