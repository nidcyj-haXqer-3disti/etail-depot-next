import type { ServiceDetailContent } from "@/features/services/shared/content-types";

export const reconciliationContent = {
  kind: "reconciliation",
  label: "Reconciliation",
  title: "Payment Reconciliation for Merchant and Gateway Accounts",
  description: "Compare merchant account and payment gateway reports. Match sales totals and transaction references, understand differences and get support with payment reconciliation.",
  heading: "Confidence in your payment records.",
  intro: "Compare your merchant account reports with your payment gateway reports. Match sales, understand differences and get support when a payment needs a closer look.",
  action: {
    label: "Talk with our team",
    href: "/company/contact#payment-review",
  },
  art: {
    title: "Example merchant account and gateway account reports for October 2026 in USD. Both show 12 sales totaling $2,640.00: eight Visa sales totaling $1,860.00 and four Mastercard sales totaling $780.00. The sales total difference is $0.00.",
    caption: "Example reports for the same business and period. Matching totals are a starting point; individual payment references confirm which records belong together.",
    steps: [],
  },
  sections: [
    {
      id: "reconciliation",
      title: "Two reports. A clearer view of your sales.",
      items: [
        {
          title: "Compare your sales",
          text: "See how the sales in your merchant account line up with those in your gateway account, by amount, count and card type.",
        },
        {
          title: "Trace a payment",
          text: "Use the payment reference to connect a gateway transaction with its record in your merchant account.",
        },
        {
          title: "Get help with differences",
          text: "Our team can help investigate an unmatched payment or explain why the two reports show different results.",
        },
      ],
    },
    {
      id: "differences",
      title: "Understand why reports differ.",
      items: [
        {
          title: "Reporting periods",
          text: "Time zones, daily cutoffs and processing dates can put the same payment in different reporting periods.",
        },
        {
          title: "Payment status",
          text: "An approved payment may still be waiting for capture. Unsuccessful attempts and authorizations alone are not completed sales, and status labels can differ between accounts.",
        },
        {
          title: "Refunds and fees",
          text: "Compare sales with sales and refunds with refunds. A sales total before fees will differ from an amount after deductions.",
        },
      ],
    },
  ],
  workflow: {
    title: "From sales totals to individual payments.",
    intro: "Your merchant account and gateway account provide different views of the same payment activity.",
    steps: [
      {
        title: "Choose the same business",
        detail: "Select the corresponding merchant and gateway accounts, currency and reporting period.",
      },
      {
        title: "Compare the totals",
        detail: "Check sales amounts and counts by card type. Compare refunds separately.",
      },
      {
        title: "Match the payments",
        detail: "Use the shared transaction reference, then check the amount, currency and processing date.",
      },
      {
        title: "Resolve differences",
        detail: "Review timing and status. Ask our team about records that remain unmatched.",
      },
    ],
    note: "Available reports, reference fields and access depend on your account configuration.",
  },
} as const satisfies ServiceDetailContent;
