import type { BlogArticle } from "./content";

export const woopaymentsAccountArticle: BlogArticle = {
  "path": "/company/blog/woopayments-existing-stripe-account",
  "title": "Powered by Stripe does not mean the Stripe account you already have",
  "description": "For a WooCommerce store, the account relationship behind a payment plugin affects access, support and the work involved in moving.",
  "summary": "WooPayments creates a connected Stripe Express account and cannot attach an existing standard Stripe account. Compare that relationship with the separate WooCommerce Stripe extension.",
  "searchTitle": "WooPayments or Stripe with an existing Stripe account?",
  "relatedPaths": [
    "/company/blog/cancel-processing-and-gateway",
    "/company/blog/payment-processor-switching-break-even"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "the-account-you-are-choosing",
      "title": "Choose the operating relationship deliberately"
    },
    {
      "id": "moving-is-not-installing",
      "title": "Treat a change as an account transition"
    }
  ],
  "sources": [
    {
      "label": "WooCommerce: WooPayments and its Stripe account relationship",
      "href": "https://woocommerce.com/document/woopayments/account-management/partnership-with-stripe/"
    },
    {
      "label": "WooCommerce: Connecting the Stripe extension",
      "href": "https://woocommerce.com/document/stripe/setup-and-configuration/connecting-to-stripe/"
    },
    {
      "label": "Trolleys: Payment methods and account setup",
      "href": "/services/payment-methods"
    }
  ]
};
