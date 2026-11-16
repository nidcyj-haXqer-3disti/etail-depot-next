import type { BlogArticle } from "./content";

/** Unpublished archive G0211, adapted around the customer obstacles that remain after checkout translation. */
export const checkoutLocalizationArticle: BlogArticle = {
  path: "/company/blog/local-payments",
  title: "The checkout is translated. The customer is still stuck.",
  description: "Payment localization goes beyond translation. Make international checkout easier to finish with clear currencies, usable address fields and helpful payment messages.",
  summary: "A customer can understand every word and still be unable to pay. Look at the address field, the final amount and the message after the payment button.",
  searchTitle: "Payment localization: beyond translating international checkout",
  relatedPaths: ["/company/blog/international-payment-gateways", "/company/blog/how-multicurrency-ecommerce-payments-work"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "W3C: International forms, language choices and translated layouts", href: "https://www.w3.org/International/quicktips/" },
    { label: "W3C: Clear form feedback and actionable error messages", href: "https://www.w3.org/WAI/tutorials/forms/notifications/" },
    { label: "Cybersource: Unified Checkout language and locale settings", href: "https://developer.cybersource.com/docs/cybs/en-us/api-fields/reference/all/rest/api-fields/locale.html" },
  ],
};
