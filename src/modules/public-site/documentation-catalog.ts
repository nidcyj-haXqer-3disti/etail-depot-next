export const documentationPages = [
  { slug: "merchant-onboarding", title: "Merchant account setup", description: "Prepare the business information, follow the account review and confirm what is needed before accepting payments.", group: "Merchant operations", audience: "Business owners and platform teams", icon: "business", anchor: "getting-started" },
  { slug: "integration-access", title: "Integration access", description: "Confirm the merchant accounts, permissions and connection specifications for your setup.", group: "Developer integration", audience: "Developers and administrators", icon: "lock", anchor: "integration-access" },
  { slug: "checkout", title: "Online checkout", description: "Connect the customer’s order to checkout, verify the payment result and recover an interrupted attempt.", group: "Developer integration", audience: "Developers", icon: "card", anchor: "checkout-setup" },
  { slug: "payment-requests", title: "Payment requests", description: "Create a hosted payment request, share it with the customer and match the result to the sale.", group: "Merchant operations", audience: "Business owners and operations teams", icon: "link", anchor: "payment-requests" },
  { slug: "payment-status", title: "Payment status", description: "Check authorization, capture and uncertain results before fulfilling an order or starting another payment.", group: "Merchant operations", audience: "Operations teams and developers", icon: "document", anchor: "payment-records" },
  { slug: "refunds-and-disputes", title: "Refunds and disputes", description: "Start with the original payment, choose the appropriate action and follow the refund or dispute to its outcome.", group: "Merchant operations", audience: "Operations teams", icon: "shield", anchor: "refunds-and-disputes" },
  { slug: "payouts", title: "Payouts and reconciliation", description: "Match payments, fees and adjustments to the payout report, then confirm the deposit on your bank statement.", group: "Merchant operations", audience: "Finance and operations teams", icon: "bank", anchor: "payouts" },
  { slug: "webhooks", title: "Events and webhooks", description: "Confirm how payment updates reach your software and how to handle repeated, missing or delayed notifications.", group: "Developer integration", audience: "Developers", icon: "layers", anchor: "webhooks" },
  { slug: "testing-and-launch", title: "Sandbox and launch", description: "Arrange the access and configuration checks needed before production is enabled.", group: "Developer integration", audience: "Developers and operations teams", icon: "check", anchor: "testing-and-launch" },
] as const;

export type DocumentationSlug = typeof documentationPages[number]["slug"];
export type DocumentationPath = `/docs/${DocumentationSlug}`;
export const documentationGroups = ["Merchant operations", "Developer integration"] as const;
export const documentationPath = (slug: DocumentationSlug) => `/docs/${slug}` as const;

export const documentationMetadata = Object.fromEntries(documentationPages.map(page => [
  documentationPath(page.slug), { title: `${page.title} documentation`, description: page.description },
])) as Record<DocumentationPath, { title: string; description: string }>;

/** One contextual service connection per task, without repeated sales or support panels. */
export const documentationServiceLinks = {
  "merchant-onboarding": { label: "Merchant onboarding", href: "/merchant-onboarding" },
  "payment-requests": { label: "Payment requests for online businesses", href: "/online-businesses#payment-channels" },
  "payment-status": { label: "Merchant payment operations", href: "/payment-acceptance-service#payment-operations" },
  "refunds-and-disputes": { label: "Refund and dispute management", href: "/refunds-and-disputes" },
  "payouts": { label: "Payouts and reconciliation", href: "/payouts-and-reconciliation" },
  "integration-access": { label: "Software platform integration", href: "/software-partners#integration" },
  "checkout": { label: "Cards, wallets and ACH", href: "/payment-methods" },
  "webhooks": { label: "Software platform integration", href: "/software-partners#integration" },
  "testing-and-launch": { label: "Software platform integration", href: "/software-partners#integration" },
} as const satisfies Record<DocumentationSlug, { label: string; href: string }>;


type DocumentationTask = {
  title: string;
  description?: string;
  anchor?: string;
  links: readonly {
    slug: DocumentationSlug;
    label: string;
    section?: string;
    anchor?: string;
  }[];
};

/** Task entrances reuse existing articles and their section bookmarks. */
export const documentationPaths: readonly {
  id: string;
  title: typeof documentationGroups[number];
  description: string;
  icon: "business" | "layers";
  tasks: readonly DocumentationTask[];
}[] = [
  {
    id: "merchant-operations",
    title: "Merchant operations",
    description: "Manage your account, payments and bank deposits.",
    icon: "business",
    tasks: [
      { title: "Set up an account", description: "Prepare business information and follow the account review.", anchor: "getting-started", links: [{ slug: "merchant-onboarding", label: "Set up an account" }] },
      { title: "Create a payment request", description: "Share a request and match each payment to its purchase.", anchor: "payment-requests", links: [{ slug: "payment-requests", label: "Create a payment request" }] },
      { title: "Check payments and refunds", anchor: "payment-records", links: [{ slug: "payment-status", label: "Payment status" }, { slug: "refunds-and-disputes", label: "Refunds", section: "refund-payment", anchor: "refunds-and-disputes" }] },
      { title: "Review disputes and payouts", links: [{ slug: "refunds-and-disputes", label: "Disputes", section: "dispute-case" }, { slug: "payouts", label: "Payouts", anchor: "payouts" }] },
    ],
  },
  {
    id: "developer-integration",
    title: "Developer integration",
    description: "Connect your application and prepare it for launch.",
    icon: "layers",
    tasks: [
      { title: "Configure integration access", description: "Map merchant accounts, permissions and connection requirements.", anchor: "integration-access", links: [{ slug: "integration-access", label: "Configure integration access" }] },
      { title: "Integrate checkout", description: "Connect an order to checkout and verify the result.", anchor: "checkout-setup", links: [{ slug: "checkout", label: "Integrate checkout" }] },
      { title: "Receive payment events", description: "Verify notifications and handle repeated or missing updates.", anchor: "webhooks", links: [{ slug: "webhooks", label: "Receive payment events" }] },
      { title: "Sandbox and launch", description: "Confirm the payment journey before enabling production.", anchor: "testing-and-launch", links: [{ slug: "testing-and-launch", label: "Sandbox and launch" }] },
    ],
  },
];
