import type { DocArticle } from "@/shared/ui/reading-guide/types";

export const apiReferenceArticle: DocArticle = {
  introduction: "Connect a custom website to Cybersource Unified Checkout. Create a session on your server, display the hosted checkout and verify the payment before confirming the order.",
  prerequisites: [],
  sections: [
    { id: "api-credentials", title: "1. Prepare your server" },
    { id: "create-session", title: "2. Create a checkout session", paragraphs: ["Your server calculates the order total and creates a session using the matching Cybersource account and environment. Never accept a price or merchant account chosen by the browser without validating it."] },
    { id: "display-checkout", title: "3. Display the hosted checkout", paragraphs: ["Your page provides the space for checkout. Cybersource provides the payment fields. Keep card data out of your own form fields, analytics and logs."] },
    { id: "payment-status", title: "4. Verify the payment", aliases: ["find-payment", "read-status"], paragraphs: ["Send the checkout result to your server. A browser message, redirect or decoded token is not sufficient evidence to fulfill an order."] },
    { id: "refunds-and-disputes", title: "5. Manage the payment", aliases: ["choose-action"], paragraphs: ["Use the original operation ID and check its current state before taking another action. Permissions, payment method and processor rules determine which actions are available."] },
    {
      id: "uncertain-result", title: "6. Recover a missing result", aliases: ["reporting-results"],
      paragraphs: ["A timeout or closed browser can leave the payment outcome unknown. It does not mean the customer was not charged."],
      steps: [
        { title: "Keep the original attempt", text: "Retain the order, gateway account, environment, amount, currency, time and available transaction references. Block overlapping submissions for the same unresolved attempt." },
        { title: "Trace it in Cybersource", text: "Check the original transaction and related operations, or ask support to trace the merchant reference. Use verified notifications where configured. Search and reports can lag; a missing row is not proof of failure." },
        { title: "Resolve before retrying", text: "Apply the confirmed outcome once. If it remains unclear, retain the unresolved attempt instead of submitting a new charge. Follow the provider’s recovery rules for the operation; a reference code alone does not guarantee duplicate prevention." },
      ],
      note: { title: "Support details", text: "Share the environment, merchant and order references, transaction or correlation ID, time zone and error code through the approved support channel. Exclude API secrets, complete tokens, card numbers and security codes." },
      link: { label: "Set up payment notifications", href: "/developers/webhooks" },
    },
    { id: "payouts", title: "7. Match the account records", aliases: ["financial-impact", "funding-status", "payout-help", "funding-instructions", "support-reference"], paragraphs: ["Cybersource records the gateway operations. The Back Office Operations Portal provides merchant activity, funding and dispute records for your assigned MIDs. Match the correct store, reporting period and references."] },
  ],
};

export const apiReferenceContents = [
  { id: "api-credentials", title: "Server and credentials" },
  { id: "create-session", title: "Create a session" },
  { id: "display-checkout", title: "Display checkout" },
  { id: "payment-status", title: "Verify the payment" },
  { id: "refunds-and-disputes", title: "Payment actions" },
  { id: "uncertain-result", title: "Recover a result" },
  { id: "payouts", title: "Account records" },
];

// Static documentation only. Nothing here submits a request or creates a session.
export const sessionRequest = {
  targetOrigins: ["https://shop.example.com"],
  country: "US",
  locale: "en_US",
  allowedCardNetworks: ["VISA", "MASTERCARD"],
  allowedPaymentTypes: ["PANENTRY"],
  captureMandate: { billingType: "FULL", requestEmail: true },
  completeMandate: { type: "CAPTURE" },
  data: {
    clientReferenceInformation: { code: "ORDER-10482" },
    orderInformation: { amountDetails: { totalAmount: "24.00", currency: "USD" } },
  },
};

export const checkoutMarkup = `<div id="payment-buttons"></div>
<div id="payment-form"></div>`;

export const checkoutCode = `// After loading the session's returned clientLibrary
// with its clientLibraryIntegrity and crossorigin="anonymous":
let client;
let checkout;

try {
  client = await VAS.UnifiedCheckout(sessionJWT);
  checkout = await client.createCheckout();
  const resultJWT = await checkout.mount({
    paymentSelection: "#payment-buttons",
    paymentScreen: "#payment-form"
  });

  // Send resultJWT to your own server for verification.
  // Confirm the order only from the server's verified status.
} finally {
  checkout?.destroy();
  client?.destroy();
}`;

export const paymentOperations = [
  { title: "Capture an authorization", path: "/pts/v2/payments/{id}/captures", reference: "Authorization ID", text: "Submit an approved authorization for capture. Check the remaining amount and any earlier capture first." },
  { title: "Reverse an authorization", path: "/pts/v2/payments/{id}/reversals", reference: "Authorization ID", text: "Request release of an eligible authorization hold. A reversal is different from refunding a captured payment." },
  { title: "Refund a capture", path: "/pts/v2/captures/{id}/refunds", reference: "Capture ID", text: "Request a linked refund within the remaining refundable amount." },
  { title: "Refund a sale", path: "/pts/v2/payments/{id}/refunds", reference: "Sale payment ID", text: "Use the sale reference when authorization and capture were submitted together." },
  { title: "Void a capture", path: "/pts/v2/captures/{id}/voids", reference: "Capture ID", text: "Cancel an eligible capture before processing advances. Voiding a capture does not necessarily release its authorization hold." },
];

export const cybsReferences = {
  authentication: "https://developer.cybersource.com/docs/cybs/en-us/platform/developer/all/rest/rest-getting-started/restgs-jwt-shared-secret-intro.html",
  encryption: "https://developer.cybersource.com/docs/cybs/en-us/platform/developer/all/rest/rest-getting-started/restgs-jwt-shared-secret-intro/restgs-mle-shared-secret-intro.html",
  sessions: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/integration-guide/session/session/",
  javascript: "https://developer.cybersource.com/docs/cybs/en-us/unified-checkout/developer/all/rest/unified-checkout/uc-appendix-js-reference-v1.html",
  versioning: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/upgrading/versioning/versioning/",
  verification: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/integration-guide/transient-tokens/token-verification/",
  start: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/get-started/",
  endpoints: "https://developer.cybersource.com/docs/cybs/en-us/endpoints/reference/all/na/endpoints/endpoints.html",
  payments: "https://developer.cybersource.com/api-reference-assets/index.html#payments",
} as const;
