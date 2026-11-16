import type { BlogArticle } from "./content";

/** Archive G0126, adapted with current hosted checkout and merchant responsibilities. */
export const hostedPaymentsArticle: BlogArticle = {
  path: "/company/blog/hosted-payment-pages",
  title: "Hosted payment pages: what your business still needs to manage",
  description: "A hosted payment page lets a provider supply the checkout where customers enter payment details. You can maintain less payment software, while keeping control of the sale, customer communication and delivery.",
  summary: "Learn how hosted payment pages work, how links differ from embedded checkout, and what merchants still manage before and after a payment.",
  searchTitle: "Hosted payment pages: setup and merchant responsibilities",
  relatedPaths: ["/company/blog/how-to-create-a-payment-link", "/company/blog/optimize-your-mobile-checkout-experience"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "checkout-options", title: "Choose how customers reach checkout" },
    { id: "payment-result", title: "Connect the payment to the order" },
    { id: "customer-experience", title: "Make the handoff clear" },
    { id: "responsibilities", title: "Know what your team still manages" },
    { id: "before-launch", title: "Check the setup before launch" },
  ],
  sources: [
    { label: "Stripe: Hosted and embedded checkout options", href: "https://docs.stripe.com/payments/checkout" },
    { label: "Stripe: Payment confirmation and order fulfillment", href: "https://docs.stripe.com/checkout/fulfillment" },
    { label: "Cybersource: Pay by Link requirements", href: "https://developer.cybersource.com/docs/cybs/en-us/paybylink/developer/all/rest/paybylink/paybylink-intro.html" },
    { label: "Cybersource: Manage payment links in the Business Center", href: "https://developer.cybersource.com/docs/cybs/en-us/paybylink/developer/all/rest/paybylink/paybylink-ebc-intro.html" },
    { label: "PCI SSC: Responsibilities when payment processing is outsourced", href: "https://www.pcisecuritystandards.org/faqs/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/" },
  ],
};
