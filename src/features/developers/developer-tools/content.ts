import type { DocArticle } from "@/shared/ui/reading-guide/types";

export const developerToolReferences = {
  checkout: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/get-started/",
  sdks: "https://developer.cybersource.com/hello-world/rest-api-sdks.html",
  api: "https://developer.cybersource.com/api-reference-assets/index.html",
  sandbox: "https://developer.cybersource.com/hello-world.html",
  responses: "https://developer.cybersource.com/api/reference/response-codes.html",
  transactions: "https://developer.cybersource.com/docs/cybs/en-us/txn-search/developer/all/rest/txn-search.html",
} as const;

export const developerToolsArticle: DocArticle = {
  introduction: "Find documentation, SDKs, test tools and account records for your Cybersource connection. Use the sections relevant to your task.",
  prerequisites: [],
  sections: [
    { id: "integration-tools", title: "Documentation and SDKs" },
    { id: "sandbox-tools", title: "Sandbox tools" },
    { id: "account-records", title: "Payment and account records" },
    { id: "payment-requests", title: "Optional portal payment tools", aliases: ["choose-request", "create-share", "request-result", "request-follow-up"],
      paragraphs: ["Portal tools are separate from a custom website integration. Ask the account team which options are enabled and who is permitted to use them."],
    },
    { id: "support-handoff", title: "Integration support",
      paragraphs: ["Start with the integration contact in your welcome email. For access or enablement issues, identify the store and the account you were trying to use."],
      rows: [
        { title: "Where it happened", text: "Test or production, website origin, affected store and gateway account, timestamp with time zone, and browser or SDK version where relevant." },
        { title: "What happened", text: "The action, expected result, actual status or reason code, and steps that reproduce the problem. Include the order reference and original transaction ID; for a notification, include its subscription and delivery trace references." },
        { title: "What you checked", text: "Whether the original operation appears in Cybersource, whether its result was verified, and what recovery has already run. Describe any reporting delay or unresolved attempt." },
      ],
      note: { title: "Share references, not secrets", text: "Use the approved support channel. Remove card numbers, security codes, passwords, API secrets, private certificates and complete tokens from screenshots and diagnostics. Do not post customer records in a public issue or chat." },
      link: { label: "Contact integration support", href: "/company/contact#integration" },
    },
  ],
};

export const developerToolsContents = [
  { id: "integration-tools", title: "Documentation and SDKs" },
  { id: "sandbox-tools", title: "Sandbox tools" },
  { id: "account-records", title: "Account records" },
  { id: "payment-requests", title: "Portal payment tools" },
  { id: "support-handoff", title: "Integration support" },
];
