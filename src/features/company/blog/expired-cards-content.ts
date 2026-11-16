import type { BlogArticle } from "./content";

/** Archive G0494, adapted around useful expiry notices before a recurring payment is due. */
export const expiredCardsArticle: BlogArticle = {
  path: "/company/blog/manage-expired-cards-for-recurring-payments",
  title: "Before you send the card expiry warning",
  description: "An expiring card does not always need replacing in your billing system. Check the saved payment method before asking a recurring customer to update it.",
  summary: "The date on a saved card looks like an easy reason to send a reminder. First, find out whether the customer still has a problem to solve.",
  searchTitle: "Expired cards and recurring payments: what to check",
  relatedPaths: ["/company/blog/credit-card-account-updater", "/company/blog/dunning-emails"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Visa: Account Updater and participating businesses", href: "https://developer.visa.com/docs/vau" },
    { label: "Stripe: Automatic card updates and issuer participation", href: "https://docs.stripe.com/payments/cards/overview#automatic-card-updates" },
    { label: "Stripe: Subscription and customer payment method priority", href: "https://docs.stripe.com/billing/revenue-recovery/smart-retries" },
    { label: "Stripe: Expiring card emails and hosted update pages", href: "https://docs.stripe.com/billing/revenue-recovery/customer-emails" },
  ],
};
