export const documentationPages = [
  { slug: "merchant-onboarding", title: "Merchant account setup", description: "Prepare an application, complete review and confirm readiness to accept payments.", group: "Merchant operations", audience: "Business owners and platform teams", icon: "business", anchor: "getting-started" },
  { slug: "integration-access", title: "Integration access", description: "Confirm account mappings, permissions and the specifications needed for integration.", group: "Developer integration", audience: "Developers and administrators", icon: "lock", anchor: "integration-access" },
  { slug: "checkout", title: "Online checkout", description: "Follow the checkout journey, verify payments and recover interrupted attempts.", group: "Developer integration", audience: "Developers", icon: "card", anchor: "checkout-setup" },
  { slug: "payment-requests", title: "Payment requests", description: "Collect a payment through a hosted request and match the result to the sale.", group: "Merchant operations", audience: "Business owners and operations teams", icon: "link", anchor: "payment-requests" },
  { slug: "payment-status", title: "Payment status", description: "Understand authorization, capture and uncertain results before taking action.", group: "Merchant operations", audience: "Operations teams and developers", icon: "document", anchor: "payment-records" },
  { slug: "refunds-and-disputes", title: "Refunds and disputes", description: "Choose the right action, retain references and follow a case through its outcome.", group: "Merchant operations", audience: "Operations teams", icon: "shield", anchor: "refunds-and-disputes" },
  { slug: "payouts", title: "Payouts and reconciliation", description: "Match payments and adjustments to a payout, then reconcile the bank deposit.", group: "Merchant operations", audience: "Finance and operations teams", icon: "bank", anchor: "payouts" },
  { slug: "webhooks", title: "Events and webhooks", description: "Verify event deliveries, update the right records and recover missing activity.", group: "Developer integration", audience: "Developers", icon: "layers", anchor: "webhooks" },
  { slug: "testing-and-launch", title: "Sandbox and launch", description: "Arrange sandbox access, confirm payment setup and prepare for launch.", group: "Developer integration", audience: "Developers and operations teams", icon: "check", anchor: "testing-and-launch" },
] as const;

export type DocumentationSlug = typeof documentationPages[number]["slug"];
export const documentationGroups = ["Merchant operations", "Developer integration"] as const;
export const documentationPath = (slug: DocumentationSlug) => `/docs/${slug}` as const;


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
