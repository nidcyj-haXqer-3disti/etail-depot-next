import type { BlogArticle } from "./content";

/** Archive G0305, adapted with current saved-payment and customer-consent guidance. */
export const cardOnFileArticle: BlogArticle = {
  path: "/company/blog/card-on-file",
  title: "What does keeping a card on file mean?",
  description: "Keeping a card on file means saving payment credentials for an agreed future use, often through a payment provider’s token or saved-payment reference. It can make repeat checkout easier or support agreed automatic billing. Saving the card and having permission to make a particular charge are separate questions.",
  summary: "Understand cards on file, customer consent, tokenization and recurring billing. Learn what to keep, what never to store and how to handle changes.",
  searchTitle: "What does keeping a card on file mean?",
  relatedPaths: ["/company/blog/card-verification-value", "/company/blog/credit-card-declines"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "define-the-future-use", title: "Agree what the saved card can be used for" },
    { id: "keep-the-data-with-the-right-system", title: "Use the provider’s supported storage process" },
    { id: "separate-storage-from-billing", title: "Make customer controls match the agreement" },
    { id: "plan-for-changes", title: "Expect cards and customer instructions to change" },
  ],
  sources: [
    { label: "Cybersource: Customer and merchant initiated transactions", href: "https://developer.cybersource.com/docs/cybs/en-us/credentials/developer/cardnet/rest/credentials/credentials-intro.html" },
    { label: "Stripe: Saving payment methods, consent and later payments", href: "https://docs.stripe.com/payments/save-and-reuse" },
    { label: "Cybersource: Token Management Service", href: "https://developer.cybersource.com/docs/cybs/en-us/tms/developer/all/rest/tms.html" },
    { label: "PCI Security Standards Council: Security codes and recurring transactions", href: "https://www.pcisecuritystandards.org/faqs/1280/" },
    { label: "Etail Depot: Merchant Services Terms", href: "/company/legal/merchant-services" },
  ],
};
