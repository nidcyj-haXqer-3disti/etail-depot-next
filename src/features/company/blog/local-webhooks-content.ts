import type { BlogArticle } from "./content";

/** Archive G1887, adapted around evidence from local payment notification tests. */
export const localWebhooksArticle: BlogArticle = {
  path: "/company/blog/testing-webhooks-on-localhost",
  title: "The webhook arrived. Did the order move?",
  description: "A developer can receive a payment notification on a laptop while the order still goes nowhere. Local webhook testing should show what the business can safely do with the result.",
  summary: "Separate a simulated message, a genuine gateway delivery and a completed order update. Each tells a merchant something different about readiness to accept payments.",
  searchTitle: "Testing payment webhooks on localhost: beyond delivery",
  relatedPaths: ["/company/blog/consuming-webhooks", "/company/blog/payment-gateway-testing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Unified Checkout webhooks", href: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/reference/webhooks/webhooks/" },
    { label: "Cybersource: Receiver security", href: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-server-security.html" },
    { label: "Cybersource: Webhook URL review and approval", href: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-subscribe-intro/wh-fg-url-validation.html" },
    { label: "Cybersource: Notification retry policy", href: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-optional-intro/wh-fg-optional-retry.html" },
    { label: "ngrok: Public endpoints for local services", href: "https://ngrok.com/docs/gateway/endpoints/http" },
    { label: "ngrok: Request inspection and replay", href: "https://ngrok.com/docs/obs/traffic-inspection/http-requests" },
  ],
};
