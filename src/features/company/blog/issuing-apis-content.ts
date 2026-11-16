import type { BlogArticle } from "./content";

/** Archive G1814, adapted around the operating responsibilities behind an issuing integration. */
export const issuingApisArticle: BlogArticle = {
  path: "/company/blog/card-issuing-apis",
  title: "Card issuing APIs: what happens after you create the card",
  description: "Putting a card inside your product is the visible part. The harder work is keeping purchases, balances and customer explanations accurate when events change or requests fail.",
  summary: "How card issuing APIs work beyond card creation: program arrangements, authorization decisions, changing balances, safe retries and protecting card details.",
  searchTitle: "How card issuing APIs work: cards, controls and transactions",
  relatedPaths: ["/company/blog/virtual-credit-cards", "/company/blog/card-authorization"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Card programs and issuing arrangements", href: "https://docs.stripe.com/issuing/how-issuing-works" },
    { label: "Stripe: Authorizations, holds and purchase updates", href: "https://docs.stripe.com/issuing/purchases/authorizations" },
    { label: "Stripe: Real time decisions and timeout settings", href: "https://docs.stripe.com/issuing/controls/real-time-authorizations" },
    { label: "Stripe: Retrying requests with idempotency keys", href: "https://docs.stripe.com/api/idempotent_requests" },
    { label: "Stripe: Duplicate events and delivery order", href: "https://docs.stripe.com/webhooks" },
    { label: "Stripe: Displaying sensitive card details", href: "https://docs.stripe.com/issuing/elements" },
  ],
};
