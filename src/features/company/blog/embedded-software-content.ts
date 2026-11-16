import type { BlogArticle } from "./content";

/** Archive G1509, adapted with current device licensing and billing guidance. */
export const embeddedSoftwareArticle: BlogArticle = {
  path: "/company/blog/embedded-software-monetization",
  title: "Embedded software monetization: pricing features inside devices",
  description: "Embedded software monetization means earning revenue from software functionality associated with a physical device. A manufacturer might sell a permanent feature license, a recurring cloud service or measured usage. This is different from embedded payments, where a software platform helps its customers accept payments and may earn revenue from those payments.",
  summary: "Plan software pricing for physical devices. Compare licenses, subscriptions and usage billing, with clear rules for access, replacements and cancellation.",
  searchTitle: "Embedded software monetization: device pricing and access",
  relatedPaths: ["/company/blog/saas-payment-processing", "/company/blog/card-on-file"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "value", title: "Identify what continues to create value" },
    { id: "device-records", title: "Connect the device, customer and access rights" },
    { id: "billable-unit", title: "Specify what the bill counts" },
    { id: "lifecycle", title: "Design changes and endings before launch" },
  ],
  sources: [
    { label: "Stripe: Embedded software revenue models", href: "https://stripe.com/resources/more/embedded-software-monetization" },
    { label: "Stripe: Subscription and invoice states", href: "https://docs.stripe.com/billing/subscriptions/overview" },
    { label: "Stripe: Entitlements and application access", href: "https://docs.stripe.com/billing/entitlements" },
    { label: "Stripe: Recording usage and handling repeated or late events", href: "https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage-api" },
    { label: "Thales: License rights, enforcement, offline use and transfer", href: "https://cpl.thalesgroup.com/software-monetization/what-is-a-software-license-key" },
  ],
};
