import type { BlogArticle } from "./content";

/** Unpublished archive G0750, adapted around the evidence behind a merchant's dispute response. */
export const representmentArticle: BlogArticle = {
  path: "/company/blog/chargeback-representment",
  title: "You remember the sale. The bank needs the record.",
  description: "Chargeback representment gives a merchant a way to challenge a dispute. A useful response connects the claim to evidence, not just confidence that the sale was valid.",
  summary: "Two matching charges could be separate purchases or a processing mistake. The difference needs to be visible in the records you submit, not left for a stranger to guess.",
  searchTitle: "Chargeback representment: make your evidence answer the claim",
  relatedPaths: ["/company/blog/what-is-a-chargeback", "/company/blog/chargeback-arbitration"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Visa: Dispute responses and duplicate processing claims", href: "https://usa.visa.com/dam/VCOM/global/support-legal/documents/merchants-dispute-management-guidelines.pdf" },
    { label: "Mastercard: Second presentment and later dispute stages", href: "https://www.mastercard.us/content/dam/public/mastercardcom/na/global-site/documents/chargeback-guide.pdf" },
    { label: "Stripe: Choosing and submitting a dispute response", href: "https://docs.stripe.com/disputes/responding" },
    { label: "Stripe: Relevant, readable dispute evidence", href: "https://docs.stripe.com/disputes/best-practices" },
    { label: "Stripe: Following a customer's dispute withdrawal", href: "https://docs.stripe.com/disputes/withdrawing" },
  ],
};
