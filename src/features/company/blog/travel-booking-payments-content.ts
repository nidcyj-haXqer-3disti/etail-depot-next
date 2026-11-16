import type { BlogArticle } from "./content";

/** Unpublished archive G0208, adapted around the merchant's responsibility between a travel deposit and fulfillment. */
export const travelBookingPaymentsArticle: BlogArticle = {
  path: "/company/blog/international-travel-payments",
  title: "The deposit arrived. The trip is still your responsibility.",
  description: "International travel payments need a clear connection between deposits, booking confirmation, balance payments and refunds. Here is where that connection breaks.",
  summary: "A paid deposit can sit beside an unconfirmed reservation. For a travel business, the real payment experience includes everything that happens before the customer leaves.",
  searchTitle: "International travel payments: deposits, bookings and refunds",
  relatedPaths: ["/company/blog/international-payment-gateways", "/company/blog/how-multicurrency-ecommerce-payments-work"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Reauthorization and other follow-on transactions", href: "https://developer.cybersource.com/docs/cybs/en-us/credentials/developer/cardnet/so/credentials/credentials-intro/credentials-mit-industry.html" },
    { label: "Stripe: Charge currency, settlement currency and issuer fees", href: "https://docs.stripe.com/currencies" },
    { label: "US Department of Transportation: Airfare refunds and ticket agents", href: "https://www.transportation.gov/individuals/aviation-consumer-protection/refunds" },
  ],
};
