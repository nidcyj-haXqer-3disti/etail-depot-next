import type { CommercialPage } from "@/shared/ui/page-content-types";

export const paymentModelsContent = {
    label: "Platform payment models", title: "Payment Models for Software Platforms and Marketplaces",
    description: "Compare merchant account relationships for software platforms and marketplaces, including checkout, reporting and payment support.",
    heading: "Match the account to the selling business.",
    intro: "Connect each sale to the right business, merchant account and payment records. Start with who sells and who receives payment.",
    action: { label: "Discuss your platform", href: "/contact#platforms" },
    note: "Account structure, supported payment flows and commercial terms are agreed for each partnership.",
    art: { layout: "platform", title: "Your software and the merchant account.", caption: "A software connection does not by itself authorize the platform to hold, split or distribute customer funds.", steps: [
      { title: "The selling business", detail: "Customer agreement and merchant account" },
      { title: "Merchant services", detail: "Payment acceptance and account operations" },
      { title: "Your software", detail: "Purchase context and connected records" },
    ] },
    sections: [
      { title: "Who is the customer paying?", intro: "Start with the seller named in the purchase and the business receiving payment. A platform can have different roles for its own software fees and its merchants’ sales.", items: [
        { title: "You sell your own software or service", text: "Your business is selling directly to the customer. Review a merchant account for those sales, with your own customer terms, refund process and payment records. This does not automatically cover sales made by your users." },
        { title: "Merchants sell through your software", text: "Each business receiving payment needs a merchant account and an approved payment setup. Your software connects the purchase to that business, with access limited to the account permissions provided for your integration." },
        { title: "Your marketplace connects buyers and sellers", text: "Identify the seller for each purchase, the customer’s agreement and the intended movement of funds. Multiple sellers, commissions, split payments and holding funds need a separately approved structure; they are not assumed features of a checkout integration." },
      ] },
      { title: "Merchant accounts, support and reporting.", items: [
        { title: "Merchant onboarding and ownership", text: "Each merchant applies for its account and accepts the merchant agreement. Your platform’s access to account information and payment actions depends on the permissions approved for your integration." },
        { title: "Customer experience and support", text: "Customers should know which business they are paying and where to ask for help. Connect checkout to the purchase, and make it clear which team handles order questions, refunds and disputes." },
        { title: "Reporting and commercial terms", href: "/payment-partnerships", text: "Keep merchant, order and payment references together in your reports. Your agreement sets out processing charges, any platform fees and responsibility for adjustments. Revenue sharing, funds control and data portability require their own terms." },
      ] },
    ],
  } as const satisfies CommercialPage;
