import type { BlogArticle } from "./content";

/** Archive G0259, adapted with current PSP scope and merchant responsibility guidance. */
export const paymentServiceProvidersArticle: BlogArticle = {
  path: "/company/blog/payment-service-providers",
  title: "What is a payment service provider?",
  description: "A payment service provider, or PSP, helps businesses accept electronic payments. Its service can combine checkout, processing and related merchant tools. The name alone does not tell you which payment methods, account arrangement or support services are included for your business.",
  summary: "Understand what a payment service provider does, what to check in its offer and which payment, customer and security tasks stay with your business.",
  searchTitle: "What is a payment service provider (PSP)?",
  relatedPaths: ["/company/blog/merchant-accounts-and-acquiring", "/company/blog/choose-a-merchant-services-provider"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "map-the-package", title: "Separate the service into merchant tasks" },
    { id: "check-availability", title: "Check what your account can actually use" },
    { id: "compare-inclusions", title: "Make an inclusion list for your purchase" },
    { id: "keep-your-own-responsibilities-visible", title: "Know what remains with your business" },
  ],
  sources: [
    { label: "Stripe: Payment service providers explained", href: "https://stripe.com/resources/more/payment-service-providers" },
    { label: "Adyen: Payment service providers and the payment flow", href: "https://www.adyen.com/knowledge-hub/payment-service-provider" },
    { label: "Stripe: Payment method availability and integration options", href: "https://docs.stripe.com/payments/payment-methods/overview" },
    { label: "PCI SSC: Merchant responsibilities when outsourcing payment processing", href: "https://www.pcisecuritystandards.org/faqs/1092/" },
    { label: "Etail Depot: Account payment methods", href: "/services/payment-methods" },
    { label: "Etail Depot: Merchant services terms", href: "/company/legal/merchant-services" },
  ],
};
