import type { CommercialPage } from "@/shared/ui/page-content-types";

export const partnershipsContent = {
    label: "Payment partnerships", title: "Payment Partnerships for Software Platforms",
    description: "Merchant services partnerships for software platforms, with account setup, credit card processing, checkout integration and payment reporting.",
    heading: "Merchant services for your platform.",
    intro: "Connect merchant accounts, checkout and reporting to your software, including options for businesses your current provider cannot support.",
    action: { label: "Discuss your partnership", href: "/contact#platforms" },
    art: { title: "Your platform. Our merchant services.", caption: "Merchant accounts, integration access and commercial terms are approved for each partnership.", steps: [
      { title: "Your software", detail: "Orders · invoices · customer experience" }, { title: "Etail Depot", detail: "Merchant services · payment operations" }, { title: "Your merchants", detail: "Account setup · checkout · support" },
    ] },
    sections: [
      { title: "Merchant accounts, pricing and support.", items: [
        { title: "Merchant accounts", text: "Each merchant applies and is reviewed on its own business activity before accepting payments. A platform partnership does not automatically approve your customers." },
        { title: "Operations and support", text: "Get help with account access, payment status, refunds and payouts. Your agreement defines who handles merchant support, software questions and purchase issues." },
        { title: "Partnership pricing", text: "Payment methods, transaction activity and integration needs shape your pricing. Processing, platform and implementation charges are confirmed in the partnership agreement." },
      ] },
      { title: "Connect the purchase to the payment record.", items: [
        { title: "Checkout integration", text: "Connect purchases to the checkout enabled for each merchant. Our integration team supplies the documentation, permissions and configuration details." },
        { title: "Payment records and updates", text: "Follow payments, refunds, disputes and payouts using merchant and order references. Available records and delivery methods depend on your integration." },
        { title: "Merchant activation", text: "Merchants can accept payments after approval and setup. Our team helps your developers verify checkout, reporting and support before activation." },
      ] },
    ],
  } as const satisfies CommercialPage;
