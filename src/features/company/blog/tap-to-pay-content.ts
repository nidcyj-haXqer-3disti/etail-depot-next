import type { BlogArticle } from "./content";

/** Archive G0291, adapted around choosing and operating a phone-based checkout. */
export const tapToPayArticle: BlogArticle = {
  path: "/company/blog/tap-to-pay",
  title: "When your phone becomes the checkout",
  description: "Tap to Pay lets a compatible phone accept contactless payments. Here is what merchants should know about payment apps, customer PINs and backup options.",
  summary: "Taking a payment on your phone can make selling easier. The customer still needs to know where to tap, what they are paying and whether it worked.",
  searchTitle: "Tap to Pay on a phone: what merchants need",
  relatedPaths: ["/company/blog/contactless-payments", "/company/blog/pos-vs-card-readers"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Apple: Tap to Pay apps and the merchant experience", href: "https://developer.apple.com/tap-to-pay/" },
    { label: "Stripe: Android device requirements", href: "https://docs.stripe.com/terminal/payments/setup-reader/tap-to-pay?platform=android" },
    { label: "Stripe: iPhone card acceptance and verification", href: "https://docs.stripe.com/terminal/payments/setup-reader/tap-to-pay?platform=ios" },
    { label: "Apple: PIN privacy, screen lock and offline capability", href: "https://support.apple.com/en-ca/guide/security/sec72cb155f4/web" },
    { label: "Square: Offline payment restrictions in the US", href: "https://squareup.com/help/us/en/article/7777-process-card-payments-with-offline-mode" },
  ],
};
