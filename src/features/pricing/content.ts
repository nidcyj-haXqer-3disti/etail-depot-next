import { merchantAccountGuidance } from "../../shared/site/merchant-account-guidance";
import { hostedServices } from "@/shared/site/hosted-services";
import type { CommercialPage } from "@/shared/ui/page-content-types";

export const pricingContent = {
    label: "Pricing", title: "Credit Card Processing Fees and Pricing",
    description: "Review Etail’s credit card processing fees, estimate the cost of domestic online payments and check additional charges, ACH pricing and platform terms.",
    heading: "Clear pricing for card processing.",
    intro: "Review card processing rates, estimate fees and check additional charges. ACH and platform terms are confirmed separately.",
    action: { label: "Start now", href: hostedServices.payments.registrationUrl },
    secondaryAction: { label: "Discuss your processing costs", href: "/contact#payment-review" },
    note: merchantAccountGuidance.application,
    art: { title: "A complete view of payment costs", caption: "The card processing estimate is not a guaranteed bank deposit.", steps: [
      { title: "Card processing", detail: "Percentage plus a fixed fee" }, { title: "Other charges", detail: "Payment type · account activity" }, { title: "Account terms", detail: "ACH · platform · payout schedule" },
    ] },
    sections: [{ title: "ACH and platform pricing.", intro: "ACH payments and software partnerships have separate pricing and account terms.", items: [
      { title: "ACH payments", text: "Confirm your ACH pricing, payout terms, authorization requirements, return handling and other charges. Available options depend on your account." },
      { title: "Software partnerships", href: "/contact#platforms", text: "Platform pricing reflects your integration, implementation costs and support responsibilities. Access and commercial terms are confirmed before launch." },
      { title: "Payouts and account conditions", text: "Read the payout schedule and any reserve or hold conditions in your merchant agreement. A fee estimate cannot predict when a deposit will arrive or every adjustment applied to it." },
    ] }],
  } as const satisfies CommercialPage;
