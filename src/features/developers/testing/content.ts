import type { DocArticle } from "@/shared/ui/reading-guide/types";

export const testingReferences = {
  setup: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/test-your-setup/",
  cards: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/testing/test-cards/test-cards/",
  processors: "https://developer.cybersource.com/hello-world/testing-guide.html",
  wallets: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/configuration/payment-methods/digital-wallets/",
  apple: "https://developer.apple.com/apple-pay/sandbox-testing/",
} as const;

export const testingArticle: DocArticle = {
  introduction: "Confirm that checkout, payment results and recovery work before accepting live payments. Test in the sandbox first, then agree the live checks with your account team.",
  prerequisites: [],
  sections: [
    { id: "testing-and-launch-specifications", title: "1. Confirm your test setup", aliases: ["testing-and-launch"] },
    {
      id: "test-environment", title: "2. Prepare the store",
      rows: [
        { title: "Server", text: "Use the intended test account and credentials. Calculate the order amount and currency on the server, enforce merchant access and verify payment results before changing an order." },
        { title: "Browser", text: "Use an HTTPS origin allowed by the session. Load the SDK URL and integrity value returned with that session. Check that checkout fits the page, handles cancellation and removes its frames when the flow ends." },
        { title: "Notifications", text: "If you use Webhooks, prepare the separate test subscription, signature key and encryption certificate. Confirm verified delivery, durable receipt and recovery before relying on notifications." },
      ],
      link: { label: "Review the server and browser connection", href: "/developers/api-reference" },
    },
    {
      id: "acceptance-tests", title: "3. Test checkout and recovery",
      paragraphs: ["Run these checks on desktop and mobile. Keep the expected outcome, observed result and payment reference for each case. Test only the methods and operations enabled for your account."],
      rows: [
        { title: "Approved payment", text: "One order matches the verified gateway account, amount, currency and operation. An authorization and a capture remain distinct. HTTP success or a returned token alone does not prove payment approval." },
        { title: "Declined payment", text: "The order stays unpaid, the customer sees a useful message and no fulfillment starts. Use the processor’s documented decline scenario; a malformed request tests validation, not an issuer decline." },
        { title: "Authentication", text: "Where 3D Secure is enabled, test the prescribed successful, challenged, failed and canceled paths. Authentication success alone is not payment authorization." },
      ],
      details: [
        { title: "Cancellation, lost connection and repeated submission", text: "Close checkout, navigate away, refresh and repeat the submit action in controlled tests. Check concurrent tabs too. A confirmed cancellation must remain distinct from a payment whose response was lost. Resolve the original attempt before another charge; neither the browser nor a duplicate notification should repeat fulfillment." },
        { title: "Expired sessions, altered input and account access", text: "Test an expired or altered session and an origin that is not allowed. Confirm that changing an amount or merchant identifier in the browser cannot override the server’s order or access another account. A replacement session must not start a second payment while the original outcome is unknown." },
        { title: "Notifications and interrupted processing", text: "Test invalid signatures, decryption failures, the wrong account, repeated and delayed deliveries, an unavailable receiver and a worker that stops after receipt. Invalid messages must not change orders. Stored work must resume safely, and older events must not overwrite a confirmed result." },
        { title: "Capture, reversal and refund", text: "Test only operations permitted for the original payment and its current state. Match each result to its own operation reference. Check the remaining refundable amount, duplicate requests and lost responses. A successful refund request does not prove that the customer’s bank has posted the credit." },
      ],
      link: { label: "Check notification handling", href: "/developers/webhooks#event-handler" },
    },
    {
      id: "customer-journey", title: "4. Check the account records",
      steps: [
        { title: "Find the gateway result", text: "Locate the original operation in the correct Cybersource test account. Match your order reference, amount, currency and status. Keep related capture, reversal and refund references together. An empty search result is not proof of a decline; reports can lag." },
        { title: "Compare the merchant records when available", text: "Use the matching MID and DBA in Back Office. Check the reporting time zone, batch period and adjustments. A gateway sandbox transaction may not appear in the live merchant portal. Confirm which reporting checks your test setup supports with the account team." },
        { title: "Resolve differences before launch", text: "Investigate an unmatched payment or unexpected result. Record the explanation or a repeatable correction, then rerun the affected scenario. Do not mark a test complete because the customer saw a success screen." },
      ],
      note: { title: "Sandbox testing does not move money", text: "Sandbox results do not confirm settlement, a refund to a real card or a bank deposit. Validate production reporting and any actual bank receipt separately during the agreed live checks." },
      link: { label: "Find the right records and tools", href: "/developers/developer-tools#account-records" },
    },
    {
      id: "production-readiness", title: "5. Prepare the live switch", aliases: ["technical-review"],
      paragraphs: ["Account approval and passing sandbox tests are separate requirements. Complete any review or certification required for your account and connection before processing live payments."],
      steps: [
        { title: "Confirm production settings", text: "Check the approved store, processing MID, gateway account, live credentials, allowed origins, capture policy, fraud and cardholder authentication settings, and enabled methods. Configure production notifications and verify each Apple Pay domain where you will offer it. Test configuration is not copied automatically." },
        { title: "Agree the live checks", text: "Confirm who may make a real payment, the permitted amount and currency, any capture or refund actions, and the stopping conditions. Use an authorized real payment method. Sandbox test cards must never be used for live transactions." },
        { title: "Verify and hand over", text: "Match the actual payment and any follow-up operation to the gateway and merchant records. Check bank receipt separately if it is part of the agreed validation. Record the result, unresolved issues and the person authorizing launch." },
      ],
      note: { title: "If a live check fails", text: "Pause new attempts for the affected connection. Preserve pending operations and continue investigating them. A software rollback does not reverse a payment already accepted." },
    },
    {
      id: "ongoing-support", title: "6. Monitor after launch",
      paragraphs: ["Assign someone to monitor unresolved payments, notification failures, delayed records and reconciliation differences. Include credential and certificate renewal in the handoff.", "Retest the affected flow when you change a payment method, SDK, website origin or processing setting. Keep the configuration, test results, launch decision and support contacts together."],
      link: { label: "Prepare an integration support request", href: "/developers/developer-tools#support-handoff" },
    },
  ],
};

export const testingContents = [
  { id: "testing-and-launch-specifications", title: "Test setup" },
  { id: "test-environment", title: "Prepare the store" },
  { id: "acceptance-tests", title: "Checkout and recovery" },
  { id: "customer-journey", title: "Check the records" },
  { id: "production-readiness", title: "Live checks" },
  { id: "ongoing-support", title: "After launch" },
];
