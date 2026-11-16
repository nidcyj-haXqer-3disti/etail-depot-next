import type { BlogArticle } from "./content";

/** Archive G0432, adapted around accurate recovery messages, customer trust and resolved invoices. */
export const dunningEmailsArticle: BlogArticle = {
  path: "/company/blog/dunning-emails",
  title: "A failed payment is not a refusal to pay",
  description: "Dunning emails should explain a failed payment and the action that can resolve it. Coordinate reminders with retries, protect customer trust and measure paid invoices.",
  summary: "A failed renewal can turn a routine customer relationship into an urgent billing conversation. Make the message accurate, the next step useful and the follow-up aware of what happened.",
  searchTitle: "Dunning emails: recovering failed subscription payments",
  relatedPaths: ["/company/blog/credit-card-declines", "/company/blog/customer-billing-portals"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Payment retries and payment method priority", href: "https://docs.stripe.com/billing/revenue-recovery/smart-retries" },
    { label: "Stripe: Failed payment and confirmation emails", href: "https://docs.stripe.com/billing/revenue-recovery/customer-emails" },
    { label: "FTC: Recognizing phishing and verifying a message", href: "https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams" },
    { label: "Apple: Mail Privacy Protection", href: "https://www.apple.com/legal/privacy/data/en/mail-privacy-protection/" },
  ],
};
