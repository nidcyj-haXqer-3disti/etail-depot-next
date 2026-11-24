import type { GuidanceSource } from "@/shared/site/guidance-source";
import type { DocArticle } from "@/shared/ui/reading-guide/types";

// Etail's approved-account handoff, supplied by the operator on 14 November 2026.
// These public entry URLs contain no account identifiers or forwarded input.
export const merchantPortals = {
  backoffice: "https://backoffice.infinicept.com/etaildepot/login",
  gateway: "https://ebc2.cybersource.com/ebc2/",
} as const;

export const accountDetails = [
  { title: "Store name or DBA", text: "The trading name for this store. Match it to the website you are connecting." },
  { title: "Merchant ID (MID)", text: "The processing account assigned to this store. Another DBA may have a different MID under the same company." },
  { title: "Organization ID + User ID", text: "The Cybersource sign in details paired with that store in your welcome email. Your User ID may be labeled User Name." },
  { title: "API credentials", text: "Created separately in the correct gateway account when your integration needs them. A portal password is not an API key." },
] as const;

export const connectionOptions = [
  { title: "Shopify", owner: "Merchant", text: "Connect the approved payment app to your store.", label: "Shopify integration", href: "/resources/shopify-gateway-integration", icon: "business" },
  { title: "WooCommerce", owner: "Merchant or web team", text: "Install and configure the payment plugin for your store.", label: "WooCommerce integration", href: "/resources/woocommerce-gateway-integration", icon: "box" },
  { title: "Custom website", owner: "Developer", text: "Connect Cybersource Unified Checkout. Your website needs a secure server to create checkout sessions and verify payment results.", label: "Custom website API reference", href: "/developers/api-reference", icon: "link" },
  { title: "Manual payment", owner: "Authorized merchant user", text: "Use Virtual Terminal in the store’s Business Center if it is enabled for your account. No website integration is needed.", label: "Open Business Center", href: merchantPortals.gateway, icon: "card" },
] as const;

export const gettingStartedArticle: DocArticle = {
  introduction: "Your merchant account is approved. Use your welcome email to open the right accounts, connect your store and prepare to accept payments.",
  prerequisites: [],
  sections: [
    {
      id: "integration-access",
      title: "1. Check your account details",
      paragraphs: ["Start with the welcome email from the Etail Depot Merchant Implementation Team. Keep the store name, MID and gateway login details together."],
      aliases: ["developer-integration", "integration-access-specifications", "account-mapping", "related-guides", "topics", "merchant-operations", "getting-started", "payment-requests", "payment-records", "refunds-and-disputes", "payouts", "webhooks", "testing-and-launch"],
    },
    {
      id: "portal-access",
      title: "2. Open both portals",
      paragraphs: ["You will use one portal to follow your merchant accounts and another to manage each store’s payment gateway."],
      aliases: ["connection-map", "verify-access"],
    },
    {
      id: "checkout",
      title: "3. Choose your connection",
      paragraphs: ["Follow the option that matches how you take payments. Shopify and WooCommerce have their own setup guides."],
      aliases: ["checkout-setup", "checkout-specifications", "checkout-flow", "server-setup"],
    },
    {
      id: "payment-methods",
      title: "4. Confirm your payment methods",
      paragraphs: ["Check the methods enabled for your chosen connection. For custom websites, open Payment Configuration → Unified Checkout in the correct store’s Business Center."],
      aliases: ["customer-interface"],
    },
    {
      id: "complete-payment",
      title: "5. Prepare for your first payment",
      paragraphs: ["Account approval comes before connection testing. Confirm your payment setup is ready before taking customer payments."],
      aliases: ["implementation-handoff", "credentials", "completion-policy", "checkout-recovery", "checkout-validation"],
    },
  ],
};

export const gettingStartedContents = [
  { id: "integration-access", title: "Account details" },
  { id: "portal-access", title: "Portal access" },
  { id: "checkout", title: "Your connection" },
  { id: "payment-methods", title: "Payment methods" },
  { id: "complete-payment", title: "Before launch" },
];

/** Review dependencies, not a second copy of the guide. Consumed only by engineering tools. */
export const accountAccessSource = {
  "id": "account-access",
  "title": "Account access after approval",
  "sourceFiles": [
    "src/features/developers/getting-started/content.ts",
    "src/features/developers/getting-started/page-content.tsx",
    "src/features/resources/merchant-account-setup/application-guide-steps.tsx"
  ],
  "guides": [
    "/developers/getting-started#integration-access",
    "/developers/getting-started#portal-access",
    "/resources/merchant-account-setup#application-submitted"
  ],
  "reviewWith": [
    {
      "file": "src/features/resources/help/page-content.tsx",
      "guides": [
        "/resources/help#access",
        "/resources/help#checkout"
      ]
    },
    {
      "file": "src/features/company/blog/merchant-id-page.tsx",
      "guides": [
        "/company/blog/merchant-id"
      ]
    },
    {
      "file": "src/features/resources/integrations/shopify/shopify-content.ts",
      "guides": [
        "/resources/shopify-gateway-integration#check-your-email"
      ]
    },
    {
      "file": "src/features/resources/integrations/shopify/shopify-credentials-email-art.tsx",
      "guides": [
        "/resources/shopify-gateway-integration#check-your-email",
        "/resources/woocommerce-gateway-integration#check-your-email"
      ]
    },
    {
      "file": "src/features/resources/integrations/woocommerce/woocommerce-content.ts",
      "guides": [
        "/resources/woocommerce-gateway-integration#check-your-email"
      ]
    }
  ]
} as const satisfies GuidanceSource;
