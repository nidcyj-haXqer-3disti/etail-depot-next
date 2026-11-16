import type { BlogArticle } from "./content";

/** Archive G1879, adapted around the gap between payment notification and order completion. */
export const consumingWebhooksArticle: BlogArticle = {
  path: "/company/blog/consuming-webhooks",
  title: "The payment succeeded. The order is still waiting.",
  description: "When a paid order gets stuck, trace the original payment before asking the customer to pay again. See how Trolleys account records, integration guidance and support fit together.",
  summary: "A missing order update should not become a second charge. Follow the store, payment and order references, then involve the team that can resolve the gap.",
  searchTitle: "Payment webhooks: when paid orders get stuck",
  relatedPaths: ["/company/blog/payment-capture", "/company/blog/ecommerce-shipping-efficiency"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Unified Checkout payment results and webhooks", href: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/reference/webhooks/webhooks/" },
    { label: "Adyen: Verify, store, acknowledge and process webhook events", href: "https://docs.adyen.com/development-resources/webhooks/handle-webhook-events" },
    { label: "Stripe: Duplicate events, ordering and delivery behavior", href: "https://docs.stripe.com/webhooks" },
    { label: "OWASP: Webhook verification, safe processing and recovery", href: "https://cheatsheetseries.owasp.org/cheatsheets/Webhook_Security_Cheat_Sheet.html" },
    { label: "Cybersource: Subscription retry policy", href: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-optional-intro/wh-fg-optional-retry.html" },
  ],
};
