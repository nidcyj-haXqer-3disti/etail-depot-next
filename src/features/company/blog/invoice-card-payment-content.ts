import type { BlogArticle } from "./content";

/** Archive G0451, adapted around connecting a card payment to the invoice and its actual remaining balance. */
export const invoiceCardPaymentArticle: BlogArticle = {
  path: "/company/blog/pay-invoice-by-credit-card",
  title: "Your customer paid. The invoice should know.",
  description: "Let customers pay an invoice by credit card while keeping the balance, receipt and payment record connected. A smaller bank deposit does not mean they underpaid.",
  summary: "A card link can collect money without closing the right invoice. The difference shows up in duplicate charges, unexplained balances and reminders sent after payment.",
  searchTitle: "Accept invoice payments by credit card: keep the balance right",
  relatedPaths: ["/company/blog/how-to-create-a-payment-link", "/company/blog/important-invoice-management-tips"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Hosted invoice pages and payment methods", href: "https://docs.stripe.com/invoicing/hosted-invoice-page" },
    { label: "Stripe: Partial payments and invoice balances", href: "https://docs.stripe.com/invoicing/partial-payments" },
    { label: "PCI SSC: Protecting card numbers in messaging", href: "https://www.pcisecuritystandards.org/faqs/1085/" },
    { label: "Intuit: Recording merchant service fees separately", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/bank-feeds/enter-bank-service-fee-using-third-party-merchant/L94JHLIsf_US_en_US" },
    { label: "Stripe: Verifying payment status", href: "https://docs.stripe.com/payments/payment-intents/verifying-status" },
  ],
};
