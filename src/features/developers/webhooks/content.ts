import type { DocArticle } from "@/shared/ui/reading-guide/types";

export const webhookEvent = { productId: "unifiedCheckout", eventType: "uc.orders.transactionresults" } as const;

export const webhookReferences = {
  checkout: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/reference/webhooks/webhooks/",
  products: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-product-list-intro.html",
  subscription: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-subscribe-intro/wh-fg-subscription-mutual-api-intro.html",
  signature: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-key-dig-sig-intro.html",
  encryption: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-mle-intro.html",
  certificate: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-mle-intro/wh-fg-mle-register.html",
  fields: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-notification-format.html",
  retry: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-optional-intro/wh-fg-optional-retry.html",
  health: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-optional-intro/wh-fg-subscription-health-check-url.html",
  troubleshooting: "https://developer.cybersource.com/docs/cybs/en-us/webhooks/implementation/all/rest/webhooks/wh-fg-subscription-troubleshooting.html",
} as const;

export const webhooksArticle: DocArticle = {
  introduction: "Receive Cybersource checkout results on your server, even if the customer leaves the page. Verify each notification, save it and update the matching order once.",
  prerequisites: [],
  sections: [
    { id: "event-domains", title: "1. Choose the checkout notification", aliases: ["webhooks", "funding-events"] },
    { id: "webhooks-specifications", title: "2. Set up the subscription", paragraphs: ["Your developer sets this up for the store’s gateway account. Keep sandbox and production receivers, credentials, subscriptions and merchant mappings separate."] },
    { id: "event-security", title: "3. Verify and decrypt the delivery", paragraphs: ["Unified Checkout requires encrypted notifications. Use both decryption and signature verification before allowing a message to change an order."] },
    {
      id: "payment-event", aliases: ["interpret"], title: "4. Match the payment and order",
      paragraphs: ["A subscription carries many payments, and delivery may be repeated. Match the verified event to the gateway account, original order and operation. Compare amount, currency and current payment state with your server’s records."],
      table: {
        caption: "Delivery references and payment references",
        headers: ["Field", "How to use it"], codeColumn: true, breakCodeWords: true,
        rows: [
          ["organizationId", "Check the gateway organization authorized for this receiver and environment. Do not substitute the processing MID."],
          ["productId / eventType", "Accept the subscribed product and event. A field value alone is not proof that the message is authentic."],
          ["webhookId", "The Unified Checkout guide calls this a delivery identifier; the general Webhooks guide calls it a subscription identifier. Confirm its meaning for your notification format. Do not use it alone to identify duplicate payment updates."],
          ["transactionTraceId", "Identifies a delivery attempt and changes on retries. Keep it for investigation, not as the only duplicate check."],
          ["eventDate", "The event timestamp. Arrival time or a larger timestamp alone does not establish the latest payment state."],
          ["payload.id / payload.status", "Read the operation ID and result in the verified, decrypted transaction payload. Keep authorization, capture and refund records distinct."],
        ],
      },
      note: { title: "A retry is not another payment", text: "Prevent duplicate deliveries and the browser result from repeating the same business action. Identify the update by environment, gateway account, operation and permitted state change. A transaction ID alone can cover more than one legitimate update." },
    },
    {
      id: "event-handler", aliases: ["receipt"], title: "5. Save, acknowledge and process", flow: "events",
      steps: [
        { title: "Check the delivery", text: "Validate the configured security, decrypt and verify the payload, and check the event and gateway account. An invalid signature or mismatched account must not change an order." },
        { title: "Save before acknowledging", text: "Durably record the receipt and the work needed to resume processing. Use protected storage and a retention policy. Return the required acknowledgment only after that work is safely recorded, within the receiver response window." },
        { title: "Update the order once", text: "Use an atomic state change and fulfillment that can safely resume. The browser result and webhook may arrive together; both must resolve the same operation without repeating an email, shipment or financial action." },
        { title: "Keep unresolved work visible", text: "Resume saved work after a worker failure. Resolve missing order matches or conflicting results against the authoritative Cybersource record before fulfillment or another payment attempt." },
      ],
      outcome: "An acknowledgment confirms receipt. It does not mean the payment was approved, captured or deposited.",
    },
    {
      id: "recovery-cases", aliases: ["failure-example", "operations"], title: "6. Recover missed or repeated updates",
      paragraphs: ["Monitor both delivery and processing. A healthy receiver does not prove that every order has been updated, and provider retries do not replace your recovery process."],
      details: [
        { title: "The browser closes before confirmation", text: "Check the verified webhook or original Cybersource transaction. Keep the attempt unresolved until its outcome is established. Do not send another charge just because the browser did not return." },
        { title: "A delivery repeats or arrives late", text: "Keep the receipt for investigation. Skip a business action already completed for that operation, but do not discard every later update with the same transaction ID. Resolve older or conflicting states against the current payment record." },
        { title: "Receipt storage or processing fails", text: "If receipt storage fails, do not report successful receipt. Once work is safely stored and acknowledged, retry the saved processing work internally. A worker failure is not a reason to submit another payment." },
        { title: "The signature or decryption fails", text: "Check the expected organization, environment, signature key, encryption certificate and payload format. Do not bypass verification. Retain safe error references and reject the delivery according to the provider’s receiver contract." },
        { title: "Notifications stop", text: "Check subscription status, URL approval, TLS, credentials, certificate validity and any health check endpoint. Inspect the configured retry policy and reconcile missing activity against Cybersource. Do not assume every event remains available for replay." },
      ],
    },
  ],
};

export const webhooksContents = [
  { id: "event-domains", title: "The checkout event" },
  { id: "webhooks-specifications", title: "Subscription setup" },
  { id: "event-security", title: "Security checks" },
  { id: "payment-event", title: "Match the order" },
  { id: "event-handler", title: "Process once" },
  { id: "recovery-cases", title: "Recovery and testing" },
];
