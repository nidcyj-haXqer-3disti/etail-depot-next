import type { BlogArticle } from "./content";

/** Archive G1861, adapted around the merchant's mobile purchase experience. */
export const mobileAppArticle: BlogArticle = {
  path: "/company/blog/mobile-app-payment-gateway-integration",
  title: "Mobile app payments: the sale has to survive the handoff",
  description: "Mobile app payment integration connects checkout to a recoverable order. Consider app store rules, authentication, interrupted purchases and merchant support.",
  summary: "A customer can leave your app halfway through paying. What they find when they return says more about the integration than the Pay button ever will.",
  searchTitle: "Mobile app payment integration: keep the order intact",
  relatedPaths: ["/company/blog/optimize-your-mobile-checkout-experience", "/company/blog/payment-api-retries"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Apple: App Review Guidelines for payments and purchase methods", href: "https://developer.apple.com/app-store/review/guidelines/" },
    { label: "Google Play: Payments policy", href: "https://support.google.com/googleplay/android-developer/answer/9858738" },
    { label: "Cybersource: Unified Checkout and mobile application integration", href: "https://developer.cybersource.com/docs/cybs/en-us/sa-uc/migration/all/na/sa-uc/sa-uc-faq.html" },
    { label: "Cybersource: Transaction timeout guidance", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/fdiglobal/rest/payments/payments-intro/timeouts-intro.html" },
  ],
};
